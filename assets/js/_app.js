var base = window.base_font_size || 10,
	screenSize = $(window).width(),
	timer = timer || [],
	owl = owl || null, owlSmall = owl || null,
	_images = 'bg',
	historyPan = {
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
					$.when(historyPan.asyncImages(_img)).done(function (image) {
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
						historyPan.resize(i);
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
			$('body').on('click', '.trigger-zoom a', function(){

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
				}
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
				$('.search-button, .search-trigger-btn').toggleClass('search-open');
				$('.search-form').toggleClass('search-open');
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
		}/*, slider: function(){
			owl = $("#owl-demo");
			owl.owlCarousel({
			  // autoPlay: -1, //Set AutoPlay to 3 seconds
			  items : 1,
			  itemsDesktop : [1199,1],
			  itemsDesktopSmall : [979,1],
			  itemsTablet : [767,1],
			  itemsMobile : [480,1],
			  afterAction: historyPan.getCurrent
			});
			owl = $('#owl-demo').data('owlCarousel');

			owlSmall = $("#owl-demo-2");
			owlSmall.owlCarousel({
			  // autoPlay: -1, //Set AutoPlay to 3 seconds
			  items : 4,
			  itemsDesktop : [1199,4],
			  itemsDesktopSmall : [979,3],
			  itemsTablet : [767,2],
			  itemsMobile : [580,1],
			  afterInit: historyPan.setFirst
			});
			owlSmall = $('#owl-demo-2').data('owlCarousel');

			$('#owl-demo-2 .owl-item a').on('click', function(e){
				e.stopPropagation(); e.preventDefault();
				var current = $(this).closest('.owl-item').index();
				owl&&owl.goTo(current);
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
		}*/, sticky:function  () {
			var c = "sticky";
			   $(window).on('scroll', function() {
		         if ($(window).scrollTop() > 50) {
		             $('#menuTop').addClass(c);	
		              	             
		         }
		         else {
		             $('#menuTop').removeClass(c);
		         }
		    });
		}, scrollmagic: function(){
			var controller = new ScrollMagic();
				ScrollMagic({globalSceneOptions: {triggerHook: .75} });
				// build tween
				var tween = TweenMax.fromTo(".history-menu", 1, {opacity: 0, top: '-20px', 
						position: 'relative'}, 
						{opacity: 1, top: '0px'});

				var Increments = { colleges: 0, collegesBig: 0, programs: 0, scholars: 0, graduations: 0, 
						impacted: 0, scholarsBig: 0, graduationsBig: 0, programsBig: 0, impacted: 0 };

				var tweencollege = TweenMax.to(Increments, 1, {
				      colleges: 225, 
				      onUpdate: function () {
				          $('.colleges-increment').text(parseInt(Increments.colleges))
				      },
				      ease:Circ.easeOut
				  });

				var tweencollegeBig = TweenMax.to(Increments, 1, {
				      collegesBig: 225, 
				      onUpdate: function () {
				          $('.colleges-increment-big').text(parseInt(Increments.collegesBig))
				      },
				      ease:Circ.easeOut
				  });

				var tweenPrograms = TweenMax.to(Increments, 1, {
				      programs: 65, 
				      onUpdate: function () {
				          $('.programsIncrement').text('$' + parseInt(Increments.programs) + ' M')
				      },
				      ease:Circ.easeOut
				  });
				
				var tweenProgramsBig = TweenMax.to(Increments, 1, {
				      programsBig: 65, 
				      onUpdate: function () {
				          $('.programsIncrementBig').text('$' + parseInt(Increments.programsBig) + ' million')
				      },
				      ease:Circ.easeOut
				  });

				var tweenScholars = TweenMax.to(Increments, 1, {
				      scholars: 1450, 
				      onUpdate: function () {
				          $('.scholarsIncrement').text(thousands(parseInt(Increments.scholars)))
				      },
				      ease:Circ.easeOut
				  });

				var tweenScholarsBig = TweenMax.to(Increments, 1, {
				      scholarsBig: 1450, 
				      onUpdate: function () {
				          $('.scholarsIncrementBig').text(thousands(parseInt(Increments.scholarsBig)))
				      },
				      ease:Circ.easeOut
				  });

				var tweenGraduations = TweenMax.to(Increments, 1, {
				      graduations: 100, 
				      onUpdate: function () {
				          $('.graduationsIncrement').text("~" + parseInt(Increments.graduations) + "%")
				      },
				      ease:Circ.easeOut
				  });

				var tweenGraduationsBig = TweenMax.to(Increments, 1, {
				      graduationsBig: 100, 
				      onUpdate: function () {
				          $('.graduationsIncrementBig')
				          	.text("Nearly " + parseInt(Increments.graduationsBig) + " % Graduation Rate")
				      },
				      ease:Circ.easeOut
				  });

				var tweenImpactedBig = TweenMax.to(Increments, 1, {
				      impacted: 30000, 
				      onUpdate: function () {
				          $('.impactedIncrementBig')
				          	.text(thousands(parseInt(Increments.impacted)))
				      },
				      ease:Circ.easeOut
				  });


				var tweenImpactBigItem = TweenMax.fromTo(".impactBigItem", 1, {opacity: 0.4, scale: 0.8,
								ease: Linear.easeNone}, {opacity: 1, scale: 1});
				
				var tweenScholarsAppear = TweenMax.fromTo(".scholarsAppear", 1, {opacity: 0.4, scale: 0.8,
								ease: Linear.easeNone}, {opacity: 1, scale: 1});
				var tweenProgramsAppear = TweenMax.fromTo(".programsAppear", 1, {opacity: 0.4, scale: 0.8,
								ease: Linear.easeNone}, {opacity: 1, scale: 1});
				var tweenGraduationsAppear = TweenMax.fromTo(".graduationsAppear", 1, {opacity: 0.4, scale: 0.8,
								ease: Linear.easeNone}, {opacity: 1, scale: 1});



				// build scene
				var scene1 = new ScrollScene({triggerElement: ".history-menu", duration: 300})
								.setTween(tween)
								.addTo(controller);

				var scene2 = new ScrollScene({triggerElement: ".colleges-increment", duration: 300, offset: -250})
								.setTween(tweencollege)
								.addTo(controller);

				var scene3 = new ScrollScene({triggerElement: ".colleges-increment-big", 
								duration: 300, offset: -250})
								.setTween(tweencollegeBig)
								.addTo(controller);



				var scene5 = new ScrollScene({triggerElement: ".impactBigItem", duration: 300, offset: -250})
								.setTween(tweenImpactBigItem)
								.addTo(controller);

				var scene4 = new ScrollScene({triggerElement: ".programsIncrement", duration: 300, offset: -250})
								.setTween(tweenPrograms)
								.addTo(controller);
				var scene6 = new ScrollScene({triggerElement: ".programsIncrementBig", duration: 300, 
									offset: -250})
								.setTween(tweenProgramsBig)
								.addTo(controller);
				
				var scene7 = new ScrollScene({triggerElement: ".scholarsIncrement", duration: 300, offset: -250})
								.setTween(tweenScholars)
								.addTo(controller);
				var scene8 = new ScrollScene({triggerElement: ".scholarsIncrementBig", duration: 300, 
									offset: -250})
								.setTween(tweenScholarsBig)
								.addTo(controller);

				var scene9 = new ScrollScene({triggerElement: ".graduationsIncrement", duration: 300, offset: -250})
								.setTween(tweenGraduations)
								.addTo(controller);
				var scene10 = new ScrollScene({triggerElement: ".graduationsIncrementBig", duration: 300, 
									offset: -250})
								.setTween(tweenGraduationsBig)
								.addTo(controller);

				var scene11 = new ScrollScene({triggerElement: ".impactedIncrementBig", duration: 300, 
									offset: -250})
								.setTween(tweenImpactedBig)
								.addTo(controller);
				
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











		}, menuresize: function(){
			var calc = - ( (screenSize * 0.85) - ( 7*12 ) ) +  'px';
			$('#navbar').css({right: calc }).attr('data-last', calc);
		}, menuactions: function(){

			this.menuresize();

			$('body').on('click', '#navbar ul li a', function(e){
				if( $('body').hasClass('media-screen-max-768') && $(this).closest('li').find('ul').length > 0 ){
					e.preventDefault(); e.stopPropagation();
					$(this).closest('li').toggleClass('expanded').siblings().removeClass('expanded');
				}
			}).on('click','.open-navbar', function(){
				$('body').addClass('noflow');
			}).on('click','.close-navbar, .overlay', function(){
				$('body').removeClass('noflow');
				$('li.expanded').removeClass('expanded');
			});

		}, init: function(){
			this.createGrid();
			this.trigger();
			//this.slider();
			this.sticky();
			this.scrollmagic();
			this.menuactions();

			$('body').removeClass('media-screen-max-768');
			if(screenSize < 768){
				$('body').addClass('media-screen-max-768');
			}
		}
	};

function thousands(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(document).on('ready', function(){ historyPan.init(); });
$(window).on('resize', function(){
	screenSize = $(window).width();
	historyPan.reScale();
	historyPan.menuresize();
	$('body').removeClass('media-screen-max-768');
	if(screenSize < 768){
		$('body').addClass('media-screen-max-768');
	}
});