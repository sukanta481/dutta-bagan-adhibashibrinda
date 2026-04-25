import sys, re

def update_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match everything from site-footer to the end of the file
    site_footer_match = re.search(r'(\s*<div id="site-footer"></div>\s*</div>\s*)[\s\S]*', content)
    if not site_footer_match:
        print(f"site-footer not found in {filename}")
        return
        
    replacement = site_footer_match.group(1) + """<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.21/vue.global.prod.min.js"></script>
  <script src="assets/js/header.js?v=20260417-1"></script>
  <script src="assets/js/layout-loader.js?v=20260417-1"></script>
  <script src="assets/js/app.js?v=20260417-1"></script>
  <script src="assets/js/animations.js?v=20260417-1"></script>
  <script src="assets/js/interactions.js?v=20260417-1"></script>
  <script src="assets/js/scroll-reveal.js?v=20260417-1"></script>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      var lightbox = null;
      var lightboxImg = null;
      var currentImages = Array.from(document.querySelectorAll('.gallery-item'));
      var currentIndex = 0;

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

        lightbox.addEventListener('click', function (e) {
          if (e.target === lightbox || e.target.classList.contains('gallery-lightbox-close')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
          }
        });

        function updateLightboxImage(index) {
          if (currentImages.length === 0) return;
          if (index < 0) index = currentImages.length - 1;
          if (index >= currentImages.length) index = 0;
          currentIndex = index;
          var entry = currentImages[currentIndex];
          var full = entry.getAttribute('href');
          lightboxImg.src = full;
        }

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

      function openLightbox(index) {
        createLightbox();
        currentIndex = index;
        var full = currentImages[currentIndex].getAttribute('href');
        lightboxImg.src = full;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      currentImages.forEach(function(item, index) {
        item.addEventListener('click', function(e) {
          e.preventDefault();
          openLightbox(index);
        });
      });
    });
  </script>
</body>
</html>
"""
    
    content = content[:site_footer_match.start()] + replacement
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
        print(f"Updated {filename}")

update_file('gallery-2024.html')
update_file('gallery-2025.html')
update_file('gallery-2026.html')
