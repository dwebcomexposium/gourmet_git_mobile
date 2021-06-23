;(function($, window, document, undefined) {
	var $win = $(window);
	var $doc = $(document);
	var sliderTimer;
	var sliderNextTimer;
	var $accordion;
	var $accHeaders;



	// Home slider
	function initHomepageSlider() {
		var $slider = $('.list-articles .la-swiper');
		var $clone = $slider.clone();
		var sliderPaging = '<div class="slider-paging">';

		for (var i = 0; i <= $clone.find('.gla-item').length - 1; i++) {
			sliderPaging += '<a href="#">0' + (i+1) + '</a>';
		}

		sliderPaging += '</div>';

		$slider.after($clone);

		var $slidesContainer = $clone.find('.slider-content');

		$clone
			.append(sliderPaging);
		$slider.remove();

		$clone
			.find('.slider-paging a:first-child')
			.addClass('active');

		$clone
			.find('img')
			.each(function(){
				var $this = $(this);
				var $imgClone = $this.clone().addClass('background');

				$this
					.parent()
					.append($imgClone);
			});

		$slidesContainer.carouFredSel({
			width: '100%',
			items: 1,
			scroll: { 
				fx: 'crossfade',
				duration: 0,
				onAfter: function(data) {
					setActive($slidesContainer);

					$clone
						.find('.slider-paging a')
						.eq($slidesContainer.triggerHandler('currentPosition'))
						.addClass('active')
						.siblings()
						.removeClass('active');
				}
			},
			swipe: true,
			auto: {
				play: true,
				timeoutDuration: 7000
			},
			infinite: true,
			onCreate: function() {
				setActive($slidesContainer);

				$clone
					.parent()
					.parent()
					.addClass('loaded');
			}
		});

		$win.on('resize', function(){
			setActive($slidesContainer);
		});

		$clone.find('.slider-paging a').on('click', function(e){
			e.preventDefault();

			var $this = $(this);

			setActiveOnClick($slidesContainer, true, $this.index());
		});

		$clone.find('.slider-next').on('click', function(e){
			e.preventDefault();

			setActiveOnClick($slidesContainer);
		});
		
		
	}

	// Set active slide
		function setActive($slidesContainer) {
			$slidesContainer
				.find('.gla-item:first-child')
				.addClass('active')
				.siblings()
				.removeClass('active');

			clearTimeout(sliderTimer);

			sliderTimer = setTimeout(function() {
				$slidesContainer
					.find('.active')
					.addClass('fadeout')
					.siblings()
					.removeClass('fadeout');
			}, 6500);
		}

		function setActiveOnClick($slidesContainer, slideTo, indx) {
			if (!$slidesContainer.find('.active.fadeout').length) {
				$slidesContainer.trigger('pause', true);

				$slidesContainer
					.find('.active')
					.addClass('fadeout')
					.siblings()
					.removeClass('fadeout');

				clearTimeout(sliderNextTimer);

				sliderNextTimer = setTimeout(function() {
					if (slideTo) {
						$slidesContainer.trigger('slideTo', indx);
					} else {
						$slidesContainer.trigger('next');
					}
					
					$slidesContainer.trigger('play', true);
				}, 500);
			}
		}

	function startAccordionSlider() {
		$accordion = $('.accordion');
		$accHeaders = $('.accordion-head');

		$accordion
			.wrapInner('<div class="accordion-slider" />')
			.prepend('<div class="accordion-paging" />')
			.find('.accordion-paging')
				.prepend($accHeaders);

		$win.on('load', function(){
			var $accSlider = $('.accordion-slider');
			var indx;

			$accSlider.carouFredSel({
				width: '100%',
				circular: true,
				infinite: true,
				responsive: true,
				swipe: true,						
				auto: false,
				swipe: {
					onTouch: true
				},
				scroll: {
					duration: 600,
					easing: 'linear',
					fx: 'fade'
				},
				items: {
					visible: 1,
					start: 0
				},
				next: {
					onBefore: function() {
						$accHeaders
							.parent()
							.trigger('next');
					}
				},
				prev: {
					onBefore: function() {
						$accHeaders
							.parent()
							.trigger('prev');
					}
				}
			});

			$accHeaders
				.parent()
				.append($accHeaders.clone());

			$accHeaders
				.parent()
				.carouFredSel({
					auto: false,
			        width: '100%',
			        height: 'variable',
			        align: 'center',
			        scroll: {
			            items: 1
			        },
			        swipe: { 
			            onTouch: true
			        },
			        items: {
			            visible: 3,
			            start: 0
			        },
			        onCreate: function(){
			        	$accHeaders
			        		.parent()
			        		.children()
			        		.eq(1)
			        		.addClass('active');
            		},
			        next: {
			        	onBefore: function() {
			        		$accSlider.trigger('next');

			        		$accHeaders
		            			.parent()
		            			.find('.active')
		            			.next()
		            			.addClass('active')
		            			.siblings()
		            			.removeClass('active');
			        	}
			        },
			        prev: {
			        	onBefore: function() {
			        		$accSlider.trigger('prev');

			        		$accHeaders
		            			.parent()
		            			.find('.active')
		            			.prev()
		            			.addClass('active')
		            			.siblings()
		            			.removeClass('active');
			        	}
			        }
				});
		});
	}

	// Gallery
	function initGallery() {
		var $galleryItems = $('.gallery-items');

		setTimeout(function(){
			$galleryItems.each(function(e){
				var $this = $(this);

				setTimeout(function(){
					$this
						.find('.active')
						.addClass('invisible');
				}, e * 250);

				setTimeout(function(){
					setTimeout(function(e){
						if ($this.find('.active:last-child').length) {
							$this
								.find('img:first-child')
								.addClass('active')
								.siblings()
								.removeClass('active invisible');
						} else {
							$this
								.find('.active')
								.next()
								.addClass('active')
								.siblings()
								.removeClass('active invisible');
						}

						if ($this.is(':last-child')) {
							initGallery();
						}
					}, e * 250);
				}, $galleryItems.length * 250);
			});
		}, 7000);
	}

	// Accordion slider
	function fixActive($accSlider, indx) {
		$accHeaders
			.eq(indx)
			.addClass('active')
			.siblings()
			.removeClass('active');

		$accHeaders
			.parent()
				.css({
					'transform': 'translateX(' + -(indx * 100) + '%)'
				});

		$accSlider.trigger('slideTo', indx);
	}
	
	// Sub menu
	$('.mn-item-has-submenu > .mn-link').on('click', function (){
		var $dd = $(this).siblings();

		if ( $dd.hasClass('is-open') ) {
			$dd.removeClass('is-open');
		} else {
			$('.mn-item-has-submenu .mn-menu-submenu').removeClass('is-open');

			$dd.addClass('is-open');	
		}			
	})

	// // Newsletter 
	// if ($('.newsletter-form').length) {
	// 	var $form = $('.newsletter-form');

	// 	$form
	// 		.detach()
	// 		.appendTo('body');
	// 	$form
	// 		.find('.nf-form-input input')
	// 		.attr('placeholder', 'Votre email');
	// 	$form
	// 		.find('.nf-main-content')
	// 		.append('<a href="#" class="form-close"/>');

	// 	$('[href*="#newsletter"]').on('click', function(e){
	// 		e.preventDefault();

	// 		$form.addClass('form-shown');
	// 	});

	// 	$doc.on('click', function(e){
	// 		var $target = $(e.target);

	// 		if (($target.is('.form-close, .form-close *') || !$target.is('.nf-main-content, .nf-main-content *, [href*="#newsletter"], [href*="#newsletter"] *')) && $form.hasClass('form-shown')) {
	// 			e.preventDefault();

	// 			$form.removeClass('form-shown');
	// 		}

	// 		if (!$target.is('.lang-switcher, .lang-switcher * ')) {
	// 			$('.lang-switcher').removeClass('is-visible');
	// 		}
	// 	});

	// 	if (window.location.href.indexOf('#newsletter') >= 0) {
	// 		$form.addClass('form-shown');
	// 	}
	// }

	$('.ls-trigger').on('click', function(e){
		e.preventDefault();

		$(this)
			.parent()
				.toggleClass('is-visible');
	});

	// Accordion to slider
	if ($('.accordion').length) {
		startAccordionSlider();
	}

	// H4 
	if ($('.article-wrapper h4').length) {
		$('.article-wrapper h4').wrapInner('<span/>');
	}

	$win.on('load', function (){
		if ($('.list-articles .la-swiper').length) {
			initHomepageSlider();
		}

		// Gallery
		if ($('.gallery').length) {
			initGallery();
		}
	});
})(jQuery, window, document);

