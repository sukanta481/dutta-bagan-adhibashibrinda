/**
 * header.js — site header scroll state + mobile menu
 * Self-contained: runs on every page. No GSAP / Vue / jQuery needed.
 */
(function () {
  function init() {
    var header = document.getElementById('siteHeader');
    if (header && !header.dataset.bound) {
      header.dataset.bound = 'true';
      var topThreshold = 4;

      function sync() {
        if (window.scrollY > topThreshold) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }
      }

      sync();
      window.addEventListener('scroll', sync, { passive: true });
      window.addEventListener('load', sync);
    }

    var toggle = document.getElementById('siteHeaderToggle');
    var overlay = document.getElementById('mobileMenuOverlay');
    var backdrop = document.getElementById('menuDrawerBackdrop');
    var closeBtn = document.getElementById('mobileMenuClose');
    var reopenGuardUntil = 0;

    if (toggle && toggle.dataset.bound) return;

    if (toggle) {
      toggle.dataset.bound = 'true';
    }

    function open() {
      if (Date.now() < reopenGuardUntil) return;
      if (!overlay) return;
      overlay.classList.add('active');
      if (backdrop) backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      if (!overlay) return;
      overlay.classList.remove('active');
      if (backdrop) backdrop.classList.remove('active');
      document.body.style.overflow = '';
      reopenGuardUntil = Date.now() + 350;
    }

    function isOpen() {
      return !!(overlay && overlay.classList.contains('active'));
    }

    if (toggle) {
      toggle.addEventListener('click', function () {
        if (isOpen()) {
          close();
        } else {
          open();
        }
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        close();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) close();
      });
      overlay.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', close);
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', close);
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) {
        close();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Rebind after shared layout partials are injected.
  document.addEventListener('layout:ready', init);
}());
