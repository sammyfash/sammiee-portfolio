/** Case-study page: rules draw across, copy unmasks, cover scales in. */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { splitChars, watchLines, openLines, prefersReducedMotion, qs, qsa } from './utils.js'

export function initCase() {
  const page = qs('.case')
  if (!page) return

  const reveals = qsa('[data-reveal]', page)
  gsap.set(reveals, { visibility: 'visible' })
  if (prefersReducedMotion()) return

  const header = qs('.site-header')
  const title = qs('.case__title', page)
  const summary = qs('.case__summary', page)
  const rules = qsa('.rule', page)
  const liveLink = qs('.case__outcome .pill', page)

  const titleChars = qsa('.line__inner', title).flatMap((el) => splitChars(el))

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
  tl.from(header, { yPercent: -120, opacity: 0, duration: 0.9 }, 0)
    .to(rules.slice(0, 2), { scaleX: 1, duration: 1.2, stagger: 0.12, ease: 'expo.inOut' }, 0.1)
    .from(titleChars, {
      yPercent: 118, opacity: 0, duration: 1.1, stagger: 0.016,
      onComplete: openLines(titleChars),
    }, 0.25)

  let summaryTween = null
  watchLines(summary, (lines) => {
    summaryTween?.scrollTrigger?.kill()
    summaryTween?.kill()
    summaryTween = gsap.from(lines, {
      yPercent: 110, duration: 0.9, stagger: 0.045, ease: 'expo.out',
      onComplete: openLines(lines),
      scrollTrigger: { trigger: summary, start: 'top 90%' },
    })
  })

  // The first two rules belong to the intro timeline above; the rest draw as
  // they arrive, each triggered by itself rather than by one shared element.
  for (const rule of rules.slice(2)) {
    gsap.to(rule, {
      scaleX: 1, duration: 1.1, ease: 'expo.inOut',
      scrollTrigger: { trigger: rule, start: 'top 92%' },
    })
  }

  if (liveLink) {
    gsap.from(liveLink, {
      y: 20, opacity: 0, duration: 0.8, ease: 'expo.out',
      scrollTrigger: { trigger: liveLink, start: 'top 92%' },
    })
  }

  // The phone rail drifts sideways as the section passes — the track holds three
  // copies of the shots, so it can travel a full copy's width without a gap.
  const rail = qs('[data-phone-rail]', page)
  if (rail) {
    const track = qs('.case__phones-track', rail)
    gsap.fromTo(track, { xPercent: -33.33 }, {
      xPercent: -10, ease: 'none',
      scrollTrigger: { trigger: rail, start: 'top bottom', end: 'bottom top', scrub: 0.7 },
    })
  }

  for (const mock of qsa('.case__showcase .mock, .case__pair .mock', page)) {
    gsap.from(mock, {
      yPercent: 8, opacity: 0, duration: 1.1, ease: 'expo.out',
      scrollTrigger: { trigger: mock, start: 'top 88%' },
    })
  }

  for (const item of qsa('.case__highlight, .case__facts .case__fact', page)) {
    gsap.from(item, {
      y: 22, opacity: 0, duration: 0.9, ease: 'expo.out',
      scrollTrigger: { trigger: item, start: 'top 90%' },
    })
  }

  const outcome = qs('.case__outcome', page)
  if (outcome) {
    gsap.from(qs('.case__outcome-body p', outcome), {
      y: 24, opacity: 0, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: outcome, start: 'top 78%' },
    })
  }

  const next = qs('.case__next', page)
  if (next) {
    gsap.from(qsa(':scope > *', next), {
      y: 26, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out',
      scrollTrigger: { trigger: next, start: 'top 85%' },
    })
  }

  ScrollTrigger.refresh()
}

/**
 * Build walkthroughs play only while they are on screen. A muted looping video
 * that runs in a background tab is wasted battery, and three of them at once on
 * a slow connection is worse — `preload="none"` plus this keeps it to one.
 */
export function initVideos() {
  const videos = qsa('video[data-autoplay-in-view]')
  if (!videos.length) return

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const video = entry.target
      if (entry.isIntersecting) video.play().catch(() => { /* autoplay refused; poster stands */ })
      else video.pause()
    }
  }, { threshold: 0.25 })

  for (const video of videos) io.observe(video)
}
