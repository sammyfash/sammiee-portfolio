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
  ("Product design", "Front-end engineering"), tinted with the project's accent. Small tag text
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
