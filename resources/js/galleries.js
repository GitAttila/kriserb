var galleryCode;                                                    // Defining global variable to cache the whole gallery as html code
var cached =[];                                                     // Defining global variable to cache the whole gallery as json objects
var portfolioName;                                                  // Defining global variable to store curretn portfolio name

$(function() {
    
    var JSON_URL = "./resources/data/gallery.json";                   // Declare the path to json file

    loadJsonGalleries(JSON_URL);                                    // Funciton that loads JSON data and writes them into the page
    
    function loadJsonGalleries(url) {                                              // Declare variable      
        $.ajax({
            beforeSend: function(xhr) {                             // Before requesting data
                if (xhr.overrideMimeType) {                         // If supported
                    xhr.overrideMimeType("application/json");       // set MIME to prevent errors
                }
            }
        });

        $.getJSON(url)                                              
        .done(function(data){                                     
            var rqstData = data;                                    
            var randomImages; 

            cached = cacheGallery(rqstData);
            buildPortfolioMenu(rqstData);
            randomImages = getRandomImages(rqstData, 7);
            updateHomeGallery(randomImages);

            galleryCode = getGallery(rqstData);
            $('#main-gallery>.grid').html(galleryCode);

            thumbnailGalleryCode = buildThumbnailGallery(cached);
            $('#thumbnail-portfolio-gallery').html(thumbnailGalleryCode);

            updatePortfolioGallery(portfolioName);
            
            var navigation = Navigation();
            
            var $grid = $('.grid');
            var $thumbnailGrid = $('.thumbnail-grid');
            var $imagesToCheckContainer = $('.main-view');

            console.log($imagesToCheckContainer.find('img').length);

            $thumbnailGrid.isotope({
                itemSelector: '.grid-item',
                masonry: {
                    columnWidth: '.grid-sizer2'
                }
            });

            $grid.isotope({
                itemSelector: '.grid-item',
                masonry: {
                    columnWidth: '.grid-sizer'
                }
            });

            $($imagesToCheckContainer).imagesLoaded(function(){
                
                setTimeout(function(){
                    $('#content-spinner').animateCss("fadeOut", "", function(){
                        $('#content-spinner').addClass('hidden');
                        $('#content-container').removeClass('hidden');
                        $('#content-home').animateCss('fadeIn');
                    });
                },1000);
                
            });  // end of Images Loaded function() for thmubmnail-portfolio-gallery
            
                /* ---------- event listener for portfolios-menu slideup/down ---------- */
    
                // $('.js-gallerymenu-toggle').on('click', function(event) { 
                //     event.stopPropagation();
                //     $('#galleries_container').fadeIn(500);
                //     $('#ajax-content').fadeOut(500);
                //     //console.log("inside of event listener: Gallery menu ");
                //     //console.log("#portfolios-menu visibility:  " + $('#portfolios-menu').is(':visible'));

                //     if (!($('#portfolios-menu').is(':visible'))) {
                //         portfolioName = "";
                        
                //         $( "#home-gallery" ).fadeOut(500).promise().done(function() {
                        
                //             $( "#thumbnail-portfolio-gallery" ).fadeIn(700);
                //             $thumbnailGrid.isotope('layout');
                //         });
                        
                //         $( "#main-gallery" ).hide();
                //         $( "#portfolio-carousel-frame" ).hide();
                        
                //     } else {
                //         $( "#thumbnail-portfolio-gallery" ).fadeOut(500).promise().done(function() {
                //             $( "#home-gallery" ).fadeIn(700);
                //         });
                        
                //         $( "#main-gallery" ).hide();
                //         $( "#portfolio-carousel-frame" ).hide();
                //     }

                //     $( "#portfolios-menu").slideToggle();    
                //     $( ".js-gallerymenu-toggle>a>span>.menu-up" ).toggle();
                //     $( ".js-gallerymenu-toggle>a>span>.menu-down" ).toggle();

                // });     
                    
                /* ---------- event listener for portfolios on the menu ---------- */

                // $('#portfolios-menu').on( 'click','li>a', function(event) {
                //     event.stopPropagation();
                //     portfolioName = this.text.trim().toLowerCase();
                //     console.log("inside of click event for portfolios ");
                //     console.log("portfolioName: ***" + portfolioName+ "***"); 

                //     updateMainGallery(portfolioName);
                //     updatePortfolioGallery(portfolioName);
                    
                //     $( "#thumbnail-portfolio-gallery" ).hide();
                //     $( "#portfolio-carousel-frame" ).hide();
                //     $( "#main-gallery" ).hide();
                    
                //     $grid.imagesLoaded( function() {
                //         $grid.isotope({
                //         // options...
                //             columnWidth: '.grid-sizer',
                //             itemSelector: '.grid-item',
                //             percentPosition: true,
                //             isAnimated: true,
                //                 animationOptions: {
                //                 duration: 700,
                //                 easing: 'linear',
                //                 queue: false
                //                 }
                //         });
                //         $( "#main-gallery" ).show();
                //         $grid.isotope('layout');
                //     });

                // });  // on click event ENDS 
            
                /* ---------- event listener for grid items to open Thumbnail Grid gallery ---------- */
            
                // $thumbnailGrid.on( 'click','.grid-item', function(event) {
                //     event.stopPropagation();  
                //     $this = $(this);
                //     portfolioName = $this.data('tag').trim().toLowerCase();

                //     console.log("portfolioName: +++" + portfolioName+ "+++"); 

                //     updateMainGallery(portfolioName);

                //     $( "#thumbnail-portfolio-gallery" ).hide();
                //     $( "#portfolio-carousel-frame" ).hide();
                //     $( "#main-gallery" ).hide();
                    
                //     $grid.imagesLoaded( function() {
                //         $grid.isotope({
                //         // options...
                //             columnWidth: '.grid-sizer',
                //             itemSelector: '.grid-item',
                //             percentPosition: true,
                //             isAnimated: true,
                //                 animationOptions: {
                //                 duration: 700,
                //                 easing: 'linear',
                //                 queue: false
                //                 }
                //         });
                //         $( "#main-gallery" ).show();
                //         $grid.isotope('layout');
                //     });

                // });
            
                /* ---------- event listener for grid items to open portfolios gallery ---------- */
                
                $('.grid').on( 'click','.grid-item', function() {
                    
                    console.log("inside of event listener for .portfolio-text-box p : " + $(this));
        
                    if ($(this).hasClass('portfolio-text-box')) {
                        $(this).toggleClass('gigante');
                        $( ".max-min-button>.ion-ios-expand" ).toggle();
                        $( ".max-min-button>.ion-ios-contract" ).toggle();
                        
                        $('.grid').isotope('layout');
                        $(this).one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
                                function(event) {
                                $('.grid').isotope('layout');
                                });
                    } else {
                        $( "#main-gallery" ).hide();
                        $( "#portfolio-carousel-frame" ).show();
                        $('.grid').isotope('layout');
                        
                        var $slideNum = $(this).index();
                        $slideNum = $slideNum -1;
                        
                        console.log ("clicked on number:  " + $slideNum);
                        
                        updatePortfolioGallery(portfolioName);
                        
                        console.log ("portfolioName:  " + portfolioName);
                        
                        $( "#portfolio-carousel" ).carousel($slideNum);
                    }
                });
            /* ---------- event listener for a return icon to move out of a gallery  ---------- */
            
                $('.return-from-portfolio').on( 'click', function() {
                    if ($('#portfolio-carousel-frame').is(':visible')) {
                        
                        //console.log(" portfolio carousel frame is visible ");
                        
                        $( "#portfolio-carousel-frame" ).hide();
                        $( "#main-gallery" ).show();
                        $('.grid').isotope( 'layout');
                    } else {
                        
                        //console.log(" portfolio carousel frame is not visible ");
                        
                        $( "#thumbnail-portfolio-gallery" ).show();
                        $( "#main-gallery" ).hide();
                        $( "#portfolio-carousel-frame" ).hide();
                        $thumbnailGrid.isotope( 'layout');
                    }          
                });
            
            /* ---------- function to update portfolio gallery ---------- */

            function updateMainGallery(portName) {
                $galleryEls = $(galleryCode);

                var selected = $galleryEls.find("[data-tag ='" + portName + "']");
                var toRemove = $(".grid").find("div");
                    
                    $('.grid').isotope( 'remove', toRemove );  //$('.grid-item')
                    
                    if (selected.eq(1).hasClass('grid-sizer')) {
                        $('.grid').prepend(selected).isotope( 'prepended', selected );
                    } else {
                        selected.eq(1).addClass('grid-sizer');
                        $('.grid').prepend(selected).isotope( 'prepended', selected );
                    }

            }
            
            function buildThumbnailGallery(images) {
                var txt = "";
                var gridclass = "";           
                //console.log("images.length : " + images.length);              
                for (var i=0; i < images.length; i++) {
                    if (i === 0) {
                        gridclass = " grid-sizer2";
                    } else {
                        gridclass = "";
                    }               
                    //console.log("i : " + i + " ___ gridclass + " + gridclass);
                    //console.log("lead photo : " + images[i].lead_photo);          
                    if (images[i].portfolio_description_en !== "image" ) {
                        txt += "<div class='grid-item grid-item--width3" + gridclass + "' data-tag='" + images[i].datatag.trim().toLowerCase() + "' data-gallerylink='" + images[i].datatag.trim().toLowerCase() + "'>";
                        txt += "<div class='thumbnail-wrapper'><h3 class='thumbnail-title'>" + images[i].datatag.trim().toLowerCase() + "</h3>"
                        txt += "<div class='thumbnail-image-wrapper'>"
                        txt += "<img src='" + images[i].lead_photo + "' alt=''></div></div></div>";        
                    } 
                }  //end of 'for' statement         
                txt = "<div class='thumbnail-grid'>" + txt + "</div>";              
                // console.log("Thumbnail Portfolio Code :  +++" + txt + "+++ ");         
                return txt;
            }
            
            function updatePortfolioGallery(portName) {
            var htmlCode = "";
            var indicators = "";
            var indicator ="";
            var index = 0;

            //console.log("cached length: " + cached.length);
            //console.log("inside of function udpatePortGal: potf name: " + cached[0].datatag);    

            for (var i=0; i < cached.length; i++) {
                if (cached[i].datatag.trim().toLowerCase() === portName) {

                    //console.log("1st cond - cached[i].datatag.trim().toLowerCase(): " + cached[i].datatag.trim().toLowerCase());

                    (index === 1) ? active = "active" : active = "";
                    (index === 1) ? indicator = "class='active'" : indicator = "";
                    if (index > 0) {
                        htmlCode += "<div class='carousel-item " + active + " '><img class='d-block w-100' src=" + cached[i].image_path + " alt= '" + cached[i].image_alt + "'></div>";    
                        indicators += "<li data-target='#portfolio-carousel' data-slide-to='" + (index - 1) + "' " + indicator + "></li>";
                        //console.log("image path: " + cached[i].image_path);
                        //console.log("image alt: " + cached[i].image_alt);
                        //console.log(htmlCode);
                    }
                    index++;
                }
            }
            $('#js-portfolio-carousel-inner').html(htmlCode);
            $('#js-portfolio-carousel-indicators').html(indicators);
            }          
            
        }).fail(function(err) {                                                                        // The End of .Done function()
            console.log('Error: ' + err.statusText);
            $('#content-spinner .spinner-msg').addClass('spinner-msg-alert').html("Could not load the data gallery file.</br> Check console for more detail.");            
        }).always(function() {
            console.log('requested completed...');
        });
    } /* ------------------------- The end of function ------------------------- */
        
    function buildPortfolioMenu(data) {
        var cacheportfolio = [];
        var htmlCode ="";
        
        portfolioName = data[0].portfolio_name_en.trim().toLowerCase();
        
        data.forEach(function(portfolio){
            cacheportfolio = (portfolio.portfolio_name_en).trim().toLowerCase();
            htmlCode += "<li class='nav-item'><a class='nav-link' data-gallerylink='" + cacheportfolio + "' href='#'><span>" + cacheportfolio + "</span></a></li>";       
            //console.log(cacheportfolio, portfolio.portfolio_name_en);    
        });
        // console.log(htmlCode);
        
        $('#portfolios-menu').html(htmlCode);
    }; /* ------------------------- The end of function ------------------------- */
    
    function getGallery(data) {
        var galleries = data; 
        var galleryCode = "";
        var gridclass = "";
        var txt;
        var butMaxMin = "<div class = 'max-min-button'><i class='icon ion-ios-expand'></i><i class='icon ion-ios-contract'></i></div>";
        //cached = cacheGallery(galleries); 
        
            for (var i=0; i < cached.length; i++) {
                txt = "";
                if (i === 1) {
                    gridclass = " grid-sizer";
                } else {
                    gridclass = " grid-item";
                }
                
                if (cached[i].portfolio_description_en !== "image" ) {
                    
                    if (cached[i].portfolio_description_en === "" ) {
                        txt = "";
                        galleryCode += "";
                        
                        //console.log("2nd cond: ==='': "+txt)   
                    } else { 
                        txt = "<div class='content-text-box'><h3>" + cached[i].datatag.trim() + "</h3><h4>" + cached[i].portfolio_year.trim() + "</h4>" + butMaxMin + "<p>" + cached[i].portfolio_description_en.trim() + "</p></div>";
                        gridclass += " grid-item--width2 portfolio-text-box";
                        galleryCode += "<div class='grid-item" + gridclass + "' data-tag = '" + cached[i].datatag.trim().toLowerCase() + "'>" + txt + "</div>";
                        
                        //console.log("1st cond: !=='image': "+txt)
                    }  
                } else {
                    txt = "<div class='image-wrapper'><img src='" + cached[i].image_path + "' alt='" + cached[i].image_alt +"'><div class='overlay'></div></div>";
                    galleryCode += "<div class='" + gridclass + "' data-tag = '" + cached[i].datatag.trim().toLowerCase() + "'>" + txt + "</div>";
                    
                    //console.log("3rd cond: else: img: "+txt)
                }
                
            }
            
            // galleryCode = "<div class='grid' >" + galleryCode + "</div>";
            
        // console.log("galleryCode :      "+galleryCode)
            
        return galleryCode;
    }; /* ------------------------- The end of function ------------------------- */
    
    //function initMainGallery(code) {
    //    var htmlCode = code;
    //    $('#main-gallery').html(htmlCode);
    //}; /* ------------------------- The end of function ------------------------- */
    
    function updateHomeGallery(rndImgs) {
        var htmlCode = "";
        var index = 0;
        rndImgs.forEach(function(image) {
            (index === 0) ? active = "active" : active = "";
            htmlCode += "<div class='carousel-item " + active + " '><img class='d-block w-100' src=" + image.image_path + " alt= " + image.image_alt + "></div>";
            index++;
        });
        $('#js-homecarousel-inner').html(htmlCode);
    }; /* ------------------------- The end of function ------------------------- */
    
    function getRandomImages(data, numOfRandomImages) {
        var galleries = data;
        var randomImages = [];
        var cachedCarouselImgs = [];
        var index = 0;
        
        for (var x=0; x < cached.length; x++) {
            if (cached[x].home_carousel === "true") {
                cachedCarouselImgs[index] = cached[x];
                //console.log("[index] :   " + index + " x:  " + x);
                index++;
            }
        }
        
        //console.log("cachedCarouselImgs.length :   " + cachedCarouselImgs.length)
        
        if (cachedCarouselImgs.length < numOfRandomImages) {
            numOfRandomImages = cachedCarouselImgs.length;
            console.log ("The actual number of all images is: "+ numOfRandomImages + " which is lower than defined number of random images.");
            getRNDimages(numOfRandomImages);
        } else {
            getRNDimages(numOfRandomImages);
        }
        
        function getRNDimages(numRND) {
            var duplicates = [];
            for (var i=0; i < numRND; i++) {
                var num = Math.floor((1+(cachedCarouselImgs.length-1))*Math.random())
                randomImages[i] = cachedCarouselImgs[num];    
                if (randomImages[i].image_path === undefined) {
                    //console.log("randomImages[i].image_path..." + randomImages[i].image_path);
                    i=-1;
                    //console.log("index i: after resetting:  " +i );
                }
                
                if (duplicates[num] === undefined ) {
                    duplicates[num] = 1
                } else {        
                //console.log("Found duplicate, resetting..." + duplicates[num]);         
                    i=-1;
                    duplicates = [];
                }
            }
        };
        return randomImages;
    }; /* ------------------------- The end of function ------------------------- */
    
    function cacheGallery(data) {
        var galleries = data;
        var index = 0; 
        var proIndex = 0;
        var cachedImages = []; 
        var leadPhotoPath ="";
        
        function Cacheimage(image_path, image_alt, image_name_cz, image_name_en, image_description_cz,image_description_en, lead_photo, home_carousel, datatag, author, portfolio_year, portfolio_name_cz, portfolio_name_en, portfolio_description_cz, portfolio_description_en) {
            this.image_path = image_path;
            this.image_alt = image_alt;
            this.image_name_cz = image_name_cz;
            this.image_name_en = image_name_en;
            this.image_description_cz = image_description_cz;
            this.image_description_en = image_description_en;
            this.lead_photo = lead_photo;
            this.home_carousel = home_carousel;
            this.datatag = datatag;
            this.author = author;
            this.portfolio_year = portfolio_year;
            this.portfolio_name_cz = portfolio_name_cz;
            this.portfolio_name_en = portfolio_name_en;
            this.portfolio_description_cz = portfolio_description_cz;
            this.portfolio_description_en = portfolio_description_en;
        }
            
        //console.log("galleries.length: " + galleries.length);
        //console.log("first: " + galleries[0].portfolio_description_en);
        
        for (var portfolioi = 0; portfolioi < (galleries.length); portfolioi++) {
            leadPhotoPath = "";
            for (var x = 0; x < (galleries[portfolioi].image.length); x++) {    
                if (galleries[portfolioi].image[x].lead_photo ==="true") {
                        leadPhotoPath = galleries[portfolioi].image[x].image_path;
                    } 
                    //console.log("leadPhotoPath:" + leadPhotoPath + "  x:"+ x);
            }
            for (var imagei = 0; imagei < (galleries[portfolioi].image.length); imagei++) {
                
                if (imagei === 0) {
                    cachedImages[index] = new Cacheimage();
                    cachedImages[index].portfolio_description_en = galleries[portfolioi].portfolio_description_en;
                    
                    //console.log("CachedImages[index].portf...:"+ cachedImages[index].portfolio_description_en + "index:"+ index);
                    //console.log("galleries[portfolioi].portfolio_name_en:"+ galleries[portfolioi].portfolio_name_en);
                    
                    cachedImages[index].datatag = galleries[portfolioi].portfolio_name_en;
                    cachedImages[index].portfolio_year = galleries[portfolioi].portfolio_year;
                    cachedImages[index].lead_photo = leadPhotoPath;
                    
                    //console.log("inner...CachedImages[index].lead_photo:" + cachedImages[index].lead_photo + "index:"+ index);
                    
                    index++;
                }
                cachedImages[index] = new Cacheimage();
                cachedImages[index] = galleries[portfolioi].image[imagei];                
                cachedImages[index].portfolio_description_en = "image";
                cachedImages[index].datatag = galleries[portfolioi].portfolio_name_en;
                cachedImages[index].lead_photo = leadPhotoPath;
                
                //console.log("outer...CachedImages[index].lead_photo:" + cachedImages[index].lead_photo + "index:"+ index);
                
                index++;
            }
        }
        // console.log(cachedImages);
        return cachedImages;
    }; /* ------------------------- The end of function ------------------------- */
    
});
