# Page Patterns

Reusable section patterns used across the site. Each entry names the CSS classes, lists the pages it appears on, and notes any per-page variants.

---

## Shared Chrome (all 9 pages)

### Navbar
```html
<nav class="navbar">
    <div class="hamburger"><span></span><span></span><span></span></div>
    <div class="logo"><img src="/assets/brand/QuantraDigital_Logo_Full.svg" class="logo-img"></div>
    <a href="/contact?from=<source>" class="nav-btn">CTA label</a>
</nav>
```
Sticky, blurred background. CTA label and `?from=` source vary per page.

### Side Menu
```html
<div class="side-menu-overlay"></div>
<div class="side-menu">
    <div class="side-menu-header">...</div>
    <div class="side-menu-links">
        <a href="/" class="terminal-link [active-link]">...</a>
        <!-- 5 more links, last two disabled divs -->
    </div>
</div>
```
7-item list. Current page gets `active-link`. Disabled items use `<div>` not `<a>`.

### Footer
Identical across all pages. Contains: logo, bio paragraph, terminal widget (live time/location/latency), spinning icon, social icons, divider, copyright + legal links.

---

## Sharp-Aesthetic Section Patterns

### Hero — Centre-aligned (index, web-dev, design)
```html
<header class="hero-section">
    <div class="hero-content">
        <h1 class="hero-title-light">...</h1>
        <h2 class="hero-title-bold">...</h2>
        <p class="hero-subtitle">...</p>
        <p class="hero-description">...</p>
        <span class="hero-highlight">...</span>
    </div>
</header>
```
`background: radial-gradient(circle at top, rgba(20,30,80,0.5)...)`. `hero-highlight` renders as a blue-purple pill.

### Empower / Feature Grid (index, web-dev, design)
```html
<section class="empower-section">
    <div class="empower-content">
        <div class="empower-left">
            <h2 class="empower-light">...</h2>
            <h2 class="empower-bold">... <span class="brand-green">word</span> >_</h2>
            <!-- icon or empower-text block -->
        </div>
        <div class="empower-right">
            <div class="cards-grid"> <!-- 2×2 grid -->
                <div class="feature-card border-green" data-modal="id">
                    <img class="feature-svg"> <h4> <p>
                </div>
                <!-- 3 more cards, alternating border-green / border-white -->
            </div>
        </div>
    </div>
</section>
```
`.empower-right` has mountain background image and asymmetric border-radius (`80px 0 80px 0`).

### Mid-Page CTA (index, web-dev, design)
```html
<section class="cta-section">
    <a href="/contact?from=<source>" class="nav-btn">...</a>
    <div class="cta-note">
        <img src="/assets/brand/icon-logo.svg" class="cta-icon">
        <span class="cta-note-text">...</span>
    </div>
</section>
```
Used 1–2× per page between major sections.

### Logo Slider (index — clients; index, web-dev, design — tools)
```html
<section class="slider-section">
    <div class="slider-card [tools-card]">
        <div class="slider-title"><h2 class="empower-light">...</h2><h2 class="empower-bold">...</h2></div>
        <div class="slider-container">
            <div class="logo-track">
                <!-- logos duplicated for infinite loop -->
                <img class="client-logo clickable-logo" data-modal="id">
            </div>
        </div>
    </div>
</section>
```
`.tools-card` swaps background from blue (`#000061`) to dark green (`#152B1B`). Logos are `clickable-logo` and open `#feature-modal`.

### 3-Up Grid (index — infra; web-dev, design — tiers)
```html
<section class="infra-section">
    <div class="infra-container">
        <div class="infra-header">
            <h2 class="empower-light">...</h2>
            <h2 class="empower-bold">... >_</h2>
            <p class="infra-subtitle">...</p>
        </div>
        <div class="infra-grid">
            <div class="infra-card" data-modal="id">
                <img class="infra-icon"> <h4 class="infra-card-title"> <p class="infra-card-text">
            </div>
        </div>
    </div>
</section>
```
`infra-grid` is `grid-template-columns: repeat(3, 1fr)`. Cards have shimmer `::before` border.

