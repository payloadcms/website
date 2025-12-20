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
			<th>TID</th>
			<td><input type="text" name="TID" value="" /></td>
		</tr>
		<tr>
			<th>CancelAmt</th>
			<td><input type="text" name="CancelAmt" value="" /></td>
		</tr>
		<tr>
			<th>Partial Cancellation</th>
			<td>
				<input type="radio" name="PartialCancelCode" value="0" checked="checked"/> false
				<input type="radio" name="PartialCancelCode" value="1"/> true
			</td>
		</tr>
	</table>
	<a href="#" onClick="reqCancel();">REQUEST</a>				
</form>				
</body>
</html>