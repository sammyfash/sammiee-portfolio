/**
 * CV page: same chrome as the rest of the site, plus the track switch.
 *
 * Both CV tracks are already in the markup and cv.css hides one, so switching
 * is a single attribute write. The URL is kept in step (`/cv` and
 * `/cv?wordpress`) so either version can be linked to directly, which is the
 * whole point: the right CV goes to the right application.
 */
import '../styles/main.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { boot, guard } from './boot.js'
import { initFooter } from './footer.js'
import { prefersReducedMotion, qs, qsa } from './utils.js'

gsap.registerPlugin(ScrollTrigger)

const TRACKS = ['de', 'wp']

/** `/cv?wordpress` opens the WordPress track; anything else opens the default. */
const trackFromUrl = () =>
  new URLSearchParams(window.location.search).has('wordpress') ? 'wp' : 'de'

function initCvPage() {
  const page = qs('.cv')
  if (!page) return

  const buttons = qsa('[data-track-btn]', page)

  function setTrack(track, { push = false } = {}) {
    if (!TRACKS.includes(track)) return
    page.dataset.track = track

    for (const btn of buttons) {
      btn.setAttribute('aria-pressed', String(btn.dataset.trackBtn === track))
    }

    // The download button has to follow the track, or the wrong PDF ships.
    const dl = qs('[data-cv-download]', page)
    if (dl) {
      const file = dl.dataset[track === 'wp' ? 'fileWp' : 'fileDe']
      if (file) {
        dl.setAttribute('href', file)
        dl.setAttribute('download', file.replace(/^.*\//, ''))
      }
    }

    if (push) {
      const url = track === 'wp' ? '/cv?wordpress' : '/cv'
      window.history.replaceState({ track }, '', url)
    }
  }

  setTrack(trackFromUrl())

  for (const btn of buttons) {
    btn.addEventListener('click', () => setTrack(btn.dataset.trackBtn, { push: true }))
  }

  // Printing must never capture a half-played reveal.
  window.addEventListener('beforeprint', () => {
    gsap.set(qsa('[data-reveal]', page), { visibility: 'visible', opacity: 1, y: 0, clearProps: 'transform' })
  })

  gsap.set(qsa('[data-reveal]', page), { visibility: 'visible' })
  if (prefersReducedMotion()) return

  gsap.from(qsa('.cv__name, .cv__role, .cv__tagline, .cv__contact, .cv__switch', page), {
    y: 24, opacity: 0, duration: 0.9, stagger: 0.07, ease: 'expo.out', delay: 0.12,
  })

  for (const item of qsa('.cv__h2, .cv__role-item, .cv__skill-group, .cv__selected li', page)) {
    gsap.from(item, {
      y: 20, opacity: 0, duration: 0.8, ease: 'expo.out',
      scrollTrigger: { trigger: item, start: 'top 92%' },
    })
  }
}

boot({
  beforePreloader: () => { guard('cv page', initCvPage); guard('footer', initFooter) },
})
