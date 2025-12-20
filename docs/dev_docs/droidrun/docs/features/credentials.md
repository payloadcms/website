---
title: '자격 증명 관리'
description: '안전한 자격 증명 관리로 Droidrun 확장'
---

## 개요

비밀번호, API 키, 토큰을 위한 안전한 저장소입니다.
- YAML 파일이나 메모리 내 딕셔너리에 저장
- 로깅되거나 노출되지 않음
- `type_secret` 행동으로 자동 주입
- 간단한 문자열 또는 딕셔너리 형식

## 빠른 시작

### 방법 1: 메모리 내 (SDK에 권장)

```python
import asyncio
from droidrun import DroidAgent, DroidrunConfig

async def main():
    # 자격 증명을 직접 정의
    credentials = {
        "MY_PASSWORD": "secret123",
        "API_KEY": "sk-1234567890"
    }

    config = DroidrunConfig()

    agent = DroidAgent(
        goal="내 앱에 로그인하세요",
        config=config,
        credentials=credentials  # 직접 전달
    )

    result = await agent.run()
    print(result.success)

asyncio.run(main())
```

### 방법 2: YAML 파일

1. **자격 증명 파일 생성:**

```yaml
# credentials.yaml
secrets:
  # 딕셔너리 형식 (권장)
  MY_PASSWORD:
    value: "your_password_here"
    enabled: true

  GMAIL_PASSWORD:
    value: "gmail_pass_123"
    enabled: true

  # 간단한 문자열 형식 (자동 활성화)
  API_KEY: "sk-1234567890abcdef"

  # 비활성화된 비밀
  OLD_PASSWORD:
    value: "old_pass"
    enabled: false  # 로드되지 않음
```

2. **config.yaml에서 활성화:**

```yaml
# config.yaml
credentials:
  enabled: true
  file_path: credentials.yaml
```

3. **코드에서 사용:**

```python
from droidrun import DroidAgent, DroidrunConfig

# 구성에서 파일로부터 자격 증명을 로드
config = DroidrunConfig.from_yaml("config.yaml")

agent = DroidAgent(
    goal="Gmail에 로그인하세요",
    config=config  # 자격 증명이 자동으로 로드됨
)
```

---

## 에이전트가 자격 증명을 사용하는 방법

자격 증명이 제공되면 `type_secret` 행동이 **자동으로 사용 가능**합니다:

### Executor/Manager 모드
```json
{
  "action": "type_secret",
  "secret_id": "MY_PASSWORD",
  "index": 5
}
```

### CodeAct 모드
```python
type_secret("MY_PASSWORD", index=5)
```

에이전트는 실제 값을 보지 못합니다 - 비밀 ID만 볼 수 있습니다.

---

## 예제: 로그인 자동화

```python
import asyncio
from droidrun import DroidAgent, DroidrunConfig

async def main():
    credentials = {
        "EMAIL_USER": "user@example.com",
        "EMAIL_PASS": "secret_password"
    }

    config = DroidrunConfig()

    agent = DroidAgent(
        goal="Gmail을 열고 내 자격 증명으로 로그인하세요",
        config=config,
        credentials=credentials
    )

    result = await agent.run()
    print(f"성공: {result.success}")

asyncio.run(main())
```

**에이전트가 하는 일:**
1. Gmail 열기: `open_app("Gmail")`
2. 이메일 필드 클릭: `click(index=3)`
3. 이메일 입력: `type("user@example.com", index=3)`
4. 비밀번호 필드 클릭: `click(index=5)`
5. 비밀번호 안전하게 입력: `type_secret("EMAIL_PASS", index=5)`
6. 로그인 클릭: `click(index=7)`

## 자격 증명 vs 변수

| 기능 | 자격 증명 | 변수 |
|-----|----------|------|
| **목적** | 비밀번호, API 키 | 민감하지 않은 데이터 |
| **저장소** | YAML 또는 메모리 내 | 메모리 내 전용 |
| **로깅** | 로깅되지 않음 | 로그에 나타날 수 있음 |
| **접근** | `type_secret` 도구를 통해 | 공유 상태에서 |
| **보안** | 보호됨 | 보호되지 않음 |

**예제: 변수 사용**
```python
variables = {
    "target_email": "john@example.com",
    "subject_line": "Monthly Report"
}

agent = DroidAgent(
    goal="{{target_email}}에게 이메일 작성",
    config=config,
    variables=variables  # 민감하지 않음
)
```

---

## 문제 해결

### 오류: 자격 증명 관리자가 초기화되지 않음

**해결책:**
```yaml
# config.yaml
credentials:
  enabled: true  # true여야 함
  file_path: credentials.yaml
```

또는:
```python
agent = DroidAgent(..., credentials={"PASSWORD": "secret"})
```

### 오류: 비밀 'X'를 찾을 수 없음

**사용 가능한 비밀 확인:**
```python
from droidrun.credential_manager import FileCredentialManager

cm = FileCredentialManager("credentials.yaml")
print(await cm.get_keys())
```

**YAML에서 확인:**
```yaml
secrets:
  X:
    value: "your_value"
    enabled: true  # true여야 함
```

---

## 커스텀 자격 증명 관리자

커스텀 비밀 저장을 위해 `CredentialManager`를 확장하세요:

```python
from droidrun.credential_manager import CredentialManager

class MyCredentialManager(CredentialManager):
    def __init__(self, api_key):
        self.api_key = api_key

    async def resolve_key(self, key: str) -> str:
        # 자신의 자격 증명 검색 로직 구현
        return await fetch_from_service(key, self.api_key)

    async def get_keys(self) -> list[str]:
        # 사용 가능한 자격 증명 키 목록 반환
        return await fetch_available_keys(self.api_key)

# 사용
credentials = MyCredentialManager(api_key="...")
agent = DroidAgent(goal="Login", config=config, credentials=credentials)
```

모든 커스텀 비밀 저장 백엔드를 구현하세요.

---

## 관련

자격 증명 설정을 위해 [구성 가이드](/sdk/configuration)를 참조하세요.

민감하지 않은 데이터는 [커스텀 변수](/features/custom-variables)를 참조하세요.
