---
title: '빠른 시작'
description: 'Droidrun을 빠르고 효과적으로 시작하고 실행하세요'
---

<iframe
  className="w-full aspect-video rounded-xl"
  src="https://www.youtube.com/embed/4WT7FXJah2I"
  title="YouTube video player"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

이 가이드는 Droidrun을 빠르게 설치하고 실행할 수 있도록 도와드립니다. 몇 분 안에 자연어로 Android 기기를 제어할 수 있습니다.

### 사전 요구사항

Droidrun을 설치하기 전에 다음 사항들을 확인하세요:

1. **Python 3.11+**이 시스템에 설치되어 있어야 합니다
2. [Android Debug Bridge (adb)](https://developer.android.com/studio/releases/platform-tools)가 설치되고 구성되어 있어야 합니다
3. **Android 기기**에 다음 설정이 활성화되어 있어야 합니다:
   - [개발자 옵션 활성화](https://developer.android.com/studio/debug/dev-options)
   - USB 디버깅 활성화
   - USB로 연결되거나 같은 네트워크에 있어야 함 (무선 디버깅용)

### 설치

Droidrun은 빠른 Python 패키지 설치 및 해결사인 [`uv`](https://docs.astral.sh/uv/)를 사용하여 설치됩니다.

**uv 설치하기 (아직 설치되지 않은 경우):**

```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

**설치 방법을 선택하세요:**

**CLI 사용만 필요한 경우:**
```bash
uv tool install 'droidrun[google,anthropic,openai,deepseek,ollama,openrouter]'
```

**CLI + Python 코드 통합이 필요한 경우:**
```bash
uv pip install 'droidrun[google,anthropic,openai,deepseek,ollama,openrouter]'
```

<Note>
특정 제공업체만 필요한 경우 해당 제공업체만 설치할 수 있습니다. 예를 들어, `uv tool install 'droidrun[google,openai]'`는 Google Gemini와 OpenAI 지원만 설치합니다.
</Note>

### Portal APK 설정

Droidrun은 기기 제어를 위해 Android 기기에 Portal 앱이 설치되어 있어야 합니다. Portal 앱은 접근성 서비스를 제공하여 UI 접근성 트리를 노출시키고, 에이전트가 UI 요소를 보고 상호작용할 수 있게 합니다.

```bash
droidrun setup
```

이 명령은 자동으로 다음 작업을 수행합니다:
1. 최신 Portal APK 다운로드
2. 연결된 기기에 설치
3. 접근성 서비스 활성화

### 연결 테스트

Droidrun이 기기와 통신할 수 있는지 확인하세요:

```bash
droidrun ping
```

성공하면 다음과 같은 메시지가 표시됩니다:
```
✓ Portal is running
✓ Accessibility service enabled
✓ Device ready
```

### LLM 구성

Droidrun은 구성 기반 접근 방식을 사용합니다. 처음 실행 시 Droidrun은 기본 설정으로 `config.yaml` 파일을 생성합니다. 선택한 LLM 제공업체의 API 키를 설정해야 합니다.

**API 키 설정하기:**

```bash
# Google Gemini용 (기본값)
export GOOGLE_API_KEY=your-api-key-here

# OpenAI용
export OPENAI_API_KEY=your-api-key-here

# Anthropic Claude용
export ANTHROPIC_API_KEY=your-api-key-here

# DeepSeek용
export DEEPSEEK_API_KEY=your-api-key-here
```

### CLI를 통한 첫 번째 명령 실행

이제 자연어로 기기를 제어할 준비가 되었습니다:

```bash
# 기본 구성 사용 (Google Gemini)
droidrun run "설정 앱을 열고 Android 버전을 알려주세요"

# 제공업체와 모델 재정의
droidrun run "배터리 수준을 확인하세요" --provider OpenAI --model gpt-4o

# 비전 모드 활성화 (스크린샷을 LLM으로 전송)
droidrun run "현재 어떤 앱이 열려 있나요?" --vision

# 추론 모드 활성화 (복잡한 작업을 위한 매니저-실행자 워크플로우 사용)
droidrun run "John이라는 연락처를 찾고 이메일을 보내세요" --reasoning
```

**일반적인 CLI 플래그:**
- `--provider` - LLM 제공업체 (GoogleGenAI, OpenAI, Anthropic 등)
- `--model` - 모델 이름 (models/gemini-2.5-pro, gpt-4o 등)
- `--vision` - 스크린샷 처리 활성화
- `--reasoning` - 다중 에이전트 계획 모드 활성화
- `--steps N` - 최대 실행 단계 수 (기본값: 15)
- `--debug` - 상세 로깅 활성화

### 스크립트를 통한 간단한 에이전트 생성

복잡한 자동화나 Python 프로젝트 통합을 위해 스크립트를 생성하세요:

```python
import asyncio
from droidrun import DroidAgent, DroidrunConfig

async def main():
    # 내장 LLM 프로필과 함께 기본 구성 사용
    config = DroidrunConfig()

    # 에이전트 생성
    # LLM은 config.llm_profiles에서 자동으로 로드됩니다
    agent = DroidAgent(
        goal="설정을 열고 배터리 수준을 확인하세요",
        config=config,
    )

    # 에이전트 실행
    result = await agent.run()

    # 결과 확인 (result는 ResultEvent 객체입니다)
    print(f"성공: {result.success}")
    print(f"이유: {result.reason}")
    print(f"단계: {result.steps}")

if __name__ == "__main__":
    asyncio.run(main())
```

## 다음 단계

이제 Droidrun이 실행되고 있으니 다음 주제들을 탐색해보세요:

- [가이드](/guides/overview) 둘러보기
- [에이전트 아키텍처](/concepts/architecture)에 대해 배우기
- 에이전트 [구성 시스템](/sdk/configuration) 커스터마이징
- [앱 카드](/features/app-cards)로 에이전트 안내하기


---