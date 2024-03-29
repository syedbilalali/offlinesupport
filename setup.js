/************Page Initial Operation ************/

function init(){

    console.log(" Intialisation... ");
    //Search Box
    window.txtSearch =  document.getElementById('txtSearch');
    window.txtTransactionID  = document.getElementById('txtTransactionIDShow');
    window.txtTransactionDate = document.getElementById('txtDate');
    window.txtCustomerID =  document.getElementById('txtCustomerID');

    //Product Fields
    window.lblProductName = document.getElementById('lblProductName');
    window.lblPrice = document.getElementById('lblPrice');
    window.lblDiscount = document.getElementById('lblDiscount');
    window.lblUOM = document.getElementById('lblUOM');
    window.productImage = document.getElementById('prodImage');

    //Rates Panel 
    window.lblItems = document.getElementById('lblItems');
    window.lblTotalAmmount = document.getElementById('lblTotalAmmount');
    window.lblTaxFee = document.getElementById('lblTaxFee');
    window.lblCashAmt = document.getElementById('lblCashAmt');
    window.lblVoucherAmmount = document.getElementById('lblVoucherAmmount');
    window.lblTotalDiscount = document.getElementById('lblTotalDiscount');
    window.lblCreditCard  = document.getElementById('lblCreditCard');
    window.lblDebitCard  = document.getElementById('lblDebitCard');
    window.lblTotalTax = document.getElementById('lblTotalTax');
    window.lblTotalPayment = document.getElementById('lblTotalPayment');
    window.lblCurrentTaxVal = document.getElementById('lblCurrentTaxVal');
    window.lblTotalTax = document.getElementById('lblTotalTax');

    //Side Rates  Panel 
    window.txtTotal  = document.getElementById('txtTotal');
    window.txtDiscount = document.getElementById('txtDiscount');
    window.txtTotalPay  = document.getElementById('txtTotalPay');
    window.txtRefund = document.getElementById('txtRefund');
    window.CurrentTax = 0;
    window.empID = "";
    window.CustomerID = "";
    window.StoreID = "";
    window.TerminalID = "";
    window.tempRefund  = 0;
    window.TempTotalPay = 0;
    window.AppliedProdPromo = 0;
    window.AppliedProdPromoID = 0;
    window.customerType = 'WALK_IN_CUSTOMER';
    window.TotalDiscount = 0;
    window.Products = [ {
        ProductID : "", 
        ProductImage : "Sorry No Product"
    }];
    window.ItemList = {
                  ItemCode : "", 
                  ItemName : "",
                  UOM : "",
                  PurQty : "" ,
                  LabelPrice : "",
                  Discount1 : "" ,
                  Discount2 : "",
                  SellingPrice : "",
                  Total : "",
                  Quantity : "",
                  ImgURL : ""
    };
    setInitialRow();
    getCurrentTax();
    //Pay Panel 
    window.txtCashAmmount = document.getElementById('txtCashAmmount');
    $("#btnSync").click( function(){
        //Load Value Into Db From  API
        //Load Product Details 
            getProductImage1();
            setTimeout(function(){
            } , 2000);
            FetchOnBillTotalPromo();
            FetchOnProductPromo();

    });
    $("#txtSearch").autocomplete({ 
        source: function (request, response) {
            response($.map(Products, function (value, key) {
                 return {
                     label: value.productID + " " + value.ProductName,
                     value: value.productID
                 }
             }))},
           select :function(event , ui){
           getData(ui.item.value , false); 
        },
        minLength: 1
    });
    $("#txtSearch").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#txtSearch").click();
            getData(txtSearch.value , false); 
        }
    });
    $("#ddlCSV").change(function(){
        var selectedCountry = $(this).children("option:selected").val();
        if(selectedCountry == "REGISTERED CUSTOMER"){
         var txtCustomerID  =  document.getElementById("txtCustomerID");
            txtCustomerID.disabled = false;
            txtCustomerID.value= "";
        } else {
            var txtCustomerID  =  document.getElementById("txtCustomerID");
            txtCustomerID.value= "WALK IN CUSTOMER";
            txtCustomerID.disabled = true;
        }
    });
    window.txtTransactionID.text = makeid(9);
    var txtDate = document.getElementById('txtDate');
    var date = new Date();
    txtDate.value = toJSONLocal(date);
    console.log(" Transaction ID " + window.txtTransactionID);
}
/************** End of the Page Initialisation ****************/


