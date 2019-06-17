let minHour, maxHour, nbMinutesToDisplay;

function createNotification(prayerTime, salat, titre, isRappel) {
  //alert("isRappel:"+isRappel);
  // to check if the notification will be created
  var count = 0;
  if (prayerTime) {
    var now = new Date();
    var hour = prayerTime.split(":")[0];
    var minute = prayerTime.split(":")[1];
    var millisTillSalat =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hour,
        minute,
        0,
        0
      ) - now;
    if (millisTillSalat > 0) {
      var img = "img/azan.png";
      var title = "الصلاة الصلاة";
      var text = "إن الصلاة كانت على المومنين كتابا موقوتا";

      // Rappel après 10 minutes
      if (isRappel == 1) {
        millisTillSalat = millisTillSalat + 600000;
        var rappelTime = addTenMinute(prayerTime);
        localStorage.setItem(
          "rappel_comment_bg_" + salat,
          "Rappel CreateNotification started (rappelTime=" + rappelTime + ")"
        );
        img = "img/iqama.png";
      } else {
        localStorage.setItem(
          "comment_bg_" + salat,
          "CreateNotification started (prayerTime=" + prayerTime + ")"
        );
      }

      setTimeout(function() {
        var notification = new Notification(titre, { body: text, icon: img });
      }, millisTillSalat);
    }
  }
}

/**
 * Calculer le nombre de minutes entre l'heure de la prière [prayerTime] et minHour du matin
 * @param prayerTime
 * @returns {number}
 */
function getMinuteByPrayerTime(prayerTime) {
  if (prayerTime && prayerTime != null) {
    var minPrayerTime =
      parseInt(prayerTime.split(":")[0]) * 60 +
      parseInt(prayerTime.split(":")[1]);
    minPrayerTime = minPrayerTime - 60 * minHour; // 60 * 3
    return minPrayerTime;
  }
}

/**
 * Calculer le pourcentage des minutes par rapport à 9 (21:00 - 06:00 = 15h => 15 * 60min = 900min => 900 / 100 = 9)
 * @param minPrayerTime
 * @returns {string}
 */
function getPercentByMinPrayerTime(minPrayerTime) {
  var percentPrayerTime = (100 * minPrayerTime) / nbMinutesToDisplay;
  percentPrayerTime = percentPrayerTime.toFixed(2);
  return percentPrayerTime;
}

function getCurrentDate() {
  return moment().format("DD/MM/YYYY");
}

function getCurrentHour() {
  return moment().format("HH:mm");
}

function getCurrentMonth() {
  return moment().format("M");
}

function getCurrentDay() {
  return moment().format("D");
}

function addTenMinute(t) {
  return moment(t, "HH:mm")
    .add(10, "m")
    .format("HH:mm");
}

function diffHours(h1, h2) {
  return moment(h1, "HH:mm").diff(moment(h2, "HH:mm"), "minutes");
}

function minutesToHourFormat(minutes) {
  return moment()
    .startOf("day")
    .add(minutes, "minutes")
    .format("HH:mm");
}

