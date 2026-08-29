/** Full-screen nav: clip-path wipe in, staggered links, focus trapped inside. */
import { gsap } from 'gsap'
import { prefersReducedMotion, qs, qsa } from './utils.js'
import { stopScroll, startScroll, scrollTo } from './scroll.js'

export function initMenu() {
  const overlay = qs('.nav-overlay')
  const toggle = qs('.menu-toggle')
  const close = qs('.nav-close')
  if (!overlay || !toggle) return

  const links = qsa('.nav-link', overlay)
  const foot = qs('.nav-overlay__foot', overlay)
  const header = qs('.nav-overlay__header', overlay)
  let open = false
  let tl = null
  let lastFocused = null

  const build = () => {
    const timeline = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
    timeline
      .set(overlay, { visibility: 'visible' })
      .fromTo(overlay,
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 0.9 })
      .from(header, { opacity: 0, duration: 0.4 }, 0.25)
      .from(links.map((l) => l.parentElement), {
        yPercent: 40, opacity: 0, duration: 0.8, stagger: 0.07,
      }, 0.2)
      .from(foot, { opacity: 0, y: 16, duration: 0.5 }, 0.55)
    return timeline
  }

  const setOpen = (next) => {
    if (next === open) return
    open = next
    overlay.dataset.open = String(open)
    overlay.setAttribute('aria-hidden', String(!open))
    toggle.setAttribute('aria-expanded', String(open))
    document.body.dataset.navOpen = String(open)

    if (prefersReducedMotion()) {
      overlay.style.clipPath = open ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)'
      overlay.style.visibility = open ? 'visible' : 'hidden'
    } else {
      tl ??= build()
      open ? tl.play() : tl.reverse()
    }

    if (open) {
      lastFocused = document.activeElement
      stopScroll()
      ;(links[0] ?? close)?.focus({ preventScroll: true })
    } else {
      startScroll()
      lastFocused?.focus?.({ preventScroll: true })
    }
  }

  toggle.addEventListener('click', () => setOpen(true))
  close?.addEventListener('click', () => setOpen(false))

  document.addEventListener('keydown', (e) => {
    if (!open) return
    if (e.key === 'Escape') { setOpen(false); return }
    if (e.key !== 'Tab') return
    // simple focus trap
    const focusables = qsa('a[href], button:not([disabled])', overlay)
    if (!focusables.length) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  })

  // In-page anchors close the menu and hand off to Lenis.
  for (const link of links) {
    const href = link.getAttribute('href') ?? ''
    if (!href.startsWith('#')) continue
    link.addEventListener('click', (e) => {
      e.preventDefault()
      setOpen(false)
      const target = qs(href)
      if (target) setTimeout(() => scrollTo(target), 320)
    })
  }

  return { close: () => setOpen(false) }
}