/*************** Table Operations   **************************/
function onlineActivity(){
    console.log(" Now Net is Online");
    getCurrentTaxValue(function(value){
        console.log(" Value Is the " + value);
        window.CurrentTax = value;
    });
    window.Products.length = 0;
    console.log(" Getting Product Image !!! ");
    getProductImage2();
    console.log(" Getting Bill Offers !!! ");
    FetchBillOffersFromOnline();
    console.log(" Sending Data to Server... ");
    sendSellsOrderItemtoServer();
}
function offlineActivity(){ 
    console.log(" Now Net is Offline");
    loadProductFromDB();
}
function getData( ProductID , freeproduct){
   // alert(" Get Data -: " + ProductID);
    read("ProductImage" , ProductID , function(result){ 
        console.log(" ProductName is " + result.ProductName  + " Product ID " + result.productID );
        var y = ItemList = {
            ItemCode : result.productID, 
            ItemName : result.ProductName,
            UOM : result.unitOfMeasurement,
            PurQty : result.Qty ,
            LabelPrice : result.Price,
            Discount1 : result.Discount ,
            Discount2 : "",
            SellingPrice : result.Price,
            Total : "",
            Quantity : result.Quantity,
            ImgURL :  result.image
        }
       // alert(" Add Product TO the Cart ... " + y.PurQty);
       if(y.Quantity != 0 && y.Quantity > 0){
        setProductInfo(y);
        checkProdOffer(y.ItemCode , function(flag){ 
            console.log("Is ProdUct Offer Avail -:"  + flag); 
            console.log(" Avail Qty " + y.Quantity  + " Putting Qty " + y.PurQty);
            setDummyRow(y , flag , freeproduct);
            updateRow();
            fillPayment();
        }); 
    } else { SweetAlertInfo(" No Stock Available !!! "); }      
    });
}
function deleteTableRows(){
    var table1 = document.getElementById("CartTable");
    var row = table1.rows;
    for(var i=1; i<table1.rows.length; i++){
        document.getElementById("CartTable").deleteRow(i);
    }
}
function removeEmptyRow(){
    var table1 = document.getElementById("CartTable");
    var row = table1.rows;
    if(row[1].cells[0].innerHTML == "No Products Added.."){
        document.getElementById("CartTable").deleteRow(1);    
    }
}
function setEmptyRow(){
    var table1 = document.getElementById("CartTable");
    var row = table1.insertRow(1);
    row.style.backgroundColor = "White";
    row.style.color = "Black";
    var cell1 = row.insertCell(0);
    cell1.colSpan  = "11";
    cell1.innerHTML = "No Products Added..";
}
// Transaction Canceled 
function showMsg(){
    SweetAlertInfo(" Transaction Canceled... ");
    clearAllFields();
 removeAllRow();
}
function setHeader(){
    var table1 = document.getElementById("CartTable");
    var row = table1.insertRow(-1);
    row.style.backgroundColor = "#5D7B9D";
    row.style.color = "White";
    row.style.fontWeight  = "Bold";
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);
    var cell8 = row.insertCell(7);
    var cell9 = row.insertCell(8);
    var cell10 = row.insertCell(9);
    var cell11 = row.insertCell(10);
    cell1.innerHTML = "S.No";
    cell2.innerHTML = "Code";
    cell3.innerHTML = "Item Name";
    cell4.innerHTML = "UOM";
    cell5.innerHTML = "Purchase Qty";
    cell6.innerHTML = "Label Price";
    cell7.innerHTML = "Discount 1st";
    cell8.innerHTML = "Discount 2nd";
    cell9.innerHTML = "Selling Price";
    cell10.innerHTML = "Total";
    cell11.innerHTML = "Action";
}
var demo = [
    { 
        SNo : '1' , Code : '1234' , ItemName : 'Puma Shoes' , UOM : 'Pairs' , PurchaseQty  : '2' , LabelPrice: '1230' , Discount1 : '0.00' , Discount2 :'0.00' , SellingPrice : '1240', Total : '1230' , Action : '' }
];
function setHeader1(Products){
   var table1 = document.getElementById("CartTable");
   var row = table1.insertRow(-1);
   var col = [];
   for (var i = 0; i < Products.length; i++) {
       console.log(" Value on i - " + i + " is " + Products[i]);
       for (var key in Products[i]) {
           if (col.indexOf(key) === -1) {
               col.push(key);
           }
       }
   }
   for (var h = 0; h < col.length; h++) {
       // ADD TABLE HEADER.
       var th = document.createElement('th');
       th.innerHTML = col[h].replace('_', ' ');
       row.appendChild(th);
       row.style.backgroundColor = "#5D7B9D";
       row.style.color = "White";
       row.style.fontWeight  = "Bold";
   }
}
function setDummyRow(ItemList , discOffer , freeproduct){
    console.log(" %c Product is Adding... " , "color:BLUE;");
    removeEmptyRow();
    var table1 = document.getElementById("CartTable");
    console.log(table1.rows.length);
    var addprodflag = 1;
    console.log("Prod Flag Value -: " + addprodflag);
    if(table1.rows.length > 1) {
        for(var i=1; i<table1.rows.length; i++){
            console.log(" %c Row " , "color:BLUE;");
            console.log(" Value is " + table1.rows[i].cells[1].innerHTML);
            if(table1.rows[i].cells[1].innerHTML == ItemList.ItemCode){

                var str = table1.rows[i].cells[4].innerHTML;
                var sellingPrice  = table1.rows[i].cells[8].innerHTML;
                var getQty  = table1.rows[i].cells[4].getElementsByTagName("input")[0].value;
                var current_Qty = (parseInt(getQty ) + parseInt(1));
                console.log(" Current input Html -: " + str);

                if(current_Qty <= ItemList.Quantity ){
                    
                    console.log(" Current P Qty -: " + current_Qty);
                var res1 = 'value="' + current_Qty  + '"';
                var rep1 = 'value="'+ getQty +'"';
                var replace = str.replace(rep1, res1);
                console.log(" Current input Html -: " + replace);

                table1.rows[i].cells[4].innerHTML = replace;
                addprodflag = 0;
                console.log(" Prod Flag Value -: " + addprodflag);
           //     alert(" Selling Price " +  sellingPrice);
                var cur_selling_price = parseFloat(current_Qty) * parseFloat(sellingPrice);
                table1.rows[i].cells[9].innerHTML =  cur_selling_price.toFixed(2);
                } else {
                    SweetAlertInfo(" Purchase Quantity can't added more. ");
                }     
                return;

            } else {

               addprodflag = 1;
               console.log(" Prod Flag Value -: " + addprodflag);
            }
        }
    }
    if(addprodflag == 1){
        var row = table1.insertRow(table1.rows.length);
        row.style.backgroundColor = "#F7F3F6";
        row.style.color = "#333333";
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);
        var cell8 = row.insertCell(7);
        var cell9 = row.insertCell(8);
        var cell10 = row.insertCell(9);
        var cell11 = row.insertCell(10);
        if(freeproduct){
            cell1.innerHTML = table1.rows.length -1 ;
            cell2.innerHTML = ItemList.ItemCode;
            cell3.innerHTML = ItemList.ItemName;
            cell4.innerHTML = ItemList.UOM;
            cell5.innerHTML =  "<input type='numbers' id='qty_"+ table1.rows.length+"' onchange='validate(this)' value='1' style='width:50px;'>" + "<b>/</b><span id='spanqty_"+ table1.rows.length+"'>" + ItemList.Quantity + "</span>";
            cell6.innerHTML = "0.00";
            cell7.innerHTML = "<span id='disc_"+ table1.rows.length +"'> Free </span>";
            cell8.innerHTML = "0.00";
            cell9.innerHTML =  "0.00";
            cell10.innerHTML = "0.00";
            var cur_row  =  table1.rows.length - 1;
            cell11.innerHTML =  "<input type='image' name='imagebutton' src='img/img/Remove.png' style='height:20px;width:20px;' onclick='removeRow("+ cur_row  +")'>";
        } else {

            cell1.innerHTML = table1.rows.length -1 ;
            cell2.innerHTML = ItemList.ItemCode;
            cell3.innerHTML = ItemList.ItemName;
            cell4.innerHTML = ItemList.UOM;
            cell5.innerHTML =  "<input type='numbers' id='qty_"+ table1.rows.length+"' onchange='validate(this)' value='1' style='width:50px;'>" + "<b>/</b><span id='spanqty_"+ table1.rows.length+"'>" + ItemList.Quantity + "</span>";
            cell6.innerHTML = ItemList.LabelPrice;
            if(discOffer){
               disc = "<input type='image' id='img_" + table1.rows.length +"' name='imagebutton'  data-popup-open='popup-3' onclick='offerClick(this);'  src='img/img/discount.png' style='height:20px;width:20px;'>";
            }else{ 
                disc = "";
            }
            cell7.innerHTML = "<span id='disc_"+ table1.rows.length +"'>"+ ItemList.Discount1 +"</span>" + disc;
            cell8.innerHTML = "0.00";
            cell9.innerHTML =  ItemList.PurQty * ItemList.LabelPrice;
            cell10.innerHTML = ItemList.PurQty * ItemList.LabelPrice;
            var cur_row  =  table1.rows.length - 1;
            cell11.innerHTML =  "<input type='image' name='imagebutton' src='img/img/Remove.png' style='height:20px;width:20px;' onclick='removeRow("+ cur_row  +")'>";
        }
      
    }
}
var prodOffers = [];
function applyProductPromo(data){
    
    var productID1 = data.id;
    var offer_row = data; 
    var row = data.parentNode.parentNode;
    var promotionID = row.cells[0].innerHTML;
    var productID  = row.cells[1].innerHTML;
    var peruserApplied = 0;
    var Buy =0, Get= 0 , Additional_Value =0;
    var select_rows = data.parentNode.parentNode;
    var values = select_rows.cells[0].innerHTML;
    var table1 = document.getElementById("CartTable");
    var row1 = table1.rows;
    var discountPromoPrice = 0;
    var temp_promotion_ID = 0 ; 
    alert("Product ID "+ productID1 +"Promotion ID " + row.cells[0].innerHTML +"\n Offer is " + row.cells[3].innerHTML);
    if(data.value == "Apply Promo"){
        read("ProdOffers", productID1 , function(data){
        console.log(" Apply Promotion Offers Values -: " + JSON.stringify(data));
        prodOffers.push(JSON.stringify(data));
        console.log("Promotion ID "  + data.promotionID);
        temp_promotion_ID = data.PromotionID;
        console.log("Buy  "  + data.Buy);
        console.log("Get  "  + data.Get);
        console.log("Additional Value   "  + data.AddtionalValue);
        console.log("Max Value   "  + data.MaxValue);
        console.log("Min Value   "  + data.MinTrans);
        console.log("PerUserApplied    "  + data.PerUserApplied);
        console.log("ProdPromoType :"  + data.ProdPromoType);
        console.log("GetType :"  + data.GetType);
        console.log(" Adding Price " + data.AddingPrice);
        console.log(" Table Product ID " + row1[1].cells[1].innerHTML);
        console.log( " Before Applied User  " );
        var current_row;
        for(var i=1; i<row1.length; i++){
           console.log("Row Cell Value " + row1[i].cells[1].innerHTML + " Product ID " + productID1);
           if(row1[i].cells[1].innerHTML == productID1){
                current_row = row1[i];
           }
        }
        if(parseFloat(data.PerUserApplied) > 0){
            console.log(" After User applied ");
            if(data.ProdPromoType === " BuyGet "){
                console.log(" Inside The BuyGet ");
                if(data.GetType === "Quantity"){
                    alert(" Buy Get Quantity Offers Rows Values is  " + current_row.cells[1].innerHTML);
                    alert(" Buy " + data.Buy + "  Get " + data.Get);
                    var getQty  = current_row.cells[4].getElementsByTagName("input")[0].value;
                    console.log(" Purchase Qty -: " + getQty);
                    if(getQty >= data.Buy){
                        alert(" Quantity Is Greater ");
                        var str = current_row.cells[4].innerHTML
                        console.log(" Current input Html -: " + str);
                        var current_Qty = (parseInt(getQty) + parseInt(data.Get));
                        console.log(" Current P Qty -: " + current_Qty);
                        var res1 = 'value="' + current_Qty  + '"';
                        var rep1 = 'value="'+ getQty +'"';
                        var replace = str.replace(rep1, res1);
                        console.log(" Current input Html -: " + replace);
                        current_row.cells[4].innerHTML = replace;
                        fillPayment();
                        var row =  offer_row.parentNode.parentNode;
                        var btn = row.cells[4].getElementsByTagName('input')[0];
                        btn.style.backgroundColor = "YELLOW";
                        btn.value = "Cancel Promo";
                        console.log(" Value is the " + btn);
                        row.cells[4].appendChild(btn);
                        console.log(" Successfully Offer Applied !!! Applied " + window.AppliedProdPromo + " Promotion " + window.AppliedProdPromoID + " Data Promoiton " + data.PromotionID + " Temp Promotion Id " + temp_promotion_ID);
                        window.AppliedProdPromo = 1;
                        window.AppliedProdPromoID = data.PromotionID;
                    }else{
                        alert(" Buy Quantity Is Less Then Offers ");
                    }
                }
                if(data.GetType === "Percentage"){

                    alert(" Offer BuyGet on Percentage.... ");
                    console.log(" Data is -: " + data.get);
                    var getQty  = current_row.cells[4].getElementsByTagName("input")[0].value;
                    var product_price = current_row.cells[5].innerHTML
                    console.log(" Current Qty " + getQty);
                    if(getQty >= data.Buy){
                        alert(" Percentage Beign Applied ... " + data.Buy + " Get Percentage  " + data.Get);
                        alert(" Current Prcie Of the " + product_price);
                        var discount_val = parseFloat(data.Get) / 100 ;
                        alert(" Discunt Val " + discount_val);
                        var min_disc = parseFloat(product_price) * parseFloat(discount_val);
                        alert(" Min Discount " + min_disc);
                        var actual_price = parseFloat(product_price) - parseFloat(min_disc);    
                        alert(" Actual Discount " +  actual_price.toFixed(2)  + " Discount Is " + min_disc + " Product Price " + product_price);
                        //chnage the str image and replace str. 
                        var spandata = current_row.cells[6].getElementsByTagName("input")[0]; 
                        current_row.cells[6].innerHTML = min_disc.toFixed(2);
                        current_row.cells[6].appendChild(spandata);
                        current_row.cells[9].innerHTML = actual_price.toFixed(2);
                        fillPayment();
                        var row =  offer_row.parentNode.parentNode;
                        var btn = row.cells[4].getElementsByTagName('input')[0];
                        btn.style.backgroundColor = "YELLOW";
                        btn.value = "Cancel Promo";
                        console.log(" Value is the " + btn);
                        row.cells[4].appendChild(btn);
                        console.log(" Successfully Offer Applied !!! Applied " + window.AppliedProdPromo + " Promotion " + window.AppliedProdPromoID + " Data Promoiton " + data.PromotionID + " Temp Promotion Id " + temp_promotion_ID);
                        window.AppliedProdPromo = 1;
                        window.AppliedProdPromoID = data.PromotionID;
                    }
                }
            }
            if(data.ProdPromoType === " Adding Value "){
                    alert(" Adding Value Promotion is Added ");
                    alert(" Buy " + data.Buy + "  Get " + data.Get);
                    alert(" Additional Value " + data.AddtionalValue  + " Adding Price " + data.AddingPrice);
                    var getQty  = current_row.cells[4].getElementsByTagName("input")[0].value;
                    if(getQty >= data.Buy){

                        alert(" Quantity Is Greater ");
                        var str = current_row.cells[4].innerHTML
                        console.log(" Current input Html -: " + str);
                        var current_Qty = (parseInt(getQty) + parseInt(data.Get));
                        console.log(" Current P Qty -: " + current_Qty);
                        var res1 = 'value="' + current_Qty  + '"';
                        var rep1 = 'value="'+ getQty +'"';
                        var replace = str.replace(rep1, res1);
                        console.log(" Current input Html -: " + replace);
                        current_row.cells[4].innerHTML = replace;
                        var current_total_Price = current_row.cells[9].innerHTML
                        current_row.cells[9].innerHTML = parseFloat(current_total_Price) + data.AddtionalValue;
                        fillPayment();
                        var row =  offer_row.parentNode.parentNode;
                        var btn = row.cells[4].getElementsByTagName('input')[0];
                        btn.style.backgroundColor = "YELLOW";
                        btn.value = "Cancel Promo";
                        console.log(" Value is the " + btn);
                        row.cells[4].appendChild(btn);
                        console.log(" Successfully Offer Applied !!! Applied " + window.AppliedProdPromo + " Promotion " + window.AppliedProdPromoID + " Data Promoiton " + data.PromotionID + " Temp Promotion Id " + temp_promotion_ID);
                        window.AppliedProdPromo = 1;
                        window.AppliedProdPromoID = data.PromotionID;
                    } 
            }
            if(data.ProdPromoType === " Special Price "){
                alert(" Special Price Promotion is Adding ");
                current_row.cells[9].innerHTML = data.AddingPrice;
                fillPayment();
                var row =  offer_row.parentNode.parentNode;
                var btn = row.cells[4].getElementsByTagName('input')[0];
                btn.style.backgroundColor = "YELLOW";
                btn.value = "Cancel Promo";
                console.log(" Value is the " + btn);
                row.cells[4].appendChild(btn);
                console.log(" Successfully Offer Applied !!! Applied " + window.AppliedProdPromo + " Promotion " + window.AppliedProdPromoID + " Data Promoiton " + data.PromotionID + " Temp Promotion Id " + temp_promotion_ID);
                window.AppliedProdPromo = 1;
                window.AppliedProdPromoID = data.PromotionID;
            }
        }
    });
    }else{

        alert(" Cancel the Promotion ... ");
        read("ProdOffers", productID1 , function(data){
            console.log(" Apply Promotion Offers Values -: " + JSON.stringify(data));
            prodOffers.push(JSON.stringify(data));
            console.log("Promotion ID "  + data.promotionID);
            temp_promotion_ID = data.PromotionID;
            console.log("Buy  "  + data.Buy);
            console.log("Get  "  + data.Get);
            console.log("Additional Value   "  + data.AddtionalValue);
            console.log("Max Value   "  + data.MaxValue);
            console.log("Min Value   "  + data.MinTrans);
            console.log("PerUserApplied    "  + data.PerUserApplied);
            console.log("ProdPromoType :"  + data.ProdPromoType);
            console.log("GetType :"  + data.GetType);
            console.log(" Adding Price " + data.AddingPrice);
            console.log(" Table Product ID " + row1[1].cells[1].innerHTML);
            console.log( " Before Applied User  " );
            var current_row;
            for(var i=1; i<row1.length; i++){
               console.log("Row Cell Value " + row1[i].cells[1].innerHTML + " Product ID " + productID1);
               if(row1[i].cells[1].innerHTML == productID1){
                    current_row = row1[i];
               }
            }
            if(parseFloat(data.PerUserApplied) > 0){
                console.log(" After User applied ");
                if(data.ProdPromoType === " BuyGet "){
                    console.log(" Inside The BuyGet ");
                    if(data.GetType === "Quantity"){
                        alert(" Buy Get Quantity Offers Rows Values is  " + current_row.cells[1].innerHTML);
                        alert(" Buy " + data.Buy + "  Get " + data.Get);
                        var getQty  = current_row.cells[4].getElementsByTagName("input")[0].value;
                        console.log(" Purchase Qty -: " + getQty);
                        if(getQty >= data.Buy){
                            alert(" Quantity Is Greater ");
                            var str = current_row.cells[4].innerHTML
                            console.log(" Current input Html -: " + str);
                            var current_Qty = (parseInt(getQty) - parseInt(data.Get));
                            console.log(" Current P Qty -: " + current_Qty);
                            var res1 = 'value="' + current_Qty  + '"';
                            var rep1 = 'value="'+ getQty +'"';
                            var replace = str.replace(rep1, res1);
                            console.log(" Current input Html -: " + replace);
                            current_row.cells[4].innerHTML = replace;
                            fillPayment();
                            var row =  offer_row.parentNode.parentNode;
                            var btn = row.cells[4].getElementsByTagName('input')[0];
                            btn.style.backgroundColor = "#FF0033";
                            btn.value = "Apply Promo";
                            console.log(" Value is the " + btn);
                            row.cells[4].appendChild(btn);
                            console.log(" Successfully Offer Applied !!! Applied " + window.AppliedProdPromo + " Promotion " + window.AppliedProdPromoID + " Data Promoiton " + data.PromotionID + " Temp Promotion Id " + temp_promotion_ID);
                            window.AppliedProdPromo = 0;
                            window.AppliedProdPromoID = 0;
                        }else{
                            alert(" Buy Quantity Is Less Then Offers ");
                        }
                    }
                    if(data.GetType === "Percentage"){
    
                        alert(" Offer BuyGet on Percentage.... ");
                        console.log(" Data is -: " + data.get);
                        var getQty  = current_row.cells[4].getElementsByTagName("input")[0].value;
                        var product_price = current_row.cells[5].innerHTML
                        console.log(" Current Qty " + getQty);
                        if(getQty >= data.Buy){

                            alert(" Percentage Beign Applied ... " + data.Buy + " Get Percentage  " + data.Get);
                            alert(" Current Prcie Of the " + product_price);
                            var discount_val = parseFloat(data.Get) / 100 ;
                            alert(" Discunt Val " + discount_val);
                            var min_disc = parseFloat(product_price) * parseFloat(discount_val);
                            alert(" Min Discount " + min_disc);
                            var actual_price = parseFloat(product_price) + parseFloat(min_disc);  
                            var normal_price =   
                            alert(" Actual Discount " +  actual_price.toFixed(2)  + " Discount Is " + min_disc + " Product Price " + product_price);
                            //chnage the str image and replace str. 
                            var spandata = current_row.cells[6].getElementsByTagName("input")[0]; 
                            current_row.cells[6].innerHTML = 0;
                            current_row.cells[6].appendChild(spandata);
                            current_row.cells[9].innerHTML = product_price;
                            fillPayment();
                            var row =  offer_row.parentNode.parentNode;
                            var btn = row.cells[4].getElementsByTagName('input')[0];
                            btn.style.backgroundColor = "#FF0033";
                            btn.value = "Apply Promo";
                            console.log(" Value is the " + btn);
                            row.cells[4].appendChild(btn);
                            window.AppliedProdPromo =0;
                            window.AppliedProdPromoID = 0;
                        }
                    }
                }
                if(data.ProdPromoType === " Adding Value "){
                    
                        alert(" Adding Value Promotion is Added ");
                        alert(" Buy " + data.Buy + "  Get " + data.Get);
                        alert(" Additional Value " + data.AddtionalValue  + " Adding Price " + data.AddingPrice);
                        var getQty  = current_row.cells[4].getElementsByTagName("input")[0].value;
                        if(getQty >= data.Buy){
    
                            alert(" Quantity Is Greater ");
                            var str = current_row.cells[4].innerHTML
                            console.log(" Current input Html -: " + str);
                            var current_Qty = (parseInt(getQty) + parseInt(data.Get));
                            console.log(" Current P Qty -: " + current_Qty);
                            var res1 = 'value="' + current_Qty  + '"';
                            var rep1 = 'value="'+ getQty +'"';
                            var replace = str.replace(rep1, res1);
                            console.log(" Current input Html -: " + replace);
                            current_row.cells[4].innerHTML = replace;
                            var current_total_Price = current_row.cells[9].innerHTML
                            current_row.cells[9].innerHTML = parseFloat(current_total_Price) - data.AddtionalValue;
                            fillPayment();
                            var row =  offer_row.parentNode.parentNode;
                            var btn = row.cells[4].getElementsByTagName('input')[0];
                            btn.style.backgroundColor = "#FF3300";
                            btn.value = "Apply Promo";
                            console.log(" Value is the " + btn);
                            row.cells[4].appendChild(btn);
                            window.AppliedProdPromo = 0;
                            window.AppliedProdPromoID = 0;
                        } 
                }
                if(data.ProdPromoType === " Special Price "){
                    alert(" Special Price Promotion is Adding ");
                    var actual_price = current_row.cells[5].innerHTML; 
                    current_row.cells[9].innerHTML = actual_price;
                    fillPayment();
                    var row =  offer_row.parentNode.parentNode;
                    var btn = row.cells[4].getElementsByTagName('input')[0];
                    btn.style.backgroundColor = "#FF0033";
                    btn.value = "Apply Promo";
                    console.log(" Value is the " + btn);
                    row.cells[4].appendChild(btn);
                    window.AppliedProdPromo = 0;
                    window.AppliedProdPromoID = 0;
                }
            }
        });
    }
}
var selectedRow ;
function validate(val){
  //Check the Value of the Purchase Quantity. 
  var table1 = document.getElementById("CartTable");
  var input = document.getElementById(val.id); 
  var res = val.id.split("_");
  var row = table1.rows[res[1]-1].cells[5].innerHTML;
  var qty = input.value;
  var current_row = input.parentNode.parentNode;
  var stock_qty =  current_row.cells[4].innerText.replace ( /[^\d.]/g, '' );
  var product_price =  current_row.cells[5].innerHTML;

  //console.log(" Req Qty  -: " + qty + " Avail Qty _:" + stock_qty + " Product Price " + product_price);
   if(qty.match(/^[0-9]+$/) != null){
       if(parseInt(qty) <= parseInt(stock_qty)){
            var totalprice  =  parseInt(qty) * parseFloat(product_price);
            current_row.cells[9].innerHTML = totalprice
            var str = current_row.cells[4].innerHTML
            console.log(" Current input Html -: " + str);
            var res1 = 'value="' + qty + '"';
            var replace = str.replace('value="1"', res1);
            console.log(" Current input Html -: " + replace);
            current_row.cells[4].innerHTML = replace;
            fillPayment();
       }else {
            SweetAlert(" Please Enter Less Quantity... ");
            input.value = "0";
            var totalprice  =  parseInt(0) * parseFloat(product_price);
            current_row.cells[9].innerHTML = totalprice    
       }
   }else {

       SweetAlert(" Please Enter Valid Number !!! ");
       input.value = "0";
       var totalprice  =  parseInt(0) * parseFloat(product_price);
       current_row.cells[9].innerHTML = totalprice
   }
}
function applyBillPromo(btn){

    var  row = btn.parentNode.parentNode;
    var promotionID  = row.cells[0].innerHTML;
    var lblTotalAmount = document.getElementById("lblTotalAmount");
    var txtTotalPay = document.getElementById("txtTotalPay");
    var totalDiscount = document.getElementById("lblTotalDiscount");
  //  alert("Promotion ID "+ promotionID);
    if(btn.value == "Apply Promo"){
        read("BillOffers" ,parseInt(promotionID , 10) , function(data){
            // console.log("  Data of the Apply Bill Promo " + JSON.stringify(data));
            if(data.PerUserApplied  > 0 ){
              //  console.log(" Min Trans " + data.MinTrans + " Max Value " + data.MaxValue + " lblTotalAmmount " + lblTotalAmount.innerHTML);
                if(parseFloat(lblTotalAmount.innerHTML)  >=  data.MinTrans  && parseFloat(lblTotalAmount.innerHTML) <= data.MaxValue ){
                   // alert(" Valid Offers Is Found >>> ");
                if(data.IsProductFree == "YES"){
                  //  alert(" Add New Free Row in  the Table " + data.RelevantID);
                    getData(data.RelevantID, true);
                 //  alert(" Apply Promo Name " +  data.FriendlyName );
                   var btnApply = row.cells[4].getElementsByTagName('input')[0];
                   btnApply.style.backgroundColor = "YELLOW";
                   btnApply.value = "Cancel Promo";
                   console.log(" Value is the " + btn);
                   row.cells[4].appendChild(btn);
                   window.AppliedProdPromo = 1;
                   window.AppliedProdPromoID = data.ID;
                    
                }else {
                     //Provide the Discount ...
                  //   alert(" Apply Promo Name " + data.FriendlyName);
                     var seconddistotal = 0.00;
                     var discountprice = (parseFloat(lblTotalAmount.innerHTML) * parseFloat(data.Discount)) / 100;
                     var actualPrice  = parseFloat(lblTotalAmount.innerHTML) - discountprice;
                     seconddistotal = discountprice;
                     console.log(" Discount Price " + discountprice); 
                     if(parseFloat(data.Discount2) > 0){
                         discountprice = ((actualPrice * parseFloat(data.Discount2)) / 100);
                         actualPrice = actualPrice - discountprice;
                         seconddistotal += discountprice;
                     }
                     var finalprice = actualPrice.toFixed(2);
                     lblTotalAmount.innerHTML = finalprice;
                     txtTotalPay.innerHTML = finalprice;
                     totalDiscount.innerHTML = seconddistotal.toFixed(2);
                     var btnApply = row.cells[4].getElementsByTagName('input')[0];
                     btnApply.style.backgroundColor = "YELLOW";
                     btnApply.value = "Cancel Promo";
                     console.log(" Value is the " + btn);
                     row.cells[4].appendChild(btn);
                     window.AppliedProdPromo = 1;
                     window.AppliedProdPromoID = data.ID;
     
                }
             }
            }
         });

    } else{
      //  alert(" Cancel Bill Promotion.. ");
        read("BillOffers" ,parseInt(promotionID , 10) , function(data){
            // console.log("  Data of the Apply Bill Promo " + JSON.stringify(data));
            if(data.PerUserApplied  > 0 ){
              //  console.log(" Min Trans " + data.MinTrans + " Max Value " + data.MaxValue + " lblTotalAmmount " + lblTotalAmount.innerHTML);
                //    alert(" Valid Offers Is Found >>> ");
                if(data.IsProductFree == "YES"){
                      //  alert(" Add New Free Row in  the Table " + data.RelevantID);
                      // getData(data.RelevantID);
                 //   alert(" Apply Promo Name " +  data.FriendlyName);
                    var table1 = document.getElementById("CartTable");
                    var prod_row = table1.rows;
                    console.log(" Table Row Length  " +  prod_row.length)
                    for(var i=1; i<prod_row.length; i++){
                        console.log("Name  " + prod_row[i].cells[6].innerText);
                        if(prod_row[i].cells[6].innerText == "Free"){
                            removeRow(i);
                            break;
                        }                       
                    }
                    var btnApply = row.cells[4].getElementsByTagName('input')[0];
                    btnApply.style.backgroundColor = "#FF0033";
                    btnApply.value = "Apply Promo";
                    console.log(" Value is the " + btn);
                    row.cells[4].appendChild(btn);
                    window.AppliedProdPromo = 0;
                    window.AppliedProdPromoID = 0;
                    
                }else {
                     //Provide the Discount ...
                   //  alert(" Apply Promo Name " + data.FriendlyName);
                     var distotalAmount = parseFloat( lblTotalAmount.innerHTML);
                     var discountAmt =  parseFloat(totalDiscount.innerHTML);
                    console.log(" Dis Total Amt  " + distotalAmount);
                    console.log(" Dis  " + discountAmt);
                     var finalprice = (distotalAmount + discountAmt);
                     lblTotalAmount.innerHTML = finalprice.toFixed(2);
                     txtTotalPay.innerHTML = finalprice;
                     totalDiscount.innerHTML = "0.00";
                     var btnApply = row.cells[4].getElementsByTagName('input')[0];
                     btnApply.style.backgroundColor = "#FF0033";
                     btnApply.value = "Apply Promo";
                     console.log(" Value is the " + btn);
                     row.cells[4].appendChild(btn);
                     window.AppliedProdPromo = 0;
                     window.AppliedProdPromoID = 0;
     
                }
             }
         });
    }
    console.log("Applying Bill Promno .... " +   promotionID);
}
function updateRow(selectRow){
    var table1 = document.getElementById("CartTable");
}
function removeRow(item){

    var table1 = document.getElementById("CartTable");
    var row = table1.rows;
    if(row.length > 0 ){
       // SweetAlertSuccess(" Item Removed Successfully..    ");
        document.getElementById("CartTable").deleteRow(item);
        updateRow();
        if(row.length==1){
            setEmptyRow();
            clearAllFields();
        }
    }
    fillPayment();
}
function updateRow(){
   var table1 = document.getElementById("CartTable");
   console.log(" Total Rows -: " + table1.rows.length);
   console.log(" Total Cells -: " + table1.rows[0].cells.length);
   for(var i=1; i<table1.rows.length; i++){
       table1.rows[i].cells[10].innerHTML = "<input type='image' name='imagebutton' src='img/img/Remove.png' style='height:20px;width:20px;' onclick='removeRow("+ i +")'>";
   }
}
function offerClick(val){
    var row = val.parentNode.parentNode;
    var productID  = row.cells[1].innerHTML;
    console.log(" AppliedProdPrmomo -:"  + window.AppliedProdPromo);
    console.log(" AppliedProdPrmomo -:"  + window.AppliedProdPromoID);
        read("ProdOffers" ,  productID , function(data){

            if(data != "No"){   
               var offertable = document.getElementById("gvBillTotal");
                   for(var i=1; i<offertable.rows.length; i++){
                           offertable.deleteRow(i);
               }
               var row = offertable.insertRow(offertable.rows.length);
               row.style.backgroundColor = "#FFF7E7";
               row.style.color = "#8C4510";
               var cell0 = row.insertCell(0);
               var cell1 = row.insertCell(1);
               var cell2 = row.insertCell(2);
               var cell3 = row.insertCell(3);
               var cell4 = row.insertCell(4);
               cell0.innerHTML = data.PromotionID
               cell1.innerHTML = data.Discount
               cell2.innerHTML = data.FriendlyName;
               cell3.innerHTML = data.Scheme;
               console.log("After Offer Applied " + data.PromotionID + " Window Applied Offer ID " + window.AppliedProdPromoID );
               if(window.AppliedProdPromo == 1 && window.AppliedProdPromoID == data.PromotionID){
                     console.log(" After Applied  Cancel the Operation");
                     cell4.innerHTML = "<input type='submit' name='applyBillPrdouctPromo' value='Cancel Promo' onclick='applyProductPromo(this)' id='"+productID+"' style='background-color:YELLOW;'>";
                     $('[data-popup="popup-4"]').fadeIn(350);
                    }else if(window.AppliedProdPromo == 1 && window.AppliedProdPromoID != data.PromotionID ){
                        cell4.innerHTML = "<input type='submit' name='applyBillPrdouctPromo' value='Wait...' onclick='applyProductPromo(this)' id='"+productID+"' style='background-color:#FF9933;'>";
                        $('[data-popup="popup-4"]').fadeIn(350);
                    }else{
                    console.log("Before Applied ");
                    cell4.innerHTML = "<input type='submit' name='applyBillPrdouctPromo' value='Apply Promo' onclick='applyProductPromo(this)' id='"+productID+"' style='background-color:#FF0033;'>";
                    $('[data-popup="popup-4"]').fadeIn(350);
               }       
            }else {
                       SweetAlertWarning(" No Offer Found... ");
            }
       });
}

