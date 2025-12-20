---
title: "이벤트 스트리밍"
description: "DroidAgent 실행에서 실시간 이벤트를 소비하는 방법."
---

## 개요

Droidrun은 에이전트 실행이 진행되는 동안 **실시간 이벤트 스트리밍**을 제공하여 가시성을 확보합니다. 이를 통해 에이전트 행동에 실시간으로 반응하는 UI, 로깅 시스템, 또는 모니터링 도구를 구축할 수 있습니다.

내부적으로 Droidrun은 [llama-index workflows](https://docs.llamaindex.ai/en/stable/understanding/workflows/)를 사용합니다 - 에이전트 아키텍처를 구동하는 이벤트 기반 오케스트레이션 시스템입니다.

## 기본 사용법

```python
from droidrun.agent.droid import DroidAgent

# 에이전트 생성 및 실행
agent = DroidAgent(goal="Gmail을 열고 받은편지함 확인하기", config=config)
handler = agent.run()

# 실시간으로 이벤트 스트리밍
async for event in handler.stream_events():
    if isinstance(event, ManagerPlanDetailsEvent):
        print(f"📋 계획: {event.plan}")
        print(f"🎯 현재 하위 목표: {event.current_subgoal}")

    elif isinstance(event, ExecutorActionEvent):
        print(f"⚡ 행동: {event.description}")
        print(f"💭 생각: {event.thought}")

    elif isinstance(event, ScreenshotEvent):
        save_screenshot(event.screenshot, "screenshot.png")

    elif isinstance(event, TaskThinkingEvent):
        print(f"🐍 생성된 코드:")
        if event.code:
            print(event.code)
        if event.thoughts:
            print(f"💭 생각: {event.thoughts}")

# 최종 결과 대기
result = await handler
print(f"✅ 성공: {result.success}")
print(f"📝 이유: {result.reason}")
```

## 이벤트 타입

"워크플로우 조율 이벤트"
DroidAgent와 하위 에이전트 간 워크플로우 조율에 사용됩니다.

```python
# 메인 워크플로우
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
    success: bool
    reason: str
    steps: int
    structured_output: BaseModel | None

# Manager/Executor 조율
class ManagerInputEvent(Event): pass
class ManagerPlanEvent(Event):
    plan: str
    current_subgoal: str
    thought: str
    manager_answer: str
    success: bool | None

class ExecutorInputEvent(Event):
    current_subgoal: str

class ExecutorResultEvent(Event):
    action: Dict
    outcome: bool
    error: str
    summary: str
    full_response: str

# Scripter 조율
class ScripterExecutorInputEvent(Event):
    task: str

class ScripterExecutorResultEvent(Event):
    task: str
    message: str
    success: bool
    code_executions: int

# 텍스트 조작
class TextManipulatorInputEvent(Event):
    task: str

class TextManipulatorResultEvent(Event):
    task: str
    text_to_type: str
    code_ran: str
```
  </Accordion>

  "Manager 이벤트 (내부)"
ManagerAgent 내부에서 사용되며, 프론트엔드/로깅으로 스트리밍됩니다.

```python
class ManagerContextEvent(Event): pass

class ManagerResponseEvent(Event):
    output_planning: str
    usage: Optional[UsageResult]

class ManagerPlanDetailsEvent(Event):
    plan: str
    current_subgoal: str
    thought: str
    manager_answer: str
    memory_update: str
    success: bool | None
    full_response: str
```
  

  "Executor 이벤트 (내부)"
ExecutorAgent 내부에서 사용되며, 프론트엔드/로깅으로 스트리밍됩니다.

```python
class ExecutorContextEvent(Event):
    messages: list
    subgoal: str

class ExecutorResponseEvent(Event):
    response_text: str
    usage: Optional[UsageResult]

class ExecutorActionEvent(Event):
    action_json: str
    thought: str
    description: str
    full_response: str

class ExecutorActionResultEvent(Event):
    action: Dict
    outcome: bool
    error: str
    summary: str
    thought: str
    action_json: str
    full_response: str
```
  </Accordion>

  e="CodeAct 이벤트 (내부)"
CodeActAgent 내부에서 사용되며, 직접 실행 모드에서 사용됩니다.

```python
class TaskInputEvent(Event):
    input: list[ChatMessage]

class TaskThinkingEvent(Event):
    thoughts: Optional[str]
    code: Optional[str]
    usage: Optional[UsageResult]

class TaskExecutionEvent(Event):
    code: str
    globals: dict[str, str] = {}
    locals: dict[str, str] = {}

class TaskExecutionResultEvent(Event):
    output: str

class TaskEndEvent(Event):
    success: bool
    reason: str
```
  </Accordion>

  <Accordion title="Scripter 이벤트 (내부)">
ScripterAgent 내부에서 사용되며, 오프-디바이스 스크립트 실행용입니다.

```python
class ScripterInputEvent(Event):
    input: List

class ScripterThinkingEvent(Event):
    thoughts: str
    code: Optional[str]
    full_response: str
    usage: Optional[UsageResult]

class ScripterExecutionEvent(Event):
    code: str

class ScripterExecutionResultEvent(Event):
    output: str

class ScripterEndEvent(Event):
    message: str
    success: bool
    code_executions: int
```
  </Accordion>

  <Accordion title="행동 기록 이벤트">
행동이 수행될 때 발생하며, 매크로 기록과 궤적 추적에 사용됩니다.

```python
class MacroEvent(Event):  # 기본 클래스
    action_type: str
    description: str

class TapActionEvent(MacroEvent):
    x: int
    y: int
    element_index: int = None
    element_text: str = ""
    element_bounds: str = ""

class SwipeActionEvent(MacroEvent):
    start_x: int
    start_y: int
    end_x: int
    end_y: int
    duration_ms: int

class DragActionEvent(MacroEvent):
    start_x: int
    start_y: int
    end_x: int
    end_y: int
    duration_ms: int

class InputTextActionEvent(MacroEvent):
    text: str

class KeyPressActionEvent(MacroEvent):
    keycode: int
    key_name: str = ""

class StartAppEvent(MacroEvent):
    package: str
    activity: str = None

class WaitEvent(MacroEvent):
    duration: float
```
  </Accordion>

  <Accordion title="시각 및 텔레메트리 이벤트">
```python
# 시각 이벤트
class ScreenshotEvent(Event):
    screenshot: bytes

class RecordUIStateEvent(Event):
    ui_state: list[Dict[str, Any]]

# 텔레메트리 이벤트 (활성화 시)
class DroidAgentInitEvent(TelemetryEvent):
    goal: str
    llms: Dict[str, str]
    tools: str
    max_steps: int
    timeout: int
    vision: Dict[str, bool]
    reasoning: bool
    enable_tracing: bool
    debug: bool
    save_trajectories: str
    runtype: str
    custom_prompts: Optional[Dict[str, str]]

class PackageVisitEvent(TelemetryEvent):
    package_name: str
    activity_name: str
    step_number: int

class DroidAgentFinalizeEvent(TelemetryEvent):
    success: bool
    reason: str
    steps: int
    unique_packages_count: int
    unique_activities_count: int

# 사용량 추적
class UsageResult(BaseModel):
    request_tokens: int
    response_tokens: int
    total_tokens: int
    requests: int
```
  </Accordion>
</AccordionGroup>

## 일반적인 패턴

### 실시간 UI 구축

```python
async def run_with_ui(goal: str):
    agent = DroidAgent(goal=goal, config=config)
    handler = agent.run()

    async for event in handler.stream_events():
        if isinstance(event, ManagerPlanDetailsEvent):
            ui.update_plan(event.plan)
            ui.update_current_step(event.current_subgoal)

        elif isinstance(event, ExecutorActionEvent):
            ui.add_action_log(event.description, event.thought)

        elif isinstance(event, ScreenshotEvent):
            ui.update_screenshot(event.screenshot)

    result = await handler
    ui.show_completion(result.success, result.reason)
```

### 토큰 사용량 추적

```python
async def track_token_usage(goal: str):
    agent = DroidAgent(goal=goal, config=config)
    handler = agent.run()

    total_tokens = 0
    total_requests = 0

    async for event in handler.stream_events():
        # 사용량 정보를 포함하는 이벤트 확인
        if hasattr(event, 'usage') and event.usage:
            total_tokens += event.usage.total_tokens
            total_requests += event.usage.requests

            print(f"LLM 호출 - 입력: {event.usage.request_tokens}, "
                  f"출력: {event.usage.response_tokens}, "
                  f"총계: {event.usage.total_tokens}")

    result = await handler
    print(f"\n📊 사용된 총 토큰: {total_tokens}")
    print(f"📊 총 LLM 요청: {total_requests}")
```

### 로깅 및 모니터링

```python
import logging

logger = logging.getLogger("droidrun.monitor")

async def monitor_execution(goal: str):
    agent = DroidAgent(goal=goal, config=config)
    handler = agent.run()

    start_time = time.time()
    action_count = 0

    async for event in handler.stream_events():
        if isinstance(event, ExecutorActionEvent):
            action_count += 1
            logger.info(f"행동 {action_count}: {event.description}")

        elif isinstance(event, TaskExecutionResultEvent):
            logger.info(f"코드 실행 결과: {event.output}")

    result = await handler
    duration = time.time() - start_time

    logger.info(f"작업이 {duration:.2f}초에 {action_count}개의 행동으로 완료됨")
    logger.info(f"결과: {result.success} - {result.reason}")
```

## 참고사항

### 이벤트 스트리밍 동작

- 이벤트는 에이전트가 실행되는 동안 **실시간으로 스트리밍**됩니다
- 모든 실행에서 모든 이벤트가 발생하지는 않음 (모드와 행동에 따라 다름)
- 모든 이벤트는 **완전한 타입 안전성을 가진 Pydantic 모델**입니다
- `handler` 객체는 **비동기** - 최종 결과를 얻으려면 항상 `await handler`를 사용하세요

### 모드별 이벤트 발생

**추론 모드** (`reasoning=True`)에서 발생:
- 조율: `ManagerInputEvent`, `ManagerPlanEvent`, `ExecutorInputEvent`, `ExecutorResultEvent`
- 내부 Manager: `ManagerContextEvent`, `ManagerResponseEvent`, `ManagerPlanDetailsEvent`
- 내부 Executor: `ExecutorContextEvent`, `ExecutorResponseEvent`, `ExecutorActionEvent`, `ExecutorActionResultEvent`
- 행동: 모든 행동 기록 이벤트 (`TapActionEvent`, `SwipeActionEvent` 등)
- 시각: `ScreenshotEvent`, `RecordUIStateEvent` (활성화 시)

**직접 모드** (`reasoning=False`)에서 발생:
- 조율: `CodeActExecuteEvent`, `CodeActResultEvent`
- 내부 CodeAct: `TaskInputEvent`, `TaskThinkingEvent`, `TaskExecutionEvent`, `TaskExecutionResultEvent`, `TaskEndEvent`
- 행동: 모든 행동 기록 이벤트
- 시각: `ScreenshotEvent`, `RecordUIStateEvent` (활성화 시)

**ScripterAgent** (`<script>` 태그에 의해 트리거될 때)에서 발생:
- 조율: `ScripterExecutorInputEvent`, `ScripterExecutorResultEvent`
- 내부 Scripter: `ScripterInputEvent`, `ScripterThinkingEvent`, `ScripterExecutionEvent`, `ScripterExecutionResultEvent`, `ScripterEndEvent`

**모든 모드**에서 발생:
- 종료: `FinalizeEvent`, `ResultEvent`
- 텔레메트리: `DroidAgentInitEvent`, `PackageVisitEvent`, `DroidAgentFinalizeEvent` (텔레메트리 활성화 시)

### 이벤트 카테고리

**조율 이벤트** - 에이전트 간 워크플로우 라우팅에 사용 (최소 데이터)
- 위치: `droidrun/agent/droid/events.py`
- 예시: `ManagerPlanEvent`, `ExecutorResultEvent`, `ScripterExecutorResultEvent`

**내부 이벤트** - 프론트엔드/로깅 스트리밍에 사용 (전체 디버그 데이터)
- 위치: 에이전트별 이벤트 파일
- 예시: `ManagerPlanDetailsEvent`, `ExecutorActionEvent`, `TaskThinkingEvent`

**행동 기록 이벤트** - 행동이 수행될 때 발생 (매크로/궤적용)
- 위치: `droidrun/agent/common/events.py`
- 예시: `TapActionEvent`, `SwipeActionEvent`, `InputTextActionEvent`

**텔레메트리 이벤트** - 분석용 캡처 (활성화 시)
- 위치: `droidrun/telemetry/events.py`
- 예시: `DroidAgentInitEvent`, `PackageVisitEvent`, `DroidAgentFinalizeEvent`

## 더 알아보기

- [LlamaIndex Workflows](https://docs.llamaindex.ai/en/stable/understanding/workflows/) - 기본 오케스트레이션 시스템
