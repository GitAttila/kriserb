$(function() {
    
    //$('.nav').on( 'click','li>a>span', function(e) {
    //    e.preventDefault();
    //    var hashTag = this.text.trim().toLowerCase();
    //    if (hashTag === 'gallery') {
    //        console.log("hashTag: " + hashTag);
    //    }
    //});
    $.ajaxSetup({ cache: false });

    $('.navbar-nav .nav-link').on( 'click', function(e) {
        e.preventDefault();
        var url = this.href;
        var hashTag = this.text.trim().toLowerCase();
        
        console.log("url :  " + url);
        console.log("hashTag: " + hashTag);
        
        if (hashTag === 'publications' || hashTag === 'commissions' || hashTag === 'biography' || hashTag === 'press/media' || hashTag === 'contact') {
            
            //console.log("inside of if statement: "+ this.text);
            
            location.hash = hashTag;
            
            if ($('#portfolios-menu').is(':visible')) {
                
                //console.log('#portfolios-menu is visible:hide it');
                
                $( "#portfolios-menu").hide();    
                $( ".js-gallerymenu-toggle>a>span>.menu-up" ).hide();
                $( ".js-gallerymenu-toggle>a>span>.menu-down" ).show();
            }
            
            $('#galleries_container').fadeOut(500);
            $('#ajax-container').remove();
            $('#ajax-content').load(url + ' #ajax-container').hide().delay(500).fadeIn(500).promise().done(function() {
                initFormListener();
                // initPublications();
            });
        }
        
    });
    
    /* ----------     event listener for About menu     ---------- */

    $('.js-aboutmenu-toggle').on('click', function(event) {  
        
        console.log("inside of event listener: About menu ");
        
        $('#about-menu').slideToggle();    
        $( ".js-aboutmenu-toggle>a>span>.menu-up" ).toggle();
        $( ".js-aboutmenu-toggle>a>span>.menu-down" ).toggle();
    });  
    
    /* ----------     event listener to add 'gallery' hashTag  ---------- */
    
    $('.js-gallerymenu-toggle').on('click', function(e) {  
        e.preventDefault();
        $this = $(this);
        var hashTag = $this.children().first().text().trim().toLowerCase();
        if (hashTag === 'gallery') {
            //console.log("hashTag: " + hashTag);
            location.hash = hashTag;
        }
        
    });  

    $('#navbar').on( 'show.bs.collapse', function(e) {
        $('.hamburger-icon').addClass('hamburger-close-x');
        $('#content-container').removeClass('col-sm-12').addClass('col-sm-9');
        $('#navbar-container').removeClass('navbar-menu-collapsed');
    });
    $('#navbar').on( 'shown.bs.collapse', function(e) {
        
    });
    $('#navbar').on( 'hide.bs.collapse', function(e) {
        $('.hamburger-icon').removeClass('hamburger-close-x');
        $('#navbar-container').addClass('navbar-menu-collapsed');
    });
    $('#navbar').on( 'hidden.bs.collapse', function(e) {
        
        $('#content-container').removeClass('col-sm-9').addClass('col-sm-12');
    });
});
