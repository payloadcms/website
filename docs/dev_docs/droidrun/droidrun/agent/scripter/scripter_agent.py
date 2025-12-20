"""
ScripterAgent - ReAct agent for executing Python scripts (off-device operations).

Works like CodeAct but:
- No device tools (no click, type, swipe, etc.)
- When done, returns message without code (not a function call)
- Variables persist across iterations (Jupyter notebook style)
"""

import asyncio
import logging
from typing import TYPE_CHECKING

from llama_index.core.llms.llm import LLM
from llama_index.core.workflow import Context, StartEvent, StopEvent, Workflow, step

from droidrun.agent.scripter.events import (
    ScripterEndEvent,
    ScripterExecutionEvent,
    ScripterExecutionResultEvent,
    ScripterInputEvent,
    ScripterThinkingEvent,
)
from droidrun.agent.usage import get_usage_from_response
from droidrun.agent.utils import chat_utils
from droidrun.agent.utils.executer import ExecuterState, SimpleCodeExecutor
from droidrun.agent.utils.inference import acall_with_retries
from droidrun.config_manager.config_manager import AgentConfig
from droidrun.config_manager.prompt_loader import PromptLoader

if TYPE_CHECKING:
    from droidrun.agent.droid import DroidAgentState

logger = logging.getLogger("droidrun")


