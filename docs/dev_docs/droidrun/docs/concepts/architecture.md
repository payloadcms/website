---
title: '아키텍처'
description: '기기 자동화를 위한 Droidrun 다중 에이전트 시스템 이해하기.'
---

## Droidrun이란 무엇인가?

Droidrun은 **다중 에이전트 아키텍처**를 사용하여 전문화된 에이전트들이 함께 작업을 완료합니다. 하나의 에이전트가 모든 것을 처리하는 대신, 서로 다른 에이전트들이 계획, 실행, 그리고 계산을 담당합니다.

```
DroidAgent (오케스트레이터)
├── 추론 모드: ManagerAgent → ExecutorAgent → ScripterAgent
└── 직접 모드: CodeActAgent
```

## 실행 모드

### 추론 모드 (`reasoning=True`)
관리자가 계획을 생성하고, 실행자가 행동을 취합니다. 복잡한 다단계 작업에 가장 적합합니다.

```
목표 → 관리자 (계획) → 실행자 (행동) → 관리자 (확인) → 실행자 (다음) → ...
```

### 직접 모드 (`reasoning=False`)
CodeActAgent가 계획 오버헤드 없이 즉시 실행합니다. 간단한 작업에 가장 적합합니다.

```
목표 → CodeActAgent (생성 + 실행) → 완료
```

## 핵심 에이전트

### DroidAgent (오케스트레이터)
모드를 기반으로 에이전트 간 라우팅을 수행하는 주요 조율자입니다.

**위치**: `droidrun/agent/droid/droid_agent.py`

### ManagerAgent (계획자)
전략적 계획을 생성하고 작업을 하위 목표로 분해합니다. 추론 모드에서만 사용됩니다.

**위치**: `droidrun/agent/manager/manager_agent.py`

**워크플로우**: `prepare_context()` → `get_response()` → `process_response()` → `finalize()`

### ExecutorAgent (행위자)
각 하위 목표에 대한 원자적 행동을 실행합니다. 추론 모드에서만 사용됩니다.

**위치**: `droidrun/agent/executor/executor_agent.py`

**워크플로우**: `prepare_context()` → `get_response()` → `process_response()` → `execute()` → `finalize()`

### CodeActAgent (직접 실행자)
원자적 행동을 사용하여 Python 코드를 생성합니다. 직접 모드에서만 사용됩니다.

**위치**: `droidrun/agent/codeact/codeact_agent.py`

**사용 가능한 행동**:
```python
click(index), long_press(index), type(text, index),
swipe(coordinate, coordinate2), system_button(button),
wait(duration), open_app(text), get_state(), take_screenshot(),
remember(information), complete(success, reason)
```

### ScripterAgent (오프-디바이스)
API 호출, 파일 작업, 계산을 위한 Python을 실행합니다. 필요할 때 관리자에 의해 트리거됩니다.

**위치**: `droidrun/agent/scripter/`

## 구성

에이전트별로 서로 다른 LLM을 구성할 수 있습니다:

```yaml
llm_profiles:
  manager:
    provider: Anthropic
    model: claude-sonnet-4
  executor:
    provider: OpenAI
    model: gpt-4o
  codeact:
    provider: GoogleGenAI
    model: models/gemini-2.0-flash-exp
  scripter:
    provider: OpenAI
    model: gpt-4o

agent:
  reasoning: true       # Manager/Executor 워크플로우 활성화
  max_steps: 15         # 최대 실행 단계 수 (전역)
  manager:
    vision: true        # Manager에게 스크린샷 전송
  executor:
    vision: true        # Executor에게 스크린샷 전송
  codeact:
    vision: false
    safe_execution: false
  scripter:
    max_steps: 10       # Scripter 전용 최대 단계 수
    safe_execution: false
```

## 각 모드를 사용할 때

**추론 모드를 사용할 때:**
- 다단계 작업 (항공권 예약, 설정 구성)
- 계획과 적응이 필요한 작업
- 여러 앱에 걸친 복잡한 워크플로우

**직접 모드를 사용할 때:**
- 간단한 행동 (스크린샷, 메시지 전송)
- 계획 오버헤드 없는 빠른 실행
- 잘 정의된 단일 단계 작업

## 공유 상태

모든 에이전트는 조정을 위해 `DroidAgentState`를 공유합니다:
- 행동 이력과 결과
- 오류 추적 및 복구
- 메모리 및 컨텍스트
- Scripter 결과
- 현재 계획 및 진행 상황

## 빠른 참조

| 에이전트 | 역할 | 최적 용도 | 모드 | 구성 키 |
|-------|------|----------|------|------------|
| DroidAgent | 오케스트레이터 | 진입점 | 둘 다 | `agent.*` |
| ManagerAgent | 계획자 | 전략, 복구 | 추론 | `agent.manager.*` |
| ExecutorAgent | 행위자 | 행동 실행 | 추론 | `agent.executor.*` |
| CodeActAgent | 직접 | 간단한 작업 | 직접 | `agent.codeact.*` |
| ScripterAgent | Python 실행자 | API, 파일, 데이터 | 추론 | `agent.scripter.*` |
