$(function () {
    initAnimateCss();
    Site.getSiteData(function(){});
    GalleriesController();
    initFormListener();
});