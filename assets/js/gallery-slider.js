/**
 * gallery-slider.js - fetch every image under assets/images/gallery/**
 * and feed them into the homepage marquee slider using a native scrolling JS loop
 * that allows flawless swiping on mobile.
 */
(function () {
  var SLIDER_SPEED = 0.8; // Smooth speed
  var isHovered = false;
  var isTouched = false;
  var rafId;
  
  function init() {
    var section = document.getElementById('section-gallery');
    var wrapper = document.querySelector('.gallery-slider-wrapper');
    var track = document.getElementById('gallerySliderTrack');

    if (section) {
      section.style.cursor = 'pointer';
    }

    if (!wrapper || !track) return;
    
    // Explicitly guarantee the track can stretch horizontally
    track.style.width = 'max-content';

    // Pause functionality for interaction
    // Mobile browsers famously trigger 'mouseenter' on tap without ever firing 'mouseleave'.
    // We safeguard this by completely separating touch logic.
    wrapper.addEventListener('mouseenter', function() { if (!isTouched) isHovered = true; });
    wrapper.addEventListener('mouseleave', function() { isHovered = false; });
    
    wrapper.addEventListener('touchstart', function() { 
      isTouched = true; 
      isHovered = false; // Disable mouse pause specifically for touch 
    }, {passive: true});
    
    wrapper.addEventListener('touchend', function() { 
      // Slight delay before auto-scroll resumes to respect native scroll momentum
      setTimeout(function() { isTouched = false; }, 1200); 
    }, {passive: true});

    fetch('gallery-feed.php', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (images) {
        if (!Array.isArray(images) || images.length === 0) return;

        var html = images.map(function (entry) {
          var src = typeof entry === 'string' ? entry : entry.thumb;
          return '<div class="gallery-slide">' +
                   '<a href="gallery" class="gallery-slide-link" aria-label="Open gallery page" draggable="false">' +
                     '<img src="' + src + '" alt="" loading="lazy" decoding="async" draggable="false">' +
                   '</a>' +
                 '</div>';
        }).join('');

        // Wrap exactly into two distinct identical groups using display:contents 
        // to maintain direct flex layout percentage calculation cleanly.
        var totalHtml = '<div style="display: contents;">' + html + '</div>' + 
                        '<div style="display: contents;">' + html + '</div>';

        track.innerHTML = totalHtml;

        // Accurate float accumulator to allow sub-pixel smooth scrolling
        var exactScrollLeft = 0;

        // Infinite scroll logic relying on native scrollLeft
        function autoScroll() {
          if (!isHovered && !isTouched) {
            exactScrollLeft += SLIDER_SPEED;
            wrapper.scrollLeft = exactScrollLeft;
            
            // The exact midpoint of 2 consecutive flex groups
            var midwayPoint = track.scrollWidth / 2;
            
            if (exactScrollLeft >= midwayPoint) {
              exactScrollLeft = 0;
              wrapper.scrollLeft = 0; 
            }
          } else {
            // Keep numerical accumulator strictly synced with physical swiping
            exactScrollLeft = wrapper.scrollLeft;
          }
          rafId = requestAnimationFrame(autoScroll);
        }

        // Delay starting the loop slightly to ensure layout repaints measure scrollWidth correctly
        setTimeout(function() {
          rafId = requestAnimationFrame(autoScroll);
        }, 150);

      })
      .catch(function (err) { console.error('gallery-feed failed:', err); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
