# Sammy Fash — web design portfolio

Static build on Figma file 
Two pages, one shared design system, motion built with GSAP.

This is the local reference build. It is deliberately plain HTML + CSS + JS so the
markup ports to WordPress templates one-for-one later.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run images   # regenerate public/img from assets-src/
```

## Pages

| File | Source | Notes |
|---|---|---|
| `index.html` | Figma Homepage `91:675` | hero, statement, work grid, contact |
| `<slug>.html` × 6 | generated | one case study per project — **do not edit by hand** |
| nav overlay (everywhere) | Figma Menu `91:759` | full-screen, clip-path wipe |

## Case studies are generated, not hand-written

Six pages share one layout, so they are rendered from data rather than copy-pasted:

```
content/projects.mjs      the six projects — copy, services, colour, live URL
scripts/build-pages.mjs   the template  →  npm run pages
scripts/capture-shots.mjs the screenshots →  npm run shots
```

Editing a case study means editing `content/projects.mjs` and re-running `npm run pages`.
Editing `<slug>.html` directly gets overwritten. This also maps cleanly onto WordPress
later: the content file becomes custom fields and the template becomes `single-project.php`.

### Where the screenshots come from

`npm run shots` drives the Chrome already installed on this machine — no 130MB download,
and it is repeatable: when a client site changes, re-run it and the case study updates.

Three of the six client sites (`icphubkenya.io`, `smart-devstudios.com`,
`dynasty-labs.io`) **no longer resolve**. For those, frames are pulled out of the original
build videos instead: Chrome decodes the H.264 natively, the script seeks to a timestamp
and screenshots the video element. Those pages show the frames without a browser mockup —
the recordings already carry their own presentation — and say plainly that the site is
offline rather than linking to a dead domain.

The videos are ~110MB, so they are gitignored; `npm run shots` re-fetches them from the
`videoUrl` recorded against each project.

### Device mockups

`.mock--browser` and `.mock--phone` in [`src/styles/mockup.css`](src/styles/mockup.css) are
drawn in CSS, not composited into the screenshots — crisp at any resolution, themeable,
and a fresh capture drops straight in without redoing artwork.

## Stack, and why

- **Vite** (multi-page) — no framework. Every page is real HTML, so porting to
  `header.php` / `front-page.php` / `single-project.php` is copy-and-adapt, not a rewrite.
- **GSAP + ScrollTrigger** — one animation library, no second runtime. ~53 kB gzipped
  with Lenis; that is the whole JS payload.
- **Lenis** — smooth scroll, wired into GSAP's ticker so ScrollTrigger stays in sync.
- **Plus Jakarta Sans** (self-hosted via `@fontsource-variable`) — the Figma typeface.
  No Google Fonts request at runtime.
- No Tailwind, no React. The Figma MCP output was React + Tailwind; it was used as a
  measurement reference only.

## Design tokens

Everything lives in [`src/styles/tokens.css`](src/styles/tokens.css). The comp is drawn on a
**1728px artboard**, so each fluid value is `figma-px / 1728 × 100` in `vw`, clamped at
both ends. Change a token there, not in a component file.

| Token | Figma value |
|---|---|
| `--c-bg` / `--c-ink` | `#000` / `#fff` |
| `--c-ink-dim` | `#a9a8a8` — body copy, fine print |
| `--c-hairline` | `#818181` @ 0.5px — grid lines and framed boxes |
| `--c-blue-hi/lo`, `--c-gold-hi/lo` | the two rotated plates behind the portrait |
| `--fs-display` | 118.03px → `6.83vw` |
| `--fs-statement` | 90px → `5.208vw` |
| `--shell` | 1517.34 / 1728 → `87.8vw` |

Display type stacks at **0.752em** between lines (the overlap in the comp), which is why
the second line of each pair carries `margin-top: -0.508em` against a `1.26` line-height.

### Structural note worth keeping

The hero grid lines are not decoration placed by eye — they are the **portrait's bounding
box extended outward**. Figma's `740.25 / 987.25 / 436 / 682` are exactly the photo's four
sides. If the portrait moves, the lines move with it.

The two *vertical* rails run further than the hero: from the very top of the page down to
the top of the next section's box. That span crosses two sibling sections, so no CSS length
can express it — `syncRails()` in `js/hero.js` measures it and re-measures on resize.

## Motion

