# Case-study guide

How Sammy wants portfolio case studies written and laid out. Built up from his corrections,
one session at a time, so it can become a reusable skill for every portfolio and project.
**Newest corrections are at the bottom of each section. When a rule here conflicts with an
older one, the newer rule wins.**

Started 2026-11-06 on the Soravya case study.

---

## 1. Writing voice

### What he wants
- **Clear first, clever never.** The reader is a recruiter. Every sentence must make sense to
  someone who has never heard of the product. Explain it the way you would to a smart friend.
- **Organised and descriptive.** State the problem, who has it, what was done about it, and why
  that was the right answer, in that order. His own model paragraph:

  > Soravya was built to solve the problem that organizers face when handling the management of
  > attendees and every other aspect related to the event after ticketing has been sorted out.
  > Event organizers often struggle with proper communication with attendees during an event…
  > All these problems and more were clearly identified and used to build a proper user persona
  > before the design even began.

  What makes it work: it names the problem plainly, lists the concrete pain points, then says
  how they were used. It is calm and confident. There are no tricks.
- **Plain, everyday words.** Use an occasional industry term (user persona, design system, front
  end) to show knowledge, but never academic or "PhD-level" phrasing.
- **Professional warmth.** Proud of the work and sure of it, but not hyped, not jokey, not slangy.
- **Emojis:** at most one or two on a whole page, and only where they add warmth.

