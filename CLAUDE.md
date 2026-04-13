# Project: Adhibashibrinda Durga Puja 2026 — Theme Reveal Landing Page

## What this is
A cinematic, editorial-style landing page for the Adhibashibrinda Durga Puja Committee 2026.
This is NOT a general website — it is a single-purpose theme announcement page.
Its job: dramatically reveal the 2026 Durga Puja theme to the audience through scroll storytelling.
Think: a film title sequence meets a luxury editorial magazine, built as a webpage.

## Current status
Greenfield — building from scratch.

---

## Stack
- Frontend framework: Vue.js 3 (CDN — no build tools)
- CSS framework: Bootstrap 5 (CDN)
- Animation/DOM utility: jQuery 3.x (CDN)
- Scroll animations: GSAP 3 + ScrollTrigger plugin (CDN)
- Parallax: GSAP ScrollTrigger scrub (not a separate library)
- Fonts: Google Fonts (CDN)
- Icons: Bootstrap Icons (CDN)
- No build tools — no Vite, no Webpack, no npm
- All CDN links in index.html <head>

## CDN links (copy exactly into every file's <head>)
```html
<!-- Bootstrap 5 CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">

<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&family=Cinzel:wght@400;600;900&display=swap" rel="stylesheet">

<!-- GSAP + ScrollTrigger (load before jQuery) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<!-- jQuery -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

<!-- Vue 3 (load last, before app scripts) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.21/vue.global.prod.min.js"></script>
```

## Script load order at bottom of <body> (critical — do not change)
```html
<script src="assets/js/app.js"></script>         <!-- Vue mounts first -->
<script src="assets/js/animations.js"></script>   <!-- GSAP after Vue -->
<script src="assets/js/interactions.js"></script> <!-- jQuery last -->
```

---

## File structure
```
adhibashibrinda-2026/
├── index.html
├── assets/
│   ├── css/
│   │   └── main.css
│   ├── js/
│   │   ├── app.js              # Vue 3 app — data and reactivity only
│   │   ├── animations.js       # GSAP ScrollTrigger — all scroll animations
│   │   └── interactions.js     # jQuery — hover effects, cursor, gallery
│   └── images/
│       ├── hero-poster.jpg     # Hero video fallback
│       ├── arch-bg.png         # Traditional arch background
│       ├── durga-hands.svg     # Goddess's ten hands illustration
│       ├── dhunuchi-lady.svg   # Lady performing Dhunuchi dance
│       ├── dhol-man.svg        # Man playing dhol
│       ├── gallery/            # Archival photography (grayscale reveal)
│       └── textures/           # Subtle paper/grain textures
├── video/
│   └── hero.mp4                # Hero reveal video (committee provides)
├── CLAUDE.md
└── PLAN.md
```

---

## Design system

### Design philosophy: "Scroll Storytelling"
The page does not display content — it performs it. Each section is a scene.
Scroll is the remote control. Every element earns its place by revealing itself
through motion. The hero is a cinematic opening act, not a static banner.
The overall experience should feel like watching a film unfold, not browsing a website.

### Color palette
```css
:root {
  /* Backgrounds */
  --bg-base:         #FAF8F5;   /* warm off-white — default page bg */
  --bg-section:      #F2EEE8;   /* slightly warmer — alternate sections */
  --bg-dark:         #1A1410;   /* deep warm charcoal — hero, theme reveal, footer */

  /* Typography */
  --text-primary:    #1C1A17;   /* near-black warm charcoal — all headings */
  --text-body:       #3D3830;   /* medium charcoal — body copy */
  --text-muted:      #7A7268;   /* warm gray — captions, metadata, labels */
  --text-on-dark:    #F0EBE3;   /* warm off-white — text on dark sections */

  /* Accents */
  --accent-red:      #C0392B;   /* restrained deep red — primary accent */
  --accent-red-soft: #E8897F;   /* soft red — hover underlines, glow */
  --accent-gold:     #C9973A;   /* warm gold — theme name, key highlights */
  --accent-gold-soft:#E8C97A;   /* soft gold — background glow effects */

  /* Overlays & effects */
  --overlay-hero:    rgba(26, 20, 16, 0.62);  /* hero video dark overlay */
  --shadow-card:     0 20px 60px rgba(26, 20, 16, 0.08);
  --shadow-hover:    0 30px 80px rgba(26, 20, 16, 0.14);
}
```

### Typography
```
Cinzel            → Hero title, theme name reveal — ceremonial, classical
Playfair Display  → Section headings, pull quotes — editorial, literary
DM Sans           → Body copy, nav, labels, captions — clean, modern
```

