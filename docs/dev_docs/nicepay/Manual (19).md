---
title: "Manual"
source: "https://developers.nicepay.co.kr/tip.php"
author:
published:
created: 2025-11-29
description:
tags:
  - "clippings"
---
```markup
<!-- EX) 상품가격이 1,004 원인 경우 -->
<!-- Amt = SupplyAmt + GoodsVat + ServiceAmt + TaxFreeAmt -->

<!-- 필드명:Amt / 사이즈:12 / 설명:결제 총액 -->
<input type="hidden" name="Amt" value="1004">

<!-- 필드명:SupplyAmt / 사이즈:12 / 설명:공급가 액 -->
<input type="hidden" name="SupplyAmt" value="900">

<!-- 필드명:GoodsVat / 사이즈:12 / 설명:부가가 치세 -->
<input type="hidden" name="GoodsVat" value="104">

<!-- 필드명:ServiceAmt / 사이즈:12 / 설명:봉사료 -->
<input type="hidden" name="ServiceAmt" value="0">

<!-- 필드명:TaxFreeAmt / 사이즈:12 / 설명:면세 금액 -->
<input type="hidden" name="TaxFreeAmt" value="0">
```

```markup
TID = MID(10byte) + 지불수단(2byte) + 매체구분(2byte) + 시간정보(yyMMddHHmmss) + 랜덤(4byte)

설명 및 예시)
MID            : 가맹점 아이디, 끝에 소문자 m이 기재되어 있음. (예시: nicepay00m)
지불수단    : 결제수단별 코드, (구분: 01=CARD(신용카드), 02=BANK(계좌이체), 03=VBANK(가상계좌), 05=CELLPHONE(휴대폰결제))
매체구분    : 거래 형태, (구분: 01=일반결제, 10=부분취소, 16=빌링결제)
시간정보    : 결제 요청 일시(YYMMDDHHMISS), (예시: 250521132224)
랜덤        : 거래를 식별하기 위한 임의의 값 4자리, (예시: 0123)

TID 생성 예시) 
상황        : nicepay00m 아이디로 2025년 5월 21일 13시 22분 24초에 가상계좌 발급 API 요청 시 생성 rule
            -> nicepay00m03012505211322240123
```

| 파라미터명 | 파라미터설명 |
| --- | --- |
| RefundAcctNo | 16 byte 가상계좌, 휴대폰 익월 환불 Only 환불계좌번호 (숫자만) |
| RefundBankCd | 3 byte 가상계좌, 휴대폰 익월 환불 Only 환불계좌코드 (\*은행코드 참고) |
| RefundAcctNm | 10 byte 가상계좌, 휴대폰 익월 환불 Only 환불계좌주명 (euc-kr) |

```markup
<!-- 필드명:ReturnURL / 사이즈:500 / 설명:인증 완료 결과 처리 URL-->
<input type="hidden" name="ReturnURL" value="https://가맹점 URL">
```

```markup
<!-- 필드명:MID / 사이즈:10 / 설명:가맹점 MID-->
<input type="hidden" name="MID" value="nicepay00m"> //test MID : nicepay00m
```

```markup
<!-------결제 수단------->
<!-- CARD: 신용카드 -->
<!-- BANK: 계좌이체 -->
<!-- VBANK: 가상계좌  -->
<!-- CELLPHONE: 휴대폰결제  -->

<!-- 필드명:PayMethod / 사이즈:10 / 설명:결제 수단-->
<input type="hidden" name="PayMethod" value="CARD"> //ex) CARD: 신용카드
```