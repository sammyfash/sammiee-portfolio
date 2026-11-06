/**
 * Mockups from generated photographs.
 *
 *   npm run scenes             all scenes
 *   npm run scenes -- farmhub  only scenes whose name starts with "farmhub"
 *
 * Each photograph in assets-src/scenes/ was generated with its device screens
 * filled with a flat key colour: pure green, or pure blue for a second device.
 * The key does all the measuring. Its exact shape becomes the screen's alpha,
 * so rounded corners, the Dynamic Island and anything resting on the glass stay
 * part of the photograph. Lines fitted to its edges give the screen's corners
 * for the perspective warp. The shading of the key over the glass is kept as a
 * soft light falloff on the screenshot, so the screen sits in the room's light
 * instead of looking pasted on. The screenshot itself is never redrawn: every
 * pixel of the UI is the real product.
 */
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import puppeteer from 'puppeteer-core'
import sharp from 'sharp'
import { withStatusBar, homography } from './mockup-lib.mjs'

const ROOT = process.cwd()
const PHOTOS = resolve(ROOT, 'assets-src/scenes')
const SHOTS = resolve(ROOT, 'assets-src/screens')
const OUT = resolve(ROOT, 'public/img/mockups')
const SCREENS_OUT = resolve(ROOT, 'public/img/screens')
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

/**
 * name → photo + one layer per keyed screen. The first layer's clean screen is
 * what the lightbox opens. `blur` softens a screen that sits out of focus in
 * the photo; `crop` frames the finished photo (fractions of width and height).
 */
const SCENES = [
  // Homepage card and hero: the app in front, the dashboard behind.
  { name: 'farmhub-hero', photo: 'farmhub-hero', crop: [0, 0.03, 1, 0.94], layers: [
    { key: 'green', shot: 'farmhub-app-02-home', statusBar: { fixedBottom: 332 } },
    { key: 'blue', shot: 'farmhub-dash-01-overview', blur: 5 },
  ] },
  // Customer app, two screens per topic
  { name: 'farmhub-app-home', photo: 'farmhub-market-hand', layers: [{ key: 'green', shot: 'farmhub-app-02-home', statusBar: { fixedBottom: 332 } }] },
  { name: 'farmhub-app-product', photo: 'farmhub-rice-sack', layers: [{ key: 'green', shot: 'farmhub-app-06-product', statusBar: { fixedBottom: 229 } }] },
  { name: 'farmhub-app-basket', photo: 'farmhub-cafe', crop: [0.12, 0.25, 0.75, 0.75], layers: [{ key: 'green', shot: 'farmhub-app-09-basket', statusBar: { fixedBottom: 622 } }] },
  { name: 'farmhub-app-checkout', photo: 'farmhub-sofa', layers: [{ key: 'green', shot: 'farmhub-app-10-checkout', statusBar: {} }] },
  { name: 'farmhub-app-tracking', photo: 'farmhub-porch', crop: [0.22, 0.25, 0.75, 0.75], layers: [{ key: 'green', shot: 'farmhub-app-12-order-tracking', statusBar: {} }] },
  { name: 'farmhub-app-delivered', photo: 'farmhub-doorstep', layers: [{ key: 'green', shot: 'farmhub-app-13-order-delivered', statusBar: {} }] },
  { name: 'farmhub-app-subscription', photo: 'farmhub-kitchen', layers: [{ key: 'green', shot: 'farmhub-app-14-subscription', statusBar: {} }] },
  { name: 'farmhub-app-subscribe', photo: 'farmhub-calendar', layers: [{ key: 'green', shot: 'farmhub-app-15-subscribe', statusBar: {} }] },
  // Riders
  { name: 'farmhub-rider-home', photo: 'farmhub-handlebar', layers: [{ key: 'green', shot: 'farmhub-phone-rider-home', statusBar: {} }] },
  { name: 'farmhub-rider-deliveries', photo: 'farmhub-rider-hand', layers: [{ key: 'green', shot: 'farmhub-phone-rider-deliveries', statusBar: {} }] },
  // Staff dashboard
  { name: 'farmhub-overview', photo: 'farmhub-office', layers: [{ key: 'green', shot: 'farmhub-dash-01-overview' }] },
  { name: 'farmhub-products', photo: 'farmhub-shop-counter', layers: [{ key: 'green', shot: 'farmhub-dash-09-products' }] },
  { name: 'farmhub-storefront', photo: 'farmhub-desk-pair', layers: [
    { key: 'green', shot: 'farmhub-dash-16-storefront' },
    { key: 'blue', shot: 'farmhub-app-02-home', statusBar: { fixedBottom: 332 } },
  ] },
  { name: 'farmhub-customer', photo: 'farmhub-monitor', layers: [{ key: 'green', shot: 'farmhub-dash-05-customer-detail', ratio: 16 / 9 }] },
  { name: 'farmhub-reports', photo: 'farmhub-cafe-evening', layers: [{ key: 'green', shot: 'farmhub-dash-11-reports' }] },
  { name: 'farmhub-dispatch', photo: 'farmhub-warehouse', layers: [{ key: 'green', shot: 'farmhub-home-dispatch' }] },
]