### What he rejected (never do these)
- Neutral spec-sheet prose ("The dashboard synchronises records…") reads as robotic.
- Cinematic scene-setting gimmicks ("Picture three thousand people pouring into…"; "radio in one
  hand"; "12% battery and one bar of signal") read as fake storytelling.
- Clever headings and phrases nobody can decode: "The venue, not the desk", "Where competitors
  stop", "A design system that bites back", "That's a normal Tuesday".
- Fragments and terse telegraph style: "Arrives from an email link, on a phone, on bad venue
  Wi-Fi. Did not choose this software."
- Filler about method: "Each persona is written from the jobs the product had to support."
- Bragging about things that are not achievements, e.g. "we tested it on a real event".
- AI tells: "seamless", "robust", "leverage", "delve", "not just X but Y", em-dash chains,
  label-only headings.

### Facts
- Get the product's positioning right. Ask instead of narrowing it. Soravya is for **global**
  tech conferences and events, not only African ones, and is an **event management platform**,
  not "everything after the ticket" (it may take tickets one day).
- Get the team right. Soravya had **about five people across different fields**, not two. Never
  infer team size from git authors.
- Never invent research, usage, metrics or quotes. Enthusiasm, not fabrication.

---

## 2. Layout

- **Hero is two columns:** on the left the role line, the project name and the description
  directly under it; on the right the hero image (the realistic laptop mockup). Then the
  details (role, built with, team, timeline), then the impact numbers.
- **No orphan images** after the impact numbers. Every image must earn its place.
- **Paragraphs must flow as normal sentences.** No line breaks in the middle of a sentence, ever.
  (He reported this twice. See the line-splitting note in section 4.)

---

## 3. Images and mockups

- **Realistic, photographed devices only** (a real laptop on a desk, a real phone). No
  CSS-drawn devices.
- **No hands holding phones.** They looked generated and he did not know where they came from.
- **Use the strongest screens of the product**, not whatever is easiest to capture. Ask him for
  the screens when unsure: Figma frames, or PNGs at 1440×900 @2x (desktop) and 390×844 @3x
  (phone).
- **Never show real user data.** Use demo data.
- **Never stretch or squash an image. Ever.** Always keep the original aspect ratio: set
  `height: auto` (or `object-fit`) whenever width or height is constrained. He called this a taboo.
- **A mockup must look built in, not pasted on.** He spotted the phone's edges outside the
  screen. Inspect every mockup at full size, corner by corner, before showing it: the screen
  must follow the glass's rounded corners and notch, with no rim of the photo's blank screen
  and no square corners over the bezel.
- **Match the device to the screenshot.** A screenshot from a Dynamic Island iPhone looks
  wrong in an older phone with a wide notch, because the notch covers the status icons.
- **Every case-study image opens full size.** Recruiters judge the design, so each image is
  a button that opens a lightbox with zoom and arrow keys. A mockup opens the clean screen
  behind the photo, not the photo.

---

## 4. Engineering notes behind the rules

- Line breaks mid-sentence came from the animated line splitter (`watchLines` in
  `src/js/utils.js`): see the fix commit for the cause. Test any split text at very wide
  viewports (2000px+) as well as phone sizes.
- Mockup edges (`scripts/find-screen.cjs`): fit the top edge to the glass beside the notch,
  not to the notch; make the screenshot overshoot the mask so the mask alone shapes the
  screen; and don't use sharp's `dilate()` on a white-on-black mask, because in sharp 0.35 it
  shrinks it. The script now dilates by hand.

---

## 5. Homepage

Added 2026-11-06, from the homepage audit.

- **Never name a specific project in the hero.** Describe the kinds of work instead (platforms,
  dashboards, mobile apps, websites), so the hero never needs editing when a new project ships.
  Project names belong in the work grid and the proof numbers.
- **One job per section.** The hero says who he is and what he builds. The About block says how
  working with one person on design and build helps a team. The hiring section gives proof,
  then the roles he is open to. Don't repeat "I start in Figma, then I build it" in each one.
- **Lead with product work, not website tools.** React, Next.js and TypeScript come before
  WordPress, Webflow and Framer, which go under "Websites".
- **Proof numbers must be evidence**, not counts of his own portfolio pages ("7 case studies"
  was rejected).
- **Button labels say what happens.** A button that opens a form is not "Email me".
- **Statement-size headings stay short: one line, two at most.** "Design and front-end
  development from one person." wrapped to three lines at display size, and the scroll-lit
  effect left the last line pale grey, so it read like a mistake. Approved replacement:
  "I design it, then I build it."
- **A heading and the paragraph under it must not say the same thing.** The paragraph explains
  why it matters: here, what gets lost when a product passes from designer to developer, and
  what the team gains from one person doing both.
- **No website-only language in product positioning** ("the final site" became "the product").
- **The role line above a project title is a set of tags, not a text line.** One pill per role
  ("Product design", "Front-end engineering"), neutral, with a small dot in a different icon
  colour on each (section 7 replaced the earlier project-accent tint). Small tag text
  must still clear 4.5:1 contrast in both themes.

## 6. Screens Sammy supplies

Added 2026-11-06, when he sent the Soravya screen set.

- **His screens win over captures.** When he supplies screens, use them everywhere: hero,
  key screens, phones and component crops, so every number on the page matches.
- **Full-length captures are cropped to the device screen's shape, never squeezed into it.**
  `scripts/compose-mockups.mjs` measures the screen in the photo and takes the top of the
  capture at exactly that ratio (`from` moves the window down the page). This is the
  no-stretching rule applied to mockups.
- **Components are cropped from the same screens**, at full resolution, so they match.

## 7. Colour, cards and motion

Added 2026-11-06, after his review of the finished Soravya page.

- **Sammy's colours, not the product's.** The case-study page is his portfolio, so it is black
  and white like the homepage. Don't take the product's brand colour (Soravya's purple) as the
  page accent: he doesn't want to be branded by one colour, or by a client's.
- **Colour lives in the icons, and in several colours.** Icons cycle through the homepage's
  mix (blue, green, orange, pink, cyan, gold), never one hue. Section and card backgrounds stay
  neutral. In light mode use the darker shades so every icon clears 3:1 on white.
- **Cards in light mode are pure white.** He disliked the off-white tinted cards and the
  purple-tinted impact cards. Dark mode keeps its dark cards, which he likes.
- **Cards have no border, in either theme.** The fill alone separates them from the page, so
  the dark-mode fill is a little stronger (5.5% white) to stay visible on black.
- **The product's own palette still belongs in its design-system section**, because there it
  documents the product rather than styling the page.
- **Numbered lists use big numerals, not rules.** The principles lost the line above each
  number. The numbers are large, light and solid (an outline showed the font's overlapping
  contours).
- **Bring the page to life, subtly.** Card grids rise in one after another, each icon nudges
  once as its card lands (and again on hover), impact numbers count up from zero, and a
  progress bar fills from zero to its value. Everything runs once, and nothing runs with
  reduced motion; the final values are always in the markup, and screen readers hear the
  final number, never one mid-count.

## 8. FarmHub Agro

Added 2026-11-06, when building the second product case study.

- **Lead with what the portfolio lacks.** (Replaces an earlier rule that listed FarmHub under
  Websites.) Most of Sammy's work is dashboards and websites, so FarmHub leads with the mobile
  app: the homepage card and the hero show the phone in front and the dashboard behind it, out
  of focus. The website is left out of the design half entirely; visitors can see the live site.
  Ask which part of a multi-product job each case study should lead with.
- **Credit only what was his, and name no team he doesn't want named.** Sammy's role on
  FarmHub is design and front-end engineering. The page says so, gives no team size and names
  nobody else. The contribution section lists "What I designed" and "What I built"; the
  server side is shown as "outside my part of the work", never as someone else's.
- **Describe photos by where they come from on the product**: "product photos from FarmHub's
  catalogue".
- **Use his timeline**, in his words ("3 months, July to October 2026"). When the dates in a
  repo don't match it, leave the project-timeline section out instead of mixing the two.
- **Phone captures from a web build get a status bar.** They have none, so content starts
  where the clock should be. `statusBar: { fixedBottom }` in `scripts/compose-mockups.mjs`
  adds a 54pt iOS bar and removes the same height from the scrolling content just above the
  fixed bottom bars, which is what the phone itself would show. Nothing is scaled.
- **Describe what ships, not what a spec says.** The FarmHub tokens file names Inter, but the
  app and dashboard ship Public Sans, so the page says Public Sans.

### Mobile-first structure and generated scenes (corrections, 2026-11-06)

- **Order for an app-led product:** findings → users → principles → how it is organised →
  key screens in the app → the rider's (or other role's) phone as its own section → the
  dashboard as "the control centre behind the app" → design system. Never a grid of phones
  tucked under the dashboard.
- **App screens go two at a time**: one topic, its text, and two photographs side by side
  (`design.pairSections` in `content/products.mjs`, rendered as `.ppair`).
- **Frame the dashboard by what it controls in the app**: prices and stock the app charges,
  what the app shows, customers and what they buy, reports. Only claim features the product
  has: FarmHub has announcements and banners, not push notifications, so the page says that.
- **Never repeat a mockup photo.** Every screen gets its own setting (a market stall, a café
  table, a doorstep, a motorbike mount, a shop counter, a warehouse), tilted and in
  perspective. Flat, straight-on laptops on the same desk read as screenshots pasted on a photo.
- **Generate the scene, keep the screen real.** Scenes are generated (Magnific, Nano Banana
  2.1, 4k) with each device screen filled with flat key green, or key blue for a second device,
  and kept in `assets-src/scenes/`. `npm run scenes` (`scripts/compose-scenes.mjs`) measures
  the key, warps the real screenshot into it, keeps the key's shading as light falloff, and
  uses the key's exact shape as the screen edge. The UI is never redrawn by the model.
- **Phone captures get the home-indicator area too** (`safeBottom`): without it the rounded
  glass clips the tab-bar labels.


## 9. ABF (2026-11-07)

Sammy supplied a zip of website and ABF Admin captures (demo data in the dashboard, the live
public site for the website) and chose:

- **Two cards.** ABF Admin is its own product case study (`abf-admin` in
  `content/products.mjs`). The website case keeps its card; its "admin behind it" chapter is
  gone, and the ticketing chapter ends with a link to ABF Admin (`chapter.link`).
- **All of it is his:** design, the WordPress build, the PHP payments plugin and ABF Admin. No
  team named, no team size.
- **Timeline in his words:** ABF Admin is "2 months, May to July 2026". The repo's commit
  dates don't match it, so the page has no dated timeline and no "built in a day" claim. The
  website case keeps "2025 edition, retained for 2026".

Rules that came out of it:

- **An internal dashboard gets no phone mockups** (his correction): no phone in the hero, no
  phone section, no phone view in the IA. Laptops and monitors only.
- **"Bad placement and weird shadow"** (his correction): generated key screens carry grain and
  darker patches, which printed onto the screenshot as dirt, and a very steep laptop angle reads
  as a warped screen. Scenes now use `smooth: true` (the key's shading blurred to room scale,
  at lower strength), prompts ask for a matte green with no texture or patches, and laptops
  are kept to a gentle angle (about 15–30 degrees).
- **No tests, no test claims.** ABF Admin has no test suite, so its "Testing" slot is
  "Keeping the numbers trustworthy" and lists the safeguards that do exist (sync check,
  failure emails, secret-checked pushes, soft deletes), and says plainly that there is no
  automated suite.
- **IA with roles instead of a second app:** the second column is "Admins only"
  (`attendeeIcon: 'shield'`), and the visual pairs the side menu with the overview it opens on.
- **Supplied flow captures replace live captures.** A chapter with `frames` is not
  re-captured by `npm run shots`, so the flow stays as it shipped.
- **Laptop seen from the side:** foreshortening can make its top edge look shorter than its
  sides, so `compose-scenes.mjs` picks the highest near-horizontal side as the top, not the
  longer one. Check every laptop scene for a screen turned 90°.
- **Generated green screens sometimes come back with a darker square patch.** Pick the variant
  without it; the patch survives as a shading blotch on the screenshot.
- **A website Sammy is proud of gets the full product layout, not the short website one.**
  New scenes in the short layout still read to him as "very different from the recent case
  studies". ABF moved to `content/products.mjs` as `kind: 'product', website: true` (it still
  lists under Websites, with `cardTag.web`), with both halves: findings, audiences,
  principles, the site map, key pages, phones, the design system, then the build, real code
  and safeguards. The design source was the Get Ticket blueprint; the code was the
  abf-payments plugin. Ask before giving an older website the short layout again.
