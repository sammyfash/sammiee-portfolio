/**
 * First-paint curtain: the wordmark fills from faded to white left-to-right
 * while the counter under it runs 0% → 100%, then the whole panel lifts.
 */
import { gsap } from 'gsap'
import { prefersReducedMotion, qs } from './utils.js'
import { stopScroll, startScroll } from './scroll.js'

/** Longest we wait on `load` before deciding the page is ready enough. */
const MAX_WAIT = 3500
/** How long the curtain may stay down while the user is actually looking. */
const FAILSAFE = 9000
/**
 * Absolute ceiling, on a plain timer that ignores visibility.
 *
 * A hidden or occluded tab throttles requestAnimationFrame, which is what
 * drives GSAP's ticker — so the exit tween can simply never advance. The
 * visibility-aware failsafe above is disabled in exactly that state by design,
 * which left no way out at all: boot() waits on this promise, so a stalled
 * ticker meant a permanently black page. This one always fires.
 */
const HARD_STOP = 12000
/** How long the count itself takes, once assets are not the bottleneck. */
const COUNT_DURATION = 1.1
/**
 * Marks that this tab has already seen the intro.
 *
 * The curtain is an introduction, and an introduction happens once. A visitor
 * reading the homepage, the CV and three case studies was sitting through it
 * five times, which on a site whose whole job is to be evaluated quickly is the
 * most expensive thing on the page. sessionStorage rather than localStorage, so
 * a later visit on another day still gets it.
 */
const SEEN_KEY = 'sammyfash:intro-seen'

/** Private mode and blocked storage both throw; neither should break the page. */
const seenThisSession = () => {
  try { return sessionStorage.getItem(SEEN_KEY) === '1' } catch { return false }
}
const markSeen = () => {
  try { sessionStorage.setItem(SEEN_KEY, '1') } catch { /* storage unavailable */ }
}

export function runPreloader() {
  const el = qs('.preloader')
  if (!el) return Promise.resolve()

  if (prefersReducedMotion() || seenThisSession()) {
    el.remove()
    return Promise.resolve()
  }

  markSeen()

  stopScroll()
  window.scrollTo(0, 0)

  const mark = qs('.preloader__mark', el)
  const count = qs('.preloader__count', el)

  const assetsReady = new Promise((resolve) => {
    if (document.readyState === 'complete') return resolve()
    window.addEventListener('load', resolve, { once: true })
    setTimeout(resolve, MAX_WAIT)
  })

  return new Promise((resolve) => {
    let finished = false
    let failsafe = null

    const hardStop = setTimeout(() => finish(), HARD_STOP)

    const finish = () => {
      if (finished) return
      finished = true
      clearTimeout(failsafe)
      clearTimeout(hardStop)
      document.removeEventListener('visibilitychange', armFailsafe)
      el.remove()
      startScroll()
      resolve()
    }

    // A stalled ticker or a thrown tween must never leave the curtain down over
    // the page. The timer only runs while the tab is on screen, so opening the
    // site in a background tab still gets the full intro on return.
    function armFailsafe() {
      clearTimeout(failsafe)
      if (!document.hidden) failsafe = setTimeout(finish, FAILSAFE)
    }
    document.addEventListener('visibilitychange', armFailsafe)
    armFailsafe()

    // One source of truth for both the gradient stop and the printed number.
    const progress = { value: 0 }

    const tl = gsap.timeline()

    tl.from(mark, { yPercent: 40, opacity: 0, duration: 0.7, ease: 'expo.out' })
      .from(count, { opacity: 0, duration: 0.4, ease: 'power2.out' }, '<0.15')
      .to(progress, {
        value: 100,
        duration: COUNT_DURATION,
        ease: 'power1.inOut',
        onUpdate: () => {
          const n = Math.round(progress.value)
          count.textContent = `${n}%`
          mark.style.setProperty('--fill', `${n}%`)
        },
      }, 0.25)

    tl.eventCallback('onComplete', async () => {
      await assetsReady
      if (finished) return

      // No point animating a curtain nobody is watching — and in a hidden tab
      // the tween would not advance anyway. Just lift it.
      if (document.hidden) return finish()

      gsap.timeline({ onComplete: finish })
        .to([mark, count], {
          yPercent: -120, opacity: 0, duration: 0.55, ease: 'expo.in', stagger: 0.05,
        })
        .to(el, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '-=0.15')
    })
  })
}