const only = process.argv[2]

/** How strongly a pixel is the key colour: the key channel above the other two. */
const keyness = (key) => key === 'green'
  ? (r, g, b) => g - Math.max(r, b)
  : (r, g, b) => b - Math.max(r, g)

/**
 * Finds one keyed screen. Returns its soft alpha (full size), the hard mask's
 * bounding box, the shading of the key across the glass, and the four corners
 * (TL, TR, BR, BL), pushed slightly past the glass so the alpha, not the quad,
 * decides the screen's edge.
 */
function findScreen(px, W, H, key, portrait) {
  const k = keyness(key)
  const hard = new Uint8Array(W * H)
  const alpha = new Float32Array(W * H)
  const level = new Float32Array(W * H)
  let sx = 0, sy = 0, n = 0
  for (let i = 0, p = 0; i < W * H; i++, p += 3) {
    const v = k(px[p], px[p + 1], px[p + 2])
    if (v > 25) alpha[i] = Math.min(1, (v - 25) / 70)
    if (v > 60) { hard[i] = 1; sx += i % W; sy += (i / W) | 0; n++ }
    level[i] = key === 'green' ? px[p + 1] : px[p + 2]
  }
  if (!n) throw new Error(`no ${key} key found`)
  // Keep only the largest connected region (stray key-coloured pixels elsewhere
  // in the photo are ignored): flood from the pixel nearest the centroid.
  let seed = Math.round(sy / n) * W + Math.round(sx / n)
  if (!hard[seed]) { let best = Infinity; for (let i = 0; i < W * H; i++) if (hard[i]) { const d = Math.abs(i % W - sx / n) + Math.abs(((i / W) | 0) - sy / n); if (d < best) { best = d; seed = i } } }
  const comp = new Uint8Array(W * H), stack = [seed]
  comp[seed] = 1
  const pts = []
  while (stack.length) {
    const i = stack.pop(), x = i % W, y = (i / W) | 0
    pts.push(x, y)
    for (const j of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, y > 0 ? i - W : -1, y < H - 1 ? i + W : -1]) {
      if (j >= 0 && hard[j] && !comp[j]) { comp[j] = 1; stack.push(j) }
    }
  }
  // Corners from the outline, so any tilt or perspective works the same way.
  // 1. The outline of the region and its convex hull.
  const outline = []
  for (let i = 0; i < pts.length; i += 2) {
    const x = pts[i], y = pts[i + 1], j = y * W + x
    if (!comp[j - 1] || !comp[j + 1] || !comp[j - W] || !comp[j + W]) outline.push([x, y])
  }
  const hull = (() => {
    const p = outline.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1])
    const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    const lo = [], up = []
    for (const q of p) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q) }
    for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q) }
    return lo.slice(0, -1).concat(up.slice(0, -1))
  })()
  // 2. Rough corners: the two hull points farthest apart, then the points
  //    farthest from that diagonal on either side.
  let A = hull[0], C = hull[0], best = 0
  for (let i = 0; i < hull.length; i++) for (let j = i + 1; j < hull.length; j++) {
    const d = (hull[i][0] - hull[j][0]) ** 2 + (hull[i][1] - hull[j][1]) ** 2
    if (d > best) { best = d; A = hull[i]; C = hull[j] }
  }
  const side = (q) => (C[0] - A[0]) * (q[1] - A[1]) - (C[1] - A[1]) * (q[0] - A[0])
  let B = A, D = A, bmax = 0, dmin = 0
  for (const q of hull) { const s2 = side(q); if (s2 > bmax) { bmax = s2; B = q } if (s2 < dmin) { dmin = s2; D = q } }
  // Clockwise in image coordinates (y down).
  let rough = [A, B, C, D]
  const area = rough.reduce((s2, p, i) => { const q = rough[(i + 1) % 4]; return s2 + p[0] * q[1] - q[0] * p[1] }, 0)
  if (area < 0) rough = [A, D, C, B]
  // 3. Refit each side to the outline along its middle 70%, which skips the
  //    rounded corners, and intersect neighbouring sides for the true corners.
  const lines = rough.map((p, i) => {
    const q = rough[(i + 1) % 4]
    const dx = q[0] - p[0], dy = q[1] - p[1], len = Math.hypot(dx, dy)
    const ux = dx / len, uy = dy / len
    const near = outline.filter(([x, y]) => {
      const t = ((x - p[0]) * ux + (y - p[1]) * uy) / len
      const off = Math.abs((x - p[0]) * uy - (y - p[1]) * ux)
      return t > 0.15 && t < 0.85 && off < len * 0.04 + 4
    })
    // Total least squares through the samples.
    let mx = 0, my = 0
    for (const [x, y] of near) { mx += x; my += y }
    mx /= near.length; my /= near.length
    let sxx = 0, syy = 0, sxy = 0
    for (const [x, y] of near) { sxx += (x - mx) ** 2; syy += (y - my) ** 2; sxy += (x - mx) * (y - my) }
    const ang = 0.5 * Math.atan2(2 * sxy, sxx - syy)
    return { px: mx, py: my, dx: Math.cos(ang), dy: Math.sin(ang), len }
  })
  const meet = (l1, l2) => {
    const det = l1.dx * l2.dy - l1.dy * l2.dx
    const t = ((l2.px - l1.px) * l2.dy - (l2.py - l1.py) * l2.dx) / det
    return [l1.px + l1.dx * t, l1.py + l1.dy * t]
  }
  // corner i sits between side i-1 and side i
  const corners = [0, 1, 2, 3].map((i) => meet(lines[(i + 3) % 4], lines[i]))
  // 4. Which side is the top? A phone: the short side with the Dynamic Island,
  //    a dark hole in the key just inside it. A laptop or monitor: the long
  //    side higher up the photo.
  const cx = corners.reduce((s2, c) => s2 + c[0], 0) / 4, cy = corners.reduce((s2, c) => s2 + c[1], 0) / 4
  const sideLen = (i) => Math.hypot(corners[(i + 1) % 4][0] - corners[i][0], corners[(i + 1) % 4][1] - corners[i][1])
  const shortFirst = sideLen(0) + sideLen(2) < sideLen(1) + sideLen(3) // sides 0 and 2 are the short ones
  const candidates = portrait === shortFirst ? [0, 2] : [1, 3]
  const darkNear = (i) => {
    const p = corners[i], q = corners[(i + 1) % 4]
    let n = 0
    for (let a = 0.35; a <= 0.65; a += 0.01) for (let b = 0.02; b <= 0.12; b += 0.005) {
      const ex = p[0] + (q[0] - p[0]) * a, ey = p[1] + (q[1] - p[1]) * a
      const x = Math.round(ex + (cx - ex) * b), y = Math.round(ey + (cy - ey) * b)
      if (x < 0 || y < 0 || x >= W || y >= H) continue
      const j = y * W + x, p3 = j * 3
      if (!hard[j] && px[p3] + px[p3 + 1] + px[p3 + 2] < 150) n++
    }
    return n
  }
  const midY = (i) => (corners[i][1] + corners[(i + 1) % 4][1]) / 2
  const top = portrait
    ? (darkNear(candidates[0]) >= darkNear(candidates[1]) ? candidates[0] : candidates[1])
    : (midY(candidates[0]) <= midY(candidates[1]) ? candidates[0] : candidates[1])
  // TL, TR, BR, BL: clockwise from the start of the top side.
  const ordered = [0, 1, 2, 3].map((k) => corners[(top + k) % 4])
  const diag = Math.hypot(ordered[2][0] - ordered[0][0], ordered[2][1] - ordered[0][1])
  const grow = diag * 0.006 + 3
  const quad = ordered.map(([x, y]) => { const d = Math.hypot(x - cx, y - cy); return [x + ((x - cx) / d) * grow, y + ((y - cy) / d) * grow] })
  // Shading: the key's brightness relative to its brightest part.
  const lv = []
  for (let i = 0; i < pts.length; i += 2 * 37) lv.push(level[pts[i + 1] * W + pts[i]])
  lv.sort((a, b) => a - b)
  const ref = lv[Math.floor(lv.length * 0.95)] || 255
  let x0 = W, y0 = H, x1 = 0, y1 = 0
  for (const [x, y] of quad) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
  const box = [Math.max(0, Math.floor(x0) - 30), Math.max(0, Math.floor(y0) - 30), Math.min(W, Math.ceil(x1) + 30), Math.min(H, Math.ceil(y1) + 30)]
  return { alpha, level, ref, quad, box, comp, k }
}

