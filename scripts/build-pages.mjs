/**
 * Renders one HTML file per project from content/projects.mjs.
 *
 *   npm run pages
 *
 * The shared chrome (preloader, cursor, nav, header, footer) is generated too,
 * so it cannot drift between pages the way hand-maintained copies do. When this
 * moves to WordPress the template below becomes single-project.php and the
 * content file becomes custom fields.
 */
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { PROJECTS, nextOf } from '../content/projects.mjs'
import { SITE, abs, metaTrim, jsonLd } from '../content/site.mjs'
import { PROFILE, PROOF, CAPABILITIES } from '../content/about.mjs'
import { IDENTITY, TRACKS, ROLES, SELECTED, EDUCATION, bulletsFor } from '../content/cv.mjs'

const ROOT = process.cwd()
const SHOTS = resolve(ROOT, 'public/img/shots')

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

/** Which capture files actually exist, so a missing shot just drops out. */
let available = new Set()
try {
  available = new Set((await readdir(SHOTS)).filter((f) => f.endsWith('.webp')))
} catch { /* first run, before npm run images */ }

const shot = (slug, kind, n) => {
  const base = `${slug}-${kind}-${n}`
  return available.has(`${base}.webp`) ? base : null
}
const shotsOf = (slug, kind, max) =>
  Array.from({ length: max }, (_, i) => shot(slug, kind, i + 1)).filter(Boolean)

/** A screenshot inside a browser window. */
const browserMock = (base, url, alt, crop = true) => `
        <figure class="mock mock--browser">
          <div class="mock__chrome">
            <span class="mock__dots"><i></i><i></i><i></i></span>
            <span class="mock__url">${esc(url)}</span>
          </div>
          <div class="mock__screen${crop ? ' mock__screen--crop' : ''}">
            <picture>
              <source type="image/webp" srcset="/img/shots/${base}@900.webp 900w, /img/shots/${base}.webp 1600w" sizes="(max-width: 900px) 100vw, 88vw">
              <img src="/img/shots/${base}.webp" alt="${esc(alt)}" width="1600" height="1000" loading="lazy" decoding="async">
            </picture>
          </div>
        </figure>`

/** A frame that already carries its own presentation, shown without a device. */
const bareShot = (base, alt) => `
        <figure class="mock">
          <picture>
            <source type="image/webp" srcset="/img/shots/${base}@900.webp 900w, /img/shots/${base}.webp 1600w" sizes="(max-width: 900px) 100vw, 88vw">
            <img src="/img/shots/${base}.webp" alt="${esc(alt)}" width="1600" height="886" loading="lazy" decoding="async">
          </picture>
        </figure>`

/** A build walkthrough, inside the same browser frame as a still. */
const videoMock = (slug, url, poster, alt) => `
        <figure class="mock mock--browser mock--video">
          <div class="mock__chrome">
            <span class="mock__dots"><i></i><i></i><i></i></span>
            <span class="mock__url">${esc(url)}</span>
          </div>
          <div class="mock__screen">
            <video src="/video/${slug}.mp4" poster="/img/shots/${slug}-poster.webp"
                   muted loop playsinline preload="none" aria-label="${esc(alt)}"
                   data-autoplay-in-view></video>
          </div>
        </figure>`

const phoneMock = (base, alt) => `
          <figure class="mock mock--phone">
            <div class="mock__screen">
              <img src="/img/shots/${base}.webp" alt="${esc(alt)}" width="560" height="1212" loading="lazy" decoding="async">
            </div>
          </figure>`

/**
 * A generated photo scene (scripts/compose-scenes.mjs) on a website case, in
 * place of a flat browser frame. Opens the clean screen in the lightbox.
 */
const sceneFig = (p, x, cls = '') => `
        <figure class="case__scene${cls}">
          ${mockup(x.mockup, `${p.name}: ${x.caption}`, { caption: x.caption, kind: x.phone ? 'phone' : 'page', sizes: x.phone ? '(max-width: 600px) 100vw, 30vw' : '(max-width: 900px) 100vw, 88vw' })}
          <figcaption>${esc(x.caption)}</figcaption>
        </figure>`