### Process Steps (index, web-dev, design)
```html
<section class="process-section">
    <div class="process-container">
        <div class="process-header">...</div>
        <div class="process-flow">
            <div class="process-card card-green process-step-card" data-step="id">
                <h4 class="process-card-title"> <p class="process-card-text">
            </div>
            <img src="/assets/icons/icon-funnel.svg" class="process-separator">
            <!-- repeat for blue, purple -->
        </div>
    </div>
</section>
```
Three cards stacked vertically with funnel separators. Each card has a tint class + `process-step-card` for modal click. 

### Final CTA (index, web-dev, design)
```html
<section class="final-cta-section">
    <div class="final-cta-container">
        <div class="final-cta-header">
            <h2 class="empower-light">...</h2>
            <h2 class="empower-bold"><span class="brand-green">word</span> phrase?</h2>
            <p class="final-cta-subtitle">...</p>
        </div>
        <a href="/contact?from=<page>-final" class="large-cta-btn">...</a>
        <div class="cta-note">...</div>
    </div>
</section>
```
`background: radial-gradient(circle at center, rgba(129,255,165,0.03)...)`. Uses `.large-cta-btn` (larger pill, Montserrat 300 24px).

### Retainer Section (design only)
```html
<section class="retainer-section">
    <div class="retainer-container">
        <div class="retainer-header">...</div>
        <p class="retainer-body">...</p>
        <p class="retainer-subtext">...</p>
        <a href="/contact?from=design-retainer" class="nav-btn">...</a>
    </div>
</section>
```
Centre-aligned, max-width 900px. Used between the 3-up tiers grid and the tools ticker.

---

## Soft-Aesthetic Section Patterns (support only)

### Hero — Two-column with illustration (support)
```html
<section class="hero-section hero-section--soft">
    <div class="hero-content hero-content--two-col">
        <div class="hero-text">
            <h1 class="hero-title-light">...</h1>
            <h2 class="hero-title-bold">...</h2>
            <p class="hero-subtitle hero-subtitle--soft">...</p>
            <p class="hero-description hero-description--soft">...</p>
            <p class="hero-highlight hero-highlight--soft"><em>...</em></p>
        </div>
        <div class="hero-illustration-placeholder">
            <div class="illustration-frame"><span class="placeholder-label">illustration</span></div>
        </div>
    </div>
</section>
```
60/40 column split. `hero-highlight--soft` strips the pill background.

### Help-With Quote Grid (support)
```html
<section class="help-with-section">
    <div class="help-with-container">
        <div class="help-with-header">...</div>
        <ul class="help-examples-grid">
            <li class="help-example">"quote text"</li>
        </ul>
        <p class="help-closing">...</p>
    </div>
</section>
```
2×4 grid. Items have a green left border accent. Used to list relatable client questions.

### How It Works — Numbered Steps (support)
```html
<section class="how-it-works-section">
    <div class="how-it-works-container">
        <div class="section-header">...</div>
        <div class="steps-flow"> <!-- flex row -->
            <div class="soft-step-card">
                <div class="step-number">01</div>
                <h3 class="step-title">...</h3>
                <p class="step-body">...</p>
            </div>
        </div>
    </div>
</section>
```
`.section-header` is the soft-page equivalent of `.process-header` / `.infra-header` — left-aligned, no `>_`. Steps are horizontal flex on desktop, stacked on mobile.

### Support Tiers (support)
```html
<section class="support-tiers-section">
    <div class="support-tiers-container">
        <div class="section-header">...</div>
        <p class="tiers-intro">...</p>
        <div class="tier-grid">
            <div class="tier-card [tier-card--featured]" data-modal="id">
                <p class="tier-badge">Most popular</p>  <!-- featured only -->
                <p class="tier-for">...</p>
                <h3 class="tier-name">...</h3>
                <p class="tier-body">...</p>
            </div>
        </div>
        <p class="tier-footnote">...</p>
    </div>
</section>
```
Tier cards open `#feature-modal`. Featured card has green border tint. **No icon** — JS hides `#modal-icon` automatically.

### Pledge (support)
```html
<section class="pledge-section">
    <div class="pledge-container">
        <div class="pledge-header">...</div>
        <p class="pledge-intro">...</p>
        <p class="pledge-promise-intro">...</p>
        <ul class="pledge-list">
            <li><strong>No jargon.</strong> ...</li>
        </ul>
        <p class="pledge-closing">...</p>
    </div>
</section>
```
`background: var(--bg-tint-pledge)`. Max-width 680px, centred. `<strong>` inside list items renders in `var(--brand-green)`.

