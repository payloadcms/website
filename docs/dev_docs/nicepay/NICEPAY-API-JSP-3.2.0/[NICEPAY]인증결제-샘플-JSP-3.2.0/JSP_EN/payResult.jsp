<%@ page contentType="text/html; charset=euc-kr"%>
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
request.setCharacterEncoding("euc-kr"); 
/*
****************************************************************************************
* <Authentication Result Parameter>
****************************************************************************************
*/
String authResultCode = (String)request.getParameter("AuthResultCode"); // authentication result code 0000:success
String authResultMsg = (String)request.getParameter("AuthResultMsg"); // authentication result message
String nextAppURL = (String)request.getParameter("NextAppURL"); // authorization request URL
String txTid = (String)request.getParameter("TxTid"); // transaction ID
String authToken = (String)request.getParameter("AuthToken"); // authentication TOKEN
String payMethod = (String)request.getParameter("PayMethod"); // payment method
String mid = (String)request.getParameter("MID"); // merchant id
String moid = (String)request.getParameter("Moid"); // order number
String amt = (String)request.getParameter("Amt"); // Amount of payment
String reqReserved = (String)request.getParameter("ReqReserved"); // mall custom field 
String netCancelURL = (String)request.getParameter("NetCancelURL"); // netCancelURL
//String authSignature = (String)request.getParameter("Signature");			// Integrity verification data of response value sent from Nicepay

/*
****************************************************************************************
* Signature : This parameter is passed to verify the integrity of the requested data.Please use it when linking to prevent factors that may cause payment and security related issues such as false payment requests 
* <authorization parameters init>
****************************************************************************************
*/
DataEncrypt sha256Enc 	= new DataEncrypt();
String merchantKey 		= "EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg==";

//Signature = hex(sha256(AuthToken + MID + Amt + MerchantKey)
//String authComparisonSignature = sha256Enc.encrypt(authToken + mid + amt + merchantKey);

String ResultCode 	= ""; String ResultMsg 	= ""; String PayMethod 	= "";
String GoodsName 	= ""; String Amt 		= ""; String TID 		= "";
//String Signature = ""; String paySignature = "";

