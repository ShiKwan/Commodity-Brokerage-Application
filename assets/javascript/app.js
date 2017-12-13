function closeForm() {
    $("#messageSent").show("slow");
    setTimeout('$("#messageSent").hide();$("#contactForm").slideUp("slow")', 2000);
}

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
  var dbCommodity = database.ref("/commodity");
  var jsonCommodity = JSON.stringify(commodity);
  var adjustedArr = [];
  var API_Identifier = "";
  var relatedSearch = [];
  var priceDiff = "";
  var commoditySelected = {
    name : "",
    code : "",
    database : ""
  };
  var loginUser;
  var dbUserSearch;
  var dbGlobalSearch = database.ref("/search");
  var dbUserSearchCommo = database.ref('/users/' + sessionStorage.getItem("username") +'/search');
  var trendingSearch = [];
  var userSearch = [];
  var secondLastDate;
  var firstDate;
  var lastDate;
  if(sessionStorage.getItem("username")){
    loginUser = sessionStorage.getItem("username");
    console.log("Hello " + loginUser +"!");
    $("#divName").show();
    $("#lblName").html("Hello " + loginUser +"!");
    populateUserSearch();

    setTimeout(function(){
      $("#divName").slideUp()}, 2000);
    dbUserSearch = database.ref("/users/"+loginUser+"/search");
    $(".glyphicon-log-out").show();
    $(".glyphicon-log-in").hide();
  }else{
    $("#divName").hide();
    $(".glyphicon-log-in").hide();
    $(".glyphicon-log-out").show();
  }
  $('.carousel').carousel({
    interval: 5000
  });
  $(".search-container").hide();
  $(".commodity-search-container").hide();
  // slide form field
  $(".btn2").click(function() {
      if ($("#contactForm").is(":hidden")) {
          $("#contactForm").slideDown("slow");
      } else {
          $("#contactForm").slideUp("slow");
      }
  });
  // closing form slider  https://designshack.net/articles/javascript/creating-a-slide-in-jquery-contact-form/
  $("#slideDownSearch").on("click", function(){
    $(".search-container").slideToggle();
    $("#divAccount").slideUp();
    $(".trending-container").slideUp();
    $(".commodity-search-container").slideUp();
    $(".user-search-panel").slideUp()
    $("#logout").slideUp();
  });

  $("#slideDownCommoditySearch").on("click", function(){
    $(".commodity-search-container").slideToggle();
    $(".search-container").slideUp();
    $("#divAccount").slideUp();
    $(".trending-container").slideUp();
    $("#logout").slideUp();
  });

  $("#slideDownUser").on("click", function(){
    $("#divAccount").slideToggle();
    $(".commodity-search-container").slideUp();
    $(".search-container").slideUp();
    $(".trending-container").slideUp();
    $("#logout").slideUp();
  });
  $("#slideDownTrending").on("click",function(){
    $(".trending-container").slideToggle();
    $("#divAccount").slideUp();
    $(".commodity-search-container").slideUp();
    $(".search-container").slideUp();
    $("#logout").slideUp();
  })
  $("#hypLogout").click(function(){
    $("#logout").slideDown();
    $(".trending-container").slideUp();
    $("#divAccount").slideUp();
    $(".commodity-search-container").slideUp();
    $(".search-container").slideUp();
})

  var commoPriceAPIKey = "Lifi3bz7tjhN4lcErh3TW3oUnzY06tvGPdX1t3IPFefTJdlU1EFAQkKuD6tT";
  var commodity = [];

  initialization();
  populateAutocompleteCommodity();
function populateTable(data, className ){
  $("."+className).empty();

  var trHead = $("<tr>");
  var tdRankHead = $("<th>Rank</th>");
  var tdNameHead = $("<th>Commodity name</th>");
  trHead.append(tdRankHead).append(tdNameHead);
  $("."+className).append(trHead);
  $("."+className).append();
  var rank = 1;
  for(var i =data.length-1; i>=0 ; i--){
     var tr = $("<tr>");
    
    var rankcol = $("<td>");
    var namecol = $("<td>");
    rankcol.html(rank);
    namecol.html(data[i]);
    tr.append(rankcol).append(namecol);
    $("."+className).append(tr);
    rank++;
  }
}
function populateTrending(){
  trendingSearch = [];
  dbGlobalSearch.orderByValue().limitToLast(5).on("child_added", function(snapshot){
    trendingSearch.push(snapshot.key + ": " + snapshot.val());
  });
  setTimeout(function(){
    populateTable(trendingSearch, "trending-tbody");
  },2000)
}


