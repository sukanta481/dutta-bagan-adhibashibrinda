/**
 * gallery-page.js - Gallery page with year filter and justified grid
 */
(function () {
  var grid, select, loading;
  var lightbox = null;
  var lightboxImg = null;
  var currentImages = [];
  var initialized = false;

  function getElements() {
    grid = document.getElementById('galleryGrid');
    select = document.getElementById('galleryYearSelect');
    loading = document.getElementById('galleryLoading');
    return grid;
  }

  function showLoading() {
    if (loading) loading.classList.add('active');
    if (grid) grid.innerHTML = '';
  }

  function hideLoading() {
    if (loading) loading.classList.remove('active');
  }

  function createLightbox() {
    if (lightbox) return;
    lightbox = document.createElement('div');
    lightbox.className = 'gallery-lightbox';
    lightbox.innerHTML = '<button class="gallery-lightbox-close" aria-label="Close">&times;</button>' +
                         '<button class="gallery-lightbox-prev btn btn-dark position-absolute top-50 start-0 translate-middle-y ms-2 ms-md-4" style="z-index: 1055; border-radius: 50%; width: 48px; height: 48px; padding: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.6); border: none;"><i class="bi bi-chevron-left text-white fs-4"></i></button>' +
                         '<img src="" alt="" style="max-height: 90vh; max-width: 100%; object-fit: contain; box-shadow: 0 0 20px rgba(0,0,0,0.5);">' +
                         '<button class="gallery-lightbox-next btn btn-dark position-absolute top-50 end-0 translate-middle-y me-2 me-md-4" style="z-index: 1055; border-radius: 50%; width: 48px; height: 48px; padding: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.6); border: none;"><i class="bi bi-chevron-right text-white fs-4"></i></button>';
    lightboxImg = lightbox.querySelector('img');
    var prevBtn = lightbox.querySelector('.gallery-lightbox-prev');
    var nextBtn = lightbox.querySelector('.gallery-lightbox-next');
    document.body.appendChild(lightbox);

    var currentIndex = 0;

    function updateLightboxImage(index) {
      if (currentImages.length === 0) return;
      if (index < 0) index = currentImages.length - 1;
      if (index >= currentImages.length) index = 0;
      currentIndex = index;
      var entry = currentImages[currentIndex];
      var full = typeof entry === 'string' ? entry : entry.full;
      lightboxImg.src = full;
    }

    lightbox.setIndex = function(index) {
      currentIndex = index;
    };

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.classList.contains('gallery-lightbox-close')) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    prevBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      updateLightboxImage(currentIndex - 1);
    });

    nextBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      updateLightboxImage(currentIndex + 1);
    });

    var touchStartX = 0;
    var touchEndX = 0;
    
    lightboxImg.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    lightboxImg.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      if (touchEndX < touchStartX - 50) updateLightboxImage(currentIndex + 1);
      if (touchEndX > touchStartX + 50) updateLightboxImage(currentIndex - 1);
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox || !lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
      if (e.key === 'ArrowLeft') {
        updateLightboxImage(currentIndex - 1);
      }
      if (e.key === 'ArrowRight') {
        updateLightboxImage(currentIndex + 1);
      }
    });
  }

  function openLightbox(src, index) {
    createLightbox();
    if (lightbox.setIndex) lightbox.setIndex(index);
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function loadImages(year) {
    showLoading();
    var url = 'gallery-feed.php' + (year ? '?year=' + encodeURIComponent(year) : '');

    console.log('[Gallery] Fetching:', url);

    var controller = new AbortController();
    var timeoutId = setTimeout(function () {
      controller.abort();
    }, 10000);

    fetch(url, { 
      cache: 'no-store',
      signal: controller.signal
    })
      .then(function (r) {
        clearTimeout(timeoutId);
        console.log('[Gallery] Response status:', r.status);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      })
      .then(function (text) {
        console.log('[Gallery] Response text length:', text.length);
        try {
          var images = JSON.parse(text);
          console.log('[Gallery] Images count:', images ? images.length : 0);
          hideLoading();
          buildGrid(images);
        } catch (e) {
          throw new Error('Invalid JSON: ' + text.substring(0, 100));
        }
      })
      .catch(function (err) {
        clearTimeout(timeoutId);
        hideLoading();
        console.error('[Gallery] Error:', err);
        if (err.name === 'AbortError') {
          if (grid) grid.innerHTML = '<p class="gallery-grid-empty">Request timed out.</p>';
        } else {
          if (grid) grid.innerHTML = '<p class="gallery-grid-empty">Error: ' + err.message + '</p>';
        }
      });
  }

  function buildGrid(images) {
    if (!grid) return;
    currentImages = images || [];
    grid.innerHTML = '';

    if (!Array.isArray(currentImages) || currentImages.length === 0) {
      grid.innerHTML = '<p class="gallery-grid-empty">No images available.</p>';
      return;
    }

    grid.className = 'masonry-grid';

    currentImages.forEach(function (entry, index) {
      var thumb = typeof entry === 'string' ? entry : entry.thumb;
      var full  = typeof entry === 'string' ? entry : entry.full;

      var itemEl = document.createElement('div');
      itemEl.className = 'masonry-item gallery-item anim-fadeup';
      itemEl.style.cursor = 'pointer';

      var imgEl = document.createElement('img');
      imgEl.src = thumb;
      imgEl.alt = 'Gallery image ' + (index + 1);
      imgEl.loading = 'lazy';
      imgEl.decoding = 'async';

      itemEl.appendChild(imgEl);
      itemEl.addEventListener('click', function () {
        openLightbox(full, index);
      });

      grid.appendChild(itemEl);
    });

    animateGridItems();
  }

  function animateGridItems() {
    if (!grid || !window.gsap) return;

    var items = grid.querySelectorAll('.gallery-item');
    if (!items.length) return;

    gsap.fromTo(items, {
      opacity: 0,
      y: 28
    }, {
      opacity: 1,
      y: 0,
      duration: 0.75,
      stagger: { each: 0.05, from: 'random' },
      ease: 'power3.out',
      clearProps: 'opacity,transform'
    });

    if (window.ScrollTrigger) {
      ScrollTrigger.refresh();
    }
  }

  function initGallery() {
    if (initialized) return;
    if (!getElements()) {
      console.log('[Gallery] Elements not found, retrying...');
      setTimeout(initGallery, 200);
      return;
    }
    initialized = true;
    console.log('[Gallery] Initializing...');

    // Bind dropdown
    if (select) {
      select.addEventListener('change', function () {
        loadImages(select.value);
      });
    }

    // Load images
    loadImages(select ? select.value : '');
  }

  // Listen for layout ready
  document.addEventListener('layout:ready', function () {
    console.log('[Gallery] layout:ready received');
    initGallery();
  });

  // Listen for vue mounted
  document.addEventListener('vue:mounted', function () {
    console.log('[Gallery] vue:mounted received');
    initGallery();
  });

  // Fallback
  if (document.readyState === 'complete') {
    console.log('[Gallery] DOM complete, initializing');
    initGallery();
  } else if (document.readyState === 'interactive') {
    document.addEventListener('DOMContentLoaded', function () {
      console.log('[Gallery] DOMContentLoaded');
      initGallery();
    });
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      console.log('[Gallery] DOMContentLoaded (late)');
      initGallery();
    });
  }

  // Rebuild on resize
  window.addEventListener('resize', function () {
    clearTimeout(window._galleryResizeTimeout);
    window._galleryResizeTimeout = setTimeout(function () {
      if (currentImages.length > 0 && grid) {
        buildGrid(currentImages);
      }
    }, 300);
  });
}());
