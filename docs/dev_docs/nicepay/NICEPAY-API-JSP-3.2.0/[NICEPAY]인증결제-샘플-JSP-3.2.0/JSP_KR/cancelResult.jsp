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
* <취소요청 파라미터>
* 취소시 전달하는 파라미터입니다.
* 샘플페이지에서는 기본(필수) 파라미터만 예시되어 있으며, 
* 추가 가능한 옵션 파라미터는 연동메뉴얼을 참고하세요.
****************************************************************************************
*/
String tid 					= (String)request.getParameter("TID");	// 거래 ID
String cancelAmt 			= (String)request.getParameter("CancelAmt");	// 취소금액
String partialCancelCode 	= (String)request.getParameter("PartialCancelCode"); 	// 부분취소여부
String mid 					= "nicepay00m";	// 상점 ID
String moid					= "nicepay_api_3.0_test";	// 주문번호
String cancelMsg 			= "고객요청";	// 취소사유

/*
****************************************************************************************
* <해쉬암호화> (수정하지 마세요)
* SHA-256 해쉬암호화는 거래 위변조를 막기위한 방법입니다. 
****************************************************************************************
*/
DataEncrypt sha256Enc 	= new DataEncrypt();
String merchantKey 		= "EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg=="; // 상점키
String ediDate			= getyyyyMMddHHmmss();
String signData 		= sha256Enc.encrypt(mid + cancelAmt + ediDate + merchantKey);

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
requestData.append("SignData=").append(signData);
String resultJsonStr = connectToServer(requestData.toString(), "https://pg-api.nicepay.co.kr/webapi/cancel_process.jsp");

/*
****************************************************************************************
* <취소 결과 파라미터 정의>
* 샘플페이지에서는 취소 결과 파라미터 중 일부만 예시되어 있으며, 
* 추가적으로 사용하실 파라미터는 연동메뉴얼을 참고하세요.
****************************************************************************************
*/
String ResultCode 	= ""; String ResultMsg 	= ""; String CancelAmt 	= "";
String CancelDate 	= ""; String CancelTime = ""; String TID 		= ""; 

/*  
****************************************************************************************
* Signature : 요청 데이터에 대한 무결성 검증을 위해 전달하는 파라미터로 허위 결제 요청 등 결제 및 보안 관련 이슈가 발생할 만한 요소를 방지하기 위해 연동 시 사용하시기 바라며 
* 위변조 검증 미사용으로 인해 발생하는 이슈는 당사의 책임이 없음 참고하시기 바랍니다.
****************************************************************************************
 */
//String Signature = ""; String cancelSignature = "";

if("9999".equals(resultJsonStr)){
	ResultCode 	= "9999";
	ResultMsg	= "통신실패";
}else{
	HashMap resultData = jsonStringToHashMap(resultJsonStr);
	ResultCode 	= (String)resultData.get("ResultCode");	// 결과코드 (취소성공: 2001, 취소성공(LGU 계좌이체):2211)
	ResultMsg 	= (String)resultData.get("ResultMsg");	// 결과메시지
	CancelAmt 	= (String)resultData.get("CancelAmt");	// 취소금액
	CancelDate 	= (String)resultData.get("CancelDate");	// 취소일
	CancelTime 	= (String)resultData.get("CancelTime");	// 취소시간
	TID 		= (String)resultData.get("TID");		// 거래아이디 TID
	//Signature       	= (String)resultData.get("Signature");
	//cancelSignature = sha256Enc.encrypt(TID + mid + CancelAmt + merchantKey);
}
%>
<!DOCTYPE html>
<html>
<head>
<title>NICEPAY CANCEL RESULT(EUC-KR)</title>
<meta charset="euc-kr">
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
		<!--<%/*if(Signature.equals(cancelSignature)){%>
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