**Type scale:**
- Hero theme reveal: Cinzel, clamp(3rem, 8vw, 7rem), weight 900, letter-spacing 0.08em
- Section headline: Playfair Display, clamp(2rem, 4vw, 3.5rem), weight 700
- Pull quote: Playfair Display italic, 1.75rem, weight 400
- Body copy: DM Sans, 1rem–1.125rem, weight 300, line-height 1.85
- Metadata label: DM Sans, 0.7rem, weight 500, uppercase, letter-spacing 0.14em
- Never go below 0.7rem font-size

### The No-Box Rule
- No `border: 1px solid` anywhere to contain or separate content
- Section boundaries defined through background color shifts + spacing only
- Cards: shadow only — `box-shadow: var(--shadow-card)`; no borders
- Ghost border fallback (accessibility only): `outline: 1px solid rgba(26,20,16,0.07)`

### Spacing rules
- Section padding: 140px top/bottom on desktop, 90px on tablet, 70px mobile
- If it looks right, double the whitespace — space is prestige on editorial pages
- Asymmetric layouts required — text blocks offset left or right, never always centered
- Large negative space columns are intentional — do not fill them

---

## Page sections — build in this exact order

### 1. Hero (`#section-hero`) — cinematic opening
- Full viewport: `height: 100vh`
- Background: `<video autoplay muted loop playsinline preload="metadata">` with `--overlay-hero`
- Fallback: `hero-poster.jpg` as video poster attribute
- Cultural layer: `arch-bg.png` behind video at `opacity: 0.12`, parallax moves at 0.4x scroll speed
- Bottom-right: `dhunuchi-lady.svg` partially visible, parallax at 0.6x speed
- Content (centered, above overlay):
  - Committee name — DM Sans label style, letter-spaced, `--accent-gold`
  - Year "2026" — Cinzel 900, massive
  - Tagline — Playfair Display italic
  - "Scroll to discover" indicator — animated bounce chevron
- GSAP load timeline: committee name → year scale-in → tagline → scroll indicator

### 2. Theme Reveal (`#section-theme`) — the centerpiece
- Full dark section: `background: var(--bg-dark)`
- This is the dramatic reveal of the 2026 theme name
- Theme name: Cinzel 900, `--accent-gold`, letter-by-letter scroll animation
- Tagline beneath: Playfair Display italic, `--text-on-dark`, fades in after name
- Background: `durga-hands.svg` ghosted at 6% opacity, parallax 0.3x
- Decorative: fine horizontal `--accent-red` line draws itself across the section
- Mood: temple sanctum — dark, golden, reverent

### 3. The Story (`#section-story`) — editorial narrative
- Light background: `var(--bg-base)`
- Asymmetric layout: large pull quote Playfair italic (left, 60% width), body text right
- `arch-bg.png` parallax background at 5% opacity
- Paragraphs reveal one by one on scroll (GSAP stagger)
- Large decorative Bengali numeral or Sanskrit character as background type art
  (Cinzel or system font, 30vw, opacity 0.03, absolutely positioned)
- Horizontal red line draws itself across section divider

### 4. Cultural Motifs (`#section-motifs`) — illustration showcase
- Background: `var(--bg-section)`
- Three illustrations in a row, scroll-triggered entrance (staggered)
- Each illustration on hover:
  - `durga-hands.svg`: scale 1.04 + subtle gold drop-shadow glow
  - `dhunuchi-lady.svg`: gentle sway animation (CSS @keyframes)
  - `dhol-man.svg`: subtle rhythm-pulse scale animation
- Captions: DM Sans label style, `--text-muted`, below each

### 5. Archival Gallery (`#section-gallery`) — interactive photography
- Dark background: `var(--bg-dark)`
- Heading: "Through the Years" — Playfair Display, `--text-on-dark`
- CSS scroll-snap horizontal gallery (no Swiper.js)
- Each photo: grayscale by default, color reveals + caption slides up on hover (jQuery)
- Photos enter from alternating sides on scroll (GSAP ScrollTrigger)

### 6. Preparation Timeline (`#section-timeline`) — key dates
- Light background: `var(--bg-base)`
- Vertical timeline, alternating left/right milestones
- Each milestone: card enters on scroll, connecting spine line draws via GSAP
- Accent dot: `--accent-red` circle on timeline spine
- Hover: card lifts with `var(--shadow-hover)`

### 7. Committee (`#section-committee`) — team reveal
- Background: `var(--bg-section)`
- Bootstrap grid: 4 cols desktop, 2 tablet, 1 mobile
- Cards: staggered scroll entrance (GSAP, 0.12s stagger)
- Hover: lift + `--accent-red` underline appears on name
- No card borders — shadow only

