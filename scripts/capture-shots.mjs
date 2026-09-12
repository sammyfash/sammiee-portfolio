/**
 * Captures the section screenshots used by the case-study pages.
 *
 * Drives the Chrome already installed on this machine (no 130MB download), so
 * this is repeatable: when a client site changes, re-run it and the case study
 * updates. Output lands in assets-src/shots/, which `npm run images` then
 * turns into WebP.
 *
 *   npm run shots            # every project
 *   npm run shots -- icp     # just the ones whose slug matches
 *
 * If a site is down or slow it is skipped with a warning rather than failing
 * the whole run — a missing shot should never block the other five pages.
 */
import { access, mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import puppeteer from 'puppeteer-core'
import { PROJECTS } from '../content/projects.mjs'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUT = resolve(process.cwd(), 'assets-src/shots')

const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 2 }
const MOBILE = { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true }

const filter = process.argv.slice(2).filter((a) => !a.startsWith('-'))
const matches = (p) => !filter.length || filter.some((f) => p.slug.includes(f))
const wanted = PROJECTS.filter((p) => (p.live || p.videoSource) && matches(p))

/** Let lazy content and entrance animations settle before shooting. */
async function settle(page, ms = 2600) {
  await page.evaluate(() => window.scrollTo(0, 0))
  await new Promise((r) => setTimeout(r, ms))
  // Nudge through the page so IntersectionObserver-driven media loads.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 120))
    }
    window.scrollTo(0, 0)
  })
  await new Promise((r) => setTimeout(r, 900))
}

/** Kill the things that ruin a screenshot: cookie bars, chat bubbles, fixed nav. */
async function dismissClutter(page) {
  await page.evaluate(() => {
    const junk = /cookie|consent|gdpr|newsletter|popup|modal|intercom|drift|crisp|chat|tawk/i
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el)
      if (cs.position !== 'fixed' && cs.position !== 'sticky') continue
      const id = `${el.id} ${el.className}`
      if (junk.test(id)) el.style.setProperty('display', 'none', 'important')
    }
    // pause video so frames are deterministic
    for (const v of document.querySelectorAll('video')) { try { v.pause() } catch {} }
    document.documentElement.style.scrollBehavior = 'auto'
  })
}

async function shoot(page, file, clip) {
  await mkdir(OUT, { recursive: true })
  const buffer = await page.screenshot({ type: 'png', ...(clip ? { clip } : {}) })
  await writeFile(resolve(OUT, file), buffer)
  console.log(`  ✓ ${file}`)
}

/** One viewport-sized frame per named scroll offset, as a fraction of the page. */
async function captureViewportSlices(page, slug, kind, count) {
  const total = await page.evaluate(() => document.body.scrollHeight)
  const vh = await page.evaluate(() => window.innerHeight)
  const usable = Math.max(total - vh, 0)

  for (let i = 0; i < count; i++) {
    const y = count === 1 ? 0 : Math.round((usable / (count - 1)) * i * 0.72)
    await page.evaluate((to) => window.scrollTo(0, to), y)
    await new Promise((r) => setTimeout(r, 700))
    await shoot(page, `${slug}-${kind}-${i + 1}.png`)
  }
}

/**
 * A project can carry `chapters`: further acts inside the same case study,
 * covering a route across several screens rather than one more scroll of the
 * same page. Frames are named `<slug>-<chapter.id>-N`, so they collide neither
 * with the `-desktop-N` slices of the main page nor with each other.
 *
 *   chapters: [{ id, live, steps: [{ path, label, at }] }]
 *
 * `at` is an optional scroll position as a fraction of the page, for steps
 * where the part worth showing sits below the fold.
 */
async function captureChapters(page, project) {
  await page.setViewport(DESKTOP)

  for (const chapter of project.chapters) {
    // A chapter behind a login cannot be captured, so its frames are supplied
    // by hand instead. Those chapters carry `frames` rather than `steps`.
    if (!chapter.steps?.length) {
      console.log(`  · ${chapter.title}: frames supplied by hand, nothing to capture`)
      continue
    }
    console.log(`  · ${chapter.title}`)

    for (const [i, step] of chapter.steps.entries()) {
      const url = new URL(step.path, chapter.live ?? project.live).href
      await page.goto(url, { waitUntil: 'networkidle2' })
      await dismissClutter(page)
      await settle(page)

      if (step.at) {
        await page.evaluate((fraction) => {
          const usable = Math.max(document.body.scrollHeight - window.innerHeight, 0)
          window.scrollTo(0, Math.round(usable * fraction))
        }, step.at)
        await new Promise((r) => setTimeout(r, 700))
      }

      await shoot(page, `${project.slug}-${chapter.id}-${i + 1}.png`)
      console.log(`     ${step.label}`)
    }
  }
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--hide-scrollbars', '--disable-features=IsolateOrigins,site-per-process'],
})