jQuery(document).ready(function () {
	playVideo();
	checkbox();
	ins();
	quicklinksTomenu();
	numbers();
	imagesSlider();
	newsletterForm();
});

jQuery(document).scroll(function () {
	numbers();
});

function newsletterForm() {
	$('#comexposium_newsletter_email').attr('placeholder','Indiquez votre email ...');
	$('.newsletter-form form .nf-form-item').children().each(function () {
		if($(this).hasClass('nf-form-input')||$(this).hasClass('optin-container')||$(this).hasClass('nf-form-submit')||($(this).attr('for')=='nf1')){
			$(this).addClass('right-child');
		}else{
			$(this).addClass('left-child');
		}
	});
	$(".newsletter-form .left-child").wrapAll('<div class="left-col"></div>');
	$(".newsletter-form .right-child").wrapAll('<div class="right-col"></div>');
	
	$(".newsletter-form .right-col").children().not('.optin-container').wrapAll('<div class="form-field-box"></div>');
	var text = $(".newsletter-form .optin-container .nf-form-input").text();
	$(".newsletter-form .optin-container .nf-form-input input").wrap('<div class="checkbox-input"></div>');
	
	var html = $(".newsletter-form .optin-container .checkbox-input").html();
	$(".newsletter-form .optin-container .nf-form-input").html(html+'<label>'+text+'</label>');
	
	$(".newsletter-form").fadeIn();
}


