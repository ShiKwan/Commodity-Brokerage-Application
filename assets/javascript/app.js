
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
 function closeForm() {
        $("#messageSent").show("slow");
        setTimeout('$("#messageSent").hide();$("#contactForm").slideUp("slow")', 2000);
    }
$(document).ready(function(){
  // slide form field
      $(".btn2").click(function() {
          if ($("#contactForm").is(":hidden")) {
              $("#contactForm").slideDown("slow");
          } else {
              $("#contactForm").slideUp("slow");
          }
      });
  // closing form slider  https://designshack.net/articles/javascript/creating-a-slide-in-jquery-contact-form/
 

    
  var commoPriceAPIKey = "Lifi3bz7tjhN4lcErh3TW3oUnzY06tvGPdX1t3IPFefTJdlU1EFAQkKuD6tT";
  var commodity = [];

  initialization();
  populateAutocompleteCommodity();
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
  var adjustedArr = [];

function populateAutocompleteCommodity(){

    //get commodity first before populating the textbox with easy auto complete js.
    getCommodity();
    getJSONCommodity();

  var options = {
      data: commodity,
      getValue: "name",
      list: {
        match: {
          enabled: true
        }
      }
    };
    $("#txtCommoditySearch").easyAutocomplete(options);
/*  END UP PARSING JSON FILES INTO COMMODITY VARIABLE, SAVE THIS FOR FUTURE REFERENCE
    var options2 = {
    data: commodity,
    getValue: "name",
    list: {
      match: {enabled: true}
    }
};*/
}


function quandlResources(){
  //Use this to get the code to query Quandl API
  $.ajax({
    url: "https://shikwan.github.io/Project1/assets/javascript/quandlResource.json",
    method: "GET"
  }).done(function (response){
    //console.log(response);
  })
}
  

//CommoPrice
//getCommodity();

//CommoPrice
//getCommodityPriceFromCommoPrices();

//CommoPrice
//getSpecificCommodity();

//getQuandlCommodityPrice();

//getSpecificCommodity();
var graphStartDate, graphEndDate; 
function initialization(){
  $(".divCarousel").show();
  $(".divGraph").hide();
  $(".divCommodityInfo").hide();
  $(".divCommodityNews").hide();
  $("#msg-center").hide();
}
console.log("getcommodity");
getCommodity();

function getGraphStartEndDateFromCommoPrices(data){
  var lengthOfData = data.request.dataseries.length;
  graphStartDate = data.request.dataseries[0][0];
  graphEndDate = data.request.dataseries[lengthOfData-1][0];
}

function populateCommodityInfo(data){
  if(data){
    console.log("popcominfo");
    console.log(data);
    $(".divCommodityInfo").show();
    var divContainer = $("<div>");
    var codeDiv = $("<div>");
    var databaseDiv = $("<div>");
    var frequencyDiv = $("<div>");
    var nameDiv = $("<div>");
    var oldest_data_availableDiv = $("<div>");

    codeDiv.text("Code : " + data.info.code);
    databaseDiv.text("Database : " + data.info.database);
    frequencyDiv.text("Frequency : " + data.info.frequency);
    nameDiv.text("Name: " + data.info.name);
    oldest_data_availableDiv.text("Oldest available date: " + data.info.oldest_available_date);

    divContainer.append(databaseDiv).append(frequencyDiv).append(nameDiv).append(oldest_data_availableDiv);
    $(".commodity-info-container").append(divContainer);

  }
}

function populateNews(data){
  if(data){
    console.log(data);
    console.log("in populateNews");
    $(".divCommodityNews").show();
    for(var i = 0; i < data.length; i++){
      var divContainer = $("<div>");
      var byLineDiv = $("<div>");
      var headlineDiv = $("<h1>");
      var multimediaImg = $("<img>");
      var snippetDiv = $("<div>");
      var web_urlDiv = $("<div>");
      var sourceDiv = $("<div>");
      byLineDiv.text(data.byline);
      headlineDiv.text("Headline: " + data[i].headline.main);
      multimediaImg.attr("src", "https://www.nytimes.com/" + data[i].multimedia[1].url);
      snippetDiv.text("Snippet: " + data[i].snippet);
      web_urlDiv.text("Read more : " +data[i].web_url);
      sourceDiv.text("Source : " +data[i].source);
      divContainer.append(headlineDiv).append(byLineDiv).append(multimediaImg).append(snippetDiv).append(web_urlDiv).append(sourceDiv);
      $(".commodity-news-container").prepend(divContainer);
    }
  }
}


$("#submit").on("click", function(){
  //TO-DO: change the value to the commodity textbox
  event.preventDefault();
  var searchCommodity = $("#txtCommoditySearch").val();
    for(var i = 0; i< commodity.length; i++){

      if(commodity[i].name == searchCommodity){
        console.log(commodity[i]);
        console.log("found identical search value!");        
        if(commodity[i].database){
          $(".commodity-search-field-container").hide();
          commoData = getCommodityPriceFromCommoPrices(commodity[i].code);
          getGraphStartEndDateFromCommoPrices(commoData);
          $("#dpStartDate").val(graphStartDate);
          $("#dpEndDate").val(graphEndDate);
          googleChartGenerator(adjustedArr, commoData.info.name);
          populateCommodityInfo(commoData);
          populateNews(getNews(commoData.info.name));
          return false;
          //look into commoprice
        }else{
          commoData = getQuandlCommodityPrice(commodity[i].database);
          //look into quandl
        }
      }else{
       //couldn't find anything in our library 

      }
    }
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




function getNews(qry){
  var nytAPI = "7efd7705bed343d498f6b717ffda6638"
  var returnValue = [];

  var searchKey = qry.replace(/,/g, '|').split('|');
  console.log(searchKey);
  //for (var i = 0; i<searchKey.length-1; i++){
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({
      'api-key': nytAPI,
      'q': searchKey[0],
      'sort': "newest"
    });
    $.ajax({
      url: url,
      method: 'GET',
      "async": false
    }).done(function(result) {
      if(result.status == "OK"){
        returnValue = result.response.docs ;
      }
      console.log(result);
      console.log("returnvalue: ");
      console.log(returnValue);
    }).fail(function(err) {
      console.log("error");
      console.log(err);
    });
  //}

  console.log("test");
  if(returnValue){
    console.log("Length of news: " + returnValue.length);
    return returnValue;
  }
}

function getQuandlCommodityPrice(commodityCode){
  var returnValue =[];
  // source: https://blog.quandl.com/api-for-commodity-data
  // example: https://www.quandl.com/api/v3/datasets/CHRIS/CME_SI1?api_key=zJfAxbFspqTfsfyq6Vzz
  var quandlAPIKey = "zJfAxbFspqTfsfyq6Vzz";
  var quandlCommodityCode =  commodityCode  //"LBMA/GOLD" //hard coded temporarily
  var queryURL = "https://www.quandl.com/api/v3/datasets/" + quandlCommodityCode +"?api_key=" + quandlAPIKey + "&start_date=2017-05-24&end_date=2017-06-28"

  $.ajax({
    url: queryURL,
    method: "GET",
    "async": false,
  })
  .done(function(response){
    var result = response.dataset;
    var adjustedArr = [];

    adjustedArr =  getData(adjustedArr, result.column_names, result.data)
    //console.log(adjustedArr);
    //googleChartGenerator(adjustedArr, result.name);

    //console.log(result);
    returnValue = result;
  }).fail(function(response){
    console.log("Error retrieving data from quandl");
  })
  return returnValue;
}
function getSpecificCommodityFromCommoPrices(commodityCode){
  var returnValue;

  //NOTE: PALUM = ALUMINUM
  var settings = {
    "async": false,
    "crossDomain": true,
    "url": "https://api.commoprices.com/v1/imf/"+ commodityCode,
    "method": "GET",
    "headers": {
      "authorization": "Bearer " + commoPriceAPIKey ,
      "accept": "application/json"
    }
  }

  $.ajax(settings).done(function (response) {
    var result = response.data;
    //var adjustedArr = [];
    //adjustedArr =  getData(adjustedArr, result.column_names, result.data);
    //console.log(adjustedArr)
    console.log("CommoPrices: get specific commodity");
    console.log(response.data.info);

    returnValue = response.data;

  }).fail(function(response){
    console.log(response);
  });
  return returnValue;
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
function getCommodityPriceFromCommoPrices(commodityCode){
  var returnValue;
  //notes: imf/PCOFFROB for example for commodityCode
  var settings = {
    "async": false,
    "crossDomain": true,
    "url": "https://api.commoprices.com/v1/imf/"+ commodityCode + "/data?",
    "method": "GET",
    "headers": {
      "authorization": "Bearer " + commoPriceAPIKey ,
      "accept": "application/json"
    }
  }

  $.ajax(settings).done(function (response) {
    //console.log("CommoPrice: get commodity price");
    //console.log(response.data);

    
    adjustedArr =  getData(adjustedArr, response.data.request.column_names, response.data.request.dataseries);
    //getGraphStartEndDateFromCommoPrices(response.data, graphStartDate, graphEndDate);

    returnValue = response.data;
    //console.log(returnValue);
    //googleChartGenerator(adjustedArr, response.data.info.name);
  }).fail(function(response){
    console.log(response);
  });
  return returnValue

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
      $(".divCarousel").hide();
      $(".divGraph").show();
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

function getJSONCommodity(){

$.getJSON( "https://shikwan.github.io/Project1/assets/javascript/quandlResource.json", function( response ) {
 
  console.log(response);
  for (var i =0 ; i< response.length; i++){
    var objCommodity = {
      name: response[i].name,
      code: response[i].code
    }
    commodity.push(objCommodity);
  }
});
}



dbCommodity.once("value", function(snapshot){
  console.log(snapshot.val());
})
});
