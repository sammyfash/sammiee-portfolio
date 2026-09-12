/**
 * The CV, as data. One source, two tracks.
 *
 *   /cv            the design-engineer CV (permanent roles)
 *   /cv?wordpress  the WordPress & Webflow CV (contract work)
 *
 * `npm run pages` renders cv.html from this; `npm run cv` prints both tracks
 * to PDF. Editing cv.html by hand gets overwritten, exactly like the case
 * studies. When this becomes WordPress the roles below are a repeater field
 * and the template becomes page-cv.php.
 *
 * House style is the same as content/about.mjs: no em dashes, plain words,
 * nothing claimed that cannot be pointed at.
 *
 * Bullet `t` marks which track a line belongs to:
 *   'both'  appears on both CVs
 *   'de'    design-engineer CV only
 *   'wp'    WordPress and Webflow CV only
 */

export const IDENTITY = {
  name: 'Samuel Fasipe',
  // The portfolio wordmark stays "Sammiee". The CV, LinkedIn, contracts and
  // references all key on the legal name, so that is what leads here.
  known: 'Sammiee',
  email: 'me@sammiee.dev',
  site: 'sammiee.dev',
  siteUrl: 'https://sammiee.dev',
  linkedin: 'linkedin.com/in/sammy-fash',
  linkedinUrl: 'https://www.linkedin.com/in/sammy-fash/',
  github: 'github.com/sammyfash',
  githubUrl: 'https://github.com/sammyfash',
  // No country, by decision: the site does not state one either, and the two
  // have to agree. Availability is the fact a remote employer actually needs.
  availability: 'Remote &middot; European and US working hours',
}

export const TRACKS = {
  de: {
    id: 'de',
    label: 'Design engineer',
    short: 'Design engineer',
    file: 'Samuel-Fasipe-Design-Engineer',
    title: 'Design engineer',
    subtitle: 'Product design and front-end development',
    summary:
      'Design engineer with ten years of experience across product design and front-end development. '
      + 'I take websites and product interfaces from structure and interaction design in Figma through '
      + 'to production. Recent work includes BMONI&rsquo;s marketing website, used across Nigeria and '
      + 'Mexico, and two editions of Africa Blockchain Festival. I work in WordPress, Webflow and Framer, '
      + 'and build custom interfaces with HTML, CSS and JavaScript.',
    skills: [
      { group: 'Design', items: ['Figma', 'Design systems', 'Interaction design', 'Prototyping', 'Responsive layout', 'Accessibility'] },
      { group: 'Front-end', items: ['HTML', 'CSS', 'JavaScript', 'GSAP', 'Vite', 'Motion design'] },
      { group: 'CMS and no-code', items: ['WordPress', 'Custom themes', 'ACF', 'Webflow', 'Framer'] },
      { group: 'Performance and search', items: ['Core Web Vitals', 'Semantic markup', 'Structured data', 'Technical SEO', 'Image pipelines'] },
    ],
  },
  wp: {
    id: 'wp',
    label: 'WordPress & Webflow',
    short: 'WordPress and Webflow developer',
    file: 'Samuel-Fasipe-WordPress-Webflow-Developer',
    title: 'WordPress &amp; Webflow developer',
    subtitle: 'Websites designed, built and handed over clearly',
    summary:
      'WordPress and Webflow developer with ten years of experience in design and front-end development. '
      + 'I can start with a brief, design the responsive interface in Figma and build a content system '
      + 'the client can manage. Recent projects include a two-market fintech website and a multilingual '
      + 'event site used across two campaign cycles.',
    skills: [
      { group: 'WordPress', items: ['Custom themes', 'ACF', 'Reusable blocks', 'Multilingual', 'Elementor', 'Migration'] },
      { group: 'Webflow and Framer', items: ['Webflow CMS', 'Interactions', 'Framer', 'Responsive build'] },
      { group: 'Design', items: ['Figma', 'UI design', 'Design systems', 'Art direction', 'Prototyping'] },
      { group: 'Front-end', items: ['HTML', 'CSS', 'JavaScript', 'GSAP', 'Core Web Vitals', 'Technical SEO'] },
    ],
  },
}

