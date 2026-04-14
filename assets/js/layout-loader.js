/*
 * layout-loader.js
 * Loads reusable header/footer partials before app animations initialize.
 */

(function () {
  function loadPartial(mountId, filePath) {
    const mount = document.getElementById(mountId);
    if (!mount) return Promise.resolve();

    return fetch(filePath, { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load partial: ' + filePath);
        }
        return response.text();
      })
      .then((html) => {
        mount.outerHTML = html;
      });
  }

  window.layoutReady = Promise.all([
    loadPartial('site-header', 'includes/header.html'),
    loadPartial('site-footer', 'includes/footer.html')
  ])
    .then(() => {
      document.dispatchEvent(new Event('layout:ready'));
    })
    .catch((error) => {
      console.error(error);
    });
}());