function imagesSlider() {
	$('.four-cols-img-slider .slider-row .card-slider').carouFredSel({
		// width: '100%',
		// width: '1400px',
		responsive: true,
		height: 'variable',
		items: 1,
		scroll: { 
			fx: 'scroll',
			duration: 600,
		},
		swipe: {
			onTouch: true
		},
		auto: {
			play: true,
			timeoutDuration: 7000
		},
		infinite: true,
	});
}

function numbers() {
	var wTop = jQuery(window).scrollTop(),
		wHeight = jQuery(window).height(),
		wBottom = wTop + wHeight;
	jQuery('.num').each(function(){
		var me = jQuery(this),
			meTop = me.offset().top,
			meHeight = me.innerHeight(),
			meBottom = meTop + meHeight,
			limitTop = wTop - meHeight,
			limitBottom = wBottom + meHeight;
		if(meTop > limitTop && meBottom < limitBottom) {
			var cost = me.attr('data-num');
			me.not('.added').prop('number', 0).stop().animateNumber({
				number: cost
			}, 3500);
			me.addClass('added');
		}
	});
}

function quicklinksTomenu() {
	var links = jQuery('.quicklinks').html();
	jQuery('.mn-menu-line').after('<div class="block block-small quicklinks bt-cta">'+links+'</div>');
}


function ins() {
    if(jQuery('#instafeed').length){
	    var feed = new Instafeed({
	      	accessToken: InstagramToken,
		    limit: 24,
	    	template:'<div class="instagram-list"><div class="bg-box" style="background-image:url({{image}});"><img src="{{image}}"></div></div>',
	        after: function () {    
				jQuery('.feed-box').carouFredSel({
					// width: '100%',
					// width: '1400px',
					responsive: true,
					height: 'auto',
					items: 3,
					scroll: { 
						items: 1,
						fx: 'scroll',
						duration: 600,
					},
					swipe: {
						onTouch: true
					},
					auto: {
						play: true,
						timeoutDuration: 7000
					},
					infinite: true
				});
			},
	    });
	    feed.run();
    }
}

