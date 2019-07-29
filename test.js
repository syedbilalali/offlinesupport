console.log("------------------------ Promise -------------------------------------");
var mypromise = new Promise( function (reject , resolve){
    reject(" Error Occured");
    // resolve(" Success Data !!! ");
})
mypromise.then( function(data){
    console.log(" Msg : " + data );
}, function(data){ 
    console.log(" Msg : " + data );
});

function promiscall(){
    var np = new Promise( function (reject , resolve){
        reject("Error");
    }); 
    return np;
}
promiscall().then(function(msg){ console.log(" Er   Msg : " + msg ); }, function(msg){ console.log(" Su  Msg : " + msg );});
console.log("----------------------Closure----------------------------------------");
function getHelloMeesage(name){
    var displayName  = function(greet){
        console.log(greet  + " " + name);
    }
    return displayName;
}
var mymessage = getHelloMeesage("Bilal");
mymessage("Hi ");
mymessage(" Hello ");
mymessage(" Good Morining  ");
mymessage(" Hello ");
