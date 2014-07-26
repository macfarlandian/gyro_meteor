// JavaScript Document
var donutColor = function(val){
	    // bar color changes
		var yearcolor = "green";
		var monthcolor = "blue";
		var weekcolor = "aqua";
		var fivedaycolor = "yellow";
		var twodaycolor = "red";
		
		switch ($('.chart').data('timescale')) {
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
	
	var hundredScale = function(num, divisions) {
		// scale the label boundaries automatically... with MATH
		var scalefactor = 100 / divisions;
		var currentscaled = num * scalefactor;
		// var max = currentscaled + scalefactor;
		var min = currentscaled - scalefactor;
		return {'min': min, 'max': currentscaled}
	}
	
	var updateLabel = function(val) {
		
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
			var divisions = 100;
			break;
		}
		
		scaled = hundredScale(currentnum, divisions);
		max = scaled.max;
		min = scaled.min;
		var dec = currentnum - 1;
		var inc = currentnum + 1;
		
		if (val < min) { $('.chart .num').text(dec)}
		else if (val > max) {$('.chart .num').text(inc)}
	}
	
	$(document).ready(function() {
		// hide text inputs on sliders
		$('.ui-slider-input').addClass('ui-hidden-accessible');
		$('.ui-slider-track').css('margin-left', function(){
			return $(this).css('margin-right')}
		);
		
		// initialize donut chart
		var chartoptions = {
			'lineWidth': 40,
			'size': 250,
			'scaleColor': false,
			'animate': false,
			'lineCap': 'butt',
			'barColor': donutColor,
			'trackColor': '#C9C9C9'
	    }
		$('.chart').easyPieChart(chartoptions);
		$('.chart').data('timescale', 'week');
		
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
			
		})
		
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
		$('.staticchart').data('timescale', 'week');
		$('.staticchart').easyPieChart(staticoptions);
	});