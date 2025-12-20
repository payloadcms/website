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
* <Cancel Request Parameter>
* The sample page only shows basic (required) parameters.
****************************************************************************************
*/
String tid 					= (String)request.getParameter("TID");	// transaction ID
String cancelAmt 			= (String)request.getParameter("CancelAmt");	// cancellation amount
String partialCancelCode 	= (String)request.getParameter("PartialCancelCode"); 	// partial cancellation
String mid 					= "nicepay00m";	// merchant id
String moid					= "nicepay_api_3.0_test";	// Order Number
String cancelMsg 			= "Customer Request";	// reason for cancellation

/*
****************************************************************************************
* <Hash encryption> (do not modify)
* SHA-256 hash encryption is a way to prevent forgery.
****************************************************************************************
*/
DataEncrypt sha256Enc 	= new DataEncrypt();
String merchantKey 		= "EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg=="; // merchantKey
String ediDate			= getyyyyMMddHHmmss();
String signData 		= sha256Enc.encrypt(mid + cancelAmt + ediDate + merchantKey);

/*
****************************************************************************************
* <Cancel Request>
* After generating the necessary data for cancellation, cancel processing through server to server communication.
* Parameters that require Korean text, such as CancelMsg, require euc-kr encoding.
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
* <Cancel result parameter init>
****************************************************************************************
*/
String ResultCode 	= ""; String ResultMsg 	= ""; String CancelAmt 	= "";
String CancelDate 	= ""; String CancelTime = ""; String TID 		= "";

/*
****************************************************************************************
* Signature : This parameter is passed to verify the integrity of the requested data.Please use it when linking to prevent factors that may cause payment and security related issues such as false payment requests 
****************************************************************************************
*/
//String Signature = ""; String cancelSignature = "";

if("9999".equals(resultJsonStr)){
	ResultCode 	= "9999";
	ResultMsg	= "Communication Failure";
}else{
	HashMap resultData = jsonStringToHashMap(resultJsonStr);
	ResultCode 	= (String)resultData.get("ResultCode");	// result code (cancellation success: 2001, cancellation success (LGU account transfer): 2211)
	ResultMsg 	= (String)resultData.get("ResultMsg");	// result message
	CancelAmt 	= (String)resultData.get("CancelAmt");	// cancellation amount
	CancelDate 	= (String)resultData.get("CancelDate");	// cancellation date
	CancelTime 	= (String)resultData.get("CancelTime");	// cancellation time
	TID 		= (String)resultData.get("TID");		// transaction ID TID
	//Signature       	= (String)resultData.get("Signature");
	//cancelSignature = sha256Enc.encrypt(TID + mid + CancelAmt + merchantKey);
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
			<th>[ResultCode]ResultMsg</th>
			<td>[<%=ResultCode%>]<%=ResultMsg%></td>
		</tr>
		<tr>
			<th>TID</th>
			<td><%=TID%></td>
		</tr>
		<tr>
			<th>CancelAmt</th>
			<td><%=CancelAmt%></td>
		</tr>
		<tr>
			<th>CancelDate</th>
			<td><%=CancelDate%></td>
		</tr>
		<tr>
			<th>CancelTime</th>
			<td><%=CancelTime%></td>
		</tr>
		<!--<%/*if(Signature.equals(cancelSignature)){%>
		<tr>
			<th>Signature</th>
			<td><%=Signature%></td>
		</tr>
		<%}else{%>
		<tr>
			<th>Signature</th>
			<td><%=Signature%></td>
		</tr>
		<tr>
			<th>cancelSignature</th>
			<td><%=cancelSignature%></td>
		</tr>-->
		<%}*/%>
	</table>
</body>
</html>
<%!
public final synchronized String getyyyyMMddHHmmss(){
	SimpleDateFormat yyyyMMddHHmmss = new SimpleDateFormat("yyyyMMddHHmmss");
	return yyyyMMddHHmmss.format(new Date());
}

//Encryption in SHA-256 Format
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

//server to server communication
public String connectToServer(String data, String reqUrl) throws Exception{
	HttpURLConnection conn 		= null;
	BufferedReader resultReader = null;
	PrintWriter pw 				= null;
	URL url 					= null;
	
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

//JSON String -> HashMap
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