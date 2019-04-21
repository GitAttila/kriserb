var Navigation = (function(imgs){
    var lastNavLinkClicked = 'home';
    var cachedImages = imgs;

    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    function initNavigationListeners(){

        isMobileFlag = this.isMobile.any() || false;

        $('[data-menulink].nav-link').on( 'click', function(e) {
            e.preventDefault();        
            var linkTo = $(this).data('menulink');
            // autoclose the navbar manu after the selection has been made
            if (linkTo !=='about' && linkTo !== 'gallerries' && isMobileFlag) {
                $('#navbar').collapse('hide');
            }

            if (lastNavLinkClicked === linkTo && $(this).siblings('.submenu').length === 0) {
                return;
            }
            
            // toggle up and down icons in case they are present
            if ($(this).children('span').children('.icon-menu-down').length>0 || $(this).children('span').children('.icon-menu-up').length>0) {
                $(this).children('span').children('.icon-menu-down').toggle(); 
                $(this).children('span').children('.icon-menu-up').toggle(); 
            }
            // in case the nav item clicked has a submenu, toggle it
            if ($(this).siblings('.submenu').length>0) {
                $(this).siblings('.submenu').slideToggle();
            }
            
            if (linkTo !== 'about') {
                $('#navbar .nav-item').removeClass('active');
                $('#navbar [data-menulink="' + linkTo + '"]').parent().addClass('active'); 
                linkFrom = $('.section-content.active').attr("id").split('-')[1];
                // console.log(linkFrom,linkTo);
                if (linkTo === 'gallerries') {
                    $( "#thumbnail-portfolio-gallery" ).show();
                    $( "#main-gallery" ).hide();
                    $( "#portfolio-carousel-gallery" ).hide();
                    if (linkFrom !== linkTo) {
                        makeSectionTransition(linkFrom,linkTo);
                    }
                } else {
                    makeSectionTransition(linkFrom,linkTo);
                }
            }
            lastNavLinkClicked = linkTo;
        });
    
        $('[data-thumbnailportfolio]').on( 'click', function(e) {
            filterTag = $(this).data('thumbnailportfolio');
            // autoclose the navbar manu after the selection has been made
            if (isMobileFlag) {
                $('#navbar').collapse('hide');
            }

            if (!$("#main-gallery" ).is(':visible')) {
                linkFrom = $('.section-content.active').attr("id").split('-')[1];
                if (linkFrom!=='gallerries') {
                    makeSectionTransition(linkFrom,'gallerries');
                }
            }
    
            $('#navbar .nav-item').removeClass('active');
            $('#navbar [data-thumbnailportfolio]').parent().removeClass('active');
            $('#navbar [data-thumbnailportfolio="' + filterTag + '"]').parent().addClass('active'); 
    
            $( "#thumbnail-portfolio-gallery" ).hide();
            $( "#portfolio-carousel-gallery" ).hide();
            $( "#main-gallery" ).show();
            
            $('.grid').isotope(
                {
                    filter: '[data-tag^="' + filterTag +'"]'
                }
            );
    
        });

        $('.grid').on( 'click','.grid-item', function() {
            var _self = this;
            strToParse = $(this).data('tag');
            slideNum = Number(strToParse.replace(/[^0-9]/g,''));

            if ($(this).hasClass('portfolio-text-box')) {
                
                $(this).toggleClass('gigante');
                $( ".max-min-button>.ion-ios-expand" ).toggle();
                $( ".max-min-button>.ion-ios-contract" ).toggle();
                
                $(this).one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
                    function(event) {
                        $('.grid').isotope('layout');
                    }
                );

            } else {
                $(this).addClass("grid-size-animation");
                setTimeout(function(){
                    $(_self).removeClass("grid-size-animation");
                    $( "#main-gallery" ).hide();
                    $( "#portfolio-carousel-gallery" ).show();
                    updatePortfolioGallery(cachedImages , getActivePortfolioName());                    
                    $( "#portfolio-carousel" ).carousel(slideNum-1);
                },350);
            }
        });
    
        $('.return-from-portfolio').on( 'click', function() {
            if ($('#portfolio-carousel-gallery').is(':visible')) {
                
                //console.log(" portfolio carousel frame is visible ");
                
                $( "#portfolio-carousel-gallery" ).hide();
                $( "#main-gallery" ).show();
                $('.grid').isotope( 'layout');
            } else {
                
                //console.log(" portfolio carousel frame is not visible ");
                
                $( "#thumbnail-portfolio-gallery" ).show();
                $( "#main-gallery" ).hide();
                $( "#portfolio-carousel-gallery" ).hide();
                $('.thumbnail-grid').isotope( 'layout');
            }          
        });
    
        $('#navbar').on( 'show.bs.collapse', function(e) {
            $('.hamburger-icon').addClass('hamburger-close-x');
            $('#content-container').removeClass('col-sm-12').addClass('col-sm-9');
            $('#navbar-container').removeClass('navbar-menu-collapsed');
        });
        $('#navbar').on( 'shown.bs.collapse', function(e) {
            updateGrids();
        });
        $('#navbar').on( 'hide.bs.collapse', function(e) {
            $('.hamburger-icon').removeClass('hamburger-close-x');
            $('#navbar-container').addClass('navbar-menu-collapsed');
        });
        $('#navbar').on( 'hidden.bs.collapse', function(e) {
            
            $('#content-container').removeClass('col-sm-9').addClass('col-sm-12');
            updateGrids();
        });

    }

    function makeSectionTransition (transitionFrom,transitionTo, animFrom, animTo) {
        transitionFrom = (transitionFrom || "").trim().toLowerCase();
        transitionTo = (transitionTo || "").trim().toLowerCase();
        animFrom = (animFrom || "fadeOut");
        animTo = (animTo || "fadeIn");
        $('#content-' + transitionFrom).animateCss(animFrom,'',function(){
            $('.section-content.active').removeClass('active');
            $('#content-' + transitionTo).css('opacity','0');
            $('#content-' + transitionTo).addClass('active').animateCss(animTo,'', function(){
                $('#content-' + transitionTo).css('opacity','1');
                if (transitionTo === 'gallerries') {
                    updateGrids();
                }
            });
        })
    }

    function updatePortfolioGallery(cachedImgs, portName) {
    var htmlCode = "";
    var indicators = "";
    var indicator ="";
    var index = 0;

        for (var i=0; i < cachedImgs.length; i++) {
            if (cachedImgs[i].datatag.trim().toLowerCase() === portName) {

                (index === 1) ? active = "active" : active = "";
                (index === 1) ? indicator = "class='active'" : indicator = "";
                if (index > 0) {
                    htmlCode += "<div class='carousel-item " + active + "'><img class='d-block w-100' src=" + cachedImgs[i].image_path + " alt= '" + cachedImgs[i].image_alt + "'></div>";    
                    indicators += "<li data-target='#portfolio-carousel' data-slide-to='" + (index - 1) + "' " + indicator + "></li>";
                }
                index++;
            }
        }
        $('#js-portfolio-carousel-inner').html(htmlCode);
        $('#js-portfolio-carousel-indicators').html(indicators);
    }

    function updateGrids() {
        setTimeout(function(){
            // console.log('updateGrids called');
            if ($("#thumbnail-portfolio-gallery" ).is(':visible')) {
                $('.thumbnail-grid').isotope('layout');
            }
            if ($("#main-gallery" ).is(':visible')) {
                $('.grid').isotope('layout');
            }
        },330);
    }

    function getActivePortfolioName() {
        return $('#portfolios-menu .nav-item.active').children().data('thumbnailportfolio');
    }

    return {
        isMobile: isMobile,
        getActivePortfolioName: getActivePortfolioName,
        makeSectionTransition: makeSectionTransition,
        updateGrids: updateGrids,
        initNavigationListeners: initNavigationListeners
    }

});

