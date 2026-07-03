# Quantra Design System

## Overview

The Quantra codebase uses two co-equal visual aesthetics. They coexist deliberately — the Sharp/Technical aesthetic positions Quantra as a capable, high-performance agency for the services pages aimed at tech-forward clients; the Soft/Conversational aesthetic makes IT Support approachable to non-technical business owners. Neither is "base" and neither should be migrated toward the other.

---

## Two Aesthetics

### 1. Sharp / Technical
**Used on:** `index`, `web-dev`, `design`

**Personality:** High-contrast. Confident. Terminal-inspired. Optimized.

| Property | Value |
|---|---|
| Card hover lift | `translateY(-8px)` |
| Card hover shadow | `0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(129,255,165,0.05)` |
| Transition | `0.5s cubic-bezier(0.25, 1, 0.5, 1)` |
| Feature card radius | `32px` |
| Infra/process card radius | `24px` |
| Slider/footer card radius | `42px` |
| Card border treatment | Animated shimmer gradient via `::before` pseudo-element |
| Section heading suffix | ` >_` (literal terminal marker) |
| Modal prompt style | `>_ Executing: script.sh` |
| Hero background | `radial-gradient(circle at top, rgba(20,30,80,0.5) ...)` |

**Glass card pattern:** All sharp-aesthetic cards use a `::before` pseudo-element with `mask-composite: exclude` to create an animated gradient border, combined with a semi-transparent dark background for the glass effect.

```css
/* Example: feature-card */
background: rgba(10, 14, 23, 0.4);
backdrop-filter: blur(1px);
border-radius: 32px;

::before {
    padding: 2px;
    background: linear-gradient(135deg, ...shimmer...);
    mask-composite: exclude; /* creates the border-only effect */
    background-size: 200% 200%;
    animation: fluidGradient 4s ease-in-out infinite;
}
```

---

### 2. Soft / Conversational
**Used on:** `support`

**Personality:** Warm. Approachable. No jargon. Accessible to non-technical readers.

| Property | Value |
|---|---|
| Card hover lift | `translateY(-4px)` |
| Card hover shadow | `0 12px 30px rgba(0,0,0,0.3)` |
| Transition | `0.3s ease` |
| Tier card radius | `20px` |
| Step card radius | `20px` |
| FAQ item radius | `14px` |
| Help example radius | `16px` |
| Card border treatment | Plain `1px solid var(--border-subtle)` — no shimmer, no pseudo-element |
| Section heading suffix | None (or `<em>` italic for emphasis) |
| Modal prompt style | Plain English, e.g. `"Lite plan — for small ongoing fixes"` |
| Hero layout | Two-column with illustration placeholder |

**Soft modifier classes:** Rather than overriding base classes, soft pages use BEM-style modifiers:
- `.hero-section--soft` — reduced top padding, two-column layout
- `.final-cta-section--soft` — removes radial-gradient background
- `.hero-subtitle--soft`, `.hero-description--soft` — adjust weight and line-height
- `.hero-highlight--soft` — removes pill background, renders as plain italic text

---

## Colour Palette

| Token | Value | Usage |
|---|---|---|
| `--brand-green` | `#81FFA5` | Primary accent, active states, brand emphasis |
| `--bg-dark` | `#0A0E17` | Page background |
| `--bg-side-menu` | `#0D121D` | Side menu panel |
| `--text-light` | `#e0e0e0` | Body text on dark backgrounds |
| `--text-muted` | `#a0a0a0` | Secondary text, labels, terminal text |
| `--text-dimmer` | `#808080` | Footer meta text, legal text |
| `--border-subtle` | `rgba(255,255,255,0.1)` | Dividers, input borders, soft card borders |
| `--bg-tint-pledge` | `rgba(129,255,165,0.015)` | Pledge section background tint |
| `--bg-card-green` | `#152B1B` | Process card (Step 1 / Discovery) |
| `--bg-card-blue` | `#000061` | Process card (Step 2 / Blueprint), form card, tools ticker |
| `--bg-card-purple` | `#2A1635` | Process card (Step 3 / Build) |

**Button gradient:** `linear-gradient(to right, #4286f4, #00ff9d)` (nav-btn, hamburger spans)  
**Large CTA gradient:** `linear-gradient(to right, #5c4ca8, #81FFA5)`  
**Hero highlight pill:** `linear-gradient(90deg, #4b6cb7, #5c4ca8)` (default; web-dev/design override to accent)

---

## Per-Service Accent System (added 2026-06-30)

The sharp design system is built off the **automation page** (the original "home"). Every page shares
that skeleton; the three **service** pages are differentiated by a single accent colour, set on
`<body class="svc-*">` and consumed by `var(--accent)` / `var(--accent-rgb)` / `var(--hero-glow)`.

| Page | `body` class | Accent | Hero glow | Node motif |
|---|---|---|---|---|
| Automation | `svc-automation` | green `#81FFA5` | green-tinted radial | green (no filter) |
| Web Development | `svc-web-dev` | blue `#4286f4` | blue radial | denser, `hue-rotate(85deg)` |
| Branding & Design | `svc-design` | purple `#8a6dff` | purple radial | softer/larger, `hue-rotate(120deg)` |
| Home / About | *(none)* | green (default) | default blue radial | green |

