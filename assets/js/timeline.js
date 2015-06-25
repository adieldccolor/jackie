/*!
 * Jackie Robinson Foundation
 *
 * Copyright (c) jackierobinson.org/
 * Licensed under the Jackie Robinson Foundation
 *
 * Author: Adiel Hercules
 */

var timeline, timer = [], $elems = [], screenSize = {}, router = false, maxItems = 4,
	smallScreen = false, isMobile = false, isPhone = false, 
	home = "home", entries = "entries", mobileEntries = "mobileEntries", view = home,
    lastEntryOpen = "", lastEntryIsOpen = false, chain = {};

function refactorArrows() {
    var $nextArrow = $('.next-slide'),
        $prevArrow = $('.prev-slide');

	if ($('.viewport-visible').last().is($('.internal-stage.active').last()) || view == home) {
		TweenMax.to($nextArrow, 0, {opacity: 0});
        toggleElements($nextArrow, 'hide', 0, 0);
	}
	else {
		TweenMax.to($nextArrow, 0, {opacity: 1});
        toggleElements($nextArrow, 'show', 0, 0);
	}


	if ($('.viewport-visible').first().is($('.internal-stage.active').first()) || view == home) {
		TweenMax.to($prevArrow, 0, {opacity: 0});
        toggleElements($prevArrow, 'hide', 0, 0);
	}
	else {
		TweenMax.to($prevArrow, 0, {opacity: 1});
        toggleElements($prevArrow, 'show', 0, 0);
	}
}



function arrowAnimate(){

	var $arrow = $(".arrow-down,.arrow-up");

    var settings = {};

    chain.s1 = new TimelineMax(settings);
    chain.s2 = new TimelineMax(settings);
    chain.s3 = new TimelineMax(settings);

	chain.s1
		.to($arrow.find(".s1"), 0.4, {opacity: 1})
		.to($arrow.find(".s1"), 0.4, {opacity: 0.5});

	chain.s2
		.to($arrow.find(".s2"), 0.4, {opacity: 1, delay: 0.2})
		.to($arrow.find(".s2"), 0.4, {opacity: 0.3});

	chain.s3
		.to($arrow.find(".s3"), 0.4, {opacity: 1, delay: 0.4})
		.to($arrow.find(".s3"), 0.4, {opacity: 0.1, onComplete: function(){
            setTimeout(function(){
                chain.s1.restart();
                chain.s2.restart();
                chain.s3.restart();
            }, 1000);
        }});


}


function showMoreInfoButton($more){
	//if screen is smaller than 1225px
	if( vw(100) < 1226 )
	{
		TweenMax.to($more, 0.5, {y: -120, right: -31});
	}
	else{
		TweenMax.to($more, 0.5, {y: 0, right: -62});
	}
}


function horizontalOrientation(){
	return ( (screen.height < screen.width ) && ( vw(100) < 768 ) );
}


function resizeBody(){
	TweenMax.to( $('.body'), 0, { minHeight: vh(100) } );
	if( vw(100) > 767 || !horizontalOrientation() ){
		TweenMax.to( $('.body'), 0, { overflow: 'hidden' } );
	}else{
		TweenMax.to( $('.body'), 0, { overflow: '' } );
	}
}


function forceMobileMenu(){
    if( vw(100) < 901 && $('.overviewing').length > 0 )
    {
        $('.nav-container, .menuTop').addClass('forced');
    }
    else
    {
        $('.nav-container, .menuTop').removeClass('forced');
    }
}


var cachedX = 0, cachedY = 0, currX = 0, currY = 0, touchStarted = false;
var getPointerEvent = function(event) {
	return event.originalEvent.targetTouches ? event.originalEvent.targetTouches[0] : event;
};



//function to free memory
function freeMemory(){
	//kill all tweenmax tweens
	TweenMax.killTweensOf("*");

	//kill all timers
	for(var i=0; i<timer.length; i++){
		clearTimeout(timer[i]);
	}
}

