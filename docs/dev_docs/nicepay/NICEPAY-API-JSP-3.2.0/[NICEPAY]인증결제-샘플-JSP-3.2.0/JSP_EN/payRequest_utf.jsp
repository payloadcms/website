<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.Date" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="java.security.MessageDigest" %>
<%@ page import="org.apache.commons.codec.binary.Hex" %>
<%
/*
*******************************************************
* <Payment Request Parameter>
* The sample page only shows basic (required) parameters.
*******************************************************
*/
String merchantKey = "EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg=="; // merchantKey
String merchantID = "nicepay00m"; // merchantID
String goodsName = "Nice Pay"; // goodsName
String price = "1004"; // amount of payment
String buyerName = "Nice"; // buyer name
String buyerTel = "01000000000"; // buyer contact
String buyerEmail = "happy@day.com"; // buyer email
String moid = "mnoid1234567890"; // order id
String returnURL = "http://localhost:8080/nicepay3.0_utf-8/payResult_utf.jsp"; // absolute path, mobile payment only

/*
************************************************** *****
* <Hash encryption> (do not modify)
************************************************** *****
*/
DataEncrypt sha256Enc 	= new DataEncrypt();
String ediDate 			= getyyyyMMddHHmmss();	
String hashString 		= sha256Enc.encrypt(ediDate + merchantID + price + merchantKey);
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
//It is executed when call payment window.
function nicepayStart(){
	goPay(document.payForm);
}

//[PC Only]When pc payment window is closed, nicepay-pgweb.js call back nicepaySubmit() function <<'nicepaySubmit()' DO NOT CHANGE>>
function nicepaySubmit(){
	document.payForm.submit();
}

//[PC Only]payment window close function <<'nicepayClose()' DO NOT CHANGE>>
function nicepayClose(){
	alert("결제가 취소 되었습니다");
}

</script>
</head>
<body>
<form name="payForm" method="post" action="payResult_utf.jsp">
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
			<td><input type="text" name="Amt" value="<%=price%>"></td>
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
		
		<input type="hidden" name="NpLang" value="EN"/> <!-- EN:English, CN:Chinese, KO:Korean -->					
		<input type="hidden" name="GoodsCl" value="1"/> <!-- products(1), contents(0)) -->
		<input type="hidden" name="TransType" value="0"/>	<!-- USE escrow false(0)/true(1) -->
		<input type="hidden" name="CharSet" value="utf-8"/>	<!-- Return CharSet -->
		<input type="hidden" name="ReqReserved" value=""/>	<!-- mall custom field -->
					
		<!-- DO NOT CHANGE -->
		<input type="hidden" name="EdiDate" value="<%=ediDate%>"/>			<!-- YYYYMMDDHHMISS -->
		<input type="hidden" name="SignData" value="<%=hashString%>"/>	<!-- EncryptData -->
	</table>
	<a href="#" class="btn_blue" onClick="nicepayStart();">REQUEST</a>
</form>
</body>
</html>
<%!
public final synchronized String getyyyyMMddHHmmss(){
	SimpleDateFormat yyyyMMddHHmmss = new SimpleDateFormat("yyyyMMddHHmmss");
	return yyyyMMddHHmmss.format(new Date());
}
// Encryption in SHA-256 Format
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
			System.out.print("Encryption ERROR" + e.toString());
		}
		return passACL;
	}
	
	public String encodeHex(byte [] b){
		char [] c = Hex.encodeHex(b);
		return new String(c);
	}
}
%>