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

	// Newsletter 
	if ($('.newsletter-form').length) {
		var $form = $('.newsletter-form');

		$form
			.detach()
			.appendTo('body');
		$form
			.find('.nf-form-input input')
			.attr('placeholder', 'Votre email');
		$form
			.find('.nf-main-content')
			.append('<a href="#" class="form-close"/>');

		$('[href*="#newsletter"]').on('click', function(e){
			e.preventDefault();

			$form.addClass('form-shown');
		});

		$doc.on('click', function(e){
			var $target = $(e.target);

			if (($target.is('.form-close, .form-close *') || !$target.is('.nf-main-content, .nf-main-content *, [href*="#newsletter"], [href*="#newsletter"] *')) && $form.hasClass('form-shown')) {
				e.preventDefault();

				$form.removeClass('form-shown');
			}

			if (!$target.is('.lang-switcher, .lang-switcher * ')) {
				$('.lang-switcher').removeClass('is-visible');
			}
		});

		if (window.location.href.indexOf('#newsletter') >= 0) {
			$form.addClass('form-shown');
		}
	}

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
