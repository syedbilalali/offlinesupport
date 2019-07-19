<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Sample1.aspx.cs" Inherits="POS_Demo1.New_Terminal.Sample1" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="asp" %>
<!DOCTYPE html>
<html manifest="cache.manifest">
<head runat="server">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>Online Store</title>
    <script type="text/javascript">
        document.addEventListener("keydown", function (event) {
            switch (event.keyCode) {
                case 118 <%--&& !document.getElementById("<%=btnPay.ClientID%>").getAttribute('disabled')--%>:
                    document.getElementById("<%=btnPay.ClientID%>").click();
                    break;
                case 119:
                    document.getElementById("<%=btnHold.ClientID%>").click();
                    break;
                case 120:
                    document.getElementById("<%=Button4.ClientID%>").click();
                    break;
                case 115:
                    document.getElementById("<%=btnReturn.ClientID%>").click();
                    break;
                case 122:
                    document.getElementById("<%=btn_Retrieve.ClientID%>").click();
                    break;
                default:
                    break;
            }
        });
    </script>
    <style type="text/css">
        .modalPopup:target {
            opacity: 1;
        }

        .modalBackground {
            position: fixed;
            background-color: #000;
            filter: alpha(opacity=50);
            opacity: 0.5;
            z-index: 100 !important;
        }

        .modalPopup {
            z-index: 1001 !important;
        }

        .btn_style1 {
            height: 40px !important;
            border-radius: 5px !important;
            /* margin-top: 5px!important; */
            font-size: 14px !important;
            font-weight: bold !important;
            padding: 5px !important;
        }

        .btn_style2 {
            height: 80px !important;
            border-radius: 5px !important;
            font-size: 14px !important;
            font-weight: bold !important;
            padding: 5px !important;
        }
    </style>
    <link href="js/jquery-ui.css" rel="stylesheet" />
    <link href="js/bootstrap.min.css" rel="stylesheet" />
    <script src="js/jquery.min.js"></script>
    <script src="js/jquery-ui.js"></script>
    <script src="js/bootstrap.min.js"></script>

    <link href="themes/offline-theme-chrome.css" rel="stylesheet" />
    <link href="themes/offline-language-english.css" rel="stylesheet" />
    <script src="js/offline.js"></script>
    <%--   <script src="Toast/js_popup/jquery.toastmessage-min.js"></script>
    <link href="Toast/css_popup/jquery.toastmessage-min.css" rel="stylesheet" />--%>
    <script src="js/Custom.js"></script>
    <script src="js/jquery.dataTables.min.js"></script>
    <script src="js/service_worker.js"></script>

    <%--   <link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/css/select2.min.css" rel="stylesheet" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/js/select2.min.js"></script>--%>

    <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,700,300italic,400italic,700italic" rel="stylesheet" type="text/css">

    <link href="vendor/simple-line-icons/css/simple-line-icons.css" rel="stylesheet">
    <link href="css/stylish-portfolio.min.css" rel="stylesheet" />
    <script src="SweetAlert/sweetalert2.min.js"></script>
    <link href="SweetAlert/sweetalert2.css" rel="stylesheet" />
    <style type="text/css">
        /* Chrome, Safari and Opera syntax */
        /* Standard syntax */
        .completionList {
            z-index: 1;
            border: solid 1px #444444;
            margin: 0px;
            padding: 2px;
            height: auto;
            overflow: auto;
            background-color: #FFFFFF;
        }

        .listItem {
            color: #1c1c1c;
            list-style: none;
            text-align: left;
        }

        .itemHighlighted {
            background-color: #ffc0c0;
            list-style: none;
            text-align: left;
        }
    </style>
    <%--  <script src="Toast/js_popup/jquery.toastmessage-min.js"></script>
    <link href="Toast/css_popup/jquery.toastmessage-min.css" rel="stylesheet" />--%>
    <script type="text/javascript">

        function SweetAlert(value) {
            swal({ title: 'Message Alert', text: value, type: 'success', timer: 30000 });
        }
        function SweetAlertWarning(value) {
            swal({ title: 'Message Alert', text: value, type: 'warning', timer: 3000 });
        }
        function SweetAlertError(value) {
            //alert("Hello World Error");
            swal({ title: 'Message Alert', text: value, type: 'error', timer: 3000 });
        }
        function SweetAlertSuccess(value) {
            //alert("Hello World DOne ");
            swal("Done!", value, "success");
        }
        function SweetAlertInfo(value) {
            //alert("Hello World Info");
            swal({ title: 'Message Alert', text: value, type: 'info', timer: 30000 });
        }
        /* View in fullscreen */
        function openFullscreen() {
            var elem = document.documentElement;
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) { /* Firefox */
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE/Edge */
                elem.msRequestFullscreen();
            }
        }
        /* Close fullscreen */
        function closeFullscreen() {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
            }
        }
    </script>
    <script type="text/javascript">
        //$get("txtSearch").focus();
        function printDiv() {
            //  console.log("Inside Print Div");
            var printContents = document.getElementById("PrintDiv").innerHTML;
            var originalContents = document.body.innerHTML;
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
            document.getElementById("<%=Button2.ClientID%>").click();
        }
        var count = 1;
        function pageLoad() {
            //    if (count == 1) {
            //   $get("txtSearch").focus();
            //        count++;
            //    } else {
            //            alert("load every");
            //    }
        }

    </script>
    <script type="text/javascript">
        function IsOneDecimalPoint(evt) {
            var charCode = (evt.which) ? evt.which : event.keyCode; // restrict user to type only one . point in number
            var parts = evt.srcElement.value.split('.');
            if (parts.length > 1 && charCode == 46)
                return false;
            return true;
        }
        function checkForClick() {

            var classflag = $("#sidebar-wrapper").hasClass("active");
            if (classflag) {
                $("#sidebar-wrapper").removeClass("active");
                $("a .menu-toggle").addClass("active");
                $("i .fas").addClass("fa-times");
            } else {
                $("#sidebar-wrapper").addClass("active");
                $("a .menu-toggle").removeClass("active");
                $("i .fas").removeClass("fa-bars");
            }
        }
        Offline.options = {
            // to check the connection status immediatly on page load.
            checkOnLoad: false,

            // to monitor AJAX requests to check connection.
            interceptRequests: true,

            // to automatically retest periodically when the connection is down (set to false to disable).
            reconnect: {
                // delay time in seconds to wait before rechecking.
                initialDelay: 3,

                // wait time in seconds between retries.
                delay: 10
            },
            // to store and attempt to remake requests which failed while the connection was down.
            requests: true
        };
    </script>