const chrome = {
  head: (p) => `  <meta charset="utf-8">
  <script src="/theme.js"></script>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(p.seoTitle || `${p.title} — ${SITE.name}`)}</title>
  <meta name="description" content="${esc(metaTrim(p.seoDescription || p.intro))}">
  <meta name="theme-color" content="#000000">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="canonical" href="${abs(`/${p.slug}`)}">

  <meta property="og:type" content="article">
  <meta property="og:site_name" content="${SITE.name}">
  <meta property="og:url" content="${abs(`/${p.slug}`)}">
  <meta property="og:title" content="${esc(p.seoTitle || `${p.title} — ${SITE.name}`)}">
  <meta property="og:description" content="${esc(metaTrim(p.seoDescription || p.intro))}">
  <meta property="og:image" content="${abs(`/img/work/${p.card}.jpg`)}">
  <meta property="og:image:alt" content="${esc(p.name)} — ${esc(typeof p.services[0] === 'string' ? p.services[0] : p.services[0].label)} by ${SITE.name}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${abs(`/img/work/${p.card}.jpg`)}">

  <script type="application/ld+json">
${jsonLd({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: p.title,
    headline: p.name,
    description: metaTrim(p.intro, 300),
    url: abs(`/${p.slug}`),
    image: abs(`/img/work/${p.card}.jpg`),
    dateCreated: String(p.year).match(/\d{4}/)?.[0],
    inLanguage: 'en',
    keywords: [...p.services.map((s) => (typeof s === 'string' ? s : s.label)), ...p.stack].join(', '),
    creator: { '@type': 'Person', name: SITE.author, url: SITE.url },
    about: { '@type': 'Organization', name: p.client },
    locationCreated: { '@type': 'Place', name: p.location },
  })}
  </script>`,

  preface: `  <a class="skip-link" href="#main">Skip to content</a>

  <div class="preloader">
    <div class="preloader__inner">
      <span class="preloader__mark">Sammy Fash</span>
      <span class="preloader__count">0%</span>
    </div>
  </div>

  <div class="curtain" aria-hidden="true"></div>

  <div class="cursor" aria-hidden="true">
    <svg class="cursor__icon cursor__arrow" viewBox="0 0 28 28">
      <g><path d="M7 4 L24 13.9 L15.7 15.6 L11.6 23.2 Z" /></g>
    </svg>
    <svg class="cursor__icon cursor__hand" viewBox="0 0 32 36">
      <g>
        <path class="hand-shape" d="M9 5.5 A2.5 2.5 0 0 1 14 5.5 L14 15 A2.25 2.25 0 0 1 18.5 15 L18.5 16.5 A2.25 2.25 0 0 1 23 16.5 L23 18 A2.25 2.25 0 0 1 27.5 18 L27.5 25 C27.5 30.5 24 34 19 34 L16 34 C12.5 34 10.2 32.3 8.6 29.6 L3.4 21.2 A2.6 2.6 0 0 1 7.8 18.4 L9 20.3 Z" />
        <path class="hand-creases" d="M14 15.5 L14 19.5 M18.5 17 L18.5 20 M23 18.5 L23 21" />
      </g>
    </svg>
    <span class="cursor__line cursor__line--x"></span>
    <span class="cursor__line cursor__line--y"></span>
    <span class="cursor__knot"><i></i></span>
    <span class="cursor__tag"><span>View project</span></span>
  </div>

  <nav class="nav-overlay" aria-hidden="true" aria-label="Main">
    <div class="nav-overlay__header">
      <a class="wordmark" href="/">Sammy Fash</a>
      <button class="nav-close" type="button" aria-label="Close menu">
        <span></span><span></span>
      </button>
    </div>

    <ul class="nav-list">
      <li><a class="nav-link" href="/">
        <span class="nav-link__roll"><span>Home</span><span aria-hidden="true">Home</span></span>
        <span class="nav-link__index">01</span>
      </a></li>
      <li><a class="nav-link" href="/about">
        <span class="nav-link__roll"><span>About</span><span aria-hidden="true">About</span></span>
        <span class="nav-link__index">02</span>
      </a></li>
      <li><a class="nav-link" href="/#work">
        <span class="nav-link__roll"><span>Work</span><span aria-hidden="true">Work</span></span>
        <span class="nav-link__index">03</span>
      </a>
        <ul class="nav-sub" aria-label="Work by discipline">
          <li><a class="nav-sub__link" href="/?work=design#work">Product design</a></li>
          <li><a class="nav-sub__link" href="/?work=development#work">Development</a></li>
          <li><a class="nav-sub__link" href="/?work=web#work">Websites</a></li>
        </ul>
      </li>
      <li><a class="nav-link" href="/cv">
        <span class="nav-link__roll"><span>CV</span><span aria-hidden="true">CV</span></span>
        <span class="nav-link__index">04</span>
      </a></li>
      <li><a class="nav-link" href="#contact" data-contact-open>
        <span class="nav-link__roll"><span>Contact</span><span aria-hidden="true">Contact</span></span>
        <span class="nav-link__index">05</span>
      </a></li>
    </ul>

    <div class="nav-overlay__foot">
      <a class="link-wipe" href="mailto:me@sammyfash.com">me@sammyfash.com</a>
      <span>
        <a class="link-wipe" href="https://www.linkedin.com/in/sammy-fash/" rel="noopener">LinkedIn</a> &nbsp;
        <a class="link-wipe" href="https://github.com/sammyfash" rel="noopener">GitHub</a>
      </span>
      <button class="theme-toggle theme-toggle--labelled" type="button" data-theme-toggle aria-label="Switch to light theme" aria-pressed="false">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 2a10 10 0 0 0 0 20z" fill="currentColor"/></svg><span data-theme-label>Light mode</span>
      </button>
    </div>
  </nav>

  <header class="site-header" id="top">
    <a class="wordmark" href="/">Sammy Fash</a>
    <div class="header-actions">
      <button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch to light theme" aria-pressed="false">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 2a10 10 0 0 0 0 20z" fill="currentColor"/></svg>
      </button>
      <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span><span></span><span></span>
      </button>
    </div>
  </header>`,

  contact: `  <!-- contact dialog, opened by anything with [data-contact-open] -->
  <div class="contact" role="dialog" aria-modal="true" aria-labelledby="contact-title" aria-hidden="true">
    <div class="contact__scrim"></div>

    <div class="contact__panel">
      <span class="frame" aria-hidden="true">
        <span class="frame__edge frame__edge--t"></span>
        <span class="frame__edge frame__edge--r"></span>
        <span class="frame__edge frame__edge--b"></span>
        <span class="frame__edge frame__edge--l"></span>
        <i></i><i></i><i></i><i></i>
      </span>

      <button class="contact__close" type="button" aria-label="Close contact form">
        <span></span><span></span>
      </button>

      <div class="contact__grid">
        <div>
          <h2 class="contact__title" id="contact-title">Tell me about the role or project</h2>
          <p class="contact__blurb">
            Share a little about what you need, your timeline and the best way to
            reach you. I usually reply within two working days.
          </p>
          <p class="contact__direct">
            Prefer email?<br>
            <a class="link-wipe" href="mailto:me@sammyfash.com">me@sammyfash.com</a>
          </p>
        </div>

        <div>
          <form novalidate>
            <div class="contact__field" data-label="Name">
              <label for="contact-name">Name</label>
              <input id="contact-name" name="name" type="text" autocomplete="name" placeholder="Your name" required>
              <span class="contact__error" aria-live="polite"></span>
            </div>

            <div class="contact__field" data-label="Email">
              <label for="contact-email">Email</label>
              <input id="contact-email" name="email" type="email" autocomplete="email" placeholder="you@company.com" required>
              <span class="contact__error" aria-live="polite"></span>
            </div>

            <div class="contact__field" data-label="Message">
              <label for="contact-message">Message</label>
              <textarea id="contact-message" name="message" rows="3" placeholder="We&rsquo;re hiring a design engineer for&hellip;" required></textarea>
              <span class="contact__error" aria-live="polite"></span>
            </div>

            <!-- Spam trap. Bots fill every field they find; people never see
                 this one. Formspree discards a submission where it is set.
                 Deliberately not .contact__field, so validation ignores it. -->
            <p class="contact__gotcha" aria-hidden="true">
              <label>Leave this empty
                <input type="text" name="_gotcha" tabindex="-1" autocomplete="off">
              </label>
            </p>

            <div class="contact__submit">
              <button class="pill" type="submit" data-magnetic="0.2">
                <span class="pill__label">Send message</span>
              </button>
              <span class="contact__status" role="status" aria-live="polite"></span>
            </div>
          </form>

          <div class="contact__sent" role="status">
            <p>Thanks, your message has been sent.</p>
            <p>I&rsquo;ll reply to the email address you provided, usually within two working days.</p>
          </div>
        </div>
      </div>
    </div>
  </div>`,

  footer: `  <footer class="site-footer" id="contact" data-cursor-zone="cross">
    <div class="flash-cells" data-flash-grid aria-hidden="true"></div>

    <div class="site-footer__box">
      <span class="frame" aria-hidden="true">
        <span class="frame__edge frame__edge--t"></span>
        <span class="frame__edge frame__edge--r"></span>
        <span class="frame__edge frame__edge--b"></span>
        <span class="frame__edge frame__edge--l"></span>
        <i></i><i></i><i></i><i></i>
      </span>

      <div class="site-footer__cta">
        <h2 class="site-footer__heading" data-reveal>Have a role or project in mind?</h2>
          <p class="site-footer__availability" data-reveal>
            Available for remote product design, front-end and design engineering roles,
            and selected freelance projects. I work across European and US hours.
          </p>
        <a class="pill site-footer__button" href="mailto:me@sammyfash.com?subject=Enquiry%20from%20sammyfash.com"
           data-contact-open data-magnetic="0.28" data-cursor-tag="Say hello" data-cursor-color="#edaa0b">
          <span class="pill__label">Send me a message</span>
        </a>
      </div>

      <div class="site-footer__contact">
        <a class="site-footer__email link-wipe" href="mailto:me@sammyfash.com">me@sammyfash.com</a>
        <div class="site-footer__social">
          <a class="link-wipe" href="https://www.linkedin.com/in/sammy-fash/" rel="noopener">LinkedIn</a>
          <a class="link-wipe" href="https://github.com/sammyfash" rel="noopener">GitHub</a>
          <a class="link-wipe" href="https://www.instagram.com/iamsammyfash/" rel="noopener">Instagram</a>
          <a class="link-wipe" href="https://x.com/sammyyfash" rel="noopener">X</a>
        </div>
      </div>
    </div>

    <p class="site-footer__fineprint">
      &copy; 2026 Sammy Fash. Designed and built by me.
    </p>
  </footer>`,
}

