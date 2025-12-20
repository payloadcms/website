"""
DroidAgent coordination events.

These events are used for WORKFLOW COORDINATION between DroidAgent and its child agents.
They carry minimal data needed for routing workflow steps.

For internal events with full debugging metadata, see:
- manager/events.py (ManagerPlanDetailsEvent, ManagerContextEvent, ManagerResponseEvent)
- executor/events.py (ExecutorActionEvent, ExecutorActionResultEvent, ExecutorContextEvent, ExecutorResponseEvent)
"""

from typing import Dict

from llama_index.core.workflow import Event, StopEvent
from pydantic import BaseModel


class CodeActExecuteEvent(Event):
    instruction: str


class CodeActResultEvent(Event):
    success: bool
    reason: str
    instruction: str


class FinalizeEvent(Event):
    success: bool
    reason: str


class ResultEvent(StopEvent):
    """
    DroidAgent final result event.

    Returned by DroidAgent.run() with attributes:
    - success: Whether the task completed successfully
    - reason: Explanation of the result or error message
    - steps: Number of steps taken
    - structured_output: Extracted structured data (if output_model was provided)
    """

    success: bool
    reason: str
    steps: int
    structured_output: BaseModel | None


class TaskRunnerEvent(Event):
    pass


# ============================================================================
# Manager/Executor coordination events
# ============================================================================


class ManagerInputEvent(Event):
    """Trigger Manager workflow for planning"""

    pass


class ManagerPlanEvent(Event):
    """
    Coordination event from ManagerAgent to DroidAgent.

    Used for workflow step routing only (NOT streamed to frontend).
    For internal events with memory_update metadata, see ManagerPlanDetailsEvent.
    """

    plan: str
    current_subgoal: str
    thought: str
    manager_answer: str = ""
    success: bool | None = (
        None  # True/False if task complete, None if still in progress
    )


class ExecutorInputEvent(Event):
    """Trigger Executor workflow for action execution"""

    current_subgoal: str


class ExecutorResultEvent(Event):
    """
    Coordination event from ExecutorAgent to DroidAgent.

    Used for workflow step routing only (NOT streamed to frontend).
    For internal events with thought/action_json metadata, see ExecutorActionResultEvent.
    """

    action: Dict
    outcome: bool
    error: str
    summary: str
    full_response: str = ""


# ============================================================================
# Script executor coordination events
# ============================================================================


class ScripterExecutorInputEvent(Event):
    """Trigger ScripterAgent workflow for off-device operations"""

    task: str


class ScripterExecutorResultEvent(Event):
    """
    Coordination event from ScripterAgent to DroidAgent.

    Used for workflow step routing only (NOT streamed to frontend).
    """

    task: str
    message: str  # Response from response() function
    success: bool
    code_executions: int


class TextManipulatorInputEvent(Event):
    """Trigger TextManipulatorAgent workflow for text manipulation"""

    task: str


class TextManipulatorResultEvent(Event):
    task: str
    text_to_type: str
    code_ran: str
