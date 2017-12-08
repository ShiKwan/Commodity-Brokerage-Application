$(document).ready(function(){

  var commoPriceAPIKey = "Lifi3bz7tjhN4lcErh3TW3oUnzY06tvGPdX1t3IPFefTJdlU1EFAQkKuD6tT";
  var commodity = [];

  initialization();
  getCommodity();
  console.log(commodity);

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
  var dbCommodity = database.ref("/commodity");
  var jsonCommodity = JSON.stringify(commodity);


var options = {
      url: "https://shikwan.github.io/Project1/assets/javascript/quandlResource.json",
      getValue: "name",
      list: {
        match: {
          enabled: true
        }
      }
    };
    $("#txtCommoditySearch").easyAutocomplete(options);

function quandlResources(){

  //Use this to get the code to query Quandl API
  $.ajax({
    url: "https://shikwan.github.io/Project1/assets/javascript/quandlResource.json",
    method: "GET"
  }).done(function (response){
    //console.log(response);
  })

}
  


//getCommodity();

//getCommodityPrice();

//getSpecificCommodity();


//TO-DO: 
// initialize the page:
  // show the carousel
  // hide graph, commodity info, commodity news
  // hide msg center.

function initialization(){
  $(".divCarousel").show();
  $(".divGraph").hide();
  $(".divCommodityInfo").hide();
  $(".divCommodityNews").hide();
}





$("#submit-bid").on("click", function(){
  //TO-DO: change the value to the commodity textbox
  var commodity = "coffee".trim()
  //look into quandll database, if search word exists in quandll, do API query in quandl,
      //if data exist,
        //look into the data, get the earliest and latest date
            //update the datepicker for start and end date. 
                // show graph, the info, and news


  // else, look into commoPrices, if search word exists in commoPrices, do API query in commoPrices,
      //if data exist,
        //look into data, get the earliest and latest date
          //update the datepicker for start and end date.
              //if data exist, show graph, info, and news
  // else, prompt user about our lack of resource and we should be ashame of ourselves.
      //display msg box
      //show news


  //clear the search textbox, clear date picker




})

getQuandlCommodityPrice();

getNews("coffee");

function getNews(qry){
  var nytAPI = "7efd7705bed343d498f6b717ffda6638"

var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
url += '?' + $.param({
  'api-key': nytAPI,
  'q': qry,
  'sort': "newest"
});
$.ajax({
  url: url,
  method: 'GET',
}).done(function(result) {
  console.log(result);
}).fail(function(err) {
  console.log("error");
  console.log(err);
});
}

function getQuandlCommodityPrice(){
  // source: https://blog.quandl.com/api-for-commodity-data
  // example: https://www.quandl.com/api/v3/datasets/CHRIS/CME_SI1?api_key=zJfAxbFspqTfsfyq6Vzz
  var quandlAPIKey = "zJfAxbFspqTfsfyq6Vzz";
  var quandlCommodityCode = "LBMA/GOLD" //hard coded temporarily
  var queryURL = "https://www.quandl.com/api/v3/datasets/" + quandlCommodityCode +"?api_key=" + quandlAPIKey + "&start_date=2017-05-24&end_date=2017-06-28"

  $.ajax({
    url: queryURL,
    method: "GET"
  })
  .done(function(response){
    var result = response.dataset;
    var adjustedArr = [];

    adjustedArr =  getData(adjustedArr, result.column_names, result.data)
    //console.log(adjustedArr);
    googleChartGenerator(adjustedArr, result.name);

    //console.log(result);
  }).fail(function(response){
    console.log("Error retrieving data from quandl");
  })
}
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
    var result = response.data;
    var adjustedArr = [];
    adjustedArr =  getData(adjustedArr, result.column_names, result.data);
    //console.log(adjustedArr)
   // console.log("CommoPrices: get specific commodity");
    //console.log(response.data.info);
  });

}
function getData(adjustedArray, columnNamesArray, dataArray){
  var getdata = [];
  adjustedArray =[];
    getdata.push([columnNamesArray]);
    
    for(var i = 0; i< dataArray.length; i++){
      getdata.push([dataArray[i]]);
    }
    for(var i = 0; i < getdata.length; i++){
      adjustedArray.push(getdata[i][0]);
    }
    return adjustedArray
}
function getCommodityPrice(){
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.commoprices.com/v1/imf/PCOFFROB/data?",
    "method": "GET",
    "headers": {
      "authorization": "Bearer " + commoPriceAPIKey ,
      "accept": "application/json"
    }
  }

  $.ajax(settings).done(function (response) {
    //console.log("CommoPrice: get commodity price");
    //console.log(response.data);
    var adjustedArr = [];
    adjustedArr =  getData(adjustedArr, response.data.request.column_names, response.data.request.dataseries);
    //googleChartGenerator(adjustedArr, response.data.info.name);
  }).fail(function(response){
    console.log(response);
  });

}
function googleChartGenerator(priceData, graphTitle){
   google.charts.load('current', {'packages' :['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart(){
      var data = google.visualization.arrayToDataTable(priceData);

      var options = {
        title: graphTitle, 
        curveType: "function",
        legend: {position: "right"},
        animation:{
        duration: 1000,
        easing: 'out'
        }
      };
      
      var chart = new google.visualization.AreaChart(document.getElementById('curve_chart'));
      chart.draw(data,options);
    }
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


    console.log("Commo Price: get commodity");
    var totalItems = (response.data.length);
    dbCommodity.remove();
    for(var i = 0; i < totalItems; i++){
      var objCommodity = {
        database : response.data[i].database,
        code : response.data[i].code,
        name : response.data[i].name
      }

      dbCommodity.push({
        from : response.data[i].database,
        code : response.data[i].code,
        name : response.data[i].name
      });
      commodity.push(objCommodity);
    }

  }).fail(function(response){
    console.log(response.responseText);
  });
}



dbCommodity.once("value", function(snapshot){
  console.log(snapshot.val());
})

       var myIndex = 0;
        carousel();

        function carousel() {
            var i;
            var x = document.getElementsByClassName("mySlides");
            for (i = 0; i < x.length; i++) {
                x[i].style.display = "none";
            }
            myIndex++;
            if (myIndex > x.length) { myIndex = 1 }
            x[myIndex - 1].style.display = "block";
            setTimeout(carousel, 9000);
        }



  });