timeline = {
	jqueryInit: function()
	{
		//Initialize jquery vars on dom ready

		$elems['preloader'] = $("#canvasloader-container");
		$elems['body'] = $(".body");
		$elems['stagesWrapper'] = $('.stagesWrapper');

        function preloader() {
            //preloader
            var cl = new CanvasLoader('canvasloader-container');
            cl.setColor('#ffffff'); // default is '#000000'
            cl.setDiameter(24); // default is 40
            cl.setDensity(34); // default is 40
            cl.setRange(0.9); // default is 1.3
            cl.setFPS(30); // default is 24
            cl.show(); // Hidden by default
        }
        preloader();



        $.stellar({
            horizontalScrolling: false,
            verticalOffset: 0,
            scrollProperty: 'scroll'
        });

	}, 
	emptyHash: function()
	{
		return (window.location.hash&&window.location.hash=="#"||window.location.hash=="#/"||window.location.hash.length==0);
	},
	init: function(from)
	{
		//Initialize all functionality on window onload
		var _self = this;

		_self.recalculateScreenSize();

        arrowAnimate();

		resizeBody();


		_self.enableRoutes(from);

		if( _self.emptyHash() )
		{
			window.location.hash&&(window.location.hash="");
			router&&router.setRoute('home');
		}


	},
	enableRoutes: function(from)
	{
		var _self = this;

		var routes = {
		'/home': function(){
			// _self.destroy();

			$('body').removeClass('is-page-timeline').addClass('is-home-timeline');

			$('.timeline-wrapper,.toolbars').show();

			_self.showBody();

			killTimer("resize-home");
			timer["resize-home"] = setTimeout(function(){
				timeline.landingSpacer();
			}, 50);

			view = home;

            function refactor() {
                $('.collapse-nav').trigger('click');
                TweenMax.to($('body'), 0.3, {scrollTop: 0});
                $('body').css({overflow: 'auto', backgroundColor: '#000'});
                $('.timeline-wrapper').removeClass('timeline');
                $('.nav-container, .menuTop').removeClass('forced');
                TweenMax.to($(".navigation-arrows > a,.close-button"), 0.3, {opacity: 0, visibility: "hidden"});
                $(".timeline-lightbox *").first().trigger("click");
            }
            refactor();
        },
		'/timeline/:timeline': function(timeline){

			$('body').addClass('is-page-timeline').removeClass('is-home-timeline');

	
				view = entries;
				_self.to(timeline, from);


			}
		};

		router = Router(routes);
		
		router.init();
	},
	to: function(timeline, from)
	{
		var _self = this,
			show = 0;

		switch(timeline)
		{
			case 'jrf-timeline':
			case 'jrf-timeline-':
				show = 1;

				$('input[type="checkbox"][name="jrf"]').prop('checked', true);
				$('input[type="checkbox"][name="jr"], input[type="checkbox"][name="rr"]')
					.prop('checked', false);

				$('.second-room, .timeline-wrapper-mobile').addClass('jrf-filter').removeClass('jr-filter rr-filter');

				break;
			case 'jackie-timeline':
			case 'jr-timeline-':
				show = 2;

				$('input[type="checkbox"][name="jr"]').prop('checked', true);
				$('input[type="checkbox"][name="jrf"], input[type="checkbox"][name="rr"]')
					.prop('checked', false);

				$('.second-room, .timeline-wrapper-mobile').addClass('jr-filter').removeClass('jrf-filter rr-filter');

				break;
			case 'rachel-timeline':
			case 'rr-timeline-':
				show = 3;

				$('input[type="checkbox"][name="rr"]').prop('checked', true);
				$('input[type="checkbox"][name="jrf"], input[type="checkbox"][name="jr"]')
					.prop('checked', false);

				$('.second-room, .timeline-wrapper-mobile').addClass('rr-filter').removeClass('jr-filter jrf-filter');

				break;
			case 'jrf-timeline-jr-timeline-':
			case 'jr-timeline-jrf-timeline-':
				show = 1;
				$('input[type="checkbox"][name="rr"]')
					.prop('checked', false);
				$('input[type="checkbox"][name="jrf"], input[type="checkbox"][name="jr"]')
					.prop('checked', true);

				$('.second-room, .timeline-wrapper-mobile').addClass('jr-filter jrf-filter').removeClass('rr-filter');

				break;
			case 'jrf-timeline-rr-timeline-':
			case 'rr-timeline-jrf-timeline-':
				$('input[type="checkbox"][name="jr"]')
					.prop('checked', false);
				$('input[type="checkbox"][name="jrf"], input[type="checkbox"][name="rr"]')
					.prop('checked', true);

				$('.second-room, .timeline-wrapper-mobile').addClass('rr-filter jrf-filter').removeClass('jr-filter');

				break;

			case 'jr-timeline-rr-timeline-':
			case 'rr-timeline-jr-timeline-':
				show = 2;
				$('input[type="checkbox"][name="jrf"]')
					.prop('checked', false);
				$('input[type="checkbox"][name="jr"], input[type="checkbox"][name="rr"]')
					.prop('checked', true);

				$('.second-room, .timeline-wrapper-mobile').addClass('rr-filter jr-filter').removeClass('jrf-filter');

				break;



			case 'all':
			case 'jrf-timeline-rr-timeline-jr-timeline-':
			case 'jrf-timeline-jr-timeline-rr-timeline-':
			case 'jr-timeline-jrf-timeline-rr-timeline-':
			case 'jr-timeline-rr-timeline-jrf-timeline-':
			case 'rr-timeline-jr-timeline-jrf-timeline-':
			case 'rr-timeline-jrf-timeline-jr-timeline-':
				show = 0;

				$('input[name="jr"], input[name="jrf"], input[name="rr"]')
					.prop('checked', true);

				$('.second-room, .timeline-wrapper-mobile').addClass('jrf-filter jr-filter rr-filter');

				break;
		}


        function refactor() {
            $($elems['preloader']).show().css({visibility: "visible", opacity: 1});
            $(".timeline-lightbox *").first().trigger("click");
        }
        refactor();

        // if is phone redirect to phone view
		if( isPhone || horizontalOrientation() )
		{
			if( view != mobileEntries )
			{
				_self.openMobileTimeline();
			}

			view = mobileEntries;

			$('.collapse-nav').trigger('click');
		}
		else
		{

			if( vw(100) < 768 || $('.menuTop').hasClass('forced') )
			{
				$('.collapse-nav').trigger('click');
			}

			$('.timeline-wrapper,.toolbars').show();
			_self.recalculateScreenSize();
			$('body').css({ overflow: 'hidden', backgroundColor: '#000' });;
			_self.openTimeline(show, from);

		}



	},










	//open mobile timeline mtime
	openMobileTimeline: function(from)
	{
		var _self = this;

        from = from != undefined && typeof from == "object" ? from : {from: view};

        function durationCond(time){
            return (
                from.from == entries ? 0 : time
            );
        }

		// scroll to next stages
		TweenMax.to($('.page-toolbar'), durationCond(0.5), { y: 150 });

		TweenMax.to( [$elems['body']], durationCond(0.3), {opacity: 1,visibility: 'visible', delay: durationCond(0.5)} );
		TweenMax.to( $elems['preloader'], 0, {opacity: 0, x: 0, delay: durationCond(0.5)} );


		$('.arrow-down, .more-info, .next-slide, .prev-slide').css({ opacity: 0 });
		
		TweenMax.to($('.overlay-year, .next-slide, .prev-slide'), durationCond(0.5), { opacity: 0 });
		toggleElements($('.close-button'), 'hide', durationCond(0.5), 0);

		_self.recalculateScreenSize();



		var $timelinewrapper = $('.timeline-wrapper'),
			$title = $('.overlay-title');

		TweenMax.to( $('html,body'), durationCond(0.3), { scrollTop: 0 } );

		TweenMax.to( $title, durationCond(0.5), { marginTop: '-500px', opacity: 0, scale: 0.8, delay: durationCond(0.3)} );

		TweenMax.to([$timelinewrapper, $('.toolbars')], durationCond(0.5), { opacity: 0, onComplete: function(){
			$timelinewrapper.hide();
			$('.toolbars').hide();

			$('body').css({ backgroundColor: '#fff' });

			var $mobilewrapper = $('.timeline-wrapper-mobile'),
				$hiddenmobilewrapper = $('.timeline-wrapper-mobile').not(':visible');

			$mobilewrapper.show();
			TweenMax.to( $hiddenmobilewrapper, 0, { opacity: 0, y: 0 } );

			TweenMax.to( $mobilewrapper, durationCond(0.5), { opacity: 1, y: 0 } );

			$('body').css({ overflow: 'auto' });


		} });



	},










	//open desktop/tablet timeline otime
	openTimeline: function(show, from)
	{
		var _self = this;

        from = from != undefined && typeof from == "object" ? from : {from: view};

        function durationCond(time){
            return (
                from.from == mobileEntries ? 0 : time
            );
        }

		TweenMax.to([$('.timeline-wrapper'), $('.toolbars')], 0, { opacity: 1});
		TweenMax.to($('.overlay-title'), 0, { y: 0, scale: 1 });

		// scroll to next stages
		TweenMax.to($('.page-toolbar'), durationCond(0.3), { y: 150 });

		$('.arrow-down, .more-info, .next-slide, .prev-slide').css({ opacity: 0 });
		
		TweenMax.to($('.overlay-year, .next-slide, .prev-slide'), durationCond(0.3), { opacity: 0 });
		toggleElements($('.close-button'), 'hide', durationCond(0.3), 0);

		$('.internal-stage').removeClass('animationEnd viewport-visible hover expanded hovered active review');

		TweenMax.to($('.internal-stage'), 0, { x: - vw(25), opacity: 0, onComplete: function(){
            $('body').css({ backgroundColor: '#000' });

            _self.recalculateScreenSize();

            TweenMax.to($('.internal-stage').not($el), 0, { width: (vw(100) / maxItems) });
            TweenMax.to($('.internal-stage').not($el).find('.internal-wrapper'),
                0, { opacity: 1, width: 'auto' });
            TweenMax.to($('.internal-stage').not($el).find('.internal-room'),
                0, { opacity: 0 });


            if( $('.overviewing').length > 0 )
            {
                var $el = $('.overviewing');


                var $room = $('.second-room');

                //reset
                TweenMax.to($el, 0, { width: (vw(100) / maxItems) });
                TweenMax.to($el, 0, { width: (vw(100) / maxItems) });
                TweenMax.to($room, 0, { marginLeft: - $el.position().left });
                TweenMax.to($el.find('.internal-wrapper'),
                    0, { opacity: 1, width: 'auto' });
                TweenMax.to($el.find('.internal-room'),
                    0, { opacity: 0 });

                $el.removeClass('expanded preview hover');


                $('.overlay-year').removeClass('visible');
            }

            //hide animation
            TweenMax.to($('.page-toolbar'), 0, { y: 0 });

            TweenMax.to($('.internal-stage'), 0, { x: 0 });
            $('.internal-stage').removeClass('viewport-visible hover expanded overviewing preview active');
            $('.second-room').css({ marginLeft: 0 });
            _self.times.open(show, from);
        }});

	},



	times: 
	{
		openLightbox: function($el)
		{
			var info_rel = $el.attr('data-timelightbox'),
				$infobox = $(info_rel),
				info = $infobox.html(),
				$lightbox = $('.timeline-lightbox'),
				$wrapper = $lightbox.find('.wrapper'),
				$inner = $wrapper.find('.inner');

            $inner.html( info ).css({ opacity: 0 });

            if( $infobox.hasClass('more-info-content') ){
                var $script = $('.overviewing .internal-room .stage-wrapper').length > 1
                    ? $('.overviewing .internal-room .stage-wrapper.visible script[data-additional]')
                    : $('.overviewing .internal-room .stage-wrapper script[data-additional]');
                var additionalInfo = $script.html();
               $inner.find('ul').html( additionalInfo );

                console.log(additionalInfo);
            }


			$wrapper.css({ top: 0, paddingBottom: 0, width: '100%', maxWidth: '900px' });

			if( $inner.find('img').length > 0 )
			{
				$elems['preloader'].css({ opacity: 1, zIndex: 9000 });
				$lightbox.addClass('open');
				TweenMax.to($lightbox, 0.1, { opacity: 1 });

				/*imagesLoaded( $inner, function() {
					$inner.find('img').css({ maxHeight: vh(80) });

					if( isMobile )
					{
						$inner.find('img').css({ maxHeight: vh(80) - 85 });
					}

					var innerHeight = $inner.outerHeight(),
						innerWidth = $inner.outerWidth() + 5,
						top = vh(100) < innerHeight ? 20 : ( vh(100) - innerHeight ) / 2;

					top = isMobile ? 85 : top;

					$wrapper.css({ top: top, paddingBottom: 50, width: innerWidth  });
					$elems['preloader'].css({ opacity: 0, zIndex: 0 });
					TweenMax.to($inner, 0.4, { opacity: 1 });

				});*/

				var imgLoad = imagesLoaded($inner);
				imgLoad.on( 'always', function() {
					$inner.find('img').css({ maxHeight: vh(80) });

					if( isMobile )
					{
						$inner.find('img').css({ maxHeight: vh(80) - 85 });
					}

					var innerHeight = $inner.outerHeight(),
						innerWidth = $inner.outerWidth(),
						top = vh(100) < innerHeight ? 20 : ( vh(100) - innerHeight ) / 2;

					top = isMobile ? top + 40 : top;
					//top = isMobile ? 85 : top;

					$wrapper.css({ top: top, paddingBottom: 50, width: innerWidth  });
					$elems['preloader'].css({ opacity: 0, zIndex: 0 });
					TweenMax.to($inner, 0.4, { opacity: 1 });
				});


			}
			else
			{
				var innerHeight = $inner.outerHeight(),
					innerWidth = $inner.outerWidth(),
					top = vh(100) < innerHeight ? 20 : ( vh(100) - innerHeight ) / 2;

				//top = isMobile ? 85 : top;

				$wrapper.css({ top: top, paddingBottom: 50, width: innerWidth  });

				$lightbox.addClass('open');
				TweenMax.to($lightbox, 0.1, { opacity: 1 });
				TweenMax.to($inner, 0.4, { opacity: 1 });
			}

			$('body,html').css({ overflow: 'hidden' });

			if( isMobile )
			{
				$('.menuTop').addClass('sticky');
				$('.timeline-wrapper-mobile').css({ marginTop: 65 });
			}

			toggleElements( $('.close-button'), 'show', 0.5, 0 );


		},



        resizeLightbox: function(){


            var $lightbox = $('.timeline-lightbox'),
                $wrapper = $lightbox.find('.wrapper'),
                $inner = $wrapper.find('.inner'),
                info = $inner.html();

            if( $lightbox.hasClass('open') )
            {


                //$inner.html( info ).css({ opacity: 0 });


                $wrapper.css({ top: 0, paddingBottom: 0, width: '100%', maxWidth: '900px', opacity: 0 });
                //TweenMax.to($wrapper, 0.2, {top: 0, paddingBottom: 0, width: '100%', maxWidth: '900px'});
                TweenMax.to($wrapper, 0, {opacity: 0});

                if( $inner.find('img').length > 0 )
                {
                    $elems['preloader'].css({ opacity: 1, zIndex: 9000 });
                    $lightbox.addClass('open');
                    TweenMax.to($lightbox, 0, { opacity: 1 });


                    //images are loaded so resize
                    var imgLoad = imagesLoaded($inner);
                    imgLoad.on( 'always', function() {
                        $inner.find('img').css({ maxHeight: vh(80) });

                        if( isMobile )
                        {
                            $inner.find('img').css({ maxHeight: vh(80) - 85 });
                        }

                        var innerHeight = $inner.outerHeight(),
                            innerWidth = $inner.outerWidth(),
                            top = vh(100) < innerHeight ? 20 : ( vh(100) - innerHeight ) / 2;

                        top = isMobile ? top + 40 : top;
                        //top = isMobile ? 85 : top;

                        $wrapper.css({ top: top, paddingBottom: 50, width: innerWidth  });
                        $elems['preloader'].css({ opacity: 0, zIndex: 0 });
                        TweenMax.to($inner, 0, { opacity: 1 });

						TweenMax.to($wrapper, 0, {opacity: 1});

                    });



                }
                else
                {
                    var innerHeight = $inner.outerHeight(),
                        innerWidth = $inner.outerWidth(),
                        top = vh(100) < innerHeight ? 20 : ( vh(100) - innerHeight ) / 2;

                    //top = isMobile ? 85 : top;

                    $wrapper.css({ top: top, paddingBottom: 50, width: innerWidth  });

                    $lightbox.addClass('open');
                    TweenMax.to($lightbox, 0, { opacity: 1 });
                    TweenMax.to($inner, 0, { opacity: 1 });
                }

                $('body,html').css({ overflow: 'hidden' });

                if( isMobile )
                {
                    $('.menuTop').addClass('sticky');
                    $('.timeline-wrapper-mobile').css({ marginTop: 65 });
                }

                toggleElements( $('.close-button'), 'show', 0.05, 0 );

				TweenMax.to($wrapper, 0, {opacity: 1});


            }


        },


		fitToExpand: function($el,animated)
		{
			var $wrapp = $el.find('.stage-wrapper');
			$wrapp.css({ height: '100%' });
			$wrapp.find('.container').css({ height: '100%' });

            function durationCond(time){
                return (animated ? time : 0);
            }

			var hasMultipleEvents = $wrapp.length > 1,
				extraSpace = 0;

			//check there are more than one event in time entry
			if(  hasMultipleEvents  )
			{
				$wrapp.first().addClass('visible');

				var $nextWrapp = $wrapp.first().next(),
					$nextEvent = $nextWrapp.find('.date').text(),
					$arrow = $('.arrow-down');

				$arrow.find('.date').text( $nextEvent );
				toggleElements( $arrow, 'show', durationCond(0.5), durationCond(0.5) );
				extraSpace = 80;
			}else{
				toggleElements( $('.arrow-down,.arrow-up'), 'hide', durationCond(0.5), 0 );
			}

			if( vw(100) < 1025 ){
				extraSpace = extraSpace > 40 ? extraSpace - 40 : extraSpace;
			}


			$wrapp.each(function(event, index){
				var wrappHeight = $(this).find('.container').outerHeight(),
				$toolbarHeight = $('.page-toolbar').outerHeight(),
				newTop = (vh(100) - $toolbarHeight) - 100,
				newTop = (newTop - wrappHeight) > 0 ? (newTop - wrappHeight) / 2 : 0,
				newTop = $el.find('.time-title').length > 0 ? $('.overlay-year').position().top + $('.overlay-year').outerHeight() + 20 : newTop + 100;



			var newHeight = 0,
				newHeight = $el.find('.time-title').length > 0
						? ( (vh(100) - ((wrappHeight) )) ) - ($('.overlay-year').outerHeight())
					: ( (vh(100) - (60)) );

                if( wrappHeight > newHeight ){
                    newHeight = ( vh(100) - $('.overlay-year').position().top + $('.overlay-year').outerHeight() + 100 );
                }

				newHeight = newHeight - extraSpace;


				//if( wrappHeight < newHeight && !$el.hasClass('static') )
				if( !$el.hasClass('static') )
				{
					//newTop = newTop + (newHeight - wrappHeight) / 2;
                    newTop = (vh(100) - wrappHeight) / 2;

                    if( newTop < ( $('.overlay-year').position().top + $('.overlay-year').outerHeight() ) ){
                        newTop = $('.overlay-year').position().top + $('.overlay-year').outerHeight();
                    }
				}

                if( newHeight > ( vh(100) - newTop - ( vw(100) < 901 ? 120 : 100) - extraSpace ) ){
                    newHeight = ( vh(100) - newTop - ( vw(100) < 901 ? 120 : 100) - extraSpace );
                }

				$(this).find('.container').css({ top: newTop, height: newHeight, 
					'overflow-y': 'auto', 'overflow-x': 'hidden', position: 'relative' });

				$(this).css({ height: vh(100) });
			});

            $el.css({opacity: 1});
		},
		detectActive: function()
		{
			var $stage = $('.stage');

			if( $('.second-room').hasClass('jrf-filter') )
			{
				$stage.find('.internal-stage[data-filter="jrf"]').addClass('active');
				$stage.find('.internal-stage[data-filter="jrf-jr"]').addClass('active');
				$stage.find('.internal-stage[data-filter="jrf-rr"]').addClass('active');
				$stage.find('.internal-stage[data-filter="jr-jrf"]').addClass('active');
				$stage.find('.internal-stage[data-filter="rr-jrf"]').addClass('active');
				
				$stage.find('.internal-stage[data-filter="rr-jrf-jr"]').addClass('active');
				$stage.find('.internal-stage[data-filter="rr-jr-jrf"]').addClass('active');
				$stage.find('.internal-stage[data-filter="jr-rr-jrf"]').addClass('active');
				$stage.find('.internal-stage[data-filter="jr-jrf-rr"]').addClass('active');
				$stage.find('.internal-stage[data-filter="jrf-jr-rr"]').addClass('active');
				$stage.find('.internal-stage[data-filter="jrf-rr-jr"]').addClass('active');
			}

			if( $('.second-room').hasClass('jr-filter') )
			{
				$stage.find('.internal-stage[data-filter="jr"]').addClass('active');
				$stage.find('.internal-stage[data-filter="jr-jrf"]').addClass('active');
				$stage.find('.internal-stage[data-filter="jr-rr"]').addClass('active');
				$stage.find('.internal-stage[data-filter="rr-jr"]').addClass('active');
				$stage.find('.internal-stage[data-filter="jrf-jr"]').addClass('active');

				$stage.find('.internal-stage[data-filter="rr-jrf-jr"]').addClass('active');
				$stage.find('.internal-stage[data-filter="rr-jr-jrf"]').addClass('active');
				$stage.find('.internal-stage[data-filter="jr-rr-jrf"]').addClass('active');
				$stage.find('.internal-stage[data-filter="jr-jrf-rr"]').addClass('active');
				$stage.find('.internal-stage[data-filter="jrf-jr-rr"]').addClass('active');
				$stage.find('.internal-stage[data-filter="jrf-rr-jr"]').addClass('active');
			}

			if( $('.second-room').hasClass('rr-filter') )
			{
				$stage.find('.internal-stage[data-filter="rr"]').addClass('active');
				$stage.find('.internal-stage[data-filter="rr-jrf"]').addClass('active');
				$stage.find('.internal-stage[data-filter="rr-jr"]').addClass('active');
				$stage.find('.internal-stage[data-filter="jr-rr"]').addClass('active');
				$stage.find('.internal-stage[data-filter="jrf-rr"]').addClass('active');

				$stage.find('.internal-stage[data-filter="rr-jrf-jr"]').addClass('active');
				$stage.find('.internal-stage[data-filter="rr-jr-jrf"]').addClass('active');
				$stage.find('.internal-stage[data-filter="jr-rr-jrf"]').addClass('active');
				$stage.find('.internal-stage[data-filter="jr-jrf-rr"]').addClass('active');
				$stage.find('.internal-stage[data-filter="jrf-jr-rr"]').addClass('active');
				$stage.find('.internal-stage[data-filter="jrf-rr-jr"]').addClass('active');
			}
		},

		//just open chosen timeline
		open: function(show, from, callback)
		{
			var _self = this,
				$toolbar = $('.toolbars'),
				$stage = $('.stage'),
				$roomsWrapper = $stage.find('.roomsWrapper'),
				$rooms = $roomsWrapper.find('.room'),
				$wrapper = $('.stage .roomsWrapper .room .wrapper');


            from = from != undefined && typeof from == "object" ? from : {from: view};

            function durationCond(time){
                return (
                    from.from == mobileEntries ? 0 : time
                );
            }

            _self.detectActive();


            if( $stage.find('.internal-stage.viewport-visible').length > 0 )
            {

            }
            else
            {
                for( i = 0; i < maxItems; i++ )
                {
                    $stage.find('.internal-stage:visible').eq(i).addClass('viewport-visible');
                }
            }


            toggleElements('.overlay-title,.toolbars', 'hide', durationCond(0.5));
            TweenMax.to($wrapper, durationCond(0.3), {opacity: 0});
            TweenMax.to($('.page-toolbar'), 0, { y: 90 } );
            TweenMax.staggerTo($stage, durationCond(0.3), { x: - vw(25), opacity: 0}, durationCond(0.2), function(){

                $('.timeline-wrapper').addClass('timeline');



                TweenMax.to([$roomsWrapper, $wrapper], 0, { width: '100%', delay: 1 } );
                TweenMax.to( [$elems['body']], durationCond(1), {opacity: 1,visibility: 'visible'} );
                TweenMax.to( [$stage, $elems['preloader'], $rooms],
                    durationCond(1), {opacity: 0, x: 0, onComplete: function(){
                        // TweenMax.to( $title, 0, {visibility: 'hidden'});
                        // toggleElements('.overlay-title', 'hide', 0);
                    }} );

                toggleElements('.overlay-title, .home-toolbar', 'hide', 0);
                TweenMax.to($('.home-toolbar'), 0, {display: 'none'});

                toggleElements('.page-toolbar,.toolbars', 'show', durationCond(1));
                TweenMax.to($('.page-toolbar'), durationCond(1), {display: 'block'});

                TweenMax.to($('.internal-stage.viewport-visible'), 0, {x: vw(85), opacity: 0});

                TweenMax.to( [$stage, $rooms], durationCond(1), {opacity: 1, delay: durationCond(1)} );

                //move landing page rooms top up without animation
                $stage.each(function(){
                    var fullWidth = ( ($(this).find('.internal-stage').length) * vw(100) );
                    TweenMax.to($(this).find('.room').eq(0), 0, { marginTop: '-' + vh(100), delay: durationCond(1) });
                    TweenMax.to($(this), 0, {width: fullWidth, delay: durationCond(1)});

                    $(this).find('.internal-wrapper').each(function(){
                        TweenMax.to($(this), 0, {position: 'relative',
                            top: '50%',
                            marginTop: -52, delay: durationCond(1)});

                        TweenMax.to($(this).find('.time-title'), 0, { width: (vw(100) / maxItems) - 40 });

                        if($(this).find('.hidden-data').length>0
                            && $(this).find('.time-title').find('span').length >0)
                        {
                            TweenMax.to( $(this).find('.hidden-data'), 0, {padding: '0 '
                            + ($(this).find('.time-title').find('span').position().left - 20) } );
                        }

                    });
                });

                var $toShow = $stage.find('.internal-stage.viewport-visible');

                function restoreArrows() {
                    var opaqueNext = ( $('.viewport-visible').last().is($('.active').last()) ) ? 0 : 1;
                    TweenMax.to($('.next-slide'), durationCond(0.5), {opacity: opaqueNext});
                    var opaquePrev = ( $('.viewport-visible').first().is($('.active').first()) ) ? 0 : 1;
                    TweenMax.to($('.prev-slide'), durationCond(0.5), {opacity: opaquePrev});

                    refactorArrows();
                }

                if( durationCond(1) == 0 ){
                    restoreArrows();
                }

                //show internal rooms with animation
                TweenMax.staggerTo( $toShow, durationCond(1), {x: 0, opacity: 1, delay: durationCond(1)},
                    0.2, function(){

						if( vw(100) < 1125 && $('.overviewing').length > 0 ){
							TweenMax.to($('.page-toolbar'), durationCond(1), { y: 120 } );
						}else{
							TweenMax.to($('.page-toolbar'), durationCond(1), { y: 0 } );
						}

                        $toShow.addClass('animationEnd');

                        if( durationCond(1) > 0 )
                        {
                            restoreArrows();

                        }

                        if( callback != undefined ){
                            callback();
                        }

                    });

                //complete
            });


		},
		nextSlide: function()
		{
			var $room = $('.second-room'),
				marginLeft = $room.css('margin-left'),
				left = "-=" + vw(25);


			var visible = $('.internal-stage.viewport-visible');
			
			var existsNext = visible.last().nextAll('.active').length > 0;

			if( existsNext && !$('.overviewing').length > 0 )
			{

				//detect if there will exist next after this, so we can hide/show arrows
				if( !(visible.last().nextAll('.active').length > 1) )
				{
					toggleElements($('.next-slide'), 'hide', 0, 0);
				}

				toggleElements($('.prev-slide'), 'show', 0, 0);

				// left = - visible.first().next().position().left;
				left = - visible.first().nextAll('.viewport-visible').first().position().left;

				visible.last().nextAll('.active').first().addClass('viewport-visible');
				TweenMax.to(visible.last().next('.active'), 0, {x: "+=" + vw(25), opacity: 0});
				TweenMax.to($room, 0.5, {marginLeft: left, delay: 0.2, ease:Cubic.easeInOut});
				TweenMax.to(visible.first(), 0.5, {x: "-=" + vw(25), opacity: 0, delay: 0.1, ease:Cubic.easeInOut});
			
				TweenMax.to(visible.last().nextAll('.active').first(), 0.7, {x: 0, opacity: 1, ease:Cubic.easeInOut,
					onComplete: function(){
						visible.last().nextAll('.active').first().addClass('animationEnd');

						left = - visible.first().nextAll('.viewport-visible').first().position().left;
						TweenMax.to($room, 0.5, {marginLeft: left});
					}});
				TweenMax.to(visible.first(), 0, {x: 0});
				visible.first().removeClass('viewport-visible animationEnd');

			}


		}, 
		nextSlideExpanded: function()
		{
			var $room = $('.second-room'),
				marginLeft = $room.css('margin-left'),
				left = 0;

			var visible = $('.internal-stage.viewport-visible'),
				$active = $('.internal-stage.overviewing');
			
			var existsNext = $active.nextAll('.active').length > 0;


			if( existsNext && $('.overviewing').length > 0 )
			{


				var $el = $active,
				relative = 0,
				$viewportVisible = $('.internal-stage.viewport-visible'),
				left = 0,
				right = 0,
				$next = $active.nextAll('.active').length > 1 
					? $active.nextAll('.active').first() : $active.nextAll('.active');
				

				//detect if there will exist next after this, so we can hide/show arrows
				if( !($next.nextAll('.active').length > 0) )
				{
					toggleElements($('.next-slide'), 'hide', 0, 0);
				}

				toggleElements($('.prev-slide'), 'show', 0, 0);


				for( i = 0; i < $viewportVisible.length; i++)
				{
					if( $next.is($viewportVisible.eq(i)) )
					{
						relative = i;
					}
				}


                lastEntryOpen = $next;
                lastEntryIsOpen = true;



				if( $next.find('.time-title').length > 0 )
				{
					if( vh(100) < 500 )
					{
						$('.overlay-year').css({ top: 90 }).find('.year').not('.min').addClass('min');
					}else{
						$('.overlay-year').css({ top: 85 }).find('.year.min').removeClass('min');
					}
				}


				//hide share button if is bio item or screen is small
				if( $next.hasClass('static') || vw(100) < 767 ){
					TweenMax.to( $('.toolbars .share-button'), 0.5, { opacity: 0 } );
				}else{
					TweenMax.to( $('.toolbars .share-button'), 0.5, { opacity: 1 } );
				}

				var $wrapp = $next.find('.stage-wrapper');
					$wrapp.css({ height: '100%' });

				$next.find('.sub-stage').css({ marginTop: 0 });
				TweenMax.to( $wrapp, 0, { y: 0, opacity: 1 } );

				var hasMultipleEvents = $wrapp.length > 1,
					extraSpace = 0;

				TweenMax.to($('.arrow-up'), 0.5, {opacity: 0});

				//check there are more than one event in time entry
				if(  hasMultipleEvents  )
				{
					$wrapp.first().addClass('visible');

					var $nextWrapp = $wrapp.first().next(),
						$nextEvent = $nextWrapp.find('.date').text(),
						$arrow = $('.arrow-down');

					$arrow.find('.date').text( $nextEvent );
					toggleElements( $arrow, 'show', 0.5, 0.5 );
					extraSpace = vw(100) < 650 ? 30 : 80;
				}else{
					TweenMax.to($('.arrow-down,.arrow-up'), 0.5, {opacity: 0, delay: 0.5});
				}

			/* ************************************* */
			//positionate each item
			timeline.times.fitToExpand($next);
			/* ************************************* */


				var hasYearTitle = $next.find('.time-title').length > 0;

				if( hasYearTitle )
				{	
					var year = $next.find('.time-title').first().text(),
						year = parseInt(year),
						$overlayTitle = $('.overlay-year'),
						lastYear = $el.find('.time-title').length > 0 ? $el.find('.time-title').first().text() 
								: ( parseInt($overlayTitle.find('.year').text()) > 1900 
									? parseInt($overlayTitle.find('.year').text()) : 1900  ),
						lastYear = parseInt(lastYear),
						time = {year: lastYear};

						// alert(year);

					$overlayTitle.addClass('visible');

					TweenMax.to(time, 0.5, { year: year, delay: 0, onUpdate: function(){
						$overlayTitle.find('.year').html(parseInt(time.year));
					} });

					TweenMax.to($overlayTitle, 0.5, {opacity: 1, delay: 0});
				}
				else
				{
					var $overlayTitle = $('.overlay-year');

					TweenMax.to($overlayTitle, 0, {delay: 0.5, onComplete: function(){
						$overlayTitle.removeClass('visible');
					}});

					TweenMax.to($overlayTitle, 0.5, {opacity: 0, delay: 0});
				}


				//hide/show more button if next is biography
				if( $next.hasClass('static') )
				{
					toggleElements( $('.more-info'), 'hide', 0.5, 0 );
				}else
				{

                    var $more = $('.more-info');
                    if ($wrapp.first().find('script[data-additional]').length > 0) {

						TweenMax.to($more, 0, {y: 60, right: '-62px'});

                        toggleElements( $more, 'show', 0.3, 0 );

						showMoreInfoButton($more);
                    }
                    else {
                        //TweenMax.to($more, 0, {y: 60, right: '-31px'});
                        toggleElements($more, 'hide', 0.3, 0);
                    }

				}



				var $room = $('.second-room');

				// TweenMax.to($next, 0.5, { x: 0 });
				TweenMax.to($next, 0.05, { x: 0, width: vw(100), zIndex: 50, onComplete: function(){
                    timeline.times.fitToExpand($next);
                } });
				
				//hide current
				TweenMax.to($el.find('.internal-room'), 0.5, {opacity: 0, x: 0});

				//show next
				$next.addClass('hover expanded').css({ opacity: 1 });
				TweenMax.to($next.find('.internal-wrapper'), 0, {opacity: 0});

				TweenMax.to($next.find('.internal-wrapper'), 0, { width: vw(100) / $viewportVisible.length, 
					onComplete: function(){
						toggleElements($next.find('.internal-room'), 'show', 0.5, 0.5);

						$next.addClass('overviewing');
						$el.removeClass('overviewing hover expanded').css({ opacity: 1 });

						if( $next.data('position') == undefined || $next.data('position') == "undefined" 
							|| $next.data('position') == null)
						{
							$next.data('position', $next.position().left);
						}
						

						// console.log($next.data('position'), $next.position().left);

						// TweenMax.to($next, 0.5, { x: 0 });
						// TweenMax.to($room, 0.5, { marginLeft: - $next.position().left });

					
						var newLeft = $el.position().left + $el.outerWidth();  

						// TweenMax.to($room, 0.5, { marginLeft: - $prev.data('position') });
						TweenMax.to($next, 0.5, { x: 0 });
						TweenMax.to($room, 0.5, { marginLeft: - newLeft });


						// TweenMax.to($room, 0.5, { marginLeft: - $next.data('position') });

				}, delay: 0 });

			}


		},
		prevSlide: function()
		{

			var $room = $('.second-room'),
				marginLeft = parseFloat($room.css('margin-left')),
				left = vw(25);

			if( marginLeft < 0 && (marginLeft + left) < 0 )
			{
				left = "+=" + vw(25);
			}
			else
			{
				left = 0;
			}

			var $visibleViewport = $('.internal-stage.viewport-visible');

			TweenMax.to($('.internal-stage').not('.overviewing'), 0, {x: 0});
			
			var existsPrev = $visibleViewport.first().prevAll('.active').length > 0;

			if( existsPrev && !$('.overviewing').length > 0 )
			{
				
				//detect if there will exist next after this, so we can hide/show arrows
				if( !($visibleViewport.first().prevAll('.active').length > 1) )
				{
					toggleElements($('.prev-slide'), 'hide', 0, 0);
				}

				toggleElements($('.next-slide'), 'show', 0, 0);


				// left = - ($('.internal-stage.viewport-visible').first()
					// .position().left - $('.internal-stage.viewport-visible').first().outerWidth());

				left = $('.internal-stage.viewport-visible').first().prevAll('.active').length > 0
							? - $('.internal-stage.viewport-visible').first()
										.prevAll('.active').first().position().left : 0;


				$visibleViewport.first().prevAll('.active').first().addClass('viewport-visible');
				TweenMax.to($visibleViewport.first().prevAll('.active').first(), 0, {x: "-=" + vw(25), opacity: 0});
				TweenMax.to($room, 0.5, {marginLeft: left, delay: 0.2, ease:Cubic.easeInOut});
				TweenMax.to($visibleViewport.last(), 0.5, {x: "+=" + vw(25), opacity: 0, delay: 0.1, 
					ease:Cubic.easeInOut, onComplete: function(){
						$visibleViewport.first().prevAll('.active').first().addClass('animationEnd');
					}});
				


				TweenMax.to($visibleViewport.first().prevAll('.active').first(), 0.7, {x: 0, opacity: 1, ease:Cubic.easeInOut});
				TweenMax.to($visibleViewport.last(), 0, {x: 0, delay: 0.7});
				$visibleViewport.last().removeClass('viewport-visible animationEnd');

			}

		},
		prevSlideExpanded: function()
		{
			var $room = $('.second-room'),
				marginLeft = $room.css('margin-left'),
				left = 0;

			var visible = $('.internal-stage.viewport-visible'),
				$active = $('.internal-stage.overviewing');
			
			var existsPrev = $active.prevAll('.active').length > 0;


			if( existsPrev && $('.overviewing').length > 0 )
			{



				var $el = $active,
				relative = 0,
				$viewportVisible = $('.internal-stage.viewport-visible'),
				left = 0,
				right = 0,
				$prev = $active.prevAll('.active').length > 1 
					? $active.prevAll('.active').first() : $active.prevAll('.active');

				//detect if there will exist next after this, so we can hide/show arrows
				if( !($prev.prevAll('.active').length > 0) )
				{
					toggleElements($('.prev-slide'), 'hide', 0, 0);
				}

				toggleElements($('.next-slide'), 'show', 0, 0);



				for( i = 0; i < $viewportVisible.length; i++)
				{
					if( $prev.is($viewportVisible.eq(i)) )
					{
						relative = i;
					}
				}

				// console.log('relative', relative);

				if( $prev.find('.time-title').length > 0 )
				{
					if( vh(100) < 500 )
					{
						$('.overlay-year').css({ top: 90 }).find('.year').not('.min').addClass('min');
					}else{
						$('.overlay-year').css({ top: 85 }).find('.year.min').removeClass('min');
					}
				}


				//hide share button if is bio item or screen is small
				if( $prev.hasClass('static') || vw(100) < 767 ){
					TweenMax.to( $('.toolbars .share-button'), 0.5, { opacity: 0 } );
				}else{
					TweenMax.to( $('.toolbars .share-button'), 0.5, { opacity: 1 } );
				}


				var $wrapp = $prev.find('.stage-wrapper');
				$wrapp.css({ height: '100%' });

				$prev.find('.sub-stage').css({ marginTop: 0 });
				TweenMax.to( $wrapp, 0, { y: 0, opacity: 1 } );

				var hasMultipleEvents = $wrapp.length > 1,
					extraSpace = 0;


                TweenMax.to($('.arrow-up'), 0.5, {opacity: 0});

				//check there are more than one event in time entry
				if(  hasMultipleEvents  )
				{
					$wrapp.first().addClass('visible');

					var $nextWrapp = $wrapp.first().next(),
						$nextEvent = $nextWrapp.find('.date').text(),
						$arrow = $('.arrow-down');

					$arrow.find('.date').text( $nextEvent );
					toggleElements( $arrow, 'show', 0.5, 0 );
					extraSpace = vw(100) < 650 ? 30 : 80;
			}else{
				TweenMax.to($('.arrow-down,.arrow-up'), 0.5, {opacity: 0, delay: 0});
			}

			/* ************************************* */
			//positionate each item
			timeline.times.fitToExpand($prev);
			/* ************************************* */


				var hasYearTitle = $prev.find('.time-title').length > 0;

				if( hasYearTitle )
				{	
					var year = $prev.find('.time-title').first().text(),
						year = parseInt(year),
						$overlayTitle = $('.overlay-year'),
						lastYear = $el.find('.time-title').length > 0 ? $el.find('.time-title').first().text() 
								: ( parseInt($overlayTitle.find('.year').text()) > 1900 
									? parseInt($overlayTitle.find('.year').text()) : 1900  ),
						lastYear = parseInt(lastYear),
						time = {year: lastYear};

						// alert(year);

					$overlayTitle.addClass('visible');

					TweenMax.to(time, 0.5, { year: year, delay: 0, onUpdate: function(){
						$overlayTitle.find('.year').html(parseInt(time.year));
					} });

					TweenMax.to($overlayTitle, 0.5, {opacity: 1, delay: 0});
				}
				else
				{
					var $overlayTitle = $('.overlay-year');

					TweenMax.to($overlayTitle, 0, {delay: 0.5, onComplete: function(){
						$overlayTitle.removeClass('visible');
					}});

					TweenMax.to($overlayTitle, 0.5, {opacity: 0, delay: 0});
				}


				//hide/show more button if next is biography
				if( $prev.hasClass('static') )
				{
					toggleElements( $('.more-info'), 'hide', 0.5, 0 );
				}else
				{
                    var $more = $('.more-info');
                    if ($wrapp.first().find('script[data-additional]').length > 0) {
                        TweenMax.to($more, 0, {y: 60, right: '-62px'});
                        toggleElements( $more, 'show', 0.3, 0 );

						showMoreInfoButton($more);
                    }
                    else {
                        //TweenMax.to($more, 0, {y: 60, right: '-31px'});
                        toggleElements($more, 'hide', 0.3, 0);
                    }
				}
				



				var $room = $('.second-room');

				TweenMax.to($prev, 0.5, { x: 0, width: vw(100), zIndex: 50, delay: 0, onComplete: function(){
                    timeline.times.fitToExpand($prev);
                } });


				//hide current
				TweenMax.to($el.find('.internal-room'), 0.5, {opacity: 0, x: 0, delay: 0.5});

				//show prev
				$prev.addClass('hover expanded').css({ opacity: 1 });
				TweenMax.to($prev.find('.internal-wrapper'), 0, {opacity: 0});

				TweenMax.to($prev.find('.internal-wrapper'), 0, { width: vw(100) / $viewportVisible.length,
					onComplete: function(){
						toggleElements($prev.find('.internal-room'), 'show', 0.5, 0.5);

						$prev.addClass('overviewing');
						$el.removeClass('overviewing hover expanded').css({ opacity: 1 });

                        lastEntryOpen = $prev;
                        lastEntryIsOpen = true;

						// TweenMax.to($room, 0.5, { marginLeft: - $prev.position().left });
						if( $prev.data('position') == undefined || $prev.data('position') == "undefined" 
							|| $prev.data('position') == null)
						{
							$prev.data('position', $prev.position().left);
						}

						// console.log($prev.data('position'), $prev.position().left);

						// var hasLeft = $prev.data('movedAsPrev') == 1;

						// $prev.data('movedAsPrev', 0);

						if( $prev.prevAll('.active').length > 0 )
						{
							TweenMax.to($prev.prevAll('.active').first(), 0, { x: 0 });
						}

						var newLeft = $prev.prevAll('.active').length > 0 
									? $prev.prevAll('.active').first().position().left 
										+ $prev.prevAll('.active').first().outerWidth() 
									: 0;


						// TweenMax.to($room, 0.5, { marginLeft: - $prev.data('position') });
						TweenMax.to($prev, 0.5, { x: 0 });
						TweenMax.to($room, 0.5, { marginLeft: - newLeft });

				}, delay: 0 });





			}


		},

		//expandItem
		expand: function($el, animated)
		{
			var relative = 0,
				animated = animated != undefined ? animated : true,
				$viewportVisible = $('.internal-stage.viewport-visible'),
                i;


            lastEntryOpen = $el;
            lastEntryIsOpen = true;

			for( i = 0; i < $viewportVisible.length; i++)
			{
				if( $el.is($viewportVisible.eq(i)) )
				{
					relative = i;
				}
			}

            function durationCond(time){
                return (animated ? time : 0);
            }



            function restoreArrows() {
                if ($el.is($('.internal-stage.active').last())) {
                    toggleElements($('.next-slide'), 'hide', 0, (animated ? 0.5 : 0));
                }
                else {
                    toggleElements($('.next-slide'), 'show', 0, (animated ? 0.5 : 0));
                }
                if ($el.is($('.internal-stage.active').first())) {
                    toggleElements($('.prev-slide'), 'hide', 0, (animated ? 0.5 : 0));
                }
                else {
                    toggleElements($('.prev-slide'), 'show', 0, (animated ? 0.5 : 0));
                }
            }



            if( $el.find('.time-title').length > 0 )
				{
					if( vh(100) < 500 )
					{
						$('.overlay-year').css({ top: 90 }).find('.year').not('.min').addClass('min');
					}else{
						$('.overlay-year').css({ top: 85 }).find('.year.min').removeClass('min');
					}
				}


			//force mobile menu
			if( vw(100) < 901 )
			{
				//$('.nav-container, .menuTop').addClass('forced');
			}

			var $wrapp = $el.find('.stage-wrapper');
			//$wrapp.css({ height: '100%' });
			//$wrapp.find('.container').css({ height: '100%' });

			//$wrapp.removeClass('visible');

			$el.find('.sub-stage').css({ marginTop: 0 });
			TweenMax.to( $wrapp, 0, { y: 0, opacity: 1 } );


			//show/hide more info button
			var $ptoolbar = $('.page-toolbar'),
				$more = $('.more-info'),
				mdelay =  durationCond(0.5);

			$('.arrow-down,.arrow-up').css({opacity: 0});




            function toggleMoreInfoButtonMobile() {
                if (($wrapp.length > 1 && $wrapp.first().find('script[data-additional]').length > 0)
                    || ($wrapp.length == 1 && $wrapp.first().find('script[data-additional]').length > 0)) {
                    toggleElements($more, 'show', (animated ? 0.5 : 0), (animated ? mdelay : 0));


                    //if (vw(100) > 1024) {



                        TweenMax.to($more, (animated ? 0.5 : 0), {y: -120, delay: (animated ? mdelay : 0), right: -31});
                    //} else {
                    //    TweenMax.to($more, (animated ? 0.5 : 0), {y: 0, delay: (animated ? mdelay : 0), right: -31});
                    //}


                }
                else {
                    TweenMax.to($more, 0, {y: 60, right: '-31px'});
                    toggleElements($more, 'hide', (animated ? 0.5 : 0), mdelay);
                }
            }

            function toggleMoreInfoButton() {
                if (($wrapp.length > 1 && $wrapp.first().find('script[data-additional]').length > 0)
                    || ($wrapp.length == 1 && $wrapp.first().find('script[data-additional]').length > 0)) {
                    toggleElements( $more, 'show', (animated?0.5:0), mdelay );
                    TweenMax.to($more, 0, {y: 60, right: '-62px'});
                    TweenMax.to($more, (animated?0.5:0), {y: 0, delay: (animated?mdelay:0)});
                }
                else {
                    TweenMax.to($more, 0, {y: 60, right: '-31px'});
                    toggleElements($more, 'hide', (animated ? 0.5 : 0), mdelay);
                }
            }




            if( smallScreen )
            {
                mdelay = durationCond(1);

				TweenMax.to( $ptoolbar, (animated?1:0), { y: 120, onComplete: function(){
					$('.page-toolbar').addClass("js-hidden-bar");
					TweenMax.to( $ptoolbar.find('.row'), 0, { width: 0 } );
					TweenMax.to( $ptoolbar.find('.container'), 0, { width: 0, padding: 0 } );
				} } );

				if( !$el.hasClass('static') )
				{
                    toggleMoreInfoButtonMobile();
				}


			}
			else
			{
				TweenMax.to( $ptoolbar, 0, { y: 0 } );
				$('.page-toolbar').removeClass("js-hidden-bar");
				TweenMax.to( $ptoolbar.find('.row'), 0, { width: 'auto' } );
				TweenMax.to( $ptoolbar.find('.container'), 0, { width: 'auto', padding: 'auto' } );

				if( !$el.hasClass('static') )
				{
                    toggleMoreInfoButton();
				}
			}



			//hide share button if is bio item or screen is small
			if( $el.hasClass('static') || vw(100) < 767 ){
				TweenMax.to( $('.toolbars .share-button'), (animated?0.5:0), { opacity: 0 } );
			}else{
				TweenMax.to( $('.toolbars .share-button'), (animated?0.5:0), { opacity: 1 } );
			}


			/* ************************************* */
			//positionate each item
			//timeline.times.fitToExpand($el, animated);
			/* ************************************* */

			var hasYearTitle = $el.find('.time-title').length > 0;

			if( hasYearTitle )
			{	
				var year = $el.find('.time-title').first().text(),
					year = parseInt(year),
					$overlayTitle = $('.overlay-year');
				$overlayTitle.addClass('visible');

				TweenMax.to($overlayTitle, 0, {delay: (animated?0.5:0), onComplete: function(){
					$overlayTitle.find('.year').html(year);
				}});

				TweenMax.to($overlayTitle, (animated?0.5:0), {opacity: 1, delay: (animated?0.5:0)});
			}



            restoreArrows();


			//show close button
			toggleElements($('.close-button'), 'show', (animated?0.5:0) , (animated?0.5:0) );


			$el.addClass('hover expanded overviewing');
			$el.removeClass('animationEnd');

            forceMobileMenu();

			var $room = $('.second-room');

			if( $el.index() == $room.find('.internal-stage.viewport-visible').last().index() 
				&& $el.position().left > vw(40) 
				&& !$room.find('.internal-stage.viewport-visible').hasClass('static') )
			{
				TweenMax.to($room, (animated?0.5:0), { marginLeft: "+=" + (vw(40) - vw(25)), 
					delay: (animated?0.5:0) });
			}



			// TweenMax.to($el, 0.5, { marginLeft: left, marginRight: right, width: vw(100), zIndex: 50 });
			TweenMax.to($el, (animated?0.5:0), { x: 0, width: vw(100), zIndex: 50, delay: (animated?0.5:0) , onComplete: function(){
                timeline.times.fitToExpand($el, animated);
            }});
			TweenMax.to($room, (animated?0.5:0), { marginLeft: "-" + $el.position().left, delay: (animated?0.5:0) });
			TweenMax.to($el.find('.internal-wrapper'), (animated?0.5:0), {opacity: 0});
			TweenMax.to($el.find('.internal-wrapper'), 0, { width: vw(100) / $viewportVisible.length, 
				onComplete: function(){
					toggleElements($el.find('.internal-room'), 'show', (animated?1:0), (animated?0.5:0));

					$el.addClass('overviewing');


			}, delay: (animated?0.5:0) });
		},

		//collapseItem
		collapse: function(animated)
		{
			var isOverviewing = $('.overviewing').length > 0,
				animated = animated != undefined ? animated : true;

            lastEntryIsOpen = false;

			var $el = $('.overviewing'),
				relative = 0,
				$viewportVisible = $('.internal-stage.viewport-visible');

            function durationCond(time){
                return (animated ? time : 0);
            }


			//if exists
			if( isOverviewing )
			{

				var $wrapp = $el.find('.stage-wrapper'),
					marginLeft = 0;

				//hide close button
				toggleElements($('.close-button,.arrow-down,.arrow-up'), 'hide', durationCond(0.5), 0);

				TweenMax.to($('.overlay-year'), durationCond(0.5), {opacity: 0, delay: 0, onComplete: function(){
					$('.overlay-year').removeClass('visible');
				}});

				// reset position for others
				TweenMax.to($('.internal-stage.active').not($el), 0, { width: (vw(100) / maxItems) });

				TweenMax.to( $('.second-room'), 0, { marginLeft: - $el.position().left } );

				if( $el.hasClass('viewport-visible') )
				{
					marginLeft = - $('.viewport-visible').first().position().left;
				}
				else
				{
					//remove visible class
					$('.internal-stage.active').not( $el ).removeClass('viewport-visible');
					//if after this exists more entries to center on
					if( $el.nextAll('.active').length > 2 )
					{
						marginLeft = - $el.position().left;
						$el.addClass('viewport-visible');
						$el.nextAll('.active').first().addClass('viewport-visible animationEnd')
									.css({ opacity: 1 });
						$el.nextAll('.active').first().next().addClass('viewport-visible animationEnd')
									.css({ opacity: 1 });
						$el.nextAll('.active').first().next().next().addClass('viewport-visible animationEnd')
									.css({ opacity: 1 });
					}
					else if( $el.prevAll('.active').length > 2 )
					{

						$el.addClass('viewport-visible');
						$el.prevAll('.active').first().addClass('viewport-visible animationEnd')
									.css({ opacity: 1 });
						$el.prevAll('.active').first().prev().addClass('viewport-visible animationEnd')
									.css({ opacity: 1 });
						$el.prevAll('.active').first().prev().prev().addClass('viewport-visible animationEnd')
									.css({ opacity: 1 });

						marginLeft = - $('.viewport-visible').first().position().left;
					}
					else
					{
						marginLeft = - $el.position().left;
						$el.addClass('viewport-visible');
						$el.nextAll('.active').first().addClass('viewport-visible animationEnd')
									.css({ opacity: 1 });
						$el.nextAll('.active').first().next().addClass('viewport-visible animationEnd')
									.css({ opacity: 1 });
						$el.nextAll('.active').first().next().next().addClass('viewport-visible animationEnd')
									.css({ opacity: 1 });
					}
				}

				$('.nav-container, .menuTop').removeClass('forced');

				//show/hide more info button
				var $ptoolbar = $('.page-toolbar'),
				$more = $('.more-info'),
				mdelay = 0;

				if( smallScreen )
				{
					mdelay = durationCond(0.5);
					TweenMax.to($more, durationCond(0.5), {y: 60});

					TweenMax.to( $ptoolbar, durationCond(0.5), { y: 0, delay: mdelay } );
				}
				else
				{
					TweenMax.to($more, durationCond(0.5), {y: 60, right: '-62px'});

					TweenMax.to( $ptoolbar, 0, { y: 0 } );
				}

				$('.page-toolbar').removeClass("js-hidden-bar");
				TweenMax.to( $ptoolbar.find('.row'), 0, { width: 'auto', delay: mdelay } );
				TweenMax.to( $ptoolbar.find('.container'), 0, { width: 'auto', padding: '0 0', delay: mdelay } );


				//show button
				TweenMax.to( $('.toolbars .share-button'), durationCond(0.5), { opacity: 1 } );


				var $room = $('.second-room');

				//reset
				TweenMax.to($('.internal-stage.active').not( $el ), 0, { width: vw(100) / maxItems });
				TweenMax.to($room, 0, { marginLeft: - $el.position().left });
				TweenMax.to($('.internal-stage.active').not( $el ).find('.internal-wrapper'),
					0, { opacity: 1, width: 'auto' });
				TweenMax.to($('.internal-stage.active').not( $el ).find('.internal-room'),
					0, { opacity: 0 });

				$('.internal-stage.active').not( $el ).removeClass('expanded preview hover');



				TweenMax.to($el, durationCond(0.5), { x: 0, width: (vw(100) / maxItems), delay: durationCond(0.5), onComplete: function(){
					$el.removeClass('expanded hover overviewing preview');
					TweenMax.to($el, 0, { zIndex: 1 });
					$el.addClass('animationEnd');
					$('.internal-stage.active').not( $el ).addClass('animationEnd');
				} });

				TweenMax.to($room, durationCond(0.5), { marginLeft: marginLeft, delay: durationCond(0.5) });
				TweenMax.to($el.find('.internal-wrapper'), durationCond(0.5), {opacity: 1, delay: durationCond(1)});
				TweenMax.to($el.find('.internal-room'), durationCond(0.5), {opacity: 0});
				TweenMax.to($el.find('.internal-wrapper'), 0, { width: 'auto'});

				if ( $('.viewport-visible').last().is( $('.active').last() ) )
				{
					TweenMax.to( $('.next-slide'), durationCond(0.5), { opacity: 0 } );
				}

				if ( $('.viewport-visible').first().is( $('.active').first() ) )
				{
					TweenMax.to( $('.prev-slide'), durationCond(0.5), { opacity: 0 } );
				}


			}

			

		}
	},
	recalculateScreenSize: function()
	{
		var _self = this;

		screenSize = {
			width: $(window).width(),
			height: $(window).height(),
			vwUnit: $(window).width() / 100,
			vhUnit: $(window).height() / 100
		};

		smallScreen = vw(100) < 1126;
		isMobile = vw(100) < 768;
		isPhone = vw(100) < 601;

		maxItems = isPhone ? 1
					: ( isMobile ? 2
						: ( vw(100) < 769 ? 2
							: ( smallScreen ? 3
								: 4 ) ) );


		return [screenSize, maxItems, _self];
	}, 



	//resize landing page
	landingSpacer: function()
	{

		if( vh(100) < 500 )
		{
			$('.overlay-title h1, .overlay-title h3').addClass('min');
		}else{
            $('.overlay-title h1, .overlay-title h3').removeClass('min');
        }

		if( view == home ){
			$('.stage').css({ width: vw(100) / 3 });
		}


		$('.stage .roomsWrapper .room .wrapper').css({height: "auto"});



		var _self = this,
			$title = $('.overlay-title'),
			titleHeight = $title.outerHeight(),
			titleTop = $title.position().top,
			titleTop = titleTop < 60 ? 85 : titleTop,
			$toolbar = $('.toolbars .home-toolbar'),
			//toolbarHeight = $toolbar.outerHeight(),
			toolbarHeight = 100,
			$stage = $('.stage'),
			$roomsWrapper = $stage.find('.roomsWrapper'),
			$rooms = $roomsWrapper.find('.room'),
			$wrapper = $('.stage .roomsWrapper .room .wrapper'),
			wrapperHeight = $wrapper.find('.content-wrapper').first().outerHeight(),
			offsetWrapper = 60,
			wrapperTop = (titleTop + titleHeight + offsetWrapper);

			for( i = 0; i < $wrapper.length; i++ )
			{
				if( $wrapper.eq(i).find('.content-wrapper').outerHeight() > wrapperHeight )
				{
					wrapperHeight = $wrapper.eq(i).find('.content-wrapper').outerHeight();
				}
			}

			var setTitleTop = titleTop,
				neededHeight = ( (titleHeight + wrapperHeight + offsetWrapper + 60) + toolbarHeight ),
				testIfScreenIsSmaller = ( neededHeight > vh(100) );


			// test if screen is smaller than content area in landing page
			if ( testIfScreenIsSmaller && screenSize.width > 1125 )
			{
				// console.log("screen is smaller? ", testIfScreenIsSmaller);
				
				setTitleTop = 0;
				$stage.css({ overflow: 'auto' });
				offsetWrapper = 20;
			}
			else
			{
				setTitleTop = (vh(100) - neededHeight) / 2;
			}


			if( vw(100) < 768 )
			{
				setTitleTop = ( ( $('.roomsWrapper').first().outerHeight() - $title.outerHeight() ) / 2 );
				setTitleTop = setTitleTop < 0 ? 20 : setTitleTop + 65;
			}else{
				if( setTitleTop < 60 ){
					setTitleTop = 60;
				}
			}



			$title.css({ top: setTitleTop });
			titleHeight = $title.outerHeight();
			titleTop = $title.offset().top;
			//titleTop = setTitleTop;




			$wrapper.each(function(){
				var $el = $(this);
				var wrapperHeight = $el.find('.content-wrapper').outerHeight();
				$el.css({ marginTop: 0, top: (titleTop + titleHeight + (offsetWrapper/2)), paddingTop: 0,
					height: vh(100) - (titleTop + titleHeight + offsetWrapper + toolbarHeight + 20),
					overflowY: 'auto', overflowX: 'hidden'
                });
			});

	},



	//resize entries

	resizeEntries: function()
	{

		var _self = this,
			$toolbar = $('.toolbars'),
			overviewing = $('.overviewing').length > 0,
			$stage = $('.stage'),
			$roomsWrapper = $stage.find('.roomsWrapper'),
			$rooms = $roomsWrapper.find('.room'),
			$wrapper = $('.stage .roomsWrapper .room .wrapper');

		$('.internal-stage').removeClass('hover expanded preview');


		_self.times.detectActive();

		//remove class for all on left
		$('.internal-stage.viewport-visible')
			.first().prevAll('.active').removeClass('viewport-visible');

		$('.internal-stage.viewport-visible').not($('.internal-stage.viewport-visible').first())
			.removeClass('viewport-visible');




		for( i = 0; i < (maxItems - 1); i++ )
		{
			$stage.find('.internal-stage.viewport-visible')
				.first().nextAll('.active').eq(i).addClass('viewport-visible');
		}






		toggleElements('.overlay-title,.toolbars', 'hide', 0);
		TweenMax.to($wrapper, 0.5, {opacity: 0});
		TweenMax.to($('.page-toolbar'), 0, { y: 120 } );
		TweenMax.to($stage, 0, { x: - vw(25), opacity: 0});


		TweenMax.to([$roomsWrapper, $wrapper], 0, { width: '100%', delay: 0 } );
		TweenMax.to( [$elems['body']], 0, {opacity: 1,visibility: 'visible'} );
		TweenMax.to( [$stage, $elems['preloader'], $rooms], 0, {opacity: 0, x: 0} );

		toggleElements('.overlay-title, .home-toolbar', 'hide', 0);
		TweenMax.to($('.home-toolbar'), 0, {display: 'none'});

		toggleElements('.page-toolbar,.toolbars', 'show', 0);
		TweenMax.to($('.page-toolbar'), 0, {display: 'block'});

		//TweenMax.to($('.internal-stage.viewport-visible'), 0, {x: vw(85), opacity: 0});

		TweenMax.to( [$stage, $rooms], 0, {opacity: 1} );

		//move landing page rooms top up without animation
		$stage.each(function(){
			var fullWidth = ( ($(this).find('.internal-stage').length) * vw(100) );
			TweenMax.to($(this).find('.room').eq(0), 0, { marginTop: '-' + vh(100) });
			TweenMax.to($(this), 0, {width: fullWidth});

			$(this).find('.internal-wrapper').each(function(){
				TweenMax.to($(this), 0, {position: 'relative',
					top: '50%',
					marginTop: '-52px' });

				TweenMax.to($(this).find('.time-title'), 0, { width: (vw(100) / maxItems) - 40 });

				if($(this).find('.hidden-data').length>0
					&& $(this).find('.time-title').find('span').length >0)
				{
					TweenMax.to( $(this).find('.hidden-data'), 0, {padding: '0 '
					+ ($(this).find('.time-title').find('span').position().left - 20) } );
				}

			});
		});

		var $toShow = $stage.find('.internal-stage.viewport-visible');

		$stage.find('.internal-stage.active').css({width: (vw(100) / maxItems)});


		// alert($toShow.length);


		//show internal rooms with animation
		TweenMax.to( $toShow, 0, {x: 0, opacity: 1, width: (vw(100) / maxItems), onComplete: function(){

			if( vw(100) < 1125 && $('.overviewing').length > 0 ){
				TweenMax.to($('.page-toolbar'), 0, { y: 120 } );
			}else{
				TweenMax.to($('.page-toolbar'), 0, { y: 0 } );
			}

			$toShow.addClass('animationEnd');

			refactorArrows();

			$('.second-room').css({ marginLeft: - $toShow.first().position().left });
		}});

		//complete






				if( overviewing )
				{
					_self.times.expand( $('.overviewing'), false );
				}

	},





	//show body
	showBody: function(animated)
	{
		var _self = this;

        animated = animated != undefined ? animated : true;
        function animationCond(time){
            return animated ? time : 0.001;
        }

		TweenMax.to($('.timeline-wrapper-mobile'), 0, { opacity: 0, onComplete: function(){
			$('.timeline-wrapper-mobile').hide();
		}});

		TweenMax.to([$('.timeline-wrapper'), $('.toolbars')], 0, { opacity: 1});
		TweenMax.to($('.overlay-title'), 0, { y: 0, marginTop: 0, scale: 1 });

		TweenMax.to($('.overlay-year, .next-slide, .prev-slide'), 0, { opacity: 0 });

		TweenMax.to($('.page-toolbar'), animationCond(1), { y: 90 } );

		$elems['stagesWrapper'].css({ width: screenSize.width * 4 });

		//hide share button if is bio item or screen is small
		if( vw(100) < 767 ){
			toggleElements('.toolbars .share-button', 'hide', 0.5);
		}else{
			toggleElements('.toolbars .share-button', 'show', 0.5);
		}


		TweenMax.to(".stage", 0, {opacity:0, x: (screenSize.width - screenSize.width / 5), width: vw(100/3)});

		TweenMax.to($elems['preloader'], animationCond(1), { opacity: 0, visibility: 'hidden', display: 'none' ,
			onComplete: function(){
				// TweenMax.to(".toolbars", 3, {opacity: 1, delay: 0.5});
				toggleElements('.toolbars,.home-toolbar', 'show', animationCond(3), animationCond(0.5));
				toggleElements('.page-toolbar', 'hide', 0);

				TweenMax.to($('.home-toolbar'), animationCond(3), {display: 'block'});
				TweenMax.to($('.page-toolbar'), 0, {display: 'none'});

				toggleElements('.overlay-title', 'show', animationCond(1), animationCond(0.5));

				TweenMax.staggerTo(".stage .roomsWrapper", animationCond(1), {width: '100%', delay: animationCond(0.8)}, animationCond(0.5));

				TweenMax.to(".stage .roomsWrapper .room", 0, {marginTop: 0});
				TweenMax.to(".stage .roomsWrapper .room .wrapper", 0, {width: '100%'});
				TweenMax.staggerTo(".stage .roomsWrapper .room .wrapper", animationCond(1), {width: '100%',
					opacity: 1, delay: animationCond(1.8)}, animationCond(0.5));

				TweenMax.staggerTo(".stage", animationCond(0.5), {width: vw(100/3)}, animationCond(0.5));

			} });
		TweenMax.to($elems['body'], animationCond(0.7), { opacity: 1, visibility: 'visible', display: 'block' ,
			onComplete: function(){
				TweenMax.staggerTo(".stage", animationCond(1), {opacity: 1, x: 0, ease:Circ.easeOut, delay: animationCond(0.5) }, animationCond(0.5));

				refactorArrows();

			} });
	},
	interactions: function()
	{
		var _self = this;


		$('body')



		//accordion

		.on('click', '.accordion-item h4', function(){
			var $el = $(this).closest('.accordion-item');

			$el.toggleClass('expanded')
				// .siblings().removeClass('expanded');
		})


		//open nav
		.on('click', '.expand-nav', function(e){
			e.preventDefault(); e.stopPropagation();

			var $el = $(this), $nav = $('.menu-navigation');

			if( $('.timeline-lightbox').is('.open') )
			{
				$('.close-button').trigger('click');
			}

			$nav.closest('.nav-container').addClass('open');
			TweenMax.to($nav, 0.5, { right: 0 });
		})

		//close nav
		.on('click', '.collapse-nav', function(e){
			e.preventDefault(); e.stopPropagation();

			var $el = $(this), $nav = $('.menu-navigation');

			$nav.closest('.nav-container').removeClass('open');
			TweenMax.to($nav, 0.5, { right: -241 });
		})




		//open lightbox
		.on('click', '[data-timelightbox]', function(e){
			e.preventDefault(); e.stopPropagation();

			var $el = $(this);
			timeline.times.openLightbox($el);
		})


		//when clicking on down arrow, goArrowDown
		.on('click', '.arrow-down', function(){
			var $arrow = $(this),
				$arrowPrev = $('.arrow-up');

			if( $('.overviewing').length > 0
					&& (!$(this).hasClass('moving') || !TweenMax.isTweening( $('.overviewing .sub-stage') ) ) )
			{
				var $el = $('.overviewing'),
					$wrapper = $el.find('.stage-wrapper'),
					hasMultipleEvents = $wrapper.length > 1;

					$arrow.addClass('moving');

                if( hasMultipleEvents )
                {
                    var hasNextWrapper = $el.find('.stage-wrapper.visible').next().length > 0,
                        hasPreviousWrapper = $el.find('.stage-wrapper.visible').prev().length > 0;

                    if( hasNextWrapper )
                    {
                        var $currentEvent = $el.find('.stage-wrapper.visible'),
                            $nextEvent = $currentEvent.next(),
                            $stage = $el.find('.sub-stage'),
                            nextPosition = $nextEvent.position().top;

                        //scroll down
                        TweenMax.to( $stage, 0.5, { marginTop: - nextPosition } );

                        //hide current event
                        // TweenMax.to( $currentEvent.find('.container'), 0.5, { opacity: 0 } );

                        //show next event
                        TweenMax.to( $nextEvent.find('.container'), 0, { opacity: 0 });
                        TweenMax.to( $nextEvent.find('.container'), 0.5, { opacity: 1, delay: 0.5, onComplete: function(){
                            $currentEvent.removeClass('visible');
                            $nextEvent.addClass('visible');

                            $arrow.removeClass('moving');
                        } } );

                        if( $nextEvent.next().length > 0 )
                        {
                            var $inmediatelyNext = $nextEvent.next(),
                                eventDate = $inmediatelyNext.find('.date').text();

                            $arrow.find('.date').text( eventDate );


                        }else{
                            toggleElements($arrow, 'hide', 0.5, 0);

                            var next = $nextEvent,
                                nextHeight = next.outerHeight();
                            TweenMax.to(next, 0, { height: nextHeight });

                            // next.attr('data-current', nextHeight);
                            // next.attr('data-resized', nextHeight + 80);
                        }

                        //end of hasNextWrapper




                        var $inmediatelyPrev = $el.find('.stage-wrapper.visible').first(),
                            eventDate = $inmediatelyPrev.find('.date').text();

                        var $more = $(".more-info");
                        if ($nextEvent.find('script[data-additional]').length > 0) {
                            TweenMax.to($more, 0, {y: 60, right: '-62px'});
                            toggleElements( $more, 'show', 0.3, 0 );
                            //TweenMax.to($more, 0.5, {y: 0});
							showMoreInfoButton($more);
                        }else{
                            TweenMax.to($more, 0.5, {y: 60, opacity: 0});
                        }

                        $arrowPrev.find('.date').text( eventDate );
                        toggleElements($arrowPrev, 'show', 0.5, 0);


					//end of hasPrevWrapper
					}






				}

			}


		})


		//when clicking on down up, goArrowUp
		.on('click', '.arrow-up', function(){
			var $arrow = $(this),
				$arrowNext = $('.arrow-down');

			if( $('.overviewing').length > 0
					&& (!$(this).hasClass('moving') || !TweenMax.isTweening( $('.overviewing .sub-stage') ) ) )
			{
				var $el = $('.overviewing'),
					$wrapper = $el.find('.stage-wrapper'),
					hasMultipleEvents = $wrapper.length > 1;

					$arrow.addClass('moving');

				if( hasMultipleEvents )
				{
					var hasNextWrapper = $el.find('.stage-wrapper.visible').next().length > 0,
						hasPreviousWrapper = $el.find('.stage-wrapper.visible').prev().length > 0;

					if( hasPreviousWrapper )
					{
						var $currentEvent = $el.find('.stage-wrapper.visible'),
							$prevEvent = $currentEvent.prev(),
							$stage = $el.find('.sub-stage'),
							prevPosition = $prevEvent.position().top;

						//scroll down
						TweenMax.to( $stage, 0.5, { marginTop: - prevPosition } );

						//hide current event
						// TweenMax.to( $currentEvent, 0.5, { opacity: 0 } );

						//show next event
						TweenMax.to( $prevEvent.find('.container'), 0, { opacity: 0 });
						TweenMax.to( $prevEvent.find('.container'), 0.5, { opacity: 1, delay: 0.5, onComplete: function(){
							$currentEvent.removeClass('visible');
							$prevEvent.addClass('visible');

							$arrow.removeClass('moving');
						} } );

						if( $prevEvent.prev().length > 0 )
						{
							var $inmediatelyPrev = $prevEvent.prev(),
								eventDate = $inmediatelyPrev.find('.date').text();

								$arrow.find('.date').text( eventDate );


						}else{
							toggleElements($arrow, 'hide', 0.5, 0);

							var prev = $prevEvent,
								prevHeight = prev.outerHeight();
							// TweenMax.to(prev, 0, { height: prevHeight + (isMobile ? 30 : 80) });

							// next.attr('data-current', nextHeight);
							// next.attr('data-resized', nextHeight + 80);
						}

					//end of hasNextWrapper


					var $inmediatelyNext = $el.find('.stage-wrapper.visible').first(),
						eventDate = $inmediatelyNext.find('.date').text();


                        var $more = $(".more-info");
                        if ($prevEvent.find('script[data-additional]').length > 0) {
                            TweenMax.to($more, 0, {y: 60, right: '-62px'});
                            toggleElements( $more, 'show', 0.3, 0 );
                            //TweenMax.to($more, 0.5, {y: 0});
							showMoreInfoButton($more);
                        }else{
                            TweenMax.to($more, 0.5, {y: 60, opacity: 0});
                        }

						$arrowNext.find('.date').text( eventDate );
					toggleElements($arrowNext, 'show', 0.5, 0);


					//end of hasPrevWrapper

					}






				}

			}


		})


		//when clicking on right arrow, go to next slide
		.on('click touchstart', '.next-slide', function(){

			if( view == entries )
			{
				killTimer('slideSides');

				//check if one time entry is full expanded
				if ( $('.overviewing').length > 0 )
				{
					timer['slideSides'] = setTimeout(function(){
						_self.times.nextSlideExpanded();

						var $nextArrow = $('.next-slide .abs-year');
						TweenMax.to($nextArrow, 0.5, { opacity: 0 });
					}, 100);
				}
				else
				{
					timer['slideSides'] = setTimeout(function(){
						_self.times.nextSlide();
					}, 100);
				}

			}

		})

		//when clicking left arrow, go to prev slide
		.on('click touchstart', '.prev-slide', function(){

			if( view == entries )
			{

				killTimer('slideSides');


				//check if one time entry is full expanded
				if ( $('.overviewing').length > 0 )
				{
					timer['slideSides'] = setTimeout(function(){
						_self.times.prevSlideExpanded();
						var $prevArrow = $('.prev-slide .abs-year');
						TweenMax.to($prevArrow, 0.5, { opacity: 0 });
					}, 100);
				}
				else
				{
					timer['slideSides'] = setTimeout(function(){
						_self.times.prevSlide();
					}, 100);
				}

			}

		})





		//show previews when hoverin arrows
		.on('mouseenter', '.next-slide', function(){

			if( $('.overviewing').length > 0 && $('.overviewing').nextAll('.active').length > 0 )
			{
				var $next = $('.overviewing').nextAll('.active').first();

				$next.data('position', $next.position().left);

				// TweenMax.killChildTweensOf($next);
				$next.addClass('preview');
				TweenMax.to( $next, 0, { zIndex: 51 } );
				TweenMax.to( $next, 0.5, { x: -100 } );
				TweenMax.to( $next.find('.internal-wrapper'), 0, { opacity: 0 } );
				TweenMax.to( $next, 0, { opacity: 1 } );

				$next.data('movedAsPrev', 0);
				$next.data('movedAsNext', 1);

				var nextYear = $next.find('.time-title').length > 0 ? $next.find('.time-title').first().text() : "",
					$nextArrow = $('.next-slide .abs-year');

				$nextArrow.find('span').text(nextYear);
				TweenMax.to($nextArrow, 0.5, { opacity: 1 });
			}
		})

		.on('mouseleave', '.next-slide', function(){

			if( $('.overviewing').length > 0 && $('.overviewing').nextAll('.active').length > 0 )
			{
				var $next = $('.overviewing').nextAll('.active').first();

				// TweenMax.killChildTweensOf($next);
				$next.removeClass('preview');
				TweenMax.to( $next, 0.5, { x: 0 } );

				$next.data('movedAsPrev', 0);
				$next.data('movedAsNext', 0);

				var $nextArrow = $('.next-slide .abs-year');

				TweenMax.to($nextArrow, 0.5, { opacity: 0 });
			}
		})


		//show previews when hoverin arrows
		.on('mouseenter', '.prev-slide', function(){

			if( $('.overviewing').length > 0 && $('.overviewing').prevAll('.active').length > 0 )
			{
				var $prev = $('.overviewing').prevAll('.active').first();

				$prev.data('position', $prev.position().left);

				// TweenMax.killChildTweensOf($prev);
				$prev.addClass('preview');
				TweenMax.to( $prev, 0, { zIndex: 51 } );
				TweenMax.to( $prev, 0.5, { x: 100 } );
				TweenMax.to( $prev.find('.internal-wrapper'), 0, { opacity: 0 } );
				TweenMax.to( $prev, 0, { opacity: 1 } );
				$prev.data('movedAsPrev', 1);
				$prev.data('movedAsNext', 0);

				var prevYear = $prev.find('.time-title').length > 0 ? $prev.find('.time-title').first().text() : "",
					$prevArrow = $('.prev-slide .abs-year');

				$prevArrow.find('span').text(prevYear);
				TweenMax.to($prevArrow, 0.5, { opacity: 1 });
			}
		})

		.on('mouseleave', '.prev-slide', function(){

			if( $('.overviewing').length > 0 && $('.overviewing').prevAll('.active').length > 0 )
			{
				var $prev = $('.overviewing').prevAll('.active').first();
				// TweenMax.killChildTweensOf($prev);
				$prev.removeClass('preview');
				TweenMax.to( $prev, 0.5, { x: 0 } );

				$prev.data('movedAsPrev', 0);
				$prev.data('movedAsNext', 0);

				var $prevArrow = $('.prev-slide .abs-year');
				TweenMax.to($prevArrow, 0.5, { opacity: 0 });
			}
		})




		//when click on more button, full expand to see overview of time entry
		.on('click', '.internal-stage.viewport-visible .overview-trigger', function(e){
			e.preventDefault(); e.stopPropagation();

			if( $(this).hasClass("internal-stage") && $(this).hasClass("overviewing") ){
				//return false;
			}

				if( !$(this).hasClass("overviewing") ){
					var $el = $(this).closest('.internal-stage');

					_self.times.expand($el);
				}



		})

		//close button, collapse expanded time entries
		.on('click', '.close-button', function(e){
			e.preventDefault(); e.stopPropagation();
			var $el = $(this);

			var $lightbox = $('.timeline-lightbox');
			if( $lightbox.is('.open') )
			{
				TweenMax.to( $lightbox, 0.1, { opacity: 0, onComplete: function(){
					$lightbox.removeClass('open');

					$('body,html').css({ overflow: 'auto' });

					$('.menuTop').removeClass('sticky');
					$('.timeline-wrapper-mobile').css({ marginTop: 0 });

					if( $('.overviewing').length > 0 )
					{

					}
					else
					{
						toggleElements($el, 'hide', 0.3, 0);
					}

				} } );
				return false;
			}

			_self.times.collapse();
			return false;
		})



		//close lightbox
		.on('click', '.timeline-lightbox *', function(e){

				if( !$(e.target).is('a') ){
					e.preventDefault(); e.stopPropagation();
				}

			var $el = $(this);

			// console.log('overlay');

			var require = !($(e.target).closest('.wrapper').length > 0)
				&& ($(e.target).closest('.timeline-lightbox').length > 0);

			// console.log(require,
			// $(e.target).closest('.content').length > 0, $(e.target).closest('.timeline-lightbox').length > 0);

			if( require )
			{
				// console.log('not content');

				var $lightbox = $('.timeline-lightbox');
				if( $lightbox.is('.open') )
				{
					TweenMax.to( $lightbox, 0.1, { opacity: 0, onComplete: function(){
						$lightbox.removeClass('open');

						$('body,html').css({ overflow: 'auto' });

						if( $('.overviewing').length > 0 )
						{

						}
						else
						{
							toggleElements($('.close-button'), 'hide', 0.3, 0);
						}

					} } );
					return false;
				}
			}

		})



			.on('touchstart mousedown', '.internal-stage.viewport-visible', function(e){


				//detect if it is not expanded
				if( !$(this).hasClass("overviewing") ){

					var pointer = getPointerEvent(e);
					var $el = $(this);

					// caching the current x
					cachedX = currX = pointer.pageX;
					// caching the current y
					cachedY = currY = pointer.pageY;
					// a touch event is detected
					touchStarted = true;

					// detecting if after 300ms the finger is still in the same position
					killTimer('tap');
					timer['tap'] = setTimeout(function (){
						if ((cachedX === currX) && !touchStarted && (cachedY === currY)) {
							// Here you get the Tap event
							//console.log('tap');

							if( !$el.hasClass("overviewing") ){
								timeline.times.expand($el);
							}
						}
					},300);
				}

			}).on('touchend mouseup touchcancel','.internal-stage.viewport-visible', function(){
				if( !$(this).hasClass('overviewing') ){
					touchStarted = false;
				}
			})



		//when mouseenters, do quick expand to show more button
		.on('mouseenter', '.internal-stage.viewport-visible', function(){
			// console.log('enter', $(this));
			var $el = $(this),
				$room = $('.second-room');

				if( !TweenMax.isTweening( $el ) && !$el.hasClass('animationEnd') ){
					// $el.addClass('animationEnd');
				}

			if( !$(this).hasClass('static') && $(this).hasClass('animationEnd')
				&& !$(this).hasClass('overviewing') && $('.overviewing').length == 0 )
			{

				//reset other stages
				if( $('.internal-stage.hover, .internal-stage.expanded').not($(this)).length > 0 )
				{
					var $stages = $('.internal-stage.hover, .internal-stage.expanded');

						$stages.each(function(){
							$_stage = $(this);
							idkill = 'reset-other-internal-stages-' + $_stage.index();
							$stages.removeClass('hover expanded');
							killTimer(idkill);
							killTimer('internal-stage-enter-' + $el.index());
							timer[idkill] = setTimeout(function(){
								TweenMax.to($_stage, 0.5, {width: (vw(100) / maxItems)});
							}, 50);
						});
				}

				var id = 'internal-stage-enter-' + $el.index(),
					$el = $el;
				killTimer(id);
				$el.addClass('expanded');
				timer[id] = setTimeout(function(){
					TweenMax.to($el, 0.5, {width: ((vw(100) / maxItems) + vw(15))});
					timer[id] = setTimeout(function(){
						$el.addClass('hover');
					}, 500);
				}, 50);

					// alert($el.index());
					// alert($room.find('.internal-stage').index());
				if( $el.index() == $room.find('.internal-stage.viewport-visible').last().index()
					&& $el.position().left > vw(40) )
				{
					killTimer('scrollleft');
					timer['scrollleft'] = setTimeout(function(){
						var marginLeft = $room.find('.internal-stage.viewport-visible').first()
									.position().left + (((vw(100) / maxItems) + vw(15)) - (vw(100)/maxItems));
						// TweenMax.to($room, 0.5, { marginLeft: "-=" + (vw(40) - vw(25)) });
						TweenMax.to($room, 0.5, { marginLeft: - marginLeft });
					}, 50);
				}
			}

		})

		//when mouse leave undo quick expand
		.on('mouseleave', '.internal-stage.viewport-visible', function(){
			// console.log('leave', $(this));
			var $room = $('.second-room');

			if( !$(this).hasClass('static') && $(this).hasClass('animationEnd')
			&& !$(this).hasClass('overviewing') && $('.overviewing').length == 0 )
			{
				var id = 'internal-stage-enter-' + $(this).index(),
					$el = $(this);
				killTimer(id);
				timer[id] = setTimeout(function(){
					$el.removeClass('hover');
					timer[id] = setTimeout(function(){
						TweenMax.to($el, 0.5, {width: (vw(100) / maxItems)});
					}, 500);
				}, 50);

				// if( $room.find('.internal-stage.viewport-visible').last().hasClass('hover') )
				// {
					var left = $room.find('.internal-stage.viewport-visible').first().position().left;
					// alert(left);
					// alert(- left);
					killTimer('scrollleft');
					timer['scrollleft'] = setTimeout(function(){
						TweenMax.to($room, 0.5, { marginLeft: - left });
					}, 50);
				// }
			}
		})

		.on('change', 'input[name="jr"], input[name="jrf"], input[name="rr"]', function(e){
			var str = "", inputs = [];

			var isMenu = $(e.target).closest('.home-navigation').length > 0;

			if( isMenu )
			{
				inputs = $(e.target).closest('.home-navigation')
					.find('input[name="jr"], input[name="jrf"], input[name="rr"]');
			}
			else
			{
				inputs = $(e.target).closest('.page-toolbar')
					.find('input[name="jr"], input[name="jrf"], input[name="rr"]');
			}

			for (i = 0; i < inputs.length; i++)
			{
				if( inputs.eq(i).is(':checked') )
				{
					str += inputs.eq(i).attr('name') + '-timeline-';
				}
			}

			if( str.length > 0 )
			{
				if( window.location != '#/timeline/'+str )
				{
					window.location = '#/timeline/'+str;
				}
			}
			else
			{
				if( window.location != '#/home' )
				{
					window.location = '#/home';
				}
			}
		});



		//swipe actions
		$("body").swipe( {
			//Generic swipe handler for all directions
			swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
				// console.log("You swiped " + direction );
				// if( $('#lightbox').length > 0 && $('#lightbox:visible').length > 0 ){

				//reset tap pointer positions to never get executed if I swipe
				cachedY = -1;
				cachedX = -1;

				console.log("swipe", direction, $(event.target));


				var $lightbox = $('.timeline-lightbox');
				if( !$lightbox.is('.open') )
				{

					if( direction == "left"){
						$('.next-slide').trigger('click');
					}

					if( direction == "right"){
						$('.prev-slide').trigger('click');
					}

					if( direction == "up" && $('.arrow-down').is(':visible') ){
						$('.arrow-down').trigger('click');
					}

					if( direction == "down" && $('.arrow-up').is(':visible') ){
						$('.arrow-up').trigger('click');
					}

				}


				// }
			},
			allowPageScroll:"vertical",
			threshold:100
		});







			},
	destroy: function(from)
	{
		var _self = this;

        from = from != undefined && typeof from == "object" ? from : {from: view};

        function durationCond(time){
            return (
                from.from == mobileEntries ? 0 : time
            );
        }

		if( timer['destroy'] != undefined )
		{
			clearTimeout(timer['destroy']);
		}

		timer['destroy'] = setTimeout(function()
		{
			TweenMax.killTweensOf($('*'));

			TweenMax.to($('body'), durationCond(0.5), { backgroundColor: '#000' });

			TweenMax.to(".overlay-title, .toolbars", durationCond(0.5), {opacity: 0, delay: durationCond(0.2)});
			// TweenMax.to($(".toolbars"), 0.5, {y: '+=100'});

			TweenMax.to(".stage .roomsWrapper .room .wrapper, .timeline-wrapper-mobile", 0.5, {width: '100%', 
				opacity: 0, delay: durationCond(0.2), onComplete: function(){
					$('.timeline-wrapper-mobile').hide();
				}});
			TweenMax.to($elems['body'], durationCond(0.5), {opacity: 0});
			TweenMax.to($elems['preloader'], durationCond(1), {opacity: 1, visibility: 'visible', display: 'block',
				onComplete: function(){
					_self.init(from);
					// TweenMax.to($(".toolbars"), 0, {y: 0});
				}});


		}, durationCond(100));
	}
}



