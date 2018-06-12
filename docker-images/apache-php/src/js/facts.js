$(document).ready(function() {

    setInterval(function() {

        console.log("Loading some new facts");
    
        $.getJSON("/api/facts/", function(facts) {

            $('#main-title').text("Servi par " + facts.ipAddress);
            
            for(var i = 0; i < facts.data.length; i++) {
    
                var container   = document.getElementById("fact" + (i+1));
                var title       = "<h5>" + facts.data[i].title + "</h5>";
                var content     = "<p>" + facts.data[i].content + "</p>";
                var author      = "<p class='text-muted'>" + facts.data[i].author + "</p>";
    
                $(container).html(title + content + author);
            }
        });
    }, 3000);
});