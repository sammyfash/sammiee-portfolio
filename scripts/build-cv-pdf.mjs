/**
 * Prints both CV tracks to PDF.
 *
 *   npm run cv
 *
 * The PDFs are the same document the site serves at /cv, run through the print
 * stylesheet in src/styles/cv.css. That matters: there is one CV, not a web
 * version and a drifting Word file, so a change to content/cv.mjs reaches the
 * page and the attachment in one step.
 *
 * The output is real selectable text rather than an image, which is what an
 * applicant tracking system needs in order to parse it at all.
 *
 * Drives the Chrome already installed on this machine, exactly like
 * capture-shots.mjs, so there is no 130MB browser download in devDependencies.
 */
import { mkdir, access } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createServer } from 'vite'
import puppeteer from 'puppeteer-core'
import { TRACKS } from '../content/cv.mjs'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUT = resolve(process.cwd(), 'public/cv')

try {
  await access(CHROME)
} catch {
  console.error(`Chrome not found at ${CHROME}.`)
  console.error('Install Google Chrome, or edit CHROME in scripts/build-cv-pdf.mjs.')
  process.exit(1)
}

await mkdir(OUT, { recursive: true })

// Serve the real site rather than a file:// URL, so the module graph, the
// fonts and the stylesheet resolve exactly as they do in production.
const server = await createServer({ server: { port: 5199, strictPort: false } })
await server.listen()
const port = server.config.server.port
const base = `http://localhost:${port}`

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })

try {
  for (const track of Object.values(TRACKS)) {
    const page = await browser.newPage()
    const url = `${base}/cv.html${track.id === 'wp' ? '?wordpress' : ''}`

    await page.goto(url, { waitUntil: 'networkidle0' })

    // The preloader owns the first second of every page, and GSAP reveals run
    // after it. Print before they finish and the PDF is a page of blank space.
    await page.waitForSelector('.cv', { timeout: 20000 })
    // FontFaceSet reports 'loading' then 'loaded'; `document.fonts.ready`
    // is the promise that settles once every face has resolved.
    await page.evaluate(() => document.fonts.ready)
    await new Promise((r) => setTimeout(r, 2200))

    // emulateMediaType alone does not fire beforeprint, which is what the page
    // listens for to force every reveal visible.
    await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')))
    await page.emulateMediaType('print')

    const file = resolve(OUT, `${track.file}.pdf`)
    await page.pdf({
      path: file,
      format: 'A4',
      printBackground: false,
      preferCSSPageSize: true,
    })

    console.log(`${track.file}.pdf  (${track.short})`)
    await page.close()
  }
} finally {
  await browser.close()
  await server.close()
}

console.log(`\nWritten to public/cv/ — served at /cv/<name>.pdf`)
