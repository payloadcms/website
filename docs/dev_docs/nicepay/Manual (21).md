---
title: "Manual"
source: "https://developers.nicepay.co.kr/manual-exception.php#flow-exception-pc"
author:
published:
created: 2025-11-29
description:
tags:
  - "clippings"
---
인증완료시 Signature필드 값을 통해 응답 위변조 체크

승인완료시 Signature필드 값을 통해 응답 위변조 체크

[![](https://developers.nicepay.co.kr/images/api_secure_flow.jpg)](https://developers.nicepay.co.kr/images/api_secure_flow.jpg)

API 호출 실패한 경우 인증 완료 후 승인 요청시 Connection time-out 발생한 경우

API 응답 실패한 경우 API 호출 후 Read time-out 발생한 경우

[![](https://developers.nicepay.co.kr/images/api_call_flow.jpg)](https://developers.nicepay.co.kr/images/api_call_flow.jpg)

| 파라미터명 | 파라미터설명 |
| --- | --- |
| TID | 30 byte 필수 거래 ID |
| AuthToken | 40 byte 필수 인증 TOKEN |
| MID | 10 byte 필수 가맹점 ID |
| Amt | 12 byte 금액 |
| EdiDate | 14 byte 필수 전문생성일시 (YYYYMMDDHHMMSS) |
| NetCancel | 1 byte 필수 1 고정 (망취소 여부) |
| SignData | 256 byte 필수 hex(sha256(AuthToken + MID + Amt + EdiDate + MerchantKey)) |
| CharSet | 10 byte 인증 응답 인코딩 (euc-kr(default) / utf-8) |
| EdiType | 10 byte 응답전문 유형 (JSON / KV) \*KV:Key=value |
| MallReserved | 500 byte 가맹점 여분 필드 |

| 파라미터명 | 파라미터설명 |
| --- | --- |
| ResultCode | 4 byte 필수 취소 결과 코드 예) 2001 \*상세 내용 결과코드 참조 |
| ResultMsg | 100 byte 필수 취소 결과 메시지 예) 취소 성공 \*상세 내용 결과코드 참조 |
| CancelAmt | 12 byte 필수 취소 금액 예) 1000원인 경우 -> 000000001000 |
| MID | 10 byte 필수 가맹점 ID 예) nictest00m |
| Moid | 64 byte 필수 가맹점 주문번호 |
| Signature | 500 byte hex(sha256(TID + MID + CancelAmt + MerchantKey)), 위변조 검증 데이터   응답 데이터 유효성 검증을 위해 가맹점 수준에서 비교하는 로직 구현을 권고합니다. |
| PayMethod | 10 byte   CARD: 신용카드   BANK: 계좌이체   VBANK: 가상계좌   CELLPHONE: 휴대폰결제 |
| TID | 30 byte 거래 ID |
| CancelDate | 8 byte 취소일자 (YYYYMMDD) |
| CancelTime | 6 byte 취소시간 (HHmmss) |
| CancelNum | 8 byte 취소번호 |
| RemainAmt | 12 byte 취소 후 잔액 예) 잔액이 1000원인 경우 -> 000000001000 |
| MallReserved | 500 byte 가맹점 여분 필드 |

goPay()함수 호출 후 결제창 노출에 실패하는 경우 인증 요청이 실패한 경우

인증 응답에 실패 하는 경우 결제창은 노출 되었으나 인증 응답이 없는 경우

[![](https://developers.nicepay.co.kr/images/auth_flow_mobile_error_v2.png)](https://developers.nicepay.co.kr/images/auth_flow_mobile_error_v2.png)

goPay()함수 호출에 실패하는 경우 PC 결제창 호출에 실패한 경우

사용자가 결제 인증에 실패 하는경우 결제창은 노출 되었으나 인증 응답이 없는 경우

사용자가 결제창 종료 버튼을 클릭 하는경우 결제창 종료 이벤트 처리

[![](https://developers.nicepay.co.kr/images/auth_flow_pc_error.jpg)](https://developers.nicepay.co.kr/images/auth_flow_pc_error.jpg)