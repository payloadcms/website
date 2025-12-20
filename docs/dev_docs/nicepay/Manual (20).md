---
title: "Manual"
source: "https://developers.nicepay.co.kr/manual-auth.php"
author:
published:
created: 2025-11-29
description:
tags:
  - "clippings"
---
1. goPay() function을 호출한 후 결제 파라미터를 가공하여 payment.jsp로 submit 합니다.
2. 사용자는 결제창으로 진입 후 인증사(카드사,간편결제 etc) 선택 뒤 인증 과정을 진행 합니다.
3. 중요 인증 완료 후 인증 응답은 최초 결제창 호출시 ReturnURL 값으로 전달된 URL로 리턴 됩니다. (API 파라미터 참고)
4. 가맹점 server-side에서 인증 결과를 catch후 승인 API를 호출 합니다.
5. 승인 결과 파라미터를 참고하여 이후 프로세스를 진행 합니다.
6. Web-view로 모바일 결제를 구현 하는 경우 WapUrl, IspCancelUrl을 반드시 추가 합니다.

[![](https://developers.nicepay.co.kr/images/auth_mobile_flow_detail_v2.png)](https://developers.nicepay.co.kr/images/auth_mobile_flow_detail_v2.png)

1. goPay() function을 호출 하여 결제창 레이어 팝업을 호출 합니다.
2. 결제창 background css dim처리는 goPay() function 호출시 전달된 document form object의 element 기준으로 처리 됩니다.
3. 사용자가 인증 과정을 완료하면 결제창은 nicepaySubmit() function을 콜백 합니다.
4. 콜백과 동시에 인증결과 form object를 form action target으로 submit 합니다.
5. 가맹점은 해당 target server-side에서 인증 결과를 catch후 승인 API를 호출 합니다.
6. 승인 결과 파라미터를 참고하여 이후 프로세스를 진행 합니다.

[![](https://developers.nicepay.co.kr/images/auth_pc_flow_detail_v2.png)](https://developers.nicepay.co.kr/images/auth_pc_flow_detail_v2.png)

| 파라미터 | 설명 |
| --- | --- |
| GoodsName | 40 byte 필수 결제상품명 (euc-kr)   쌍따옴표", 대괄호\[\] 등 특수기호 사용 시 별도 문의 필요 |
| Amt | 12 byte 필수 금액 (숫자만 입력) |
| MID | 10 byte 필수 가맹점아이디 ex)nicepay00m |
| EdiDate | 30 byte 필수 요청 시간 (YYYYMMDDHHMISS) |
| Moid | 64 byte 필수 상품주문번호   일부 제휴사(간편결제 등)에 대해 거래주문번호로 사용되며,   고유한 값이 아니거나 한글 및 특수문자가 포함된 경우 제휴사에서 거절 처리될 수 있습니다.   이에 숫자 및 영문 조합의 고유한 값 입력을 권장합니다. |
| SignData | 500 byte 필수 hex(sha256(EdiDate + MID + Amt + MerchantKey)), 위변조 검증 데이터 |
| PayMethod | 10 byte 필수 결제수단   CARD: 신용카드   BANK: 계좌이체   VBANK: 가상계좌   CELLPHONE: 휴대폰결제 |
| ReturnURL | 500 byte 모바일 필수 요청 응답 URL (절대 경로) |
| BuyerName | 30 byte 구매자명 (euc-kr) |
| BuyerTel | 20 byte 구매자연락처 (Only number) |
| ReqReserved | 500 byte 가맹점 여분 필드 |
| BuyerEmail | 60 byte 구매자 메일주소 |
| CharSet | 12 byte 인증 응답 인코딩 (euc-kr(default) / utf-8) |
| VbankExpDate | 12 byte 가상계좌 추가 파라미터 가상계좌입금만료일 (YYYYMMDDHHMM) |
| GoodsCl | 1 byte 휴대폰 소액결제 추가 파라미터 0:컨텐츠, 1:실물 |
| ConnWithIframe | 1 byte iframe 기반 연동 시 추가 파라미터 Y:iframe 기반 NICEPAY 인증 호출   미입력 시 일반 form 객체 전달 (iframe 기반 연동 시에만 해당 옵션 사용) |

| 파라미터 | 설명 |
| --- | --- |
| AuthResultCode | 4 byte 인증 결과 코드, 0000: 성공 (이외 실패) |
| AuthResultMsg | 2000 byte 인증 결과 메시지 |
| AuthToken | 40 byte 인증 토큰 |
| PayMethod | 10 byte   CARD: 신용카드   BANK: 계좌이체   VBANK: 가상계좌   CELLPHONE: 휴대폰결제 |
| MID | 10 byte 가맹점 아이디 |
| Moid | 64 byte 상품 주문번호 |
| Signature | 500 byte hex(sha256(AuthToken+MID+Amt+MerchantKey)), 위변조 검증 데이터   응답 데이터 유효성 검증을 위해 가맹점 수준에서 비교하는 로직 구현을 권고합니다. |
| Amt | 12 byte 금액 |
| ReqReserved | 500 byte 가맹점 여분 필드 |
| TxTid | 30 byte 거래 ID |
| NextAppURL | 255 byte 인증 성공한 경우 리턴됨 승인 요청 URL   최종 결제를 위한 승인 요청할 URL 입니다. 인증결과를 포함하여, NextAppURL로 POST 처리합니다.      아래 2개의 URL 중 하나로 응답됩니다.   https://dc1-api.nicepay.co.kr/webapi/pay\_process.jsp   https://dc2-api.nicepay.co.kr/webapi/pay\_process.jsp |
| NetCancelURL | 255 byte 인증 성공한경우 리턴됨 망취소 요청 URL   승인요청 후 기타오류(Network 지연 또는 가맹점 내부 처리오류) 발생시, 취소를 요청할 URL입니다.   거래대사 불일치 방지를 위해, 망취소 처리할 것을 권고합니다.      아래 2개의 URL 중 하나로 응답됩니다.   https://dc1-api.nicepay.co.kr/webapi/cancel\_process.jsp   https://dc2-api.nicepay.co.kr/webapi/cancel\_process.jsp      망취소 가이드 링크: [망취소 파라미터 / 가이드](https://developers.nicepay.co.kr/#flow-netcancel-detail) |

```java
<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.Date" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="java.security.MessageDigest" %>
<%@ page import="org.apache.commons.codec.binary.Hex" %>
<%
/*
*******************************************************
* <결제요청 파라미터>
* 결제시 Form 에 보내는 결제요청 파라미터입니다.
* 샘플페이지에서는 기본(필수) 파라미터만 예시되어 있으며, 
* 추가 가능한 옵션 파라미터는 연동메뉴얼을 참고하세요.
*******************************************************
*/
String merchantKey         = "EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg=="; // 상점키
String merchantID         = "nicepay00m";                 // 상점아이디
String goodsName         = "나이스페이";                     // 결제상품명
String price             = "1004";                         // 결제상품금액    
String buyerName         = "나이스";                         // 구매자명
String buyerTel         = "01000000000";                 // 구매자연락처
String buyerEmail         = "happy@day.co.kr";             // 구매자메일주소
String moid             = "mnoid1234567890";             // 상품주문번호    
String returnURL         = "http://localhost:8080/nicepay3.0_utf-8/payResult_utf.jsp"; // 결과페이지(절대경로) - 모바일 결제창 전용

/*
*******************************************************
* <해쉬암호화> (수정하지 마세요)
* SHA-256 해쉬암호화는 거래 위변조를 막기위한 방법입니다. 
*******************************************************
*/
DataEncrypt sha256Enc     = new DataEncrypt();
String ediDate             = getyyyyMMddHHmmss();    
String signData         = sha256Enc.encrypt(ediDate + merchantID + price + merchantKey);
%>
<!DOCTYPE html>
<html>
<head>
<title>NICEPAY PAY REQUEST(UTF-8)</title>
<meta charset="utf-8">
<style>
    html,body {height: 100%;}
    form {overflow: hidden;}
</style>
<script src="https://pg-web.nicepay.co.kr/v3/common/js/nicepay-pgweb.js" type="text/javascript"></script>
<script type="text/javascript">
//결제창 최초 요청시 실행됩니다.
function nicepayStart(){
    goPay(document.payForm);
}

//[PC 결제창 전용]결제 최종 요청시 실행됩니다. <<'nicepaySubmit()' 이름 수정 불가능>>
function nicepaySubmit(){
    document.payForm.submit();
}

//[PC 결제창 전용]결제창 종료 함수 <<'nicepayClose()' 이름 수정 불가능>>
function nicepayClose(){
    alert("결제가 취소 되었습니다");
}

</script>
</head>
<body>
<form name="payForm" method="post" action="payResult_utf.jsp" accept-charset="euc-kr">
    <table>
        <tr>
            <th><span>결제 수단</span></th>
            <td><input type="text" name="PayMethod" value=""></td>
        </tr>
        <tr>
            <th><span>결제 상품명</span></th>
            <td><input type="text" name="GoodsName" value="<%=goodsName%>"></td>
        </tr>
        <tr>
            <th><span>결제 상품금액</span></th>
            <td><input type="text" name="Amt" value="<%=price%>"></td>
        </tr>                
        <tr>
            <th><span>상점 아이디</span></th>
            <td><input type="text" name="MID" value="<%=merchantID%>"></td>
        </tr>    
        <tr>
            <th><span>상품 주문번호</span></th>
            <td><input type="text" name="Moid" value="<%=moid%>"></td>
        </tr> 
        <tr>
            <th><span>구매자명</span></th>
            <td><input type="text" name="BuyerName" value="<%=buyerName%>"></td>
        </tr>     
        <tr>
            <th>구매자명 이메일</th>
            <td><input type="text" name="BuyerEmail" value="<%=buyerEmail%>"></td>
        </tr>            
        <tr>
            <th><span>구매자 연락처</span></th>
            <td><input type="text" name="BuyerTel" value="<%=buyerTel%>"></td>
        </tr>     
        <tr>
            <th><span>인증완료 결과처리 URL<!-- (모바일 결제창 전용)PC 결제창 사용시 필요 없음 --></span></th>
            <td><input type="text" name="ReturnURL" value="<%=returnURL%>"></td>
        </tr>
        <tr>
            <th>가상계좌입금만료일(YYYYMMDD)</th>
            <td><input type="text" name="VbankExpDate" value=""></td>
        </tr>        
                    
        <!-- 옵션 --> 
        <input type="hidden" name="GoodsCl" value="1"/>                        <!-- 상품구분(실물(1),컨텐츠(0)) -->
        <input type="hidden" name="TransType" value="0"/>                    <!-- 일반(0)/에스크로(1) --> 
        <input type="hidden" name="CharSet" value="utf-8"/>                    <!-- 응답 파라미터 인코딩 방식 -->
        <input type="hidden" name="ReqReserved" value=""/>                    <!-- 상점 예약필드 -->
                    
        <!-- 변경 불가능 -->
        <input type="hidden" name="EdiDate" value="<%=ediDate%>"/>            <!-- 전문 생성일시 -->
        <input type="hidden" name="SignData" value="<%=signData%>"/>    <!-- 해쉬값 -->
    </table>
    <a href="#" class="btn_blue" onClick="nicepayStart();">요 청</a>
</form>
</body>
</html>
<%!
public final synchronized String getyyyyMMddHHmmss(){
    SimpleDateFormat yyyyMMddHHmmss = new SimpleDateFormat("yyyyMMddHHmmss");
    return yyyyMMddHHmmss.format(new Date());
}
// SHA-256 형식으로 암호화
public class DataEncrypt{
    MessageDigest md;
    String strSRCData = "";
    String strENCData = "";
    String strOUTData = "";
    
    public DataEncrypt(){ }
    public String encrypt(String strData){
        String passACL = null;
        MessageDigest md = null;
        try{
            md = MessageDigest.getInstance("SHA-256");
            md.reset();
            md.update(strData.getBytes());
            byte[] raw = md.digest();
            passACL = encodeHex(raw);
        }catch(Exception e){
            System.out.print("암호화 에러" + e.toString());
        }
        return passACL;
    }
    
    public String encodeHex(byte [] b){
        char [] c = Hex.encodeHex(b);
        return new String(c);
    }
}
%>
```

```php
<?php
header("Content-Type:text/html; charset=utf-8;"); 
/*
*******************************************************
* <결제요청 파라미터>
* 결제시 Form 에 보내는 결제요청 파라미터입니다.
* 샘플페이지에서는 기본(필수) 파라미터만 예시되어 있으며, 
* 추가 가능한 옵션 파라미터는 연동메뉴얼을 참고하세요.
*******************************************************
*/  

$merchantKey = "EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg=="; // 상점키
$MID         = "nicepay00m"; // 상점아이디
$goodsName   = "나이스페이"; // 결제상품명
$price       = "1004"; // 결제상품금액
$buyerName   = "나이스"; // 구매자명 
$buyerTel     = "01000000000"; // 구매자연락처
$buyerEmail  = "happy@day.co.kr"; // 구매자메일주소        
$moid        = "mnoid1234567890"; // 상품주문번호                     
$returnURL     = "http://localhost:8080/payResult.php"; // 결과페이지(절대경로) - 모바일 결제창 전용

/*
*******************************************************
* <해쉬암호화> (수정하지 마세요)
* SHA-256 해쉬암호화는 거래 위변조를 막기위한 방법입니다. 
*******************************************************
*/ 
$ediDate = date("YmdHis");
$signData = bin2hex(hash('sha256', $ediDate.$MID.$price.$merchantKey, true));
?>
<!DOCTYPE html>
<html>
<head>
<title>NICEPAY PAY REQUEST(EUC-KR)</title>
<meta charset="utf-8">
<style>
    html,body {height: 100%;}
    form {overflow: hidden;}
</style>
<script src="https://pg-web.nicepay.co.kr/v3/common/js/nicepay-pgweb.js" type="text/javascript"></script>
<script type="text/javascript">
//결제창 최초 요청시 실행됩니다.
function nicepayStart(){
    goPay(document.payForm);
}

//[PC 결제창 전용]결제 최종 요청시 실행됩니다. <<'nicepaySubmit()' 이름 수정 불가능>>
function nicepaySubmit(){
    document.payForm.submit();
}

//[PC 결제창 전용]결제창 종료 함수 <<'nicepayClose()' 이름 수정 불가능>>
function nicepayClose(){
    alert("결제가 취소 되었습니다");
}

</script>
</head>
<body>
<form name="payForm" method="post" action="payResult_utf.php" accept-charset="euc-kr">
    <table>
        <tr>
            <th>결제 수단</th>
            <td><input type="text" name="PayMethod" value=""></td>
        </tr>
        <tr>
            <th>결제 상품명</th>
            <td><input type="text" name="GoodsName" value="<?php echo($goodsName)?>"></td>
        </tr>
        <tr>
            <th>결제 상품금액</th>
            <td><input type="text" name="Amt" value="<?php echo($price)?>"></td>
        </tr>                
        <tr>
            <th>상점 아이디</th>
            <td><input type="text" name="MID" value="<?php echo($MID)?>"></td>
        </tr>    
        <tr>
            <th>상품 주문번호</th>
            <td><input type="text" name="Moid" value="<?php echo($moid)?>"></td>
        </tr> 
        <tr>
            <th>구매자명</th>
            <td><input type="text" name="BuyerName" value="<?php echo($buyerName)?>"></td>
        </tr>
        <tr>
            <th>구매자명 이메일</th>
            <td><input type="text" name="BuyerEmail" value="<?php echo($buyerEmail)?>"></td>
        </tr>        
        <tr>
            <th>구매자 연락처</th>
            <td><input type="text" name="BuyerTel" value="<?php echo($buyerTel)?>"></td>
        </tr>     
        <tr>
            <th>인증완료 결과처리 URL<!-- (모바일 결제창 전용)PC 결제창 사용시 필요 없음 --></th>
            <td><input type="text" name="ReturnURL" value="<?php echo($returnURL)?>"></td>
        </tr>
        <tr>
            <th>가상계좌입금만료일(YYYYMMDD)</th>
            <td><input type="text" name="VbankExpDate" value=""></td>
        </tr>        
                    
        <!-- 옵션 -->     
        <input type="hidden" name="GoodsCl" value="1"/>                        <!-- 상품구분(실물(1),컨텐츠(0)) -->
        <input type="hidden" name="TransType" value="0"/>                    <!-- 일반(0)/에스크로(1) --> 
        <input type="hidden" name="CharSet" value="utf-8"/>                <!-- 응답 파라미터 인코딩 방식 -->
        <input type="hidden" name="ReqReserved" value=""/>                    <!-- 상점 예약필드 -->
                    
        <!-- 변경 불가능 -->
        <input type="hidden" name="EdiDate" value="<?php echo($ediDate)?>"/>            <!-- 전문 생성일시 -->
        <input type="hidden" name="SignData" value="<?php echo($signData)?>"/>    <!-- 해쉬값 -->
    </table>
    <a href="#" class="btn_blue" onClick="nicepayStart();">요 청</a>
</form>
</body>
</html>
```

```csharp
<%@ Page Language="C#"  AutoEventWireup="true" Src="payRequest.aspx.cs" Inherits="payRequest"  %>

<!DOCTYPE html>
<html>
<head>
<title>NICEPAY PAY REQUEST(UTF-8)</title>
<meta charset="utf-8">
<script src="https://pg-web.nicepay.co.kr/v3/common/js/nicepay-pgweb.js" type="text/javascript"></script>
<script type="text/javascript">
//결제창 최초 요청시 실행됩니다.
function nicepayStart(){
    goPay(document.payForm);
}

//[PC 결제창 전용]결제 최종 요청시 실행됩니다. <<'nicepaySubmit()' 이름 수정 불가능>>
function nicepaySubmit(){
    document.payForm.submit();
}

//[PC 결제창 전용]결제창 종료 함수 <<'nicepayClose()' 이름 수정 불가능>>
function nicepayClose(){
    alert("결제가 취소 되었습니다");
}

</script>
<style>
    html,body {height: 100%;}
    form {overflow: hidden;}
</style>
</head>
<body>
<form name="payForm" method="post" action="payResult.aspx" accept-charset="euc-kr">
    <table>
        <tr>
            <th><span>결제 수단</span></th>
            <td><input type="text" name="PayMethod" value=""></td>
        </tr>
        <tr>
            <th><span>결제 상품명</span></th>
            <td><input type="text" name="GoodsName" value="<%=goodsName%>"></td>
        </tr>
        <tr>
            <th><span>결제 상품금액</span></th>
            <td><input type="text" name="Amt" value="<%=price%>"></td>
        </tr>                
        <tr>
            <th><span>상점 아이디</span></th>
            <td><input type="text" name="MID" value="<%=merchantID%>"></td>
        </tr>    
        <tr>
            <th><span>상품 주문번호</span></th>
            <td><input type="text" name="Moid" value="<%=moid%>"></td>
        </tr> 
        <tr>
            <th><span>구매자명</span></th>
            <td><input type="text" name="BuyerName" value="<%=buyerName%>"></td>
        </tr>     
        <tr>
            <th><span>구매자 연락처</span></th>
            <td><input type="text" name="BuyerTel" value="<%=buyerTel%>"></td>
        </tr>     
        <tr>
            <th><span>인증완료 결과처리 URL<!-- (모바일 결제창 전용)PC 결제창 사용시 필요 없음 --></span></th>
            <td><input type="text" name="ReturnURL" value="<%=returnURL%>"></td>
        </tr>
                    
        <!-- 옵션 -->
        <input type="hidden" name="VbankExpDate" id="vExp"/>  <!-- 가상계좌입금만료일 -->
        <input type="hidden" name="BuyerEmail" value="<%=buyerEmail%>"/>    <!-- 구매자 이메일 -->         
        <input type="hidden" name="GoodsCl" value="1"/>  <!-- 상품구분(실물(1),컨텐츠(0)) -->
        <input type="hidden" name="TransType" value="0"/>  <!-- 일반(0)/에스크로(1) --> 
        <input type="hidden" name="CharSet" value="utf-8"/>  <!-- 응답 파라미터 인코딩 방식 -->
        <input type="hidden" name="ReqReserved" value=""/>  <!-- 상점 예약필드 -->
                    
        <!-- 변경 불가능 -->
        <input type="hidden" name="EdiDate" value="<%=ediDate%>"/>  <!-- 전문 생성일시 -->
        <input type="hidden" name="SignData" value="<%=signData%>"/>  <!-- 해쉬값 -->
    </table>

    <a href="#" class="btn_blue" onClick="nicepayStart();">요 청</a>

</form>
</body>
</html>
```

```python
<!DOCTYPE html>
<html>
<head>
<title>NICEPAY PAY REQUEST(UTF-8)</title>
<meta charset="utf-8">
<style>
    html,body {height: 100%;}
    form {overflow: hidden;}
</style>
<script src="https://pg-web.nicepay.co.kr/v3/common/js/nicepay-pgweb.js" type="text/javascript"></script>
<script type="text/javascript">
//결제창 최초 요청시 실행됩니다.
function nicepayStart(){
    goPay(document.payForm);
}

//[PC 결제창 전용]결제 최종 요청시 실행됩니다. <<'nicepaySubmit()' 이름 수정 불가능>>
function nicepaySubmit(){
    document.payForm.submit();
}

//[PC 결제창 전용]결제창 종료 함수 <<'nicepayClose()' 이름 수정 불가능>>
function nicepayClose(){
    alert("결제가 취소 되었습니다");
}

</script>
</head>
<body>
<form name="payForm" method="post" action="/authReq" accept-charset="euc-kr">
    <table>
        <tr>
            <th>PayMethod</th>
            <td><input type="text" name="PayMethod" value=""></td>
        </tr>
        <tr>
            <th>GoodsName</th>
            <td><input type="text" name="GoodsName" value="{{GoodsName}}"></td>
        </tr>
        <tr>
            <th>Amt</th>
            <td><input type="text" name="Amt" value="{{Amt}}"></td>
        </tr>                
        <tr>
            <th>MID</th>
            <td><input type="text" name="MID" value="{{MID}}"></td>
        </tr>    
        <tr>
            <th>Moid</th>
            <td><input type="text" name="Moid" value="{{Moid}}"></td>
        </tr> 
        <tr>
            <th>BuyerName</th>
            <td><input type="text" name="BuyerName" value="{{BuyerName}}"></td>
        </tr>
        <tr>
            <th>BuyerEmail</th>
            <td><input type="text" name="BuyerEmail" value="{{BuyerEmail}}"></td>
        </tr>        
        <tr>
            <th>BuyerTel</th>
            <td><input type="text" name="BuyerTel" value="{{BuyerTel}}"></td>
        </tr>     
        <tr>
            <th>ReturnURL [Mobile only]</th>
            <td><input type="text" name="ReturnURL" value="{{ReturnURL}}"></td>
        </tr>
        <tr>
            <th>Virtual Account Expiration Date(YYYYMMDD)</th>
            <td><input type="text" name="VbankExpDate" value=""></td>
        </tr>        
        
        <input type="hidden" name="NpLang" value="KO"/> <!-- EN:English, CN:Chinese, KO:Korean -->                    
        <input type="hidden" name="GoodsCl" value="1"/> <!-- products(1), contents(0)) -->
        <input type="hidden" name="TransType" value="0"/>    <!-- USE escrow false(0)/true(1) -->
        <input type="hidden" name="CharSet" value="utf-8"/>    <!-- Return CharSet -->
        <input type="hidden" name="ReqReserved" value=""/>    <!-- mall custom field -->
                    
        <!-- DO NOT CHANGE -->
        <input type="hidden" name="EdiDate" value="{{EdiDate}}"/>            <!-- YYYYMMDDHHMISS -->
        <input type="hidden" name="SignData" value="{{signData}}"/>    <!-- signData -->
    </table>
    <a href="#" class="btn_blue" onClick="nicepayStart();">REQUEST</a>
</form>
</body>
</html>
```

```javascript
<!DOCTYPE html>
<html>
<head>
<title>NICEPAY PAY REQUEST(UTF-8)</title>
<meta charset="utf-8">
<style>
    html,body {height: 100%;}
    form {overflow: hidden;}
</style>
<script src="https://pg-web.nicepay.co.kr/v3/common/js/nicepay-pgweb.js" type="text/javascript"></script>
<script type="text/javascript">
//결제창 최초 요청시 실행됩니다.
function nicepayStart(){
    goPay(document.payForm);
}

//[PC 결제창 전용]결제 최종 요청시 실행됩니다. <<'nicepaySubmit()' 이름 수정 불가능>>
function nicepaySubmit(){
    document.payForm.submit();
}

//[PC 결제창 전용]결제창 종료 함수 <<'nicepayClose()' 이름 수정 불가능>>
function nicepayClose(){
    alert("결제가 취소 되었습니다");
}

</script>
</head>
<body>
<form name="payForm" method="post" action="/authReq" accept-charset="euc-kr">
    <table>
        <tr>
            <th>PayMethod</th>
            <td><input type="text" name="PayMethod" value=""></td>
        </tr>
        <tr>
            <th>GoodsName</th>
            <td><input type="text" name="GoodsName" value="<%=goodsName%>"></td>
        </tr>
        <tr>
            <th>Amt</th>
            <td><input type="text" name="Amt" value="<%=amt%>"></td>
        </tr>                
        <tr>
            <th>MID</th>
            <td><input type="text" name="MID" value="<%=merchantID%>"></td>
        </tr>    
        <tr>
            <th>Moid</th>
            <td><input type="text" name="Moid" value="<%=moid%>"></td>
        </tr> 
        <tr>
            <th>BuyerName</th>
            <td><input type="text" name="BuyerName" value="<%=buyerName%>"></td>
        </tr>
        <tr>
            <th>BuyerEmail</th>
            <td><input type="text" name="BuyerEmail" value="<%=buyerEmail%>"></td>
        </tr>        
        <tr>
            <th>BuyerTel</th>
            <td><input type="text" name="BuyerTel" value="<%=buyerTel%>"></td>
        </tr>     
        <tr>
            <th>ReturnURL [Mobile only]</th>
            <td><input type="text" name="ReturnURL" value="<%=returnURL%>"></td>
        </tr>
        <tr>
            <th>Virtual Account Expiration Date(YYYYMMDD)</th>
            <td><input type="text" name="VbankExpDate" value=""></td>
        </tr>        
        
        <input type="hidden" name="NpLang" value="KO"/> <!-- EN:English, CN:Chinese, KO:Korean -->                    
        <input type="hidden" name="GoodsCl" value="1"/> <!-- products(1), contents(0)) -->
        <input type="hidden" name="TransType" value="0"/>    <!-- USE escrow false(0)/true(1) -->
        <input type="hidden" name="CharSet" value="utf-8"/>    <!-- Return CharSet -->
        <input type="hidden" name="ReqReserved" value=""/>    <!-- mall custom field -->
                    
        <!-- DO NOT CHANGE -->
        <input type="hidden" name="EdiDate" value="<%=ediDate%>"/>            <!-- YYYYMMDDHHMISS -->
        <input type="hidden" name="SignData" value="<%=signData%>"/>    <!-- signData -->
    </table>
    <a href="#" class="btn_blue" onClick="nicepayStart();">REQUEST</a>
</form>
</body>
</html>
```

```json
# 인증 응답 예시
# Type: key-value pair
# Method : POST 

AuthResultCode=0000 #인증결과코드
AuthResultMsg=인증 성공 #인증결과 메시지
AuthToken=NICETOKNF435F661A2D54ED799BFB9F4B3F7E369 #인증 TOKEN
PayMethod=VBANK #결제수단
MID=nicepay00m #상점 아이디
Moid=mnoid1234567890 #상점 주문번호
Amt=1004 #금액
ReqReserved=test #상점 여분필드
TxTid=nicepay00m03011911140919215275 #거래아이디
NextAppURL=        #승인 요청 URL, 아래 두 url 중 하나로 응답
            https://dc1-api.nicepay.co.kr/webapi/pay_process.jsp  
            https://dc2-api.nicepay.co.kr/webapi/pay_process.jsp      
NetCancelURL=    #망취소 요청 URL, 아래 두 url 중 하나로 응답
            https://dc1-api.nicepay.co.kr/webapi/cancel_process.jsp 
            https://dc2-api.nicepay.co.kr/webapi/cancel_process.jsp
# 승인 API 호출 예시
# Target : 인증 응답 시 NextAppURL 파라미터로 응답된 URL
# Protocol: HTTP/1.1
# Method : POST 
# Encoding : EUC-KR
# Content-Type : application/x-www-form-urlencoded;
# MerchantKey : EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg==
# SignData-Rule : hex(sha256(AuthToken + MID + Amt + EdiDate + MerchantKey))
# SignData-PlainText : NICETOKNF435F661A2D54ED799BFB9F4B3F7E369nicepay00m100420191114011808EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg==
# SignData : 599644cf3295920f3199f5f151f7abda5a85e3777fbeefe5738e265101435a65

TID=nicepay00m03011911140919215275 #인증 응답 TxTid 값 사용
AuthToken=NICETOKNF435F661A2D54ED799BFB9F4B3F7E369 #인증 응답 AuthToken 값 사용
MID=nicepay00m
Amt=1004 #가맹점은 금액 변경 여부를 다시한번 체크 할수 있습니다.
EdiDate=20191114011808 #YYYYMMDDHHMMSS
CharSet=euc-kr
EdiType=JSON
SignData=599644cf3295920f3199f5f151f7abda5a85e3777fbeefe5738e265101435a65

# 승인 응답은 승인 API 호출 응답 파라미터 확인
```

| 파라미터명 | 파라미터설명 |
| --- | --- |
| TID | 30 byte 필수 거래번호 (인증 응답 TxTid 사용) |
| AuthToken | 40 byte 필수 인증 TOKEN |
| MID | 10 byte 필수 가맹점아이디 ex)nicepay00m |
| Amt | 12 byte 필수 금액 (숫자만) |
| EdiDate | 14 byte 필수 전문생성일시 (YYYYMMDDHHMMSS) |
| SignData | 256 byte 필수 hex(sha256(AuthToken + MID + Amt + EdiDate + MerchantKey)) |
| CharSet | 10 byte 인증 응답 인코딩 (euc-kr(default) / utf-8) |
| EdiType | 10 byte 응답전문 유형 (JSON / KV) \*KV:Key=value |
| MallReserved | 500 byte 가맹점 여분 필드 |

| 파라미터명 | 파라미터설명 |
| --- | --- |
| ResultCode | 4 byte   3001: 신용카드 성공코드   4000: 계좌이체 성공코드   4100: 가상계좌 발급 성공코드   A000: 휴대폰 소액결제 성공코드   7001: 현금영수증 |
| ResultMsg | 100 byte 결과메시지 (euc-kr) |
| Amt | 12 byte 금액 예)1000원인 경우 -> 000000001000 |
| MID | 10 byte 가맹점 ID 예) nictest00m |
| Moid | 64 byte 가맹점 주문번호 |
| Signature | 500 byte hex(sha256(TID + MID + Amt + MerchantKey)), 위변조 검증 데이터   응답 데이터 유효성 검증을 위해 가맹점 수준에서 비교하는 로직 구현을 권고합니다. |
| BuyerEmail | 60 byte 옵션 메일주소 예) test@abc.com |
| BuyerTel | 20 byte 옵션 구매자 연락처 |
| BuyerName | 30 byte 옵션 구매자명 |
| GoodsName | 40 byte 상품명 |
| TID | 30 byte 거래ID 예)nictest00m01011104191651325596 |
| AuthCode | 30 byte 옵션 승인 번호 (신용카드, 계좌이체, 휴대폰) |
| AuthDate | 12 byte YYMMDDHHMMSS, 승인일시 |
| PayMethod | 10 byte   CARD: 신용카드   BANK: 계좌이체   VBANK: 가상계좌   CELLPHONE: 휴대폰결제 |
| MallReserved | 500 byte 가맹점 여분 필드 |

