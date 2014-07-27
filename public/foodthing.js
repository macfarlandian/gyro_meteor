$(document).on('mobileinit pageshow', function() {
	// swipe list items to right
	$('.ui-listview li').on('swipemove', function(event, data) {
		$(this).offset(function(index, coords) {
			newleft = coords.left + data.delta[0].lastX
			console.log(newleft);
			return { left : newleft };
		});
	});	
});