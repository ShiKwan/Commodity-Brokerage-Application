  $(document).ready(function(){

 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCC244ApGQyz873Hf48J6yBoelnUxBppMY",
    authDomain: "project1-import-export.firebaseapp.com",
    databaseURL: "https://project1-import-export.firebaseio.com",
    projectId: "project1-import-export",
    storageBucket: "",
    messagingSenderId: "52575437459"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  commoPriceAPIKey = "Lifi3bz7tjhN4lcErh3TW3oUnzY06tvGPdX1t3IPFefTJdlU1EFAQkKuD6tT"


getCommodity();

getCommodityPrice();

getSpecificCommodity();



function getSpecificCommodity(){
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.commoprices.com/v1/imf/PCOFFROB",
    "method": "GET",
    "headers": {
      "authorization": "Bearer " + commoPriceAPIKey ,
      "accept": "application/json"
    }
  }

  $.ajax(settings).done(function (response) {

console.log("get specific commodity");
    console.log(response);
  });

}


function getCommodityPrice(){
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.commoprices.com/v1/imf/PCOFFROB/data",
    "method": "GET",
    "headers": {
      "authorization": "Bearer " + commoPriceAPIKey ,
      "accept": "application/json"
    }
  }

  $.ajax(settings).done(function (response) {

console.log("get commodity price");
    console.log(response);
  });

}

function getCommodity(){

  //wrb / imf -free
  // com / cop / crp / fag / inp / soe / aly -premium account

var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://api.commoprices.com/v1/imf",
  "method": "GET",
  "headers": {
    "authorization": "Bearer " + commoPriceAPIKey,
    "accept": "application/json"
  }
}

$.ajax(settings).done(function (response) {

console.log("get commodity");
  console.log(response);
}).fail(function(response){
  console.log(response.responseText);
});
}






  });