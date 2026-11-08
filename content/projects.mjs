/**
 * Every case study lives here. `npm run pages` renders one HTML file per entry,
 * so all six pages stay in lockstep — and when this becomes WordPress these
 * fields map straight onto custom fields, with the template becoming
 * single-project.php.
 *
 *   shots.desktop / shots.mobile  how many section frames the page shows
 *   video                         slug of a build video in /public/video
 *   metrics                       the two or three numbers that carry the case
 *   stack                         the tools the work was actually made with
 *
 * The three video cases used to carry a `videoUrl` pointing at the old
 * WordPress site on sammyfash.com, which `npm run shots` fetched from when the
 * source file was missing. That site is gone and the domain now serves this
 * one, so the field was removed rather than left to fetch an HTML page into an
 * .mp4. The masters live in assets-src/video/, which is gitignored; keep a copy
 * somewhere durable, because nothing can re-fetch them now.
 *
 * Copy rules, same as content/about.mjs. Two that matter most here:
 *
 *   1. Every number states whose it is and what it measures. A figure that
 *      belongs to the client's platform is written as the client's, with the
 *      timeframe or the source attached. Nothing implies the website caused a
 *      business result unless there is something to point at.
 *   2. Six case studies must not share one argumentative shape. "The audience
 *      is X, so I did Y, which means Z" reads as a template by the third page.
 */

import { PRODUCTS } from './products.mjs'

