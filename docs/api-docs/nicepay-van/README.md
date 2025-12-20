# NicePay 결제 연동 가이드

> 수집일: 2025-12-17
> 출처: https://developers.nicepay.co.kr/, https://github.com/nicepayments/nicepay-manual

## 문서 구조

### 공통 (Common)
- 개발 준비
- API·JS SDK
- TEST·샘플코드
- 코드집

### API Documentation
- 결제·발급
- 조회
- 거래·정산·대사
- 취소·환불·망취소
- 웹훅 (Webhook)
- APP (iOS/Android)

### Management
- 지원환경
- 오류관리
- 개발정보

---

## Quick Guide (10분 TEST 개발)

### 필수 사전준비
1. 회원가입 완료
2. 샌드박스 환경 준비

### 기본 결제 흐름
```
1. JS SDK로 AUTHNICE.requestPay() 호출 → 결제창 실행
2. 카드사 인증 진행
3. 인증 결과를 returnUrl로 수신
4. tid(거래key)를 승인 API에 전달 → 결제 완료
```

---

## 핵심 API 엔드포인트

| 환경 | URL |
|------|-----|
| 결제창 JS SDK | `https://pay.nicepay.co.kr/v1/js/` |
| 승인 API (Sandbox) | `https://sandbox-api.nicepay.co.kr/v1/payments/{tid}` |
| 승인 API (운영) | `https://api.nicepay.co.kr/v1/payments/{tid}` |

### 네트워크 설정
- **HTTPS PORT**: 443
- **연결방향**: OUTBOUND
- **엔드포인트**: dc1-api, dc2-api, pg-api

---

## 인증 방식

**Basic Auth**
```
Authorization: Basic {Base64(clientKey:secretKey)}
```

---

## 샘플코드 저장소

| 언어 | GitHub |
|------|--------|
| Node.js | [nicepay-manual/node](https://github.com/nicepayments/nicepay-manual) |
| Python | [nicepay-manual/python](https://github.com/nicepayments/nicepay-manual) |
| Java | [nicepay-manual/java](https://github.com/nicepayments/nicepay-manual) |
| PHP | [nicepay-manual/php](https://github.com/nicepayments/nicepay-manual) |
| .NET | [nicepay-manual/dotnet](https://github.com/nicepayments/nicepay-manual) |

---

## API 카테고리

### 인증 결제 API
- 결제창 호출
- 카드 결제
- 계좌이체
- 가상계좌
- 휴대폰 결제

### 카드 빌링 API
- 정기결제
- 빌링키 발급/삭제

### 결제 조회 API
- 거래 조회
- 거래 내역

### 결제통보 (Webhook)
- 실시간 결제 결과 통보
- 가상계좌 입금 통보

### 취소/환불
- 전체 취소
- 부분 취소
- 망취소 처리

---

## 참고 링크

- [나이스페이 개발자센터](https://developers.nicepay.co.kr/)
- [GitHub 매뉴얼](https://github.com/nicepayments/nicepay-manual)
- [NICE VAN 서비스](https://www.nicevan.co.kr/)