function populateUserSearch(){
  if(sessionStorage.getItem("username")){
    $(".user-search-panel").show();
    userSearch = [];
    dbUserSearchCommo.orderByValue().limitToLast(5).on("child_added", function(snapshot){
      userSearch.push(snapshot.key + ": " + snapshot.val());
    });
    setTimeout(function(){
      populateTable(userSearch, "user-search-tbody");
    },2000)
  }else{
    $(".user-search-panel").hide();
  }
}

var pullUserSearch = setInterval(function(){
  console.log("here");
  populateUserSearch();
},3000);

var pullTrendingSearch = setInterval(function(){
  console.log("get trendy");
  populateTrending();
},3000);


function dbSaveSearch(search){  
  var dbGlobalSearch = database.ref("/search/" + search);
  if(sessionStorage.getItem("username")){
    var dbUserSearchCommo = database.ref('/users/' + sessionStorage.getItem("username") +'/search/' + search);
    dbUserSearchCommo.transaction(function(up){
      return up+1;
    })
  }
  dbGlobalSearch.transaction(function(up){
    return up+1;
  })
}
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
}


function quandlResources(){
  //Use this to get the code to query Quandl API
  $.ajax({
    url: "https://shikwan.github.io/Project1/assets/javascript/quandlResource.json",
    method: "GET"
  }).done(function (response){
  })
}
  
var graphStartDate, graphEndDate, graphSecondEndDate; 
var graphStartPrice, graphEndPrice, graphSecondEndPrice;
function initialization(){
  $(".divCarousel").show();
  $(".divGraph").hide();
  $(".divCommodityInfo").hide();
  $(".divCommodityNews").hide();
  $(".news-head-container").hide();
  $("#msg-center").hide();
  $(".date-container").hide();
  $(".divRelated").hide();
  $("#divAccount").hide();
  $(".logout-container").hide();
  $(".trending-container").hide();
  $("#logout").hide();
  $("")
  if(sessionStorage.getItem("username")){
    loginUser = sessionStorage.getItem("username");
    dbUserSearch = database.ref("/users/"+loginUser+"/search");
    $(".glyphicon-log-out").show();
    $(".glyphicon-log-in").hide();
  }else{
    $(".glyphicon-log-in").show();
    $(".glyphicon-log-out").hide();
  }
}
getCommodity();
function swapDate(){
    firstDate = moment(graphStartDate, "YYYY-MM-DD");
    lastDate = moment(graphEndDate, "YYYY-MM-DD");
    secondLastDate = moment(graphSecondEndDate, "YYYY-MM-DD");
    if(firstDate.diff(lastDate) > 0){
      var temp = firstDate;
      firstDate = lastDate;
      lastDate = temp;
    }
    $("#dpStartDate").val(firstDate.format("YYYY-MM-DD"));
    $("#dpEndDate").val(lastDate.format("YYYY-MM-DD"));
    $("#dpStartDate").attr("min", firstDate.format("YYYY-MM-DD"));
    $("#dpEndDate").attr("max", lastDate.format("YYYY-MM-DD"));

}
function getGraphStartEndDateFromCommoPrices(data){
  var lengthOfData = data.request.dataseries.length;
  graphStartDate = data.request.dataseries[0][0];
  graphStartPrice = data.request.dataseries[0][1];
  graphEndDate = data.request.dataseries[lengthOfData-1][0];
  graphEndPrice = data.request.dataseries[0][1];
  if(data.request.dataseries[lengthOfData-2][0]){
     graphSecondEndDate = data.request.dataseries[lengthOfData-2][0];   
     graphSecondEndPrice = data.request.dataseries[lengthOfData-2][1];   
  }
}

function getGraphStartEndDateFromQuandl(qry){
  var lengthOfData = qry.data.length;
  graphStartDate = qry.data[0][0];
  graphStartPrice = qry.data[0][1];
  graphEndDate = qry.data[lengthOfData-1][0];
  graphEndPrice = qry.data[lengthOfData-1][1];
  if(qry.data[lengthOfData-2][0]){
    graphSecondEndDate = qry.data[lengthOfData-2][0];
    graphSecondEndPrice = qry.data[lengthOfData-2][1];
  }
}

