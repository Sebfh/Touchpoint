/***
* makeClickable
* make a complete block clickable
*
 * "New window" inspiration came from http://css-tricks.com/snippets/jquery/open-external-links-in-new-window/
*/
(function ($) {
	$.fn.makeClickable = function () {
 
		return this.each(function () {
			var url = $(this).find("a:first"),
				  a = new RegExp('/' + url + '/');
		   
			if (url.attr("href") != undefined && url.attr("href") != "#") {
				$(this).click(function (e) {
					e.preventDefault();
					e.stopPropagation();
 
					// de weg naar de volgende pagina uitvogelen
					if (url.attr("target") || !a.test(url)) {
						// pagina openen in een nieuw venster
						// we hebben een target-attribute gevonden
						window.open(url.attr("href"), '_blank');
					} else {
						// pagina openen in hetzelfde venster
						location.href = url.attr("href");
					}
 
				}).css("cursor", "pointer");
			   
				// title tag overnemen van href
				$(this).attr('title', url.attr("title"));
			}
 
		});
	};
})(jQuery);