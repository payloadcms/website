---
title: "Manual"
source: "https://developers.nicepay.co.kr/manual-virtual-account.php"
author:
published:
created: 2025-11-29
description:
tags:
  - "clippings"
---
![](https://developers.nicepay.co.kr/images/virtual_account/Vbank_Full_Flow.png)

| 파라미터명 | 파라미터설명 |
| --- | --- |
| TID | 30 byte 필수 거래 ID, 예) nictest00m03011912191404041136   TID 생성 규칙에 대한 상세 내용은 [FAQ 내 TID 생성 규칙 항목](https://developers.nicepay.co.kr/tip.php#1652) 참고 |
| MID | 10 byte 필수 가맹점 ID |
| EdiDate | 14 byte 필수 전문생성일시 (YYYYMMDDHHMMSS) |
| Moid | 64 byte 필수 가맹점에서 부여한 주문번호 (Unique하게 구성) |
| Amt | 12 byte 필수 결제 금액 (숫자만 입력) |
| GoodsName | 40 byte 필수 상품명 |
| SignData | 256 byte 필수 hex(sha256(MID + Amt + EdiDate + Moid + MerchantKey)), 위변조 검증 데이터 |
| CashReceiptType | 1 byte 필수 현금영수증 타입 (0: 미발행, 1: 소득공제, 2: 지출증빙) |
| ReceiptTypeNo | 11 byte 현금영수증 발급번호, **CashReceiptType 값을 1 또는 2로 입력한 경우 필수** 이며 '-' 기호 없이 숫자만 입력   \- CashReceiptType이 1인 경우 휴대폰번호 입력   \- CashReceiptType이 2인 경우 사업자번호 입력 |
| BankCode | 3 byte 필수 은행코드, 가상계좌 발급 가능 은행 코드는 [은행/증권사 코드 항목](https://developers.nicepay.co.kr/manual-code-partner.php#partner-code) 참고 |
| VbankExpDate | 12 byte 필수 가상계좌 입금만료일, 8자리(YYYYMMDD) 또는 12자리(YYYYMMDDHHMI) 입력 |
| VbankAccountName | 30 byte 가상계좌 예금주명, 해당 파라미터 사용 전 영업담당자와 협의 필요 |
| BuyerEmail | 60 byte 메일주소, 예) test@abc.com |
| BuyerTel | 20 byte 구매자 연락처 |
| BuyerName | 30 byte 구매자명 |
| CharSet | 10 byte 인증 응답 인코딩 (euc-kr(default) / utf-8) |
| EdiType | 10 byte 응답전문 유형 (JSON / KV) \*KV:Key=value |

| 파라미터명 | 파라미터설명 |
| --- | --- |
| ResultCode | 4 byte 필수 결과코드 (4100: 성공 / 그외 실패) |
| ResultMsg | 100 byte 필수 결과 메시지 |
| TID | 30 byte 필수 거래 ID |
| Moid | 64 byte 필수 주문번호 |
| Amt | 12 byte 필수 금액, 예)1000원인 경우 -> 000000001000 |
| AuthDate | 12 byte 가상계좌 발급일시(YYMMDDHHMISS) |
| VbankBankCode | 3 byte 가상계좌 은행 코드 |
| VbankBankName | 20 byte 가상계좌 은행명 |
| VbankNum | 20 byte 가상계좌 번호 |
| VbankExpDate | 2 byte 가상계좌 입금만료일자 |
| VbankExpTime | 1 byte 가상계좌 입금만료시간 (HHMISS) |

