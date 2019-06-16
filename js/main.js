function init() {

	let isParamShown = false;
	var closeBtn = document.getElementById('closeBtn');
	closeBtn.addEventListener('click', function() {
		if(isParamShown){
			$("#divParam").removeClass("showParam");
			$("#divParam").addClass("hideParam");
			$("#divParam").css("left", "766px");
			$("#showCities").attr("src", "/img/svg_md-locate.svg");			
		}else{
			$("#divParam").removeClass("hideParam");
			$("#divParam").addClass("showParam");
			$("#divParam").css("left", "500px");
			$("#showCities").attr("src", "/img/svg_md-close.svg");
		}
		isParamShown = !isParamShown;

	});

	var select = document.getElementById('choosedCity');
	// Get all cities	
	if($('#choosedCity option')[0] == undefined){
		let cities = localStorage.getItem('cities');
		if(cities != null){
			let citiesJSON = JSON.parse(cities);
			citiesJSON.forEach(city => {
				$('#choosedCity').append($('<option></option>').val(city.id).html(city.name));
			});
		}else{
			fetch('https://maroc-salat.herokuapp.com/city?lang=ar')
			.then(response => response.json())
			.then(data => {
				let dataToStore = JSON.stringify(data);
				localStorage.setItem('cities', dataToStore);
				data.forEach(city => {
					$('#choosedCity').append($('<option></option>').val(city.id).html(city.name));
				});
			});
		}
	}

	// Add change eventlistener 
	select.addEventListener('change', function() {
		localStorage.setItem('cityId', select.value);
		localStorage.removeItem('cityName');
		localStorage.removeItem('dayNotif');
		showNotify();
	});
	// choose the appropriate city
	if(localStorage.getItem('cityId') != null){
		$("#choosedCity").val(localStorage.getItem('cityId'));
	}else{
		$("#choosedCity").val(80);
	}

	showBars();
	showTodayBar();
	setInterval(function () {
		showTodayBar();
	}, 10000);
}

document.addEventListener('DOMContentLoaded', init);