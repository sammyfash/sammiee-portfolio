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