/**
 * Three of these client sites no longer resolve, so their frames come from the
 * build videos instead. Chrome decodes H.264 natively, so this seeks the video
 * and paints each frame to a canvas — no ffmpeg needed.
 */
async function captureVideoFrames(page, project) {
  const onDisk = resolve(process.cwd(), 'assets-src/video', project.videoSource)

  // The source videos are too large to keep in git, so fetch on demand where a
  // project still records somewhere to fetch them from.
  try {
    await access(onDisk)
  } catch {
    if (!project.videoUrl) {
      throw new Error(
        `missing assets-src/video/${project.videoSource}, and ${project.slug} records no `
        + 'videoUrl to fetch it from. Restore the master from your own backup.',
      )
    }
    console.log(`  ↓ fetching ${project.videoSource}…`)
    await mkdir(resolve(process.cwd(), 'assets-src/video'), { recursive: true })
    const res = await fetch(project.videoUrl)
    if (!res.ok) throw new Error(`download failed: ${res.status}`)
    // A single-page site answers 200 with index.html for any path it does not
    // have, so `res.ok` alone would happily write a web page into an .mp4 and
    // leave ffmpeg to report something unrelated several steps later.
    const type = res.headers.get('content-type') ?? ''
    if (!type.startsWith('video/')) {
      throw new Error(`${project.videoUrl} returned ${type || 'no content-type'}, not a video`)
    }
    await writeFile(onDisk, Buffer.from(await res.arrayBuffer()))
  }

  const file = pathToFileURL(onDisk).href
  const count = project.shots?.desktop ?? 3

  // Navigating straight at the file makes Chrome build its own video document,
  // which sidesteps the opaque-origin restrictions of about:blank + file://.
  await page.setViewport({ width: 1280, height: 760, deviceScaleFactor: 1 })
  await page.goto(file, { waitUntil: 'load' })
  await page.evaluate(async () => {
    const v = document.querySelector('video')
    if (!v) throw new Error('no video element in the document')
    window.__v = v
    v.muted = true
    if (v.readyState < 1) {
      await new Promise((res, rej) => {
        v.addEventListener('loadedmetadata', res, { once: true })
        v.addEventListener('error', () => rej(new Error('video failed to decode')), { once: true })
        setTimeout(() => rej(new Error('video metadata timed out')), 20000)
      })
    }
  })

  // Drawing a file:// video into a canvas taints it, so grab the element itself —
  // page screenshots are not subject to canvas origin rules.
  const box = await page.evaluate(() => {
    const v = window.__v
    const scale = Math.min(1, 1600 / v.videoWidth)
    v.style.width = `${Math.round(v.videoWidth * scale)}px`
    v.style.height = 'auto'
    return { w: Math.round(v.videoWidth * scale), h: Math.round(v.videoHeight * scale) }
  })
  await page.setViewport({ width: box.w, height: box.h, deviceScaleFactor: 1 })

  for (let i = 0; i < count; i++) {
    // Skip the first and last 8% — intros and outros are rarely the good frame.
    const at = 0.08 + (0.84 / Math.max(count - 1, 1)) * i
    await page.evaluate(async (fraction) => {
      const v = window.__v
      v.currentTime = v.duration * fraction
      await new Promise((res) => v.addEventListener('seeked', res, { once: true }))
    }, at)
    await new Promise((r) => setTimeout(r, 250))

    await mkdir(OUT, { recursive: true })
    const name = `${project.slug}-desktop-${i + 1}.png`
    const el = await page.$('video')
    await writeFile(resolve(OUT, name), await el.screenshot({ type: 'png' }))
    console.log(`  \u2713 ${name}  (frame @ ${Math.round(at * 100)}%)`)
  }
}

for (const project of wanted) {
  console.log(`\n${project.name} — ${project.live ?? `video: ${project.videoSource}`}`)
  const page = await browser.newPage()
  page.setDefaultNavigationTimeout(45_000)

  try {
    if (!project.live) {
      await captureVideoFrames(page, project)
      continue
    }
    await page.setViewport(DESKTOP)
    await page.goto(project.live, { waitUntil: 'networkidle2' })
    await dismissClutter(page)
    await settle(page)
    await captureViewportSlices(page, project.slug, 'desktop', project.shots?.desktop ?? 3)

    await page.setViewport(MOBILE)
    await page.reload({ waitUntil: 'networkidle2' })
    await dismissClutter(page)
    await settle(page, 2000)
    await captureViewportSlices(page, project.slug, 'mobile', project.shots?.mobile ?? 2)

    if (project.chapters?.length) await captureChapters(page, project)
  } catch (error) {
    console.warn(`  ! skipped: ${error.message.split('\n')[0]}`)
  } finally {
    await page.close()
  }
}

await browser.close()
console.log('\nDone. Run `npm run images` to convert these to WebP.')
