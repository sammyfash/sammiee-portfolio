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
 *   - lead with the work and the result, not with a claim about how important
 *     the work was, and let a paragraph end when its point is made
 *
 * Company-wide revenue, traffic and sponsorship are never attributed to a
 * person here. "The platform later processed" is a fact; "my work drove" is a
 * claim, and a recruiter will ask which one is meant.
 */

export const PROFILE = {
  // The public name, and now the only one the site says out loud: the wordmark,
  // the greeting, the page titles and the structured data all agree. It is the
  // name already on LinkedIn, GitHub and the domain.
  name: 'Sammy Fash',
  // Kept for the CV, the PDFs and the structured data's alternate names. A CV
  // is a formal document and an ATS parses it against the name on file.
  legal: 'Samuel Fasipe',
  role: 'Design engineer',
  years: 10,
  // No location. The target is remote roles with international teams, so a
  // country line only invites filtering and buys nothing: local search would
  // bring local clients, which is not the work being chased. Working hours are
  // the fact a remote employer actually needs.
  hours: 'European and US working hours',
  available: true,

  /** Displayed over the portrait. Two lines, both set at display size. */
  greeting: ['Hello', 'I’m Sammy Fash'],

  /** The homepage h1. */
  headline: 'I design digital products and build the front end.',

  /** The paragraph under the h1. */
  lede:
    'I’m a design engineer with ten years of experience. I take websites and product ' +
    'interfaces from early structure in Figma through to a working build in WordPress, ' +
    'Webflow, Framer or hand-written front-end code.',

  /** Sits above the fold, next to the two first-screen actions. */
  availability:
    'Available for remote design engineering roles and selected freelance projects.',

  /** The expressive line. Kept as the brand statement, not as the job title. */
  statement: 'The designer who builds.',

  /** The paragraph under it, on the homepage about band. */
  statementBody:
    'My work sits between design and front-end development. I think through the layout, ' +
    'interaction and responsive behaviour, then build what we agreed. That keeps the final ' +
    'site close to the design and gives the team one person to speak to from brief to launch.',

  /** Opening of the About page. Read as one block, so the rhythm matters. */
  intro: [
    'I’m a design engineer. I started in graphic design, moved into product design and ' +
    'learned to build the interfaces I was designing. Ten years later, that overlap is still ' +
    'where I do my best work.',

    'I usually begin in Figma, working out the structure, responsive behaviour and key ' +
    'interactions. From there, I can build the site in WordPress, Webflow or Framer, or write ' +
    'the front end in HTML, CSS and JavaScript. Clients do not have to translate the design ' +
    'for another developer, and developers receive decisions that have already been tested ' +
    'against the browser.',

    'Most of my recent work has been in fintech, Web3 and live events. I have designed and ' +
    'built for BMONI, Africa Blockchain Festival, ETHSafari and teams in the Internet Computer ' +
    'ecosystem. The projects differ, but the job is often the same: make a complicated offer ' +
    'easy to understand, ship on time and leave the team with something they can manage.',

    'I work remotely across European and US hours. I’m currently looking for a design ' +
    'engineering role, and I’m also open to selected website projects.',
  ],
}

/**
 * Numbers a recruiter can check against the case studies.
 *
 * Each label states whose number it is and what it measures. The platform
 * figures belong to BMONI and are qualified as such: the site launched, the
 * platform later reported the volume, and nothing here claims the first caused
 * the second. Keep the "after the website launch" and "reported" wording unless
 * there is analytics and attribution to support something stronger.
 */
export const PROOF = [
  { value: '10 years', label: 'working across design and front-end development' },
  { value: '$1B+', label: 'processed by the BMONI platform after the website launch' },
  { value: '~100K', label: 'daily visits reported for BMONI’s website' },
  { value: '6', label: 'case studies of design and development work documented here' },
]

/**
 * Capabilities, grouped the way the job actually splits. Deliberately four
 * groups rather than three, and uneven in length, because tidy triads are the
 * first thing that reads as generated.
 *
 * No explanatory line under each group: the tool names are clearer on their own,
 * and the notes that used to sit here were the site's densest cluster of
 * self-describing copy.
 */
export const CAPABILITIES = [
  {
    title: 'Product and interface design',
    items: ['Figma', 'Responsive layouts', 'Design systems', 'Prototyping', 'Interaction design', 'Accessibility'],
  },
  {
    title: 'WordPress, Webflow and Framer',
    items: ['Custom WordPress builds', 'Reusable content blocks', 'Webflow CMS', 'Framer sites', 'Client handover'],
  },
  {
    title: 'Front-end development',
    items: ['HTML', 'CSS', 'JavaScript', 'GSAP', 'Vite', 'Responsive implementation'],
  },
  {
    title: 'Performance and search',
    items: ['Core Web Vitals', 'Semantic markup', 'Structured data', 'Image optimisation', 'Technical SEO'],
  },
]
