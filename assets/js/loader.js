/**
 * loader.js — minimal page loader (black bg, logo, three bouncing dots).
 * No GSAP, no fancy transitions. Hides on window load.
 */
(function () {
  var LOGO_SRC = 'assets/images/Dutta bagan 2.png';

  var MARKUP =
    '<div class="page-loader" id="pageLoader" role="status" aria-label="Loading">' +
      '<img src="' + LOGO_SRC + '" alt="" class="loader-logo">' +
      '<div class="loader-dots" aria-hidden="true"><span></span><span></span><span></span></div>' +
    '</div>';

  function inject() {
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', inject, { once: true });
      return;
    }
    if (document.getElementById('pageLoader')) return;

    var holder = document.createElement('div');
    holder.innerHTML = MARKUP;
    var loader = holder.firstElementChild;
    document.body.insertBefore(loader, document.body.firstChild);
    document.body.style.overflow = 'hidden';

    function finish() {
      if (!loader || loader.dataset.done) return;
      loader.dataset.done = '1';
      loader.style.display = 'none';
      document.body.style.overflow = '';
      document.dispatchEvent(new Event('loader:done'));
    }

    if (document.readyState === 'complete') {
      finish();
    } else {
      window.addEventListener('load', finish, { once: true });
      setTimeout(finish, 4000); // failsafe
    }
  }

  inject();
}());
