<%@ Page Language="C#" AutoEventWireup="true" Src="payResult.aspx.cs" Inherits="payResult" %>

<!DOCTYPE html>
<html>
<head>
<title>NICEPAY PAY RESULT(UTF-8)</title>
<meta charset="utf-8">
</head>
<body>         
    <table>
        <tr>
            <th><span>[ResultCode]ResultMsg</span></th>
            <td>[<asp:Literal ID="Res_ResultCode" runat="server"/>][<asp:Literal ID="Res_ResultMsg" runat="server"/>]</td>
        </tr>
        <tr>
            <th>PayMethod</th>
            <td><asp:Literal ID="Res_PayMethod" runat="server"/></td>
        </tr>
        <tr>
            <th>GoodsName</th>
            <td><asp:Literal ID="Res_GoodsName" runat="server"/></td>
        </tr>
        <tr>
            <th>Amt</th>
            <td><asp:Literal ID="Res_Amt" runat="server"/></td>
        </tr>
        <tr>
            <th>TID</th>
            <td><asp:Literal ID="Res_TID" runat="server"/></td>
        </tr>
    </table>
</body>
</html>