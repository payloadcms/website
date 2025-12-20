---
title: '프롬프트 템플릿'
description: 'Jinja2 프롬프트 템플릿으로 에이전트 동작 커스터마이징하기.'
---

## 개요

Droidrun은 에이전트 프롬프트에 **Jinja2 템플릿**을 사용합니다. `DroidAgent`에 커스텀 템플릿 문자열을 전달하여 에이전트 동작을 커스터마이징할 수 있습니다:

```python
custom_prompts = {
    "manager_system": "여기에 Jinja2 템플릿을 작성하세요...",
    "executor_system": "또 다른 템플릿...",
    "codeact_system": "...",
    "codeact_user": "...",
    "scripter_system": "..."
}

agent = DroidAgent(
    goal="이메일 보내기",
    config=config,
    prompts=custom_prompts  # 파일 경로가 아닌 템플릿 문자열을 전달
)
```

**중요**: `prompts` 파라미터는 파일 경로가 아닌 Jinja2 **템플릿 문자열**을 받습니다.

## 작동 방식

1. `DroidAgent`가 커스텀 프롬프트로 `PromptResolver`를 생성합니다
2. 각 에이전트는 해당 키(예: "manager_system")에 대한 커스텀 템플릿을 제공했는지 확인합니다
3. 찾음: 커스텀 템플릿 사용
4. 찾지 못함: Droidrun의 내장 파일에서 기본 템플릿 로드
5. 템플릿은 각 에이전트별 컨텍스트 변수와 함께 렌더링됩니다

## 사용 가능한 프롬프트 키

| 키 | 에이전트 | 사용 시기 |
|-----|-------|-----------|
| `manager_system` | Manager | 계획 및 추론 (추론 모드에서만) |
| `executor_system` | Executor | 행동 선택 (추론 모드에서만) |
| `codeact_system` | CodeAct | 직접 실행 (항상 사용) |
| `codeact_user` | CodeAct | 작업 입력 포맷팅 (항상 사용) |
| `scripter_system` | Scripter | 오프-디바이스 Python 실행 (활성화 시) |

## 컨텍스트 변수

각 에이전트는 템플릿에서 서로 다른 변수에 접근할 수 있습니다:

### Manager

- `instruction` - 사용자의 목표
- `device_date` - 현재 기기 날짜/시간
- `app_card` - 앱별 가이드 (없으면 빈 값)
- `error_history` - 세부 정보와 함께 최근 실패한 행동 목록
- `custom_tools_descriptions` - 커스텀 도구 문서
- `scripter_execution_enabled` - Scripter 사용 가능 여부
- `available_secrets` - 사용 가능한 자격 증명 ID
- `variables` - DroidAgent에 전달된 커스텀 변수
- `output_schema` - Pydantic 모델 스키마 (제공 시)

### Executor

- `instruction` - 사용자의 목표
- `device_state` - 현재 UI 트리
- `subgoal` - Manager로부터의 현재 하위 목표
- `atomic_actions` - 사용 가능한 행동 (커스텀 도구 포함)
- `action_history` - 결과와 함께 최근 행동들

### CodeAct

**시스템 프롬프트:**
- `tool_descriptions` - 사용 가능한 도구 시그니처
- `available_secrets` - 자격 증명 ID
- `variables` - 커스텀 변수
- `output_schema` - 출력 모델 스키마 (제공 시)

**사용자 프롬프트:**
- `goal` - 작업 설명
- `variables` - 커스텀 변수

### Scripter

- `task` - Manager로부터의 작업 설명
- `available_secrets` - 자격 증명 ID
- `variables` - 커스텀 변수

## 예제: 커스텀 Manager 프롬프트

```python
custom_prompts = {
    "manager_system": """
당신은 모바일 자동화 계획 에이전트입니다.

작업: {{ instruction }}
날짜: {{ device_date }}

{% if app_card %}
앱 가이드:
{{ app_card }}
{% endif %}

{% if error_history %}
최근 오류 (막힐 수 있음):
{% for error in error_history %}
- 행동: {{ error.action }}
  오류: {{ error.error }}
{% endfor %}
{% endif %}

{% if custom_tools_descriptions %}
커스텀 도구:
{{ custom_tools_descriptions }}
{% endif %}

{% if variables.domain %}
도메인: {{ variables.domain }}
{% endif %}

출력 형식:
<thought>당신의 추론</thought>
<plan>
1. 첫 번째 단계
2. 두 번째 단계
3. 완료
</plan>

또는 완료된 경우:
<request_accomplished>
작업이 완료되었습니다. 답변: ...
</request_accomplished>
"""
}

agent = DroidAgent(
    goal="이메일 보내기",
    config=config,
    prompts=custom_prompts,
    variables={"domain": "finance"}
)
```