function render(p) {
  const desktop = shotsOf(p.slug, 'desktop', p.shots?.desktop ?? 3)
  const phones = shotsOf(p.slug, 'mobile', p.shots?.mobile ?? 2)
  const framed = Boolean(p.live)   // video frames already carry their own frame
  const next = nextOf(p.slug)
  const media = (base, alt, crop) =>
    framed ? browserMock(base, p.liveLabel, alt, crop) : bareShot(base, alt)

  // Chapters are further acts inside the same case. Frames are `-<id>-N`, and
  // each browser mock is labelled with that step's real address, since the
  // point of a chapter is the route rather than any single page.
  const host = (p.liveLabel ?? '').split('/')[0]
  const chapterFrames = (c) => {
    // `steps` are captured from live paths; `frames` are supplied by hand for
    // anything behind a login, which cannot be captured.
    const entries = c.steps ?? c.frames ?? []
    const files = shotsOf(p.slug, c.id, entries.length)
    return files.map((base, i) => {
      const e = entries[i]
      const url = e.path ? `${c.host ?? host}${e.path.replace(/\/$/, '')}` : (e.url ?? c.host ?? host)
      return { base, url, label: e.label }
    })
  }

  const hero = desktop[0]
  const rest = desktop.slice(1)

  return `<!doctype html>
<html lang="en">
<head>
${chrome.head(p)}
</head>
<body>

${chrome.preface}

  <main id="main" tabindex="-1">
    <article class="case" style="--accent: ${p.colour}">

      <span class="rule" aria-hidden="true"></span>

      <div class="case__row">
        <h1 class="case__title" data-reveal>
          <span class="line"><span class="line__inner">${esc(p.name)}</span></span>
        </h1>
      </div>

      <span class="rule" aria-hidden="true"></span>

      <div class="case__row">
        <p class="case__summary" data-reveal>${esc(p.intro)}</p>
      </div>

      <span class="rule" aria-hidden="true"></span>

      <dl class="case__facts">
        <div class="case__fact">
          <dt>Services</dt>
          <dd><ul>${p.services.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></dd>
        </div>
        <div class="case__fact">
          <dt>Client</dt>
          <dd>${esc(p.client)}<br>${esc(p.location)}</dd>
        </div>
        <div class="case__fact">
          <dt>Built with</dt>
          <dd><ul>${p.stack.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></dd>
        </div>
        <div class="case__fact">
          <dt>Year</dt>
          <dd>${esc(p.year)}</dd>
        </div>
      </dl>

      <span class="rule" aria-hidden="true"></span>

      <dl class="case__metrics">${p.metrics.map((m) => `
        <div class="case__metric">
          <dt>${esc(m.value)}</dt>
          <dd>${esc(m.label)}</dd>
        </div>`).join('')}
      </dl>

      <span class="rule" aria-hidden="true"></span>
${p.scenes?.hero ? `
      <div class="case__showcase">${sceneFig(p, p.scenes.hero, ' case__scene--hero')}
      </div>` : p.video ? `
      <div class="case__showcase">
${videoMock(p.video, p.liveLabel, `${p.slug}-poster`, `${p.name} — a walkthrough of the finished build`)}
      </div>` : hero ? `
      <div class="case__showcase${framed ? '' : ' case__showcase--bare'}">
${media(hero, `${p.name} — the landing screen`, false)}
      </div>` : ''}

      <div class="case__approach">
        <p class="case__label"><b>&bull;</b> Approach</p>
        <div>${p.approach.map((t) => `\n          <p>${esc(t)}</p>`).join('')}
        </div>
      </div>
${p.scenes?.pair ? `
      <div class="case__pair">${p.scenes.pair.map((x) => sceneFig(p, x)).join('')}
      </div>` : rest.length ? `
      <div class="case__pair">${rest.map((b, i) => media(b, `${p.name} — section ${i + 2}`, true)).join('')}
      </div>` : ''}
${p.scenes?.phones ? `
      <div class="case__trio">${p.scenes.phones.map((x) => sceneFig(p, { ...x, phone: true })).join('')}
      </div>` : phones.length ? `
      <div class="case__phones" data-phone-rail>
        <div class="case__phones-track">${[...phones, ...phones, ...phones].map((b, i) => phoneMock(b, `${p.name} on mobile, view ${(i % phones.length) + 1}`)).join('')}
        </div>
      </div>` : ''}

${(p.chapters ?? []).map((c) => {
  const frames = chapterFrames(c)
  if (!frames.length && !c.scenes) return ''
  return `
      <span class="rule" aria-hidden="true"></span>

      <div class="case__approach">
        <p class="case__label"><b>&bull;</b> ${esc(c.title)}</p>
        <div>
          <p>${esc(c.intro)}</p>${c.body.map((t) => `\n          <p>${esc(t)}</p>`).join('')}${c.link ? `
          <p><a class="case__link" href="${esc(c.link.href)}" data-cursor-tag="Open">${esc(c.link.label)} <span aria-hidden="true">&rarr;</span></a></p>` : ''}
        </div>
      </div>

      <div class="case__pair">${c.scenes ? c.scenes.map((x) => sceneFig(p, x)).join('') : frames.map((f) => browserMock(f.base, f.url, `${p.name} — ${f.label}`, true)).join('')}
      </div>`
}).join('')}

      <div class="case__highlights">${p.highlights.map((h) => `
        <div class="case__highlight">
          <h3>${esc(h.label)}</h3>
          <p>${esc(h.text)}</p>
        </div>`).join('')}
      </div>

      <div class="case__outcome">
        <p class="case__label"><b>&bull;</b> Outcome</p>
        <div class="case__outcome-body">
          <div></div>
          <div>
            <p>${esc(p.outcome)}</p>
${p.hideLive
  ? ''
  : p.live
  ? `            <a class="pill" href="${esc(p.live)}" rel="noopener"
               data-magnetic="0.28" data-cursor-tag="Open the live site" data-cursor-color="${p.colour}">
              <span class="pill__label">Live Website</span>
            </a>`
  : `            <p class="case__offline">${esc(p.liveLabel)} is no longer online. These frames are captured from the original build.</p>`}
          </div>
        </div>
      </div>

      <a class="case__next" href="/${next.slug}"
         data-cursor-tag="Next project" data-cursor-color="${next.colour}">
        <span class="case__next-label">Next project</span>
        <span class="case__next-title">
          ${esc(next.name)}
          <span class="case__next-arrow" aria-hidden="true">&rarr;</span>
        </span>
      </a>

    </article>
  </main>

${chrome.footer}

${chrome.contact}

  <script type="module" src="/src/js/project.js"></script>
</body>
</html>
`
}

/* ---------------------------------------------------------------------------
   Homepage work grid.

   index.html is hand-written, but its grid is not: it is rendered here and
   spliced between the `work:start` / `work:end` markers, so adding a project
   can never again leave a case study live and linked from nowhere.

   Filters are lenses, not just subsets. "Product design" and "Development"
   show the same products, but each card then opens that case study on the
   matching half (?view=design / ?view=development), so a link sent with a
   product-design application lands on the design story and one sent with a
   front-end application lands on the engineering.
   --------------------------------------------------------------------------- */
const LENSES = [
  { id: 'all', label: 'All work' },
  { id: 'design', label: 'Product design' },
  { id: 'development', label: 'Development' },
  { id: 'web', label: 'Websites' },
]
// A product that also shipped website work (FarmHub's WordPress order pages)
// sets `website: true` and appears under Websites as well, with cardTag.web.
const lensesOf = (p) => (p.kind === 'product'
  ? ['all', 'design', 'development', ...(p.website ? ['web'] : [])]
  : ['all', 'web'])
const listed = PROJECTS.filter((p) => !p.draft)

const workCard = (p) => {
  const [w, h] = p.cardSize ?? [1400, 875]
  const product = p.kind === 'product'
  return `
          <li class="work__item" data-lenses="${lensesOf(p).join(' ')}">
            <a class="work__card" href="/${p.slug}"${product ? ` data-product` : ''}
               data-cursor-tag="View project" data-cursor-color="${p.colour}">
              <span class="work__media">
                <picture>
                  <source type="image/webp" srcset="/img/work/${p.card}@800.webp 800w, /img/work/${p.card}.webp 1400w" sizes="(max-width: 900px) 100vw, 44vw">
                  <img src="/img/work/${p.card}.jpg" alt="${esc(p.cardAlt)}" width="${w}" height="${h}" loading="lazy" decoding="async">
                </picture>
              </span>
              <span class="work__meta">
                <span class="work__name">${esc(p.name)}</span>
                ${product
                  ? `<span class="work__tag" data-tag-for="design">${esc(p.cardTag.design)}</span>
                <span class="work__tag" data-tag-for="development">${esc(p.cardTag.development)}</span>${p.cardTag.web ? `
                <span class="work__tag" data-tag-for="web">${esc(p.cardTag.web)}</span>` : ''}`
                  : `<span class="work__tag">${esc(p.cardTag)}</span>`}
              </span>
            </a>
          </li>`
}

