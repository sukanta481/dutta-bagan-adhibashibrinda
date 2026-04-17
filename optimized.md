# PageSpeed Optimization Plan — Adhibashibrinda

Baseline (mobile, gallery-2025.html, PageSpeed Insights):
- **Performance: ~52**
- **Accessibility: ~92**
- **Best Practices: 100**
- **SEO: ~92**

The main blocker is **payload size**, not code. The site ships ~60+ MB of hero/background artwork and ~150+ MB of gallery images at full resolution to every device. Everything else is secondary.

**Core Web Vitals targets (what Lighthouse is measuring):**
| Metric | Good | Needs work | Poor | Current (est.) |
|--------|------|-----------|------|----------------|
| LCP (Largest Contentful Paint) | ≤ 2.5s | 2.5–4.0s | > 4.0s | ~7–9s |
| FCP (First Contentful Paint)   | ≤ 1.8s | 1.8–3.0s | > 3.0s | ~3–5s |
| TBT (Total Blocking Time)      | ≤ 200ms | 200–600ms | > 600ms | ~400ms |
| CLS (Cumulative Layout Shift)  | ≤ 0.1 | 0.1–0.25 | > 0.25 | depends on page |
| INP (Interaction to Next Paint) | ≤ 200ms | 200–500ms | > 500ms | likely OK |
| Speed Index                    | ≤ 3.4s | 3.4–5.8s | > 5.8s | ~5–7s |

---

## 1. What's actually slow (measured)

Files in `c:\xampp\htdocs\adhibashibrinda\assets\images\` — **updated 2026-04-17 after Phase 1 pass**:

| File | Was | Now | Status |
|------|-----|-----|--------|
| `hero-cover.webp` | 2.0 MB | **163 KB** | ✅ rebuilt at 1600w/q72 |
| `About-hero.webp` | 1.8 MB | **129 KB** | ✅ rebuilt |
| `gallery-hero.webp` | 1.8 MB | **129 KB** | ✅ rebuilt |
| `aboutusbg.webp` | 2.9 MB | **129 KB** | ✅ rebuilt at 1600w/q65 |
| `galarybg.webp` | 1.5 MB | **219 KB** | ✅ rebuilt |
| `arch-red.webp` | 1.0 MB | **50 KB** | ✅ rebuilt at 900w/q72 |
| `mangokolka1.webp` | 427 KB | 427 KB | 🟢 used 20× in marquee, cached once (skip dedupe for now) |
| `Gallery/2025/` originals | 152 MB | 152 MB | ⏸ kept for lightbox; grid uses thumbs |
| `Gallery/2025/thumbs/` | — | **2.3 MB** | ✅ 39 WebP thumbs at 800w/q75 |
| `Gallery/2024/thumbs/` | — | **692 KB** | ✅ 8 thumbs |
| `Gallery/2026/thumbs/` | — | **564 KB** | ✅ 10 thumbs |

**Hero payload:** ~10.0 MB → ~820 KB (-92%).
**Gallery-grid payload:** 213 MB originals → 3.5 MB thumbs (-98%). Originals still load, but only via lightbox click.

Old oversized WebPs backed up to [_originals-backup/](assets/images/_originals-backup/) before rebuild. The raw `.svg` / `.png` source files (~60 MB combined) can be deleted from repo after live testing.

**Lesson:** `cwebp -q 78` on a 20 MP source still produces a ~2 MB file. **Resize THEN encode.**
```bash
# ffmpeg recipe (what was actually used)
ffmpeg -y -i source.webp -vf "scale='min(1600,iw)':-2" \
  -c:v libwebp -quality 72 -compression_level 6 out.webp
