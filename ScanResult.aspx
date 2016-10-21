<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ScanResult.aspx.cs" Inherits="Restaurant.ScanResult" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <asp:Label ID="lblResult" runat="server" Text="Label"></asp:Label>

        <br />
        <asp:Label runat="server" Text="Label">用户名称:</asp:Label>  <asp:Label ID="lblName" runat="server" Text="Label"></asp:Label> 

        <br />
        <asp:Label runat="server" Text="Label">消费金额:</asp:Label>  <asp:Label ID="lblAmount" runat="server" Text="Label"></asp:Label> 

    </div>
    </form>
</body>
</html>
