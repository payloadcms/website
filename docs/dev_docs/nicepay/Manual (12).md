---
title: "Manual"
source: "https://developers.nicepay.co.kr/receipt.php"
author:
published:
created: 2025-11-29
description:
tags:
  - "clippings"
---
#### 영수증 호출 연동 개요

일반 영수증(매출전표)

- 전 결제수단에 대하여 결제가 완료된 후 영수증 조회가 가능합니다.
- 단, 가상계좌의 경우 가상계좌 발급 이후 입금이 완료되지 않으면 해당 거래 TID로는 영수증 조회가 불가합니다.

현금영수증

- 현금영수증 발급 가능 결제 수단: 계좌이체, 가상계좌
- 결제가 완료되면 고객이 기재한 현금영수증 발급 정보를 국세청으로 신고하며 국세청은 이를 검증합니다. 검증이 완료된 현금영수증은 다음 날 확인 가능합니다.
- 현금영수증 TID가 아닌 거래 TID는 현금영수증 조회가 불가능합니다.
- 현금영수증 발급 관련 국세청 문의는 국번없이 126, 내선번호 1-1로 문의해주세요.

#### 영수증 호출 파라미터

| 파라미터명 | 파라미터설명 |
| --- | --- |
| type | 1 byte 필수 영수증 구분(0: 일반, 1: 현금영수증) |
| TID | 30 byte 필수 거래 TID, type=1 설정 시 현금영수증 TID 입력 |

#### 영수증 호출 시 화면

구매자명+금액 인증

![](https://developers.nicepay.co.kr/images/receipt_auth_name_amount.png)

구매자 이메일 인증

![](https://developers.nicepay.co.kr/images/receipt_auth_email.png)

신용카드 번호 인증

![](https://developers.nicepay.co.kr/images/receipt_auth_cardno.png)

영수증(신용카드)

![](https://developers.nicepay.co.kr/images/receipt_example_card.png)