| Where | What |
|---|---|
| Load | the wordmark fills white left-to-right as the counter runs 0% → 100%, then the curtain lifts |
| Hero | grid lines draw open, headline unmasks per character, portrait scales down out of a 1.35 crop |
| Hero portrait | stays a plain photo for 2s, then the plates fan out from behind it |
| Hero portrait (hover) | plates fold back to 0° and hide behind the photo; fan out again on leave |
| Hero + footer (pointer) | 64px cells flash under the cursor and fade over 1.15s |
| Hero (idle) | pointer parallax on the portrait — small, ~26px max |
| Hero (scroll) | portrait, greeting and statement drift at three different rates |
| Statement | nothing until the box is 58% up the viewport; then the hairline box draws from top-right to bottom-left, *then* the dim words fade in, then they light 16% → 100% white scrubbed to scroll |
| Work | cards rise in; each image parallaxes ±5% inside its frame; caption bar slides up on hover |
| Cursor | three looks, picked per pointer move: a Figma-style arrow by default, a pointing hand over anything clickable, a full-viewport crosshair inside `[data-cursor-zone="cross"]` (hero + footer) |
| Cursor tag | anything with `data-cursor-tag` shows a coloured chip beside the cursor — "About me" in gold, "View project" in a different colour per card |
| Buttons | magnetic drift toward the pointer, wipe fill on hover |
| Menu | clip-path wipe down, links stagger up, label rolls on hover |
| Between pages | curtain transition |
| Contact | dialog fades up, its hairline box draws on first open |

### Knobs worth knowing

| Thing | Where |
|---|---|
| how long the portrait stays plain | `PLATE_DELAY` in `js/hero.js` |
| flash-grid cell size / fade | `CELL`, `FADE` in `js/hero-grid.js` |
| flash brightness | `--cell-flash` on `.hero__cells` in `styles/hero.css` |
| how late the statement box draws | `FRAME_START` in `js/about.js` |
| which sections get the crosshair + particles | `data-cursor-zone="cross"` + `data-flash-grid` in the HTML |
| a section's cursor chip | `data-cursor-tag` + `data-cursor-color` on any element |
| cursor icon size | `.cursor__arrow` / `.cursor__hand` in `styles/cursor.css` |
| where the contact form sends | `ENDPOINT` in `js/contact.js` |
| loader speed | `COUNT_DURATION` in `js/preloader.js` |

### Three traps this codebase has already hit

**Decorative overlays extend the page.** An absolutely positioned element does not
grow its parent, but it *does* grow the document's scrollable area. The footer glow
was an 81vw-tall circle and was silently adding ~530px of empty scroll under the
page. It is a `background-image` now — backgrounds are clipped to the box and cost
nothing. Reach for a background before an absolutely positioned decoration.

**`pointerenter` / `pointerleave` are not "is the cursor over this".** They only fire
when the *pointer* crosses a boundary. Scroll a section out from under a stationary
cursor and neither fires, so the crosshair used to persist into the work grid. The
cursor now resolves its look from `event.target.closest(...)` on every move, plus a
re-resolve on scroll — state derived from where the pointer *is*, not from a history
of crossings.

**Media queries carry no specificity.** `@media (min-width: 901px) { .hero__stage {
margin-top: 0 } }` placed *above* the base `.hero__stage` rule loses to it, silently.
Overrides have to come after what they override, in source order.

### One rule to remember when animating

**GSAP owns `transform` on any element it moves.** It also writes
`translate: none; rotate: none; scale: none` inline to stop the independent
transform properties fighting it. So a CSS rule like `.thing:hover { transform:
scale(2) }` will silently do nothing on a GSAP-driven element. Either let GSAP
do the scaling too, or give the element an inner child and style that — which is
why `.cursor__knot` wraps an `<i>` and `.cursor__label` wraps a `<span>`.

`prefers-reduced-motion: reduce` disables **all** of it — Lenis is skipped, the preloader is
removed, every `[data-reveal]` is shown immediately, and page transitions fall back to plain
navigation. That path is not decorative; check it when adding animation.

## Deploying

Static build, no server. Recommended host is **Cloudflare Pages** — unlimited free bandwidth
matters here because each case page ships ~1.5 MB of video.

```bash
npm run pages && npm run images && npm run build   # dist/ is the artefact
```

Cloudflare Pages settings:

| Setting | Value |
|---|---|
| Build command | `npm run pages && npm run build` |
| Output directory | `dist` |
| Node version | pinned to 22 by `.node-version` |
| Environment variable | `VITE_FORM_ENDPOINT` — **required**, or the contact form silently falls back to the visitor's mail client |

Repository: <https://github.com/sammyfash/sammiee-portfolio>. Every push to `main` deploys;
branches get their own preview URL. Set `SITE_URL` if the domain is ever not `https://sammyfash.com` — every canonical, OG
tag and sitemap entry resolves through [`content/site.mjs`](content/site.mjs), so that one env
var moves the whole site.

**The domain moved.** The site was `sammiee.dev` until September 2026 and is now
`sammyfash.com`. Keep the old domain registered and pointed here, and keep the 301 in front of
it: see the note at the top of [`public/_redirects`](public/_redirects) for why that rule cannot
live in this repo on Cloudflare Pages and where to put it instead.

**Clean URLs.** Pages serves `/bmoni` from `bmoni.html`, so internal links have no `.html`.
A small Vite plugin in [`vite.config.js`](vite.config.js) does the same rewrite for `npm run
dev`, so local and production URLs match.