class ScripterAgent(Workflow):
    """
    ReAct agent for executing Python scripts (off-device operations).

    Like CodeAct but for off-device operations:
    - No device tools
    - Variables persist across code executions (Jupyter style)
    - Signals completion by returning message without code block
    """

    def __init__(
        self,
        llm: LLM,
        agent_config: AgentConfig,
        shared_state: "DroidAgentState",
        task: str,
        safe_execution_config=None,
        **kwargs,
    ):
        super().__init__(**kwargs)

        self.llm = llm
        self.agent_config = agent_config
        self.config = agent_config.scripter
        self.max_steps = self.config.max_steps
        self.shared_state = shared_state
        self.task = task

        self.message_history = []
        self.step_counter = 0

        # Build tool list (Python libraries only)
        self.tool_list = {}

        # Add standard library imports
        try:
            import requests

            self.tool_list["requests"] = requests
        except ImportError:
            logger.warning("requests library not available")

        try:
            import json

            self.tool_list["json"] = json
        except ImportError:
            pass

        # Get safety settings
        safe_mode = self.config.safe_execution
        safe_config = safe_execution_config

        # Initialize SimpleCodeExecutor with state preservation
        self.executor = SimpleCodeExecutor(
            locals={},
            tools=self.tool_list,
            globals={"__builtins__": __builtins__},
            use_same_scope=True,  # Preserve variables across calls
            safe_mode=safe_mode,
            allowed_modules=(
                safe_config.get_allowed_modules() if safe_config and safe_mode else None
            ),
            blocked_modules=(
                safe_config.get_blocked_modules() if safe_config and safe_mode else None
            ),
            allowed_builtins=(
                safe_config.get_allowed_builtins()
                if safe_config and safe_mode
                else None
            ),
            blocked_builtins=(
                safe_config.get_blocked_builtins()
                if safe_config and safe_mode
                else None
            ),
            event_loop=None,
        )

        logger.info("✅ ScripterAgent initialized successfully.")

    def _get_library_descriptions(self) -> str:
        """Build description of available libraries."""
        libraries = [
            "- requests: HTTP library for making web requests",
            "- json: JSON parsing and generation",
            "- urllib: URL handling and parsing",
            "- re: Regular expressions",
            "- datetime, time: Time and date operations",
            "- pathlib: File path operations",
            "- base64: Encoding/decoding",
        ]
        return "\n".join(libraries)

    @step
    async def prepare_chat(self, ctx: Context, ev: StartEvent) -> ScripterInputEvent:
        """Initialize chat history with task."""
        logger.info("💬 Preparing script chat...")

        # Load system prompt
        system_prompt_text = await PromptLoader.load_prompt(
            self.agent_config.get_scripter_system_prompt_path(),
            {
                "task": self.task,
                "max_steps": self.max_steps,
                "available_libraries": self._get_library_descriptions(),
            },
        )

        # Build initial message history (JSON format like ManagerAgent)
        self.message_history = [
            {"role": "system", "content": [{"text": system_prompt_text}]},
            {
                "role": "user",
                "content": [
                    {
                        "text": f"Task: {self.task}\n\nProvide your thought process and code to complete this task."
                    }
                ],
            },
        ]

        return ScripterInputEvent(input=self.message_history)

    @step
    async def handle_llm_input(
        self, ctx: Context, ev: ScripterInputEvent
    ) -> ScripterThinkingEvent | ScripterEndEvent:
        """Call LLM to generate thought + code."""

        # Check max steps
        if self.step_counter >= self.max_steps:
            logger.warning(f"⚠️ Max steps ({self.max_steps}) reached without completion")
            return ScripterEndEvent(
                message=f"Max steps ({self.max_steps}) reached without completion",
                success=False,
                code_executions=self.step_counter,
            )

        self.step_counter += 1
        logger.info(f"🐍 Script Step {self.step_counter}/{self.max_steps}: Thinking...")

        ctx.write_event_to_stream(ev)

        # Convert to ChatMessages for LLM call
        chat_messages = chat_utils.convert_messages_to_chatmessages(
            self.message_history
        )

        try:
            response = await acall_with_retries(self.llm, chat_messages)
        except Exception as e:
            logger.error(f"LLM call failed: {e}")
            return ScripterEndEvent(
                message=f"LLM call failed: {e}",
                success=False,
                code_executions=self.step_counter,
            )

        # Extract usage from response
        try:
            usage = get_usage_from_response(self.llm.class_name(), response)
        except Exception as e:
            logger.warning(f"Could not get llm usage from response: {e}")
            usage = None

        # Add assistant response to history
        full_response = response.message.content
        self.message_history.append(
            {"role": "assistant", "content": [{"text": full_response}]}
        )

        # Extract code and thoughts
        code, thoughts = chat_utils.extract_code_and_thought(full_response)

        event = ScripterThinkingEvent(
            thoughts=thoughts, code=code, full_response=full_response, usage=usage
        )
        ctx.write_event_to_stream(event)
        return event

    @step
    async def handle_llm_output(
        self, ctx: Context, ev: ScripterThinkingEvent
    ) -> ScripterExecutionEvent | ScripterEndEvent:
        """Route to execution or treat as final response if no code."""

        if not ev.thoughts:
            logger.warning("🤔 LLM provided code without thoughts")
        else:
            logger.info(f"🤔 Reasoning: {ev.thoughts}")

        if ev.code:
            return ScripterExecutionEvent(code=ev.code)
        else:
            # No code provided - treat entire response as final answer
            logger.info("📝 No code provided, treating response as final answer")

            # Use thoughts if available, otherwise use full response
            response_message = (
                ev.thoughts.strip() if ev.thoughts.strip() else ev.full_response.strip()
            )

            if not response_message:
                response_message = "No response provided by LLM"

            logger.info(
                f"✅ Script completed with response: {response_message[:100]}..."
            )
            return ScripterEndEvent(
                message=response_message,
                success=True,
                code_executions=self.step_counter,
            )

    @step
    async def execute_code(
        self, ctx: Context, ev: ScripterExecutionEvent
    ) -> ScripterExecutionResultEvent | ScripterEndEvent:
        """Execute Python code with state preservation."""

        code = ev.code
        logger.info("⚡ Executing script...")
        logger.debug(f"Code:\n```python\n{code}\n```")

        try:
            # Execute with timeout from config
            result = await self.executor.execute(
                ExecuterState(ui_state=None),
                code,
                timeout=self.config.execution_timeout,
            )

            logger.info(f"💡 Execution result: {result}")

            # Continue loop (completion detected in handle_llm_output)
            event = ScripterExecutionResultEvent(output=str(result))
            ctx.write_event_to_stream(event)
            return event

        except Exception as e:
            logger.error(f"💥 Execution failed: {e}")
            error_message = f"Error: {e}"
            event = ScripterExecutionResultEvent(output=error_message)
            ctx.write_event_to_stream(event)
            return event

    @step
    async def handle_execution_result(
        self, ctx: Context, ev: ScripterExecutionResultEvent
    ) -> ScripterInputEvent:
        """Add execution result to chat and loop back."""

        output = ev.output or "Code executed with no output."

        logger.debug(
            f"📊 Execution output: {output[:100]}..."
            if len(output) > 100
            else f"📊 Execution output: {output}"
        )

        # Add observation to chat history
        self.message_history.append(
            {
                "role": "user",
                "content": [{"text": f"Execution Result:\n```\n{output}\n```"}],
            }
        )

        return ScripterInputEvent(input=self.message_history)

    @step
    async def finalize(self, ctx: Context, ev: ScripterEndEvent) -> StopEvent:
        """Return result to DroidAgent."""

        logger.debug("✅ Script agent complete")
        ctx.write_event_to_stream(ev)

        result = {
            "message": ev.message,
            "success": ev.success,
            "code_executions": ev.code_executions,
            "task": self.task,
        }

        return StopEvent(result)
