/**
 * gallery-slider.js — fetch every image under assets/images/gallery/**
 * and feed them into the homepage marquee slider.
 */
(function () {
  var SLIDER_DURATION_SECONDS = 12;

  function init() {
    var section = document.getElementById('section-gallery');
    var track = document.getElementById('gallerySliderTrack');
    if (section) {
      section.style.cursor = 'pointer';
      section.setAttribute('tabindex', '0');
      section.setAttribute('role', 'link');
      section.setAttribute('aria-label', 'Open gallery page');

      section.addEventListener('click', function (e) {
        if (e.target.closest('a, button, input, textarea, select')) return;
        window.location.href = 'gallery.html';
      });

      section.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.href = 'gallery.html';
        }
      });
    }

    if (!track) return;

    // Apply speed immediately so slider is fast even before/without feed data.
    track.style.animationDuration = SLIDER_DURATION_SECONDS + 's';

    fetch('gallery-feed.php', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (images) {
        if (!Array.isArray(images) || images.length === 0) return;

        var html = images.map(function (entry) {
          var src = typeof entry === 'string' ? entry : entry.thumb;
          return '<div class="gallery-slide">' +
                   '<a href="gallery.html" class="gallery-slide-link" aria-label="Open gallery page">' +
                     '<img src="' + src + '" alt="" loading="lazy" decoding="async">' +
                   '</a>' +
                 '</div>';
        }).join('');

        // Duplicate once so the -50% keyframe loops seamlessly.
        track.innerHTML = html + html;

        // Keep runtime speed consistent after slides are injected.
        track.style.animationDuration = SLIDER_DURATION_SECONDS + 's';
      })
      .catch(function (err) { console.error('gallery-feed failed:', err); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