function getRow(index){
   var table1 = document.getElementById("CartTable");
   if(index < table1.rows.length){
       console.log(table1.rows[index].cells[1].innerHTML);
   }
}
/*************** ENd Table Operations ***********************/

/**************** Main Program Operation *******************/
var x;
$(document).ready(function(){

     console.log(" Main Is Running.... ");
     init(); 
     clearAllFields();
     setHeader1(demo);
     setEmptyRow();
     var check = navigator.onLine ? "online" : "offline";
     var div = document.getElementById("offChng");
     if(check === "online"){

        div.style.backgroundColor = "red";
        alert(" Current Net Status is " + check);
        console.log(" Get Product Images ");
        getProductImage2();
        getProductPics();
        console.log("Get Bill Offers Into DB  ");
        FetchBillOffersFromOnline();
        console.log(" Get Product Promo Data ");
        ProductPromoData();
     }else {
        div.style.backgroundColor = "yellow";
        console.log(" Net is offline ");
        alert(" Current Net Status is " + check);
        loadProductFromDB();

     }
});
/*************** End Of the Main Program ********************/

/************** Page Funcstionality  ************************/
function setProductInfo(ItemList){
    //Product Info..
    document.getElementById('lblProductName').innerText = ItemList.ProductName;
    document.getElementById('lblPrice').innerText = ItemList.LabelPrice;
    document.getElementById('lblStock').innerText = ItemList.PurQty;
    document.getElementById('lblDiscount').innerText = ItemList.Discount;
    document.getElementById('lblUOM').innerText = ItemList.UOM;
     getImageURLFROMDB(ItemList.ImgURL , function(uri){
        document.getElementById('prodImage').src = uri;
    });
}
function setInitialRow(){
    if(sessionStorage){
       // sessionStorage.setItem("StoreID", "104");
       //  sessionStorage.setItem("EmpID", "103");
     //   alert(" Value Is  - " +  sessionStorage.getItem("Hello"));
    }else {
        alert("You Browser does not support...");
    }
 }
 //Page Load Function 
 function pageload(){
    clearAllFields();
 }
 function getTimeStamp(){
    var d = new Date();
    var n = d.toISOString();
    return  n.replace("Z"," ").replace("T"," "); 
 }
 function isProductInList(){
    var table1 = document.getElementById("CartTable");
    if(table1.rows.length > 1){
        console.log();
        if(table1.rows[1].cells[0].innerHTML == "No Products Added.."){
            return false;
        }
    }
    return true;
 }
