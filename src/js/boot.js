/**
 * Shared page bootstrap.
 *
 * The rule this file exists to enforce: motion may fail, content may not. Every
 * init runs inside a guard, and anything that escapes reveals the page rather
 * than leaving it hidden behind `[data-reveal]` or the preloader.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { revealAll } from './utils.js'
import { initScroll, trackViewportUnit } from './scroll.js'
import { runPreloader } from './preloader.js'
import { initCursor } from './cursor.js'
import { initMenu } from './menu.js'
import { initTransitions } from './transitions.js'
import { initFlashGrids } from './flash-grid.js'
import { initContact } from './contact.js'

/** Run `fn`, and if it throws, log it and make sure the page is still readable. */
export function guard(name, fn) {
  try {
    return fn()
  } catch (error) {
    console.error(`[sammiee] ${name} failed — revealing content`, error)
    revealAll()
    return undefined
  }
}

/**
 * @param {object} page
 * @param {() => void} [page.beforePreloader] sections that must exist before the curtain lifts
 * @param {() => void} [page.afterPreloader]  the intro that plays once it has
 */
export function boot({ beforePreloader, afterPreloader } = {}) {
  document.documentElement.classList.add('js')

  // Dev-only handle so timelines can be scrubbed from the console. Stripped in build.
  if (import.meta.env.DEV) Object.assign(window, { gsap, ScrollTrigger })

  // Last line of defence: anything unhandled anywhere still leaves a usable page.
  window.addEventListener('error', () => revealAll())
  window.addEventListener('unhandledrejection', () => revealAll())

  guard('viewport unit', trackViewportUnit)
  guard('smooth scroll', initScroll)
  guard('cursor', initCursor)
  guard('menu', initMenu)
  guard('page transitions', initTransitions)
  guard('flash grids', initFlashGrids)
  guard('contact form', initContact)

  if (beforePreloader) guard('sections', beforePreloader)

  runPreloader()
    .catch((error) => { console.error('[sammiee] preloader failed', error); revealAll() })
    .then(() => {
      if (afterPreloader) guard('intro', afterPreloader)
      ScrollTrigger.refresh()
    })

  window.addEventListener('load', () => ScrollTrigger.refresh())
}
