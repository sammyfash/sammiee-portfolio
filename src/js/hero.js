/** Hero choreography: grid draws, type unmasks, then the plates fan open. */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { splitChars, watchLines, openLines, prefersReducedMotion, qs, qsa } from './utils.js'

/** How long the portrait stays a plain photo before the plates appear. */
const PLATE_DELAY = 2
const PLATE_OUT = { duration: 1.1, ease: 'expo.out' }
const PLATE_IN = { duration: 0.55, ease: 'power3.inOut' }

export function initHero() {
  const hero = qs('.hero')
  if (!hero) return

  const reveals = qsa('[data-reveal]', hero)

  if (prefersReducedMotion()) {
    gsap.set(reveals, { visibility: 'visible' })
    return
  }

  const gridLines = qsa('.hero__grid span, .hero__rails span', hero)
  const header = qs('.site-header')
  const greeting = qs('.hero__greeting', hero)
  const statement = qs('.hero__display', qs('.hero__statement', hero))
  const lede = qs('.hero__lede', hero)
  const portrait = qs('.hero__portrait', hero)
  const plates = qsa('.hero__plate', hero)
  const photo = qs('.hero__portrait img', hero)

  const greetChars = qsa('.line__inner', greeting).flatMap((el) => splitChars(el))
  const stateChars = qsa('.line__inner', statement).flatMap((el) => splitChars(el))

  gsap.set(reveals, { visibility: 'visible' })

  // The plates rest fanned out in CSS so a no-JS page still looks designed.
  // With JS they start flat — hidden exactly behind the photo, since they are
  // the same 246px square on the same centre — and fan out a beat later.
  gsap.set(plates, { rotation: 0 })

  let ledePlayed = false
  watchLines(lede, (lines) => {
    if (ledePlayed) return
    ledePlayed = true
    gsap.from(lines, {
      yPercent: 110, duration: 0.9, stagger: 0.08, ease: 'expo.out', delay: 0.85,
      onComplete: openLines(lines),
    })
  })

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

  tl.from(header, { yPercent: -120, opacity: 0, duration: 0.9 }, 0)
    // Each line rests collapsed on its own axis; scaling both to 1 draws it open.
    .to(gridLines, {
      scaleX: 1, scaleY: 1, duration: 1.4, stagger: 0.08, ease: 'expo.inOut',
    }, 0.15)
    .from(greetChars, {
      yPercent: 118, opacity: 0, duration: 1.1, stagger: 0.022,
      onComplete: openLines(greetChars),
    }, 0.3)
    .from(stateChars, {
      yPercent: 118, opacity: 0, duration: 1.1, stagger: 0.018,
      onComplete: openLines(stateChars),
    }, 0.45)
    .from(photo, { scale: 1.35, duration: 1.6, ease: 'expo.out' }, 0.5)
    .from(portrait, { yPercent: 14, opacity: 0, duration: 1.2 }, 0.5)
    // …and only now do the plates swing out from behind the photo.
    .to(plates, {
      rotation: (i, target) => Number(target.dataset.angle),
      stagger: 0.08,
      ...PLATE_OUT,
    }, PLATE_DELAY)

  initPortraitHover(portrait, plates)
  syncRails(hero)

  // The grid lines are structure, not decoration — hold them, but let the
  // portrait and the type drift at different rates as the hero leaves.
  gsap.timeline({
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 },
  })
    .to(portrait, { yPercent: 26, ease: 'none' }, 0)
    .to(greeting, { yPercent: -32, opacity: 0.25, ease: 'none' }, 0)
    .to(qs('.hero__statement', hero), { yPercent: -12, opacity: 0.35, ease: 'none' }, 0)
    .to(gridLines, { opacity: 0.35, ease: 'none' }, 0)

  // Pointer parallax — small, so it reads as depth rather than as a gimmick.
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const toX = gsap.quickTo(portrait, 'x', { duration: 0.9, ease: 'power3' })
    const toY = gsap.quickTo(portrait, 'y', { duration: 0.9, ease: 'power3' })

    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect()
      const nx = (e.clientX - r.left) / r.width - 0.5
      const ny = (e.clientY - r.top) / r.height - 0.5
      toX(nx * 26)
      toY(ny * 18)
    }, { passive: true })
  }

  ScrollTrigger.refresh()
  return tl
}

/**
 * The two vertical rails run from the very top of the page down to the top of
 * the next section's box — a span no CSS length can express, since it crosses
 * two siblings. Measured here instead, and kept in sync on resize.
 */
function syncRails(hero) {
  const rails = qs('.hero__rails', hero)
  const next = qs('.about')
  if (!rails || !next) return

  const sync = () => {
    const heroTop = hero.getBoundingClientRect().top + window.scrollY
    const nextTop = next.getBoundingClientRect().top + window.scrollY
    rails.style.top = `${-heroTop}px`
    rails.style.height = `${nextTop}px`
  }

  sync()
  new ResizeObserver(sync).observe(document.body)
  window.addEventListener('load', sync)
}

/**
 * Hovering the photo folds the plates back to 0° so they vanish behind it;
 * leaving fans them out again. `overwrite` stops a fast in-out from stacking
 * two tweens on the same rotation.
 */
function initPortraitHover(portrait, plates) {
  if (!portrait || !plates.length) return

  const fold = () => gsap.to(plates, { rotation: 0, overwrite: 'auto', ...PLATE_IN })
  const fan = () => gsap.to(plates, {
    rotation: (i, target) => Number(target.dataset.angle),
    overwrite: 'auto',
    stagger: 0.05,
    ...PLATE_OUT,
  })

  portrait.addEventListener('pointerenter', fold)
  portrait.addEventListener('pointerleave', fan)
  // Keyboard parity: the portrait is focusable, so give it the same behaviour.
  portrait.addEventListener('focusin', fold)
  portrait.addEventListener('focusout', fan)
}
