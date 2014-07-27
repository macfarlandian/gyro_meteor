

function donutColor(val){
    // bar color changes
	var yearcolor = "#9966CC";
	var monthcolor = "#0066CC";
	var weekcolor = "#33CCCC";
	var fivedaycolor = "#FFCC33";
	var twodaycolor = "#FF8F33";

	switch ($(this.el).data('timescale')) {
		case 'week':
			// 2/7 of 100 = 28ish
			if (val < hundredScale(3,7).min) {
				return twodaycolor;
			} else if (val > hundredScale(5,7).max) {
				return weekcolor;
			} else {
				return fivedaycolor;
			}
			break;
		case 'month':
			return monthcolor;
			break;
		case 'year':
			return yearcolor;
			break;
		default:
			return weekcolor;
			break;
	}
}

function hundredScale(num, divisions) {
	// scale the label boundaries automatically... with MATH
	var scalefactor = 100 / divisions;
	var currentscaled = num * scalefactor;
	// var max = currentscaled + scalefactor;
	var min = currentscaled - scalefactor;
	return {'min': min, 'max': currentscaled}
}

function updateLabel(val) {
	var currentnum = parseInt($('.chart .num').text());
	switch ($('.chart').data('timescale')) {
	case 'week':
		var divisions = 7;
		break;
	case 'month':
		var divisions = 30;
		break;
	case 'year':
		var divisions = 12;
		break;
	default:
		// if unset
		$('.chart').data('timescale', "week");
		var divisions = 7;
		break;
	}
	scaled = hundredScale(currentnum, divisions);
	max = scaled.max;
	min = scaled.min;
	var dec = currentnum - 1;
	var inc = currentnum + 1;

	if (val < min) { $('.chart .num').text(dec)}
	else if (val > max) {$('.chart .num').text(inc)}
	// console.log(scaled);
}

function saveItem(id){
	var name = $('#itemName').val();
	var time = $('#itemTime').html();
	var scale = $('input:radio[name=timescale]:checked').val();
	var slider = $('#slider-1').val();

	var data = {
		'name': name ,
		'timescale': scale,
		'shelflife': time,
		'status': "active"
	};

	if (id !='0'){
		data['id'] = parseInt(id);
	} else {
		data['id'] = 'new';
	}

	$.ajax({
		url: "ajax/update/",
		method: 'POST',
		data: data,
		success: function(data) {
			closeAndReset('#editview');
		}
	});
}

function getAll(){
	$.ajax({
		url: "ajax/getall/",
		method: "GET",
		dataType: "json",
		success: function(data)
		{
			//console.log(data);
			$('#pantryList').isotope('destroy');
			$('#pantryList').html("");
			$('#pantryList').isotope({
				filter: '*',
				animationOptions: {
					duration: 750,
					easing: 'linear',
					queue: false
				},
				getSortData: {
					remaining: function($el){
						var remaining = parseInt($el.find('.num').text());
						var scale = $el.find('.staticchart').data('timescale');
						if (scale == 'year'){
							remaining = remaining * 30;
						}
						return remaining;
					}

				},
				sortBy: 'remaining'
			});

			$.each(data,function(i,value) {
				if (value.remaining == 0){
					var timeunits = 'tap to reset'
				} else {
					if (value.timescale == 'year') {
						var timeunits = 'months';
					} else {
						var timeunits = 'days';
					}
				}

				var classes = "isotope-item";
				if (value.remaining == 0)
					classes +=" expired";
				else
					classes+=" activeTimer";
				if(value.timescale != "year")
				{

					if(value.remaining <= 7 && value.remaining != 0)
					classes +=" soon";
					if(value.remaining <30 && value.remaining != 0)
						classes +=" month";
					else if(value.remaining != 0)
						classes +=" later";
				}
				else
				{
					classes +=" later";
				}

				var $newItems = $('<div class="'+classes+'" id="item'+value.id+'" data-timerid="'+value.id+'" style="position: absolute; left: 0px; top: 0px;" ><div class="staticchart" data-percent="'+value.percentage+'"><div class="label"><div class="num">'+value.remaining+'</div><div class="timescale">'+timeunits+'</div></div></div><div class="itemname">'+value.name+'</div></div>');

				$newItems.children('.staticchart').data({'timescale': value.timescale});
				$newItems.click(function (e) {
					if (value.remaining == 0){
						resetItem(value.id);
					} else {
						openItem(value.id);
					}

				})
				$('#pantryList').isotope( 'insert', $newItems );

			});


			// small charts for list view
			var staticoptions2 = {
				'lineWidth': 5,
				'size': 110,
				'scaleColor': false,
				'animate': false,
				'lineCap': 'butt',
				'barColor': donutColor,
				'trackColor': '#C9C9C9'
				};
			var staticoptions_expired = {
				'lineWidth': 5,
				'size': 110,
				'scaleColor': false,
				'animate': false,
				'lineCap': 'butt',
				'barColor': donutColor,
				'trackColor': '#FF3333'
				};
				//$('#pantryList').append($newItems);
			// expired items a differnet color
			$('.isotope-item:not(.expired) .staticchart').easyPieChart(staticoptions2);
			// whatever's left is expired
			$('.staticchart').easyPieChart(staticoptions_expired);


		}

	});

	// reset editing dialog also

}

