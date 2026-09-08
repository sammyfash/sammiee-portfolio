/**
 * Composites a captured screenshot into an existing device mockup to make a
 * work-grid card.
 *
 *   npm run card -- abf-ticketing
 *
 * The six original cards were made in a mockup tool and are kept as artwork.
 * This exists for cards derived from a capture, so that re-running `npm run
 * shots` can regenerate the card too rather than leaving a stale image that
 * nothing in the repo knows how to rebuild.
 *
 * A card is only as good as its crop. Scaling to `cover` against a frame that
 * is wider than the screenshot means the full width always survives and the
 * trim comes off the height, which is what keeps a pricing table from losing
 * its outer columns.
 */
import sharp from 'sharp'
import { resolve } from 'node:path'

const WORK = resolve(process.cwd(), 'assets-src/work')
const SHOTS = resolve(process.cwd(), 'assets-src/shots')

/**
 * Screen rectangles inside each mockup, in the artwork's own pixels.
 * Measured from the source image, not guessed: the saturated bounding box of
 * the site content pins the width, since the ticker runs edge to edge.
 */
const FRAMES = {
  // assets-src/work/abf.png — straight-on monitor, so a rectangular paste is
  // enough. An angled mockup would need a perspective transform instead.
  'abf-monitor': {
    plate: 'abf.png',
    screen: { left: 290, top: 29, width: 968, height: 583 },
  },
}

const CARDS = {
  'abf-ticketing': { frame: 'abf-monitor', shot: 'abf-ticketing-desktop-1.png' },
}

const [slug] = process.argv.slice(2)
const card = CARDS[slug]

if (!card) {
  console.error(`Unknown card "${slug ?? ''}". Known: ${Object.keys(CARDS).join(', ')}`)
  process.exit(1)
}

const frame = FRAMES[card.frame]
const { screen } = frame

const inner = await sharp(resolve(SHOTS, card.shot))
  .resize(screen.width, screen.height, { fit: 'cover', position: 'top' })
  .toBuffer()

const out = resolve(WORK, `${slug}.png`)
await sharp(resolve(WORK, frame.plate))
  .composite([{ input: inner, left: screen.left, top: screen.top }])
  .png()
  .toFile(out)

const { width, height } = await sharp(out).metadata()
console.log(`${slug}.png  ${width}x${height}  (${card.shot} in ${frame.plate})`)
console.log('Run `npm run images` to regenerate the WebP and JPEG variants.')
