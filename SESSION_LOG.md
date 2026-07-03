# Session Log — Quantra Digital (agency site)

Running log of meaningful changes. Newest entries at the top.
Format each entry as: ## YYYY-MM-DD — short title, then bullet points.

## 2026-07-03 — fixed 6 broken design-page tool logos + staged the whole batch on a feature branch

- **Bug:** the `/design` "tools we use" ticker referenced 6 logos that didn't exist
  (illustrator/photoshop/indesign/affinity/procreate/canva) — only `figma-logo.webp` was present.
- **Fix:** sourced 5 full-colour app-icon SVGs from svgl, converted SVG→transparent WebP
  (`rsvg-convert -h 320` → `magick -q90`) to match the existing ~350px logos, added to `assets/logos/`.
  **Procreate dropped** from the ticker (no clean full-colour source) — both `<img>` copies removed,
  top-of-file TODO comment updated. Re-audit: 0 missing assets, all serve 200.
- **Staged, not pushed:** branch `feature/site-refresh-contact-form` carries the full pending batch
  (design system + contact API + about/automation pages + tokens + docs + SEO + this logo fix).
- **Still blocking live** (unchanged): Resend sender verify + Vercel env vars (`docs/CONTACT_FORM.md`);
  then `vercel login` → push → preview → Zewn merges to main.

## 2026-06-30 (cont.) — contact form delivery: Vercel function + Resend + per-service label (LOCAL, not pushed)

Made the booking form actually deliver (was mailto-only). Zewn picked: Vercel serverless function +
Resend (over self-hosted n8n) — always-up, no NUC exposure, same domain.

- **NEW `api/contact.js`** (Vercel Node serverless, CommonJS, **no npm/framework** — built-in `fetch`):
  POST → validate + server-side honeypot (`company_url`) → email via **Resend** (`reply_to` = lead's
  email, `subject: New website lead: {name} ({source})`) → optional **Discord** ping if
  `DISCORD_LEADS_WEBHOOK` set → 200 `{ok:true}`. Missing `RESEND_API_KEY` → 500 so the client falls back
  to mailto (no lead lost). Same-origin (`/api/contact`) so no CORS. Env: `RESEND_API_KEY`,
  `LEADS_TO` (def `zuaan@quantratech.co.za`), `LEADS_FROM`, optional `DISCORD_LEADS_WEBHOOK`.
- **`js/main.js`:** `CONTACT_ENDPOINT = '/api/contact'`; payload now includes `company_url` (server
  honeypot); **friendly source label** — `sourceLabel()` maps `web-dev*`→"Web Development",
  `design*`→"Branding & Design", `automation*`→"Automation", `about*`→"About", else "your project".
- **`pages/contact.html`:** indicator `// source:` → `// booking about: <label>`. (Part 1 — *which page
  the click came from* — was already fully built: every CTA tags `?from=<source>` incl. position
  variants `*-mid`/`*-final`/`menu`/`policy`; it rides in the lead. No dedicated per-service pages —
  the source factor covers it.)
- **Verified:** `node --check` both files clean; unit-tested the handler (405 GET / 200 honeypot-drop /
  400 missing / 500 no-key); happy-path with stubbed fetch → correct Resend payload (Bearer, from/to,
  reply_to, source in subject) + Discord ping.
- **⚠️ Zewn TODO before it sends:** Resend acct → verify `quantratech.co.za` sender (DNS at tld-ns.com)
  → set Vercel env vars → redeploy. Full checklist in `docs/CONTACT_FORM.md`. Local 8800 preview can't
  run the function (static server) — test via `vercel dev` or a deploy.
- **Status:** LOCAL only, in the big uncommitted batch.

## 2026-06-30 (cont.) — design-system pass: per-service accents + home/about glass alignment + brighter numbers (LOCAL, not pushed)

Zewn direction: automation page = the design-system source of truth; differentiate the 3 SERVICE
pages by accent (keep them a family); align Home + About to the automation glass-card system (slightly
distinct); brighten the 01/02/03 numbers. All CSS/token-level, no copy/structure change. Validated by
headless render of all 5 pages at 1440px.

