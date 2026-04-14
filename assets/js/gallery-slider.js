/**
 * gallery-slider.js — fetch every image under assets/images/gallery/**
 * and feed them into the homepage marquee slider.
 */
(function () {
  function init() {
    var track = document.getElementById('gallerySliderTrack');
    if (!track) return;

    fetch('gallery-feed.php', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (images) {
        if (!Array.isArray(images) || images.length === 0) return;

        var html = images.map(function (src) {
          return '<div class="gallery-slide">' +
                   '<img src="' + src + '" alt="" loading="lazy">' +
                 '</div>';
        }).join('');

        // Duplicate once so the -50% keyframe loops seamlessly.
        track.innerHTML = html + html;

        // Scale duration so pace stays consistent regardless of count.
        var duration = Math.max(20, Math.min(90, images.length * 3));
        track.style.animationDuration = duration + 's';
      })
      .catch(function (err) { console.error('gallery-feed failed:', err); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
