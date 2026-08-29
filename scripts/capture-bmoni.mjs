/**
 * RETIRED — kept for the record, do not run.
 *
 * The intent was to re-shoot BMONI's four sections at 2x, since the Figma
 * exports are only ~700px wide. It does not work: bmoni.com has been
 * substantially redesigned since the build. Two of the four sections no longer
 * exist at all, and the two that survive have different layout, copy and
 * imagery — the hero is now a phone render with rotating text rather than the
 * coverage map. Shooting it would put someone else's later redesign into this
 * portfolio, which is worse than a soft image. The Figma exports stay.
 *
 * Re-captures the four BMONI sections at 2x, anchored to their headings rather
 * than to scroll offsets.
 *
 *   node scripts/capture-bmoni.mjs [--probe]
 *
 * The frames in the Figma file are only ~700px wide, which is soft inside a
 * full-width browser mockup. bmoni.com is live, so the same four sections can
 * be shot properly. `--probe` reports what it found without writing anything.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import puppeteer from 'puppeteer-core'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUT = resolve(process.cwd(), 'assets-src/shots')
const URL = 'https://bmoni.com/'
const PROBE = process.argv.includes('--probe')

/** The four sections, in page order, each keyed by text only it contains. */
/**
 * bmoni.com has been reworked since the Figma frames were exported: the
 * "cards at 100M merchants" grid and the "not just an app" press band are both
 * gone. Only the two sections that still match are re-shot here; the other two
 * stay as the Figma exports so the page keeps showing the design as delivered.
 */
const SECTIONS = [
  { file: 'bmoni-desktop-1.png', find: 'Like your bank', note: 'hero + coverage map' },
  { file: 'bmoni-desktop-3.png', find: '3 simple steps', note: 'how it works' },
  // candidates for the two retired sections — written only with --candidates
  { file: 'cand-everything.png', find: 'Everything you want from your money', note: 'CANDIDATE', candidate: true },
  { file: 'cand-whofor.png', find: 'Who is BMONI for?', note: 'CANDIDATE', candidate: true },
]

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--hide-scrollbars', '--force-device-scale-factor=2'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
await page.goto(URL, { waitUntil: 'networkidle2', timeout: 90_000 })

// Walk the whole page so lazy images and scroll-triggered sections commit.
await page.evaluate(async () => {
  const step = window.innerHeight * 0.7
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 260))
  }
  window.scrollTo(0, 0)
})
await new Promise((r) => setTimeout(r, 1800))

// Cookie bars, chat bubbles and sticky nav all ruin a section shot.
await page.evaluate(() => {
  const junk = /cookie|consent|gdpr|newsletter|popup|modal|intercom|drift|crisp|chat|tawk/i
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el)
    if (cs.position === 'fixed' || cs.position === 'sticky') {
      if (junk.test(`${el.id} ${el.className}`)) el.style.setProperty('display', 'none', 'important')
    }
  }
  for (const v of document.querySelectorAll('video')) { try { v.pause() } catch { /* fine */ } }
  document.documentElement.style.scrollBehavior = 'auto'
})

/**
 * From the element holding `text`, climb to the outermost ancestor that is
 * still a full-bleed band of sane height — that is the visual "section",
 * regardless of how the site nests its markup.
 */
const boxOf = (text) => page.evaluate((needle) => {
  const hit = [...document.querySelectorAll('body *')].find(
    (el) => el.children.length === 0 && el.textContent.trim().includes(needle),
  )
  if (!hit) return null

  let best = hit
  for (let el = hit; el && el !== document.body; el = el.parentElement) {
    const r = el.getBoundingClientRect()
    if (r.width >= window.innerWidth * 0.92 && r.height >= 320 && r.height <= 1800) best = el
  }
  const r = best.getBoundingClientRect()
  return {
    tag: best.tagName,
    cls: String(best.className).slice(0, 40),
    x: Math.max(0, Math.round(r.left + window.scrollX)),
    y: Math.max(0, Math.round(r.top + window.scrollY)),
    width: Math.round(Math.min(r.width, window.innerWidth)),
    height: Math.round(r.height),
  }
}, text)

await mkdir(OUT, { recursive: true })
for (const s of SECTIONS) {
  const box = await boxOf(s.find)
  if (!box) { console.warn(`  ! "${s.find}" not found — ${s.file} left alone`); continue }
  console.log(`  ${s.file}  ${s.note}  <${box.tag}.${box.cls}> ${box.width}x${box.height} @ y=${box.y}`)
  if (PROBE) continue
  if (s.candidate && !process.argv.includes('--candidates')) continue

  const buffer = await page.screenshot({ type: 'png', captureBeyondViewport: true, clip: { ...box, scale: 2 } })
  await writeFile(resolve(OUT, s.file), buffer)
}

await browser.close()
console.log(PROBE ? '\nprobe only — nothing written' : '\ndone')