const renderWorkGrid = () => `<!-- work:start — generated by \`npm run pages\` from content/projects.mjs.
             Edits between these markers are overwritten. -->
        <div class="work__filter" role="group" aria-label="Filter the work by discipline" data-reveal>${LENSES.map((l, i) => `
          <button class="work__lens" type="button" data-lens="${l.id}" aria-pressed="${i === 0}">
            ${esc(l.label)} <span class="work__count">${listed.filter((p) => lensesOf(p).includes(l.id)).length}</span>
          </button>`).join('')}
        </div>
        <p class="work__lens-note" data-lens-note aria-live="polite"></p>

        <ul class="work__grid" role="list">${listed.map(workCard).join('')}
        </ul>
        <!-- work:end -->`

{
  const indexPath = resolve(ROOT, 'index.html')
  const html = await readFile(indexPath, 'utf8')
  const re = /<!-- work:start[\s\S]*?<!-- work:end -->/
  if (!re.test(html)) throw new Error('index.html: work:start / work:end markers are missing')
  await writeFile(indexPath, html.replace(re, renderWorkGrid()))
  console.log(`index.html work grid (${listed.length} projects)`)
}

/* ---------------------------------------------------------------------------
   Product case study.

   Same chrome as a website case, then: an at-a-glance block (role, stack
   logos, team, timeline), a plain-language impact strip, photographic device
   mockups (scripts/compose-mockups.mjs), and a Design / Development switch.

   Both halves are in the markup, so the page works without JavaScript and both
   are indexed. js/product.js turns them into tabs, keeps ?view= in the URL, and
   darkens the page while the Development half is on screen.
   --------------------------------------------------------------------------- */
const svc = (s) => (typeof s === 'string' ? s : s.label)

/** A small line-icon set, 24×24, stroke-based so it takes currentColor. */
const ICON_PATHS = {
  tag: '<path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
  chart: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  store: '<path d="m2 7 4.4-4.4A2 2 0 0 1 7.8 2h8.4a2 2 0 0 1 1.4.6L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/>',
  box: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 8.7 5 8.7-5"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  pen: '<path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  cursor: '<path d="M4 4l7.07 17 2.51-7.39L21 11.07z"/>',
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  gauge: '<path d="M12 14l4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  wifi: '<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>',
  scale: '<path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  phone: '<rect x="5" y="2" width="14" height="20" rx="2.5"/><line x1="12" y1="18" x2="12.01" y2="18"/>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
  megaphone: '<path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  team: '<circle cx="9" cy="8" r="3.5"/><circle cx="17" cy="9.5" r="2.5"/><path d="M2.5 20c.6-3.6 3.3-5.5 6.5-5.5s5.9 1.9 6.5 5.5"/><path d="M15.5 14.8c2.9-.4 5.3 1.2 6 4.2"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  design: '<path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/>',
  dev: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="14" y1="4" x2="10" y2="20"/>',
  folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
}
const icon = (name, cls = 'icon') =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name] ?? ''}</svg>`

/** Stack name → logo file in /img/logos (from the open svgl.app library). */
const LOGOS = {
  Figma: 'figma', 'Next.js': 'nextjs', React: 'react', TypeScript: 'typescript',
  'Tailwind CSS': 'tailwind', Vitest: 'vitest', Supabase: 'supabase',
  'React Native': 'react', Expo: 'expo', Laravel: 'laravel', WordPress: 'wordpress',
  Elementor: 'elementor', PHP: 'php', Stripe: 'stripe',
}
const logoTile = (name) => `<li class="tech">
              <span class="tech__logo">${LOGOS[name] ? `<img src="/img/logos/${LOGOS[name]}.svg" alt="" width="28" height="28" loading="lazy">` : ''}</span>
              <span class="tech__name">${esc(name)}</span>
            </li>`

/** Mockup and screen dimensions, read once so every <img> carries its real aspect ratio. */
const MOCKUPS = resolve(ROOT, 'public/img/mockups')
const SCREENS = resolve(ROOT, 'public/img/screens')
const mockSize = {}
const screenSize = {}
try {
  const { default: sharp } = await import('sharp')
  for (const [dir, into] of [[MOCKUPS, mockSize], [SCREENS, screenSize]]) {
    for (const f of await readdir(dir).catch(() => [])) {
      if (!f.endsWith('.webp') || f.includes('@')) continue
      const m = await sharp(resolve(dir, f)).metadata()
      into[f.replace('.webp', '')] = [m.width, m.height]
    }
  }
} catch { /* no mockups yet */ }

/**
 * Wraps an image in a button that opens it in the lightbox (js/lightbox.js).
 * `src` is what the lightbox shows: for a mockup, the clean full-length screen
 * behind the photo, so the design itself can be inspected; `kind` tells the
 * lightbox how to fit it ('page' scrolls a long desktop screen at reading
 * width, anything else fits the viewport).
 */
const zoomable = (inner, { src, w, h, caption, kind = 'image' }) =>
  `<button type="button" class="zoom" data-zoom="${src}" data-zoom-w="${w}" data-zoom-h="${h}" data-zoom-kind="${kind}" data-zoom-caption="${esc(caption)}" data-cursor-tag="View" aria-label="View full size: ${esc(caption)}">
            ${inner}
          </button>`

const mockup = (name, alt, { eager = false, sizes = '(max-width: 900px) 100vw, 60vw', caption = alt, kind = 'page' } = {}) => {
  const [w, h] = mockSize[name] ?? [2400, 1600]
  const picture = `<picture class="photo">
            <source type="image/webp" srcset="/img/mockups/${name}@1200.webp 1200w, /img/mockups/${name}.webp 2400w" sizes="${sizes}">
            <img src="/img/mockups/${name}.webp" alt="${esc(alt)}" width="${w}" height="${h}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">
          </picture>`
  const screen = screenSize[name]
  return screen
    ? zoomable(picture, { src: `/img/screens/${name}.webp`, w: screen[0], h: screen[1], caption, kind })
    : zoomable(picture, { src: `/img/mockups/${name}.webp`, w, h, caption, kind: 'image' })
}

/**
 * Tiny syntax highlighter for the code windows: comments, strings, keywords,
 * numbers. Runs on raw text and escapes as it goes, so no markup can leak in.
 */
const KEYWORDS = new Set(['const', 'let', 'await', 'async', 'export', 'type', 'function', 'return', 'import', 'from', 'readonly', 'true', 'false', 'null', 'new'])
function highlight(line) {
  const re = /(\/\/.*$|\/\*.*?\*\/|\/\*\*.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`[^`]*`)|\b(\d[\d_]*)\b|\b([A-Za-z_][\w]*)\b/g
  let out = '', last = 0, m
  while ((m = re.exec(line))) {
    out += esc(line.slice(last, m.index))
    if (m[1]) out += `<span class="tk-c">${esc(m[1])}</span>`
    else if (m[2]) out += `<span class="tk-s">${esc(m[2])}</span>`
    else if (m[3]) out += `<span class="tk-n">${esc(m[3])}</span>`
    else if (KEYWORDS.has(m[4])) out += `<span class="tk-k">${esc(m[4])}</span>`
    else if (/^[A-Z]/.test(m[4])) out += `<span class="tk-t">${esc(m[4])}</span>`
    else if (line[re.lastIndex] === '(') out += `<span class="tk-f">${esc(m[4])}</span>`
    else out += esc(m[4])
    last = re.lastIndex
  }
  return out + esc(line.slice(last))
}
const codeWindow = (c) => `
          <figure class="pcode" data-reveal>
            <figcaption><span class="pcode__dots" aria-hidden="true"><i></i><i></i><i></i></span>${esc(c.file)}</figcaption>
            <pre><code>${c.lines.map((l, i) => `<span class="pcode__ln" aria-hidden="true">${i + 1}</span>${highlight(l)}`).join('\n')}</code></pre>
          </figure>`

