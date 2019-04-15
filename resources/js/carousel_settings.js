$(function() {

    $("#home-carousel").carousel({
      interval: 4000,
      ride: 'carousel'
    });
    $("#portfolio-carousel").carousel({
      interval: 10000
    });     

});

$.fn.extend({
  animateCss: function(animationName, delay, callback) {
      var self = this;
      if (typeof delay !=='number') {delay =0;}
      var animationEnd = (function(el) {
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

  setTimeout(function(){
      self.addClass('animated ' + animationName).one(animationEnd, function() {
          $(this).removeClass('animated ' + animationName);
          if (typeof callback === 'function') {
              callback();
          }
      });
  }, delay);
  return self;
  }
});


// function initPublications() {
//     $("#publication-carousel_01").carousel({
//       interval: 3000
//     }); 
//     $("#publication-carousel_02").carousel({
//       interval: 3000
//     }); 
//     $("#publication-carousel_03").carousel({
//       interval: 3000
//     });
// };

