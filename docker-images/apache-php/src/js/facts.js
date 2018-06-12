$(document).ready(function() {

    setInterval(function() {

        console.log("Loading some new facts");
    
        $.getJSON("/api/facts/", function(facts) {
            
            for(var i = 0; i < facts.length; i++) {
    
                var container   = document.getElementById("fact" + (i+1));
                var title       = "<h5>" + facts[i].title + "</h5>";
                var content     = "<p>" + facts[i].content + "</p>";
                var author      = "<p class='text-muted'>" + facts[i].author + "</p>";
    
                $(container).html(title + content + author);
            }
        });
    }, 3000);
});