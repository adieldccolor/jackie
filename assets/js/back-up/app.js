var base = window.base_font_size || 10,
	screenSize = window.innerWidth,
	lastScreenSize = screenSize,
	initialNavigationHeight = {},
	timer = timer || [],
	owl = owl || null, owlSmall = owl || null, owlHistory = owl || null, ims = [], owlSponsors, owlSponsorsSmall,
		owl_arr = [],
	_images = 'bg',
	app = {
		imagePath: function(url){
			return 'assets/img/'+url+'.jpg';
		}, asyncImages: function(url){
			return $.Deferred (function (task) {
		        var image = new Image();
		        image.onload = function () {task.resolve(image);}
		        image.onerror = function () {task.reject();}
		        image.src=url;
		    }).promise();
		}, createGrid: function(){
			//<div class="grid-item"><img src="img/2014.jpg" class="history-grid-item" data-grid="1" alt=""></div>
			var img = _images.split(" "),
				_self = this,
				l 	= img.length,
				items = "",
				gridWidth = '100%',
				gridHeight = gridWidth * 0.65;

			for(i = 0; i < l; i++){
				items += '<div class="grid-item" style="height: ' + gridHeight + 'px; " data-grid="' + i 
					+ '"></div>';
				(function(i){
					var _img = _self.imagePath(img[i]);
					$.when(app.asyncImages(_img)).done(function (image) {
						_self.addImage(image,i, img[i]);
					});
				})(i);
			}

			$('#history').find('.history-background').prepend(items);
		}, addImage: function(image,i, filter){
			// console.log(image);
			$(image).addClass('history-grid-item');
			var _self = this,
				grids = $('#history').find('.grid-item').not(".loaded").first();
				grids.addClass("loaded").css({ height: 'auto', position: 'absolute' })
						.attr('data-filter', filter).append(image);

				this.resize(i);

				TweenLite.to(image, 0.5, {opacity: 1, visibility: 'visible', ease:Power2.easeInOut});
				TweenLite.to(grids, 0.5, {scale: 1, delay: 0.5, ease:Power2.easeInOut});
		}, resize: function(i,hardReset){
			hardReset = hardReset !=undefined ? hardReset : false;
			var grids = hardReset 
						? $('#history').find('.grid-item').not(".resize").first() 
						: $('#history').find('.grid-item').not(".resize").not('.zoomed').first();
				if(hardReset){ grids.removeClass("zoomed"); }
				grids.addClass("resize");
			var gridWidth = '100%',
				top = 0, left = 0, force = false, cols = 3;

				grids.find('img').css({maxWidth: '400%'});		

				TweenLite.to(grids, 0.5, {top: top, left: left, width: gridWidth, height: gridWidth, 
						ease:Power2.easeInOut});
				$('#history').find('.grid-item').removeClass('resize');
		}, reScale: function(restore){
			var _self = this;

			if( $('.grid-item.zoomed').length > 0 ){
				_self.zoom( $('.grid-item.zoomed').attr('data-zoom') );
			}

			var _time = 500;
			if( timer['rescale']!=undefined ){ clearTimeout(timer['rescale']); }
			timer['rescale'] = setTimeout(function(){
				for(i = 0; i < $('#history').find('.grid-item').length; i++){
					(function(i){
						app.resize(i);
					})(i);
				}
			}, _time);
		}, last: {}, 
		zoom: function(i){
			var grid = $('#history').find('.grid-item'),
				date = i,
				top = 0,
				left = 0,
				width = '300%',
				height = '200%';

				grid.attr('data-zoom', date);

				var clon = $('.grid-item.clone').length > 0 ? $('.grid-item.clone') 
					: grid.clone().appendTo($('.history-background'));
				clon.css({width: width, height: height, visibility: 'hidden', opacity: 0}).addClass('clone');
				var clonWidth = clon.find('img').outerWidth(),
					clonHeight = clon.find('img').height();

			switch (date){
				case '2008-1':
					left = - ( clonWidth / 3 ) + 'px';
					break;
				case '1973':
					left = - ((clonWidth / 3) * 2) + 'px';
					break;
				case '2008-2':
					top = - (clonHeight/2);
					break;
				case '1946':
					top = - (clonHeight/2);
					left = - ( clonWidth / 3 ) + 'px';
					break;
				case '2014':
					top = - (clonHeight/2);
					left = - ((clonWidth / 3) * 2) + 'px';
					break;
			}

			console.log(date, typeof date);
			console.log(top, left);

			grid.css({zIndex: 1}).addClass('zoomed');

			TweenLite.to(grid, 0.5, {top: top, left: left, width: clonWidth, height: clonHeight, 
				ease:Power2.easeInOut});
		}, trigger: function(){
			var _self = this;
			$('body').on('click', '.trigger-zoom', function(){

				var newIndex = $(this).index() + 1;

				if( $(this).hasClass("active") ){
					$('.trigger-zoom').removeClass('active hover');
					$('.grid-item').removeClass('zoomed');
					owlHistory&&owlHistory.goTo(0);
				}else{
					$('.grid-item').removeClass('zoomed');
					$('.trigger-zoom').removeClass('active hover');
					var id = $(this).attr('data-zoom');
					$(this).addClass('active');
					if(timer['close']!=undefined){ clearTimeout(timer['close']); }
					timer['close'] = setTimeout(function(){
						owlHistory&&owlHistory.goTo( newIndex );
					}, 500);
				}


				/*
				**** OLD HISTORY TIMELINE VERSION ****

				if( $(this).parent().hasClass("active") ){
					$('.trigger-zoom').removeClass('active hover');
					$('.grid-item').removeClass('zoomed');
					_self.reScale(true);
				}else{
					$('.grid-item').removeClass('zoomed');
					_self.reScale(true);
					$('.trigger-zoom').removeClass('active hover');
					var id = $(this).parent().attr('data-zoom');
					$(this).parent().addClass('active');
					if(timer['close']!=undefined){ clearTimeout(timer['close']); }
					timer['close'] = setTimeout(function(){
						_self.zoom(id);
					}, 500);
				} */
			}).on('mouseenter', '.trigger-zoom', function(){
				if(timer['mousehover']!=undefined){ clearTimeout(timer['mousehover']); }
				$('.trigger-zoom').removeClass('hover');
				timer['mousehover'] = setTimeout(function(){
					$(this).addClass('hover');
				}, 5000);
			}).on('mouseleave', '.trigger-zoom', function(){
				if(timer['mousehover']!=undefined){ clearTimeout(timer['mousehover']); }
				$('.trigger-zoom').removeClass('hover');
				timer['mousehover'] = setTimeout(function(){
					$(this).addClass('hover');
				}, 500);
			}).on('click', '.hasAction a.icon-share', function(e){
				e.stopPropagation(); e.preventDefault();
				var parent = $(this).closest('.hasAction');
				$('.hasAction').not(parent).removeClass('isOpen');
				parent.toggleClass('isOpen');

				$('.icon-share').not( $(this) ).removeClass('active');
				$(this).toggleClass('active');
			}).on('click', '.search-button, .search-trigger-btn', function(e){
				e.stopPropagation(); e.preventDefault();
				$('.menuTop .search-button, .menuTop .search-trigger-btn,body').toggleClass('search-open');
				$('.menuTop .search-form').toggleClass('search-open');
				// if( !$(this).hasClass('search-open') ){
					// setTimeout(function(){
						// $(this).find('input[type="text"]').trigger('focus');
					// }, 500);
				// }
			}).on('focus', '.search-input', function(){
				if( $(this).val() == $(this).attr('data-value') ){
					$(this).val('');
				}
			}).on('blur', '.search-input', function(){
				if( $(this).val() == "" || $(this).val().length == 0 || $(this).val() == " " ){
					$(this).val( $(this).attr('data-value') );
				}
			}).on('submit', '.search-form form', function(e){
				var input = $(this).find('input[type="text"]');
				if( input.val() == input.attr('data-value') ){
					e.preventDefault(); e.stopPropagation();
				}
			});

			var searchInput = $('.search-input');
			searchInput.attr( 'data-value', searchInput.val() );
		}, close: function(){
			$('#history .grid-item').removeClass('zoomed');
			if( $('#history .grid-item').hasClass('zoomed') ){
				var id = $('#history .grid-item.zoomed').attr('data-filter');
				this.reScale(true,id);
			}
		}, slider: function(){
			owl = $("#owl-demo");
			owl.owlCarousel({
			  // autoPlay: -1, //Set AutoPlay to 3 seconds
			  items : 1,
			  itemsDesktop : [1199,1],
			  itemsDesktopSmall : [979,1],
			  itemsTablet : [768,1],
			  itemsMobile : [480,1],
			  autoHeight : true,
			  afterAction: app.getCurrent
			});
			owl = $('#owl-demo').data('owlCarousel');

			owlSmall = $("#owl-demo-2");
			owlSmall.owlCarousel({
			  // autoPlay: -1, //Set AutoPlay to 3 seconds
			  items : 4,
			  // itemsDesktop : [1199,4],
			  // itemsDesktopSmall : [992,3],
			  // itemsTablet : [768,2],
			  // itemsMobile : [600,1],
			  itemsCustom: [
			  	[0, 1],
			  	[480, 2],
			  	[600, 3],
			  	// [768, 3],
			  	[992, 4]
			  ],
			  afterInit: app.setFirst
			});
			owlSmall = $('#owl-demo-2').data('owlCarousel');

			owlHistory = $("#owl-history");
			owlHistory.owlCarousel({
			  // autoPlay: -1, //Set AutoPlay to 3 seconds
			  items : 1,
			  itemsDesktop : [1199,1],
			  itemsDesktopSmall : [979,1],
			  itemsTablet : [768,1],
			  itemsMobile : [580,1],
			  slideSpeed: 800
			});

			owlHistory = $('#owl-history').data('owlCarousel');











			owlSponsors = $("#owl-sponsor");
			owlSponsors.addClass('hidden-xs');

			owlSponsorsSmall = owlSponsors.clone();
			owlSponsorsSmall.addClass('visible-xs').removeClass('hidden-xs');
			owlSponsors.after(owlSponsorsSmall);

			owlSponsors.owl_twoCarousel({
				items: 7,
				autoWidth: true,
				margin: 21,
				loop: true,
				speed: 800
			});
			owlSponsors = $('#owl-sponsor').data('owl_twoCarousel');

			owlSponsorsSmall.owl_twoCarousel({
				items: 7,
				margin: 10,
				loop: true,
				speed: 800,
				responsive: {
					0: {
						items: 1,
						autoWidth: false,
						loop: true
					}, 480: {
						items: 2,
						autoWidth: false,
						loop: true
					}, 500: {
						items: 3,
						autoWidth: false,
						loop: true
					}
				}
			});
			owlSponsorsSmall = owlSponsorsSmall.data('owl_twoCarousel');





			owl_arr['sponsors_awards'] = $("#awards-sponsors");
			owl_arr['sponsors_awards'].addClass('hidden-xs');

			owl_arr['sponsors_awards_small'] = owl_arr['sponsors_awards'].clone();
			owl_arr['sponsors_awards_small'].addClass('visible-xs').removeClass('hidden-xs');
			owl_arr['sponsors_awards'].after(owl_arr['sponsors_awards_small']);

			owl_arr['sponsors_awards'].owl_twoCarousel({
				items: 7,
				autoWidth: true,
				margin: 21,
				loop: true,
				speed: 800
			});
			owl_arr['sponsors_awards'] = $('#awards-sponsors').data('owl_twoCarousel');

			owl_arr['sponsors_awards_small'].owl_twoCarousel({
				items: 7,
				margin: 10,
				loop: true,
				speed: 800,
				responsive: {
					0: {
						items: 1,
						autoWidth: false,
						loop: true
					}, 480: {
						items: 2,
						autoWidth: false,
						loop: true
					}, 500: {
						items: 3,
						autoWidth: false,
						loop: true
					}
				}
			});
			owl_arr['sponsors_awards_small'] = owl_arr['sponsors_awards_small'].data('owl_twoCarousel');













			$('#owl-demo-2 .owl-item a').on('click', function(e){
				e.stopPropagation(); e.preventDefault();
				var current = $(this).closest('.owl-item').index();
				owl&&owl.goTo(current);
			});

			$(".next-sponsor").on('click', function(e){
				e.preventDefault(); e.stopPropagation();
			    owlSponsors&&owlSponsors.next();
			    owlSponsorsSmall&&owlSponsorsSmall.next();
			    
			    owl_arr['sponsors_awards']&&owl_arr['sponsors_awards'].next();
			    owl_arr['sponsors_awards_small']&&owl_arr['sponsors_awards_small'].next();

			  });
			  $(".prev-sponsor").on('click', function(e){
			  	e.preventDefault(); e.stopPropagation();
			    owlSponsors&&owlSponsors.prev();
			    owlSponsorsSmall&&owlSponsorsSmall.prev();

			    owl_arr['sponsors_awards']&&owl_arr['sponsors_awards'].prev();
			    owl_arr['sponsors_awards_small']&&owl_arr['sponsors_awards_small'].prev();


			  });

			  $(".next").on('click', function(e){
				e.preventDefault(); e.stopPropagation();
			    owl&&owl.next();
			  });
			  $(".prev").on('click', function(e){
			  	e.preventDefault(); e.stopPropagation();
			    owl&&owl.prev();
			  });
		}, setFirst: function(){
			$('#owl-demo-2 .owl-item').eq(0).addClass('active').siblings().removeClass('active');
		}, getCurrent: function(){
			var current = owl.currentItem;
			$('#owl-demo-2 .owl-item').eq(current).addClass('active').siblings().removeClass('active');
			owlSmall&&owlSmall.goTo(current);
		}, sticky:function  () {
			var c = "sticky";
			var _self = this;
			   $(window).on('scroll', function() {

				   if( timer['topmenu'] != undefined ){ clearTimeout(timer['topmenu']); }
					timer['topmenu'] = setTimeout(function(){
						app.DetectPage('scroll');
					}, 10);

		         if ($(window).scrollTop() > 100) {
		             $('.menuTop').addClass(c);	
		         }
		         else {
		             $('.menuTop').removeClass(c);
		         }
		    });
		}, scrollmagic: function(){
			if( $('.history-menu').length > 0 ){
				var controller = new ScrollMagic();
				// ScrollMagic({globalSceneOptions: {triggerHook: .95} });
				// build tween
				var tween = TweenMax.fromTo(".history-menu", 1, {opacity: 0, top: '-20px', 
						position: 'relative'}, 
						{opacity: 1, top: '0px'});

				var Increments = { colleges: 0, collegesBig: 0, programs: 0, scholars: 0, graduations: 0, 
						impacted: 0, scholarsBig: 0, graduationsBig: 0, programsBig: 0, impacted: 0 };

				// var tweencollege = TweenMax.to(Increments, 1, {
				//       colleges: 225, 
				//       onUpdate: function () {
				//           $('.colleges-increment').text(parseInt(Increments.colleges))
				//       },
				//       ease:Circ.easeOut
				//   });

				

				// var tweenPrograms = TweenMax.to(Increments, 1, {
				//       programs: 65, 
				//       onUpdate: function () {
				//           $('.programsIncrement').html('$' + parseInt(Increments.programs) + '&nbsp;M')
				//       },
				//       ease:Circ.easeOut
				//   });
				
				

				// var tweenScholars = TweenMax.to(Increments, 1, {
				//       scholars: 1450, 
				//       onUpdate: function () {
				//           $('.scholarsIncrement').text(thousands(parseInt(Increments.scholars)))
				//       },
				//       ease:Circ.easeOut
				//   });

				// var tweenGraduations = TweenMax.to(Increments, 1, {
				//       graduations: 100, 
				//       onUpdate: function () {
				//           $('.graduationsIncrement').text("~" + parseInt(Increments.graduations) + "%")
				//       },
				//       ease:Circ.easeOut
				//   });


	

				var tweenImpactBigItem = TweenMax.fromTo(".impactBigItem", 1, {opacity: 0.4, scale: 0.8,
								ease: Linear.easeNone}, {opacity: 1, scale: 1});
				
				var tweenScholarsAppear = TweenMax.fromTo(".scholarsAppear", 1, {opacity: 0.4, scale: 0.8,
								ease: Linear.easeNone}, {opacity: 1, scale: 1});
				var tweenProgramsAppear = TweenMax.fromTo(".programsAppear", 1, {opacity: 0.4, scale: 0.8,
								ease: Linear.easeNone}, {opacity: 1, scale: 1});
				var tweenGraduationsAppear = TweenMax.fromTo(".graduationsAppear", 1, {opacity: 0.4, scale: 0.8,
								ease: Linear.easeNone}, {opacity: 1, scale: 1});



				// build scene
				var scene1 = new ScrollScene({triggerElement: ".history-menu", duration: 300, triggerHook: 0.80})
								.setTween(tween)
								.addTo(controller);

				// var scene2 = new ScrollScene({triggerElement: ".colleges-increment", duration: 300, offset: -250})
				// 				.setTween(tweencollege)
				// 				.addTo(controller);

				
				var scene5 = new ScrollScene({triggerElement: ".impactBigItem", duration: 300, offset: -250})
								.setTween(tweenImpactBigItem)
								.addTo(controller);

				// var scene4 = new ScrollScene({triggerElement: ".programsIncrement", duration: 300, offset: -250})
				// 				.setTween(tweenPrograms)
				// 				.addTo(controller);
				
				
				// var scene7 = new ScrollScene({triggerElement: ".scholarsIncrement", duration: 300, offset: -250})
				// 				.setTween(tweenScholars)
				// 				.addTo(controller);
			

				// var scene9 = new ScrollScene({triggerElement: ".graduationsIncrement", duration: 300, offset: -250})
				// 				.setTween(tweenGraduations)
				// 				.addTo(controller);

				
				
				var scene12 = new ScrollScene({triggerElement: ".scholarsAppear", duration: 300, 
									offset: -250})
								.setTween(tweenScholarsAppear)
								.addTo(controller);

				var scene14 = new ScrollScene({triggerElement: ".graduationsAppear", duration: 300, 
									offset: -150})
								.setTween(tweenGraduationsAppear)
								.addTo(controller);

				var scene13 = new ScrollScene({triggerElement: ".programsAppear", duration: 300, 
									offset: -50})
								.setTween(tweenProgramsAppear)
								.addTo(controller);

			}
		}, menuresize: function(){
			var calc = - ( (screenSize * 0.85) - ( 7*16 ) ) +  'px';
			// $('#navbar').css({right: calc }).attr('data-last', calc);
		}, menuactions: function(){

			 

			$('body').on('click', '#navbar ul li a .collapse-icon', function(e){
				if( $('body').hasClass('media-screen-max-769') && $(this).closest('li').find('ul').length > 0 ){
					e.preventDefault(); e.stopPropagation();
					$(this).closest('li').toggleClass('expanded').siblings().removeClass('expanded');
				}
			}).on('click','.open-navbar', function(){
				$('body').addClass('noflow');
			}).on('click','.close-navbar, .overlay', function(){
				$('body').removeClass('noflow');
				$('li.expanded').removeClass('expanded');
			});

		}, DetectWidth: function(){
			$('body').removeClass('media-screen-max-769');
			if(screenSize < 769){
				$('body').addClass('media-screen-max-769');
			}
		}, DetectImageResize: function(resized){

			resized = resized != undefined ? resized : false;

			var timeline = $('#history').length > 0;
			if( timeline ){
				timeline = $('#history');
				
				var imgs = timeline.find('img');
				imgs.css({ marginLeft: 0 });
				
				if( timer['timelineresize'] != undefined ){ clearTimeout(timer['timelineresize']); }
				timer['timelineresize'] = setTimeout(function(){

					imgs.each(function(e){
						var img = $(this),
							item = img.closest('.item'),
							imgWidth = img.outerWidth(true),
							itemWidth = item.outerWidth(true);

						if( imgWidth > itemWidth ){
							var mL = (imgWidth - itemWidth) / 2;
							img.css({ marginLeft: - mL });
						}

					});

				},400);

			}

			var header = $('.header-image').length > 0;
			if( header ){
				header = $('.header-image');
				
				var imgs = header.find('img');
				// imgs.css({ marginLeft: 0 });
				
				if( timer['headerresize'] != undefined ){ clearTimeout(timer['headerresize']); }
				timer['headerresize'] = setTimeout(function(){

					imgs.each(function(e){
						var img = $(this),
							item = img.closest('.header-image'),
							imgWidth = img.outerWidth(),
							itemWidth = item.outerWidth();

						if( imgWidth > itemWidth ){
							var mL = (imgWidth - itemWidth) / 2;
							img.css({ marginLeft: - mL });
							// console.log(mL);
						}else{
							var mL = (itemWidth - imgWidth) / 2;
							img.css({ marginLeft: mL });
						}

					});

				},10);
			}

			var error_page = $('.error-page .img-container').length > 0;
			if( error_page ){
				error_page = $('.error-page .img-container');
				
				var imgs = error_page.find('img');
				// imgs.css({ marginLeft: 0 });
				
				if( timer['errorpageresize'] != undefined ){ clearTimeout(timer['errorpageresize']); }
				timer['errorpageresize'] = setTimeout(function(){

					imgs.each(function(e){
						var img = $(this),
							item = img.closest('.img-container'),
							imgWidth = img.outerWidth(),
							itemWidth = item.outerWidth();

						if( imgWidth > itemWidth ){
							var mL = (imgWidth - itemWidth) / 2;
							img.css({ marginLeft: - mL });
							// console.log(mL);
						}
						else{
							var mL = (itemWidth - imgWidth) / 2;
							// img.css({ marginLeft: mL });
							img.css({ marginLeft: 'auto' });
						}

					});

				},10);
			}

		}, ResetPageMargin: function(){
			var currentWidth = screenSize;

			if( currentWidth > lastScreenSize ){
				var page 		= $('.page-wrapper').length > 0;

				if( page ){
					var pageWrapper = $('.page-wrapper');
					pageWrapper.css({ marginTop: '60px' }).removeClass('animatedMargin');
				}
			}

			// lastScreenSize = currentWidth;

	}, DetectPage: function(resized){

		var _self = this;

			resized = resized != undefined ? resized 
				: (resized == "scroll" ? "scroll" : false);



			var barHeight 		= $('.menuTop').outerHeight() - 1,
				submenu 		= $('.main-menu ul:visible').length > 0,
				submenuHeight 	= submenu ? $('.main-menu ul:visible').outerHeight(true) : 0,
				submenuTop 		= submenu ? $('.main-menu ul:visible').offset().top : 0,
				page 			= $('.page-wrapper').length > 0,
				mobile 			= $(window).width() < 769;

				if(submenu && page){
					// if(mobile){
						// var newHeight = barHeight + submenuHeight;

						if( mobile ){
							newHeight = 60;
						}else{
							newHeight = 0;
						}
						
						if( resized == "scroll" ){ $(window).resize() }


						if( resized ){
							$('.page-wrapper').not('.error-page').addClass('animatedMargin');
						}

						$('.page-wrapper').not('.error-page').css({marginTop: newHeight + 'px'});
					// }else{
					// 	var newHeight = submenuTop + submenuHeight;
					// 	$('.page-wrapper').css({marginTop: newHeight + 'px'});
					// }
				}

				if(page){
					// if(mobile){
						// var newHeight = barHeight + submenuHeight;

						if( mobile ){
							newHeight = 60;
						}else{
							newHeight = 0;
						}

						if( resized == "scroll" ){ $(window).resize() }

						$('.page-wrapper').not('.error-page').css({marginTop: newHeight + 'px'});
					// }else{
					// 	var newHeight = submenuTop + submenuHeight;
					// 	$('.page-wrapper').css({marginTop: newHeight + 'px'});
					// }

					$('.page-wrapper').addClass('visible hasNoSubmenu');

				}

		}, DetectBackgrounds: function(){
			if( $('[data-background]').length > 0 ){
				var items = $('[data-background]');
				// $(items).first().backstretch( $(items).first().attr('data-background')  )
				// 	.addClass('fallback-loaded');
				for(i = 0; i < items.length; i++){
					var img = $(items).eq(i).attr('data-background');
					// if( $.backstretch )
					// console.log($.backstretch);
					items.eq(i).addClass('fallback-loaded')&&items.eq(i).backstretch(img);
				}
			}
		}, LightboxShare: function(){
			$('body').on('click', '.lb-share a[data-lightboxshare]', function(e){
				e.stopPropagation(); e.preventDefault();

				var network = $(this).attr('data-lightboxshare'),
		      		description = image = href = api = desc = url = "";


			      	description = $(this).closest('.lightbox').find('.lb-caption').text();
			        title = $('body').find('.page').find('h3,h4,h2,h1').length > 0 
			        			? $('body').find('.page').find('h3,h4,h2,h1').first().text() 
			        			: $(this).closest('.lightbox').find('.lb-number').text();
					image = get_url($(this).closest('.lightbox').find('.lb-image').attr('src'));
			        href = window.location.href;
			        url = href;

		      	if( network == "pinterest" ){
			      	api = 'http://www.pinterest.com/pin/create/button/?url=' 
			      		+ encodeURI(image) + '&description=' + encodeURI(description) + '&media=' + image;
			        
			        newPopup(api, title);
			    }

			    if( network == "linkedin" ){
					api = 'http://www.linkedin.com/shareArticle?mini=true&url=' 
							+ image + '&title=' + title + '&summary=' + image + ' - ' 
							+ description + '&source=' + href;
					newPopup(api, title);
			    }

			    if( network == "twitter" ){
					api = 'http://twitter.com/share?url=' + href + ';text=' + title + ' - ' 
					+ image + ';size=l&amp;count=none';
					newPopup(api, title);
			    }

			    if( network == "facebook" ){
			    	postToFeed(title, desc + ' - ' + url, image, image);
			    }
		    });

		}, VideoShare: function(){
			$('body').on('click', '[data-videoshare]', function(e){
				e.stopPropagation(); e.preventDefault();

				var network = $(this).attr('data-videoshare'),
		      		description = image = href = api = desc = url = "";


			      	description = $(this).closest('.video-story').find('p').text();
			        title = $(this).closest('.video-story').find('h1,h2,h3,h4,h5').first().text();
					image = get_url($(this).closest('.video-story').find('.hidden').find('img').attr('src'));
			        href = window.location.href;
			        url = href;

		      	if( network == "pinterest" ){
			      	api = 'http://www.pinterest.com/pin/create/button/?url=' 
			      		+ encodeURI(image) + '&description=' + encodeURI(description) + '&media=' + image;
			        
			        newPopup(api, title);
			    }

			    if( network == "linkedin" ){
					api = 'http://www.linkedin.com/shareArticle?mini=true&url=' 
							+ image + '&title=' + title + '&summary=' + image + ' - ' 
							+ description + '&source=' + href;
					newPopup(api, title);
			    }

			    if( network == "twitter" ){
					api = 'http://twitter.com/share?url=' + href + ';text=' + title + ' - ' 
					+ image + ';size=l&amp;count=none';
					newPopup(api, title);
			    }

			    if( network == "facebook" ){
			    	postToFeed(title, desc + ' - ' + url, image, image);
			    }
		    });
		}, FluidVideos: function(){
			// Find all YouTube videos
			var $allVideos = $("iframe[src^='http://www.youtube.com'], object, embed, "
								+ "iframe[src^='http://player.vimeo.com']"),

			    // The element that is fluid width
			    $fluidEl = $("body");

			// Figure out and save aspect ratio for each video
			$allVideos.each(function() {

			  $(this)
			    .attr('data-aspectRatio', this.height / this.width)

			    // and remove the hard coded width/height
			    .removeAttr('height')
			    .removeAttr('width');

			});

			// When the window is resized
			$(window).resize(function() {

			  var newWidth = $fluidEl.width();

			  // Resize all videos according to their own aspect ratio
			  $allVideos.each(function() {

			    var $el = $(this);
			    $el
			      .width(newWidth)
			      .height(newWidth * $el.attr('data-aspectRatio'));

			  });

			// Kick off one resize to fix all videos on page load
			}).resize();
		}, Accordions: function(){

			var collapse = $(".collapse-trigger");

				$(".accordion-item h4 i").on('click',function(){

			     $(this).closest('.accordion-item').toggleClass('expanded');

			     if($(this).hasClass('collapsedIcon'))
			     {
 			      $(this).removeClass('collapsedIcon')
 			     }else
 			     {
 			      $(this).addClass('collapsedIcon');
 			     }

 			     if( $('.accordion-item.expanded').length == $('.accordion-item').length ){
 			     	collapse.addClass('inverse').text("Collapse All");
 			     }else{
 			     	collapse.removeClass('inverse').text("Expand All");
 			     }

			    });

			    collapse.on('click',function(){
			      if( $(this).hasClass('inverse') ){
			      	$(".accordion-item").removeClass('expanded');
				     $(".acordion h4 i").removeClass('collapsedIcon');
				     $(this).removeClass('inverse').text('Expand All');
				 }else{
				 	$(".accordion-item").addClass('expanded');
				     $(".acordion h4 i").addClass('collapsedIcon');
				     $(this).addClass('inverse').text('Collapse All');
				 }
			    });
		}, TabsAndDropdown: function(){
			$('.tabs-menu').on('click', '.drop a', function(e){
				e.preventDefault(); e.stopPropagation();

				$(this).closest('li').toggleClass('expanded');
				$(this).closest('.tabs-menu').toggleClass('expanded');
			}).on('click', 'li a', function(e){
				e.preventDefault(); e.stopPropagation();

				if( !$(this).closest('li').hasClass('drop') ){
					//change drop title
					var text = $(this).text();
					$(this).closest('ul').find('.drop').find('.text-label').text(text);
					$(this).closest('ul').find('.expanded').removeClass('expanded');
					$(this).closest('.tabs-menu').removeClass('expanded');

					//change active tab class
					$(this).closest('li').addClass('active').siblings().removeClass('active');

					//change active tab-box class
					var currentIndex = $(this).closest('li').index() - 1;
					$('.tabs-box .tab').eq(currentIndex).addClass('active').siblings().removeClass('active');
				}
			});
		}, NavigationHeight: function(){
				var mobile = $(window).width() < 769;

				var isSticky = $('.menuTop').hasClass('sticky');

				$('.menuTop').removeClass('sticky');

				var barHeight 		= $('.menuTop').outerHeight() - 1,
					submenu 		= $('.main-menu ul:visible').length > 0,
					submenuHeight 	= submenu ? $('.main-menu ul:visible').outerHeight(true) : 0,
					submenuTop 		= submenu ? $('.main-menu ul:visible').offset().top : 0,
					page 			= $('.page-wrapper').length > 0;

				var newHeight = barHeight + submenuHeight;

				if( isSticky ){
					$('.menuTop').addClass('sticky');
				}


			if( $('.menuHidden').length == 0 && page ){
				var s = $('.menuTop').clone();
				s.removeClass('sticky menuTop')
					.addClass('menuHidden').css({position: 'relaive', visibility: 'hidden', opacity: 0});

				if( !submenu ){
					s.addClass('no-submenu');
				}

				$('body').prepend(s);
				
			}


				
		}, init: function(){
			// this.createGrid();
			this.NavigationHeight();
			this.trigger();
			this.slider();
			this.sticky();
			this.scrollmagic();
			this.menuactions();
			this.DetectWidth();
			this.DetectPage();
			this.DetectImageResize();
			this.DetectBackgrounds();
			this.LightboxShare();
			this.VideoShare();
			this.FluidVideos();
			this.Accordions();
			this.TabsAndDropdown();

			// $( '#owl-sponsor' ).lemmonSlider();



			/*
			$('body').removeClass('media-screen-max-769');
			if(screenSize < 769){
				$('body').addClass('media-screen-max-769');
			}
			*/
		}
	};