- **The phone's camera cutout tilted every phone screen** ("why do you keep giving me badly
  placed image mockups"). The Dynamic Island is a hole in the green key, and its edge was
  being counted as part of the screen's outline, which pulled the fitted top edge askew and
  rotated the screenshot. `compose-scenes.mjs` now fills holes before tracing the outline and
  fits each side to its middle 60%. After any change to screen detection, draw the detected
  corners over each raw photo and check them before composing.
- **When every variant of a key has a patch** (it happened on all five co-working photos),
  `flat: true` keeps the key's shape and drops its shading entirely.

### Website-case corrections (2026-11-07, second pass)

- **Impact numbers are headline wins, not build details** (his correction): "14 → 4 form
  fields" was rejected as not an accomplishment. The three numbers are what a stakeholder or
  recruiter would boast about: money raised, reach, being brought back. ABF's sponsorship
  figure is **$160K+**, in his words ("they secured 160k+"); it replaces the earlier ~$100K on
  the page and in the CV. Don't repeat an at-a-glance value (the timeline) as an impact number.
- **The impact unit sits on its own line under the number**, on every case study, so a wide
  value like "$160K+" never strands its unit on a separate line from half its words.
- **A homepage card he has approved stays.** The generated café scene replaced ABF's monitor
  card and he asked for the old one back ("this style is becoming boring"). Change a card image
  only when he asks.
- **Every name in "Built with" needs a logo.** A blank tile reads as broken. Add the SVG from
  svgl.app to `public/img/logos/` and map it in `LOGOS` before the page ships.
- **Findings copy: plain is not the same as clear** (his correction: "very plain and not
  interesting, and difficult to understand"). Each finding names the problem in people's
  terms, gives a concrete example, and ends with what the site does about it.
