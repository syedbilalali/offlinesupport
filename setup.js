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
        //Load Product Offers Details 
            ProdOfferImages();
            FetchBillOffersFromOnline()
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
           getData(ui.item.value); 
        },
        minLength: 1
    });

    window.txtTransactionID.text = uniqueNumber();
    console.log(" Transaction ID " + window.txtTransactionID);
}
/************** End of the Page Initialisation ****************/


/*************** Table Operations   **************************/
function onlineActivity(){
    getCurrentTaxValue(function(value){
        console.log(" Value Is the " + value);
        window.CurrentTax = value;
    });
    window.Products.length = 0;
    getProductImage1();
    /** readAll(
        "ProductImage", function(value){
            window.Products.push({ productID : value.productID , ProductName : value.ProductName }); 
        }       
    ); */
}
function offlineActivity(){ 
    loadProductFromDB();
}
function getData( ProductID ){
    alert(" Get Data -: " + ProductID);
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
        setProductInfo(y);
        checkProdOffer(y.ItemCode , function(flag){ 
            console.log("Is ProdUct Offer Avail -:"  + flag);
            setDummyRow(y , flag);
            updateRow();
            fillPayment();
        });       
    });
}
function deleteTableRows(){
    var table1 = document.getElementById("CartTable");
    var row = table1.rows;
    for(var i=1; i<=table1.rows.length; i++){
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
    deleteTableRows();
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
           console.log(" Key is " + key);
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
function setDummyRow(ItemList , discOffer){
    console.log(" %c Product is Adding... " , "color:BLUE;");
    removeEmptyRow();
    var table1 = document.getElementById("CartTable");
    console.log(table1.rows.length);
    var addprodflag = 1;
    console.log("Prod Flag Value -: " + addprodflag);
    if(table1.rows.length > 1) {
        alert("One More Element Is Added");
        for(var i=1; i<table1.rows.length; i++){
            console.log(" %c Row " , "color:BLUE;");
            console.log(" Value is " + table1.rows[i].cells[1].innerHTML);
            if(table1.rows[i].cells[1].innerHTML == ItemList.ItemCode){
                alert(" Change in the Quantity .... ");
                var str = table1.rows[i].cells[4].innerHTML;
                var sellingPrice  = table1.rows[i].cells[8].innerHTML;
                var getQty  = table1.rows[i].cells[4].getElementsByTagName("input")[0].value;
                console.log(" Current input Html -: " + str);
                var current_Qty = (parseInt(getQty )+ parseInt(1));
                console.log(" Current P Qty -: " + current_Qty);
                var res1 = 'value="' + current_Qty  + '"';
                var rep1 = 'value="'+ getQty +'"';
                var replace = str.replace(rep1, res1);
                console.log(" Current input Html -: " + replace);
                table1.rows[i].cells[4].innerHTML = replace;
                addprodflag = 0;
                console.log(" Prod Flag Value -: " + addprodflag);
                alert(" Selling Price " +  sellingPrice);
                var cur_selling_price = parseFloat(current_Qty) * parseFloat(sellingPrice);
                table1.rows[i].cells[9].innerHTML =  cur_selling_price.toFixed(2);
                return;
            }else{

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
var prodOffers = [];
function applyProductPromo(data){
    
    if(data.value == "Apply Promo"){
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
            //    var input = current_row.getElementByTag('input');
             //   console.log(" Row Value is " + input.value);
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
                    } 
            }
            if(data.ProdPromoType === " Special Price "){
                alert(" Special Price Promotion is Adding ");
                current_row.cells[9].innerHTML = data.AddingPrice;
                fillPayment();
              //  offer_row.style.backgroundColor = "YELLOW";
            //    offer_row.value = "Cancel Promotion";
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
        }else {
            alert(" Offer Used ");
        }
    
    });
    }else{
        alert(" Cancel the Promotion ... ");
        window.AppliedProdPromo = 0;
        window.AppliedProdPromoID = 0; 

    }
}
function cancelAppliedProductPromo(){
    SweetAlertInfo(" Cancelling Promo.... ");

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
function updateRow(selectRow){
    var table1 = document.getElementById("CartTable");
}
function removeRow(item){
    var table1 = document.getElementById("CartTable");
    var row = table1.rows;
    if(row.length > 0 ){
        SweetAlertSuccess(" Item Removed Successfully..    ");
        document.getElementById("CartTable").deleteRow(item);
        updateRow();
        if(row.length==1){
            setEmptyRow();
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
        console.log(" Net is online ");
        alert(" Current Net Status is " + check);
        getProductImage1();
        alert(" Product is Added");
        ProductPromoData();
        alert(" Product Offer is Added ");
       FetchBillOffersFromOnline()
       alert(" Bill Product Offer is Added ");
     //   ProdutPromo();
     }else {

        div.style.backgroundColor = "yellow";
        console.log(" Net is offline ");
        alert(" Current Net Status is " + check);
        loadProductFromDB();
     }
});
/*************** End Of the Main Program ********************/

/************** Page Functionality  ************************/
function setProductInfo(ItemList){
    //Product Info..
    document.getElementById('lblProductName').innerText = ItemList.ProductName;
    document.getElementById('lblPrice').innerText = ItemList.LabelPrice;
    document.getElementById('lblStock').innerText = ItemList.PurQty;
    document.getElementById('lblDiscount').innerText = ItemList.Discount;
    document.getElementById('lblUOM').innerText = ItemList.UOM
    document.getElementById('prodImage').src = ItemList.ImgURL;
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
function doHold(){
    //Holding the Value.
    var table1 = document.getElementById("CartTable");
    var row = table1.rows;
    for(var i=1; i<row.length; i++){
        console.log(row[i].cells[0].innerHTML);
        console.log(row[i].cells[8].innerHTML);
    }
    alert(" Item Successfully On Hold... ");
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
function clearAllFields(){
    //Set Customer
    txtCashAmount.value = "0";
    txtTransactionID.value = uniqueNumber();
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
    txtTotal.value = "0";
    txtDiscount.value = "0";
    txtTotalPay.value = "0";
    txtRefund.value = "0";
 }
 var total_tax = 0;
 var total_tax1=0;
 function fillPayment() {
     /** 
      * lblTotalAmount , lblTaxFee ,  lblCashAmt ,  lblVoucherAmmount,  lblTotalDiscount,  lblCreditCard,  lblDebitCard
      * lblTotalTax, lblTotalPayment
     **/
     console.log("-------------Fill Payments --------------------");
     window.lastDiscount;
     var lasttotal , totaltax = 0  , lastDiscount = 0 ;
     lasttotal = 0.00;
     totaltax=0.00;
     totalDiscount = 0.00;
     window.lasttotal = parseFloat(lblTotalAmount.innerHTML,10);
     console.log(" Last Total Ammount : " + window.lasttotal);
     window.lastDiscount  = parseFloat(lblTotalDiscount.innerHTML,10);
     console.log(" Last Total Ammount : " + window.lastDiscount);
     console.log(" Last Tax Details : " + total_tax1);
     console.log(" Current Tax Value " + window.CurrentTax );
     
    // window.total_tax = parseFloat(lblTotalTax.innerHTML);
     var totalItems  = 0;
     var table1 = document.getElementById("CartTable");
     var length  = table1.rows.length;
     //Iterate Table Rows 
     for(var i=1; i<length; i++){

         console.log("--- FOR ------");
         var totalPrice  =  table1.rows[i].cells[9].innerHTML;
         console.log(" Product ID  " + table1.rows[i].cells[1].innerHTML + "Price " + table1.rows[i].cells[5].innerHTML +" Total Price " + table1.rows[i].cells[9].innerHTML);
         var price = table1.rows[i].cells[5].innerHTML; 
         var qty = table1.rows[i].cells[4].getElementsByTagName("input")[0].value;
         console.log("  Fill Payments _; " + totalPrice + " Product Price " + price + "");
         total_tax = calculateTax(false,price , window.lastDiscount ,qty , window.CurrentTax);
         console.log(" Total Tax Value : " + total_tax.toFixed(2));
         total_tax1 += total_tax;
         console.log(" Total Price " + totalPrice + " Total Tax " + total_tax.toFixed(2));
         lasttotal = parseFloat(totalPrice, 10) + lasttotal;
         var addSum = lasttotal;
         lblTotalAmount.innerHTML  = addSum.toFixed(2);
         lblTotalTax.innerHTML =   total_tax1.toFixed(2);
     }
     console.log(" Items Is " + i);
     lblItems.value = i;
     //lblTotalTax.innerHTML =   total_tax.toFixed(2);
     console.log("------------- End Fill Payments --------------------");
 }
 var num=0;
 function plusValue(elem){
   console.log(" Value is " + elem.value);
   num =  elem.value;
   var lblspan = document.getElementById('lblCount450');
   lblspan.innerHTML = num ;
 }
 function OnPay(){
    SweetAlertInfo("On Pay");
 }
 function OnHold(){
    SweetAlertInfo("Holding The Values ");
    var table1 = document.getElementById("CartTable");
    console.log("------- For Holding Value --------");
    for(var i=1; i<table1.rows.length; i++){
        console.log("");
    }
    console.log("------- End Holding Value --------");
 }
 function calculateTax(includetax ,product_price , discount_price  , Quantity , actualtax){
     //For Tax Calculation
     var current_tax = 0; //get From Local Db
     discount_price = 0;
     if(includetax){
         var sales_tax = actualtax / 100 ;
         current_tax = sales_tax * parseFloat(discount_price);
     }else{
         var sales_tax = parseFloat(actualtax) / 100;
         current_tax = sales_tax * product_price;
     }
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
 }
 function chngCashSet(){
     document.getElementById('Chk_Cash').checked = false;
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
    console.log("Get Product Offers FROM API  ");
    var billOffers = [];
    FetchOnBillTotalPromo(104 , function(data){
        var offers  = JSON.parse(data);
        for(var i =0; i<offers.length; i++){
          billOffers[i] = { ID : data[i].ID , FriendlyName : data[i].FriendlyName , PromoCode : data[i].PromoCode , PromoType :data[i].PromoType , DiscountType : data[i].DiscountType , Discount : data[i].Discount , AddedOn : data[i].AddedOn , ExpiredOn: data[i].ExpiredOn , IsActive : data[i.IsActive] , MaxValue : data[i].MaxValue , MinTrans : data[i].MinTrans , PerUserApplied : data[i].PerUserApplied , IsAllProducts : data[i].IsAllProducts , IsTotalPurchasePromo : data[i].IsTotalPurchasePromo , PromoCategory : data[i].PromoCategory , SpecialPrice : data[i].SpecialPrice , RelevantID : data[i].RelevantID , Discount2 : data[i].Discount2  , IsProductFree : data[i].IsProductFree }; 
          add(window.db , "BillOffers", billOffers[i]);  
        }
    });
}
//Get CurrentTax and Set Tax
function getCurrentTax(){
    var obj =  getCurrentTaxValue(function(data){ 
        console.log(" Offers Details Is " + data); 
        window.CurrentTax = parseFloat(data, 10);
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
        add(window.db,"ProductImage", productImage[i]);
    }
    });
}
//Get Product Details FROm DB TO ARRAY
function loadProductFromDB(){
    window.Products.length = 0;
    readAll(
        "ProductImage", function(value){
            window.Products.push({ productID : value.productID , ProductName : value.ProductName }); 
        }       
    );
}
//Get Bill Offers Details FROM API TO DB
function ProdOfferImages(){
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
                   Discount : data1[i].Discount  , 
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
               add(window.db ,"ProdOffers", ProdofferImage[i]);
           }
   });
}
function ProductPromoData(){
    var productPromo = [];
    FetchOnProductPromo("104" , function(data){ 
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
            add(window.db , "ProdOffers" , productPromo[i]);
        }

    });
}
function InsertSellsOrderItem(SellsOrderId  ,ProductId , Dim , PromoRemark , Qty ,Price , Discount1  ,  Discount2 , SellingPrice , TotalPrice ,  Remark ,  AddedBy ,  UpdatedBy , UpdatedOn , StoreID){
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
       UpdatedBy : UpdatedBy , 
       UpdatedOn : UpdatedOn , 
       StoreID : StoreID 
   };
    add(window.db , "SelllOrderItems"  , SellsOrderItems[0]);
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
    add(window.db , "SellsOrder", SellsOrder[0]);
}
// Product Details FROM API TO DB
function getProductImage1(){ 
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