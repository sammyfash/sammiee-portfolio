/**
 * Product case studies. Same pipeline as content/projects.mjs, different
 * template: every product page is split into a DESIGN half and a DEVELOPMENT
 * half, behind a switch, so the same page serves a product-design application
 * (/soravya?view=design) and a front-end one (/soravya?view=development).
 *
 *   kind: 'product'           routes the entry to renderProduct() and the
 *                             Product design / Development grid lenses
 *   draft: true               page and card are not published yet (no screens)
 *   shots                     files in assets-src/shots: <slug>-screen-N (laptop),
 *                             <slug>-mobile-N (phone)
 *
 * The copy rules from content/projects.mjs apply, plus one that matters more
 * here because these are team products:
 *
 *   Say what was mine. Soravya was built by two people. Design and the front
 *   end are claimed; the database, tenancy and deployment are credited to the
 *   partner who owned them. A recruiter who opens the repo history should find
 *   exactly what the page says.
 *
 * Every screen is rendered from the product's own synthetic seed — an invented
 * organiser and event (Sahara Collective, Meridian Summit 2026) and generated
 * attendees on example.test addresses — never from a real event's data.
 */

export const PRODUCTS = [
  {
    slug: 'soravya',
    kind: 'product',
    seoTitle: 'Soravya: product design and front-end engineering case study | Sammy Fash',
    seoDescription: 'Soravya is an event management platform for tech conferences and events worldwide. I designed the organiser console and the attendee mobile app, and built the front end of both.',
    name: 'Soravya',
    title: 'Soravya, the event management platform',
    colour: '#6d5ff0',
    live: 'https://soravya.com',
    liveLabel: 'soravya.com',
    year: '2026',
    timeline: { span: 'July to October 2026', weeks: 12 },
    location: 'Nairobi, Kenya · remote',
    role: 'Product design · Front-end engineering',
    team: 'A team of about five people across different fields. I led the product design and the design system, and built the front end of both the console and the app.',
    services: [
      { label: 'Product design', icon: 'pen' },
      { label: 'Design system', icon: 'grid' },
      { label: 'Interaction design', icon: 'cursor' },
      { label: 'Front-end engineering', icon: 'code' },
    ],
    stack: ['Figma', 'Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vitest'],
    card: 'soravya',
    cardAlt: 'The Soravya organiser console on a laptop on a wooden desk',
    cardTag: {
      design: 'Product design · Front-end engineering',
      development: 'Next.js · React · TypeScript',
    },
    cardSize: [1400, 875],

    intro:
      'Soravya is an event management platform for tech conferences and events around the world. ' +
      'Organisers run their entire event from one dashboard, while attendees get the programme, ' +
      'their personal agenda and networking right on their phone. I designed both sides of the ' +
      'product, the Soravya console and the mobile app attendees use at the event, and I built the ' +
      'front end of both.',

    impact: [
      { icon: 'layers', value: '105', unit: 'pages', text: 'designed and built across the organiser console and the attendee app.' },
      { icon: 'gauge', value: '212', unit: 'KB', text: 'is all an attendee’s phone downloads on the first visit, well under the 300 KB limit. If any page goes over that limit, the build stops it from going live.', viz: { used: 212, max: 300 } },
      { icon: 'shield', value: '1,900+', unit: 'tests', text: 'check every release, from accessibility to who is allowed to see what, before anything reaches users.' },
    ],

    hero: { laptop: 'soravya-control', caption: 'Event Control, the overview organisers open first' },

    design: {
      lede:
        'Soravya was built to solve the problems organisers face once ticketing is done: managing ' +
        'attendees and everything else that happens during the event. Organisers often struggle to ' +
        'communicate clearly with attendees, whether that’s a change to the programme, news about a ' +
        'side event, or collecting feedback. They also need to learn about the people attending and ' +
        'help them meet each other, so everyone gets the full value of what they paid for. I mapped ' +
        'out all of these problems and turned them into user personas before the design began. That ' +
        'gave me a clear picture of who I was designing for, what they were struggling with, and how ' +
        'design could solve it.',

      research: {
        title: 'What shaped the product',
        intro: 'Four findings shaped every design and development decision behind Soravya.',
        items: [
          { icon: 'users', title: 'Built for every level of tech experience', text: 'A tech conference brings together developers, investors, policymakers and first-time attendees. I didn’t assume everyone is tech-savvy, so every flow is designed to be easy to understand and use, whatever someone’s experience with digital products.' },
          { icon: 'wifi', title: 'Made for busy venues and weak internet', text: 'People use the app while moving between halls, often on crowded Wi-Fi or a weak mobile signal, and on all kinds of phones. So the app loads quickly, keeps working offline and keeps every screen simple to read at a glance.' },
          { icon: 'scale', title: 'Side events as a core feature', text: 'The competitor platform we reviewed in detail only offered side-event management on its most expensive plan. In Soravya, every organiser gets the full flow, from submission and approval to publishing.' },
          { icon: 'shield', title: 'Privacy and consent from day one', text: 'Networking only works if people trust it. Attendees choose whether they are visible, their contact details stay private until they accept a meeting, and they can opt out at any time.' },
        ],
      },

      personasTitle: 'Who it’s for',
      personasIntro:
        'Soravya is built for everyone involved in running or attending an event. They share the same ' +
        'goal, a successful event, but each needs something different from the product. I grouped ' +
        'them into four types of users.',
      personas: [
        { icon: 'phone', name: 'Attendees', context: 'Join through their invitation email and use Soravya on their phone throughout the event.', jobs: ['Know where to be and when', 'Build a personal agenda', 'Get updates when plans change', 'Connect with the right people, if they choose to'] },
        { icon: 'monitor', name: 'Organisers', context: 'Run the whole event from the console, usually on a laptop and sometimes on a tablet at the venue.', jobs: ['Import and invite attendees', 'Build and update the programme', 'Approve side events', 'Track how the event is going'] },
        { icon: 'megaphone', name: 'Comms leads', context: 'Keep attendees informed by sending announcements during the event.', jobs: ['Send updates quickly', 'See who received them'], note: 'They only see what their job needs, which keeps the console simple and attendee data secure.' },
        { icon: 'scan', name: 'Check-in staff', context: 'Welcome attendees at the entrance and check them in as quickly as possible.', jobs: ['Scan a pass or enter its code', 'Find attendees without a pass', 'Print badges on the spot'] },
      ],

      principlesTitle: 'The principles behind every decision',
      principlesIntro: 'I set these five rules before designing any screens, and used them to settle decisions throughout the project.',
      principles: [
        { title: 'Show only what’s real', text: 'No placeholder numbers or unfinished features presented as finished. When there is no data yet, the screen says so clearly.' },
        { title: 'Prioritise the attendee', text: 'Attendee screens are seen by thousands of people at every event, so they received the most design attention.' },
        { title: 'Keep screens focused', text: 'People use Soravya while busy, so every element on a screen has to earn its place.' },
        { title: 'Always have a fallback', text: 'If the internet drops or a service fails, people see a clear message and a way forward, never a blank screen.' },
        { title: 'Respect people’s choices', text: 'No one’s details are shared without their permission, and opting out takes effect within a minute.' },
      ],

      ia: {
        title: 'How the product is organised',
        intro:
          'Organisers move around the console with a side menu grouped by the tasks they do. ' +
          'Attendees use five tabs at the bottom of the app that follow the same structure. When an ' +
          'organiser turns a feature off, it disappears from the app completely instead of showing as ' +
          'a disabled button.',
        console: ['Event Control', 'Programme', 'Check-in', 'Sponsors & partners', 'Audience', 'Announcements', 'Networking', 'Insight', 'Settings'],
        attendee: ['Home', 'Program', 'People', 'Meetings', 'Profile'],
        rail: 'soravya-rail',
        tabbar: 'soravya-tabbar',
      },

      screensTitle: 'Key screens in the console',
      screensIntro: 'Six of the most important screens, and the design thinking behind each one.',
      screens: [
        {
          title: 'Event Control: everything that needs attention, in one place',
          body: [
            'The first version of the event home page was a list of eleven links. It showed organisers ' +
            'where they could go, but not what needed their attention. I moved the navigation into the ' +
            'side menu and redesigned the page as Event Control, a single overview of attendee numbers, ' +
            'sign-up progress, check-ins and anything waiting for a decision.',
            'Each section only appears if the person’s role allows them to act on it, so nobody sees ' +
            'cards they can’t use.',
          ],
          mockup: 'soravya-control',
          caption: 'Event Control, the first screen organisers see.',
        },
        {
          title: 'Insight: data that is easy to read',
          body: [
            'Colours in the charts carry meaning. The sign-up funnel moves from grey to amber to blue to ' +
            'green as people get closer to a complete profile. Programme tracks share one purple colour ' +
            'family because no track is more important than another, and red is only ever used for errors.',
            'Insight shows totals but never names individuals. Any group smaller than ten people shows ' +
            'as “<10”, so nobody can be identified from the numbers.',
          ],
          mockup: 'soravya-insight',
          caption: 'Insight, showing how the event is performing.',
        },
        {
          title: 'Programme: clear warnings when something is wrong',
          body: [
            'Most buttons are kept neutral so that only one action stands out on each screen. When ' +
            'something needs attention, such as two sessions booked into the same room, the organiser ' +
            'sees a clear notice explaining the problem.',
          ],
          mockup: 'soravya-programme',
          caption: 'The programme builder flagging a room clash.',
        },
        {
          title: 'Experiences: managing side events step by step',
          body: [
            'Side events move from submitted to approved to published in one table, with capacity ' +
            'tracked along the way. Every status is written in words, like “Awaiting approval” or “Live ' +
            'to attendees”, so organisers never have to guess what a colour means.',
          ],
          mockup: 'soravya-experiences',
          caption: 'Experiences, with one side event waiting for approval.',
        },
        {
          title: 'Announcements: reaching the right people',
          body: [
            'Organisers can write an announcement without leaving Event Control. Before sending, ' +
            'they choose who receives it, how urgent it is, and whether it goes to the event ' +
            'workspace, by email, or both.',
            'Every announcement is reviewed before it goes out, so nothing reaches thousands of ' +
            'attendees by accident.',
          ],
          mockup: 'soravya-compose',
          caption: 'Writing an announcement from Event Control.',
        },
        {
          title: 'Moderation: keeping networking safe',
          body: [
            'When an attendee reports someone, the report goes into a moderation queue with a clear ' +
            'response target: 20 minutes for harassment and 2 hours for anything else. Reports that ' +
            'miss their target move to the top, so nothing is forgotten.',
            'If something serious happens, organisers can pause all networking at the event ' +
            'immediately, while the programme and agendas keep working as normal.',
          ],
          mockup: 'soravya-moderation',
          caption: 'The moderation queue, with reports waiting for a decision.',
        },
      ],

      phones: {
        title: 'The attendee app 📱',
        body:
          'This is the part of Soravya that every attendee uses, so it received the most attention. ' +
          'The home screen shows today’s agenda and side events. The programme can be filtered by day ' +
          'and track, and any session can be saved in one tap. The People tab suggests who to meet and ' +
          'explains why in plain words, such as “You both listed fintech and settlement”. Once both ' +
          'people agree to meet, the meeting appears with its time and place, and only then are ' +
          'contact details shared. The event pass is always one tap away for check-in.',
        items: [
          { mockup: 'soravya-home', caption: 'Home: today’s agenda and side events' },
          { mockup: 'soravya-program', caption: 'The programme, filtered by day and track' },
          { mockup: 'soravya-session', caption: 'Session details, saved in one tap' },
          { mockup: 'soravya-experiences-phone', caption: 'Side events around the main event' },
          { mockup: 'soravya-people', caption: 'People: suggestions with clear reasons' },
          { mockup: 'soravya-meetings', caption: 'Meetings, confirmed with time and place' },
          { mockup: 'soravya-profile', caption: 'Profile and settings in one menu' },
          { mockup: 'soravya-pass', caption: 'The event pass, ready to scan at the door' },
        ],
      },

      system: {
        title: 'The design system',
        body:
          'Design systems that only live in Figma tend to drift away from the real product over time. ' +
          'To avoid that, I built Soravya’s design system directly into the code. Every component uses ' +
          'named colour tokens, and the build fails if anyone uses a colour outside the system. ' +
          'Organisers can add their own brand colour, but Soravya checks that it is readable before ' +
          'saving it.',
        swatches: [
          { name: 'Accent', value: '#5b4fd6', note: '5.92:1 contrast on white' },
          { name: 'Ink', value: '#16121c', note: 'text and main buttons' },
          { name: 'Roster', value: '#7e828e', note: 'funnel, step 1' },
          { name: 'Invited', value: '#e99449', note: 'funnel, step 2' },
          { name: 'Activated', value: '#2e6fd9', note: 'funnel, step 3' },
          { name: 'Complete', value: '#1e8e52', note: 'funnel, final step' },
        ],
        type: {
          family: 'Hanken Grotesk',
          note: 'A single, self-hosted typeface. The original display font was replaced when its licence turned out to cover desktop use only, which meant it could not be used on the live product.',
        },
        componentsLabel: 'Components from the live product',
        components: [
          { img: 'soravya-kpi', label: 'KPI tile', w: 362, h: 330 },
          { img: 'soravya-funnel-card', label: 'Funnel chart', w: 1400, h: 488, wide: true },
          { img: 'soravya-decision', label: 'Decision card', w: 834, h: 426 },
          { img: 'soravya-person', label: 'People card', w: 1050, h: 480 },
          { img: 'soravya-pass', label: 'Event pass', w: 960, h: 546 },
          { img: 'soravya-experience', label: 'Experience card', w: 1050, h: 855 },
        ],
        rulesLabel: 'Standards every screen meets',
        rules: [
          'A loading, empty, error and offline state for every screen',
          'Colour is never the only way information is shown',
          'Text contrast of at least 4.5:1',
          'Light, dark and system themes',
          'Short, clear interface text of no more than 14 words per sentence',
        ],
      },

      timelineTitle: 'Project timeline',
      timelineIntro: 'Twelve weeks from the first prototype to a live event.',
      timeline: [
        { date: '28 Jul', text: 'Work begins, starting from a concept prototype in Figma.' },
        { date: '24 Aug', text: 'The final “Event Control” design direction is approved.' },
        { date: '25 Aug', text: 'Light, dark and system themes are added.' },
        { date: '26 Aug', text: 'Hanken Grotesk becomes the single typeface.' },
        { date: '27 Aug', text: 'The target audience is confirmed: tech conferences of 1,000 to 5,000 people.' },
        { date: '15 Sep', text: 'The design system is brought into the native attendee app.' },
        { date: '15–17 Oct', text: 'Africa Blockchain Festival 2026 runs its attendee app on Soravya. 🎉' },
      ],
    },

    development: {
      lede:
        'On the development side, I built the front end of both the console and the attendee app. ' +
        'The console is a Next.js 16 application made mostly of React server components. Pages are ' +
        'rendered on the server, forms send data straight to the server, and each screen keeps its ' +
        'state in the URL. Every page also checks who the user is and what they are allowed to see ' +
        'before showing anything.',

      flowTitle: 'How a console page loads',
      flowIntro: 'The six steps between an organiser opening a page and seeing it. The solid boxes are the parts I built; the dashed boxes were built by other members of the team.',
      flow: [
        { label: 'Browser', sub: 'the organiser opens a page', owner: 'me' },
        { label: 'Server component', sub: 'the page is rendered on the server', owner: 'me' },
        { label: 'Access check', sub: 'organisation, session, role and event', owner: 'me' },
        { label: 'Data loading', sub: 'insight, programme and side events, in parallel', owner: 'me' },
        { label: 'withTenancy()', sub: 'each request limited to one organiser', owner: 'partner' },
        { label: 'Postgres + RLS', sub: 'database security for each organiser', owner: 'partner' },
      ],

      treeTitle: 'Code organised like the product',
      treeIntro:
        'Each folder in the console’s code matches a section in the side menu. This makes it easy for ' +
        'anyone on the team to find the code behind any screen.',
      tree: {
        root: 'src/app/org/[slug]/e/[eventSlug]/',
        items: [
          { name: '(overview)/', note: 'Event Control' },
          { name: 'programme/', note: 'sessions, imports, printing' },
          { name: 'attendees/', note: 'the attendee list' },
          { name: 'experiences/', note: 'side events' },
          { name: 'announcements/', note: 'writing and sending updates' },
          { name: 'insight/', note: 'reports and charts' },
          { name: 'check-in/', note: 'entrance scanning and badges' },
          { name: 'moderation/', note: 'networking reports' },
          { name: 'branding/ · domain/ · features/', note: 'organiser settings' },
          { name: 'roster.csv · .xlsx · .pdf', note: 'downloadable exports', file: true },
        ],
        note: '105 pages and 71 API routes across the whole platform.',
      },

      sections: [
        {
          title: 'Pages that adapt to each user’s role',
          body: [
            'When Event Control loads, it first identifies the organisation, the user’s session, their ' +
            'role and the event. It turns the role into a list of permissions and then loads every card ' +
            'at the same time. If the user doesn’t have permission for a card, that data is never even ' +
            'requested.',
            'The links to a page and the page itself use the same permission check, so a user is never ' +
            'shown a link to something they can’t open.',
          ],
          code: {
            file: 'org/[slug]/e/[eventSlug]/(overview)/page.tsx',
            lines: [
              'const { organization, session, role, event } =',
              '  await organizerRouteContext({ slug, eventSlug });',
              'const can = capabilitiesFor(role);',
              '',
              'const [funnel, delivery, cases, imports] = await Promise.all([',
              "  can.includes('insight.view') ? readFunnel(scope, { since }) : null,",
              "  can.includes('insight.view') ? readAnnouncementDelivery(scope) : null,",
              "  can.includes('event.operate') ? listCases(scope, { status: 'open' }) : [],",
              "  can.includes('memberships.manage') ? listImportBatches(scope) : [],",
              ']);',
            ],
          },
        },
        {
          title: 'Privacy built into the code',
          body: [
            'Reports never show a group of fewer than ten people. Rather than relying on every chart to ' +
            'remember this rule, I created a dedicated data type for people counts. Once a count is ' +
            'hidden, it no longer contains the real number, so it can’t accidentally appear in a log ' +
            'or an export.',
            'A real bug shaped the wording. A hidden percentage once showed as “<10”, which looked like ' +
            '“less than 10%” when the true figure was 100%. Hidden percentages now read “too few to ' +
            'report” instead.',
          ],
          code: {
            file: 'src/insight/count.ts',
            lines: [
              '/** The threshold is the PRD’s. Changing it is a PRD change. */',
              'export const K_FLOOR = 10;',
              '',
              'export type PeopleCount =',
              '  | { readonly shown: true; readonly n: number }',
              '  | { readonly shown: false };',
              '',
              "export const SUPPRESSED = '<10';",
              "export const SUPPRESSED_RATE = 'too few to report';",
            ],
          },
        },
        {
          title: 'Screen state saved in the URL',
          body: [
            'Details like the selected date range, an open announcement form or a step in the setup ' +
            'guide are stored in the page address. This means the page loads in exactly the right state, ' +
            'the back button works as expected, and organisers can share a link to exactly what they are ' +
            'looking at.',
            'Every value in the address is checked before it is used. If something unexpected comes in, ' +
            'the page simply falls back to the default view instead of breaking.',
          ],
          code: {
            file: 'org/[slug]/e/[eventSlug]/(overview)/page.tsx',
            lines: [
              'type Props = {',
              '  params: Promise<{ slug: string; eventSlug: string }>;',
              '  // ?compose=1 opens the announcement sheet; ?step= drives setup.',
              '  searchParams: Promise<Record<string, string | string[] | undefined>>;',
              '};',
              '',
              'const query = flatten(await searchParams); // narrowed once, here',
              'const range = parseRange(query.range);    // unknown → default',
            ],
          },
        },
        {
          title: 'Design rules checked automatically',
          body: [
            'I turned the design system’s rules into automated tests so they can’t be broken by ' +
            'mistake. One test blocks any component that uses a colour outside the system. Another finds ' +
            'styles that are referenced but never defined. A third fails the build if any screen is ' +
            'missing its loading, empty, error or offline state.',
            'This came from experience: early on, the sign-in button went live invisible because it ' +
            'referred to a colour that didn’t exist.',
          ],
          code: {
            file: 'tests/ux/state-matrix.ts',
            lines: [
              'export type StateName =',
              "  'loading' | 'empty' | 'error' | 'offline' | 'permission-denied';",
              '',
              'export type ScreenFamily = {',
              '  name: string;',
              '  states: StateName[];',
              '  // Flipping to true without fixtures fails CI.',
              '  built: boolean;',
              '};',
            ],
          },
        },
        {
          title: 'Fast on any phone, even offline',
          body: [
            'Attendee pages send no client-side JavaScript to the phone, and link prefetching is turned ' +
            'off because it uses up mobile data. A service worker saves the programme and agenda so they ' +
            'can still be read offline, along with a note showing when they were last updated.',
            'After every build, an automatic check measures the size of each page. Any page that hasn’t ' +
            'been categorised gets the strictest limit by default.',
          ],
          code: {
            file: 'scripts/check-bundle-budget.mjs',
            lines: [
              'const BUDGETS = {',
              '  /** UXR-004 first-load budget for attendee-facing routes. */',
              '  attendeeFirstLoadKb: 300,',
              '  organizerFirstLoadKb: 450,',
              '};',
              '// Unclassified routes get the attendee budget: fail safe.',
            ],
          },
        },
      ],

      suitesTitle: 'Testing',
      suitesIntro: 'Four groups of automated tests run on every update, alongside the regular unit tests.',
      suites: [
        { icon: 'shield', title: 'Permissions', text: 'Checks what every role can and cannot do across the platform.' },
        { icon: 'eye', title: 'Accessibility', text: 'Scans the live build for accessibility issues using axe-core.' },
        { icon: 'layers', title: 'Screen states', text: 'Confirms every screen has a loading, empty, error and offline state.' },
        { icon: 'phone', title: 'Mobile usability', text: 'Checks tap target sizes, input zoom, screen edges and that forms keep answers after an error.' },
      ],

      quality: [
        { value: '494', label: 'code changes (commits) in 12 weeks, 342 of them mine' },
        { value: '113', label: 'pull requests reviewed and tested before release' },
        { value: '170', label: 'automated test files' },
      ],

      splitTitle: 'My contribution',
      splitIntro: 'Soravya was built by a team of about five people. This is the part of the work I was responsible for, and the parts handled by the rest of the team.',
      split: {
        mineLabel: 'What I built',
        partnerLabel: 'What the rest of the team built',
        mine: ['The organiser console', 'The attendee app', 'The design system and component library', 'Offline support for attendees', 'The page size checks', 'The accessibility and screen-state tests', 'The audio player for recorded sessions'],
        partner: ['The database and data structure', 'Security and data separation between organisers', 'User authentication', 'Email delivery', 'Hosting and deployment'],
      },
    },

    outcomeLabel: 'The result',
    outcome:
      'Soravya now runs as a complete platform where each organiser has their own web address, ' +
      'email sender, branding and set of features. In October, Africa Blockchain Festival 2026 used it ' +
      'to run its attendee app, and seeing the product I designed support a real festival was a proud ' +
      'moment for me.',
  },

  // FarmHub Agro. Screens are Sammy's set (6 Nov 2026): the dashboard and app
  // from a local copy with invented customers, staff and figures on the real
  // catalogue; the website from the live public site. Sammy's role is design
  // and the front end of all three parts; the page claims nothing beyond that
  // and names no team. Product photos are described as the shop's catalogue.
  {
    slug: 'farmhub',
    kind: 'product',
    seoTitle: 'FarmHub Agro: mobile app design and front-end engineering case study | Sammy Fash',
    seoDescription: 'A customer app for ordering food and regular deliveries, with the staff dashboard that runs it, for FarmHub Agro in Osogbo, Nigeria. I designed both and built their front ends.',
    name: 'FarmHub Agro',
    title: 'FarmHub Agro, a food market’s customer app and the dashboard behind it',
    colour: '#2a7d2e',
    live: 'https://farmhubagro.com',
    liveLabel: 'farmhubagro.com',
    year: '2026',
    timeline: { span: 'July to October 2026', label: '3 months' },
    location: 'Osogbo, Nigeria · remote',
    role: 'Mobile app design · Product design · Front-end engineering',
    team: 'I designed the website order pages, the customer app and the staff dashboard, and built the front end of all three. The server, payments and hosting were outside my part of the work.',
    services: [
      { label: 'Product design', icon: 'pen' },
      { label: 'Design system', icon: 'grid' },
      { label: 'Mobile app design', icon: 'phone' },
      { label: 'Front-end engineering', icon: 'code' },
    ],
    stack: ['Figma', 'React Native', 'Expo', 'TypeScript', 'Laravel', 'WordPress'],
    card: 'farmhub',
    cardAlt: 'The FarmHub Agro customer app on a phone on a kitchen table, with the staff dashboard on a laptop behind it',
    cardTag: {
      design: 'Mobile app design · Front-end engineering',
      development: 'React Native · Expo · Laravel',
    },
    cardSize: [1400, 875],

    intro:
      'FarmHub Agro Services is a food business in Osogbo, Nigeria, that grew from a farm-produce ' +
      'outlet into a full supermarket. I designed its customer app, where people order food and set up ' +
      'regular deliveries, and the staff dashboard that runs the app behind the scenes: prices, stock, ' +
      'orders, riders and reports. I also built the front end of both.',

    impact: [
      { icon: 'layers', value: '3', unit: 'products', text: 'designed and built on one shared set of design tokens: the website order pages, the customer app and the staff dashboard.' },
      { icon: 'users', value: '5', unit: 'home screens', text: 'in the dashboard, one for each kind of staff role, so everyone starts on the work they actually do.' },
      { icon: 'eye', value: '16', unit: 'colour pairs', text: 'checked against WCAG 2.2 AA contrast every time the design tokens change.' },
    ],

    hero: {
      laptop: 'farmhub-hero',
      alt: 'FarmHub Agro: the customer app on a phone, with the staff dashboard on a laptop behind it',
      caption: 'The customer app’s home screen',
    },

    design: {
      lede:
        'FarmHub had grown from three farm products into a supermarket, but the way customers ordered ' +
        'had not changed. The order form on its website listed three products and one delivery option, ' +
        'so most customers sent a WhatsApp message asking whether an item was in stock and how much it ' +
        'cost. Staff answered those messages one at a time, checked bank transfers by hand, and had no ' +
        'single place to see orders, deliveries or stock. I mapped these problems and the people behind ' +
        'them before designing anything, and they shaped every product that followed.',

      research: {
        title: 'What shaped the product',
        intro: 'Four findings shaped the design of the app and the dashboard.',
        items: [
          { icon: 'tag', title: 'Prices that staff can update themselves', text: 'Prices change often in a Nigerian food market, and a catalogue that needs a developer to update it quickly stops being trusted. Staff change a price once in the dashboard, and the app charges that same price.' },
          { icon: 'message', title: 'Ordering as easy as sending a message', text: 'Customers were used to ordering by chat, so the app had to be at least as quick. It keeps ordering to a few taps: sizes are chosen from cards, the basket stays on the phone, and checkout only asks what applies.' },
          { icon: 'truck', title: 'Two very different delivery zones', text: 'Orders inside Osogbo go out by rider the same day, while orders elsewhere in Nigeria go by courier and are paid in advance. Checkout shows each area with its fee and asks only the questions that apply to its zone.' },
          { icon: 'phone', title: 'Made for mid-range phones and mobile data', text: 'Most customers shop on a mid-range Android phone over mobile data. Pages stay light, with no animation library and no carousels that move by themselves, and searching hundreds of items stays quick.' },
        ],
      },

      personasTitle: 'Who it’s for',
      personasIntro:
        'FarmHub serves the customers buying food and the team who fulfil their orders. They share one ' +
        'goal, an order delivered correctly and on time, but each group needs something different. I ' +
        'grouped them into four types of users.',
      personas: [
        { icon: 'phone', name: 'Customers', context: 'Households and small businesses in and around Osogbo, usually on a mid-range Android phone and mobile data.', jobs: ['Find an item and its price quickly', 'Order without a long chat', 'Know when the order will arrive', 'Get regular deliveries without reordering'] },
        { icon: 'monitor', name: 'Managers', context: 'Run the business and need a clear picture of how it is doing.', jobs: ['Compare sales with last week and last month', 'See the best sellers', 'Follow subscriptions', 'Spot anything waiting for attention'] },
        { icon: 'users', name: 'Store staff', context: 'Sales, dispatch and inventory staff, each responsible for one part of the work.', jobs: ['Confirm paid orders and check transfers', 'Send orders out with the right rider', 'Keep stock and prices up to date'], note: 'Each role starts on its own home screen in the dashboard.' },
        { icon: 'truck', name: 'Riders', context: 'Deliver orders across Osogbo, using the dashboard on a phone outdoors.', jobs: ['See only their own deliveries', 'Call the customer in one tap', 'Mark each step of a delivery'] },
      ],

      principlesTitle: 'The principles behind every decision',
      principlesIntro: 'I set these five rules at the start and used them to settle decisions across all three products.',
      principles: [
        { title: 'Keep the brand people already know', text: 'The client asked for the existing site’s standard or better, not a new look. All three products use the greens and type of farmhubagro.com.' },
        { title: 'Write every status in words', text: 'Out of stock is written in words, and a falling figure shows in amber with the word “Down” instead of red against green.' },
        { title: 'Start people on their own work', text: 'Each staff role opens the dashboard on the work it does, instead of a page of figures it cannot act on.' },
        { title: 'Stay light on mobile data', text: 'No animation library, no self-moving carousels and no images the page doesn’t need, because customers pay for every megabyte.' },
        { title: 'Be honest about what is done by hand', text: 'A bank transfer is confirmed by a member of staff, so an order paid that way says it is waiting for payment until they do.' },
      ],

      ia: {
        title: 'How the product is organised',
        intro:
          'Staff move around the dashboard with a side menu grouped into sales, catalogue and settings, ' +
          'and they only see the sections their role allows. Customers use five tabs at the bottom of ' +
          'the app, with a basket bar that follows them from screen to screen.',
        consoleLabel: 'Staff dashboard',
        attendeeLabel: 'Customer app',
        console: ['Overview', 'Orders', 'Deliveries', 'Subscriptions', 'Customers', 'Promotions', 'Reports', 'Loyalty', 'Products', 'Stock changes', 'Plans', 'Settings'],
        attendee: ['Home', 'Categories', 'Basket', 'Orders', 'Account'],
        rail: 'farmhub-rail',
        railSize: [544, 1800],
        railCaption: 'The dashboard’s side menu',
        tabbar: 'farmhub-tabbar',
        tabbarSize: [1179, 170],
        tabbarCaption: 'The customer app’s tab bar',
      },

      pairSections: [
        {
          title: 'Key screens in the customer app',
          intro:
            'The app is where customers shop with FarmHub, from finding an item to getting the same ' +
            'groceries every week. These are its key screens, in the order a customer meets them.',
          pairs: [
            {
              title: 'Finding food and its price',
              body: [
                'The home screen opens on search, categories and everyday staples, so a customer can find ' +
                'rice or palm oil without knowing where it sits in the catalogue. Product photos from ' +
                'FarmHub’s catalogue sit on a sage background, so every item looks consistent.',
                'On a product page, every size is a card with its own price, so nobody has to guess what ' +
                'the bigger bag costs.',
              ],
              items: [
                { mockup: 'farmhub-app-home', caption: 'Home: search, categories and everyday staples' },
                { mockup: 'farmhub-app-product', caption: 'A product, with every size priced' },
              ],
            },
            {
              title: 'A basket that stays on the phone, and a short checkout',
              body: [
                'The basket bar follows the customer from screen to screen with the item count and the ' +
                'total. The basket is kept on the phone, so it is still there when they come back to it.',
                'Checkout lists the areas inside Osogbo, delivered the same day, apart from places ' +
                'elsewhere in Nigeria, which are paid in advance. Every area shows its fee before the ' +
                'customer chooses it.',
              ],
              items: [
                { mockup: 'farmhub-app-basket', caption: 'The basket, kept on the phone' },
                { mockup: 'farmhub-app-checkout', caption: 'Checkout with delivery areas and fees' },
              ],
            },
            {
              title: 'Following an order to the door',
              body: [
                'An order moves through five steps, from placed to delivered, and each step is written in ' +
                'words as well as marked with a dot. The customer also sees which rider is bringing it ' +
                'and the address it is going to.',
                'When it arrives, the same screen shows the order as delivered, with a way back to the ' +
                'shop and to past orders.',
              ],
              items: [
                { mockup: 'farmhub-app-tracking', caption: 'Following an order in five steps' },
                { mockup: 'farmhub-app-delivered', caption: 'The same order, delivered' },
              ],
            },
            {
              title: 'Regular deliveries without reordering',
              body: [
                'A household that buys the same things every week can turn its basket into a regular ' +
                'delivery. The customer picks a plan, a day and how many deliveries to keep it for, and ' +
                'can pause or cancel at any time from their account.',
                'The subscription screen shows the next delivery, what is in each box and the card it is ' +
                'charged to. After the last delivery, FarmHub suggests a fresh box based on what the ' +
                'household buys.',
              ],
              items: [
                { mockup: 'farmhub-app-subscription', caption: 'A regular delivery: the next date and the box' },
                { mockup: 'farmhub-app-subscribe', caption: 'Setting up regular deliveries' },
              ],
            },
          ],
        },
        {
          title: 'The rider’s phone',
          intro:
            'Riders deliver orders across Osogbo and use the dashboard on their own phones, outdoors and ' +
            'on the move. Their view leaves out everything except the deliveries in front of them.',
          pairs: [
            {
              title: 'Today’s deliveries, one tap from the customer',
              body: [
                'A rider signs in to a home screen built around today’s deliveries. Each delivery shows ' +
                'the address, a button to call the customer and a way to mark each step.',
                'Every step a rider marks also updates the order in the customer’s app, which is how the ' +
                'customer knows who is bringing it and when it has been delivered.',
              ],
              items: [
                { mockup: 'farmhub-rider-home', caption: 'The rider’s home: today’s deliveries' },
                { mockup: 'farmhub-rider-deliveries', caption: 'A rider’s delivery list on the road' },
              ],
            },
          ],
        },
      ],

      screensTitle: 'The dashboard: the control centre behind the app',
      screensIntro:
        'Everything a customer sees in the app is run from the staff dashboard. Staff set prices and ' +
        'stock, change what the app shows, follow customers and what they buy, and see how the business ' +
        'is doing.',
      screens: [
        {
          title: 'The overview: how the business is doing, at a glance',
          body: [
            'Managers wanted to know how today compared with the same point last week and last month. ' +
            'Instead of a row of identical stat cards, I put today, this week and this month in one ' +
            'deep-green band that reads from left to right, each figure with its change written in words.',
            'Below it sit a 30-day sales chart, subscriptions that need attention, best sellers and sales ' +
            'by category.',
          ],
          mockup: 'farmhub-overview',
          caption: 'The manager’s overview.',
        },
        {
          title: 'Prices and stock that the app follows',
          body: [
            'Every price on the products page is what the shop and the app charge, so staff change a ' +
            'price once and customers see the new one. Each product shows how many are left and whether ' +
            'it is on sale, with one menu to change its price or stock.',
          ],
          mockup: 'farmhub-products',
          caption: 'Products, with the prices and stock the app uses.',
        },
        {
          title: 'Staff change the app themselves',
          body: [
            'The announcement line, the home-screen banners and where each banner leads are all edited from ' +
            'the dashboard, and changes show in the app within five minutes. Nobody needs a developer to ' +
            'announce a public holiday or start a promotion.',
          ],
          mockup: 'farmhub-storefront',
          caption: 'The storefront settings, and the app they change.',
        },
        {
          title: 'Customers and what they buy',
          body: [
            'Each customer has a page with their details, whether they have an app account and everything ' +
            'they have bought, most often first. That history is what a regular delivery box is built ' +
            'from, and staff can set up a subscription or adjust loyalty points from the same page.',
          ],
          mockup: 'farmhub-customer',
          caption: 'A customer and the items they buy most often.',
        },
        {
          title: 'Reports for any period',
          body: [
            'Reports cover sales, profit on goods, promotion results, how many app visitors went on to buy ' +
            'and which baskets were left unpaid. Each report can be printed or downloaded for the accountant.',
          ],
          mockup: 'farmhub-reports',
          caption: 'Reports for the last 30 days.',
        },
        {
          title: 'A home screen for each staff role',
          body: [
            'A dispatcher has no use for a sales chart. Dispatch staff open the dashboard on what is ready ' +
            'to go out, what each rider is carrying and which deliveries are running late. Sales, ' +
            'inventory and rider staff each get their own home in the same way.',
          ],
          mockup: 'farmhub-dispatch',
          caption: 'The dispatch home, built around riders and late deliveries.',
        },
      ],

      system: {
        title: 'The design system',
        body:
          'All three products share one set of design tokens taken from the live farmhubagro.com site, so ' +
          'they read as one brand. The tokens live in a single file and are generated into the website, ' +
          'the app and the dashboard, so a colour changed once changes everywhere. The light green is only ' +
          'ever used for decoration because it is too faint to read as text.',
        swatches: [
          { name: 'Green', value: '#2a7d2e', note: 'buttons and links' },
          { name: 'Deep green', value: '#17511a', note: 'headings and the figures band' },
          { name: 'Light green', value: '#94d96b', note: 'decoration only, 1.9:1 on white' },
          { name: 'Paper', value: '#fbfaf7', note: 'page background' },
          { name: 'Ink', value: '#1e2227', note: 'text' },
          { name: 'Amber', value: '#8a6100', note: 'warnings, always with a word' },
        ],
        type: {
          family: 'Tenor Sans + Public Sans',
          note: 'Tenor Sans, the serif-like face from the existing site, sets headings and figures. Public Sans sets the interface text in the app and the dashboard because it stays clear at small sizes.',
        },
        componentsLabel: 'Components from the live product',
        components: [
          { img: 'farmhub-figures', label: 'Figures band', w: 1400, h: 254, wide: true },
          { img: 'farmhub-sizes', label: 'Size picker', w: 1100, h: 640 },
          { img: 'farmhub-tracking', label: 'Order tracking', w: 1100, h: 700 },
          { img: 'farmhub-rider-card', label: 'Rider delivery card', w: 1135, h: 770 },
          { img: 'farmhub-basket-bar', label: 'Basket bar', w: 1140, h: 168 },
        ],
        rulesLabel: 'Standards every screen meets',
        rules: [
          'Text contrast of at least 4.5:1 on every colour pair',
          'A visible focus ring on every control',
          'Tap targets of at least 44px on phones',
          'Status written in words, never shown by colour alone',
          'Motion only in CSS, and none when reduced motion is turned on',
        ],
      },
    },

    development: {
      lede:
        'I built the front end of all three products. The website order pages are a WordPress plugin ' +
        'written in plain HTML, CSS and JavaScript with no framework, so it runs on the existing site and ' +
        'stays fast on Nigerian mobile networks. The customer app is built with Expo and React Native in ' +
        'TypeScript, and runs on iPhone, Android and the web from one codebase. The staff dashboard is ' +
        'built with Laravel and Filament, where I built the theme, the pages and the home screen for ' +
        'each role.',

      flowTitle: 'How an app screen loads',
      flowIntro: 'The six steps between a customer opening a screen and seeing it. The solid boxes are the front end I built; the dashed boxes are the server side, which was outside my part of the work.',
      flowKey: { me: 'Front end I built', other: 'Server side' },
      flow: [
        { label: 'Screen opens', sub: 'a category, product or order', owner: 'me' },
        { label: 'Shared hooks', sub: 'loading, error and retry handled in one place', owner: 'me' },
        { label: 'api()', sub: 'one client for every request', owner: 'me' },
        { label: 'Price check', sub: 'repriced after a pause; old answers ignored', owner: 'me' },
        { label: 'FarmHub API', sub: 'the shop’s orders and catalogue', owner: 'partner' },
        { label: 'Paystack', sub: 'card payments confirmed on the server', owner: 'partner' },
      ],

      treeTitle: 'Code organised like the product',
      treeIntro:
        'Each front end keeps its screens, shared pieces and logic in separate folders, and all three ' +
        'read their colours and type from one tokens package.',
      tree: {
        root: 'FarmhubAgro/',
        items: [
          { name: 'app-mobile/src/app/(tabs)/', note: 'the five app tabs' },
          { name: 'app-mobile/src/app/product · category · order/', note: 'screens opened from the tabs' },
          { name: 'app-mobile/src/components/', note: 'basket bar, product and points cards' },
          { name: 'app-mobile/src/lib/', note: 'API client, hooks, basket, prices and search' },
          { name: 'app-dashboard/app/Filament/Pages/', note: 'overview, reports, loyalty, storefront' },
          { name: 'app-dashboard/…/pages/home/', note: 'one home view per staff role' },
          { name: 'wp/plugins/farmhub-market/assets/', note: 'the price list and order form' },
          { name: 'packages/tokens/tokens.json', note: 'the one source of colours and type', file: true },
        ],
        note: 'Three front ends, one set of design tokens.',
      },

      sections: [
        {
          title: 'Design tokens the code won’t let you misuse',
          body: [
            'The light brand green is too faint to read as text, so the app’s colour tokens carry a type ' +
            'that says how each one may be used. Using a decoration colour for text stops the app from ' +
            'compiling, so the mistake is caught before it can reach a customer.',
            'The same tokens are generated into the website’s CSS and the dashboard’s theme, and an ' +
            'automatic check fails if any copy drifts from the source.',
          ],
          code: {
            file: 'app-mobile/src/theme/tokens.ts',
            lines: [
              '/**',
              ' * A DecorColor may only be used for borders, fills and decorative marks.',
              ' * greenLight is 1.9:1 on white, so using it as a text colour is a contrast',
              ' * failure. The branded types make that a compile error rather than a habit.',
              ' */',
              'export type TextColor = string & { readonly __text: unique symbol };',
              'export type DecorColor = string & { readonly __decor: unique symbol };',
              '',
              'export const color = {',
              '  // …',
              "  greenLight: '#94D96B' as DecorColor,",
            ],
          },
        },
        {
          title: 'One dashboard, a different home for each role',
          body: [
            'When someone signs in, the dashboard picks their home screen from their most senior role. ' +
            'Managers see the business, and everyone else starts on the work their role does. Someone with ' +
            'no role yet sees only a greeting rather than figures they shouldn’t see.',
          ],
          code: {
            file: 'app-dashboard/app/Filament/Pages/Overview.php',
            lines: [
              'public function mode(): string',
              '{',
              '    return match (StaffRoles::primary(auth()->user())) {',
              "        'super_admin', 'manager' => 'business',",
              "        'sales' => 'sales',",
              "        'dispatch' => 'dispatch',",
              "        'inventory' => 'inventory',",
              "        'rider' => 'rider',",
              "        default => 'none',",
              '    };',
              '}',
            ],
          },
        },
        {
          title: 'A basket that survives the app closing',
          body: [
            'People often shop in pieces, adding a few items now and finishing later. The basket is saved on ' +
            'the phone every time it changes and restored when the app opens again, so nothing is lost if the ' +
            'app closes or the network drops.',
          ],
          code: {
            file: 'app-mobile/src/lib/basketStore.tsx',
            lines: [
              '/** The basket survives the app being closed, because people shop in pieces. */',
              'export function BasketProvider({ children }: { children: ReactNode }) {',
              '  const [lines, setLines] = useState<B.Basket>([]);',
              '  const [loaded, setLoaded] = useState(false);',
              '',
              '  useEffect(() => {',
              '    readJson(KEY).then((stored) => {',
              '      setLines(B.revive(stored));',
              '      setLoaded(true);',
              '    });',
              '  }, []);',
            ],
          },
        },
        {
          title: 'An order form with no framework',
          body: [
            'The website order form is plain JavaScript, so it loads quickly on mobile data and keeps working ' +
            'through theme updates. When the customer changes delivery zone, the payment options change with ' +
            'it, and switching back restores the default so nobody is asked for a receipt they never meant ' +
            'to attach.',
          ],
          code: {
            file: 'wp/plugins/farmhub-market/assets/js/fh-order.js',
            lines: [
              'function onChange(e) {',
              '  var t = e.target;',
              '  if (t.name === \'zone\') {',
              '    S.zone = t.value;',
              '    // Outside Osogbo is advance payment only. Coming back to Within Osogbo has to',
              '    // restore the default too, or the customer is silently left on "pay by transfer"',
              '    // and then blocked for a receipt they never meant to attach.',
              "    S.payment = 'outside' === S.zone ? 'transfer' : 'delivery';",
              "    if ('delivery' === S.payment) { S.receipt = null; S.receiptFile = null; delete S.errors.receipt; }",
              '    renderPanel(); renderSummary(); return;',
            ],
          },
        },
      ],

      suitesTitle: 'Testing and standards',
      suitesIntro: 'Checks that run on every change to the front ends, and the standards behind them.',
      suites: [
        { icon: 'eye', title: 'Contrast', text: 'Every one of the 16 colour pairs in the tokens is checked against WCAG 2.2 AA.' },
        { icon: 'layers', title: 'Token sync', text: 'Fails if the website, app or dashboard copy of the tokens drifts from the source.' },
        { icon: 'code', title: 'App logic', text: 'Tests for the basket, prices, search and money handling in the customer app.' },
        { icon: 'cursor', title: 'Keyboard and focus', text: 'A visible focus ring on every control, and the whole order form works by keyboard.' },
      ],

      quality: [
        { value: '38', label: 'automated tests for the customer app’s logic' },
        { value: '16', label: 'colour pairs checked for contrast on every change' },
        { value: '44px', label: 'minimum tap target on phones' },
      ],

      splitTitle: 'My contribution',
      splitIntro: 'I was responsible for the design and the front end of all three products.',
      split: {
        bothMine: true,
        mineLabel: 'What I designed',
        partnerLabel: 'What I built',
        mine: ['The website price list and order form', 'The customer app', 'The staff dashboard and a home screen for each role', 'The rider screens for phones', 'The shared design system'],
        partner: ['The WordPress plugin’s front end, in plain JavaScript', 'The Expo app for iPhone, Android and the web', 'The Filament dashboard’s theme, pages and role homes', 'The design tokens package used by all three'],
      },
    },

    outcomeLabel: 'The result',
    outcome:
      'FarmHub now takes orders through its website and its customer app, and runs every order, delivery ' +
      'and subscription from one dashboard. Staff change prices, promotions and the app’s front page ' +
      'themselves, without waiting for a developer. The next step is releasing the app to the App Store ' +
      'and Google Play.',
  },

  // ABF Admin: the festival team's dashboard. Screens are Sammy's own captures
  // on made-up demo data (example.com addresses); nothing comes from the live
  // database. Code facts checked against the abf-admin repo, Nov 2026.
  {
    slug: 'abf-admin',
    kind: 'product',
    seoTitle: 'ABF Admin: event dashboard design and Next.js build | Sammy Fash',
    seoDescription: 'The private dashboard the Africa Blockchain Festival 2026 team used to follow registrations, ticket sales, campaigns and coupons in one place. I designed it and built it with Next.js, TypeScript and Supabase.',
    name: 'ABF Admin',
    title: 'ABF Admin, the dashboard behind Africa Blockchain Festival 2026',
    colour: '#dc49e2',
    year: '2026',
    timeline: { span: 'May to July 2026', label: '2 months' },
    location: 'Nairobi, Kenya · remote',
    role: 'Product design · Front-end engineering · Full-stack development',
    team: 'I designed ABF Admin and built all of it: the screens, the sign-in and roles, the Google Sheets sync and the database. I also built the payments plugin on the festival website that sends each sale to the dashboard.',
    services: [
      { label: 'Product design', icon: 'pen' },
      { label: 'Dashboard design', icon: 'chart' },
      { label: 'Front-end engineering', icon: 'code' },
      { label: 'Full-stack development', icon: 'layers' },
    ],
    stack: ['Figma', 'Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    card: 'abf-admin',
    cardAlt: 'ABF Admin’s overview on a laptop at an event venue',
    cardTag: {
      design: 'Dashboard design · Front-end engineering',
      development: 'Next.js · TypeScript · Supabase',
    },
    cardSize: [1400, 875],

    intro:
      'Africa Blockchain Festival 2026 brought founders, investors, policymakers and builders to the ' +
      'Sarit Expo Centre in Nairobi for three days in October. ABF Admin is the private dashboard the ' +
      'festival team used to follow registrations, ticket sales, campaigns and coupons in one place. I ' +
      'designed it and built it, from the first screen to the database.',

    impact: [
      { icon: 'layers', value: '6', unit: 'areas', text: 'in one side menu for the whole team: the overview, registrations, ticket sales, campaigns, coupons and website requests.' },
      { icon: 'grid', value: '14', unit: 'screens', text: 'designed and built, covering registrations, sales, campaigns, coupons, website requests and the team.' },
      { icon: 'card', value: '3', unit: 'payment methods', text: 'feeding one sales view: card through Stripe, and M-Pesa or USDC through Minisend.' },
    ],

    hero: {
      laptop: 'abfadmin-hero',
      alt: 'ABF Admin: the overview on a laptop at an event venue',
      caption: 'The overview',
    },

    design: {
      lede:
        'Every form on the festival website wrote into its own tab of a shared Google Sheet, and payments ' +
        'were recorded somewhere else again. Anyone who wanted to know how many people had registered, ' +
        'who had paid or which campaign brought them in had to open several spreadsheets and count by ' +
        'hand. The team needed those numbers live, in one place, without giving up the sheets they ' +
        'already worked in.',

      research: {
        title: 'What shaped the product',
        intro: 'Four findings shaped the dashboard before I designed a screen.',
        items: [
          { icon: 'file', title: 'The sheets had to stay', text: 'The team already ran the festival from Google Sheets, and every website form wrote into them. The dashboard reads the sheets every hour instead of replacing them, so nobody had to change how they worked.' },
          { icon: 'card', title: 'A registration is not a sale', text: 'Many people registered and never paid. Each person’s row shows whether they have paid, abandoned checkout or not started, so the team knows who to follow up with.' },
          { icon: 'eye', title: 'Numbers people can trust', text: 'A dashboard that quietly falls behind its sheets is worse than none. The overview checks every sheet against what the dashboard holds and says so in a single line.' },
          { icon: 'link', title: 'Which partner brought each buyer', text: 'Partners and media shared their own tracking links. The team needed to see which link led to a paid ticket, not only which channel sent visitors.' },
        ],
      },

      personasTitle: 'Who it’s for',
      personasIntro:
        'ABF Admin is used only by the festival team, and access is by invitation. Everyone shares the ' +
        'same goal, a full and well-run festival, but each group comes to the dashboard for something different.',
      personas: [
        { icon: 'chart', name: 'Festival leads', context: 'Run the festival and report on how it is going.', jobs: ['See registrations and sales at a glance', 'Compare this week with last week', 'Trust that the figures are up to date'] },
        { icon: 'megaphone', name: 'Marketing and partnerships', context: 'Run campaigns and share tracking links with partners and media.', jobs: ['See which link each buyer came from', 'Create discount codes', 'Find people who started checkout and stopped'] },
        { icon: 'users', name: 'Attendee support', context: 'Answer attendees and chase unfinished payments.', jobs: ['Find a person and their payment status', 'Follow up on declined cards', 'Export a list when needed'] },
        { icon: 'code', name: 'Admins', context: 'Look after the website and who can use the dashboard.', jobs: ['Invite people and set their role', 'Approve access requests', 'Connect new sheets and watch the sync'], note: 'Team and Settings are shown to admins only.' },
      ],

      principlesTitle: 'The principles behind every decision',
      principlesIntro: 'I set these rules at the start and used them to settle decisions on every screen.',
      principles: [
        { title: 'Keep the tools the team already uses', text: 'The sheets remain the team’s own record. The dashboard reads them and adds live numbers on top, so nothing the team relied on was taken away.' },
        { title: 'Calmer than the festival brand', text: 'The public site is loud and dark. A tool people read all day needs to be quiet, so the dashboard is white and grey, with the festival’s magenta kept for the current page and small accents.' },
        { title: 'Write every status in words', text: 'Paid, Abandoned, In checkout and Not started are written on every tag, so the meaning never depends on colour alone.' },
        { title: 'Say when the numbers are behind', text: 'Every page says when its data last synced, and anything that fails is named with the source, the missing rows and the error.' },
        { title: 'One row per person', text: 'People often registered more than once. The table shows each person once, with their latest entry and a small count of repeat registrations.' },
      ],

      ia: {
        title: 'How the product is organised',
        intro:
          'A side menu holds the six areas the whole team uses, in the order they look at them: the ' +
          'overview first, then registrations and sales, then campaigns and coupons, then website requests. ' +
          'Team and Settings sit apart under Manage and appear only for admins.',
        consoleLabel: 'Every team member',
        attendeeLabel: 'Admins only',
        attendeeIcon: 'shield',
        console: ['Overview', 'Registrations', 'Ticket Sales', 'Campaigns', 'Coupons', 'Engineering'],
        attendee: ['ABF Team', 'Settings'],
        rail: 'abfadmin-rail',
        railSize: [512, 1800],
        railCaption: 'The dashboard’s side menu',
        tabbar: 'abfadmin-overview-top',
        tabbarSize: [2368, 1480],
        tabbarCaption: 'The overview, where the menu opens',
      },

      screensTitle: 'Key screens in the dashboard',
      screensIntro:
        'These are the screens the team used most during the run-up to the festival, in the order they ' +
        'appear in the menu.',
      screens: [
        {
          title: 'The overview: the whole festival on one page',
          body: [
            'The overview opens on total leads, event registrations and ticket sales, each with its change ' +
            'this week and a small trend line. Below them, a chart of form submissions over the last 30 days ' +
            'and a breakdown by form show where interest is coming from.',
            'A single line under the figures confirms that every sheet matches the dashboard. Website ' +
            'traffic from Google Search sits at the bottom of the page, so the team can see how many people ' +
            'found the festival through search.',
          ],
          mockup: 'abfadmin-hero',
          caption: 'The overview.',
        },
        {
          title: 'Registrations, with who has paid',
          body: [
            'Each form has its own list, with one row per person. A tag in the first column shows whether ' +
            'they have paid, tried and failed, abandoned checkout, are still in checkout or have not started.',
            'Payment status is matched by email, then by phone, against the sales records, so the team can ' +
            'filter to the people who registered but never paid and follow them up.',
          ],
          mockup: 'abfadmin-registrations',
          caption: 'Event registrations, one row per person with a payment tag.',
        },
        {
          title: 'Ticket sales, and the cards that were declined',
          body: [
            'Every paid pass appears here, from card, M-Pesa and USDC payments, with the pass, the amount and ' +
            'the buyer. Declined card attempts have their own count, with how many still need a person to ' +
            'follow up and how many paid later.',
          ],
          mockup: 'abfadmin-sales',
          caption: 'Ticket sales across both payment providers.',
        },
        {
          title: 'Campaigns: which link brought each buyer',
          body: [
            'Each tracking link shows how many people started checkout, how many paid, how many stopped and ' +
            'the revenue it brought in. The team can compare the links given to different partners instead ' +
            'of relying only on broad channel names.',
          ],
          mockup: 'abfadmin-campaigns',
          caption: 'Campaigns, from tracking link to paid ticket.',
        },
        {
          title: 'Coupons the team can create themselves',
          body: [
            'Discount codes are created, edited and switched off from the dashboard. Each code shows how ' +
            'often it was used, how many people reached checkout with it, the revenue it produced and how ' +
            'much it gave away.',
          ],
          mockup: 'abfadmin-coupons',
          caption: 'Coupons, with their use and revenue.',
        },
        {
          title: 'Website requests in one queue',
          body: [
            'Instead of asking for website changes in chat, the team files a request with a priority. Each ' +
            'request has a status, notes and a timeline of every change, so anyone can see where it stands.',
          ],
          mockup: 'abfadmin-engineering',
          caption: 'A website request and its timeline.',
        },
        {
          title: 'Invitations and access requests',
          body: [
            'Admins invite people by email and choose their role. Someone without an account can ask for ' +
            'access from the sign-in page, and every admin gets an email to approve or decline it in one tap.',
          ],
          mockup: 'abfadmin-team',
          caption: 'The team page, with pending access requests.',
        },
      ],

      system: {
        title: 'The design system',
        body:
          'ABF Admin is deliberately calmer than the public festival brand. It uses white and soft grey ' +
          'surfaces, near-black text and the festival’s magenta for the current page and small accents. ' +
          'Magenta text uses a deeper shade, because the bright one is too light to read as text. Status ' +
          'colours always come with a word.',
        swatches: [
          { name: 'ABF magenta', value: '#dc49e2', note: 'accents and the current page' },
          { name: 'Deep magenta', value: '#b02cb5', note: 'magenta text and links' },
          { name: 'Ink', value: '#111113', note: 'text' },
          { name: 'Paper', value: '#f7f7f8', note: 'page background' },
          { name: 'Green', value: '#1a9e5c', note: 'paid and healthy, with a word' },
          { name: 'Amber', value: '#b7791f', note: 'abandoned and stale, with a word' },
        ],
        type: {
          family: 'Geist + Geist Mono',
          note: 'Geist sets the interface and its figures, which line up in columns. Geist Mono sets codes such as coupon names and request numbers.',
        },
        componentsLabel: 'Components from the live product',
        components: [
          { img: 'abfadmin-filters', label: 'Payment filters', w: 1485, h: 95, wide: true },
          { img: 'abfadmin-stat', label: 'Stat tile', w: 740, h: 276 },
          { img: 'abfadmin-tags', label: 'Payment tags in the table', w: 1290, h: 860 },
          { img: 'abfadmin-sync', label: 'Sync check', w: 820, h: 64, wide: true },
        ],
        rulesLabel: 'Standards every screen meets',
        rules: [
          'Text contrast of at least 4.5:1, which is why magenta text uses the deeper shade',
          'Status written in words, never shown by colour alone',
          'Every page says when its data last synced',
          'A loading state on every page, so a slow source never looks frozen',
        ],
      },

    },

    development: {
      lede:
        'ABF Admin is a Next.js 16 app written in TypeScript, with Tailwind CSS 4 for styling and Supabase ' +
        'for the database and sign-in. Pages are rendered on the server, so figures arrive ready to read. ' +
        'Google Sheets stays the team’s record: a scheduled job copies every sheet into the database each ' +
        'hour, and the festival website’s payments plugin, which I also built, sends each sale as it settles.',

      flowTitle: 'How a dashboard page loads',
      flowIntro: 'The six steps between a team member opening a page and seeing it. The solid boxes are code I wrote; the dashed boxes are outside services the dashboard reads from.',
      flowKey: { me: 'Code I wrote', other: 'Outside services' },
      flow: [
        { label: 'Session check', sub: 'signed-out visitors go to the sign-in page', owner: 'me' },
        { label: 'Profile and role', sub: 'admin-only pages checked on the server', owner: 'me' },
        { label: 'Server page', sub: 'every query in one Promise.all', owner: 'me' },
        { label: 'Supabase', sub: 'rows, sales and sync history, behind row-level security', owner: 'me' },
        { label: 'Google Sheets', sub: 'copied into the database every hour', owner: 'partner' },
        { label: 'Search Console', sub: 'website traffic, streamed in after the page', owner: 'partner' },
      ],

      treeTitle: 'Code organised like the product',
      treeIntro:
        'Each area of the menu is a folder of routes, and the work behind the screens lives in small ' +
        'modules named after what they do.',
      tree: {
        root: 'abf-admin/src/',
        items: [
          { name: 'app/(dashboard)/', note: 'one folder per page in the side menu' },
          { name: 'app/login · request-access · access/decide/', note: 'sign-in and access requests' },
          { name: 'app/api/sync · sales/ingest · campaigns/ingest/', note: 'the hourly sync and the website’s data' },
          { name: 'components/', note: 'side menu, stat tile, data table, badges, sync check' },
          { name: 'lib/sheets.ts', note: 'the Google Sheets sync', file: true },
          { name: 'lib/sync-health.ts', note: 'does every sheet match the dashboard?', file: true },
          { name: 'lib/payment-status.ts', note: 'the tag on every registration', file: true },
          { name: 'proxy.ts', note: 'the session check on every request', file: true },
        ],
        note: 'About 11,400 lines of TypeScript across 53 commits.',
      },

      sections: [
        {
          title: 'A sync that keeps edits, deletions and restores straight',
          body: [
            'Every hour the sync reads each sheet and fingerprints every row. A new fingerprint is inserted, ' +
            'one that has disappeared from the sheet is marked as deleted rather than erased, and one that ' +
            'comes back is restored instead of duplicated. An edited row simply becomes a new fingerprint, ' +
            'so the old version is retired and the new one added.',
          ],
          code: {
            file: 'src/lib/sheets.ts',
            lines: [
              '    // Inserts + restores.',
              '    const toInsert: object[] = [];',
              '    const toRestore: number[] = [];',
              '    for (const [hash, payload] of seen) {',
              '      const ex = existingByHash.get(hash);',
              '      if (!ex) {',
              '        toInsert.push({',
              '          source_id: source.id,',
              '          row_hash: hash,',
              '          payload,',
              '          submitted_at: parseSubmittedAt(payload),',
              '        });',
              '      } else if (ex.deleted_at) {',
              '        toRestore.push(ex.id);',
              '      }',
              '    }',
              '',
              '    // Soft-delete rows no longer present in the sheet.',
              '    const toDelete = existing',
              '      .filter((r) => !r.deleted_at && !seen.has(r.row_hash))',
              '      .map((r) => r.id);',
            ],
          },
        },
        {
          title: 'A check that says when the numbers are wrong',
          body: [
            'Once, two paid card sales sat in the sales sheet for eleven hours without reaching the ' +
            'dashboard, behind an error nobody could read. After that, every page compares the rows in each ' +
            'sheet with the rows the dashboard holds. If a source is failing, missing rows or out of date, ' +
            'the overview names it, with the gap and the actual error.',
          ],
          code: {
            file: 'src/lib/sync-health.ts',
            lines: [
              '    // Only a clean run’s count describes the sheet; a failed run may have read',
              '    // the tab fine and fallen over afterwards, or not read it at all.',
              '    const sheetRows = lastClean?.sheet_rows ?? null;',
              '    const missing =',
              '      sheetRows !== null && sheetRows > heldRows ? sheetRows - heldRows : 0;',
              '',
              '    const stale =',
              '      !lastClean?.finished_at ||',
              '      now - new Date(lastClean.finished_at).getTime() > STALE_AFTER_MS;',
              '',
              '    // Ordered by how much it should worry someone reading the numbers above.',
              '    let state: HealthState = "ok";',
              '    if (latest?.error) state = "failing";',
              '    else if (missing > 0) state = "drift";',
              '    else if (stale) state = "stale";',
            ],
          },
        },
        {
          title: 'Coupons counted only when a payment settles',
          body: [
            'Discount codes are applied by the payments plugin on the festival website, which I wrote in PHP. ' +
            'The browser can name a code but never an amount, so the price is always worked out on the ' +
            'server. A use is counted only when the payment settles, so an abandoned checkout never uses up ' +
            'a limited code.',
          ],
          code: {
            file: 'abf-payments/includes/coupons.php',
            lines: [
              ' * Count one redemption. Called when a payment settles, never when a session is',
              ' * created — an abandoned checkout must not use up a limited code.',
              ' ...',
              "\t$wpdb->query( $wpdb->prepare( 'UPDATE ' . abf_coupon_table() . ' SET used_count = used_count + 1 WHERE code = %s', $code ) );",
              '}',
              '',
              "add_action( 'abf_pay_paid', 'abf_coupon_count_redemption', 30, 1 );",
            ],
          },
        },
        {
          title: 'From a tracking link to a paid ticket',
          body: [
            'A tracking link sets a 30-day cookie when someone first arrives, and the plugin copies it onto ' +
            'their checkout on the server. The campaign report then counts, for each link, how many people ' +
            'started checkout, how many paid, how many did not, and the revenue, which the dashboard shows ' +
            'on the Campaigns page.',
          ],
          code: {
            file: 'abf-payments/includes/attribution.php',
            lines: [
              '\t\t\tCOUNT(*) AS started,',
              "\t\t\tSUM( status = 'paid' ) AS paid,",
              "\t\t\tSUM( status IN ( 'created', 'pending', 'abandoned', 'expired' ) ) AS unpaid,",
              "\t\t\tSUM( CASE WHEN status = 'paid'",
              '\t\t\t\tTHEN ( CASE WHEN amount_paid > 0 THEN amount_paid ELSE amount_usd END )',
              '\t\t\t\tELSE 0 END ) AS revenue',
            ],
          },
        },
      ],

      suitesTitle: 'Keeping the numbers trustworthy',
      suitesIntro: 'ABF Admin has no automated test suite. These are the safeguards built into the product instead.',
      suites: [
        { icon: 'eye', title: 'Sync check', text: 'Every sheet is compared with the dashboard, and a failing, missing or stale source is named on the overview.' },
        { icon: 'message', title: 'Failure emails', text: 'The team is emailed when a source starts failing, once, rather than on every hourly run.' },
        { icon: 'shield', title: 'Secret-checked pushes', text: 'Sales and campaign data from the website are accepted only with a shared secret, and a sale is never recorded twice.' },
        { icon: 'file', title: 'Nothing erased', text: 'Rows removed from a sheet are marked as deleted, never erased, so they can come back without duplicates.' },
      ],

      quality: [
        { value: '1 hr', label: 'between syncs, with a refresh button for anything sooner' },
        { value: '14', label: 'screens, each with its own loading state' },
        { value: '2', label: 'roles, enforced on the server and in the database' },
      ],

      splitTitle: 'My contribution',
      splitIntro: 'I was responsible for the design and the whole build of ABF Admin, and for the payments plugin that feeds it.',
      split: {
        bothMine: true,
        mineLabel: 'What I designed',
        partnerLabel: 'What I built',
        mine: ['All 14 dashboard screens, on desktop and phone', 'The overview and its sync check', 'Payment tags and filters for every registration', 'The campaign and coupon views', 'The invitation and access-request flow'],
        partner: ['The Next.js app, in TypeScript and Tailwind CSS', 'The Supabase database, sign-in, roles and row-level security', 'The hourly Google Sheets sync and its health check', 'The WordPress payments plugin that sends sales, campaigns and coupons to the dashboard'],
      },
    },

    outcomeLabel: 'The result',
    outcome:
      'The festival team followed registrations, sales, campaigns and coupons from one dashboard through ' +
      'the run-up to Africa Blockchain Festival 2026, without giving up the Google Sheets they already ' +
      'used. When something fell behind, the dashboard said so instead of showing figures that looked ' +
      'right but were not.',
  },

  // The public festival website, written to the same standard as the product
  // case studies (Sammy, Nov 2026). Sources: the Get Ticket blueprint, the ABF
  // design system and the abf-payments plugin (v1.32.0, 22 PHP files, about
  // 7,400 lines), all in ~/African Blockchain Festival. Screens are Sammy's own
  // captures of the live site; no attendee data appears in them.
  {
    slug: 'africa-blockchain-festival',
    kind: 'product',
    website: true,
    seoTitle: 'Africa Blockchain Festival: event website design and WordPress build | Sammy Fash',
    seoDescription: 'Website design and WordPress development for Africa Blockchain Festival, including separate sponsor and ticket journeys, three languages and a checkout of the festival’s own that takes card, M-Pesa and USDC.',
    name: 'Africa Blockchain Festival',
    title: 'Africa Blockchain Festival 2026',
    colour: '#0895fa',
    live: 'https://africablockchainfestival.com/',
    liveLabel: 'africablockchainfestival.com',
    year: '2025–2026',
    client: 'Africa Blockchain Festival · World Token Summit',
    timeline: { span: 'The 2025 and 2026 festivals', label: '2025–2026' },
    location: 'Nairobi, Kenya · remote',
    role: 'Web design · WordPress development · Full-stack development',
    team: 'I designed the website in Figma, built it in WordPress and Elementor, and wrote the payments plugin behind its checkout in PHP.',
    services: [
      { label: 'Web design', icon: 'pen' },
      { label: 'Product design', icon: 'design' },
      { label: 'WordPress development', icon: 'code' },
      { label: 'Full-stack development', icon: 'layers' },
    ],
    stack: ['Figma', 'WordPress', 'Elementor', 'PHP', 'Stripe'],
    card: 'abf',
    cardAlt: 'The Africa Blockchain Festival 2026 website on a desktop monitor',
    cardTag: {
      design: 'Web design · Product design',
      development: 'WordPress · PHP · Stripe',
      web: 'Figma · WordPress · PHP',
    },
    cardSize: [1400, 777],

    intro:
      'Africa Blockchain Festival brings founders, investors, policymakers, students and builders ' +
      'together in Nairobi. I designed and built the public website for the 2025 edition, then returned ' +
      'for 2026, held at the Sarit Expo Centre from 15 to 17 October. The site is where people learn ' +
      'about the festival and buy their passes, and where sponsors find out how to take part.',

    impact: [
      { icon: 'chart', value: '$160K+', unit: 'sponsorship', text: 'secured by the festival from sponsors and partners, with the website used throughout its partner outreach.' },
      { icon: 'card', value: '3', unit: 'ways to pay', text: 'on one checkout: card through Stripe, and M-Pesa or USDC through Minisend, so attendees across Africa can pay the way they already do.' },
      { icon: 'calendar', value: '2', unit: 'editions', text: 'of the festival on a site I designed and built. After 2025, the organisers brought me back to take it into the 2026 festival.' },
    ],

    hero: {
      laptop: 'abfweb-hero',
      alt: 'The Africa Blockchain Festival 2026 homepage on a laptop in a Nairobi café, with the phone version beside it',
      caption: 'The homepage, on a laptop and a phone',
    },

    design: {
      lede:
        'The old website was losing ticket buyers at the moment they were ready to pay. People chose a ' +
        'pass on the site and were then sent to a separate ticketing platform that had forgotten their ' +
        'choice. That platform also took cards only and settled in Nigerian naira, while the passes are ' +
        'priced in US dollars and many attendees pay with M-Pesa or stablecoins. My job was to explain the ' +
        'festival clearly to everyone who visits, then take each buyer from choosing a pass to holding a ' +
        'paid ticket without losing them along the way.',

      research: {
        title: 'What shaped the site',
        intro: 'Before I designed a single page, I looked at where the old site was losing people and what the festival needed it to do. Four problems stood out, and each one shaped a part of the new site.',
        items: [
          { icon: 'link', title: 'Ticket buyers were dropping off before paying', text: 'People chose a pass on the old site, then landed on a ticketing platform that didn’t know what they had picked. They had to start again, and many gave up. On the new site, the pass you choose follows you all the way to checkout.' },
          { icon: 'card', title: 'Attendees pay in different ways', text: 'The festival draws people from across Africa, but the old gateway only took cards and settled in naira. Anyone paying with M-Pesa or USDC was shut out, and card buyers paid conversion fees. I built one checkout that takes all three.' },
          { icon: 'users', title: 'Every visitor comes for something different', text: 'A founder wants to meet investors, an investor wants the speaker list, a student wants an affordable pass and a sponsor wants to know who will be in the room. Each of them gets a clear route from the homepage, with Get Tickets one tap away on every page.' },
          { icon: 'eye', title: 'No payment can go unrecorded', text: 'Payment providers don’t always confirm a payment straight away, and sometimes the confirmation never arrives. A buyer who has paid and hears nothing is the worst outcome for the festival, so the site checks every unfinished payment every five minutes until it is settled.' },
        ],
      },

      personasTitle: 'Who it’s for',
      personasIntro:
        'The website serves everyone deciding whether to attend or support the festival. They share the ' +
        'same goal, being part of a successful festival, but each comes to the site for something different.',
      personas: [
        { icon: 'code', name: 'Founders and builders', context: 'Come to meet investors, learn and show their work.', jobs: ['See who is speaking and when', 'Compare the General and Professional passes', 'Pay by card, M-Pesa or USDC'] },
        { icon: 'chart', name: 'Investors and senior guests', context: 'Decide whether the festival is worth the trip to Nairobi.', jobs: ['See the speakers and the agenda', 'Compare what the VIP pass includes', 'Plan travel and a hotel'] },
        { icon: 'pen', name: 'Students', context: 'Want affordable access to the talks and workshops.', jobs: ['Find the $49 student pass', 'See the developer workshops', 'Register quickly on a phone'], note: 'Media and press apply for a free pass through the same form.' },
        { icon: 'megaphone', name: 'Sponsors and partners', context: 'Decide whether to put their brand in front of the audience.', jobs: ['See who attends and past partners', 'Compare sponsorship options', 'Enquire about group and corporate passes'] },
      ],

      principlesTitle: 'The principles behind every decision',
      principlesIntro: 'I set these rules at the start and used them to settle decisions on every page.',
      principles: [
        { title: 'One clear path to a ticket', text: 'Every page leads to the same three steps: choose a pass, register, pay. Sponsors have a separate route, so the two calls to action never compete.' },
        { title: 'Never ask for the same choice twice', text: 'The pass chosen on the tickets page arrives already selected in the registration form, and the order summary follows the buyer to checkout.' },
        { title: 'Prices live only on the server', text: 'The page can say which pass someone wants, but never what it costs. Every amount sent to a payment gateway is read from one table on the server.' },
        { title: 'Always tell buyers what happened to their money', text: 'After paying, buyers see a receipt and get a confirmation email. If a card is declined, the site tells them no money was taken.' },
        { title: 'The team updates the content, not the code', text: 'Speakers, sponsors, passes and translations are edited in WordPress using shared styles, so the team can change them without touching templates.' },
      ],

      ia: {
        title: 'How the site is organised',
        intro:
          'The main menu holds everything a visitor reads before deciding: the event itself, partnership ' +
          'and sponsorship, the travel guide, news and contact. Get Tickets sits apart in the top corner of ' +
          'every page and starts a short path that ends with a paid ticket.',
        consoleLabel: 'Main menu',
        console: ['Event: speakers, agenda, side events, fellows and the Unity Games', 'Become a Partner', 'Sponsorship', 'Travel Guide', 'Blogs', 'Contact'],
        attendeeLabel: 'Buying a pass',
        attendeeIcon: 'card',
        attendee: ['Get Tickets: compare the passes', 'Register: four fields', 'Pay: card, M-Pesa or USDC', 'Receipt on the site', 'Confirmation email, which is the ticket'],
        rail: 'abfweb-home-phone',
        railSize: [585, 1266],
        railWhole: true, // a whole phone screen, not a cropped side menu
        railCaption: 'The homepage on a phone',
        tabbar: 'abfweb-home-desk',
        tabbarSize: [1440, 900],
        tabbarCaption: 'The homepage on desktop, with the main menu and Get Tickets',
      },

      screensTitle: 'Key pages on the site',
      screensIntro:
        'The pages people used most, from deciding to attend through to paying, in the order a visitor ' +
        'meets them.',
      screens: [
        {
          title: 'Speakers: who will be on stage',
          body: [
            'For many visitors the speakers decide whether the trip is worth it, so the speakers page is one ' +
            'click from the homepage. Eighty speakers were published for 2026, each with a photo, a role and ' +
            'an organisation.',
          ],
          mockup: 'abfweb-speakers',
          caption: 'Speakers: 80 published for 2026',
        },
        {
          title: 'The agenda, one day at a time',
          body: [
            'The agenda is split into tabs for the opening evening and the three festival days, so visitors ' +
            'see one day at a time instead of one long list. Fifty-nine sessions were published for 2026 from ' +
            'the same content structure.',
          ],
          mockup: 'abfweb-agenda',
          caption: 'The three-day agenda',
        },
        {
          title: 'Choosing a pass, compared by level of access',
          body: [
            'The tickets page opens with the dates, the venue and the festival’s numbers, then compares the ' +
            'passes side by side by what each one includes, with one recommended option.',
            'Media passes are free by application, and group and corporate passes go to the sales team, so ' +
            'those two sit apart from the passes people pay for.',
          ],
          mockup: 'abfweb-tickets',
          caption: 'The tickets page',
        },
        {
          title: 'A registration form with four fields',
          body: [
            'The first design asked fourteen questions about each buyer’s role, company and goals. Paying ' +
            'for a pass only needs the pass, a name, an email and a WhatsApp number, so the form was cut to ' +
            'those four.',
            'A summary beside the form keeps the chosen pass, its price and what it includes in view, with a ' +
            'box for a discount code.',
          ],
          mockup: 'abfweb-register',
          caption: 'The four-field registration form',
        },
        {
          title: 'Checkout: card, M-Pesa or USDC',
          body: [
            'Checkout offers two choices in plain words: pay by card in US dollars, or pay with M-Pesa or a ' +
            'stablecoin. The order summary stays on the right, with a link to change the pass if it is the ' +
            'wrong one.',
          ],
          mockup: 'abfweb-checkout',
          caption: 'Checkout: card, M-Pesa or USDC',
        },
        {
          title: 'Travel packages for visitors to Nairobi',
          body: [
            'Many attendees travel from abroad. Travel packages bundle flights, a hotel, the festival ticket ' +
            'and East African tours into one booking, reserved with a $500 deposit, and group bookings have ' +
            'a page of their own.',
          ],
          mockup: 'abfweb-travel',
          caption: 'Travel packages for visitors to Nairobi',
        },
      ],

      phones: {
        title: 'The site on a phone',
        body:
          'Every page was designed for a phone as well as a laptop, including the tickets page, the payment ' +
          'step and the Nairobi travel guide.',
        altLabel: 'website on a phone',
        items: [
          { mockup: 'abfweb-phone-tickets', caption: 'Choosing a pass' },
          { mockup: 'abfweb-phone-checkout', caption: 'Paying for a pass' },
          { mockup: 'abfweb-phone-guide', caption: 'The Nairobi travel guide' },
        ],
      },

      system: {
        title: 'The design system',
        body:
          'The festival’s 2026 brand is dark and bright: Electric Crimson for the main action, Solar Yellow ' +
          'for the second, and Prism Lilac and Neo Mint as accents, all on a near-black background. I set ' +
          'these up as colour and type styles in Figma and as matching global styles in Elementor, so the ' +
          'design and the live site use the same values.',
        swatches: [
          { name: 'Deep Obsidian', value: '#050007', note: 'page background' },
          { name: 'Electric Crimson', value: '#ef003d', note: 'the main action' },
          { name: 'Solar Yellow', value: '#fddb00', note: 'the second action' },
          { name: 'Prism Lilac', value: '#e1a2f1', note: 'highlights' },
          { name: 'Neo Mint', value: '#beffdc', note: 'card titles' },
          { name: 'Magenta', value: '#dc49e2', note: 'small labels' },
        ],
        type: {
          family: 'Povlar + Inter',
          note: 'Povlar sets headings, prices and buttons. Inter sets body text and forms, where it needs to be easy to read at small sizes.',
        },
        componentsLabel: 'Components from the live site',
        components: [
          { img: 'abfweb-stats', label: 'Festival numbers', w: 2000, h: 230, wide: true },
          { img: 'abfweb-reg-rail', label: 'Registration summary', w: 768, h: 830 },
          { img: 'abfweb-order', label: 'Order summary', w: 680, h: 540 },
          { img: 'abfweb-form', label: 'Registration form', w: 1680, h: 840, wide: true },
          { img: 'abfweb-pay-methods', label: 'Payment choices', w: 655, h: 505, wide: true },
        ],
        rulesLabel: 'Standards every page meets',
        rules: [
          'Crimson and yellow are kept for actions, so buttons are easy to find',
          'Every form field has a visible label, not only a placeholder',
          'Prices and payment choices are written in words, never shown by colour alone',
          'Every page is designed for a phone as well as a laptop',
        ],
      },
    },

    development: {
      lede:
        'The website runs on WordPress with Elementor. Every page is built on a staging copy of the site ' +
        'and moved to the live site only after it has been checked, so changes during ticket sales never ' +
        'break the live site. Behind the checkout is ABF Payments, a WordPress plugin I wrote in PHP. It ' +
        'holds the price of every pass, talks to Stripe and Minisend, records every payment and sends each ' +
        'sale to ABF Admin, the festival team’s dashboard.',

      flowTitle: 'How a pass is paid for',
      flowIntro: 'The six steps between a visitor choosing a pass and receiving their ticket. The solid boxes are code I wrote; the dashed boxes are the payment providers.',
      flowKey: { me: 'Code I wrote', other: 'Payment providers' },
      flow: [
        { label: 'Tickets page', sub: 'the chosen pass travels in the link', owner: 'me' },
        { label: 'Registration', sub: 'the pass is preselected on the server', owner: 'me' },
        { label: 'Checkout', sub: 'price read from the server, payment recorded', owner: 'me' },
        { label: 'Stripe or Minisend', sub: 'card, M-Pesa or USDC', owner: 'partner' },
        { label: 'Settle once', sub: 'by webhook or a check every five minutes', owner: 'me' },
        { label: 'Receipt and email', sub: 'and the sale sent to ABF Admin', owner: 'me' },
      ],

      treeTitle: 'Code organised like the checkout',
      treeIntro:
        'The plugin is a set of small files, each named after one job in the checkout, so a change to ' +
        'one payment provider never touches another.',
      tree: {
        root: 'abf-payments/includes/',
        items: [
          { name: 'passes.php', note: 'the price of every pass, in one place', file: true },
          { name: 'register.php · guards.php', note: 'the registration step, and passes with nothing to pay', file: true },
          { name: 'gateway-stripe.php · gateway-minisend.php', note: 'card, M-Pesa and USDC', file: true },
          { name: 'ledger.php', note: 'every payment, recorded before the buyer leaves', file: true },
          { name: 'reconcile.php · sweep.php', note: 'checks for payments nobody was told about', file: true },
          { name: 'receipt.php · fulfilment.php', note: 'the receipt page and the ticket email', file: true },
          { name: 'declines.php', note: 'what happens when a card is declined', file: true },
          { name: 'coupons.php · attribution.php', note: 'discount codes and tracking links', file: true },
        ],
        note: 'About 7,400 lines of PHP across 22 files.',
      },

      sections: [
        {
          title: 'One place for every price',
          body: [
            'Every pass and its price lives in one table on the server. A link can say which pass someone ' +
            'wants, but never what it costs, so nobody can change a price by editing the page. The previous ' +
            'price is stored too, so the site can show early-bird savings from the same numbers.',
          ],
          code: {
            file: 'abf-payments/includes/passes.php',
            lines: [
              ' * The pass registry — the ONLY source of price truth.',
              ' ...',
              "\t\t'professional' => array(",
              "\t\t\t'label'   => 'Professional Access',",
              "\t\t\t'usd'     => 249,",
              "\t\t\t'was'     => 350,",
              "\t\t\t'buyable' => true,",
              "\t\t\t'route'   => '',",
              '\t\t),',
            ],
          },
        },
        {
          title: 'A card payment priced on the server',
          body: [
            'When a buyer chooses to pay by card, the plugin opens a Stripe checkout for the amount in that ' +
            'table, or a discounted amount it worked out itself. The amount never comes from the browser. ' +
            'Each checkout carries a reference of the festival’s own, so the payment can be matched to its ' +
            'record whichever way the news of it arrives.',
          ],
          code: {
            file: 'abf-payments/includes/gateway-stripe.php',
            lines: [
              '\t$pass      = $passes[ $slug ];',
              "\t$reference = '' !== $external_id ? $external_id : 'abf-' . wp_generate_uuid4();",
              '\t// A coupon-adjusted figure when the caller computed one, the registry price',
              '\t// otherwise. Either way it was produced on this server, never sent by a browser.',
              '\t$charge    = ( null === $amount ) ? (float) $pass[\'usd\'] : round( (float) $amount, 2 );',
              '\t$cents     = (int) round( $charge * 100 );',
            ],
          },
        },
        {
          title: 'Every payment settled exactly once',
          body: [
            'A payment provider normally reports a payment by calling the site, but those calls can arrive ' +
            'late or not at all. So the plugin also asks Stripe and Minisend every five minutes about any ' +
            'payment still waiting. Both routes end in the same function, which ignores a payment that is ' +
            'already settled, so a buyer gets one ticket email whichever route confirms the payment first.',
          ],
          code: {
            file: 'abf-payments/includes/ledger.php',
            lines: [
              'function abf_pay_settle( $session_id, $status, $payload = null, $amounts = null, $event = \'\' ) {',
              '\t$row = abf_pay_ledger_get( $session_id );',
              '\tif ( ! $row ) {',
              "\t\treturn '';",
              '\t}',
              '',
              '\t// Already resolved. A late webhook after a poll (or the reverse) is normal',
              '\t// and must be a no-op, not a second fulfilment.',
              '\tif ( abf_pay_is_terminal( $row->status ) ) {',
              "\t\treturn '';",
              '\t}',
            ],
          },
        },
        {
          title: 'Telling buyers when a card is declined',
          body: [
            'Many banks send a debit alert for a declined card and reverse it a minute later, so a buyer can ' +
            'think they were charged when they were not. The plugin records every decline. The checkout ' +
            'page tells the buyer that no money was taken, the team is alerted straight away, and if the ' +
            'buyer has still not paid thirty minutes later they get an email to help them finish.',
          ],
          code: {
            file: 'abf-payments/includes/declines.php',
            lines: [
              ' * This file records the decline against the ledger row (by the reference we put in',
              ' * the PaymentIntent metadata), then does three things with it:',
              ' *   1. /pay/ tells a buyer who comes back from Stripe that no money was taken;',
              ' *   2. the team is told at once, so an ambassador can reach out first;',
              ' *   3. if the reference is still unpaid 30 minutes later, the buyer is emailed —',
            ],
          },
        },
      ],

      suitesTitle: 'Keeping payments safe',
      suitesIntro: 'The plugin has no automated test suite. These are the safeguards built into it instead.',
      suites: [
        { icon: 'layers', title: 'Staging first', text: 'Every page and plugin change is built and checked on a staging copy of the site before it reaches the live site.' },
        { icon: 'shield', title: 'Signed notifications', text: 'A payment notification is accepted only when its signature checks out, and each one is acted on once.' },
        { icon: 'clock', title: 'Five-minute checks', text: 'Payments nobody has heard about are checked with the provider every five minutes, and abandoned ones are marked every hour.' },
        { icon: 'file', title: 'Secrets kept out of the code', text: 'Payment keys live in the server’s configuration, never in the plugin, so nothing secret is deployed with it.' },
      ],

      quality: [
        { value: '22', label: 'PHP files, each with one job in the checkout' },
        { value: '5 min', label: 'between checks for payments still waiting' },
        { value: '3', label: 'languages from the same page templates: English, French and Swahili' },
      ],

      splitTitle: 'My contribution',
      splitIntro: 'I was responsible for the design and the build of the website, and for the payments plugin behind its checkout.',
      split: {
        bothMine: true,
        mineLabel: 'What I designed',
        partnerLabel: 'What I built',
        mine: ['The page structure and responsive layouts in Figma', 'The separate sponsor and ticket journeys', 'The tickets page, the four-field form and checkout', 'The colour and type styles in Figma'],
        partner: ['The WordPress and Elementor site, in three languages', 'The staging copy and the checks before each release', 'The ABF Payments plugin in PHP, with Stripe and Minisend', 'The feed of sales into ABF Admin'],
      },
    },

    outcomeLabel: 'The result',
    outcome:
      'I was retained for the 2026 edition after the first launch. The festival has secured more ' +
      'than $160,000 in sponsorship, with the website used throughout its partner outreach. ' +
      'For 2026 the site also takes payment itself, in the currency and payment method each attendee uses, ' +
      'and publishes 80 speakers and 59 agenda sessions from the same content structure.',
  },

  {
    // BMONI: three sites, all Sammy's (corrected 2026-11-07): bmoni.com is the
    // one-screen global gateway, bmoni.ng the Nigeria site, bmoni.mx the Mexico
    // site (Spanish at /, English at /mx/). Screens captured from the live sites.
    slug: 'bmoni',
    kind: 'product',
    website: true,
    seoTitle: 'BMONI: fintech website design and WordPress build for Nigeria and Mexico | Sammy Fash',
    seoDescription: 'Design and WordPress development of BMONI’s three websites: a global gateway at bmoni.com, a consumer site for Nigeria and a bilingual business site for Mexico, on one design system.',
    name: 'BMONI',
    title: 'BMONI: like your bank, but smarter',
    colour: '#e879f9',
    live: 'https://bmoni.com/',
    liveLabel: 'bmoni.com',
    year: '2025–2026',
    client: 'BMONI · BKEY Inc.',
    timeline: { span: 'Nigeria first, then Mexico and the global gateway', label: '2025–2026' },
    location: 'Nigeria · Mexico · remote',
    role: 'Web design · Product design · WordPress development',
    team: 'I designed all three websites in Figma and built them in WordPress and Elementor: bmoni.com, bmoni.ng and bmoni.mx.',
    services: [
      { label: 'Web design', icon: 'pen' },
      { label: 'Product design', icon: 'design' },
      { label: 'WordPress development', icon: 'code' },
      { label: 'Multi-market sites', icon: 'layers' },
    ],
    stack: ['Figma', 'WordPress', 'Elementor'],
    card: 'bmoni',
    cardAlt: 'bmoni.com, the global gateway, on a laptop',
    cardTag: {
      design: 'Web design · Product design',
      development: 'WordPress · Elementor',
      web: 'Figma · WordPress',
    },
    cardSize: [1400, 939],

    intro:
      'BMONI lets people and businesses hold, swap, spend and send money in several currencies from one ' +
      'app, through licensed financial partners. I designed and built its three websites: bmoni.com, the ' +
      'global front door, a site for customers in Nigeria, and a bilingual site for businesses in Mexico.',

    impact: [
      { icon: 'chart', value: '$1B+', unit: 'processed', text: 'on the BMONI platform since the website launched, as reported by BMONI.' },
      { icon: 'users', value: '~100K', unit: 'visits a day', text: 'to BMONI’s websites, as reported by BMONI, from people deciding whether to trust it with their money.' },
      { icon: 'layers', value: '3', unit: 'websites', text: 'on one design system: the global gateway, Nigeria in English and Mexico in Spanish and English.' },
    ],

    hero: {
      laptop: 'bmoni-hero',
      alt: 'bmoni.com, the global gateway, on a laptop in an apartment at dusk',
      caption: 'bmoni.com, the global gateway',
    },

    design: {
      lede:
        'BMONI launched in Nigeria for individuals, freelancers and families, then in Mexico for businesses ' +
        'that run payroll and pay suppliers abroad. The two markets have different customers, a different ' +
        'language and a different offer, but both had to feel like the same trustworthy company. BMONI is ' +
        'also not a bank, so before anyone downloads the app the website has to explain plainly who holds ' +
        'their money and how it is protected. I designed one system that could carry all of that, then ' +
        'used it to build a full site for each market and a single screen at bmoni.com that sends every ' +
        'visitor to the right one.',

      research: {
        title: 'What shaped the sites',
        intro: 'Four problems decided how the three sites are split and what each page has to say.',
        items: [
          { icon: 'users', title: 'Two markets with very different customers', text: 'In Nigeria, BMONI serves people: freelancers paid in dollars, families supporting relatives abroad, travellers. In Mexico it serves businesses running payroll, paying suppliers and issuing tax invoices. One page could not speak to both, so each market has its own site, its own offer and its own call to action.' },
          { icon: 'shield', title: 'Trust comes before the download', text: 'People are being asked to keep their money in an app that is not a bank. Every site says so in plain words, names the licensed partners behind the service, explains the facial recognition used for every login and payment, and gives security a page of its own.' },
          { icon: 'link', title: 'Visitors don’t know which BMONI they need', text: 'Someone arriving from an ad or a search may not know that BMONI runs a separate service in each country. bmoni.com is one screen with a map of where BMONI is live and where it is coming next, and a button for each market.' },
          { icon: 'message', title: 'Mexican businesses read in Spanish', text: 'A finance manager in Mexico expects to read about payroll, SPEI transfers and CFDI invoices in Spanish. bmoni.mx opens in Spanish with English one click away, and search engines are told which language and country each page is for.' },
        ],
      },

      personasTitle: 'Who it’s for',
      personasIntro:
        'BMONI is for people and businesses whose money crosses borders. They all want the same thing, ' +
        'moving money quickly and cheaply without worrying about it, but each arrives with a different job to do.',
      personas: [
        { icon: 'code', name: 'Freelancers and remote workers', context: 'Paid by clients abroad and want to keep their earnings in dollars.', jobs: ['Open NGN and USD virtual accounts', 'Swap currencies in seconds', 'Spend online with a virtual card'] },
        { icon: 'users', name: 'Families and students abroad', context: 'Support someone in another country, or study away from home.', jobs: ['Send money to bank accounts abroad', 'Manage money in six currencies', 'Know the money is protected'] },
        { icon: 'store', name: 'Businesses in Mexico', context: 'Run payroll and pay suppliers in more than one currency.', jobs: ['Hold MXN, USD and EUR in one place', 'Pay payroll, suppliers and SAT obligations', 'Book a demo with the BMONI team'] },
        { icon: 'card', name: 'Travellers', context: 'Want to spend abroad without carrying cash or paying high fees.', jobs: ['Use a virtual or physical Mastercard', 'Pay at over 100 million merchants', 'Top up a USD wallet by bank transfer or stablecoin'] },
      ],

      principlesTitle: 'The principles behind every decision',
      principlesIntro: 'I set these at the start, and they settled most decisions across all three sites.',
      principles: [
        { title: 'One brand, many markets', text: 'Every market uses the same colours, type, buttons and sections. A new market changes its words, photos and offer, not the design, so BMONI looks like one company wherever you meet it.' },
        { title: 'Show the real product', text: 'The pages use real app screens and the real cards instead of abstract illustrations, so visitors can see exactly what they would be using before they download it.' },
        { title: 'Say who holds the money', text: 'Every site states that BMONI is a financial technology company, not a bank, and names the licensed partners that provide the banking, in the security page, the FAQ and the footer.' },
        { title: 'One clear action per market', text: 'In Nigeria every page ends with Download Now. In Mexico, where the customer is a business, every page ends with a request for a demo.' },
        { title: 'Show the people BMONI serves', text: 'The photography shows the customers in each market, young Nigerians in Lagos and business owners in Mexico, so visitors can picture themselves using it.' },
      ],

      ia: {
        title: 'How the sites are organised',
        intro:
          'bmoni.com is a single screen that sends visitors to their market. Each market site then has its ' +
          'own menu, built from the same sections: what BMONI offers, who it is for, how it keeps money safe ' +
          'and who is behind it.',
        consoleLabel: 'bmoni.ng, Nigeria',
        console: ['Products: wallets, cards, conversion and transfers', 'Use Cases: salaries, freelancers, families, travel', 'Security', 'News', 'About Us', 'Help Desk'],
        attendeeLabel: 'bmoni.mx, Mexico',
        attendeeIcon: 'store',
        attendee: ['Soluciones: treasury, payroll, invoicing', 'Casos de uso: payroll, SMEs, importers, freelancers', 'Seguridad', 'Sobre nosotros', 'Español or English, one click apart'],
        tabbar: 'bmoni-gateway-desk',
        tabbarSize: [1440, 900],
        tabbarCaption: 'bmoni.com: where BMONI is live and coming next',
      },

      screensTitle: 'Key pages across the three sites',
      screensIntro: 'The pages that explain BMONI, earn a visitor’s trust and ask them to act, in each market.',
      screens: [
        {
          title: 'One front door for every market',
          body: [
            'bmoni.com is a single screen. It says what BMONI is, shows a map of where it is live and where ' +
            'it is coming next, and gives each market its own button. When BMONI launches somewhere new, the ' +
            'map gains a live pin and the page gains a button.',
          ],
          mockup: 'bmoni-gateway',
          caption: 'bmoni.com, the global gateway',
        },
        {
          title: 'Products explained in everyday terms',
          body: [
            'The Nigeria products page takes the app one feature at a time: wallets in six currencies, virtual ' +
            'and physical cards, currency conversion in seconds and transfers abroad. Each feature is described ' +
            'by what it lets you do, next to a real screen from the app.',
          ],
          mockup: 'bmoni-products',
          caption: 'Products on bmoni.ng',
        },
        {
          title: 'A page for each kind of customer',
          body: [
            'Use Cases speaks to each customer directly: salaries paid into dollar wallets, freelancers with ' +
            'clients in London, families supporting someone abroad, travellers spending at over 100 million ' +
            'merchants. Visitors find their own situation instead of a generic feature list.',
          ],
          mockup: 'bmoni-use-cases',
          caption: 'Use cases on bmoni.ng',
        },
        {
          title: 'Security as a page of its own',
          body: [
            'Because BMONI is not a bank, security gets its own page. It explains the facial recognition ' +
            'behind every login and payment, the 22 patents behind it, and the licensed partners that hold ' +
            'and move the money.',
          ],
          mockup: 'bmoni-security',
          caption: 'Security on bmoni.ng',
        },
        {
          title: 'Mexico: a treasury platform, in Spanish',
          body: [
            'The Mexico homepage speaks to businesses. It opens with the BMONI Business dashboard and the card, ' +
            'describes treasury in MXN, USD and EUR, payroll and supplier payments, and asks for a demo instead ' +
            'of a download.',
          ],
          mockup: 'bmoni-mx-home',
          caption: 'The bmoni.mx homepage',
        },
        {
          title: 'Solutions for Mexican companies',
          body: [
            'Soluciones covers what a finance team needs day to day: wallets with their own account details, ' +
            'SPEI transfers, CFDI invoices that comply with the SAT, payroll and business cards, all from one ' +
            'dashboard.',
          ],
          mockup: 'bmoni-mx-products',
          caption: 'Soluciones on bmoni.mx',
        },
      ],


      system: {
        title: 'The design system',
        body:
          'BMONI’s sites are dark and warm: deep plum backgrounds, a bright magenta for every button, and ' +
          'orchid for the one word in each headline that matters most. I set these up as global colours and ' +
          'type in Elementor, so all three sites draw from the same values.',
        swatches: [
          { name: 'Deep Plum', value: '#270a26', note: 'page background' },
          { name: 'Magenta', value: '#b001b0', note: 'buttons' },
          { name: 'Orchid', value: '#c94cd7', note: 'the accent word in headlines' },
          { name: 'Pink Mist', value: '#eaaee8', note: 'labels and highlights' },
          { name: 'White', value: '#ffffff', note: 'text on dark' },
          { name: 'Blush', value: '#f7e6f7', note: 'light sections' },
        ],
        type: {
          family: 'Poppins + Raleway',
          note: 'Poppins sets headlines, buttons and body text. Raleway sets small labels and the FAQ.',
        },
        componentsLabel: 'Components from the live sites',
        components: [
          { img: 'bmoni-audience', label: 'Who it’s for, as a carousel', w: 1260, h: 600, wide: true },
          { img: 'bmoni-checklist', label: 'What you get, as a checklist', w: 550, h: 590, wide: true },
          { img: 'bmoni-safety', label: 'Security in three cards', w: 1060, h: 725, wide: true },
          { img: 'bmoni-steps', label: 'Three steps to start', w: 1240, h: 720, wide: true },
        ],
        rulesLabel: 'Standards every page meets',
        rules: [
          'Magenta is kept for actions, so the next step is always easy to find',
          'One accent word per headline, never more',
          'Every claim about money names who provides the service',
          'Every page is designed for a phone first',
        ],
      },
    },

    development: {
      lede:
        'All three sites run on WordPress with Elementor Pro, on the Hello Elementor theme. They share one ' +
        'set of global colours, type and sections, and each market is its own WordPress site on its own ' +
        'domain, so Nigeria and Mexico can change their offer, language and news without touching each other.',

      flowTitle: 'How a visitor reaches the right BMONI',
      flowIntro: 'The path from a first visit to signing up. The solid boxes are the sites I built; the dashed boxes are where BMONI’s app and sales team take over.',
      flowKey: { me: 'Sites I built', other: 'The app and the sales team' },
      flow: [
        { label: 'bmoni.com', sub: 'the map, and a button per market', owner: 'me' },
        { label: 'bmoni.ng or bmoni.mx', sub: 'the right country and language', owner: 'me' },
        { label: 'Products and use cases', sub: 'what BMONI does for you', owner: 'me' },
        { label: 'Security and FAQ', sub: 'who holds the money', owner: 'me' },
        { label: 'Download or book a demo', sub: 'one action per market', owner: 'me' },
        { label: 'The app or the sales team', sub: 'sign-up and onboarding', owner: 'partner' },
      ],

      treeTitle: 'Three sites, one system',
      treeIntro: 'Each domain is its own WordPress site, built from the same parts so they stay consistent.',
      tree: {
        root: 'bmoni.com · bmoni.ng · bmoni.mx',
        items: [
          { name: 'Global colours and type', note: 'the same Elementor values on every site' },
          { name: 'Header and footer templates', note: 'the market switch, menu and legal note' },
          { name: 'Section library', note: 'hero, feature list, who it’s for, three steps, FAQ' },
          { name: 'bmoni.com', note: 'one screen: the map and a button per market' },
          { name: 'bmoni.ng', note: 'Products, Use Cases, Security, News, About, Help Desk' },
          { name: 'bmoni.mx', note: 'Spanish at the root, English under /mx/' },
        ],
        note: 'WordPress, Elementor Pro and the Hello Elementor theme on all three.',
      },

      sections: [
        {
          title: 'Telling search engines which site is which',
          body: [
            'Three domains and two languages could easily compete with each other in search results. Every ' +
            'page declares its alternatives, so Google sends Nigerians to bmoni.ng, Spanish speakers in Mexico ' +
            'to bmoni.mx, English speakers in Mexico to its English pages, and everyone else to bmoni.com.',
          ],
          code: {
            file: 'bmoni.com · <head>',
            lines: [
              '<link rel="alternate" hreflang="en-ng" href="https://bmoni.ng/" />',
              '<link rel="alternate" hreflang="es-mx" href="https://bmoni.mx/" />',
              '<link rel="alternate" hreflang="en-mx" href="https://bmoni.mx/mx/" />',
              '<link rel="alternate" hreflang="en" href="https://bmoni.com/" />',
              '<link rel="alternate" hreflang="x-default" href="https://bmoni.com/" />',
            ],
          },
        },
        {
          title: 'One set of global styles',
          body: [
            'Colours and type are Elementor global values, not settings on each widget. Every heading, button ' +
            'and section reads from them, so a change to the brand is made once and reaches every page on every site.',
          ],
          code: {
            file: 'bmoni.ng · Elementor kit',
            lines: [
              '--e-global-color-primary: #270A26;',
              '--e-global-color-secondary: #C94CD7;',
              '--e-global-color-text: #FFFFFF;',
              '--e-global-color-accent: #EAAEE8;',
              '--e-global-typography-primary-font-family: "Poppins";',
              '--e-global-typography-secondary-font-family: "Raleway";',
            ],
          },
        },
        {
          title: 'Spanish first, English one click away',
          body: [
            'In Mexico the Spanish site lives at the root of bmoni.mx and the English version under /mx/, with ' +
            'a switch in the header. Both use the same templates, so a new section is designed once and ' +
            'translated, not rebuilt.',
          ],
        },
      ],

      splitTitle: 'My contribution',
      splitIntro: 'I was responsible for the design and the build of all three BMONI websites.',
      split: {
        bothMine: true,
        mineLabel: 'What I designed',
        partnerLabel: 'What I built',
        mine: ['The design system: colours, type and sections', 'bmoni.com, the global gateway with its market map', 'The Nigeria site for individuals and freelancers', 'The Mexico site for businesses, in Spanish and English', 'Layouts for phone and desktop'],
        partner: ['Three WordPress and Elementor sites on three domains', 'Global colours and type shared across the sites', 'Header and footer templates with the market switch', 'The language and country tags for search engines', 'The demo request and contact forms'],
      },
    },

    outcomeLabel: 'The result',
    outcome:
      'BMONI reports more than $1 billion processed on its platform since the website launched, and ' +
      'roughly 100,000 visits a day to its websites. Mexico launched on the same system, in Spanish and ' +
      'English, without a separate redesign, and bmoni.com is ready to send visitors to the USA, Europe and ' +
      'Southeast Asia as each market goes live.',
  },

  {
    // ETHSafari: all design and build Sammy's (confirmed 2026-11-08). Screens
    // captured from the live ethsafari.xyz with the Safari AI chat bubble hidden.
    // Facts from ~/ETH Safari/docs (design system, native Elementor builds,
    // Aug 2026 application pages, postponement updates).
    slug: 'ethsafari',
    kind: 'product',
    website: true,
    seoTitle: 'ETHSafari: event website design, design system and Elementor build | Sammy Fash',
    seoDescription: 'Design system, website design and native Elementor build for ETHSafari, a nine-day Ethereum event that travels from Nairobi to Kilifi.',
    name: 'ETHSafari',
    title: 'ETHSafari: the watering hole for web3',
    colour: '#22c55e',
    live: 'https://ethsafari.xyz/',
    liveLabel: 'ethsafari.xyz',
    year: '2026',
    client: 'ETHSafari',
    timeline: { span: 'The fifth-anniversary edition', label: '2026' },
    location: 'Nairobi → Kilifi, Kenya · remote',
    role: 'Web design · Art direction · WordPress development',
    team: 'I set the art direction, designed the site and its design system in Figma, and built every page natively in WordPress and Elementor.',
    services: [
      { label: 'Web design', icon: 'pen' },
      { label: 'Art direction', icon: 'design' },
      { label: 'Design system', icon: 'layers' },
      { label: 'WordPress development', icon: 'code' },
    ],
    stack: ['Figma', 'WordPress', 'Elementor'],
    card: 'ethsafari',
    cardAlt: 'The ETHSafari website on a desktop monitor',
    cardTag: {
      design: 'Web design · Art direction',
      development: 'WordPress · Elementor',
      web: 'Figma · WordPress',
    },
    cardSize: [1400, 819],

    intro:
      'ETHSafari is a nine-day Ethereum event that travels from Nairobi to the Kenyan coast at Kilifi, ' +
      'with a train ride, the Blocktrain, in between. For its fifth-anniversary edition I set a new art ' +
      'direction, built a design system in Figma and rebuilt the website natively in WordPress and Elementor.',

    impact: [
      { icon: 'users', value: '3,000+', unit: 'attendees', text: 'at ETHSafari’s most recent edition, as reported by the organisers: the builders and founders this site has to win over.' },
      { icon: 'megaphone', value: '150+', unit: 'speakers', text: 'across nine days from Nairobi to the coast, presented on a speakers page the team can update themselves.' },
      { icon: 'calendar', value: '5', unit: 'editions', text: 'of ETHSafari since 2022, told on one site, with every past programme kept online for new attendees and sponsors.' },
    ],

    hero: {
      laptop: 'eth-hero',
      alt: 'The ETHSafari homepage on a laptop at a beach lodge in Kilifi',
      caption: 'The homepage, at a beach lodge in Kilifi',
    },

    design: {
      lede:
        'Most crypto conferences look the same: dark backgrounds, neon gradients and glowing 3D shapes. ' +
        'ETHSafari is different. It moves across Kenya for nine days, from a bootcamp in Nairobi, onto a ' +
        'train, to a festival on the coast, and it has a sense of humour about itself. The website had to ' +
        'feel like that journey, sell sponsorship and applications for an edition whose dates were still ' +
        'changing, and stay easy for a small team to update in the weeks before opening day.',

      research: {
        title: 'What shaped the site',
        intro: 'Four problems decided the look of the site and how it is put together.',
        items: [
          { icon: 'eye', title: 'Crypto events all look alike', text: 'Dark pages with neon gradients are the default for web3 events, so a visitor can’t tell one from another. I tried that direction first and set it aside. ETHSafari now has a bright, flat look of its own: cream paper, heavy ink outlines, hard shadows and one strong magenta.' },
          { icon: 'link', title: 'The journey is the product', text: 'People aren’t buying a seat in a hall. They are signing up for nine days that move from Nairobi to Kilifi by train. So the route leads the homepage, with each stop, its coordinates and what happens there, before the programme and the ways to take part.' },
          { icon: 'clock', title: 'Plans change close to the event', text: 'Speakers, sessions and even dates move right up to opening day. When the 2026 edition was postponed, every date on the site changed to TBA and every ticket button became a link to support the event, in eighteen small edits, without rebuilding a page.' },
          { icon: 'users', title: 'More ways to take part than a ticket', text: 'Vendors, volunteers and startups all want a place on the journey. Each now has its own page with a short application form, so the team receives applications in one inbox instead of scattered messages.' },
        ],
      },

      personasTitle: 'Who it’s for',
      personasIntro:
        'ETHSafari brings together everyone building Ethereum in Africa. They all want to be part of the ' +
        'journey, but each comes to the site with a different question.',
      personas: [
        { icon: 'code', name: 'Builders and founders', context: 'Want to learn, ship and meet the people who can help them grow.', jobs: ['See the route and what happens at each stop', 'Find the hackathon and workshops', 'Follow the schedule on Sola Day'] },
        { icon: 'megaphone', name: 'Speakers', context: 'Want a stage in front of Africa’s Ethereum community.', jobs: ['See who has spoken before', 'Understand the session formats', 'Apply to speak'] },
        { icon: 'chart', name: 'Sponsors and partners', context: 'Decide whether to put their name on the journey.', jobs: ['See five years of past partners', 'Understand the audience', 'Support the event on Artizen'] },
        { icon: 'store', name: 'Vendors, volunteers and startups', context: 'Want a role on the journey beyond a ticket.', jobs: ['Find the right application page', 'Apply in a few minutes', 'Know what happens next'] },
      ],

      principlesTitle: 'The principles behind every decision',
      principlesIntro: 'I set these at the start, and they settled most decisions on the site.',
      principles: [
        { title: 'Bright and flat, never neon', text: 'Cream paper, ink outlines and hard shadows with no blur. No gradients, no glass and no 3D, so ETHSafari never looks like another crypto conference.' },
        { title: 'The route leads', text: 'Nairobi, the Blocktrain and Kilifi structure the homepage, the schedule and the social posts, so the journey is the first thing people understand.' },
        { title: 'Say it with a wink', text: 'The site keeps the event’s own humour, in lines like “Gas: low · Vibes: high” and “Karibu, everyone rides the Blocktrain”, so it sounds like ETHSafari and not a template.' },
        { title: 'One action per page', text: 'Each page asks for one thing: support the event, apply to speak, or start an application. The button always says exactly what happens next.' },
        { title: 'The team edits content, not code', text: 'Every page is built from Elementor’s own widgets and the site’s global styles, so the team can change any word, photo or link without a developer.' },
      ],

      ia: {
        title: 'How the site is organised',
        intro:
          'A short main menu covers what most visitors come for: the event, its speakers, the schedule and ' +
          'a way to get in touch. The three application pages sit in their own footer column, and the ' +
          'support button stays in the top corner of every page.',
        consoleLabel: 'Main menu',
        console: ['Home: the route, the five years and ways to join', 'Speakers: past voices and the call for speakers', 'Schedule: the plan, and Sola Day for live updates', 'Contact'],
        attendeeLabel: 'Taking part',
        attendeeIcon: 'store',
        attendee: ['Support us on Artizen, in the header of every page', 'Vendors: sell on the Safari floor', 'Volunteers: run the Safari from the inside', 'Startup booth: put your startup in front of the herd'],
        tabbar: 'eth-home-desk',
        tabbarSize: [1440, 900],
        tabbarCaption: 'The homepage on desktop, with the main menu and the support button',
      },

      screensTitle: 'Key pages on the site',
      screensIntro: 'The pages that tell ETHSafari’s story and ask people to take part, in the order most visitors meet them.',
      screens: [
        {
          title: 'Speakers: five years of voices',
          body: [
            'The speakers page celebrates everyone who has taken the stage over five editions, from founders ' +
            'to community leaders, and closes with the 2026 call for speakers and a short form to apply.',
          ],
          mockup: 'eth-speakers',
          caption: 'Speakers: five years of voices',
        },
        {
          title: 'A schedule that can change',
          body: [
            'The schedule explains the shape of the week, talks, workshops, hackathons, the Blocktrain and the ' +
            'coastal festival, while the full programme is published in phases. For live updates during the ' +
            'event it sends attendees to Sola Day, where they can RSVP and follow sessions, and keeps past ' +
            'schedules one click away.',
          ],
          mockup: 'eth-schedule',
          caption: 'The schedule, with Sola Day for live updates',
        },
        {
          title: 'A page for vendors',
          body: [
            'Vendors get a page that speaks their language: nine days, five stops and thousands of builders, ' +
            'founders and travellers to sell to. The application form asks only what the team needs to say yes.',
          ],
          mockup: 'eth-vendors',
          caption: 'Applying as a vendor',
        },
        {
          title: 'Startup booths in front of the herd',
          body: [
            'The startup booth page sells the exhibition floor as the place where investors, customers and ' +
            'talent meet, and walks a founder through the application step by step.',
          ],
          mockup: 'eth-startup',
          caption: 'Applying for a startup booth',
        },
        {
          title: 'Volunteers who keep it running',
          body: [
            'Volunteers are the reason the Blocktrain leaves on time. Their page lists the teams they can join, ' +
            'from logistics and the stage to hospitality and media, before the application form.',
          ],
          mockup: 'eth-volunteers',
          caption: 'Applying to volunteer',
        },
        {
          title: 'Getting in touch with the team',
          body: [
            'Questions, partnerships, side events and press all start on one contact page, with a promise that ' +
            'the team will reply as soon as possible.',
          ],
          mockup: 'eth-contact',
          caption: 'The contact page',
        },
      ],


      system: {
        title: 'The design system',
        body:
          'ETHSafari’s look is flat neo-brutalist: cream paper, near-black ink outlines, hard offset shadows ' +
          'with no blur, and magenta as the one loud colour, with plum for dark sections. In Figma I built it as ' +
          '18 base colours, 26 named colour roles, 19 text styles and three hard-shadow styles, then set up the ' +
          'same colours and type as global styles in Elementor.',
        swatches: [
          { name: 'Paper', value: '#fbf7f2', note: 'page background' },
          { name: 'Ink', value: '#0d0a12', note: 'outlines and hard shadows' },
          { name: 'Magenta', value: '#f330e2', note: 'the brand colour and buttons' },
          { name: 'Plum', value: '#2b0a28', note: 'dark sections and headings' },
          { name: 'Amber', value: '#ffb247', note: 'highlights' },
          { name: 'Pink tint', value: '#fce3f7', note: 'pale surfaces' },
        ],
        type: {
          family: 'Poppins + Archivo + IBM Plex Mono',
          note: 'Poppins Black sets the headlines, Archivo sets body text, and IBM Plex Mono sets the small technical labels and coordinates.',
        },
        componentsLabel: 'Components from the live site',
        components: [
          { img: 'eth-route', label: 'The route, stop by stop', w: 1240, h: 525, wide: true },
          { img: 'eth-involved', label: 'Three ways to take part', w: 1370, h: 665, wide: true },
          { img: 'eth-years', label: 'Five years as a timeline', w: 1340, h: 1020, wide: true },
          { img: 'eth-offerings', label: 'What’s inside, in a dark section', w: 1340, h: 894, wide: true },
        ],
        rulesLabel: 'Standards every page meets',
        rules: [
          'Every shadow is hard, with no blur',
          'Magenta is kept for actions and one word per headline',
          'Every page is built from Elementor’s own widgets, with no HTML widgets',
          'Every page is designed for a phone as well as a laptop',
        ],
      },
    },

    development: {
      lede:
        'The site runs on WordPress with Elementor Pro. Every page is built on a staging copy first, then ' +
        'pushed to the live site through a review-and-approve step, so nothing reaches visitors unchecked. ' +
        'Each page is made from Elementor’s own widgets and bound to the site’s global colours and type, ' +
        'with a small amount of scoped CSS only for the effects Elementor has no setting for.',

      flowTitle: 'How a change reaches the live site',
      flowIntro: 'The path every page and every edit takes. The solid boxes are the steps I own; the dashed box is the organisers’ approval.',
      flowKey: { me: 'Steps I own', other: 'The organisers' },
      flow: [
        { label: 'Design in Figma', sub: 'from the design system', owner: 'me' },
        { label: 'Build on staging', sub: 'native Elementor widgets', owner: 'me' },
        { label: 'Check every page', sub: 'widget counts, styles, phone sizes', owner: 'me' },
        { label: 'Push for review', sub: 'changes wait for approval', owner: 'me' },
        { label: 'Organisers approve', sub: 'in the live site’s admin', owner: 'partner' },
        { label: 'Live on ethsafari.xyz', sub: 'checked again after release', owner: 'me' },
      ],

      treeTitle: 'Built from Elementor’s own parts',
      treeIntro: 'Every page shares the same header, footer and global styles, so a change in one place reaches the whole site.',
      tree: {
        root: 'ethsafari.xyz',
        items: [
          { name: 'Global colours and type', note: 'every heading, button and section reads from them' },
          { name: 'Header template', note: 'the ticker, the menu and the support button' },
          { name: 'Footer template', note: 'the menus, including the Apply column' },
          { name: 'Home', note: 'the route, five years, ways to join' },
          { name: 'Speakers · Schedule · Contact', note: 'the main menu pages' },
          { name: 'Vendors · Volunteers · Startup booth', note: 'application pages with Elementor forms' },
        ],
        note: 'Real WordPress menus throughout, so the team edits navigation in one place.',
      },

      sections: [
        {
          title: 'Native widgets, not pasted HTML',
          body: [
            'A design this distinctive is easy to rebuild as one big block of HTML, but then nobody can edit it ' +
            'in Elementor. Every page is made from real headings, text, buttons, images and menus instead. When ' +
            'it was first built, the homepage alone was 93 containers and 109 headings, with no HTML widgets at all.',
          ],
        },
        {
          title: 'Brand values the whole site reads',
          body: [
            'The page maps Elementor’s global colours and fonts to short names once, and every section uses ' +
            'those names. Changing the magenta in the site settings changes it everywhere.',
          ],
          code: {
            file: 'Homepage · scoped CSS',
            lines: [
              '--mag: var(--e-global-color-primary);',
              '--ink: var(--e-global-color-ethnd3010);',
              '--fd:  var(--e-global-typography-primary-font-family);',
            ],
          },
        },
        {
          title: 'Postponing without a rebuild',
          body: [
            'When the 2026 edition was postponed, every date had to become TBA and every ticket button had to ' +
            'point to Artizen instead. I made eighteen small edits to the existing widgets, changing only their ' +
            'words and links, so every page kept its styles and stayed fully editable.',
          ],
        },
        {
          title: 'Getting blocked scripts running again',
          body: [
            'The chat assistant worked on staging but not on the live site. The cause was a security rule in ' +
            'the live server’s configuration that blocked every outside script, which had also silently stopped ' +
            'the site’s analytics. Listing the trusted sources brought back the chat, Google Tag Manager and ' +
            'site statistics, with no errors in the console.',
          ],
        },
      ],

      splitTitle: 'My contribution',
      splitIntro: 'I was responsible for the art direction, the design and the build of the website.',
      split: {
        bothMine: true,
        mineLabel: 'What I designed',
        partnerLabel: 'What I built',
        mine: ['The art direction: bright, flat and neo-brutalist', 'The design system in Figma', 'The homepage, speakers, schedule and contact pages', 'The vendor, volunteer and startup booth pages', 'Layouts for phone and desktop'],
        partner: ['Every page natively in WordPress and Elementor', 'Global colours, type, header and footer templates', 'The application forms, sent to the team’s inbox', 'The staging copy and the review step before release', 'The postponement updates and the live-site fixes'],
      },
    },

    outcomeLabel: 'The result',
    outcome:
      'ETHSafari has a look nobody would mistake for another crypto conference, and a site its team can run ' +
      'themselves. When plans changed, the site changed with them without a rebuild, and vendors, volunteers and ' +
      'startups now apply through pages of their own instead of scattered messages.',
  },

  // DRAFT until screens exist. There is no demo mode in the app and no iOS
  // build on disk; sign-in is Firebase-only. Route to screenshots: build the
  // simulator app from ios/ABF 2026.xcworkspace, point tenant.config.json
  // apiBase at a local Soravya seeded with `npm run seed:dev`, and sign in as a
  // Firebase test user whose email is on the Meridian roster.
  {
    slug: 'abf-mobile-app',
    draft: true,
    kind: 'product',
    kindLabel: 'Mobile app',
    seoTitle: 'ABF 2026 attendee app: mobile product design and React Native | Sammy Fash',
    seoDescription: 'Product design and React Native front end for the Africa Blockchain Festival 2026 attendee app, built on the Soravya platform.',
    name: 'ABF 2026 attendee app',
    title: 'The Africa Blockchain Festival 2026 attendee app',
    colour: '#fddb00',
    year: '2026',
    client: 'Africa Blockchain Festival · on the Soravya platform',
    location: 'Nairobi, Kenya',
    role: 'Product designer and mobile front-end developer',
    team: 'Two-person team. I designed the app and built its screens, design system port, onboarding, sign-in and audio player. My engineering partner built the native shell, tenancy and release tooling.',
    services: ['Mobile Product Design', 'Design System', 'React Native Development'],
    stack: ['Figma', 'React Native 0.87', 'React 19', 'TypeScript', 'Firebase', 'Jest'],
    card: 'abf-mobile-app',
    cardAlt: 'The ABF 2026 attendee app on two phones',
    cardTag: { design: 'Mobile product design', development: 'React Native · TypeScript' },
    shots: { screen: 0, mobile: 8 },
    intro:
      'A native iOS and Android app for Africa Blockchain Festival 2026 at the Sarit Expo ' +
      'Centre in Nairobi. Attendees use it for the programme, a personal agenda with clash ' +
      'warnings, side events, opt-in networking and meetings, their ticket and recorded ' +
      'sessions. It runs on the same API as the Soravya web platform.',
    metrics: [
      { value: '22', label: 'native screens, with a web view used only for the live stream and the recorder' },
      { value: '5 tabs', label: 'Home, Program, People, Meetings and Profile; disabled features are removed, not greyed out' },
      { value: '17', label: 'Jest test files; mocks cover platform modules only, never the app’s own logic' },
    ],
    hero: { mobile: 1 },
    design: {
      lede:
        'At a venue, the phone is in one hand and the signal comes and goes. The app had to ' +
        'work in that setting, then carry the festival’s brand without letting it override ' +
        'legibility.',
      sections: [
        {
          title: 'The organiser’s brand, made safe',
          body: [
            'The accent, dark tone, hero gradient and logo arrive from the server at runtime. ' +
            'ABF’s yellow is unreadable as text on white, so the app calculates a lighter or ' +
            'darker version that passes WCAG. If no version of that hue passes, it falls back ' +
            'to ink.',
          ],
        },
        {
          title: 'A dark mode the web did not have',
          body: [
            'The phone added System, Light and Dark modes. Muted text moved to #696b73 ' +
            '(5.30:1) because the web’s grey measured 3.45:1 and failed AA. A test locks that ' +
            'decision.',
          ],
        },
        {
          title: 'Quiet in a session hall',
          body: [
            'Haptics are on and sound is off by default, so nothing makes noise in a session ' +
            'hall. The operating system’s haptics setting always wins. Skeleton screens replace ' +
            'spinners, and the last programme and agenda stay readable offline, with their age ' +
            'shown.',
          ],
        },
      ],
    },
    development: {
      lede:
        'A bare React Native 0.87 app with the New Architecture and Hermes, without Expo. ' +
        'All screens are native and read Soravya’s JSON API.',
      sections: [
        {
          title: 'Fonts Android cannot fake',
          body: [
            'Android cannot synthesise bold weights for a custom font family. Each weight maps ' +
            'to its own font file through one Text component. Patching Text.render, the usual ' +
            'workaround, silently did nothing in RN 0.87.',
          ],
        },
        {
          title: 'One player across the whole app',
          body: [
            'Recorded sessions play through one player for the whole app, with a mini-player ' +
            'above the tab bar. Signed audio URLs are fetched fresh on every play.',
          ],
        },
      ],
      quality: [
        { value: '106', label: 'commits between September and October 2026, 32 of them mine' },
        { value: '~108', label: 'test cases' },
      ],
    },
    outcome: 'Shipped for the festival on 15–17 October 2026, in nine releases from 1.0.1 to 1.0.8.',
  },
]
