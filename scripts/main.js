$(function() {
	init();
});

init = function(){

  scrollAnimation();

	//Check if we're mobile or not, and only apply animations on desktop
	if(!(/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera)){
	  	isMobile = false;
	  	$('body').addClass('not-mobile');
	    s = skrollr.init({
	        forceHeight: false,
          smoothScrolling: true
	    });

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
		var progressBar = $('progress');
    var distanceFromTop = $(this).scrollTop();

    if (distanceFromTop >= $('.home-hero, .story-hero').height() - 55) {
        $('header').addClass('in-open');
				$('.story-footer').addClass('active');
    } else {
        $('header').removeClass('in-open');
				$('.story-footer').removeClass('active');
    }

		if ( distanceFromTop >= $('.story-hero').height() - 55) {
			$('.story-footer').addClass('active');

			if (progressBar.val() == progressBar.attr('max')) {
				$('.story-footer').removeClass('active');
			}

    } else {
				$('.story-footer').removeClass('active');
    }

  });

	//Scroll To Top
	$('a.top-scroll').on('click',function (e) {
			e.preventDefault();
			smoothScroll.animateScroll( 0 );
			return false;
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


  $(window).resize(function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(heroHeight, 250);
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




	// console.log('find closest li', $(nextArticle).data('title') );


	setInterval(function(){

		// Find the next title after the one that is active

		if ($(".article-title-container li a.active").closest('li').next().length == 0) {
			var nextArticle = $(".article-title-container li").first().find('a')
		} else {
			var nextArticle = $(".article-title-container li a.active").closest('li').next().find('a')
		}

		// Get the title of the next article
		var nextArticleTitle = $(nextArticle).data('title')

		// Remove active class from active image
		$(".single-article-image" + ".active").removeClass('active');

		// Activate the matching image
		$(".single-article-image" + "." + nextArticleTitle).addClass('active');

		// Remove active class from active article title
		$(".article-title-container li a.active").removeClass('active');

		// Add active class to matching article
		$(nextArticle).addClass('active');

	}, 5000)

	//Filter for Stories Listing Page

	var options = {
    valueNames: [ 'issue']
	};

	var storyList = new List('story-listing', options);

	$('.filter-list a').on('click',function(e){
		e.preventDefault();

	  var $text = $(this).text();
		var $color = $(this).data('color')

		$('body').css('background-color', $color);

	  if($(this).data('title') === 'all'){
			$('.article-component').addClass('hide');
	    storyList.filter();

	    $(this).addClass('selected');

	  } else {

		    storyList.filter(function(item) {
					$('.article-component').addClass('hide');
		      return (item.values().issue == $text);
		    });

	    	$(this).addClass('selected');
	  }


	});

	if ($('body').hasClass('listing-page')) {
		storyList.on('filterComplete', function (list){

			setTimeout(function(){
				list.matchingItems.forEach(function (element) {
					$('.article-component').removeClass('hide');
		    });
			}, 100)

		});
	}


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
$( document ).ready(function() {

	var getMax = function(){
		return $('.story-body').height();
		// return $(document).height() - $(window).height();
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
			var distanceFromTop = $(window).scrollTop();
			var topArea = $('.story-hero-container').height();
			if (distanceFromTop >= $('.story-hero-container').height()) {
				progressBar.attr({ value: getValue() - topArea });
			}

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
});
