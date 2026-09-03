/** About page: same chrome, plus a plain reveal for each block. */
import '../styles/main.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { boot, guard } from './boot.js'
import { initFooter } from './footer.js'
import { prefersReducedMotion, qs, qsa } from './utils.js'

gsap.registerPlugin(ScrollTrigger)

function initAboutPage() {
  const page = qs('.about-page')
  if (!page) return

  gsap.set(qsa('[data-reveal]', page), { visibility: 'visible' })
  if (prefersReducedMotion()) return

  for (const rule of qsa('.rule', page)) {
    gsap.to(rule, {
      scaleX: 1, duration: 1.1, ease: 'expo.inOut',
      scrollTrigger: { trigger: rule, start: 'top 92%' },
    })
  }

  const intro = qsa('.about-page__eyebrow, .about-page__title, .about-page__lead > p', page)
  gsap.from(intro, {
    y: 26, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out', delay: 0.15,
  })

  for (const item of qsa('.about-page__stat, .cap, .about-page__work-list li', page)) {
    gsap.from(item, {
      y: 22, opacity: 0, duration: 0.9, ease: 'expo.out',
      scrollTrigger: { trigger: item, start: 'top 90%' },
    })
  }

  for (const h of qsa('.about-page__h2', page)) {
    gsap.from(h, {
      y: 20, opacity: 0, duration: 0.8, ease: 'expo.out',
      scrollTrigger: { trigger: h, start: 'top 90%' },
    })
  }
}

boot({
  beforePreloader: () => { guard('about page', initAboutPage); guard('footer', initFooter) },
})
