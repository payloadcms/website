---
title: '트레이싱'
description: 'Phoenix/Langfuse 트레이싱과 궤적 기록 구성'
---

Droidrun은 여러 모니터링 기능을 제공합니다:

1. **LLM 트레이싱** - Arize Phoenix 또는 Langfuse를 통한 실시간 실행 트레이싱
2. **궤적 기록** - 디버깅을 위한 로컬 스크린샷과 UI 상태

## 빠른 참조

```sh
# Phoenix 트레이싱 활성화
droidrun run "task" --tracing

# 궤적 기록 활성화
droidrun run "task" --save-trajectory step
```

---

## LLM 트레이싱

Droidrun은 LLM 호출, 에이전트 실행, 도구 호출의 실시간 모니터링을 위해 두 개의 트레이싱 제공업체를 지원합니다:

- **Arize Phoenix** (기본값) - 오픈소스 관측성 플랫폼
- **Langfuse** - 클라우드와 자체 호스팅 옵션이 있는 LLM 엔지니어링 플랫폼

에이전트 동작 디버깅, 토큰 사용량 모니터링, 실행 플로우 분석에 트레이싱을 사용하세요.

---

### Arize Phoenix 트레이싱

### 설정

**1. Phoenix 설치:**

```sh
uv pip install arize-phoenix
```

**2. Phoenix 서버 시작:**

```sh
phoenix serve
```

서버는 `http://localhost:6006`에서 시작되며 트레이스 보기용 웹 UI를 제공합니다.

**3. Droidrun에서 트레이싱 활성화:**

**CLI를 통해:**

```sh
droidrun run "설정 열기" --tracing
```

**config.yaml을 통해:**

```yaml
tracing:
  enabled: true
```

**코드를 통해:**

```python
from droidrun import DroidAgent, DroidrunConfig

config = DroidrunConfig()
config.tracing.enabled = True

agent = DroidAgent(goal="설정 열기", config=config)
agent.run()
```

**4. 트레이스 보기:**

`http://localhost:6006`로 이동하여 다음을 확인하세요:
- 프롬프트, 응답, 토큰 수와 함께 LLM 호출
- 에이전트 워크플로우 실행 (Manager, Executor, CodeAct)
- 도구 호출과 그 결과
- 실행 시간과 오류