function populateCommodityInfoFromCommoPrices(data){
  if(data){
    $(".commodityInfoHeader").empty();
    $(".commodity-info-container").empty();
    API_Identifier ="CommoPrices";

    $(".divCommodityInfo").show();
    var divContainer = $("<div>");
    var codeDiv = $("<div>");
    var databaseDiv = $("<div>");
    var frequencyDiv = $("<h6>");
    var nameDiv = $("<h1>");
    var oldest_data_availableDiv = $("<h6>");
    var price_unitDiv = $("<h6>");
    var todayStatusDiv = $("<h2>");
    var todayStatus = graphEndPrice - graphSecondEndPrice;
    if(todayStatus >=0){
      todayStatusDiv.addClass("glyphicon").addClass("glyphicon-triangle-top").removeClass("glyphicon-triangle-bottom");
      todayStatusDiv.attr("aria-hidden", "true")
    }else{
      todayStatusDiv.addClass("glyphicon").addClass("glyphicon-triangle-bottom").removeClass("glyphicon-triangle-top");
      todayStatusDiv.attr("aria-hidden", "true")
    }
    todayStatusDiv.html(todayStatus.toFixed(2));
    codeDiv.text("Code: " + data.info.code);
    databaseDiv.text("Database: " + data.info.database);
    frequencyDiv.html("Frequency: " + data.info.frequency);
    nameDiv.html(data.info.name);
    oldest_data_availableDiv.html("Oldest available date: " + data.info.oldest_available_date);
    price_unitDiv.html("price unit: " + data.info.original_price_unit.name);
    $(".commodityInfoHeader").append(nameDiv);
    divContainer.append(todayStatusDiv).append(databaseDiv).append(frequencyDiv).append(oldest_data_availableDiv);
    $(".commodity-info-container").append(divContainer);

  }
}

