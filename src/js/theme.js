/**
 * Light / dark switch.
 *
 * /theme.js (in public/, loaded synchronously in <head>) has already put the
 * theme on <html> before first paint: the stored choice, else the OS preference,
 * else light. This module only wires the
 * buttons and performs the switch.
 *
 * Where the View Transitions API exists and motion is allowed, the new theme
 * spreads out from the button that was pressed as a growing circle. Otherwise
 * the switch is instant — the content is identical either way.
 */
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion, qsa } from './utils.js'

const root = document.documentElement
const current = () => (root.dataset.theme === 'light' ? 'light' : 'dark')

function apply(theme, { persist = true } = {}) {
  root.dataset.theme = theme
  if (persist) {
    try { localStorage.setItem('theme', theme) } catch { /* private mode: session-only */ }
  }

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.content = theme === 'light' ? '#f3f2ee' : '#000000'

  for (const btn of qsa('[data-theme-toggle]')) {
    const next = theme === 'light' ? 'dark' : 'light'
    btn.setAttribute('aria-label', `Switch to ${next} theme`)
    btn.setAttribute('aria-pressed', String(theme === 'light'))
    const label = btn.querySelector('[data-theme-label]')
    if (label) label.textContent = `${next[0].toUpperCase()}${next.slice(1)} mode`
  }
}

function toggle(event) {
  const next = current() === 'light' ? 'dark' : 'light'

  if (!document.startViewTransition || prefersReducedMotion()) {
    apply(next)
    return
  }

  // Grow from the centre of the pressed button to the farthest corner.
  const r = event.currentTarget.getBoundingClientRect()
  const x = r.left + r.width / 2
  const y = r.top + r.height / 2
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

  const transition = document.startViewTransition(() => apply(next))
  transition.ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 650, easing: 'cubic-bezier(0.76, 0, 0.24, 1)', pseudoElement: '::view-transition-new(root)' },
    )
  }).catch(() => { /* transition skipped: theme is still applied */ })
  transition.finished.then(() => ScrollTrigger.refresh()).catch(() => {})
}

const stored = () => {
  try { return localStorage.getItem('theme') } catch { return null }
}

export function initTheme() {
  apply(current(), { persist: false })
  for (const btn of qsa('[data-theme-toggle]')) btn.addEventListener('click', toggle)

  // Until the visitor picks one, follow the operating system live.
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!stored()) apply(e.matches ? 'dark' : 'light', { persist: false })
  })
}