</head>
<body  id="page-top">
    <form id="form1" runat="server">
        <asp:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server"></asp:ToolkitScriptManager>
        <asp:UpdatePanel ID="UpdatePanel1" runat="server">
            <ContentTemplate>
                <asp:HiddenField ID="hfvalue" runat="server" />
                <asp:HiddenField ID="HfTotal" runat="server" />
                <asp:Button ID="btnReturn1" runat="server" Enable="false" Visible="false" Text="None" />
                <div class="container-fluid" style="background-color: red;">
                    <div class="row">
                        <div class="col-md-4">
                            <img src="img/MARVEL-POS.png" width="150px" class="logo">
                        </div>
                        <div class="col-md-4 text-center">
                            <h2 style="color: White; padding-top: 15px; font-size: 22px;">MARVIL STORE
                            </h2>
                        </div>
                        <div class="col-md-4">
                            <div style="padding-right: 30px; padding-bottom: 10px; text-align: right;">
                                <asp:Image ID="empPhoto" class="profile" ImageUrl="~/Terminal/img/logo1.png" runat="server" />
                                <a class="menu-toggle" href="javascript:void(0)" onclick="checkForClick();" data-toggle="sidebar-wrapper" data-target="#sidebar-wrapper">
                                    <i class="fas fa-bars"></i>
                                </a>&nbsp;
                               <asp:Button ID="btnLogout" runat="server" class="btn-sm btn-dark" Text="Logout" OnClick="btnLogout_Click" />
                                <%-- <asp:Button ID="btnFullScr" runat="server" Text="Full" OnClientClick="openFullscreen();" />--%>
                            </div>
                            <nav id="sidebar-wrapper">
                                <ul class="sidebar-nav">
                                    <li class="sidebar-brand">
                                        <asp:HyperLink class="js-scroll-trigger" ID="hpClientType" runat="server">Client ID : </asp:HyperLink>
                                    </li>
                                    <li class="sidebar-nav-item">
                                        <%--   <a class="js-scroll-trigger" href="#page-top">Emp ID </a>--%>                                     
                                    </li>
                                    <li class="sidebar-nav-item">
                                        <%--   <a class="js-scroll-trigger" href="#about">Store ID </a>--%>   
                                    </li>
                                    <li class="sidebar-nav-item">
                                        <table class="table table-borderless" style="color: white; font-size: small; font-weight: lighter;">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <asp:Label ID="lblStore" runat="server" Text=" "></asp:Label>
                                                    </td>
                                                    <td>&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <asp:Label ID="lblEmp" runat="server" Text=" "></asp:Label>
                                                    </td>
                                                    <td>&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <asp:Label ID="Label7" runat="server" Text="Sales Targets "></asp:Label>
                                                        <asp:Label ID="Label8" runat="server" Text=" "></asp:Label>
                                                        <br />
                                                        <asp:Label ID="Label9" runat="server" Text="Sales Targets "></asp:Label>
                                                        <asp:Label ID="Label10" runat="server" Text=" "></asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:Label ID="Label11" runat="server" Text="N/A"></asp:Label>
                                                        <br />
                                                        <asp:Label ID="Label12" runat="server" Text="N/A"></asp:Label>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <asp:Label ID="Label13" runat="server" Text="Sales Achievement"></asp:Label>
                                                        <asp:Label ID="Label14" runat="server" Text=" "></asp:Label>
                                                        <br />
                                                        <asp:Label ID="Label15" runat="server" Text="Sales Achievement"></asp:Label>
                                                        <asp:Label ID="Label16" runat="server" Text=" "></asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:Label ID="Label17" runat="server" Style="color: red;" Text=" "></asp:Label>
                                                        <br />
                                                        <br />
                                                        <asp:Label ID="Label18" runat="server" Style="color: red;" Text=" "></asp:Label>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>&nbsp;</td>
                                                    <td>&nbsp;</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </li>
                                    <li class="sidebar-nav-item">
                                        <%--  <a class="js-scroll-trigger" href="#contact">Contact</a>--%>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
                <section class="content-section bg-light" id="about">
                    <div class="container-fluid text-center" style="">
                        <div class="row">
                            <div class="col-lg-8">
                                <!--- Id DIv--->
                                <div class="card">
                                    <div class="card-body">
                                        <table class="table table-borderless" style="margin-bottom: 0px;">
                                            <tbody>
                                                <tr>
                                                    <td><b>TRANSACTION ID</b></td>
                                                    <td scope="row">
                                                        <asp:TextBox ID="txtTransactionIDShow" ReadOnly="true" class="form-control" placeholder="Transaction ID" runat="server"></asp:TextBox>
                                                    </td>
                                                    <td><b>Date</b></td>
                                                    <td>
                                                        <asp:TextBox ID="TextBox3" ReadOnly="true" class="form-control" placeholder="Current Date :" runat="server"></asp:TextBox></td>
                                                </tr>
                                                <tr>
                                                    <td><b>TYPE OF CUSTOMER</b></td>
                                                    <td>
                                                        <asp:DropDownList ID="ddlCSV" class="form-control" runat="server" OnSelectedIndexChanged="ddlCSV_SelectedIndexChanged" AutoPostBack="True">
                                                            <asp:ListItem>WALK IN CUSTOMER </asp:ListItem>
                                                            <asp:ListItem>REGISTERED CUSTOMER</asp:ListItem>
                                                        </asp:DropDownList>
                                                    </td>
                                                    <td><b>CUSTOMER MOBILE NUMBER</b></td>
                                                    <td>
                                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" ForeColor="Red" Text="*" ControlToValidate="txtCustomerID" ErrorMessage="Please Enter CustomerID" Display="Dynamic" ValidationGroup="p"></asp:RequiredFieldValidator>
                                                        <asp:TextBox ID="txtCustomerID" MaxLength="15" class="form-control" placeholder=" Enter Customer Mobile Number" runat="server" OnTextChanged="txtCustomerID_TextChanged"></asp:TextBox></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <!--- Id DIv--->
                                <div class="card" style="margin-top: 20px;">
                                    <div class="card-body">
                                        <div class="tbl_body" style="height: 200px !important; overflow: auto;">
                                            <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="False" CellPadding="4" DataKeyNames="ID,IsReturn,IsDraft,SellsOrderItemID, IsQtyTxtOn,IsDiscImgOn " Font-Size="12px" ForeColor="#333333" GridLines="None" HeaderStyle-HorizontalAlign="Center" HorizontalAlign="Center" OnRowDataBound="GridView1_RowDataBound" RowStyle-HorizontalAlign="Center" ShowHeaderWhenEmpty="True" Width="99%" OnSelectedIndexChanged="GridView1_SelectedIndexChanged1" TabIndex="1" OnRowEditing="GridView1_RowEditing">
                                                <AlternatingRowStyle BackColor="White" ForeColor="#284775" />
                                                <Columns>
                                                    <asp:TemplateField HeaderText="S.No">
                                                        <ItemTemplate>
                                                            <%# Container.DataItemIndex+1 %>
                                                        </ItemTemplate>
                                                    </asp:TemplateField>
                                                    <asp:BoundField DataField="Code" HeaderText="Code" />
                                                    <asp:BoundField DataField="Item Name" HeaderText="Item Name" />
                                                    <asp:BoundField DataField="Dim" HeaderText="UOM" />
                                                    <asp:TemplateField HeaderText="Purchase Qty" Visible="true">
                                                        <ItemTemplate>
                                                            <asp:TextBox ID="tb_Qty" runat="server" AutoPostBack="True" CausesValidation="True" Text='<%#Eval("Qty")%>' Visible="true" Width="50px" OnTextChanged="tb_Qty_TextChanged" TabIndex="1"></asp:TextBox>
                                                            <b>/</b>
                                                            <asp:TextBox ID="tb_Qty1" runat="server" CausesValidation="True" ReadOnly="true" Text='<%#Eval("ReturnQty")%>' Visible="false" Width="50px" OnTextChanged="tb_Qty1_TextChanged"></asp:TextBox>
                                                            <asp:Label runat="server" Text='<%#Eval("TtlQty")%>'></asp:Label>
                                                            <asp:RegularExpressionValidator ID="RegularExpressionValidator2" runat="server" ControlToValidate="tb_Qty" Display="Dynamic" ErrorMessage="*" Style="color: #FF3300" ValidationExpression="^[0-9]*$"></asp:RegularExpressionValidator>
                                                            <asp:FilteredTextBoxExtender ID="TextBox1_FilteredTextBoxExtender" runat="server"
                                                                Enabled="True" TargetControlID="tb_Qty" FilterType="Numbers, Custom" ValidChars=".">
                                                            </asp:FilteredTextBoxExtender>
                                                        </ItemTemplate>
                                                    </asp:TemplateField>
                                                    <asp:BoundField DataField="Label Price" HeaderText="Label Price" />
                                                    <asp:TemplateField HeaderText="Discount 1st">
                                                        <ItemTemplate>
                                                            <asp:Label ID="lblDiscount1" runat="server" Text='<%#Eval("Discount 2nd")%>'></asp:Label>
                                                            <asp:Label ID="lblPromoFree" runat="server" Text='<%#Eval("IsFreeLabel")%>'></asp:Label>
                                                            <asp:ImageButton ID="ImagebtnDiscount2" runat="server" Height="20" src="/Terminal/img/discount.png" Width="20" OnClick="ImagebtnDiscount2_Click" />
                                                        </ItemTemplate>
                                                    </asp:TemplateField>
                                                    <asp:TemplateField HeaderText="Discount 2nd">
                                                        <EditItemTemplate>
                                                            <asp:TextBox ID="TextBox1" runat="server" Text='<%# Bind("[Discount 1st]") %>'></asp:TextBox>
                                                        </EditItemTemplate>
                                                        <ItemTemplate>
                                                            <asp:Label ID="lblDiscount2" runat="server" Text='<%# Bind("[Discount 1st]") %>'></asp:Label>
                                                        </ItemTemplate>
                                                    </asp:TemplateField>
                                                    <asp:TemplateField HeaderText="Selling Price">
                                                        <EditItemTemplate>
                                                            <asp:TextBox ID="TextBox2" runat="server" Text='<%# Bind("[Selling Price]") %>'></asp:TextBox>
                                                        </EditItemTemplate>
                                                        <ItemTemplate>
                                                            <asp:Label ID="lblSellingPrice" runat="server" Text='<%# Bind("[Selling Price]") %>'></asp:Label>
                                                        </ItemTemplate>
                                                    </asp:TemplateField>
                                                    <asp:TemplateField HeaderText="Total">
                                                        <ItemTemplate>
                                                            <asp:Label ID="lblTotal" runat="server" Text='<%#Eval("Total") %>'></asp:Label>
                                                        </ItemTemplate>
                                                    </asp:TemplateField>
                                                    <asp:TemplateField HeaderText="Action">
                                                        <ItemTemplate>
                                                            <asp:ImageButton ID="ImagebtnRemove" runat="server" Height="20" src="/Terminal/img/Remove.png" Width="20" OnClick="ImagebtnRemove_Click" />
                                                            <asp:ImageButton ID="ImagebtnUndo" runat="server" Height="20" src="/Terminal/img/undos.png" Width="20" OnClick="ImagebtnUndo_Click" />
                                                            <asp:ImageButton ID="ImagebtnReturn" runat="server" Height="20" src="/Terminal/img/Return.png" Width="20" OnClick="ImagebtnReturn_Click" />
                                                        </ItemTemplate>
                                                    </asp:TemplateField>
                                                </Columns>
                                                <EmptyDataTemplate>
                                                    <div style="text-align: center">
                                                        No Product Added..
                                                    </div>
                                                </EmptyDataTemplate>
                                                <EditRowStyle BackColor="#999999" HorizontalAlign="Center" VerticalAlign="Top" />
                                                <FooterStyle BackColor="#5D7B9D" Font-Bold="True" ForeColor="White" />
                                                <HeaderStyle BackColor="#5D7B9D" Font-Bold="True" ForeColor="White" />
                                                <PagerStyle BackColor="#284775" ForeColor="White" Height="1px" HorizontalAlign="Center" />
                                                <RowStyle BackColor="#F7F6F3" ForeColor="#333333" />
                                                <SelectedRowStyle BackColor="#E2DED6" Font-Bold="True" ForeColor="#333333" />
                                                <SortedAscendingCellStyle BackColor="#E9E7E2" />
                                                <SortedAscendingHeaderStyle BackColor="#506C8C" />
                                                <SortedDescendingCellStyle BackColor="#FFFDF8" />
                                                <SortedDescendingHeaderStyle BackColor="#6F8DAE" />
                                            </asp:GridView>
                                        </div>
                                        <div class="tbl_footer">
                                            <table id="totalTable" class="tt table-borderless" style="width: 100%; float: none; padding: 5px; color: #000; background: #FFF;">
                                                <tbody>
                                                    <tr>
                                                        <td style="padding: 5px 10px; border-top: 1px solid #DDD; font-size: 15px;">Items</td>
                                                        <td class="text-right" style="padding: 5px 10px; font-size: 14px; font-weight: bold; border-top: 1px solid #DDD;">
                                                            <span id="titems">
                                                                <asp:Label ID="lblItems" runat="server" Text="0"></asp:Label>
                                                            </span>
                                                        </td>
                                                        <td style="padding: 5px 10px; border-top: 1px solid #DDD; font-size: 15px;">Total  
                                                        </td>
                                                        <td class="text-right" style="padding: 5px 10px; font-size: 14px; font-weight: bold; border-top: 1px solid #DDD;">
                                                            <!-- <span id="total">0.00</span> -->
                                                            <asp:Label ID="lblTotalAmount" runat="server" Text="0.00"></asp:Label>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding: 5px 10px; border-top: 1px solid #DDD; font-size: 15px;">Payment Fee 2%</td>
                                                        <td class="text-right" style="padding: 5px 10px; font-size: 14px; font-weight: bold; border-top: 1px solid #DDD;">
                                                            <span id="titems">&nbsp;
                                                                <asp:Label ID="Label29" runat="server" Text="0.00"></asp:Label>
                                                            </span>
                                                        </td>
                                                        <td style="padding: 5px 10px; border-top: 1px solid #DDD; font-size: 15px;">Cash</td>
                                                        <td class="text-right" style="padding: 5px 10px; font-size: 14px; font-weight: bold; border-top: 1px solid #DDD;">
                                                            <!-- <span id="total">0.00</span> -->
                                                            <span id="titems">
                                                                <asp:Label ID="Label27" runat="server" Text="0.00"></asp:Label>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding: 5px 10px; font-size: 15px;">Voucher<a href="#" id="pptax2" tabindex="-1">
                                                         
                                                        </a>
                                                        </td>
                                                        <td class="text-right" style="padding: 5px 10px; font-size: 14px; font-weight: bold;">
                                                            <span id="ttax2">
                                                                <asp:Label ID="Label30" runat="server" Text="0.00"></asp:Label>
                                                            </span>
                                                        </td>
                                                        <td style="padding: 5px 10px; font-size: 15px;">Discount<a href="#" id="ppdiscount" tabindex="-1">
                                                          
                                                        </a>
                                                        </td>
                                                        <td class="text-right" style="padding: 5px 10px; font-size: 14px; font-weight: bold;">
                                                            <span id="titems">
                                                                <asp:Label ID="Label57" runat="server" Text="0.00"></asp:Label>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding: 5px 10px; font-size: 15px;">
                                                            <asp:Label ID="lblDbCrFee" runat="server" Text=""></asp:Label>Credit Card<a href="#" id="pptax2" tabindex="-1">
                                     
                                                            </a>
                                                        </td>
                                                        <td class="text-right" style="padding: 5px 10px; font-size: 14px; font-weight: bold;">
                                                            <span id="ttax2">&nbsp;<asp:Label ID="Label31" runat="server" Text="0.00"></asp:Label>
                                                            </span>
                                                        </td>
                                                        <td style="padding: 5px 10px; font-size: 15px;">Debit Card<a href="#" id="ppdiscount" tabindex="-1">
                                                         
                                                        </a>
                                                        </td>
                                                        <td class="text-right" style="padding: 5px 10px; font-size: 14px; font-weight: bold;">
                                                            <span id="tds">
                                                                <asp:Label ID="Label28" runat="server" Text="0.00"></asp:Label>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr style="font-weight: bold; font-size: 12px; height: 33px;">
                                                        <td style="padding: 5px 10px; border-top: 1px solid #666; border-bottom: 1px solid #333; font-weight: bold; background: #333; color: #FFF;">VAT/TAX  (<asp:Label ID="lblCurrentTaxVal" runat="server" Text=""></asp:Label>
                                                            ): 
                                                        </td>
                                                        <td class="text-right" style="padding: 5px 10px 5px 10px; font-size: 14px; border-top: 1px solid #666; border-bottom: 1px solid #333; font-weight: bold; background: #333; color: #FFF;">
                                                            <asp:Label ID="lblTotalTax1" runat="server" Text="0.00"></asp:Label>
                                                        </td>
                                                        <td style="padding: 5px 10px; border-top: 1px solid #666; border-bottom: 1px solid #333; font-weight: bold; background: #333; color: #FFF;">Total Paid :<a href="#" id="pshipping" tabindex="-1">
                                       
                                                        </a>
                                                            <span id="tship"></span>
                                                            <asp:ImageButton ID="imgOnBillTotal" runat="server" Height="19px" src="/Terminal/img/discount.png" Visible="false" Width="20px" OnClick="imgOnBillTotal_Click" />
                                                        </td>
                                                        <td class="text-right" style="padding: 5px 10px 5px 10px; font-size: 14px; border-top: 1px solid #666; border-bottom: 1px solid #333; font-weight: bold; background: #333; color: #FFF;">
                                                            <span id="gtotal">
                                                                <asp:Label ID="lblTotalPaymemt" runat="server" Text="0.00"></asp:Label>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="row" style="padding-top: 30px; margin-top: 25px;">
                                            <div class="col-md-4 t1">
                                                <asp:Button ID="Button2" runat="server" class="btn btn-danger btn_style1" Text="Cancel [Esc]" OnClick="btnCancel_Click" />
                                                <asp:Button ID="btnHold" runat="server" class="btn  btn-info btn_style1" Text="Hold [F8]" OnClick="btnHold_Click" />
                                            </div>
                                            <div class="col-md-4 tt">
                                                <asp:Button ID="btn_Retrieve" runat="server" class="btn btn-info btn_style1" Text="Retrive Hold" OnClick="btn_Retrieve_Click" />
                                                <asp:Button ID="Button4" runat="server" class="btn btn-danger btn_style1" Text="Print [E9]" OnClientClick="printDiv('PrintDiv')" OnClick="btnPrint_Click" />
                                            </div>
                                            <div class="col-md-4 t2">
                                                <asp:Button ID="btnPay" runat="server" CausesValidation="true" ValidationGroup="a" class="btn btn-primary nt btn_style2" Text="Pay [F7]" OnClick="btnPay_Click" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4">
                                <div class="row justify-content-center">
                                    <div class="col-12 col-md-12 col-lg-12">
                                        <div class="card-body row no-gutters align-items-center">

                                            <!--end of col-->
                                            <div class="col">
                                                <asp:TextBox ID="txtSearch" MaxLength="40" runat="server" AutoPostBack="true" class="form-control  form-control-lg" placeholder="Enter Product Name & Product ID" OnTextChanged="txtSearch_TextChanged" ToolTip="Search Product Here.."></asp:TextBox>
                                                <asp:Label runat="server" Style="display: none" ID="lb_Fake"></asp:Label>
                                                <%--  <asp:TextBox runat="server" ID="TextBox5" AutoPostBack="True" OnTextChanged="TextBox5_SelectedIndexChanged"></asp:TextBox>--%>
                                                <asp:AutoCompleteExtender ID="AutoCompleteExtender1" ServiceMethod="SearchProducts"
                                                    MinimumPrefixLength="1"
                                                    CompletionInterval="100" EnableCaching="true" CompletionSetCount="10"
                                                    TargetControlID="txtSearch"
                                                    runat="server" FirstRowSelected="false" UseContextKey="True"
                                                    CompletionListCssClass="completionList"
                                                    CompletionListHighlightedItemCssClass="itemHighlighted"
                                                    CompletionListItemCssClass="listItem">
                                                </asp:AutoCompleteExtender>
                                            </div>
                                        </div>
                                    </div>
                                    <!--end of col-->
                                </div>
                                <div class="card" style="margin-top: 20px; margin-bottom: 0px;">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-md-5">
                                                <asp:Image ID="prodImage" runat="server" class="card-img" Style="height: 90px; width: 100%;" ImageUrl="~/New_Terminal/img/default_product.jpg" />
                                            </div>
                                            <div class="col-md-7">
                                                <div class="row" style="margin-top: 3px;">
                                                    <b>Name :&nbsp;</b><asp:Label ID="lblProductName" runat="server"></asp:Label>
                                                </div>
                                                <div class="row" style="margin-top: 3px;">
                                                    <b>Price :&nbsp;</b>
                                                    <asp:Label ID="lblPrice" runat="server" Text=""></asp:Label>
                                                </div>
                                                <div class="row" style="margin-top: 3px;">
                                                    <b>Stock :&nbsp;</b>
                                                    <asp:Label ID="lblStock" runat="server" Text=""></asp:Label>
                                                </div>
                                                <div class="row" style="margin-top: 3px;">
                                                    <b>Discount :&nbsp;</b>
                                                    <asp:Label ID="lblDiscount" runat="server" Text=""></asp:Label>
                                                </div>
                                                <div class="row" style="margin-top: 3px;">
                                                    <b>Unit of Measurment :&nbsp;</b>
                                                    <asp:Label ID="lblUOM" runat="server" Text=""></asp:Label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="card" style="margin-top: 20px; margin-bottom: 0px;">
                                    <div class="card-body p-3">
                                        <table class="table text-left" style="margin-bottom: 0px; border: none !important;">
                                            <tbody>
                                                <tr class="p-0">
                                                    <td width="40%" class="p-0">
                                                        <b>Total -: </b>
                                                    </td>
                                                    <td width="60%" class="p-0">
                                                        <asp:TextBox ID="txtTotal" ReadOnly="true" class="form-control" Text="0" runat="server" OnTextChanged="txtTotal_TextChanged"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr class="p-0">
                                                    <td class="p-0"><b>Discount</b></td>
                                                    <td class="p-0">
                                                        <div class="input-group">
                                                            <asp:TextBox ID="tb_Discount" ReadOnly="true" class="form-control" Text="0" runat="server"></asp:TextBox>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr class="p-0">
                                                    <td class="p-0"><b>Total Amount</b></td>
                                                    <td class="p-0">
                                                        <asp:TextBox ID="txtTotalPay" ReadOnly="true" class="form-control" Text="0" runat="server" OnTextChanged="txtTotalPay_TextChanged"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr class="p-0">
                                                    <td class="p-0"><b>Refund</b></td>
                                                    <td class="p-0">
                                                        <div class="input-group">
                                                            <asp:TextBox ID="txtRefund" ReadOnly="true" class="form-control" Text="0" runat="server"></asp:TextBox>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="card" style="margin-top: 20px;">
                                    <div class="card-body p-3">
                                        <table class="table text-left" style="margin-bottom: 0px;">
                                            <tbody>
                                                <tr class="p-0">
                                                    <td width="40%" class="p-0">
                                                        <b>
                                                            <asp:CheckBox ID="Chk_Cash" runat="server" AutoPostBack="true" OnCheckedChanged="Chk_Cash_CheckedChanged" />&nbsp;Cash</b>
                                                    </td>
                                                    <td width="60%" class="p-0">
                                                        <asp:TextBox ID="txtCashAmount" ReadOnly="true" class="form-control" runat="server" AutoPostBack="true" OnTextChanged="txtCashAmount_Cash_Text_Changed"></asp:TextBox>
                                                        <asp:RegularExpressionValidator ID="RegularExpressionValidator2" runat="server" ControlToValidate="txtCashAmount" Display="Dynamic" ErrorMessage="*" Style="color: #FF3300" ValidationExpression="^[0-9]\d*(\.\d+)?$"></asp:RegularExpressionValidator>
                                                        <asp:RequiredFieldValidator ID="rfvtxtCashAmmount" runat="server" ErrorMessage="*" ControlToValidate="txtCashAmount" Display="Dynamic" Style="color: #FF3300"></asp:RequiredFieldValidator>
                                                        <asp:FilteredTextBoxExtender ID="TextBox1_FilteredTextBoxExtender" runat="server"
                                                            Enabled="True" TargetControlID="txtCashAmount" FilterType="Numbers, Custom" ValidChars=".">
                                                        </asp:FilteredTextBoxExtender>
                                                    </td>
                                                </tr>
                                                <tr class="p-0">
                                                    <td class="p-0"><b>
                                                        <asp:CheckBox ID="Chk_Debit" runat="server" AutoPostBack="true" OnCheckedChanged="Chk_Debit_CheckedChanged" />&nbsp;Debit Card</b></td>
                                                    <td class="p-0">
                                                        <div class="input-group">
                                                            <asp:TextBox ID="TextBox24" ReadOnly="true" class="form-control" placeholder="Amount" runat="server" AutoPostBack="True" OnTextChanged="TextBox24_TextChanged" onkeypress="return IsOneDecimalPoint(event);"></asp:TextBox>

                                                            <asp:RegularExpressionValidator ID="RegularExpressionValidator1" runat="server" ControlToValidate="TextBox24" Display="Dynamic" ErrorMessage="*" Style="color: #FF3300" ValidationExpression="^[0-9]\d*(\.\d+)?$"></asp:RegularExpressionValidator>
                                                            <asp:FilteredTextBoxExtender ID="FilteredTextBoxExtender1" runat="server"
                                                                Enabled="True" TargetControlID="TextBox24" FilterType="Numbers, Custom" ValidChars=".">
                                                            </asp:FilteredTextBoxExtender>
                                                            <asp:DropDownList ID="ddlBankNameDebit" class="form-control" runat="server">
                                                                <asp:ListItem>--SELECT BANK--</asp:ListItem>
                                                                <asp:ListItem>Bank A</asp:ListItem>
                                                                <asp:ListItem>Bank B</asp:ListItem>
                                                            </asp:DropDownList>
                                                            <asp:RequiredFieldValidator ID="rfvddlBankNameDebit" ValidationGroup="a" runat="server" ControlToValidate="ddlBankNameDebit" InitialValue="--SELECT BANK--" ErrorMessage="*" Style="color: #FF3300" Display="Dynamic"></asp:RequiredFieldValidator>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr class="p-0">
                                                    <td class="p-0"><b>Debit Card No</b></td>
                                                    <td class="p-0">
                                                        <asp:TextBox ID="TextBox30" MaxLength="16" ReadOnly="true" class="form-control" placeholder="Card No." runat="server"></asp:TextBox>
                                                        <asp:RequiredFieldValidator ID="rfvtxtTextBox30" runat="server" ValidationGroup="a" ControlToValidate="TextBox30" Display="Dynamic" ErrorMessage="*" Style="color: #FF3300"></asp:RequiredFieldValidator>
                                                        <asp:RequiredFieldValidator ID="rfvTextBox30" ValidationGroup="a" runat="server" ControlToValidate="TextBox30" ErrorMessage="*" Style="color: #FF3300" Display="Dynamic"></asp:RequiredFieldValidator>
                                                        <asp:RegularExpressionValidator ID="revTextBox30" ValidationGroup="a" runat="server" ControlToValidate="TextBox30" Display="Dynamic" ErrorMessage="*" Style="color: #FF3300" ValidationExpression="^[0-9]{16}$"></asp:RegularExpressionValidator>
                                                        <asp:FilteredTextBoxExtender ID="FilteredTextBoxExtender3" runat="server"
                                                            Enabled="True" TargetControlID="TextBox30" FilterType="Numbers, Custom" ValidChars=".">
                                                        </asp:FilteredTextBoxExtender>
                                                    </td>
                                                </tr>
                                                <tr class="p-0">
                                                    <td class="p-0"><b>
                                                        <asp:CheckBox ID="Chk_Credit" runat="server" AutoPostBack="true" OnCheckedChanged="Chk_Credit_CheckedChanged" />&nbsp;Credit Card</b></td>
                                                    <td class="p-0">
                                                        <div class="input-group">
                                                            <asp:TextBox ID="TextBox26" ReadOnly="true" class="form-control" runat="server" OnTextChanged="TextBox26_TextChanged"></asp:TextBox>

                                                            <asp:RegularExpressionValidator ID="revTextBox26" ValidationGroup="a" ControlToValidate="TextBox26" runat="server" ErrorMessage="*" ValidationExpression="^[0-9]\d*(\.\d+)?$"></asp:RegularExpressionValidator>
                                                            <asp:FilteredTextBoxExtender ID="FilteredTextBoxExtender2" runat="server"
                                                                Enabled="True" TargetControlID="TextBox26" FilterType="Numbers, Custom" ValidChars=".">
                                                            </asp:FilteredTextBoxExtender>
                                                            <asp:DropDownList ID="ddlBankNameCredit" class="form-control" runat="server" OnTextChanged="ddlBankNameCredit_TextChanged">
                                                                <asp:ListItem>--SELECT BANK--</asp:ListItem>
                                                                <asp:ListItem>Bank A</asp:ListItem>
                                                                <asp:ListItem>Bank B</asp:ListItem>
                                                            </asp:DropDownList>
                                                            <asp:RequiredFieldValidator ID="rfvddlBankNameCredit" ValidationGroup="a" runat="server" ControlToValidate="ddlBankNameCredit" InitialValue="--SELECT BANK--" ErrorMessage="*" Style="color: #FF3300" Display="Dynamic"></asp:RequiredFieldValidator>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr class="p-0">
                                                    <td class="p-0"><b>Credit Card No</b></td>
                                                    <td class="p-0">
                                                        <asp:TextBox ID="TextBox6" MaxLength="16" ReadOnly="true" class="form-control" placeholder="Card No." runat="server"></asp:TextBox>
                                                        <asp:RequiredFieldValidator ID="rfvTextBox6" runat="server" ValidationGroup="a" ControlToValidate="TextBox6" ErrorMessage="*" Style="color: #FF3300" Display="Dynamic"></asp:RequiredFieldValidator>
                                                        <asp:RegularExpressionValidator ID="RegularExpressionValidator8" runat="server" ValidationGroup="a" ControlToValidate="TextBox6" Display="Dynamic" ErrorMessage="*" Style="color: #FF3300" ValidationExpression="^[0-9]{16}$"></asp:RegularExpressionValidator>
                                                        <asp:FilteredTextBoxExtender ID="FilteredTextBoxExtender4" runat="server"
                                                            Enabled="True" TargetControlID="TextBox6" FilterType="Numbers">
                                                        </asp:FilteredTextBoxExtender>
                                                    </td>
                                                </tr>
                                                <tr class="p-0">
                                                    <td class="p-0"><b>
                                                        <asp:CheckBox ID="CheckBox4" runat="server" AutoPostBack="true" OnCheckedChanged="Chk_Vocuher_CheckedChanged" />&nbsp;Voucher No</b></td>
                                                    <td class="p-0">
                                                        <div class="input-group">
                                                            <asp:TextBox ID="TextBox28" ReadOnly="true" class="form-control" placeholder="Voucher No." AutoPostBack="True" runat="server" OnTextChanged="TextBox28_TextChanged"></asp:TextBox>
                                                            <asp:RegularExpressionValidator ID="RegularExpressionValidator4" runat="server" ValidationGroup="a" ControlToValidate="TextBox28" Display="Dynamic" ErrorMessage="*" Style="color: #FF3300" ValidationExpression="^[0-9]\d*(\.\d+)?$"></asp:RegularExpressionValidator>
                                                            <asp:AutoCompleteExtender ID="AutoCompleteExtender2" ServiceMethod="SearchVouchers"
                                                                MinimumPrefixLength="1"
                                                                CompletionInterval="100" EnableCaching="false" CompletionSetCount="10"
                                                                TargetControlID="TextBox28"
                                                                runat="server" FirstRowSelected="false">
                                                            </asp:AutoCompleteExtender>
                                                            <asp:FilteredTextBoxExtender ID="FilteredTextBoxExtender5" runat="server"
                                                                Enabled="True" TargetControlID="TextBox28" FilterType="Numbers">
                                                            </asp:FilteredTextBoxExtender>
                                                            <asp:TextBox ID="TextBox29" ReadOnly="true" class="form-control" placeholder="Voucher Value" runat="server"></asp:TextBox>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="row justify-content-center">
                                    <div class="col-12 col-md-12 col-lg-12" style="padding-top: 10px !important;">
                                        <div class="card-body row no-gutters align-items-center">
                                            <!--end of col-->
                                            <div class="col">
                                                <div class="form-group-sm">
                                                    <asp:TextBox ID="txtTransactionID" runat="server" AutoPostBack="True" class="form-control" placeholder="Enter Transaction ID. "></asp:TextBox>
                                                </div>
                                            </div>
                                            <div class="col-auto">
                                                <asp:Button ID="btnReturn" CssClass="btn btn-sm btn-primary" runat="server" Text="Return" OnClick="btnReturn_Click" />
                                            </div>
                                            <!--end of col-->

                                            <!--end of col-->
                                        </div>
                                    </div>
                                    <!--end of col-->
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <asp:ModalPopupExtender ID="ModalPopupExtender4" runat="server" CancelControlID="btn_Cancel" PopupControlID="Panel2" TargetControlID="fake_Btn" BackgroundCssClass="modalBackground"></asp:ModalPopupExtender>
                <asp:Button runat="server" ID="fake_Btn" Style="display: none;" Text="Button" />
                <asp:ModalPopupExtender ID="ModalPopupExtender5" runat="server" CancelControlID="Img_btn_Cancel1" PopupControlID="Panel3" TargetControlID="fake_Btn1" BackgroundCssClass="modalBackground"></asp:ModalPopupExtender>
                <asp:Button runat="server" ID="fake_Btn1" Style="display: none;" Text="Button" />
                <asp:ModalPopupExtender ID="ModalPopupExtender6" runat="server" CancelControlID="Img_btn_Cancel2" PopupControlID="Panel4" TargetControlID="fake_Btn2" BackgroundCssClass="modalBackground"></asp:ModalPopupExtender>
                <asp:Button runat="server" ID="fake_Btn2" Style="display: none;" />
                <asp:ModalPopupExtender ID="ModalPopupExtender7" runat="server" CancelControlID="Img_btn_Cancel3" PopupControlID="Panel5" TargetControlID="fake_Btn3" BackgroundCssClass="modalBackground"></asp:ModalPopupExtender>
                <asp:Button runat="server" ID="fake_Btn3" Style="display: none;" />
                <div>
                    <asp:Panel runat="server" ID="Panel2" Style="display: none;" CssClass="modalPopup">
                        <div>
                            <table class="table table-responsive" style="background: white">
                                <tr>
                                    <td>
                                        <asp:Button runat="server" Text="410" ID="btn_1" BackColor="#3366FF" BorderColor="#0000CC" BorderStyle="Solid" Font-Bold="True" ForeColor="White" Height="42px" Width="127px" OnClick="btn_1_Click_410" />
                                        <b>X</b>
                                        <asp:Label ID="lbl410Count" runat="server" Text="0"></asp:Label>
                                    </td>
                                    <td>
                                        <asp:Button runat="server" Text="420" ID="btn_2" BackColor="#3366FF" BorderColor="#0000CC" BorderStyle="Solid" Font-Bold="True" ForeColor="White" Height="40px" Style="margin-left: 0px" Width="128px" OnClick="btn_2_Click_420" />
                                        <b>X</b>
                                        <asp:Label ID="lbl420Count" runat="server" Text="0"></asp:Label>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="auto-style31">
                                        <asp:Button runat="server" Text="450" ID="btn_3" BackColor="#3366FF" BorderColor="#0000CC" BorderStyle="Solid" Font-Bold="True" ForeColor="White" Height="42px" Width="125px" OnClick="btn_3_Click_450" />
                                        <b>X</b>
                                        <asp:Label ID="lbl450Count" runat="server" Text="0"></asp:Label>
                                    </td>
                                    <td>
                                        <asp:Button runat="server" Text="500" ID="btn_4" BackColor="#3366FF" BorderColor="#0000CC" BorderStyle="Solid" Font-Bold="True" ForeColor="White" Height="41px" Width="130px" OnClick="btn_4_Click_500" />
                                        <b>X</b>
                                        <asp:Label ID="lbl500Count" runat="server" Text="0"></asp:Label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <asp:Button runat="server" ID="btn_Manual" Text="Manual" BackColor="#CC3300" BorderColor="#0000CC" Width="100%" BorderStyle="Solid" Font-Bold="True" ForeColor="White" Height="42px" OnClick="btn_Manual_Click" />
                                    </td>
                                    <td>
                                        <asp:Button ID="btn_Cancel" runat="server" Text="OK" BackColor="DarkGreen" BorderColor="#0000CC" Width="100%" BorderStyle="Solid" Font-Bold="True" ForeColor="White" Height="42px" />
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </asp:Panel>
                </div>
                <div>
                    <asp:Panel ID="Panel3" runat="server" Style="display: none;" Height="148px" Width="273px" CssClass="modalPopup">
                        <div>
                            <asp:GridView runat="server" ID="gvPromotionData" AutoGenerateColumns="False" BackColor="#DEBA84" BorderColor="#DEBA84" BorderStyle="None" BorderWidth="1px" CellPadding="3" CellSpacing="2" ShowHeaderWhenEmpty="True" Height="243px" DataKeyNames="Buy,Get,PromotionID,Addtionalvalue,MaxValue,MinTrans,PerUserApplied,Discount,ProdPromoType, GetType , OnQty, AddingPrice">
                                <Columns>
                                    <asp:TemplateField HeaderText="ProductID" Visible="true">
                                        <ItemTemplate>
                                            <asp:Label ID="lb_PromoName" runat="server" Text='<%#Eval("ProductID")%>'></asp:Label>
                                        </ItemTemplate>
                                    </asp:TemplateField>
                                    <asp:BoundField DataField="Discount" HeaderText="Discount" />
                                    <asp:BoundField DataField="FriendlyName" HeaderText="Promo Name" />
                                    <asp:BoundField DataField="Scheme" HeaderText="Scheme Name" />
                                    <asp:BoundField DataField="GetType" HeaderText="GetType" />
                                    <asp:BoundField DataField="OnQty" HeaderText="OnQty" />
                                    <%--    <asp:TemplateField HeaderText="Discount 1st(%)" Visible="true">
                                        <ItemTemplate>
                                            <asp:Label ID="lb_Discount" runat="server" Text='<%#Eval("Discount")%>'></asp:Label>
                                        </ItemTemplate>
                                    </asp:TemplateField>
                                    <asp:TemplateField HeaderText="Promo Name" Visible="true">
                                        <ItemTemplate>
                                            <asp:Label ID="lb_FriendlyName" runat="server" Text='<%#Eval("FriendlyName")%>'></asp:Label>
                                        </ItemTemplate>
                                    </asp:TemplateField>
                                    <asp:TemplateField HeaderText=" Scheme Name " Visible="true">
                                        <ItemTemplate>
                                            <asp:Label ID="lb_Scheme" runat="server" Text='<%#Eval("Scheme")%>'></asp:Label>
                                        </ItemTemplate>
                                    </asp:TemplateField>--%>
                                    <asp:TemplateField HeaderText="Apply Promo">
                                        <ItemTemplate>
                                            <asp:Button runat="server" ID="btn_SelectPromo" Text="Apply Promo" Enabled="False" OnClick="btn_SelectPromo_Click" />
                                            <asp:Button runat="server" ID="btn_CancelPromo" Visible="false" Text="cancel" OnClick="btn_CancelPromo_Click" />
                                        </ItemTemplate>
                                    </asp:TemplateField>

                                </Columns>
                                <EmptyDataTemplate>
                                    <label style="text-align: center; color: red;">No Discount Offer Found !!! </label>
                                </EmptyDataTemplate>
                                <FooterStyle BackColor="#F7DFB5" ForeColor="#8C4510" />
                                <HeaderStyle BackColor="#A55129" Font-Bold="True" ForeColor="White" Height="30px" />
                                <PagerStyle ForeColor="#8C4510" HorizontalAlign="Center" />
                                <RowStyle BackColor="#FFF7E7" ForeColor="#8C4510" />
                                <SelectedRowStyle BackColor="#738A9C" Font-Bold="True" ForeColor="White" />
                                <SortedAscendingCellStyle BackColor="#FFF1D4" />
                                <SortedAscendingHeaderStyle BackColor="#B95C30" />
                                <SortedDescendingCellStyle BackColor="#F1E5CE" />
                                <SortedDescendingHeaderStyle BackColor="#93451F" />
                            </asp:GridView>
                            <div>
                                <asp:ImageButton ID="Img_btn_Cancel1" runat="server" Style="margin-left: 118px;" Height="28px" src="/Terminal/img/Remove.png" Width="28px" />
                            </div>
                        </div>

                    </asp:Panel>
                </div>
                <div>
                    <asp:Panel ID="Panel4" runat="server" Style="display: none;" CssClass="modalPopup" ScrollBars="Auto" Height="300px" Width="250px">
                        <%--Style="display: none;"--%>
                        <div style="height: auto">
                            <asp:GridView runat="server" ID="GridView3" CssClass="table table-bordered gvDatatable" AutoGenerateColumns="False" BackColor="White" BorderColor="#CCCCCC" BorderStyle="None" BorderWidth="1px" CellPadding="3" OnRowCommand="GridView3_RowCommand"
                                ShowHeaderWhenEmpty="True">
                                <Columns>
                                    <asp:TemplateField HeaderText="Order ID" Visible="true">
                                        <ItemTemplate>
                                            <asp:Label ID="lb_SellsOrderId" runat="server" Text='<%#Eval("SellsOrderId")%>'></asp:Label>
                                        </ItemTemplate>
                                    </asp:TemplateField>
                                    <asp:TemplateField HeaderText="Total" Visible="true">
                                        <ItemTemplate>
                                            <asp:Label ID="lb_CustomerID" runat="server" Text='<%#Eval("Total")%>'></asp:Label>
                                        </ItemTemplate>
                                    </asp:TemplateField>

                                    <asp:TemplateField HeaderText="Action" Visible="true">
                                        <ItemTemplate>
                                            <asp:Button runat="server" ID="btn_Action" Text="Retrieve" CommandName="Retrieve" />
                                            <asp:Button ID="btnAction1" runat="server" CommandName="hide" Text="Delete" />
                                        </ItemTemplate>
                                    </asp:TemplateField>
                                </Columns>
                                <FooterStyle BackColor="White" ForeColor="#000066" />
                                <HeaderStyle BackColor="#006699" Font-Bold="True" ForeColor="White" />
                                <PagerStyle BackColor="White" ForeColor="#000066" HorizontalAlign="Left" />
                                <RowStyle ForeColor="#000066" />
                                <SelectedRowStyle BackColor="#669999" Font-Bold="True" ForeColor="White" />
                                <SortedAscendingCellStyle BackColor="#F1F1F1" />
                                <SortedAscendingHeaderStyle BackColor="#007DBB" />
                                <SortedDescendingCellStyle BackColor="#CAC9C9" />
                                <SortedDescendingHeaderStyle BackColor="#00547E" />
                            </asp:GridView>
                        </div>
                        <div style="align-content: center!important;">
                            <asp:ImageButton ID="Img_btn_Cancel2" runat="server" Height="28px" src="img/Remove.png" Width="28px" />
                        </div>
                    </asp:Panel>
                </div>
                <div>
                    <asp:Panel ID="Panel5" runat="server" Style="display: none;" Height="148px" Width="273px" CssClass="modalPopup">
                        <asp:GridView runat="server" ID="gvBillTotal" AutoGenerateColumns="False" BackColor="#DEBA84" BorderColor="#DEBA84" BorderStyle="None" BorderWidth="1px" CellPadding="3" CellSpacing="2" DataKeyNames=" FriendlyName, Discount , MinTrans , MaxValue , PerUserApplied, PromoCategory , Discount2 ,IsProductFree, RelevantID , ID" ShowHeaderWhenEmpty="True" Height="243px">
                            <Columns>
                                <asp:TemplateField HeaderText="Promo ID" Visible="true">
                                    <ItemTemplate>
                                        <asp:Label ID="lb_PromoName" runat="server" Text='<%#Eval("ID")%>'></asp:Label>
                                    </ItemTemplate>
                                </asp:TemplateField>
                                <asp:BoundField DataField="Discount" HeaderText="Discount" />
                                <asp:BoundField DataField="FriendlyName" HeaderText="Promo Name" />
                                <asp:BoundField DataField="PromoCategory" HeaderText="Scheme Name" />
                                <%--    <asp:TemplateField HeaderText="Discount 1st(%)" Visible="true">
                                        <ItemTemplate>
                                            <asp:Label ID="lb_Discount" runat="server" Text='<%#Eval("Discount")%>'></asp:Label>
                                        </ItemTemplate>
                                    </asp:TemplateField>
                                    <asp:TemplateField HeaderText="Promo Name" Visible="true">
                                        <ItemTemplate>
                                            <asp:Label ID="lb_FriendlyName" runat="server" Text='<%#Eval("FriendlyName")%>'></asp:Label>
                                        </ItemTemplate>
                                    </asp:TemplateField>
                                    <asp:TemplateField HeaderText=" Scheme Name " Visible="true">
                                        <ItemTemplate>
                                            <asp:Label ID="lb_Scheme" runat="server" Text='<%#Eval("Scheme")%>'></asp:Label>
                                        </ItemTemplate>
                                    </asp:TemplateField>--%>
                                <asp:TemplateField HeaderText="Apply Promo">
                                    <ItemTemplate>
                                        <asp:Button runat="server" ID="btn_SelectPromo1" Text="Apply Promo" Enabled="false" OnClick="btn_SelectPromo1_Click" />
                                        <asp:Button runat="server" ID="btn_CancelPromo1" Visible="false" Text="cancel" OnClick="btn_CancelPromo1_Click" />
                                    </ItemTemplate>
                                </asp:TemplateField>
                            </Columns>
                            <EmptyDataTemplate>
                                <label style="text-align: center; color: red;">No Discount Offer Found !!! </label>
                            </EmptyDataTemplate>
                            <FooterStyle BackColor="#F7DFB5" ForeColor="#8C4510" />
                            <HeaderStyle BackColor="#A55129" Font-Bold="True" ForeColor="White" Height="30px" />
                            <PagerStyle ForeColor="#8C4510" HorizontalAlign="Center" />
                            <RowStyle BackColor="#FFF7E7" ForeColor="#8C4510" />
                            <SelectedRowStyle BackColor="#738A9C" Font-Bold="True" ForeColor="White" />
                            <SortedAscendingCellStyle BackColor="#FFF1D4" />
                            <SortedAscendingHeaderStyle BackColor="#B95C30" />
                            <SortedDescendingCellStyle BackColor="#F1E5CE" />
                            <SortedDescendingHeaderStyle BackColor="#93451F" />
                        </asp:GridView>
                        <div style="align-content: center!important;">
                            <asp:ImageButton ID="Img_btn_Cancel3" runat="server" Style="margin-left: 118px;" Height="28px" src="/Terminal/img/Remove.png" Width="28px" />
                        </div>
                    </asp:Panel>
                </div>
                <!--Bill Print-->
                <asp:Panel ID="panelprint" Style="display: none;" runat="server">
                    <div id="PrintDiv" class="row" style="margin: 10px;">
                        <div class="container" style="font-size: x-large!important;">
                            <div class="row">
                                <div class="col-xs-12">
                                    <div class="invoice-title">
                                        <div class="text-center">
                                            <b>AFLAK Electronics Industries Co. Ltd</b><br />
                                            <b>Tax ID:</b>
                                            <asp:Label ID="lblNPWP" runat="server"></asp:Label><br />
                                            <b>MARVIL STORE </b>
                                            <br />
                                            <b>WWW.marvil.co.in</b><br />
                                            <b>Tlp:</b><asp:Label ID="lblTlp" runat="server"></asp:Label><br />
                                        </div>
                                    </div>
                                    <hr>
                                    <div class="row">
                                        <div class="col-xs-6 text-left">
                                            <article>
                                                <strong>Invoice No. :</strong><asp:Label ID="lblNoTransaksi" runat="server"></asp:Label><br>
                                                <b>DATE:</b>
                                                <asp:Label ID="lblDate" runat="server"> </asp:Label><br>
                                                <b>Cashier:</b><asp:Label ID="lblKasir" runat="server"></asp:Label>
                                                <br>
                                            </article>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="panel panel-default">
                                        <div class="panel-body">
                                            <div class="table-responsive">
                                                <asp:DataList ID="ddlList" runat="server" RepeatColumns="1" CellSpacing="6" CellPadding="0" RepeatLayout="Table">
                                                    <ItemTemplate>
                                                        <table class="table-responsive">
                                                            <tr>
                                                                <td>
                                                                    <b>Item Code:</b> <%# Eval("productID") %>                                                                                                                                      
                                                                </td>
                                                                <td></td>

                                                                <td><b>Product Name:</b><%# Eval("productName") %></td>

                                                            </tr>
                                                            <tr>
                                                                <td><b>Qty:</b><%# Eval("Qty") %></td>
                                                                <td></td>
                                                                <td><b>Price:</b><%# Eval("Lblprice") %></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Return Qty : </b><%# Eval(/*ReturnQty*/"IsReturn") %></td>
                                                            </tr>
                                                            <tr>
                                                                <td></td>
                                                                <td></td>
                                                                <td><b>Discount:</b><%# Eval("Discount1")%></td>
                                                            </tr>
                                                        </table>
                                                    </ItemTemplate>
                                                </asp:DataList>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div class="row">
                                <div class="col-md-6 text-left">
                                    <b>Total Price:</b><asp:Label ID="lblTotalHarga" runat="server"></asp:Label><br />
                                    <b>Total Disc:</b><asp:Label ID="lblTotalDisc" runat="server"></asp:Label><br />
                                    <b>Total Payment:</b><asp:Label ID="lblTotalPayment" runat="server"></asp:Label>
                                </div>
                                <div class="col-md-6 text-right">
                                </div>
                            </div>
                            <hr />
                            <div class="row">
                                <div class="col-md-6 text-left">
                                    <b>The price above includes 10% VAT:</b><asp:Label ID="lblTotalTax" runat="server"></asp:Label><br />
                                    <b>Cash/Card: </b>
                                    <asp:Label ID="lblCash_Kartux" runat="server"></asp:Label><br />
                                    <b>Card Number: </b>
                                    <asp:Label ID="lblCardNameNo" runat="server"></asp:Label><br />
                                    <b>Card Payment Additional Fees:</b>
                                    <asp:Label ID="lblBiayaTambahanKartu" runat="server"></asp:Label><br />
                                    <b>Change: </b>
                                    <asp:Label ID="lblKembalian" runat="server"></asp:Label><br />
                                </div>
                                <div class="col-md-6 text-right">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-3">
                                    <b>Types of goods:</b>&nbsp;<asp:Label ID="lblJenisBarang" runat="server"></asp:Label>
                                </div>
                                <div class="col-md-3">
                                    <b>The amount of goods:</b>&nbsp;<asp:Label ID="lblJumlahBarang" runat="server"></asp:Label>
                                </div>
                            </div>
                            <br />
                            <hr />
                            <div class="row">
                                <div class="col-md-12">
                                    <b>THANK YOU FOR YOUR VISIT
                                        <br />
                                        The purchased item can not be restored,
                                        <br />
                                        unless there is an agreement.
                                    </b>
                                </div>
                            </div>
                        </div>
                        <hr />
                    </div>
                    <%-- <input type="button" onclick="printDiv('PrintDiv')" value="Print" />--%>
                </asp:Panel>
            </ContentTemplate>
        </asp:UpdatePanel>

        <!-- Bootstrap core JavaScript -->
        <script src="vendor/jquery/jquery.min.js"></script>
        <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
        <!-- Plugin JavaScript -->
        <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
        <!-- Custom scripts for this template -->
        <script src="js/stylish-portfolio.min.js"></script>
    </form>
</body>
</html>
