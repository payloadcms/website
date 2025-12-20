---
title: "Manual"
source: "https://developers.nicepay.co.kr/manual-card-billing.php"
author:
published:
created: 2025-11-29
description:
tags:
  - "clippings"
---
![](https://developers.nicepay.co.kr/images/card_billing_flow_v2/Card_Billing_Full_Flow.png)

![](https://developers.nicepay.co.kr/images/card_billing_flow_v2/Card_Billkey_Non_Auth_Create_Flow.png)

| 파라미터명 | 파라미터설명 |
| --- | --- |
| MID | 10 byte 필수 가맹점 ID |
| EdiDate | 14 byte 필수 전문생성일시 (YYYYMMDDHHMMSS) |
| Moid | 64 byte 필수 가맹점에서 부여한 주문번호 (Unique하게 구성) |
| EncData | 512 byte 필수 결제 정보 암호화 데이터      \- 암호화 알고리즘: AES128/ECB/PKCS5padding   \- 암호화 결과 인코딩: Hex Encoding   \- 암호 Key: 가맹점에 부여된 MerchantKey 앞 16자리      결제정보 암호화 생성 규칙: Hex(AES(CardNo=value&ExpYear=YY&ExpMonth=MM&IDNo=value&CardPw=value))   \*파라미터 상세 정보는 아래 "EncData 하위 파라미터 상세" 내용 참고 |
| SignData | 256 byte 필수 hex(sha256(MID + EdiDate + Moid + MerchantKey)), 위변조 검증 데이터 |
| BuyerEmail | 60 byte 메일주소, 예) test@abc.com |
| BuyerTel | 20 byte 구매자 연락처 |
| BuyerName | 30 byte 구매자명 |
| CharSet | 10 byte 인증 응답 인코딩 (euc-kr(default) / utf-8) |
| EdiType | 10 byte 응답전문 유형 (JSON / KV) \*KV:Key=value |

  

| 파라미터명 | 파라미터설명 |
| --- | --- |
| CardNo | 16 byte 필수 카드번호 |
| ExpYear | 2 byte 필수 카드 유효기간(년) (YY) |
| ExpMonth | 2 byte 필수 카드 유효기간(월) (MM) |
| IDNo | 13 byte 계약 현황에 따라 전달 필요(영업담당자 협의) 생년월일(6자리, YYMMDD) 또는 사업자번호(10자리) |
| CardPw | 2 byte 계약 현황에 따라 전달 필요(영업담당자 협의) 카드 비밀번호 앞 2자리 |

| 파라미터명 | 파라미터설명 |
| --- | --- |
| ResultCode | 4 byte 필수 결과 코드 (F100: 성공 / 그외 실패) |
| ResultMsg | 100 byte 필수 결과 메시지 |
| TID | 30 byte 필수 거래 ID |
| BID | 30 byte 빌키, 가맹점에서 관리하여 승인 요청 시 전달   예) BIKYnictest00m1104191651325596 |
| AuthDate | 8 byte 빌키 발급일자(YYYYMMDD) |
| CardCode | 4 byte 카드사 코드 |
| CardName | 20 byte 카드사명 |
| CardCl | 1 byte 카드타입 (0: 신용카드, 1: 체크카드) |
| AcquCardCode | 4 byte 매입 카드사 코드 |
| AcquCardName | 20 byte 매입 카드사명 |

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
<%@ page import="java.util.StringTokenizer" %>
<%@ page import="javax.crypto.Cipher" %>
<%@ page import="javax.crypto.spec.SecretKeySpec" %>
<%@ page import="org.json.simple.JSONObject" %>
<%@ page import="org.json.simple.parser.JSONParser" %>
<%@ page import="org.apache.commons.codec.binary.Hex" %>
<%
request.setCharacterEncoding("euc-kr"); 

/*
****************************************************************************************
* <요청 값 정보>
* 아래 파라미터에 요청할 값을 알맞게 입력합니다.
****************************************************************************************
*/
String MID             = "nictest04m";    // 상점 ID
String Moid            = "";    // 주문번호

String CardNo         = "";    // 카드번호
String ExpYear         = "";    // 유효기간(년)
String ExpMonth     = "";    // 유효기간(월)
String IDNo         = "";    // 생년월일/사업자번호
String CardPw         = "";    // 카드비밀번호

//결과 코드와 메세지를 저장할 변수를 미리 선언합니다.
String ResultCode     = "";
String ResultMsg     = "";

/*
*******************************************************
* <해쉬암호화> (수정하지 마세요)
* SHA-256 해쉬암호화는 거래 위변조를 막기위한 방법입니다. 
*******************************************************
*/
DataEncrypt sha256Enc     = new DataEncrypt();
String ediDate             = getyyyyMMddHHmmss();
String SignData         = sha256Enc.encrypt(MID + ediDate + Moid + merchantKey);

/*
*******************************************************
* <AES암호화> (수정하지 마세요)
* AES 암호화는 결제 카드정보를 암호화 하기 위한 방법입니다.
* Key=Value 형태의 Plain-Text로 카드정보를 나열합니다.
* IDNo와 CardPw는 MID에 설정된 인증방식에 따라 필수 여부가 결정됩니다. 
*******************************************************
*/
StringBuffer EncDataBuf = new StringBuffer();
EncDataBuf.append("CardNo=").append(CardNo).append("&");
EncDataBuf.append("ExpYear=").append(ExpYear).append("&");
EncDataBuf.append("ExpMonth=").append(ExpMonth).append("&");
EncDataBuf.append("IDNo=").append(IDNo).append("&");
EncDataBuf.append("CardPw=").append(CardPw);
String EncData = encryptAES(EncDataBuf.toString(), merchantKey.substring(0,16));

/*
****************************************************************************************
* <빌키 발급 요청>
* 빌키 발급에 필요한 데이터 생성 후 server to server 통신을 통해 승인 처리 합니다.
* 명세서를 참고하여 필요에 따라 파라미터와 값을 Key=Value 형태로 추가해주세요.
****************************************************************************************
*/
StringBuffer requestData = new StringBuffer();
requestData.append("MID=").append(MID).append("&");
requestData.append("EdiDate=").append(ediDate).append("&");
requestData.append("Moid=").append(Moid).append("&");
requestData.append("EncData=").append(EncData).append("&");
requestData.append("SignData=").append(SignData);
    
//API 호출, 결과 데이터가 resultJsonStr 변수에 저장됩니다.
String resultJsonStr = connectToServer(requestData.toString(), "https://webapi.nicepay.co.kr/webapi/billing/billing_regist.jsp");

