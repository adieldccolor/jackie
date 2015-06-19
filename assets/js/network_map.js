
var map = {
	init: function(){
		$("#northeast,#northeast-link").hover(function(){
			$("#network_map").css("background-position","0 -322px");
		},function(){
			$("#network_map").css("background-position","0 0px");
		});

		$("#northeast,#northeast_320,#northeast-link").click(function(){
			$(".northeast_content").fadeIn(1000);
			$(".back_map").fadeIn(1000).css("display","block");
			$(".pricipal_content").hide();
			$("#northeast-link").addClass("active");
		});

		$("#MidAtlantic,#MidAtlantic-link").hover(function(){
			$("#network_map").css("background-position","0 -646px");
		},function(){
			$("#network_map").css("background-position","0 0px");
		});

		$("#MidAtlantic,#MidAtlantic_320,#MidAtlantic-link").click(function(){
			$(".MidAtlantic_content").fadeIn(1000);
			$(".back_map").fadeIn(1000).css("display","block");
			$(".pricipal_content").hide();
			$("#MidAtlantic-link").addClass("active");
		});

		$("#Southeast,#Southeast-link").hover(function(){
			$("#network_map").css("background-position","0 -970px");
			},function(){
			$("#network_map").css("background-position","0 0px");
		});

		$("#Southeast,#Southeast_320,#Southeast-link").click(function(){
			$(".Southeast_content").fadeIn(1000);
			$(".back_map").fadeIn(1000).css("display","block");
			$(".pricipal_content").hide();
			$("#Southeast-link").addClass("active");
		});


		$("#Central,#Central-link").hover(function(){
			$("#network_map").css("background-position","0 -1294px");
			},function(){
			$("#network_map").css("background-position","0 0px");
		});

		$("#Central,#Central_320,#Central-link").click(function(){
			$(".Central_content").fadeIn(1000);
			$(".back_map").fadeIn(1000).css("display","block");
			$(".pricipal_content").hide();
			$("#Central-link").addClass("active");
		});

		$("#Southwest,#Southwest-link").hover(function(){
			$("#network_map").css("background-position","0 -1624px");
			},function(){
			$("#network_map").css("background-position","0 0px");
		});

		$("#Southwest,#Southwest_320,#Southwest-link").click(function(){
			$(".Southwest_content").fadeIn(1000);
			$(".back_map").fadeIn(1000).css("display","block");
			$(".pricipal_content").hide();
			$("#Southwest-link").addClass("active");
		});

		$("#UpperMidwest,#UpperMidwest-link").hover(function(){
			$("#network_map").css("background-position","0 -1955px");
			},function(){
			$("#network_map").css("background-position","0 0px");
		});

		$("#UpperMidwest,#UpperMidwest_320,#UpperMidwest-link").click(function(){
			$(".UpperMidwest_content").fadeIn(1000);
			$(".back_map").fadeIn(1000).css("display","block");
			$(".pricipal_content").hide();
			$("#UpperMidwest-link").addClass("active");
		});

		$("#Western,#Western-link").hover(function(){
			$("#network_map").css("background-position","0 -2284px");
			},function(){
			$("#network_map").css("background-position","0 0px");
		});

		$("#Western,#Western_320,#Western,#Western-link").click(function(){
			$(".Western_content").fadeIn(1000);
			$(".back_map").fadeIn(1000).css("display","block");
			$(".pricipal_content").hide();
			$("#Western-link").addClass("active");
		});

		$("#PacificNorthwest,#PacificNorthwest-link").hover(function(){
			$("#network_map").css("background-position","0 -2639px");
			},function(){
			$("#network_map").css("background-position","0 0px");
		});

		$("#PacificNorthwest,#PacificNorthwest_320,#PacificNorthwest-link").click(function(){
			$(".PacificNorthwest_content").fadeIn(1000);
			$(".back_map").fadeIn(1000).css("display","block");
			$(".pricipal_content").hide();
			$("#PacificNorthwest-link").addClass("active");
		});

		$("#network_map").hover(function(){

		},function(){
			$("#network_map").css("background-position","0 0px");
		});


		$("#northeast_320").hover(function(){
			$("#network_map_320").css("background-position","0 -202.605px");
		},function(){
			$("#network_map_320").css("background-position","0 0px");
		});


		$("#MidAtlantic_320").hover(function(){
			$("#network_map_320").css("background-position","0 -398px");
		},function(){
			$("#network_map_320").css("background-position","0 0px");
		});


		$("#Southeast_320").hover(function(){
			$("#network_map_320").css("background-position","0 -595.0px");
			},function(){
			$("#network_map_320").css("background-position","0 0px");
		});

		$("#Central_320").hover(function(){
			$("#network_map_320").css("background-position","0 -791.4px");
			},function(){
			$("#network_map_320").css("background-position","0 0px");
		});

		$("#Southwest_320").hover(function(){
			$("#network_map_320").css("background-position","0 -998px");
			},function(){
			$("#network_map_320").css("background-position","0 0px");
		});

		$("#UpperMidwest_320").hover(function(){
			$("#network_map_320").css("background-position","0 -1195px");
			},function(){
			$("#network_map_320").css("background-position","0 0px");
		});

		$("#Western_320").hover(function(){
			$("#network_map_320").css("background-position","0 -1401px");
			},function(){
			$("#network_map_320").css("background-position","0 0px");
		});

		$("#PacificNorthwest_320").hover(function(){
			$("#network_map_320").css("background-position","0 -1608px");
			},function(){
			$("#network_map_320").css("background-position","0 0px");
		});

		$("#network_map_320").hover(function(){

		},function(){
			$("#network_map_320").css("background-position","0 0px");
		});

		$(".back_map").click(function(){
			$(".map_contents").hide();
			$(this).fadeOut();
			$(".pricipal_content").fadeIn(400);
			$('html, body').animate({
          	 scrollTop: 0
       },
       500);
			$(".inline-menu a").removeClass("active");
		});
	}
}

$(window).load(function(){ map.init(); });