function openItem(id){
	$.ajax({
		url: "ajax/getone/",
		method: "POST",
		dataType: "json",
		data: {
			id: id
		},
		success: function(data)
		{
			// load page into DOM
			$.mobile.loadPage('#editview', {role: 'dialog'});

			// update it with values from response
			$('#editview h1.ui-title').text('Edit "' + data.name + '"');
			$('#editview #itemName').val(data.name);
			$('#editview .chart').data('timescale', data.timescale);
			if(data.timescale == "week") {
				$("#editview #radio-choice-1").prop("checked",true).checkboxradio("refresh");
				$("#editview #radio-choice-2").prop("checked",false).checkboxradio("refresh");
				$("#editview #radio-choice-3").prop("checked",false).checkboxradio("refresh");
				$('#editview .timescale').text('days');
			} else if (data.timescale == "month") {
				$("#editview #radio-choice-1").prop("checked",false).checkboxradio("refresh");
				$("#editview #radio-choice-2").prop("checked",true).checkboxradio("refresh");
				$("editview #radio-choice-3").prop("checked",false).checkboxradio("refresh");
				$('#editview .timescale').text('days');
			} else {
				$("#editview #radio-choice-1").prop("checked",false).checkboxradio("refresh");
				$("#editview  #radio-choice-2").prop("checked",false).checkboxradio("refresh");
				$("#editview #radio-choice-3").prop("checked",true).checkboxradio("refresh");
				$('#editview .timescale').text('months');
			}
			$("#editview input#slider-1").val(data.percentage);
			$('#editview .chart').data('easyPieChart').update(data.percentage);
			$('#editview input#slider-1').slider('refresh');
			$('#editview .num').text(data.remaining);
			$('#editview #deleteButton').show();
			$("#editview #itemId").val(data.id);

			// activate buttons
			$('#editview #deleteButton').off('click');
			$('#editview #deleteButton').click(function(){
				console.log($(this));
				//deleteItem(data.id);
				$('#popupCancelButton').click(function(){
					//console.log("Cancelling delete");
					$("#popupDelete").popup("close");
				});

				$('#popupDeleteButton').off('click');
				$("#popupDeleteButton").click(function(){
					$("#popupDelete").popup("close");
					//console.log("popup delete");
					deleteItem(data.id);
				})

				//$('#popupCancelButton').off('click');


			});
			$('#editview #resetButton').show();
			$('#editview #resetButton').off('click');
			$('#editview #resetButton').click(function(){
				resetItem(data.id);
			})
			// activate save button
			$('#editview #saveButton').off('click')
			$('#editview #saveButton').click(function () {
				saveItem(data.id);
			});

			// show dialog
			$.mobile.changePage('#editview');
		}
	});

}

function closeAndReset(selector) {
	try {
		$(selector).dialog('close');
		getAll();
	} catch (err) {
		getAll();
	}

}