//결과 데이터를 HashMap 형태로 변환합니다. 
HashMap resultData = new HashMap();
resultData = jsonStringToHashMap(resultJsonStr);

ResultCode     = (String)resultData.get("ResultCode");
ResultMsg     = (String)resultData.get("ResultMsg");

%>
<!DOCTYPE html>
<html>
<head>
<title>NICEPAY BILLING REGIST REQUEST(EUC-KR) SAMPLE</title>
<meta charset="euc-kr">
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=yes, target-densitydpi=medium-dpi" />
<link rel="stylesheet" type="text/css" href="../css/import.css"/>
</head>
<body> 
<div class="payfin_area">
    <div class="top">빌키 발급 결과</div>
    <div class="conwrap">
        <div class="con">
            <div class="tabletypea">
                <table>
                    <colgroup><col width="200px"/><col width="*"/></colgroup>
                    <tr>
                        <th><span>빌키발급 결과 내용</span></th>
                        <td>[<%=ResultCode%>]<%=ResultMsg%></td>
                    </tr>
                    <tr>
                        <th><span>빌키발급 응답 데이터</span></th>
                        <td><%=resultJsonStr%></td>
                    </tr>
                </table>
            </div>
        </div>
        <p>*테스트 아이디인경우 당일 오후 11시 30분에 취소됩니다.</p>
    </div>
</div>
</body>
</html>
<%!
//중요!. 가맹점 MID에 맞는 key값을 설정하세요.
static final String merchantKey = "b+zhZ4yOZ7FsH8pm5lhDfHZEb79tIwnjsdA0FBXh86yLc6BJeFVrZFXhAoJ3gEWgrWwN+lJMV0W4hvDdbe4Sjw=="; //nictest04m의 상점키

//yyyyMMddHHmmss 형식 date 생성 함수
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

/**
 * 대외 통신 샘플.
 *  외부 기관과 URL 통신하는 샘플 함수 입니다.
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

//json형태의 String을 HashMap으로 변환해주는 함수입니다. 
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

//hex aes 암호화 샘플 (카드 정보를 암호화할 때 사용합니다.)
public static String encryptAES(String input, String key) {
    byte[] crypted = null;
    try {
        SecretKeySpec skey = new SecretKeySpec(key.getBytes(), "AES");

        Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
        cipher.init(Cipher.ENCRYPT_MODE, skey);
        crypted = cipher.doFinal(input.getBytes());
        
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < crypted.length; i++) {
            String hex = Integer.toHexString(crypted[i] & 0xFF);
            if (hex.length() == 1) {
                hex = '0' + hex;
            }
            sb.append(hex.toUpperCase());
        }
        return sb.toString(); 
    } catch (Exception e) {
        e.printStackTrace();
    }
    return null;
}
%>
```

```php
<?php
header("Content-Type:text/html; charset=euc-kr;"); 

// 빌키 발급(비인증) API 요청 URL
$postURL = "https://webapi.nicepay.co.kr/webapi/billing/billing_regist.jsp";

/*
****************************************************************************************
* <요청 값 정보>
* 아래 파라미터에 요청할 값을 알맞게 입력합니다. 
****************************************************************************************
*/
$mid         = "nictest04m";        // 가맹점 아이디 
$moid         = "";                // 가맹점 주문번호
$buyerName     = "";                // 구매자명
$buyerTel     = "";                // 구매자 전화번호
$buyerEmail = "";                // 구매자 이메일
$cardNo     = "";                // 카드번호
$expYear     = "";                // 유효기간(년) 
$expMonth     = "";                // 유효기간(월) 
$idNo        = "";                // 주민번호 또는 사업자번호
$cardPw     = "";                // 카드 비밀번호 앞 2자리

// Key=Value 형태의 Plain-Text로 카드정보를 나열합니다.
// IDNo와 CardPw는 MID에 설정된 인증방식에 따라 필수 여부가 결정됩니다. 
$plainText = "CardNo=".$cardNo."&ExpYear=".$expYear."&ExpMonth=".$expMonth."&IDNo=".$idNo."&CardPw=".$cardPw;    // 카드정보 구성 (key=value&key=value&...)
        
// 결과 데이터를 저장할 변수를 미리 선언합니다. 
$response = "";    

/*
****************************************************************************************
* <위변조 검증값 및 카드 정보 암호화> (수정하지 마세요)
* SHA-256 해쉬 암호화는 거래 위변조를 막기위한 방법입니다. 
****************************************************************************************
*/    
$ediDate = date("YmdHis");                                                                                        // API 요청 전문 생성일시
$merchantKey = "b+zhZ4yOZ7FsH8pm5lhDfHZEb79tIwnjsdA0FBXh86yLc6BJeFVrZFXhAoJ3gEWgrWwN+lJMV0W4hvDdbe4Sjw==";        // 가맹점 키
$encData = bin2hex(aesEncryptSSL($plainText, substr($merchantKey, 0, 16)));                                        // 카드정보 암호화
$signData = bin2hex(hash('sha256', $mid . $ediDate . $moid . $merchantKey, true));                                // 위변조 데이터 검증 값 암호화

/*
****************************************************************************************
* <API 요청부>
* 명세서를 참고하여 필요에 따라 파라미터와 값을 'key'=>'value' 형태로 추가해주세요
****************************************************************************************
*/    

$data = Array(
    'MID' => $mid,
    'Moid' => $moid,
    'EdiDate' => $ediDate,
    'EncData' => $encData,
    'SignData' => $signData
);        

$response = reqPost($data, $postURL);                 //API 호출, 결과 데이터가 $response 변수에 저장됩니다.
jsonRespDump($response);                             //결과 데이터를 브라우저에 노출합니다.
        
    

// 카드 정보를 암호화할 때 사용하는 AES 암호화 (opnessl) 함수입니다. 
function aesEncryptSSL($data, $key){
    $iv = openssl_random_pseudo_bytes(16);
    $encdata = @openssl_encrypt($data, "AES-128-ECB", $key, true, $iv);
    return $encdata;
}

// json으로 응답된 결과 데이터를 배열 형태로 변환하여 출력하는 함수입니다. 
// 응답 데이터 출력을 위한 예시로 테스트 이후 가맹점 상황에 맞게 변경합니다. 
function jsonRespDump($resp){
    $resp_utf = iconv("EUC-KR", "UTF-8", $resp); 
    $respArr = json_decode($resp_utf);
    foreach ( $respArr as $key => $value ){
        echo "$key=". iconv("UTF-8", "EUC-KR", $value)."<br />";
    }
}

