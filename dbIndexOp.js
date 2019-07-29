console.log(" Initialisation of Indexdb ");

//Current Browser IndexedDB
 var db = null; 
   window.indexedDB = window.indexedDB || window.mozIndexedDB ||  window.webkitIndexedDB || window.msIndexedDB;
//Set Current Database Transaction Objects 
   window.IDBTransaction = window.IDBTransaction ||  window.webkitIDBTransaction || window.msIDBTransaction;
//Set KeyRange Of Current Database
   window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}
var request = window.indexedDB.open("POS_CLIENT",1.1);
   request.onerror = function(event) {
   console.log("DB Error : Database not open. ");
};
request.onsuccess = function(event) {
   window.db = request.result;
   console.log("DB Created Success: ");
   console.log(db);
   console.log("Window DB is ");
   console.log(window.indexedDB);
};
request.onupgradeneeded = function(event) {

   var db = event.target.result;
   window.db = event.target.result;
   var objectStore = db.createObjectStore('ProductImage', { keyPath: 'productID'});
   objectStore.createIndex("ProductName", "ProductName", { unique: false });
   var OfferStore = db.createObjectStore('BillOffers' , { keyPath: 'ID'}  );
   OfferStore.createIndex("FriendlyName", "FriendlyName" ,{ unique : false }); 
   var OfferStore = db.createObjectStore('ProdOffers' , { keyPath: 'ProductID'}  );
   OfferStore.createIndex("FriendlyName", "FriendlyName" ,{ unique : false }); 
   var SellOrder = db.createObjectStore("SellsOrder", { keyPath : 'SellsOrderId'});
   //SellOrder.createIndex("");
   var SellsOrderItems = db.createObjectStore("SellsOrderItems" ,{ keyPath: "id", autoIncrement:true });
   SellsOrderItems.createIndex("SellsOrderItems", "SellsOrderId", { unique: false });
   var SellTransactioin =db.createObjectStore("SellTransaction" , { keyPath : 'SellsOrderId'});
   var Promotion_Log =  db.createObjectStore("Promotion_Log" , { keyPath : 'Id'});
   var ProductPics = db.createObjectStore("ProductPics");
}
function createTable(tablename , primarykey ){
  window.db.createObjectStore(tablename , {keyPath: primarykey})  
}
function read(tablename , dataID , callback){

    var transaction = window.db.transaction(tablename);
    var objectStore = transaction.objectStore(tablename);
    var request = objectStore.get(dataID);
    request.onerror = function(event) {
        alert("Unable to retrieve data from database!");
     };
     request.onsuccess = function(event) {
        // Do something with the request.result!
        if(request.result) {
           callback(request.result);
        } else {
           console.log(" Data Is Not Found.. ");
           callback("No");
        }
     };
}
function read1(tablename , dataID){
   var transaction = window.db.transaction(tablename);
   var objectStore = transaction.objectStore(tablename);
   var request = objectStore.get(dataID);
   var rp = new Promise(function(reject , resolve){ 
            request.onerror = function(event){
                  reject(event);
            };
            request.onsuccess = function (event){
               if(request.result) {
                  resolve(request.result);
               } else {
                  console.log(" Data Is Not Found.. ");
                  resolve("No");
               }
            }
   });
   return rp;
}
function readKeyRange(tablename, callback, indexname , valuearray) {

   console.log(" Inside Key Rnage Funtion ...");
   var transaction = window.db.transaction(tablename);

   console.log(" Transaction " + transaction);
   var objectStore = transaction.objectStore(tablename);

   console.log(" Object Store " + objectStore);
   var index = objectStore.index(indexname);

   console.log(" Index is " + index);
   var request = index.openCursor(IDBKeyRange.only(valuearray));

   console.log(" Request is " + request);
   request.onerror = function(event){
      alert(" Unable to retrive data fromn the database. ");
   }
   request.onsucess = function(event){
      // 
      console.log(" Data Come on Success ");
      if(request.result){
         console.log(" After Result ... ");
         callback(request.result);
      } else {
         console.log(" Data is not found... ");
         callback("No");
      }
   }
}
function readAll(tablename , callback) {
   console.log(" Current DB  is ");
   console.log(window.db);
    var objectStore = window.db.transaction(tablename).objectStore(tablename);
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
function readAll1(tablename){
   var objectStore = window.db.transaction(tablename).objectStore(tablename);

    objectStore.openCursor().onsuccess = function(event) {
       var cursor = event.target.result;
       var rp = new Promise(function(reject , resolve){
            if(cursor){
               resolve(cursor.value);
               cursor.continue();
            }else {
               
            }
       });
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
    objectStore.openCursor().onerror = function(event){

    }
}
function _readAll(tablename){

}
function addImage(tablename , key, data){
   var request =  window.db.transaction([tablename], "readwrite").objectStore(tablename).put(data , key);
   var mp = new Promise(function(resolve  , reject){
      request.onsuccess = function(event) {
         resolve(event);
     };
     request.onerror = function(event) {
         console.log("Unable to add data\r\nData is already exist in your database! ");
         reject(event);
     }
   });
   return mp;
}
function add(dbs, tablename , data) {
    console.log(" Parameter DB ");
    console.log(dbs);
    console.log(" Current DB is ");
    console.log(window.db);
    var request =  window.db.transaction([tablename], "readwrite").objectStore(tablename).put(data);
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
function remove_promise(tablename , dataID){
   var request = db.transaction([tablename], "readwrite").objectStore(tablename).delete(dataID);
   var np  = new Promise(function(reject , resolve){
      request.onsuccess = function(event){
         resolve(event);
      }  
      request.onerror = function(event){
         reject(event);
      }  
   });
   return np;
}
function clearTableData(tablename ,  callback){

   var objectstore = window.db.transaction([tablename], "readwrite").objectStore(tablename);
   var objreq = objectstore.clear();
   objreq.onsucess = function(event){
         callback("SUCESS",event);
   }
   objreq.onerror = function(event){
      callback("FAILED", event);
   }
}
function update(tablename , dataID , value){
   var objectStore = window.db.transaction(tablename).objectStore(tablename);
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
