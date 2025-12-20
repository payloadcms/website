# 토스페이먼츠 결제 연동 가이드

> 수집일: 2025-12-17
> 출처: https://developers.tosspayments.com/

## 개발자센터 구조

### 주요 섹션
- **가이드**: 결제 연동 시작 가이드
- **API & SDK**: API 레퍼런스, SDK 레퍼런스, 기관 및 ENUM 코드
- **샌드박스**: 테스트 환경
- **커뮤니티·지원**: 시스템 상태, 실시간 문의, 용어사전, FAQ, 릴리즈 노트

---

## 핵심 특징

### "코드 한 줄로 연동되는 결제"
- SDK를 통한 다양한 결제서비스 통합
- 노코드 결제수단 운영 기능
- 코드 수정 없는 디자인 커스터마이징

---

## 제공 리소스

### SDK
- JavaScript SDK
- React SDK
- Vue SDK
- Android SDK
- iOS SDK

### 샘플코드
- [GitHub - React 샘플](https://github.com/tosspayments)
- [GitHub - JavaScript 샘플](https://github.com/tosspayments)

### 테스트 환경
- 브라우저 기반 샌드박스
- API 테스트 도구

---

## API 구조 (예상)

### 결제 API
```
POST /v1/payments          # 결제 요청
GET  /v1/payments/{key}    # 결제 조회
POST /v1/payments/{key}/cancel  # 결제 취소
```

### 빌링 API
```
POST /v1/billing/authorizations/card  # 카드 빌링키 발급
POST /v1/billing/{billingKey}         # 빌링키로 결제
```

### Webhook
- 결제 완료 통보
- 가상계좌 입금 통보
- 정기결제 결과 통보

---

## 나이스페이 vs 토스페이먼츠 비교

| 항목 | 나이스페이 | 토스페이먼츠 |
|------|-----------|-------------|
| 통신 방식 | HTTPS REST API | HTTPS REST API |
| 인증 | SHA-256 + Basic Auth | Secret Key 기반 |
| Webhook | 지원 | 지원 |
| SDK | Node.js, Java, PHP 등 | JS, React, Vue, Mobile |
| 테스트 | Sandbox 환경 | Sandbox 환경 |

---

## CareOn 연동 전략

### 권장 순서
1. **나이스페이 먼저** (VAN 연동, Webhook 실시간)
2. **토스페이먼츠 추후** (필요시 추가 연동)

### 통합 아키텍처
```
[나이스페이] ──Webhook──→ [CareOn Server]
                              ↓
[토스페이먼츠] ──Webhook──→ [Adapter Layer]
                              ↓
                    [Unified Transaction DB]
```

---

## 참고 링크

- [토스페이먼츠 개발자센터](https://developers.tosspayments.com/)
- [토스페이먼츠 GitHub](https://github.com/tosspayments)
- [API 문서](https://docs.tosspayments.com/)