- **Per-service accent system** (`tokens.css` + `styles.css` Section 27): new `--accent` /
  `--accent-rgb` / `--hero-glow` / `--hero-node-filter` tokens (default green). Service pages carry
  `<body class="svc-automation|svc-web-dev|svc-design">` → automation=green, web-dev=blue `#4286f4`,
  design=purple `#8a6dff`. Refactored the shared sharp components to `var(--accent-rgb)` so they
  re-tint automatically: `.border-green::before` shimmer, feature/infra hover glow, `.hero-section`
  radial (`var(--hero-glow)`), hero node-motif (`filter: var(--hero-node-filter)` + per-service
  opacity/size), hero-highlight pill (web-dev/design). Brand chrome (logo/nav/footer + `.brand-green`
  emphasis + `>_`) stays green on every page on purpose. Distinct hero each: green/blue/purple radial
  glow + tinted, differently-scaled node mesh. Verified: web-dev cards render blue borders + blue pill,
  design purple, automation green (essentially unchanged).
- **Home + About → glass cards** (`styles.css` Section 25): `.warm-card` + `.service-card` swapped
  from flat `1px solid` borders to the automation glass system — `rgba(10,14,23,0.4)` + backdrop-blur
  + animated shimmer `::before` gradient border (added to the Section 19 `fluidGradient` list) + sharp
  radii/hover. Kept a *softer* shimmer + green accent so home/about stay "same system, a touch distinct."
- **Numbered callouts brighter:** `.why-num` `rgba(129,255,165,0.28)` → `var(--num-color)` =
  `rgba(129,255,165,0.55)` (~2×). Formalised as a design-system component (Home why + About how-we-work).
- **Docs:** `docs/DESIGN_SYSTEM.md` — new "Per-Service Accent System", "Home + About glass alignment",
  "Numbered Callouts" sections. **Pill note:** automation keeps blue-purple pill (green pill + white
  text = poor contrast); web-dev/design take the accent.
- **Status:** LOCAL only, in the big uncommitted batch. Preview server `http://localhost:8800`.

- **Tweaks after Zewn review (same day):** (1) numbers brighter again `0.55 → 0.80`. (2) **Bug fix —
  new-page card borders weren't animating:** `.warm-card::before` / `.service-card::before` used a
  `background:` *shorthand* placed AFTER Section 19, which reset `background-size` back to `auto` and
  killed the `fluidGradient` shimmer → switched both to `background-image:` so Section 19's
  `background-size:200%` survives. Confirmed animating via a 2-phase render frame-diff (home/auto/web-dev
  all `identical=False`). (3) **Reverted card borders to green** — Zewn disliked the blue/purple card
  borders. `.border-green::before` + feature/infra hover glow now use `var(--brand-green-rgb)` (green
  on every page); the per-service accent now drives **only the hero** (glow + node motif + pill). Card
  system is uniformly green site-wide. **Open:** keep the subtle per-service hero wash (blue/purple) or
  make heroes fully green too — pending Zewn.

## 2026-06-30 (cont.) — home + automation copy reframes APPLIED (LOCAL, not pushed)

Applied the drafted collaborative-with-client copy reframes (OLD→NEW from
`~/brain/business/quantra-digital/COPY-RESTRUCTURE-2026-06.md`). String-level only — no CSS, no
structure, no two-aesthetic change. Validated: old phrases gone, new present, both pages
headless-rendered at 1440px → no layout breakage.

- **`index.html` (8 edits):** meta/OG/Twitter description "+with you" (×3); hero subtitle "designed
  and built **with you**, by one team… that actually answers the phone"; problem "…so let's **take
  that weight off your plate, together. You stay in charge; we do the heavy lifting**" (was "hand
  that part to us"); WHY-01 "…You talk to one team, **we move with you**, and it gets done"; **WHY-03
  retitled "One team that's accountable" → "One team in your corner"** + body "…no finger-pointing
  **and no black box. We own the outcome — and build it in the open with you**…"; process Step 3
  "…we build it **with you — you see progress…your input steers it, and you own everything we ship**";
  promise "+And we work the same way with you — in the room, alongside your team, never a black box";
  footer-bio "One team **that builds** your whole digital backbone **with you**…".
