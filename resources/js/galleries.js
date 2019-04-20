var GalleriesController = (function(){

    console.log('gallerries data loaded successfully...');
    var galleryCode;
    var cached =[];
    var JSON_URL = "./resources/data/gallery.json";                  

    loadJsonGalleries(JSON_URL);                                    
    
    function loadJsonGalleries(url) {                                                  
        $.ajax({
            beforeSend: function(xhr) {                             
                if (xhr.overrideMimeType) {                         
                    xhr.overrideMimeType("application/json");       
                }
            }
        });

        $.getJSON(url)                                              
        .done(function(data){                                     
            var receivedData = data;                                    
            var randomImages; 

            cached = cacheGallery(receivedData);
            buildPortfolioMenu(receivedData);
            randomImages = getRandomImages(receivedData, 7);
            updateHomeGallery(randomImages);

            galleryCode = getGallery(cached);
            $('#main-gallery>.grid').html(galleryCode);

            thumbnailGalleryCode = buildThumbnailGallery(cached);
            $('#thumbnail-portfolio-gallery').html(thumbnailGalleryCode);
            
            var navigation = Navigation(cached);
            navigation.initNavigationListeners();
            Carousels.initGalleryCarousels();
            Carousels.initPublicationsCarousels();
            

            var $grid = $('.grid');
            var $thumbnailGrid = $('.thumbnail-grid');
            var $imagesToCheckContainer = $('.main-view');

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
                
            }); 
            
        }).fail(function(err) {                                                                        // The End of .Done function()
            console.log('Error: ' + err.statusText);
            $('#content-spinner .spinner-msg').addClass('spinner-msg-alert').html("Could not load the data gallery file.</br> Check console for more detail.");            
        }).always(function() {
            // console.log('request completed...');
        });
    } /* ------------------------- The end of function ------------------------- */
        
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
                txt += "<div class='grid-item grid-item--width3" + gridclass + "' data-tag='" + images[i].datatag.trim().toLowerCase() + "' data-thumbnailportfolio='" + images[i].datatag.trim().toLowerCase() + "'>";
                txt += "<div class='thumbnail-wrapper'><h3 class='thumbnail-title'>" + images[i].datatag.trim().toLowerCase() + "</h3>"
                txt += "<div class='thumbnail-image-wrapper'>"
                txt += "<img src='" + images[i].lead_photo + "' alt=''></div></div></div>";        
            } 
        }  //end of 'for' statement         
        txt = "<div class='thumbnail-grid'>" + txt + "</div>";              
        // console.log("Thumbnail Portfolio Code :  +++" + txt + "+++ ");         
        return txt;
    }
    
    function buildPortfolioMenu(data) {
        var cacheportfolio = [];
        var htmlCode ="";
        
        data.forEach(function(portfolio){
            cacheportfolio = (portfolio.portfolio_name_en).trim().toLowerCase();
            htmlCode += "<li class='nav-item'><a class='nav-link' data-thumbnailportfolio='" + cacheportfolio + "' href='#'><span>" + cacheportfolio + "</span></a></li>";         
        });
        $('#portfolios-menu').html(htmlCode);
    }; /* ------------------------- The end of function ------------------------- */
    
    function getGallery(cachedImgs) {
        var indexPortfolioImage = 0;
        var galleryHTMLCode = "";
        var gridclass = "";
        var txt;
        var butMaxMin = "<div class = 'max-min-button'><i class='icon ion-ios-expand'></i><i class='icon ion-ios-contract'></i></div>";
        
            for (var i=0; i < cachedImgs.length; i++) {
                txt = "";
                gridclass = " grid-item";
                if (cachedImgs[i].portfolio_description_en !== "image" ) {
                    indexPortfolioImage = 0;
                    if (cachedImgs[i].portfolio_description_en === "" ) {
                        txt = "";
                        galleryHTMLCode += "";
                        
                    } else { 
                        txt = "<div class='content-text-box'><h3>" + cachedImgs[i].datatag.trim() + "</h3><h4>" + cachedImgs[i].portfolio_year.trim() + "</h4>" + butMaxMin + "<p>" + cachedImgs[i].portfolio_description_en.trim() + "</p></div>";
                        gridclass += " grid-item--width2 portfolio-text-box";
                        galleryHTMLCode += "<div class='" + gridclass + "' data-tag = '" + cachedImgs[i].datatag.trim().toLowerCase() + indexPortfolioImage + "'>" + txt + "</div>";

                    }  
                } else {
                    txt = "<div class='image-wrapper'><img src='" + cachedImgs[i].image_path + "' alt='" + cachedImgs[i].image_alt +"'><div class='overlay'></div></div>";
                    galleryHTMLCode += "<div class='" + gridclass + "' data-tag = '" + cachedImgs[i].datatag.trim().toLowerCase() + indexPortfolioImage + "'>" + txt + "</div>";
                    
                }
                indexPortfolioImage++;
            }
            galleryHTMLCode = '<div class="grid-sizer"></div>' + galleryHTMLCode;
        return galleryHTMLCode;
    }; /* ------------------------- The end of function ------------------------- */
    
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
        var randomImages = [];
        var cachedCarouselImgs = [];
        var index = 0;
        
        for (var x=0; x < cached.length; x++) {
            if (cached[x].home_carousel === "true") {
                cachedCarouselImgs[index] = cached[x];
                index++;
            }
        }

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
    
    return {
        loadJsonGalleries: loadJsonGalleries,
        cachedImages: cached
    }

});
