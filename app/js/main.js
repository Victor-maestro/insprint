'use strict';
$(function() {

	// Tabs "Process"
	var tab = $('.process__inner .process__tab');
	
	$('.process__variants .process__link').on('click', function(){
		tab.hide();
		tab.filter(this.hash).show(); 
		$('.process__variants .process__link').removeClass('process__link_active');
		$(this).addClass('process__link_active');

		return false;

	}).filter(':first').click();

	// Scroll for anchor link
	$(".menu__link, .top__btn").on("click", function (evt) {
		
		var id  = $(this).attr('href'),
			top = $(id).offset().top;
		$('body,html').animate({scrollTop: top}, 1500);

		evt.preventDefault();
	});

	// Collapse 

	$(".questions__inner").on('show.bs.collapse', function() {
		let btn = $(this).siblings(".questions__header").children(".questions__btn");
		btn.addClass("questions__btn_open");
	})
	.on('hide.bs.collapse', function() {
		let btn = $(this).siblings(".questions__header").children(".questions__btn");
		btn.removeClass("questions__btn_open");
	});


	// Toggle menu
	$(".toggle__menu").click(function() {
		$(this).toggleClass("toggle__menu_open");
		$(".header__wrapper").slideToggle();
      	return false;
	});

});

// Swiper "Masters"
var swiper_specialists = new Swiper('.swiper-masters', {
	speed: 1400,
	centeredSlides: true,
	loop: true,
	touchRatio: 1,
	breakpointsInverse: true,

	navigation: {
		nextEl: '.swiper-button-next',
	},

	autoplay: {
		delay: 5000,
	},
	
	breakpoints: {

		1200: { 
			slidesPerView: 3,
			centeredSlides: true,
			spaceBetween: 30,
		},

		992: { 
			slidesPerView: 2,
			centeredSlides: false,
			spaceBetween: 20,
		},

		320: { 
			slidesPerView: 1,
			centeredSlides: true,
			spaceBetween: 10,
		}, 
	},
});