function thousands(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(document).on('ready', function(){ app.init();





$('body').on('click', '.share_pinterest', function(e){
      e.stopPropagation(); e.preventDefault();
      var description = $(this).attr('data-desc'),
          title = $(this).attr('data-title'),
          // image = get_url($(this).attr('href')),
          image = get_url($(this).closest('.hasAction-content').find('img:visible').first().attr('src')),
          href = window.location.href;
      var api = 'http://www.pinterest.com/pin/create/button/?url=' + encodeURI(image) + '&description=' + encodeURI(description) + '&media=' + image;
          newPopup(api, title);
    }).on('click', '.share_linked', function(e){
      e.stopPropagation(); e.preventDefault();
      var description = $(this).attr('data-desc'),
          title = $(this).attr('data-title'),
          // image = get_url($(this).attr('href')),
          image = get_url($(this).closest('.hasAction-content').find('img:visible').first().attr('src')),
          href = window.location.href;
      var api = 'http://www.linkedin.com/shareArticle?mini=true&url=' + image + '&title=' + title + '&summary=' + image + ' - ' + description + '&source=' + href;
          newPopup(api, title);
    }).on('click', '.share_twitter', function(e){
      e.stopPropagation(); e.preventDefault();
      var href = window.location.href, 
          title = $(this).attr('data-title'), 
          // image = get_url($(this).attr('href')), 
          image = get_url($(this).closest('.hasAction-content').find('img:visible').first().attr('src')),
          desc = $(this).attr('data-desc');
      var api = 'http://twitter.com/share?url=' + href + ';text=' + title + ' - ' + image + ';size=l&amp;count=none';
        newPopup(api, title);
    }).on('click', '.fb_share', function(e){
      e.stopPropagation(); e.preventDefault();
      var title = $(this).attr('data-title'),
          desc = $(this).attr('data-desc'),
          url = window.location.href,
          // image = get_url($(this).attr('href'));
          image = get_url($(this).closest('.hasAction-content').find('img:visible').first().attr('src'));
      postToFeed(title, desc + ' - ' + url, image, image);

      return false;
    });




 });

$(window).on('resize', function(){
	// screenSize = $(window).width();
	screenSize = window.innerWidth;
	// app.reScale();
	app.menuresize();
	app.DetectWidth();
	app.DetectImageResize(true);
	
	if( timer['topmenureset'] != undefined ){ clearTimeout(timer['topmenureset']); }
	timer['topmenureset'] = setTimeout(function(){
		app.ResetPageMargin();
	}, 10);
	
	if( timer['topmenu'] != undefined ){ clearTimeout(timer['topmenu']); }
	timer['topmenu'] = setTimeout(function(){
		app.DetectPage(true);
	}, 400);

});





















window.fbAsyncInit = function() {
    FB.init({
        appId: 562478230556234,
        status: true,
        cookie: true,
        xfbml: true
    });
};

  ;(function(d, debug){var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];if   (d.getElementById(id)) {return;}js = d.createElement('script'); js.id = id; js.async = true;js.src = "//connect.facebook.net/en_US/all" + (debug ? "/debug" : "") + ".js";ref.parentNode.insertBefore(js, ref);}(document, /*debug*/ false));

  function postToFeed(title, desc, url, image) {
      var obj = {method: 'feed',link: url, picture: image,name: title,description: desc};
      function callback(response) {}
      FB.ui(obj, callback);
  }


function newPopup(url,name) {
  newwindow=window.open(url,name,'height=300,width=400');
  if (window.focus) {newwindow.focus()}
  return false;
}

function get_url(string){
  var url = window.location;
  url = url.href.substring( 0, url.href.lastIndexOf('/') + 1 );
  if( string.indexOf( url.host ) > 0 ){
    console.log(string);
    return string;
  }
  console.log(url + string);
  return url + string;
}
