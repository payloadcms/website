'''CodeAct-style agent for text manipulation via constrained Python execution.

This agent receives two inputs:
- current_text: the current content of the focused text box
- task_instruction: a natural language instruction describing how to modify the text

It asks an LLM to produce Python code that:
- Uses ONLY a single provided function: input_text(text: str)
- Constructs the final text to type as a triple-quoted big string, assigned
  to a variable of the model's choice (e.g., new_text = """...""")
- May reference the predefined variable ORIGINAL which contains the current text
  from the text box
- Calls input_text(new_text) exactly once to clear the field and input the new text

The produced code is executed in a restricted sandbox exposing ONLY:
- ORIGINAL: str (the original text content)
- input_text: function (captures the final text; semantically clears and types)

If the generated code produces execution errors, the agent automatically sends the
stack trace back to the LLM for correction, with up to 3 retry attempts by default.
This enables iterative refinement of the generated code.

The agent returns the final text that should be entered into the text box and the
raw code produced by the model (potentially after corrections).
'''

import traceback

from llama_index.core.llms import ChatMessage
from llama_index.core.llms.llm import LLM

from droidrun.agent.utils.inference import acall_with_retries
from llama_index_instrumentation import get_dispatcher

dispatcher = get_dispatcher()


@dispatcher.span
async def run_text_manipulation_agent(
    instruction: str,
    current_subgoal: str,
    current_text: str,
    overall_plan,
    llm: LLM,
    max_retries: int = 4,
) -> tuple[str, str]:
    """Convenience function to run CodeAct text manipulation with error correction.

    Args:
        instruction: User's overall instruction
        current_subgoal: Current subgoal to accomplish
        current_text: The current content of the focused text field
        overall_plan: Overall plan context
        llm: LLM instance to use for text manipulation
        max_retries: Maximum number of retry attempts if code execution fails

    Returns:
        Tuple of (final_text, raw_code) - the final text to input and the generated code
    """
    system_prompt = (
        "You are CODEACT_TEXT_AGENT, a constrained Python code generator for editing text in an Android text box.\n"
        "You will be given: (1) the current text in the focused text box as ORIGINAL, and (2) a TASK that describes how to modify it.\n\n"
        "Your job is to output ONLY a single Python code block in ```python format that:\n"
        "- Defines NO new functions, classes, or imports.\n"
        "- Uses ONLY the provided function input_text(text: str).\n"
        "- Builds the final content in a triple-quoted big string assigned to a variable of your choice, e.g.:\n"
        '    new_text = """..."""\n'
        "- Includes ORIGINAL in the new_text if needed to fulfill the TASK.\n"
        "- Calls input_text(new_text) exactly once to clear the field and input the new content.\n\n"
        "STRICT FORMAT RULES:\n"
        "- Respond with ONLY a fenced Python code block: ```python\n<code>\n```\n"
        "- Do NOT print anything. Do NOT use input().\n"
        "- Do NOT import any modules. Do NOT define additional functions or classes.\n"
        "- Do NOT access files, network, or system.\n"
        "If you are unsure about the ORIGINAL, use it by referencing ORIGINAL variable so you dont make mistake with white space or new line characters\n"
        "below is ORIGINAL use it by referencing ORIGINAL variable or directly typing it out:\n<ORIGINAL>\n{current_text}\n</ORIGINAL>\n"
        f"""
<user_request>
{instruction}
</user_request>
<overall_plan>
{overall_plan}
</overall_plan>
<current_subgoal>
{current_subgoal}
</current_subgoal>
        """
    )

    error_correction_prompt = (
        "You are CODEACT_TEXT_AGENT, correcting your previous code that had execution errors.\n\n"
        "The code you generated previously failed with this error:\n{error_message}\n\n"
        "Please fix the code and output ONLY a new Python code block in ```python format.\n"
        "Follow the same rules as before:\n"
        "- Use ONLY the provided function input_text(text: str)\n"
        "- Build the final content in a triple-quoted big string\n"
        "- Include ORIGINAL in the new_text if needed\n"
        "- Call input_text(new_text) exactly once\n"
        "- Respond with ONLY a fenced Python code block\n"
        "If you are unsure about the ORIGINAL, use it by referencing ORIGINAL variable so you dont make mistake with white space or new line characters"
        "below is ORIGINAL use it by referencing ORIGINAL variable or directly typing it out:\n<ORIGINAL>{current_text}</ORIGINAL>\n"
    )

    user_prompt = (
        "TASK:\n{task_instruction}\n\n"
        "CURRENT TEXT (ORIGINAL):\n{current_text}\n\n"
        "Write the Python code now."
    ).format(
        task_instruction=current_subgoal.strip(),
        current_text=current_text,
    )

    messages = [
        ChatMessage(
            role="system",
            content=system_prompt.format(
                overall_plan=overall_plan,
                current_subgoal=current_subgoal,
                instruction=instruction,
                current_text=current_text,
            ),
        ),
        ChatMessage(role="user", content=user_prompt),
    ]

    for attempt in range(max_retries + 1):  # +1 for initial attempt
        # Call the LLM with current messages
        response_message = (await acall_with_retries(llm, messages)).message
        content = response_message.content
        messages.append(response_message)

        # Extract code from ```python blocks
        code = _extract_python_code(content)
        if not code:
            # Fallback: if no code block found, use entire response as code
            code = content.strip()

        # Execute the code in a sandbox
        final_text, error_message = _execute_sandbox(code, current_text)

        # If successful (no error), return the result
        if not error_message:
            return final_text, code

        # If this was the last attempt, return what we have
        if attempt == max_retries:
            return final_text, code

        # Add error correction message to conversation
        correction_message = error_correction_prompt.format(error_message=error_message)
        messages.append(ChatMessage(role="user", content=correction_message))

    # This should never be reached, but just in case
    return current_text, ""


def _extract_python_code(text: str) -> str:
    """Extract Python code from ```python fenced blocks using simple string operations."""
    if not text:
        return ""

    # Try different variations of code block markers
    patterns = [
        # ```python with newlines
        ("```python\n", "\n```"),
        # ```python without newlines
        ("```python", "```"),
        # Generic ``` with newlines
        ("```\n", "\n```"),
        # Generic ``` without newlines
        ("```", "```"),
    ]

    for start_marker, end_marker in patterns:
        if start_marker in text and end_marker in text:
            # Find the start position after the marker
            start_idx = text.find(start_marker) + len(start_marker)
            # Find the end position before the marker
            end_idx = text.find(end_marker, start_idx)
            if end_idx != -1:
                code = text[start_idx:end_idx].strip()
                # Only return if we actually extracted some code
                if code:
                    return code

    return ""


def _execute_sandbox(code: str, original_text: str) -> tuple[str, str]:
    """Execute model code in a locked-down environment with exec().

    Returns:
        Tuple of (result_text, error_message) - result_text is the final text if successful,
        or original_text if failed. error_message is the stack trace if execution failed,
        or empty string if successful.
    """
    if not code:
        return original_text, ""

    captured = {"value": None}

    def input_text(text: str) -> None:
        """Capture the final text to be input."""
        captured["value"] = text

    # Create restricted environment
    sandbox_globals = {
        "__builtins__": {},  # Empty builtins for security
        "input_text": input_text,
        "ORIGINAL": original_text,
    }
    sandbox_locals = {}

    try:
        exec(code, sandbox_globals, sandbox_locals)
        return captured["value"] if captured["value"] is not None else original_text, ""
    except Exception:
        error_message = traceback.format_exc()
        return original_text, error_message
