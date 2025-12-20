"""
Events for the ExecutorAgent workflow.

These are INTERNAL events used within ExecutorAgent for:
- Streaming to frontend/logging
- Carrying full debug metadata (thought process, raw action JSON)

For workflow coordination with DroidAgent, see droid/events.py
"""

from typing import Dict, Optional

from llama_index.core.workflow.events import Event

from droidrun.agent.usage import UsageResult


class ExecutorContextEvent(Event):
    """Executor context prepared, ready for LLM call"""

    messages: list  # ChatMessage list for LLM
    subgoal: str  # Current subgoal being executed


class ExecutorResponseEvent(Event):
    """
    Executor has received LLM response, ready for parsing.

    This event carries the raw LLM output before parsing.
    """

    response_text: str
    usage: Optional[UsageResult] = None


class ExecutorActionEvent(Event):
    """
    Executor action selection event with thought process.

    This event is streamed to frontend/logging but NOT used for
    workflow coordination between ExecutorAgent and DroidAgent.

    For workflow coordination, see ExecutorInputEvent in droid/events.py
    """

    action_json: str  # Raw JSON string of the action
    thought: str  # Debugging metadata: LLM's reasoning process
    description: str  # Human-readable action description
    full_response: str = ""  # Full LLM response for development


class ExecutorActionResultEvent(Event):
    """
    Executor action result event with full debug information.

    This event is streamed to frontend/logging but NOT used for
    workflow coordination between ExecutorAgent and DroidAgent.

    For workflow coordination, see ExecutorResultEvent in droid/events.py
    """

    action: Dict
    outcome: bool
    error: str
    summary: str
    thought: str = ""  # Debugging metadata: LLM's thought process
    action_json: str = ""  # Debugging metadata: Raw action JSON
    full_response: str = ""  # Full LLM response for development