/** Roles, newest first. The 2016 start is what makes the ten-year claim true. */
export const ROLES = [
  {
    title: 'Visual designer and WordPress developer',
    org: 'BMONI',
    kind: 'Contract',
    from: 'Sep 2025',
    to: 'Present',
    link: 'bmoni.com',
    caseStudy: 'bmoni',
    note: 'Cross-border neobank on stablecoin rails, live in Nigeria and Mexico.',
    bullets: [
      { t: 'both', text: 'Designed and built the marketing website for a cross-border neobank. BMONI reports more than $1 billion processed on the platform since launch, and roughly 100,000 visits a day to the site.' },
      { t: 'de', text: 'Structured the page around the decision a switching customer actually makes, with four product claims each earning their own section instead of being flattened into a feature grid.' },
      { t: 'wp', text: 'Built every section as a reusable WordPress block, so a new market is assembled from existing parts rather than commissioned as new design work.' },
      { t: 'both', text: 'Shipped a market switch above the fold for an audience split across two continents, and carried a second market live on the same template set.' },
      { t: 'wp', text: 'Improved mobile responsiveness across 15+ core pages, and produced 50+ campaign and social assets alongside the build.' },
    ],
  },
  {
    title: 'Web designer and WordPress developer',
    org: 'Africa Blockchain Festival',
    kind: 'Contract, two editions',
    from: 'Apr 2025',
    to: 'Present',
    link: 'africablockchainfestival.com',
    caseStudy: 'africa-blockchain-festival',
    note: 'Africa’s largest blockchain festival and tokenisation summit, Nairobi.',
    bullets: [
      { t: 'both', text: 'Designed and built the website for the 2025 edition, which the organisers used during partner outreach. They report the edition secured close to $100,000 in sponsorship.' },
      { t: 'both', text: 'Separated the sponsor funnel from the ticket funnel, because a $50 attendee and a $25,000 sponsor are not the same visitor and a single path serves neither well.' },
      { t: 'wp', text: 'Built speakers, sponsors, ticket tiers, travel guides and three languages onto the festival’s own content model, so a months-long campaign never queued behind a developer.' },
      { t: 'de', text: 'Resolved every section, breakpoint and state in Figma before the build began, against a fixed event date that made mid-build renegotiation impossible.' },
      { t: 'de', text: 'Built the event team&rsquo;s admin dashboard in Next.js, TypeScript and Supabase: registration and payment sync from Google Sheets, per-link campaign attribution, and server-priced coupons redeemed only on payment.' },
      { t: 'both', text: 'Retained for the 2026 edition, which the team has run through a full campaign cycle themselves.' },
    ],
  },
  {
    title: 'Lead designer',
    org: 'ICP Hub Kenya',
    kind: 'Full-time, remote',
    from: 'May 2023',
    to: 'Aug 2025',
    link: 'icphubkenya.io',
    caseStudy: 'icp-hub-kenya',
    note: 'The DFINITY ecosystem’s primary hub in East Africa.',
    bullets: [
      { t: 'both', text: 'Designed and launched the official website and visual identity for the hub, and owned all social and branding material across two years.' },
      { t: 'both', text: 'Created the website and visual materials used in developer, university and partner outreach.' },
      { t: 'de', text: 'Improved developer and partner onboarding through clearer navigation and a route through the site that matched what each audience had come to do.' },
      { t: 'both', text: 'Recommended into the sister hubs in the United States and Germany on the strength of the work.' },
    ],
  },
  {
    title: 'Product designer',
    org: 'ICP Hub USA',
    kind: 'Contract',
    from: 'Feb 2025',
    to: 'Mar 2025',
    bullets: [
      { t: 'both', text: 'Designed the website UX and UI, and the social creative suite, for the US arm of the ICP ecosystem’s global expansion.' },
      { t: 'de', text: 'Built responsive layouts and Figma prototypes aimed at three separate audiences: developers, investors and prospective partners.' },
    ],
  },
  {
    title: 'Visual designer',
    org: 'ICP Hub Germany',
    kind: 'Contract',
    from: 'Mar 2025',
    to: 'Apr 2025',
    bullets: [
      { t: 'both', text: 'Delivered Web3 campaign content for the German hub’s channels and community programmes.' },
      { t: 'both', text: 'Held visual consistency across the European hub presence with a shared set of branded templates.' },
    ],
  },
  {
    title: 'Product designer',
    org: 'THNDR Games',
    kind: 'Contract',
    from: 'Feb 2023',
    to: 'Apr 2023',
    bullets: [
      { t: 'both', text: 'Led UI design for Bitcoin Blocks, a casual play-to-earn game built on Bitcoin, through to a successful launch.' },
      { t: 'de', text: 'Designed the interface logic, the gaming dashboard and the user progression system, working directly against the engineering constraints of the platform.' },
    ],
  },
  {
    title: 'Visual designer, then product designer',
    org: 'Bitnob',
    kind: 'Full-time',
    from: '2018',
    to: '2022',
    note: 'African consumer fintech.',
    bullets: [
      { t: 'both', text: 'Joined as a graphic designer owning the full creative suite for an early-stage brand, and was promoted into UI and product design.' },
      { t: 'de', text: 'Worked directly with product and engineering on the core consumer app and its supporting dashboards, across four years of the company’s growth.' },
      { t: 'both', text: 'Owned the brand and product design work through the period in which Bitnob raised over $5 million in venture funding.' },
    ],
  },
  {
    title: 'Freelance designer and web developer',
    org: 'Self-employed',
    kind: 'Freelance',
    from: '2016',
    to: '2018',
    // TODO(sammiee): this entry still needs the real detail. Name the kinds of
    // client, the kinds of build and any outcome that can be checked. An
    // interviewer will ask about the first two years, and it is the only entry
    // on the CV that cannot be backed by a case study. The second bullet was
    // removed rather than rewritten: it was reflective filler, and a recruiter
    // cannot verify a sentence about where a skill came from.
    bullets: [
      { t: 'both', text: 'Designed and built websites for independent clients, and took on brand and campaign work alongside them.' },
    ],
  },
]

/** Case studies worth naming on the CV itself, in the order they carry weight. */
export const SELECTED = [
  { name: 'BMONI', slug: 'bmoni', line: 'Marketing website for a cross-border neobank, live in Nigeria and Mexico.' },
  { name: 'Africa Blockchain Festival', slug: 'africa-blockchain-festival', line: 'Two editions. Three languages, a client-owned content model and a Next.js admin dashboard.' },
  { name: 'ETHSafari', slug: 'ethsafari', line: 'Art direction and WordPress build for a pan-African Ethereum event.' },
  { name: 'ICP Hub Kenya', slug: 'icp-hub-kenya', line: 'Website and identity for the DFINITY ecosystem hub in East Africa.' },
]

export const EDUCATION = [
  { title: 'BSc, Urban Design', org: 'Obafemi Awolowo University', year: '2021' },
]

/** Bullets for one role on one track. */
export const bulletsFor = (role, track) =>
  role.bullets.filter((b) => b.t === 'both' || b.t === track)