```

**Lesson:** `cwebp -q 78` on a 20 MP source still produces a ~2 MB file. **Resize THEN encode.**
```bash
# correct recipe — resize to 1600px wide, then WebP at q=70
magick "source.jpg" -resize 1600x -quality 88 "tmp.jpg"
cwebp -q 70 "tmp.jpg" -o "out.webp"
rm tmp.jpg
```

**Phase 1 status (2026-04-17):** Actions 1.1, 1.2, 1.4 complete. 1.3 (responsive srcset) and 1.5 (marquee dedupe) deferred — heroes already tiny (~130 KB) after rebuild, so marginal gain isn't worth the HTML churn yet.

Other contributors:
- **7 Google Font families** loaded (`Playfair Display`, `DM Sans`, `Cinzel`, `Fira Sans`, `Poppins`, `Montserrat` — Fira Sans & Cinzel aren't even used).
- **6 render-blocking CDN scripts** load before content paints (Bootstrap CSS/JS, Bootstrap Icons, jQuery, GSAP, ScrollTrigger, Vue).
- **No cache headers** on Hostinger default — every visit re-downloads static assets.
- **Loader overlay** holds the screen black until `window.load`, which waits for every image.

---

## 2. Fix plan — ordered by impact

### Phase 1 — Images (biggest win, ~70% of payload)

**Action 1.1: Convert the raster-wrapped SVGs to WebP**
These "SVG" files are just JPEGs stuffed inside an SVG wrapper. They gain nothing from being SVG and lose WebP's 30–50 % compression.

```bash
# Install cwebp once (Windows: https://developers.google.com/speed/webp/download)

# Run from project root
cwebp -q 78 "assets/images/hero-cover.svg" -o "assets/images/hero-cover.webp" done
cwebp -q 78 "assets/images/About-hero.svg" -o "assets/images/about-hero.webp" done
cwebp -q 78 "assets/images/gallery-hero.svg" -o "assets/images/gallery-hero.webp" done
cwebp -q 75 "assets/images/aboutusbg.svg"   -o "assets/images/aboutusbg.webp"
cwebp -q 75 "assets/images/galarybg.png"    -o "assets/images/galarybg.webp"
cwebp -q 80 "assets/images/arch.png"        -o "assets/images/arch.webp" done
cwebp -q 80 "assets/images/mangokolka1.png" -o "assets/images/mangokolka1.webp" done
cwebp -q 80 "assets/images/mangokolka2.png" -o "assets/images/mangokolka2.webp" done
```

Expected: **9.5 MB → ~180 KB** for hero-cover alone.

Then update every HTML reference:
```html
<!-- Before -->
<img src="assets/images/hero-cover.svg" alt="">
<!-- After — with PNG fallback -->
<picture>
  <source srcset="assets/images/hero-cover.webp" type="image/webp">
  <img src="assets/images/hero-cover.jpg" alt="">