### 8. Footer/CTA (`#section-footer`) — closing act
- Dark background: `var(--bg-dark)`
- Committee name + 2026 in Cinzel, centered
- "The grand reveal is coming" CTA in Playfair italic
- Social links: Bootstrap Icons, `--accent-gold` on hover
- `dhol-man.svg` small, bottom right, subtle float animation

---

## Animation system (GSAP — animations.js only)

### Register ScrollTrigger (always first line of animations.js)
```js
gsap.registerPlugin(ScrollTrigger);
```

### Standard scroll entrance
```js
gsap.from(".anim-fadeup", {
  opacity: 0, y: 60, duration: 1,
  ease: "power3.out",
  scrollTrigger: { trigger: ".anim-fadeup", start: "top 85%",
                   toggleActions: "play none none none" }
});
```

### Staggered children
```js
gsap.from(".anim-stagger > *", {
  opacity: 0, y: 40, duration: 0.8, stagger: 0.12,
  ease: "power2.out",
  scrollTrigger: { trigger: ".anim-stagger", start: "top 80%" }
});
```

### Parallax background
```js
gsap.to(".parallax-bg", {
  yPercent: -30, ease: "none",
  scrollTrigger: {
    trigger: ".parallax-section",
    start: "top bottom", end: "bottom top",
    scrub: true   // ties directly to scroll position
  }
});
```

### Hero load timeline (no ScrollTrigger — fires on page load)
```js
const heroTl = gsap.timeline({ delay: 0.4 });
heroTl
  .from(".hero-committee-name", { opacity:0, y:25, duration:0.8 })
  .from(".hero-year",           { opacity:0, scale:0.82, duration:1.1, ease:"expo.out" }, "-=0.3")
  .from(".hero-tagline",        { opacity:0, y:20, duration:0.7 }, "-=0.4")
  .from(".scroll-indicator",    { opacity:0, duration:0.5 }, "-=0.2");
```

### Theme name letter reveal (Section 2)
```js
// Split theme name spans created by Vue before this runs
gsap.from(".theme-letter", {
  opacity:0, y:80, rotationX:-90, duration:0.85,
  stagger:0.055, ease:"back.out(1.7)",
  scrollTrigger: { trigger:"#section-theme", start:"top 60%" }
});
```

### Line draw animation
```js
gsap.from(".line-draw", {
  scaleX:0, transformOrigin:"left center", duration:1.3,
  ease:"power2.inOut",
  scrollTrigger: { trigger:".line-draw", start:"top 78%" }
});
```

### Timeline spine draw (Section 6)
```js
gsap.from(".timeline-spine", {
  scaleY:0, transformOrigin:"top center", duration:2,
  ease:"power2.inOut",
  scrollTrigger: {
    trigger:"#section-timeline",
    start:"top 70%", end:"bottom 30%",
    scrub:0.5
  }
});
```

### After Vue mounts — refresh ScrollTrigger
```js
// In animations.js, wrap everything in:
document.addEventListener('DOMContentLoaded', () => {
  // short delay to let Vue render its v-for lists
  setTimeout(() => {
    initAnimations();
    ScrollTrigger.refresh();
  }, 100);
});
```

---

## jQuery conventions (interactions.js only)

Use jQuery ONLY for: hover state effects, gallery color reveal, cursor follower, misc DOM toggles.
Do NOT use jQuery for scroll detection — GSAP handles that.
Do NOT use jQuery for state management — Vue handles that.

```js
// Gallery grayscale reveal pattern
$('.gallery-photo').on('mouseenter', function() {
  $(this).find('img').css('filter', 'grayscale(0%) brightness(1.04)');
  $(this).find('.photo-caption').stop(true).slideDown(280);
}).on('mouseleave', function() {
  $(this).find('img').css('filter', 'grayscale(100%)');
  $(this).find('.photo-caption').stop(true).slideUp(200);
});

// Custom cursor follower (desktop only)
if (window.innerWidth > 991) {
  $(document).on('mousemove', function(e) {
    $('.cursor-dot').css({ left: e.clientX, top: e.clientY });
  });
}
```

---

## Vue.js conventions (app.js only)

Use Vue 3 Composition API (setup() function) — not Options API.
Use Vue ONLY for: reactive data arrays, v-for list rendering, conditional v-if rendering.
Do NOT use Vue for animations — GSAP handles that.
Mount point: `<div id="app">` wraps entire body content.

