/**
 * The hairline box "draws" itself instead of fading in.
 *
 * Two beats, both starting from the top-right corner:
 *   1. the top edge runs right → left while the right edge runs top → bottom
 *   2. the left edge runs top → bottom while the bottom edge runs right → left
 * so the two strokes meet at the bottom-left. The corner ticks land last.
 *
 * Each edge is a 1px element scaled from 0 on its own axis — the direction is
 * set by `transform-origin` in base.css, not here.
 */
import { gsap } from 'gsap'
import { qs, qsa } from './utils.js'

export function drawFrame(frame, { trigger, start = 'top 58%', delay = 0 } = {}) {
  if (!frame) return null

  const first = [qs('.frame__edge--t', frame), qs('.frame__edge--r', frame)].filter(Boolean)
  const second = [qs('.frame__edge--l', frame), qs('.frame__edge--b', frame)].filter(Boolean)
  const ticks = qsa('.frame i', frame)

  const tl = gsap.timeline({
    defaults: { ease: 'power3.inOut' },
    delay,
    scrollTrigger: trigger ? { trigger, start } : undefined,
  })

  // scaleX only moves the horizontal edges, scaleY only the vertical ones, so
  // both can be sent to 1 together without any per-element branching.
  // Empty sets are skipped: GSAP warns on a tween with no target, and a frame
  // missing an edge or its ticks should still animate the parts it does have.
  if (first.length) tl.to(first, { scaleX: 1, scaleY: 1, duration: 0.55 })
  if (second.length) tl.to(second, { scaleX: 1, scaleY: 1, duration: 0.55 }, '-=0.08')
  if (ticks.length) tl.to(ticks, { opacity: 1, duration: 0.3, stagger: 0.05, ease: 'power2.out' }, '-=0.2')

  return tl
}