const WEBSITES = [
  // Africa Blockchain Festival moved to content/products.mjs (kind: 'product',
  // website: true) in Nov 2026, so it reads like the other recent case studies.
  // BMONI moved to content/products.mjs (Nov 2026): full product layout, all three sites.

  {
    slug: 'icp-hub-kenya',
    seoTitle: 'Web3 education site design & Webflow build | Sammy Fash',
    seoDescription: 'Website and Webflow build for ICP Hub Kenya, with clear routes for developers, students and ecosystem partners.',
    name: 'ICP Hub Kenya',
    title: 'ICP Hub Kenya',
    colour: '#a855f7',
    live: null,
    liveLabel: 'icphubkenya.io',
    year: '2025',
    client: 'ICP Hub Kenya · DFINITY ecosystem',
    location: 'Nairobi, Kenya',
    services: ['UI/UX Design', 'Web Design', 'Webflow Development'],
    stack: ['Figma', 'Webflow'],
    card: 'icp-kenya',
    kind: 'website',
    cardAlt: 'The ICP Hub Kenya website on a tablet',
    cardTag: 'Figma · Webflow',
    cardSize: [1400, 852],
    video: 'icp-hub-kenya',
    shots: { desktop: 0, mobile: 0 },
    metrics: [
      { value: '1,200+', label: 'developers trained by the hub, the record the site was built to show' },
      { value: '$100K+', label: 'in grants secured for builders, as reported by the hub' },
      { value: '50+', label: 'partner universities across Kenya, as reported by the hub' },
    ],
    intro: 
      'ICP Hub Kenya trains developers, funds startups and runs events for the Internet Computer ' +
      'community in East Africa. I was part of the hub’s team, and I designed its website and built it ' +
      'in Webflow so the team could publish events, programmes and news without waiting for a developer.',
    scenes: {
      hero: { mockup: 'icp-hero', caption: 'The homepage, in a Nairobi lecture room' },
      pair: [
        { mockup: 'icp-milestones', caption: 'The hub’s record, at a hackathon' },
        { mockup: 'icp-join', caption: 'Why join the hub, in a Nairobi library' },
      ],
    },
    approach: [
      'The hub speaks to three very different people. A developer wants training and grants, a student ' +
      'wants events and a way in, and a university or sponsor wants proof that the hub delivers. The ' +
      'homepage gives each of them a route in its first screen, then shows the proof: developers trained, ' +
      'grants secured, partner universities and startups incubated.',

      'The look takes the Internet Computer’s purple and gradient and makes it local, with the hub’s own ' +
      'astronaut mascot, photos of the Nairobi community and a Kenyan flag ticker running across the hero.',

      'Everything the team publishes often, events, programmes, projects and news, lives in Webflow CMS ' +
      'collections. When I handed the site over, the team could add a new event or programme themselves.',
    ],
    outcome: 
      'The site carried the hub’s outreach to developers, universities, sponsors and ecosystem partners ' +
      'during my time with the team. The original domain has since lapsed, so the case study includes a ' +
      'recorded walkthrough of the finished build.',
    highlights: [
      { label: 'A route for every visitor', text: 'Developers, students and partners each find what they came for from the first screen.' },
      { label: 'Proof, not promises', text: 'The hub’s record of developers trained, grants and startups sits high on the homepage.' },
      { label: 'Run by the team', text: 'Events, programmes, projects and news are published from Webflow CMS without a developer.' },
    ],
  },

  // ETHSafari moved to content/products.mjs (Nov 2026): full product layout.

  {
    slug: 'smartdev-studios',
    seoTitle: 'Agency website design & Webflow build | Sammy Fash',
    seoDescription: 'Website design and Webflow development for SmartDev Studios, explaining its blockchain development services to founders and non-technical buyers.',
    name: 'SmartDev Studios',
    title: 'SmartDev Studios',
    colour: '#fb923c',
    live: null,
    liveLabel: 'smart-devstudios.com',
    year: '2025',
    client: 'SmartDev Studios',
    location: 'Remote',
    services: ['UI/UX Design', 'Web Design', 'Webflow Development'],
    stack: ['Figma', 'Webflow'],
    card: 'blockchain-solutions',
    kind: 'website',
    cardAlt: 'The SmartDev Studios website on a laptop',
    cardTag: 'Figma · Webflow',
    cardSize: [1400, 797],
    video: 'smartdev-studios',
    shots: { desktop: 0, mobile: 0 },
    metrics: [
      { value: '100+', label: 'projects and hackathons in the studio’s record, presented on the site' },
      { value: '500+', label: 'blockchain partners, as reported by the studio' },
      { value: '8', label: 'services, each explained by the problem it solves for a business' },
    ],
    intro: 
      'SmartDev Studios builds blockchain products for businesses: smart contracts, DeFi apps, games, ' +
      'tokenisation and audits. Most of its buyers are founders who aren’t engineers, so I designed and ' +
      'built a Webflow site that explains what the studio does in words a founder can act on.',
    scenes: {
      hero: { mockup: 'smartdev-hero', caption: 'The homepage, in a dev studio at night' },
      pair: [
        { mockup: 'smartdev-services', caption: 'Eight services, in a founders’ meeting' },
        { mockup: 'smartdev-industries', caption: 'Industries, one tab at a time' },
      ],
    },
    approach: [
      'A founder comparing blockchain studios usually meets a wall of jargon. The opening says plainly what ' +
      'SmartDev does, who it works with and why it can be trusted, with the studio’s years of experience, ' +
      'projects and certified developers right beside it.',

      'Each of the eight services, from smart contracts to Web3 data, is described by what it does for a ' +
      'business. An Industries section then shows the same technology at work in finance, healthcare, ' +
      'logistics, manufacturing and insurance, one tab at a time.',

      'Past projects, the studio’s own products and its developers each have a section, so a founder can ' +
      'see real work and real people before getting in touch. I built it all in Webflow, responsive across ' +
      'desktop, tablet and phone, so the team could change its offer as it grew.',
    ],
    outcome: 
      'SmartDev used the site for outreach and inbound enquiries from founders. The original domain has ' +
      'since lapsed, so the case study includes a recorded walkthrough of the finished build.',
    highlights: [
      { label: 'Plain words for founders', text: 'Every service says what it does for a business, not how the technology works.' },
      { label: 'Industries, one tab at a time', text: 'Visitors see blockchain applied to their own sector without reading the rest.' },
      { label: 'Real work and real people', text: 'Past projects, products and the developer team sit on the same page as the offer.' },
    ],
  },

  {
    slug: 'dynasty-labs',
    seoTitle: 'Web3 venture site design & Webflow build | Sammy Fash',
    seoDescription: 'One-page website design and Webflow development for Dynasty Labs, a Hong Kong growth firm working with Web3 companies.',
    name: 'Dynasty Labs',
    title: 'Dynasty Labs',
    colour: '#22d3ee',
    live: null,
    liveLabel: 'dynasty-labs.io',
    year: '2025',
    client: 'Dynasty Labs',
    location: 'Hong Kong',
    services: ['UI/UX Design', 'Landing Page', 'Webflow Development'],
    stack: ['Figma', 'Webflow'],
    card: 'dynasty-labs',
    kind: 'website',
    cardAlt: 'The Dynasty Labs website on a MacBook',
    cardTag: 'Figma · Webflow',
    cardSize: [1400, 809],
    video: 'dynasty-labs',
    shots: { desktop: 0, mobile: 0 },
    metrics: [
      { value: '6', label: 'services in one scroll, from market entry to media partnerships' },
      { value: '3', label: 'portfolio case studies, including ICP Hub Hong Kong and OpenChat' },
    ],
    intro: 
      'Dynasty Labs is a Hong Kong firm that helps Web3 companies grow in Asia, through partnerships, ' +
      'community, fundraising and liquidity. I designed and built its one-page website in Webflow, written ' +
      'for founders and investors who need to understand the firm in a single scroll.',
    scenes: {
      hero: { mockup: 'dynasty-hero', caption: 'The homepage, above Victoria Harbour' },
      pair: [
        { mockup: 'dynasty-services', caption: 'Six services, in a Sheung Wan café' },
        { mockup: 'dynasty-portfolio', caption: 'The portfolio, at a rooftop event' },
      ],
    },
    approach: [
      'Founders and investors give a firm like this a few seconds. The page opens with what Dynasty Labs ' +
      'does, accelerating the growth of Web3 projects from Hong Kong, then three cards for the ways it ' +
      'helps: partnerships, go-to-market and community growth.',

      'Six services follow as a simple grid, each with one line on what it means for a project. The ' +
      'portfolio then shows real work, such as running ICP Hub Hong Kong and supporting OpenChat, with the ' +
      'activities behind each one.',

      'Every section leads to the same next step, a discovery call, the firm’s deck or its partner network. ' +
      'I built it in Webflow so the team could update its positioning and portfolio without changing the design.',
    ],
    outcome: 
      'The page became Dynasty Labs’ main website for founder and investor conversations. The original ' +
      'domain has since lapsed, so the case study includes a recorded walkthrough of the finished build.',
    highlights: [
      { label: 'Understood in one scroll', text: 'What the firm does, how it helps and its proof all fit on one page.' },
      { label: 'Real portfolio work', text: 'Case studies show the activities behind each partnership, not just logos.' },
      { label: 'One next step', text: 'Every section leads to a call, the deck or the partner network.' },
    ],
  },
]

/** Products lead: they are the evidence for product and front-end roles. */
export const PROJECTS = [...PRODUCTS, ...WEBSITES]

/** Next published project, skipping drafts. */
export const nextOf = (slug) => {
  const live = PROJECTS.filter((p) => !p.draft)
  const i = live.findIndex((p) => p.slug === slug)
  return live[(i + 1) % live.length]
}
