---
title: 개요
---

Droidrun 가이드에 오신 것을 환영합니다! 이 섹션에서는 Droidrun 사용을 위한 단계별 지침과 모범 사례를 제공합니다. 각 가이드는 기기 설정부터 고급 자동화 패턴까지 프레임워크의 특정 측면에 초점을 맞춥니다.

---

## 사용 가능한 가이드

### 시작하기

**[CLI 레퍼런스](./cli)** - 완전한 명령줄 인터페이스 가이드
- 모든 CLI 명령어 (`run`, `setup`, `devices`, `connect`, `ping`, `macro`)
- 구성 재정의와 플래그
- 환경 변수와 API 키
- 일반 워크플로우와 문제 해결

**[기기 설정](./device-setup)** - Android 및 iOS 기기 설정
- Portal 앱 설치 및 구성
- 접근성 서비스 활성화
- TCP vs Content Provider 통신
- 무선 디버깅과 다중 기기 관리

**[구성 시스템](/sdk/configuration)** - 구성 기반 아키텍처 마스터하기
- YAML 구성 구조
- 에이전트별 LLM 프로필 (Manager, Executor, CodeAct, Scripter)
- LLM 제공업체 혼합 (OpenAI, Anthropic, Google, Ollama, DeepSeek)
- 안전 실행, 프롬프트, 앱 카드

---

### 템플릿

[droidrun-examples 저장소](https://github.com/droidrun/droidrun-examples)에서 실제 예제와 스타터 프로젝트를 탐색하세요:

- **[LinkedInJobsScraper](https://github.com/droidrun/droidrun-examples/tree/main/LinkedInJobsScraper)** - LinkedIn에서 역할을 검색하고, 일치도를 평가하며, 맞춤 지원서를 준비하는 에이전트 워크플로우
- **[LinkedInLeads](https://github.com/droidrun/droidrun-examples/tree/main/LinkedInLeads)** - LinkedIn 회사와 역할을 위한 엔드투엔드 리드 발견과 강화
- **[TwitterPost](https://github.com/droidrun/droidrun-examples/tree/main/TwitterPost)** - 트렌딩 주제를 찾고, 게시물을 초안 작성하며, X/Twitter에 게시할 이미지를 생성
- **[play2048](https://github.com/droidrun/droidrun-examples/tree/main/play2048)** - play2048.co에서 2048 게임을 플레이하는 DroidAgent

각 예제에는 진입점, 구성, 샘플 데이터가 포함된 독립 실행형 워크플로우가 있습니다. 설정 지침과 기여 가이드라인은 [README](https://github.com/droidrun/droidrun-examples)를 참조하세요.


---

도움이 필요하신가요? 지원과 토론을 위해 [Discord 커뮤니티](https://discord.gg/ZZbKEZZkwK)에 참여하세요.
