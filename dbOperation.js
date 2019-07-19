
console.log(" db Operartion Start ");
var db;
var rows = [];
dbConnection("TestDB","1.0","Hello World",2*1024*1024);
function ProductsList(){
    this.SellOrderItemID = "";
    this.Code = "";
    this.ItemName  = "";
    this.Dim  = "";
    this.Qty = "";
    this.TotalQty = "";
    this.LabelPrice = "";
    this.DiscountIst = "";
    this.Discount2nd = "";
    this.SellingPrice = "";
    this.Total = "";
    this.IsRDeturn = "";
    this.ISraft = "";
    this.SellsOrderReturn = "";
    this.IsQtyTxtOn = "";
    this.IsDiscImgOn = "";
    this.IsFreeLabel = "";
}
window.Products = { 
    productID : "" ,
    ProductName : ""
};
function dbConnection(dbName ,dbVersion , dbText , dbSize ){
    db = openDatabase(dbName, dbVersion, dbText, dbSize); 
}
function executeSQL(db , command){
    db.transaction(
        function(tx){
            tx.executeSql(command);
        }
    );
}
function executeSQL(db,  command, paramlist){
    db.transaction(
        function(tx){
            tx.executeSql(command , paramlist);
        }
    );
}
function getData(command , param){
    db.transaction(function(tx){
        tx.executeSql(command ,param , function(tx, results){
            var len =  results.rows.length ,i;
            console.log(" Length -: " + len);
            for(i=0; i<len; i++){ 
                console.log(JSON.stringify(results.rows.item(i)));
            }
        });
    });
}
function getData1(command  ,param){
    db.transaction(function(tx){
        tx.executeSql(command ,param , function(tx, results){
            rows = results.rows;
            console.log(" Get Data Row In getData1 " + JSON.stringify(rows));
        });
    });
    for(var i  in rows){
      console.log(JSON.stringify(results.rows.item(i)));
    }
    return rows ;
}
/**
 * Table List :
 * 1 ProductsList 
 * 2 SellsOrder
 * 3 InsertSellOrderItem 
 * 4 InsertSellsOrder
 * 5 PromotionTable
 * 6 ProductPromotion
 * 7 HoldList
 */

/**
 * CREATION OF THE TABLE IN THE WebSQL 
 */
    executeSQL(db,"CREATE TABLE IF NOT EXISTS SellsOrder (SellOrderItemID , productID , ProductName, unitOfMeasurement , Qty, Price, image ,size , Discount , MaxValue , Quantity , IsReturn , IsDraft ,IsQtyTxtOn ,IsDiscImgOn ,syncInd)");
    executeSQL(db,"CREATE TABLE IF NOT EXISTS SellsOrder (SellOrderItemID , productID , ProductName, unitOfMeasurement , Qty, Price, image ,size , Discount , MaxValue , Quantity , IsReturn , IsDraft ,IsQtyTxtOn ,IsDiscImgOn , syncInd)");
    executeSQL(db ,"CREATE TABLE IF NOT EXISTS ProdPromo (ProductID , MinProductItems , Scheme , AdditionalValue , FriendlyName , PromoCode  , Discount , MaxValue , PerUserApplied , Buy  , Get , PromotionID , ProdPromoType ,GetType , OnQty , AddingPrice , syncInd)");
    executeSQL(db, "CREATE TABLE IF NOT EXISTS Promo (ID , FriendlyName  , PromoCode  , PromoType  , DiscountType , Discount  , AddedOn , AddedBy  , ExpiredOn , IsActive , MaxValue , MinTrans , PerUserApplied , IsAllProducts , IsTotalPurchasePromo  , PromoCategory , SpecialPrice  , RelevantID , Discount2 , IsProductsFree , updatedAt , updateBy , syncInd )");
    executeSQL(db ,"CREATE TABLE IF NOT EXISTS Temp (tempID , tempName , tempValue , syncInd )");
    executeSQL(db,"CREATE TABLE IF NOT EXIST SellsOrder(ID , SellsOrderId , CustomerID , Total , Tax , TotalDiscount , Voucher, VoucherDiscount , PaymentModeCharge , TotalPay , Remark , AddedBy , AddedOn , CustomerTransaction,IsActive , Status , IsDraft , UpdatedOn , UpdatedBy , storeID , TerminalID, syncInd )");
    executeSQL(db , "CREATE TABLE IF NOT EXIST SellsOrder( ID , SellOrderID, ProductID , Dim, Qty , LblPrice , Discount1 , Discount2 , PromoRemark ,SellingPrice , TotalPrice , Remark , AddedBy , AddedOn IsReturn , syncInd)");
    executeSQL(db , "CREATE TABLE IF NOT EXISTS SellTransaction (SellOrderID, Amount , PaymentMode  , BankName , BankCard , Cardno, VoucherCode , Gatewaytransaction,PaymentStatus  , AddedOn , AddedBy , syncInd)");


