// First execution
localStorage.removeItem('dayNotif');
localStorage.removeItem('Isha');
localStorage.removeItem('Maghreb');
localStorage.removeItem('Asr');
localStorage.removeItem('Dohr');
localStorage.removeItem('Sobh');

// Repeat every 10 seconds
showNotify();
setInterval(function () {
    showNotify();
}, 10000);