| 파라미터명 | 파라미터설명 |
| --- | --- |
| CardCode | 3 byte 결제 카드사 코드, 예) 01 |
| CardName | 20 byte 결제 카드사 이름, 예) 비씨 |
| CardNo | 20 byte 카드번호, 예) 53611234\*\*\*\*1234 |
| CardQuota | 2 byte 할부개월, 예) 00(일시불) 03(3개월) |
| CardInterest | 1 byte 0:미적용, 1:적용 (가맹점분담 무이자 적용여부) |
| AcquCardCode | 3 byte 매입 카드사 코드, 예) 06 |
| AcquCardName | 100 byte 매입 카드사 이름, 예) 신한 |
| CardCl | 3 byte 0:신용, 1:체크 (카드 구분) |
| CcPartCl | 1 byte 0:불가능 1:가능 (부분취소 가능 여부) |
| CardType | 2 byte 01:개인 02:법인 03:해외 (카드 형태) |
| ClickpayCl | 2 byte 옵션 간편결제구분   6: SKPAY, 7: SSGPAY, 15: PAYCO, 16: KAKAOPAY, 18: LPAY,   20: NAVERPAY, 21: SAMSUNGPAY, 22: APPLEPAY, 25: TOSSPAY |
| CouponAmt | 12 byte 옵션 쿠폰 금액 |
| CouponMinAmt | 12 byte 옵션 쿠폰 최소금액 |
| PointAppAmt | 12 byte 옵션 포인트 승인금액   예)1000원인 경우 -> 000000001000 |
| MultiCl | 1 byte 옵션: 페이코, 카카오, 토스 간편결제 복합결제 여부   0: 복합결제 미사용   1: 복합결제 사용 |
| MultiCardAcquAmt | 12 byte 옵션: 페이코, 카카오, 토스 간편결제 복합결제 신용카드 금액   예)1000원인 경우 -> 1000 |
| MultiPointAmt | 12 byte 옵션: 페이코, 카카오, 토스 간편결제 복합결제 포인트(페이코 포인트, 카카오머니, 토스머니) 금액   예)1000원인 경우 -> 1000 |
| MultiCouponAmt | 12 byte 옵션: 페이코, 카카오, 토스 간편결제 복합결제 쿠폰(페이코 쿠폰, 카카오 포인트, 토스 포인트) 금액   예)1000원인 경우 -> 1000 |
| MultiRcptAmt | 12 byte 옵션: 페이코 간편결제 페이코 머니 거래건 현금영수증 발급 대상 금액   예)1000원인 경우 -> 1000 |
| RcptType | 1 byte 옵션: 네이버페이-포인트 결제 현금영수증타입   (1:소득공제, 2:지출증빙, 이외 발행안함) |
| RcptTID | 30 byte 옵션: 네이버페이-포인트 결제 현금영수증 TID |
| RcptAuthCode | 30 byte 옵션: 네이버페이-포인트 결제 현금영수증 승인번호 |