// API를 POST 형태로 호출하는 함수입니다. 
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
const format = require('date-format')
const fs = require('fs')
const ejs = require('ejs')

/*
****************************************************************************************
* 가맹점관리자 페이지(npg.nicepay.co.kr) 로그인 > 가맹점 정보 > Key관리
* 상기 경로를 통해서 가맹점 아이디인 MID와 가맹점 키 값을 확인하여 
* 아래 merchantID, merchantKey 파라미터에 각각 입력합니다.  
****************************************************************************************
*/
const merchantKey = 'b+zhZ4yOZ7FsH8pm5lhDfHZEb79tIwnjsdA0FBXh86yLc6BJeFVrZFXhAoJ3gEWgrWwN+lJMV0W4hvDdbe4Sjw=='; // 가맹점 키
const merchantID = 'nictest04m'; // 가맹점 ID

// API 요청 전문 생성 시 시간 정보를 저장합니다. 
const ediDate = format.asString('yyyyMMddhhmmss', new Date()); // API 요청 전문 생성일시

// 아래 파라미터에 요청값 정보를 알맞게 입력합니다. 
const cardNo = '';              // 카드번호
const expYear = '';            // 유효기간(년) 
const expMonth = '';          // 유효기간(월) 
const idNo = '';                 // 주민번호 또는 사업자번호
const cardPw = '';             // 카드 비밀번호 앞 2자리
const moid = '';                // 가맹점 주문번호

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

// 빌키 발급 요청
app.post('/bidCreate', async function(req, res){

    // Key=Value 형태의 Plain-Text로 카드정보를 나열합니다. 
    const aesString = 'CardNo=' + cardNo + '&ExpYear=' + expYear + '&ExpMonth=' + expMonth + '&IDNo=' + idNo + '&CardPw= + cardPw;
    
    // 데이터 위변조 검증값을 생성합니다. (거래 위변조를 막기 위한 방법입니다. 수정을 금지합니다.)
    const signData = getSignData(merchantID + ediDate + moid + merchantKey).toString();
    
    // 빌키 발급 API 요청 후 응답을 받아 console과 브라우저에 출력합니다. 
    const response = await axios({
        url: 'https://webapi.nicepay.co.kr/webapi/billing/billing_regist.jsp',
        method: 'POST',
        headers: {
            'User-Agent': 'Super Agent/0.0.1',
            'Content-Type': 'application/x-www-form-urlencoded; charset=euc-kr',
        },
        data: {
            MID: merchantID,
            EdiDate: ediDate,
            Moid: moid,
            EncData: getAES(aesString, merchantKey),
            SignData: signData,
            CharSet: 'utf-8'    
        } 
    });

    console.log('빌키 발급 결과:', response.data);
    res.json(response.data);
})

// 카드 정보를 암호화하기 위한 AES-128-ECB 암호화 함수입니다.
function getAES(text, key){
    const encKey = key.substr(0,16);
    
    const cipher = crypto.createCipheriv('aes-128-ecb', encKey, Buffer.alloc(0));
    const ciphertext = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]).toString('hex');

    return ciphertext;
}

//위변조 검증을 위한 SHA-256 암호화 방식입니다.
function getSignData(str) {
    const encrypted = CryptoJS.SHA256(str);
    return encrypted;
}
```

```python
import os
from datetime import datetime
import random
import hashlib
import requests
import json
from flask import Flask, render_template, request
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.padding import PKCS7
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes

app = Flask(__name__)

# 카드 정보를 암호화하기 위한 AES-128-ECB 암호화 함수입니다.
class AES128:
    def __init__(self, key: bytes):
        self.key = key
        self.backend = default_backend()

    def encrypt(self, data: bytes) -> bytes:
        padder = PKCS7(128).padder()
        encryptor = Cipher(algorithm=algorithms.AES(self.key), mode=modes.ECB(), backend=self.backend).encryptor()

        padded_data = padder.update(data) + padder.finalize()
        EncData = encryptor.update(padded_data) + encryptor.finalize()

        return EncData

# 위변조 검증을 위한 SHA-256 암호화 함수입니다.
def getSignData(str):
    encoded_str = str.encode()
    EncryptData = hashlib.sha256(encoded_str).hexdigest()
    return EncryptData

# API 요청 전문 생성 시 시간 정보를 저장합니다. 
def getEdiDate():
    YYYYmmddHHMMSS = datetime.today().strftime("%Y%m%d%H%M%S")
    return str(YYYYmmddHHMMSS)

# API 요청을 위한 Header 정보를 세팅 후 실제 API를 호출하고 결과값을 출력하는 함수입니다.    
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

# 가맹점관리자 페이지(npg.nicepay.co.kr) 로그인 > 가맹점 정보 > Key관리
# 상기 경로를 통해서 가맹점 아이디인 MID와 가맹점 키 값을 확인하여 
# 아래 merchantID, merchantKey 파라미터에 각각 입력합니다.  

MID                = "nictest04m"                                                                                    # 가맹점 아이디(MID)
MerchantKey        = "b+zhZ4yOZ7FsH8pm5lhDfHZEb79tIwnjsdA0FBXh86yLc6BJeFVrZFXhAoJ3gEWgrWwN+lJMV0W4hvDdbe4Sjw=="    # 가맹점 키
key                = "b+zhZ4yOZ7FsH8pm"                                                                             # 가맹점 키 앞 16자리 - 카드정보 암호화 시 사용되는 Key값

# 아래 파라미터에 요청할 값을 알맞게 입력합니다. 

BuyerEmail          = ""                                # 구매자메일주소
BuyerName          = ""                                # 구매자명 
BuyerTel          = ""                                # 구매자연락처 
EdiDate             = getEdiDate()                      # 거래 날짜   
Moid                = ""                                # 상품주문번호  
CardNo              = ""                                # 카드번호
ExpYear             = ""                                # 유효기간(년)
ExpMonth            = ""                                # 유효기간(월)
IDNo                = ""                                # 주민번호 또는 사업자번호
CardPw              = ""                                # 카드 비밀번호 앞 2자리