function checkbox() {
	jQuery('.checkbox-field label').click(function () {
		jQuery(this).siblings().trigger('click');
	});
}
function playVideo() {
		jQuery('footer').before('<div class="videos pg-lightbox-wrap pg-yt"><div class="pg-lightbox"><div class="pg-lightbox-inner"><div class="pg-lightbox-content"><div class="pg-lightbox-content-inner"></div><div class="pg-lightbox-close" title="Close"><svg viewBox="0 0 384 512"><path d="M217.5 256l137.2-137.2c4.7-4.7 4.7-12.3 0-17l-8.5-8.5c-4.7-4.7-12.3-4.7-17 0L192 230.5 54.8 93.4c-4.7-4.7-12.3-4.7-17 0l-8.5 8.5c-4.7 4.7-4.7 12.3 0 17L166.5 256 29.4 393.2c-4.7 4.7-4.7 12.3 0 17l8.5 8.5c4.7 4.7 12.3 4.7 17 0L192 281.5l137.2 137.2c4.7 4.7 12.3 4.7 17 0l8.5-8.5c4.7-4.7 4.7-12.3 0-17L217.5 256z"></path></svg></div><div class="pg-lightbox-prev" title="Previous"><svg viewBox="0 0 256 512"><path d="M238.475 475.535l7.071-7.07c4.686-4.686 4.686-12.284 0-16.971L50.053 256 245.546 60.506c4.686-4.686 4.686-12.284 0-16.971l-7.071-7.07c-4.686-4.686-12.284-4.686-16.97 0L10.454 247.515c-4.686 4.686-4.686 12.284 0 16.971l211.051 211.05c4.686 4.686 12.284 4.686 16.97-.001z"></path></svg></div><div class="pg-lightbox-next" title="Next"><svg viewBox="0 0 256 512"><path d="M17.525 36.465l-7.071 7.07c-4.686 4.686-4.686 12.284 0 16.971L205.947 256 10.454 451.494c-4.686 4.686-4.686 12.284 0 16.971l7.071 7.07c4.686 4.686 12.284 4.686 16.97 0l211.051-211.05c4.686-4.686 4.686-12.284 0-16.971L34.495 36.465c-4.686-4.687-12.284-4.687-16.97 0z"></path></svg></div></div><div class="pg-lightbox-info"></div></div></div></div>');
		$('.videos-list').carouFredSel({
			// width: '100%',
			// width: '1400px',
			responsive: true,
			height: 'variable',
			items: 1,
			scroll: { 
				fx: 'scroll',
				duration: 600,
			},
			swipe: {
				onTouch: true
			},
			auto: {
				play: true,
				timeoutDuration: 7000
			},
			infinite: true,
		});
	
	jQuery('.video-item').click(function () {
		jQuery(this).addClass('open');
		jQuery('.pg-lightbox-wrap').fadeIn();
		var data = jQuery(this).find('.data-box').html();
		jQuery('.pg-lightbox-content-inner').html(data);
	});
	jQuery('.pg-lightbox').click(function () {
		jQuery('.video-item').removeClass('open');
		jQuery('.pg-lightbox-wrap').fadeOut();
		jQuery('.pg-lightbox-content-inner').html('');
	});
	jQuery('.pg-lightbox-prev').click(function (event) {
		event.stopPropagation();
		var index = jQuery('.video-item.open').index();
		var len = jQuery('.video-item').length;
		jQuery('.video-item').eq(index).removeClass('open');
		if((index+1)>1){
			jQuery('.video-item').eq(index).prev().addClass('open');
		}else{
			jQuery('.video-item').eq(len-1).addClass('open');
		}
		var data = jQuery('.video-item.open').find('.data-box').html();
		jQuery('.pg-lightbox-content-inner').html(data);
		
	});
	jQuery('.pg-lightbox-next').click(function (event) {
		event.stopPropagation();
		var index = jQuery('.video-item.open').index();
		var len = jQuery('.video-item').length;
		jQuery('.video-item').eq(index).removeClass('open');
		if((index+1)<len){
			jQuery('.video-item').eq(index).next().addClass('open');
		}else{
			jQuery('.video-item').eq(0).addClass('open');
		}
		var data = jQuery('.video-item.open').find('.data-box').html();
		jQuery('.pg-lightbox-content-inner').html(data);
	});
}