| 파라미터명 | 파라미터설명 |
| --- | --- |
| VbankBankCode | 3 byte 결제은행코드(은행 코드 참조) |
| VbankBankName | 20 byte 결제은행명 (euc-kr) |
| VbankNum | 20 byte 가상계좌번호 |
| VbankExpDate | 8 byte 가상계좌 입금만료일(yyyyMMdd) |
| VbankExpTime | 6 byte 가상계좌 입금만료시간(HHmmss) |

| 파라미터명 | 파라미터설명 |
| --- | --- |
| BankCode | 3 byte 결제은행코드(은행 코드 참조) |
| BankName | 20 byte 결제은행명 (euc-kr) |
| RcptType | 1 byte 현금영수증타입 (0:발행안함,1:소득공제,2:지출증빙) |
| RcptTID | 30 byte 옵션 현금영수증 TID, 현금영수증 거래인 경우 리턴 |
| RcptAuthCode | 30 byte 옵션 현금영수증 승인번호, 현금영수증 거래인 경우 리턴 |

```java
<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.Date" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.Iterator" %>
<%@ page import="java.io.PrintWriter" %>
<%@ page import="java.io.BufferedReader" %>
<%@ page import="java.io.InputStreamReader" %>
<%@ page import="java.net.URL" %>
<%@ page import="java.net.HttpURLConnection" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="java.security.MessageDigest" %>
<%@ page import="org.json.simple.JSONObject" %>
<%@ page import="org.json.simple.parser.JSONParser" %>
<%@ page import="org.apache.commons.codec.binary.Hex" %>
<%
request.setCharacterEncoding("utf-8"); 
/*
****************************************************************************************
* <인증 결과 파라미터>
****************************************************************************************
*/
String authResultCode     = (String)request.getParameter("AuthResultCode");     // 인증결과 : 0000(성공)
String authResultMsg     = (String)request.getParameter("AuthResultMsg");     // 인증결과 메시지
String nextAppURL         = (String)request.getParameter("NextAppURL");         // 승인 요청 URL
String txTid             = (String)request.getParameter("TxTid");             // 거래 ID
String authToken         = (String)request.getParameter("AuthToken");         // 인증 TOKEN
String payMethod         = (String)request.getParameter("PayMethod");         // 결제수단
String mid                 = (String)request.getParameter("MID");                 // 상점 아이디
String moid             = (String)request.getParameter("Moid");             // 상점 주문번호
String amt                 = (String)request.getParameter("Amt");                 // 결제 금액
String reqReserved         = (String)request.getParameter("ReqReserved");         // 상점 예약필드
String netCancelURL     = (String)request.getParameter("NetCancelURL");     // 망취소 요청 URL
// String authSignature = (String)request.getParameter("Signature");            // Nicepay에서 내려준 응답값의 무결성 검증 Data

/*  
****************************************************************************************
* Signature : 요청 데이터에 대한 무결성 검증을 위해 전달하는 파라미터로 허위 결제 요청 등 결제 및 보안 관련 이슈가 발생할 만한 요소를 방지하기 위해 연동 시 사용하시기 바라며 
* 위변조 검증 미사용으로 인해 발생하는 이슈는 당사의 책임이 없음 참고하시기 바랍니다.
****************************************************************************************
*/
 
DataEncrypt sha256Enc     = new DataEncrypt();
String merchantKey         = "EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg=="; // 상점키

// 인증 응답 Signature = hex(sha256(AuthToken + MID + Amt + MerchantKey)
// String authComparisonSignature = sha256Enc.encrypt(authToken + mid + amt + merchantKey);

/*
****************************************************************************************
* <승인 결과 파라미터 정의>
* 샘플페이지에서는 승인 결과 파라미터 중 일부만 예시되어 있으며, 
* 추가적으로 사용하실 파라미터는 연동메뉴얼을 참고하세요.
****************************************************************************************
*/
String ResultCode     = ""; String ResultMsg     = ""; String PayMethod     = "";
String GoodsName     = ""; String Amt         = ""; String TID         = "";
// String Signature = ""; String paySignature = "";

/*
****************************************************************************************
* <인증 결과 성공시 승인 진행>
****************************************************************************************
*/
String resultJsonStr = "";
if(authResultCode.equals("0000")){
    
    /*
    ****************************************************************************************
    * <해쉬암호화> (수정하지 마세요)
    * SHA-256 해쉬암호화는 거래 위변조를 막기위한 방법입니다. 
    ****************************************************************************************
    */
    String ediDate            = getyyyyMMddHHmmss();
    String signData         = sha256Enc.encrypt(authToken + mid + amt + ediDate + merchantKey);

    /*
    ****************************************************************************************
    * <승인 요청>
    * 승인에 필요한 데이터 생성 후 server to server 통신을 통해 승인 처리 합니다.
    ****************************************************************************************
    */
    StringBuffer requestData = new StringBuffer();
    requestData.append("TID=").append(txTid).append("&");
    requestData.append("AuthToken=").append(authToken).append("&");
    requestData.append("MID=").append(mid).append("&");
    requestData.append("Amt=").append(amt).append("&");
    requestData.append("EdiDate=").append(ediDate).append("&");
    requestData.append("CharSet=").append("utf-8").append("&");
    requestData.append("SignData=").append(signData);

    resultJsonStr = connectToServer(requestData.toString(), nextAppURL);

    HashMap resultData = new HashMap();
    boolean paySuccess = false;
    if("9999".equals(resultJsonStr)){
        /*
        *************************************************************************************
        * <망취소 요청>
        * 승인 통신중에 Exception 발생시 망취소 처리를 권고합니다.
        *************************************************************************************
        */
        StringBuffer netCancelData = new StringBuffer();
        requestData.append("&").append("NetCancel=").append("1");
        String cancelResultJsonStr = connectToServer(requestData.toString(), netCancelURL);
        
        HashMap cancelResultData = jsonStringToHashMap(cancelResultJsonStr);
        ResultCode = (String)cancelResultData.get("ResultCode");
        ResultMsg = (String)cancelResultData.get("ResultMsg");
        /*Signature = (String)cancelResultData.get("Signature");
        String CancelAmt = (String)cancelResultData.get("CancelAmt");
        paySignature = sha256Enc.encrypt(TID + mid + CancelAmt + merchantKey);*/
    }else{
        resultData = jsonStringToHashMap(resultJsonStr);
        ResultCode     = (String)resultData.get("ResultCode");    // 결과코드 (정상 결과코드:3001)
        ResultMsg     = (String)resultData.get("ResultMsg");    // 결과메시지
        PayMethod     = (String)resultData.get("PayMethod");    // 결제수단
        GoodsName   = (String)resultData.get("GoodsName");    // 상품명
        Amt           = (String)resultData.get("Amt");        // 결제 금액
        TID           = (String)resultData.get("TID");        // 거래번호
        // Signature : Nicepay에서 내려준 응답값의 무결성 검증 Data
        // 가맹점에서 무결성을 검증하는 로직을 구현하여야 합니다.
        /*Signature = (String)resultData.get("Signature");
        paySignature = sha256Enc.encrypt(TID + mid + Amt + merchantKey);*/
        
        /*
        *************************************************************************************
        * <결제 성공 여부 확인>
        *************************************************************************************
        */
        if(PayMethod != null){
            if(PayMethod.equals("CARD")){
                if(ResultCode.equals("3001")) paySuccess = true; // 신용카드(정상 결과코드:3001)           
            }else if(PayMethod.equals("BANK")){
                if(ResultCode.equals("4000")) paySuccess = true; // 계좌이체(정상 결과코드:4000)    
            }else if(PayMethod.equals("CELLPHONE")){
                if(ResultCode.equals("A000")) paySuccess = true; // 휴대폰(정상 결과코드:A000)    
            }else if(PayMethod.equals("VBANK")){
                if(ResultCode.equals("4100")) paySuccess = true; // 가상계좌(정상 결과코드:4100)
            }else if(PayMethod.equals("SSG_BANK")){
                if(ResultCode.equals("0000")) paySuccess = true; // SSG은행계좌(정상 결과코드:0000)
            }else if(PayMethod.equals("CMS_BANK")){
                if(ResultCode.equals("0000")) paySuccess = true; // 계좌간편결제(정상 결과코드:0000)
            }
        }
    }
}else/*if(authSignature.equals(authComparisonSignature))*/{
    ResultCode     = authResultCode;     
    ResultMsg     = authResultMsg;
}/*else{
    System.out.println("인증 응답 Signature : " + authSignature);
    System.out.println("인증 생성 Signature : " + authComparisonSignature);
}*/
%>
<!DOCTYPE html>
<html>
<head>
<title>NICEPAY PAY RESULT(UTF-8)</title>
<meta charset="utf-8">
</head>
<body>
    <table>
        <%if("9999".equals(resultJsonStr)){%>
        <tr>
            <th>승인 통신 실패로 인한 망취소 처리 진행 결과</th>
            <td>[<%=ResultCode%>]<%=ResultMsg%></td>
        </tr>
        <%}else{%>
        <tr>
            <th>결과 내용</th>
            <td>[<%=ResultCode%>]<%=ResultMsg%></td>
        </tr>
        <tr>
            <th>결제수단</th>
            <td><%=PayMethod%></td>
        </tr>
        <tr>
            <th>상품명</th>
            <td><%=GoodsName%></td>
        </tr>
        <tr>
            <th>결제 금액</th>
            <td><%=Amt%></td>
        </tr>
        <tr>
            <th>거래 번호</th>
            <td><%=TID%></td>
        </tr>
        <!-- <%if(Signature.equals(paySignature)){%>
        <tr>
            <th>Signature</th>
            <td><%=Signature%></td>
        </tr>
        <%}else{%>
        <tr>
            <th>승인 Signature</th>
            <td><%=Signature%></td>
        </tr>
        <tr>
            <th>생성 Signature</th>
            <td><%=paySignature%></td>
        </tr> -->
        <%}%>
    </table>
    <p>*테스트 아이디인경우 당일 오후 11시 30분에 취소됩니다.</p>
</body>
</html>
<%!
public final synchronized String getyyyyMMddHHmmss(){
    SimpleDateFormat yyyyMMddHHmmss = new SimpleDateFormat("yyyyMMddHHmmss");
    return yyyyMMddHHmmss.format(new Date());
}

// SHA-256 형식으로 암호화
public class DataEncrypt{
    MessageDigest md;
    String strSRCData = "";
    String strENCData = "";
    String strOUTData = "";
    
    public DataEncrypt(){ }
    public String encrypt(String strData){
        String passACL = null;
        MessageDigest md = null;
        try{
            md = MessageDigest.getInstance("SHA-256");
            md.reset();
            md.update(strData.getBytes());
            byte[] raw = md.digest();
            passACL = encodeHex(raw);
        }catch(Exception e){
            System.out.print("암호화 에러" + e.toString());
        }
        return passACL;
    }
    
    public String encodeHex(byte [] b){
        char [] c = Hex.encodeHex(b);
        return new String(c);
    }
}

//server to server 통신
public String connectToServer(String data, String reqUrl) throws Exception{
    HttpURLConnection conn         = null;
    BufferedReader resultReader = null;
    PrintWriter pw                 = null;
    URL url                     = null;
    
    int statusCode = 0;
    StringBuffer recvBuffer = new StringBuffer();
    try{
        url = new URL(reqUrl);
        conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setConnectTimeout(3000);
        conn.setReadTimeout(5000);
        conn.setDoOutput(true);
        
        pw = new PrintWriter(conn.getOutputStream());
        pw.write(data);
        pw.flush();
        
        statusCode = conn.getResponseCode();
        resultReader = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"));
        for(String temp; (temp = resultReader.readLine()) != null;){
            recvBuffer.append(temp).append("\n");
        }
        
        if(!(statusCode == HttpURLConnection.HTTP_OK)){
            throw new Exception();
        }
        
        return recvBuffer.toString().trim();
    }catch (Exception e){
        return "9999";
    }finally{
        recvBuffer.setLength(0);
        
        try{
            if(resultReader != null){
                resultReader.close();
            }
        }catch(Exception ex){
            resultReader = null;
        }
        
        try{
            if(pw != null) {
                pw.close();
            }
        }catch(Exception ex){
            pw = null;
        }
        
        try{
            if(conn != null) {
                conn.disconnect();
            }
        }catch(Exception ex){
            conn = null;
        }
    }
}

//JSON String -> HashMap 변환
private static HashMap jsonStringToHashMap(String str) throws Exception{
    HashMap dataMap = new HashMap();
    JSONParser parser = new JSONParser();
    try{
        Object obj = parser.parse(str);
        JSONObject jsonObject = (JSONObject)obj;

        Iterator<String> keyStr = jsonObject.keySet().iterator();
        while(keyStr.hasNext()){
            String key = keyStr.next();
            Object value = jsonObject.get(key);
            
            dataMap.put(key, value);
        }
    }catch(Exception e){
        
    }
    return dataMap;
}
%>
```

