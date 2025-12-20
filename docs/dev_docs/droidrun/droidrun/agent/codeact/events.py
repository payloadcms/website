from typing import Optional

from llama_index.core.llms import ChatMessage
from llama_index.core.workflow import Event

from droidrun.agent.usage import UsageResult


class TaskInputEvent(Event):
    input: list[ChatMessage]


class TaskThinkingEvent(Event):
    thoughts: Optional[str] = None
    code: Optional[str] = None
    usage: Optional[UsageResult] = None


class TaskExecutionEvent(Event):
    code: str
    globals: dict[str, str] = {}
    locals: dict[str, str] = {}


class TaskExecutionResultEvent(Event):
    output: str


class TaskEndEvent(Event):
    success: bool
    reason: str