function deleteItem(id){
	$.ajax({
		url: 'ajax/delete/',
		data: {'id': id},
		method: 'POST',
		success: function(data)
		{
			closeAndReset('#editview');
		}
	});

}

function resetItem(id){
	$.ajax({
		url: 'ajax/reset/',
		data: {'id': id},
		method: 'POST',
		success: function(data)
		{
			console.log(data);
			closeAndReset('#editview');
			getAll();
		}
	});
}

function showAddNew(){
	// reset edit settings and show
	$.mobile.changePage('#editview', {role: 'dialog'});
	$('#editview h1.ui-title').text("Add new timer");
	$('#editview .num').text('7');
	$('#editview #itemName').val("");
	$('#editview .chart').data('timescale', "week");
	$("#editview #radio-choice-1").prop("checked",true).checkboxradio("refresh");
	$("#editview #radio-choice-2").prop("checked",false).checkboxradio("refresh");
	$("#editview #radio-choice-3").prop("checked",false).checkboxradio("refresh");
	$('#editview .timescale').text('days');
	$("#editview input#slider-1").val(98);
	$('#editview .chart').data('easyPieChart').update(98);
	$('#editview input#slider-1').slider('refresh');
	$('#editview #deleteButton, #editview #resetButton').hide();
	$("#editview #itemId").val(0);

	// activate save button
	$('#editview #saveButton').off('click');
	$('#editview #saveButton').click(function () {
		saveItem(0);
	});
}

$(window).on('pageshow', function() {
	// hide text inputs on sliders
	$('.ui-slider-input').addClass('ui-hidden-accessible');
	$('.ui-slider-track').css('margin-left', function(){
		return $(this).css('margin-right')}
	);

	// initialize donut chart for editview
	var chartoptions = {
		'lineWidth': 8,
		'size': 250,
		'scaleColor': false,
		'animate': false,
		'lineCap': 'butt',
		'barColor': donutColor,
		'trackColor': '#C9C9C9'
    }
	$('.chart').easyPieChart(chartoptions);

	// link slider to donut chart
	$('input#slider-1').on('change', function(e){
		var val = e.target.value;
		$('.chart').data('easyPieChart').update(val);
		updateLabel(val);
	});

	// switch timescales
	$('input[name=timescale]').change(function(e) {
		// update jquery data on element
		timescale = e.target.value;
		oldscale = $('.chart').data('timescale');
		$('.chart').data({'timescale': timescale});
		// console.log(oldscale, timescale, $('.chart').data('timescale'))

		// rescale slider and change label units if applicable
		// if we rescale the current no. of days
		var currentlabel = parseInt($('.chart .num').text());
		var divisions;
		switch (timescale){
		case 'week':
			divisions = 7;
			switch(oldscale){
			case 'month':
				// if 7 or less days, preserve the number of days;
				// otherwise just start at 7
				if (currentlabel > 7) {
					currentlabel = 7;
					$('.chart .num').text(currentlabel);
				} else {
					// because it was converting funny with decimals and shit
					currentlabel = currentlabel - 0.1;
				}

				break;
			case 'year':
				// just start at 7 days
				currentlabel = 7;
				$('.chart .num').text(currentlabel);
				$('.chart .timescale').text('days');
				break;
			default:
				break;
			}
			break;
		case 'month':
			divisions = 30;
			// upconverting from week: use label text as above
			if (oldscale == 'week') {
				// because it was converting funny with decimals and shit
				currentlabel = currentlabel - 0.1;
			}
			// downconverting: start at 30 days
			if (oldscale == 'year') {
				currentlabel = 30;
				$('.chart .num').text(currentlabel);
				$('.chart .timescale').text('days');
			}
			break;
		case 'year':
			// no matter what, just start at one month
			divisions = 12;
			currentlabel = 1;
			$('.chart .num').text(currentlabel);
			$('.chart .timescale').text('months');
			break;
		default:
			break;
		}
		// update slider value
		$('input#slider-1').val(hundredScale(currentlabel, divisions).max);
		// refresh slider display and chart
		$('input#slider-1').slider('refresh');
	});

	// small charts for list view
	var staticoptions = {
		'lineWidth': 15,
		'size': 110,
		'scaleColor': false,
		'animate': false,
		'lineCap': 'butt',
		'barColor': donutColor,
		'trackColor': '#C9C9C9'
    }

    var $container = $('.portfolioContainer');
    $container.isotope({
        filter: '*',
        animationOptions: {
            duration: 750,
            easing: 'linear',
            queue: false
        }
    });

    $('.portfolioFilter button').click(function(){
        $('.portfolioFilter .active').removeClass('active');
        $(this).addClass('active');

        var selector = $(this).attr('data-filter');
        $container.isotope({
            filter: selector,
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false
            }
         });
         return false;
    });

	// activate add new button
	$('#addnewbutton').off('click');
	$('#addnewbutton').click(function () {
		showAddNew();
	});

	getAll();
	// $.mobile.loadPage('#editview', {reloadPage: true});

});


