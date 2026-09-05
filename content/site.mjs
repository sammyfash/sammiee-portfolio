/**
 * Site-wide constants. Everything that needs an absolute URL — canonicals,
 * Open Graph images, the sitemap, JSON-LD — resolves against `SITE.url`, so
 * moving domains is one edit here (or one env var at build time).
 */
export const SITE = {
  url: (process.env.SITE_URL || 'https://sammiee.dev').replace(/\/+$/, ''),
  // `name` is the wordmark, `author` is the person. They are deliberately
  // different: the site is branded Sammiee, but a CV, a contract, a reference
  // and a recruiter's search all key on the legal name, so that is what every
  // machine-readable field carries. Search engines were being given a name
  // that appears on none of his other profiles.
  name: 'Sammiee',
  author: 'Samuel Fasipe',
  alternateName: 'Sammiee',
  email: 'me@sammiee.dev',
  tagline: 'The designer who builds',
  description:
    'Design engineer with ten years in product design and front-end. WordPress, Webflow, '
    + 'Framer, and hand-written HTML, CSS and JavaScript.',
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