function showNotify() {
  showLoadingPage(true);

  let cityId = 80;
  let sobh, dohr, asr, maghreb, isha;

  if (localStorage.getItem("cityId") != null) {
    cityId = localStorage.getItem("cityId");
  }

  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }
  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    if (typeof Storage !== "undefined") {
      var dayNotif = localStorage.getItem("dayNotif");
      var currentDate = getCurrentDate();
      var currentDay = getCurrentDay();
      if (currentDate === dayNotif) {
        if (localStorage.getItem("Sobh") != undefined)
          sobh = localStorage.getItem("Sobh");
        if (localStorage.getItem("Dohr") != undefined)
          dohr = localStorage.getItem("Dohr");
        if (localStorage.getItem("Asr") != undefined)
          asr = localStorage.getItem("Asr");
        if (localStorage.getItem("Maghreb") != undefined)
          maghreb = localStorage.getItem("Maghreb");
        if (localStorage.getItem("Isha") != undefined)
          isha = localStorage.getItem("Isha");

        showBars();
        setBadgeText(sobh, dohr, asr, maghreb, isha);
        showLoadingPage(false);
      } else if (dayNotif == null || !dayNotif || currentDate != dayNotif) {
        let currentMonth = getCurrentMonth(); // 6;
        let prayerTimes = {};
        fetch(
          "https://maroc-salat.herokuapp.com/prayer?cityId=" +
            cityId +
            "&month=" +
            currentMonth +
            "&day=" +
            currentDay +
            "&lang=fr"
        )
          .then(response => response.json())
          .then(data => {
            prayerTimes = data[0];

            let sobh = prayerTimes.fajr;
            let dohr = prayerTimes.dhuhr;
            let asr = prayerTimes.asr;
            let maghreb = prayerTimes.maghrib;
            let isha = prayerTimes.ishae;

            // Stocker la valeur au niveau du localStorage
            localStorage.setItem("Isha", isha);
            localStorage.setItem("Maghreb", maghreb);
            localStorage.setItem("Asr", asr);
            localStorage.setItem("Dohr", dohr);
            localStorage.setItem("Sobh", sobh);

            // La création des notifications
            createNotification(isha, "Isha", "موعد أذان صلاة العشاء", 0);
            createNotification(maghreb, "Maghreb", "موعد أذان صلاة المغرب", 0);
            createNotification(asr, "Asr", "موعد أذان صلاة العصر", 0);
            createNotification(dohr, "Dohr", "موعد أذان صلاة الظهر", 0);
            createNotification(sobh, "Sobh", "موعد أذان صلاة الصبح", 0);

            // Créer notifications de rappel
            createNotification(isha, "Isha", "موعد إقامة صلاة العشاء", 1);
            createNotification(maghreb, "Maghreb", "موعد إقامة صلاة المغرب", 1);
            createNotification(asr, "Asr", "موعد إقامة صلاة العصر", 1);
            createNotification(dohr, "Dohr", "موعد إقامة صلاة الظهر", 1);
            createNotification(sobh, "Sobh", "موعد إقامة صلاة الصبح", 1);

            // Ajouter la date du jour au local Storage
            localStorage.setItem("dayNotif", currentDate);

            showBars();
            setBadgeText(sobh, dohr, asr, maghreb, isha);

            showLoadingPage(false);
          });
      }
    } else {
      console.log("Sorry! No Web Storage support...");
    }
  }
  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function(permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification("Hi there!");
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them any more.
}

function setBadgeText(sobh, dohr, asr, maghreb, isha) {
  let badgeText = "";
  let currentHour = getCurrentHour();
  let diffNowToNextPrayer = diffHours(currentHour, sobh);
  if (diffNowToNextPrayer > 0) {
    diffNowToNextPrayer = diffHours(currentHour, dohr);
    if (diffNowToNextPrayer > 0) {
      diffNowToNextPrayer = diffHours(currentHour, asr);
      if (diffNowToNextPrayer > 0) {
        diffNowToNextPrayer = diffHours(currentHour, maghreb);
        if (diffNowToNextPrayer > 0) {
          diffNowToNextPrayer = diffHours(currentHour, isha);
          if (diffNowToNextPrayer > 0) {
            badgeText = "...";
          }
        }
      }
    }
  }
  diffNowToNextPrayer *= -1;
  var badgeColor = "green";
  if (diffNowToNextPrayer < 11) {
    badgeColor = "red";
  }
  chrome.browserAction.setBadgeBackgroundColor({ color: badgeColor });
  badgeText =
    badgeText != "..." ? minutesToHourFormat(diffNowToNextPrayer) : "";
  chrome.browserAction.setBadgeText({ text: badgeText });

  console.log("badgeText = " + badgeText);
}

/**
 * Afficher le timeline
 */
