---
title: 'ScripterAgent'
description: 'API 호출, 파일 작업, 데이터 처리를 위한 오프-디바이스 Python 실행.'
---

## ScripterAgent란 무엇인가?

**ScripterAgent**는 기기 상호작용이 필요하지 않은 작업을 위한 **오프-디바이스 Python 코드**를 실행합니다. API 호출, 파일 작업, 또는 데이터 처리가 필요할 때 ManagerAgent에 의해 트리거됩니다.

ScripterAgent는 다음을 가능하게 합니다:
- **API 호출**: REST API, 웹훅, 데이터베이스 쿼리
- **파일 작업**: 읽기, 쓰기, 파일 파싱
- **데이터 처리**: JSON/CSV 파싱, 변환, 필터링

**주요 차이점**: ScripterAgent는 **기기와 상호작용하지 않는** 코드를 실행하는 반면, CodeActAgent는 **기기 원자적 행동을 사용하는** 코드를 생성합니다.

## 작동 방식

ManagerAgent는 **전체 컨텍스트와 고수준 작업 설명**을 제공하여 ScripterAgent에 작업을 위임합니다. ScripterAgent는 **ReAct 에이전트**로, 생각-실행-관찰 루프를 따릅니다:

1. **Manager로부터 전체 컨텍스트와 함께 작업을 받음**
2. **생각하고** 진행을 위한 Python 코드를 생성
3. **코드를 실행하고** 출력을 관찰
4. **작업이 완료될 때까지** 2-3단계를 반복
5. **결과를 요약하는 메시지를** Manager에게 반환

ScripterAgent는 작업 완료를 **코드 없는 메시지** 반환으로 알립니다 (함수 호출이 아님). Jupyter 노트북처럼 변수가 반복 간에 유지됩니다.

## 예제

### API 호출

**Manager 위임**:
```
사용자가 샌프란시스코의 현재 날씨를 확인하여 옷차림을 결정해야 합니다.
작업: API에서 날씨를 가져와 온도와 상태를 추출
API: https://api.weather.com/forecast?city=San Francisco
```

**ScripterAgent (반복 1)**:
```python
# 생각: 날씨 데이터를 얻기 위해 API 요청을 해야 합니다
import requests

response = requests.get(
    "https://api.weather.com/forecast",
    params={"city": "San Francisco"}
)
print(response.json())
```
**출력**: `{'temp': 62, 'description': 'Partly cloudy', 'humidity': 65}`

**ScripterAgent (최종)**:
```
샌프란시스코의 날씨는 62°F로 부분적으로 흐립니다.
```
*(Manager가 이 메시지를 받음)*

### 웹훅 알림

**Manager 위임**:
```
항공권 예약이 2024-01-15T10:30:00에 성공적으로 완료되었습니다.
작업: 모니터링 웹훅에 상태 업데이트 전송
웹훅 URL: https://webhook.site/your-webhook-id
포함: 작업 이름, 상태, 타임스탬프
```

**ScripterAgent**:
```python
import requests

payload = {
    "task": "Flight booking completed",
    "status": "success",
    "timestamp": "2024-01-15T10:30:00"
}

response = requests.post(
    "https://webhook.site/your-webhook-id",
    json=payload
)
print(f"Webhook response: {response.status_code}")
```
**출력**: `Webhook response: 200`

**ScripterAgent (최종)**:
```
웹훅 알림을 성공적으로 전송했습니다. 서버가 상태 200으로 응답했습니다.
```

### 파일 작업

**Manager 위임**:
```
/tmp/contacts.csv 파일에 모든 연락처가 있습니다.
작업: 뉴욕 연락처를 필터링하여 JSON으로 저장
출력: /tmp/filtered_contacts.json
```

**ScripterAgent (반복 1)**:
```python
import csv

with open('/tmp/contacts.csv', 'r') as f:
    reader = csv.DictReader(f)
    contacts = list(reader)
print(f"총 연락처: {len(contacts)}")
print(f"샘플: {contacts[0]}")
```
**출력**: `총 연락처: 150` `샘플: {'name': 'John', 'city': 'New York', 'email': '...'}`

**ScripterAgent (반복 2)**:
```python
import json

# 뉴욕 연락처 필터링
ny_contacts = [c for c in contacts if c['city'] == 'New York']

with open('/tmp/filtered_contacts.json', 'w') as f:
    json.dump(ny_contacts, f, indent=2)

print(f"뉴욕에서 {len(ny_contacts)}명의 연락처를 필터링했습니다")
```
**출력**: `뉴욕에서 23명의 연락처를 필터링했습니다`

**ScripterAgent (최종)**:
```
뉴욕에서 23명의 연락처를 찾았고 /tmp/filtered_contacts.json에 저장했습니다
```

## 구성

```yaml
agent:
  scripter:
    max_steps: 10
    safe_execution:
      enabled: true
      allowed_modules:
        - requests    # API 호출, 웹훅
        - json        # JSON 파싱
        - csv         # CSV 파일 작업
        - pathlib     # 파일 경로 처리
      blocked_modules:
        - subprocess  # 프로세스 생성
        - os          # 시스템 작업
        - sys         # 시스템 수정
```

**안전 실행**은 기본적으로 위험한 작업을 제한합니다. `allowed_modules`에 있는 모듈만 가져올 수 있습니다.

## 주요 포인트

- **ReAct 에이전트**: 작업 완료까지 생각-실행-관찰 루프
- **오프-디바이스 전용**: 기기 상호작용 없음
- **상태 유지**: 반복 간에 변수 유지 (Jupyter 스타일)
- **완료 신호**: 완료 시 코드 없는 메시지 반환
- **기본적으로 안전**: 제한된 가져오기/내장 함수