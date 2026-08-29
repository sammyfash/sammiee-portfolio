/** Curtain page transitions between the portfolio's own pages. */
import { gsap } from 'gsap'
import { prefersReducedMotion, qs } from './utils.js'

export function initTransitions() {
  const curtain = qs('.curtain')
  if (!curtain || prefersReducedMotion()) return

  // Coming back via bfcache must not leave the curtain down.
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) gsap.set(curtain, { yPercent: 100 })
  })

  document.addEventListener('click', (e) => {
    const link = e.target.closest?.('a[href]')
    if (!link) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    if (link.target && link.target !== '_self') return
    if (link.hasAttribute('download') || link.dataset.noTransition !== undefined) return

    const url = new URL(link.href, location.href)
    if (url.origin !== location.origin) return
    if (url.pathname === location.pathname) return   // same page / hash link
    // Same-origin page navigations only. Anything that looks like a real file
    // — an image, the build videos, a PDF — is left to the browser. Clean URLs
    // like /bmoni have no extension at all, so they pass.
    if (/\.(?!html?$)[a-z0-9]+$/i.test(url.pathname)) return

    e.preventDefault()
    gsap.timeline({ onComplete: () => { location.href = url.href } })
      .set(curtain, { yPercent: 100 })
      .to(curtain, { yPercent: 0, duration: 0.6, ease: 'expo.inOut' })
  })
}