```php
<?php
header("Content-Type:text/html; charset=utf-8;"); 
/*
****************************************************************************************
* <인증 결과 파라미터>
****************************************************************************************
*/
$authResultCode = $_POST['AuthResultCode'];        // 인증결과 : 0000(성공)
$authResultMsg = $_POST['AuthResultMsg'];        // 인증결과 메시지
$nextAppURL = $_POST['NextAppURL'];                // 승인 요청 URL
$txTid = $_POST['TxTid'];                        // 거래 ID
$authToken = $_POST['AuthToken'];                // 인증 TOKEN
$payMethod = $_POST['PayMethod'];                // 결제수단
$mid = $_POST['MID'];                            // 상점 아이디
$moid = $_POST['Moid'];                            // 상점 주문번호
$amt = $_POST['Amt'];                            // 결제 금액
$reqReserved = $_POST['ReqReserved'];            // 상점 예약필드
$netCancelURL = $_POST['NetCancelURL'];            // 망취소 요청 URL
    
/*
****************************************************************************************
* <승인 결과 파라미터 정의>
* 샘플페이지에서는 승인 결과 파라미터 중 일부만 예시되어 있으며, 
* 추가적으로 사용하실 파라미터는 연동메뉴얼을 참고하세요.
****************************************************************************************
*/

$response = "";

if($authResultCode === "0000"){
    /*
    ****************************************************************************************
    * <해쉬암호화> (수정하지 마세요)
    * SHA-256 해쉬암호화는 거래 위변조를 막기위한 방법입니다. 
    ****************************************************************************************
    */    
    $ediDate = date("YmdHis");
    $merchantKey = "EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg=="; // 상점키
    $signData = bin2hex(hash('sha256', $authToken . $mid . $amt . $ediDate . $merchantKey, true));

    try{
        $data = Array(
            'TID' => $txTid,
            'AuthToken' => $authToken,
            'MID' => $mid,
            'Amt' => $amt,
            'EdiDate' => $ediDate,
            'SignData' => $signData,
            'CharSet' => 'utf-8'
        );        
        $response = reqPost($data, $nextAppURL); //승인 호출
        jsonRespDump($response); //response json dump example
        
    }catch(Exception $e){
        $e->getMessage();
        $data = Array(
            'TID' => $txTid,
            'AuthToken' => $authToken,
            'MID' => $mid,
            'Amt' => $amt,
            'EdiDate' => $ediDate,
            'SignData' => $signData,
            'NetCancel' => '1',
            'CharSet' => 'utf-8'
        );
        $response = reqPost($data, $netCancelURL); //예외 발생시 망취소 진행
        jsonRespDump($response); //response json dump example
    }    
    
}else{
    //인증 실패 하는 경우 결과코드, 메시지
    $ResultCode = $authResultCode;     
    $ResultMsg = $authResultMsg;
}

// API CALL foreach 예시
function jsonRespDump($resp){
    $respArr = json_decode($resp);
    foreach ( $respArr as $key => $value ){
            echo "$key=". $value."<br />";
    }
}

//Post api call
function reqPost(Array $data, $url){
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 15);                    //connection timeout 15 
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));    //POST data
    curl_setopt($ch, CURLOPT_POST, true);
    $response = curl_exec($ch);
    curl_close($ch);     
    return $response;
}
?>
```