function populateCommodityInfoFromQuandl(data){
  if(data){
    $(".commodityInfoHeader").empty();
    $(".commodity-info-container").empty();
    API_Identifier="Quandl";
    $(".divCommodityInfo").show();
    var divContainer = $("<div>");
    var codeDiv = $("<div>");
    var databaseDiv = $("<h3>");
    var frequencyDiv = $("<h6>");
    var nameDiv = $("<h1>");
    var descriptionDiv = $("<div class='quandlDescription'>");
    var datasetDiv = $("<div>");
    var databaseDiv = $("<div>");
    var oldest_data_availableDiv = $("<h6>");
    var newest_data_availableDiv = $("<h6>");
    var latestRefreshDiv = $("<h6>");
    var todayStatusDiv = $("<div>");
    var todayStatus = graphEndPrice - graphSecondEndPrice;
    if(todayStatus >=0){
      todayStatusDiv.addClass("glyphicon").addClass("glyphicon-triangle-top").removeClass("glyphicon-triangle-bottom");
      todayStatusDiv.attr("aria-hidden", "true")
    }else{
      todayStatusDiv.addClass("glyphicon").addClass("glyphicon-triangle-bottom").removeClass("glyphicon-triangle-top");
      todayStatusDiv.attr("aria-hidden", "true")
    }
    todayStatusDiv.html(todayStatus.toFixed(2));
    codeDiv.text("Code: " + data.dataset_code);
    databaseDiv.html("Database: " + data.database_code +"/"+data.dataset_code);
    frequencyDiv.html("Frequency: " + data.frequency);
    nameDiv.html(data.name);
    oldest_data_availableDiv.html("Oldest available date: " + data.oldest_available_date);
    newest_data_availableDiv.html("Newest available date: " + data.newest_available_date);
    datasetDiv.html("dataset code: " + data.dataset_code);
    databaseDiv.html("database code: " + data.database_code);
    latestRefreshDiv.html("refreshed_at: " + data.refreshed_at);
    $(".commodityInfoHeader").append(nameDiv);
    descriptionDiv.html("Description: " + data.description);
    divContainer.append(databaseDiv).append(descriptionDiv).append(todayStatusDiv).append(frequencyDiv).append(oldest_data_availableDiv).append(newest_data_availableDiv).append(databaseDiv).append(datasetDiv).append(latestRefreshDiv);
    $(".commodity-info-container").append(divContainer);
  }
}
function populateNews(data){
  if(data){
    console.log(data);
    $(".news-head-container").show();
    $(".divCommodityNews").show();
    for(var i = 0; i < data.length; i++){
      var divPanel = $("<div class='panel'>");
      var divHead = $("<div class='panel-heading'>");
      var divBody = $("<div class='panel-body'>");
      var divRow = $("<div class='row'>");
      var divLeft = $("<div class='col-md-4 col-xs-4'>");
      var divRight = $("<div class='col-md-8 col-xs-8'>");
      var bylineDiv = $("<h3 class='text-right'>");
      var headlineDiv = $("<h3>");
      var multimediaImg = $("<img>");
      var snippetDiv = $("<h3 class='popcomStory'>");
      var web_urlDiv = $("<h6>");
      var sourceDiv = $("<h3 class='float-right'>");
      var pubDateDiv = $("<h6 class='align-right'>");

      
      headlineDiv.html(data[i].headline.main);
      var web_url = "<a href='" + data[i].web_url + "' target='_blank' > ..read more</a>";
      snippetDiv.html(data[i].snippet + " " + web_url);
      
      if(data[i].source){
        sourceDiv.text("Source: " + data[i].source);  
      }
      if(data[i].byline.organization){
        bylineDiv.html("Source: " + data[i].byline.organization);  
      }
      if(data[i].multimedia.length > 0){
        multimediaImg.attr("src", "https://www.nytimes.com/" + data[i].multimedia[0].url);  
        var hyp = $("<a class='thumbnail'>");
        hyp.attr("href", web_url);
        hyp.append(multimediaImg);
        divLeft.append(hyp);
      }else{
        divLeft.removeClass("col-md-4").removeClass("col-xs-4");
        divRight.removeClass("col-md-8").removeClass("col-xs-8").addClass("col-md-12").addClass("col-xs-12");
      }
      pubDateDiv.html("Date published : " + moment(data[i].pub_date).format("YYYY-MM-DD"));
      divHead.append(headlineDiv);
      divRight.append(pubDateDiv).append(snippetDiv).append(sourceDiv);
      divBody.append(divRow).append(divLeft).append(divRight);
      divPanel.append(divHead).append(divBody);
      $(".divCommodityNews").append(divPanel);
      //$(".commodity-news-container").prepend(divContainer);
    }
  }
}
function performGraphDateSearch(){
  var searchCommodity = $("#txtCommoditySearch").val();
  var searchStartDate = $("#dpStartDate").val();
  var searchEndDate = $("#dpEndDate").val();
  for(var i =0; i< commodity.length; i++){
    if(commodity[i].name == searchCommodity){
      if(commodity[i].database){
          commoData = getCommodityPriceFromCommoPrices(commodity[i].code, searchStartDate, searchEndDate );
          getGraphStartEndDateFromCommoPrices(commoData);
          $(".date-container").show();
          var firstDate = moment(graphStartDate, "YYYY-MM-DD");
          var lastDate = moment(graphEndDate, "YYYY-MM-DD");
          if(firstDate.diff(lastDate) > 0){
            var temp = firstDate;
            firstDate = lastDate;
            lastDate = temp;
          }
          $("#dpStartDate").val(firstDate.format("YYYY-MM-DD"));
          $("#dpEndDate").val(lastDate.format("YYYY-MM-DD"));
          $("#dpStartDate").attr("min", firstDate.format("YYYY-MM-DD"));
          $("#dpEndDate").attr("max", lastDate.format("YYYY-MM-DD"));
          
          return false;
          //look into commoprice
        }else{
          commoData = getQuandlCommodityPrice(commodity[i].code, searchStartDate, searchEndDate);
          getGraphStartEndDateFromQuandl(commoData);
          $(".date-container").show();
          var firstDate = moment(graphStartDate, "YYYY-MM-DD");
          var lastDate = moment(graphEndDate, "YYYY-MM-DD");
          if(firstDate.diff(lastDate) > 0){
            var temp = firstDate;
            firstDate = lastDate;
            lastDate = temp;
          }
          $("#dpStartDate").val(firstDate.format("YYYY-MM-DD"));
          $("#dpEndDate").val(lastDate.format("YYYY-MM-DD"));
          $("#dpStartDate").attr("min", firstDate.format("YYYY-MM-DD"));
          $("#dpEndDate").attr("max", lastDate.format("YYYY-MM-DD"));
          //look into quandl
          return false;
        }
      }
    }
}