function doHold(){
    //Holding the Value.
    var table1 = document.getElementById("CartTable");
    var ddlCSV = document.getElementById('ddlCSV');
    var row = table1.rows;
    var transactionID  = txtTransactionID.value;
    if(!isProductInList()){
        SweetAlertInfo(" No Product to Hold !!! ");
        return;
    }
    if((ddlCSV.selectedIndex  > 0) || (ddlCSV.selectedIndex == 0) ){
        if((txtCustomerID.value != "" || (ddlCSV.selectedIndex==0))){
        
            if(txtTransactionID.value != null && txtTransactionID.value != "" ){
                //Delete Old Transaction
                deleteOldTransaction(txtTransactionID.value);
                console.log("After Delete Transaction ");
                var total = 0;
                var lblPrice = 0;
                for(var i=1; i<row.length; i++){
                    var ProductID = row[i].cells[1].innerHTML;
                    var Dim = row[i].cells[3].innerHTML;
                    var Qty = row[i].cells[4].getElementsByTagName('input')[0].value;
                    var LabelPrice = row[i].cells[5].innerHTML;
                    var Discount1  = row[i].cells[6].getElementsByTagName('span')[0].innerHTML; 
                    var Discount2 = row[i].cells[7].innerHTML;
                    var PromoRemark = "No Remark";
                    var SellingPrice = row[i].cells[8].innerHTML;
                    var TotalPrice = row[i].cells[9].innerHTML;
                    var Remark = "No Remark";
                    var AddedBy  = "104";
                    var AddedOn  =  " " + getTimeStamp() + " ";
                    var IsReturn  = 1;
                    console.log(" Indexed Is " + i);
                    console.log("ProductID -:" + ProductID + " Qty " + Qty + "  Label Price " + LabelPrice + " Discount1 " + Discount1);
                    console.log("Discount2 " + Discount2 + "Selling Price " + SellingPrice + " Total Price " + TotalPrice + "Added On " + getTimeStamp());
                    //Add Data In the Sells Order Table Where IsDraft  Value is 1  
                    InsertSellsOrderItem(transactionID,ProductID,Dim , PromoRemark , Qty , LabelPrice , Discount1 , Discount2 , SellingPrice , TotalPrice , Remark , AddedBy , AddedOn , "104");
                }
                console.log(" Sells Order Items Inserted... ");
                var result = 1;
                var tax = 0;
                var customerID = 0;
                var total = 0;
                var totalDiscount = 0;
                var VoucherDiscount  = 0;
                var PaymentModeCharge = 0;
                var TotalPay = 0;
                var Remark1 = "REMARK";
                var AddedBy1 = 162;
                var CustomerTransaction = txtTransactionID.value;
                var IsDraft = 0;
                var Status = 1;
                var StoreID = 104;
                var TerminalID = "000796";
                InsertSellsOrder(transactionID ,txtCustomerID.value,total , tax ,VoucherDiscount , totalDiscount , PaymentModeCharge , TotalPay , Remark1 , AddedBy1 , CustomerTransaction , Status , IsDraft , StoreID , TerminalID);
                console.log(" Insert Sells Order Completed ");
                if(result == 1){
                    //Pay button , Hold make Disable
                    console.log("Before Remove All Rows");
                    removeAllRow();
                    console.log("After Remove All Rows");
                    var btnHold = document.getElementById("btnHold"); 
                    var btnPay = document.getElementById("btnPay");
                    btnPay.disabled = true;
                    btnHold.disabled = true;
                    console.log(" Sucesss ");
                    SweetAlertInfo(" Successfully Order On Hold !!! ");
                    clearAllFields();
                }   
            }else {

                SweetAlertInfo(" TransactionID not found ....  ");    
            }

        }else {
            SweetAlertInfo(" Please Enter CustomerID  ");
        }
    }
}
function doRetrival(){
    var tableretrive = document.getElementById("retriveTable");
    console.log("Retrival Length " + tableretrive.rows.length);

    for(var j=1; j<tableretrive.rows.length; j++){
        tableretrive.deleteRow(j);
        console.log(" Row Deleted " + j);
    } 
    if(tableretrive.rows.length == 1){
        readSellOrder();
    $('[data-popup="popup-5"]').fadeIn(350);
    }
    
}
function removeAllRow(){
    console.log(" Remove All Row is Running ");
    var table1 = document.getElementById("CartTable");
    for(var j = table1.rows.length - 1; j>0; j--){
        table1.deleteRow(j);

    }
    setEmptyRow();
}
function checkForBillOffers(){

}
function getImageURLFROMDB1(Image_Name){
    console.log(" Getting Image from the DB  getImageURLFROMDB");
    var img ="";
    readAll("ProductPics" , function(data){
        console.log("Inside the getImaeg  ");
        console.log(data);
        if(data.target.Key ===  Image_Name ){
            console.log(" Comparison Image " + Image_Name);
            console.log(" Get Specific Image  " + data.target.Key);
            var URL = window.URL || window.webkitURL;
            // Create and revoke ObjectURL
            img = URL.createObjectURL(data.target.result);
            
        }
    });
    console.log(" Img URL ");
    console.log(img);
    return img;
}
function getImageURLFROMDB(Image_Name , callback){
    console.log(" Getting Image from the DB  getImageURLFROMDB");
    console.log(" Image Name " + Image_Name );
    var img ="";
   // readAll("ProductPics" , function(data){
     //   console.log("Inside the getImaeg  ");
       // console.log(data);
       // if(data.target.Key ===  Image_Name ){
         //   console.log(" Comparison Image " + Image_Name);
          //  console.log(" Get Specific Image  " + data.target.Key);
           // var URL = window.URL || window.webkitURL;
            // Create and revoke ObjectURL
          //  img = URL.createObjectURL(data.target.result);
            
      //  }
    //});
    read("ProductPics", Image_Name , function(data){
        console.log("Image Data is ");
        console.log(data);
        var URL = window.URL || window.webkitURL;
        // Create and revoke ObjectURL
         callback(URL.createObjectURL(data));
    })
}
function uniqueNumber() {
    var date = Date.now();
    // If created at same millisecond as previous
    if (date <= uniqueNumber.previous) {
        date = ++uniqueNumber.previous;
    } else {
        uniqueNumber.previous = date;
    }    
    return date;
}
uniqueNumber.previous = 0;
function makeid(l)
{
    var text = "";
    var char_list = "0123456789";
    for(var i=0; i < l; i++ )
        {  
            text += char_list.charAt(Math.floor(Math.random() * char_list.length));
        }
    return text;
}
function clearAllFields(){

    //Set Customer
    txtCashAmount.value = "0";
    txtTransactionID.value =  makeid(9);
    //SerachBox
    txtSearch.innerHTML = "";
    //Product Fields 
    lblProductName.innerHTML ="--";
    lblPrice.innerHTML ="--";;
    lblPrice.innerHTML ="--";;
    lblStock.innerHTML ="--";
    lblDiscount.innerHTML ="--";
    lblUOM.innerHTML ="--";
    productImage.src = "img/default_product.jpg";
    //Rates Panel 
    lblItems.innerHTML = "0";
    lblTaxFee.innerHTML = "0.00";
    lblCashAmt.innerHTML = "0.00";
    lblVoucherAmmount.innerHTML = "0.00";
    lblTotalDiscount.innerHTML = "0.00";
    lblCreditCard.innerHTML = "0.00";
    lblDebitCard.innerHTML = "0.00";
    lblTotalAmount.innerHTML = "0.00";
    lblTotalPayment.innerHTML = "0.00";
    lblTotalTax.innerHTML = "0.00";
    lblCurrentTaxVal.innerHTML = "0.00";
    //side Pay Panel
    txtTotal.value = "0.00";
    txtDiscount.value = "0.00";
    txtTotalPay.value = "0.00";
    txtRefund.value = "0.00";
    window.txtSearch.value  = "";
 }
 var total_tax = 0;
 var total_tax1=0;
 function  fillPayment() {

     console.log("-------------Fill Payments --------------------");
         
     var totalItems  = 0;
     var lasttotal = 0.00 , totaltax = 0.00  , lastDiscount = 0.00 , lasttax=0.00;
     var table1 = document.getElementById("CartTable");
     var length  = table1.rows.length;

     //Iterate Table Rows 
     console.log("----------- FOR LOOP START  --------------------");
     for(var i=1; i<length; i++){

         var totalPrice  =  table1.rows[i].cells[9].innerHTML;
         var price = table1.rows[i].cells[5].innerHTML;
         var qty = table1.rows[i].cells[4].getElementsByTagName("input")[0].value;

         lasttotal = parseFloat(totalPrice, 10) + lasttotal;
         lasttax = calculateTax(false,totalPrice , window.lastDiscount ,qty , window.CurrentTax) + lasttax ;

         var addSum = lasttotal + lasttax;
         var tax = lasttax;

         //Display to screen
         txtTotal.value = lasttotal.toFixed(2);
         lblTotalTax.innerHTML = tax.toFixed(2); 
         txtTotalPay.value = addSum.toFixed(2);
         lblTotalAmount.innerHTML  = addSum.toFixed(2);

         console.log(" Total Price " + totalPrice);
         console.log(" Price " + price); 
         console.log(" Quantity " + qty);
         console.log(" Last Total " + lasttotal);
         console.log(" Grand Sum : " + addSum );
         console.log(" Items Is " + i);
     }
     console.log(" __________ END OF FOR LOOP _______________")
     console.log(" Items Is " + table1.rows.length - 1);
     document.getElementById("lblItems").innerHTML = + table1.rows.length - 1;
     console.log("------------- End Fill Payments --------------------");
 }
 function checkBoxClick(){
     //Check for Product in the Cart.
     var checkbox = document.getElementById("Chk_Cash");
     if(checkbox.checked == true){ 
        var table1 = document.getElementById("CartTable");
        var txtCashAmmount = document.getElementById("txtCashAmount");
    if(table1.rows.length > 1){
        console.log("Value is -: " + table1.rows[1].cells[0].innerHTML);
        if(table1.rows[1].cells[0].innerHTML != "No Products Added.."){
            console.log("%c Product is Found.... ", "color:BLUE;");
            var lblspan1 = document.getElementById('lblCount410');
            lblspan1.innerHTML = "0";
            var lblspan2 = document.getElementById('lblCount420');
            lblspan2.innerHTML = "0";
            var lblspan3 = document.getElementById('lblCount450');
            lblspan3.innerHTML = "0";
            var lblspan4 = document.getElementById('lblCount500');
             count3 = 0;
            lblspan4.innerHTML = "0";
             count1 = 0;
             count2 = 0;
             count4 = 0; 
             total = 0;
             var lblCashCount  = document.getElementById("lblCashCount");
             var txtCashAmmount = document.getElementById("txtCashAmount");
             txtCashAmmount.readOnly = false;
             lblCashCount.innerHTML = 0;
            $('[data-popup="popup-1"]').fadeIn(350);
        }else {
             SweetAlertInfo(" Please add some product Items !!!");
             document.getElementById("Chk_Cash").checked  = false;
        }
    } else {
        console.log(" Product is Not found ... ");
    }
    }else {

        var txtCashAmmount = document.getElementById("txtCashAmount");
        txtCashAmmount.value  = "";
        txtCashAmmount.readOnly = true;  
    }
    fillPayment();
 }
 var num=0;
 var count3 = 0;
 var count1 = 0;
 var count2 = 0;
 var count4 = 0;
 var sum = 0;
 var total =0;
 function plusValue(elem){
    var lblCashCount  = document.getElementById("lblCashCount");
    switch(elem.name){
        case "btn410":     
                console.log("Click" + count);
                var lblspan = document.getElementById('lblCount410');
                var button = document.getElementById(elem.id);
                button.onclick = function(){
                    count1 += 1;
                    var value = parseFloat(button.value);
                   console.log("Counter is " + count1 + " Value " + value  );
                    sum = (parseInt(count1) * value);
                    total += sum;
                    console.log("Value is " +   sum  );
                    lblspan.innerHTML = count1;
                    lblCashCount.innerHTML = total;
                }
            break;
        case "btn420":
                console.log("Click" + count);
                var lblspan = document.getElementById('lblCount420');
                var button = document.getElementById(elem.id);
                button.onclick = function(){
                    count2 += 1;
                    var value = parseFloat(button.value);
                    console.log("Counter is " + count1 + " Value " + value  );
                    sum = parseInt(count2) * value;
                    total += sum;
                    lblspan.innerHTML = count2;
                    lblCashCount.innerHTML = total;
                }
            break;
        case "btn450":
                console.log("Click" + count);
                var lblspan = document.getElementById('lblCount450');
                var button = document.getElementById(elem.id);
                button.onclick = function(){
                    count3 += 1;
                    var value = parseFloat(button.value);
                    console.log("Counter is " + count1 + " Value " + value  );
                  
                    sum = parseInt(count3) * value;
                    total += sum;
                    lblspan.innerHTML = count3;
                    lblCashCount.innerHTML = total;
                }
            break;
        case "btn500": 
                console.log("Click" + count);
                var lblspan = document.getElementById('lblCount500');
                var button = document.getElementById(elem.id);
                var cashAmt = document.getElementById("lblCashAmt");
                var totalPaymt = document.getElementById("lblCashAmt");
                button.onclick = function(){
                    count4 += 1;
                    var value = parseFloat(button.value);
                    console.log("Counter is " + count1 + " Value " + value  );
                    sum = parseInt(count4) * value;
                    total += sum;
                    lblspan.innerHTML = count4;
                    lblCashCount.innerHTML = total;
                    cashAmt.innerHTML = total;
                    totalPaymt.innerHTML = total; 

                }
            break;
    }
 }
 function setCashTrans(){

     //alert(" Current Cash Chnages");
     console.log(" Cash Changes !!! ");
     lblCashAmt.value  = totol;
 }
 function OnPay(){

     console.log("-----------Payment Section--------------");
     var total = 0;
     var totaltax = 0;
     var CustomerID = document.getElementById('txtCustomerID').value;
     var table1 = document.getElementById("CartTable");
     console.log(" Length : " + table1.rows.length );
     for(var i=1; i<table1.rows.length; i++){

         var ProductCode = table1.rows[i].cells[1].innerHTML;
         var Dim = table1.rows[i].cells[3].innerHTML;
         var pur_Qty = table1.rows[i].cells[4].innerHTML;
         var LabelPrice = table1.rows[i].cells[5].innerHTML;
         var Discount1 = table1.rows[i].cells[6].innerHTML;

         var Discount2 = table1.rows[i].cells[7].innerHTML;
         var SellingPrice = table1.rows[i].cells[8].innerHTML;
         var TotalPrice = table1.rows[i].cells[9].innerHTML;
         var SellsOrderId = document.getElementById('txtTransactionIDShow').value;
        console.log("Product Code " + ProductCode + " Dimension -:" + Dim + " Purchase Qty " + pur_Qty + " Label Price " + LabelPrice + " Discount1 " + Discount1 + " Discount2 " + Discount2 + "Selling Price " + SellingPrice + " Total Price " + TotalPrice );
        if(window.flag == 1){
            //Update the SellsOrderItems
            
        } else { 
            //Insert New SellsOrder
            InsertSellsOrderItem(SellsOrderId,ProductCode ,Dim , " No REMARK ", pur_Qty ,LabelPrice ,Discount1 , Discount2 ,SellingPrice ,TotalPrice ,"REMARK" , "" ,"" ,"" , "104");
        }
     }
     var total = lblTotalAmount.text;
     var total_tax =0;
     var VoucherDiscount = 0;
     var TotalDiscount = 0;
     var PaymentModeCharge =0;
     var TotalPay=0;
     var Remark =0;
     var AddedBy =0;
     var CustomerTransaction=0;
     var IsDraft=0;
     var Status=0;
     var StoreID =0;
     var TerminalID=0;
     InsertSellsOrder(SellsOrderId, txtCustomerID.text , total , total_tax,VoucherDiscount , TotalDiscount ,PaymentModeCharge , TotalPay , Remark, AddedBy , CustomerTransaction , "1" , "1", "104", "2323443" );
     SweetAlertInfo(" Sucessfully Paid...  ");
     console.log("----------- End Payment Section --------------");
 }
 function OnHold(){

    SweetAlertInfo("Holding The Values ");
    var table1 = document.getElementById("CartTable");
    console.log(" Table Length " + table1.rows.length);
    console.log("------- For Holding Value --------");
    for(var i=1; i<table1.rows.length; i++){
        console.log("ProdUct ID " + table1.rows[i].cells[2].innerHTML);
    }
    console.log("------- End Holding Value --------");
 }
 function calculateTax(includetax ,product_price , discount_price  , Quantity , actualtax){
     //For Tax Calculation
     console.log("---------Tax Calculation------------");
     var current_tax = 0; //get From Local Db
     console.log(" Is include Tax " + includetax);
     console.log(" Product Price "  + product_price);
     console.log(" Discount Price " + discount_price );
     console.log(" Actual Tax " + actualtax);
     discount_price = 0;
     if(includetax){
         var sales_tax = actualtax / 100 ;
         current_tax = sales_tax * parseFloat(discount_price);
     }else{
         var sales_tax = parseFloat(actualtax) / 100;
         current_tax = sales_tax * product_price;
     }
     console.log("---------End Tax Calculation------------");
     return current_tax;
 }
 function OnRetrive(){
    SweetAlertInfo("On Retrive ");
 }
 function OnPrint(){
    SweetAlertInfo("On Print");
 }
 function txtChange(){
     console.log(" Text Change ... ");
     var productID =   $('txtSearch').innerText;
     $('txtSearch').value  = "";
 }
 function chngCashManually(){ 
     document.getElementById('Chk_Cash').checked = true;
     $('[data-popup="popup-1"]').fadeOut(350);
     document.getElementById("txtCashAmount").focus();
     document.getElementById("txtCashAmount").select();
 }
 function chngCashSet(){
     document.getElementById('Chk_Cash').checked = true;
     $('[data-popup="popup-1"]').fadeOut(350);
     document.getElementById("txtCashAmount").value = total;
     document.getElementById("txtCashAmount").focus();
 }
