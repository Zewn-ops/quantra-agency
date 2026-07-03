# Quantra Digital Agency — Claude Code Instructions

## Stack
Vanilla HTML + CSS + JS. No build tools, no npm, no frameworks. Deploy target: Vercel.

## File structure
```
index.html              ← homepage (root)
pages/                  ← all other pages
css/
  tokens.css            ← design tokens (import first)
  styles.css            ← all component styles (imports tokens.css)
js/main.js              ← all client-side logic
assets/
  brand/                ← logos, icon-logo.svg
  icons/                ← SVG icons used in feature/infra cards
  logos/                ← client + tool logos (.webp)
  social/               ← social media icons
docs/                   ← design system docs (not served)
vercel.json             ← clean-URL rewrites
```

## Routing
Clean URLs via `vercel.json` rewrites. **Never add `cleanUrls` or `trailingSlash`** — these caused a 404 regression in production. All new pages need:
1. A `pages/<name>.html` file
2. A `{ "source": "/<name>", "destination": "/pages/<name>.html" }` entry in `vercel.json`

## Two-aesthetic design system

This codebase intentionally has **two equal aesthetics**. Do not try to unify them.

### Sharp / Technical (index, web-dev, design)
- Terminal markers (`>_`) in headings and section titles
- Feature cards with shimmer gradient borders (`.feature-card`, `.infra-card`)
- Process cards with coloured tints (`.card-green`, `.card-blue`, `.card-purple`)
- Sharp hover: `translateY(-8px)` + green glow shadow
- Transitions: `0.5s cubic-bezier(0.25, 1, 0.5, 1)`
- Border radii: 32–42px on cards, 24px on grid cards
- Modal prompts use `>_ Executing: script.sh` format

### Soft / Conversational (was the IT Support page — removed 2026-06-27)
> No page currently uses the Soft aesthetic. The classes/CSS below are kept and
> still valid for any future warm/conversational page.
- No `>_` markers in body content
- Soft step cards (`.soft-step-card`) with plain 1px borders
- Tier cards (`.tier-card`) with no shimmer
- Soft hover: `translateY(-4px)`, no green glow
- Transitions: `0.3s ease`
- Border radii: 20px on cards, 14px on FAQ, 16px on examples
- Modal prompts use plain English (`"Lite plan — for small ongoing fixes"`)
- Modifier classes pattern: `hero-section--soft`, `final-cta-section--soft`

## Shared chrome (every page)
All pages share identical navbar + side menu + footer. Changes to these must be replicated across all 10 HTML files:
- `index.html` (home — vision-led: "your whole digital backbone, one team"; warm/soft narrative blocks blended with the sharp shell; routes to service pages, CTA = book a call)
- `pages/automation.html`
- `pages/web-dev.html`
- `pages/design.html`
- `pages/about.html` (Sharp shell + blended warm; collaborative-with-client story — "we're not an agency that hands you off"; reuses home's warm-card / why-item / cta classes, no new CSS)
- `pages/contact.html`
- `pages/thank-you.html`
- `pages/privacy.html`
- `pages/terms.html`
- `pages/cookies.html`

> IT Support page was removed (2026-06-27). The side-menu "Automation" entry is now an active link → `/automation` (no longer disabled). "Coming Soon" stays disabled.

Side menu `active-link` mapping:
- `index.html` → Home
- `automation.html` → Automation
- `web-dev.html` → Web Development
- `design.html` → Branding & Design
- `about.html` → About
- `contact.html` → Book a Call
- All others → none

> About page added 2026-06-30 (menu order: Home · Web Development · Branding & Design · Automation · **About** · Coming Soon (disabled) · Book a Call). Sources: `about` / `about-mid` / `about-final` (thank-you back-button case in `main.js`).

## JavaScript (js/main.js)
Single file. Sections delimited by `// --- N. NAME ---` comments.

**Modal system:**
- Feature cards, infra cards, tier cards, and logo images all trigger `#feature-modal`
- querySelector: `'.feature-card, .infra-card, .tier-card, .clickable-logo'`
- Process step cards trigger `#process-modal`
- All modal content lives in `modalContent` and `processModalContent` objects — add new entries there
- `.tier-card` elements have no icon child; the icon display/hide guard handles this:
  ```js
  if (cardIcon) { modalIcon.setAttribute('src', cardIcon); modalIcon.style.display = 'block'; }
  else          { modalIcon.setAttribute('src', ''); modalIcon.style.display = 'none'; }
  ```

**Source tracking:**
- Every CTA link passes `?from=<source>` to `/contact`
- The thank-you page reads `?from=` and sets the back button text/href accordingly
- When adding a new service page, add a case to the `thankYouBackBtn` block in `main.js`

**Naming conventions for `?from=` sources:**
- `<page>` — main CTA (e.g. `web-dev`, `design`, `automation`)
- `<page>-final` — final CTA at bottom of page
- `<page>-retainer` — retainer-specific CTA (design only)
- `menu` — side menu Book a Call link
- `home`, `home-mid`, `home-final` — homepage CTAs
- `policy` — CTAs on privacy/terms/cookies pages

## CSS conventions
- Tokens live in `css/tokens.css` (imported at top of `styles.css`)
- New sections go at the bottom of `styles.css`, before the mobile media query block (Section 24)
- Mobile overrides go inside the existing `@media (max-width: 768px)` block
- Section comments follow the pattern: `/* --- N. SECTION NAME --- */`
- Soft aesthetic overrides for a new page go in their own section (like Section 25 for IT Support)

## Typography
- Headings: Montserrat 300 (light), 600 (semibold), 700 (bold)
- Body: Inter 400, 500, 600
- Terminal/mono elements: system `monospace`
- Standard heading pair: `.empower-light` (Montserrat 300, 56px) + `.empower-bold` (Montserrat 600, 56px)
- Hero heading pair: `.hero-title-light` + `.hero-title-bold` (64px)

## Assets
- All paths are root-relative (`/assets/...`)
- Icons are SVG, logos are `.webp`
- New service pages may need new icons in `/assets/icons/` — note any missing assets in a `<!-- TODO: -->` comment at the top of the HTML file

## Do not
- Add npm, bundlers, or framework dependencies
- Add `cleanUrls` or `trailingSlash` to `vercel.json`
- Cross-aesthetic mixing (don't put shimmer borders on soft-page cards)
- Rewrite existing page copy or structure without explicit instruction
- Commit `.env` files or secrets
