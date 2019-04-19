var Carousels = (function () {

    function initGalleryCarousels() {
        $("#home-carousel").carousel({
            interval: 4000,
            ride: 'carousel'
        });
        $("#portfolio-carousel").carousel({
            interval: 10000
        });
    }

    function initPublicationsCarousels() {
        $("#publication-carousel_01").carousel({
        interval: 3000
        }); 
        $("#publication-carousel_02").carousel({
        interval: 3000
        }); 
        $("#publication-carousel_03").carousel({
        interval: 3000
        });
    };

    return {
        initGalleryCarousels: initGalleryCarousels,
        initPublicationsCarousels: initPublicationsCarousels
    }

})();