function insertProductImage(SellOrderItemID , productID , ProductName , unitOfMeasurement , Qty , Price , image , size  , Discount , MaxValue , Quantity , IsReturn , ISDraft ,  IsQtyTxtOn , IsDiscImgOn ){
   //    console.log(SellOrderItemID + " " + productID + " " + ProductName  + " " + unitOfMeasurement + " " + Qty + " " + Price + " " + image + " " + size + " " + Discount + " " + MaxValue + " " + Quantity + " " + IsReturn + " " + ISDraft + " " + IsQtyTxtOn + " " + IsDiscImgOn );
    executeSQL(db,'INSERT INTO SellsOrder (SellOrderItemID , productID , ProductName, unitOfMeasurement , Qty, Price, image ,size , Discount , MaxValue , Quantity , IsReturn , IsDraft ,IsQtyTxtOn ,IsDiscImgOn)  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[SellOrderItemID , productID , ProductName , unitOfMeasurement , Qty , Price , image , size  , Discount , MaxValue , Quantity , IsReturn , ISDraft ,  IsQtyTxtOn , IsDiscImgOn]);
}
function insertProdPromo(ProductID , MinProductItems , Scheme  , AdditionalValue , FriendlyName , PromoCode , Discount , MaxValue , PerUserApplied , Buy , Get , PromotionID , ProdPromoType , GetType , OnQty , AddingPrice){
//    executeSQL();
}
function insertPromo(ID , FriendlyName , PromoCode  , PromoType , DiscountType , Discount , AddedOn  , AddedBy , ExpiredOn , IsActive , MaxValue , MinTrans , PerUserApplied  ,IsAllProducts , IsTotalPurchasePromo , PromoCategory , SpecialPrice  , RelevantID , Discount2 , IsProductsFree , updatedAt , updatedAt){
 // executeSQL();
}
function updateTempValue(tempID , syncInd){
    executeSQL(db , "UPDATE temp SET syncInd=? WHERE tempID =?  " , [tempID , syncID ]);
}
function insertTemptoLocal(tempID , tempName , tempValue , syncInd){
    executeSQL(db ,"INSERT INTO Temp (tempID , tempName , tempValue , syncInd) VALUES(?,?,?,?)" , [tempID , tempName , tempValue , syncInd]);
}
function insertTempCDB(tempID , tempName1 , tempValue1  ){
    $.get("http://localhost:50526/New_Terminal/POSTerminal.asmx/insertTempData",{ tempName : tempName1 , tempValue : tempValue1}, function(data, status){
        var jobj = JSON.parse(data);
       // Display the returned data in browser
         console.log("Get Current Tax Value " + jobj);
         updateTempValue(tempID , "1");
         if(jobj == "1"){
            alert(" Insert Value Successfully... ");
         }
   }).done(function(){ 
      alert(" Successfully Get ");
      // loadFromDB();
       }).fail(function(){ 
      alert(" Failed to Load.. ");
      // loadFromDB();
   });
}
function getTempData(){
    $.get("http://localhost:50526/New_Terminal/POSTerminal.asmx/getTempData", [], function(data, status){
        var jobj = JSON.parse(data);
       // Display the returned data in browser
         console.log("Get Temp Data " + jobj);
         for(var i in jobj){
            insertTemptoLocal(jobj[i].tempID , jobj[i].tempName , jobj[i].tempValue , 0);
         }
   }).done(function(){ 
      alert(" Successfully Temp Data  Load ");
      // loadFromDB();
       }).fail(function(){ 
      alert(" Failed to Load.. ");
      // loadFromDB();
   });
}
function uploadtoServer(){
    var rows = this.getData1(" SELECT * FROM temp WHERE syncInd=0");
    var length  = rows.length ;
    var tempObj = JSON.parse(rows);
    if(tempObj.length  >  0 ){
        for(var i in tempObj){
            insertTempCDB(tempObj[i].tempName ,tempObj[i].tempValue );
        }
    }else{
        console.log(" Don't Found Any to Update... ");
    }
}
function getPromotion_Log(){
}
function getCurrentTaxValue(){

    $.get("http://localhost:50526/New_Terminal/POSTerminal.asmx/getTaxDetails", [], function(data, status){
        var jobj = JSON.parse(data);
       // Display the returned data in browser
         console.log("Get Current Tax Value " + jobj);
   }).done(function(){ 
   //   alert(" Successfully Get ");
      // loadFromDB();
       }).fail(function(){ 
     // alert(" Failed to Load.. ");
      // loadFromDB();
   });
}
function getProductOffer(StoreID){

    $.get("http://localhost:50526/New_Terminal/POSTerminal.asmx/getProductPromotion", {storeID : StoreID }, function(data, status){
        var jobj = JSON.parse(data);
       // Display the returned data in browser
         console.log("Get Current Tax Value " + jobj);
   }).done(function(){ 
      alert(" Successfully Get getPrductOffers ");
      // loadFromDB();
       }).fail(function(){ 
      alert(" Failed to Load..  getProductOffers");
      // loadFromDB();
   });
}

function loadProductsList(){
    var row = getData1("SELECT productID , ProductName FROM SellsOrder ", []);
    console.log("LoadProduct Is -: " + row)
    var len  = row.length;
    console.log(" LOAD PRODUCT IN THE LENGTH " + len);
    if(row.length > 0 ){
        console.log(" Rows Found  In browser table ");
        var len  = row.length;
        console.log(" loadProducts -: " + len);
        for(var i in row){
            console.log(" Product Id -; " +row.item(i).productID + " Product Name " +  row.item(i).ProductName );
            Products[i] =  { productID : row.item(i).productID , ProductName : row.item(i).ProductName }; 
        }
    }else {
        console.log(" Rows not Found  In browser table  ");
        Products[i] =  { productID : "" , ProductName : "Sorry No Products.. " };
    }
}
function savetoHold(){
  //For Saving The Cart Data
  alert(" Transaction Hold Successfully.. ");
}

function retriveOnHold(){
   // For Fetching the Hold Data.
   alert(" Transaction Retrive Successfully.. ");
}
function doSync(){

}  
