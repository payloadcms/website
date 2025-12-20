---
title: '커스텀 변수'
description: '`variables` 파라미터를 사용하여 Droidrun 에이전트에 동적 데이터를 전달합니다. 변수는 매개변수화된 워크플로우와 재사용 가능한 자동화를 가능하게 합니다.'
---

커스텀 변수는 다음에서 접근할 수 있습니다:
- **에이전트 프롬프트** - 커스텀 Jinja2 템플릿을 통해
- **커스텀 도구** - `shared_state.custom_variables`를 통해

---

## 빠른 시작

```python
from droidrun import DroidAgent, DroidrunConfig

# 변수를 렌더링하는 커스텀 프롬프트 정의
custom_prompts = {
    "manager_system": """
{{ instruction }}

{% if variables %}
사용 가능한 변수:
{% for key, value in variables.items() %}
- {{ key }}: {{ value }}
{% endfor %}
{% endif %}
    """
}

# 변수와 함께 에이전트 생성
config = DroidrunConfig()

agent = DroidAgent(
    goal="수신자와 제목으로 이메일 보내기",
    config=config,
    variables={"recipient": "john@example.com", "subject": "업데이트"},
    prompts=custom_prompts  # 변수를 보려면 필수
)

result = await agent.run()
```

**중요:** 기본 프롬프트는 변수를 렌더링하지 않습니다. `prompts` 파라미터를 통해 커스텀 프롬프트를 제공해야 합니다.

---

## 변수 작동 방식

`DroidAgent`에 `variables`를 전달할 때:

1. **`DroidAgentState.custom_variables`에 저장**
2. **프롬프트 템플릿에 `variables` 딕셔너리로 전달**
3. **Jinja2 템플릿에서 `{% if variables %}` 블록을 통해 렌더링**
4. **워크플로우 전반에 걸쳐 모든 하위 에이전트에서 사용 가능**

**접근 요약:**
- ✅ 에이전트 프롬프트 (커스텀 Jinja2 템플릿을 통해)
- ✅ 에이전트가 도구에 인수로 전달할 수 있음
- ✅ 커스텀 도구 (`shared_state.custom_variables`를 통해)

---

## 기본 사용법

```python
from droidrun import DroidAgent, DroidrunConfig

# 변수 정의
variables = {
    "recipient": "alice@example.com",
    "message": "Droidrun에서 인사드립니다!"
}

# 변수를 렌더링하는 커스텀 프롬프트
custom_prompts = {
    "codeact_system": """
Android 기기를 제어하는 에이전트입니다.

{% if variables %}
사용 가능한 변수:
{% for key, value in variables.items() %}
- {{ key }}: {{ value }}
{% endfor %}
{% endif %}

작업을 실행할 때 이러한 변수를 사용하세요.
    """
}

# 에이전트 생성
config = DroidrunConfig()

agent = DroidAgent(
    goal="수신자에게 메시지 보내기",
    config=config,
    variables=variables,
    prompts=custom_prompts
)

result = await agent.run()
```

### 사용 가능한 프롬프트 키

변수를 렌더링하도록 이러한 프롬프트를 커스터마이징할 수 있습니다:

- `manager_system` - Manager 에이전트 시스템 프롬프트
- `executor_system` - Executor 에이전트 시스템 프롬프트
- `codeact_system` - CodeAct 에이전트 시스템 프롬프트
- `codeact_user` - CodeAct 에이전트 사용자 프롬프트
- `scripter_system` - Scripter 에이전트 시스템 프롬프트

---

## 커스텀 도구에서 변수 접근

커스텀 도구는 `shared_state` 키워드 인수를 통해 변수를 직접 접근할 수 있습니다:

```python
from droidrun import DroidAgent, DroidrunConfig

def send_notification(title: str, *, tools=None, shared_state=None, **kwargs):
    """커스텀 변수의 채널을 사용하여 알림을 보냅니다.

    Args:
        title: 알림 제목
        tools: 도구 인스턴스 (선택사항, 자동으로 주입됨)
        shared_state: DroidAgentState (선택사항, 자동으로 주입됨)
    """
    if not shared_state:
        return "오류: shared_state가 필요합니다"

    # 커스텀 변수 접근
    channel = shared_state.custom_variables.get("notification_channel", "default")
    return f"'{title}'을(를) {channel}로 보냈습니다"

custom_tools = {
    "send_notification": {
        "arguments": ["title"],
        "description": "제목과 함께 알림을 보냅니다. 사용법: {\"action\": \"send_notification\", \"title\": \"Alert\"}",
        "function": send_notification
    }
}

config = DroidrunConfig()

agent = DroidAgent(
    goal="'Alert' 제목으로 알림 보내기",
    config=config,
    custom_tools=custom_tools,
    variables={"notification_channel": "alerts"}
)
```

---

## 사용 사례

### 매개변수화된 워크플로우

```python
# 다른 변수들로 재사용 가능한 워크플로우 정의
for user in ["alice@example.com", "bob@example.com"]:
    agent = DroidAgent(
        goal="환영 이메일 보내기",
        config=config,
        variables={"recipient": user},
        prompts=custom_prompts
    )
    await agent.run()
```

### 구성 데이터

```python
variables = {
    "api_endpoint": "https://api.example.com/v2",
    "timeout": 30
}

agent = DroidAgent(
    goal="API 엔드포인트 호출",
    config=config,
    variables=variables,
    prompts=custom_prompts
)
```

---

## 주요 포인트

1. **커스텀 프롬프트 필요** - 기본 프롬프트는 에이전트 컨텍스트에서 변수를 렌더링하지 않음
2. **도구에서 직접 접근** - 커스텀 도구는 키워드 인수를 통해 `shared_state.custom_variables`에 접근
3. **모든 에이전트에서 사용 가능** - Manager, Executor, CodeAct, Scripter 모두 변수를 받음
4. **Jinja2 템플릿** - 커스텀 프롬프트에서 `{% if variables %}` 블록 사용
5. **자동 주입** - `tools`와 `shared_state`는 Droidrun에 의해 자동으로 주입됨

## 관련 문서

- [커스텀 프롬프트](/concepts/prompts) - 에이전트 프롬프트 커스터마이징 방법
- [커스텀 도구](/features/custom-tools) - 커스텀 도구 함수 생성
- [DroidAgent SDK](/sdk/droid-agent) - 완전한 API 레퍼런스