# 빌키 발급 요청
@app.route( methods=['POST'])
def billkeyReq():   
    MID=MID
    Moid=Moid
    CardNo=CardNo
    ExpYear=ExpYear
    ExpMonth=ExpMonth
    IDNo=IDNo
    CardPw=CardPw
    EdiDate=getEdiDate()
    
    # Key=Value 형태의 Plain-Text로 카드정보를 나열한 후 암호화합니다. 
    plainText="CardNo="+CardNo+"&ExpYear="+ExpYear+"&ExpMonth="+ExpMonth+"&IDNo="+IDNo+"&CardPw="+CardPw
    aes128=AES128(key=key.encode())
    EncData=aes128.encrypt(data=plainText.encode()).hex()

    # 데이터 위변조 검증값을 생성합니다. (거래 위변조를 막기 위한 방법입니다. 수정을 금지합니다.)
    SignData=getSignData(MID + EdiDate + Moid + MerchantKey)

    # 빌키 발급 API 요청을 위한 Target URL 입니다.
    billkeyURL="https://webapi.nicepay.co.kr/webapi/billing/billing_regist.jsp"

    # 명세서를 참고하여 필요에 따라 파라미터와 값을 'key': 'value' 형태로 추가해주세요.
    data = {
        'MID': MID,
        'EdiDate': EdiDate,
        'Moid': Moid, 
        'EncData': EncData,
        'SignData': SignData
    }
    
    # billkeyURL로 data를 전달하여 API를 호출합니다.
    resDict = authRequest(billkeyURL, data)

    # 결과를 응답받아 'result.html'에 값을 전달합니다.
    return render_template(
        'result.html',
        result=resDict
    )             

if __name__ == '__main__':
    app.run(debug=True)
```

![](https://developers.nicepay.co.kr/images/card_billing_flow_v2/Card_Billing_Payment_Flow.png)

| 파라미터명 | 파라미터설명 |
| --- | --- |
| BID | 30 byte 필수 빌키 |
| MID | 10 byte 필수 가맹점 ID |
| TID | 30 byte 필수 거래 ID, 예) nictest00m01161912191423110323   빌키 발급 시 응답받은 TID 그대로 사용 시 오류 발생 (승인 TID 중복 오류), 반드시 새로 생성하여 사용할 것.   TID 생성 규칙에 대한 상세 내용은 [FAQ 내 TID 생성 규칙 항목](https://developers.nicepay.co.kr/tip.php#1652) 참고 |
| EdiDate | 14 byte 필수 전문생성일시 (YYYYMMDDHHMMSS) |
| Moid | 64 byte 필수 가맹점에서 부여한 주문번호 (Unique하게 구성) |
| Amt | 12 byte 필수 결제 금액 (숫자만 입력) |
| GoodsName | 40 byte 필수 상품명 (" 등 특수기호 사용 시 별도 문의) |
| SignData | 256 byte 필수 hex(sha256(MID + EdiDate + Moid + Amt + BID + MerchantKey)), 위변조 검증 데이터 |
| CardInterest | 1 byte 필수 가맹점 분담 무이자 할부 이벤트 사용 여부 (0: 미사용, 1: 사용(무이자)) |
| CardQuota | 2 byte 필수 할부개월 (00: 일시불, 02: 2개월, 03: 3개월,...) |
| BuyerEmail | 60 byte 메일주소, 예) test@abc.com |
| BuyerTel | 20 byte 구매자 연락처 |
| BuyerName | 30 byte 구매자명 |
| CharSet | 10 byte 인증 응답 인코딩 (euc-kr(default) / utf-8) |
| EdiType | 10 byte 응답전문 유형 (JSON / KV) \*KV:Key=value |
| MallReserved | 500 byte 가맹점 여분필드 (나이스페이 가공 없음) |

| 파라미터명 | 파라미터설명 |
| --- | --- |
| ResultCode | 4 byte 필수 결과코드 (3001: 성공 / 그외 실패) |
| ResultMsg | 100 byte 필수 결과 메시지 |
| TID | 30 byte 필수 거래 ID |
| Moid | 64 byte 필수 주문번호 |
| Amt | 12 byte 필수 금액, 예)1000원인 경우 -> 000000001000 |
| AuthCode | 30 byte 승인번호 |
| AuthDate | 12 byte 승인일시(YYMMDDHHMISS) |
| AcquCardCode | 4 byte 매입 카드사 코드 |
| AcquCardName | 20 byte 매입 카드사명 |
| CardNo | 20 byte 카드번호(일부 마스킹 처리), 예) 12345678\*\*\*\*1234 |
| CardCode | 4 byte 카드사 코드 |
| CardName | 20 byte 카드사명 |
| CardQuota | 2 byte 할부개월 |
| CardCl | 1 byte 카드타입 (0: 신용카드, 1: 체크카드) |
| CcPartCl | 1 byte 부분취소 가능 여부 (0: 불가능, 1: 가능) |
| CardInterest | 1 byte 무이자 여부 (0: 이자, 1: 무이자) |
| MallReserved | 500 byte 가맹점 여분필드 (요청 시 Data 그대로 전달) |

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
<%@ page import="java.util.StringTokenizer" %>
<%
request.setCharacterEncoding("euc-kr"); 

/*
****************************************************************************************
* <요청 값 정보>
* 아래 파라미터에 요청할 값을 알맞게 입력합니다.
****************************************************************************************
*/
String BID             = "";     // 빌링키
String MID             = "nictest04m";    // 상점 ID
String Moid            = "";     // 주문번호
String Amt             = "";     // 결제금액
String GoodsName     = "";     // 상품명
String CardInterest = "";    // 무이자여부
String CardQuota     = "";     // 할부개월

//요청할 거래번호(TID)를 생성합니다.
String TID = makeTID(MID, "01", "16");

//결과 코드와 메세지를 저장할 변수를 미리 선언합니다.
String ResultCode     = "";
String ResultMsg     = "";

/*
**********************************************************
* <해쉬암호화> (수정하지 마세요)
* SHA-256 해쉬암호화는 거래 위변조를 막기위한 방법입니다. 
**********************************************************
*/
DataEncrypt sha256Enc     = new DataEncrypt();
String ediDate             = getyyyyMMddHHmmss();
String SignData         = sha256Enc.encrypt(MID + ediDate + Moid + Amt + BID + merchantKey);

/*
****************************************************************************************
* <승인 요청>
* 승인에 필요한 데이터 생성 후 server to server 통신을 통해 승인 처리 합니다.
* 명세서를 참고하여 필요에 따라 파라미터와 값을 Key=Value 형태로 추가해주세요.
****************************************************************************************
*/
StringBuffer requestData = new StringBuffer();
requestData.append("TID=").append(TID).append("&");
requestData.append("BID=").append(BID).append("&");
requestData.append("MID=").append(MID).append("&");
requestData.append("EdiDate=").append(ediDate).append("&");
requestData.append("Moid=").append(Moid).append("&");
requestData.append("Amt=").append(Amt).append("&");
requestData.append("GoodsName=").append(URLEncoder.encode(GoodsName, "euc-kr")).append("&");
requestData.append("CardInterest=").append(CardInterest).append("&");
requestData.append("CardQuota=").append(CardQuota).append("&");
requestData.append("SignData=").append(SignData);
    
//API 호출, 결과 데이터가 resultJsonStr 변수에 저장됩니다.
String resultJsonStr = connectToServer(requestData.toString(), "https://webapi.nicepay.co.kr/webapi/billing/billing_approve.jsp");

//결과 데이터를 HashMap 형태로 변환합니다.
HashMap resultData = new HashMap();
resultData = jsonStringToHashMap(resultJsonStr);

ResultCode     = (String)resultData.get("ResultCode");
ResultMsg     = (String)resultData.get("ResultMsg");

%>
<!DOCTYPE html>
<html>
<head>
<title>NICEPAY BILLING SAMPLE</title>
<meta charset="euc-kr">
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=yes, target-densitydpi=medium-dpi" />
<link rel="stylesheet" type="text/css" href="../css/import.css"/>
</head>
<body> 
<div class="payfin_area">
    <div class="top">빌키 승인 결과</div>
    <div class="conwrap">
        <div class="con">
            <div class="tabletypea">
                <table>
                    <colgroup><col width="200px"/><col width="*"/></colgroup>
                    <tr>
                        <th><span>빌키승인 결과 내용</span></th>
                        <td>[<%=ResultCode%>]<%=ResultMsg%></td>
                    </tr>
                    <tr>
                        <th><span>빌키승인 응답 데이터</span></th>
                        <td><%=resultJsonStr%></td>
                    </tr>
                </table>
            </div>
        </div>
        <p>*테스트 아이디인경우 당일 오후 11시 30분에 취소됩니다.</p>
    </div>
</div>
</body>
</html>
<%!
//중요!. 가맹점 MID에 맞는 key값을 설정하세요.
static final String merchantKey = "b+zhZ4yOZ7FsH8pm5lhDfHZEb79tIwnjsdA0FBXh86yLc6BJeFVrZFXhAoJ3gEWgrWwN+lJMV0W4hvDdbe4Sjw==";    //nictest04m의 상점키

//yyyyMMddHHmmss 형식 date 생성 함수
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

/**
 * 대외 통신 샘플.
 *  외부 기관과 URL 통신하는 샘플 함수 입니다.
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

//json형태의 String을 HashMap으로 변환해주는 함수입니다. 
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
%>
```

