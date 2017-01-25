$(function() {
	init();
});

init = function(){

  scrollAnimation();

	//Init Smooth Scrolling
	smoothScroll.init({
		speed: 750,
		easing: 'easeInOutCubic',
		offset: 50,
	});

	//Check if we're mobile or not, and only apply animations on desktop
	if(!(/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera)){
	  	isMobile = false;
	  	$('body').addClass('not-mobile');
	    s = skrollr.init({
	        forceHeight: false,
          smoothScrolling: true
	    });
			// Init Sticky Elements
			var sticky = new Sticky('.sticky');

	} else{
		isMobile = true;
		$('body').addClass('mobile');
	}


  // Hide Header on on scroll down
  var didScroll;
  var lastScrollTop = 0;

  $(window).scroll(function(event){
      didScroll = true;
  });

  setInterval(function() {
      if (didScroll) {
          hasScrolled();
          didScroll = false;
      }
  }, 250);

  function hasScrolled() {
    var st = $(this).scrollTop();
    if (st > lastScrollTop){
      //Downscroll
      $('header').addClass('hidden');
    } else {
      //Upscroll
       $('header').removeClass('hidden');
    }
    lastScrollTop = st;
  }


	$(window).on('scroll', function(){
		if($(window).scrollTop() > 0){
			$('body').addClass('scrolled');
		}else{
			$('body').removeClass('scrolled');
		}
	});

  $(window).scroll(function() {
    var distanceFromTop = $(this).scrollTop();
    if (distanceFromTop >= $('.home-hero, .story-hero').height() - 55) {
        $('header').addClass('in-open');
				$('.story-footer').addClass('active');
    } else {
        $('header').removeClass('in-open');
				$('.story-footer').removeClass('active');
    }
  });



	// Throttle Resize events
  var resizeTimer;

	//Fix Hero Height on Resize
  function heroHeight() {
		var imageHeight = $('.story-feature-image').height();
		// var innerMargin = $('story-hero-content').css("margin-top");
		// console.log(innerMargin);
		var viewHeight = $('.story-hero').height() ;
		$('.story-hero-container').height(imageHeight + viewHeight + 80);
  };

	//Update sticky element when window resize is triggered
	function resizeSticky() {
		sticky.update();
	}

  $(window).resize(function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(heroHeight, resizeSticky, 250);
  });

	//Run Hero Height fix on load
  heroHeight();




  // Image Hover Carousel
  $("ul.article-title-container li:first a, .article-container.mobile ul.article-title-container li:first a").addClass('active');
  $(".article-images-container .single-article-image:first").addClass('active');

  $(".article-title-container li a").on({
    mouseenter: function () {

      // Remove active class from active article title
      $(".article-title-container li a.active").removeClass('active');
      // Remove active class from active image
      $(".single-article-image" + ".active").removeClass('active');

      // Get data-title from hovered article
      var hoverTitle = $(this).data('title');

      // Add active class to hovered image
      $(".single-article-image" + "." + hoverTitle).addClass('active');

      // Add active class to hovered article title
      $(this).addClass('active');

    }
  });


} //End Init


//Setup scroll animation
scrollAnimation = function() {

  $('.animation-set').viewportChecker({
    classToAdd: 'show',
    offset: 40,
    callbackFunction:function(e, a){
      if(a === 'add'){
        $(e).find('.animated').each(function(i, e1){

          var delay = i*50;
          if($(e1).data('delay')){
            delay = delay+$(e1).data('delay');
          }

          window.setTimeout(function(e1){
            $(e1).addClass('show');
          }, delay, e1);
        });
      }
    }
  });
};

// Progress Indicator
  var getMax = function(){
    return $(document).height() - $(window).height();
  }

  var getValue = function(){
    return $(window).scrollTop();
  }

  if ('max' in document.createElement('progress')) {
    // Browser supports progress element
    var progressBar = $('progress');

    // Set the Max attr for the first time
    progressBar.attr({ max: getMax() });

    $(document).on('scroll', function(){
      // On scroll only Value attr needs to be calculated
      progressBar.attr({ value: getValue() });
    });

    $(window).resize(function(){
      // On resize, both Max/Value attr needs to be calculated
      progressBar.attr({ max: getMax(), value: getValue() });
    });

  } else {

    var progressBar = $('.progress-bar'),
        max = getMax(),
        value, width;

    var getWidth = function() {
      // Calculate width in percentage
      value = getValue();
      width = (value/max) * 100;
      width = width + '%';
      return width;
    }

    var setWidth = function(){
      progressBar.css({ width: getWidth() });
    }

    $(document).on('scroll', setWidth);
    $(window).on('resize', function(){
      // Need to reset the Max attr
      max = getMax();
      setWidth();
    });
  }