```csharp
using System;
using System.Web.UI;
using System.Security.Cryptography;
using System.Text;
using System.Net;
using System.IO;
using System.Web;
public partial class payResult : System.Web.UI.Page{
    protected System.Web.UI.WebControls.Literal Res_ResultCode;
    protected System.Web.UI.WebControls.Literal Res_ResultMsg;
    protected System.Web.UI.WebControls.Literal Res_PayMethod;
    protected System.Web.UI.WebControls.Literal Res_GoodsName;
    protected System.Web.UI.WebControls.Literal Res_Amt;
    protected System.Web.UI.WebControls.Literal Res_TID;
    /*protected System.Web.UI.WebControls.Literal Res_Signature1;
    protected System.Web.UI.WebControls.Literal Res_Signature2;
    protected System.Web.UI.WebControls.Literal Res_paySignature;*/

    protected string authResultCode;
    protected string authResultMsg;
    protected string nextAppURL;
    protected string txTid;
    protected string authToken;
    protected string payMethod;
    protected string mid;
    protected string moid;
    protected string amt;
    protected string reqReserved;
    protected string netCancelURL;
    protected string signData;
    protected string ediDate;
    protected string merchantKey;
    /*protected string Signature;
    protected string authSignature;
    protected string authComparisonSignature;
    protected string paySignature;*/

    protected void Page_Load(object sender, EventArgs e){
        if (!Page.IsPostBack){
            resultData();
        }
    }

    protected void resultData(){
        merchantKey = "EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg==";
        authResultCode = Request.Params["AuthResultCode"];
        authResultMsg = Request.Params["AuthResultMsg"];
        nextAppURL = Request.Params["NextAppURL"];
        txTid = Request.Params["TxTid"];
        authToken = Request.Params["AuthToken"];
        payMethod = Request.Params["PayMethod"];
        mid = Request.Params["MID"];
        moid = Request.Params["Moid"];
        amt = Request.Params["Amt"];
        reqReserved = Request.Params["ReqReserved"];
        netCancelURL = Request.Params["NetCancelURL"];
        //authSignature = Request.Params["Signature"];

        ediDate = String.Format("{0:yyyyMMddHHmmss}", DateTime.Now);
        signData = stringToSHA256(authToken + mid + amt + ediDate + merchantKey);
        //authComparisonSignature = stringToSHA256(Request.Params["AuthToken"] + Request.Params["MID"] + Request.Params["Amt"] + merchantKey);

        var postData = "TID=" + Uri.EscapeDataString(txTid);
        postData += "&AuthToken=" + Uri.EscapeDataString(authToken);
        postData += "&MID=" + Uri.EscapeDataString(mid);
        postData += "&Amt=" + Uri.EscapeDataString(amt);
        postData += "&EdiDate=" + ediDate;
        postData += "&EdiType=" + "KV";
        postData += "&SignData=" + Uri.EscapeDataString(stringToSHA256(authToken + mid + amt + ediDate + merchantKey));

        if (authResultCode.Equals("0000")/* && authSignature.Equals(authComparisonSignature)*/)
        {
            //API Call
            var result = apiRequest(nextAppURL, postData);

            //Stream encode
            var queryStr = streamEncode(result);

            //ParseQueryString
            var response = HttpUtility.ParseQueryString(queryStr);

            //Response data
            Res_ResultCode.Text = response["ResultCode"];
            Res_ResultMsg.Text = response["ResultMsg"];
            Res_PayMethod.Text = response["PayMethod"];
            Res_GoodsName.Text = response["GoodsName"];
            Res_Amt.Text = response["Amt"];
            Res_TID.Text = response["TID"];
            /*Res_Signature1.Text = response["Signature"];
            Res_Signature2.Text = response["Signature"];
            Signature = response["Signature"];
            paySignature = stringToSHA256(response["TID"] + response["MID"] + response["Amt"] + merchantKey);
            Res_paySignature.Text = paySignature; */
        }
        else /*if(authSignature.Equals(authComparisonSignature))*/
        {
            //Add parameters for Net cancel
            postData += "&NetCancel=1";

            //API Call to CancelURL
            var result = apiRequest(netCancelURL, postData);

            var queryStr = streamEncode(result);

            //ParseQueryString
            var response = HttpUtility.ParseQueryString(queryStr);

            //Response data
            Res_ResultCode.Text = response["ResultCode"];
            Res_ResultMsg.Text = response["ResultMsg"];
        }/*else
        {
            Console.WriteLine("authSignature : " + authSignature);
            Console.WriteLine("authComparisonSignature : " + authComparisonSignature);
        }*/
    }

    public String stringToSHA256(String plain)
    {
        SHA256Managed SHA256 = new SHA256Managed();
        String getHashString = BitConverter.ToString(SHA256.ComputeHash(Encoding.UTF8.GetBytes(plain))).ToLower();
        return getHashString.Replace("-", "");
    }

    public HttpWebResponse apiRequest(String url, String postData)
    {
        var request = (HttpWebRequest)WebRequest.Create(url);

        System.Text.Encoding euckr = System.Text.Encoding.GetEncoding(51949);
        var data = euckr.GetBytes(postData);

        request.Method = "POST";
        request.ContentType = "application/x-www-form-urlencoded";
        request.ContentLength = data.Length;

        using (var stream = request.GetRequestStream())
        {
            stream.Write(data, 0, data.Length);
        }

        var result = (HttpWebResponse)request.GetResponse();
        return result;
    }

    public String streamEncode(HttpWebResponse result)
    {
        Stream ReceiveStream = result.GetResponseStream();
        Encoding encode = System.Text.Encoding.GetEncoding(51949);

        StreamReader sr = new StreamReader(ReceiveStream, encode);

        Char[] read = new Char[8096];
        int count = sr.Read(read, 0, 8096);
        Char[] chTemp = new Char[count];
        for (int i = 0; i < count; ++i)
            chTemp[i] = read[i];

        Byte[] buffer = encode.GetBytes(chTemp);
        String strOut = encode.GetString(buffer);

        return strOut;
    }
}
```

