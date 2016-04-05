function fixMobileMenu() {
    
    var windowWidth = $('body').width(),
    	menuWidth = $('#main-nav').width(),
    	enoughWidth = windowWidth - 700;

    if ($('header').hasClass('menu_opened')) {
    	enoughWidth = enoughWidth - 80;
    }

    var weNeed = 0;
    var i = 0;
    $('#main-nav a').each(function(index, el) {
        var element = $(this);
        weNeed = weNeed + element.width() + 30;
        if (weNeed < enoughWidth) { i++; }
    });


    var tmp = i; i = 1;

    while (i<=9) {
        if ( i <= tmp ) {
            $('#main-nav .clearfix a:nth-child(' + i + ')').fadeIn(0);
            $('#mobile-nav .hidden-menu a:nth-child(' + i + ')').fadeOut(0);
        }
        else {
            $('#main-nav .clearfix a:nth-child(' + i + ')').fadeOut(0);
            $('#mobile-nav .hidden-menu a:nth-child(' + i + ')').fadeIn(0);
        }
        i++;
    }

    if ( tmp != 9 ) {
    	$('header').addClass('menu_opened');
    	$('#mobile-nav').fadeIn(0);
    }
    else {
        $('header').removeClass('menu_opened');
        $('#mobile-nav').fadeOut(0);        
    }
}

window.onresize = function(event) {
	fixMobileMenu();
};

$(window).load( function(){
//    $('.grid').masonry({
//      itemSelector: '.grid_item',
//      columnWidth: 250,
//      gutter: 30
//    });

    fixMobileMenu();
});

$(document).ready(function() {

    $('#mobile-nav .show_elements_button').on('click', function(event) {
    	event.preventDefault();
    	if ($(this).hasClass('active')) {
	    	$('#mobile-nav .hidden-menu').slideUp(150);
	    	$(this).removeClass('active');
	    	if ( $('#new-test').hasClass('active') || $('#themes').hasClass('active') ) { }
            else { $('.shadow_overlay').fadeOut(150); }
    	}
    	else {
	    	$('#mobile-nav .hidden-menu').slideDown(150);
	    	$(this).addClass('active');
	    	$('.shadow_overlay').fadeIn(150);
    	}
        $('body').toggleClass('inactive');
    });

    $('#events .add_new').on('click', function(event) {
        event.preventDefault();
        $('#new-test').css({opacity:0, visibility: 'visible'}).animate({opacity:1}, 100).addClass('active');
        $('.shadow_overlay').fadeIn(100);
    });

    $('#new-test .grid_item').on('click', function(event) {
        event.preventDefault();
        $(this).toggleClass('active');
    });

    $('.shadow_overlay').on('click', function(event) {
        event.preventDefault();
        $('#mobile-nav .hidden-menu').slideUp(150);
        $('#mobile-nav .show_elements_button').removeClass('active');
        $('.shadow_overlay').fadeOut(150);
        $('#new-test').css('opacity', '1').animate({opacity:0}, 150, function(){
            $('#new-test').css('visibility', 'hidden').removeClass('active');
        });
        $('#themes').css('opacity', '1').animate({opacity:0}, 150, function(){
            $('#themes').css('visibility', 'hidden').removeClass('active');
        });
    });

    $('select').on('change', function(event) {
        if ( ( $('select[name=filter-category]').val() != 'Выставки' ) || ( $('select[name=filter-country]').val() != 'Выбрать страну' ) || ( $('select[name=filter-city]').val() != 'Выбрать город' ) || ( $('select[name=filter-month]').val() != 'Выбрать месяц' ) ) {
            $('button.reset-button').addClass('submitted');
            $('button.submit-button').removeClass('not-submitted');
        }
        else {
            $('button.reset-button').removeClass('submitted');
            $('button.submit-button').addClass('not-submitted');
        }
    });

    fixMobileMenu();
});

$(document).load(function() {
    fixMobileMenu();
});