await mkdir(OUT, { recursive: true })
await mkdir(SCREENS_OUT, { recursive: true })
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--force-color-profile=srgb'] })

for (const scene of SCENES) {
  if (only && !scene.name.startsWith(only)) continue
  const photoFile = resolve(PHOTOS, `${scene.photo}.png`)
  const { data: base, info } = await sharp(photoFile).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const W = info.width, H = info.height
  const out = Buffer.from(base)
  let primarySrc = null

  for (const [li, layer] of scene.layers.entries()) {
    const scr = findScreen(base, W, H, layer.key, !!layer.statusBar)
    const [[ax, ay], [bx, by], , [dx, dy]] = scr.quad
    const screenRatio = Math.hypot(bx - ax, by - ay) / Math.hypot(dx - ax, dy - ay)
    const shotFile = resolve(SHOTS, `${layer.shot}.png`)
    const shotSrc = layer.statusBar ? await withStatusBar(shotFile, { ...layer.statusBar, safeBottom: true }) : shotFile
    if (li === 0) primarySrc = shotSrc
    const meta = await sharp(shotSrc).metadata()
    // The quad in a photo is foreshortened, so its measured shape is not the
    // screen's. A phone capture already has the phone's exact shape; a desktop
    // capture is cropped to the laptop screen's 16:10 unless a layer says
    // otherwise. Take the top of the screenshot at that shape; never scale one axis.
    void screenRatio
    const ratio = layer.ratio ?? (layer.statusBar ? meta.width / meta.height : 1.6)
    const fitH = Math.min(meta.height, Math.round(meta.width / ratio))
    const fitW = Math.min(meta.width, Math.round(fitH * ratio))
    const top = Math.min(meta.height - fitH, Math.round((layer.from ?? 0) * meta.height))
    const shotBuf = await sharp(shotSrc).extract({ left: Math.round((meta.width - fitW) / 2), top, width: fitW, height: fitH }).png().toBuffer()

    // Chrome does the perspective warp, on a transparent page.
    const page = await browser.newPage()
    await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 })
    await page.setContent(`<!doctype html><body style="margin:0;background:transparent">
      <img src="data:image/png;base64,${shotBuf.toString('base64')}" style="position:absolute;left:0;top:0;transform-origin:0 0;transform:matrix3d(${homography(scr.quad, fitW, fitH).join(',')})">
    </body>`, { waitUntil: 'load' })
    await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode())))
    const [bx0, by0, bx1, by1] = scr.box
    const clip = { x: bx0, y: by0, width: bx1 - bx0, height: by1 - by0 }
    let warped = sharp(await page.screenshot({ clip, omitBackground: true }))
    await page.close()
    // An out-of-focus screen: flatten onto the screenshot's average colour first,
    // so blurring doesn't fade its edge into transparency; the key alone cuts it.
    if (layer.blur) {
      const { dominant } = await sharp(shotBuf).stats()
      warped = sharp(await warped.flatten({ background: dominant }).png().toBuffer()).blur(layer.blur)
    }
    const { data: wp } = await warped.ensureAlpha().raw().toBuffer({ resolveWithObject: true })

    // Composite inside the box: the key's soft alpha cuts the screen, the key's
    // shading becomes light falloff, and green spill on the bezel is removed.
    const bw = clip.width
    for (let y = by0; y < by1; y++) for (let x = bx0; x < bx1; x++) {
      const i = y * W + x, p = i * 3, q = ((y - by0) * bw + (x - bx0)) * 4
      const a = layer.blur ? scr.alpha[i] : scr.alpha[i] * (wp[q + 3] / 255)
      const r0 = out[p], g0 = out[p + 1], b0 = out[p + 2]
      // Despill: no channel of the photo may lean toward the key colour.
      let r = r0, g = g0, b = b0
      if (layer.key === 'green' && g > Math.max(r, b)) g = Math.max(r, b)
      if (layer.key === 'blue' && b > Math.max(r, g)) b = Math.max(r, g)
      if (a <= 0) { out[p] = r; out[p + 1] = g; out[p + 2] = b; continue }
      const shade = Math.min(1.04, Math.max(0.55, scr.level[i] / scr.ref))
      const f = 1 - 0.75 * (1 - shade)
      // Screens in photographs never reach pure black or pure white.
      const sr = (wp[q] * 0.965 + 5) * f, sg = (wp[q + 1] * 0.965 + 5) * f, sb = (wp[q + 2] * 0.965 + 5) * f
      out[p] = Math.round(r * (1 - a) + Math.min(255, sr) * a)
      out[p + 1] = Math.round(g * (1 - a) + Math.min(255, sg) * a)
      out[p + 2] = Math.round(b * (1 - a) + Math.min(255, sb) * a)
    }
  }

  let img = sharp(out, { raw: { width: W, height: H, channels: 3 } })
  if (scene.crop) {
    const [x, y, w, h] = scene.crop
    img = img.extract({ left: Math.round(x * W), top: Math.round(y * H), width: Math.round(w * W), height: Math.round(h * H) })
  }
  const full = await img.png().toBuffer()
  await sharp(full).resize({ width: 2400, withoutEnlargement: true }).webp({ quality: 84 }).toFile(resolve(OUT, `${scene.name}.webp`))
  await sharp(full).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 80 }).toFile(resolve(OUT, `${scene.name}@1200.webp`))
  await sharp(primarySrc).resize({ width: 2400, withoutEnlargement: true }).webp({ quality: 82 }).toFile(resolve(SCREENS_OUT, `${scene.name}.webp`))
  const meta = await sharp(resolve(OUT, `${scene.name}.webp`)).metadata()
  console.log(`mockups/${scene.name}.webp  ${meta.width}×${meta.height}`)
}

await browser.close()
