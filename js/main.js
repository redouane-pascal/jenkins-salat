function init() {

	var link = document.getElementById('infos');
	link.addEventListener('dblclick', function() {
		$("#divParam").removeClass("hideParam");
		$("#divParam").addClass("showParam");
		$("#divParam").css("top", "-10px");
	});

	var closeBtn = document.getElementById('closeBtn');
	closeBtn.addEventListener('click', function() {
		$("#divParam").removeClass("showParam");
		$("#divParam").addClass("hideParam");
		$("#divParam").css("top", "-90px");
	});

	var select = document.getElementById('choosedCity');
	select.addEventListener('change', function() {
		localStorage.setItem('cityId', select.value);
		localStorage.removeItem('dayNotif');
		showNotify();
	});
	$("#choosedCity").val(localStorage.getItem('cityId'));

	showBars();

}

document.addEventListener('DOMContentLoaded', init);