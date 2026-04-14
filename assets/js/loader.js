/**
 * loader.js — Ceremonial Reveal page loader
 * Injects a fullscreen overlay, plays a GSAP timeline, then retracts
 * like temple doors opening. Runs on every page load.
 */
(function () {
  var LOGO_SRC = 'assets/images/dutta bagan.png';

  var MARKUP =
    '<div class="page-loader" id="pageLoader" role="status" aria-label="Loading">' +
      '<div class="loader-half loader-half--top"></div>' +
      '<div class="loader-half loader-half--bottom"></div>' +
      '<div class="loader-center">' +
        '<div class="loader-glow"></div>' +
        '<svg class="loader-ring" viewBox="0 0 200 200" aria-hidden="true">' +
          '<circle cx="100" cy="100" r="92"></circle>' +
        '</svg>' +
        '<img src="' + LOGO_SRC + '" alt="" class="loader-logo">' +
      '</div>' +
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

    start(loader);
  }

  function finish(loader) {
    if (!loader) return;
    loader.style.display = 'none';
    document.body.style.overflow = '';
    document.dispatchEvent(new Event('loader:done'));
  }

  function start(loader) {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var logo = loader.querySelector('.loader-logo');

    function simpleFade() {
      setTimeout(function () {
        loader.style.transition = 'opacity 0.35s ease';
        loader.style.opacity = '0';
        setTimeout(function () { finish(loader); }, 360);
      }, 250);
    }

    function begin() {
      if (reduced) { simpleFade(); return; }
      if (typeof window.gsap !== 'undefined') {
        runTimeline(loader);
        return;
      }
      // Poll for GSAP (loaded later in page)
      var tries = 0;
      var timer = setInterval(function () {
        tries++;
        if (typeof window.gsap !== 'undefined') {
          clearInterval(timer);
          runTimeline(loader);
        } else if (tries > 80) { // ~4s
          clearInterval(timer);
          simpleFade();
        }
      }, 50);
    }

    if (logo.complete && logo.naturalWidth > 0) {
      begin();
    } else {
      var started = false;
      function once() { if (!started) { started = true; begin(); } }
      logo.addEventListener('load', once, { once: true });
      logo.addEventListener('error', once, { once: true });
      setTimeout(once, 1200); // failsafe
    }
  }

  function runTimeline(loader) {
    var gsap = window.gsap;
    var ring = loader.querySelector('.loader-ring circle');
    var circumference = 2 * Math.PI * 92;
    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = circumference;

    var tl = gsap.timeline({ onComplete: function () { finish(loader); } });

    tl.from('.loader-logo', {
      opacity: 0,
      scale: 0.7,
      duration: 0.7,
      ease: 'back.out(1.4)'
    }, 0);

    tl.to(ring, {
      strokeDashoffset: 0,
      duration: 1.0,
      ease: 'power2.inOut'
    }, 0.4);

    tl.fromTo('.loader-glow',
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1.25, duration: 0.35, repeat: 3, yoyo: true, ease: 'sine.inOut' },
      0.9);

    // Hold, then doors open
    tl.to('.loader-half--top', {
      yPercent: -100,
      duration: 0.65,
      ease: 'power3.inOut'
    }, 1.75);

    tl.to('.loader-half--bottom', {
      yPercent: 100,
      duration: 0.65,
      ease: 'power3.inOut'
    }, 1.75);

    tl.to('.loader-center', {
      opacity: 0,
      scale: 1.15,
      duration: 0.55,
      ease: 'power2.in'
    }, 1.75);
  }

  inject();
}());