```java
<%@ page contentType="text/html; charset=euc-kr"%>
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
request.setCharacterEncoding("euc-kr"); 
/*
****************************************************************************************
* (요청 값 정보)
* 아래 파라미터에 요청할 값을 알맞게 입력합니다.
****************************************************************************************
*/

String mid                 = "nicepay00m"; // 가맹점 아이디
String moid             = "";    // 가맹점 주문번호
String amt                 = "";    // 결제 금액
String goodsName         = "";    // 상품명
String cashReceiptType     = "";    // 현금영수증 요청 타입
String receiptTypeNo     = "";    // 현금영수증 발급 번호
String bankCode         = "";    // 은행 코드
String vbankExpDate     = "";    // 가상계좌 입금만료일

// 요청할 거래번호(TID)를 생성합니다.
String TID = makeTID(mid, "03", "01"); //거래번호 생성

// 결과 코드와 메세지를 저장할 변수를 미리 선언합니다.
String ResultCode     = "";
String ResultMsg     = "";

/*
*******************************************************
* (위변조 검증값 암호화 - 수정하지 마세요)
* SHA-256 해쉬 암호화는 거래 위변조를 막기 위한 방법입니다. 
*******************************************************
*/
DataEncrypt sha256Enc     = new DataEncrypt();

String ediDate             = getyyyyMMddHHmmss();
String SignData         = sha256Enc.encrypt(MID + Amt + ediDate + Moid + merchantKey);

/*
****************************************************************************************
* <승인 요청>
* 승인에 필요한 데이터 생성 후 server to server 통신을 통해 승인 처리 합니다.
* 명세서를 참고하여 필요에 따라 파라미터와 값을 Key=Value 형태로 추가해주세요.
****************************************************************************************
*/
StringBuffer requestData = new StringBuffer();
requestData.append("TID=").append(TID).append("&");
requestData.append("MID=").append(mid).append("&");
requestData.append("EdiDate=").append(ediDate).append("&");
requestData.append("Moid=").append(moid).append("&");
requestData.append("Amt=").append(amt).append("&");
requestData.append("GoodsName=").append(goodsName).append("&");
requestData.append("SignData=").append(hashString).append("&");
requestData.append("CashReceiptType=").append(cashReceiptType).append("&");
requestData.append("ReceiptTypeNo=").append(receiptTypeNo).append("&");
requestData.append("BankCode=").append(bankCode).append("&");
requestData.append("VbankExpDate=").append(vbankExpDate).append("&");
requestData.append("Charset=").append("utf-8");

//API 호출, 결과 데이터가 resultJsonStr 변수에 저장됩니다.
String resultJsonStr = connectToServer(requestData.toString(), "https://webapi.nicepay.co.kr/webapi/get_vacount.jsp");

//결과 데이터를 HashMap 형태로 변환합니다. 
HashMap resultData = new HashMap();
resultData = jsonStringToHashMap(resultJsonStr);

ResultCode     = (String)resultData.get("ResultCode");
ResultMsg     = (String)resultData.get("ResultMsg");

%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>NICEPAY VBANK_RESULT(UTF-8)</title>
<meta charset="utf-8">
<meta name="viewport"
    content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=yes, target-densitydpi=medium-dpi" />
</head>
<body>
<div class="top">가상계좌 발급 결과 </div>
    <div class="conwrap">
        <div class="tabletypea">
            <table>
                <colgroup>
                    <col width="150px" />
                    <col width="*">
                </colgroup>
                <tr>
                    <th><span>ResultCode</span></th>
                    <td><%=ResultCode%></td>
                </tr>
                <tr>
                    <th><span>ResultMsg</span></th>
                    <td><%=ResultMsg%></td>
                </tr>
                <tr>
                    <th><span>TID</span></th>
                    <td><%=TID%></td>
                </tr>
                <tr>
                    <th><span>Moid</span></th>
                    <td><%=Moid%></td>
                </tr>
                <tr>
                    <th><span>AuthDate</span></th>
                    <td><%=AuthDate%></td>
                </tr>
                <tr>
                    <th><span>VbankBankCode</span></th>
                    <td><%=VbankBankCode%></td>
                </tr>
                <tr>
                    <th><span>VbankBankName</span></th>
                    <td><%=VbankBankName%></td>
                </tr>
                <tr>
                    <th><span>VbankExpTime</span></th>
                    <td><%=VbankExpTime%></td>
                </tr>
                <tr>
                    <th><span>VbankNum</span></th>
                    <td><%=VbankNum%></td>
                </tr>
            </table>
        </div>
    </div>
</body>
</html>
<%!
// 중요!. 가맹점 MID에 맞는 key값을 설정하세요.
static final String merchantKey = "EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg==";    //nicepay00m의 상점키

// yyyyMMddHHmmss 형식 date 생성 함수
public final synchronized String getyyyyMMddHHmmss(){
    SimpleDateFormat yyyyMMddHHmmss = new SimpleDateFormat("yyyyMMddHHmmss");
    return yyyyMMddHHmmss.format(new Date());
}

// SHA-256 형식으로 암호화
public static class DataEncrypt{
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

/*
 * 대외 통신 샘플.
 *  외부 기관과 URL 통신하는 샘플 함수입니다.
 *  샘플소스는 서비스 안정성을 보장하지 않으므로, 가맹점 환경에 맞게 구현 바랍니다.
 *  샘플소스 이용에 따른 이슈 발생시 NICEPAY에서 책임지지 않습니다. 
 */
public static String connectToServer(String data, String reqUrl) throws Exception{
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
        conn.setConnectTimeout(15000);
        conn.setReadTimeout(25000);
        conn.setDoOutput(true);
        
        pw = new PrintWriter(conn.getOutputStream());
        pw.write(data);
        pw.flush();
        
        statusCode = conn.getResponseCode();
        resultReader = new BufferedReader(new InputStreamReader(conn.getInputStream(), "euc-kr"));
        for(String temp; (temp = resultReader.readLine()) != null;){
            recvBuffer.append(temp).append("\n");
        }
        
        if(!(statusCode == HttpURLConnection.HTTP_OK)){
            throw new Exception("ERROR");
        }
        
        return recvBuffer.toString().trim();
    }catch (Exception e){
        return "ERROR";
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

// json형태의 String을 HashMap으로 변환해주는 함수입니다. 
private static HashMap jsonStringToHashMap(String str) throws Exception{
    HashMap dataMap = new HashMap();
    JSONParser parser = new JSONParser();
    try{
        Object obj = parser.parse(str);
        JSONObject jsonObject = (JSONObject)obj;

        Iterator keyStr = jsonObject.keySet().iterator();
        while(keyStr.hasNext()){
            String key = keyStr.next();
            Object value = jsonObject.get(key);
            
            dataMap.put(key, value);
        }
    }catch(Exception e){
        
    }
    return dataMap;
}

/**
 *  TID 생성샘플.
 *  makeTID() 함수는 데이터의 유일성을 보장하지 않습니다.
 *  반드시 가맹점환경에 맞게 unique한 값을 생성할 수 있도록 구현 바랍니다.
 *  샘플소스 이용에 따른 이슈 발생시 NICEPAY에서 책임지지 않습니다.
*/
public static String makeTID(String mid, String svcCd, String prdtCd){
    SimpleDateFormat sdf = new SimpleDateFormat("yyMMddHHmmss");
    String yyMMddHHmmss = sdf.format(new Date());
    
    StringBuffer sb = new StringBuffer(mid);
    sb.append(svcCd);
    sb.append(prdtCd);
    sb.append(yyMMddHHmmss);
    sb.append(String.valueOf(Math.random()).substring(2, 6));
    return sb.toString();
}
%>
```