Phoenix 사용에 대한 자세한 내용은 [Arize Phoenix 문서](https://docs.arize.com/phoenix)를 참조하세요.

**Phoenix 구성**

Phoenix를 커스터마이징하기 위해 환경 변수를 설정하세요:

```sh
# 커스텀 Phoenix 서버 URL (기본값: http://127.0.0.1:6006)
export phoenix_url=http://localhost:6006

# 트레이스 정리용 프로젝트 이름
export phoenix_project_name=my_droidrun_project
```

<Note>
환경 변수 이름은 소문자입니다: `phoenix_url`와 `phoenix_project_name`.
</Note>

---

### Langfuse 트레이싱

Langfuse는 세션 추적, 사용자 분석, 비용 모니터링과 같은 기능으로 LLM 관측성을 제공합니다.

**설정**

**1. Langfuse 자격 증명 얻기:**
- **클라우드**: [cloud.langfuse.com](https://cloud.langfuse.com)에서 가입
- **자체 호스팅**: [Langfuse 문서](https://langfuse.com/docs/deployment/self-host)를 사용하여 배포

**2. Droidrun 구성:**

**환경 변수를 통해:**
```sh
export LANGFUSE_SECRET_KEY=sk-lf-...
export LANGFUSE_PUBLIC_KEY=pk-lf-...
export LANGFUSE_HOST=https://cloud.langfuse.com
```

**config.yaml을 통해:**
```yaml
tracing:
  enabled: true
  provider: langfuse
  langfuse_secret_key: sk-lf-...
  langfuse_public_key: pk-lf-...
  langfuse_host: https://cloud.langfuse.com
  langfuse_user_id: user@example.com  # 선택사항: 사용자별 추적
  langfuse_session_id: ""              # 선택사항: 커스텀 세션 ID
```

**코드를 통해:**
```python
from droidrun import DroidAgent, DroidrunConfig, TracingConfig

config = DroidrunConfig(
    tracing=TracingConfig(
        enabled=True,
        provider="langfuse",
        langfuse_secret_key="sk-lf-...",
        langfuse_public_key="pk-lf-...",
        langfuse_host="https://cloud.langfuse.com",
        langfuse_user_id="user@example.com",
    )
)

agent = DroidAgent(goal="설정 열기", config=config)
await agent.run()
```

**3. 트레이스 보기:**

Langfuse 대시보드로 이동하여 다음을 확인하세요:
- 프롬프트, 완료, 토큰 사용량과 함께 LLM 호출
- 에이전트 실행 트레이스와 중첩된 워크플로우
- 세션 기반 분석과 비용 추적
- 사용자 수준 메트릭 (`langfuse_user_id`가 설정된 경우)

Langfuse 사용에 대한 자세한 내용은 [Langfuse 문서](https://langfuse.com/docs)를 참조하세요.

---

## 궤적 기록

궤적 기록은 오프라인 디버깅과 분석을 위해 로컬에 스크린샷과 UI 상태를 저장합니다. 텔레메트리(PostHog로 전송)와 트레이싱(Phoenix로 전송)과 달리 궤적은 컴퓨터에 남아 있습니다.

### 기록 레벨

| 레벨 | 저장되는 내용 | 사용 시기 |
|------|--------------|-----------|
| `none` (기본값) | 아무것도 없음 | 프로덕션 사용, 디스크 공간 절약 |
| `step` | 에이전트 단계당 스크린샷 + 상태 | 일반 디버깅, 대부분의 사용 사례에 권장 |
| `action` | 원자적 행동당 스크린샷 + 상태 | 상세 디버깅, 모든 탭/스와이프/타이핑 캡처 |

**참고:** `action` 레벨은 `step` 레벨보다 훨씬 더 많은 파일을 생성합니다.

### 기록 활성화

**CLI를 통해:**

```sh
droidrun run "설정 열기" --save-trajectory step
```

**config.yaml을 통해:**

```yaml
logging:
  save_trajectory: step  # none | step | action
```

**코드를 통해:**

```python
from droidrun import DroidAgent, DroidrunConfig

config = DroidrunConfig()
config.logging.save_trajectory = "action"

agent = DroidAgent(goal="설정 열기", config=config)
agent.run()
```

### 출력 위치

궤적은 작업 디렉토리의 `trajectories/`에 저장됩니다:

```
trajectories/
└── 2025-10-17_14-30-45_open_settings/
    ├── step_000_screenshot.png
    ├── step_000_state.json
    ├── step_001_screenshot.png
    └── step_001_state.json
```

각 궤적 폴더에는 다음이 포함됩니다:
- **스크린샷** - 각 단계/행동에서의 기기 화면 PNG 이미지
- **상태 파일** - 다음을 포함한 JSON 파일:
  - UI 접근성 트리 (ID, 텍스트, 범위가 있는 요소 계층)
  - 실행된 행동 (예: `click(5)`, `type("hello", 3)`)
  - 에이전트 추론과 단계 번호
  - 기기 상태 (현재 앱 패키지, 액티비티)

다음 용도로 이러한 파일을 사용하세요:
- 에이전트가 특정 결정을 내린 이유 디버깅
- 실패한 실행 재현
- UI 요소 감지 문제 분석
- 에이전트 개선을 위한 훈련 데이터셋 구축

---

## 관련 문서

- [구성 시스템](/sdk/configuration) - 트레이싱과 텔레메트리 설정 구성
- [이벤트와 워크플로우](/concepts/events-and-workflows) - 커스텀 모니터링 통합 구축
- [CLI 사용법](/guides/cli) - 모니터링용 명령줄 플래그
