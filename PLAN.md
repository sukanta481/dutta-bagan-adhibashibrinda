# PLAN.md — Adhibashibrinda 2026 Layout Plan (Post-Hero Sections)

## Status
- **Hero section (PiP video + scroll text reveal)**: FINALIZED — do not modify
- **Sticky header (logo + nav after hero)**: FINALIZED — do not modify
- **Arch image (scroll-reveal in hero)**: FINALIZED — do not modify
- **Everything below**: to be built per this plan

---

## Reference image analysis

The reference shows a dark-themed single-page Durga Puja committee website with these sections from top to bottom:

1. ~~Hero~~ (done)
2. About Us — title + tagline + description on dark bg
3. Achievements strip — logos / badges on dark bg
4. Media showcase — video embed + image collage on dark bg
5. Bengali typography feature — large decorative Bengali text on dark bg
6. Establishment / committee info — year + committee name + member names
7. Music release — album/music card on dark bg
8. Memories gallery — photo grid/carousel on dark bg
9. Contact / CTA — form or map + social links on gold/accent bg
10. Footer — logo + branding on gold/accent bg

---

## Design adaptation to our color system

The reference is almost entirely dark background. We adapt using our CLAUDE.md palette to create a more editorial, cinematic scroll experience:

| Reference section | Our bg | Reason |
|---|---|---|
| About Us | `--bg-light` (#1A1410) | Sets reverent mood after the bright hero |
| Achievements | `--bg-light` | Continuous dark zone — no break |
| Media showcase | `--bg-section` (#F2EEE8) | Light break creates contrast rhythm |
| Bengali typography | `--bg-light` | Dark canvas makes gold/red Bengali text dramatic |
| Committee info | `--bg-base` (#FAF8F5) | Light section — breathing room |
| Music release | `--bg-light` | Dark for media card visual weight |
| Memories gallery | `--bg-light` | Dark so grayscale photos pop |
| Contact / CTA | `--accent-gold` to `--bg-light` gradient | Warm, inviting close |
| Footer | `--bg-light` with `--accent-gold` accents | Bookends with hero |

**Background rhythm (top→bottom):**
`light hero → dark → dark → light → dark → light → dark → dark → gold-gradient → dark`

---

## Section-by-section layout spec

### 2. About Us (`#section-about`)

**Background:** `--bg-white`
**Padding:** 140px top / 140px bottom (desktop), 90px mobile

**Layout (2 columns on desktop, stacked mobile):**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   DUTTABAGAN DURGOTSAB                    [arch.png at      │
│   COMMITTEE                                ~20% opacity,   │
│                                            right-aligned,  │
│   "Where tradition meets celebration,      parallax 0.3x]  │
│    and Puja becomes an emotion!"                            │
│                                                             │
│   [body text: 2-3 paragraphs about                          │
│    the committee's history and mission,                     │
│    DM Sans 300, --text-on-dark]                             │
│                                                             │
│   [ Explore Our Legacy → ]  ghost button                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

- Title: Cinzel 900, `--text-on-dark`, `clamp(2rem, 4vw, 3.5rem)`
- Tagline: Playfair Display italic, `--accent-gold`, `1.25rem`
- Body: DM Sans 300, `--text-on-dark` at 0.7 opacity, `1rem`, `line-height: 1.85`
- CTA button: ghost style — `border: 1px solid var(--accent-gold)`, text `--accent-gold`, no fill
- `arch.png` positioned absolute, right, at 12–18% opacity, parallax
- GSAP: title + tagline + paragraphs stagger fade-up on scroll
- Decorative: a thin horizontal `--accent-red` line-draw animation at section bottom

---

### 3. Achievements Strip (`#section-achievements`)

**Background:** `--bg-light` (continuation — no visual break from About)
**Padding:** 60px top / 80px bottom

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ACHIEVEMENTS                              eyebrow label  │
│   58 Years of Tradition              Playfair Display 700   │
│                                                             │
│   ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐           │
│   │  icon  │  │  icon  │  │  icon  │  │  icon  │           │
│   │  58+   │  │  200+  │  │  15K+  │  │  Best  │           │
│   │ years  │  │ events │  │ guests │  │ theme  │           │
│   └────────┘  └────────┘  └────────┘  └────────┘           │
│                                                             │
│   [line-draw accent-red]                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

- Eyebrow: DM Sans 500, `0.68rem`, `--text-muted`, uppercase, letter-spaced
- Heading: Playfair Display 700, `--text-on-dark`, `clamp(1.8rem, 3.5vw, 2.8rem)`
- Stat cards: no visible border, `--shadow-card`, background transparent or very subtle `rgba(255,255,255,0.03)`
- Number: Cinzel 900, `--accent-gold`, `2.5rem`
- Label: DM Sans 300, `--text-on-dark` at 0.6 opacity
- Bootstrap grid: `col-6 col-md-3`
- GSAP: counter animation (numbers count up) + stagger entrance
- Divider at bottom: `--accent-red` line-draw spanning ~60% width

---

### 4. Media Showcase (`#section-media`)

**Background:** `--bg-section` (#F2EEE8) — light break
**Padding:** 140px top/bottom

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│        OUR STORY IN MOTION              eyebrow label      │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                                                     │   │
│   │              [ Video embed / poster ]               │   │
│   │              aspect-ratio: 16/9                     │   │
│   │              shadow-card, border-radius: 16px       │   │
│   │              play button overlay                    │   │
│   │                                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│   ┌────────┐  ┌────────┐  ┌────────┐                       │
│   │  img1  │  │  img2  │  │  img3  │  supporting photos    │
│   │        │  │        │  │        │  grayscale default     │
│   └────────┘  └────────┘  └────────┘  color on hover       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

- Video: centered, max-width `min(90%, 900px)`, rounded corners, `--shadow-card`
- Play button overlay: centered circle, `--accent-red` bg, white triangle
- Supporting photos: Bootstrap `col-4`, `border-radius: 12px`, grayscale by default
- jQuery: hover reveals color (`filter: grayscale(0%)`) + subtle scale 1.02
- GSAP: video card scales up from 0.92 opacity 0 on scroll, photos stagger from below
- On light bg: all text uses `--text-primary` / `--text-body`

---

### 5. Bengali Typography Feature (`#section-identity`)

**Background:** `--bg-light`
**Padding:** 160px top/bottom — extra generous vertical space

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                     [arch.png centered,                     │
│                      ~10% opacity, huge,                    │
│                      background decorative]                 │
│                                                             │
│              ┌──────────────────────────┐                   │
│              │   প্রতিষ্ঠা ২০২৫        │ large Bengali     │
│              │                          │ decorative text   │
│              │   DAKSHINPARA DURGOTSAB  │                   │
│              │   COMMITTEE              │                   │
│              └──────────────────────────┘                   │
│                                                             │
│   The reference shows a large Bengali script "প্রজ্ঞা"     │
│   or similar — we use our establishment name in Bengali     │
│   rendered at massive scale as visual art                   │
│                                                             │
│   Bengali text: system Bengali font or Noto Sans Bengali,   │
│   clamp(5rem, 14vw, 12rem), --accent-gold, weight 700      │
│                                                             │
│   Committee name: Cinzel 600, --text-on-dark, below         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

- Bengali text as hero art — massive scale, gold color, letter-spaced
- Add Google Font: `Noto Sans Bengali:wght@700` in CDN links
- Background: `arch.png` at ~8% opacity, centered, parallax 0.3x
- Committee English name: Cinzel 600, `--text-on-dark`, centered below Bengali
- GSAP: Bengali text letter-by-letter reveal (similar to theme name technique)
- Thin `--accent-red` horizontal rules above and below

---

### 6. Committee Members (`#section-committee`)

**Background:** `--bg-base` (#FAF8F5) — light
**Padding:** 140px top/bottom

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   OUR COMMITTEE                             eyebrow label  │
│   The People Behind the Celebration         heading         │
│                                                             │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│   │          │  │          │  │          │  │          │  │
│   │  photo   │  │  photo   │  │  photo   │  │  photo   │  │
│   │          │  │          │  │          │  │          │  │
│   │ Name     │  │ Name     │  │ Name     │  │ Name     │  │
│   │ Role     │  │ Role     │  │ Role     │  │ Role     │  │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

- Bootstrap grid: `col-6 col-md-3`
- Photo: square aspect ratio, `border-radius: 12px`, `--shadow-card`
- Name: DM Sans 500, `--text-primary`, `1rem`
- Role: DM Sans 300, `--text-muted`, `0.8rem`
- No borders on cards — shadow only (No-Box Rule)
- Hover: card lifts (`--shadow-hover`), `--accent-red` underline appears under name
- GSAP: stagger entrance 0.12s from below
- Vue: `v-for="member in committeeMembers"` — data in `app.js`

---

### 7. Music Release (`#section-music`)

**Background:** `--bg-light`
**Padding:** 120px top/bottom

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   OUR MUSIC RELEASE                        eyebrow label   │
│                                                             │
│   ┌──────────────┐    Title of Release                      │
│   │              │    Artist / Composer Name                 │
│   │  album art   │    Year                                  │
│   │   (square)   │                                          │
│   │              │    [ Listen Now → ]  ghost button         │
│   │              │    [ Watch Video → ] ghost button         │
│   └──────────────┘                                          │
│                                                             │
│   ── accent-red line-draw ──────────                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

- 2-column layout: album art left (40%), text right (60%)
- Album art: square, `border-radius: 12px`, `--shadow-card`, subtle gold glow on hover
- Title: Playfair Display 700, `--text-on-dark`, `1.5rem`
- Artist: DM Sans 300, `--text-muted`
- Buttons: ghost style, `--accent-gold` border and text
- GSAP: album art enters from left, text from right, meet in center
- If multiple releases, use horizontal scroll-snap strip (like gallery pattern)

---

### 8. Memories Gallery (`#section-gallery`)

**Background:** `--bg-light`
**Padding:** 140px top/bottom

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   MEMORIES WE CHERISH                      eyebrow label   │
│                                                             │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ →scroll │
│   │ ░░░░░░░ │ │ ░░░░░░░ │ │ ░░░░░░░ │ │ ░░░░░░░ │         │
│   │ ░░░░░░░ │ │ ░░░░░░░ │ │ ░░░░░░░ │ │ ░░░░░░░ │         │
│   │ ░░░░░░░ │ │ ░░░░░░░ │ │ ░░░░░░░ │ │ ░░░░░░░ │         │
│   │ ░gray░░ │ │ ░gray░░ │ │ ░gray░░ │ │ ░gray░░ │         │
│   │  2025   │ │  2024   │ │  2023   │ │  2022   │         │
│   └─────────┘ └─────────┘ └─────────┘ └─────────┘         │
│                                                             │
│   ← scroll indicators / dots →                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

- CSS `scroll-snap-type: x mandatory` horizontal gallery (no Swiper.js per CLAUDE.md)
- Each photo: `scroll-snap-align: start`, `border-radius: 12px`
- Grayscale by default, color reveals on hover (jQuery)
- Year caption: DM Sans label style, `--text-muted`, `0.7rem`, slides up on hover
- GSAP: photos enter from alternating sides (odd from left, even from right)
- Vue: `v-for="photo in galleryPhotos"` — data in `app.js`
- Scroll indicator dots or subtle arrows below gallery

---

### 9. Contact / CTA (`#section-contact`)

**Background:** gradient from `--accent-gold` (top) to `--bg-light` (bottom)
**Padding:** 120px top/bottom

```
┌─────────────────────────────────────────────────────────────┐
│  gradient: --accent-gold → --bg-light                        │
│                                                             │
│   GET IN TOUCH                             eyebrow label    │
│   Let's Celebrate Together                 Playfair italic  │
│                                                             │
│   ┌──────────────────────┐    ┌──────────────────────┐      │
│   │                      │    │                      │      │
│   │    Google Map embed   │    │   Address            │      │
│   │    or static map      │    │   Phone              │      │
│   │    image              │    │   Email              │      │
│   │                      │    │   Social links       │      │
│   └──────────────────────┘    └──────────────────────┘      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

- 2-column: map left (55%), info right (45%)
- Map: `border-radius: 16px`, `--shadow-card` — iframe or static image
- Contact details: DM Sans 400, `--text-on-dark`
- Social links: Bootstrap Icons (Facebook, Instagram, YouTube), `--accent-gold` color, hover: `--accent-red`
- Heading on gold gradient: use `--text-primary` (dark text on gold bg)
- GSAP: fade-up entrance

---

### 10. Footer (`#section-footer`)

**Background:** `--bg-light`
**Padding:** 80px top / 40px bottom

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ┌─────────────┐                                           │
│   │  logo.png   │    Dutta Bagan Adhibashibrinda            │
│   │  (large)    │    Durga Puja Committee                   │
│   └─────────────┘    Est. [year]                            │
│                                                             │
│   ── thin line ──────────────────────────────────────────   │
│                                                             │
│   Made with devotion in Kolkata          Social icons       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

- Logo: `assets/images/Dutta bagan.png`, max-height 100px
- Committee name: Cinzel 600, `--text-on-dark`
- Establishment line: DM Sans 300, `--text-muted`
- Thin divider: `--accent-gold` at 0.3 opacity
- Bottom row: copyright left, social icons right, `--accent-gold`
- Subtle `arch.png` at 4% opacity as background watermark

---

## Build order

| Step | Section | Estimated file changes |
|------|---------|----------------------|
| 1 | About Us | index.html, main.css, animations.js |
| 2 | Achievements strip | index.html, main.css, animations.js |
| 3 | Media showcase | index.html, main.css, animations.js, interactions.js |
| 4 | Bengali typography | index.html, main.css, animations.js |
| 5 | Committee members | index.html, main.css, app.js, animations.js |
| 6 | Music release | index.html, main.css, animations.js |
| 7 | Memories gallery | index.html, main.css, app.js, animations.js, interactions.js |
| 8 | Contact / CTA | index.html, main.css, animations.js |
| 9 | Footer | index.html, main.css |
| 10 | Polish: mobile responsive pass across all sections | main.css |

Each step: build HTML structure → style in CSS → wire GSAP animations → test in browser → commit.

---

## Global animation patterns (all post-hero sections)

- **Section entrance:** `.anim-fadeup` class — opacity 0 → 1, y 40 → 0, GSAP ScrollTrigger
- **Stagger children:** `.anim-stagger > *` — 0.12s stagger, GSAP
- **Parallax backgrounds:** `arch.png` or decorative elements with `yPercent: -30`, scrub
- **Line-draw:** `.line-draw` — `scaleX: 0 → 1`, transform-origin left, GSAP ScrollTrigger
- **Counter animation:** stat numbers count up from 0, GSAP `textContent` tween

---

## Assets needed

| Asset | Status | Notes |
|-------|--------|-------|
| `arch.png` | Have | Traditional arch — used as decorative bg |
| `Dutta bagan.png` | Have | Committee logo |
| `logo.jpg.jpeg` | Have | Alternate logo format |
| `hero.mp4` | Have | Hero video |
| Committee member photos | Placeholder | Need from committee or use placeholder cards |
| Gallery photos | Placeholder | Need archival Durga Puja photos |
| Album art | Placeholder | Need from committee |
| Supporting video/photos | Placeholder | For media showcase section |
| Google Map embed code | Needed | Committee venue location |

---

## Typography quick reference

| Use | Font | Weight | Size |
|-----|------|--------|------|
| Section eyebrow | DM Sans | 500 | 0.68rem, uppercase, 0.2em spacing |
| Section heading | Playfair Display | 700 | clamp(2rem, 4vw, 3.5rem) |
| Bengali feature | Noto Sans Bengali | 700 | clamp(5rem, 14vw, 12rem) |
| Body text | DM Sans | 300 | 1rem–1.125rem, line-height 1.85 |
| Stat number | Cinzel | 900 | 2.5rem |
| Card name | DM Sans | 500 | 1rem |
| Caption/label | DM Sans | 500 | 0.7rem, uppercase, 0.14em spacing |
| Ghost button | DM Sans | 500 | 0.8rem, uppercase, 0.1em spacing |
