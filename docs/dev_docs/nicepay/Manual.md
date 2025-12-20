---
title: "Manual"
source: "https://developers.nicepay.co.kr/"
author:
published:
created: 2025-11-29
description:
tags:
  - "clippings"
---
#### Quickstart

1. 방화벽 설정
	| 프로토콜 | 연결대상 |
	| --- | --- |
	| HTTPS | PORT: 443 연결방향: OUTBOUND   dc1-api.nicepay.co.kr (121.133.126.56)   dc2-api.nicepay.co.kr (211.44.32.56)   pg-api.nicepay.co.kr (121.133.126.56, 211.44.32.56) |
	```bash
	telnet 121.133.126.56 443
	telnet 211.44.32.56 443
	nslookup dc1-api.nicepay.co.kr
	nslookup dc2-api.nicepay.co.kr
	nslookup pg-api.nicepay.co.kr
	```
	제품에 알맞는 IP / Port를 확인 하여 방화벽 설정을 합니다.
	방화벽 설정이 정상적으로 되었는지 확인 합니다.(telnet, nslookup)
2. https 통신이 원활한 환경을 준비 합니다
	SSL 인증서가 없는 경우 승인 호출이 원활하지 않을 수 있습니다.
3. 상세 파라미터 확인은 API문서를 확인 합니다.
4. 기술문의
	메일로 API, 요청/응답값과 증상의 상세내용을 전달 하면 빠른 응대가 가능 합니다.
	it@nicevan.co.kr

#### 결제/취소 데모

- 결제 및 취소 데모 페이지를 통해 연동 전 나이스페이의 결제 서비스 흐름을 미리 체험해볼수 있습니다.
- 결제 데모 페이지를 통해 결제된 거래에 대하여 별도 취소 요청이 없는 경우 결제 당일 23시 30분에 자동 취소됩니다.
  

#### 다운로드 (결제 샘플코드)

- **결제 샘플코드** 는 매뉴얼을 기반하여 제작되었으며 필수 파라미터 및 결제 흐름 파악 용도로 사용 가능합니다.
- 실제 결제 연동 개발은 API를 참고 후 가맹점 결제 프로세스 예외사항을 고려하여 개발합니다.