<%@ page contentType="text/html; charset=euc-kr"%>
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
String merchantKey 		= "EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg=="; // 상점키
String merchantID 		= "nicepay00m"; 				// 상점아이디
String goodsName 		= "나이스페이"; 					// 결제상품명
String price 			= "1004"; 						// 결제상품금액	
String buyerName 		= "나이스"; 						// 구매자명
String buyerTel 		= "01000000000"; 				// 구매자연락처
String buyerEmail 		= "happy@day.co.kr"; 			// 구매자메일주소
String moid 			= "mnoid1234567890"; 			// 상품주문번호	
String returnURL 		= "http://localhost:8080/nicepay3.0_euc-kr/payResult.jsp"; // 결과페이지(절대경로) - 모바일 결제창 전용

/*
*******************************************************
* <해쉬암호화> (수정하지 마세요)
* SHA-256 해쉬암호화는 거래 위변조를 막기위한 방법입니다. 
*******************************************************
*/
DataEncrypt sha256Enc 	= new DataEncrypt();
String ediDate 			= getyyyyMMddHHmmss();	
String hashString 		= sha256Enc.encrypt(ediDate + merchantID + price + merchantKey);
%>
<!DOCTYPE html>
<html>
<head>
<title>NICEPAY PAY REQUEST(EUC-KR)</title>
<meta charset="euc-kr">
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
<form name="payForm" method="post" action="payResult.jsp">
	<table>
		<tr>
			<th>결제 수단</th>
			<td><input type="text" name="PayMethod" value=""></td>
		</tr>
		<tr>
			<th>결제 상품명</th>
			<td><input type="text" name="GoodsName" value="<%=goodsName%>"></td>
		</tr>
		<tr>
			<th>결제 상품금액</th>
			<td><input type="text" name="Amt" value="<%=price%>"></td>
		</tr>				
		<tr>
			<th>상점 아이디</th>
			<td><input type="text" name="MID" value="<%=merchantID%>"></td>
		</tr>	
		<tr>
			<th>상품 주문번호</th>
			<td><input type="text" name="Moid" value="<%=moid%>"></td>
		</tr> 
		<tr>
			<th>구매자명</th>
			<td><input type="text" name="BuyerName" value="<%=buyerName%>"></td>
		</tr>
		<tr>
			<th>구매자명 이메일</th>
			<td><input type="text" name="BuyerEmail" value="<%=buyerEmail%>"></td>
		</tr>		
		<tr>
			<th>구매자 연락처</th>
			<td><input type="text" name="BuyerTel" value="<%=buyerTel%>"></td>
		</tr>	 
		<tr>
			<th>인증완료 결과처리 URL<!-- (모바일 결제창 전용)PC 결제창 사용시 필요 없음 --></th>
			<td><input type="text" name="ReturnURL" value="<%=returnURL%>"></td>
		</tr>
		<tr>
			<th>가상계좌입금만료일(YYYYMMDD)</th>
			<td><input type="text" name="VbankExpDate" value=""></td>
		</tr>		
					
		<!-- 옵션 -->	 
		<input type="hidden" name="GoodsCl" value="1"/>						<!-- 상품구분(실물(1),컨텐츠(0)) -->
		<input type="hidden" name="TransType" value="0"/>					<!-- 일반(0)/에스크로(1) --> 
		<input type="hidden" name="CharSet" value="euc-kr"/>				<!-- 응답 파라미터 인코딩 방식 -->
		<input type="hidden" name="ReqReserved" value=""/>					<!-- 상점 예약필드 -->
					
		<!-- 변경 불가능 -->
		<input type="hidden" name="EdiDate" value="<%=ediDate%>"/>			<!-- 전문 생성일시 -->
		<input type="hidden" name="SignData" value="<%=hashString%>"/>		<!-- 해쉬값 -->
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