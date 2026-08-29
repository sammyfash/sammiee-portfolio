/** Closing CTA: heading unmasks line by line, contact column follows. */
import { gsap } from 'gsap'
import { watchLines, openLines, prefersReducedMotion, qs, qsa } from './utils.js'
import { drawFrame } from './frame.js'

export function initFooter() {
  const footer = qs('.site-footer')
  if (!footer) return

  gsap.set(qsa('[data-reveal]', footer), { visibility: 'visible' })
  if (prefersReducedMotion()) return

  const box = qs('.site-footer__box', footer)
  const heading = qs('.site-footer__heading', footer)
  const button = qs('.site-footer__button', footer)
  const contact = qs('.site-footer__contact', footer)
  const fineprint = qs('.site-footer__fineprint', footer)

  let tween = null
  watchLines(heading, (lines) => {
    tween?.scrollTrigger?.kill()
    tween?.kill()
    tween = gsap.from(lines, {
      yPercent: 110,
      duration: 1.1,
      stagger: 0.09,
      ease: 'expo.out',
      onComplete: openLines(lines),
      scrollTrigger: { trigger: box, start: 'top 78%' },
    })
  })

  drawFrame(qs('.frame', footer), { trigger: box, start: 'top 78%' })
  gsap.from([button, ...qsa(':scope > *', contact)], {
    y: 26, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out',
    scrollTrigger: { trigger: box, start: 'top 68%' },
  })
  gsap.from(fineprint, {
    opacity: 0, duration: 0.8,
    scrollTrigger: { trigger: fineprint, start: 'top 95%' },
  })
}
