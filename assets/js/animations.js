/**
 * animations.js — GSAP + ScrollTrigger
 * All scroll-driven and load-time animations live here.
 * Do NOT import jQuery or touch Vue state from this file.
 */

gsap.registerPlugin(ScrollTrigger);

/* ── Wait for Vue to mount before reading the DOM ── */
document.addEventListener('vue:mounted', () => {
  setTimeout(initAnimations, 80);
});

/* Fallback: if Vue never fires the event (static sections) */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (!window._animationsInitialised) initAnimations();
  }, 350);
});


function initAnimations() {
  if (window._animationsInitialised) return;
  window._animationsInitialised = true;

  /* ============================================================
     1. PAGE-LOAD ENTRANCE — scroll hint fade
     ============================================================ */
  gsap.from('#hero-scroll-hint', {
    opacity: 0,
    duration: 0.6,
    delay: 0.5,
    ease: 'power2.out'
  });


  /* ============================================================
     2. ABOUT US SECTION ANIMATIONS
     ============================================================ */

  /* Fade-up entrance for about content elements */
  gsap.from('#section-about .anim-fadeup', {
    opacity:  0,
    y:        50,
    duration: 1,
    stagger:  0.18,
    ease:     'power3.out',
    scrollTrigger: {
      trigger:       '#section-about',
      start:         'top 70%',
      toggleActions: 'play none none none'
    }
  });

  /* Line-draw animation at bottom */
  gsap.to('.about-line-draw', {
    scaleX:    1,
    duration:  1.2,
    ease:      'power2.inOut',
    scrollTrigger: {
      trigger:       '#section-about',
      start:         'top 60%',
      toggleActions: 'play none none none'
    }
  });


       /* ============================================================
     4. ACHIEVEMENTS SECTION ANIMATIONS
     ============================================================ */

  gsap.from('#section-achievements .anim-fadeup', {
    opacity:  0,
    y:        40,
    duration: 0.9,
    stagger:  0.15,
    ease:     'power3.out',
    scrollTrigger: {
      trigger:       '#section-achievements',
      start:         'top 75%',
      toggleActions: 'play none none none'
    }
  });

  /* ============================================================
     5. GALLERY SECTION ANIMATIONS
     ============================================================ */

  gsap.from('#section-gallery .gallery-header', {
    opacity:  0,
    y:        40,
    duration: 0.9,
    ease:     'power3.out',
    scrollTrigger: {
      trigger:       '#section-gallery',
      start:         'top 75%',
      toggleActions: 'play none none none'
    }
  });

  gsap.from('#section-gallery .gallery-item', {
    opacity:  0,
    y:        40,
    duration: 0.7,
    stagger:  { each: 0.06, from: 'random' },
    ease:     'power3.out',
    scrollTrigger: {
      trigger:       '#section-gallery .gallery-grid',
      start:         'top 80%',
      toggleActions: 'play none none none'
    }
  });


  /* ============================================================
     6. THEME REVEAL SECTION ANIMATIONS
     ============================================================ */

  gsap.from('#section-theme .anim-fadeup', {
    opacity:  0,
    y:        50,
    duration: 1,
    stagger:  0.18,
    ease:     'power3.out',
    scrollTrigger: {
      trigger:       '#section-theme',
      start:         'top 70%',
      toggleActions: 'play none none none'
    }
  });

  gsap.from('#section-theme .theme-letter', {
    opacity:   0,
    y:         70,
    rotationX: -90,
    duration:  0.85,
    stagger:   0.055,
    ease:      'back.out(1.7)',
    scrollTrigger: {
      trigger:       '#section-theme .theme-name',
      start:         'top 65%',
      toggleActions: 'play none none none'
    }
  });

  gsap.from('#section-theme .theme-sub', {
    opacity:  0,
    y:        20,
    duration: 0.8,
    ease:     'power2.out',
    scrollTrigger: {
      trigger:       '#section-theme .theme-sub',
      start:         'top 80%',
      toggleActions: 'play none none none'
    }
  });


  /* ============================================================
     7. GENERIC SCROLL ENTRANCES (future sections)
     ============================================================ */
  ScrollTrigger.batch('.anim-fadeup:not(#section-about .anim-fadeup):not(#section-gallery .anim-fadeup):not(#section-theme .anim-fadeup)', {
    start:   'top 85%',
    onEnter: batch => gsap.to(batch, {
      opacity:  1,
      y:        0,
      duration: 0.9,
      stagger:  0.12,
      ease:     'power3.out'
    }),
    once: true
  });

  ScrollTrigger.refresh();
}
