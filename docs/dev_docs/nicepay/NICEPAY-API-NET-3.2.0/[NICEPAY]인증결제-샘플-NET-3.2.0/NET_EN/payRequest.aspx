<%@ Page Language="C#"  AutoEventWireup="true" Src="payRequest.aspx.cs" Inherits="payRequest"  %>

<!DOCTYPE html>
<html>
<head>
<title>NICEPAY PAY REQUEST(UTF-8)</title>
<meta charset="utf-8">
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
	alert("Payment is canceled");
}

</script>
<style>
	html,body {height: 100%;}
	form {overflow: hidden;}
</style>
</head>
<body>
<form name="payForm" method="post" action="payResult.aspx">
	<table>
		<tr>
			<th><span>PayMethod</span></th>
			<td><input type="text" name="PayMethod" value=""></td>
		</tr>
		<tr>
			<th><span>GoodsName</span></th>
			<td><input type="text" name="GoodsName" value="<%=goodsName%>"></td>
		</tr>
		<tr>
			<th><span>Amt</span></th>
			<td><input type="text" name="Amt" value="<%=price%>"></td>
		</tr>				
		<tr>
			<th><span>MID</span></th>
			<td><input type="text" name="MID" value="<%=merchantID%>"></td>
		</tr>	
		<tr>
			<th><span>Moid</span></th>
			<td><input type="text" name="Moid" value="<%=moid%>"></td>
		</tr> 
		<tr>
			<th><span>BuyerName</span></th>
			<td><input type="text" name="BuyerName" value="<%=buyerName%>"></td>
		</tr>	 
		<tr>
			<th><span>BuyerTel</span></th>
			<td><input type="text" name="BuyerTel" value="<%=buyerTel%>"></td>
		</tr>	 
		<tr>
			<th><span>ReturnURL [Mobile only]</span></th>
			<td><input type="text" name="ReturnURL" value="<%=returnURL%>"></td>
		</tr>
		<tr>
			<th>Virtual Account Expiration Date(YYYYMMDD)</th>
			<td><input type="text" name="VbankExpDate" value=""></td>
		</tr>		
					
		<input type="hidden" name="BuyerEmail" value="<%=buyerEmail%>"/>	<!-- BuyerEmail -->		 
		<input type="hidden" name="GoodsCl" value="1"/>	<!-- products(1), contents(0)) -->
		<input type="hidden" name="TransType" value="0"/>	<!-- USE escrow false(0)/true(1) --> 
		<input type="hidden" name="CharSet" value="utf-8"/>	<!-- Return CharSet (euc-kr/utf-8)-->
		<input type="hidden" name="ReqReserved" value=""/><!-- mall custom field -->
					
		<!-- DO NOT CHANGE -->
		<input type="hidden" name="EdiDate" value="<%=ediDate%>"/><!-- YYYYMMDDHHMISS -->
		<input type="hidden" name="SignData" value="<%=encryptData%>"/>	<!-- EncryptData -->
	</table>

	<a href="#" class="btn_blue" onClick="nicepayStart();">REQUEST</a>

</form>
</body>
</html>