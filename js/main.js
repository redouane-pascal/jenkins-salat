function init() {
    //showLoadingPage(true);

    let isParamShown = false;
    var closeBtn = document.getElementById("closeBtn");
    closeBtn.addEventListener("click", function() {
        if (isParamShown) {
            $("#divParam").removeClass("showParam");
            $("#divParam").addClass("hideParam");
            $("#divParam").css("left", "766px");
            $("#showCities").attr("src", "/img/svg_md-locate.svg");
        } else {
            $("#divParam").removeClass("hideParam");
            $("#divParam").addClass("showParam");
            $("#divParam").css("left", "500px");
            $("#showCities").attr("src", "/img/svg_md-close.svg");
        }
        isParamShown = !isParamShown;
    });

    var select = document.getElementById("choosedCity");
    // Get all cities
    if ($("#choosedCity option")[0] == undefined) {
        let cities = localStorage.getItem("cities");
        if (cities != null) {
            let citiesJSON = JSON.parse(cities);
            citiesJSON.forEach(city => {
                $("#choosedCity").append(
                    $("<option></option>")
                    .val(city.id)
                    .html(city.name_ar)
                );
            });
        } else {
            fetch("cities.json")
                .then(response => response.json())
                .then(data => {
                    let dataToStore = JSON.stringify(data);
                    localStorage.setItem("cities", dataToStore);
                    data.forEach(city => {
                        $("#choosedCity").append(
                            $("<option></option>")
                            .val(city.id)
                            .html(city.name_ar)
                        );
                    });
                });
        }
    }

    // Add change eventlistener
    select.addEventListener("change", function() {
        //showLoadingPage(true);
        localStorage.setItem("cityId", select.value);
        localStorage.removeItem("cityName");
        localStorage.removeItem("dayNotif");
        showNotify();
    });
    // choose the appropriate city
    if (localStorage.getItem("cityId") != null) {
        $("#choosedCity").val(localStorage.getItem("cityId"));
    } else {
        $("#choosedCity").val(80);
    }

    showBars();
    showTodayBar();
    setInterval(function() {
        showTodayBar();
    }, 10000);

    //showLoadingPage(false);
}

document.addEventListener("DOMContentLoaded", init);