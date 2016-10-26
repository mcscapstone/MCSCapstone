$(function(){
// IPad/IPhone
	var viewportmeta = document.querySelector && document.querySelector('meta[name="viewport"]');
	var ua = navigator.userAgent;
	var gestureStart = function () {viewportmeta.content = "width=device-width, minimum-scale=0.25, maximum-scale=1.6";};
	var scaleFix = function () {
		if (viewportmeta && /iPhone|iPad/.test(ua) && !/Opera Mini/.test(ua)) {
			viewportmeta.content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0";
			document.addEventListener("gesturestart", gestureStart, false);
		}
	};

	scaleFix();

	// Menu Android
	var userag = navigator.userAgent.toLowerCase();
	var isAndroid = userag.indexOf("android") > -1;
	if(isAndroid) {
		$('.sf-menu').responsiveMenu({autoArrows:true});
	}
});

$(function(){
	$('.social-icons a')
		.mouseover(function(){$(this).stop().animate({opacity:0.5}, 200);})
		.mouseout(function(){$(this).stop().animate({opacity:1}, 200);});
});


$(function printYear(){

    var currentDate = new Date();
    var currentYear = String(currentDate.getFullYear());
    document.getElementsByClassName("date")[0].innerHTML = currentYear;

});
