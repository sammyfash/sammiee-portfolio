/**
 * Site-wide constants. Everything that needs an absolute URL — canonicals,
 * Open Graph images, the sitemap, JSON-LD — resolves against `SITE.url`, so
 * moving domains is one edit here (or one env var at build time).
 */
export const SITE = {
  url: (process.env.SITE_URL || 'https://sammyfash.com').replace(/\/+$/, ''),
  // One public name. The site used to run three — Sammiee as the wordmark,
  // Samuel Fasipe in the machine-readable fields, Sammy Fash on LinkedIn and
  // GitHub — which meant a recruiter checking two of them could not be certain
  // they had found the same person. Sammy Fash is the one that is already on
  // the profiles a recruiter actually visits, so it is the one that leads.
  //
  // `legal` is not decoration. It stays on the CV, on contracts and in the
  // structured data below, because an applicant tracking system and a
  // background check both key on the name on the passport.
  name: 'Sammy Fash',
  author: 'Sammy Fash',
  legal: 'Samuel Fasipe',
  // Both former names are kept as alternates rather than deleted: that is the
  // signal that ties the old indexed pages, the old domain and the CV to this
  // identity instead of leaving three unconnected people on the web.
  alternateName: ['Samuel Fasipe', 'Sammiee'],
  email: 'me@sammyfash.com',
  tagline: 'The designer who builds',
  description:
    'Design engineer with ten years of experience in product design and front-end '
    + 'development. I work in Figma, WordPress, Webflow, Framer, HTML, CSS and JavaScript.',
  // sameAs is how search engines tie this site to an identity, so only real
  // profiles belong here. LinkedIn leads: with no location and no CV timeline
  // on the site, it is where a recruiter goes to fill in the gaps. GitHub
  // matters for the engineering half of the job and was missing.
  social: [
    'https://www.linkedin.com/in/sammy-fash/',
    'https://github.com/sammyfash',
    'https://www.instagram.com/iamsammyfash/',
    'https://x.com/sammyyfash',
  ],
}

/** Absolute URL for a site-relative path. */
export const abs = (path = '/') => `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`

/**
 * Trim to a meta-description length without cutting a word in half.
 * `.slice(155)` produced things like "…processed over $1 b" — which is exactly
 * what a search result would have shown.
 */
export function metaTrim(text, max = 155) {
  const clean = String(text).replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : cut.length).replace(/[\s,;:—–-]+$/, '')}…`
}

/** JSON-LD, safe to drop inside a <script> tag. */
export const jsonLd = (data) =>
  JSON.stringify(data, null, 2).replace(/</g, '\\u003c')
