<%@ page contentType="text/html; charset=euc-kr"%>
<!DOCTYPE html>
<html>
<head>
<title>NICEPAY CANCEL REQUEST(EUC-KR)</title>
<meta charset="euc-kr">
<style>
	html,body {height: 100%;}
	form {overflow: hidden;}
</style>
<script type="text/javascript">
function reqCancel(){
	document.cancelForm.submit();
}
</script>
</head>
<body> 
<form name="cancelForm" method="post" target="_self" action="cancelResult.jsp">
	<table>
		<tr>
			<th>원거래 ID</th>
			<td><input type="text" name="TID" value="" /></td>
		</tr>
		<tr>
			<th>취소 금액</th>
			<td><input type="text" name="CancelAmt" value="" /></td>
		</tr>
		<tr>
			<th>부분취소 여부</th>
			<td>
				<input type="radio" name="PartialCancelCode" value="0" checked="checked"/> 전체취소
				<input type="radio" name="PartialCancelCode" value="1"/> 부분취소
			</td>
		</tr>
	</table>
	<a href="#" onClick="reqCancel();">요 청</a>				
</form>				
</body>
</html>