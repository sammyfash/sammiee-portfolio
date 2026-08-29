/**
 * Turns the raw Figma exports in assets-src/ into web-ready assets in public/img/.
 * Run with `npm run images` after dropping a new export into assets-src/.
 */
import { mkdir, readdir } from 'node:fs/promises'
import { resolve, parse } from 'node:path'
import sharp from 'sharp'

const root = process.cwd()
const src = resolve(root, 'assets-src')
const out = resolve(root, 'public/img')

/** width -> filename suffix. The largest is emitted without a suffix. */
const WORK_WIDTHS = [1400, 800]
const PORTRAIT_WIDTH = 640

async function emit(input, dir, name, widths, { jpg = true } = {}) {
  await mkdir(dir, { recursive: true })
  const written = []
  for (const [i, width] of widths.entries()) {
    const suffix = i === 0 ? '' : `@${width}`
    const base = sharp(input).resize({ width, withoutEnlargement: true })
    await base.clone().webp({ quality: 82, effort: 5 }).toFile(resolve(dir, `${name}${suffix}.webp`))
    written.push(`${name}${suffix}.webp`)
    if (jpg && i === 0) {
      await base.clone().jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: '4:4:4' }).toFile(resolve(dir, `${name}.jpg`))
      written.push(`${name}.jpg`)
    }
  }
  return written
}

const workDir = resolve(src, 'work')
for (const file of await readdir(workDir)) {
  if (!/\.(png|jpe?g)$/i.test(file)) continue
  const { name } = parse(file)
  const written = await emit(resolve(workDir, file), resolve(out, 'work'), name, WORK_WIDTHS)
  console.log(`work/${file} -> ${written.join(', ')}`)
}

// Case-study section shots. Desktop frames are wide, mobile frames are tall,
// so they get different target widths.
const shotsDir = resolve(src, 'shots')
try {
  for (const file of await readdir(shotsDir)) {
    if (!/\.(png|jpe?g)$/i.test(file)) continue
    const { name } = parse(file)
    const widths = name.includes('-mobile-') ? [560] : [1600, 900]
    const written = await emit(resolve(shotsDir, file), resolve(out, 'shots'), name, widths, { jpg: false })
    console.log(`shots/${file} -> ${written.join(', ')}`)
  }
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}

// The portrait is masked into a square, so square-crop it here rather than in CSS.
await mkdir(out, { recursive: true })
await sharp(resolve(src, 'portrait.png'))
  .resize({ width: PORTRAIT_WIDTH, height: PORTRAIT_WIDTH, fit: 'cover', position: 'top' })
  .webp({ quality: 88, effort: 5 })
  .toFile(resolve(out, 'portrait.webp'))
await sharp(resolve(src, 'portrait.png'))
  .resize({ width: PORTRAIT_WIDTH, height: PORTRAIT_WIDTH, fit: 'cover', position: 'top' })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(resolve(out, 'portrait.jpg'))
console.log('portrait.png -> portrait.webp, portrait.jpg')
