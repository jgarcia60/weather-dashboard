
$(document).ready(function() {
    updateHistory();
    var date =  moment().format("YYYY-MM-DD");
    // console.log(date);
    var dateArray = date.split("-");
    // console.log(dateArray);
    var dateDisplay = dateArray[1] + "/" + dateArray[2] + "/" + dateArray[0];
    // console.log(dateDisplay);
    var city;
    var APIKey = "8e987cef7a062582df215bf98149b960";
    var APIKeyTwo = "79ae75258fa77e4c095c1b0a2f55a600";
    var queryURL;
    var UVqueryURL;
    var FiveDayQueryURL;
    var lat;
    var lon;
    var weatherArray = ["nope", "http://openweathermap.org/img/wn/01d@2x.png", 
    "http://openweathermap.org/img/wn/02d@2x.png", "http://openweathermap.org/img/wn/03d@2x.png", 
    "http://openweathermap.org/img/wn/04d@2x.png", "l", "l", "l", "l", "http://openweathermap.org/img/wn/09d@2x.png", 
    "http://openweathermap.org/img/wn/10d@2x.png", "http://openweathermap.org/img/wn/11d@2x.png", "l", "http://openweathermap.org/img/wn/13d@2x.png"];
    
    if (JSON.parse(localStorage.getItem("cityArray")) == null) {
        var cityArray = [];
    } else {
        var cityArray = JSON.parse(localStorage.getItem("cityArray"));
        // setupDashboard(cityArray);
        city = cityArray[cityArray.length - 1];
        queryURL = "https://api.openweathermap.org/data/2.5/weather?" + "q=" + city + "&appid=" + APIKey + "&units=imperial";
        // FiveDayQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&exclude=current,minutely,hourly,alerts" + "&appid=" + APIKey;
        getCityData(APIKey, queryURL);
        // getFiveDayForecast(APIKeyTwo, FiveDayQueryURL);
    }
    
    
    
    $("#searchBtn").on("click", function() { //clicking this erases current list
        // $(".search").on("click", function() {
            // console.log($(this).val());
            city = $(("#city")).val();
            if (city == "") {
                alert("Please type in a city");
            } else {
                queryURL = "https://api.openweathermap.org/data/2.5/weather?" + "q=" + city + "&appid=" + APIKey + "&units=imperial";
            
                getCityData(APIKey, queryURL, city);
                // localStorage.setItem(city, JSON.stringify(cityObject));
                if (cityArray.indexOf(city) != -1) {
                    cityArray = deleteElement(cityArray.indexOf(city), cityArray);
                }
                cityArray.push(city);
                localStorage.setItem("cityArray", JSON.stringify(cityArray));
                // console.log(cityArray);
        
                updateHistory();
            }
            
        });

    $(document).on("click", ".history", function() {
        console.log($(this).attr("data-name"));
            city = $(this).attr("data-name");
            // console.log(city);
            queryURL = "https://api.openweathermap.org/data/2.5/weather?" + "q=" + city + "&appid=" + APIKey + "&units=imperial";
            
            getCityData(APIKey, queryURL, city);
            // localStorage.setItem(city, JSON.stringify(cityObject));
            if (cityArray.indexOf(city) != -1) {
                cityArray = deleteElement(cityArray.indexOf(city), cityArray);
            }
            cityArray.push(city);
            localStorage.setItem("cityArray", JSON.stringify(cityArray));
            // console.log(cityArray);
    
            updateHistory();
    });
    // $("#searchHistory").on("click", function() {
        // $(".search").on("click", function() {


    function getCityData(APIKey, queryURL) {
        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {
            // console.log(response.clouds.all);
            var cityObject = response;
            // console.log(cityObject);
            // setupDashboard(cityObject);
            var windSpeed = cityObject.wind.speed;
            var humidity = cityObject.main.humidity;
            var temp = cityObject.main.temp;
            var location = cityObject.name;
            $("#windSpeed").text("Wind Speed: " + windSpeed + " MPH");
            $("#humidity").text("Humidity: " + humidity + " %");
            $("#temperature").text(" Temperature: " + temp + " " + "°F");
            $("#cityAndDate").text(location + " (" + dateDisplay + ")");
            UVqueryURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&appid=" + APIKey;
            getUVIndex(APIKey, UVqueryURL);
            FiveDayQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&exclude=current,minutely,hourly,alerts" + "&appid=" + APIKey + "&units=imperial";
            getFiveDayForecast(APIKey, FiveDayQueryURL);
        });
    }

    function deleteElement(index, array) {
        var tempArray = [];
        for (var i = 0; i < array.length; i++) {
            if (index == i) {
                continue;
            } else {
                tempArray.push(array[i]);
            }
        }
        return tempArray;
    }
    function updateHistory() {
        $("#searchHistory").empty();
        console.log(JSON.parse(localStorage.getItem("cityArray")));
        if (JSON.parse(localStorage.getItem("cityArray")) !== null) {
            cityArray = JSON.parse(localStorage.getItem("cityArray"));
            for (var i = 0; i < cityArray.length; i++) {
                var newBtn = $("<button>");
                newBtn.addClass("history");
                newBtn.attr("data-name", cityArray[i]);
                newBtn.text(cityArray[i]);
                // newLi.append(newBtn);
                $("#searchHistory").prepend(newBtn);
            }
        } 
    }
    
    function getUVIndex(APIKey, UVqueryURL) {
        $.ajax({
            url: UVqueryURL,
            method: "GET"
            }).then(function(response) {
                // console.log(response);
                var UVIndex = response.value;
                if (UVIndex > 6) {
                    $("#UVNumber").addClass("hiUV");
                } else if (UVIndex > 3) {
                    $("#UVNumber").addClass("hiUV");
                } else {
                    $("#UVNumber").addClass("lowUV");
                }
                $("#UVIndex").text("UV Index:"); //not printing the UVindex. need to keep the number element separate for color coding
                $("#UVNumber").text(UVIndex);
            });
    }

    function getFiveDayForecast(APIKey, FiveDayQueryURL) {
        $.ajax({
            url: FiveDayQueryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            var todayIcon = response.daily[0].weather[0].icon;
            todayIcon = parseInt(todayIcon.slice(0,2));
            
            // var todayImg = $("<img>");
            var todayImg = $("#todayImg");
            todayImg.attr("src", weatherArray[todayIcon]);
            todayImg.attr("id", "todayImg");
            todayImg.attr("height", "50px");
            todayImg.attr("width", "50px");
            todayImg.attr("float", "left");
            // $("#todayImg").append(todayImg);
            // $("#WeatherEls").empty();
            
            for (var i = 1; i < 6; i++) {
                $("#" + i).empty();
                // $(".FiveDayForecast").empty();
                var day = parseInt(dateArray[2]) + i;
                var id = i;
                //add new row for day
                $("#" + i).append($("<div>").addClass("row"))
                var newDayRow = $("<div>");
                newDayRow.addClass("row");
                newDayRow.append($("<div>").addClass("col-md-12").attr("id", "date").text(dateArray[1] + "/" + day + "/" + dateArray[0]));
                $("#" + i).append(newDayRow);

                //add weather image row
                var newImgRow = $("<div>").addClass("row");
                var icon = response.daily[i].weather[0].icon;
                
                icon = icon.slice(0, 2);
                // console.log(icon);
                icon = parseInt(icon);
                newImgRow.append($("<div>").addClass("col-md-12"));
                var imgTag = $("<img>");
                imgTag.attr("src", weatherArray[icon]);
                imgTag.attr("max-height", "30px");
                imgTag.attr("max-width", "30px");
                newImgRow.append(imgTag);
                $("#" + i).append(newImgRow);

                //add temp row
                var newTempRow = $("<div>").addClass("row");
                newTempRow.append($("<div>").addClass("col-md-12").text("Temp: " + response.daily[i].temp.max + " °F"));
                $("#" + i).append(newTempRow);

                //add humidity row
                var newHumidityRow = $("<div>").addClass("row");
                newHumidityRow.append($("<div>").addClass("col-md-12").text("Humidity: " + response.daily[i].humidity + "%"));
                $("#" + i).append(newHumidityRow);
                //add 4 rows, day, image, temp, and humidity
            }
                
        });
    }
    
});