/**
 * gallery-slider.js — Transform-based infinite auto-slider
 * with native touch-swipe support on mobile.
 */
(function () {
  var SPEED = 0.6;     // px per frame
  var currentX = 0;    // always <= 0 (scrolled left)
  var halfWidth = 0;   // measured after images load
  var rafId = null;
  var isPaused = false;

  // Touch state
  var touchStartX = 0;
  var touchDeltaX = 0;
  var isSwiping = false;

  function init() {
    var wrapper = document.querySelector('.gallery-slider-wrapper');
    var track   = document.getElementById('gallerySliderTrack');

    if (!wrapper || !track) return;

    /* Pause auto-scroll on desktop hover */
    wrapper.addEventListener('mouseenter', function () { isPaused = true; });
    wrapper.addEventListener('mouseleave', function () { isPaused = false; });

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

        /* Duplicate for seamless loop */
        track.innerHTML = html + html;

        /* Wait until the browser has laid out the track and images
           have their natural sizes, then start everything. */
        waitForLayout(wrapper, track);
      })
      .catch(function (err) { console.error('gallery-feed failed:', err); });
  }

  /* Poll until scrollWidth is non-zero (images have layout) */
  function waitForLayout(wrapper, track) {
    if (track.scrollWidth > 10) {
      halfWidth = track.scrollWidth / 2;
      startAutoSlide(wrapper, track);
      setupTouchSwipe(wrapper, track);
    } else {
      setTimeout(function () { waitForLayout(wrapper, track); }, 50);
    }
  }

  /* ── Auto-slide loop ── */
  function startAutoSlide(wrapper, track) {
    function tick() {
      if (!isPaused && !isSwiping) {
        currentX -= SPEED;

        /* When we've scrolled the full first-set width, silently jump back */
        if (currentX <= -halfWidth) {
          currentX += halfWidth;
        }
      }

      track.style.transform = 'translateX(' + currentX + 'px)';
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
  }

  /* ── Touch-swipe ── */
  function setupTouchSwipe(wrapper, track) {
    wrapper.addEventListener('touchstart', function (e) {
      isSwiping = true;
      touchStartX = e.touches[0].clientX;
      touchDeltaX = 0;
    }, { passive: true });

    wrapper.addEventListener('touchmove', function (e) {
      if (!isSwiping) return;
      touchDeltaX = e.touches[0].clientX - touchStartX;
      track.style.transform = 'translateX(' + (currentX + touchDeltaX) + 'px)';
    }, { passive: true });

    wrapper.addEventListener('touchend', function () {
      /* Commit delta */
      currentX += touchDeltaX;

      /* Keep inside valid range */
      if (currentX <= -halfWidth) currentX += halfWidth;
      if (currentX > 0)           currentX -= halfWidth;

      touchDeltaX = 0;
      isSwiping   = false;
    }, { passive: true });
  }

  /* ── Bootstrap ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
