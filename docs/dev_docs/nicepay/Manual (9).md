---
title: "Manual"
source: "https://developers.nicepay.co.kr/manual-status.php"
author:
published:
created: 2025-11-29
description:
tags:
  - "clippings"
---
| 파라미터명 | 파라미터설명 |
| --- | --- |
| TID | 30 byte 필수 거래 ID |
| MID | 10 byte 필수 가맹점 ID |
| EdiDate | 14 byte 필수 전문생성일시 (YYYYMMDDHHMMSS) |
| SignData | 256 byte 필수 hex(sha256(TID + MID + EdiDate + MerchantKey)), 위변조 검증 데이터 |
| CharSet | 10 byte 인증 응답 인코딩 (euc-kr(default) / utf-8) |
| EdiType | 10 byte 응답전문 유형 (JSON / KV) \*KV:Key=value |

| 파라미터명 | 파라미터설명 |
| --- | --- |
| ResultCode | 4 byte 필수 결과코드 (0000: 성공 / 그외 실패) |
| ResultMsg | 100 byte 필수 결과 메시지 |
| TID | 30 byte 필수 거래 ID |
| Status | 1 byte 필수 거래 상태 (0: 승인 상태, 1: 취소 상태, 9: 승인 거래 없음) |
| AuthCode | 30 byte 승인번호 |
| AuthDate | 12 byte 승인일시(YYMMDDHHMISS) |

```java
<%@ page contentType="text/html; charset=euc-kr"%>
<%@ page import="java.util.Date"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.io.PrintWriter"%>
<%@ page import="java.io.BufferedReader"%>
<%@ page import="java.io.InputStreamReader"%>
<%@ page import="java.net.URL"%>

<%@ page import="java.net.HttpURLConnection"%>
<%@ page import="java.text.SimpleDateFormat"%>
<%@ page import="java.security.MessageDigest"%>
<%@ page import="org.json.simple.JSONObject"%>
<%@ page import="org.json.simple.parser.JSONParser"%>
<%@ page import="org.apache.commons.codec.binary.Hex"%>
<%
    request.setCharacterEncoding("euc-kr");
    
    String transStatusURL = "https://webapi.nicepay.co.kr/webapi/inquery/trans_status.jsp";     // transaction status URL
    String mid = "";                                        // 상점아이디
    String tid = "";                                        // 거래번호

    // 응답 결과 파라미터 초기화 
    String ResultCode = "";
    String ResultMsg = "";
    String TID = "";
    String Status = "";

    String resultJsonStr = "";
    
    
    /*
    ****************************************************************************************
    * <해쉬암호화> (수정하지 마세요)
    * SHA-256 해쉬암호화는 거래 위변조를 막기위한 방법입니다. 
    ****************************************************************************************
    */    
    DataEncrypt sha256Enc = new DataEncrypt();
    String merchantKey = "";
    String ediDate = getyyyyMMddHHmmss();
    String SignData = sha256Enc.encrypt(tid + mid + ediDate + merchantKey);

    StringBuffer requestData = new StringBuffer();
    requestData.append("TID=").append(tid).append("&");
    requestData.append("MID=").append(mid).append("&");
    requestData.append("EdiDate=").append(ediDate).append("&");
    requestData.append("Charset=").append("euc-kr").append("&");
    requestData.append("SignData=").append(SignData).append("&");

    // API Call
    resultJsonStr = connectToServer(requestData.toString(),transStatusURL);
    
    HashMap resultData = new HashMap();

    resultData = jsonStringToHashMap(resultJsonStr);
    ResultCode = (String) resultData.get("ResultCode");
    ResultMsg = (String) resultData.get("ResultMsg");
    TID = (String) resultData.get("TID");
    Status = (String) resultData.get("Status");
        
    
%>

<!DOCTYPE html>
<html>
<head>
<title>NICEPAY TRANSACTION_STATUS_RESULT(EUC-KR)</title>
<meta charset="euc-kr">
<meta name="viewport"
    content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=yes, target-densitydpi=medium-dpi" />
<link rel="stylesheet" type="text/css" href="./css/import.css" />
</head>
<body>
    <div class="top">NICEPAY TRANSACTION_STATUS_RESULT(EUC-KR)</div>
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
                    <th><span>Status</span></th>
                    <td><%=Status%></td>
                </tr>
            </table>
        </div>
    </div>
</body>
</html>
<%!
public final synchronized String getyyyyMMddHHmmss() {
        SimpleDateFormat yyyyMMddHHmmss = new SimpleDateFormat("yyyyMMddHHmmss");
        return yyyyMMddHHmmss.format(new Date());
}

// SHA-256 encryption
public class DataEncrypt {
    MessageDigest md;
    String strSRCData = "";
    String strENCData = "";
    String strOUTData = "";

    public DataEncrypt() {
        
    }

    public String encrypt(String strData) {
        String passACL = null;
        MessageDigest md = null;
        try {
            md = MessageDigest.getInstance("SHA-256");
            md.reset();
            md.update(strData.getBytes());
            byte[] raw = md.digest();
            passACL = encodeHex(raw);
        } catch (Exception e) {
            System.out.print("encryption error" + e.toString());
        }
        return passACL;
    }

    public String encodeHex(byte[] b) {
        char[] c = Hex.encodeHex(b);
        return new String(c);
    }
}

public String connectToServer(String data, String reqUrl)throws Exception{
    HttpURLConnection conn = null;
    BufferedReader resultReader = null;
    PrintWriter pw = null;
    URL url = null;

    int statusCode = 0;
    StringBuffer recvBuffer = new StringBuffer();
    try {
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
        for (String temp; (temp = resultReader.readLine()) != null;) {
            recvBuffer.append(temp).append("\n");
        }
        if (!(statusCode == HttpURLConnection.HTTP_OK)) {
            throw new Exception();
        }

        return recvBuffer.toString().trim();
    } catch (Exception e) {
        return "9999";
    } finally {
        recvBuffer.setLength(0);

        try {
            if (resultReader != null) {
                resultReader.close();
            }
        } catch (Exception ex) {
            resultReader = null;
        }
        try {
            if (pw != null) {
                pw.close();
            }
        } catch (Exception ex) {
            pw = null;
        }

        try {
            if (conn != null) {
                conn.disconnect();
            }
        } catch (Exception ex) {
            conn = null;
        }
    }
}

private static HashMap jsonStringToHashMap(String str) throws Exception {
    HashMap dataMap = new HashMap();
    JSONParser parser = new JSONParser();
    try {
        Object obj = parser.parse(str);
        JSONObject jsonObject = (JSONObject) obj;
            Iterator<String> keyStr = jsonObject.keySet().iterator();
        while (keyStr.hasNext()) {
            String key = keyStr.next();
            Object value = jsonObject.get(key);
                dataMap.put(key, value);
        }
    } catch (Exception e) {

    }
    return dataMap;
}
%>
```

