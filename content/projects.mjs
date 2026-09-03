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
 */

export const PROJECTS = [
  {
    slug: 'africa-blockchain-festival',
    name: 'Africa Blockchain Festival',
    title: 'Africa Blockchain Festival 2026',
    colour: '#0895fa',
    live: 'https://africablockchainfestival.com/',
    liveLabel: 'africablockchainfestival.com',
    year: '2025–2026',
    client: 'Africa Blockchain Festival · World Token Summit',
    location: 'Nairobi, Kenya',
    services: ['Web Design', 'Product Design', 'WordPress Development'],
    stack: ['Figma', 'WordPress'],
    card: 'abf',
    shots: { desktop: 4, mobile: 5 },
    metrics: [
      { value: '~$100K', label: 'in sponsorship secured for the edition the site launched' },
      { value: '3,000+', label: 'attendees across policy, capital and builder tracks' },
      { value: '2 editions', label: 'designed and shipped — 2025, then retained for 2026' },
    ],
    intro:
      'Africa’s largest blockchain festival and tokenisation summit. Three days at the Sarit ' +
      'Expo Centre in Nairobi — and the page every sponsor, policymaker and investor works ' +
      'through before they commit budget.',
    approach: [
      'I designed the site end to end in Figma before any code existed — every section, every ' +
      'breakpoint, every state. Against a fixed event date that mattered more than usual: it ' +
      'moved the hard conversations to the design phase and kept the build from being ' +
      'renegotiated halfway through.',
      'The commercial problem was that a $50 attendee and a $25,000 sponsor are not the same ' +
      'visitor, and a single ticket funnel serves neither well. So the sponsor path runs ' +
      'separately from the ticket path, with its own proof — audience numbers, past partners, ' +
      'and the deal context a sponsorship lead actually needs before taking a call.',
      'The build is WordPress, mapped onto the festival’s own content model rather than a theme. ' +
      'Speakers, sponsors, ticket tiers, travel guides and three languages are all editable by ' +
      'the team, so a campaign that runs for months does not queue behind a developer.',
    ],
    outcome:
      'The edition secured close to $100,000 in sponsorship, with the site working as the ' +
      'primary pitch surface for partners evaluating the event. On the strength of it I was ' +
      'retained to design the 2026 edition, which now runs on the same content model — the team ' +
      'has taken it through a full campaign cycle without opening a code editor.',
    highlights: [
      { label: 'Two funnels', text: 'Sponsors and ticket buyers get separate routes, because they are buying different things.' },
      { label: 'Three languages', text: 'English, French and Swahili from one set of templates.' },
      { label: 'Client-owned', text: 'Speakers, tiers and partners are all editable without a developer.' },
    ],
  },

  {
    slug: 'bmoni',
    name: 'BMONI',
    title: 'BMONI — like your bank, but smarter',
    colour: '#e879f9',
    live: 'https://bmoni.com/',
    liveLabel: 'bmoni.com',
    // The site has been redesigned since this build, so the button would send
    // people to someone else's work. Not `live: null` — that would print the
    // "no longer online" note, and bmoni.com is very much online.
    hideLive: true,
    year: '2025',
    client: 'BMONI',
    location: 'Nigeria · Mexico',
    services: ['Product Design', 'Web Design', 'WordPress Development'],
    stack: ['Figma', 'WordPress'],
    card: 'bmoni',
    shots: { desktop: 4, mobile: 0 },
    metrics: [
      { value: '$1B+', label: 'in transactions processed on the platform this fronted' },
      { value: '~100K', label: 'visitors a day — the highest-traffic surface BMONI owns' },
      { value: '2 markets', label: 'live at launch, Nigeria and Mexico, from one template set' },
    ],
    intro:
      'A cross-border neobank running on stablecoin rails, live in Nigeria and Mexico. The site ' +
      'is the front door to a platform that has since processed over $1 billion in transactions ' +
      'and takes roughly 100,000 visitors a day.',
    approach: [
      'Fintech sites fail in one of two directions — so buttoned-up they read as a legacy ' +
      'institution nobody under forty wants, or so playful nobody trusts them with money. I ' +
      'designed BMONI in Figma around the product itself: real app screens, at real scale, doing ' +
      'recognisable things. The interface carries the credibility, so the copy does not have to ' +
      'oversell.',
      'Structure follows the decision a switcher actually makes. Four claims — no abusive fees, ' +
      'open 24/7, multi-currency, borderless — each earn a section instead of being flattened ' +
      'into a feature grid, and the market switch sits above the fold because the audience is ' +
      'split across two continents.',
      'Built in WordPress with every section as a reusable block. That was a deliberate call for ' +
      'a company opening one market at a time: new regions are assembled from existing parts ' +
      'rather than commissioned as new design work.',
    ],
    outcome:
      'At roughly 100,000 visitors a day this is the busiest thing BMONI owns, and it holds up ' +
      'at that volume. The block library has since carried a second market live without ' +
      'additional design work — which is the return the modular build was there to earn.',
    highlights: [
      { label: 'Product-led', text: 'Real interface screens carry the argument instead of stock illustration.' },
      { label: 'Market switch', text: 'Nigeria and Mexico surfaced up front, since the audience is split.' },
      { label: 'Built to extend', text: 'Sections are blocks, so a new market is assembly rather than a redesign.' },
    ],
  },

  {
    slug: 'icp-hub-kenya',
    name: 'ICP Hub Kenya',
    title: 'ICP Hub Kenya',
    colour: '#a855f7',
    live: null,
    liveLabel: 'icphubkenya.io',
    videoUrl: 'https://sammyfash.com/wp-content/uploads/2025/05/ICP-HubKenya.mp4',
    year: '2025',
    client: 'ICP Hub Kenya · DFINITY ecosystem',
    location: 'Nairobi, Kenya',
    services: ['UI/UX Design', 'Web Design', 'Webflow Development'],
    stack: ['Figma', 'Webflow'],
    card: 'icp-kenya',
    video: 'icp-hub-kenya',
    shots: { desktop: 0, mobile: 0 },
    metrics: [
      { value: '3 audiences', label: 'developers, students and partners, each with a route in' },
      { value: 'Webflow', label: 'designed and built, then handed over for the team to run' },
    ],
    intro:
      'The regional hub for the Internet Computer in East Africa. It had to read as locally ' +
      'rooted to a Nairobi developer and as globally credible to the DFINITY ecosystem funding ' +
      'them — at the same time, on the same page.',
    approach: [
      'I mapped the journeys before drawing anything, because three audiences arrive here wanting ' +
      'different things: developers looking for grants and docs, students looking for events, ' +
      'partners looking for proof. Trying to serve all three with one hero is how these sites ' +
      'usually fail, so Events, Community, Grants and Learn ICP each got their own way in.',
      'The visual direction holds clean whitespace and an ICP-aligned futurism against vibrant ' +
      'local photography, so the page never reads as a global template dropped onto a region. ' +
      'Calls to action are placed against intent rather than repeated — newsletter, developer ' +
      'onboarding, event RSVP, grant application.',
      'Built in Webflow so a small team could keep publishing events and cohort news without ' +
      'engineering time, and handed over with the CMS collections structured for them to extend.',
    ],
    outcome:
      'A regionally tailored site that positions Kenya as a strategic hub inside the global ' +
      'ecosystem, used in outreach to investors, sponsors and university partners. The build ' +
      'video below is the full walkthrough — the domain has since lapsed, but the work stands.',
    highlights: [
      { label: 'Three audiences', text: 'Developers, students and partners each get their own route through one page.' },
      { label: 'Grants path', text: 'Applications surfaced as a first-class action, not buried in a menu.' },
      { label: 'Handed over', text: 'CMS collections structured so the team publishes without a developer.' },
    ],
  },

  {
    slug: 'ethsafari',
    name: 'ETHSafari',
    title: 'ETHSafari — the watering hole for web3',
    colour: '#22c55e',
    live: 'https://ethsafari.xyz/',
    liveLabel: 'ethsafari.xyz',
    year: '2026',
    client: 'ETHSafari',
    location: 'Nairobi → Kilifi, Kenya',
    services: ['Web Design', 'Art Direction', 'WordPress Development'],
    stack: ['Figma', 'WordPress'],
    card: 'ethsafari',
    shots: { desktop: 4, mobile: 5 },
    metrics: [
      { value: '3,000+', label: 'attendees at the most recent edition' },
      { value: '150+', label: 'speakers across nine days, Nairobi to the coast' },
      { value: '80+', label: 'companies and 50+ press covering the week' },
    ],
    intro:
      'Africa’s flagship Ethereum and web3 celebration, and one of the largest Ethereum events ' +
      'on the continent — nine days moving from Nairobi to the Kilifi coast, drawing 3,000+ ' +
      'attendees, 150+ speakers and 80+ companies.',
    approach: [
      'Most crypto event sites are dark, neon and interchangeable, which is a positioning problem ' +
      'before it is a design one: if you look like every other conference, you are one. ETHSafari ' +
      'went the other way — light ground, heavy display type, and a ticker of coordinates and ' +
      'in-jokes running through the page. “GAS: LOW · VIBES: HIGH” is on the site because it is ' +
      'the register the community actually speaks in.',
      'The structure follows the journey rather than the org chart: dates, then route, then ' +
      'edition. Nairobi to Kilifi is the spine of the layout the same way it is the spine of the ' +
      'programme, and the schedule archive carries five years of editions so a first-time ' +
      'attendee can see what they are buying into.',
      'Designed in Figma and built in WordPress against a content model the organisers run ' +
      'themselves — speakers, schedule, side events and vendor applications all move fast in the ' +
      'weeks before an event, and none of that should need a developer.',
    ],
    outcome:
      'An event site with a voice the community quotes back, still doing the unglamorous work of ' +
      'moving 3,000+ people through tickets, applications and a nine-day schedule that changes ' +
      'weekly right up to the doors opening.',
    highlights: [
      { label: 'Route as structure', text: 'Nairobi → Kilifi organises the page the way it organises the week.' },
      { label: 'Five-year archive', text: 'Past editions kept live, so newcomers can see the track record.' },
      { label: 'Light on purpose', text: 'A deliberate break from the dark-neon default of the category.' },
    ],
  },

  {
    slug: 'smartdev-studios',
    name: 'SmartDev Studios',
    title: 'SmartDev Studios',
    colour: '#fb923c',
    live: null,
    liveLabel: 'smart-devstudios.com',
    videoUrl: 'https://sammyfash.com/wp-content/uploads/2025/04/DEVSHOP.mp4',
    year: '2025',
    client: 'SmartDev Studios',
    location: 'Remote',
    services: ['UI/UX Design', 'Web Design', 'Webflow Development'],
    stack: ['Figma', 'Webflow'],
    card: 'blockchain-solutions',
    video: 'smartdev-studios',
    shots: { desktop: 0, mobile: 0 },
    metrics: [
      { value: '5 seconds', label: 'to communicate what they do and why to trust them' },
      { value: 'Webflow', label: 'designed and built, responsive across three breakpoints' },
    ],
    intro:
      'A Web3-native development studio — smart contracts, DeFi, NFTs, audits. The entire job ' +
      'was making deep technical capability legible to a founder deciding who to trust with ' +
      'their protocol.',
    approach: [
      'Their buyer is often not an engineer. They are a founder with capital and a deadline, ' +
      'scanning for signals of competence. So the site opens with what SmartDev actually does ' +
      'rather than an abstract claim, and the service blocks translate a long technical menu — ' +
      'audits, DApps, DeFi, NFTs — into outcomes a non-engineer can weigh against a budget.',
      'The visual language is minimal and confident: dark ground, strong type hierarchy, ' +
      'restrained iconography, and motion used strictly as a cue toward the next action. Mobile ' +
      'and tablet were designed alongside desktop rather than retrofitted, because more than half ' +
      'the inbound arrives on a phone.',
      'Built in Webflow, which suited a studio that wanted to edit its own service copy as the ' +
      'offer evolved without booking developer time to change a sentence.',
    ],
    outcome:
      'A professional digital face the team now leads with in both cold outreach and inbound, ' +
      'with a markedly shorter path from landing to enquiry. The walkthrough below is the full ' +
      'build — the domain has since lapsed, but the work stands.',
    highlights: [
      { label: 'Five-second test', text: 'What they do, who it is for, and why to trust them — above the fold.' },
      { label: 'Service translation', text: 'Audits, DApps, DeFi and NFTs described in outcomes, not jargon.' },
      { label: 'Motion as cue', text: 'Transitions that point at the next action rather than perform.' },
    ],
  },

  {
    slug: 'dynasty-labs',
    name: 'Dynasty Labs',
    title: 'Dynasty Labs',
    colour: '#22d3ee',
    live: null,
    liveLabel: 'dynasty-labs.io',
    videoUrl: 'https://sammyfash.com/wp-content/uploads/2025/05/DynastyLabs-lg.mp4',
    year: '2025',
    client: 'Dynasty Labs',
    location: 'Hong Kong',
    services: ['UI/UX Design', 'Landing Page', 'Webflow Development'],
    stack: ['Figma', 'Webflow'],
    card: 'dynasty-labs',
    video: 'dynasty-labs',
    shots: { desktop: 0, mobile: 0 },
    metrics: [
      { value: 'One page', label: 'carrying four service pillars without losing the thread' },
      { value: 'Webflow', label: 'designed and built as a single scroll narrative' },
    ],
    intro:
      'A Hong Kong growth firm for Web3 projects. One page, four pillars, and a founder audience ' +
      'that decides inside a minute whether you are worth a reply.',
    approach: [
      'Everything was pulled toward one sentence — we scale Web3 projects the right way — and any ' +
      'section that did not support it was cut rather than shrunk. Community building, strategic ' +
      'partnerships, liquidity support and investor access each carry one clear block, in the ' +
      'order a founder would ask about them.',
      'It is built as a scroll narrative rather than a stack of panels. Each section hands off to ' +
      'the next, so a founder skimming on a phone at an airport still arrives at the enquiry form ' +
      'with the argument intact. The palette is dark and restrained — the audience reads ' +
      'loudness as inexperience.',
      'Built in Webflow so the firm could move quickly on positioning copy, which for an early ' +
      'growth business changes more often than the design does.',
    ],
    outcome:
      'Measurably clearer to first-time visitors in feedback rounds, and now the firm’s lead ' +
      'asset in investor and founder conversations. The walkthrough below is the full build — ' +
      'the domain has since lapsed, but the work stands.',
    highlights: [
      { label: 'One argument', text: 'Every section supports a single claim, or it was cut.' },
      { label: 'Scroll narrative', text: 'Sections hand off, so a skim still lands the case.' },
      { label: 'Restrained', text: 'A dark, quiet palette for an audience that reads loud as junior.' },
    ],
  },
]

export const nextOf = (slug) => {
  const i = PROJECTS.findIndex((p) => p.slug === slug)
  return PROJECTS[(i + 1) % PROJECTS.length]
}