**What the accent re-tints** (via `var(--accent-rgb)` / `var(--hero-glow)`): the **hero only** — the
hero radial glow, the hero node-motif tint, and the hero-highlight pill (web-dev/design). **What stays
green (brand thread, intentional — reverted 2026-06-30 per Zewn):** ALL card shimmer borders
(`.border-green::before`, `.service-card::before`, `.warm-card::before` use `var(--brand-green-rgb)`)
+ card hover glow, plus the logo, nav, footer, and the `.brand-green` emphasis words / `>_` markers on
every page. So the per-service difference now lives **only in the hero wash** (green/blue/purple); the
card system is uniformly green across the whole site. Tokens live in `css/tokens.css`; per-page hero
overrides in `styles.css` **Section 27**.

> Automation's pill stays the default blue-purple (green pill + white text = poor contrast); web-dev
> and design pills take the accent (white on blue/purple is fine).

## Home + About — glass-card alignment (2026-06-30)

Home and About now use the **same sharp glass-card system** as the service pages (per Zewn: the
automation page is the source of truth). `.warm-card`, `.service-card` (and the home services spread)
got: glass bg `rgba(10,14,23,0.4)` + `backdrop-filter`, **animated shimmer gradient borders** (the
`::before` mask trick, registered in Section 19's `fluidGradient` list), sharp radii + hover. They keep
the green accent + a slightly **softer** shimmer than the service cards so Home/About read as "same
system, a touch distinct." Replaced the old flat `1px solid var(--border-subtle)` treatment.

## Numbered Callouts (01 / 02 / 03)

Design-system component for the "why / how" numbered grids (`.why-num`). Montserrat 700, 56px,
colour `var(--num-color)` = `rgba(129,255,165,0.80)` (**brightened 0.28 → 0.55 → 0.80 on 2026-06-30**
— bold, clearly legible). Used on Home (why) + About (how-we-work).

---

## Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| Hero headings | Montserrat | 300 / 600 | 64px |
| Section headings | Montserrat | 300 / 600 | 56px |
| Card titles | Montserrat | 300 | 36px |
| Feature card titles | Montserrat | 700 | 24px |
| Step titles (soft) | Montserrat | 600 | 22px |
| Tier names (soft) | Montserrat | 600 | 40px |
| Step numbers (soft) | Montserrat | 700 | 52px |
| Body large | Inter | 400/500 | 20px |
| Body default | Inter | 400 | 18px |
| Body small | Inter | 400 | 16px |
| Labels / meta | Inter | 500/600 | 12–14px |
| Terminal / mono | monospace | bold | 14–18px |

**Heading pattern (Sharp pages):** Two stacked lines — `.empower-light` (thin, lowercase) then `.empower-bold` (semibold, with `.brand-green` span + ` >_` suffix).

**Heading pattern (Soft pages):** Same structure but `>_` replaced with `<em>` italic text. Headings can be sentence case.

---

## Animation

| Name | Duration | Usage |
|---|---|---|
| `fluidGradient` | 4s ease-in-out | Shimmer borders on all glass cards |
| `fluidGradient` | 1.5s linear | Button gradient animation |
| `scrollLogos` | 40s linear | Logo ticker scroll |
| `slowSpin` | 8s linear | Footer icon spin |
| `blinkCursor` | 1s step-end | Terminal cursor blink |

**`fluidGradient` keyframes:**
```css
0%   { background-position: 0% 50%; }
50%  { background-position: 100% 50%; }
100% { background-position: 0% 50%; }
```
Applied via `background-size: 200% 200%` on the element.

---

## Modal System

Two modal instances per page: `#feature-modal` and `#process-modal`. Both use the `.glass-modal-overlay` + `.glass-modal-card` pattern.

**Feature modal** — triggered by click on `.feature-card`, `.infra-card`, `.tier-card`, `.clickable-logo`. Data resolved via `data-modal` attribute against the `modalContent` object in `main.js`.

**Process modal** — triggered by `.process-step-card`. Data via `data-step` attribute against `processModalContent`. The modal card receives a tint modifier class (`modal-step-green`, `modal-step-blue`, `modal-step-purple`) set by JS.

**Icon handling:** Feature/infra cards pass their `.feature-svg` or `.infra-icon` src as the modal icon. Tier cards and logo images have no matching icon child; JS hides `#modal-icon` when src would be empty.

---

## Navigation

**Navbar:** Sticky, `z-index: 100`, `backdrop-filter: blur(10px)`. Three elements: hamburger (left), logo (absolute centered), nav CTA button (right).

**Side menu:** Fixed panel, slides in from left. `z-index: 9999` with `z-index: 9998` overlay. Background `#0D121D`, `border-right: 2px solid var(--brand-green)`.

**Active state:** `.active-link` class on the current page's menu item. Set in HTML per-page (not by JS).

**Disabled items:** `<div class="terminal-link disabled">` for coming-soon entries. `cursor: not-allowed`, `opacity: 0.5`.

---

## Form & Source Tracking

All CTAs that lead to `/contact` pass `?from=<source>`. The form POSTs (currently `preventDefault`) and redirects to `/thank-you?from=<source>`. The thank-you page reads that param and sets the back button text and href contextually.

**Source naming:**
- `<page>` — primary service page CTA
- `<page>-final` — bottom-of-page final CTA
- `<page>-retainer` — retainer CTA (design only)
- `home`, `home-mid`, `home-final` — homepage
- `menu` — side menu
- `policy` — legal pages
