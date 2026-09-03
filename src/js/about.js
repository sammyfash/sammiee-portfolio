/**
 * The statement block arrives in two beats, and deliberately late — nothing
 * happens until the box is most of the way up the viewport.
 *   1. the hairline box draws itself from the top-right to the bottom-left
 *   2. the words light up, scrubbed to scroll position
 */
import { gsap } from 'gsap'
import { splitWords, prefersReducedMotion, qs, qsa } from './utils.js'
import { drawFrame } from './frame.js'

/** Box has to be this far up the viewport before the frame starts drawing. */
const FRAME_START = 'top 58%'
/** The words then run across this window. Starts after the frame is done. */
const WORDS_START = 'top 42%'
const WORDS_END = 'bottom 62%'

const WORD_DIM = 'rgba(255,255,255,0.16)'
const WORD_LIT = 'rgba(255,255,255,1)'

export function initAbout() {
  const section = qs('.about')
  if (!section) return

  const statement = qs('.about__statement', section)
  const box = qs('.about__box', section)
  const more = qs('.about__more', section)

  if (prefersReducedMotion()) {
    gsap.set(qsa('[data-reveal]', section), { visibility: 'visible' })
    return
  }

  // Word splitting does not depend on the box width, so this only runs once.
  const words = splitWords(statement)
  gsap.set(words, { color: WORD_DIM })

  // The statement stays hidden until the box has finished drawing itself — it
  // arrives dim, and only then does the scroll scrub light it up.
  const intro = drawFrame(qs('.frame', section), { trigger: box, start: FRAME_START })
    .set(statement, { visibility: 'visible' })
    .from(statement, { opacity: 0, y: 14, duration: 0.6, ease: 'power2.out' })

  // The link out to the full About page lands last, once the statement has
  // settled. It carries data-reveal, so without this it stays invisible.
  if (more) {
    intro.set(more, { visibility: 'visible' })
        .from(more, { opacity: 0, y: 12, duration: 0.5, ease: 'power2.out' }, '-=0.15')
  }

  gsap.to(words, {
    color: WORD_LIT,
    ease: 'none',
    stagger: 1,
    scrollTrigger: { trigger: box, start: WORDS_START, end: WORDS_END, scrub: 0.5 },
  })
}
