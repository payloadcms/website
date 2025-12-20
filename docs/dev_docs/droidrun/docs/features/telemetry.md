---
title: '텔레메트리'
description: '익명 텔레메트리 구성'
---
# 텔레메트리가 필요한 이유

텔레메트리는 다음과 같은 도움을 줍니다:
- 가장 많이 사용되는 기능과 개선이 필요한 기능을 식별
- 실제 사용량을 기반으로 버그 수정과 새 기능을 우선순위화
- Droidrun이 다양한 환경에서 잘 작동하는지 확인

<b>개인 정보나 민감한 데이터를 수집하지 않습니다.</b> 모든 텔레메트리는 엄격하게 익명화되며 모두를 위한 프레임워크 개선에만 사용됩니다.

질문이나 우려사항이 있으시면 [GitHub](https://github.com/droidrun/droidrun)에서 연락하거나 개인정보 보호 정책을 확인하세요.

---

# 텔레메트리 토글

Droidrun은 가장 가치 있는 기능과 개선이 필요한 부분을 이해하기 위해 <b>익명화된</b> 사용 데이터를 수집합니다. 이 데이터는 <b>절대</b> 광고나 개인 추적에 사용되지 않으며 커뮤니티를 위해 Droidrun을 더 좋게 만드는 데만 사용됩니다.

## 텔레메트리 비활성화 방법

다음 환경 변수를 설정하여 언제든지 텔레메트리를 비활성화할 수 있습니다:

```bash
export DROIDRUN_TELEMETRY_ENABLED=false
```

셸 프로필(예: `.bashrc`, `.zshrc`, 또는 `.profile`)에 이 줄을 추가하여 세션 간에 유지되도록 하세요.

## 텔레메트리 다시 활성화 방법

텔레메트리를 다시 활성화하려면 환경 변수를 `true`로 설정하세요:

```bash
export DROIDRUN_TELEMETRY_ENABLED=true
```

또는 환경에서 변수를 제거하여 기본값(활성화) 동작을 사용하세요.

```sh
echo 'export DROIDRUN_TELEMETRY_ENABLED=false' >> ~/.bashrc
source ~/.bashrc
```

<Note>
텔레메트리는 현재 `DROIDRUN_TELEMETRY_ENABLED` 환경 변수로만 제어됩니다. 구성 스키마에 `telemetry.enabled` 구성 옵션이 존재하지만 텔레메트리 시스템에서는 현재 사용되지 않습니다.
</Note>

---
