/** Work grid: cards rise in, images parallax inside their frames. */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { splitChars, openLines, prefersReducedMotion, qs, qsa } from './utils.js'

export function initWork() {
  const section = qs('.work')
  if (!section) return

  const reveals = qsa('[data-reveal]', section)
  gsap.set(reveals, { visibility: 'visible' })
  if (prefersReducedMotion()) return

  const title = qs('.work__title .line__inner', section)
  const cards = qsa('.work__card', section)

  if (title) {
    const chars = splitChars(title)
    gsap.from(chars, {
      yPercent: 115, opacity: 0, duration: 0.9, stagger: 0.02, ease: 'expo.out',
      onComplete: openLines(chars),
      scrollTrigger: { trigger: section, start: 'top 82%' },
    })
  }

  cards.forEach((card, i) => {
    const media = qs('.work__media', card)

    gsap.from(card, {
      yPercent: 12,
      opacity: 0,
      duration: 1.1,
      ease: 'expo.out',
      delay: (i % 2) * 0.08,
      scrollTrigger: { trigger: card, start: 'top 88%' },
    })

    // The 12% of extra image height gives this room to move without a gap.
    gsap.fromTo(media,
      { yPercent: -5 },
      {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
      })
  })

  ScrollTrigger.refresh()
}
