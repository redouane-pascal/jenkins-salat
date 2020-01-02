// Vider le local Storage
localStorage.removeItem("Asr");
localStorage.removeItem("cities");
localStorage.removeItem("cityId");
localStorage.removeItem("cityName");
localStorage.removeItem("comment_bg_Asr");
localStorage.removeItem("comment_bg_Dohr");
localStorage.removeItem("comment_bg_Isha");
localStorage.removeItem("comment_bg_Maghreb");
localStorage.removeItem("dayNotif");
localStorage.removeItem("Dohr");
localStorage.removeItem("Isha");
localStorage.removeItem("Maghreb");
localStorage.removeItem("rappel_comment_bg_Asr");
localStorage.removeItem("rappel_comment_bg_Dohr");
localStorage.removeItem("rappel_comment_bg_Isha");
localStorage.removeItem("rappel_comment_bg_Maghreb");
localStorage.removeItem("Sobh");

// Repeat every 10 seconds
showNotify();
setInterval(function() {
  showNotify();
}, 10000);