```javascript
const express = require('express')
const axios = require('axios')
const app = express()
const port = 3000
const iconv = require('iconv-lite')
const bodyParser = require('body-parser')
const CryptoJS = require('crypto-js')
const format = require('date-format')
const fs = require('fs')
const ejs = require('ejs')

const payRequest = fs.readFileSync('./public/payRequest.ejs', 'utf-8');

const merchantKey = 'EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg==';
const merchantID = 'nicepay00m';

const ediDate = format.asString('yyyyMMddhhmmss', new Date());
const amt = '1004';
const returnURL = 'http://localhost:3000/authReq';
const goodsName = '나이스상품';
const moid = 'moid' + ediDate;
const buyerName = '구매자';
const buyerEmail = 'happy@day.com';
const buyerTel = '00000000000';

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

//route for payment
app.get('/payment', function(req, res) {
    const index = ejs.render(payRequest, {
        goodsName : goodsName,
        amt : amt,
        moid : moid,
        buyerName : buyerName,
        buyerEmail : buyerEmail,
        buyerTel : buyerTel,
        merchantID: merchantID,
        ediDate: ediDate,
        hashString : getSignData(ediDate + merchantID + amt + merchantKey).toString(),
        returnURL: returnURL
    })

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.write(index)
    res.end()
})

//authentication from client
app.post('/authReq', async function(req, res) {

    const authResultCode = req.body.AuthResultCode;
    const authResultMsg = req.body.AuthResultMsg;
    const txTid = req.body.TxTid;
    const authToken = req.body.AuthToken;
    const payMethod = req.body.PayMethod;
    const mid = req.body.MID;
    const moid = req.body.Moid;
    const amt = req.body.Amt;
    const reqReserved = req.body.ReqReserved;
    const nextAppURL = req.body.NextAppURL; //승인 API URL
    const netCancelURL = req.body.NetCancelURL;  //API 응답이 없는 경우 망취소 API 호출
    //const authSignature = req.body.Signature; //Nicepay에서 내려준 응답값의 무결성 검증 Data
    //인증 응답 Signature = hex(sha256(AuthToken + MID + Amt + MerchantKey)
    //const authComparisonSignature = getSignData(req.body.AuthToken + req.body.MID + req.body.Amt + merchantKey).toString();
  
    if (authResultCode === "0000") {
        const ediDate = format.asString('yyyyMMddhhmmss', new Date());
        const signData = getSignData(authToken + mid + amt + ediDate + merchantKey).toString();

        try {
            const response = await axios({
                url: nextAppURL,
                method: 'POST',
                headers: {
                    'User-Agent': 'Super Agent/0.0.1',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=euc-kr',
                },
                data: {
                    TID: txTid,
                    AuthToken: authToken,
                    MID: mid,
                    Amt: amt,
                    EdiDate: ediDate,
                    SignData: signData,
                    CharSet: 'utf-8'    
                } 
            });

            console.log('승인 결과:', response.data);
            res.json(response.data);
        } catch (error) {
            console.error('승인 요청 실패', error.message);

            try {
                const netCancelResponse = await axios({
                    url: netCancelURL,
                    method: 'POST',
                    headers: {
                        'User-Agent': 'Super Agent/0.0.1',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=euc-kr',
                    },
                    data: {
                        TID: txTid,
                        AuthToken: authToken,
                        MID: mid,
                        Amt: amt,
                        EdiDate: ediDate,
                        SignData: signData,
                        NetCancel: '1',
                        CharSet: 'utf-8'    
                    }
                });

                console.log('망취소 결과:', netCancelResponse.data);
                res.json(netCancelResponse.data);
            } catch (cancelError) {
                console.error('망취소 실패', cancelError.message);
                res.status(500).json({ success: false, message: '결제 승인 및 망취소 요청 모두 실패했습니다.' });
            }
        }
    } else {
        res.status(400).json({ success: false, message: '결제 인증 실패', AuthResultCode: authResultCode, AuthResultMsg: req.body.AuthResultMsg });
    }
})

function getSignData(str) {
    const encrypted = CryptoJS.SHA256(str);
    return encrypted;
}

app.listen(port, () => console.log('**\n\nPAYMENT TEST URL:: localhost:3000/payment\nCANCEL TEST URL:: localhost:3000/cancel \n\n**'))
```

```python
from flask import Flask, render_template, request
from datetime import datetime
import hashlib, requests, sys, json
from base64 import b64encode, b64decode
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes

app = Flask(__name__)

def getSignData(str):
    encoded_str = str.encode()
    EncryptData = hashlib.sha256(encoded_str).hexdigest()
    return EncryptData

def getEdiDate():
    YYYYmmddHHMMSS = datetime.today().strftime("%Y%m%d%H%M%S")
    return str(YYYYmmddHHMMSS)

def authRequest(url, data):
    headers = {
        'Content-type' : 'application/x-www-form-urlencoded', 'charset': 'euc-kr'
    }
    
    response = requests.post(
        url=url,
        data=data, 
        headers=headers
    )

    resDict = json.loads(response.text)
    print(resDict)

    return resDict

##Req variables
Amt         = "1004"                          # 결제상품금액
BuyerEmail  = "happy@day.co.kr"               # 구매자메일주소
BuyerName   = "나이스"                        # 구매자명 
BuyerTel    = "01000000000"                   # 구매자연락처 
EdiDate     = getEdiDate()                    # 거래 날짜   
GoodsName   = "상품"                          # 결제상품명
MerchantKey = "EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg==" #상점키
MID         = "nicepay00m"                    # 상점아이디
Moid        = "mnoid1234567890"               # 상품주문번호  
CancelPwd   = "123456"                        # 취소비밀번호       
ReturnURL   = "http://localhost:5000/authReq" # Mobile only

@app.route('/payment')
def reqPc():
    return render_template(
        'payRequest.html',
        MID=MID,
        Amt=Amt,
        GoodsName=GoodsName,
        BuyerEmail=BuyerEmail,
        BuyerName=BuyerName,
        BuyerTel=BuyerTel,
        Moid=Moid,
        EdiDate=EdiDate,
        EncryptData=getSignData(EdiDate + MID + Amt + MerchantKey),
        returnURL=ReturnURL
    )

@app.route('/cancel')
def reqCancel():
    return render_template(
        'cancelRequest.html',
        title="hello world"
    )

@app.route('/authReq', methods=['POST'])
def getReq():
    AuthResultCode=request.form['AuthResultCode']
    AuthResultMsg=request.form['AuthResultMsg']
    TxTid=request.form['TxTid']
    AuthToken=request.form['AuthToken']
    PayMethod=request.form['PayMethod']
    MID=request.form['MID']
    Moid=request.form['Moid']
    Amt=request.form['Amt']
    ReqReserved=request.form['ReqReserved']
    NextAppURL=request.form['NextAppURL'] #승인 API URL
    NetCancelURL=request.form['NetCancelURL'] #API 응답이 없는 경우 망취소 API 호출
    EdiDate=getEdiDate()
    SignData=getSignData(AuthToken + MID + Amt + EdiDate + MerchantKey)
#    authSignature=request.form['Signature'] #Nicepay에서 내려준 응답값의 무결성 검증 Data
#    #인증 응답 Signature = hex(sha256(AuthToken + MID + Amt + MerchantKey))indentation
#    authComparisonSignature = getSignData(request.form['AuthToken'] + request.form['MID'] + request.form['Amt'] + MerchantKey)

    data = {
        'TID': TxTid,
        'AuthToken': AuthToken,
        'Amt': Amt,
        'MID': MID,
        'SignData': SignData,
        'EdiDate': EdiDate   
    }
    
#    #인증 응답으로 받은 Signature 검증을 통해 무결성 검증을 진행하여야 합니다.
#    if(authSignature == authComparisonSignature):
#        resDict = authRequest(NextAppURL, data)
#    else:
#        print("authSignature : " + authSignature)
#        print("authComparisonSignature : " + authComparisonSignature)
    
    #AuthResultCode가 0000인경우 승인 API 호출
    resDict = authRequest(NextAppURL, data)

#    Signature = resDict['Signature']
#    #가맹점은 승인응답으로 전달된 TID, Amt 값을 활용하여 위변조 대조 해쉬값을 생성하여 전달받은 Signature 값과 대조를 진행합니다. 대조가 일치할 경우 정상승인을 진행합니다.
#    paySignature = getSignData(resDict['TID'] + resDict['MID'] + resDict['Amt'] + MerchantKey)
#    if(Signature == paySignature):
#        print("Signature : " + Signature)
#        return render_template(
#            'result.html',
#            result=resDict
#        )
#    else:
#        print("Signature : " + Signature)
#        print("paySignature : " + paySignature)

    return render_template(
        'result.html',
        result=resDict
    )  

#Cancel
@app.route('/cancelReq', methods=['POST'])
def cancelReq():   
    TID=request.form['TID']
    CancelAmt=request.form['CancelAmt']
    PartialCancelCode=request.form['PartialCancelCode']
    Moid="test"
    CancelMsgKr="고객요청"
    CancelMsg=CancelMsgKr.encode("euc-kr","ignore") 
    EdiDate=getEdiDate()
    SignData=getSignData(MID + CancelAmt + EdiDate + MerchantKey)

    data = {
        'TID': TID,
        'MID': MID,
        'Moid': Moid,
        'CancelAmt': CancelAmt,
        'CancelMsg': CancelMsg, #취소 메시지 한글 처리하는경우 인코딩 EUC-KR로 요청
        'PartialCancelCode': PartialCancelCode,
        'EdiDate': EdiDate,
        'SignData': SignData
    }
    resDict = authRequest("https://webapi.nicepay.co.kr/webapi/cancel_process.jsp", data)

#    Signature = resDict['Signature']
#    #취소 응답 시 위변조 대조 해쉬값을 생성하여 전달받은 Signature 값과 대조를 진행합니다. 대조가 일치할 경우 취소를 진행합니다.
#    cancelSignature = getSignData(resDict['TID'] + resDict['MID'] + resDict['CancelAmt'] + MerchantKey)
#    if(Signature == cancelSignature):
#        print("Signature : " + Signature)
#        return render_template(
#            'result.html',
#            result=resDict
#        )
#    else:
#        print("Signature : " + Signature)
#        print("cancelSignature : " + cancelSignature)

    return render_template(
        'result.html',
        result=resDict
    )         

if __name__ == '__main__':
    app.run(debug=True)
```

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

