/**
 * Fetch the API FROM Web Service of the ASP.NET 
 * URL OF LOCALHOST : http://localhost:50526/SuperAdmin/New_Terminal/POSTerminal.asmx/###
 * ### is Method Name 
 * 
 */
console.log(" Initialisation of FetchAPI ");
//Get Product Images...
function getProductImage(StoreID ,fn){   
   $.get("http://localhost:50526/New_Terminal/POSTerminal.asmx/ProductImage1", {storeID:StoreID} , function(data, status){
        obj = data ;
       //Insert the Data Into IndexDB 
       fn(data);
     //  console.log(" Data is -: " + JSON.parse(obj));
   }).done(function(){ 
        console.info(" Sucessfully Get Data. ");
        //Set to Index DB
       }).fail(function(){ 
        console.warn(" Failed to Fetch Data ");
   });
}
function getProductImage2(StoreID ,fn){   
    $.get("http://ec2-13-126-49-10.ap-south-1.compute.amazonaws.com/New_Terminal/POSTerminal.asmx/ProductImage1", {storeID:StoreID} , function(data, status){
         obj = data ;
        //Insert the Data Into IndexDB 
        fn(data);
      //  console.log(" Data is -: " + JSON.parse(obj));
    }).done(function(){ 
         console.info(" Sucessfully Get Data. ");
         //Set to Index DB
        }).fail(function(){ 
         console.warn(" Failed to Fetch Data ");
    });
 }
function getCurrentTaxValue(callback){
    $.get("http://localhost:50526/New_Terminal/POSTerminal.asmx/getTaxDetails", [], function(data, status){
         var jobj = JSON.parse(data);
         callback(jobj);
        //save IndexedDB 
   }).done(function(){ 
       console.info("Suceessfully get the Data ");
       }).fail(function(){ 
        console.warn("Error  ");
   });
}
function IsTotalOfferFound(StoreID , callback){
    $.get("http://localhost:50526/New_Terminal/POSTerminal.asmx/IsTotalOfferFound", {storeID:StoreID} , function(data, status){
         console.log(data);
         var jobj = JSON.parse(data);
        callback(jobj);
    }).done(function(){ 
        console.info(" Successfully Get the Data ");
       }).fail(function(){ 
       console.warn("Error");       
    });
}
function FetchOnBillTotalPromo(StoreID , callback){
    $.get("http://localhost:50526/New_Terminal/POSTerminal.asmx/FetchOnBillTotalPromo", {storeID:StoreID} , function(data, status){
         console.log(JSON.stringify(data));
        callback(data);
    }).done(function(){ 
        console.info(" Successfully Get the Data ");
       }).fail(function(){ 
       console.warn("Error");       
    });
}
function FetchOnProductPromo(StoreID , callback){
    $.get("http://localhost:50526/New_Terminal/POSTerminal.asmx/getProductPromotion", {storeID:StoreID} , function(data, status){
       callback(data);
   }).done(function(){ 
       console.info(" Successfully Get the Data ");
      }).fail(function(){ 
      console.warn("Error");       
   });
}
function InsertSellsOrder(){ 
    // Insert Sell Order Invoice 
}
function insertSellOrderItemsAPI(SellsOrderId  ,ProductId , Dim , PromoRemark , Qty ,Price , Discount1  ,  Discount2 , SellingPrice , TotalPrice ,  Remark ,  AddedBy ,  UpdatedBy , UpdatedOn , StoreID){
    $.get("http://localhost:50526/New_Terminal/POSTerminal.asmx/Insert_SellsOrderItems", {SellsOrderId : SellsOrderId  ,ProductId : ProductId , Dim:Dim  , PromoRemark : PromoRemark  , Qty: Qty  ,Price: Price , Discount1 : Discount1  ,  Discount2 : Discount2 , SellingPrice : SellingPrice , TotalPrice : TotalPrice ,  Remark : Remark,  AddedBy : AddedBy ,  UpdatedBy : UpdatedBy, UpdatedOn : UpdatedOn , StoreID : StoreID} , function(data, status){
   //     console.log(data);
       callback(data);
   }).done(function(){ 
       console.info(" Successfully Insert Sells Order Items ");
      }).fail(function(){ 
      console.warn("Error");       
   });
}
function InsertSellsOrderItems(){ 
    //Insert the SellsOrder for Each Item

}
function InsertPaymentTransaction(){    
    //Insert the SellsTransaction
}
function InsertBillPromoCode(){ 
    //Insert the Used Offer Details 
}
function FetchHoldValues(){
    $.get("http://localhost:50526/New_Terminal/POSTerminal.asmx/FetchHoldInvoices",[], function(data, status){
   //     console.log(data);
       callback(data);
   }).done(function(){ 
       console.info(" Successfully Insert Sells Order Items ");
      }).fail(function(){ 
      console.warn("Error");       
   });  
}
function loadProduct(){
    var obj;
    obj = getProductImage(104);
    console.log(" product Image -: " + obj);
}