function filterTimers(cname)
{

	$.ajax({
		url: "ajax/getall/",
		method: "GET",
		dataType: "json",
		success: function(data)
		{
			//console.log(data);
			$('#pantryList').isotope('destroy');
			$('#pantryList').html("");
			$('#pantryList').isotope({
				filter: '*',
				animationOptions: {
					duration: 750,
					easing: 'linear',
					queue: false
				},
				getSortData: {
					remaining: function($el){
						var remaining = parseInt($el.find('.num').text());
						var scale = $el.find('.staticchart').data('timescale');
						if (scale == 'year'){
							remaining = remaining * 30;
						}
						return remaining;
					}

				},
				sortBy: 'remaining'
			});

			$.each(data,function(i,value) {
				if (value.remaining == 0){
					var timeunits = 'tap to reset'
				} else {
					if (value.timescale == 'year') {
						var timeunits = 'months';
					} else {
						var timeunits = 'days';
					}
				}

				var classes = "isotope-item";
				if (value.remaining == 0)
					classes +=" expired";
				else
					classes+=" activeTimer";
				if(value.timescale != "year")
				{

					if(value.remaining <= 7 && value.remaining != 0)
					classes +=" soon";
					if(value.remaining <30 && value.remaining != 0)
						classes +=" month";
					else if(value.remaining != 0)
						classes +=" later";
				}
				else
				{
					classes +=" later";
				}

				var $newItems = $('<div class="'+classes+'" id="item'+value.id+'" data-timerid="'+value.id+'" style="position: absolute; left: 0px; top: 0px;" ><div class="staticchart" data-percent="'+value.percentage+'"><div class="label"><div class="num">'+value.remaining+'</div><div class="timescale">'+timeunits+'</div></div></div><div class="itemname">'+value.name+'</div></div>');

				$newItems.children('.staticchart').data({'timescale': value.timescale});
				$newItems.click(function (e) {
					if (value.remaining == 0){
						resetItem(value.id);
					} else {
						openItem(value.id);
					}

				})
				$('#pantryList').isotope( 'insert', $newItems );

				if(cname == "all")
				{
					//$(".isotope-item").show();
				}
				else
				{
					$(".isotope-item").hide();
					var x = "."+cname;
					$(x).show();
					$("#pantryList").isotope( 'remove', $(".isotope-item:hidden"), '')
				}

			});


			// small charts for list view
			var staticoptions2 = {
				'lineWidth': 5,
				'size': 110,
				'scaleColor': false,
				'animate': false,
				'lineCap': 'butt',
				'barColor': donutColor,
				'trackColor': '#C9C9C9'
				};
				//$('#pantryList').append($newItems);
			$('.staticchart').easyPieChart(staticoptions2);
		}

	});

	/*
	getAll();
	setTimeout(function() {
		if(cname == "all")
		{
			//$(".isotope-item").show();
		}
		else
		{
			$(".isotope-item").hide();
			var x = "."+cname;
			$(x).show();
			$("#pantryList").isotope( 'remove', $(".isotope-item:hidden"), '')
		}
	},1000);
	//console.log(all);
	*/
}