| 파라미터명 | 파라미터설명 |
| --- | --- |
| TID | 30 byte 필수 거래 ID |
| MID | 10 byte 필수 가맹점 ID |
| Moid | 64 byte 필수 주문번호 (부분 취소 시 중복취소 방지를 위해 설정) (별도 계약 필요) |
| CancelAmt | 12 byte 필수 취소금액 |
| CancelMsg | 100 byte 필수 취소사유 (euc-kr) |
| PartialCancelCode | 1 byte 필수 0:전체 취소, 1:부분 취소(별도 계약 필요) |
| EdiDate | 14 byte 필수 전문생성일시 (YYYYMMDDHHMMSS) |
| SignData | 256 byte 필수 hex(sha256(MID + CancelAmt + EdiDate + MerchantKey)) |
| CharSet | 10 byte 인증 응답 인코딩 (euc-kr(default) / utf-8) |
| EdiType | 10 byte 응답전문 유형 (JSON / KV) \*KV:Key=value |
| MallReserved | 500 byte 가맹점 여분 필드 |
| RefundAcctNo | 16 byte 가상계좌, 휴대폰 익월 환불 Only 환불계좌번호 (숫자만) |
| RefundBankCd | 3 byte 가상계좌, 휴대폰 익월 환불 Only 환불계좌코드 (\*은행코드 참고) |
| RefundAcctNm | 10 byte 가상계좌, 휴대폰 익월 환불 Only 환불계좌주명 (euc-kr) |

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

```java
<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.Date" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.Iterator" %>
<%@ page import="java.io.PrintWriter" %>
<%@ page import="java.io.BufferedReader" %>
<%@ page import="java.io.InputStreamReader" %>
<%@ page import="java.net.URL" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.net.HttpURLConnection" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="java.security.MessageDigest" %>
<%@ page import="org.json.simple.JSONObject" %>
<%@ page import="org.json.simple.parser.JSONParser" %>
<%@ page import="org.apache.commons.codec.binary.Hex" %>
<%
request.setCharacterEncoding("utf-8"); 

/*
****************************************************************************************
* <취소요청 파라미터>
* 취소시 전달하는 파라미터입니다.
* 샘플페이지에서는 기본(필수) 파라미터만 예시되어 있으며, 
* 추가 가능한 옵션 파라미터는 연동메뉴얼을 참고하세요.
****************************************************************************************
*/
String tid                     = (String)request.getParameter("TID");    // 거래 ID
String cancelAmt             = (String)request.getParameter("CancelAmt");    // 취소금액
String partialCancelCode     = (String)request.getParameter("PartialCancelCode");     // 부분취소여부
String mid                     = "nicepay00m";    // 상점 ID
String moid                    = "nicepay_api_3.0_test";    // 주문번호
String cancelMsg             = "고객요청";    // 취소사유

/*
****************************************************************************************
* <해쉬암호화> (수정하지 마세요)
* SHA-256 해쉬암호화는 거래 위변조를 막기위한 방법입니다. 
****************************************************************************************
*/
DataEncrypt sha256Enc     = new DataEncrypt();
String merchantKey         = "EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg=="; // 상점키
String ediDate            = getyyyyMMddHHmmss();
String signData         = sha256Enc.encrypt(mid + cancelAmt + ediDate + merchantKey);

/*
****************************************************************************************
* <취소 요청>
* 취소에 필요한 데이터 생성 후 server to server 통신을 통해 취소 처리 합니다.
* 취소 사유(CancelMsg) 와 같이 한글 텍스트가 필요한 파라미터는 euc-kr encoding 처리가 필요합니다.
****************************************************************************************
*/
StringBuffer requestData = new StringBuffer();
requestData.append("TID=").append(tid).append("&");
requestData.append("MID=").append(mid).append("&");
requestData.append("Moid=").append(moid).append("&");
requestData.append("CancelAmt=").append(cancelAmt).append("&");
requestData.append("CancelMsg=").append(URLEncoder.encode(cancelMsg, "euc-kr")).append("&");
requestData.append("PartialCancelCode=").append(partialCancelCode).append("&");
requestData.append("EdiDate=").append(ediDate).append("&");
requestData.append("CharSet=").append("utf-8").append("&");
requestData.append("SignData=").append(signData);
String resultJsonStr = connectToServer(requestData.toString(), "https://pg-api.nicepay.co.kr/webapi/cancel_process.jsp");

/*
****************************************************************************************
* <취소 결과 파라미터 정의>
* 샘플페이지에서는 취소 결과 파라미터 중 일부만 예시되어 있으며, 
* 추가적으로 사용하실 파라미터는 연동메뉴얼을 참고하세요.
****************************************************************************************
*/
String ResultCode     = ""; String ResultMsg     = ""; String CancelAmt     = "";
String CancelDate     = ""; String CancelTime = ""; String TID         = "";

if("9999".equals(resultJsonStr)){
    ResultCode     = "9999";
    ResultMsg    = "통신실패";
}else{
    HashMap resultData = jsonStringToHashMap(resultJsonStr);
    ResultCode     = (String)resultData.get("ResultCode");    // 결과코드 (취소성공: 2001, 취소성공(LGU 계좌이체):2211)
    ResultMsg     = (String)resultData.get("ResultMsg");    // 결과메시지
    CancelAmt     = (String)resultData.get("CancelAmt");    // 취소금액
    CancelDate     = (String)resultData.get("CancelDate");    // 취소일
    CancelTime     = (String)resultData.get("CancelTime");    // 취소시간
    TID         = (String)resultData.get("TID");        // 거래아이디 TID
}
%>
<!DOCTYPE html>
<html>
<head>
<title>NICEPAY CANCEL RESULT(UTF-8)</title>
<meta charset="utf-8">
</head>
<body> 
    <table>                                                  
        <tr>
            <th>취소 결과 내용</th>
            <td>[<%=ResultCode%>]<%=ResultMsg%></td>
        </tr>
        <tr>
            <th>거래 아이디</th>
            <td><%=TID%></td>
        </tr>
        <tr>
            <th>취소 금액</th>
            <td><%=CancelAmt%></td>
        </tr>
        <tr>
            <th>취소일</th>
            <td><%=CancelDate%></td>
        </tr>
        <tr>
            <th>취소시간</th>
            <td><%=CancelTime%></td>
        </tr>
    </table>
</body>
</html>
<%!
public final synchronized String getyyyyMMddHHmmss(){
    SimpleDateFormat yyyyMMddHHmmss = new SimpleDateFormat("yyyyMMddHHmmss");
    return yyyyMMddHHmmss.format(new Date());
}

//SHA-256 형식으로 암호화
public class DataEncrypt{
    MessageDigest md;
    String strSRCData = "";
    String strENCData = "";
    String strOUTData = "";
    
    public DataEncrypt(){ }
    public String encrypt(String strData){
        String passACL = null;
        MessageDigest md = null;
        try{
            md = MessageDigest.getInstance("SHA-256");
            md.reset();
            md.update(strData.getBytes());
            byte[] raw = md.digest();
            passACL = encodeHex(raw);
        }catch(Exception e){
            System.out.print("암호화 에러" + e.toString());
        }
        return passACL;
    }
    
    public String encodeHex(byte [] b){
        char [] c = Hex.encodeHex(b);
        return new String(c);
    }
}

//server to server 통신
public String connectToServer(String data, String reqUrl) throws Exception{
    HttpURLConnection conn         = null;
    BufferedReader resultReader = null;
    PrintWriter pw                 = null;
    URL url                     = null;
    
    int statusCode = 0;
    StringBuffer recvBuffer = new StringBuffer();
    try{
        url = new URL(reqUrl);
        conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setConnectTimeout(3000);
        conn.setReadTimeout(5000);
        conn.setDoOutput(true);
        
        pw = new PrintWriter(conn.getOutputStream());
        pw.write(data);
        pw.flush();
        
        statusCode = conn.getResponseCode();
        resultReader = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"));
        for(String temp; (temp = resultReader.readLine()) != null;){
            recvBuffer.append(temp).append("\n");
        }
        
        if(!(statusCode == HttpURLConnection.HTTP_OK)){
            throw new Exception();
        }
        
        return recvBuffer.toString().trim();
    }catch (Exception e){
        return "9999";
    }finally{
        recvBuffer.setLength(0);
        
        try{
            if(resultReader != null){
                resultReader.close();
            }
        }catch(Exception ex){
            resultReader = null;
        }
        
        try{
            if(pw != null) {
                pw.close();
            }
        }catch(Exception ex){
            pw = null;
        }
        
        try{
            if(conn != null) {
                conn.disconnect();
            }
        }catch(Exception ex){
            conn = null;
        }
    }
}

//JSON String -> HashMap 변환
private static HashMap jsonStringToHashMap(String str) throws Exception{
    HashMap dataMap = new HashMap();
    JSONParser parser = new JSONParser();
    try{
        Object obj = parser.parse(str);
        JSONObject jsonObject = (JSONObject)obj;

        Iterator<String> keyStr = jsonObject.keySet().iterator();
        while(keyStr.hasNext()){
            String key = keyStr.next();
            Object value = jsonObject.get(key);
            
            dataMap.put(key, value);
        }
    }catch(Exception e){
        
    }
    return dataMap;
}
%>
```

