<%@ Page Language="C#" AutoEventWireup="true" Src="cancelResult.aspx.cs" Inherits="cancelResult" %>

<!DOCTYPE html>
<html>
<head>
<title>NICEPAY CANCEL RESULT(UTF-8)</title>
<meta charset="utf-8">
</head>
<body> 
    <table>
        <tr>
            <th><span>[ResultCode]ResultMsg</span></th>
            <td>[<asp:Literal ID="Res_ResultCode" runat="server"/>][<asp:Literal ID="Res_ResultMsg" runat="server"/>]</td>
        </tr>
        <tr>
            <th>TID</th>
            <td><asp:Literal ID="Res_TID" runat="server"/></td>
        </tr>
    </table>
</body>
</html>