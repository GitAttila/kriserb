var Navigation = (function(){

    var lastNavLinkClicked = 'home';

    $('[data-menulink].nav-link').on( 'click', function(e) {
        e.preventDefault();
        
        var linkTo = $(this).data('menulink');
        console.log($(this).siblings('.submenu').length);
        if (lastNavLinkClicked === linkTo && $(this).siblings('.submenu').length === 0) {
            //if ($(this).siblings('.submenu').length > 0) {
                // if (linkTo === 'about') {
                //     return;
                // } else if (linkTo === 'gallerries') {
                //     //
                // }
            //}
            return;
        }
        lastNavLinkClicked = linkTo;

        console.log('linkTo: '+ linkTo);

        // toggle up and down icons in case they are present
        if ($(this).children('span').children('.icon-menu-down') || $(this).children('span').children('.icon-menu-up')) {
            $(this).children('span').children('.icon-menu-down').toggle(); 
            $(this).children('span').children('.icon-menu-up').toggle(); 
        }
        // in case the nav item clicked has a submenu, toggle it
        if ($(this).siblings('.submenu')) {
            $(this).siblings('.submenu').slideToggle();
        }
        
        if (linkTo !== 'about') {
            $('#navbar .nav-item').removeClass('active');
            $('#navbar [data-menulink="' + linkTo + '"]').parent().addClass('active'); 
            
            $('.section-content.active').animateCss('fadeOutUp','',function(){
                $('.section-content.active').removeClass('active');
                $('#content-' + linkTo).css('opacity','0');
                $('#content-' + linkTo).addClass('active').animateCss('fadeInUp','', function(){
                    $('#content-' + linkTo).css('opacity','1');
                    if (linkTo === 'gallerries') {
                        $('.thumbnail-grid').isotope('layout');
                    }
                });
            })
        }
        
    });

    $('[data-gallerylink]').on( 'click', function(e) {
        filterTag = $(this).data('gallerylink');
        console.log(filterTag);
        
        $( "#thumbnail-portfolio-gallery" ).hide();
        $( "#portfolio-carousel-frame" ).hide();
        $( "#main-gallery" ).show();
        
        $('.grid').isotope(
            {
                filter: '[data-tag="' + filterTag +'"]'
            }
        );

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

