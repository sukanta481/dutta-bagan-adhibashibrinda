/*
 * layout-loader.js
 * Loads reusable header/footer partials before app animations initialize.
 */

(function () {
  const LAYOUT_VERSION = '20260415-11';

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
        // Keep the mount node so Vue patching does not permanently remove the insertion point.
        mount.innerHTML = html;
      });
  }

  function loadLayout() {
    return Promise.all([
    loadPartial('site-header', 'includes/header.html?v=' + LAYOUT_VERSION),
    loadPartial('site-footer', 'includes/footer.html?v=' + LAYOUT_VERSION)
    ]);
  }

  window.layoutReady = loadLayout()
    .then(() => {
      document.dispatchEvent(new Event('layout:ready'));
    })
    .catch((error) => {
      console.error(error);
    });

  // Re-apply after Vue mounts in case virtual DOM patching cleared placeholder contents.
  document.addEventListener('vue:mounted', function () {
    loadLayout()
      .then(() => {
        document.dispatchEvent(new Event('layout:ready'));
      })
      .catch((error) => {
        console.error(error);
      });
  });
}());
