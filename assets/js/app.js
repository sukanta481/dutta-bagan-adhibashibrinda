/**
 * app.js — Vue 3 reactive data layer
 * Use Vue ONLY for: reactive data, v-for rendering, v-if conditionals.
 * All animations → animations.js  |  All DOM effects → interactions.js
 */

const { createApp, ref, onMounted } = Vue;

const ContactSection = {
  template: `
    <section id="section-contact" class="section-contact">
      <section class="container py-5">
        <div class="row align-items-center justify-content-between">
          <div class="col-12 col-lg-5 mb-5 mb-lg-0">
            <p class="text-uppercase fw-bold mb-3" style="color: #D4AF37; font-size: 0.85rem; letter-spacing: 0.15em;">Stay Connected with the Spirit of Pujo</p>
            <h2 class="display-4 font-serif fw-bold mb-5" style="color: #b22222; line-height: 1.1;">Get in Touch.<br>Let's Celebrate.</h2>

            <ul class="list-unstyled mb-0">
              <li>
                <h6 class="text-uppercase fw-bold mb-1" style="color: #b22222; font-size: 0.75rem; letter-spacing: 0.1em;">Call Us</h6>
                <p class="fs-5 mb-4" style="color: #333333;">+91 99033 89320</p>
              </li>
              <li>
                <h6 class="text-uppercase fw-bold mb-1" style="color: #b22222; font-size: 0.75rem; letter-spacing: 0.1em;">Visit Us</h6>
                <p style="color: #333333; max-width: 80%;">22 No Raja Manindra Road, Kolkata - 700037, Kolkata, India</p>
              </li>
            </ul>
          </div>

          <div class="col-12 col-lg-6">
            <div class="w-100 overflow-hidden" style="border: 1px solid rgba(178,34,34,0.15); border-radius: 8px; box-shadow: 0 10px 30px rgba(178,34,34,0.05);">
              <iframe
                src="https://www.google.com/maps?q=22%20No%20Raja%20Manindra%20Road%2C%20Kolkata%20-%20700037%2C%20Kolkata%2C%20India&output=embed"
                style="width: 100%; height: 400px; border: 0; filter: grayscale(90%) contrast(110%) sepia(15%);"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </section>
  `
};

const app = createApp({
  setup() {

    // ── Theme name (replace when committee provides) ──────────────
    const themeName = ref('[THEME NAME]');

    // Split theme name into individual letter spans for GSAP animation
    const themeLetters = ref([]);
    onMounted(async () => {
      if (window.layoutReady && typeof window.layoutReady.then === 'function') {
        await window.layoutReady;
      }

      themeLetters.value = themeName.value.split('').map(char => ({
        char,
        isSpace: char === ' '
      }));

      // Notify animations.js that Vue has mounted and lists are rendered
      document.dispatchEvent(new Event('vue:mounted'));
    });

    // ── Future reactive data (add per section as needed) ─────────
    const committeeMembers = ref([
      { name: '[Name]', role: 'President',   photo: '' },
      { name: '[Name]', role: 'Secretary',   photo: '' },
      { name: '[Name]', role: 'Treasurer',   photo: '' },
      { name: '[Name]', role: 'Art Director',photo: '' },
    ]);

    const timelineMilestones = ref([
      { date: 'January 2026',  title: 'Theme Conceptualization', desc: 'The committee begins envisioning the 2026 narrative.' },
      { date: 'March 2026',    title: 'Artistic Direction Set',  desc: 'Visual language and colour palette defined.' },
      { date: 'June 2026',     title: 'Idol Commission Begins',  desc: 'Master sculptors engaged in Kumartuli.' },
      { date: 'October 2026',  title: 'Grand Reveal',            desc: 'The world discovers the theme.' },
    ]);

    const galleryPhotos = ref([
      { src: 'assets/images/gallery/2025.jpg', year: '2025', caption: 'Mahasaptami 2025' },
      { src: 'assets/images/gallery/2024.jpg', year: '2024', caption: 'Ashtami 2024' },
      { src: 'assets/images/gallery/2023.jpg', year: '2023', caption: 'Navami 2023' },
    ]);

    return {
      themeName,
      themeLetters,
      committeeMembers,
      timelineMilestones,
      galleryPhotos,
    };
  }

});

app.component('contact-section', ContactSection);
app.mount('#app');
