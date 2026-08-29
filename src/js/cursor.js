/**
 * Pointer follower.
 *
 * Everything is resolved from the pointer's own target on each move, rather
 * than from pointerenter/pointerleave on sections. That matters: enter/leave
 * only fire when the *pointer* crosses a boundary, so scrolling a section out
 * from under a stationary cursor used to leave the wrong look on screen.
 *
 * Markup contract:
 *   [data-cursor-zone="cross"]  this subtree uses the crosshair
 *   [data-cursor-tag="Label"]   show a chip beside the cursor
 *   [data-cursor-color="#hex"]  that chip's colour
 *   a[href] / button            always the hand, whatever the zone says
 */
import { gsap } from 'gsap'
import { prefersReducedMotion, qs, qsa } from './utils.js'

const ARROW_EASE = { duration: 0.10, ease: 'power3' }
const HAND_EASE = { duration: 0.10, ease: 'power3' }
const KNOT_EASE = { duration: 0.09, ease: 'power3' }
const LINE_EASE = { duration: 0.22, ease: 'power3' }
const TAG_EASE = { duration: 0.24, ease: 'power3' }

export function initCursor() {
  if (prefersReducedMotion()) return
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

  const cursor = qs('.cursor')
  if (!cursor) return

  const arrow = qs('.cursor__arrow', cursor)
  const hand = qs('.cursor__hand', cursor)
  const lineX = qs('.cursor__line--x', cursor)
  const lineY = qs('.cursor__line--y', cursor)
  const knot = qs('.cursor__knot', cursor)
  const tag = qs('.cursor__tag', cursor)
  const tagText = qs('.cursor__tag span', cursor)

  const move = [
    [gsap.quickTo(arrow, 'x', ARROW_EASE), gsap.quickTo(arrow, 'y', ARROW_EASE)],
    [gsap.quickTo(hand, 'x', HAND_EASE), gsap.quickTo(hand, 'y', HAND_EASE)],
    [gsap.quickTo(knot, 'x', KNOT_EASE), gsap.quickTo(knot, 'y', KNOT_EASE)],
    [null, gsap.quickTo(lineX, 'y', LINE_EASE)],
    [gsap.quickTo(lineY, 'x', LINE_EASE), null],
    [gsap.quickTo(tag, 'x', TAG_EASE), gsap.quickTo(tag, 'y', TAG_EASE)],
  ]

  cursor.dataset.look = 'arrow'
  cursor.dataset.tag = 'false'
  document.documentElement.classList.add('cursor-custom')

  /** Decide the look and the chip from whatever is under the pointer. */
  const resolve = (target) => {
    if (!target?.closest) return

    const clickable = target.closest('a[href], button')
    const zone = target.closest('[data-cursor-zone]')
    cursor.dataset.look = clickable ? 'hand'
      : zone?.dataset.cursorZone === 'cross' ? 'cross'
      : 'arrow'

    const tagged = target.closest('[data-cursor-tag]')
    if (tagged) {
      tagText.textContent = tagged.dataset.cursorTag
      if (tagged.dataset.cursorColor) {
        cursor.style.setProperty('--tag-bg', tagged.dataset.cursorColor)
      }
    }
    cursor.dataset.tag = tagged ? 'true' : 'false'
  }

  let lastX = 0
  let lastY = 0
  let visible = false

  window.addEventListener('pointermove', (e) => {
    lastX = e.clientX
    lastY = e.clientY

    if (!visible) {
      visible = true
      gsap.to(cursor, { opacity: 1, duration: 0.3 })
    }
    for (const [setX, setY] of move) {
      setX?.(e.clientX)
      setY?.(e.clientY)
    }
    resolve(e.target)
  }, { passive: true })

  // Scrolling moves the page under a stationary pointer, so re-resolve then too.
  let queued = false
  window.addEventListener('scroll', () => {
    if (queued || !visible) return
    queued = true
    requestAnimationFrame(() => {
      queued = false
      resolve(document.elementFromPoint(lastX, lastY))
    })
  }, { passive: true })

  document.addEventListener('pointerleave', () => {
    visible = false
    gsap.to(cursor, { opacity: 0, duration: 0.25 })
  })

  initMagnetic()
}

/** Buttons drift toward the pointer, then snap back on exit. */
export function initMagnetic() {
  if (prefersReducedMotion()) return
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

  for (const el of qsa('[data-magnetic]')) {
    const strength = Number(el.dataset.magnetic) || 0.3
    const moveX = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' })
    const moveY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })

    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect()
      moveX((e.clientX - (r.left + r.width / 2)) * strength)
      moveY((e.clientY - (r.top + r.height / 2)) * strength)
    })
    el.addEventListener('pointerleave', () => { moveX(0); moveY(0) })
  }
}
