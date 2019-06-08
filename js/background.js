let cityId = 0;
var sobh, dohr, asr, maghreb, isha;

function checkZero(data){
  if(data.length == 1){
	data = "0" + data;
  }
  return data;
}	

function msToTime(duration) {
	if(duration == '(-_-)'){
		return duration;
	}
	var minutes = parseInt((duration / (1000 * 60)) % 60),
	hours = parseInt((duration / (1000 * 60 * 60)) % 24);

	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;

	return hours + ":" + minutes;
}

function getCurrentDate(){
	var today = new Date();
	var day = today.getDate() + "";
	var month = (today.getMonth() + 1) + "";
	var year = today.getFullYear() + "";

	day = checkZero(day);
	month = checkZero(month);
	year = checkZero(year);

	console.log(day + "/" + month + "/" + year);
	return day + "/" + month + "/" + year;
}

function getCurrentMonth(){
	let today = new Date();
	let month = (today.getMonth() + 1) + "";

	console.log("currentMonth = " + month);
	return month;
}

function addTenMinute(t) {
	if(t.indexOf(':') > -1){
		var h = parseInt(t.split(':')[0]);
		var m = parseInt(t.split(':')[1]);
		m = m + 10;
		if(m > 59){
			m = m - 60;
			h = (h + 1) % 24;
		}
		return checkZero(h)+":"+checkZero(m);
	}
}

function createNotification(prayerTime, salat, titre, isRappel){
	//alert("isRappel:"+isRappel);
	// to check if the notification will be created
	var count = 0;
	if(prayerTime){		
		var now = new Date();
		var hour = prayerTime.split(":")[0];
		var minute = prayerTime.split(":")[1];
		var millisTillSalat = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0) - now;
		if(millisTillSalat > 0){					
			var img = 'img/azan.png';
			var title = 'الصلاة الصلاة';			
			var text = 'إن الصلاة كانت على المومنين كتابا موقوتا';
				
			// Rappel après 10 minutes
			if(isRappel == 1){					
				millisTillSalat = millisTillSalat + 600000;
				var rappelTime = addTenMinute(prayerTime);
				localStorage.setItem("rappel_comment_bg_"+salat, "Rappel CreateNotification started (rappelTime=" +rappelTime+ ")");		
				img = 'img/iqama.png';	
			}else{
				localStorage.setItem("comment_bg_"+salat, "CreateNotification started (prayerTime=" +prayerTime+ ")");
			}
	
			setTimeout(function(){
				var notification = new Notification(titre, { body: text, icon: img });
			}, millisTillSalat);
		}
	}
}

