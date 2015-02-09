
// equalizeHeights doesn't work correctly on $(document).ready() ?, Use load to make sure the dom is stable.
$(window).load(function () {

	// Equalize box heights initially and after resize
	doEqualizeHeights();
	$(window).smartresize( doEqualizeHeights, 250 );
	
});

function isLinkToAsset(url) {
    return (url.indexOf("binaries/content/assets") != -1);
}

function trackDownloadNewWindow(link, category, action) { 
	 
	try { 
	   _gaq.push(['_trackEvent', category , action]); 
	} catch(err){}
	 
	setTimeout(function() {
		window.open(link.href, "_blank");
	}, 100);
}

function trackDownload(link, category, action) { 
	 
	try { 
	   _gaq.push(['_trackEvent', category , action]); 
	} catch(err){}
	 
	setTimeout(function() {
	    document.location.href = link.href;
	}, 100);
}


/* Same as $(document).ready(...) */
$(function () {
	
	// when a link is clicked, a Google Analytics trackEvent is recorded when the link is a download of an asset (e.g. PDF)
	$('a').not('[href="#"]').not('a[class~="programLink"]').not('a[class~="continue"]').click(function () {
		var url = $(this).attr('href');
		var target = $(this).attr('target');
		if (isLinkToAsset(url)) {
			if ("_blank" == target) {
				trackDownloadNewWindow($(this).get(0), 'Download' , url);
			} else {
				trackDownload($(this).get(0), 'Download' , url);
			}
			return false;
		} else {
			if ("_blank" == target) {
				window.open(url, "_blank");
			} else {
				document.location.href = url;
			}
		}
		return false;
	});

	
	// make complete box clickable
	$('.clickable').makeClickable();

	// [A] Carousel
	doCarousel();

	// [C] Blogs teaser toggler
	doBlogsTeaserToggler();

	// [E] Twitter ticker
	setInterval('doTwitterUpdates()', 4000);

	// [F] News ticker
	setInterval('getNewsTicker()', 3000);

	// [W] Program courses
	doProgramCoursesTable();

	// [K] [AH] Accordion
	doAccordion('.accordion li');

	// activate more info boxes
	$('.more-info').moreInfoBox();

	/* Align borders in main navigation flyout */
	$('.nav-main .has-nav').hover(function() {
		item = $(this);
		// Only if multicolumn
		if(item.find('ul').size() > 1) {
			// Set extra padding on multiline list items
			item.find('a').each(function() {
				link = $(this);
				numberOfLines = link.height() / parseInt(link.css('line-height'));
				if ( numberOfLines > 1 )
					// That 33 is the height of a single lined item, excluding border
					link.parent().css('padding-bottom', ( numberOfLines * 33 ) - link.outerHeight() + ( numberOfLines - 1 ) );
			});
		}
	});

	/* Align top left button with hgroup to its right */
	$('.align-with-hgroup').each(function() {
		var reference = $(this).parents('.container_12').find('hgroup')[0];
		var extraHeight = 5;
		if (reference != null ) {
			if( $(reference).next().is('.nav-tabs')) {
				extraHeight += 4;
			}
			$(this).height( $(reference).height() + extraHeight );
		}
	});

	/* Print page */
	$('#print').click(function () {
		window.print();
	});

	/* Fallback for HTML5 form field placeholder */
	if (!Modernizr.input['placeholder']) {
		$('[placeholder]').focus(function () {
			var input = $(this);
			if (input.val() == input.attr('placeholder')) {
				input.val('');
				input.removeClass('placeholder');
			}
		}).blur(function () {
			var input = $(this);
			if (input.val() == '' || input.val() == input.attr('placeholder')) {
				input.addClass('placeholder');
				input.val(input.attr('placeholder'));
			}
		}).blur();
	}

	/* Toggle page menu */
	$('#page-menu li').each(function () {
		var elem = $(this),
			toggle = elem.find('span');

		toggle.click(function () {
			if (toggle.parent().hasClass('open')) {
				elem.find('ul').hide('slow');
				elem.find('a').first().removeClass('active');
				toggle.parent().removeClass('open');
			} else {
				elem.find('ul').show('slow');
				elem.find('a').first().addClass('active');
				toggle.parent().addClass('open');
			}
		});
	});

    /* Toggle accordion via the title link */
    $('.link-toggle').click(function() {
        $(this).siblings(".toggle").click();
    });


    $('#printMe').click(function() {
        window.print();
        return false;
    });

    /* Question Form enable form validation and fadeout the message on successful form submit. */
    $("#questionForm").validate();
    $("#questionForm .fadeout").delay(10000).fadeOut('slow',
            function () { $("#questionForm .fadeout").remove(); }
    );

    /* LinkedIn group picker; after a selection a new window will open with the linkedin group link opened. */
    $(".box-linkedin-groups select#linked-group-picker ").change(function() {
        var selectedValue = $(this).find("option:selected").val();
        if (selectedValue) {
            window.open(selectedValue, '_blank');
        }
    });

    /* Only do the ajax-get of twitterfeeds when the component is loaded on the dom-document. */
    if (typeof twitterId != 'undefined') {
        asyncTwitterUrl = asyncTwitterUrl + "?twitterId=" + twitterId;
    }
    if ($("section#twitter").length || $("aside#twitter").length ) {
        var ajaxCall = $.ajax({
            url: asyncTwitterUrl,
            dataType: 'json'
        });
        ajaxCall.complete(function(response){
            twitterItems = jQuery.parseJSON(response.responseText);
            doTwitterUpdates();
        });
    }

    /* Only do the ajax-get of youtube when the component is loaded on the dom-document. */
    if (typeof youtubeVideoId != 'undefined') {
        asyncYoutubeUrl = asyncYoutubeUrl+"?videoId="+youtubeVideoId;
    }
    if ($("aside#youtube").length) {
        var ajaxCall = $.ajax({
            url: asyncYoutubeUrl,
            dataType: 'json'
        });
        ajaxCall.complete(function(response){
            var videoData = jQuery.parseJSON(response.responseText);
            var youtubeBox = $('#youtube'),
                    videoTitle = youtubeBox.find('strong'),
                    userLink = youtubeBox.find('p a');
            videoTitle.text(videoData.videoTitle);
            userLink.attr('href', encodeURI(videoData.userUrl));
        });
    }

    /* Flickr slideshow */
    if ($("aside#flickr").length) {
        if (typeof flickrUserId != 'undefined' || typeof flickrSetId != 'undefined' ) {

            var resizeContainer = new function() {
                //explicitly setting the size of elements; in order to display images correctly on screen.
                var container = $('.flickrshow-container');
                container.height(121);
                container.find('ul,li,img').height(121);
                container.find('img').css('top','0');
            };
            var flickrSlideShow = $('aside#flickr #flickr-slideshow').flickrshow({
                autoplay:false,
                interval:5000,
                license:null,
                page:1,
                per_page:10,
                hide_buttons:true,
                onLoad: function() {
                    flickrSlideShow.play();
                    $('.flickrshow-buttons').hide();
                },
                onMove: function() {
                },
                onPlay: function() {
                }
            });
            if (typeof flickrSetId == 'undefined' && typeof flickrUserId != 'undefined') {
                flickrSlideShow.settings.user = flickrUserId;
            } else if (typeof flickrSetId != 'undefined') {
                flickrSlideShow.settings.set = flickrSetId;
            }
        }
    }

    /* Show / Hide certain elements when css is not available (but javascript is) */
    if (cssDisabled) {
    	$('.remove-on-no-css').remove();  // hide() does not work with css disabled.
    } else {
    	$('.remove-on-css').remove();
    }
 
});