- **`pages/automation.html` (3 edits):** hero "built **for** You" → "built **around** You" + description
  "We **map your workflows with you**, then cut… trim… build infrastructure that runs quietly in the
  background — **nothing you can't see into**" (was "We eliminate… reduce… build…"); infra-subtitle
  "engineered **with you**, under one roof"; process Step 3 "…we build your system **with you in the
  loop the whole way — it's your system, and you own it**".
- **Not touched:** the hero-highlight pill ("—so you can focus on growth.") kept short on purpose;
  web-dev/design left as-is (already collaborative; web-dev's 1 optional add not applied this pass).
- ⚠️ **WHY-03 retitle** ("accountable" → "in your corner") was a flagged open item — applied per
  Zewn's "apply the reframes"; trivially reversible if the accountability word is preferred.
- **Note (pre-existing, NOT fixed):** 8 inner pages still carry a stale footer-bio ("If we are a fit,
  I will map out a custom 'Digital Systems Plan'…") — wrong content for a footer bio. Separate cleanup.

## 2026-06-30 — Copy → collaborative-with-client model: NEW About page built (LOCAL, not pushed)

Zewn directive: restructure site copy to align with a **collaborative work model** = *collaborative
with the CLIENT*. Decision (Zewn-confirmed): **LAYER** onto the existing "one-stop partner / whole
digital backbone, one team" positioning — keep the WHAT (service scope), change the HOW (do-it-WITH-you,
in the open, you own it), not a wholesale replace. Full copy plan (OLD→NEW per page) lives in the
vault notebook: `~/brain/business/quantra-digital/COPY-RESTRUCTURE-2026-06.md`. **This session
shipped the About page only**; the per-page copy edits (home + automation reframes etc.) are drafted
but NOT yet applied — next pass.

- **NEW `pages/about.html`** (Sharp aesthetic + blended warm, the collaborative anchor page). Story:
  *"We're not an agency that hands you off."* Sections: hero → "who we are" (warm card, one-team /
  build-it-with-you) → "how we work with you" numbered 01 In the open / 02 Your call, always /
  03 You own it (why-section, parallax host) → mid CTA → promise (reuses "we don't replace people,
  we empower them", extended to the client) → final CTA "ready to build it together?".
  **Reuses existing classes only** (`warm-card`, `why-section`/`why-item`, `cta-section`,
  `final-cta-section`, `parallax-node--a`) — **zero new CSS**, no new assets, respects the
  two-aesthetic rule. `?from=` sources: `about` / `about-mid` / `about-final`.
- **Wired into shared chrome + routing:** side-menu "About" link added to **all 9 existing pages**
  + about.html itself (active-link), inserted before the disabled "Coming Soon" entry → menu order
  now Home · Web Development · Branding & Design · Automation · **About** · Coming Soon · Book a Call.
  `vercel.json` rewrite `{ /about → /pages/about.html }`; `sitemap.xml` `/about` (priority 0.7);
  `main.js` thank-you back-button case for `about*`; repo `CLAUDE.md` page list (9→10) + active-link map.
- **Validated:** vercel.json valid JSON, sitemap valid XML (9 urls), `node --check js/main.js` clean,
  about.html tag-balanced, all referenced assets exist; headless-rendered at 1440px → correct (dark +
  neon-green, node-mesh parallax, warm cards, `>_`, 01/02/03, CTAs).
- **Status:** LOCAL only — folds into the big uncommitted batch. ⚠️ push `main` = PROD deploy to
  quantratech.co.za (may need `!` prefix). **Still pending before push:** apply the rest of the copy
  reframes (home + automation, see the notebook draft) + the infra-exposure call (Umami + n8n webhook).

## 2026-06-27 (cont.) — SEO layer + scroll-reveal + stat strip; site-improvement audit (LOCAL, not pushed)

Improvement pass after a grounded audit (found: ZERO SEO meta on all 9 pages, no sitemap/robots, no analytics, and the **contact form silently drops every lead** — it only `console.log`s then redirects, with a `// TODO: integrate form backend`). Zewn picked: fix form (n8n webhook), full SEO, design dynamism.

- **SEO layer (P1) — DONE, all 9 pages:** unique `<meta name="description">`, `<link rel="canonical">`, robots (thank-you = noindex), `theme-color`, full Open Graph + Twitter `summary_large_image`. Branded **OG image** generated at `assets/brand/og-image.png` (1200×630, dark + dot-grid + green, rendered via headless chromium from a template). **JSON-LD** `ProfessionalService` on home (name/url/logo/image/areaServed ZA/sameAs socials — no phone/email asserted, none verified). New **`sitemap.xml`** (8 indexable URLs, clean) + **`robots.txt`** (disallow /thank-you, sitemap ref). All validated (JSON-LD parses, sitemap valid XML, files serve 200).
- **Scroll-reveal (P3) — DONE, global:** `js/main.js` Section 9 — IntersectionObserver fade/slide-in. JS adds `html.js-reveal` + `.reveal` to a selector set (cards/headers/sections) and toggles `.is-visible` with a light per-sibling stagger. Hides content ONLY when JS active → no-JS + `prefers-reduced-motion` users see everything. CSS Section 25b.
- **Animated stat strip (P3) — DONE, home:** new section between proof ticker + process — **5+ businesses · 3 services · 100% one team · 24/7 systems**. `main.js` Section 10 counts up on scroll-in (cubic ease, rAF), reduced-motion → static final value. Honest numbers only.
- **Testimonials — DEFERRED:** won't fabricate client quotes; needs real ones from Zewn.
- **NEXT (P0 contact form):** wire form → n8n webhook (email + Discord lead alert) + honeypot/Turnstile. **Blocker:** n8n is LAN-only; a visitor's browser needs a PUBLIC webhook URL → expose via Tailscale Funnel / Cloudflare Tunnel (Zewn infra step). Also still open: case studies + About pages (P2), analytics (self-host Plausible/Umami on NUC), favicon/manifest, per-service accents, image width/height + lazy-load.

## 2026-06-27 — Background-asset system + IT Support removed + home→automation split (LOCAL, not pushed)

Design-inspiration pass (refs: Bitwarden bg assets, in vault NOTEBOOK). Original assets only — nothing copied from Bitwarden. All local, **not committed/pushed**; home redesign pending.

- **New bg assets** (`assets/bg/`, original SVG): `dot-grid.svg` (ambient dot mesh) + `node-mesh.svg` (connected-nodes "invisible automation" motif).
- **Ambient background system** (`styles.css` Section 24, pure-CSS, all pages, no markup): Layer 1 dot mesh (`body::before`, faded), Layer 2 brand glow blooms (`body::after`), Layer 3 node motif on sharp heroes only (`.hero-section:not(.hero-section--soft)::after`). `html` holds the dark base; `body` transparent. Mobile lighter (Section 25).
- **Parallax node motifs** (Layer 4): `.parallax-node` hosted INSIDE transparent sections (`.has-parallax` = relative + overflow-hidden + isolate; node `z-index:0` behind content raised to `z-index:1`) — same trick as the hero so section backgrounds never cover them (first attempt put them behind everything at `z-index:-1` → the blue slider section covered them). `js/main.js` Section 8 drifts each node FASTER than scroll via `translate3d(0, scrollY × negative-speed, 0)`, rAF-throttled, reduced-motion safe. On sharp pages 2 nodes (infra + process sections), single node on contact/thank-you (form-section) + privacy/terms/cookies (policy-section).
- **IT Support page REMOVED:** deleted `pages/support.html`, dropped the side-menu anchor on all pages, removed `/support` rewrite + the `it-support` thank-you back-button case in `main.js`. The Soft/Conversational aesthetic CSS is now unused but kept.
- **Home → Automation split:** the old home content (really an automation pitch) copied to `pages/automation.html` (own title, `active-link` on Automation, CTA sources `home*`→`automation*`, `main.js` back-button case added, `/automation` rewrite). Side-menu "Automation" enabled (was disabled/coming-soon).
- **NEW vision-led home BUILT** (`index.html`, replaces the old automation content). Direction locked with Zewn: positioning = **one-stop digital partner** ("your whole digital backbone, one team"), audience = **SA SMBs**, goal = **drive a call**, tone = **warm/human**. Sections: hero → "we get it" problem (soft) → services spread (3 anchor cards → web-dev/design/automation) → "why one partner over five freelancers" (numbered 01/02/03, parallax host) → mid CTA → client ticker + "trusted by SA businesses" → how-we-work process (reused, parallax host) → human promise (soft, green-tinted) → final CTA "ready to build your backbone?". Warm/human sections use the **Soft aesthetic** (`.warm-card`) blended into the dark sharp shell; all CTAs → `/contact?from=home*` (book a call). New CSS = Section 25 (mobile renumbered to 26); reuses the working feature/process modals + client ticker + process JS. Verified by full-page render.
- **NEXT:** Zewn review (browse local), copy tweaks if any, then commit + push the whole batch (bg system + parallax + IT-Support removal + automation split + new home) → prod deploy.

## 2026-06-25 — Git reconcile: remote already in sync; stale branches deleted; design work left for review

Checked the remote history (the carried "divergence" item). **No reconciliation needed — `main` is fully in sync with `origin/main` (`7dca03b`, ahead/behind 0/0).** The earlier apparent divergence was entirely the now-deleted stale Documents copy (a separate abandoned lineage); the real remote = the restructured lineage this copy already matches.

- **Deleted merged local branches** `add-design-page` + `add-support-page` (both ancestors of `main`; local-only, not on remote). `main` is the only branch now.
- **Remote branches:** only `origin/main`. Nothing to prune remotely.
- **Uncommitted/untracked design-system work LEFT FOR ZEWN TO REVIEW before commit/push** (see NOTEBOOK.md review banner): `css/tokens.css` (+ `@import` added to `styles.css` — duplicates the inline `:root` vars, additive, zero visual change), `CLAUDE.md` (repo conventions), `docs/DESIGN_SYSTEM.md`, `docs/PAGE_PATTERNS.md`, `SESSION_LOG.md`. `.env.local` + `.vercel` stay gitignored.
- ⚠️ Pushing `main` auto-deploys the live site (`quantratech.co.za`) — review first. Default-branch push may be classifier-blocked for Claude → push via `!` prefix.

## 2026-06-24 — Brought into the ecosystem: relocated out of the vault, stale duplicate archived

Onboarded the Quantra Digital agency site into the standard project layout (CLAUDE.md context + SESSION_LOG + NOTEBOOK, code in `~/projects`). No code/site changes — relocation + docs only. Site still deployed, untouched.

- **Found two divergent copies** sharing the same remote `github.com/Zewn-ops/quantra-agency.git`:
  - `~/Documents/QuantraDigital Website/landing-page/` — **stale**: flat structure (pre-restructure), last commit `6226845` (2026-05-03) + 46 lines uncommitted (index/script/styles), **no unpushed commits**. Not deployed.
  - `~/brain/business/quantra-digital/` — **canonical**: restructured (`168f441`), 9 pages, design-system docs, deployed to Vercel (`quantra-agency`), last commit `7dca03b` (2026-05-10).
- **Stale Documents copy → archived + deleted.** Tarred whole folder (incl `.git` + uncommitted edits) → copied to NUC `~/archive/QuantraDigital-Website-stale-20260624.tar.gz` (sha256 verified match, gzip OK, 1.1M) → deleted local `~/Documents/QuantraDigital Website`.
- **Canonical code moved OUT of the vault** → `~/projects/quantra-digital/`. It had been living at `~/brain/business/quantra-digital/` with its own `.git` — violated the standing rule (ZEWN_CLAUDE: "vault syncs via Syncthing — don't create a git repo inside it; code lives in ~/projects"). Git history, `origin` remote, and `.vercel/` link all intact after the move (Vercel deploys from GitHub, not the local path — relocation is safe).
- **Docs created:** repo keeps its existing `CLAUDE.md` (codebase conventions) + this `SESSION_LOG.md`; vault `business/quantra-digital/` now holds a context `CLAUDE.md` (where-things-live + business context) + `NOTEBOOK.md` (living design refs — first entry: https://sakana.ai/fugu/ as future design inspiration). Wired into `~/brain/ZEWN_CLAUDE.md`.
- ✅ **Live URL confirmed:** **https://quantratech.co.za** (apex). `quantra-agency.vercel.app` and `www.quantratech.co.za` both 308-redirect to it — confirms same Vercel project. `server: Vercel`, cpt1 edge.
- ✅ **Remote history reconciled 2026-06-25** (see top entry): turned out to be in sync — the "divergence" was the deleted Documents copy.
