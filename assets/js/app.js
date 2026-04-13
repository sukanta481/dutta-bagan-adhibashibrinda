/**
 * app.js — Vue 3 reactive data layer
 * Use Vue ONLY for: reactive data, v-for rendering, v-if conditionals.
 * All animations → animations.js  |  All DOM effects → interactions.js
 */

const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {

    // ── Theme name (replace when committee provides) ──────────────
    const themeName = ref('[THEME NAME]');

    // Split theme name into individual letter spans for GSAP animation
    const themeLetters = ref([]);
    onMounted(() => {
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

}).mount('#app');