```js
const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {
    const committeeMembers = ref([
      { name: '[Name]', role: 'President', photo: 'assets/images/team/placeholder.jpg' },
    ]);

    const timelineMilestones = ref([
      { date: 'January 2026', title: 'Theme Conceptualization', desc: 'The committee begins...' },
      { date: 'March 2026',   title: 'Artistic Direction Set', desc: 'Visual language defined...' },
      { date: 'June 2026',    title: 'Idol Commission Begins', desc: 'Master sculptors engaged...' },
      { date: 'October 2026', title: 'Grand Reveal', desc: 'The world discovers the theme.' },
    ]);

    const galleryPhotos = ref([
      { src: 'assets/images/gallery/2025.jpg', year: '2025', caption: 'Mahasaptami 2025' },
    ]);

    const themeName = ref('[THEME NAME]'); // Replace when committee provides

    // Split theme name into letter spans for GSAP animation
    const themeLetters = ref([]);
    onMounted(() => {
      themeLetters.value = themeName.value.split('').map(char => ({
        char, isSpace: char === ' '
      }));
    });

    return { committeeMembers, timelineMilestones, galleryPhotos, themeName, themeLetters };
  }
}).mount('#app');
```

---

## CSS conventions (main.css)

```css
/* Always start main.css with this block */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { background-color: var(--bg-base); color: var(--text-body); font-family: 'DM Sans', sans-serif; }

/* Parallax section pattern */
.parallax-section { position: relative; overflow: hidden; }
.parallax-bg      { position: absolute; inset: -20%; width: 140%; height: 140%;
                    pointer-events: none; z-index: 0; }
.parallax-content { position: relative; z-index: 1; }

/* Illustration positioning pattern */
.cultural-illustration { position: absolute; pointer-events: none; z-index: 0;
                          user-select: none; }

/* Never animate width, height, margin, padding — only transform and opacity */
```

---

## Coding conventions

### General
- All section IDs: `id="section-hero"`, `id="section-theme"`, etc.
- All GSAP target classes prefixed: `anim-fadeup`, `anim-stagger`, `anim-letter`
- All parallax elements: `class="parallax-bg"` on the moving element, `parallax-section` on the container
- All cultural illustrations: `class="cultural-illustration"`
- Never use `!important` — if needed, the CSS structure is wrong
- `loading="lazy"` on all images below the fold

### Performance rules
- Hero video: `<video autoplay muted loop playsinline preload="metadata">`
- Only animate `transform` and `opacity` — never layout properties (width, height, margin)
- Call `ScrollTrigger.refresh()` after Vue's onMounted renders dynamic lists
- SVG illustrations: use `<img>` tag unless hover color change is needed (then inline SVG)

---

## Do NOT
- Do not use React, Svelte, or any other framework — Vue 3 CDN only
- Do not use AOS, Animate.css, or any other animation library — GSAP only
- Do not use Swiper.js — use CSS scroll-snap for the gallery
- Do not use jQuery for scroll detection — GSAP ScrollTrigger only
- Do not use Options API in Vue — Composition API (setup()) only
- Do not mix GSAP logic into app.js — keep Vue and GSAP in separate files
- Do not use pure black (#000000) — use `--text-primary` (#1C1A17)
- Do not center-align every section — asymmetric layouts are required by design
- Do not add borders to section containers — background shifts and spacing only
- Do not use setTimeout chains for animation sequencing — use GSAP timelines
- Do not animate before Vue has mounted and rendered (use DOMContentLoaded + small delay)

---

## Cultural accuracy notes
- Festival: Durga Puja — Bengali Hindu festival, primarily West Bengal, India
- Dhunuchi dance: performer holds an earthen incense burner (dhunuchi), dances before the Goddess
- Dhol: traditional Bengali double-headed barrel drum, beaten with sticks
- Goddess Durga: depicted with 10 arms, each holding a weapon or sacred object
- Tone must be: celebratory, reverent, culturally proud — not touristy, not generic "exotic India"
- Cultural placeholder text should reference real Bengali festival traditions, not generic Hindu references

---

## Placeholders (replace when committee provides)
- `[THEME NAME]` — 2026 theme, goes in Vue's `themeName` ref
- `video/hero.mp4` — use a dark, cinematic Creative Commons video as placeholder
- Gallery photos — use real Durga Puja archival-style Unsplash images as placeholders
- Committee member names/photos — use labeled placeholder cards
- SVG illustrations — source from open Bengali cultural illustration libraries or create minimal SVGs

---

## Git workflow
- Branch per section: `section/hero`, `section/theme-reveal`, `section/gallery`
- Commit after each section's HTML + animation works and is tested in browser
- Main branch: always a viewable, working page — no broken sections
- Never commit placeholder lorem ipsum to main — use real cultural content placeholders
