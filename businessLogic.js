function getProductList(StoreID){
    try {

        $.get("http://localhost:50526/New_Terminal/POSTerminal.asmx/ProductImage1", {storeID:104} , function(data, status){

            var jobj = JSON.parse(data);

            for(var i in jobj){

                //Set Data in the Browser 
                insertProductImage(jobj[i].SellsOrderItemID,jobj[i].productID, jobj[i].ProductName ,jobj[i].unitOfMeasurement , jobj[i].Qty , jobj[i].Price , jobj[i].image , jobj[i].size , jobj[i].Discount , jobj[i].MaxValue, jobj[i].Quantity,jobj[i].IsReturn , jobj[i].IsDraft ,jobj[i].IsQtyTxtOn , jobj[i].IsDiscImgOn);
                Products[i] =jobj[i].productID +"-"+ jobj[i].ProductName;
            }
            console.log( status +  " From the Get " + jobj);
            console.log("Products -: "  + Products);

       }).done(function(){ 
           alert(" Successfully Get ");
           loadFromDB();
           }).fail(function(){ 
           alert(" Failed to Load.. ");
           loadFromDB();
       });
    }catch{
      console.error(" Exception occured in getProductList");
    }
}
function getProductSearchList(){

}
function setProductSearchList(){
    db.transaction(function(tx){
        tx.executeSql("SELECT * FROM SellsOrder ",[] , function(tx, results){
            var len =  results.rows.length;
            for(i=0; i<len; i++){ 
              Products[i] = { productID : results.rows.item(i).productID , ProductName : results.rows.item(i).ProductName }; 
            }
        });
    });
}
function getOffersDetails(){
    db.transaction(function(tx){
        tx.executeSql("SELECT * FROM Promotions ",[] , function(tx, results){
            var len =  results.rows.length;
            for(i=0; i<len; i++){ 
              Products[i] = { productID : results.rows.item(i).productID , ProductName : results.rows.item(i).ProductName }; 
            }
        });
    });
}
function insertOffers(){

}
function getProductPromotion(storeID ){
    try {

        $.get("http://localhost:50526/New_Terminal/POSTerminal.asmx/getProductPromotion", {storeID:104} , function(data, status){

            var jobj = JSON.parse(data);

            for(var i in jobj){

                //Set Data in the Browser 
                insertProductImage(jobj[i].SellsOrderItemID,jobj[i].productID, jobj[i].ProductName ,jobj[i].unitOfMeasurement , jobj[i].Qty , jobj[i].Price , jobj[i].image , jobj[i].size , jobj[i].Discount , jobj[i].MaxValue, jobj[i].Quantity,jobj[i].IsReturn , jobj[i].IsDraft ,jobj[i].IsQtyTxtOn , jobj[i].IsDiscImgOn);
                Products[i] =jobj[i].productID +"-"+ jobj[i].ProductName;
            }
            console.log( status +  " From the Get " + jobj);
            console.log("Products -: "  + Products);

       }).done(function(){ 
           alert(" Successfully Get ");
           loadFromDB();
           }).fail(function(){ 
           alert(" Failed to Load.. ");
           loadFromDB();
       });
    }catch{
      console.error(" Exception occured in getProductList");
    }
}