```php
<?php
header("Content-Type:text/html; charset=euc-kr;"); 

// 빌링 결제(승인) API 요청 URL
$postURL = "https://webapi.nicepay.co.kr/webapi/billing/billing_approve.jsp";

/*
****************************************************************************************
* (요청 값 정보)
* 아래 파라미터에 요청할 값을 알맞게 입력합니다. 
****************************************************************************************
*/
$bid                 = "";                // 빌키
$mid                 = "nictest04m";        // 가맹점 아이디
$tid                 = "";                // 거래 ID
$moid                 = "";                // 가맹점 주문번호
$amt                 = "";                // 결제 금액
$goodsName             = "";                // 상품명
$cardInterest         = "";                // 무이자 여부
$cardQuota             = "";                // 할부 개월 수 
$buyerName             = "";                // 구매자명
$buyerTel             = "";                // 구매자 전화번호
$buyerEmail         = "";                // 구매자 이메일

// 결과 데이터를 저장할 변수를 미리 선언합니다.
$response = "";

/*
****************************************************************************************
* (해쉬암호화 - 수정하지 마세요)
* SHA-256 해쉬암호화는 거래 위변조를 막기위한 방법입니다. 
****************************************************************************************
*/    
$ediDate = date("YmdHis");                                                                                    // API 요청 전문 생성일시
$merchantKey = "b+zhZ4yOZ7FsH8pm5lhDfHZEb79tIwnjsdA0FBXh86yLc6BJeFVrZFXhAoJ3gEWgrWwN+lJMV0W4hvDdbe4Sjw==";    // 가맹점 키    
$signData = bin2hex(hash('sha256', $mid . $ediDate . $moid . $amt . $bid . $merchantKey, true));            // 위변조 데이터 검증 값 암호화

/*
****************************************************************************************
* (API 요청부)
* 명세서를 참고하여 필요에 따라 파라미터와 값을 'key'=>'value' 형태로 추가해주세요
****************************************************************************************
*/
$data = Array(
    'BID' => $bid,
    'MID' => $mid,
    'TID' => $tid,
    'EdiDate' => $ediDate,
    'Moid' => $moid,
    'Amt' => $amt,
    'GoodsName' => $goodsName,
    'SignData' => $signData,
    'CardInterest' => $cardInterest,
    'CardQuota' => $cardQuota
);        

$response = reqPost($data, $postURL);                 //API 호출, 결과 데이터가 $response 변수에 저장됩니다.
jsonRespDump($response);                             //결과 데이터를 브라우저에 노출합니다.
    
// json으로 응답된 결과 데이터를 배열 형태로 변환하여 출력하는 함수입니다. 
// 응답 데이터 출력을 위한 예시로 테스트 이후 가맹점 상황에 맞게 변경합니다. 
function jsonRespDump($resp){
    $resp_utf = iconv("EUC-KR", "UTF-8", $resp); 
    $respArr = json_decode($resp_utf);
    foreach ( $respArr as $key => $value ){
        echo "$key=". iconv("UTF-8", "EUC-KR", $value)."<br />";
    }
}

// API를 POST 형태로 호출하는 함수입니다. 
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
const format = require('date-format')
const fs = require('fs')
const ejs = require('ejs')

/*
****************************************************************************************
* 가맹점관리자 페이지(npg.nicepay.co.kr) 로그인 > 가맹점 정보 > Key관리
* 상기 경로를 통해서 가맹점 아이디인 MID와 가맹점 키 값을 확인하여 
* 아래 merchantID, merchantKey 파라미터에 각각 입력합니다.  
****************************************************************************************
*/
const merchantKey = 'b+zhZ4yOZ7FsH8pm5lhDfHZEb79tIwnjsdA0FBXh86yLc6BJeFVrZFXhAoJ3gEWgrWwN+lJMV0W4hvDdbe4Sjw=='; // 가맹점 키
const merchantID = 'nictest04m'; // 가맹점 ID

// API 요청 전문 생성 시 시간 정보를 저장합니다. 
const ediDate = format.asString('yyyyMMddhhmmss', new Date()); // API 요청 전문 생성일시

// 아래 파라미터에 요청값 정보를 알맞게 입력합니다. 
const bid = '';               // 빌키
const amt = '';                  // 금액
const goodsName = '';           // 상품명
const moid = '';                // 가맹점 주문번호
const cardInterest = '';       // 무이자 여부
const cardQuota = '';         // 할부 개월 수

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

// 빌링 결제(승인) 요청
app.post('/billing', async function(req, res){

    // 요청할 거래번호(TID)를 생성합니다.
    const ranNum = Math.floor(Math.random()*(9999-1000+1)) + 1000;
    const transactionID = merchantID + "0116" + ediDate.substr(2,12) + ranNum;
    
    // 데이터 위변조 검증값을 생성합니다. (거래 위변조를 막기 위한 방법입니다. 수정을 금지합니다.)
    const signData = getSignData(merchantID + ediDate + moid + amt + bid + merchantKey).toString();

    // 빌링 결제(승인) API 요청을 위한 Target URL, Header 및 form data를 입력합니다.
    // 빌링 결제(승인) API 요청 후 응답을 받아 console과 브라우저에 출력합니다.
    const response = await axios({
        url: 'https://webapi.nicepay.co.kr/webapi/billing/billing_approve.jsp',
        method: 'POST',
        headers: {
            'User-Agent': 'Super Agent/0.0.1',
            'Content-Type': 'application/x-www-form-urlencoded; charset=euc-kr',
        },
        data: {
            TID: transactionID,
            BID: bid,
            MID: merchantID,
            EdiDate: ediDate,
            Moid: moid,
            Amt: amt,
            GoodsName: goodsName,
            SignData: signData,
            CardInterest: cardInterest,
            CardQuota: cardQuota,
            CharSet: 'utf-8'    
        } 
    });

    console.log('승인 결과:', response.data);
    res.json(response.data);

})

// 위변조 검증을 위한 SHA-256 암호화 함수입니다.
function getSignData(str) {
    const encrypted = CryptoJS.SHA256(str);
    return encrypted;
}
```

