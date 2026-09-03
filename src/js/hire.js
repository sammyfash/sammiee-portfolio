/**
 * The band under the work grid. Nothing here is decorative: it is the part a
 * recruiter reads before deciding whether to click through, so it reveals on
 * arrival rather than waiting on a long scrubbed sequence.
 */
import { gsap } from 'gsap'
import { prefersReducedMotion, qs, qsa } from './utils.js'

export function initHire() {
  const section = qs('.hire')
  if (!section) return

  const reveals = qsa('[data-reveal]', section)

  // Motion is the enhancement; the copy is not optional. Anything that stops
  // this function early still leaves the band on screen.
  if (prefersReducedMotion()) {
    gsap.set(reveals, { visibility: 'visible' })
    gsap.set(qsa('.rule', section), { scaleX: 1 })
    return
  }
  gsap.set(reveals, { visibility: 'visible' })

  const rule = qs('.rule', section)
  if (rule) {
    gsap.to(rule, {
      scaleX: 1, duration: 1.1, ease: 'expo.inOut',
      scrollTrigger: { trigger: section, start: 'top 86%' },
    })
  }

  gsap.from(qsa('.hire__title, .hire__lead', section), {
    y: 24, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'expo.out',
    scrollTrigger: { trigger: section, start: 'top 78%' },
  })

  // Stats and capability groups each run off their own row, so a wide viewport
  // does not stagger a whole grid from one trigger.
  for (const group of ['.hire__proof', '.hire__caps']) {
    const el = qs(group, section)
    if (!el) continue
    gsap.from(qsa(':scope > *', el), {
      y: 22, opacity: 0, duration: 0.85, stagger: 0.07, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    })
  }

  const cta = qs('.hire__cta', section)
  if (cta) {
    gsap.from(cta, {
      y: 18, opacity: 0, duration: 0.8, ease: 'expo.out',
      scrollTrigger: { trigger: cta, start: 'top 92%' },
    })
  }
}
