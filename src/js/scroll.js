/** Lenis smooth scrolling, wired into GSAP's ticker and ScrollTrigger. */
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from './utils.js'

gsap.registerPlugin(ScrollTrigger)

let lenis = null

export function initScroll() {
  // Native scrolling is the honest answer when the user has asked for less motion.
  if (prefersReducedMotion()) {
    document.documentElement.style.scrollBehavior = 'auto'
    return null
  }

  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.6,
  })

  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  return lenis
}

export const getLenis = () => lenis

export function stopScroll() { lenis?.stop() }
export function startScroll() { lenis?.start() }

export function scrollTo(target, options = {}) {
  if (lenis) return lenis.scrollTo(target, { offset: 0, duration: 1.2, ...options })
  const el = typeof target === 'string' ? document.querySelector(target) : target
  el?.scrollIntoView({ behavior: 'auto', block: 'start' })
}

/** Keep viewport-height maths honest on mobile, where the chrome moves. */
export function trackViewportUnit() {
  const set = () => document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
  set()
  window.addEventListener('resize', set)
}
