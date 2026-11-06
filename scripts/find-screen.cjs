/**
 * Finds the screen in a stock device photo: flood-fills the blank screen from a
 * seed point, fits a line to each edge and intersects them, so rounded phone
 * corners still give the true quad. Writes <photo>.mask.png beside the photo.
 *
 *   node scripts/find-screen.cjs assets-src/stock/laptop-wood.jpg 0.5 0.25 [tolerance] [grow]
 *
 * grow (default 2) is how far, in working pixels, the mask reaches into the
 * bezel. Raise it when the glass fades softly into the bezel and a light rim
 * shows round the screenshot.
 *
 * Paste the printed corners into SCENES in scripts/compose-mockups.mjs.
 */
const sharp = require('sharp')
const [file, sx, sy, tolArg, growArg] = process.argv.slice(2)
;(async () => {
  const meta = await sharp(file).metadata()
  // Work at up to 2800px wide: a coarser mask gives a stepped, haloed edge once
  // it is scaled back up to the photo.
  const W = Math.min(meta.width, 2800), scale = meta.width / W
  const { data, info } = await sharp(file).resize(W).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const H = info.height, tol = Number(tolArg || 22)
  const px = (x, y) => (y * W + x) * 3
  const x0 = Math.round(sx * W), y0 = Math.round(sy * H)
  const seed = [data[px(x0, y0)], data[px(x0, y0) + 1], data[px(x0, y0) + 2]]
  const seen = new Uint8Array(W * H), stack = [[x0, y0]]
  const mask = new Uint8Array(W * H)
  while (stack.length) {
    const [x, y] = stack.pop()
    if (x < 0 || y < 0 || x >= W || y >= H) continue
    const i = y * W + x
    if (seen[i]) continue
    seen[i] = 1
    const p = px(x, y)
    if (Math.abs(data[p] - seed[0]) > tol || Math.abs(data[p + 1] - seed[1]) > tol || Math.abs(data[p + 2] - seed[2]) > tol) continue
    mask[i] = 1
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
  }
  // bounding box
  let minX = W, maxX = 0, minY = H, maxY = 0, n = 0
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (mask[y * W + x]) { n++; if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y }
  // edge samples in the middle 60% of each side
  const fit = (pts) => { // least squares x = a*y + b  or y = a*x + b depending
    const m = pts.length, sxv = pts.reduce((s, p) => s + p[0], 0), syv = pts.reduce((s, p) => s + p[1], 0)
    const mx = sxv / m, my = syv / m
    let num = 0, den = 0
    for (const [u, v] of pts) { num += (u - mx) * (v - my); den += (u - mx) ** 2 }
    const a = num / den; return [a, my - a * mx]
  }
  const left = [], right = [], top = [], bottom = []
  for (let y = Math.round(minY + (maxY - minY) * 0.2); y < minY + (maxY - minY) * 0.8; y++) {
    let l = -1, r = -1
    for (let x = minX; x <= maxX; x++) if (mask[y * W + x]) { if (l < 0) l = x; r = x }
    if (l >= 0) { left.push([y, l]); right.push([y, r]) }
  }
  for (let x = Math.round(minX + (maxX - minX) * 0.2); x < minX + (maxX - minX) * 0.8; x++) {
    let t = -1, b = -1
    for (let y = minY; y <= maxY; y++) if (mask[y * W + x]) { if (t < 0) t = y; b = y }
    if (t >= 0) { top.push([x, t]); bottom.push([x, b]) }
  }
  // A notch or dynamic island dips into the top edge. Fit the edge only to the
  // samples on the glass line itself (the "ears" beside the notch), or the
  // quad starts below the notch and the photo's blank screen shows above it.
  const edge = (pts, outer) => {
    const lim = outer === 'min' ? Math.min(...pts.map((p) => p[1])) : Math.max(...pts.map((p) => p[1]))
    return pts.filter((p) => Math.abs(p[1] - lim) <= 6)
  }
  const L = fit(left), R = fit(right), T = fit(edge(top, 'min')), B = fit(edge(bottom, 'max')) // L,R: x = a*y+b ; T,B: y = a*x+b
  const meet = (V, Hh) => { // x = V0*y + V1 ; y = H0*x + H1
    const y = (Hh[0] * V[1] + Hh[1]) / (1 - Hh[0] * V[0]); return [V[0] * y + V[1], y]
  }
  // Push each corner a little past the glass. The mask, not the quad, gives the
  // screen its real shape (rounded corners, notch), so the screenshot must
  // overshoot the glass slightly; an inset quad leaves a sliver of blank screen.
  const quad = [meet(L, T), meet(R, T), meet(R, B), meet(L, B)]
  const cx = quad.reduce((s, p) => s + p[0], 0) / 4, cy = quad.reduce((s, p) => s + p[1], 0) / 4
  const grow = Number(growArg || 2) + 6 // px at working size; always past the mask
  const c = quad.map(([x, y]) => {
    const d = Math.hypot(x - cx, y - cy)
    return [x + ((x - cx) / d) * grow * 1.4, y + ((y - cy) / d) * grow * 1.4]
  }).map(([x, y]) => [Math.round(x * scale * 10) / 10, Math.round(y * scale * 10) / 10])
  // Full-size mask of the screen pixels. Grown into the bezel so the glass's
  // own bright, soft rim is covered (it showed as a white ring),
  // then softened slightly so the edge blends into the bezel.
  // Disk dilation done here, not with sharp: sharp's dilate()/erode() act the
  // other way round on a white-on-black mask, so dilate() shrank it.
  const r = Number(growArg || 2)
  const m8 = Buffer.alloc(W * H)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!mask[y * W + x]) continue
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy > r * r) continue
      const X = x + dx, Y = y + dy
      if (X >= 0 && Y >= 0 && X < W && Y < H) m8[Y * W + X] = 255
    }
  }
  const out = file.replace(/\.jpg$/, '.mask.png')
  await sharp(m8, { raw: { width: W, height: H, channels: 1 } }).resize(meta.width, meta.height, { kernel: 'cubic' }).blur(1).png().toFile(out)
  console.log(JSON.stringify({ file: file.split('/').pop(), size: [meta.width, meta.height], seed, area: n, corners: c }))
})()
