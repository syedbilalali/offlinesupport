using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using tes.Data;

namespace POS_Demo1.New_Terminal
{

    public partial class Sample1 : System.Web.UI.Page
    {
        int i2 = 0;
        String Latest_Qty = "";
        GridViewRow gvr_Temp;
        Regex objNotIntPattern = new Regex("[^0-9-]");
        Regex objIntPattern = new Regex("^-[0-9]+$|^[0-9]+$");
        DL_Index DL = new DL_Index();
       // static string PromoProductName = "";
        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                if (!IsPostBack)
                {
                    if (Session["empType"] == null)
                    {
                        Response.Write("<script> alert('you should login first.... ')</script>");
                        Response.Redirect("~/LogInScreen.aspx");
                    }
                    else
                    {
                        Response.ClearHeaders();
                        Response.AddHeader("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");
                        Response.AddHeader("Pragma", "no-cache");
                    }
                }
                if (IsPostBack)
                    return;

                hpClientType.Text = Session["empType"].ToString();
                lblEmp.Text = "Emp ID : " + Session["empID"].ToString();
                lblStore.Text = "Store ID : " + Session["storeID"].ToString();
                empPhoto.ImageUrl = "../SuperAdmin/assets/images/EmpImage/" + Session["empPhoto"].ToString();
                lblCurrentTaxVal.Text = DL.getValueofCurrentTax() + "%";
                DL_Index.flag = 0;
                DL_Index.TempRefund = 0;
                DL_Index.TempTotalPay = 0;
                ViewState["return"] = 0;
                ViewState["OnBillTotal"] = 0;
                ViewState["OnProduct"] = 0;
                txtCustomerID.Attributes.Add("disabled", "disabled");
                btnPay.Attributes.Add("disabled", "disabled");
                btnHold.Attributes.Add("disabled", "disabled");
                Button4.Attributes.Add("disabled", "disabled");
                ddlBankNameCredit.Attributes.Add("disabled", "disabled");
                ddlBankNameDebit.Attributes.Add("disabled", "disabled");
                bool offerImgAllow = DL.IsBillTotalOfferFound(DL.StoreID);
                if (offerImgAllow)
                {
                    imgOnBillTotal.Visible = true;
                }
                else {
                    imgOnBillTotal.Visible = false;
                }
                //Required Field Validator 
                rfvTextBox6.Enabled = false;
                rfvTextBox30.Enabled = false;
                rfvTextBox6.Enabled = false;
                rfvtxtTextBox30.Enabled = false;
                rfvtxtCashAmmount.Enabled = false;
                rfvddlBankNameDebit.Enabled = false;
                rfvddlBankNameCredit.Enabled = false;

