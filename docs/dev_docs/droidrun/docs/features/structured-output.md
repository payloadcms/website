---
title: '구조화된 출력'
description: 'Pydantic 모델을 사용하여 기기 상호작용에서 구조화된 데이터 추출'
---

## 빠른 시작

```python
import asyncio
from pydantic import BaseModel, Field
from droidrun import DroidAgent, DroidrunConfig

# 1. 출력 구조 정의
class ContactInfo(BaseModel):
    """기기로부터의 연락처 정보."""
    name: str = Field(description="연락처의 전체 이름")
    phone: str = Field(description="전화번호")
    email: str = Field(description="이메일 주소", default="제공되지 않음")

# 2. output_model과 함께 에이전트 생성
async def main():
    config = DroidrunConfig()

    agent = DroidAgent(
        goal="John Smith의 연락처 정보를 찾으세요",
        config=config,
        output_model=ContactInfo,
    )

    # 3. 실행하고 구조화된 출력에 접근
    result = await agent.run()

    if result.success and result.structured_output:
        contact: ContactInfo = result.structured_output
        print(f"이름: {contact.name}")
        print(f"전화번호: {contact.phone}")
        print(f"이메일: {contact.email}")

asyncio.run(main())
```

---

## 작동 방식

### 2단계 프로세스

**1단계: 작업 실행**
- DroidAgent는 필요한 정보를 수집하면서 기기 행동을 수행합니다
- 시스템 프롬프트에 자동으로 Pydantic 스키마가 주입됩니다
- 에이전트는 데이터를 포함한 자연어 답변으로 완료됩니다

**2단계: 추출 (완료 후)**
- `StructuredOutputAgent`가 최종 답변 텍스트를 받습니다
- LLM의 `astructured_predict()`를 사용하여 데이터를 모델로 추출합니다
- 스키마에 대해 검증하고 타입이 지정된 객체 또는 `None`을 반환합니다

---

## 예제: 청구서 추출

```python
from pydantic import BaseModel, Field
from typing import List

class Invoice(BaseModel):
    """청구서 정보."""
    invoice_number: str = Field(description="청구서 ID")
    vendor_name: str = Field(description="벤더 이름")
    total_due: float = Field(description="달러 단위 총 금액")

agent = DroidAgent(
    goal="Gmail을 열고 Acme Corp 이메일에서 청구서를 추출하세요",
    config=DroidrunConfig(),
    output_model=Invoice,
)

result = await agent.run()
invoice = result.structured_output
print(f"청구서 {invoice.invoice_number}: ${invoice.total_due}")
```

---

## 결과 작업

### 데이터 접근

```python
result = await agent.run()

if result.success:
    if result.structured_output:
        data = result.structured_output  # 타입이 지정된 Pydantic 객체
        print(f"추출됨: {data}")
    else:
        print(f"추출 실패, 텍스트 답변: {result.reason}")
else:
    print(f"작업 실패: {result.reason}")
```

### JSON으로 내보내기

```python
result = await agent.run()

if result.structured_output:
    # JSON으로 변환하여 저장
    json_str = result.structured_output.model_dump_json(indent=2)
    with open("output.json", "w") as f:
        f.write(json_str)
```

---

## 구성

### 커스텀 추출 LLM

기본적으로 추출은 `codeact` LLM을 사용합니다. 전용 `structured_output` 프로필을 지정하세요:

**config.yaml:**
```yaml
llm_profiles:
  codeact:
    provider: GoogleGenAI
    model: models/gemini-2.0-flash
    temperature: 0.3

  structured_output:
    provider: OpenAI
    model: gpt-4o-mini
    temperature: 0.0  # 일관된 추출을 위한 낮은 온도
```

**프로그래밍 방식:**
```python
from droidrun import load_llm

config = DroidrunConfig()

llms = {
    "codeact": load_llm("GoogleGenAI", "models/gemini-2.0-flash"),
    "structured_output": load_llm("OpenAI", "gpt-4o-mini"),
}

agent = DroidAgent(
    goal="Alice의 연락처 정보를 추출하세요",
    llms=llms,
    config=config,
    output_model=ContactInfo,
)
```

### 추론 모드

직접 모드와 추론 모드 모두에서 작동합니다:

```python
# 직접 모드
config = DroidrunConfig()
config.agent.reasoning = False

agent = DroidAgent(
    goal="SF 날씨를 찾으세요",
    config=config,
    output_model=WeatherInfo,
)

# 추론 모드
config.agent.reasoning = True

agent = DroidAgent(
    goal="SF 날씨를 찾으세요",
    config=config,
    output_model=WeatherInfo,
)
```

---

## 모범 사례

**1. 명확한 필드 설명 추가** - LLM이 무엇을 추출해야 하는지 이해하기 위해 사용됩니다:
```python
name: str = Field(description="주문을 한 고객의 전체 이름")
```

**2. 선택적 필드에 기본값 제공** - 추출 실패를 방지합니다:
```python
rating: Optional[float] = Field(description="고객 평점 (1-5)", default=None)
```

**3. 목표에서 데이터 수집 안내**:
```python
agent = DroidAgent(
    goal="연락처를 찾고 전화번호, 이메일, 전체 이름을 가져오세요",
    config=config,
    output_model=ContactInfo,
)
```

---

## 문제 해결

**추출이 None을 반환함:**
- `output_model`이 `DroidAgent`에 전달되었는지 확인하세요
- 작업이 성공했는지 확인: `result.success`
- 디버그 로깅 활성화: `config.logging.debug = True`

**부분적 또는 잘못된 데이터:**
- 더 구체적인 필드 설명 추가
- 목표에서 필요한 필드를 명시적으로 언급

**검증 오류:**
- 불확실한 필드에 `Optional`과 기본값 추가

---

## 고급

### 여러 항목

`List` 필드가 있는 모델을 사용하여 데이터 목록을 추출하세요:

```python
class ContactList(BaseModel):
    """여러 연락처."""
    contacts: List[ContactInfo] = Field(description="연락처 목록")

agent = DroidAgent(
    goal="John Smith와 Jane Doe의 연락처를 찾으세요",
    config=config,
    output_model=ContactList,
)
```

### 워크플로우 통합

추출은 `DroidAgent.finalize()`에서 자동으로 발생합니다:

```python
@step
async def finalize(self, ctx: Context, ev: FinalizeEvent) -> ResultEvent:
    result = ResultEvent(
        success=ev.success,
        reason=ev.reason,
        steps=self.shared_state.step_number,
        structured_output=None,
    )

    # 모델이 제공되면 추출
    if self.output_model is not None and ev.reason:
        structured_agent = StructuredOutputAgent(
            llm=self.structured_output_llm,
            pydantic_model=self.output_model,
            answer_text=ev.reason,
        )
        extraction_result = await (await structured_agent.run())
        if extraction_result["success"]:
            result.structured_output = extraction_result["structured_output"]

    return result
```

---

## 관련 문서

- [DroidAgent API](/sdk/droid-agent)
- [Pydantic 문서](https://docs.pydantic.dev/)
- [구성 가이드](/sdk/configuration)
- [커스텀 변수](/features/custom-variables)
