---
title: '공유 상태'
description: 'DroidAgentState - 다중 에이전트 워크플로우 통신을 위한 조율 메커니즘.'
---

## 공유 상태란 무엇인가?

**DroidAgentState**는 Droidrun의 다중 에이전트 워크플로우를 위한 **중앙 조율 메커니즘**으로 작동하는 Pydantic 모델입니다. 모든 에이전트(Manager, Executor, CodeAct, Scripter)가 읽고 쓸 수 있는 공유 데이터 구조입니다.

공유 상태는 다음을 가능하게 합니다:
- **에이전트 간 통신**: 에이전트들이 행동, 결과, 오류에 대한 정보를 공유
- **진행 상황 추적**: 단계 수, 행동 이력, 방문한 앱/화면
- **메모리 관리**: 에이전트 메모리, 커스텀 변수, 사용자 세션 데이터
- **오류 조율**: 오류 플래그, 에스컬레이션 임계값, 오류 설명

**핵심 통찰**: 공유 상태는 복잡한 메시지 전달을 대체합니다. 데이터를 앞뒤로 보내는 대신, 에이전트들이 단일 공유 객체를 업데이트합니다.

## 핵심 상태 필드

```python
class DroidAgentState(BaseModel):
    # 작업 컨텍스트
    instruction: str = ""           # 원본 작업
    step_number: int = 0            # 현재 단계

    # 기기 상태
    formatted_device_state: str = ""           # 사람이 읽을 수 있는 상태
    current_package_name: str = ""             # 현재 앱
    current_activity_name: str = ""            # 현재 화면

    # 행동 추적
    action_history: List[Dict] = []            # 취한 모든 행동
    action_outcomes: List[bool] = []           # 성공/실패
    summary_history: List[str] = []            # 행동 요약

    # 메모리
    memory: str = ""                           # 에이전트 지속 메모리

    # 계획 (Manager)
    plan: str = ""                             # 현재 계획
    current_subgoal: str = ""                  # 현재 하위 목표
    manager_answer: str = ""                   # 답변형 응답

    # 오류 처리
    error_flag_plan: bool = False              # Manager에게 오류 신호
    error_descriptions: List[str] = []         # 오류 메시지

    # 스크립트 실행 (Scripter)
    scripter_history: List[Dict] = []          # Scripter 결과
    last_scripter_success: bool = True         # 마지막 실행 상태

    # 커스텀 변수
    custom_variables: Dict = {}                # 사용자 정의 데이터
```