/**
 * Copy for the About page and the capability band on the homepage.
 *
 * House style, set deliberately to avoid reading as machine-written:
 *   - no em dashes (use commas, colons, semicolons, full stops)
 *   - never the "it's not X, it's Y" construction
 *   - vary sentence length; do not let every sentence run 15 to 20 words
 *   - plain words over impressive ones
 *   - rhetorical lists of exactly three are a tell, factual lists are fine
 *   - claim nothing that cannot be pointed at
 */

export const PROFILE = {
  name: 'Sammiee',
  role: 'Design engineer',
  years: 10,
  location: 'Nairobi, Kenya',
  available: true,

  /** The homepage hero, under "The designer who builds". */
  lede:
    'Design engineer, ten years in. I cover product design and the front-end that ships ' +
    'it, so what gets signed off in Figma is what reaches production. I build in WordPress, ' +
    'Webflow and Framer, and write HTML, CSS and JavaScript when a project calls for it.',

  /** The one-line statement in the homepage about band. */
  statement:
    'Ten years of design engineering behind work that carries real weight: over a billion ' +
    'dollars moved through one build, a hundred thousand visitors a day through another.',

  /** Opening of the About page. Read as one block, so the rhythm matters. */
  intro: [
    'I have spent ten years on both sides of the handoff. Design is where I start, in Figma, ' +
    'working through structure, states and interaction until the thing is actually resolved. ' +
    'Then I build it, because a design only counts once it is running in a browser at the ' +
    'quality it was drawn at.',

    'Most of my work has been for teams in Web3, live events and fintech, where the launch ' +
    'date is fixed and the site is the commercial surface. Recent builds include a neobank ' +
    'front door that now takes around a hundred thousand visitors a day, and a festival site ' +
    'that helped secure close to $100,000 in sponsorship for its edition.',

    'I use WordPress and Webflow when a client needs to own their content without calling a ' +
    'developer, Framer when speed matters more than depth, and plain HTML, CSS and JavaScript ' +
    'when a project deserves something bespoke. This site is that last case: hand-built, no ' +
    'framework, no page builder.',
  ],
}

/** Numbers a recruiter can check against the case studies. */
export const PROOF = [
  { value: '10 yrs', label: 'designing and building for the web' },
  { value: '$1B+', label: 'processed on a platform my work fronts' },
  { value: '~100K', label: 'visitors a day on the busiest build' },
  { value: '6', label: 'case studies documented on this site' },
]

/**
 * Capabilities, grouped the way the job actually splits. Deliberately four
 * groups rather than three, and uneven in length, because tidy triads are the
 * first thing that reads as generated.
 */
export const CAPABILITIES = [
  {
    title: 'Product & UI design',
    items: ['Figma', 'Design systems', 'Interaction design', 'Prototyping', 'Responsive layout', 'Accessibility'],
    note: 'Every screen resolved to its states before a line of code exists.',
  },
  {
    title: 'CMS & no-code build',
    items: ['WordPress', 'Custom themes', 'ACF', 'Webflow', 'Framer', 'Elementor'],
    note: 'Content models the client can run themselves once I hand over.',
  },
  {
    title: 'Front-end engineering',
    items: ['HTML', 'CSS', 'JavaScript', 'GSAP', 'Motion design', 'Vite'],
    note: 'Hand-written when a build deserves more than a page builder can give it.',
  },
  {
    title: 'Performance & search',
    items: ['Core Web Vitals', 'Semantic markup', 'Structured data', 'Technical SEO', 'Image pipelines', 'CSP & headers'],
    note: 'The parts that decide whether the work is ever actually found.',
  },
]

/**
 * Roles held. EMPTY ON PURPOSE: employment history is not something to guess at
 * on a page recruiters will read. Fill this in and the section renders itself.
 *
 *   { role, org, from, to, summary }
 */
export const EXPERIENCE = []

/** Same rule as EXPERIENCE. { qualification, org, year } */
export const EDUCATION = []
