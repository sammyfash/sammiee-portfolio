/**
 * Photographic device mockups for product case studies.
 *
 *   npm run mockups            all scenes
 *   npm run mockups -- soravya only scenes whose name starts with "soravya"
 *
 * Each scene puts a real screenshot into the screen of a real stock photograph
 * (Freepik, licensed through Magnific; kept in assets-src/stock/, which is
 * gitignored because the raw photos may not be redistributed). Chrome does the
 * warp: the screenshot is mapped onto the screen quad with a CSS matrix3d
 * homography and clipped by the photo's own screen mask, so the notch, glass
 * edge and bezel of the photograph stay on top. The UI stays pixel-sharp,
 * which an AI-generated mockup cannot promise.
 *
 * Corners and masks come from scripts/find-screen.cjs.
 */
import { mkdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import puppeteer from 'puppeteer-core'
import sharp from 'sharp'

const ROOT = process.cwd()
const STOCK = resolve(ROOT, 'assets-src/stock')
// Raw product screenshots: inputs to the mockups only, never published as-is.
const SHOTS = resolve(ROOT, 'assets-src/screens')
const OUT = resolve(ROOT, 'public/img/mockups')
// The clean, full-length screen behind each mockup, opened by the lightbox so
// a reader can judge the design itself rather than a photo of it.
const SCREENS_OUT = resolve(ROOT, 'public/img/screens')
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

/** Device photographs and their measured screen corners (TL, TR, BR, BL). */
const DEVICES = {
  'laptop-wood': [[1417.5, 623], [3953.9, 616.3], [3953.9, 2199.1], [1417.5, 2189.7]],
  'laptop-dark': [[1228.2, 665.7], [4003.5, 675.5], [4000.3, 2432.6], [1251.3, 2432.6]],
  'phone-dark': [[311.4, 248.7], [1293.5, 222.5], [1307.8, 2234.8], [334.2, 2241.5]],
  'phone-hands': [[1236.9, 1259], [2386.1, 1277.6], [2357.9, 3731.4], [1197.8, 3717.2]],
  // Hand-free phones. Sammy rejected the hand-held shots as looking generated.
  'phone-studio': [[2164.3, 380.9], [3219.6, 383.1], [3219.6, 2648.5], [2164.3, 2648.5]],
  'phone-linen': [[1593.8, 1948.9], [2825.1, 1954.9], [2818.5, 4605.8], [1593.8, 4605.8]],
}

/**
 * name → device + screenshot, plus an optional crop of the finished photo
 * (fractions of width/height) so each frame is composed around the device.
 */
const SCENES = [
  // Organiser console (laptop)
  { name: 'soravya-control', device: 'laptop-wood', shot: 'soravya-console-01-event-control', crop: [0.1, 0.06, 0.8, 0.8] },
  { name: 'soravya-insight', device: 'laptop-dark', shot: 'soravya-console-12-insight', crop: [0.12, 0.08, 0.78, 0.78] },
  { name: 'soravya-programme', device: 'laptop-wood', shot: 'soravya-console-02-programme', crop: [0.1, 0.06, 0.8, 0.8] },
  { name: 'soravya-experiences', device: 'laptop-dark', shot: 'soravya-console-16-experiences', crop: [0.12, 0.08, 0.78, 0.78] },
  { name: 'soravya-compose', device: 'laptop-wood', shot: 'soravya-console-10-compose-announcement', crop: [0.1, 0.06, 0.8, 0.8] },
  { name: 'soravya-moderation', device: 'laptop-dark', shot: 'soravya-console-11-networking-moderation', crop: [0.12, 0.08, 0.78, 0.78] },
  // Attendee app (phone). All on the studio photo: its phone has no notch, so
  // the status bar of a Dynamic Island screenshot sits naturally. The linen
  // phone's wide notch covered the signal icon.
  { name: 'soravya-home', device: 'phone-studio', shot: 'soravya-app-01-home', crop: [0.26, 0, 0.46, 1] },
  { name: 'soravya-program', device: 'phone-studio', shot: 'soravya-app-04-program', crop: [0.26, 0, 0.46, 1] },
  { name: 'soravya-session', device: 'phone-studio', shot: 'soravya-app-05-session-detail', crop: [0.26, 0, 0.46, 1] },
  { name: 'soravya-experiences-phone', device: 'phone-studio', shot: 'soravya-app-06-experiences', crop: [0.26, 0, 0.46, 1] },
  { name: 'soravya-people', device: 'phone-studio', shot: 'soravya-app-08-people', crop: [0.26, 0, 0.46, 1] },
  { name: 'soravya-meetings', device: 'phone-studio', shot: 'soravya-app-11-meetings-confirmed', crop: [0.26, 0, 0.46, 1] },
  { name: 'soravya-profile', device: 'phone-studio', shot: 'soravya-app-12-profile', crop: [0.26, 0, 0.46, 1] },
  { name: 'soravya-pass', device: 'phone-studio', shot: 'soravya-app-13-ticket', crop: [0.26, 0, 0.46, 1] },
]

const only = process.argv[2]

/** Unit square → quad, as a CSS matrix3d for an element of size w×h (Heckbert). */
function homography([[x0, y0], [x1, y1], [x2, y2], [x3, y3]], w, h) {
  const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2
  const sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3
  const det = dx1 * dy2 - dx2 * dy1
  const g = (sx * dy2 - dx2 * sy) / det
  const k = (dx1 * sy - sx * dy1) / det
  const a = x1 - x0 + g * x1, b = x3 - x0 + k * x3
  const d = y1 - y0 + g * y1, e = y3 - y0 + k * y3
  return [a / w, d / w, 0, g / w, b / h, e / h, 0, k / h, 0, 0, 1, 0, x0, y0, 0, 1]
}

await mkdir(OUT, { recursive: true })
await mkdir(SCREENS_OUT, { recursive: true })
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--force-color-profile=srgb'] })

for (const scene of SCENES) {
  if (only && !scene.name.startsWith(only)) continue
  const photoFile = resolve(STOCK, `${scene.device}.jpg`)
  const shotFile = resolve(SHOTS, `${scene.shot}.png`)
  const [pw, ph] = await sharp(photoFile).metadata().then((m) => [m.width, m.height])
  // Never stretch a screenshot to fit a screen. Measure the device screen's
  // own shape, then take the top of the screenshot at exactly that shape
  // (full-length captures are much taller than a laptop screen). `from`
  // shifts that window down the page when the best part is lower.
  const [[x0, y0], [x1, y1], , [x3, y3]] = DEVICES[scene.device]
  const screenRatio = Math.hypot(x1 - x0, y1 - y0) / Math.hypot(x3 - x0, y3 - y0)
  const shotMeta = await sharp(shotFile).metadata()
  // Too tall for the screen: keep the full width, crop the height. Too wide:
  // keep the full height, crop the sides evenly. Either way, never scale one axis.
  const fitH = Math.min(shotMeta.height, Math.round(shotMeta.width / screenRatio))
  const fitW = Math.min(shotMeta.width, Math.round(fitH * screenRatio))
  const top = Math.min(shotMeta.height - fitH, Math.round((scene.from ?? 0) * shotMeta.height))
  const left = Math.round((shotMeta.width - fitW) / 2)
  const shotBuf = await sharp(shotFile).extract({ left, top, width: fitW, height: fitH }).png().toBuffer()
  const [sw, sh] = [fitW, fitH]
  const matrix = homography(DEVICES[scene.device], sw, sh)
  // Chrome only does the warp, on a transparent page. The photo's own screen
  // mask is then applied as a real alpha channel in sharp, so the rounded
  // corners and the notch cut the screenshot exactly, and the warped layer is
  // laid over the untouched photograph.
  const page = await browser.newPage()
  await page.setViewport({ width: pw, height: ph, deviceScaleFactor: 1 })
  await page.setContent(`<!doctype html><body style="margin:0;background:transparent">
      <img src="data:image/png;base64,${shotBuf.toString('base64')}" style="position:absolute;left:0;top:0;transform-origin:0 0;transform:matrix3d(${matrix.join(',')})">
    </body>`, { waitUntil: 'load' })
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode())))
  const warped = await page.screenshot({ clip: { x: 0, y: 0, width: pw, height: ph }, omitBackground: true })
  await page.close()

  const maskAlpha = await sharp(resolve(STOCK, `${scene.device}.mask.png`)).resize(pw, ph).greyscale().raw().toBuffer()
  const { data: wpx } = await sharp(warped).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  for (let i = 0, j = 3; i < maskAlpha.length; i++, j += 4) wpx[j] = Math.round((wpx[j] * maskAlpha[i]) / 255)
  const layer = await sharp(wpx, { raw: { width: pw, height: ph, channels: 4 } }).png().toBuffer()
  const png = await sharp(photoFile).composite([{ input: layer }]).png().toBuffer()

  let img = sharp(png)
  if (scene.crop) {
    const [x, y, w, h] = scene.crop
    img = img.extract({ left: Math.round(x * pw), top: Math.round(y * ph), width: Math.round(w * pw), height: Math.round(h * ph) })
  }
  const full = await img.toBuffer()
  await sharp(full).resize({ width: 2400, withoutEnlargement: true }).webp({ quality: 84 }).toFile(resolve(OUT, `${scene.name}.webp`))
  await sharp(full).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 80 }).toFile(resolve(OUT, `${scene.name}@1200.webp`))
  await sharp(shotFile).resize({ width: 2400, withoutEnlargement: true }).webp({ quality: 82 }).toFile(resolve(SCREENS_OUT, `${scene.name}.webp`))
  const meta = await sharp(resolve(OUT, `${scene.name}.webp`)).metadata()
  console.log(`mockups/${scene.name}.webp  ${meta.width}×${meta.height}`)
}

await browser.close()
