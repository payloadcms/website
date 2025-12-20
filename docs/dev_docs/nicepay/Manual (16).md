---
title: "Manual"
source: "https://developers.nicepay.co.kr/manual-digicert-apply.php"
author:
published:
created: 2025-11-29
description:
tags:
  - "clippings"
---
#### G2 인증서 변경 가이드

#### 🔑 G2 인증서 적용 개요

- 현재 나이스페이먼츠에서 사용 중인 보안 인증서(DigiCert Global Root CA)의 만료 및 보안 정책 강화에 따라 'DigiCert Global Root G2' 인증서로 변경됩니다. 이에 따라 가맹점에서 사용하는 인증서가 구버전 인증서(CA)인 경우 통신이 실패하여 결제가 진행되지 않을 수 있습니다.
- 관련 공지 내용은 [한국전자인증 'DigiCert SSL인증서 루트/체인 업데이트 (2023.03.08실행)' 공지](https://cert.crosscert.com/%EC%A4%91%EC%9A%94%EA%B3%B5%EC%A7%80-digicert-ssl%EC%9D%B8%EC%A6%9D%EC%84%9C-%EB%A3%A8%ED%8A%B8-%EC%B2%B4%EC%9D%B8-%EC%97%85%EB%8D%B0%EC%9D%B4%ED%8A%B8-2023-03-08%EC%8B%A4%ED%96%89/) 를 확인하시기 바랍니다.
  
  

#### 📌 가맹점 서버 내 인증서 교체 필요 사유

- 가맹점과 PG사 간 HTTPS 통신 시 중간 인증서(CA, G2 등)를 통해 가맹점에서 서버 인증서가 신뢰할 수 있는지를 판단합니다.
- 이로 인해 PG사가 사용하는 SSL 인증서의 체인(G2)이 바뀌면 서버 환경에 따라 가맹점의 서버도 그 체인을 인식할 수 있도록 신뢰 목록(Trust store)에 추가해야 합니다.  
	(가맹점에서 추가하지 않는 경우 결제 시 통신 자체가 실패할 수 있습니다.)
  
  

#### 🤷♂️ 적용 필요 가맹점

대부분의 최신 운영체제와 브라우저는 이미 G2 인증서를 포함하고 있어 추가 작업이 필요하지 않습니다.  
그러나 아래와 같은 경우 G2 인증서가 적용된 도메인과 통신이 가능한지 반드시 확인해야 하며,  
관련하여 테스트 방법은 아래 [통신 테스트 방법](https://developers.nicepay.co.kr/manual-digicert-apply.php#digicert-test-api) 항목을 참고해주세요.
📆 G2 인증서 적용 일자: 2025년 10월 14일 (화)

- 루트 인증서를 직접 지정(pinning)하거나 하드코딩한 경우
- 별도의 신뢰 저장소(Trust Store)를 사용하는 경우
- 폐쇄망 환경에서 TLS/SSL 인증을 사용하는 경우
- Java SE 8 8u361 버전 이하를 사용하는 경우
- Node 14 버전 이하를 사용하는 경우
- 이외 G2 인증서가 적용된 도메인으로 통신이 불가한 경우
  
  
  
  

#### 🔗 인증서 다운로드 URL

- 새로운 G2 인증서는 아래 URL에서 DigiCert Global Root G2 인증서를 다운로드 받은 후 서버에 적용하시기 바랍니다.- 다운로드 URL: [https://www.digicert.com/kb/digicert-root-certificates.htm](https://www.digicert.com/kb/digicert-root-certificates.htm)
  
  

#### 📋 인증서 교체 대상 도메인

**아래 도메인 중 사용하고 있는 도메인이 있다면,**  
**[통신 테스트 방법](https://developers.nicepay.co.kr/manual-digicert-apply.php#digicert-test-api) 에서 제시한 내용에 따라 테스트 API를 호출하여 정상적으로 통신하는지 확인이 필요합니다.**
- 결제창  
	\> web.nicepay.co.kr  
	\> pg-web.nicepay.co.kr  
	\> dc1-web.nicepay.co.kr  
	\> dc2-web.nicepay.co.kr
- WEBAPI  
	\> webapi.nicepay.co.kr  
	\> pg-api.nicepay.co.kr  
	\> pg-pay.nicepay.co.kr  
	\> dc1-api.nicepay.co.kr  
	\> dc2-api.nicepay.co.kr
- 대사  
	\> dc1-web.nicepay.co.kr  
	\> dc2-web.nicepay.co.kr
- 비대면 (ForStart)  
	\> pay.nicepay.co.kr  
	\> api.nicepay.co.kr  
	\> sandbox-pay.nicepay.co.kr  
	\> sandbox-api.nicepay.co.kr
- 자금이체, 계좌점유인증 등 서비스  
	\> service.nicepay.co.kr  
	\> service-api.nicepay.co.kr
  
  

통신 테스트 방법

통신 테스트는 반드시 서버 ↔ 서버로 진행해주셔야 합니다.  
브라우저를 이용한 호출은 정상적인 통신 여부를 판단할 수 없습니다.

요청 URI

```bash
POST https://dev.nicepay.co.kr/webapi/sslConnectionTest.jsp
Content-Type : application/x-www-form-urlencoded
```

요청 파라미터

| 파라미터명 | 타입 | 크기 | 필수 | 설명 |
| --- | --- | --- | --- | --- |
| MID | String | 10 byte | O | 가맹점 ID |

통신 성공 응답

```bash
{"code":200,"message":"success"}
```

통신 오류 예시

```bash
javax.net.ssl.SSLHandshakeException: sun.security.validator.ValidatorException: PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target ...
```

**⚠ 통신 오류 발생 시, 신뢰 목록(Trust store)에 DigiCert Global Root G2 인증서를 추가해야 합니다.**  

📅 테스트 기간: 2025.06.18(수) ~ 2025.10.13(월)

위 기간 내에 반드시 사전 테스트를 진행하여 문제가 없는지 확인해주시기 바랍니다.  
G2 인증서 설치에 대한 상세 내용은 아래 URL을 참고해주세요.  
G2 인증서 설치 방법 가이드 URL: [https://developers.nicepay.co.kr/manual-digicert-install-guide.php](https://developers.nicepay.co.kr/manual-digicert-install-guide.php)