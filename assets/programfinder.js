
var PROGRAM_COOKIE_NAME = "visitedPrograms";
var PROGRAM_FINDER_QUERY_COOKIE_NAME = "programFinderQuery";

var programQueryUrl = window.location.href;

	
    function bindVisitedPrograms() {
        $("div.programMore").each(function() {

            if($.cookie(PROGRAM_COOKIE_NAME)) {
                cookieValue = $.cookie(PROGRAM_COOKIE_NAME);

                var anchor = $(this).children("a");
                var programId = anchor.attr("data-programid");

                if (cookieValue.indexOf(programId) == -1){
                    $(this).append('<i><span class="icon icon-16 icon-checkmark"></span>' + notYetViewedLabel + '</i>');
                } else{
                    $(this).append('<i><span class="icon icon-16 icon-checkmark-active"></span>' + viewedLabel + '</i>');
                }
            } else {
                $(this).append('<i><span class="icon icon-16 icon-checkmark"></span>' + notYetViewedLabel + '</i>');
            }
        });
        return false;
    };

    $(bindVisitedPrograms);
    
    $("#programFinderForm input").click(function() {
        $("#programFinderForm").submit();
    });

    $("li.intensity ul li a").click(function(){
    	// Set the form fields from the intensity hidden spans
    	var names = ["vorm", "type", "erasmusProgramma"];
    	for (var name in names) {
           var intensityValue = $(this).children("."  + names[name]).text().toLowerCase();
           $("#" + names[name]).val(intensityValue);
        }
        $("#programFinderForm").submit();
        return false;
    });

    $("div.display-options a").click(function(){
        var displayForm = $(this).text().toLowerCase();
        $("#weergave").val(displayForm);
        $("#programFinderForm").submit();
        return false;
    });

    $("div.paging a").live("click",function(){
        var hrefOriginal = $(this).attr("href");
        href = hrefOriginal.replace("opleidingzoeker", "opleidingzoeker-async");
        href = href.replace("programfinder", "programfinder-async");
        $("div.grid_12").load(href, function(){
            bindVisitedPrograms();
            
            programQueryUrl = hrefOriginal; // paging changes the "back" url.
        });

        return false;
    });

    $("a.scroll-top").live("click", function(){
        $('html, body').animate({scrollTop : 0},'slow');
        return false;
    });

    $("a.programLink").live("click", function(){

        var programId = $(this).attr("data-programid");

        var visitedProgramsValue = "";
        if($.cookie(PROGRAM_COOKIE_NAME)) {
            visitedProgramsValue = $.cookie(PROGRAM_COOKIE_NAME);

            if (visitedProgramsValue.indexOf(programId) == -1){
                $.removeCookie(PROGRAM_COOKIE_NAME);
                $.cookie(PROGRAM_COOKIE_NAME, visitedProgramsValue + "," + programId);
            }

        } else {
            // create for the first time
            $.cookie(PROGRAM_COOKIE_NAME, programId);
        }


        // Set the programQueryUrl cookie for the back button, includes fragment specifier.
        var hash = /#(.+)$/;
        programQueryUrl = programQueryUrl.replace(hash, "");
        programQueryUrl = programQueryUrl + "#" + programId;
        if($.cookie(PROGRAM_FINDER_QUERY_COOKIE_NAME)) {
            // if it exists: KILL IT!
            $.removeCookie(PROGRAM_FINDER_QUERY_COOKIE_NAME);
        }
        $.cookie(PROGRAM_FINDER_QUERY_COOKIE_NAME, programQueryUrl);
    });
    
    // Set the url for the "back to programfinder" button in program detail.
    $(function(){
        if($.cookie(PROGRAM_FINDER_QUERY_COOKIE_NAME)) {

        	$('#programQuery').attr('href', $.cookie(PROGRAM_FINDER_QUERY_COOKIE_NAME));
        }
    });