## 예제: 커스텀 변수 사용

커스텀 변수를 사용하면 프롬프트에 동적 컨텍스트를 주입할 수 있습니다:

```python
custom_prompts = {
    "manager_system": """
작업: {{ instruction }}

{% if variables.budget %}
예산 제한: ${{ variables.budget }}
{% endif %}

{% if variables.priority %}
우선순위: {{ variables.priority }}
{% endif %}

가이드라인:
{% for rule in variables.rules %}
- {{ rule }}
{% endfor %}
"""
}

agent = DroidAgent(
    goal="휴대폰 구매하기",
    config=config,
    prompts=custom_prompts,
    variables={
        "budget": 1000,
        "priority": "high",
        "rules": ["리뷰 확인", "가격 비교", "쿠폰 사용"]
    }
)
```

## Jinja2 구문 참조

### 변수

```jinja2
{{ instruction }}
{{ variables.my_var }}
```

### 조건문

```jinja2
{% if app_card %}
<app_card>{{ app_card }}</app_card>
{% endif %}

{% if error_history %}
{{ error_history | length }}개의 오류가 있습니다
{% endif %}
```

### 반복문

```jinja2
{% for error in error_history %}
- {{ error.action }}: {{ error.error }}
{% endfor %}
```

### 필터

```jinja2
{{ instruction | upper }}
{{ available_secrets | join(', ') }}
{{ error_history | length }}
```

## 모범 사례

### 1. 명확한 구조 사용

```jinja2
<instruction>
{{ instruction }}
</instruction>

<guidelines>
1. 첫 번째 규칙
2. 두 번째 규칙
</guidelines>

<output_format>
예상되는 형식
</output_format>
```

### 2. 조건문으로 누락된 데이터 처리

```jinja2
{% if app_card %}
<app_card>{{ app_card }}</app_card>
{% else %}
<note>앱별 가이드가 없습니다</note>
{% endif %}
```

### 3. 예상 변수 문서화

```jinja2
{# 예상 변수:
   - instruction: str - 사용자의 목표
   - device_date: str - 현재 날짜/시간
   - app_card: str - 앱 가이드 (비어 있을 수 있음)
#}
```

### 4. 동적 동작을 위한 변수 사용

```jinja2
{% if variables.strict_mode %}
<strict>
지침을 정확히 따르세요. 가정을 하지 마세요.
</strict>
{% endif %}
```

## 완전한 예제

```python
from droidrun import DroidAgent
from droidrun.config_manager import DroidrunConfig

# 커스텀 프롬프트로 전자상거래 자동화
ecommerce_prompts = {
    "manager_system": """
당신은 전자상거래 자동화 전문가입니다.

작업: {{ instruction }}
예산: ${{ variables.budget }}

{% if app_card %}
앱 정보:
{{ app_card }}
{% endif %}

{% if error_history %}
발생한 오류:
{% for error in error_history %}
- {{ error.action }}: {{ error.summary }} - {{ error.error }}
{% endfor %}
접근 방식을 변경하는 것을 고려하세요.
{% endif %}

규칙:
1. 제품 이름을 정확히 확인
2. 구매 전 가격 확인
3. 주문 확인서를 메모리에 저장
4. 예산 초과 금지

출력:
<thought>당신의 추론</thought>
<plan>
1. 단계
2. 완료
</plan>
"""
}

config = DroidrunConfig()
agent = DroidAgent(
    goal="Amazon에서 iPhone 15 Pro 구매하기",
    config=config,
    prompts=ecommerce_prompts,
    variables={"budget": 1200}
)

result = await agent.run()
```

## 주요 포인트

- `DroidAgent(prompts={...})`에 파일 경로가 아닌 Jinja2 템플릿 **문자열**을 전달하세요
- 각 에이전트는 템플릿에서 서로 다른 사용 가능한 변수를 가집니다
- 커스텀 컨텍스트를 주입하려면 `variables` 파라미터를 사용하세요
- 템플릿은 런타임에 현재 상태와 함께 렌더링됩니다
- 커스텀 프롬프트를 제공하지 않으면 기본 템플릿이 사용됩니다
- 전체 Jinja2 구문 지원 (조건문, 반복문, 필터)
