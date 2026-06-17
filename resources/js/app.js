import { initAnimateCss } from './animatecss.js';
import { Site } from './siteinit.js';
import { GalleriesController } from './galleries.js';
import { initFormListener } from './ajax_contact_form.js';

export function initApp() {
  $(function () {
    initAnimateCss();
    Site.getSiteData(function () {
      GalleriesController();
    });
    initFormListener();
  });
}

initApp();
