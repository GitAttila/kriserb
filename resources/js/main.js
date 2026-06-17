import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import imagesLoaded from 'imagesloaded';
import Isotope from 'isotope-layout';
import jQueryBridget from 'jquery-bridget';

window.$ = $;
window.jQuery = $;

imagesLoaded.makeJQueryPlugin($);
jQueryBridget('isotope', Isotope, $);

async function bootstrapApp() {
  await import('./app.js');
}

bootstrapApp().catch(error => {
  console.error(error);
});
