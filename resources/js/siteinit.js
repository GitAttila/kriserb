var Site = (function () {
    var URL = "./resources/data/site.json";

    function getSiteData(funcCB) {
        if (typeof funcCB !== 'function') {funcCB = function(){}};

        $.getJSON( URL)
        .done(function (data) {
            console.log('site data loaded succesfully...');
            // console.log(data);

            socmediaHTML = getSocialMediaSnippet(data);
            $('[data-site="socialmedia"]').html(socmediaHTML);
            contactHTML = getContactSnippet(data);
            $('[data-site="contactinfo"]').html(contactHTML);
            pressHTML = getPressSnippet(data);
            $('[data-site="press"]').html(pressHTML);

            funcCB();
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Request Failed: " + err);
            $('#content-spinner .spinner-msg').addClass('spinner-msg-alert').html("Could not load the site data file.</br> Check console for more detail.");    
            
            // funcCB();
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

    function getContactSnippet(data) {
        htmlCode ='';
        if (data.contactinfo) {
            htmlCode += '<div class="contact-divider col-xs-12 col-sm-5 col-md-4">'
            htmlCode += '<div class="contact-qrcode">'
            htmlCode += '<img src="' + data.contactinfo.qrcode.path + '" alt="' + data.contactinfo.qrcode.alt + '" >';
            htmlCode += '</div></div><div class="contact-card contact-divider col-xs-12 col-sm-7 col-md-8">';
            htmlCode += '<h3>' + data.contactinfo.contactmessage + '</h3>';
            htmlCode += '<address>';
            $(data.contactinfo.email).each(function(key,val){
                val.emailaddress = val.emailaddress.trim();
                val.icon = val.icon.trim();
                if (val.emailaddress!=='' && val.icon!=='') {
                    htmlCode += '<p><i class="icon ' + val.icon + '"></i>' + val.emailaddress + '</p>';
                }
            });
            $(data.contactinfo.phone).each(function(key,val){
                val.icon = val.icon.trim();
                val.number = val.number.trim();
                if (val.icon!=='' && val.number!=='') {
                    htmlCode+= '<p><i class="icon ' + val.icon + '"></i>' + val.number + '</p>';
                }
            });
            htmlCode += '</address>';

        }
        return htmlCode;
    }

    function getPressSnippet(data) {
        htmlCode ='';
        htmlCodeCouple = '';
        if (data.press) {
            if (data.press.record) {
                let lenOfRecs = data.press.record.length;
                $(data.press.record).each(function(key,val){
                    key = key + 1;
                    htmlCodeCouple += buildPressSnippet(val);
                    if (key !== 0 && key%2 === 0) {
                        htmlCodeCouple = '<div class="row dotted-spaced-light row-press">' + htmlCodeCouple + '</div>';
                        htmlCode += htmlCodeCouple;
                        htmlCodeCouple = '';
                    } else if (key === lenOfRecs) {
                        htmlCodeCouple = '<div class="row dotted-spaced-light row-press">' + htmlCodeCouple + '</div>';
                        htmlCode += htmlCodeCouple;
                    }
                });
            }
        }

        return htmlCode;

        //helper function
        function buildPressSnippet(jsonRecord) {
            var html = '';
            var link = '';
            if (jsonRecord.link) {
                jsonRecord.link.path = jsonRecord.link.path.trim();
                jsonRecord.link.icon = (jsonRecord.link.icon || 'ion-ios-open').trim().toLowerCase();
                jsonRecord.link.text =(jsonRecord.link.text || "visit").trim().toUpperCase();
                if (jsonRecord.link.path) {
                    link = '<a class="press-link" href="' + jsonRecord.link.path + '" target="_blank">';
                    link += '<i class="icon ' + jsonRecord.link.icon +'"></i> ' + jsonRecord.link.text +' </a>';
                }
            }
            jsonRecord.text = jsonRecord.text.trim();
            jsonRecord.title = jsonRecord.title.trim();
            if (jsonRecord.title!=='' && jsonRecord.text!=='') {
                html += '<div class="col-xs-12 col-sm-6"><div class="row"><div class="col-xs-12 col-lg-4">';
                html += '<img class="press-logo" src="' + jsonRecord.medialogo.path + '" alt="' + jsonRecord.medialogo.alt + '">';
                html += '</div><div class="col-xs-12 col-lg-8">';
                html += '<h3>' + jsonRecord.title  + '</h3>';
                html += '<h4' + jsonRecord.subtitle  + '</h4>';
                html += '<p>' + jsonRecord.text  + '</p>';
                html += '<p class="font-title">';
                html += link + '</p></div></div></div>';
            }
            return html;
        }
    }

    return {
        getSiteData: getSiteData
    }

})();

