
var notifier, dialog, data;
var sobh, dohr, asr, maghreb, icha;
var isNotifSobh=true, isNotifDohr=true, isNotifAsr=true, isNotifMaghreb=true, isNotifIcha=true;

function readTextFile(file, callback) {
	var rawFile = new XMLHttpRequest();
	rawFile.overrideMimeType("application/json");
	rawFile.open("GET", file, true);
	rawFile.onreadystatechange = function() {
		if (rawFile.readyState === 4 && rawFile.status == "200") {
			callback(rawFile.responseText);
		}
	}
	rawFile.send(null);
} 
function checkZero(data){
  if(data.length == 1){
	data = "0" + data;
  }
  return data;
}	
function msToTime(duration) {
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
readTextFile("prayer.json", function(text){
	data = JSON.parse(text);
	for(var i = 0; i < data.length; i++){
		var obj = data[i];
		if(obj.Date == getCurrentDate()){
			//alert(obj.Date+"|"+ obj.Dohr+"|"+obj.Asr+"|"+obj.Maghreb+"|"+obj.Icha);
			sobh = obj.Sobh;
			dohr = obj.Dohr;
			asr = obj.Asr;
			maghreb = obj.Maghreb;
			icha = obj.Icha;
			showNotify();
			break;
		}
	}	 
});

function createNotification(prayerTime, salat){
	console.log(" createNotification started (prayerTime=" +prayerTime+", salat="+salat);
	if(prayerTime){
		var title = 'test test';
		var img = '../img/minions_barbe.jpg';				
		var text = 'يا معشر المسلمين، حان الأن موعد الصلاة.';
		//alert("le temps restant jusqu'a Salat " + salat + " est : " + msToTime(millisTillSalat))
		var now = new Date();
		//alert("prayerTime:"+prayerTime);
		var hour = prayerTime.split(":")[0];
		var minute = prayerTime.split(":")[1];
		//alert(salat+"-"+prayerTime);
		localStorage.setItem(salat,prayerTime);
		var millisTillSalat = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0) - now;
		if(millisTillSalat > 0){
			console.log("msToTime(millisTillSalat) = " + msToTime(millisTillSalat));
			chrome.browserAction.setBadgeText({text: msToTime(millisTillSalat)});
			var badgeColor = "green"; 
			if(millisTillSalat < 900000){
				badgeColor = "red";
			}			
			chrome.browserAction.setBadgeBackgroundColor({color: badgeColor});
			
			//alert("salat="+salat+", isNotifIcha=" + isNotifIcha + ", isNotifMaghreb=" + isNotifMaghreb + ", isNotifAsr=" + isNotifAsr + ", isNotifDohr=" + isNotifDohr);
			if ((salat=='Icha' && isNotifIcha) 
			|| (salat=='Maghreb' && isNotifMaghreb) 
			|| (salat=='Asr' && isNotifAsr) 
			|| (salat=='Dohr' && isNotifDohr)) {
				
				if (salat=='Icha') {isNotifIcha = false; titre = "موعد صلاة العشاء";}
				if (salat=='Maghreb') {isNotifMaghreb = false; titre = "موعد صلاة المغرب";} 
				if (salat=='Asr') {isNotifAsr = false; titre = "موعد صلاة العصر";}  
				if (salat=='Dohr') {isNotifDohr = false; titre = "موعد صلاة الظهر";}
				if (salat=='Sobh') {isNotifDohr = false; titre = "موعد صلاة الصبح";} 	
		
				setTimeout(function(){
					var notification = new Notification(titre, { body: text, icon: img });
				}, millisTillSalat);
			}
		}
	}
}

function showNotify() {	
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
	createNotification(icha, 'Icha');
	createNotification(maghreb, 'Maghreb');	
	createNotification(asr, 'Asr');
	createNotification(dohr, 'Dohr');
	createNotification(sobh, 'Sobh');
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
showNotify();


  
/*
var stillRun = true;
var i=10;
while (stillRun && i>0) {
	setTimeout(function(){
		alert("working " + i);
		i = i - 1;
	}, 5000);
}
*/