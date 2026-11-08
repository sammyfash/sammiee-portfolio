/** Work grid: cards rise in, images parallax inside their frames. */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { splitChars, openLines, prefersReducedMotion, qs, qsa } from './utils.js'

export function initWork({ crew = false } = {}) {
  const section = qs('.work')
  if (!section) return

  const reveals = qsa('[data-reveal]', section)
  gsap.set(reveals, { visibility: 'visible' })
  if (prefersReducedMotion()) return

  const title = qs('.work__title .line__inner', section)
  const cards = qsa('.work__card', section)

  // With the build crew, only the image parallax stays: the crew places the rest.
  if (title && !crew) {
    const chars = splitChars(title)
    gsap.from(chars, {
      yPercent: 115, opacity: 0, duration: 0.9, stagger: 0.02, ease: 'expo.out',
      onComplete: openLines(chars),
      scrollTrigger: { trigger: section, start: 'top 82%' },
    })
  }

  cards.forEach((card, i) => {
    const media = qs('.work__media', card)

    if (!crew) gsap.from(card, {
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

/**
 * Discipline lenses. The choice is mirrored into ?work= so a filtered grid
 * can be linked from an application ("sammyfash.com/?work=design#work").
 */
const NOTES = {
  all: '',
  design: 'Products, starting with the design side: research, personas and key screens.',
  development: 'The same products, starting with how I built the front end.',
  web: 'Marketing and event websites, designed in Figma and built in WordPress or Webflow.',
}

export function initWorkLenses() {
  const section = qs('.work')
  const buttons = qsa('[data-lens]', section ?? document)
  if (!section || !buttons.length) return

  const items = qsa('.work__item', section)
  const note = qs('[data-lens-note]', section)

  // `animate` only on a real lens change: on load the build crew owns the
  // cards, and a second tween on them left some stuck 24px low, closing the gap.
  const apply = (lens, { push = false, animate = false } = {}) => {
    if (!NOTES.hasOwnProperty(lens)) lens = 'all'
    section.dataset.lens = lens

    for (const b of buttons) b.setAttribute('aria-pressed', String(b.dataset.lens === lens))
    for (const item of items) {
      item.hidden = !item.dataset.lenses.split(' ').includes(lens)
      const card = qs('.work__card', item)
      const slug = card.getAttribute('href').split('?')[0]
      card.setAttribute('href', card.hasAttribute('data-product') && (lens === 'design' || lens === 'development')
        ? `${slug}?view=${lens}` : slug)
    }
    if (note) note.textContent = NOTES[lens]

    const url = new URL(location.href)
    lens === 'all' ? url.searchParams.delete('work') : url.searchParams.set('work', lens)
    history[push ? 'pushState' : 'replaceState'](null, '', url)

    if (animate && !prefersReducedMotion()) {
      gsap.fromTo(items.filter((i) => !i.hidden), { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'expo.out', clearProps: 'transform' })
    }
    ScrollTrigger.refresh()
  }

  for (const b of buttons) b.addEventListener('click', () => apply(b.dataset.lens, { push: true, animate: true }))
  addEventListener('popstate', () => apply(new URL(location.href).searchParams.get('work') ?? 'all', { animate: true }))
  apply(new URL(location.href).searchParams.get('work') ?? 'all')
}
