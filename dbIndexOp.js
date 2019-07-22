console.log(" Initialisation of Indexdb ");
window.indexedDB = window.indexedDB || window.mozIndexedDB || 
window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || 
window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || 
window.msIDBKeyRange
if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}
window.db;
var request = window.indexedDB.open("POS_CLIENT",1);
request.onerror = function(event) {
   console.log("error: ");
};
request.onsuccess = function(event) {
   window.db = request.result;
  // var objectStore = db.createObjectStore("ProductImage", {keyPath: "productID"});
   console.log("Data Created Success: "+ db);
};
request.onupgradeneeded = function(event) {
   var db = event.target.result;
   var objectStore = db.createObjectStore('ProductImage', { keyPath: 'productID'});
   objectStore.createIndex("ProductName", "ProductName", { unique: false });
   var OfferStore = db.createObjectStore('BillOffers' , { keyPath: 'ID'}  );
   OfferStore.createIndex("FriendlyName", "FriendlyName" ,{ unique : false }); 
   var OfferStore = db.createObjectStore('ProdOffers' , { keyPath: 'ProductID'}  );
   OfferStore.createIndex("FriendlyName", "FriendlyName" ,{ unique : false }); 
   var SellOrder = db.createObjectStore("SellsOrder", { keyPath : 'SellsOrderId'});
   //SellOrder.createIndex("");
   var SellsOrderItems = db.createObjectStore("SellsOrderItems" ,{ keyPath: "id", autoIncrement:true });
   SellsOrderItems.createIndex("SellsOrderId", "SellsOrderId", { unique: false });
   var SellTransactioin =db.createObjectStore("SellTransaction" , { keyPath : 'SellsOrderId'});
   var Promotion_Log =  db.createObjectStore("Promotion_Log" , { keyPath : 'Id'});
}
function createTable(tablename , primarykey ){
  this.db.createObjectStore(tablename , {keyPath: primarykey})  
}
function read(tablename , dataID , callback){
    var transaction = this.db.transaction(tablename);
    var objectStore = transaction.objectStore(tablename);
    var request = objectStore.get(dataID);
    request.onerror = function(event) {
        alert("Unable to retrieve daa from database!");
     };
     request.onsuccess = function(event) {
        // Do something with the request.result!
        if(request.result) {
           // // Data Found Here...
           callback(request.result);
        } else {
           //Data Not Found...
           console.log(" Data Is Not Found.. ");
           callback("No");
        }
     };
}
function readAll(tablename , callback) {
    var objectStore = this.db.transaction(tablename).objectStore(tablename);
    objectStore.openCursor().onsuccess = function(event) {
       var cursor = event.target.result;
       if (cursor) {
         // alert("Name for id " + cursor.key + " is " + cursor.value.name + ", Age: " + cursor.value.age + ", Email: " + cursor.value.email);
         //Iterate All the json Value Here.
          callback(cursor.value);
          cursor.continue();
       } else {
        //  alert("No more entries!");
        //Data Not Found....
       }
    };
}
function add(db, tablename , data) {
    var request = window.db.transaction([tablename], "readwrite").objectStore(tablename).put(data);
    request.onsuccess = function(event) {
        console.log(" Data has been added to your database. ");
    };
    request.onerror = function(event) {
        console.log("Unable to add data\r\nData is already exist in your database! ");
    }
 }
 function add1(db , data, callback , tablename) {
    const tx = db.transaction([tablename], "readwrite");
    data.forEach(value => {
        console.log(" For Each Data is -: " +  value);
        let request = tx.objectStore(tablename).add(data);
    })
    tx.oncomplete = function(event) {
        callback();
    }
};
function remove(tablename , dataID) {
    var request = db.transaction([tablename], "readwrite").objectStore(tablename).delete(dataID);
    request.onsuccess = function(event) {
      // alert("Kenny's entry has been removed from your database.");
    }
    request.onerror = function(event){
      //alert("");
    }
}
function remove1(tablename , dataID , callback) {
   var request = db.transaction([tablename], "readwrite").objectStore(tablename).delete(dataID);
   request.onsuccess = function(event) {
     // alert("Kenny's entry has been removed from your database.");
     callback("Success");
   }
   request.onerror = function(event){
     //alert("");
     callback("Error");
   }
}
function clearTableData(tablename ,  callback){
   var objectstore = this.db.transaction([tablename], "readwrite").objectStore(tablename);
   var objreq = objectstore.clear();
   objreq.onsucess = function(event){
         callback("SUCESS",event);
   }
   objreq.onerror = function(event){
      callback("FAILED", event);
   }
}
function update(tablename , dataID , value){
   var objectStore = this.db.transaction(tablename).objectStore(tablename);
   var req = objectStore.openCursor();
   req.onerror = function (event){
       alert(" Failed to update the Value ");
   }
   req.onsuccess = function(event){
      var cursor = event.target.result;
      if(cursor){
        
      }else{
         alert(" No Data Find ");
      }
   }
}
function getProductImageFromDB(db , tablename){
    var objectStore = db.transaction(tablename).objectStore(tablename);
    var data = [];
    objectStore.openCursor().onsuccess = function(event) {
       var cursor = event.target.result;
       if (cursor) {
          console.log(" Data is the " + cursor);
         data.push({ productID : cursor.value.productID , productName : cursor.value.productName });
          cursor.continue();
       } else {
        console.log(" Data is the " + cursor);
       data.push({ productID : "" , productName : "Sorry No Product Found.." });
       }
    };
    return data;
}