//functions for show/hide every element, so we have very controlled everything
var toggleElements = function(el, toggle, time, delay)
{
	toggle = toggle != undefined ? toggle : 'show';
	time = time != undefined ? time : 0;
	delay = delay != undefined ? delay : 0;

	var $el = $(el);

	if( toggle == 'show' )
	{
		TweenMax.to($el, time, { opacity: 1, visibility: 'visible', delay: delay });
	}
	else
	{
		TweenMax.to($el, time, { opacity: 0, visibility: 'hidden', delay: delay });
	}
}



var vw = function(units)
{
	return screenSize.vwUnit * units;
}

var vh = function(units)
{
	return screenSize.vhUnit * units;
}


var killTimer = function(id)
{
	if(timer[id] != undefined)
	{
		clearTimeout(timer[id]);
	}
}


$(function(){ timeline.jqueryInit(); });
$(window).load(function(){ timer['global'] = setTimeout(function(){ timeline.init(); 
	timeline.interactions(); },500); })
		.on('resize', function()
			{


				killTimer('reload');
				timer['reload'] = setTimeout(function(){
                    timeline.recalculateScreenSize();

                    if( $('.timeline-lightbox').hasClass('open') )
                    {
                        timeline.times.resizeLightbox();
                    }

					resizeBody();



					killTimer("resize-home");
					timer["resize-home"] = setTimeout(function(){
						timeline.landingSpacer();
					}, 100);

					forceMobileMenu();


					if( view == home && vw(100) < 767 )
					{
						toggleElements($('.toolbars .share-button'), 'hide', 0.2, 0);
					}else{
						toggleElements($('.toolbars .share-button'), 'show', 0.2, 0);
					}

					if( view == entries )
					{

						if( vw(100) < 601 || horizontalOrientation() )
						{
							$('.timeline-wrapper').hide();
							timeline.openMobileTimeline({from: view});
							view = mobileEntries;
						}
						else
						{
							if( $('.timeline-wrapper').is(':visible') )
							{
								timeline.resizeEntries();
							}
							else{
								//we need to reload page to reset
								// window.location.reload();
								timeline.destroy({from: view});
								timeline.open("", false);
								view = entries;
							}
						}
					}

					if( view == mobileEntries )
					{
						if( vw(100) > 600 && !horizontalOrientation() )
						{
							timeline.destroy({from: view});
							//timeline.openTimeline();

                            /*
                            * If an entry was opened on desktop/tablet version, so reopen it please
                             */
                            var ExpandLastEntry = function(){
                                if(lastEntryOpen != "" && lastEntryIsOpen)
                                {
                                    timeline.times.expand(lastEntryOpen, false);
                                }
                            };

                            timeline.times.open("", {from: view}, ExpandLastEntry);
							view = entries;
						}
						else
						{
							$('.timeline-wrapper').hide();
							// timeline.openMobileTimeline();
							view = mobileEntries;
						}
					}
				}, 100);

			});