function showBars() {
  let isha = localStorage.getItem("Isha");
  if (isha) {
    let maghreb = localStorage.getItem("Maghreb");
    let asr = localStorage.getItem("Asr");
    let dohr = localStorage.getItem("Dohr");
    let sobh = localStorage.getItem("Sobh");

    minHour = parseInt(moment(sobh, ["h:m a", "H:m"]).format("HH")) - 1;
    maxHour = parseInt(moment(isha, ["h:m a", "H:m"]).format("HH")) + 2;
    nbMinutesToDisplay = 60 * (maxHour - minHour);

    // Récupérer le nom de la ville choisie
    let cityName = localStorage.getItem("cityName");
    if (null == cityName) {
      let cityId =
        localStorage.getItem("cityId") != undefined
          ? localStorage.getItem("cityId")
          : "80";
      fetch("https://maroc-salat.herokuapp.com/city/" + cityId + "?lang=ar")
        .then(response => response.json())
        .then(data => {
          cityName = data.name;
          localStorage.setItem("cityName", cityName);
          $("p").text(cityName + " - " + moment().format("DD/MM/YYYY"));
        });
    } else {
      $("p").text(cityName + " - " + moment().format("DD/MM/YYYY"));
    }

    var minSobh = getMinuteByPrayerTime(sobh);
    var percentSobh = getPercentByMinPrayerTime(minSobh);
    $("#salat0").width(percentSobh + "%");

    var minDohr = getMinuteByPrayerTime(dohr);
    var percentDohr = getPercentByMinPrayerTime(minDohr - minSobh);
    $("#salat1").width(percentDohr + "%");

    var minAsr = getMinuteByPrayerTime(asr);
    var percentAsr = getPercentByMinPrayerTime(minAsr - minDohr);
    $("#salat2").width(percentAsr + "%");

    var minMaghreb = getMinuteByPrayerTime(maghreb);
    var percentMaghreb = getPercentByMinPrayerTime(minMaghreb - minAsr);
    $("#salat3").width(percentMaghreb + "%");

    var minIsha = getMinuteByPrayerTime(isha);
    var percentIsha = getPercentByMinPrayerTime(minIsha - minMaghreb);
    $("#salat4").width(percentIsha + "%");

    var total =
      parseFloat(percentSobh) +
      parseFloat(percentDohr) +
      parseFloat(percentAsr) +
      parseFloat(percentMaghreb) +
      parseFloat(percentIsha);
    var toFullBar = 100 - total;
    $("#salat5").width(toFullBar.toFixed(2) + "%");

    document.getElementById("salatTime1") != null
      ? (document.getElementById("salatTime1").textContent = sobh)
      : "";
    document.getElementById("salatTime2") != null
      ? (document.getElementById("salatTime2").textContent = dohr)
      : "";
    document.getElementById("salatTime3") != null
      ? (document.getElementById("salatTime3").textContent = asr)
      : "";
    document.getElementById("salatTime4") != null
      ? (document.getElementById("salatTime4").textContent = maghreb)
      : "";
    document.getElementById("salatTime5") != null
      ? (document.getElementById("salatTime5").textContent = isha)
      : "";

    percentSobh = (parseFloat(percentSobh) + 2.16).toFixed(2);
    $("#divSalatTime1").width(percentSobh + "%");
    $("#divSalatTime2").width((parseFloat(percentDohr) - 0.4).toFixed(2) + "%");
    $("#divSalatTime3").width((parseFloat(percentAsr) - 0.4).toFixed(2) + "%");
    $("#divSalatTime4").width(
      (parseFloat(percentMaghreb) - 0.4).toFixed(2) + "%"
    );
    $("#divSalatTime5").width((parseFloat(percentIsha) - 0.4).toFixed(2) + "%");
  }
}

function showTodayBar() {
  let currentHour = moment().format("HH:mm");
  var minNow = getMinuteByPrayerTime(currentHour);
  var hourBarWidth = parseFloat(
    (window.innerWidth * getPercentByMinPrayerTime(minNow)) / 100
  ).toFixed(2);
  $("#hourBar").width(hourBarWidth + "px");
  document.getElementById("currentHour") != null
    ? (document.getElementById("currentHour").textContent = currentHour)
    : "";
}

function showLoadingPage(action) {
  if ($("#divLoadingContainer") != undefined) {
    if (action) {
      $("#divLoadingContainer").css("display", "block");
    } else {
      $("#divLoadingContainer").css("display", "none");
    }
  }
}
