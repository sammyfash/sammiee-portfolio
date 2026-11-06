/** Shared by compose-mockups.mjs (stock photos) and compose-scenes.mjs (generated scenes). */
import sharp from 'sharp'

/**
 * Screens captured from a web build at phone size have no status bar, and
 * their content starts where a real phone shows the clock. `statusBar` turns
 * one into what the phone itself would show: a 54pt iOS status bar on top,
 * the fixed bottom bars (tab bar, basket bar) untouched, and the scrolling
 * content that much shorter, cut where it runs under those bars. Nothing is
 * scaled. `fixedBottom` is the height in pixels of the fixed area at the bottom.
 */
export async function withStatusBar(file, { fixedBottom = 0, safeBottom = false } = {}) {
  const img = sharp(file)
  const { width: W, height: H } = await img.metadata()
  const bar = Math.round(W * 54 / 393)
  const { data } = await sharp(file).extract({ left: 0, top: 0, width: W, height: 1 }).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const [r, g, b] = [data[0], data[1], data[2]]
  const ink = 0.2126 * r + 0.7152 * g + 0.0722 * b > 140 ? '#000' : '#fff'
  const u = W / 393 // points to pixels
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${bar}" viewBox="0 0 393 54">
    <rect width="393" height="54" fill="rgb(${r},${g},${b})"/>
    <text x="68" y="38" text-anchor="middle" font-family="Helvetica Neue, Helvetica, Arial" font-weight="600" font-size="17" fill="${ink}">9:41</text>
    <g fill="${ink}">
      <rect x="296" y="29" width="3" height="4" rx="0.7"/><rect x="300.5" y="27" width="3" height="6" rx="0.7"/>
      <rect x="305" y="24.5" width="3" height="8.5" rx="0.7"/><rect x="309.5" y="22" width="3" height="11" rx="0.7"/>
      <path d="M322 24.6a10 10 0 0 1 13.6 0l-1.6 1.7a7.7 7.7 0 0 0-10.4 0z"/>
      <path d="M325.2 28a5.6 5.6 0 0 1 7.2 0l-1.6 1.7a3.3 3.3 0 0 0-4 0z"/>
      <path d="M328.8 31.6l1 -1a1.1 1.1 0 0 1 0 0l1 1-1 1z"/>
      <rect x="342.5" y="22.5" width="24" height="11.5" rx="3.6" fill="none" stroke="${ink}" stroke-opacity="0.4"/>
      <rect x="344.5" y="24.5" width="20" height="7.5" rx="2"/>
      <path d="M368 26.3v4a2 2 0 0 0 0-4z" fill-opacity="0.45"/>
    </g></svg>`
  const statusPng = await sharp(Buffer.from(svg)).png().toBuffer()
  // safeBottom: the 34pt home-indicator area a real iPhone keeps clear below
  // the last bar, filled with that bar's colour and the indicator drawn on it.
  // Without it the rounded glass corners clip the tab bar's labels.
  const safe = safeBottom ? Math.round(W * 34 / 393) : 0
  const keep = H - bar - safe // the phone shows the same height in total
  const body = keep - fixedBottom
  const parts = [{ input: statusPng, top: 0, left: 0 }]
  parts.push({ input: await sharp(file).extract({ left: 0, top: 0, width: W, height: body }).png().toBuffer(), top: bar, left: 0 })
  if (fixedBottom) parts.push({ input: await sharp(file).extract({ left: 0, top: H - fixedBottom, width: W, height: fixedBottom }).png().toBuffer(), top: bar + body, left: 0 })
  if (safe) {
    const { data: last } = await sharp(file).extract({ left: Math.round(W / 2), top: H - 1, width: 1, height: 1 }).removeAlpha().raw().toBuffer({ resolveWithObject: true })
    const lum = 0.2126 * last[0] + 0.7152 * last[1] + 0.0722 * last[2]
    const svgSafe = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${safe}" viewBox="0 0 393 34">
      <rect width="393" height="34" fill="rgb(${last[0]},${last[1]},${last[2]})"/>
      <rect x="129.5" y="21" width="134" height="5" rx="2.5" fill="${lum > 140 ? '#000' : '#fff'}"/></svg>`
    parts.push({ input: await sharp(Buffer.from(svgSafe)).png().toBuffer(), top: H - safe, left: 0 })
  }
  return sharp({ create: { width: W, height: H, channels: 4, background: '#fff' } }).composite(parts).png().toBuffer()
}

/** Unit square → quad, as a CSS matrix3d for an element of size w×h (Heckbert). */
export function homography([[x0, y0], [x1, y1], [x2, y2], [x3, y3]], w, h) {
  const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2
  const sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3
  const det = dx1 * dy2 - dx2 * dy1
  const g = (sx * dy2 - dx2 * sy) / det
  const k = (dx1 * sy - sx * dy1) / det
  const a = x1 - x0 + g * x1, b = x3 - x0 + k * x3
  const d = y1 - y0 + g * y1, e = y3 - y0 + k * y3
  return [a / w, d / w, 0, g / w, b / h, e / h, 0, k / h, 0, 0, 1, 0, x0, y0, 0, 1]
}

