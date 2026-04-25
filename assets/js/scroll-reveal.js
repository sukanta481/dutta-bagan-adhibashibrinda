/* ============================================================
   SCROLL REVEAL — Premium Intersection Observer animations
   ============================================================ */
(function () {
  'use strict';

  /**
   * ScrollReveal module
   * Adds .reveal-visible class to elements when they enter the viewport,
   * triggering CSS transitions defined by .reveal-up base class.
   */
  const ScrollReveal = {
    observer: null,
    elements: [],

    /**
     * Initialize the scroll reveal system
     * @param {string} selector - CSS selector for elements to animate (default: '.reveal-up')
     * @param {number} threshold - Visibility threshold (0-1, default: 0.15)
     * @param {number} rootMargin - IntersectionObserver margin (default: '0px 0px -60px 0px')
     */
    init: function (options) {
      var opts = Object.assign({}, {
        selector: '.reveal-up',
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
      }, options);

      // Check browser support
      if (!('IntersectionObserver' in window)) {
        // Fallback: make everything visible immediately
        var fallbackEls = document.querySelectorAll(opts.selector);
        fallbackEls.forEach(function (el) {
          el.classList.add('reveal-visible');
        });
        return;
      }

      // Create IntersectionObserver instance
      this.observer = new IntersectionObserver(
        this._handleIntersect.bind(this),
        {
          threshold: opts.threshold,
          rootMargin: opts.rootMargin
        }
      );

      // Observe all matching elements
      var elements = document.querySelectorAll(opts.selector);
      elements.forEach(function (el) {
        this.observer.observe(el);
      }.bind(this));

      // Cache elements for potential unobserve
      this.elements = Array.from(elements);
    },

    /**
     * Handle intersection callbacks
     * @param {IntersectionObserverEntry[]} entries
     * @param {IntersectionObserver} observer
     */
    _handleIntersect: function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Add visible class to trigger CSS transition
          entry.target.classList.add('reveal-visible');
          // Stop observing once revealed (one-shot animation)
          observer.unobserve(entry.target);
        }
      });
    },

    /**
     * Manually register an element for reveal observation
     * @param {Element} el
     */
    register: function (el) {
      if (this.observer) {
        this.observer.observe(el);
        this.elements.push(el);
      }
    },

    /**
     * Destroy the observer and clean up
     */
    destroy: function () {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
        this.elements = [];
      }
    }
  };

  /**
   * ParallaxWatermark module
   * Applies subtle parallax movement to background watermark elements
   * using a lightweight scroll event listener with requestAnimationFrame.
   */
  const ParallaxWatermark = {
    ticking: false,
    elements: [],

    init: function (options) {
      var opts = Object.assign({}, {
        selector: '.parallax-slow',
        speed: 0.04 // Very subtle movement (0-1)
      }, options);

      // Find all parallax elements
      this.elements = Array.from(document.querySelectorAll(opts.selector));
      this.speed = opts.speed;

      if (this.elements.length === 0) return;

      // Bind and attach scroll listener
      this._onScroll = this._onScroll.bind(this);
      window.addEventListener('scroll', this._onScroll, { passive: true });
      // Initial position update
      this._update();
    },

    _onScroll: function () {
      if (!this.ticking) {
        requestAnimationFrame(this._update.bind(this));
        this.ticking = true;
      }
    },

    _update: function () {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      var halfVH = window.innerHeight / 2;

      this.elements.forEach(function (el) {
        // Calculate element position relative to viewport center
        var rect = el.getBoundingClientRect();
        var elementCenter = scrollY + rect.top + rect.height / 2;
        var distanceFromCenter = elementCenter - scrollY - halfVH;
        var yOffset = distanceFromCenter * this.speed;

        // Store the parallax offset as a CSS custom property
        // This allows CSS to layer it with other transforms (like spin animations)
        el.style.setProperty('--parallax-y', yOffset + 'px');
        
        // Check if element has a CSS animation (like spin) - if so, use CSS custom property
        // instead of overriding transform directly
        var computedStyle = window.getComputedStyle(el);
        var hasAnimation = computedStyle.animationName && computedStyle.animationName !== 'none';
        
        if (hasAnimation) {
          // Let CSS handle it via the custom property
          // The CSS will use --parallax-y in a transform if needed
        } else {
          // No animation, safe to set transform directly
          el.style.transform = 'translateY(' + yOffset + 'px)';
        }
      }.bind(this));

      this.ticking = false;
    },

    destroy: function () {
      if (this._onScroll) {
        window.removeEventListener('scroll', this._onScroll);
      }
      this.elements = [];
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      ScrollReveal.init();
      ParallaxWatermark.init();
    });
  } else {
    ScrollReveal.init();
    ParallaxWatermark.init();
  }

  // Expose to global scope for manual control if needed
  window.ScrollReveal = ScrollReveal;
  window.ParallaxWatermark = ParallaxWatermark;
})();