```php
<?php
header("Content-Type:text/html; charset=utf-8;"); 

// 가상계좌 발급 API 요청 URL
$postURL = "https://webapi.nicepay.co.kr/webapi/get_vacount.jsp";

// 요청 파라미터
$tid                 = "";                            // 거래 ID
$mid                 = "nicepay00m";                    // 가맹점 아이디
$moid                 = "";                            // 가맹점 주문번호
$amt                 = "";                            // 결제 금액
$goodsName             = "";                            // 상품명
$cashReceiptType     = "";                            // 현금영수증 요청 타입
$receiptTypeNo         = "";                            // 현금영수증 발급번호
$bankCode             = "";                            // 은행코드
$vbankExpDate         = "";                            // 가상계좌 입금만료일            

// 해시 암호화 데이터
$ediDate = date("YmdHis");
$merchantKey = "EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg=="; // 상점키
$signData = bin2hex(hash('sha256', $mid . $amt . $ediDate . $moid . $merchantKey, true));

// 응답 인코딩 설정
$charSet = "UTF-8";    

/*
****************************************************************************************
* <응답 파라미터 정의>
* 샘플 페이지에서는 응답 결과 파라미터 중 일부만 예시되어 있으며, 
* 추가적으로 사용하실 파라미터는 연동메뉴얼을 참고하세요.
****************************************************************************************
*/

$response = "";

$data = Array(
    'TID' => $tid,
    'MID' => $mid,
    'EdiDate' => $ediDate,
    'Moid' => $moid,
    'Amt' => $amt,
    'GoodsName' => $goodsName,
    'SignData' => $signData
    'CashReceiptType' => $cashReceiptType,
    'ReceiptTypeNo' => $receiptTypeNo,
    'BankCode' => $bankCode,
    'VbankExpDate' => $vbankExpDate,
    'CharSet' => $charSet,        
);        

$response = reqPost($data, $postURL); //승인 호출
jsonRespDump($response); //response json dump example
        
    
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

```javascript
const express = require('express')
const axios = require('axios')
const app = express()
const port = 3000
const iconv = require('iconv-lite')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const CryptoJS = require('crypto-js')
const format = require('date-format');
const fs = require('fs')
const ejs = require('ejs')