                SetInitialRow();
                DL_Index.IsReutrnMode = 0;
                Generate_TransactionId();
                TextBox3.Text = DateTime.Now.ToString("yyyy-MM-dd");
                btnPay.Enabled = true;
                CheckboxbyDisable();
                
            }
            catch (Exception ex)
            {
                MessageError(" Error In Load Page -: " + ex.Message);
            }
        }
        public void CheckboxbyDisable()
        {

            txtCashAmount.ReadOnly = true;
            TextBox24.ReadOnly = true;
            ddlBankNameDebit.Enabled = false;
            ddlBankNameDebit.BackColor = System.Drawing.ColorTranslator.FromHtml("0xEEEEEE");
            TextBox30.ReadOnly = true;
            TextBox26.ReadOnly = true;
            ddlBankNameCredit.Enabled = false;
            ddlBankNameCredit.BackColor = System.Drawing.ColorTranslator.FromHtml("0xEEEEEE");
            TextBox6.ReadOnly = true;
            TextBox28.ReadOnly = true;
            TextBox29.ReadOnly = true;
            txtRefund.ReadOnly = true;
            txtCustomerID.Attributes.Remove("disable");
        }
        protected void txtSearch_TextChanged(object sender, EventArgs e)
        {
            if (!string.IsNullOrEmpty(txtSearch.Text))
            {
                String Product = string.Empty;
                if (txtSearch.Text.Contains('-')){
                    Product = txtSearch.Text.Substring(0, txtSearch.Text.IndexOf('-'));
                } else {
                    Product = txtSearch.Text;
                }
                if (ViewState["return"].ToString() == "1")
                {
                    SetInitialRow();
                    ViewState["return"] = "0";
                    DL_Index.flag = 1;
                }
                DataTable da = null;
                if (!objNotIntPattern.IsMatch(Product) && objIntPattern.IsMatch(Product))
                {
                    DataTable dtViewstate = (DataTable)ViewState["CurrentTable"];
                    da = DL.GetImage(Product, Session["storeID"].ToString());
                    if (da.Rows.Count > 0)
                    {
                        DataRow dr = da.Rows[0];
                        if (int.Parse(dr["Quantity"].ToString()) < 1 && dr["Quantity"] != null)
                        {
                            MessageInfo(" No Stock Available !!! ");
                            txtSearch.Text = "";
                            txtSearch.Focus();
                        }
                        else
                        {
                            setProductInfo(dr);
                            foreach (DataRow dr1 in da.Rows)
                            {
                                if (ViewState["CurrentTable"] != null)
                                {
                                    DataRow[] drData = dtViewstate.Select("Code='" + dr1["ProductID"].ToString() + "'");
                                    if (drData.Length > 0 && (drData[0]["IsFreeLabel"].ToString() != "Free"))
                                    {
                                        drData[0]["Qty"] = Convert.ToDecimal(drData[0]["Qty"]) + Convert.ToDecimal(dr1["Qty"].ToString());
                                        drData[0]["Total"] = Convert.ToDecimal(drData[0]["Qty"]) * Convert.ToDecimal(drData[0]["Selling Price"]);

                                    } else if (drData.Length > 1 && (drData[1]["IsFreeLabel"].ToString() != "Free")) {

                                        drData[1]["Qty"] = Convert.ToDecimal(drData[1]["Qty"]) + Convert.ToDecimal(dr1["Qty"].ToString());
                                        drData[1]["Total"] = Convert.ToDecimal(drData[1]["Qty"]) * Convert.ToDecimal(drData[1]["Selling Price"]);
                                    }
                                    else
                                    {
                                        DataRow drView = dtViewstate.NewRow();
                                        drView["SellsOrderItemID"] = dr1["SellsOrderItemID"].ToString();
                                        drView["Code"] = dr1["ProductID"].ToString();
                                        drView["Item Name"] = dr1["productName"].ToString();
                                        drView["Dim"] = dr1["unitOfMeasurement"].ToString();
                                        drView["TtlQty"] = dr1["Quantity"].ToString();
                                        drView["Qty"] = dr1["Qty"].ToString();
                                        drView["Label Price"] = Math.Round(Convert.ToDecimal(dr1["Price"]), 2);
                                        drView["Discount 2nd"] = "0.00";
                                        drView["Selling Price"] = Math.Round((Convert.ToDecimal(dr1["Price"]) - Convert.ToDecimal(drView["Discount 2nd"])), 2);
                                        drView["Discount 1st"] = 0.00;
                                        drView["Total"] = Convert.ToDecimal(drView["Qty"]) * Convert.ToDecimal(drView["Selling Price"]);
                                        drView["IsReturn"] = dr1["IsReturn"].ToString();
                                        drView["IsDraft"] = dr1["IsDraft"].ToString();
                                        drView["SellsReturnID"] = dr1["SellsReturnID"].ToString();
                                        drView["ReturnQty"] = dr1["ReturnQty"].ToString();
                                        drView["IsQtyTxtOn"] = dr1["IsQtyTxtOn"].ToString();
                                        drView["IsDiscImgOn"] = dr1["IsDiscImgOn"].ToString();
                                        drView["IsFreeLabel"] = "";
                                        dtViewstate.Rows.Add(drView);
                                        dtViewstate.AcceptChanges();
                                        ViewState["CurrentTable"] = dtViewstate;
                                    }
                                }
                            }
                            GridView1.DataSource = ViewState["CurrentTable"];
                            GridView1.DataBind();
                            lblItems.Text = GridView1.Rows.Count.ToString();
                            btnPay.Attributes.Remove("disabled");
                            btnHold.Attributes.Remove("disabled");
                            txtSearch.Text = String.Empty;
                            Fill_Payment();
                        }
                    }
                    else
                    {
                        MessageInfo(" Sorry Product not available. !!! ");
                        txtSearch.Text = "";
                        txtSearch.Focus();
                    }
                }

            }
        }
        public void setProductInfo(DataRow dr)
        {
            //Setting Product Data
            prodImage.ImageUrl = "../SuperAdmin/assets/images/ProductImages/" + dr["image"].ToString();
            prodImage.Visible = true;
            lblProductName.Text = dr["ProductName"].ToString();
            lblDiscount.Text = dr["Scheme"].ToString();
            lblStock.Text = dr["Quantity"].ToString();
            lblUOM.Text = dr["unitOfMeasurement"].ToString();
            lblPrice.Text = dr["Price"].ToString();
            String quantity = dr["Quantity"].ToString();
        }
        [System.Web.Script.Services.ScriptMethod()]
        [System.Web.Services.WebMethod]
        public static List<string> SearchProducts(string prefixText)
        {
            SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["marvil_Connection"].ConnectionString);
            con.Open();
            SqlCommand cmd = new SqlCommand("Custom", con);
            cmd.Parameters.AddWithValue("Action", "WebService1");
            cmd.Parameters.AddWithValue("@SearchText", prefixText);
            cmd.Parameters.AddWithValue("@StoreID", HttpContext.Current.Session["storeID"].ToString());
            cmd.CommandType = CommandType.StoredProcedure;
            List<string> customers = new List<string>();
            using (SqlDataReader sdr = cmd.ExecuteReader())
            {
                if (sdr.HasRows)
                {
                    while (sdr.Read())
                    {
                        customers.Add(sdr["PId"].ToString());
                    }
                }
                else
                {
                    customers.Add(" Sorry No Product Found...");
                }
            }
            con.Close();
            return customers;
        }
        protected void GridView1_RowDataBound(object sender, GridViewRowEventArgs e)
        {
            try
            {
                if (e.Row.RowType == DataControlRowType.DataRow)
                {
                    string IsReturn = GridView1.DataKeys[e.Row.RowIndex].Values[1].ToString();
                    string IsDraft = GridView1.DataKeys[e.Row.RowIndex].Values[2].ToString();
                    string SellsReturnID = GridView1.DataKeys[e.Row.RowIndex].Values[4].ToString();
                    string IsQtyTxtOn = GridView1.DataKeys[e.Row.RowIndex].Values[4].ToString();
                    string IsDiscImgOn = GridView1.DataKeys[e.Row.RowIndex].Values[5].ToString();
                   
                    if (!string.IsNullOrEmpty(IsReturn) && !string.IsNullOrEmpty(IsDraft))
                    {
                        if (IsReturn == "2")
                        {
                            ImageButton imgReturn = (e.Row.FindControl("ImagebtnReturn") as ImageButton);
                            imgReturn.Visible = false;

                            ImageButton imgRemove = (e.Row.FindControl("ImagebtnRemove") as ImageButton);
                            imgRemove.Visible = true;

                            ImageButton imgUndo = (e.Row.FindControl("ImagebtnUndo") as ImageButton);
                            imgUndo.Visible = false;
                        }

                        if (IsReturn == "0")
                        {
                            ImageButton imgReturn = (e.Row.FindControl("ImagebtnReturn") as ImageButton);
                            imgReturn.Visible = false;

                            ImageButton imgRemove = (e.Row.FindControl("ImagebtnRemove") as ImageButton);
                            imgRemove.Visible = false;

                            ImageButton imgUndo = (e.Row.FindControl("ImagebtnUndo") as ImageButton);
                            imgUndo.Visible = true;

                        }

                        if (IsReturn == "1" && SellsReturnID == "1")
                        {
                            ImageButton imgReturn = (e.Row.FindControl("ImagebtnReturn") as ImageButton);
                            imgReturn.Visible = true;

                            ImageButton imgRemove = (e.Row.FindControl("ImagebtnRemove") as ImageButton);
                            imgRemove.Visible = false;

                            ImageButton imgUndo = (e.Row.FindControl("ImagebtnUndo") as ImageButton);
                            imgUndo.Visible = true;
                        }

                        if (IsReturn == "1" && SellsReturnID == "0")
                        {
                            ImageButton imgReturn = (e.Row.FindControl("ImagebtnReturn") as ImageButton);
                            imgReturn.Visible = true;

                            ImageButton imgRemove = (e.Row.FindControl("ImagebtnRemove") as ImageButton);
                            imgRemove.Visible = false;

                            ImageButton imgUndo = (e.Row.FindControl("ImagebtnUndo") as ImageButton);
                            imgUndo.Visible = false;
                        }

                        Label  FLabel = (Label)e.Row.Cells[7].FindControl("lblPromoFree");
                        Label  lblDiscount1 = (Label)e.Row.Cells[7].FindControl("lblDiscount1");
                        string Value3 = FLabel.Text;

                        if (Value3 == "Free")
                        {
                            lblDiscount1.Visible = false;
                            if (IsQtyTxtOn == "0")
                            {
                                TextBox txtQty = (e.Row.FindControl("tb_Qty") as TextBox);
                                txtQty.ReadOnly = false;
                            }
                            if (IsQtyTxtOn == "1")
                            {
                                TextBox txtQty = (e.Row.FindControl("tb_Qty") as TextBox);
                                txtQty.ReadOnly = true;
                            }
                            if (IsDiscImgOn == "0")
                            {
                                ImageButton imgReturn = (e.Row.FindControl("ImagebtnDiscount2") as ImageButton);
                                imgReturn.Visible = true;
                            }
                            if (IsDiscImgOn == "1")
                            {
                                ImageButton imgReturn = (e.Row.FindControl("ImagebtnDiscount2") as ImageButton);
                                imgReturn.Visible = false;
                            }
                        }
                        else {
                            FLabel.Visible = false;
                            lblDiscount1.Visible = true;
                        }
                        if (IsReturn == "3")
                        {
                            ImageButton imgReturn = (e.Row.FindControl("ImagebtnReturn") as ImageButton);
                            imgReturn.Visible = false;
                            ImageButton imgRemove = (e.Row.FindControl("ImagebtnRemove") as ImageButton);
                            imgRemove.Visible = true;
                            ImageButton imgUndo = (e.Row.FindControl("ImagebtnUndo") as ImageButton);
                            imgUndo.Visible = false;

                            btnHold.Attributes.Remove("disabled");
                            btnHold.Attributes.Remove("disabled");
                        }
                       
                        TextBox txt = e.Row.FindControl("tb_Qty") as TextBox;
                        if (txt != null)
                        {
                            txt.Focus();
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                MessageError("Error In Row Databound -:  " + ex.Message);
            }
        }
        // Web Service For Search Vouchers 
        [System.Web.Script.Services.ScriptMethod()]
        [System.Web.Services.WebMethod]
        public static List<string> SearchVouchers(string prefixText)
        {
            List<string> customers = new List<string>();
            SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings[/*Database1*/"marvil_Connection"].ConnectionString);
            con.Open();
            SqlCommand cmd = new SqlCommand("Custom", con);
            cmd.Parameters.AddWithValue("Action", "SearchVouchers");
            cmd.Parameters.AddWithValue("@SearchText", prefixText);
            cmd.Parameters.AddWithValue("@CustomerID", HttpContext.Current.Session["CustomerID"]);
            cmd.CommandType = CommandType.StoredProcedure;
            using (SqlDataReader sdr = cmd.ExecuteReader())
            {
                if (sdr.HasRows)
                {
                    while (sdr.Read())
                    {
                        customers.Add(sdr["giftCardNo"].ToString());
                    }
                }
                else
                {
                    customers.Add("No Data Found..!");
                }
            }
            con.Close();
            return customers;
        }
        //Set Table Head Columns in the GridView 
        public void SetInitialRow()
        {
            try
            {
                DataTable dt = new DataTable();
                DataColumn IDColumn = dt.Columns.Add("ID", typeof(Int32));
                IDColumn.AutoIncrement = true;
                dt.Columns.Add(new DataColumn("SellsOrderItemID", typeof(string)));
                dt.Columns.Add(new DataColumn("Code", typeof(string)));
                dt.Columns.Add(new DataColumn("Item Name", typeof(string)));
                dt.Columns.Add(new DataColumn("Dim", typeof(string)));
                dt.Columns.Add(new DataColumn("Qty", typeof(string)));
                dt.Columns.Add(new DataColumn("TtlQty", typeof(string)));
                dt.Columns.Add(new DataColumn("Label Price", typeof(string)));
                dt.Columns.Add(new DataColumn("Discount 1st", typeof(string)));
                dt.Columns.Add(new DataColumn("Discount 2nd", typeof(string)));
                dt.Columns.Add(new DataColumn("Selling Price", typeof(string)));
                dt.Columns.Add(new DataColumn("Total", typeof(string)));
                dt.Columns.Add(new DataColumn("IsReturn", typeof(string)));
                dt.Columns.Add(new DataColumn("IsDraft", typeof(string)));
                dt.Columns.Add(new DataColumn("SellsReturnID", typeof(string)));
                dt.Columns.Add(new DataColumn("ReturnQty", typeof(string)));
                dt.Columns.Add(new DataColumn("IsQtyTxtOn", typeof(string)));
                dt.Columns.Add(new DataColumn("IsDiscImgOn", typeof(string)));
                dt.Columns.Add(new DataColumn("IsFreeLabel", typeof(string)));
                dt.AcceptChanges();
                ViewState["CurrentTable"] = dt;
                GridView1.DataSource = ViewState["CurrentTable"];
                GridView1.DataBind();
            }
            catch (Exception ex)
            {
                MessageError(ex.ToString());
            }
        }
        //Generate Transaction ID For Invoice
        public void Generate_TransactionId()
        {
            try
            {
                String TransactionId = DL.Generate_TransactionId();
                if ((TransactionId == String.Empty) && (TransactionId == ""))
                {
                    TransactionId = "0";
                }
                TransactionId = (Convert.ToInt32(TransactionId) + 1).ToString();
                check_TransactionId(TransactionId);
            }
            catch (Exception ex)
            {
                MessageError("Error in Generate Transaction -: " + ex.Message);
            }
        }
        //Check New Transaction If It Exist 
        public void check_TransactionId(String TransactionId)
        {
            try
            {
                int check = Convert.ToInt32(DL.check_TransactionId(TransactionId));
                if (check == 0)
                {
                    txtTransactionIDShow.Text = TransactionId;
                    return;
                }
                if (check > 0)
                {
                    TransactionId = (Convert.ToInt32(TransactionId) + 1).ToString();
                    check_TransactionId(TransactionId);
                }
            }
            catch (Exception ex)
            {
                MessageError("Error In the Transaction " + ex.ToString());
            }
        }
        decimal totalTax = 0;
        //   decimal DiscountPrice;
        decimal totalTax1 = 0;
        decimal lastTotal = 0;
        decimal lastdiscount = 0;
        public void Fill_Payment()
        {
            try
            {

                lastTotal = decimal.Parse(lblTotalAmount.Text);
                lastdiscount = decimal.Parse(tb_Discount.Text);
                // Value Reset....
                txtTotal.Text = "0";
                lblTotalAmount.Text = "0.00";
                txtTotalPay.Text = "0.00";
                HfTotal.Value = "0";
                tb_Discount.Text = "0.00";
                TextBox24.Text = (string.IsNullOrEmpty(TextBox24.Text) ? "0" : TextBox24.Text);
                txtCashAmount.Text = (string.IsNullOrEmpty(txtCashAmount.Text) ? "0" : txtCashAmount.Text);
                TextBox26.Text = (string.IsNullOrEmpty(TextBox26.Text) ? "0" : TextBox26.Text);
                TextBox29.Text = (string.IsNullOrEmpty(TextBox29.Text) ? "0" : TextBox29.Text);
                txtRefund.Text = (string.IsNullOrEmpty(TextBox29.Text) ? "0" : TextBox29.Text);

                //Get The Value From Tables(Cart)  and Calculate Total....
                foreach (GridViewRow gvr in GridView1.Rows)
                {

                    string LabelPrice = GridView1.Rows[gvr.RowIndex].Cells[5].Text;
                    string lblProdID = GridView1.Rows[gvr.RowIndex].Cells[1].Text;
                    Label lblDiscountPrice = (Label)GridView1.Rows[gvr.RowIndex].Cells[8].FindControl("lblSellingPrice");
                    string discountprice = lblDiscountPrice.Text;
                    Label Discount1 = (Label)gvr.Cells[6].FindControl("lblDiscount1");
                    Label Discount2 = (Label)gvr.Cells[7].FindControl("lblDiscount2");
                    TextBox txtQty = (TextBox)gvr.FindControl("tb_Qty");
                    Label lblTotal = (Label)gvr.FindControl("lblTotal");


                    //Calculate total of Product from Price and Qunatity
                    //Tax Calculation for Per Product.
                    totalTax =  DL.calculateTax(lblProdID, LabelPrice, discountprice, txtQty.Text, true);
                    totalTax1 += totalTax;
                    //Set Tax Value
                    lblTotalTax1.Text = String.Format("{0:0.##}", totalTax1.ToString("F"));
                    //Set Total with Price and Quant 
                    txtTotal.Text = String.Format("{0:0.##}", (Convert.ToDecimal(txtTotal.Text) + Convert.ToDecimal(LabelPrice) * Convert.ToInt32(txtQty.Text)).ToString("F"));
                    //Set Label Total with Tax 
                    lblTotalAmount.Text = String.Format("{0:0.##}", (Convert.ToDecimal(lblTotalAmount.Text) + Convert.ToDecimal(lblTotal.Text) + totalTax).ToString("F"));
                    //Set Discount Text Box
                    tb_Discount.Text = String.Format("{0:0.##}", (Convert.ToDecimal(tb_Discount.Text) + Convert.ToDecimal(Discount1.Text) + (Convert.ToDecimal(Discount2.Text) * Convert.ToInt32(txtQty.Text))).ToString("F"));
                    //Set Discount  to Label
                    Label57.Text = tb_Discount.Text;
                    //Set Text Total Ammount 
                    txtTotalPay.Text = String.Format("{0:0.##}", (Convert.ToDecimal(txtTotalPay.Text) + Convert.ToDecimal(lblTotal.Text) + Convert.ToDecimal(totalTax)).ToString("F")).ToString();
                    //Set Hidden Field Value 
                    HfTotal.Value = Convert.ToString(Convert.ToDecimal(HfTotal.Value) + Convert.ToDecimal(lblTotal.Text));

                    if (DL_Index.flag == 1)
                    {
                        if (Convert.ToDouble(HfTotal.Value) > Convert.ToDouble(hfvalue.Value))
                        {
                            txtTotalPay.Text = (Convert.ToDouble(HfTotal.Value) - Convert.ToDouble(hfvalue.Value)).ToString();
                            txtRefund.Text = "0";
                        }
                        else if (Convert.ToDouble(hfvalue.Value) > Convert.ToDouble(HfTotal.Value))
                        {
                            txtRefund.Text = (Convert.ToDouble(hfvalue.Value) - Convert.ToDouble(HfTotal.Value)).ToString();
                        }
                        else if (Convert.ToDouble(HfTotal.Value) == Convert.ToDouble(hfvalue.Value))
                        {
                            txtTotalPay.Text = "0";
                            txtRefund.Text = "0";
                            DL_Index.TempRefund = 1;
                            DL_Index.TempTotalPay = 1;
                        }
                        else if (DL_Index.TempRefund == 1 && DL_Index.TempTotalPay == 1)
                        {
                            txtTotalPay.Text = (Convert.ToDouble(HfTotal.Value) - Convert.ToDouble(hfvalue.Value)).ToString();
                            txtRefund.Text = "0";
                            DL_Index.TempRefund = 0;
                            DL_Index.TempTotalPay = 0;
                        }
                    }
                }
                //Check For the Any Discount in the Temp.
               
                // End For Loop
                //Set Value to Cash to lblCash
                Label27.Text = String.Format("{0:0.##}", txtCashAmount.Text);
                //Calculate for the Refund.
                if (Convert.ToDecimal(txtCashAmount.Text) > Convert.ToDecimal(txtTotalPay.Text))  //Cash Greater than Total Payment than Calculate Refund & Display
                {
                    txtRefund.Text = (Math.Abs(Convert.ToDecimal(txtCashAmount.Text)) - (Convert.ToDecimal(txtTotalPay.Text))).ToString();
                }
                //For Credit Card
                if (Chk_Credit.Checked)
                {
                    //Set Credit Value from 
                    Label31.Text = String.Format("{0:0.##}", TextBox26.Text);
                    Label29.Text = String.Format("{0:0.##}", (Convert.ToDouble(TextBox26.Text) - (Convert.ToDouble(TextBox26.Text) * 100 / 102)).ToString("F"));
                }
                else
                {
                    Label31.Text = "0.00";
                    Label29.Text = "0.00";
                }

                //Debit Card
                if(Chk_Debit.Checked)
                {
                    //SET Debit Value 
                    Label28.Text = String.Format("{0:0.##}", TextBox24.Text);//Debit card Amount
                    Label29.Text = String.Format("{0:0.##}", (Convert.ToDouble(TextBox24.Text) - (Convert.ToDouble(TextBox24.Text) * 100 / 102)).ToString("F"));
                }
                else
                {
                    Label28.Text = "0.00";
                }

                //Voucher
                Label30.Text = String.Format("{0:0.##}", TextBox29.Text);
                if (Convert.ToDecimal(TextBox29.Text) >= Convert.ToDecimal(txtTotalPay.Text))
                {
                    lblTotalPaymemt.Text = String.Format("{0:0.##}", TextBox29.Text);
                }
                else
                {
                    string value = (((Convert.ToDecimal(txtCashAmount.Text)) + (Convert.ToDecimal(TextBox26.Text)) - (Convert.ToDecimal(TextBox29.Text)) + (Math.Abs((Convert.ToDecimal(Label28.Text)))))).ToString();
                    lblTotalPaymemt.Text = String.Format("{0:0.##}", value);
                }
                //Setting of the OnBillTotal
                //DL.TransactionId = txtTransactionIDShow.Text;
                if (ViewState["OnBillTotal"] != null && ViewState["OnBillTotal"].ToString() == "1")
                {
                   // MessageInfo("On Bill Applied");
                    lblTotalAmount.Text = lastTotal.ToString();
                    tb_Discount.Text = lastdiscount.ToString();
                    txtTotalPay.Text = lastTotal.ToString();
                    //decimal discount2 = decimal.Parse(ViewState["AppliedDiscount"].ToString());
                    //decimal lblTotalAmmount = decimal.Parse(lblTotalAmount.Text);
                    //decimal discountPrice = ((lblTotalAmmount * discount2) / 100);
                    //decimal actualPrice = lblTotalAmmount - discountPrice;
                    //if (discount2 > 0)
                    //{
                    //    discountPrice = ((actualPrice * discount2) / 100);
                    //    actualPrice = actualPrice - discountPrice;
                    //}
                    //string finalPrice = actualPrice.ToString("F");
                    //txtTotalPay.Text = String.Format("{0:0.##}", finalPrice);
                    //tb_Discount.Text = Label57.Text = String.Format("{0:0.##}", (discountPrice).ToString("F"));
                    //lblTotalAmount.Text = String.Format("{0:0.##}", finalPrice);

                }
            }
            catch (Exception ex)
            {
                MessageError(" Something went in Fill Payments " + ex.ToString());
            }
        }
        protected void gvPromotionData_Display()
        {
            DL.OrderId = txtTransactionIDShow.Text;
            DataTable da = DL.Get_Promotion_Log();
            if (da.Rows.Count > 0)
            {   
                for (int i = 0; i < da.Rows.Count; i++)
                {
                    string PromotionId1 = da.Rows[i]["PromotionId"].ToString();
                    for (int j = 0; j < gvPromotionData.Rows.Count; j++)
                    {
                        Button btn_SelectPromo = (Button)gvPromotionData.Rows[j].FindControl("btn_SelectPromo");
                        Button btn_CancelPromo = (Button)gvPromotionData.Rows[j].FindControl("btn_CancelPromo");
                        string PromotionId = gvPromotionData.DataKeys[j].Values[2].ToString();
                        string Buy = gvPromotionData.DataKeys[j].Values[0].ToString();

                        if (PromotionId == PromotionId1)
                        {
                            btn_SelectPromo.Text = "Added";
                            btn_SelectPromo.Enabled = false;
                            btn_SelectPromo.BackColor = System.Drawing.ColorTranslator.FromHtml("#a3a375");
                            btn_CancelPromo.Visible = true;
                            btn_CancelPromo.BackColor = System.Drawing.ColorTranslator.FromHtml("#ff0000");
                        }
                        else
                        {
                            btn_SelectPromo.Text = "Apply Promo";
                            btn_SelectPromo.Enabled = true;
                            btn_SelectPromo.BackColor = System.Drawing.ColorTranslator.FromHtml("#ff0000");
                            btn_CancelPromo.Visible = false;
                            btn_CancelPromo.BackColor = System.Drawing.ColorTranslator.FromHtml("#a3a375");

                        }
                    }
                }
            }
            else
            {
                for (int j = 0; j < gvPromotionData.Rows.Count; j++)
                {
                    Button btn_SelectPromo = (Button)gvPromotionData.Rows[j].FindControl("btn_SelectPromo");
                    Button btn_CancelPromo = (Button)gvPromotionData.Rows[j].FindControl("btn_CancelPromo");
                    string Buy = gvPromotionData.DataKeys[j].Values[10].ToString();
                    string OnQty = gvPromotionData.DataKeys[j].Values[0].ToString();
                    if (Latest_Qty == Buy || Latest_Qty == OnQty)
                    {
                        btn_SelectPromo.Enabled = true;
                        btn_SelectPromo.BackColor = System.Drawing.ColorTranslator.FromHtml("#ff0000");
                        btn_CancelPromo.Visible = false;
                        btn_CancelPromo.BackColor = System.Drawing.ColorTranslator.FromHtml("#a3a375");
                    }
                    else
                    {
                        btn_SelectPromo.BackColor = System.Drawing.ColorTranslator.FromHtml("#a3a375");
                    }
                }
            }
        }
        protected void btnPay_Click(object sender, EventArgs e)
        {
            decimal Total = 0;
            decimal totaltax = 0;
            string Customer = txtCustomerID.Text;
            try
            {
                if ((ddlCSV.SelectedIndex > 0) || (ddlCSV.SelectedIndex == 0))
                {
                    if ((!string.IsNullOrEmpty(txtCustomerID.Text)) || (ddlCSV.SelectedIndex == 0))
                    {
                        if (Convert.ToDecimal(lblTotalPaymemt.Text) >= Convert.ToDecimal(txtTotalPay.Text))
                        {
                            DL.SellsOrderId = txtTransactionIDShow.Text;
                            if (DL_Index.flag != 1)
                            {
                                i2 = DL.Delete_Old_Transaction();
                                if (i2 == 2)
                                {
                                    txtTransactionID.Text = String.Empty;
                                }
                            }
                            decimal Lbl_Price = 0;
                            //Promotion Log Insert of Bill
                            if (Convert.ToInt32(ViewState["BillPromo"]) == 1)
                            {
                                Insert_Promotion_Log("0", Convert.ToString(ViewState["BillPromoID"]), "0", "0", "0");
                            }
                            if (i2 != 2)
                            {
                                Generate_TransactionId();
                            }
                            foreach (GridViewRow gvr in GridView1.Rows)
                            {
                                string ItemName = GridView1.Rows[gvr.RowIndex].Cells[2].Text;
                                string Dim = GridView1.Rows[gvr.RowIndex].Cells[3].Text;
                                TextBox tb_Qty = (TextBox)GridView1.Rows[gvr.RowIndex].FindControl("tb_Qty");
                                string LabelPrice = GridView1.Rows[gvr.RowIndex].Cells[5].Text;
                                Label Discount1 = (Label)GridView1.Rows[gvr.RowIndex].Cells[6].FindControl("lblDiscount1");
                                Label Discount2 = (Label)GridView1.Rows[gvr.RowIndex].Cells[7].FindControl("lblDiscount2");
                                Label lblDiscountPrice = (Label)GridView1.Rows[gvr.RowIndex].Cells[8].FindControl("lblSellingPrice");
                                string SellingPrice = lblDiscountPrice.Text;
                                Label lb_Total = (Label)GridView1.Rows[gvr.RowIndex].FindControl("lblTotal");
                                DL.SellsOrderId = txtTransactionIDShow.Text;
                                DL.Dim = Dim;
                                DL.Qty = tb_Qty.Text;
                                DL.Price = LabelPrice;
                                DL.ProductName = ItemName;
                                DL.ProductId = DL.Find_ProductId();
                                //  DL.ID = DL.GetSellsOrderItemsId();

                                //Sales Tax -: Calculation....
                                totaltax += DL.calculateTax(DL.ProductId, DL.Price, SellingPrice, DL.Qty, true);
                                DL.Discount1 = Discount1.Text;
                                DL.Discount2 = (Discount2.Text == "" ? "0" : Discount2.Text);
                                DL.SellingPrice = SellingPrice;
                                DL.TotalPrice = lb_Total.Text;
                                DL.Remark = "REMARK";
                                DL.PromoRemark = "PROMO REMARK";
                                DL.AddedBy = Session["empID"].ToString();
                                DL.StoreID = Session["storeID"].ToString();
                                Total = Convert.ToDecimal(lb_Total.Text) + Total;
                                Lbl_Price = Lbl_Price + Convert.ToDecimal(LabelPrice) * Convert.ToDecimal(tb_Qty.Text);
                                txtTotal.Text = Lbl_Price.ToString();
                                lblTotalAmount.Text = Lbl_Price.ToString();
                                txtTotalPay.Text = Total.ToString();
                                int r = 0;
                                if (DL_Index.flag == 1)
                                {
                                    DL.CustIdReturn = txtTransactionID.Text;
                                    //FOR UPDATING THE SELLS ORDER ITEM BUT STORE ID NOT FOUND.
                                    r = DL.UpdateSellsOrderItems();
                                }
                                else
                                {
                                    // INSERT NEW Sell Order Invoice 
                                    r = DL.Insert_SellsOrderItems();
                                }
                            }
                            DL.SellsOrderId = txtTransactionIDShow.Text;
                            DL.CustomerId = txtCustomerID.Text;
                            string cust = txtCustomerID.Text;
                          //  DL.Total = Total.ToString();
                            DL.Total = lblTotalAmount.Text;
                            DL.Tax = totaltax.ToString();//DL.calculateTax(DL.ProductId , DL.Price , DL.TotalPrice , DL.Qty , true);
                            DL.VoucherDiscount = "0";
                            DL.TotalDiscount = tb_Discount.Text; // Label57.Text;//(discount1 + discount2).ToString();//String.Format("{0:0.##}", (discount1 + discount2));
                            DL.PaymentModeCharge = "0";
                            DL.TotalPay = (Convert.ToDecimal(txtTotalPay.Text) + Convert.ToDecimal(totaltax)).ToString();
                            DL.Remark = "REMARK";
                            DL.AddedBy = Session["empID"].ToString();
                            DL.CustomerTransaction = txtTransactionIDShow.Text;
                            DL.IsDraft = "1";
                            DL.Status = "1";
                            DL.StoreID = Session["storeID"].ToString();
                            DL.TerminalID = Session["PosId"].ToString();
                            int result = 0;
                            if (DL_Index.flag == 1)
                            {
                                if (txtTotalPay.Text != "0")
                                {
                                    DL.CustIdReturn = txtTransactionID.Text;
                                    result = DL.UpdateSellsOrder();
                                }
                            }
                            else
                            {
                                result = DL.Insert_SellsOrder();
                            }
                            InsertPaymentTransaction(txtTransactionIDShow.Text.Trim());
                            PrintInvoice();
                            // For Chechking All The Details of Purchasing Done.
                            if (result == 1)
                            {
                                txtCashAmount.Focus();
                                Button4.Attributes.Remove("disabled");
                                btnPay.Attributes.Add("disabled", "disabled");
                                btnHold.Attributes.Add("disabled", "disabled");
                                Chk_Cash.Checked = false;
                                Print();
                                i2 = 0;
                                Clear_All_Payment_Fields();
                                MessageSuccess("Successfully Paid");
                            }
                        }
                        else
                        {
                            MessageError("Please Pay The Amount");
                        }
                    }
                    else
                    {
                        MessageError("Type Customer Id");
                    }
                }
                DL_Index.flag = 0;
            }
            catch (Exception ex)
            {
                MessageError(" Something went wrong.... " + ex.ToString());
            }
        }
        private void InsertPaymentTransaction(string SellsOrderID)
        {
            // FOR CASH
            if (Chk_Cash.Checked)
            {
                DL.PayAmount = txtCashAmount.Text.Trim();
                DL.SellsOrderId = SellsOrderID;
                DL.PaymentMode = "CASH";
                DL.AddedBy = Convert.ToString(Session["empID"]);
                int a = DL.InsertPaymentTransaction();
            }
            // FOR DEBIT
            if (Chk_Debit.Checked)
            {
                DL.PayAmount = TextBox24.Text.Trim();
                DL.SellsOrderId = SellsOrderID;
                DL.BankName = ddlBankNameDebit.SelectedValue.ToString();
                DL.CardNo = TextBox30.Text.Trim();
                DL.PaymentMode = "DEBIT";
                DL.GatewayTransaction = 2;
                DL.InsertPaymentTransaction();

            }
            // FOR CREDIT
            if (Chk_Credit.Checked)
            {
                DL.PayAmount = TextBox26.Text.Trim();
                DL.SellsOrderId = SellsOrderID;
                DL.BankName = ddlBankNameCredit.Text.Trim();
                DL.CardNo = TextBox6.Text.Trim();
                DL.PaymentMode = "CREDIT";
                DL.GatewayTransaction = 2;
                DL.InsertPaymentTransaction();
            }
            // FOR VOUCHER
            if (CheckBox4.Checked)
            {
                DL.Voucher = TextBox28.Text.Trim();
                DL.SellsOrderId = SellsOrderID;
                DL.PayAmount = TextBox29.Text.Trim();
                DL.PaymentMode = "VOUCHER";
                DL.InsertPaymentTransaction();
            }
        }
        public void Retrieve_Hold_Counts()
        {
            try
            {
                String result = DL.Retrieve_Hold_Counts();
                btn_Retrieve.Text = "Retrive Hold ( " + result + " )";
            }
            catch (Exception ex) {
                MessageError("Error in the Retrive Hold Counts...." + ex);
            }
        }
        public void Clear_All_Payment_Fields()
        {
            //FOR CLEARING THE DETAILS OF POS TERMINAL
            try
            {
                lblItems.Text = "0";
                txtTotal.Text = String.Empty;
                txtTotalPay.Text = String.Empty;
                txtRefund.Text = String.Empty;
                txtCashAmount.Text = String.Empty;
                TextBox24.Text = String.Empty;
                ddlBankNameDebit.SelectedIndex = 0;
                TextBox26.Text = String.Empty;
                ddlBankNameCredit.SelectedIndex = 0;
                TextBox28.Text = String.Empty;
                TextBox29.Text = String.Empty;
                TextBox30.Text = String.Empty;
                TextBox6.Text = String.Empty;

                Label57.Text = "0.00";
                Label30.Text = "0.00";
                Label27.Text = "0.00";
                lblTotalPaymemt.Text = "0.00";
                Label28.Text = "0.00";
                Label29.Text = "0.00";
                Label31.Text = "0.00";
                lblTotalTax1.Text = "0.00";

                Chk_Cash.Checked = false;
                Chk_Credit.Checked = false;
                Chk_Debit.Checked = false;
                CheckBox4.Checked = false;
                txtCustomerID.Attributes.Remove("disable");
                tb_Discount.Text = "0";

                lblProductName.Text = "";
                lblPrice.Text = "";
                lblStock.Text = "";
                lblDiscount.Text = "";
                lblUOM.Text = "";
                prodImage.ImageUrl = "~/New_Terminal/img/default_product.jpg";
                lblProductName.Text = "";
                lblTotalAmount.Text = "0.00";

                ddlBankNameCredit.Attributes.Add("disabled", "disabled");
                ddlBankNameDebit.Attributes.Add("disabled", "disabled");
                CheckboxbyDisable();

                //Required Field Validator 
                rfvTextBox6.Enabled = false;
                rfvTextBox30.Enabled = false;
                rfvTextBox6.Enabled = false;
                rfvtxtTextBox30.Enabled = false;
                rfvtxtCashAmmount.Enabled = false;
                rfvddlBankNameDebit.Enabled = false;
                rfvddlBankNameCredit.Enabled = false;
            }
            catch (Exception ex)
            {
                MessageError(" Error in the Clearing the Fields"  + ex.ToString());
            }
        }
        protected void btnHold_Click(object sender, EventArgs e)
        {
            try
            {
                if (GridView1.Rows.Count == 0)
                {
                    MessageInfo("Sorry, No Item Found !!!");
                    return;
                }
                if ((ddlCSV.SelectedIndex > 0) || (ddlCSV.SelectedIndex == 0))
                {
                    if ((!string.IsNullOrEmpty(txtCustomerID.Text)) || (ddlCSV.SelectedIndex == 0))
                    {
                        if (!string.IsNullOrEmpty(txtTransactionIDShow.Text.Trim()))
                        {
                            DL.SellsOrderId = txtTransactionIDShow.Text;
                            i2 = DL.Delete_Old_Transaction();
                            decimal Total = 0;
                            decimal Lbl_Price = 0;
                            foreach (GridViewRow gvr in GridView1.Rows)
                            {
                                string ItemName = GridView1.Rows[gvr.RowIndex].Cells[2].Text;
                                string Dim = GridView1.Rows[gvr.RowIndex].Cells[3].Text;
                                TextBox tb_Qty = (TextBox)GridView1.Rows[gvr.RowIndex].FindControl("tb_Qty");
                                string LabelPrice = GridView1.Rows[gvr.RowIndex].Cells[5].Text;
                                Label Discount1 = (Label)GridView1.Rows[gvr.RowIndex].Cells[6].FindControl("lblDiscount1");
                                Label Discount2 = (Label)GridView1.Rows[gvr.RowIndex].Cells[7].FindControl("lblDiscount2");
                                Label lblDiscountPrice = (Label)GridView1.Rows[gvr.RowIndex].Cells[8].FindControl("lblSellingPrice");
                                Label lblFreePromo = (Label)GridView1.Rows[gvr.RowIndex].Cells[7].FindControl("lblPromoFree");
                                string SellingPrice = lblDiscountPrice.Text;
                                Label lb_Total = (Label)GridView1.Rows[gvr.RowIndex].FindControl("lblTotal");
                                DL.SellsOrderId = txtTransactionIDShow.Text;
                                DL.Dim = Dim;
                                DL.Qty = tb_Qty.Text;
                                DL.Price = LabelPrice;
                                DL.Discount1 = Discount1.Text;
                                DL.Discount2 = Discount2.Text;
                               
                                DL.ProductName = ItemName;
                                DL.ProductId = DL.Find_ProductId();
                                DL.ID = DL.GetSellsOrderItemsId();
                                DL.SellingPrice = SellingPrice;
                                DL.TotalPrice = lb_Total.Text;
                                if (lblFreePromo.Text == "Free")
                                {
                                    DL.PromoRemark = "Free";
                                    ItemName = "";
                                }
                                else
                                {
                                    DL.PromoRemark = "No Promo";
                                    DL.ProductName = ItemName;
                                }
                                DL.Remark = "REMARK";
                                DL.AddedBy = Session["empID"].ToString();
                                Total = Convert.ToDecimal(lb_Total.Text) + Total;
                                Lbl_Price = Convert.ToDecimal(LabelPrice) * Convert.ToDecimal(tb_Qty.Text) + Lbl_Price;
                                txtTotal.Text = Lbl_Price.ToString();
                                lblTotalAmount.Text = Lbl_Price.ToString();
                                txtTotalPay.Text = Total.ToString();
                                DL.UpdatedBy = Session["empID"].ToString();
                                DL.UpdatedOn = Convert.ToString(System.DateTime.Now);
                                int r = DL.Insert_SellsOrderItems();
                            }
                            DL.SellsOrderId = txtTransactionIDShow.Text;
                            DL.CustomerId = txtCustomerID.Text;
                            DL.Total = lblTotalAmount.Text;
                            DL.Tax = lblTotalTax1.Text;
                            DL.TotalDiscount = tb_Discount.Text;
                            DL.VoucherDiscount = TextBox29.Text;
                            DL.PaymentModeCharge = "0";
                            DL.TotalPay = Lbl_Price.ToString();
                            DL.Remark = "REMARK";
                            DL.AddedBy = Session["empID"].ToString();
                            DL.CustomerTransaction = txtTransactionIDShow.Text;
                            DL.IsDraft = "0";
                            DL.Status = "1";
                            DL.StoreID = Session["storeID"].ToString();
                            DL.TerminalID = Session["PosId"].ToString();
                            int result = DL.Insert_SellsOrder();
                            if (result == 1)
                            {
                                btnPay.Attributes.Add("disabled", "disabled");
                                btnHold.Attributes.Add("disabled", "disabled");
                                Clear_GridView1();
                                Generate_TransactionId();
                                Clear_All_Payment_Fields();
                                i2 = 0;
                                MessageSuccess("Successfully Order On Hold !!!");
                            }
                            if (ViewState["OnBillTotal"] != null && ViewState["OnBillTotal"].ToString() == "1")
                            {
                               // MessageInfo("On Bill Applied");
                                ViewState["OnBillTotal"] = 0;
                            }
                        }
                    }
                    else
                    {
                        MessageError("Please Enter CustomerID");
                    }
                }
            }
            catch (Exception ex)
            {
                MessageError(" Error in the Button Hold " + ex.ToString());
            }
        }
        //Adding Qty Text Chnage 
        protected void tb_Qty_TextChanged(object sender, EventArgs e)
        {
            try
            {
                TextBox txt = (TextBox)sender;
                GridViewRow gvRow = (GridViewRow)txt.Parent.Parent;
                string dataID = GridView1.DataKeys[gvRow.RowIndex].Values[0].ToString();
                TextBox txtQty = (TextBox)gvRow.FindControl("tb_Qty");
                TextBox txtRtQty = (TextBox)gvRow.FindControl("tb_Qty1");
                string LabelPrice = GridView1.Rows[gvRow.RowIndex].Cells[5].Text;
                string ProductID = GridView1.Rows[gvRow.RowIndex].Cells[1].Text;
                string currentRtrn = txtRtQty.Text.Equals("") ? "0" : txtRtQty.Text;
                string currentStrQty = DL.FetchProductQty(ProductID, Convert.ToString(Session["storeID"]));
                int currentReturn = int.Parse(currentRtrn);
                int currentStoreQty = int.Parse(currentStrQty);
                // string StockQty = currentStrQty;//
                string StockQty = (currentReturn + currentStoreQty).ToString();
                if (int.Parse(txtQty.Text) == 0 && txtQty.Text == "")
                {
                    MessageError("Entered Quantity Should be greater then zero...!");
                    txtQty.Text = "1";
                }
                if (Convert.ToDecimal(txtQty.Text.Trim()) <= Convert.ToDecimal(StockQty))
                {
                    if (ViewState["CurrentTable"] != null)
                    {
                        DataTable dt = ViewState["CurrentTable"] as DataTable;
                        DataRow dr = dt.Select("ID='" + dataID + "'").FirstOrDefault();
                        dr["Qty"] = (txtQty.Text.Trim());
                        dr["Total"] = Convert.ToString(Convert.ToDecimal(txtQty.Text.Trim()) * Convert.ToDecimal(LabelPrice));
                        dt.AcceptChanges();
                        GridView1.DataSource = ViewState["CurrentTable"];
                        GridView1.DataBind();
                        if (DL_Index.IsReutrnMode == 1)
                        {
                            foreach (GridViewRow gvr in GridView1.Rows)
                            {
                                TextBox txtPurchaseQty = GridView1.Rows[gvr.RowIndex].FindControl("tb_Qty1") as TextBox;
                                txtPurchaseQty.Visible = true;
                            }
                        }
                    }
                    Fill_Payment();
                }
                else
                {
                    MessageError("Entered Quantity Should be less than stock Quantity..!");
                    txtQty.Text = "1";
                }
            }
            catch (Exception ex)
            {
                MessageError("Quantity Change Error  " + ex.ToString());
            }
        }
        //Clear GridView After Insert
        public void Clear_GridView1()
        {
            DataTable ds = new DataTable();
            ds = null;
            GridView1.DataSource = ds;
            GridView1.DataBind();
            ViewState["CurrentTable"] = ds;
            ddlCSV.SelectedIndex = 0;
            txtCustomerID.Text = String.Empty;
            SetInitialRow();

        }
        //GridView Action Button : Remove Item 
        protected void ImagebtnRemove_Click(object sender, ImageClickEventArgs e)
        {
            try
            {

                ImageButton btn = (ImageButton)sender;
                GridViewRow row = (GridViewRow)btn.NamingContainer;
                Label TxtTotal1 = (Label)row.FindControl("lblTotal");
                string ID = GridView1.DataKeys[row.RowIndex].Values[0].ToString();
                string ProductID = GridView1.Rows[row.RowIndex].Cells[1].Text;
                DataTable dt = (DataTable)ViewState["CurrentTable"];
                DataRow[] dr = dt.Select("ID='" + ID + "'");
                if (DL_Index.flag == 1)
                {
                    if (txtRefund.Text != "0")
                    {
                        txtRefund.Text = (Convert.ToDouble(txtTotalPay.Text) + Convert.ToDouble(txtRefund.Text)).ToString();
                    }
                    else
                    {
                        txtRefund.Text = (Convert.ToDouble(TxtTotal1.Text) - Convert.ToDouble(txtTotalPay.Text)).ToString();
                    }
                }
                dr[0].Delete();
                dt.AcceptChanges();
                GridView1.DataSource = ViewState["CurrentTable"];
                GridView1.DataBind();
                Fill_Payment();
                if (GridView1.Rows.Count == 0)
                {

                    Response.Redirect("Sample1.aspx");
                }
                //For Promotion Per Product Deletion
                //    DL.OrderId = txtTransactionIDShow.Text;
                DL.Delete_Promotion_Log(DL.PromotionId, DL.OrderId);
                lblItems.Text = GridView1.Rows.Count.ToString();
                MessageSuccess("Item Removed Successfully !!!");
            }
            catch (Exception ex)
            {
                MessageInfo("Error in Deleting Element...." + ex.Message);
            }
        }
        protected void ImagebtnUndo_Click(object sender, ImageClickEventArgs e)
        {
            try
            {
                int result = -1;
                ImageButton ib = (ImageButton)sender;
                GridViewRow gvr = (GridViewRow)ib.NamingContainer;
                string SellsOrderItemID = GridView1.DataKeys[gvr.RowIndex].Values[3].ToString();
                string ProductID = GridView1.Rows[gvr.RowIndex].Cells[1].Text;
                string ProductName = GridView1.Rows[gvr.RowIndex].Cells[2].Text;
                TextBox lblQty = (TextBox)gvr.FindControl("tb_Qty");
                string SellingPrice = GridView1.Rows[gvr.RowIndex].Cells[8].Text;
                Label lblTotal = (Label)gvr.FindControl("lblTotal");
                //txtRefund.Text = "0";
                txtRefund.Text = (Convert.ToDecimal(txtRefund.Text) - Convert.ToDecimal(lblTotal.Text)).ToString();
                hfvalue.Value = txtRefund.Text;
                DL.ID = SellsOrderItemID;
                DL.ReturnPrice = Convert.ToDecimal(lblTotal.Text.Trim());
                DL.ProductId = ProductID;
                DL.Qty = lblQty.Text.Trim();
                DL.AddedBy = Session["empID"].ToString();
                result = DL.UndoQtyOrderItem();
                ReturnData();
                if (result > 0)
                {
                    ViewState["return"] = "1";
                    UpdateStockDetail(Convert.ToInt32(ProductID), Convert.ToInt32(lblQty.Text), 0);
                    MessageInfo("Return has been cancelled.");
                }
                else
                {
                    MessageError("Entered undo Quantity Should be less than the return quantity.");
                }
            }
            catch (Exception ex)
            {
                MessageInfo("Error In Return Undo Section -: " + ex);
            }
        }
        protected void ddlCSV_SelectedIndexChanged(object sender, EventArgs e)
        {
            try
            {
                if (ddlCSV.SelectedIndex > 0)
                {
                    txtCustomerID.Attributes.Remove("disabled");
                }
                else
                {
                    txtCustomerID.Attributes.Add("disabled", "disabled");
                    txtCustomerID.Text = "WALK_IN_CUSTOMER";
                }
            }
            catch (Exception ex)
            {
                MessageError("Error Msg -: " + ex);
            }
        }
        protected void Chk_Cash_CheckedChanged(object sender, EventArgs e)
        {
            try
            {
                if (GridView1.Rows.Count > 0)
                {
                    if (Chk_Cash.Checked)
                    {
                        txtCashAmount.ReadOnly = false;
                        rfvtxtCashAmmount.Enabled = true;
                        ModalPopupExtender4.Show();
                    }
                    else
                    {
                        txtCashAmount.Text = String.Empty;
                        txtRefund.Text = String.Empty;
                        txtCashAmount.ReadOnly = true;
                        rfvtxtCashAmmount.Enabled = false;
                        Fill_Payment();
                        lbl410Count.Text = "0";
                        lbl420Count.Text = "0";
                        lbl500Count.Text = "0";
                        lbl450Count.Text = "0";
                    }
                }
                else
                {
                    Chk_Cash.Checked = false;
                    MessageInfo(" Please add some product !!! ");
                }
            }
            catch (Exception ex)
            {
                MessageError("Error In the Check Cash" + ex.ToString());
            }
        }
        protected void Chk_Debit_CheckedChanged(object sender, EventArgs e)
        {
            try
            {
                if (GridView1.Rows.Count > 0)
                {
                    if (Chk_Debit.Checked == true)
                    {
                        TextBox24.ReadOnly = true;
                        ddlBankNameDebit.Enabled = true;
                        ddlBankNameDebit.Attributes.Remove("disabled");
                        ddlBankNameDebit.Enabled = true;

                        rfvtxtTextBox30.Enabled = true;
                        rfvddlBankNameDebit.Enabled = true;
                        ddlBankNameDebit.BackColor = System.Drawing.ColorTranslator.FromHtml("#FFFFFF");
                        TextBox30.ReadOnly = false;
                        TextBox24.Text = Convert.ToString(Convert.ToDecimal(string.IsNullOrEmpty(txtTotalPay.Text.Trim()) ? "0" : ((txtTotalPay.Text.Trim()))) - Convert.ToDecimal(string.IsNullOrEmpty(txtCashAmount.Text.Trim()) ? "0" : ((txtCashAmount.Text.Trim()))));
                        TextBox24.Text = ((Convert.ToDouble(TextBox24.Text) * 0.02) + Convert.ToDouble(TextBox24.Text)).ToString("F");
                        Fill_Payment();
                        TextBox24.Focus();

                    }
                    if (Chk_Debit.Checked == false)
                    {
                        TextBox24.Text = String.Empty;
                        ddlBankNameDebit.SelectedIndex = 0;
                        TextBox30.Text = String.Empty;
                        TextBox24.ReadOnly = true;
                        rfvtxtTextBox30.Enabled = false;
                        rfvddlBankNameDebit.Enabled = false;
                        ddlBankNameDebit.Enabled = false;
                        ddlBankNameDebit.BackColor = System.Drawing.ColorTranslator.FromHtml("0xEEEEEE");
                        TextBox30.ReadOnly = true;
                        Label28.Text = string.Empty;
                        Label29.Text = string.Empty;
                        //cashData();
                        Fill_Payment();

                    }
                }
                else
                {
                    Chk_Debit.Checked = false;
                    MessageInfo("Please add some product !");
                }
            }
            catch (Exception ex)
            {
                MessageError(ex.ToString());
            }
        }
        protected void Chk_Credit_CheckedChanged(object sender, EventArgs e)
        {

            try
            {
                if (GridView1.Rows.Count > 0)
                {
                    if (Chk_Credit.Checked)
                    {

                        TextBox26.ReadOnly = true;
                        //    ddlBankNameCredit.ReadOnly = false;
                        ddlBankNameCredit.Enabled = true;
                        ddlBankNameCredit.BackColor = System.Drawing.ColorTranslator.FromHtml("#FFFFFF");
                        ddlBankNameCredit.Attributes.Remove("disabled");
                        //    RequiredFieldValidator3.Enabled = true;
                        rfvddlBankNameCredit.Enabled = true;
                        rfvTextBox6.Enabled = true;

                        TextBox6.ReadOnly = false;
                        TextBox26.Text = Convert.ToString(Convert.ToDecimal(string.IsNullOrEmpty(txtTotalPay.Text.Trim()) ? "0" : ((txtTotalPay.Text.Trim()))) - Convert.ToDecimal(string.IsNullOrEmpty(txtCashAmount.Text.Trim()) ? "0" : ((txtCashAmount.Text.Trim()))) - Convert.ToDecimal(string.IsNullOrEmpty(TextBox24.Text.Trim()) ? "0" : ((TextBox24.Text.Trim()))));
                        TextBox26.Text = ((Convert.ToDouble(TextBox26.Text) * 0.02) + Convert.ToDouble(TextBox26.Text)).ToString("F");
                        Fill_Payment();
                    }
                    else
                    {
                        TextBox26.ReadOnly = true;
                        //ddlBankNameCredit.ReadOnly = true;
                        ddlBankNameCredit.Enabled = false;
                        // RequiredFieldValidator3.Enabled = true;
                        ddlBankNameCredit.BackColor = System.Drawing.ColorTranslator.FromHtml("0xEEEEEE");
                        rfvddlBankNameCredit.Enabled = false;
                        rfvTextBox6.Enabled = false;
                        TextBox6.ReadOnly = true;
                        TextBox26.Text = string.Empty;
                        //ddlBankNameCredit.Text = string.Empty;
                        ddlBankNameCredit.SelectedIndex = 0;
                        TextBox6.Text = string.Empty;
                        Fill_Payment();

                    }
                }
                else
                {
                    Chk_Credit.Checked = false;
                    MessageInfo("Please add some product !");
                }
            }
            catch (Exception ex)
            {
                MessageError(ex.ToString());
            }
        }

        protected void Chk_Vocuher_CheckedChanged(object sender, EventArgs e)
        {
            try
            {
                if (!string.IsNullOrEmpty(txtCustomerID.Text.Trim()))
                {
                    if (CheckBox4.Checked)
                    {
                        txtRefund.Text = "";
                        txtRefund.ReadOnly = true;
                        TextBox28.ReadOnly = false;
                        TextBox29.ReadOnly = false;
                        TextBox6.Text = "";
                        TextBox6.ReadOnly = true;
                        Chk_Debit.Checked = false;
                        Chk_Credit.Checked = false;
                        TextBox28.Focus();
                    }
                    if (CheckBox4.Checked == false)
                    {
                        TextBox28.ReadOnly = true;
                        TextBox28.Text = string.Empty;
                        TextBox29.ReadOnly = true;
                        TextBox29.Text = string.Empty;
                        Label30.Text = "0";
                        Fill_Payment();
                    }
                }
                else
                {
                    MessageInfo(" Enter Customer Mobile Number !!! ");
                    CheckBox4.Checked = false;
                    txtCustomerID.Focus();
                }
            }
            catch (Exception ex)
            {
                MessageError("Error in Voucher Check" + ex.ToString());
            }
        }
        protected void btnCancel_Click(object sender, EventArgs e)
        {
            try
            {
                DL.Delete_Promotion_Log_OnCancel(txtTransactionIDShow.Text);
                Response.Redirect("Sample1.aspx");
                DL_Index.flag = 0;
            }
            catch (Exception ex)
            {
                MessageError("Error in Cancel " + ex.ToString());
            }
        }
        protected void btnRetriveHold_Click(object sender, EventArgs e)
        {

        }
        protected void btnPrint_Click(object sender, EventArgs e)
        {
            try
            {
                Print();
            }
            catch (Exception ex)
            {
                MessageError(ex.ToString());
            }
        }
        public void Print()
        {
            try
            {
                Clear_GridView1();
                Generate_TransactionId();
                Clear_All_Payment_Fields();
            }
            catch (Exception ex)
            {
                MessageError(" Error in the Print " + ex.ToString());
            }
        }
        public void UpdateStockDetail(int ProductId, int Quantity, int result)
        {
            SqlCommand com = new SqlCommand();
            SqlConnection con = new SqlConnection();
            con.ConnectionString = ConfigurationManager.ConnectionStrings["marvil_Connection"].ToString();
            com.Connection = con;
            con.Open();
            com.CommandText = "SPUpdateStockById";
            com.Parameters.AddWithValue("@ProductId ", ProductId);
            com.Parameters.AddWithValue("@Quantity", Quantity);
            com.Parameters.AddWithValue("@Result", result);
            com.CommandType = CommandType.StoredProcedure;
            com.ExecuteNonQuery();
        }
        protected void btn_Retrieve_Click(object sender, EventArgs e)
        {
            try
            {
                DataTable da = DL.Retrieve_Hold();
                if (da.Rows.Count > 0) {

                    DataRow dr = da.Rows[0];
                    txtCustomerID.Text = string.IsNullOrEmpty(Convert.ToString(dr["CustomerID"])) ? "" : Convert.ToString(dr["Mobile"]);
                    GridView3.DataSource = da;
                    GridView3.DataBind();
                    Panel4.Visible = true;
                    ModalPopupExtender6.Show();

                } else {
                    MessageInfo("Sorry No Transaction to Retrive..");
                }
                
            }
            catch (Exception ex)
            {
                MessageError("Errors  in Returns " + ex);
            }
        }
        protected void btnLogout_Click(object sender, EventArgs e)
        {
            SqlConnection con = new SqlConnection();
            string sqlStr = "";
            SqlCommand cmd;
            string timein = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
            con.ConnectionString = ConfigurationManager.ConnectionStrings["marvil_Connection"].ConnectionString;
            sqlStr = "Insert into dbo.EmpLogin(empID,StoreId,time,IN_OUT) values('" + Session["empID"].ToString() + "','" + Session["storeID"].ToString() + "','" + timein + "', '" + "OUT" + "')";
            cmd = new SqlCommand(sqlStr, con);
            con.Open();
            cmd.ExecuteNonQuery();
            con.Close();
            Session.Clear();
            Response.Redirect("~/LogInScreen.aspx");
        }
        public void SessionOut()
        {

            this.Response.Cache.SetExpires(DateTime.UtcNow.AddYears(-4));
            this.Response.Cache.SetValidUntilExpires(false);
            this.Response.Cache.SetCacheability(HttpCacheability.NoCache);
            this.Response.Cache.SetRevalidation(HttpCacheRevalidation.AllCaches);
            this.Response.Cache.SetNoStore();
            this.Response.ExpiresAbsolute = DateTime.Now.Subtract(new TimeSpan(1, 0, 0, 0));
            this.Response.Expires = 0;
            this.Response.CacheControl = "no-cache";
            this.Response.AppendHeader("Pragma", "no-cache");
            this.Response.Cache.AppendCacheExtension("must-revalidate, proxy-revalidate, post-check=0, pre-check=0");
            Session["accessFlag"] = 0;
            Session.Abandon();
            Response.Redirect("~/LogInScreen.aspx");
        }
        protected void ImagebtnDiscount2_Click(object sender, ImageClickEventArgs e)
        {
            try
            {
                ImageButton imgbtn = (ImageButton)(sender);
                gvr_Temp = (GridViewRow)imgbtn.NamingContainer;
                string ProductID = GridView1.Rows[gvr_Temp.RowIndex].Cells[1].Text;
                TextBox tb_Qty = (TextBox)GridView1.Rows[gvr_Temp.RowIndex].FindControl("tb_Qty");

                DataTable dt = DL.FetchProductPromotion(ProductID);
                gvPromotionData.DataSource = dt;
                gvPromotionData.DataBind();

                Latest_Qty = tb_Qty.Text;
                gvPromotionData_Display();
                ModalPopupExtender5.Show();
            }
            catch (Exception ex)
            {
                MessageError("Error In Promotion Click ... " + ex);
            }
        }
        public void Insert_Promotion_Log(String ProductID, String PromotionId, string Qty, string AppliedDiscount, string MaxValue)
        {
            DL.ProductId = ProductID;
            DL.PromotionId = PromotionId;
            DL.OrderId = txtTransactionIDShow.Text;
            DL.CustomerId = txtCustomerID.Text;
            DL.AddedBy = Session["empID"].ToString();
            DL.AppliedQuantity = Qty;
            DL.AppliedDiscount = AppliedDiscount;
            DL.MaxValue = MaxValue;
            DL.Insert_Promotion_Log();
        }
        protected void txtCustomerID_TextChanged(object sender, EventArgs e)
        {
            try
            {
                DL.MobileNo = txtCustomerID.Text;
                int result = DL.check_CustomerID();
                Session["CustomerID"] = txtCustomerID.Text.Trim();
                if (result == 0)
                {
                    txtCustomerID.Text = string.Empty;
                    MessageError("Customer Does not Exist !!!");
                    return;
                }
            }
            catch (Exception ex)
            {
                MessageError(" Error in the Customer ID Change !!! " + ex);
            }
        }
        public void SetHeader()
        {
            Label10.Text = DateTime.Now.ToString("[dd,MM,yyyy]");
            Label8.Text = DateTime.Now.ToString("[MMM,yyyy]");
            //set Target
            DataTable da2 = DL.salesTarget(Session["storeID"].ToString(), Session["empID"].ToString());
            if (da2.Rows.Count > 0)
            {
                for (int i = 0; i < da2.Rows.Count; i++)
                {
                    DataRow dr2 = (da2.Rows[i]);
                    if (dr2["year"].ToString() == DateTime.Now.Year.ToString())
                    {
                        string st = DateTime.Now.ToString("MMMMMMMM");
                        if (dr2["type"].ToString() == "Monthly Target" && dr2["month"].ToString() == st)
                        {
                            Label11.Text = dr2["monthlyTarget"].ToString();
                        }
                        if (dr2["type"].ToString() == "Daily Target" && dr2["targetFrom"].ToString() == DateTime.Now.ToString("yyyy-MM-dd"))
                        {
                            Label12.Text = dr2["dailyTarget"].ToString();

                        }
                    }
                    else
                    {
                        Label11.Text = "N/A";
                        Label12.Text = "N/A";
                    }
                }
            }

            //set Achievement Month
            Label17.Text = string.IsNullOrEmpty(DL.salesAchievementMonth()) ? "N/A" : DL.salesAchievementMonth();
            Label14.Text = DateTime.Now.ToString("[MMM,yyyy]");

            //set Achievement Day
            Label18.Text = string.IsNullOrEmpty(DL.salesAchievementDay()) ? "N/A" : DL.salesAchievementDay();
            Label16.Text = DateTime.Now.ToString("[dd,MM,yyyy]");
        }
        public void ShowMessage(string msg, string type)
        {
            ScriptManager.RegisterStartupScript(this, this.GetType(), "key", "showToast('" + msg + "','" + type + "');", true);
        }
        public void MessageSuccess(string Msg)
        {
            ScriptManager.RegisterStartupScript(this, typeof(string), "Registering", String.Format("SweetAlertSuccess('{0}');", Msg), true);
        }
        public void MessageError(string Msg)
        {
            ScriptManager.RegisterStartupScript(this, typeof(string), "Registering", String.Format("SweetAlertError('{0}');", Msg), true);
        }
        public void MessageWarning(string Msg)
        {
            ScriptManager.RegisterStartupScript(this, typeof(string), "Registering", String.Format("SweetAlertWarning('{0}');", Msg), true);
        }
        public void MessageInfo(string Msg)
        {
            ScriptManager.RegisterStartupScript(this, typeof(string), "Registering", String.Format("SweetAlertInfo('{0}');", Msg), true);
        }
        private void SetPreviousData()
        {
            try
            {
                int rowIndex = 0;
                if (ViewState["CurrentTable"] != null)
                {
                    DataTable dt = (DataTable)ViewState["CurrentTable"];
                    if (dt.Rows.Count > 0)
                    {
                        for (int i = 0; i < dt.Rows.Count; i++)
                        {
                            Label l1 = (Label)GridView1.Rows[rowIndex].FindControl("lb_Code");
                            Label l2 = (Label)GridView1.Rows[rowIndex].FindControl("lb_ItemName");
                            Label l3 = (Label)GridView1.Rows[rowIndex].FindControl("lb_Dim");
                            TextBox tb4 = (TextBox)GridView1.Rows[rowIndex].FindControl("tb_Qty");
                            Label l5 = (Label)GridView1.Rows[rowIndex].FindControl("lb_LabelPrice");
                            Label l6 = (Label)GridView1.Rows[rowIndex].FindControl("lb_Discount1");
                            Label l7 = (Label)GridView1.Rows[rowIndex].FindControl("lb_Discount2");
                            Label l8 = (Label)GridView1.Rows[rowIndex].FindControl("lb_SellingPrice");
                            Label l9 = (Label)GridView1.Rows[rowIndex].FindControl("lb_Total");

                            l1.Text = dt.Rows[i]["Column1"].ToString();
                            l2.Text = dt.Rows[i]["Column2"].ToString();
                            l3.Text = dt.Rows[i]["Column3"].ToString();
                            tb4.Text = dt.Rows[i]["Column4"].ToString();
                            l5.Text = dt.Rows[i]["Column5"].ToString();
                            l6.Text = dt.Rows[i]["Column6"].ToString();
                            l7.Text = dt.Rows[i]["Column7"].ToString();
                            l8.Text = dt.Rows[i]["Column8"].ToString();
                            l9.Text = dt.Rows[i]["Column9"].ToString();
                            rowIndex++;
                            Fill_Payment();
                        }
                        if (dt.Rows.Count < 2)
                        {
                            btnPay.Enabled = false;
                            btnPay.BackColor = System.Drawing.ColorTranslator.FromHtml("#a3a375");
                            btnHold.Enabled = false;
                            btnHold.BackColor = System.Drawing.ColorTranslator.FromHtml("#a3a375");
                            //ViewState["CurrentTable"] = null;
                        }
                        for (int i = 0; i < GridView1.Rows.Count; i++)
                        {
                            Label l2 = (Label)GridView1.Rows[i].FindControl("lb_ItemName");
                            if ((l2.Text == "") || (l2.Text == String.Empty))
                            {
                                GridView1.Rows[i].Visible = false;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                MessageError(ex.ToString());
            }
        }
        protected void tb_Qty1_TextChanged(object sender, EventArgs e)
        {

        }
        protected void btn_1_Click_410(object sender, EventArgs e)
        {
            try
            {
                txtCashAmount.Text = Convert.ToString(Convert.ToDecimal(string.IsNullOrEmpty(txtCashAmount.Text.Trim()) ? "0" : (txtCashAmount.Text.Trim())) + Convert.ToDecimal(btn_1.Text));
                lbl410Count.Text = Convert.ToString(Convert.ToInt32(lbl410Count.Text) + 1);
                txtCashAmount_Cash_Text_Changed(sender, e);
                ModalPopupExtender4.Show();
            }
            catch (Exception ex)
            {
                MessageError(ex.ToString());
            }
        }
        protected void btn_2_Click_420(object sender, EventArgs e)
        {
            try
            {
                txtCashAmount.Text = Convert.ToString(Convert.ToDecimal(string.IsNullOrEmpty(txtCashAmount.Text.Trim()) ? "0" : (txtCashAmount.Text.Trim())) + Convert.ToDecimal(btn_2.Text));
                lbl420Count.Text = Convert.ToString(Convert.ToInt32(lbl420Count.Text) + 1);
                txtCashAmount_Cash_Text_Changed(sender, e);
                ModalPopupExtender4.Show();
            }
            catch (Exception ex)
            {
                MessageError(ex.ToString());
            }
        }
        protected void btn_3_Click_450(object sender, EventArgs e)
        {
            try
            {
                txtCashAmount.Text = Convert.ToString(Convert.ToDecimal(string.IsNullOrEmpty(txtCashAmount.Text.Trim()) ? "0" : (txtCashAmount.Text.Trim())) + Convert.ToDecimal(btn_3.Text));
                lbl450Count.Text = Convert.ToString(Convert.ToInt32(lbl450Count.Text) + 1);
                txtCashAmount_Cash_Text_Changed(sender, e);
                ModalPopupExtender4.Show();
            }
            catch (Exception ex)
            {
                MessageError(ex.ToString());
            }
        }
        protected void btn_4_Click_500(object sender, EventArgs e)
        {
            try
            {
                txtCashAmount.Text = Convert.ToString(Convert.ToDecimal(string.IsNullOrEmpty(txtCashAmount.Text.Trim()) ? "0" : (txtCashAmount.Text.Trim())) + Convert.ToDecimal(btn_4.Text));
                lbl500Count.Text = Convert.ToString(Convert.ToInt32(lbl500Count.Text) + 1);
                txtCashAmount_Cash_Text_Changed(sender, e);
                ModalPopupExtender4.Show();
            }
            catch (Exception ex)
            {
                MessageError(ex.ToString());
            }
        }

        protected void btn_Manual_Click(object sender, EventArgs e)
        {
            try
            {
                txtCashAmount.Focus();
            }
            catch (Exception ex)
            {
                MessageError(ex.ToString());
            }
        }
        protected void txtCashAmount_Cash_Text_Changed(object sender, EventArgs e)
        {
            try
            {
                cashData();
                double data = Double.Parse(txtCashAmount.Text);
                txtCashAmount.Text = String.Format("{0:0.##}", data);
                Fill_Payment();
            }
            catch (Exception ex)
            {
                MessageError(ex.ToString());
            }
        }

        protected void GridView3_RowCommand(object sender, GridViewCommandEventArgs e)
        {
            try
            { 
                GridViewRow gvr1 = (GridViewRow)(((Button)e.CommandSource).NamingContainer);
                int RowIndex = gvr1.RowIndex;
                ViewState["GV3"] = RowIndex;
                if (e.CommandName == "Retrieve")
                {
                    Label lb_SellsOrderId = (Label)GridView3.Rows[RowIndex].FindControl("lb_SellsOrderId");
                    DL.TransactionId = lb_SellsOrderId.Text;
                    DataTable da = DL.Find_TransactionId1();
                    ViewState["CurrentTable"] = null;
                    SetInitialRow();
                    GridView1.DataSource = ViewState["CurrentTable"];
                    GridView1.DataBind();
                    txtTransactionIDShow.Text = lb_SellsOrderId.Text;
                    if (da.Rows.Count > 0)
                    {
                        foreach (DataRow dr1 in da.Rows)
                        {
                            if (ViewState["CurrentTable"] != null)
                            {
                                DataTable dtViewstate = (DataTable)ViewState["CurrentTable"];
                                DataRow drView = dtViewstate.NewRow();
                                drView["SellsOrderItemID"] = dr1["SellsOrderItemID"].ToString();
                                drView["Code"] = dr1["Code"].ToString();
                                drView["Item Name"] = dr1["Item Name"].ToString();
                                drView["Dim"] = dr1["Dim"].ToString();
                                drView["Qty"] = dr1["Qty"].ToString();
                                drView["TtlQty"] = dr1["TtlQty"].ToString();
                                drView["Label Price"] = Math.Round(Convert.ToDecimal(dr1["Label Price"]), 2);
                                drView["Discount 1st"] = 0;
                                drView["Discount 2nd"] = dr1["Discount 1st"].ToString();
                                drView["Selling Price"] = dr1["Selling Price"].ToString();
                                drView["Total"] = dr1["Total"].ToString();
                                drView["IsReturn"] = 3;
                                drView["IsDraft"] = dr1["IsDraft"].ToString();
                                drView["ReturnQty"] = dr1["ReturnQty"].ToString();
                                drView["IsQtyTxtOn"] = dr1["IsQtyTxtOn"].ToString();
                                drView["IsDiscImgOn"] = dr1["IsDiscImgOn"].ToString();
                                drView["IsFreeLabel"] = "";
                                if (dr1["PromoRemark"].ToString() == "Free") {
                                    drView["IsFreeLabel"] = "Free";
                                }
                                dtViewstate.Rows.Add(drView);
                                dtViewstate.AcceptChanges();
                                ViewState["CurrentTable"] = dtViewstate;
                            }
                        }
                        ViewState["OnBillTotal"] = 1;
                        decimal taxValue = decimal.Parse(da.Rows[0]["Tax"].ToString());
                        decimal totaldiscount = decimal.Parse(da.Rows[0]["TotalPay"].ToString());
                        decimal discountValue = decimal.Parse(da.Rows[0]["TotalDiscount"].ToString());
                        lastTotal = totaldiscount - discountValue;
                        lastdiscount = discountValue;

                        GridView1.DataSource = ViewState["CurrentTable"];
                        GridView1.DataBind();
                        Fill_Payment();
                    }

                }
                if (e.CommandName == "hide")
                {

                    // For Delete the Retrive Details
                    Label lb_SellsOrderId = (Label)GridView3.Rows[RowIndex].FindControl("lb_SellsOrderId");
                    bool flag = DL.deleteRetriveHold(int.Parse(lb_SellsOrderId.Text));
                    if (flag)
                    {
                        MessageInfo(" Item Deleted Successfully !!! ");
                        //ModalPopupExtender6.Show();
                    }
                    else
                    {
                        MessageError(" Something Went Wrong !!! ");
                    }
                }
            }
            catch (Exception ex)
            {
                MessageError("Error In Retrive Click -:" + ex);
            }
        }
        protected void btnReturn_Click(object sender, EventArgs e)
        {
            try
            {
                ReturnData();
                txtSearch.Enabled = true;
                Fill_Payment();
            }
            catch (Exception ex)
            {
                MessageWarning("Error Msg -: " + ex);
            }
        }
        private void ReturnData()
        {
            if (!string.IsNullOrEmpty(txtTransactionID.Text.Trim()))
            {
                Clear_GridView1();
                DL.TransactionId = txtTransactionID.Text.Trim();
                DataTable da = DL.Find_TransactionId();
                if (da.Rows.Count > 0)
                {
                    DataRow dr0 = da.Rows[0];
                    foreach (DataRow dr1 in da.Rows)
                    {
                        if (ViewState["CurrentTable"] != null)
                        {
                            DataTable dtViewstate = (DataTable)ViewState["CurrentTable"];
                            DataRow drView = dtViewstate.NewRow();
                            drView["SellsOrderItemID"] = dr1["SellsOrderItemID"].ToString();
                            drView["Code"] = dr1["Code"].ToString();
                            drView["Item Name"] = dr1["Item Name"].ToString();
                            drView["Dim"] = dr1["Dim"].ToString();
                            drView["Qty"] = dr1["Qty"].ToString();
                            drView["Label Price"] = dr1["Label Price"].ToString();
                            drView["Discount 1st"] = dr1["Discount 1st"].ToString();
                            drView["Discount 2nd"] = dr1["Discount 2nd"].ToString();
                            drView["Selling Price"] = dr1["Selling Price"].ToString();
                            drView["Total"] = dr1["Total"].ToString(); ;
                            drView["IsReturn"] = dr1["IsReturn"].ToString();
                            drView["IsDraft"] = dr1["IsDraft"].ToString();
                            drView["SellsReturnID"] = dr1["SellsReturnID"].ToString();
                            drView["ReturnQty"] = dr1["ReturnQty"].ToString();
                            dtViewstate.Rows.Add(drView);
                            dtViewstate.AcceptChanges();
                            ViewState["CurrentTable"] = dtViewstate;
                        }

                    }
                    GridView1.DataSource = ViewState["CurrentTable"];
                    GridView1.DataBind();
                    GridView1.Columns[4].HeaderText = "Return Qty/Purchase Qty";
                    foreach (GridViewRow gvr in GridView1.Rows)
                    {
                        TextBox txtPurchaseQty = GridView1.Rows[gvr.RowIndex].FindControl("tb_Qty1") as TextBox;
                        txtPurchaseQty.Visible = true;
                    }
                    txtTransactionIDShow.Text = dr0["SellsOrderID"].ToString();
                    txtCustomerID.Text = dr0["CustomerID"].ToString();
                    DL_Index.IsReutrnMode = 1;
                }
                else
                {
                    MessageInfo("TransactionID does not exist for return.");
                }
            }
            else
            {
                MessageError("No Transaction ID Exist");
            }
        }
        protected void TextBox28_TextChanged(object sender, EventArgs e)
        {
            try
            {
                bool flag = false;
                string giftCardValue = "", dateOfExpiry = "", IsUsed = "", status = "";
                DataTable dt = new DataTable();
                DL.VoucherNumber = TextBox28.Text;
                DL.empID = Session["empID"].ToString();
                DL.TerminalID = Session["PosId"].ToString();
                DL.StoreID = Session["storeID"].ToString();
                DL.CustID = txtCustomerID.Text;
                dt = DL.GetVouchers();
                if (dt.Rows.Count > 0)
                {
                    giftCardValue = dt.Rows[0]["giftCardValue"].ToString();
                    dateOfExpiry = dt.Rows[0]["dateOfExpiry"].ToString();
                    IsUsed = dt.Rows[0]["IsUsed"].ToString();
                    status = dt.Rows[0]["status"].ToString();
                    if ((DateTime.Now.CompareTo(DateTime.Parse(dateOfExpiry))) > 0)
                    {
                        flag = false;
                        MessageInfo(" Voucher Expired !!! ");
                        TextBox28.Text = "";
                    }
                    else if (IsUsed.Equals("1"))
                    {

                        flag = false;
                        MessageInfo(" Voucher Already Used  !!! ");
                        TextBox28.Text = "";
                    }
                    else if (status.Equals("Inactive"))
                    {
                        flag = false;
                        MessageInfo(" Voucher Status is Inactive !!! ");
                        TextBox28.Text = "";
                    }
                    else
                    {
                        flag = true;
                    }
                }
                else
                {
                    flag = false;
                    MessageInfo(" No Voucher Found !!! ");
                    TextBox28.Text = "";
                }
                if (flag)
                {
                    TextBox29.Text = giftCardValue;
                    TextBox29.Focus();
                    Fill_Payment();
                }
            }
            catch (Exception ex)
            {
                MessageError(" Error in Finding Voucher. " + ex.ToString());
            }
        }
        protected void txtTotal_TextChanged(object sender, EventArgs e)
        {
            try
            {
                //   cashData();
                Fill_Payment();
            }
            catch (Exception ex)
            {
                MessageError(ex.ToString());
            }
        }
        private void cashData()
        {
            if (txtCashAmount.Text == txtTotalPay.Text)
            {
                lblTotalPaymemt.Text = txtTotalPay.Text;
                Label27.Text = txtTotalPay.Text;
                txtRefund.Text = "0";
            }
            //Pay Less than payment
            if ((Convert.ToDecimal(txtCashAmount.Text)) < (Convert.ToDecimal(txtTotalPay.Text)))
            {
                Label27.Text = txtCashAmount.Text;

                //temp = Math.Abs((Convert.ToDecimal(txtCashAmount.Text)) - (Convert.ToDecimal(txtTotalPay.Text)));
                lblTotalPaymemt.Text = Convert.ToDecimal(Label27.Text).ToString();
            }
            //Pay more than payment
            if ((Convert.ToDecimal(txtCashAmount.Text)) > (Convert.ToDecimal(txtTotalPay.Text)))
            {
                txtRefund.Text = Math.Abs((Convert.ToDecimal(txtCashAmount.Text)) - (Convert.ToDecimal(txtTotalPay.Text))).ToString();
                lblTotalPaymemt.Text = txtTotalPay.Text;
                Label27.Text = lblTotalPaymemt.Text;
            }

        }
        protected void TextBox24_TextChanged(object sender, EventArgs e)
        {
            try
            {
                //   Debitcalculation();
                double data = Double.Parse(TextBox24.Text);
                TextBox24.Text = String.Format("{0:0.##}", data);
                Fill_Payment();
            }
            catch (Exception ex)
            { MessageError(ex.ToString()); }
        }
        private void Debitcalculation()
        {
            if (TextBox24.Text == txtTotalPay.Text)
            {
                txtRefund.Text = "0";
                Label28.Text = TextBox24.Text;
                Label29.Text = ((Convert.ToDecimal(TextBox24.Text)) * 2 / 100).ToString();
                lblTotalPaymemt.Text = (Math.Abs(Convert.ToDecimal(txtTotalPay.Text) - Convert.ToDecimal(Label29.Text))).ToString();
            }
            //Pay Less than payment
            if ((Convert.ToDouble(TextBox24.Text)) < (Convert.ToDouble(txtTotalPay.Text)))
            {
                //txtRefund.Text = Math.Abs((Convert.ToDouble(TextBox24.Text)) - (Convert.ToDouble(txtTotalPay.Text))).ToString();
                Label28.Text = TextBox24.Text;
                if ((txtCashAmount.Text == "500") || (txtCashAmount.Text == "450") || (txtCashAmount.Text == "420") || (txtCashAmount.Text == "410"))
                {
                    Label29.Text = ((Convert.ToDecimal(TextBox24.Text)) * 2 / 100).ToString();
                    lblTotalPaymemt.Text = (Math.Abs(Convert.ToDecimal(TextBox24.Text) - Convert.ToDecimal(Label29.Text) + Convert.ToDecimal(Label27.Text))).ToString();
                }
                else
                {
                    lblTotalPaymemt.Text = (Math.Abs(Convert.ToDecimal(TextBox24.Text) + Convert.ToDecimal(Label27.Text))).ToString();
                    Label29.Text = string.Empty;
                }
            }
            //Pay more than payment
            if ((Convert.ToDecimal(TextBox24.Text)) > (Convert.ToDecimal(txtTotalPay.Text)))
            {
                txtRefund.Text = Math.Abs((Convert.ToDecimal(TextBox24.Text)) - (Convert.ToDecimal(txtTotalPay.Text))).ToString();
                Label28.Text = TextBox24.Text;
                Label29.Text = ((Convert.ToDecimal(txtTotalPay.Text)) * 2 / 100).ToString();
                lblTotalPaymemt.Text = (Math.Abs(Convert.ToDecimal(txtTotalPay.Text) - Convert.ToDecimal(Label29.Text))).ToString();
            }
        }
        protected void TextBox26_TextChanged(object sender, EventArgs e)
        {
            try
            {
                double data = Double.Parse(TextBox26.Text);
                TextBox26.Text = String.Format("{0:0.##}", data);
                Fill_Payment();
            }
            catch (Exception ex)
            {
                MessageError(ex.ToString());
            }
        }
        private void Credit()
        {
            if (TextBox26.Text == txtTotalPay.Text)
            {
                txtRefund.Text = "0";
                Label28.Text = TextBox26.Text;
                Label29.Text = ((Convert.ToDouble(TextBox26.Text)) * 2 / 100).ToString();
                lblTotalPaymemt.Text = (Math.Abs(Convert.ToDouble(txtTotalPay.Text) - Convert.ToDouble(Label29.Text))).ToString();
            }
            //Pay Less than payment
            if ((Convert.ToDouble(TextBox26.Text)) < (Convert.ToDouble(txtTotalPay.Text)))
            {
                //txtRefund.Text = Math.Abs((Convert.ToDouble(TextBox24.Text)) - (Convert.ToDouble(txtTotalPay.Text))).ToString();
                Label28.Text = TextBox24.Text;
                if ((txtCashAmount.Text == "500") || (txtCashAmount.Text == "450") || (txtCashAmount.Text == "420") || (txtCashAmount.Text == "410"))
                {
                    Label29.Text = ((Convert.ToDouble(TextBox24.Text)) * 2 / 100).ToString();
                    lblTotalPaymemt.Text = (Math.Abs(Convert.ToDouble(TextBox24.Text) - Convert.ToDouble(Label29.Text) + Convert.ToDouble(Label27.Text))).ToString();
                }
                else
                {
                    lblTotalPaymemt.Text = (Math.Abs(Convert.ToDouble(TextBox24.Text) + Convert.ToDouble(Label27.Text))).ToString();
                    Label29.Text = string.Empty;
                }
            }
            //Pay more than payment
            if ((Convert.ToDouble(TextBox24.Text)) > (Convert.ToDouble(txtTotalPay.Text)))
            {
                txtRefund.Text = Math.Abs((Convert.ToDouble(TextBox24.Text)) - (Convert.ToDouble(txtTotalPay.Text))).ToString();
                Label28.Text = TextBox24.Text;
                Label29.Text = ((Convert.ToDouble(txtTotalPay.Text)) * 2 / 100).ToString();
                lblTotalPaymemt.Text = (Math.Abs(Convert.ToDouble(txtTotalPay.Text) - Convert.ToDouble(Label29.Text))).ToString();
            }

        }
        protected void GridView1_SelectedIndexChanged1(object sender, EventArgs e)
        {
            TextBox txtQuantity = (TextBox)GridView1.SelectedRow.FindControl("tb_Qty");
            txtQuantity.Focus();
        }
        protected void btn_SelectPromo_Click(object sender, EventArgs e)
        {
            try
            {
                Button btn = (Button)sender;
                GridViewRow gvRow = (GridViewRow)btn.Parent.Parent;
                Label ProductID = (Label)gvRow.FindControl("lb_PromoName");

                Button btnSelect = (Button)gvRow.FindControl("btn_SelectPromo");
                Button btnCancel = (Button)gvRow.FindControl("btn_CancelPromo");

                String PromotionId = gvPromotionData.DataKeys[gvRow.RowIndex].Values[2].ToString();
                string Get = gvPromotionData.DataKeys[gvRow.RowIndex].Values[1].ToString();
                string AdditionalValue = gvPromotionData.DataKeys[gvRow.RowIndex].Values[3].ToString();
                string MaxValue = gvPromotionData.DataKeys[gvRow.RowIndex].Values[4].ToString();
                string MinTrans = gvPromotionData.DataKeys[gvRow.RowIndex].Values[5].ToString();
                string PerUserApplied = gvPromotionData.DataKeys[gvRow.RowIndex].Values[6].ToString();
                string Discount = gvPromotionData.DataKeys[gvRow.RowIndex].Values[7].ToString();
                string ProdPromoType = gvPromotionData.DataKeys[gvRow.RowIndex].Values[8].ToString();
                string GetType = gvPromotionData.DataKeys[gvRow.RowIndex].Values[9].ToString();
                string OnQty = gvPromotionData.DataKeys[gvRow.RowIndex].Values[10].ToString();
                string Buy = gvPromotionData.DataKeys[gvRow.RowIndex].Values[0].ToString();
                string AddingPrice = gvPromotionData.DataKeys[gvRow.RowIndex].Values[11].ToString();
                Label lb_PromoName = (Label)gvPromotionData.Rows[gvRow.RowIndex].FindControl("lb_PromoName");
                string LabelPrice = gvPromotionData.Rows[gvRow.RowIndex].Cells[5].ToString();

                //For the On Bill Promocode 
                // Change the Logic of to new discount Strategy

                decimal DiscountPromoPrice = 0;
                decimal Discount1 = 0;
                //   decimal AddingPrice = 0;
                if (Convert.ToInt32(PerUserApplied) > 0)
                {
                    for (int i = 0; i < GridView1.Rows.Count; i++)
                    {
                        String ProductID1 = Server.HtmlDecode(GridView1.Rows[i].Cells[1].Text);
                        if (ProductID1 == lb_PromoName.Text)
                        {
                            TextBox Qty = (TextBox)GridView1.Rows[i].FindControl("tb_Qty");
                            Label lblDiscount1 = (Label)GridView1.Rows[i].FindControl("lblDiscount1");
                            Label lblTotal = (Label)GridView1.Rows[i].FindControl("lblTotal");
                            Label lblSellingPrice = (Label)GridView1.Rows[i].FindControl("lblSellingPrice");
                            string Price = GridView1.Rows[i].Cells[5].Text.ToString();
                            Label lblDiscount2 = (Label)GridView1.Rows[i].FindControl("lblDiscount2");
                            if (ProdPromoType == " BuyGet ")
                            {
                                if (GetType == "Quantity")
                                {
                                    MessageInfo("Adding the  Quantity");
                                    Qty.Text = (Convert.ToInt32(Qty.Text) + (Convert.ToInt32(Get))).ToString();
                                    ViewState["Applied"] = Qty.Text.Trim();
                                    ViewState["AppliedDiscount"] = 1;
                                    ViewState["OnProduct"] = 1;
                                }
                                if (GetType == "Percentage")
                                {

                                    MessageInfo("Adding the Percent Discount... ");
                                    DiscountPromoPrice = Math.Round((Convert.ToDecimal(txtTotal.Text) * Convert.ToDecimal(Get) / 100), 2);
                                    if (Convert.ToDecimal(MaxValue) != 0)
                                    {
                                        if (DiscountPromoPrice > Convert.ToDecimal(MaxValue))
                                            Discount1 = Convert.ToDecimal(MaxValue);
                                        else
                                            Discount1 = DiscountPromoPrice;
                                    }
                                    else
                                    {
                                        Discount1 = DiscountPromoPrice;
                                    }
                                    lblDiscount1.Text = Convert.ToString(Discount1);
                                    lblTotal.Text = Convert.ToString(Convert.ToDecimal(lblTotal.Text) - Convert.ToDecimal(lblDiscount1.Text));
                                    Fill_Payment();
                                    ViewState["Applied"] = Qty.Text.Trim();
                                    ViewState["AppliedDiscount"] = Discount;
                                    ViewState["MaxValue"] = MaxValue;
                                    ViewState["OnProduct"] = 1;
                                }
                            }
                            if (ProdPromoType == " Adding Value ")
                            {
                                MessageInfo("Adding The Value ");
                                lblTotal.Text = Convert.ToString(Convert.ToDecimal(lblTotal.Text) + Convert.ToDecimal(AddingPrice));
                                Qty.Text = (Convert.ToInt32(Qty.Text) + (Convert.ToInt32(Get))).ToString();
                                Fill_Payment();
                                ViewState["Applied"] = Qty.Text.Trim();
                                ViewState["AppliedDiscount"] = 1;
                                ViewState["OnProduct"] = 1;
                            }
                            if (ProdPromoType == " Special Price ")
                            {
                                MessageInfo(" Adding the Special Price ");
                                lblSellingPrice.Text = AddingPrice;
                                lblTotal.Text = (decimal.Parse(AddingPrice) * int.Parse(Qty.Text)).ToString();
                                string discountValue = (decimal.Parse(Price) - decimal.Parse(lblSellingPrice.Text)).ToString("F");
                                lblDiscount1.Text = discountValue;

                                Fill_Payment();
                                ViewState["Applied"] = AddingPrice;
                                ViewState["AppliedDiscount"] = 1;
                                ViewState["OnProduct"] = 1;
                            }
                        }
                    }
                    ViewState["PromotionID"] = PromotionId;
                    Insert_Promotion_Log(ProductID.Text, PromotionId, string.IsNullOrEmpty(Convert.ToString(ViewState["Applied"])) ? "0" : Convert.ToString(ViewState["Applied"]), string.IsNullOrEmpty(Convert.ToString(ViewState["AppliedDiscount"])) ? "0" : Convert.ToString(ViewState["AppliedDiscount"]), string.IsNullOrEmpty(Convert.ToString(ViewState["MaxValue"])) ? "0" : Convert.ToString(ViewState["MaxValue"]));
                    MessageSuccess("Per Product Promotion Applied Successfully.");
                }
                else
                {
                    MessageSuccess("Per User Applied Promotion is full..");
                }
            }
            catch (Exception ex)
            {
                MessageSuccess("Error in The Apply Promo -: " + ex);
            }
        }
        protected void btn_CancelPromo_Click(object sender, EventArgs e)
        {
            try
            {
                Button btn = (Button)sender;
                GridViewRow gvRow = (GridViewRow)btn.Parent.Parent;
                Label ProductID = (Label)gvRow.FindControl("lb_PromoName"); //btn_SelectPromo
                String PromotionId = gvPromotionData.DataKeys[gvRow.RowIndex].Values[2].ToString();
                string Get = gvPromotionData.DataKeys[gvRow.RowIndex].Values[1].ToString();
                string AdditionalValue = gvPromotionData.DataKeys[gvRow.RowIndex].Values[3].ToString();
                string MaxValue = gvPromotionData.DataKeys[gvRow.RowIndex].Values[4].ToString();
                string MinTrans = gvPromotionData.DataKeys[gvRow.RowIndex].Values[5].ToString();
                string PerUserApplied = gvPromotionData.DataKeys[gvRow.RowIndex].Values[6].ToString();
                string Discount = gvPromotionData.DataKeys[gvRow.RowIndex].Values[7].ToString();

                string ProdPromoType = gvPromotionData.DataKeys[gvRow.RowIndex].Values[8].ToString();
                string GetType = gvPromotionData.DataKeys[gvRow.RowIndex].Values[9].ToString();
                string OnQty = gvPromotionData.DataKeys[gvRow.RowIndex].Values[10].ToString();
                string Buy = gvPromotionData.DataKeys[gvRow.RowIndex].Values[0].ToString();
                string AddingPrice = gvPromotionData.DataKeys[gvRow.RowIndex].Values[11].ToString();
                Label lb_PromoName = (Label)gvPromotionData.Rows[gvRow.RowIndex].FindControl("lb_PromoName");

                DL.OrderId = txtTransactionIDShow.Text;
                DL.Delete_Promotion_Log(PromotionId, txtTransactionID.Text);

                decimal DiscountPromoPrice = 0;
                if (Convert.ToInt32(PerUserApplied) > 0)
                {
                    for (int i = 0; i < GridView1.Rows.Count; i++)
                    {
                        String ProductID1 = Server.HtmlDecode(GridView1.Rows[i].Cells[1].Text);
                        if (ProductID1 == lb_PromoName.Text)
                        {
                            TextBox Qty = (TextBox)GridView1.Rows[i].FindControl("tb_Qty");
                            Label lblDiscount1 = (Label)GridView1.Rows[i].FindControl("lblDiscount1");
                            Label lblTotal = (Label)GridView1.Rows[i].FindControl("lblTotal");
                            Label lblSellingPrice = (Label)GridView1.Rows[i].FindControl("lblSellingPrice");
                            string Price = GridView1.Rows[i].Cells[5].Text.ToString();
                            if (ProdPromoType == " BuyGet ")
                            {
                                if (GetType == "Quantity")
                                {
                                  
                                    Qty.Text = (Convert.ToInt32(Qty.Text) - (Convert.ToInt32(Get))).ToString();
                                    Fill_Payment();
                                    ViewState["Applied"] = Qty.Text.Trim();
                                    ViewState["AppliedDiscount"] = 0;
                                    ViewState["OnProduct"] = 0;
                                    MessageWarning(" BuyGet Quantity Promotion Successfully Remove. ");
                                }
                                if (GetType == "Percentage")
                                {  

                                    DiscountPromoPrice = Math.Round((Convert.ToDecimal(txtTotal.Text) * Convert.ToDecimal(Discount) / 100), 2);
                                    lblTotal.Text = Convert.ToString(Convert.ToDecimal(lblTotal.Text) + Convert.ToDecimal(lblDiscount1.Text)); 
                                    lblDiscount1.Text = "0.00";
                                    ViewState["OnProduct"] = 0;
                                    Fill_Payment();
                                    MessageWarning(" BuyGet Percentage Promotion Successfully Remove. ");
                                }
                            }
                            if (ProdPromoType == " Adding Value ")
                            {
                                lblTotal.Text = Convert.ToString(Convert.ToDecimal(lblTotal.Text) - Convert.ToDecimal(AddingPrice));
                                Qty.Text = (Convert.ToInt32(Qty.Text) - (Convert.ToInt32(Get))).ToString();
                                Fill_Payment();
                                ViewState["Applied"] = Qty.Text.Trim();
                                ViewState["AppliedDiscount"] = 0;
                                ViewState["MaxValue"] = 0;
                                ViewState["OnProduct"] = 0;
                                MessageSuccess(" Adding Value Successfully Remove. ");
                            }
                            if (ProdPromoType == " Special Price ")
                            {

                                lblSellingPrice.Text = Price;
                                lblTotal.Text = (decimal.Parse(Price) * int.Parse(Qty.Text)).ToString();
                                lblDiscount1.Text = "0.00";
                                ViewState["OnProduct"] = 0;
                                Fill_Payment();
                                ViewState["Applied"] = 0;
                                ViewState["AppliedDiscount"] = 0;
                                MessageSuccess(" Special Price Successfully Remove. ");
                            }

                        }
                    }
                }
            }
            catch (Exception ex)
            {
                MessageWarning("Errors In Cancel Promotion.." + ex);
            }
        }
        protected void ddlBankNameCredit_TextChanged(object sender, EventArgs e)
        {
            try
            {
                //  Credit();

            }
            catch (Exception ex)
            {
                MessageError(" Credit Text Change.." + ex.ToString());
            }
        }
        protected void GridView1_RowEditing(object sender, GridViewEditEventArgs e)
        { 
            GridView1.EditIndex = e.NewEditIndex;
            //Set the focus to control on the edited row
            GridView1.Rows[e.NewEditIndex].FindControl("tb_Qty").Focus();
        }
        protected void imgOnBillTotal_Click(object sender, ImageClickEventArgs e)
        {
            if (GridView1.Rows.Count > 0)
            {
                DataTable dt = DL.FetchOnBillTotalPromo(DL.StoreID);
                if (dt.Rows.Count > 0)
                {
                    gvBillTotal.DataSource = dt;
                    gvBillTotal.DataBind();
                    gvOnBillTotalDisplay();
                    ModalPopupExtender7.Show();
                }
            }
            else {
                MessageWarning("Sorry Please Add The Product...");
            }
        }
        protected void gvOnBillTotalDisplay() {

            bool promofound = false;
            DL.OrderId = txtTransactionIDShow.Text;
            DataTable da = DL.Get_Promotion_Log();
            if (da.Rows.Count > 0)
            {
                for (int i = 0; i < da.Rows.Count; i++)
                {
                    string PromotionId1 = da.Rows[i]["PromotionId"].ToString();
                    for (int j = 0; j < gvBillTotal.Rows.Count; j++)
                    {
                        Button btn_SelectPromo = (Button)gvBillTotal.Rows[j].FindControl("btn_SelectPromo1");
                        Button btn_CancelPromo = (Button)gvBillTotal.Rows[j].FindControl("btn_CancelPromo1");
                        string PromotionId = gvBillTotal.DataKeys[j].Values[9].ToString();
                        if (PromotionId == PromotionId1)
                        {
                            btn_SelectPromo.Text = "Added";
                            btn_SelectPromo.Enabled = false;
                            btn_SelectPromo.BackColor = System.Drawing.ColorTranslator.FromHtml("#a3a375");
                            btn_CancelPromo.Visible = true;
                            btn_CancelPromo.BackColor = System.Drawing.ColorTranslator.FromHtml("#ff0000");
                            promofound = true;
                        }
                        else
                        {
                            btn_SelectPromo.Text = "Apply Promo";
                            btn_SelectPromo.Enabled = true;
                            btn_SelectPromo.BackColor = System.Drawing.ColorTranslator.FromHtml("#ff0000");
                            btn_CancelPromo.Visible = false;
                            btn_CancelPromo.BackColor = System.Drawing.ColorTranslator.FromHtml("#a3a375");
                            promofound = false;
                        }
                    }
                }
                if (promofound == false)
                {
                    for (int j = 0; j < gvBillTotal.Rows.Count; j++)
                    {
                        Button btn_SelectPromo = (Button)gvBillTotal.Rows[j].FindControl("btn_SelectPromo1");
                        btn_SelectPromo.BackColor = System.Drawing.ColorTranslator.FromHtml("#a3a375");
                        btn_SelectPromo.Enabled = false;
                    }
                }
            }
            else
            {
                for (int j = 0; j < gvBillTotal.Rows.Count; j++)
                {

                    Button btn_SelectPromo = (Button)gvBillTotal.Rows[j].FindControl("btn_SelectPromo1");
                    Button btn_CancelPromo = (Button)gvBillTotal.Rows[j].FindControl("btn_CancelPromo1");
                    if (ViewState["OnProduct"] != null && ViewState["OnProduct"].ToString() != "1")
                    {
                        btn_SelectPromo.Enabled = true;
                        btn_SelectPromo.BackColor = System.Drawing.ColorTranslator.FromHtml("#ff0000");
                        btn_CancelPromo.Visible = false;
                        btn_CancelPromo.BackColor = System.Drawing.ColorTranslator.FromHtml("#a3a375");
                    }
                    else
                    {
                        btn_SelectPromo.BackColor = System.Drawing.ColorTranslator.FromHtml("#a3a375");
                        btn_SelectPromo.Enabled = false;
                    }
                }
            }
        }
        protected void btn_SelectPromo1_Click(object sender, EventArgs e)
        {

            Button btn = (Button)sender;
            GridViewRow gvRow = (GridViewRow)btn.Parent.Parent;
            //    Label ProductID = (Label)gvRow.FindControl("lb_PromoName");
            Button btnSelect = (Button)gvRow.FindControl("btn_SelectPromo1");
            String PromotionId = gvBillTotal.DataKeys[gvRow.RowIndex].Values[9].ToString();
            String promoName = gvBillTotal.DataKeys[gvRow.RowIndex].Values[2].ToString();
            String minTrans = gvBillTotal.DataKeys[gvRow.RowIndex].Values[2].ToString();
            int RelevantID = int.Parse(gvBillTotal.DataKeys[gvRow.RowIndex].Values[8].ToString());
            String IsFreeProductPromo = gvBillTotal.DataKeys[gvRow.RowIndex].Values[7].ToString();
            string PerUserApplied = gvBillTotal.DataKeys[gvRow.RowIndex].Values[4].ToString();
            decimal   MinTrans = decimal.Parse(gvBillTotal.DataKeys[gvRow.RowIndex].Values[2].ToString());
            decimal  MaxTrans = decimal.Parse(gvBillTotal.DataKeys[gvRow.RowIndex].Values[3].ToString());
            decimal discount = decimal.Parse(gvBillTotal.DataKeys[gvRow.RowIndex].Values[1].ToString());
            decimal discount2 = decimal.Parse(gvBillTotal.DataKeys[gvRow.RowIndex].Values[6].ToString());
            if (Convert.ToInt32(PerUserApplied) > 0)
            {
                if ((decimal.Parse(lblTotalAmount.Text) >= MinTrans) && (decimal.Parse(lblTotalAmount.Text) <= MaxTrans))
                {

                    if (IsFreeProductPromo == "YES")
                    {
                       
                        DataTable dtViewstate = (DataTable)ViewState["CurrentTable"];
                        String productName = DL.getProductDetails(RelevantID);
                        DataRow drView = dtViewstate.NewRow();
                        drView["SellsOrderItemID"] = 1234;
                        drView["Code"] = RelevantID;
                        drView["Item Name"] = DL.getProductDetails(RelevantID);
                        drView["Dim"] = "Pairs";
                        drView["TtlQty"] = 0;
                        drView["Qty"] = 1;
                        drView["Label Price"] = "0.00";
                        drView["Discount 2nd"] = "0.00";
                        drView["Selling Price"] = "0.00";
                        drView["Discount 1st"] = 0.00;
                        drView["Total"] = "0.00";
                        drView["IsReturn"] = "2";
                        drView["IsDraft"] = "0";
                        drView["SellsReturnID"] = "1";
                        drView["ReturnQty"] = "0";
                        drView["IsQtyTxtOn"] = "1";
                        drView["IsDiscImgOn"] = "1";
                        drView["IsFreeLabel"] = "Free";
                        dtViewstate.Rows.Add(drView);
                        dtViewstate.AcceptChanges();
                        ViewState["CurrentTable"] = dtViewstate;
                        GridView1.DataSource = ViewState["CurrentTable"];

                        GridView1.DataBind();
                        lblItems.Text = GridView1.Rows.Count.ToString();
                        Fill_Payment();
                        ViewState["Applied"] = "";
                        ViewState["AppliedDiscount"] = 0;
                        ViewState["OnBillTotal"] = 1;
                    }
                    else { 

                        decimal lblTotalAmmount = decimal.Parse(lblTotalAmount.Text);
                        decimal discountPrice = ((lblTotalAmmount * discount) / 100);
                        decimal actualPrice = lblTotalAmmount - discountPrice;
                        if (discount2 > 0)
                        {
                            discountPrice = ((actualPrice * discount2) / 100);
                            actualPrice = actualPrice - discountPrice;
                        }
                        string finalPrice = actualPrice.ToString("F");
                        txtTotalPay.Text = String.Format("{0:0.##}", finalPrice);
                        tb_Discount.Text = Label57.Text = String.Format("{0:0.##}", (discountPrice).ToString("F"));
                        lblTotalAmount.Text = String.Format("{0:0.##}", finalPrice);
                        //    Fill_Payment();
                        ViewState["Applied"] = "";
                        ViewState["OnBillTotal"] = 1;
                        ViewState["AppliedDiscount"] = discountPrice;
                        // MessageSuccess("");
                    }
                    ViewState["PromotionID"] = PromotionId;
                    Insert_Promotion_Log("0", PromotionId, string.IsNullOrEmpty(Convert.ToString(ViewState["Applied"])) ? "0" : Convert.ToString(ViewState["Applied"]), string.IsNullOrEmpty(Convert.ToString(ViewState["AppliedDiscount"])) ? "0" : Convert.ToString(ViewState["AppliedDiscount"]), string.IsNullOrEmpty(Convert.ToString(ViewState["MaxValue"])) ? "0" : Convert.ToString(ViewState["MaxValue"]));
                }
                else {
                    MessageWarning("Offer not Valid...");
                }
            }   
        }
        public decimal calculateDiscount(String totalAmount, decimal firstdiscount , decimal seconddiscount ,out decimal discountprice) {

            decimal lblTotalAmmount = decimal.Parse(lblTotalAmount.Text);
            decimal discountPrice = ((lblTotalAmmount * firstdiscount) / 100);
            decimal actualPrice = lblTotalAmmount - discountPrice;
            if (seconddiscount > 0) {
                discountPrice = ((actualPrice * seconddiscount) / 100);
                actualPrice = actualPrice - discountPrice;
            }
            discountprice = discountPrice;
            return actualPrice;
        }
        protected void btn_CancelPromo1_Click(object sender, EventArgs e)
        {   

            Button btn = (Button)sender;
            GridViewRow gvRow = (GridViewRow)btn.Parent.Parent;
            Button btnSelect = (Button)gvRow.FindControl("btn_SelectPromo1");
            String PromotionId = gvBillTotal.DataKeys[gvRow.RowIndex].Values[9].ToString();
            String promoName = gvBillTotal.DataKeys[gvRow.RowIndex].Values[2].ToString();
            String minTrans = gvBillTotal.DataKeys[gvRow.RowIndex].Values[2].ToString();
            int RelevantID = int.Parse(gvBillTotal.DataKeys[gvRow.RowIndex].Values[8].ToString());
            String IsFreeProductPromo = gvBillTotal.DataKeys[gvRow.RowIndex].Values[7].ToString();
            string PerUserApplied = gvBillTotal.DataKeys[gvRow.RowIndex].Values[4].ToString();
            decimal MinTrans = decimal.Parse(gvBillTotal.DataKeys[gvRow.RowIndex].Values[2].ToString());
            decimal MaxTrans = decimal.Parse(gvBillTotal.DataKeys[gvRow.RowIndex].Values[3].ToString());
            decimal discount = decimal.Parse(gvBillTotal.DataKeys[gvRow.RowIndex].Values[1].ToString());
            decimal discountTimes = decimal.Parse(gvBillTotal.DataKeys[gvRow.RowIndex].Values[6].ToString());
            decimal discount2 = decimal.Parse(gvBillTotal.DataKeys[gvRow.RowIndex].Values[6].ToString());
            DL.OrderId = txtTransactionIDShow.Text;
            DL.Delete_Promotion_Log(PromotionId, txtTransactionID.Text);
            if (Convert.ToInt32(PerUserApplied) > 0)
            {
                if ((decimal.Parse(lblTotalAmount.Text) >= MinTrans) && (decimal.Parse(lblTotalAmount.Text) <= MaxTrans))
                {

                    if (IsFreeProductPromo == "YES")
                    {
                        DataTable dt = (DataTable)ViewState["CurrentTable"];
                        DataRow[] dr = dt.Select("Code='" + RelevantID + "'");
                        dr[0].Delete();
                        dt.AcceptChanges();
                        GridView1.DataSource = ViewState["CurrentTable"];
                        GridView1.DataBind();
                        Fill_Payment();
                        ViewState["Applied"] = "";
                        ViewState["AppliedDiscount"] = 0;
                        MessageSuccess(" Free Product Promo Removes... ");
                        ViewState["OnBillTotal"] = 0;
                    }
                    else
                    {
                        ViewState["OnBillTotal"] = 0;
                        Fill_Payment();
                    }
                }
               
            }
        }
        public void PrintInvoice()
        {
            lblTlp.Text = "N/A";
            lblNoTransaksi.Text = txtTransactionIDShow.Text.Trim();
            lblDate.Text = TextBox3.Text.Trim();
            lblKasir.Text = Session["empName"].ToString();
            DataSet dt = DL.FetchInvoiceDetails(txtCustomerID.Text.Trim(), Convert.ToInt32(txtTransactionIDShow.Text.Trim()));
            ddlList.DataSource = dt.Tables[0];
            ddlList.DataBind();
            lblTotalHarga.Text = Convert.ToString(dt.Tables[0].Compute("SUM(TotalPrice)", string.Empty));
            lblTotalDisc.Text = Convert.ToString(dt.Tables[0].Compute("SUM(TotalDiscount)", string.Empty));
            lblJumlahBarang.Text = Convert.ToString(dt.Tables[0].Compute("SUM(Qty)", string.Empty));
            //  lblTotal.Text = Convert.ToString(dt.Tables[0].Compute("SUM(TotalSellingPrice)", string.Empty));
            lblJenisBarang.Text = "N/A";
            lblTotalPayment.Text = Convert.ToString(dt.Tables[0].Rows[0]["TotalPay"].ToString());
            lblTotalTax.Text = Convert.ToString(dt.Tables[0].Rows[0]["Tax"].ToString());
            lblKembalian.Text = txtRefund.Text;
        //    lblCash_Kartux.Text =  
       //     lblCardNameNo.Text =
            if (dt.Tables[1].Rows.Count > 0)
            {
                foreach (DataRow dr in dt.Tables[1].Rows)
                {
                    if (dr["PaymentMode"].ToString() == "CASH")
                    {
                        lblCash_Kartux.Text = dr["Amount"].ToString();
                        //    TotalPembayaran.Text = lblTotal.Text;
                    }
                    if (dr["PaymentMode"].ToString() == "DEBIT")
                    {
                        lblCardNameNo.Text = dr["BankCard"].ToString();
                        lblBiayaTambahanKartu.Text = dr["GateWayTransaction"].ToString() + "%";
                        //  TotalPembayaran.Text = dr["Amount"].ToString();
                        lblTotalPaymemt.Text = dr["Amount"].ToString();
                    }
                    if (dr["PaymentMode"].ToString() == "CREDIT")
                    {

                    }
                }
            }
            //ScriptManager.RegisterStartupScript(this, this.GetType(), "key", "PrintDiv();", true);
        }
        protected void ImagebtnReturn_Click(object sender, ImageClickEventArgs e)
        {
            try
            {
                int result = -1;
                ImageButton ib = (ImageButton)sender;
                GridViewRow gvr = (GridViewRow)ib.NamingContainer;
                string SellsOrderItemID = GridView1.DataKeys[gvr.RowIndex].Values[3].ToString();
                string ProductID = GridView1.Rows[gvr.RowIndex].Cells[1].Text;
                string ProductName = GridView1.Rows[gvr.RowIndex].Cells[2].Text;
                TextBox lblQty = (TextBox)gvr.FindControl("tb_Qty");
                string SellingPrice = GridView1.Rows[gvr.RowIndex].Cells[8].Text;
                Label lblTotal = (Label)gvr.FindControl("lblTotal");
                txtRefund.Text = (Convert.ToDecimal(string.IsNullOrEmpty(txtRefund.Text) ? "0" : txtRefund.Text) + Convert.ToDecimal(lblTotal.Text)).ToString();
                DL.ID = SellsOrderItemID;
                hfvalue.Value = txtRefund.Text;
                DL.ReturnPrice = Convert.ToDecimal(lblTotal.Text.Trim());
                DL.ProductId = ProductID;
                DL.Qty = lblQty.Text.Trim();
                DL.AddedBy = Session["empID"].ToString();
                result = DL.ReturnOrderItem();
                if (result > 0)
                {
                    ReturnData();
                    ViewState["return"] = "1";
                    UpdateStockDetail(Convert.ToInt32(ProductID), Convert.ToInt32(lblQty.Text), 1);
                    MessageSuccess("Item Return Successfully.");
                }
                else
                {
                    MessageInfo("Item Quantity should be less than Purchased Quantity.");
                }
            }
            catch (Exception ex)
            {
                MessageInfo("Error in Return" + ex.Message);
            }
        }
        protected void txtTotalPay_TextChanged(object sender, EventArgs e)
        {

        }
    }
}