$("#divLogoutYes").on("click", function(){
  sessionStorage.clear();
  clearInterval(pullUserSearch);
  initialization();
  $("#msg-center").html("You have logged out!");
  $("#msg-center").addClass("alert-success");
  $("#msg-center").show();
  $(".glyphicon-log-in").show();
  $(".glyphicon-log-out").hide();
  $(".logout-container").hide();
  $("#divName").hide();
  $("#lblName").empty();
  $("#logout").slideUp();
  var interval = setInterval(function(){
    $("#msg-center").slideUp();
    $("#msg-center").removeClass("alert-success").removeClass("alert-danger");
    $("msg-center").empty();
  },4000)
})

$("#divLogoutNo").on("click", function(){
  $("#logout").slideUp();
})


$("#cmdQuickSearch").on("click", function(){
  populateNews(getNews($("#txtQuickSearch").val()));
  $(".search-container").slideUp();
})


$(".easy-autocomplete-container").click(function(){
    performGraphDateSearch();
});

$(document).on("click", "#cmdGraphSubmit", function(){
    event.preventDefault();
    var searchStartDate = $("#dpGraphStartDate").val();
    var searchEndDate = $("#dpGraphEndDate").val();
    var searchCommodity = $("#txtCommoditySearch").val();
    if(API_Identifier = "Quandl"){
      $("#divGraph").empty();
      commoData = getQuandlCommodityPrice(commoditySelected.code, searchStartDate, searchEndDate);
      getGraphStartEndDateFromQuandl(commoData);
      googleChartGenerator(adjustedArr, commoData.name);
    }else if(API_Identifier= "CommoPrices") {
      $("#divGraph").empty();
      commoData = getCommodityPriceFromCommoPrices(commoditySelected.code, searchStartDate, searchEndDate );
      getGraphStartEndDateFromCommoPrices(commoData);
      googleChartGenerator(adjustedArr, commoData.info.name);
    }
})
function resetSearchDOM(){
  $("#txtCommoditySearch").removeClass("alert-danger");
  $("#msg-center").empty();
  $("#msg-center").removeClass("alert-success").removeClass("alert-danger");
  $("#divRelated").hide();
}



