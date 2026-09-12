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
 * Copy rules, same as content/about.mjs. Two that matter most here:
 *
 *   1. Every number states whose it is and what it measures. A figure that
 *      belongs to the client's platform is written as the client's, with the
 *      timeframe or the source attached. Nothing implies the website caused a
 *      business result unless there is something to point at.
 *   2. Six case studies must not share one argumentative shape. "The audience
 *      is X, so I did Y, which means Z" reads as a template by the third page.
 */

export const PROJECTS = [
  {
    slug: 'africa-blockchain-festival',
    seoTitle: 'Event website design & WordPress build | Sammiee',
    seoDescription: 'Website design and WordPress development for Africa Blockchain Festival, including separate sponsor and ticket journeys, multilingual content and an event management dashboard.',
    name: 'Africa Blockchain Festival',
    title: 'Africa Blockchain Festival 2026',
    colour: '#0895fa',
    live: 'https://africablockchainfestival.com/',
    liveLabel: 'africablockchainfestival.com',
    year: '2025–2026',
    client: 'Africa Blockchain Festival · World Token Summit',
    location: 'Nairobi, Kenya',
    services: ['Web Design', 'Product Design', 'WordPress Development', 'Full-stack Development'],
    stack: ['Figma', 'WordPress', 'Next.js', 'TypeScript', 'Supabase'],
    card: 'abf',
    shots: { desktop: 4, mobile: 5 },
    metrics: [
      { value: '~$100K', label: 'in sponsorship reported by the organisers for the 2025 edition' },
      { value: '2 editions', label: 'designed and built: 2025, then retained for 2026' },
      { value: '3 languages', label: 'English, French and Swahili, from one set of templates' },
    ],
    intro:
      'Africa Blockchain Festival brings policymakers, investors, founders and developers ' +
      'together in Nairobi. I designed and built the public website for the 2025 edition, then ' +
      'returned for 2026. The site supports ticket sales, sponsorship outreach and the event ' +
      'team’s day-to-day publishing.',
    approach: [
      'The launch date could not move, so I completed the page structure, responsive layouts ' +
      'and important states in Figma before development began. That gave the team a clear view ' +
      'of the site early and reduced changes during the build.',

      'Sponsors and attendees needed different information. The sponsor route focuses on ' +
      'audience, previous partners and commercial opportunities. The ticket route focuses on ' +
      'the programme, access levels, travel and payment. Both routes remain visible without ' +
      'competing for the same call to action.',

      'I built the main site in WordPress around the festival’s content. The team can update ' +
      'speakers, sponsors, ticket tiers, travel information and translations without editing ' +
      'templates.',
    ],
    outcome:
      'I was retained for the 2026 edition after the first launch. The organisers report that ' +
      'the 2025 edition secured close to $100,000 in sponsorship, with the website used during ' +
      'partner outreach. The same content structure now supports a second campaign.',
    highlights: [
      { label: 'Separate journeys', text: 'Sponsor information and ticket sales have distinct routes through the site.' },
      { label: 'Three languages', text: 'English, French and Swahili content uses the same page templates.' },
      { label: 'Easy to update', text: 'The event team manages speakers, partners, ticket tiers and travel content in WordPress.' },
    ],
    // Second and third acts inside the same case, not separate cases. The
    // marketing site, the thing that takes the money and the tool the team runs
    // it from are one engagement, and splitting them into separate cards read
    // as the same client listed three times.
    //
    // `id` is the shot prefix, so frames land as <slug>-<id>-N and never
    // collide with the main page's -desktop-N slices.
    chapters: [{
      id: 'flow',
      title: 'The ticketing flow',
      live: 'https://africablockchainfestival.com/get-ticket/',
      intro:
        'The ticket journey covers selection, registration, payment and travel. I planned the ' +
        'sequence before designing the screens, then kept the calls to action and page states ' +
        'consistent from one step to the next.',
      body: [
        'Passes are presented by level of access, which makes the difference between workshop, ' +
        'general and VIP options easier to compare. One recommended option is visually ' +
        'prominent, while sponsorship remains available as a separate route.',

        'The payment page also handles the case where someone arrives without choosing a pass. ' +
        'It explains that no charge has been made and sends the visitor back to ticket selection ' +
        'instead of leaving them at an error.',
      ],
      steps: [
        { path: '/get-ticket/', label: 'Ticket selection', at: 0.28 },
        { path: '/register/', label: 'Registration' },
        { path: '/pay/', label: 'Payment' },
        { path: '/travel/', label: 'Travel packages' },
      ],
    }, {
      id: 'admin',
      title: 'The admin behind it',
      host: 'abfadmin.com',
      intro:
        'I also built a separate event dashboard with Next.js, TypeScript and Supabase. It ' +
        'brings registrations, payment data, campaign links, coupons and engineering requests ' +
        'into one place for the event team.',
      body: [
        'Google Sheets remains the team’s source of truth. The dashboard synchronises those ' +
        'records and shows whether each source is up to date. Edited rows update, deleted rows ' +
        'are retained as inactive records and restored rows are not duplicated.',

        'Campaign reporting follows individual share links through to checkout and payment. ' +
        'That lets the team compare the links given to different partners instead of relying ' +
        'only on broad channel labels.',

        'Coupon values are set on the server and redemptions are counted only after payment. ' +
        'Loading states are included on each route so slower services do not make the ' +
        'application appear frozen.',

        'The screens below run on the application’s own preview data rather than live festival ' +
        'figures, because the dashboard sits behind a login and holds real registrant details.',
      ],
      // Behind a login, so these are rendered from the app's built-in preview
      // mode rather than captured from production. That also keeps real
      // registrant names and addresses out of a public case study.
      frames: [
        { label: 'Overview', url: 'abfadmin.com' },
        { label: 'Campaign attribution', url: 'abfadmin.com/campaigns' },
        { label: 'Coupons', url: 'abfadmin.com/coupons' },
        { label: 'Engineering requests', url: 'abfadmin.com/engineering' },
      ],
    }],
  },

  {
    slug: 'bmoni',
    seoTitle: 'Fintech website design & WordPress build | Sammiee',
    seoDescription: 'Product design and WordPress development for BMONI, a cross-border neobank serving Nigeria and Mexico.',
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
      { value: '$1B+', label: 'processed by the BMONI platform after the website launched' },
      { value: '~100K', label: 'daily visits reported for the website' },
      { value: '2 markets', label: 'Nigeria and Mexico, from one set of templates' },
    ],
    intro:
      'BMONI is a cross-border neobank serving customers in Nigeria and Mexico. I designed and ' +
      'built the marketing website in 2025. The platform later reported more than $1 billion in ' +
      'processed transactions, and the website receives roughly 100,000 visits a day.',
    approach: [
      'The site needed to feel modern without making money management look casual. I used real ' +
      'product screens throughout the page, so visitors could see the accounts, transfers and ' +
      'currency features instead of relying on illustrations or broad claims.',

      'The page is organised around four reasons to switch: fees, availability, currencies and ' +
      'cross-border access. A market switch appears near the top because the product and offer ' +
      'differ between Nigeria and Mexico.',

      'I built each section as a reusable WordPress block. When BMONI added a second market, ' +
      'the team could assemble the page from the same system instead of starting another ' +
      'website from scratch.',
    ],
    outcome:
      'The block system supported the launch of a second market without a separate redesign. It ' +
      'also gives BMONI a consistent way to publish new product and campaign pages as the ' +
      'service grows.',
    highlights: [
      { label: 'Product on the page', text: 'Real interface screens explain how BMONI works.' },
      { label: 'Two markets', text: 'Nigeria and Mexico use one flexible set of page templates.' },
      { label: 'Reusable blocks', text: 'New pages can be assembled from existing WordPress sections.' },
    ],
  },

  {
    slug: 'icp-hub-kenya',
    seoTitle: 'Web3 education site design & Webflow build | Sammiee',
    seoDescription: 'Website and Webflow build for ICP Hub Kenya, with clear routes for developers, students and ecosystem partners.',
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
      'ICP Hub Kenya supports the Internet Computer developer community in East Africa. I ' +
      'designed the website for developers, students and potential partners, then built it in ' +
      'Webflow so the local team could manage events, programmes and community updates.',
    approach: [
      'I mapped the three main audiences before designing the page. Developers could find grants ' +
      'and technical resources; students could find events and learning programmes; partners ' +
      'could see the hub’s work and ways to get involved.',

      'The visual direction combines the Internet Computer brand with photography from the local ' +
      'community. The result feels connected to the wider ecosystem without losing its Nairobi ' +
      'identity.',

      'I created Webflow CMS collections for events, programmes and news, then handed the site ' +
      'over to the team. They could keep publishing without waiting for a developer.',
    ],
    outcome:
      'The site supported outreach to developers, universities, sponsors and ecosystem partners ' +
      'during my time with the hub. The original domain has since lapsed, so the case study ' +
      'includes a recorded walkthrough of the finished build.',
    highlights: [
      { label: 'Clear audience routes', text: 'Developers, students and partners can find the information meant for them.' },
      { label: 'Grants are visible', text: 'Funding opportunities are available from the main journey instead of being buried in navigation.' },
      { label: 'Team managed', text: 'Webflow CMS lets the hub publish events and programme updates independently.' },
    ],
  },

  {
    slug: 'ethsafari',
    seoTitle: 'Conference website design & WordPress build | Sammiee',
    seoDescription: 'Art direction, website design and WordPress development for ETHSafari, a nine-day Ethereum event travelling from Nairobi to Kilifi.',
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
      { value: '3,000+', label: 'attendees at the most recent edition, reported by the organisers' },
      { value: '150+', label: 'speakers across nine days, Nairobi to the coast' },
      { value: '5 years', label: 'of past editions kept live in the schedule archive' },
    ],
    intro:
      'ETHSafari is a nine-day Ethereum event that moves from Nairobi to the Kenyan coast. The ' +
      'latest edition brought together more than 3,000 attendees, 150 speakers and 80 ' +
      'companies. I designed the event website and built it in WordPress.',
    approach: [
      'I moved away from the dark, neon look common to crypto conferences. The site uses a light ' +
      'background, large type, route coordinates and the event’s own humour. It feels like ' +
      'ETHSafari rather than a reusable conference theme.',

      'The journey from Nairobi to Kilifi shapes the page. Visitors see the dates and route ' +
      'first, then the programme, tickets and previous editions. The archive covers five years, ' +
      'which gives new attendees useful context before they book.',

      'Speakers, schedules, side events and vendor applications are managed in WordPress. The ' +
      'organisers can update information quickly during the final weeks before the event.',
    ],
    outcome:
      'The site gives ETHSafari a recognisable voice while handling tickets, applications and a ' +
      'programme that changes frequently before opening day.',
    highlights: [
      { label: 'The route leads', text: 'Nairobi to Kilifi provides the structure for the page and the event programme.' },
      { label: 'Five years of editions', text: 'Previous programmes remain available for new attendees and partners.' },
      { label: 'Built for updates', text: 'The team manages speakers, schedules, side events and applications in WordPress.' },
    ],
  },

  {
    slug: 'smartdev-studios',
    seoTitle: 'Agency website design & Webflow build | Sammiee',
    seoDescription: 'Website design and Webflow development for SmartDev Studios, explaining its blockchain development services to founders and non-technical buyers.',
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
      { value: '4 services', label: 'smart contracts, DeFi, NFT platforms and audits, described for a non-technical buyer' },
      { value: 'Webflow', label: 'designed and built, responsive across three breakpoints' },
    ],
    intro:
      'SmartDev Studios builds blockchain products, including smart contracts, DeFi ' +
      'applications, NFT platforms and audits. I designed and built a Webflow site that ' +
      'explains those services to founders who may not have a technical background.',
    approach: [
      'The opening section says what the studio builds and who it works with. Each service then ' +
      'explains the kind of problem it solves, helping a founder compare the offer without first ' +
      'learning the technical vocabulary.',

      'I used a simple dark interface, clear type and restrained motion. Desktop, tablet and ' +
      'mobile layouts were designed together so the hierarchy remained clear on smaller screens.',

      'The site was built in Webflow, allowing the team to edit service descriptions as its ' +
      'offer changed.',
    ],
    outcome:
      'SmartDev used the site in outreach and for inbound enquiries. The original domain has ' +
      'since lapsed, so the case study includes a recorded walkthrough of the completed build.',
    highlights: [
      { label: 'Clear opening', text: 'Visitors can quickly see what the studio builds and who it works with.' },
      { label: 'Plain service descriptions', text: 'Technical services are explained in language a founder can use.' },
      { label: 'Responsive by design', text: 'Desktop, tablet and mobile layouts were planned together.' },
    ],
  },

  {
    slug: 'dynasty-labs',
    seoTitle: 'Web3 venture site design & Webflow build | Sammiee',
    seoDescription: 'One-page website design and Webflow development for Dynasty Labs, a Hong Kong growth firm working with Web3 companies.',
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
      { value: 'One page', label: 'covering community, partnerships, liquidity support and investor access' },
      { value: 'Webflow', label: 'designed and built as a single scroll narrative' },
    ],
    intro:
      'Dynasty Labs is a Hong Kong growth firm for Web3 companies. I designed and built a ' +
      'one-page Webflow site covering community, partnerships, liquidity support and investor ' +
      'access.',
    approach: [
      'The page opens with the firm’s offer, then gives each of its four services a clear ' +
      'section. I removed content that repeated the same promise so a founder could understand ' +
      'the business in one pass.',

      'The layout is designed for scrolling, with each section leading naturally to the enquiry ' +
      'form. The visual style stays dark and restrained, leaving the offer and client ' +
      'conversations to do the work.',

      'I built the site in Webflow so the team could update its positioning and service copy ' +
      'without changing the design.',
    ],
    outcome:
      'The finished page became the firm’s main website for founder and investor conversations. ' +
      'The original domain has since lapsed, so the case study includes a recorded walkthrough ' +
      'of the completed build.',
    highlights: [
      { label: 'One clear offer', text: 'The four services support a single explanation of what Dynasty Labs does.' },
      { label: 'Easy to scan', text: 'The page still makes sense when read quickly on a phone.' },
      { label: 'Simple to update', text: 'The team can change service and positioning copy in Webflow.' },
    ],
  },
]

export const nextOf = (slug) => {
  const i = PROJECTS.findIndex((p) => p.slug === slug)
  return PROJECTS[(i + 1) % PROJECTS.length]
}