```python
import os
from datetime import datetime
import random
import hashlib
import requests
import json
from flask import Flask, render_template, request
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.padding import PKCS7
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes

app = Flask(__name__)

# 위변조 검증을 위한 SHA-256 암호화 함수입니다.
def getSignData(str):
    encoded_str = str.encode()
    EncryptData = hashlib.sha256(encoded_str).hexdigest()
    return EncryptData

# API 요청 전문 생성 시 시간 정보를 저장합니다. 
def getEdiDate():
    YYYYmmddHHMMSS = datetime.today().strftime("%Y%m%d%H%M%S")
    return str(YYYYmmddHHMMSS)

# API 요청을 위한 Header 정보를 세팅 후 실제 API를 호출하고 결과값을 출력하는 함수입니다.    
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

# TID 생성 규칙에 맞게 거래일시(YYMMDDHHMISS)를 함수입니다.
def TIME():
    YYmmddHHMMSS = datetime.today().strftime("%y%m%d%H%M%S")
    return str(YYmmddHHMMSS)

# TID 생성 규칙에 맞게 뒤 랜덤 4자리를 생성하는 함수입니다.
def RANDOM():
    a = [random.randint(0, 9) for _ in range(4)]
    s = str("".join(map(str, a)))
    return str(s)

# 가맹점관리자 페이지(npg.nicepay.co.kr) 로그인 > 가맹점 정보 > Key관리
# 상기 경로를 통해서 가맹점 아이디인 MID와 가맹점 키 값을 확인하여 
# 아래 merchantID, merchantKey 파라미터에 각각 입력합니다.  

MID                = "nictest04m"                                                                                    # 가맹점 아이디(MID)
MerchantKey        = "b+zhZ4yOZ7FsH8pm5lhDfHZEb79tIwnjsdA0FBXh86yLc6BJeFVrZFXhAoJ3gEWgrWwN+lJMV0W4hvDdbe4Sjw=="    # 가맹점 키

# TIME(), RANDOM() 함수를 통해 생성한 시간 정보와 랜덤 4자리 값을 가져와 API 요청에 필요한 거래번호(TID)를 생성합니다.
# 가맹점 환경에 맞게 TID를 unique하게 생성할 수 있도록 별도 구현하는 것을 권장합니다. 

time = TIME()                                          # TID 생성규칙-요청시각
random = RANDOM()                                    # TID 생성규칙-랜덤4자리
TID = MID + "0116" + time + random                  # 거래번호 

# 아래 파라미터에 요청할 값을 알맞게 입력합니다. 
BID             = ""                                # 빌키
Amt                = ""                                # 결제상품금액
BuyerEmail          = ""                                # 구매자메일주소
BuyerName          = ""                                # 구매자명 
BuyerTel          = ""                                # 구매자연락처 
EdiDate             = getEdiDate()                      # 거래 날짜   
GoodsName           = ""                                # 결제상품명
Moid                = ""                                # 상품주문번호  
CardInterest     = ""                                # 무이자 여부(0 : 유이자 / 1 : 무이자)
CardQuota        = ""                                # 카드 할부개월 수

# 빌링 결제(승인) 요청
@app.route( methods=['POST'])
def billApproveReq():
    TID = TID 
    BID = BID
    MID = MID
    Moid = Moid
    Amt = Amt
    GoodsName = GoodsName
    CardInterest = CardInterest
    CardQuota = CardQuota
    EdiDate = getEdiDate()

    # 데이터 위변조 검증값을 생성합니다. (거래 위변조를 막기 위한 방법입니다. 수정을 금지합니다.)
    SignData = getSignData(MID + EdiDate + Moid + Amt + BID + MerchantKey)
    
    # 결제(승인) API 요청을 위한 Target URL 입니다.
    billApproveURL = "https://webapi.nicepay.co.kr/webapi/billing/billing_approve.jsp"
     
    # 명세서를 참고하여 필요에 따라 파라미터와 값을 'key': 'value' 형태로 추가해주세요.
    data = {
        'TID': TID,
        'BID': BID,
        'MID': MID,
        'EdiDate': EdiDate,
        'Moid': Moid,
        'Amt': Amt,
        'GoodsName': GoodsName,
        'SignData': SignData,
        'CardInterest': CardInterest,
        'CardQuota': CardQuota
    }
    
    # billApproveURL로 data를 전달하여 API를 호출합니다.
    resDict = authRequest(billApproveURL, data)

    # 결과를 응답받아 'result.html'에 값을 전달합니다.
    return render_template(
        'result.html',
        result=resDict
    )

if __name__ == '__main__':
    app.run(debug=True)
```

