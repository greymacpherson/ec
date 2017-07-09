// getData
var data,
	i = 2000;
	
function getData() {
	$.ajax({
		url: 'data.json',
		type: 'GET',
		async: false,
		success: function(response) {
			data = response
		},
		error: function(e) {
			retry(i)
			i = i * 2
		}
	});
	return data
}

function retry(i){
	var call = function(){
		getData()
		for(i=0;i<data.hourly.data.length;i++){		
			times = time(data.hourly.data[i].time);
			temp = Math.round(celsius(data.hourly.data[i].temperature)*100)/100;
			var date = new Date().toLocaleDateString('en-ZA');
			icon = data.hourly.data[i].icon
			render(date, times, temp, icon, '.hourly-articles')
		}
	}
	setTimeout(call, i)
}

// format time
function time(s) {
    return new Date(s * 1e3).toISOString().slice(-13, -5);
}

// temperature conversion
function celsius(f) {
    return (5/9) * (f-32);
}
function fahrenheit(c) {
    return (c*9/5) + 32;
}

// infin slider
var currentIndex = 0,
    items = $('.slides'),
    itemAmt = items.length,
	cols;
	
function calcCols(){
	var width = window.innerWidth
		|| document.documentElement.clientWidth
		|| document.body.clientWidth;
	if (width <= 760) {
		cols = 3
	} else if (width >= 760 && width <= 1200) {
		cols = 4
	} else {
		cols = 5
	}
	return cols
}
	
function clearAnim() {
    items.stop(true, true).hide();
}

function slide() {
	for(i=0;i<cols;i++){
		item = $('.slides').eq(currentIndex+i);			
		item.show();
	}
}

function render(date, time, temp, icon, articleClass){
	var article =
		'<article class="weather slides vw3 m_vw1_5 l_vw1 m_col25 l_col20 align-center rel">'+
			'<div class="panel b4 control-box row">'+
				'<ul>'+
					'<li class="row"><span class="roboto-light col38 left">Date: </span><span class="col62 left padding1 roboto-regular ">'+date+'</span></li>'+
					'<li class="row bd1"><span class="roboto-light col38 left">Time: </span><span class="col62 left padding1 roboto-regular ">'+time+'</span></li>'+
					'<li class="row"><span class="roboto-light col38 left">Temp: </span><span class="col62 left padding1 roboto-regular temp-check">'+temp+'</span></li>'+
				'</ul>'+
			'</div>'+
		'</article>';
	var element = $(articleClass);
	$(element).append(article)
}

$('.slider-arrow-right').on('click swipe', function () {
	clearAnim();
	currentIndex += 1;
	if (currentIndex > itemAmt - 1) {
		currentIndex = 0;
	}	
	slide();
});

$('.slider-arrow-left').on('click swipe', function () {
	clearAnim();
	currentIndex -= 1; 
	if (currentIndex < 0) {
		currentIndex = itemAmt - 1;
	}
	slide();
});
	
$(document).ready(function(){	
	calcCols()
	getData();
	for(i=0;i<data.hourly.data.length;i++){		
		times = time(data.hourly.data[i].time);
		temp = Math.round(celsius(data.hourly.data[i].temperature)*100)/100	;
		var date = new Date().toLocaleDateString('en-ZA');
		icon = data.hourly.data[i].icon		
		render(date, times, temp, icon, '.hourly-articles')
	}
	
	$(window).on('resize', function(){
		calcCols()
		index = $('.slides')
		index.hide(0)
		var init = index.slice(0,cols)
		init.show();
	});
	
	items = $('.slides'),
    itemAmt = items.length
	
	var init = items.slice(0,cols)
	init.show();
	
	tempCheck = $('.temp-check')
	
	for (j=0;j<itemAmt;j++){
		tempCheckVal = tempCheck[j].textContent;
		if (tempCheckVal > 25) {
			$(tempCheck[j].closest('.panel')).addClass('hot')
		}
		if (tempCheckVal < 15) {
			$(tempCheck[j].closest('.panel')).addClass('cold')
		}
	}
	
	$('.control-si').on('click tap', function(){
		if ($('.control-si').hasClass('c')) {
			for (k=0;k<itemAmt;k++){
				tempCheckVal = tempCheck[k].textContent;				
				swap = Math.round(fahrenheit(tempCheckVal)*100)/100
				$(tempCheck[k]).html(swap)
			};
			$('.control-si').removeClass('c').addClass('f')
			$('.control-si img').attr('src', 'content/img/degrees-fahrenheit.svg')
		} else {
			for (k=0;k<itemAmt;k++){
				tempCheckVal = tempCheck[k].textContent;				
				swap = Math.round(celsius(tempCheckVal)*100)/100
				$(tempCheck[k]).html(swap)
			};
			$('.control-si').removeClass('f').addClass('c')
			$('.control-si img').attr('src', 'content/img/degrees-celcius.svg')
		}
	});
	
	$('.control-refresh').on('click tap', function(){
		getData()
		for(i=0;i<data.hourly.data.length;i++){		
			times = time(data.hourly.data[i].time);
			temp = Math.round(celsius(data.hourly.data[i].temperature)*100)/100;
			var date = new Date().toLocaleDateString('en-ZA');
			icon = data.hourly.data[i].icon
			render(date, times, temp, icon, '.hourly-articles')
		}
	});
	
});