function getBillOffers(){

    var offersTable = document.getElementById("gvPromotionData");
    if(isProductInList()){
        console.log(" Bill Offers Table Length  " + offersTable.rows.length);
        for(var i=offersTable.rows.length - 1; i>0; i--){
                   offersTable.deleteRow(i);
                   console.log("Rows Deleted" + i);
         }
         console.log(" Bill Offers After Del Table Length  " + offersTable.rows.length);
         readAll("BillOffers" , function(value){
             if(value != "No"){
                 var row = offersTable.insertRow(offersTable.rows.length);
                 row.style.backgroundColor = "#FFF7E7";
                 row.style.color = "#8C4510";
                 var cell0 = row.insertCell(0);
                 var cell1 = row.insertCell(1);
                 var cell2 = row.insertCell(2);
                 var cell3 = row.insertCell(3);
                 var cell4 = row.insertCell(4);
                 cell0.innerHTML = value.ID;
                 cell1.innerHTML = value.PromoType
                 cell2.innerHTML = value.FriendlyName;
                 cell3.innerHTML = value.PromoCategory;
                 console.log("AppliedProdPromo  " + window.AppliedProdPromo );
                 console.log("AppliedProdPromo ID " + window.AppliedProdPromoID );
                 if(window.AppliedProdPromo != 1  && window.AppliedProdPromoID != value.ID ){
                    cell4.innerHTML = "<input type='submit' name='applyBillPrdouctPromo' value='Apply Promo' onclick='applyBillPromo(this)' id='"+1+"' style='background-color:#FF0033;'>";  
                 }else if(window.AppliedProdPromo == 1 && window.AppliedProdPromoID == value.ID) {
                    cell4.innerHTML = "<input type='submit' name='applyBillPrdouctPromo' value='Cancel Promo' onclick='applyBillPromo(this)' id='"+1+"' style='background-color:YELLOW;'>"; 
                 }else {
                    cell4.innerHTML = "<input type='submit' name='applyBillPrdouctPromo' value='Wait' onclick='applyBillPromo(this)' id='"+1+"' style='background-color:GREEN;'>"; 
                 }
                 console.log(" Offers is " + JSON.stringify(value));
                 $('[data-popup="popup-3"]').fadeIn(350);
             }   
            });
    } else {
        SweetAlertWarning("Please Add Some Product !!!");
    }            
}
/*************** End of Page Functionality ****************/