String resultJsonStr = "";
if(authResultCode.equals("0000") /* && authSignature.equals(authComparisonSignature) */){ //authentication result code 0000:success
	/*
	****************************************************************************************
	* <Hash encryption> (do not modify)
	****************************************************************************************
	*/
	String ediDate			= getyyyyMMddHHmmss();
	String signData 		= sha256Enc.encrypt(authToken + mid + amt + ediDate + merchantKey);

	/*
	****************************************************************************************
	* <authorization request>
	* authorization through server to server communication.
	****************************************************************************************
	*/
	StringBuffer requestData = new StringBuffer();
	requestData.append("TID=").append(txTid).append("&");
	requestData.append("AuthToken=").append(authToken).append("&");
	requestData.append("MID=").append(mid).append("&");
	requestData.append("Amt=").append(amt).append("&");
	requestData.append("EdiDate=").append(ediDate).append("&");
	requestData.append("SignData=").append(signData);

	resultJsonStr = connectToServer(requestData.toString(), nextAppURL);

	HashMap resultData = new HashMap();
	boolean paySuccess = false;
	if("9999".equals(resultJsonStr)){
		/*
		*************************************************************************************
		* <NET CANCEL>
		* If an exception occurs during communication, cancelation is recommended
		*************************************************************************************
		*/
		StringBuffer netCancelData = new StringBuffer();
		requestData.append("&").append("NetCancel=").append("1");
		String cancelResultJsonStr = connectToServer(requestData.toString(), netCancelURL);
		
		HashMap cancelResultData = jsonStringToHashMap(cancelResultJsonStr);
		ResultCode = (String)cancelResultData.get("ResultCode");
		ResultMsg = (String)cancelResultData.get("ResultMsg");
		/* Signature = (String)cancelResultData.get("Signature");
		String CancelAmt = (String)cancelResultData.get("CancelAmt");
		paySignature = sha256Enc.encrypt(TID + mid + CancelAmt + merchantKey); */
	}else{
		resultData = jsonStringToHashMap(resultJsonStr);
		ResultCode 	= (String)resultData.get("ResultCode");
		ResultMsg 	= (String)resultData.get("ResultMsg");
		PayMethod 	= (String)resultData.get("PayMethod");
		GoodsName   = (String)resultData.get("GoodsName");
		Amt       	= (String)resultData.get("Amt");
		TID       	= (String)resultData.get("TID");
		/* Signature = (String)resultData.get("Signature");
		paySignature = sha256Enc.encrypt(TID + mid + Amt + merchantKey); */
		
		/*
		*************************************************************************************
		* <After Payment Success>
		*************************************************************************************
		*/
		if(PayMethod != null){
			if(PayMethod.equals("CARD")){
				if(ResultCode.equals("3001")) paySuccess = true; // CARD(Success:3001)       	
			}else if(PayMethod.equals("BANK")){
				if(ResultCode.equals("4000")) paySuccess = true; // BANK Transfer(Success:4000)	
			}else if(PayMethod.equals("CELLPHONE")){
				if(ResultCode.equals("A000")) paySuccess = true; // Phone bill (Success:A000)	
			}else if(PayMethod.equals("VBANK")){
				if(ResultCode.equals("4100")) paySuccess = true; // Virtual bank account (Success:4100)
			}else if(PayMethod.equals("SSG_BANK")){
				if(ResultCode.equals("0000")) paySuccess = true; // SSG bank account(Success:0000)
			}else if(PayMethod.equals("CMS_BANK")){
				if(ResultCode.equals("0000")) paySuccess = true; // CMS bank account(Success:0000)
			}
		}
	}
}else/*  if(authSignature.equals(authComparisonSignature)) */{
	ResultCode 	= authResultCode; 	
	ResultMsg 	= authResultMsg;
}/* else{
	System.out.println("authSignature : " + authSignature);
	System.out.println("authComparisonSignature : " + authComparisonSignature);
} */
%>
<!DOCTYPE html>
<html>
<head>
<title>NICEPAY PAY RESULT(EUC-KR)</title>
<meta charset="euc-kr">
</head>
<body>
	<table>
		<%if("9999".equals(resultJsonStr)){%>
		<tr>
			<th>NET CANCEL</th>
			<td>[<%=ResultCode%>]<%=ResultMsg%></td>
		</tr>
		<%}else{%>
		<tr>
			<th>[ResultCode]ResultMsg</th>
			<td>[<%=ResultCode%>]<%=ResultMsg%></td>
		</tr>
		<tr>
			<th>PayMethod</th>
			<td><%=PayMethod%></td>
		</tr>
		<tr>
			<th>GoodsName</th>
			<td><%=GoodsName%></td>
		</tr>
		<tr>
			<th>Amt</th>
			<td><%=Amt%></td>
		</tr>
		<tr>
			<th>TID</th>
			<td><%=TID%></td>
		</tr>
		<%-- <%if(Signature.equals(paySignature)){%>
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
			<th>paySignature</th>
			<td><%=paySignature%></td>
		</tr> --%>
		<%}/* } */%>
	</table>
	<p> * If you have a test ID, It will be canceled at 11:30 PM. </ p>
</body>
</html>
<%!
public final synchronized String getyyyyMMddHHmmss(){
	SimpleDateFormat yyyyMMddHHmmss = new SimpleDateFormat("yyyyMMddHHmmss");
	return yyyyMMddHHmmss.format(new Date());
}

// SHA-256 Encryption
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
			System.out.print("Encryption Error" + e.toString());
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
		resultReader = new BufferedReader(new InputStreamReader(conn.getInputStream(), "euc-kr"));
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