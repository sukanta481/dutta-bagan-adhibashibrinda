/**
 * interactions.js — jQuery
 * Hover effects, cursor follower, misc DOM toggles.
 * Do NOT use jQuery for scroll detection (GSAP handles that).
 * Do NOT use jQuery for state management (Vue handles that).
 */

$(function () {
  function initInteractions() {

  /* ============================================================
     NAV LINK HOVER — ink-underline effect
     ============================================================ */
  $('.hero-nav-links a').each(function () {
    // Each link needs a span wrapper for the underline trick
    const text = $(this).text();
    $(this).html('<span class="link-inner">' + text + '</span>');
  });


  /* ============================================================
     VIDEO PiP — click to expand back toward center (UX extra)
     Works after GSAP has moved video to corner.
     ============================================================ */
  let pipExpanded = false;

  $('#hero-video-pip').on('click', function () {
    if (!pipExpanded) {
      gsap.to(this, {
        width:        '480px',
        borderRadius: '14px',
        duration:     0.45,
        ease:         'power2.out'
      });
      $(this).addClass('pip--expanded');
      pipExpanded = true;
    } else {
      gsap.to(this, {
        width:        '270px',
        borderRadius: '10px',
        duration:     0.35,
        ease:         'power2.in'
      });
      $(this).removeClass('pip--expanded');
      pipExpanded = false;
    }
  });

  // Reset PiP expand state when user scrolls back to top
  $(window).on('scroll', function () {
    if ($(window).scrollTop() < 60 && pipExpanded) {
      $('#hero-video-pip').removeClass('pip--expanded');
      pipExpanded = false;
    }
  });


  /* ============================================================
     GALLERY GRAYSCALE REVEAL (wired up when section exists)
     ============================================================ */
  $(document).on('mouseenter', '.gallery-photo', function () {
    $(this).find('img').css('filter', 'grayscale(0%) brightness(1.04)');
    $(this).find('.photo-caption').stop(true).slideDown(280);
  }).on('mouseleave', '.gallery-photo', function () {
    $(this).find('img').css('filter', 'grayscale(100%)');
    $(this).find('.photo-caption').stop(true).slideUp(200);
  });

  }

  if (window.layoutReady && typeof window.layoutReady.then === 'function') {
    window.layoutReady.then(initInteractions);
  } else {
    initInteractions();
  }

});


/* ============================================================
   INLINE UI STYLES — injected so no extra file needed
   ============================================================ */
(function injectCursorStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Nav link underline ink effect */
    .hero-nav-links a { position: relative; }
    .hero-nav-links a .link-inner {
      position: relative;
      display: inline-block;
    }
    .hero-nav-links a .link-inner::after {
      content: '';
      position: absolute;
      bottom: -2px; left: 0;
      width: 0; height: 1px;
      background: var(--accent-red-soft);
      transition: width 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .hero-nav-links a:hover .link-inner::after { width: 100%; }

    /* PiP click expand hint */
    #hero-video-pip { cursor: pointer; }
    #hero-video-pip.pip--expanded {
      box-shadow: 0 40px 120px rgba(26, 20, 16, 0.28);
    }
  `;
  document.head.appendChild(style);
}());
