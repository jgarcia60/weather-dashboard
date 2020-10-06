

$(document).ready(function() {
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
    var cityArray = [];
    
    function getCityData(APIKey, queryURL, city) {
        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {
            var cityObject = response;
            console.log(cityObject);
            localStorage.setItem(city, JSON.stringify(response));
            //   var temp = response.main.temp;
            // temp = (temp - 273.15) * 1.80 + 32;
            //   var lon = response.coord.lon;
            //   var lat = response.coord.lat;
            //   var location = response.name;
            //   var windSpeed = response.wind.speed;
            //   var humidity = response.main.humidity;
        
        // var newRow = $("<tr>");
        // newRow.append($("<td>" + location + "</td>"));
        // newRow.append($("<td>" + location + "</td>"));
        $("#windSpeed").text("Wind Speed: " + response.wind.speed + " MPH");
        $("#humidity").text("Humidity: " + response.main.humidity + " %");
        $("#temperature").text(" Temperature: " + response.main.temp + " ^F");
        $("#cityAndDate").text(response.name + " (" + dateDisplay + ")");
        UVqueryURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&appid=" + APIKey;
        getUVIndex(APIKey, UVqueryURL);
        });
    }
    $("#searchBtn").on("click", function() {
        city = $(".city").val();
        queryURL = "https://api.openweathermap.org/data/2.5/weather?" + "q=" + city + "&appid=" + APIKey + "&units=imperial";
        
        getCityData(APIKey, queryURL, city);
        // localStorage.setItem(city, JSON.stringify(cityObject));
        if (cityArray.indexOf(city) != -1) {
            cityArray = deleteElement(cityArray.indexOf(city), cityArray);
        }
        cityArray.push(city);
        console.log(cityArray);

        updateHistory();
    });

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
        for (var i = 0; i < cityArray.length; i++) {
            var newBtn = $("<button>");
            newBtn.addClass("history city");
            newBtn.attr("data-name", cityArray[i]);
            newBtn.text(cityArray[i]);
            // newLi.append(newBtn);
            $("#searchHistory").prepend(newBtn);
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