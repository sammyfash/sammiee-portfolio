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
import { mkdir, readdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { PROJECTS, nextOf } from '../content/projects.mjs'
import { SITE, abs, metaTrim, jsonLd } from '../content/site.mjs'
import { PROFILE, PROOF, CAPABILITIES } from '../content/about.mjs'

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

const chrome = {
  head: (p) => `  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(p.seoTitle || `${p.title} — ${SITE.name}`)}</title>
  <meta name="description" content="${esc(metaTrim(p.seoDescription || p.intro))}">
  <meta name="theme-color" content="#000000">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="canonical" href="${abs(`/${p.slug}`)}">

  <meta property="og:type" content="article">
  <meta property="og:site_name" content="${SITE.name}">
  <meta property="og:url" content="${abs(`/${p.slug}`)}">
  <meta property="og:title" content="${esc(p.seoTitle || `${p.title} — ${SITE.name}`)}">
  <meta property="og:description" content="${esc(metaTrim(p.seoDescription || p.intro))}">
  <meta property="og:image" content="${abs(`/img/work/${p.card}.jpg`)}">
  <meta property="og:image:alt" content="${esc(p.name)} — ${esc(p.services[0])} by ${SITE.name}">
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
    keywords: [...p.services, ...p.stack].join(', '),
    creator: { '@type': 'Person', name: SITE.author, url: SITE.url },
    about: { '@type': 'Organization', name: p.client },
    locationCreated: { '@type': 'Place', name: p.location },
  })}
  </script>`,

  preface: `  <div class="preloader">
    <div class="preloader__inner">
      <span class="preloader__mark">Sammieeeee</span>
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
      <a class="wordmark" href="/">Sammieeeee</a>
      <button class="nav-close" type="button" aria-label="Close menu">
        <span></span><span></span>
      </button>
    </div>

    <ul class="nav-list">
      <li><a class="nav-link" href="/">
        <span class="nav-link__roll"><span>Home</span><span aria-hidden="true">Home</span></span>
        <span class="nav-link__index">01</span>
      </a></li>
      <li><a class="nav-link" href="/#about">
        <span class="nav-link__roll"><span>About me</span><span aria-hidden="true">About me</span></span>
        <span class="nav-link__index">02</span>
      </a></li>
      <li><a class="nav-link" href="/#work">
        <span class="nav-link__roll"><span>My Works</span><span aria-hidden="true">My Works</span></span>
        <span class="nav-link__index">03</span>
      </a></li>
      <li><a class="nav-link" href="#contact" data-contact-open>
        <span class="nav-link__roll"><span>Get in touch</span><span aria-hidden="true">Get in touch</span></span>
        <span class="nav-link__index">04</span>
      </a></li>
    </ul>

    <div class="nav-overlay__foot">
      <a class="link-wipe" href="mailto:me@sammiee.dev">me@sammiee.dev</a>
      <span>
        <a class="link-wipe" href="https://www.instagram.com/iamsammyfash/" rel="noopener">Instagram</a> &nbsp;
                <a class="link-wipe" href="https://x.com/sammyyfash" rel="noopener">X</a>
      </span>
    </div>
  </nav>

  <header class="site-header" id="top">
    <a class="wordmark" href="/">Sammieeeee</a>
    <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false">
      <span></span><span></span><span></span><span></span><span></span>
    </button>
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
          <h2 class="contact__title" id="contact-title">Let&rsquo;s create magic</h2>
          <p class="contact__blurb">
            Tell me what you&rsquo;re building and roughly when you need it live.
            I read everything and reply within a day or two.
          </p>
          <p class="contact__direct">
            Rather just email?<br>
            <a class="link-wipe" href="mailto:me@sammiee.dev">me@sammiee.dev</a>
          </p>
        </div>

        <div>
          <form novalidate>
            <div class="contact__field" data-label="Name">
              <label for="contact-name">Name</label>
              <input id="contact-name" name="name" type="text" autocomplete="name" placeholder="Sammiee" required>
              <span class="contact__error" aria-live="polite"></span>
            </div>

            <div class="contact__field" data-label="Email">
              <label for="contact-email">Email</label>
              <input id="contact-email" name="email" type="email" autocomplete="email" placeholder="you@company.com" required>
              <span class="contact__error" aria-live="polite"></span>
            </div>

            <div class="contact__field" data-label="Message">
              <label for="contact-message">Project</label>
              <textarea id="contact-message" name="message" rows="3" placeholder="A new site for a Web3 event, live by October." required></textarea>
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
                <span class="pill__label">Send it</span>
              </button>
              <span class="contact__status" role="status" aria-live="polite"></span>
            </div>
          </form>

          <div class="contact__sent" role="status">
            <p>Thanks, that&rsquo;s on its way.</p>
            <p>I&rsquo;ll come back to you at the address you gave me, usually within a day or two.</p>
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
        <h2 class="site-footer__heading" data-reveal>Let&rsquo;s talk about what you&rsquo;re building.</h2>
          <p class="site-footer__availability" data-reveal>
            Open to design engineering roles and selected project work.
            Remote, and comfortable across European and US working hours.
          </p>
        <a class="pill site-footer__button" href="mailto:me@sammiee.dev?subject=Enquiry%20from%20sammiee.dev"
           data-contact-open data-magnetic="0.28" data-cursor-tag="Say hello" data-cursor-color="#edaa0b">
          <span class="pill__label">Get in touch</span>
        </a>
      </div>

      <div class="site-footer__contact">
        <a class="site-footer__email link-wipe" href="mailto:me@sammiee.dev">me@sammiee.dev</a>
        <div class="site-footer__social">
          <a class="link-wipe" href="https://www.instagram.com/iamsammyfash/" rel="noopener">Instagram</a>
          <a class="link-wipe" href="https://x.com/sammyyfash" rel="noopener">X</a>
        </div>
      </div>
    </div>

    <p class="site-footer__fineprint">
      &copy; 2026 Sammiee. Designed and built by me.
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

  const hero = desktop[0]
  const rest = desktop.slice(1)

  return `<!doctype html>
<html lang="en">
<head>
${chrome.head(p)}
</head>
<body>

${chrome.preface}

  <main>
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
${p.video ? `
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
${rest.length ? `
      <div class="case__pair">${rest.map((b, i) => media(b, `${p.name} — section ${i + 2}`, true)).join('')}
      </div>` : ''}
${phones.length ? `
      <div class="case__phones" data-phone-rail>
        <div class="case__phones-track">${[...phones, ...phones, ...phones].map((b, i) => phoneMock(b, `${p.name} on mobile, view ${(i % phones.length) + 1}`)).join('')}
        </div>
      </div>` : ''}

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

await mkdir(ROOT, { recursive: true })
/** The About page. Same chrome as a case study, different body. */
const renderAbout = () => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>About ${SITE.name} — Design Engineer &amp; Web Designer</title>
  <meta name="description" content="${esc(metaTrim(PROFILE.intro[0]))}">
  <meta name="theme-color" content="#000000">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="canonical" href="${abs('/about')}">

  <meta property="og:type" content="profile">
  <meta property="og:site_name" content="${SITE.name}">
  <meta property="og:url" content="${abs('/about')}">
  <meta property="og:title" content="About ${SITE.name} — ${PROFILE.role}">
  <meta property="og:description" content="${esc(metaTrim(PROFILE.intro[0]))}">
  <meta property="og:image" content="${abs('/img/work/abf.jpg')}">
  <meta name="twitter:card" content="summary_large_image">

  <script type="application/ld+json">
${jsonLd({
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  mainEntity: {
    '@type': 'Person',
    name: SITE.name,
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

  <main class="about-page">
    <section class="about-page__intro">
      <p class="about-page__eyebrow" data-reveal>${esc(PROFILE.role)}</p>
      <h1 class="about-page__title" data-reveal>${esc(PROFILE.name)}</h1>
      <div class="about-page__lead" data-reveal>
${PROFILE.intro.map((t) => `        <p>${esc(t)}</p>`).join('\n')}
      </div>
    </section>

    <span class="rule" aria-hidden="true"></span>

    <section class="about-page__proof">
      <h2 class="sr-only">By the numbers</h2>
      <dl>
${PROOF.map((m) => `        <div class="about-page__stat" data-reveal>
          <dt>${esc(m.value)}</dt>
          <dd>${esc(m.label)}</dd>
        </div>`).join('\n')}
      </dl>
    </section>

    <span class="rule" aria-hidden="true"></span>

    <section class="about-page__caps">
      <h2 class="about-page__h2" data-reveal>What I do</h2>
      <div class="about-page__caps-grid">
${CAPABILITIES.map((c) => `        <div class="cap" data-reveal>
          <h3>${esc(c.title)}</h3>
          <ul>${c.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
          <p>${esc(c.note)}</p>
        </div>`).join('\n')}
      </div>
    </section>

    <span class="rule" aria-hidden="true"></span>

    <section class="about-page__work">
      <h2 class="about-page__h2" data-reveal>Selected work</h2>
      <ul class="about-page__work-list">
${PROJECTS.map((p) => `        <li data-reveal>
          <a href="/${p.slug}" data-cursor-tag="View project" data-cursor-color="${p.colour}">
            <span class="about-page__work-name">${esc(p.name)}</span>
            <span class="about-page__work-meta">${esc(p.stack.join(' &middot; '))}</span>
            <span class="about-page__work-year">${esc(p.year)}</span>
          </a>
        </li>`).join('\n')}
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

for (const p of PROJECTS) {
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
  ...PROJECTS.map((p) => ({ loc: abs(`/${p.slug}`), priority: '0.5', changefreq: 'yearly' })),
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
