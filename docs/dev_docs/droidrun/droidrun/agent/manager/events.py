"""
Events for the ManagerAgent workflow.

These are INTERNAL events used within ManagerAgent for:
- Streaming to frontend/logging
- Carrying full debug metadata

For workflow coordination with DroidAgent, see droid/events.py
"""

from typing import Optional

from llama_index.core.workflow.events import Event

from droidrun.agent.usage import UsageResult


class ManagerContextEvent(Event):
    """Manager context prepared, ready for LLM call"""

    pass


class ManagerResponseEvent(Event):
    """
    Manager has received LLM response, ready for parsing.

    This event carries the raw validated LLM output before parsing.
    """

    output_planning: str
    usage: Optional[UsageResult] = None


class ManagerPlanDetailsEvent(Event):
    """
    Manager planning event with full state and metadata.

    This event is streamed to frontend/logging but NOT used for
    workflow coordination between ManagerAgent and DroidAgent.

    For workflow coordination, see ManagerPlanEvent in droid/events.py
    """

    plan: str
    current_subgoal: str
    thought: str
    manager_answer: str = ""
    memory_update: str = ""  # Debugging metadata: LLM's memory additions
    success: bool | None = (
        None  # True/False if task complete, None if still in progress
    )
    full_response: str = ""