/************** DB Operation Section 1 ********************/
//Get Product via Key From DB  
function getProductsFromDB(key , callbackFn){
    const request = window.indexedDB.open("POS_CLIENT", 1);
    request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction("ProductImage", "readwrite");
        const invStore = transaction.objectStore("ProductImage");
        const get = invStore.get(key);
        get.onsuccess = () => {
            callbackFn(get.result);
        };
    };
}
//Get Bill Offers From API TO DB
function FetchBillOffersFromOnline(){
    console.log(" Get Bill Offers FROM API  ");
    var billOffers = [];
    FetchOnBillTotalPromo(104 , function(data){
        var offers  = JSON.parse(data);
        console.log(" Bill Offers " + JSON.stringify(data));
        for(var i=0; i<offers.length; i++){
            console.log(" Friendly Name " + offers[i].FriendlyName ); 
            console.log(" Promo Code " + offers[i].PromoCode);
          billOffers[i] = { ID : offers[i].ID, FriendlyName : offers[i].FriendlyName , PromoCode : offers[i].PromoCode , PromoType  : offers[i].PromoType , DiscountType : offers[i].DiscountType , Discount : offers[i].Discount , AddedOn : offers[i].AddedOn , ExpiredOn: offers[i].ExpiredOn , IsActive : offers[i.IsActive] , MaxValue : offers[i].MaxValue , MinTrans : offers[i].MinTrans , PerUserApplied : offers[i].PerUserApplied , IsAllProducts : offers[i].IsAllProducts , IsTotalPurchasePromo : offers[i].IsTotalPurchasePromo , PromoCategory : offers[i].PromoCategory , SpecialPrice : offers[i].SpecialPrice , RelevantID : offers[i].RelevantID , Discount2 : offers[i].Discount2  , IsProductFree : offers[i].IsProductFree }; 
          console.log(" Bill Offers Value is  " + JSON.stringify(billOffers[i]));
          add(window.db , "BillOffers", billOffers[i]);  
        }
    });
}
function FetchBillOffersfromDB(){
    console.log("Get Bill Offers From DB ");
    var offers = {};
    readAll1("BillOffers").then(function(data){
        console.log(" Bill Offers " + JSON.stringify(data));
      offers.push(data);
   }, function(data){   
            console.log(" Something Went Wrong !!! ");
   });
    return offers;
}
function FetchBillOffersfromDB(){
    console.log("Get Bill Offers From DB ");
    var offers = {};
    readAll("BillOffers");
    return offers;
}
//Get CurrentTax and Set Tax
function getCurrentTax(){
    var obj =  getCurrentTaxValue(function(data){ 
        console.log(" Offers Details Is " + data); 
        window.CurrentTax = parseFloat(data, 10);
    }); 
}
function readSellOrder(){
    console.log(" Reading the Sells Order");
    var tableRetrive = document.getElementById("retriveTable");
    console.log(" Length Of Retrive" + tableRetrive.rows.length);
    console.log(" Before Reading The Data " + tableRetrive.rows.length);
    var index =0;
    readAll("SellsOrder", function(value){     
        if(value.IsDraft === 0 && value.Status === 1){    
         var row = tableRetrive.insertRow(tableRetrive.rows.length);
         row.style.color = "#000066";
         var cell1 = row.insertCell(0);
         var cell2 = row.insertCell(1);
         var cell3 = row.insertCell(2);
         cell1.innerHTML = value.SellsOrderId;
         cell2.innerHTML = value.TerminalID;
            var str =  '<input type="submit" name="rtvHoldRetrive" value="Retrieve" onclick="retrivalRertive(this);" id="rtvHoldRetrive">' +
                '<input type="submit" name="rtvHoldDelete" value="Delete" onclick="retrivalDelete(this)" id="rtvHoldDelete">'
            cell3.innerHTML = str; 
            }
    });  
}
function retrivalDelete(response){
    var cur_row = response.parentNode.parentNode;
    var val = cur_row.cells[0].innerHTML;
    SweetAlertInfo(" Hold Value Deleted ... " + val);
    cur_row.parentNode.removeChild(cur_row);
}
function retrivalRertive(response){ 
    console.log("---------Retrive--------------");
    var cur_row = response.parentNode.parentNode;
    var val = cur_row.cells[0].innerHTML;
        readAll("SellsOrderItems" , function(data){
          if(data.SellsOrderId == val ){
                getData(data.ProductId , false);
                $('[data-popup="popup-5"]').fade(350);
          }
    })
    console.log("---------End Retrive--------------");
}
function setCashTrans(cash){

    var cashAmout = document.getElementById('lblTotalPayment');
    alert(" Hello World... " + cash.value);
    var new_CashAmount = parseFloat(cash.value + "");
    alert(" Parse Value " + new_CashAmount);
    cashAmout.innerHTML = new_CashAmount.toFixed(2);
    console.log(cash);

}
function deleteTableRow( tabelname , startIndex , endIndex ){
    var table1 = document.getElementById(tabelname);
    var length  =  table1.rows.length;
    if(startIndex <= 0 && endIndex <= length){
          for(var i=startIndex; i<endIndex; i++){
                table1.deleteRow(i);
          }  
    }else {
        throw "OutOfIndexException";
    }
}
function deleteOldTransaction(SellSOrderId){
    remove1("SellsOrderItems",SellSOrderId , function(response){ 
         if(response == "Success" ){
            console.log("  Successfully Removed  ");
         }
         if(response == "Error"){
            console.log("Something Wrong at deleting.... ");
         }
    });
}
function getSellsOrder(SellsOrderID){
    read("SellsOrder",SellsOrderID , function(data){
        console.log("SellsOrderItems " + data.SellsOrderId);
        console.log("Customer Transaction is  " + data.CustomerTransaction );
    });
}
function getSellsOrderItems(SellsOrderItemID){
    read("SellsOrderItems",SellsOrderItemID , function(data){
        console.log(" Data Is" + data.SellsOrderId);
        console.log("Product ID " + data.ProductId);
    });
}
function SaveProductImage(StoreID ){
    //Fetch Product Image and Save To Local Indexed DB
    var  productImage  = []; 
    var obj = getProductImage(StoreID , function(data){ 
        var data =  JSON.parse(data);
        for(var i=0 ; i<data.length;  i++){

            productImage[i] = { 
            SellsOrderItemID : data[i].SellsOrderItemID , 
            productID : data[i].productID , 
            ProductName : data[i].ProductName ,
            unitOfMeasurement : data[i].unitOfMeasurement,
            Qty : data[i].Qty , 
            Price : data[i].Price  , 
            image : data[i].image , 
            size : data[i].size , 
            Discount : data[i].Discount  , 
            MaxValue : data[i].MaxValue , 
            Quantity : data[i].Quantity , 
            IsReturn: data[i].IsReturn, 
            IsDraft: data[i].IsDraft, 
            IsQtyTxtOn: data[i].IsQtyTxtOn , 
            IsDiscImgOn  : data[i].IsDiscImgOn  
            };
            Products[i] = { productID : data[i].productID , ProductName : data[i].ProductName };
            //Add to DB
            add(window.indexedDB,"ProductImage", productImage[i]);
        }
    });
}
//Get Product Details FROm DB TO ARRAY
function loadProductFromDB(){
    console.log(" Load Product From DB to Array");
    window.Products.length = 0;
    readAll(
        "ProductImage", function(value){
            window.Products.push({ productID : value.productID , ProductName : value.ProductName }); 
        }       
    );
}
//Get Bill Offers Details FROM API TO DB
function BillPromo(){
    var ProdofferImage =[];
    FetchOnBillTotalPromo("104" , function(data){
           var data1 = JSON.parse(data);
           for(var i=0; i<data1.length; i++){
               ProdofferImage[i] = {
                   ID : data1[i].ID  , 
                   FriendlyName : data1[i].FriendlyName , 
                   PromomCode : data1[i].PromoCode , 
                   PromoType : data1[i].PromoType , 
                   DiscountType : data1[i].DiscountType  , 
                   Discount : data1[i].Discount , 
                   AddedOn : data1[i].AddedOn  , 
                   AddedBy : data1[i].AddedBy , 
                   ExpiredOn : data1[i].ExpiredOn , 
                   IsActive : data1[i].IsActive ,
                   MaxValue : data1[i].MaxValue ,
                   MinTrans : data1[i].MinTrans , 
                   PerUserApplied : data1[i].PerUserApplied , 
                   IsAllProducts: data1[i].IsAllProducts , 
                   IsTotalPurchasePromo: data1[i].IsTotalPurchasePromo, 
                   PromoCategory:data1[i].PromoCategory , 
                   SpecialPrice:data1[i].SpecialPrice , 
                   RelevantID:data1[i].RelevantID ,
                   Discount2:data1[i].Discount2,
                   IsProductFree:data1[i].IsProductFree, 
               };
               add(window.indexedDB ,"BillOffers", ProdofferImage[i]);
           }
   });
}
function ProductPromoData(){
    var productPromo = [];
    FetchOnProductPromo("104" , function(data){
        console.log(" Get Data From Product Promotion " + JSON.stringify(data)); 
        var data1 = JSON.parse(data);
        for(var i=0; i<data1.length; i++){
            productPromo[i] = {
                ProductID : data1[i].ProductID,
                MinProductItems : data1[i].MinProductItems,
                MinProductItems1 : data1[i].MinProductItems1,
                Scheme : data1[i].Scheme,
                AddtionalValue : data1[i].AddtionalValue,
                FriendlyName : data1[i].FriendlyName,
                PromoCode : data1[i].PromoCode,
                Discount : data1[i].Discount,
                MaxValue : data1[i].MaxValue,
                MinTrans : data1[i].MinTrans,
                PerUserApplied : data1[i].PerUserApplied,
                Buy : data1[i].Buy,
                Get : data1[i].Get,
                PromotionID : data1[i].PromotionID,
                ProdPromoType : data1[i].ProdPromoType, 
                GetType : data1[i].GetType,
                OnQty : data1[i].OnQty,
                AddingPrice : data1[i].AddingPrice
            };
            add(window.indexedDB , "ProdOffers" , productPromo[i]);
        }
    });
}
function InsertSellsOrderItem(SellsOrderId  ,ProductId , Dim , PromoRemark , Qty ,Price , Discount1  ,  Discount2 , SellingPrice , TotalPrice ,  Remark ,  AddedBy , AddedOn ,  StoreID){
    var SellsOrderItems = [];
    SellsOrderItems[0] = {
       SellsOrderId : SellsOrderId , 
       ProductId : ProductId ,
       Dim : Dim, 
       PromoRemark : PromoRemark , 
       Qty : Qty  , 
       Price : Price , 
       Discount1 : Discount1 , 
       Discount2 : Discount2 , 
       SellingPrice : SellingPrice , 
       TotalPrice : TotalPrice , 
       Remark : Remark ,
       AddedBy : AddedBy , 
       AddedOn : AddedOn , 
       StoreID : StoreID 
   };
    add(window.indexedDB , "SellsOrderItems"  , SellsOrderItems[0]);
}
function updateSellsOrderItems(SellsOrderId  ,ProductId , Dim , PromoRemark , Qty ,Price , Discount1  ,  Discount2 , SellingPrice , TotalPrice ,  Remark ,  AddedBy ,  UpdatedBy , UpdatedOn , StoreID){
}
function InsertSellsOrder(SellsOrderId,  CustomerId, Total,  Tax,  VoucherDiscount, TotalDiscount ,  PaymentModeCharge ,  TotalPay , Remark ,  AddedBy ,  CustomerTransaction , Status , IsDraft ,  StoreID ,  TerminalID){
    
    var SellsOrder = [];
    SellsOrder[0] = {
        SellsOrderId : SellsOrderId ,
        CustomerId : CustomerId , 
        Total : Total,  
        Tax : Tax ,  
        VoucherDiscount : VoucherDiscount , 
        TotalDiscount : TotalDiscount  ,  
        PaymentModeCharge  : PaymentModeCharge,  
        TotalPay : TotalPay  , 
        Remark : Remark  ,  
        AddedBy  : AddedBy ,  
        CustomerTransaction  : CustomerTransaction , 
        Status : Status  , 
        IsDraft : IsDraft ,  
        StoreID : StoreID  ,  
        TerminalID : TerminalID
    };
    add(window.indexedDB , "SellsOrder", SellsOrder[0]);
}
function getImageFromServer(URIAddress ,  filename){
    var xhr = new XMLHttpRequest(),blob;
    // Create XHR
    xhr.open("GET",URIAddress + filename, true);
    // Set the responseType to blob
    xhr.responseType = "blob";
    var  np = new Promise(function(resolve ,   reject){
        xhr.addEventListener("load", function () {
            if (xhr.status === 200) {        
                // Blob as response
                blob = xhr.response;
                resolve(blob);
            }else{
                reject(xhr.status);
            }
        }, false);
    });
    xhr.send();
    return np;
}
// Product Details FROM API TO DB
function getProductImage1(){ 
    var  productImage  = []; 
        var obj = getProductImage(104 , function(data){ 
        var data =  JSON.parse(data);
        for(var i=0 ; i<data.length; i++){
            getImageFromServer("img/prodImages/" , data[i].image ).then(function(data){
                productImage[i] = { SellsOrderItemID : data[i].SellsOrderItemID , productID : data[i].productID , ProductName : data[i].ProductName ,unitOfMeasurement : data[i].unitOfMeasurement,
                    Qty : data[i].Qty , Price : data[i].Price  , image : data[i].image , size : data[i].size , Discount : data[i].Discount  , MaxValue : data[i].MaxValue , Quantity : data[i].Quantity , 
                    IsReturn: data[i].IsReturn, IsDraft: data[i].IsDraft, IsQtyTxtOn: data[i].IsQtyTxtOn , IsDiscImgOn  : data[i].IsDiscImgOn 
                };
                Products[i] = { productID : data[i].productID , ProductName : data[i].ProductName };
                add(window.indexedDB,"ProductImage", productImage[i]);
                addImage("ProductPics",data[i].image ,data).then( function(event){ 
                    console.log(" Successfully Save Images");
                } , function(event){
                    console.log(" Something went wrong !!!");
                });
             } , 
             function(status){ console.log(" Status " + status) });
        }
     });
}
function getProductImage2(){
    console.log("Getting Product Images.... ");
    var  productImage  = []; 
        var obj = getProductImage(104 , function(data){ 
        var data =  JSON.parse(data);
        for(var i=0 ; i<data.length; i++){
            productImage[i] = { SellsOrderItemID : data[i].SellsOrderItemID , productID : data[i].productID , ProductName : data[i].ProductName ,unitOfMeasurement : data[i].unitOfMeasurement,
                Qty : data[i].Qty , Price : data[i].Price  , image : data[i].image , size : data[i].size , Discount : data[i].Discount  , MaxValue : data[i].MaxValue , Quantity : data[i].Quantity , 
                IsReturn: data[i].IsReturn, IsDraft: data[i].IsDraft, IsQtyTxtOn: data[i].IsQtyTxtOn , IsDiscImgOn  : data[i].IsDiscImgOn  
            };
            Products[i] = { productID : data[i].productID , ProductName : data[i].ProductName };
            add(window.db,"ProductImage", productImage[i]);
        }
        });
}
function getProductPics(){
    console.log(" Getting Product Image Into the DB ");
    console.log(" Window DB " + window.db);
    readAll("ProductImage" , function(data){
     //   console.log("Reading the Date of the Product Image form the Database" + data.image);
        var image_name = data.image;
        getImageFromServer("img/prodImages/" , data.image ).then(function(data){
                var URL = window.URL || window.webkitURL;
                // Create and revoke ObjectURL
                var imgURL = URL.createObjectURL(data);
                // Set img src to ObjectURL
               // var imgElephant = document.getElementById("prodImage");
               // imgElephant.setAttribute("src", imgURL);
                addImage("ProductPics",image_name ,data).then( function(event){ 
            //    console.log(" Successfully Save Images");
                } , function(event){
                console.log(" Something went wrong !!!");
                });

        } , function(data){
            console.log(" No Images Found !!!");
        });
    });
    console.log(" End of the getting Image.. ");
}
function checkProdOffer(productID , callback){

    console.log(" Product Offer ID " +  productID);
    read("ProdOffers" , productID , function(data){
       console.log(" Data Is Avail " +  JSON.stringify(data));
        if(productID === data.ProductID ){
            callback(true);
        }else {
            callback(false);
        }
    })
}
function sendSellsOrderItemtoServer(){
    console.log("-----------Sending Data to Server -----------------------");
    readAll("SellsOrderItems" , function(response){
           console.log(" SellsOrderItems" +  JSON.stringify(response));
           insertSellsOrderItemsAPI1(response.SellsOrderId ,response.ProductId , response.Dim , response.PromoRemark , response.Qty , response.Price , response.Discount1 , response.Discount2 , response.SellingPrice , response.TotalPrice ,response.Remark , response.AddedBy , response.UpdatedBy , response.UpdatedOn , response.StoreID);
    });
    console.log("----------- End Sending Data to Server -----------------------");
}
function deleteSellsOrder(SellsOrderId){
    remove1("SellsOrderItems" , SellsOrderId , function(response){
        if(response == "Success"){
            SweetAlertSuccess(" Successfully Deleted !!! ");
        }else {
            console.log(" Something went wrong... ");
        }
    })
}
function deleteSellsOrderItems(SellsOrderId){
    remove1("SellsOrder" , SellsOrderId , function(response){
        if(response == "Success"){
            SweetAlertSuccess(" Successfully Deleted !!! ");
        }else {
            console.log(" Something went wrong... ");
        }
    })  
}
/******************* End of DB Operation ***********************/