</picture>
```

**Action 1.2: Build gallery thumbnails**
Right now `gallery.html` loads 213 MB of full-res originals into thumbnail tiles. Create a `Gallery/<year>/thumbs/` folder with 600px-wide WebP copies.

```bash
# For each year folder — requires ImageMagick
for f in assets/images/Gallery/2025/*.jpeg; do
  name=$(basename "$f" .jpeg)
  magick "$f" -resize 800x -quality 78 "assets/images/Gallery/2025/thumbs/${name}.webp"
done
```

Update `gallery-feed.php` to return both `thumb` and `full` URLs, and update [gallery-page.js](assets/js/gallery-page.js) + [gallery-slider.js](assets/js/gallery-slider.js) to use `thumb` in `<img src>` and `full` for the lightbox.

**Action 1.3: Responsive images with `srcset`**
Serve smaller images to phones. Create 3 sizes per hero: 640w, 1200w, 1920w.

```html
<img
  src="assets/images/hero-cover-1200.webp"
  srcset="assets/images/hero-cover-640.webp 640w,
          assets/images/hero-cover-1200.webp 1200w,
          assets/images/hero-cover-1920.webp 1920w"
  sizes="100vw"
  alt=""
  loading="eager"
  fetchpriority="high">
```

**Action 1.4: Lazy-load everything below the fold**
Every `<img>` outside the initial viewport must have `loading="lazy"`. Already done for many; audit the remaining ones in [index.html](index.html), [about.html](about.html), [gallery.html](gallery.html).

**Action 1.5: Deduplicate the marquee**
`mangokolka1.png` appears in 14 `<img>` tags on [index.html](index.html). Browsers cache it after the first fetch, but each tag still decodes and renders separately. Swap all marquee `<img>` for a single shared CSS `background-image` on an element repeated via `background-repeat`, or use a `<symbol>` + `<use>` SVG reference once.

---

### Phase 2 — Fonts (~5 % saving, but blocks render)

Currently loading **6 families × 5–7 weights = ~600 KB of font CSS + WOFF2**.

**Action 2.1: Drop unused families**
Audit: `Fira Sans` and `Cinzel` are imported but barely used. `Montserrat` overlaps with `Poppins`. Pick **3 families max**:
- `Playfair Display` (headings)
- `Poppins` (body, nav)
- `DM Sans` (UI labels) — or merge into Poppins

**Action 2.2: Trim weights**
Each weight is a separate file. Keep 2–3 weights per family, not 7.

**Action 2.3: Preload the LCP font**
```html
<link rel="preload" as="font" type="font/woff2"
      href="https://fonts.gstatic.com/s/playfairdisplay/..."
      crossorigin>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

**Action 2.4: `font-display: swap`**
Google Fonts already supplies this via `&display=swap` — confirmed present in current URL.

---

### Phase 3 — Render-blocking scripts

Current order in every HTML file:
```
GSAP → ScrollTrigger → jQuery → Bootstrap JS → Vue → app.js → animations.js → interactions.js → scroll-reveal.js
```

**Action 3.1: Defer everything non-critical**
```html
<script defer src=".../gsap.min.js"></script>
<script defer src=".../ScrollTrigger.min.js"></script>
<script defer src=".../jquery.min.js"></script>
<script defer src=".../bootstrap.bundle.min.js"></script>
<script defer src=".../vue.global.prod.min.js"></script>
<script defer src="assets/js/app.js"></script>
<script defer src="assets/js/animations.js"></script>
<script defer src="assets/js/interactions.js"></script>
<script defer src="assets/js/scroll-reveal.js"></script>
```
`defer` preserves execution order, doesn't block HTML parsing.

**Action 3.2: Drop jQuery**
Only `interactions.js` uses it. ~30 KB gone. Rewrite in ~15 lines of vanilla JS.

**Action 3.3: Drop Bootstrap JS bundle if unused**
If no dropdowns/modals/carousels are wired through Bootstrap's JS, you only need the CSS. Saves ~80 KB minified.

**Action 3.4: Load Vue only on pages that use it**
Gallery listing / filter pages need it. Contact / about may not.

---

### Phase 4 — Caching (free, one-file fix)

Hostinger shared defaults to no `Cache-Control`. Add `.htaccess` at project root:

```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp          "access plus 1 year"
  ExpiresByType image/jpeg          "access plus 1 year"
  ExpiresByType image/png           "access plus 1 year"
  ExpiresByType image/svg+xml       "access plus 1 year"
  ExpiresByType text/css            "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType font/woff2          "access plus 1 year"
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml
</IfModule>
```

Keep the `?v=YYYYMMDD-N` busting you already use for cache invalidation.

---

### Phase 5 — Loader strategy

The loader currently blocks FCP until `window.load` — which waits for *every image*. Even with the recent simplification, this penalizes PageSpeed.

**Action 5.1: Dismiss on `DOMContentLoaded`, not `load`**
```js
// assets/js/loader.js
window.addEventListener('DOMContentLoaded', finish, { once: true });
setTimeout(finish, 1500); // failsafe
```
That lets LCP paint while late images decode behind the now-hidden loader.

**Action 5.2: Inline the loader CSS**
Put `.page-loader { ... }` in a `<style>` block in `<head>` so it doesn't wait for `main.css` to download.

---

## 3. Mobile vs desktop specifics

### Mobile (priority)
Mobile is what PageSpeed scores and what 70 % of visitors use.

| Concern | Fix |
|---------|-----|
| Small viewport but huge images | Serve 640w WebP via `srcset` |
| Slow CPU — JS parsing cost | Defer all scripts; drop jQuery/Bootstrap JS |
| High-latency cellular | Preconnect to fonts.gstatic.com; preload LCP image |
| Loader animation heavy | Already minimized; ensure it dismisses early |
| Marquee is decorative | Consider `prefers-reduced-motion` + shorter track on mobile |

### Desktop
Easier win — keep quality, still optimize.

| Concern | Fix |
|---------|-----|
| 1920w hero | Ship 1920w WebP at q=75 (≈300 KB, not 9 MB) |
| Gallery hover effects | Keep, they're cheap |
| Multiple font weights OK | Still trim to ≤3 families, 3 weights each |

### One responsive image pattern to use everywhere
```html
<picture>
  <source
    type="image/webp"
    srcset="assets/images/x-640.webp 640w,
            assets/images/x-1200.webp 1200w,
            assets/images/x-1920.webp 1920w"
    sizes="(max-width: 768px) 100vw, 100vw">
  <img
    src="assets/images/x-1200.jpg"
    alt="…"
    width="1200" height="800"
    loading="lazy"
    decoding="async">
</picture>
```
`width`/`height` attributes prevent Cumulative Layout Shift (CLS).

---

## 4. Execution order (do this, in this order)

1. **Install `cwebp` and ImageMagick** — one-time.
2. **Convert the 8 heavy hero/background images to WebP** — single command block above. Commit.
3. **Resize gallery folders into `thumbs/`** — batch script. Commit.
4. **Update HTML to use `<picture>` with `srcset`** — page by page.
5. **Update `gallery-feed.php` + gallery JS to use thumbs for tiles, full for lightbox.**
6. **Trim Google Fonts URL to 3 families × 3 weights; add `preconnect` + `preload`.**
7. **Add `defer` to every CDN script tag.**
8. **Drop jQuery; rewrite `interactions.js` in vanilla.**
9. **Create `.htaccess` with the caching + gzip block above.**
10. **Switch loader to `DOMContentLoaded` + inline its CSS in `<head>`.**
11. **Re-run PageSpeed.** Target: Mobile ≥ 80, Desktop ≥ 95.

---

## 5. Rules to never break again (future prevention)

These are project-specific — breaking any of them re-introduces the same problems.

### Images
- [ ] **No raster images wrapped in SVG.** If the file contains `<image xlink:href="data:image/jpeg;base64,...">`, it's not an SVG. Export as WebP/JPEG directly.
- [ ] **No image > 300 KB on mobile-first pages.** If source is bigger, build a smaller variant.
- [ ] **Resize BEFORE encoding.** `cwebp -q 70` on a 6000×4000 source still produces a ~2 MB file. Downscale to target width (≤1920 for heroes, ≤800 for thumbs) first, then encode.
- [ ] **Every `<img>` gets `width`, `height`, `alt`, and `loading="lazy"`** (except the LCP image — that gets `fetchpriority="high"` and `loading="eager"`).
- [ ] **Never use `loading="lazy"` on the LCP image.** It silently destroys LCP score.
- [ ] **Gallery originals never ship to thumbnails.** Thumbs live in a sibling `thumbs/` folder.
- [ ] **Prefer WebP** with JPEG/PNG fallback via `<picture>`.
- [ ] **Decorative images use `alt=""` + `aria-hidden="true"`**, not a made-up description.

### Fonts
- [ ] **Max 3 font families, 3 weights each.** Every extra weight is a separate download.
- [ ] **No Google Font preview URL** (comma-separated families bloat). Build a single combined URL.
- [ ] **Preconnect `fonts.gstatic.com`; preload the LCP-weight font file.**

### Scripts
- [ ] **Every `<script src>` outside `<head>` gets `defer`.**
- [ ] **No library added unless a component actually uses it.** Don't ship Vue on a static page.
- [ ] **No jQuery in new code.** Vanilla JS is enough for DOM interactions on this site.

### HTML / CSS
- [ ] **Inline critical CSS in `<head>`** (at minimum the loader + above-the-fold layout).
- [ ] **No layout animation on `width`/`height`/`margin`** — only `transform` and `opacity` (already in CLAUDE.md — keep holding the line).
- [ ] **Cache-bust with `?v=…`** when changing a file; never rely on Hostinger clearing for you.
- [ ] **Every page ships a `<meta name="description">` and `<link rel="canonical">`.**
- [ ] **`<title>` is unique per page, ≤60 chars, ASCII-clean** (no stray encoding artifacts — about.html has one today, fix it).

### Deployment (Hostinger-specific)
- [ ] **Upload the `.htaccess`** — it's the cheapest 30-point performance boost.
- [ ] **Check case-sensitivity before committing** — `Gallery/` vs `gallery/` breaks live but not XAMPP. Linux is strict.
- [ ] **Compress images locally before upload**, not "we'll do it later".

---

## 6. Lighthouse audit → fix mapping

One-line fix for each audit name PageSpeed tends to flag on this project.

### Performance audits
| Lighthouse audit | What it means here | Fix |
|------------------|--------------------|-----|
| Serve images in next-gen formats | The raster-in-SVG heroes + mangokolka PNGs | Phase 1 Action 1.1 (WebP conversion) |
| Properly size images | Gallery originals served as thumbnails | Phase 1 Action 1.2 (thumbs) + 1.3 (srcset) |
| Efficiently encode images | WebP files at q=88 still 2 MB | **Resize THEN encode** — §1 recipe |
| Defer offscreen images | Below-fold `<img>` without `loading="lazy"` | Action 1.4 — audit every `<img>` |
| Eliminate render-blocking resources | 6 CDN `<script>` + Google Fonts | Action 3.1 (`defer`) + Action 2.3 (preload) |
| Reduce unused JavaScript | Bootstrap JS bundle + jQuery on pages that don't need them | Action 3.2 + 3.3 + 3.4 |
| Reduce unused CSS | Bootstrap CSS shipping all utilities | Low priority — PurgeCSS not worth it on a 4-page site |
| Minify JavaScript / CSS | Already minified via CDN | N/A |
| Enable text compression | No gzip on Hostinger by default | `.htaccess` mod_deflate block (Phase 4) |
| Use efficient cache policy | No `Cache-Control` headers | `.htaccess` mod_expires block (Phase 4) |
| Avoid enormous network payloads | ~60 MB hero art + ~213 MB gallery | Phase 1 (the whole point of this doc) |
| Minimize main-thread work | GSAP + Vue + jQuery all parsing on load | Action 3.1 `defer` + drop jQuery (3.2) |
| Reduce JavaScript execution time | Same as above | Same as above |
| Avoid large layout shifts (CLS) | `<img>` without `width`/`height` | Always set intrinsic dimensions (§3 pattern) |
| Preconnect to required origins | Fonts + CDN not preconnected | Action 2.3 + add `<link rel="preconnect">` for jsdelivr / cdnjs |
| Preload key requests | LCP hero image + primary font | `<link rel="preload" as="image" fetchpriority="high" href="hero-cover.webp">` |
| Avoid chaining critical requests | CSS → JS → image → font cascade | Preload hero image; inline loader CSS |
| Ensure text remains visible during webfont load | Needs `font-display: swap` | Google Fonts URL already has `&display=swap` — keep it |
| Image elements have explicit width and height | Many `<img>` missing attrs | Audit + add — prevents CLS |
| Largest Contentful Paint image was lazily loaded | Hero with `loading="lazy"` | Hero gets `loading="eager"` + `fetchpriority="high"` |
| Avoid non-composited animations | Animating `width`/`height`/`margin` | CLAUDE.md already forbids this — keep holding line |

### Accessibility audits
| Lighthouse audit | What it means here | Fix |
|------------------|--------------------|-----|
| Background and foreground colors have sufficient contrast | `--text-muted` (#7A7268) on `--bg-base` (#FAF8F5) is borderline; `--accent-gold` on white fails | Use `--text-body` for body copy; reserve `--text-muted` for decorative labels only (≥14px bold) |
| Image elements have `[alt]` attributes | Decorative `<img>` use empty `alt=""`; content images need real alt | Committee portraits: `alt="Mrs. Debika Chakraborty, Club President"`. Watermarks: `alt=""` + `aria-hidden="true"` |
| Links have discernible names | "Read more" / icon-only links | Add `aria-label` to social icons and bare-icon buttons |
| Form elements have associated labels | Gallery year `<select>` | Wrap in `<label>` or add `aria-label` |
| `[aria-*]` attributes match their roles | Usually fine; audit any custom widgets | Keep ARIA minimal — native HTML first |
| Heading elements appear in sequential order | Don't skip `<h2>` → `<h4>` | Follow `<h1>` hero → `<h2>` section → `<h3>` sub |
| `<html>` has a `lang` attribute | Already `<html lang="en">` — keep it | ✅ |
| Page has a logical tab order | Skip-links for nav | Add `<a class="visually-hidden-focusable" href="#main">Skip to content</a>` |
| Touch targets are sized appropriately | Min 48×48 px on mobile | Audit nav burger, gallery filter, social icons |

### SEO audits
| Lighthouse audit | What it means here | Fix |
|------------------|--------------------|-----|
| Document has a `<title>` | Confirm every page has a distinct title (about.html title contains a stray encoding char — fix) | Clean titles + keep ≤60 chars |
| Document has a meta description | Currently missing on most pages | Add `<meta name="description" content="…">` per page, ≤160 chars |
| Document has a valid `rel=canonical` | Missing | `<link rel="canonical" href="https://adhibashibrinda.com/about.html">` on every page |
| Links are crawlable | Use real `href` values | No `href="#"` placeholders |
| Image elements have `[alt]` | See Accessibility above | Same fix |
| Page isn't blocked from indexing | No `noindex` on production | Confirm `robots.txt` + meta |
| Has a valid `hreflang` | Only English for now | Skip unless Bengali version ships |
| `tap-targets` are sized appropriately | Same as accessibility | Same fix |
| Structured data is valid | No `schema.org` markup yet | Add `Event` / `Organization` JSON-LD to `index.html`:

```html
<script type="application/ld+json">
{ "@context":"https://schema.org",
  "@type":"Event",
  "name":"Dutta Bagan Adhibashibrinda Durga Puja 2026",
  "startDate":"2026-10-19",
  "location":{"@type":"Place","name":"Dutta Bagan","address":"Kolkata, West Bengal, India"},
  "organizer":{"@type":"Organization","name":"Dutta Bagan Adhibashibrinda"} }
</script>
``` |

### Best Practices audits
| Lighthouse audit | What it means here | Fix |
|------------------|--------------------|-----|
| Uses HTTPS | Hostinger auto-SSL | ✅ |
| No browser errors logged to console | Keep console clean in production | Gate `console.log` calls behind a debug flag |
| Images displayed with correct aspect ratio | Gallery tiles with `object-fit: cover` | Already OK; keep intrinsic ratios |
| CSP headers | Not set | Optional — add via `.htaccess` once stable |
| Page has no HTTP/2-incompatible resources | CDN hosts already HTTP/2 | ✅ |

---

## 7. Quick wins checklist (do first, ship today)

If only an hour is available, these alone will push the score ~20 points:

- [ ] Convert `hero-cover.svg`, `About-hero.svg`, `gallery-hero.svg`, `aboutusbg.svg`, `galarybg.png`, `arch.png` to WebP and swap references.
- [ ] Add `defer` to every `<script>` tag on `index.html`, `about.html`, `gallery.html`, `contact.html`.
- [ ] Trim Google Fonts URL to 3 families, ≤3 weights.
- [ ] Ship `.htaccess` with the gzip + cache block.
- [ ] Change loader from `window.load` → `DOMContentLoaded`.

Everything else (gallery thumbnails, responsive srcset, jQuery removal) is Phase 2.
