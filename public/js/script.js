// JavaScript Document
$(window).load(function(){
	//console.log($(window).css('width'));
	
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
	
	$('.isotope-item').click(function() {
		console.log($(this));
	});
	
	$('.portfolioContainer div').click(function() {
		$(this).toggleClass('fullscreen');
		console.log($(this).children().find('div'));
		$(this).children().find('div').toggleClass('hidden');
	
	});
	
	$('.addItem').click(function(){
		$(this).css("background-image","url(static/img/bananas.jpg)");
		$('#itemImg').val('static/img/bananas.jpg');
	});
	
	
	
	
});

$(document).ready(function(){
	$('.isotope-item').click(function() {
		console.log($(this));
	});	
});

function initialAdd()
{
	$("#pantry").show();
	$("#initial").hide();
}

function edit()
{
	$("#pantry").hide();
	$("#add").show();	
}

function saveItem()
{
	
	var img = $('#itemImg').val();
	var name = $('#itemName').val();
	var time = $('#itemTime').val();
	
	var timer = '<div class="timer food isotope-item" id="'+name+'" style="position: absolute; left: 0px; top: 0px; background-image:url(\''+img+'\');"></div>';
	console.log(timer);
	
	$("#add").hide();
	$("#pantry").show();
	//$('#pantryList').append(timer);
	var $newItems = $('<div class="timer food isotope-item" id="'+name+'" style="position: absolute; left: 0px; top: 0px; background-image:url(\''+img+'\');" onclick="editItem(this);"></div>');
	$('#pantryList').isotope( 'insert', $newItems );
}

function cancelAdd()
{
	$("#add").hide();
	$("#pantry").show();	
}

function editItem(obj)
{
	console.log(obj);
	$("#pantry").hide();
	$("#add").show();	
}