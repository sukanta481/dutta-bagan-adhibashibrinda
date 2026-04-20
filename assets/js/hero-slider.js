/**
 * hero-slider.js — Crossfade auto-slider for homepage hero images.
 * Cycles through .hero-slide-img elements every 5 seconds with a smooth fade.
 */
(function () {
  var INTERVAL = 5000; // 5 seconds per slide

  function init() {
    var slides = document.querySelectorAll('.hero-slide-img');
    if (slides.length < 2) return;

    var current = 0;

    setInterval(function () {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, INTERVAL);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