const sectionHead = (n, title, intro) => `
        <header class="psec__head" data-reveal>
          <p class="psec__index">${String(n).padStart(2, '0')}</p>
          <h3 class="psec__title">${esc(title)}</h3>
          ${intro ? `<p class="psec__intro">${esc(intro)}</p>` : ''}
        </header>`

function renderDesign(p) {
  const d = p.design
  let n = 0
  const parts = []

  if (d.research) parts.push(`
      <section class="psec">${sectionHead(++n, d.research.title, d.research.intro)}
        <ul class="pcards pcards--4">${d.research.items.map((r) => `
          <li class="pcard" data-reveal>
            <span class="pcard__icon">${icon(r.icon)}</span>
            <h4>${esc(r.title)}</h4>
            <p>${esc(r.text)}</p>
          </li>`).join('')}
        </ul>
      </section>`)

  if (d.personas) parts.push(`
      <section class="psec">${sectionHead(++n, d.personasTitle ?? 'Who it is for', d.personasIntro)}
        <ul class="personas">${d.personas.map((x) => `
          <li class="persona" data-reveal>
            <div class="persona__head">
              <span class="persona__icon">${icon(x.icon)}</span>
              <h4>${esc(x.name)}</h4>
            </div>
            <p class="persona__context">${esc(x.context)}</p>
            <p class="persona__label">Needs to</p>
            <ul class="persona__jobs">${x.jobs.map((j) => `<li>${esc(j)}</li>`).join('')}</ul>
            ${x.note ? `<p class="persona__note">${esc(x.note)}</p>` : ''}
          </li>`).join('')}
        </ul>
      </section>`)

  if (d.principles) parts.push(`
      <section class="psec">${sectionHead(++n, d.principlesTitle ?? 'Principles', d.principlesIntro)}
        <ol class="principles">${d.principles.map((x, i) => `
          <li data-reveal><span class="principles__n">${i + 1}</span><div><h4>${esc(x.title)}</h4><p>${esc(x.text)}</p></div></li>`).join('')}
        </ol>
      </section>`)

  if (d.ia) parts.push(`
      <section class="psec">${sectionHead(++n, d.ia.title, d.ia.intro)}
        <div class="ia" data-reveal>
          <div class="ia__col">
            <p class="ia__label">${icon('monitor')} ${esc(d.ia.consoleLabel ?? 'Organiser dashboard')}</p>
            <ol class="ia__list">${d.ia.console.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>
          </div>
          <div class="ia__visual">
            ${(() => {
              const [rw, rh] = d.ia.railSize ?? [472, 1800]
              const [tw, th] = d.ia.tabbarSize ?? [1170, 324]
              const railCap = d.ia.railCaption ?? "The dashboard's navigation rail"
              const tabCap = d.ia.tabbarCaption ?? "The attendee app's tab bar"
              return `${zoomable(`<img src="/img/components/${d.ia.rail}.webp" alt="${esc(railCap)}" width="${rw}" height="${rh}" loading="lazy" class="ia__rail"${d.ia.railWhole ? ` style="aspect-ratio:${rw} / ${rh}"` : ''}>`, { src: `/img/components/${d.ia.rail}.webp`, w: rw, h: rh, caption: railCap })}
            ${d.ia.tabbar ? zoomable(`<img src="/img/components/${d.ia.tabbar}.webp" alt="${esc(tabCap)}" width="${tw}" height="${th}" loading="lazy" class="ia__tabbar">`, { src: `/img/components/${d.ia.tabbar}.webp`, w: tw, h: th, caption: tabCap }) : ''}`
            })()}
          </div>
          <div class="ia__col">
            <p class="ia__label">${icon(d.ia.attendeeIcon ?? 'phone')} ${esc(d.ia.attendeeLabel ?? 'Attendee app')}</p>
            <ol class="ia__list">${d.ia.attendee.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>
          </div>
        </div>
      </section>`)

  // Phone screens shown two at a time: one topic, its text, and two photographs.
  // A section marked `after` follows the dashboard screens instead (a
  // dashboard-led product's phone view).
  const pairSection = (ps) => `
      <section class="psec">${sectionHead(++n, ps.title, ps.intro)}
${ps.pairs.map((pr, i) => `
        <article class="ppair${i % 2 ? ' ppair--flip' : ''}">
          <div class="pstep__text" data-reveal>
            <h4 class="pstep__title">${esc(pr.title)}</h4>
            ${pr.body.map((t) => `<p>${esc(t)}</p>`).join('\n            ')}
          </div>
          <div class="ppair__media">${pr.items.map((x) => `
            <figure class="ppair__fig" data-reveal>
              ${mockup(x.mockup, `${p.name}: ${x.caption}`, { sizes: '(max-width: 560px) 100vw, (max-width: 900px) 50vw, 30vw', caption: x.caption, kind: 'phone' })}
              <figcaption>${esc(x.caption)}</figcaption>
            </figure>`).join('')}
          </div>
        </article>`).join('')}
      </section>`
  for (const ps of (d.pairSections ?? []).filter((x) => !x.after)) parts.push(pairSection(ps))

  if (d.screens) parts.push(`
      <section class="psec">${sectionHead(++n, d.screensTitle ?? 'The dashboard', d.screensIntro)}
${d.screens.map((sc, i) => `
        <article class="pstep${i % 2 ? ' pstep--flip' : ''}">
          <div class="pstep__text" data-reveal>
            <h4 class="pstep__title">${esc(sc.title)}</h4>
            ${sc.body.map((t) => `<p>${esc(t)}</p>`).join('\n            ')}
          </div>
          <figure class="pstep__media" data-reveal>
            ${mockup(sc.mockup, `${p.name}: ${sc.caption}`, { caption: sc.caption })}
            <figcaption>${esc(sc.caption)}</figcaption>
          </figure>
        </article>`).join('')}
      </section>`)

  for (const ps of (d.pairSections ?? []).filter((x) => x.after)) parts.push(pairSection(ps))

  if (d.phones) parts.push(`
      <section class="psec">${sectionHead(++n, d.phones.title, d.phones.body)}
        <ul class="phones">${d.phones.items.map((x) => `
          <li class="phones__item" data-reveal>
            ${mockup(x.mockup, `${p.name} ${d.phones.altLabel ?? 'attendee app'}: ${x.caption}`, { sizes: '(max-width: 900px) 50vw, 25vw', caption: x.caption, kind: 'phone' })}
            <p>${esc(x.caption)}</p>
          </li>`).join('')}
        </ul>
      </section>`)

  if (d.system) {
    const s = d.system
    parts.push(`
      <section class="psec">${sectionHead(++n, s.title, s.body)}
        <ul class="pspec__swatches" aria-label="Core colour tokens">${s.swatches.map((w) => `
          <li class="pspec__swatch" data-reveal>
            <span class="pspec__chip" style="background:${w.value}"></span>
            <span class="pspec__name">${esc(w.name)}</span>
            <code>${esc(w.value)}</code>
            <span class="pspec__note">${esc(w.note)}</span>
          </li>`).join('')}
        </ul>
        <div class="pspec__foot">
          <div class="pspec__type" data-reveal>
            <p class="pspec__label">Typeface</p>
            <p class="pspec__family">Aa</p>
            <p class="pspec__family-name">${esc(s.type.family)}</p>
            <p class="pspec__note">${esc(s.type.note)}</p>
          </div>
          <div class="pspec__rules" data-reveal>
            <p class="pspec__label">${esc(s.rulesLabel ?? 'Non-negotiables')}</p>
            <ul>${s.rules.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
          </div>
        </div>
        ${s.components ? `
        <p class="pspec__label pspec__label--gap">${esc(s.componentsLabel ?? 'Components')}</p>
        <ul class="bento">${s.components.map((c) => `
          <li class="bento__item${c.wide ? ' bento__item--wide' : ''}" data-reveal>
            ${zoomable(`<span class="bento__frame"><img src="/img/components/${c.img}.webp" alt="${esc(c.label)} component" width="${c.w}" height="${c.h}" loading="lazy"></span>`, { src: `/img/components/${c.img}.webp`, w: c.w, h: c.h, caption: `${c.label} component` })}
            <span class="bento__label">${esc(c.label)}</span>
          </li>`).join('')}
        </ul>` : ''}
      </section>`)
  }

  if (d.timeline) parts.push(`
      <section class="psec">${sectionHead(++n, d.timelineTitle ?? 'How it came together', d.timelineIntro)}
        <ol class="ptime">${d.timeline.map((t) => `
          <li data-reveal><time>${esc(t.date)}</time><p>${esc(t.text)}</p></li>`).join('')}
        </ol>
      </section>`)

  // Older entries (the drafted mobile app) still use plain sections.
  if (d.sections) parts.push(d.sections.map((sec) => `
      <section class="psec">${sectionHead(++n, sec.title)}
        <div class="psec__body">${sec.body.map((t) => `<p>${esc(t)}</p>`).join('')}</div>
      </section>`).join(''))

  return parts.join('\n')
}

