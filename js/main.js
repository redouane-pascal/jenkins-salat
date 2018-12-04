
function init() {
	showBar();
	setInterval(showBar, 15000);
	showNotify();
	setInterval(showNotify, 15000);
} 

var notifier, dialog, data;
var sobh, dohr, asr, maghreb, isha;
var isNotifSobh=true, isNotifDohr=true, isNotifAsr=true, isNotifMaghreb=true, isNotifIsha=true;

function checkZero(data){
	if(data.length == 1){
		data = "0" + data;
	}
	return data;
}	

function getCurrentDate(){
	var today = new Date();
	var day = today.getDate() + "";
	var month = (today.getMonth() + 1) + "";
	var year = today.getFullYear() + "";

	day = checkZero(day);
	month = checkZero(month);
	year = checkZero(year);

	return day + "/" + month + "/" + year;
}

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

function getMinuteByPrayerTime(prayerTime){
	var minPrayerTime = parseInt(prayerTime.split(":")[0])*60+parseInt(prayerTime.split(":")[1]);
	minPrayerTime = minPrayerTime - 360;
	return minPrayerTime;
}

function getPercentByMinPrayerTime(minPrayerTime){
	var percentPrayerTime = minPrayerTime / 9;
	percentPrayerTime = percentPrayerTime.toFixed(2);
	return percentPrayerTime;
}	

function showBar(){
	
	//readTextFile("https://api.myjson.com/bins/1a8bp2", function(text){
	readTextFile("prayer.json", function(text){
		data = JSON.parse(text);
		for(var i = 0; i < data.length; i++){
			var obj = data[i];
			if(obj.Date == getCurrentDate()){
				//alert(obj.Date+"|"+ obj.Dohr+"|"+obj.Asr+"|"+obj.Maghreb+"|"+obj.Isha);
				sobh = obj.Sobh;
				dohr = obj.Dohr;
				asr = obj.Asr;
				maghreb = obj.Maghreb;
				isha = obj.Isha;				
				showNotify();
				break;
			}
		}	

		//var sobh = "06:29";
		var minSobh = getMinuteByPrayerTime(sobh);
		var percentSobh = getPercentByMinPrayerTime(minSobh);
		$("#salat0").width(percentSobh + "%");
		
		//var dohr = "13:17";
		var minDohr = getMinuteByPrayerTime(dohr);
		var percentDohr = getPercentByMinPrayerTime(minDohr-minSobh);
		$("#salat1").width(percentDohr + "%");
		
		//var asr = "16:03";
		var minAsr = getMinuteByPrayerTime(asr);
		var percentAsr = getPercentByMinPrayerTime(minAsr-minDohr);
		$("#salat2").width(percentAsr + "%");
		
		//var maghreb = "18:27";
		var minMaghreb = getMinuteByPrayerTime(maghreb);
		var percentMaghreb = getPercentByMinPrayerTime(minMaghreb-minAsr);
		$("#salat3").width(percentMaghreb + "%");
		
		//var isha = "19:45";
		var minIsha = getMinuteByPrayerTime(isha);
		var percentIsha = getPercentByMinPrayerTime(minIsha-minMaghreb);
		$("#salat4").width(percentIsha + "%");
		
		var total = parseFloat(percentSobh) + parseFloat(percentDohr) + parseFloat(percentAsr) + parseFloat(percentMaghreb) + parseFloat(percentIsha);
		var toFullBar = 100 - total;
		$("#salat5").width(toFullBar.toFixed(2) + "%");	
		
		var d = new Date();
		var h = d.getHours();
		var m = d.getMinutes();
		var minNow = 60*h + m - 360;
		var percentNow = minNow / 9 ;
		percentNow = (8*percentNow).toFixed(2)-4;
		
		$("#hourBar").width(percentNow+'px');
		if(h < 10){
			h = "0" + h;
		}	
		if(m < 10){
			m = "0" + m;
		}
/*				
		console.log("percentSobh = " + percentSobh + "% ");
		console.log("percentDohr = " + percentDohr + "% ");
		console.log("percentAsr = " + percentAsr + "% ");
		console.log("percentMaghreb = " + percentMaghreb + "% ");
		console.log("percentIsha = " + percentIsha + "% ");
		console.log("percentNow = " + percentNow + "% ");
*/		
		document.getElementById("currentHour").textContent = h + ":" + m;	
		document.getElementById("salatTime1").textContent = sobh;
		document.getElementById("salatTime2").textContent = dohr;
		document.getElementById("salatTime3").textContent = asr;
		document.getElementById("salatTime4").textContent = maghreb;
		document.getElementById("salatTime5").textContent = isha;		
		
		percentSobh = (parseFloat(percentSobh) + 2.16).toFixed(2);
		$("#divSalatTime1").width(percentSobh + "%");				
		$("#divSalatTime2").width((parseFloat(percentDohr) - 0.4).toFixed(2) + "%");
		$("#divSalatTime3").width((parseFloat(percentAsr) - 0.4).toFixed(2) + "%");
		$("#divSalatTime4").width((parseFloat(percentMaghreb) - 0.4).toFixed(2) + "%");
		$("#divSalatTime5").width((parseFloat(percentIsha) - 0.4).toFixed(2) + "%");
		
	});

}