/******************* Alert and Full Screen ********************/
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
function printDiv() {
    //  console.log("Inside Print Div");
    var printContents = document.getElementById("PrintDiv").innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    document.getElementById("Button2").click();
}
var count = 1;
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
console.log(" Window Load Event Listener Start");
window.addEventListener('load', function() {

function updateOnlineStatus(event) {
    var condition = navigator.onLine ? "online" : "offline";
    var div = document.getElementById("offChng");
    if(condition == "online"){
        alert(" Browser is Online  Mode ");
        div.style.backgroundColor = "red";
        onlineActivity();
        }else {
        alert(" Browser is Offline Mode  ");
        div.style.backgroundColor = "yellow";
        offlineActivity();
        }
    }
    window.addEventListener('online',  updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
});
/******************* End of Alert and Full Screen ************/

/******************* Legacy Code ****************************/
function setHeader(){
    var table1 = document.getElementById("CartTable");
    var row = table1.insertRow(-1);
    row.style.backgroundColor = "#5D7B9D";
    row.style.color = "White";
    row.style.fontWeight  = "Bold";
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);
    var cell8 = row.insertCell(7);
    var cell9 = row.insertCell(8);
    var cell10 = row.insertCell(9);
    var cell11 = row.insertCell(10);
    cell1.innerHTML = "S.No";
    cell2.innerHTML = "Code";
    cell3.innerHTML = "Item Name";
    cell4.innerHTML = "UOM";
    cell5.innerHTML = "Purchase Qty";
    cell6.innerHTML = "Label Price";
    cell7.innerHTML = "Discount 1st";
    cell8.innerHTML = "Discount 2nd";
    cell9.innerHTML = "Selling Price";
    cell10.innerHTML = "Total";
    cell11.innerHTML = "Action";
}
function toJSONLocal (date) {
	var local = new Date(date);
	local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
	return local.toJSON().slice(0, 10);
}
function setNewRow(Products){
    //Delete Empty Row in the
    removeEmptyRow();
    var table1 = document.getElementById("CartTable");
    var row = table1.insertRow(table1.rows.length);
    var col = [];
    row.style.backgroundColor = "#F7F3F6";
    row.style.color = "#333333";
    for (var i = 0; i < Products.length; i++) {
        for (var key in Products[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }
    for (var r = 0; r < col.length; r++) {
        // ADD TABLE HEADER.
        var tr = document.createElement('tr');
        tr.innerHTML = col[r].replace('_', ' ');
        row.appendChild(tr);
        row.style.backgroundColor = "#F7F3F6";
        row.style.color = "#333333";
    }
}
/********************End of the Legacy Code ****************/