function renderDevelopment(p) {
  const v = p.development
  let n = 0
  const parts = []

  parts.push(`
        <ul class="techrow" aria-label="Stack">${p.stack.map(logoTile).join('')}
        </ul>`)

  if (v.flow) parts.push(`
      <section class="psec">${sectionHead(++n, v.flowTitle ?? 'How a page is served', v.flowIntro)}
        <figure class="pflow" data-reveal>
          <ol class="pflow__track">${v.flow.map((x) => `
            <li class="pflow__node pflow__node--${x.owner}">
              <span class="pflow__label">${esc(x.label)}</span>
              <span class="pflow__sub">${esc(x.sub)}</span>
            </li>`).join('')}
          </ol>
          <figcaption class="pflow__key">
            <span class="pflow__key-item pflow__key-item--me">${esc(v.flowKey?.me ?? 'Built by me')}</span>
            <span class="pflow__key-item pflow__key-item--partner">${esc(v.flowKey?.other ?? 'Built by the team')}</span>
          </figcaption>
        </figure>
      </section>`)

  if (v.tree) parts.push(`
      <section class="psec psec--split">
        <div>${sectionHead(++n, v.treeTitle ?? 'Project structure', v.treeIntro)}
          <p class="psec__aside">${esc(v.tree.note)}</p>
        </div>
        <figure class="ptree" data-reveal>
          <figcaption>${icon('folder')} ${esc(v.tree.root)}</figcaption>
          <ul>${v.tree.items.map((x) => `
            <li>${icon(x.file ? 'file' : 'folder')}<code>${esc(x.name)}</code><span>${esc(x.note)}</span></li>`).join('')}
          </ul>
        </figure>
      </section>`)

  for (const sec of v.sections ?? []) parts.push(`
      <section class="psec psec--split">
        <div>${sectionHead(++n, sec.title)}
          <div class="psec__body">${sec.body.map((t) => `<p>${esc(t)}</p>`).join('\n            ')}</div>
        </div>${sec.code ? codeWindow(sec.code) : ''}
      </section>`)

  if (v.suites) parts.push(`
      <section class="psec">${sectionHead(++n, v.suitesTitle ?? 'Testing', v.suitesIntro)}
        <ul class="pcards pcards--4">${v.suites.map((x) => `
          <li class="pcard" data-reveal>
            <span class="pcard__icon">${icon(x.icon)}</span>
            <h4>${esc(x.title)}</h4>
            <p>${esc(x.text)}</p>
          </li>`).join('')}
        </ul>
        ${v.quality ? `<dl class="pquality">${v.quality.map((q) => `
          <div class="pquality__item" data-reveal><dt>${esc(q.value)}</dt><dd>${esc(q.label)}</dd></div>`).join('')}
        </dl>` : ''}
      </section>`)

  if (v.split) parts.push(`
      <section class="psec">${sectionHead(++n, v.splitTitle ?? 'Who built what', v.splitIntro)}
        <div class="psplit${v.split.bothMine ? ' psplit--both' : ''}" data-reveal>
          <div class="psplit__col psplit__col--mine">
            <p class="pspec__label">${esc(v.split.mineLabel ?? 'What I built')}</p>
            <ul>${v.split.mine.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
          </div>
          <div class="psplit__col${v.split.bothMine ? ' psplit__col--mine' : ''}">
            <p class="pspec__label">${esc(v.split.partnerLabel ?? 'What the team built')}</p>
            <ul>${v.split.partner.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
          </div>
        </div>
      </section>`)

  return parts.join('\n')
}