```php
<?php
header("Content-Type:text/html; charset=euc-kr;"); 

$tid = "";                            // 거래 ID
$mid = "";                            // 상점 아이디
$charSet = "";                        // 응답 인코딩

$response = "";

    /*
    ****************************************************************************************
    * <해쉬암호화> (수정하지 마세요)
    * SHA-256 해쉬암호화는 거래 위변조를 막기위한 방법입니다. 
    ****************************************************************************************
    */    
    $ediDate = date("YmdHis");
    $merchantKey = ""; // 상점키
    $postURL = "https://webapi.nicepay.co.kr/webapi/inquery/trans_status.jsp";
    $signData = bin2hex(hash('sha256', $tid . $mid . $ediDate . $merchantKey, true));

    
    $data = Array(
        'TID' => $tid,
        'MID' => $mid,
        'CharSet' => $charSet,
        'EdiDate' => $ediDate,
        'SignData' => $signData
    );        
    $response = reqPost($data, $postURL); //승인 호출
    jsonRespDump($response); //response json dump example
        
    
// API CALL foreach 예시
function jsonRespDump($resp){
    $resp_utf = iconv("EUC-KR", "UTF-8", $resp); 
    $respArr = json_decode($resp_utf);
    foreach ( $respArr as $key => $value ){
        echo "$key=". iconv("UTF-8", "EUC-KR", $value)."";
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

public partial class statusResponse : System.Web.UI.Page{
    protected System.Web.UI.WebControls.Literal Res_ResultCode;
    protected System.Web.UI.WebControls.Literal Res_ResultMsg;
    protected System.Web.UI.WebControls.Literal Res_Status;
    protected System.Web.UI.WebControls.Literal Res_TID;

    protected string tid;
    protected string signData;
    protected string ediDate;
    protected string merchantKey;
    protected string mid;
    protected string charSet;
    protected string postURL;

    protected void Page_Load(object sender, EventArgs e){
        if (!Page.IsPostBack){
            resultData();
        }
    }

    protected void resultData(){
        merchantKey = "";
        tid = "";
        mid = "";
        charSet = "";

        ediDate = String.Format("{0:yyyyMMddHHmmss}", DateTime.Now);
        signData = stringToSHA256(tid + mid + ediDate + merchantKey);
        postURL = "https://webapi.nicepay.co.kr/webapi/inquery/trans_status.jsp ";

        var postData = "TID=" + Uri.EscapeDataString(tid);
        postData += "&MID=" + Uri.EscapeDataString(mid);
        postData += "&EdiDate=" + ediDate;
        postData += "&CharSet=" + Uri.EscapeDataString(charSet);
        postData += "&EdiType=" + "KV";
        postData += "&SignData=" + Uri.EscapeDataString(signData);

        //API Call
        var result = apiRequest(postURL, postData);

        //Stream encode
        var queryStr = streamEncode(result);

        //ParseQueryString
        var response = HttpUtility.ParseQueryString(queryStr);

        //Response data

        Res_ResultCode.Text = response["ResultCode"];
        Res_ResultMsg.Text = response["ResultMsg"];
        Res_Status.Text = response["Status"];
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