$("#submit").on("click", function(){
  
  event.preventDefault();
  var searchCommodity = $("#txtCommoditySearch").val();
  var foundCommodity = false;
  var searchStartDate = $("#dpStartDate").val();
  var searchEndDate = $("#dpEndDate").val();

  resetSearchDOM(); 

  if(searchCommodity == ""){
    $("#msg-center").show();
    $("#msg-center").addClass("alert-danger").removeClass("alert-success");
    $("#msg-center").html("please enter a commodity");
    $("#txtCommoditySearch").addClass("alert-danger");
  }else{
    $(".commodity-search-container").slideUp();  
    for(var i = 0; i< commodity.length; i++){
      if(commodity[i].name == searchCommodity){  
        var toreplace = commodity[i].name.replace(/\.|\#|\$|\[|\]/g, "");
        dbSaveSearch(toreplace);
        $("#divCommodityInfo").show();
        foundCommodity = true;    
        commoditySelected.name = commodity[i].name;
        commoditySelected.code = commodity[i].code;
        if(commodity[i].database){
          commoditySelected.database = commodity[i].database;
          $(".commodity-search-field-container").hide();
          commoData = getCommodityPriceFromCommoPrices(commodity[i].code, searchStartDate, searchEndDate );
          getGraphStartEndDateFromCommoPrices(commoData);
          swapDate();
          var firstDate = moment(graphStartDate, "YYYY-MM-DD");
          var lastDate = moment(graphEndDate, "YYYY-MM-DD");
          if(firstDate.diff(lastDate) > 0){
            var temp = firstDate;
            firstDate = lastDate;
            lastDate = temp;
          }
          $(".date-container").show();
          $("#dpStartDate").val(firstDate.format("YYYY-MM-DD"));
          $("#dpEndDate").val(lastDate.format("YYYY-MM-DD"));
          $("#dpGraphStartDate").val(firstDate.format("YYYY-MM-DD"));
          $("#dpGraphEndDate").val(lastDate.format("YYYY-MM-DD"));         
          $("#dpStartDate").attr("min", firstDate.format("YYYY-MM-DD"));
          $("#dpEndDate").attr("max", lastDate.format("YYYY-MM-DD"));
          $("#dpGraphStartDate").attr("min", firstDate.format("YYYY-MM-DD"));
          $("#dpGraphEndDate").attr("max", lastDate.format("YYYY-MM-DD"));

         
          googleChartGenerator(adjustedArr, commoData.info.name);
          populateCommodityInfoFromCommoPrices(commoData);
          populateNews(getNews(commoData.info.name));
          return false;
          //look into commoprice
        }else{
          commoData = getQuandlCommodityPrice(commodity[i].code, searchStartDate, searchEndDate);
          getGraphStartEndDateFromQuandl(commoData);
          swapDate();
          var firstDate = moment(graphStartDate, "YYYY-MM-DD");
          var lastDate = moment(graphEndDate, "YYYY-MM-DD");
          if(firstDate.diff(lastDate) > 0){
            var temp = firstDate;
            firstDate = lastDate;
            lastDate = temp;
          }
          $(".date-container").show();
          $("#dpStartDate").val(firstDate.format("YYYY-MM-DD"));
          $("#dpEndDate").val(lastDate.format("YYYY-MM-DD"));
          $("#dpGraphStartDate").val(firstDate.format("YYYY-MM-DD"));
          $("#dpGraphEndDate").val(lastDate.format("YYYY-MM-DD"));  
          $("#dpStartDate").attr("min", firstDate.format("YYYY-MM-DD"));
          $("#dpEndDate").attr("max", lastDate.format("YYYY-MM-DD"));
          $("#dpGraphStartDate").attr("min", firstDate.format("YYYY-MM-DD"));
          $("#dpGraphEndDate").attr("max", lastDate.format("YYYY-MM-DD"));
          googleChartGenerator(adjustedArr, commoData.name);
          populateCommodityInfoFromQuandl(commoData);
          populateNews(getNews(commoData.name));
          return false;
          //look into quandl
        }
      }else{
       
      }
    }
  }
   if(!foundCommodity && $("#txtCommoditySearch").val() !== "") {
      relatedSearch =[];
      $(".related-container").empty();
      for(var i = 0; i< commodity.length; i++){

        if(commodity[i].name.toLowerCase().indexOf(searchCommodity.toLowerCase()) >= 0){
          relatedSearch.push(commodity[i].name);
        }
      }
      if(relatedSearch.length>0){
        $(".commodity-search-container").slideDown();  
        $("#divRelated").show();
        for(var i =0; i< relatedSearch.length; i++){
          var div = $("<div>");
          div.html("<a href='#' data-related='" + relatedSearch[i] + "' class='related-item'> " + relatedSearch[i] + "</a>");
          $(".related-container").append(div);
        }
      }else{
        //couldn't find anything
        $("#msg-center").html("data is not available from our library, please try another commodity");
        $("#msg-center").addClass("alert-danger").removeClass("alert-success");
        $("#msg-center").show();
        $(".divGraph").hide();
        $(".divCommodityInfo").hide();
      }
      populateNews(getNews(searchCommodity.trim()));
    }
});

$(document).on("click", ".related-item", function(){
  resetSearchDOM();
  $("#txtCommoditySearch").empty();
  $("#txtCommoditySearch").val($(this).text());
  performGraphDateSearch();
})

function getNews(qry){
  var nytAPI = "7efd7705bed343d498f6b717ffda6638"
  var returnValue = [];
  var searchKey = qry.replace(/,/g, '|').split('|');  

  
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
    }).fail(function(err) {
      console.log(err);
    });
  //}

  if(returnValue){
    return returnValue;
  }
}