### FAQ Accordion (support)
```html
<section class="faq-section">
    <div class="faq-container">
        <div class="section-header">...</div>
        <div class="faq-list">
            <details class="faq-item">
                <summary class="faq-question">Question text</summary>
                <div class="faq-answer"><p>...</p></div>
            </details>
        </div>
    </div>
</section>
```
Pure HTML `<details>`/`<summary>` — no JS. `+` / `×` icons via CSS `::after`. Open state gets green border tint.

### Final CTA — Soft (support)
```html
<section class="final-cta-section final-cta-section--soft">
    <div class="final-cta-container">
        <h2 class="empower-light">...</h2>
        <h2 class="empower-bold"><em>...</em></h2>
        <p class="final-cta-subtitle">...</p>
        <button class="nav-btn" onclick="window.location.href='/contact?from=it-support'">...</button>
        <p class="final-cta-note">...</p>
    </div>
</section>
```
Uses `<button>` (not `<a>`) because Soft pages use the onclick pattern. `.final-cta-note` is small italic text below the button.

---

## Utility / Shared Patterns

### Section Header (soft pages, reusable)
```html
<div class="section-header">
    <h2 class="empower-light">...</h2>
    <h2 class="empower-bold">...</h2>
</div>
```
Left-aligned. No `>_`. Used in place of `.infra-header` / `.process-header` on soft pages.

### Legal Pages (privacy, terms, cookies)
```html
<section class="policy-section">
    <div class="policy-card">
        <h1 class="empower-bold">Title <span class="brand-green">Word</span> >_</h1>
        <p class="last-updated">Last Updated: Month YYYY</p>
        <div class="policy-text">
            <h2>1. Section</h2>
            <p>...</p>
        </div>
    </div>
</section>
```
Max-width 900px card. Navbar CTA: `href="/contact?from=policy"`.

### Contact Form (contact.html)
```html
<section class="form-section">
    <div class="form-card">
        <div class="form-header">...</div>
        <form id="contact-form">
            <div class="input-row">
                <div class="input-group"><input><label></div>
            </div>
            <button class="nav-btn form-submit-btn">...</button>
        </form>
    </div>
</section>
```
Floating labels via CSS (no JS). Hidden `#form-source` input carries `?from=` value. Submit redirects to `/thank-you?from=<source>`.

### Thank-You (thank-you.html)
```html
<section class="form-section">
    <div class="form-card form-card--thank-you">
        <div class="form-header">
            <h2 class="empower-light">transmission</h2>
            <h2 class="empower-bold"><span class="brand-green">received</span> >_</h2>
            <p>...</p>
        </div>
        <button id="thank-you-back-btn" class="nav-btn">← Back to Home</button>
    </div>
</section>
```
Back button text and href set by JS based on `?from=` param. Default: `← Back to Home` → `/`.

---

## Modals (on every content page)

Two modal overlays placed at the bottom of `<body>`, before `<script>`:

```html
<div class="glass-modal-overlay" id="feature-modal">
    <div class="glass-modal-card">
        <div class="modal-header">
            <span class="terminal-title">root@quantra</span>
            <button class="close-modal-btn" id="close-feature-modal">&times;</button>
        </div>
        <div class="modal-body">
            <img src="" id="modal-icon" class="modal-feature-icon">
            <span class="modal-terminal-prompt" id="modal-term-text"></span>
            <p id="modal-paragraph-text"></p>
        </div>
    </div>
</div>

<div class="glass-modal-overlay" id="process-modal">
    <div class="glass-modal-card">
        <div class="modal-header">
            <span class="terminal-title">root@quantra</span>
            <button class="close-modal-btn" id="close-process-modal">&times;</button>
        </div>
        <div class="modal-body">
            <span class="modal-terminal-prompt" id="process-term-text"></span>
            <p id="process-paragraph-text"></p>
        </div>
    </div>
</div>
```

Pages without process steps still include `#process-modal` (JS exits silently if no `.process-step-card` exists).