```php
<?php
header("Content-Type:text/html; charset=utf-8;"); 

$merchantKey = "EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg==";
$mid = "nicepay00m";
$moid = "nicepay_api_3.0_test";        
$cancelMsg = "고객요청";
$tid = $_POST['TID'];            
$cancelAmt = $_POST['CancelAmt']; 
$partialCancelCode = $_POST['PartialCancelCode'];

$ediDate = date("YmdHis");
$signData = bin2hex(hash('sha256', $mid . $cancelAmt . $ediDate . $merchantKey, true));

try{
    $data = Array(
        'TID' => $tid,
        'MID' => $mid,
        'Moid' => $moid,
        'CancelAmt' => $cancelAmt,
        'CancelMsg' => iconv("UTF-8", "EUC-KR", $cancelMsg),
        'PartialCancelCode' => $partialCancelCode,
        'EdiDate' => $ediDate,
        'SignData' => $signData,
        'CharSet' => 'utf-8'
    );    
    $response = reqPost($data, "https://pg-api.nicepay.co.kr/webapi/cancel_process.jsp"); //취소 API 호출
    jsonRespDump($response);
    
}catch(Exception $e){
    $e->getMessage();
    $ResultCode = "9999";
    $ResultMsg = "통신실패";
}

// API CALL foreach 예시
function jsonRespDump($resp){
    $respArr = json_decode($resp);
    foreach ( $respArr as $key => $value ){
        if($key == "Data"){
            echo decryptDump ($value, $merchantKey)."<br />";
        }else{
            echo "$key=". $value."<br />";
        }
    }
}

//Post api call
function reqPost(Array $data, $url){
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 15);                    //connection timeout 15 
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));    //POST data
    curl_setopt($ch, CURLOPT_POST, true);
    $response = curl_exec($ch);
    curl_close($ch);     
    return $response;
}
?>
```

```csharp
using System;
using System.Web.UI;
using System.Security.Cryptography;
using System.Text;
using System.Net;
using System.IO;
using System.Web;
public partial class cancelResult : System.Web.UI.Page{
    protected System.Web.UI.WebControls.Literal Res_ResultCode;
    protected System.Web.UI.WebControls.Literal Res_ResultMsg;
    protected System.Web.UI.WebControls.Literal Res_TID;

    protected string tid;
    protected string cancelAmt;
    protected string partialCancelCode;
    protected string mid;
    protected string moid;
    protected string cancelMsg;
    protected string merchantKey;
    protected string ediDate;
    protected string signData;
    protected string resultCode;
    protected string resultMsg;
    protected string cancelDate;
    protected string cancelTime;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!Page.IsPostBack)
        {
            resultData();
        }
    }

    protected void resultData()
    {
        merchantKey = "EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg==";
        tid = Request.Params["TID"];
        cancelAmt = Request.Params["CancelAmt"];
        partialCancelCode = Request.Params["PartialCancelCode"];
        mid = "nicepay00m";
        moid = "nicepay_api_3.0_test";
        cancelMsg = "고객취소";

        ediDate = String.Format("{0:yyyyMMddHHmmss}", DateTime.Now);
        signData = stringToSHA256(mid + cancelAmt + ediDate + merchantKey);

        //Make post query string
        var postData = "TID=" + tid;
        postData += "&MID=" + mid;
        postData += "&Moid=" + moid;
        postData += "&CancelAmt=" + Uri.EscapeDataString(cancelAmt);
        postData += "&CancelMsg=" + cancelMsg;
        postData += "&PartialCancelCode=" + partialCancelCode;
        postData += "&EdiDate=" + ediDate;
        postData += "&EdiType=" + "KV";
        postData += "&SignData=" + Uri.EscapeDataString(signData);

        //Call cancel_process.jsp API
        var result = apiRequest("https://pg-api.nicepay.co.kr/webapi/cancel_process.jsp", postData);

        //Stream encode
        var queryStr = streamEncode(result);

        //ParseQueryString
        var response = HttpUtility.ParseQueryString(queryStr);

        //Response data to view
        Res_ResultCode.Text = response["ResultCode"];
        Res_ResultMsg.Text = response["ResultMsg"];
        Res_TID.Text = response["TID"];
    }

    public String stringToSHA256(String plain)
    {
        SHA256Managed SHA256 = new SHA256Managed();
        String getHashString = BitConverter.ToString(SHA256.ComputeHash(Encoding.UTF8.GetBytes(plain))).ToLower();
        return getHashString.Replace("-", "");
    }

    public HttpWebResponse apiRequest(String url, String postData)
    {
        var request = (HttpWebRequest)WebRequest.Create(url);

        System.Text.Encoding euckr = System.Text.Encoding.GetEncoding(51949);
        var data = euckr.GetBytes(postData);

        request.Method = "POST";
        request.ContentType = "application/x-www-form-urlencoded";
        request.ContentLength = data.Length;

        using (var stream = request.GetRequestStream())
        {
            stream.Write(data, 0, data.Length);
        }

        var result = (HttpWebResponse)request.GetResponse();
        return result;
    }

    public String streamEncode(HttpWebResponse result)
    {
        Stream ReceiveStream = result.GetResponseStream();
        Encoding encode = System.Text.Encoding.GetEncoding(51949);

        StreamReader sr = new StreamReader(ReceiveStream, encode);

        Char[] read = new Char[8096];
        int count = sr.Read(read, 0, 8096);
        Char[] chTemp = new Char[count];
        for (int i = 0; i < count; ++i)
            chTemp[i] = read[i];

        Byte[] buffer = encode.GetBytes(chTemp);
        String strOut = encode.GetString(buffer);

        return strOut;
    }
}
```

```javascript
const express = require('express')
const axios = require('axios')
const app = express()
const port = 3000
const iconv = require('iconv-lite')
const bodyParser = require('body-parser')
const CryptoJS = require('crypto-js')
const format = require('date-format')
const fs = require('fs')
const ejs = require('ejs')

const cancelRequest = fs.readFileSync('./public/cancelRequest.ejs', 'utf-8');

const merchantKey = 'EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg==';
const merchantID = 'nicepay00m';

const ediDate = format.asString('yyyyMMddhhmmss', new Date());
const amt = '1004';
const returnURL = 'http://localhost:3000/authReq';
const goodsName = '나이스상품';
const moid = 'nice_api_test_3.0';
const buyerName = '구매자';
const buyerEmail = 'happy@day.com';
const buyerTel = '00000000000';

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

//route for cancel
app.get('/cancel', function(req, res) {
    const index = ejs.render(cancelRequest, {

    })

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.write(index)
    res.end()
})

//cancel request
app.post('/cancelReq', async function(req, res) {

    const ediDate = format.asString('yyyyMMddhhmmss', new Date());

    const tid = req.body.TID;
    const moid = 'moid' + ediDate;
    const cancelAmt = req.body.CancelAmt;
    const cancelMsg = "test"; //취소 메시지 한글 처리하는경우 인코딩 EUC-KR로 요청, iconv-lite 사용 불가
    const partialCancelCode = req.body.PartialCancelCode;
    
    const signData = getSignData(merchantID + cancelAmt + ediDate + merchantKey).toString();

    // 결제 취소 API 요청 후 응답을 받아 console과 브라우저에 출력합니다.
    try {
        const cancelResponse = await axios({
            url: 'https://pg-api.nicepay.co.kr/webapi/cancel_process.jsp',
            method: 'POST',
            headers: {
                'User-Agent': 'Super Agent/0.0.1',
                'Content-Type': 'application/x-www-form-urlencoded; charset=euc-kr',
            },
            data: {
                TID: tid,
                MID: merchantID,
                Moid: moid,
                CancelAmt: cancelAmt,
                CancelMsg: cancelMsg, // 취소 메세지 한글 처리 시 인코딩 euc-kr로 요청.
                PartialCancelCode: partialCancelCode,
                EdiDate: ediDate,
                SignData: signData,
                CharSet: 'utf-8'    
            }
        });

        res.json(cancelResponse.data);
        console.log('취소 결과 :', cancelResponse.data);
    } catch (error) {
        res.json({ success: false, message: error.message });
    };
})

function getSignData(str) {
    const encrypted = CryptoJS.SHA256(str);
    return encrypted;
}

app.listen(port, () => console.log('**\n\nPAYMENT TEST URL:: localhost:3000/payment\nCANCEL TEST URL:: localhost:3000/cancel \n\n**'))
```

```python
from flask import Flask, render_template, request
from datetime import datetime
import hashlib, requests, sys, json
from base64 import b64encode, b64decode
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes

app = Flask(__name__)

def getSignData(str):
    encoded_str = str.encode()
    EncryptData = hashlib.sha256(encoded_str).hexdigest()
    return EncryptData

def getEdiDate():
    YYYYmmddHHMMSS = datetime.today().strftime("%Y%m%d%H%M%S")
    return str(YYYYmmddHHMMSS)

##Req variables
Amt         = "1004"                          # 결제상품금액
BuyerEmail  = "happy@day.co.kr"               # 구매자메일주소
BuyerName   = "나이스"                        # 구매자명 
BuyerTel    = "01000000000"                   # 구매자연락처 
EdiDate     = getEdiDate()                    # 거래 날짜   
GoodsName   = "상품"                          # 결제상품명
MerchantKey = "EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg==" #상점키
MID         = "nicepay00m"                    # 상점아이디
Moid        = "mnoid1234567890"               # 상품주문번호  
CancelPwd   = "123456"                        # 취소비밀번호       
ReturnURL   = "http://localhost:5000/authReq" # Mobile only

@app.route('/cancel')
def reqCancel():
    return render_template(
        'cancelRequest.html',
        title="hello world"
    )

#Cancel
@app.route('/cancelReq', methods=['POST'])
def cancelReq():   
    TID=request.form['TID']
    CancelAmt=request.form['CancelAmt']
    PartialCancelCode=request.form['PartialCancelCode']
    Moid="test"
    CancelMsgKr="고객요청"
    CancelMsg=CancelMsgKr.encode("euc-kr","ignore") 
    EdiDate=getEdiDate()
    SignData=getSignData(MID + CancelAmt + EdiDate + MerchantKey)

    data = {
        'TID': TID,
        'MID': MID,
        'Moid': Moid,
        'CancelAmt': CancelAmt,
        'CancelMsg': CancelMsg, #취소 메시지 한글 처리하는경우 인코딩 EUC-KR로 요청
        'PartialCancelCode': PartialCancelCode,
        'EdiDate': EdiDate,
        'SignData': SignData
    }
    resDict = authRequest("https://pg-api.nicepay.co.kr/webapi/cancel_process.jsp", data)
    return render_template(
        'result.html',
        result=resDict
    )         

if __name__ == '__main__':
    app.run(debug=True)
```