/**
 * Site-wide constants. Everything that needs an absolute URL — canonicals,
 * Open Graph images, the sitemap, JSON-LD — resolves against `SITE.url`, so
 * moving domains is one edit here (or one env var at build time).
 */
export const SITE = {
  url: (process.env.SITE_URL || 'https://sammiee.dev').replace(/\/+$/, ''),
  name: 'Sammiee',
  author: 'Sammiee',
  email: 'me@sammiee.dev',
  tagline: 'The designer who builds',
  description:
    'Design engineer with ten years in product design and front-end. WordPress, Webflow, '
    + 'Framer, and hand-written HTML, CSS and JavaScript.',
  // Only real profiles belong here: sameAs is how search engines tie this site
  // to an identity, and a link to a network's homepage is worse than no link.
  // LinkedIn is missing because the URL has not been supplied yet.
  social: [
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
