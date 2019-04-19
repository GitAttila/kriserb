var initAnimateCss = function() {

    $.fn.extend({
        animateCss: function (animationName, delay, callback) {
            var self = this;
            if (typeof delay !== 'number') {
                delay = 0;
            }
            var animationEnd = (function (el) {
                var animations = {
                    animation: 'animationend',
                    OAnimation: 'oAnimationEnd',
                    MozAnimation: 'mozAnimationEnd',
                    WebkitAnimation: 'webkitAnimationEnd',
                };
    
                for (var t in animations) {
                    if (el.style[t] !== undefined) {
                        return animations[t];
                    }
                }
            })(document.createElement('div'));
    
            setTimeout(function () {
                self.addClass('animated ' + animationName).one(animationEnd, function () {
                    $(this).removeClass('animated ' + animationName);
                    if (typeof callback === 'function') {
                        callback();
                    }
                });
            }, delay);
            return self;
        }
    });

};
