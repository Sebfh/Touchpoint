(function ($) {
    $.fn.moreInfoBox = function () {
    	var defaultTextEnglish = 'More information';
    	var clickedTextEnglish = 'Hide information';
    	var defaultTextDutch = 'Meer informatie';
    	var clickedTextDutch = 'Minder informatie';
    	
        return this.each(function () {
            var container	= $(this),
            	link		= $(this).find('.button-more'),
            	content		= $(this).find('.content');
            
            // hide content area
            content.hide();
            
            // activate button
            link.click(function(e){
            	e.preventDefault();
            	
            	var defaultText = defaultTextDutch;
            	var clickedText = clickedTextDutch;
            	if (link.hasClass('en')) {
            		defaultText = defaultTextEnglish;
                	clickedText = clickedTextEnglish;
            	} 
            	
            	if(content.is(':visible')){
            		content.slideUp('slow');
            		link.addClass('button-more')
            			.removeClass('button-less')
            			.html(defaultText);
            	}else{
            		content.slideDown('slow');
            		link.addClass('button-less')
            			.removeClass('button-more')
            			.html(clickedText);
            	}
         
            });
 
        });
    };
})(jQuery);