function getQuandlCommodityPrice(commodityCode, startDate, endDate){
  var returnValue =[];
  // source: https://blog.quandl.com/api-for-commodity-data
  // example: https://www.quandl.com/api/v3/datasets/CHRIS/CME_SI1?api_key=zJfAxbFspqTfsfyq6Vzz&start_date=2017-05-24&end_date=2017-06-28
  var quandlAPIKey = "zJfAxbFspqTfsfyq6Vzz";
  var quandlCommodityCode =  commodityCode  //"LBMA/GOLD" //hard coded temporarily
  var queryURL = "https://www.quandl.com/api/v3/datasets/" + quandlCommodityCode +"?api_key=" + quandlAPIKey + "&";
  var commoDate
  if(startDate && endDate){
    commoDate = "start_date="+startDate + "&end_date="+endDate;
  }else if(startDate && !endDate){
    commoDate = "start_date=" +startDate;
  }else if(!startDate && endDate){
    commoDate = "end_date="+endDate;
  }else{
    commoDate = "";
  }
  queryURL += commoDate;

  $.ajax({
    url: queryURL,
    method: "GET",
    "async": false,
  })
  .done(function(response){
    console.log(response);
    var result = response.dataset;
    
    //var adjustedArr = [];

    adjustedArr =  getData(adjustedArr, result.column_names, result.data)
    returnValue = result;
  }).fail(function(response){
    console.log("Error retrieving data from quandl");
    $("#msg-center").html("This is embaressing, please pardon the error, we will be looking into it!");
    $("msg-center").addClass("alert-danger");
    $("msg-center").show();
    //LOG ERROR IN FIREBASE
  })
  if(returnValue){
    return returnValue; 
  }
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
    console.log(response);
    returnValue = response.data;

  }).fail(function(response){
    console.log(response);
    $("#msg-center").html("This is embaressing, please pardon the error, we will be looking into it!");
    $("msg-center").addClass("alert-danger");
    $("msg-center").show();
    //LOG ERROR IN FIREBASE
  });
  if(returnValue){
    return returnValue;  
  }
}

