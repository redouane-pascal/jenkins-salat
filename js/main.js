var isha = localStorage.getItem('Isha');
var maghreb = localStorage.getItem('Maghreb');	
var asr = localStorage.getItem('Asr');
var dohr = localStorage.getItem('Dohr');
var sobh = localStorage.getItem('Sobh');

let minHour = parseInt(moment(sobh, ['h:m a', 'H:m']).format('HH')) - 1 ;
let maxHour = parseInt(moment(isha, ['h:m a', 'H:m']).format('HH')) + 2 ;
let nbMinutesToDisplay = 60*(maxHour - minHour);

function init() {
	showBar();
	setInterval(showBar, 30000);
} 

// Calculer le nombre de minutes entre l'heure de la prière [prayerTime] et minHour du matin
function getMinuteByPrayerTime(prayerTime){
	if( (prayerTime) && (prayerTime != null) ){
		var minPrayerTime = parseInt(prayerTime.split(":")[0])*60+parseInt(prayerTime.split(":")[1]);
		minPrayerTime = minPrayerTime - 60 * minHour; // 60 * 3
		return minPrayerTime;
	}
}
// Calculer le pourcentage des minutes par rapport à 9 (21:00 - 06:00 = 15h => 15 * 60min = 900min => 900 / 100 = 9)
// Calculer le pourcentage des minutes par rapport à  (03:00 - 24:00 = 21h => 21 * 60min = 1260min => 1260 / 100 = 12.6)
function getPercentByMinPrayerTime(minPrayerTime){
	var percentPrayerTime = 100 * minPrayerTime / nbMinutesToDisplay;
	percentPrayerTime = percentPrayerTime.toFixed(2);
	return percentPrayerTime;
}	

// Afficher le timeline
function showBar(){

	
	let cityId = localStorage.getItem('cityId');
	fetch('https://maroc-salat.herokuapp.com/city/'+cityId+'?lang=fr')
	.then(response => response.json())
	.then(data => {
		let cityName = data.name;
		$("p").text(cityName+', le '+ moment().format('DD/MM/YYYY'))
		//"Copyright 2018, Rabat-Morocco_v0.1"
	});

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
	
	let currentHour = moment().format('HH:mm');
	var minNow = getMinuteByPrayerTime(currentHour);
	var hourBarWidth = parseFloat(window.innerWidth * getPercentByMinPrayerTime(minNow) / 100).toFixed(2); 
	$("#hourBar").width(hourBarWidth+'px');
	
	document.getElementById("currentHour").textContent = currentHour;	
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
		

}

document.addEventListener('DOMContentLoaded', init);


