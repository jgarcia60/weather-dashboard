

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
    

    $("#searchBtn").on("click", function() {
        city = $("#city").val();
        var cityObject = JSON.parse(localStorage.getItem(city));
        console.log(cityObject);
        var lat = cityObject.coord.lat;
        var lon = cityObject.coord.lon;
        queryURL = "https://api.openweathermap.org/data/2.5/weather?" + "q=" + city + "&appid=" + APIKey + "&units=imperial";
        UVqueryURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
        // console.log(queryURL);
        getCityData(APIKey, queryURL, city);
        getUVIndex(APIKey, UVqueryURL, lat, lon);
    })

    function getCityData(APIKey, queryURL, city) {
        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {
            // cityObject = response;
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
        $("#windSpeed").text("Wind Speed: " + response.wind.speed);
        $("#humidity").text("Humidity: " + response.main.humidity);
        $("#temperature").text(" Temperature: " + response.main.temp);
        $("#cityAndDate").text(response.name + " (" + dateDisplay + ")");
        });
    }
    function getUVIndex(APIKey, UVqueryURL, lat, lon) {
        $.ajax({
            url: UVqueryURL,
            method: "GET"
            }).then(function(response) {
                var UVIndex = response.value;
                $("#UVIndex").text("UV Index: " + UVIndex);
            });
    }
});