/**
 * gallery-slider.js — Transform-based infinite auto-slider
 * with native touch-swipe support on mobile.
 *
 * Strategy: Use CSS transform: translateX() for smooth auto-scrolling,
 * combined with touch event handlers for manual swiping.
 * Images are duplicated so the loop resets seamlessly.
 */
(function () {
  var SPEED = 0.5; // px per frame (auto-scroll speed)
  var currentX = 0; // accumulated translateX offset (negative = scrolled right)
  var rafId = null;
  var isPaused = false;

  // Touch-swipe state
  var touchStartX = 0;
  var touchDeltaX = 0;
  var isSwiping = false;

  function init() {
    var wrapper = document.querySelector('.gallery-slider-wrapper');
    var track = document.getElementById('gallerySliderTrack');

    if (!wrapper || !track) return;

    /* ── Desktop: pause on hover ── */
    wrapper.addEventListener('mouseenter', function () { isPaused = true; });
    wrapper.addEventListener('mouseleave', function () { isPaused = false; });

    /* ── Fetch gallery images ── */
    fetch('gallery-feed.php', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (images) {
        if (!Array.isArray(images) || images.length === 0) return;

        var html = images.map(function (entry) {
          var src = typeof entry === 'string' ? entry : entry.thumb;
          return '<div class="gallery-slide">' +
                   '<a href="gallery.html" class="gallery-slide-link" aria-label="Open gallery page">' +
                     '<img src="' + src + '" alt="" loading="lazy" decoding="async" draggable="false">' +
                   '</a>' +
                 '</div>';
        }).join('');

        // Duplicate the set for seamless infinite loop
        track.innerHTML = html + html;

        // Wait for images to get initial layout before measuring
        requestAnimationFrame(function () {
          startAutoSlide(wrapper, track);
          setupTouchSwipe(wrapper, track);
        });
      })
      .catch(function (err) { console.error('gallery-feed failed:', err); });
  }

  /* ── Auto-slide loop ── */
  function startAutoSlide(wrapper, track) {
    var halfWidth = track.scrollWidth / 2;

    function tick() {
      if (!isPaused && !isSwiping) {
        currentX -= SPEED;

        // Seamless reset: when we've scrolled past the first set, jump back
        if (Math.abs(currentX) >= halfWidth) {
          currentX += halfWidth;
        }
      }

      track.style.transform = 'translateX(' + currentX + 'px)';
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
  }

  /* ── Touch swipe support ── */
  function setupTouchSwipe(wrapper, track) {
    var halfWidth = track.scrollWidth / 2;

    wrapper.addEventListener('touchstart', function (e) {
      isSwiping = true;
      touchStartX = e.touches[0].clientX;
      touchDeltaX = 0;
    }, { passive: true });

    wrapper.addEventListener('touchmove', function (e) {
      if (!isSwiping) return;
      var dx = e.touches[0].clientX - touchStartX;
      touchDeltaX = dx;

      // Apply swipe offset on top of the current auto-scroll position
      track.style.transform = 'translateX(' + (currentX + touchDeltaX) + 'px)';
    }, { passive: true });

    wrapper.addEventListener('touchend', function () {
      // Commit the swipe delta into the running offset
      currentX += touchDeltaX;

      // Normalise so we stay within the valid scroll range
      if (Math.abs(currentX) >= halfWidth) {
        currentX += halfWidth;
      }
      if (currentX > 0) {
        currentX -= halfWidth;
      }

      touchDeltaX = 0;
      isSwiping = false;
    }, { passive: true });
  }

  /* ── Bootstrap ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