function msToTime(duration) {
	var minutes = parseInt((duration / (1000 * 60)) % 60),
	hours = parseInt((duration / (1000 * 60 * 60)) % 24);

	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;

	return hours + ":" + minutes;
}
function createNotification(prayerTime, salat){
	if(prayerTime){
		var title = 'test test';
		var img = '../img/automotive.png';				
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
			chrome.browserAction.setBadgeText({text: msToTime(millisTillSalat)});
			var badgeColor = "green"; 
			if(millisTillSalat < 900000){
				badgeColor = "red";
			}			
			chrome.browserAction.setBadgeBackgroundColor({color: badgeColor});
			
			//alert("salat="+salat+", isNotifIsha=" + isNotifIsha + ", isNotifMaghreb=" + isNotifMaghreb + ", isNotifAsr=" + isNotifAsr + ", isNotifDohr=" + isNotifDohr);
			if ((salat=='Isha' && isNotifIsha) 
			|| (salat=='Maghreb' && isNotifMaghreb) 
			|| (salat=='Asr' && isNotifAsr) 
			|| (salat=='Dohr' && isNotifDohr)) {
				
				if (salat=='Isha') {isNotifIsha = false; titre = "موعد صلاة العشاء"; console.log("Isha Notif. created");}
				if (salat=='Maghreb') {isNotifMaghreb = false; titre = "موعد صلاة المغرب"; console.log("Maghreb Notif. created");}
				if (salat=='Asr') {isNotifAsr = false; titre = "موعد صلاة العصر"; console.log("Asr Notif. created");}
				if (salat=='Dohr') {isNotifDohr = false; titre = "موعد صلاة الظهر"; console.log("Dohr Notif. created");}
				if (salat=='Sobh') {isNotifSobh = false; titre = "موعد صلاة الصبح"; console.log("Sobh Notif. created");}
		
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
	createNotification(isha, 'Isha');
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




/*  
function showNotify() {	
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
	alert("This browser does not support desktop notification");
  }
}
	
function showDialog(){
	currentDate = getCurrentDate();
	chrome.windows.create({
		url: 'dialog.html',
		width: 200,
		height: 120,
		type: 'popup'
	});
}  

function showBar(salat, nextSalat){
	var prayerTime = localStorage.getItem(salat);
	var nextPrayerTime = localStorage.getItem(nextSalat);
	if(nextSalat == ''){
		nextPrayerTime = prayerTime;
	}
	
	var hour = parseInt(prayerTime.split(":")[0]);
	var min = parseInt(prayerTime.split(":")[1]);	
	var totalMin = 60 * hour + min;
	
	var nextPrayerHour = parseInt(nextPrayerTime.split(":")[0]);
	var nextPrayerMin = parseInt(nextPrayerTime.split(":")[1]);	
	var nextPrayerTotalMin = 60 * nextPrayerHour + nextPrayerMin;
	
	var now = new Date();
	var hourNow = parseInt(now.getHours());
	var minuteNow = parseInt(now.getMinutes());	
	var totalMinNow = 60 * hourNow + minuteNow;
		
	var diffPrayers = nextPrayerTotalMin - totalMin;
	var diffNowPrayer = nextPrayerTotalMin - totalMinNow;
	
	var percentRest = Math.floor((diffNowPrayer / diffPrayers) * 100);	
	if((percentRest >= 100)|| (percentRest < 0)) {
		percentRest = 100;
	}
	
	var progressBar = document.getElementById("myBar"+salat);  
	progressBar.style.width = percentRest + '%';
	$("#myBar"+salat).html(prayerTime);
	if(percentRest == 100){
		$('#myBody').css('color', '#9e9e9e');
		progressBar.style.backgroundColor = "#9E9E9E";
	}else if(percentRest <= 10) {
		$('#myBody').css('color', '#B10009');
		progressBar.style.backgroundColor = "#B10009";
	}else if(percentRest <= 20) {
		$('#myBody').css('color', '#FF8000');
		progressBar.style.backgroundColor = "#FF8000";
	}else{
		$('#myBody').css('color', '#008000');
		progressBar.style.backgroundColor = "#008000";
	}
}
*/
document.addEventListener('DOMContentLoaded', init);


