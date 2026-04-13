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
     1. PAGE-LOAD ENTRANCE — cinematic fade-in on hero
     ============================================================ */
  const introTl = gsap.timeline({ delay: 0.3 });

  introTl
    .from('#hero-nav', {
      opacity: 0,
      y: -16,
      duration: 0.7,
      ease: 'power2.out'
    })
    .from('.hero-intro-label', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.3')
    .from('.hero-big-word', {
      opacity: 0,
      y: 40,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.4')
    .from('#hero-scroll-hint', {
      opacity: 0,
      duration: 0.6
    }, '-=0.2');


  /* ============================================================
     2. SCROLL-DRIVEN ANIMATIONS
     ============================================================ */

  // Safety reset: if any previous GSAP run left inline styles, restore hero nav.
  gsap.set('#hero-nav', { clearProps: 'opacity,transform,visibility' });

  /* Keep hero nav visible, don't fade out */

  gsap.to('#hero-scroll-hint', {
    opacity: 0,
    scrollTrigger: {
      trigger: '#section-hero',
      start: 'top top',
      end: '5% top',
      scrub: true
    }
  });

  /* Fade hero foreground out within the 100vh scroll travel */
  gsap.to('#hero-text, #hero-scroll-hint', {
    opacity: 0,
    y: -40,
    ease: 'none',
    scrollTrigger: {
      trigger: '#section-hero',
      start: '5% top',
      end: '42% top',
      scrub: true
    }
  });

  /* Hide hero video only after hero section fully leaves viewport */
  ScrollTrigger.create({
    trigger: '#section-hero',
    start: 'bottom top',
    onEnter: () => {
      document.getElementById('hero-video-fixed').classList.add('is-hidden');
    },
    onLeaveBack: () => {
      document.getElementById('hero-video-fixed').classList.remove('is-hidden');
    }
  });

  /* Show sticky header when scrolling past hero */
  ScrollTrigger.create({
    trigger: '#section-hero',
    start: 'bottom top',
    onEnter: () => {
      document.getElementById('sticky-header').classList.add('is-visible');
    },
    onLeaveBack: () => {
      document.getElementById('sticky-header').classList.remove('is-visible');
      gsap.set('#hero-nav', { clearProps: 'opacity,transform,visibility' });
    }
  });

  /* Show about us background when scrolling to about section */
  ScrollTrigger.create({
    trigger: '#section-about',
    start: 'top 85%',
    end: 'bottom 15%',
    onEnter: () => {
      document.getElementById('about-bg-fixed').classList.add('is-visible');
    },
    onLeave: () => {
      document.getElementById('about-bg-fixed').classList.remove('is-visible');
    },
    onEnterBack: () => {
      document.getElementById('about-bg-fixed').classList.add('is-visible');
    },
    onLeaveBack: () => {
      document.getElementById('about-bg-fixed').classList.remove('is-visible');
    }
  });

  /* Show gallery background when scrolling to gallery section */
  ScrollTrigger.create({
    trigger: '#section-gallery',
    start: 'top 85%',
    end: 'bottom 15%',
    onEnter: () => {
      document.getElementById('gallery-bg-fixed').classList.add('is-visible');
    },
    onLeave: () => {
      document.getElementById('gallery-bg-fixed').classList.remove('is-visible');
    },
    onEnterBack: () => {
      document.getElementById('gallery-bg-fixed').classList.add('is-visible');
    },
    onLeaveBack: () => {
      document.getElementById('gallery-bg-fixed').classList.remove('is-visible');
    }
  });

  /* Gallery background parallax — slow vertical drift as user scrolls */
  gsap.to('.gallery-bg-img', {
    yPercent: -15,
    ease: 'none',
    scrollTrigger: {
      trigger: '#section-gallery',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });


  /* ============================================================
     3. ABOUT US SECTION ANIMATIONS
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
     4b. THEME HIGHLIGHT SECTION ANIMATIONS
     ============================================================ */

  gsap.from('#section-theme-highlight .anim-fadeup', {
    opacity:  0,
    y:        40,
    duration: 0.9,
    stagger:  0.15,
    ease:     'power3.out',
    scrollTrigger: {
      trigger:       '#section-theme-highlight',
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