function getData(adjustedArray, columnNamesArray, dataArray){
  var getdata = [];
  adjustedArray =[];
  getdata.push([columnNamesArray]);
  for(var i = 0; i< dataArray.length; i++){
    getdata.push([dataArray[i]]);
  }
  var firstDate = moment(getdata[1][0], "YYYY-MM-DD");
  var lastDate = moment(getdata[getdata.length-1][0], "YYYY-MM-DD");
  //if firstdate is later than last date
  if(firstDate.diff(lastDate) > 0){
    //get the identity of each column first before loading data.
    adjustedArray.push(getdata[0][0])
    for(var i = getdata.length-1; i >1; i--){
      adjustedArray.push(getdata[i][0]);
    }
  }else{
    for(var i = 0; i < getdata.length; i++){
     adjustedArray.push(getdata[i][0]);
    }
  }
  
  return adjustedArray
}
function getCommodityPriceFromCommoPrices(commodityCode, startDate, endDate){
  var returnValue;
  var commoDate
  if(startDate && endDate){
    commoDate = "start_date="+startDate + "&end_date="+endDate;
  }else if(startDate && !endDate){
    commoDate = "start_date=" +startDate;
  }else if(!startDate && endDate){
    commoDate = "end_date="+endDate;
  }else{
    commoDate = "";
  }

  //notes: imf/PCOFFROB for example for commodityCode
  var settings = {
    "async": false,
    "crossDomain": true,
    "url": "https://api.commoprices.com/v1/imf/"+ commodityCode + "/data?" + commoDate,
    "method": "GET",
    "headers": {
      "authorization": "Bearer " + commoPriceAPIKey ,
      "accept": "application/json"
    }
  }

  $.ajax(settings).done(function (response) {

    adjustedArr =  getData(adjustedArr, response.data.request.column_names, response.data.request.dataseries);
    returnValue = response.data;
    //googleChartGenerator(adjustedArr, response.data.info.name);
  }).fail(function(response){
    console.log(response);
    $("#msg-center").html("This is embaressing, please pardon the error, we will be looking into it!");
    $("msg-center").addClass("alert-danger");
    $("msg-center").show();
    //LOG ERROR IN FIREBASE
  });
  if(returnValue){
    return returnValue;
  }

}
function googleChartGenerator(priceData, graphTitle){
   google.charts.load('current', {'packages' :['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart(){
      var data = google.visualization.arrayToDataTable(priceData);

      var options = {
        title: graphTitle, 
        curveType: "function",
        legend: {position: "bottom"},
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
    $("#msg-center").html("This is embaressing, please pardon the error, we will be looking into it!");
    $("msg-center").addClass("alert-danger");
    $("msg-center").show();
    //LOG ERROR IN FIREBASE
  });
}

function getJSONCommodity(){

$.getJSON( "https://shikwan.github.io/Project1/assets/javascript/quandlResource.json", function( response ) {
  for (var i =0 ; i< response.length; i++){
    var objCommodity = {
      name: response[i].name,
      code: response[i].code
    }
    commodity.push(objCommodity);
  }
});
};

dbCommodity.once("value", function(snapshot){
  console.log(snapshot.val());
});

$("#cmdLogin").click(function(){
  resetSearchDOM();
  var validated = true;
  if($("#txtUser").val().trim() == "" || $("txtUserPassword").val() == ""){
    $("#msg-center").append("<li>fields are empty, please enter id/password.</li>");
    validated = false;
  }
  //Look into firebase 
  if(validated){
    var dbUser = database.ref("/users");
    var exist = false;
    var existingUser = {
      username : "",
      password: ""
    }

    dbUser.once('value', function(snapshot){
      var i = 0;
      snapshot.forEach(function(childSnapshot){
        if(childSnapshot.val().username == $("#txtUser").val().trim()){
          if(childSnapshot.val().password == $("#txtUserPassword").val()){
            existingUser.username = childSnapshot.val().username;
            existingUser.password = childSnapshot.val().password;
            exist=true;
          }else{
            $("#msg-center").html("wrong password");
            $("#msg-center").addClass("alert-danger").remove("alert-success");
            $("#msg-center").show();
          }
        }else{
          $("#msg-center").html("no user found");
          $("#msg-center").addClass("alert-danger").remove("alert-success");
          $("msg-center").show();
        }
      });
      if(validated){
          $(".glyphicon-log-out").show();
          $(".glyphicon-log-in").hide();
          dbUserSearch = database.ref("/users/"+existingUser.username+"/search");
          var interval = setInterval(function(){
            $("#msg-center").slideUp();
          },3000)
        sessionStorage.clear();
        sessionStorage.setItem('username', existingUser.username);

        loginUser = sessionStorage.getItem("username");
        console.log("Hello " + loginUser +"!");
        $("#divName").show();
        $("#lblName").html("Hello " + loginUser +"!");
        populateUserSearch();
        setTimeout(function(){
          $("#divName").slideUp()}, 2000);
      }else{
        $("#divName").hide();
        $(".glyphicon-log-in").hide();
        $(".glyphicon-log-out").show();
      }

    });
  }
});

$("#cmdCreateAccount").click(function(){
  resetSearchDOM();
  var validated = true;
  if($("#txtNewUser").val().trim() == "" || $("#txtPassword").val() == "" || $("#txtConfirmPassword").val() == "") {
    $("#msg-center").append("<li>fields are empty, please enter a commodity</li>");
    validated = false;
  }
  if($("#txtPassword").val().length < 8 || $("#txtPassword").val().length >16){
    $("#msg-center").append("<li>password has to be between 8 and 16 characters</li>")
    validated = false;
  }

  if($("#txtPassword").val() !== $("#txtConfirmPassword").val()){
    $("#msg-center").append("<li>please re-type password</li>")
    validated = false;
  }
  if($("#txtNewUser").val() == $("txtPassword").val()){
    $("#msg-center").append("<li>user name and password cannot be identical</li>");
    validated = false;
  }

  if(validated){
    var dbUser = database.ref("/users");
    var exist = false;
    var newUser = {
      username : $("#txtNewUser").val().trim(),
      password : $("#txtPassword").val().trim()
    };

    dbUser.once('value', function(snapshot){
      var i = 0;
      snapshot.forEach(function(childSnapshot){
        if(childSnapshot.val().username == newUser.username){
          exist = true;
        }
        i++;
      });
      if(exist==true){
      }else{
        dbUser = database.ref("/users/"+newUser.username);
          dbUser.set(newUser);
      }
    });
    dbUser = database.ref("/users");
    $("#msg-center").show();
    $("#msg-center").addClass("alert-success").removeClass("alert-danger");
    $("#msg-center").html("Account added successfully!");
  }else{
    $("#msg-center").addClass("alert-danger").removeClass("alert-success");
    $("#msg-center").show();

  }


});
});