function renderProduct(p) {
  const next = nextOf(p.slug)
  const d = p.design
  const v = p.development

  return `<!doctype html>
<html lang="en">
<head>
${chrome.head(p)}
</head>
<body>

${chrome.preface}

  <main id="main" tabindex="-1">
    <article class="case pcase">

      <span class="rule" aria-hidden="true"></span>

      <header class="phead">
        <div class="phead__text">
          <ul class="ptags" data-reveal aria-label="My role on this project">${p.role.split('·').map((r) => `<li class="ptag">${esc(r.trim())}</li>`).join('')}</ul>
          <h1 class="case__title" data-reveal>
            <span class="line"><span class="line__inner">${esc(p.name)}</span></span>
          </h1>
          <p class="case__summary phead__summary" data-reveal>${esc(p.intro)}</p>
        </div>${p.hero?.laptop ? `
        <figure class="phead__media" data-reveal>
          ${mockup(p.hero.laptop, p.hero.alt ?? `${p.name}: the organiser console on a laptop`, { eager: true, sizes: '(max-width: 900px) 100vw, 55vw', caption: p.hero.caption ?? `${p.name} on a laptop` })}
        </figure>` : ''}
      </header>

      <div class="glance">
        <div class="glance__cell glance__cell--role" data-reveal>
          <p class="glance__label">My role</p>
          <ul class="chips">${p.services.map((s) => `<li class="chip">${icon(s.icon ?? 'pen')}${esc(svc(s))}</li>`).join('')}</ul>
        </div>
        <div class="glance__cell glance__cell--stack" data-reveal>
          <p class="glance__label">Built with</p>
          <ul class="techgrid">${p.stack.map(logoTile).join('')}
          </ul>
        </div>
        <div class="glance__cell" data-reveal>
          <p class="glance__label">${icon('team')} Team</p>
          <p class="glance__text">${esc(p.team)}</p>
        </div>
        <div class="glance__cell" data-reveal>
          <p class="glance__label">${icon('clock')} Timeline</p>
          <p class="glance__big">${esc(p.timeline?.label ?? `${p.timeline?.weeks ?? ''} weeks`)}</p>
          <p class="glance__text">${esc(p.timeline?.span ?? p.year)}<br>${esc(p.location)}</p>
        </div>
      </div>
${p.impact ? `
      <ul class="impact">${p.impact.map((m) => `
        <li class="impact__item" data-reveal>
          <span class="impact__icon">${icon(m.icon)}</span>
          <p class="impact__value">${esc(m.value)}<span>${esc(m.unit)}</span></p>
          ${m.viz ? `<span class="impact__bar" role="img" aria-label="${m.viz.used} of ${m.viz.max} KB used"><i style="width:${Math.round((m.viz.used / m.viz.max) * 100)}%"></i><b style="left:100%"></b></span>
          <span class="impact__scale"><span>0</span><span>${m.viz.max} KB limit</span></span>` : ''}
          <p class="impact__text">${esc(m.text)}</p>
        </li>`).join('')}
      </ul>` : ''}
      <div class="pswitch" data-product-switch>
        <div class="pswitch__inner" role="tablist" aria-label="Read this case study as">
          <button class="pswitch__tab" type="button" role="tab" id="tab-design" aria-controls="design" aria-selected="true" data-view="design">
            ${icon('design', 'pswitch__icon')} Design
          </button>
          <button class="pswitch__tab" type="button" role="tab" id="tab-development" aria-controls="development" aria-selected="false" data-view="development" tabindex="-1">
            ${icon('dev', 'pswitch__icon')} Development
          </button>
          <span class="pswitch__thumb" aria-hidden="true"></span>
        </div>
      </div>

      <div class="ppanel" id="design" role="tabpanel" aria-labelledby="tab-design" data-panel="design">
        <h2 class="visually-hidden">Design</h2>
        <p class="ppanel__lede" data-reveal>${esc(d.lede)}</p>
${renderDesign(p)}
      </div>

      <div class="ppanel ppanel--dev" id="development" role="tabpanel" aria-labelledby="tab-development" data-panel="development">
        <h2 class="visually-hidden">Development</h2>
        <p class="ppanel__lede" data-reveal>${esc(v.lede)}</p>
${renderDevelopment(p)}
      </div>

      <div class="case__outcome" data-scene-end>
        <p class="case__label"><b>&bull;</b> ${esc(p.outcomeLabel ?? 'Where it stands')}</p>
        <div class="case__outcome-body">
          <div></div>
          <div>
            <p>${esc(p.outcome)}</p>
${p.live ? `            <a class="pill" href="${esc(p.live)}" rel="noopener"
               data-magnetic="0.28" data-cursor-tag="Open ${esc(p.liveLabel)}" data-cursor-color="${p.colour}">
              <span class="pill__label">Visit ${esc(p.liveLabel)}</span>
            </a>` : ''}
          </div>
        </div>
      </div>

      <a class="case__next" href="/${next.slug}"
         data-cursor-tag="Next project" data-cursor-color="${next.colour}">
        <span class="case__next-label">Next project</span>
        <span class="case__next-title">
          ${esc(next.name)}
          <span class="case__next-arrow" aria-hidden="true">&rarr;</span>
        </span>
      </a>

    </article>
  </main>

${chrome.footer}

${chrome.contact}

  <script type="module" src="/src/js/product.js"></script>
</body>
</html>
`
}

await mkdir(ROOT, { recursive: true })
/** The About page. Same chrome as a case study, different body. */
const renderAbout = () => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <script src="/theme.js"></script>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>About ${esc(PROFILE.name)} — Design Engineer &amp; Front-End Developer</title>
  <meta name="description" content="${esc(metaTrim(PROFILE.intro[0]))}">
  <meta name="theme-color" content="#000000">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="canonical" href="${abs('/about')}">

  <meta property="og:type" content="profile">
  <meta property="og:site_name" content="${SITE.name}">
  <meta property="og:url" content="${abs('/about')}">
  <meta property="og:title" content="About ${esc(PROFILE.name)} — ${PROFILE.role}">
  <meta property="og:description" content="${esc(metaTrim(PROFILE.intro[0]))}">
  <meta property="og:image" content="${abs('/img/work/abf.jpg')}">
  <meta name="twitter:card" content="summary_large_image">

  <script type="application/ld+json">
${jsonLd({
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  mainEntity: {
    '@type': 'Person',
    name: PROFILE.name,
    alternateName: [PROFILE.legal, 'Sammiee'],
    givenName: 'Samuel',
    familyName: 'Fasipe',
    url: SITE.url,
    email: `mailto:${SITE.email}`,
    jobTitle: PROFILE.role,
    description: metaTrim(PROFILE.intro[0], 300),
    knowsAbout: CAPABILITIES.flatMap((c) => c.items),
    sameAs: SITE.social,
  },
})}
  </script>

  <script type="module" src="/src/js/about-page.js"></script>
</head>
<body>
${chrome.preface}

  <main class="about-page" id="main" tabindex="-1">
    <section class="about-page__intro">
      <p class="about-page__eyebrow" data-reveal>About</p>
      <h1 class="about-page__title" data-reveal>${esc(PROFILE.name)}</h1>
      <div class="about-page__lead" data-reveal>
${PROFILE.intro.map((t) => `        <p>${esc(t)}</p>`).join('\n')}
      </div>
    </section>

    <span class="rule" aria-hidden="true"></span>

    <section class="about-page__proof">
      <h2 class="visually-hidden">By the numbers</h2>
      <dl>
${PROOF.map((m) => `        <div class="about-page__stat" data-reveal>
          <dt>${esc(m.value)}</dt>
          <dd>${esc(m.label)}</dd>
        </div>`).join('\n')}
      </dl>
    </section>

    <span class="rule" aria-hidden="true"></span>

    <section class="about-page__caps">
      <h2 class="about-page__h2" data-reveal>What I work with</h2>
      <div class="about-page__caps-grid">
${CAPABILITIES.map((c) => `        <div class="cap" data-reveal>
          <h3>${esc(c.title)}</h3>
          <ul>${c.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
        </div>`).join('\n')}
      </div>
    </section>

    <span class="rule" aria-hidden="true"></span>

    <section class="about-page__work">
      <h2 class="about-page__h2" data-reveal>Selected work</h2>
      <ul class="about-page__work-list">
${listed.map((p) => `        <li data-reveal>
          <a href="/${p.slug}" data-cursor-tag="View project" data-cursor-color="${p.colour}">
            <span class="about-page__work-name">${esc(p.name)}</span>
            <span class="about-page__work-meta">${esc(p.stack.join(' \u00b7 '))}</span>
            <span class="about-page__work-year">${esc(p.year)}</span>
          </a>
        </li>`).join('\n')}
      </ul>

      <a class="pill about-page__cv" href="/cv" data-reveal data-magnetic="0.24"
         data-cursor-tag="Read the CV" data-cursor-color="#0895fa">
        <span class="pill__label">See my CV</span>
      </a>
    </section>
  </main>

${chrome.footer}

${chrome.contact}
</body>
</html>
`

/* ---------------------------------------------------------------------------
   CV page.

   Both tracks render into the same document and cv.css hides one, so the page
   costs a single request, the switch is instant, and whichever track is on
   screen is the one that prints. A recruiter can be sent /cv or /cv?wordpress
   and gets the CV that matches the role.
   --------------------------------------------------------------------------- */

/** One role entry, with only the bullets that belong to `track`. */
const cvRole = (role, track) => {
  const bullets = bulletsFor(role, track)
  if (!bullets.length) return ''
  return `        <article class="cv__role-item" data-reveal>
          <div class="cv__dates">
            <span>${esc(role.from)} &ndash; ${esc(role.to)}</span>
            ${role.kind ? `<span class="cv__kind">${esc(role.kind)}</span>` : ''}
          </div>
          <div>
            <h3 class="cv__role-title">${esc(role.title)}</h3>
            <p class="cv__org">${role.link
              ? `<a class="link-wipe" href="https://${esc(role.link)}" rel="noopener">${esc(role.org)}</a>`
              : esc(role.org)}</p>
            ${role.note ? `<p class="cv__note">${esc(role.note)}</p>` : ''}
            <ul class="cv__bullets">