![](https://developers.nicepay.co.kr/images/card_billing_flow_v2/Card_Billkey_Remove_Flow.png)

| 파라미터명 | 파라미터설명 |
| --- | --- |
| BID | 30 byte 필수 빌링 키 |
| MID | 10 byte 필수 가맹점 ID |
| EdiDate | 14 byte 필수 전문생성일시 (YYYYMMDDHHMMSS) |
| Moid | 64 byte 필수 가맹점에서 부여한 주문번호 (Unique하게 구성) |
| Amt | 12 byte 필수 결제 금액 |
| SignData | 256 byte 필수 hex(sha256(MID + EdiDate + Moid + BID + MerchantKey)), 위변조 검증 데이터 |
| CharSet | 10 byte 인증 응답 인코딩 (euc-kr(default) / utf-8) |
| EdiType | 10 byte 응답전문 유형 (JSON / KV) \*KV:Key=value |

| 파라미터명 | 파라미터설명 |
| --- | --- |
| ResultCode | 4 byte 필수 결과코드 (F101: 성공 / 그외 실패) |
| ResultMsg | 100 byte 필수 결과 메시지 |
| TID | 30 byte 거래 ID |
| BID | 30 byte 빌링 키 |
| AuthDate | 8 byte 삭제일자(YYYYMMDD) |

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
<%@ page import="java.util.StringTokenizer" %>
<%
request.setCharacterEncoding("euc-kr"); 

/*
****************************************************************************************
* <요청 값 정보>
* 아래 파라미터에 요청할 값을 알맞게 입력합니다.
****************************************************************************************
*/
String BID             = "";    // 빌링키
String MID             = "nictest04m";    // 상점 ID
String Moid            = "";    // 주문번호

//결과 코드와 메세지를 저장할 변수를 미리 선언합니다.
String ResultCode     = "";
String ResultMsg     = "";

/*
*******************************************************
* <해쉬암호화> (수정하지 마세요)
* SHA-256 해쉬암호화는 거래 위변조를 막기위한 방법입니다. 
*******************************************************
*/
DataEncrypt sha256Enc     = new DataEncrypt();
String ediDate             = getyyyyMMddHHmmss();
String SignData         = sha256Enc.encrypt(MID + ediDate + Moid + BID + merchantKey);

/*
****************************************************************************************
* <빌키 삭제 요청>
* 빌키 삭제에 필요한 데이터 생성 후 server to server 통신을 통해 승인 처리 합니다.
* 명세서를 참고하여 필요에 따라 파라미터와 값을 Key=Value 형태로 추가해주세요.
****************************************************************************************
*/
StringBuffer requestData = new StringBuffer();
requestData.append("BID=").append(BID).append("&");
requestData.append("MID=").append(MID).append("&");
requestData.append("EdiDate=").append(ediDate).append("&");
requestData.append("Moid=").append(Moid).append("&");
requestData.append("SignData=").append(SignData);

//API 호출, 결과 데이터가 resultJsonStr 변수에 저장됩니다.
String resultRecvMsg = connectToServer(requestData.toString(), "https://webapi.nicepay.co.kr/webapi/billing/billkey_remove.jsp");

//결과 데이터를 HashMap 형태로 변환합니다.
HashMap resultData = new HashMap();
resultData = jsonStringToHashMap(resultRecvMsg);

ResultCode     = (String)resultData.get("ResultCode");
ResultMsg     = (String)resultData.get("ResultMsg");

%>
<!DOCTYPE html>
<html>
<head>
<title>NICEPAY BILLKEY REMOVE RESULT(EUC-KR) SAMPLE</title>
<meta charset="euc-kr">
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=yes, target-densitydpi=medium-dpi" />
<link rel="stylesheet" type="text/css" href="../css/import.css"/>
</head>
<body> 
<div class="payfin_area">
    <div class="top">빌키 삭제 결과</div>
    <div class="conwrap">
        <div class="con">
            <div class="tabletypea">
                <table>
                    <colgroup><col width="200px"/><col width="*"/></colgroup>
                    <tr>
                        <th><span>빌키삭제 결과 내용</span></th>
                        <td>[<%=ResultCode%>]<%=ResultMsg%></td>
                    </tr>
                    <tr>
                        <th><span>빌키삭제 응답 데이터</span></th>
                        <td><%=resultRecvMsg%></td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</div>
</body>
</html>
<%!
//중요!. 가맹점 MID에 맞는 key값을 설정하세요.
static final String merchantKey = "b+zhZ4yOZ7FsH8pm5lhDfHZEb79tIwnjsdA0FBXh86yLc6BJeFVrZFXhAoJ3gEWgrWwN+lJMV0W4hvDdbe4Sjw==";    //nictest04m의 상점키

//yyyyMMddHHmmss 형식 date 생성 함수
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

/**
 * 대외 통신 샘플.
 *  외부 기관과 URL 통신하는 샘플 함수 입니다.
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

//json형태의 String을 HashMap으로 변환해주는 함수입니다. 
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
header("Content-Type:text/html; charset=euc-kr;"); 

// 빌키 삭제 API 요청 URL
$postURL = "https://webapi.nicepay.co.kr/webapi/billing/billkey_remove.jsp";

/*
****************************************************************************************
* (요청 값 정보)
* 아래 파라미터에 요청할 값을 알맞게 입력합니다. 
****************************************************************************************
*/
$bid         = "";                            // 빌키
$mid         = "nictest04m";                    // 가맹점 아이디
$moid         = "";                            // 가맹점 주문번호

// 결과 데이터를 저장할 변수를 미리 선언합니다. 
$response = "";

/*
****************************************************************************************
* (해쉬암호화 - 수정하지 마세요)
* SHA-256 해쉬암호화는 거래 위변조를 막기위한 방법입니다. 
****************************************************************************************
*/    
$ediDate = date("YmdHis");                                                                                    // API 요청 전문 생성일시
$merchantKey = "b+zhZ4yOZ7FsH8pm5lhDfHZEb79tIwnjsdA0FBXh86yLc6BJeFVrZFXhAoJ3gEWgrWwN+lJMV0W4hvDdbe4Sjw==";     // 가맹점 키
$signData = bin2hex(hash('sha256', $mid . $ediDate . $moid . $bid . $merchantKey, true));                    // 위변조 데이터 검증 값 암호화

/*
****************************************************************************************
* (API 요청부)
* 명세서를 참고하여 필요에 따라 파라미터와 값을 'key'=>'value' 형태로 추가해주세요
****************************************************************************************
*/        
$data = Array(
    'BID' => $bid,
    'MID' => $mid,
    'EdiDate' => $ediDate,
    'Moid' => $moid,
    'SignData' => $signData
);        

$response = reqPost($data, $postURL);                 //API 호출, 결과 데이터가 $response 변수에 저장됩니다.
jsonRespDump($response);                             //결과 데이터를 브라우저에 노출합니다.
        
    
    
// json으로 응답된 결과 데이터를 배열 형태로 변환하여 출력하는 함수입니다. 
// 응답 데이터 출력을 위한 예시로 테스트 이후 가맹점 상황에 맞게 변경합니다. 
function jsonRespDump($resp){
    $resp_utf = iconv("EUC-KR", "UTF-8", $resp); 
    $respArr = json_decode($resp_utf);
    foreach ( $respArr as $key => $value ){
        echo "$key=". iconv("UTF-8", "EUC-KR", $value)."<br />";
    }
}

// API를 POST 형태로 호출하는 함수입니다. 
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
const format = require('date-format')
const fs = require('fs')
const ejs = require('ejs')

/*
****************************************************************************************
* 가맹점관리자 페이지(npg.nicepay.co.kr) 로그인 > 가맹점 정보 > Key관리
* 상기 경로를 통해서 가맹점 아이디인 MID와 가맹점 키 값을 확인하여 
* 아래 merchantID, merchantKey 파라미터에 각각 입력합니다.  
****************************************************************************************
*/
const merchantKey = 'b+zhZ4yOZ7FsH8pm5lhDfHZEb79tIwnjsdA0FBXh86yLc6BJeFVrZFXhAoJ3gEWgrWwN+lJMV0W4hvDdbe4Sjw=='; // 가맹점 키
const merchantID = 'nictest04m'; // 가맹점 ID

// API 요청 전문 생성 시 시간 정보를 저장합니다. 
const ediDate = format.asString('yyyyMMddhhmmss', new Date()); // API 요청 전문 생성일시

// 아래 파라미터에 요청값 정보를 알맞게 입력합니다. 
const bid = '';                   // 빌키
const moid = '';                // 가맹점 주문번호

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

// 빌키 삭제 요청
app.post('/bidRemove', async function(req, res){

    // 데이터 위변조 검증값을 생성합니다. (거래 위변조를 막기 위한 방법입니다. 수정을 금지합니다.)
    const signData = getSignData(merchantID + ediDate + moid + bid + merchantKey).toString();
    
    // 빌키 삭제 API 요청 후 응답을 받아 console과 브라우저에 출력합니다.
    const response = await axios({
        url: 'https://webapi.nicepay.co.kr/webapi/billing/billkey_remove.jsp',
        method: 'POST',
        headers: {
            'User-Agent': 'Super Agent/0.0.1',
            'Content-Type': 'application/x-www-form-urlencoded; charset=euc-kr',
        },
        data: {
            BID: bid,
            MID: merchantID,
            EdiDate: ediDate,
            Moid: moid,
            SignData: signData,
            CharSet: 'utf-8'    
        } 
    });

    console.log('빌키 삭제 결과:', response.data);
    res.json(response.data);
})

// 위변조 검증을 위한 SHA-256 암호화 함수입니다.
function getSignData(str) {
    const encrypted = CryptoJS.SHA256(str);
    return encrypted;
}

app.listen(port, () => console.log('**\n\nPAYMENT TEST URL:: localhost:3000/payment\nCANCEL TEST URL:: localhost:3000/cancel \n\n**'))
```

```python
import os
from datetime import datetime
import random
import hashlib
import requests
import json
from flask import Flask, render_template, request
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.padding import PKCS7
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes

app = Flask(__name__)

# 위변조 검증을 위한 SHA-256 암호화 함수입니다.
def getSignData(str):
    encoded_str = str.encode()
    EncryptData = hashlib.sha256(encoded_str).hexdigest()
    return EncryptData

# API 요청 전문 생성 시 시간 정보를 저장합니다. 
def getEdiDate():
    YYYYmmddHHMMSS = datetime.today().strftime("%Y%m%d%H%M%S")
    return str(YYYYmmddHHMMSS)

# API 요청을 위한 Header 정보를 세팅 후 실제 API를 호출하고 결과값을 출력하는 함수입니다.    
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

# 가맹점관리자 페이지(npg.nicepay.co.kr) 로그인 > 가맹점 정보 > Key관리
# 상기 경로를 통해서 가맹점 아이디인 MID와 가맹점 키 값을 확인하여 
# 아래 merchantID, merchantKey 파라미터에 각각 입력합니다.  

MID                = "nictest04m"                                                                                    # 가맹점 아이디(MID)
MerchantKey        = "b+zhZ4yOZ7FsH8pm5lhDfHZEb79tIwnjsdA0FBXh86yLc6BJeFVrZFXhAoJ3gEWgrWwN+lJMV0W4hvDdbe4Sjw=="    # 가맹점 키

# 아래 파라미터에 요청할 값을 알맞게 입력합니다. 
BID             = ""                                # 빌키
EdiDate             = getEdiDate()                      # 거래 날짜   
Moid                = ""                                # 상품주문번호  

# 빌키 삭제 요청
@app.route( methods=['POST'])
def billkeyRemoveReq():
    MID = MID
    EdiDate = getEdiDate()
    Moid = Moid
    BID = BID

    # 데이터 위변조 검증값을 생성합니다. (거래 위변조를 막기 위한 방법입니다. 수정을 금지합니다.)
    SignData = getSignData(MID + EdiDate + Moid + BID + MerchantKey)
    
    #빌키 삭제 API 요청을 위한 Target URL 입니다.
    billkeyRemoveURL = "https://webapi.nicepay.co.kr/webapi/billing/billkey_remove.jsp"

    # 명세서를 참고하여 필요에 따라 파라미터와 값을 'key': 'value' 형태로 추가해주세요.
    data = {
        'MID': MID,
        'EdiDate': EdiDate,
        'Moid': Moid,
        'BID': BID,
        'SignData': SignData
    }
    
    # billkeyRemoveURL로 data를 전달하여 API를 호출합니다.
    resDict = authRequest(billkeyRemoveURL, data)

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