var Site = (function () {
    var URL = "./resources/data/site.json";

    function getSiteData(funcCB) {
        if (typeof funcCB !== 'function') {funcCB = function(){}};

        $.getJSON( URL)
        .done(function (data) {
            console.log(data);
            
            socmediaHTML = getSocialMediaSnippet(data);
            $('[data-site="socialmedia"]').html(socmediaHTML);

            funcCB();
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Request Failed: " + err);
            funcCB();
        });
    }

    function getSocialMediaSnippet(data) {
        htmlCode ='';
        if (data.socialmedia) {
            $(data.socialmedia).each(function(key,val){
                val.link = val.link.trim();
                if (typeof val.active !== 'boolean') {
                    val.active = val.active.trim().toLowerCase();
                }
                val['open-new-window'] = val['open-new-window'].trim().toLowerCase();
                if (val['open-new-window'] === true || val['open-new-window'] === 'true') { 
                    target = ' target="_blank"';
                } else {
                    target = '';
                }
                if (val.active === true || val.active === 'true' && val.link!=='') {
                    htmlCode += '<a href="' + val.link + '"' + target + '>';
                    htmlCode += '<i class="icon ' + val['ion-icon'] + '"></i>';
                    htmlCode += '</a>';
                }
            });
        }
        return htmlCode;
    }

    return {
        getSiteData: getSiteData
    }

})();