function showNotify() {
	
    var d = new Date();
    var n = d.getTime();
	localStorage.setItem("bg_salat", n);
	
	// Let's check if the browser supports notifications
	if (!("Notification" in window)) {
		alert("This browser does not support desktop notification");
	}
	// Let's check whether notification permissions have already been granted
	else if (Notification.permission === "granted") {
	/*
		var notification = new Notification("حي على الصلاة", 
			{ 
				body: "يا معشر المسلمين، حان الأن موعد الصلاة.", 
				icon: "../img/minions_barbe.jpg" 
			}
		);
	*/	
	if (typeof(Storage) !== "undefined") {
		var dayNotif = localStorage.getItem("dayNotif");
		var currentDay = getCurrentDate();
		if(currentDay === dayNotif){
			if(localStorage.getItem("Sobh") != undefined)	
					sobh = localStorage.getItem("Sobh");
			if(localStorage.getItem("Dohr") != undefined)		
					dohr = localStorage.getItem("Dohr");
			if(localStorage.getItem("Asr") != undefined)		
					asr = localStorage.getItem("Asr");
			if(localStorage.getItem("Maghreb") != undefined)		
					maghreb = localStorage.getItem("Maghreb");
			if(localStorage.getItem("Isha") != undefined)		
					isha = localStorage.getItem("Isha");
		}else if(!dayNotif){
			let currentMonth = getCurrentMonth();  // 6;
			let prayerTimes = {};
			fetch('https://maroc-salat.herokuapp.com/prayer?cityId='+cityId+'&month='+currentMonth+'&day=8&lang=fr')
			.then(response => response.json())
			.then(data => {	
				console.log(data[0].fajr);
				prayerTimes = data[0];

				sobh = prayerTimes.fajr;
				dohr = prayerTimes.dhuhr;
				asr = prayerTimes.asr;
				maghreb = prayerTimes.maghrib;
				isha = prayerTimes.ishae;

				// Stocker la valeur au niveau du localStorage
				localStorage.setItem('Isha', isha);
				localStorage.setItem('Maghreb', maghreb);
				localStorage.setItem('Asr', asr);
				localStorage.setItem('Dohr', dohr);
				localStorage.setItem('Sobh', sobh);

				// La création des notifications						
				createNotification(isha, 'Isha', "موعد أذان صلاة العشاء", 0);
				createNotification(maghreb, 'Maghreb', "موعد أذان صلاة المغرب", 0);
				createNotification(asr, 'Asr', "موعد أذان صلاة العصر", 0);
				createNotification(dohr, 'Dohr', "موعد أذان صلاة الظهر", 0);
				createNotification(sobh, 'Sobh', "موعد أذان صلاة الصبح", 0);

				// Créer notifications de rappel
				createNotification(isha, 'Isha', "موعد إقامة صلاة العشاء", 1);
				createNotification(maghreb, 'Maghreb', "موعد إقامة صلاة المغرب", 1);
				createNotification(asr, 'Asr', "موعد إقامة صلاة العصر", 1);
				createNotification(dohr, 'Dohr', "موعد إقامة صلاة الظهر", 1);
				createNotification(sobh, 'Sobh', "موعد إقامة صلاة الصبح", 1);

				// Ajouter la date du jour au local Storage
				localStorage.setItem("dayNotif", currentDay);		
		
				if( (sobh) && (dohr) && (asr) && (maghreb) && (isha) ){
					var timeTillNextSalat = "(-_-)";
					var now = new Date();		
					var hour = isha.split(":")[0];
					var minute = isha.split(":")[1];
					var millisTillSalatIsha = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0) - now;	
					if(millisTillSalatIsha > 0){	
						// Isha Time
						timeTillNextSalat = millisTillSalatIsha;
						hour = maghreb.split(":")[0];
						minute = maghreb.split(":")[1];
						var millisTillSalatMaghreb = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0) - now;	
						if(millisTillSalatMaghreb > 0){	
							// Maghreb Time
							timeTillNextSalat = millisTillSalatMaghreb;
							hour = asr.split(":")[0];
							minute = asr.split(":")[1];
							var millisTillSalatAsr = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0) - now;			
							if(millisTillSalatAsr > 0){	
								// Asr Time
								timeTillNextSalat = millisTillSalatAsr;
								hour = dohr.split(":")[0];
								minute = dohr.split(":")[1];
								var millisTillSalatDohr = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0) - now;	
								if(millisTillSalatDohr > 0){	
									// Dohr Time	
									timeTillNextSalat = millisTillSalatDohr;		
									hour = sobh.split(":")[0];
									minute = sobh.split(":")[1];
									var millisTillSalatSobh = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0) - now;
									if(millisTillSalatSobh > 0){	
										// Sobh Time
										timeTillNextSalat = millisTillSalatSobh;
									}	
								}
							}
						}	
					}

					if(timeTillNextSalat != '(-_-)'){					
						chrome.browserAction.setBadgeText({text: msToTime(timeTillNextSalat)});
						var badgeColor = "green"; 
						if(timeTillNextSalat < 900000){
							badgeColor = "red";
						}	
						chrome.browserAction.setBadgeBackgroundColor({color: badgeColor});
					}else{
						chrome.browserAction.setBadgeText({text: ''});	
					}
							
				}
						
			});
		}
				
	} else {
		console.log("Sorry! No Web Storage support...");
	}
  }
  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
	Notification.requestPermission().then(function (permission) {
	  // If the user accepts, let's create a notification
	  if (permission === "granted") {
		var notification = new Notification("Hi there!");
	  }
	});
  }

  // At last, if the user has denied notifications, and you 
  // want to be respectful there is no need to bother them any more.
}
  
// Repeat every 30 seconds
setInterval(function(){	
	showNotify();
}, 10000);

// First execution
localStorage.removeItem('dayNotif');
localStorage.removeItem('Isha');
localStorage.removeItem('Maghreb');
localStorage.removeItem('Asr');
localStorage.removeItem('Dohr');
localStorage.removeItem('Sobh');

// Read configuration
fetch('js/config.json')
.then(response => response.text())
.then(text => {
	cityId = JSON.parse(text).cityId;
	localStorage.setItem('cityId', cityId);
	showNotify();
});