**`public/_headers`** carries the CSP and cache policy (Cloudflare Pages and Netlify both read
it; other hosts need the equivalent configured). The CSP is strict — no inline scripts, no
third-party origins. Two things it must keep: `style-src 'unsafe-inline'` because GSAP animates
via `element.style`, and `font-src data:` because a Plus Jakarta Sans subset is inlined as a
data URI. **Adding a form backend means adding its origin to `connect-src`.**

`robots.txt` and `sitemap.xml` are generated by `npm run pages` from the project list, so
adding a case study cannot leave them stale. Do not hand-edit them.

## Case-study media

Section frames come from `assets-src/shots/<slug>-desktop-N.png` / `-mobile-N.png`, curated in
Figma rather than auto-captured. `npm run images` optimises them, `npm run pages` lays them out.
`shots: { desktop, mobile }` in [`content/projects.mjs`](content/projects.mjs) controls how many
each page shows — BMONI is `mobile: 0` deliberately.

`hideLive: true` suppresses the "Live Website" button without printing the offline note —
for a site that is still up but has been redesigned since, where the button would send people
to someone else's work. BMONI is the case: two of its four sections no longer exist on
bmoni.com, and the surviving two have different layout and copy. Its frames stay as the Figma
exports (~700px, the largest that exist) because those are the design as delivered.
`scripts/capture-bmoni.mjs` documents that dead end; do not run it.

Three builds are gone from the web (ICP Hub Kenya, SmartDev Studios, Dynasty Labs), so those
pages lead with the original walkthrough video instead of stills. Sources live in
`assets-src/video/`; encode with:

```bash
ffmpeg -i in.mp4 -an -vf scale=1280:-2 -c:v libx264 -crf 30 -preset slow \
       -movflags +faststart -pix_fmt yuv420p public/video/<slug>.mp4
```

`-an` matters: they autoplay muted, so the audio track is pure weight. This took the three from
109 MB to 4.4 MB. Videos are `preload="none"` and only play while on screen — see `initVideos`
in [`src/js/case.js`](src/js/case.js).

## Contact form

Three fields, in a dialog opened by anything carrying `data-contact-open` — currently the
footer CTA and the nav's "Get in touch". Escape, the scrim and the close button all dismiss
it; focus is trapped while open and returned to the trigger on close. The custom cursor
stands down inside it, because a form needs real caret and pointer affordances.

**Wiring the backend.** Everything is built against Formspree; all that is missing is a form
id, which needs an account:

1. Sign up at [formspree.io](https://formspree.io) and create a form (the free tier is 50
   submissions a month).
2. Copy `.env.example` to `.env` and put the form URL in `VITE_FORM_ENDPOINT`. **It must be
   `.env`** — Vite does not read `.env.example`, and an endpoint left in the template silently
   falls back to the mail client with no error.
3. Rebuild. Vite inlines the value at build time, so a deploy needs the same variable set in
   the host's environment (Cloudflare Pages → Settings → Environment variables).

`https://formspree.io` is already in `connect-src` in `public/_headers`; **a different form
service means changing that origin or the CSP will block the POST.**

Verified against a mock endpoint: success, HTTP 429, a 422 carrying `errors[]`, and a network
failure each produce the right state, and a double submit sends exactly one request. `readError`
does not assume a response schema, since Formspree does not publish the raw contract.

With no endpoint set the form still works — it composes a pre-filled email and hands it to the
visitor's mail client.

A `_gotcha` honeypot is in the markup; Formspree silently discards submissions where it is
filled. It is deliberately not a `.contact__field`, so validation ignores it.

## Images

Source exports live in `assets-src/` (not served). `npm run images` writes optimised WebP +
JPEG fallbacks to `public/img/`, which cut the six work mockups from ~10 MB to ~1.4 MB.
Drop a new export into `assets-src/work/` and re-run it.

`<picture>` is forced to `width/height: 100%` in `base.css` — it is inline by default, which
otherwise leaves baseline slack under any image sized as a percentage of it.

## Line splitting

`src/js/utils.js` has a hand-rolled splitter rather than GSAP's SplitText. `watchLines()`
handles the three things line splitting always needs: wait for the webfont, refuse to
measure a box that has not been laid out yet, and re-split when the width changes. Use it
for anything that unmasks line by line.

## Still to do

- Social links point at bare `instagram.com` / `linkedin.com` / `x.com` — swap in the real
  profiles.
- Case-study copy is written from the live sites and from the notes on sammyfash.com. It is
  real, not lorem, but the outcome claims for ICP / SmartDev / Dynasty came from those notes
  and are worth a second read before this goes public.
- No mobile captures exist for the three offline sites — the build videos are desktop
  recordings only, so those pages have no phone rail.
- The Figma calls the festival "2025"; the live site is the **2026** edition, so the page
  follows the live site.