/*
****************************************************************************************
* 가맹점관리자 페이지(npg.nicepay.co.kr) 로그인 > 가맹점 정보 > Key관리
* 상기 경로를 통해서 가맹점 아이디인 MID와 가맹점 키 값을 확인하여 
* 아래 merchantID, merchantKey 파라미터에 각각 입력합니다.  
****************************************************************************************
*/
const merchantID = 'nicepay00m';                                                                                     // 가맹점 ID
const merchantKey = 'EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg==';        // 가맹점 Key

// API 요청 전문 생성 시 시간 정보를 저장합니다. 
const ediDate = format.asString('yyyyMMddhhmmss', new Date()); 

// 요청할 거래번호(TID)를 생성합니다.
const ranNum = Math.floor(Math.random()*(9999-1000+1)) + 1000;
const transactionID = merchantID + "0301" + ediDate.substr(2,12) + ranNum; 

// 아래 파라미터에 요청할 값을 알맞게 입력합니다. 
const moid = '';            // 가맹점 주문번호
const amt = '';             // 금액
const goodsName = '';       // 상품명
const cashReceiptType = ''; // 현금영수증 요청 타입
const receiptTypeNo = '';   // 현금영수증 발급번호
const bankCode = '';        // 가상계좌 은행 코드
const vbankExpDate = '';    // 가상계좌 입금만료일자

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

app.post(/vbank, async function(req, res){
    
    // 데이터 위변조 검증값을 생성합니다. (거래 위변조를 막기 위한 방법입니다. 수정을 금지합니다.)
    const signData = getSignData(merchantID + amt + ediDate + moid + merchantKey).toString();
    
    // 가상계좌 발급 API 요청 후 응답을 받아 console과 브라우저에 출력합니다. 
    const response = await axios({
        url: 'https://webapi.nicepay.co.kr/webapi/get_vacount.jsp',
        method: 'POST',
        headers: {
            'User-Agent': 'Super Agent/0.0.1',
            'Content-Type': 'application/x-www-form-urlencoded; charset=euc-kr',
        },
        data: {
            TID: transactionID,
            MID: merchantID,
            EdiDate: ediDate,
            Moid: moid,
            Amt: amt,
            GoodsName: goodsName,
            SignData: signData,
            CashReceiptType: cashReceiptType,
            ReceiptTypeNo: receiptTypeNo,
            BankCode: bankCode,
            VbankExpDate: vbankExpDate,
            CharSet: 'utf-8'    
        } 
    });

    console.log('요청 결과:', response.data);
    res.json(response.data);
})

//위변조 검증을 위한 SHA-256 암호화 방식입니다.
function getSignData(str) {
    const encrypted = CryptoJS.SHA256(str);
    return encrypted;
}

app.listen(port, () => console.log('**\n\nPAYMENT TEST URL:: localhost:3000/vbank\n\n**'))
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

# 위변조 검증을 위한 SHA-256 암호화 함수입니다.
def getSignData(str):
    encoded_str = str.encode()
    SignData = hashlib.sha256(encoded_str).hexdigest()
    return SignData

# API 요청 전문 생성 시 시간 정보를 저장합니다. 
def getEdiDate():
    YYYYmmddHHMMSS = datetime.today().strftime("%Y%m%d%H%M%S")
    return str(YYYYmmddHHMMSS)

# API 요청을 위한 Header 정보를 세팅 후 실제 API를 호출하고 결과값을 출력하는 함수입니다.    
def apiRequest(url, data):
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

    
# TID 생성 규칙에 맞게 거래일시(YYMMDDHHMISS)를 생성하는 함수입니다.
def TIME():
    YYmmddHHMMSS = datetime.today().strftime("%y%m%d%H%M%S")
    return str(YYmmddHHMMSS)

# TID 생성 규칙에 맞게 뒤 랜덤 4자리를 생성하는 함수입니다.
def RANDOM():
    a = [random.randint(0,9), random.randint(0,9),random.randint(0,9),random.randint(0,9)]
    s = str("".join(map(str,a)))
    return str(s)

# 가맹점관리자 페이지(npg.nicepay.co.kr) 로그인 > 가맹점 정보 > Key관리
# 상기 경로를 통해서 가맹점 아이디인 MID와 가맹점 키 값을 확인하여 
# 아래 merchantID, merchantKey 파라미터에 각각 입력합니다.  

