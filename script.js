
$(document).ready(function() {
    updateHistory();
    var date =  moment().format("YYYY-MM-DD");
    // console.log(date);
    var dateArray = date.split("-");
    var dateDisplay = dateArray[1] + "/" + dateArray[2] + "/" + dateArray[0];
    // console.log(dateDisplay);
    var city;
    var APIKey = "8e987cef7a062582df215bf98149b960";
    var queryURL;
    var UVqueryURL;
    var lat;
    var lon;
    if (JSON.parse(localStorage.getItem("cityArray")) == null) {
        var cityArray = [];
    } else {
        var cityArray = JSON.parse(localStorage.getItem("cityArray"));
        // setupDashboard(cityArray);
        city = cityArray[cityArray.length - 1];
        queryURL = "https://api.openweathermap.org/data/2.5/weather?" + "q=" + city + "&appid=" + APIKey + "&units=imperial";
        getCityData(APIKey, queryURL);
    }
    
    
    
    $("#searchBtn").on("click", function() { //clicking this erases current list
        // $(".search").on("click", function() {
            // console.log($(this).val());
            city = $(("#city")).val();
            queryURL = "https://api.openweathermap.org/data/2.5/weather?" + "q=" + city + "&appid=" + APIKey + "&units=imperial";
            
            getCityData(APIKey, queryURL, city);
            // localStorage.setItem(city, JSON.stringify(cityObject));
            if (cityArray.indexOf(city) != -1) {
                cityArray = deleteElement(cityArray.indexOf(city), cityArray);
            }
            cityArray.push(city);
            localStorage.setItem("cityArray", JSON.stringify(cityArray));
            console.log(cityArray);
    
            updateHistory();
        });

    $(document).on("click", ".history", function() {
        console.log($(this).attr("data-name"));
            city = $(this).attr("data-name");
            console.log(city);
            queryURL = "https://api.openweathermap.org/data/2.5/weather?" + "q=" + city + "&appid=" + APIKey + "&units=imperial";
            
            getCityData(APIKey, queryURL, city);
            // localStorage.setItem(city, JSON.stringify(cityObject));
            if (cityArray.indexOf(city) != -1) {
                cityArray = deleteElement(cityArray.indexOf(city), cityArray);
            }
            cityArray.push(city);
            localStorage.setItem("cityArray", JSON.stringify(cityArray));
            console.log(cityArray);
    
            updateHistory();
    });
    // $("#searchHistory").on("click", function() {
        // $(".search").on("click", function() {


    function getCityData(APIKey, queryURL) {
        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {
            var cityObject = response;
            console.log(cityObject);
            // setupDashboard(cityObject);
            var windSpeed = cityObject.wind.speed;
            var humidity = cityObject.main.humidity;
            var temp = cityObject.main.temp;
            var location = cityObject.name;
            $("#windSpeed").text("Wind Speed: " + windSpeed + " MPH");
            $("#humidity").text("Humidity: " + humidity + " %");
            $("#temperature").text(" Temperature: " + temp + " ^F");
            $("#cityAndDate").text(location + " (" + dateDisplay + ")");
            UVqueryURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&appid=" + APIKey;
            getUVIndex(APIKey, UVqueryURL);
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
});