${bullets.map((b) => `              <li>${b.text}</li>`).join('\n')}
            </ul>
            ${role.caseStudy ? `<a class="cv__case link-wipe" href="/${esc(role.caseStudy)}">Read the case study</a>` : ''}
          </div>
        </article>`
}

/** Everything that differs between the two CVs, wrapped so CSS can swap it. */
const cvTrack = (track) => {
  const t = TRACKS[track]
  return `      <div data-t="${track}">
        <p class="cv__role">${t.title}</p>
        <p class="cv__tagline">${esc(t.subtitle)}</p>
      </div>`
}

const cvBody = (track) => {
  const t = TRACKS[track]
  return `      <div data-t="${track}">
        <section class="cv__section">
          <h2 class="cv__h2" data-reveal>Profile</h2>
          <p class="cv__summary" data-reveal>${t.summary}</p>
        </section>

        <section class="cv__section">
          <h2 class="cv__h2" data-reveal>Experience</h2>
          <div class="cv__roles">
${ROLES.map((r) => cvRole(r, track)).filter(Boolean).join('\n')}
          </div>
        </section>

        <section class="cv__section">
          <h2 class="cv__h2" data-reveal>Skills</h2>
          <div class="cv__skills">
${t.skills.map((g) => `            <div class="cv__skill-group" data-reveal>
              <h3>${esc(g.group)}</h3>
              <ul>
${g.items.map((i) => `                <li>${esc(i)}</li>`).join('\n')}
              </ul>
            </div>`).join('\n')}
          </div>
        </section>
      </div>`
}

const renderCv = () => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <script src="/theme.js"></script>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CV &mdash; ${esc(IDENTITY.name)}, Design Engineer</title>
  <meta name="description" content="${esc(metaTrim(TRACKS.de.summary))}">
  <meta name="theme-color" content="#000000">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="canonical" href="${abs('/cv')}">

  <meta property="og:type" content="profile">
  <meta property="og:site_name" content="${SITE.name}">
  <meta property="og:url" content="${abs('/cv')}">
  <meta property="og:title" content="CV &mdash; ${esc(IDENTITY.name)}, Design Engineer">
  <meta property="og:description" content="${esc(metaTrim(TRACKS.de.summary))}">
  <meta property="og:image" content="${abs('/img/work/bmoni.jpg')}">
  <meta name="twitter:card" content="summary_large_image">

  <script type="application/ld+json">
${jsonLd({
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  url: abs('/cv'),
  mainEntity: {
    '@type': 'Person',
    name: IDENTITY.name,
    alternateName: [IDENTITY.known, 'Sammiee'],
    url: SITE.url,
    email: `mailto:${IDENTITY.email}`,
    jobTitle: TRACKS.de.title,
    description: metaTrim(TRACKS.de.summary, 300),
    sameAs: SITE.social,
    alumniOf: EDUCATION.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.org })),
    knowsAbout: TRACKS.de.skills.flatMap((g) => g.items),
    worksFor: { '@type': 'Organization', name: ROLES[0].org },
  },
})}
  </script>

  <script type="module" src="/src/js/cv-page.js"></script>
</head>
<body>
${chrome.preface}

  <main class="cv" id="main" tabindex="-1" data-track="de">

    <header class="cv__head">
      <div>
        <h1 class="cv__name" data-reveal>${esc(IDENTITY.name)}</h1>
${cvTrack('de')}
${cvTrack('wp')}
      </div>

      <div class="cv__contact" data-reveal>
        <a class="link-wipe" href="mailto:${esc(IDENTITY.email)}">${esc(IDENTITY.email)}</a>
        <a class="link-wipe" href="${esc(IDENTITY.siteUrl)}">${esc(IDENTITY.site)}</a>
        <a class="link-wipe" href="${esc(IDENTITY.linkedinUrl)}" rel="noopener">${esc(IDENTITY.linkedin)}</a>
        <a class="link-wipe" href="${esc(IDENTITY.githubUrl)}" rel="noopener">${esc(IDENTITY.github)}</a>
        <span>${IDENTITY.availability}</span>
      </div>
    </header>

    <div class="cv__switch">
      <span class="cv__switch-label">Showing the CV for</span>
      <button class="cv__track-btn" type="button" data-track-btn="de" aria-pressed="true">${esc(TRACKS.de.label)}</button>
      <button class="cv__track-btn" type="button" data-track-btn="wp" aria-pressed="false">${esc(TRACKS.wp.label)}</button>
      <a class="pill cv__download" data-cv-download
         href="/cv/${TRACKS.de.file}.pdf"
         data-file-de="/cv/${TRACKS.de.file}.pdf"
         data-file-wp="/cv/${TRACKS.wp.file}.pdf"
         download="${TRACKS.de.file}.pdf" data-magnetic="0.2">
        <span class="pill__label">Download PDF</span>
      </a>
    </div>

${cvBody('de')}
${cvBody('wp')}

    <section class="cv__section">
      <h2 class="cv__h2" data-reveal>Selected work</h2>
      <ul class="cv__selected">
${SELECTED.map((s) => `        <li data-reveal>
          <a href="/${esc(s.slug)}" data-cursor-tag="View project">
            <span class="cv__selected-name">${esc(s.name)}</span>
            <span class="cv__selected-line">${esc(s.line)}</span>
          </a>
        </li>`).join('\n')}
      </ul>
    </section>

    <section class="cv__section">
      <h2 class="cv__h2" data-reveal>Education</h2>
      <ul class="cv__edu">
${EDUCATION.map((e) => `        <li data-reveal>${esc(e.title)}, <span>${esc(e.org)}, ${esc(e.year)}</span></li>`).join('\n')}
      </ul>
    </section>

  </main>

${chrome.footer}

${chrome.contact}
</body>
</html>
`

await writeFile(resolve(ROOT, 'about.html'), renderAbout())
console.log('about.html')

await writeFile(resolve(ROOT, 'cv.html'), renderCv())
console.log('cv.html')

for (const p of PROJECTS) {
  if (p.draft) { console.log(`${p.slug}  (draft, skipped)`); continue }
  if (p.kind === 'product') {
    await writeFile(resolve(ROOT, `${p.slug}.html`), renderProduct(p))
    console.log(`${p.slug}.html  (product, ${Object.keys(mockSize).filter((k) => k.startsWith(p.slug)).length} mockups)`)
    continue
  }
  await writeFile(resolve(ROOT, `${p.slug}.html`), render(p))
  const d = shotsOf(p.slug, 'desktop', p.shots?.desktop ?? 3).length
  const m = shotsOf(p.slug, 'mobile', p.shots?.mobile ?? 2).length
  console.log(`${p.slug}.html  (${d} desktop, ${m} mobile${p.live ? '' : ', from video'})`)
}
console.log(`\n${PROJECTS.length} pages written.`)

// --- sitemap + robots ------------------------------------------------------
// Written into public/ so Vite copies them to dist untouched. Generated rather
// than hand-kept, so adding a project cannot leave the sitemap stale.
const PUBLIC = resolve(ROOT, 'public')
const today = new Date().toISOString().slice(0, 10)

const urls = [
  { loc: abs('/'), priority: '1.0', changefreq: 'monthly' },
  { loc: abs('/about'), priority: '0.9', changefreq: 'monthly' },
  { loc: abs('/cv'), priority: '0.8', changefreq: 'monthly' },
  ...listed.map((p) => ({ loc: abs(`/${p.slug}`), priority: p.kind === 'product' ? '0.7' : '0.5', changefreq: 'yearly' })),
]

await writeFile(resolve(PUBLIC, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`)

await writeFile(resolve(PUBLIC, 'robots.txt'),
  `User-agent: *
Allow: /

Sitemap: ${abs('/sitemap.xml')}
`)

console.log(`sitemap.xml + robots.txt written for ${SITE.url}`)