MID                = "nicepay00m"                                                                                    # 가맹점 아이디(MID)
MerchantKey        = "EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg=="    # 가맹점 키
                                            
# TIME(), RANDOM() 함수를 통해 생성한 시간 정보와 랜덤 4자리 값을 가져와 API 요청에 필요한 거래번호(TID)를 생성합니다.
# 가맹점 환경에 맞게 TID를 unique하게 생성할 수 있도록 별도 구현하는 것을 권장합니다. 
time            = TIME()                                                                                        # TID 생성규칙 - 거래 날짜 
random          = RANDOM()                                                                                        # TID 생성규칙 - 랜덤4자리
TID                = MID + "0301" + time + random                                                                    # 거래번호

# 아래 파라미터에 요청할 값을 알맞게 입력합니다.                                                                                         
Moid            = ""                                                                                            # 상품주문번호 
Amt                = ""                                                                                            # 결제상품금액
GoodsName        = ""                                                                                            # 결제상품명
CashReceiptType = ""                                                                                            # 현금영수증 요청 타입
ReceiptTypeNo   = ""                                                                                            # 현금영수증 발급 번호
BankCode        = ""                                                                                            # 은행코드
VbankExpDate    = ""                                                                                            # 가상계좌 입금만료일

@app.route(methods=['POST'])
def vbankReq():   
    TID=TID
    MID=MID
    Moid=Moid
    Amt=Amt
    GoodsName=GoodsName
    CashReceiptType=CashReceiptType
    ReceiptTypeNo=ReceiptTypeNo
    BankCode=BankCode
    VbankExpDate=VbankExpDate
    
    # API 요청 전문 생성 일시를 EdiDate 파라미터의 값으로 입력합니다. 
    EdiDate=getEdiDate()
    
    # 데이터 위변조 검증값을 생성합니다. (거래 위변조를 막기 위한 방법입니다. 수정을 금지합니다.)
    SignData=getSignData(MID + Amt + EdiDate + Moid + MerchantKey)
    
    # 가상계좌 발급 API 요청을 위한 Target URL 입니다.
    vbankURL="https://webapi.nicepay.co.kr/webapi/get_vacount.jsp"

    # 명세서를 참고하여 필요에 따라 파라미터와 값을 'key': 'value' 형태로 추가해주세요.
    data = {
        'TID': TID,
        'MID': MID,
        'EdiDate': EdiDate,
        'Moid': Moid, 
        'Amt': Amt,
        'GoodsName': GoodsName,
        'SignData': SignData
        'CashReceiptType': CashReceiptType,
        'ReceiptTypeNo': ReceiptTypeNo,
        'BankCode': BankCode,
        'VbankExpDate': VbankExpDate        
    }
    
    # vbankURL로 data를 전달하여 API를 호출합니다.
    resDict = apiRequest(vbankURL, data)

    # 결과를 응답받아 'result.html'에 값을 전달합니다.
    return render_template(
        'result.html',
        result=resDict
    )             

if __name__ == '__main__':
    app.run(debug=True)
```

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
String resultJsonStr = connectToServer(requestData.toString(), "https://webapi.nicepay.co.kr/webapi/cancel_process.jsp");

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
    $response = reqPost($data, "https://webapi.nicepay.co.kr/webapi/cancel_process.jsp"); //취소 API 호출
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
        var result = apiRequest("https://webapi.nicepay.co.kr/webapi/cancel_process.jsp", postData);

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

const merchantKey = 'EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg==';
const merchantID = 'nicepay00m';

const ediDate = format.asString('yyyyMMddhhmmss', new Date());

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

//cancel request
app.post('/cancel', async function(req, res) {

    const tid = '';
    const moid = '';
    const cancelAmt = '';
    const cancelMsg = 'test'; //취소 메시지 한글 처리하는경우 인코딩 EUC-KR로 요청, iconv-lite 사용 불가
    const partialCancelCode = '';
    const signData = getSignData(merchantID + cancelAmt + ediDate + merchantKey).toString();

    // 결제 취소 API 요청 후 응답을 받아 console과 브라우저에 출력합니다.
    try {
        const cancelResponse = await axios({
            url: 'https://webapi.nicepay.co.kr/webapi/cancel_process.jsp',
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
    resDict = authRequest("https://webapi.nicepay.co.kr/webapi/cancel_process.jsp", data)
    return render_template(
        'result.html',
        result=resDict
    )         

if __name__ == '__main__':
    app.run(debug=True)
```