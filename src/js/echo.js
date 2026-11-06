/**
 * The wireframe echo (project pages).
 *
 * A quiet echo of the homepage's build crew, so a case study feels like the
 * same site without competing with the reading. As each image arrives, a thin
 * rectangle in one of the crew's colours is drawn on its real edge, the image
 * fades into it, and the rectangle fades away. On arrival, one crew member
 * pops out of the visitor's cursor, draws the hero image's rectangle, and runs
 * back to hide behind the cursor. No typing, no other cursors.
 *
 * Off with reduced motion or ?crew=off, like the crew itself. A failure shows
 * the image at once.
 */
import { gsap } from 'gsap'
import { prefersReducedMotion, qsa } from './utils.js'

const COLOURS = ['#0895fa', '#22c55e', '#fb923c', '#e879f9', '#22d3ee', '#edaa0b']
const ARROW = '<svg class="crew-agent__arrow" viewBox="0 0 16 18" aria-hidden="true"><path d="M1 1v14.2l3.9-3.6 2.7 5.8 2.4-1.1-2.7-5.7h5.4z"/></svg>'

// Tracked from the moment the page loads (not from when the echo starts after
// the preloader), so the crew member can come out of the visitor's cursor.
const pointer = { x: 0, y: 0, known: false }
addEventListener('pointermove', (e) => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.known = true }, { passive: true })

export const echoEnabled = () =>
  !prefersReducedMotion() && new URL(location.href).searchParams.get('crew') !== 'off'

const pageRect = (el) => {
  const r = el.getBoundingClientRect()
  return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height }
}

export function initEcho(selector) {
  if (!echoEnabled()) return
  const targets = qsa(selector).filter((el) => el.getClientRects().length)
  if (!targets.length) return

  const layer = document.createElement('div')
  layer.className = 'crew'
  layer.setAttribute('aria-hidden', 'true')
  document.body.appendChild(layer)

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches

  /** Draw the rectangle on the target's edge, then fade the target into it. */
  const draw = (el, colour, onDrag) => {
    const rect = pageRect(el)
    const b = document.createElement('div')
    b.className = 'crew-box'
    b.style.setProperty('--c', colour)
    b.style.borderRadius = getComputedStyle(el).borderRadius
    b.innerHTML = '<i></i><i></i><i></i><i></i>'
    // Hidden until the drag starts, so no handle waits there while the cursor travels.
    gsap.set(b, { x: rect.x, y: rect.y, width: 0, height: 0, opacity: 0 })
    layer.appendChild(b)
    const p = { k: 0 }
    return gsap.timeline()
      .set(b, { opacity: 1 })
      .to(p, {
        k: 1, duration: 0.5, ease: 'power2.inOut',
        onUpdate: () => {
          gsap.set(b, { width: rect.w * p.k, height: rect.h * p.k })
          onDrag?.(rect.x + rect.w * p.k, rect.y + rect.h * p.k)
        },
      })
      .to(el, { autoAlpha: 1, duration: 0.45, ease: 'power1.out' }, '-=0.05')
      .to(b, { opacity: 0, duration: 0.35, onComplete: () => b.remove() }, '-=0.15')
  }

  /** The hero: one crew member pops out of the cursor, draws it, and runs back. */
  const withAgent = (el, colour) => {
    const a = document.createElement('div')
    a.className = 'crew-agent'
    a.style.setProperty('--c', colour)
    a.innerHTML = ARROW
    layer.appendChild(a)
    const pos = { x: pointer.x + scrollX, y: pointer.y + scrollY }
    const place = () => gsap.set(a, { x: pos.x, y: pos.y })
    place()
    const rect = pageRect(el)
    const tl = gsap.timeline({ onUpdate: place })
    tl.fromTo(a, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.22, ease: 'back.out(2.5)' })
      .to(pos, { x: rect.x, y: rect.y, duration: 0.55, ease: 'power3.inOut' })
      .add(draw(el, colour, (x, y) => { pos.x = x; pos.y = y }))
    // Then back to wherever the visitor's cursor is now, and out of sight.
    tl.call(() => {
      const home = () => ({ x: pointer.x + scrollX, y: pointer.y + scrollY })
      const run = () => {
        const h = home()
        pos.x += (h.x - pos.x) * 0.2
        pos.y += (h.y - pos.y) * 0.2
        place()
        if (Math.hypot(h.x - pos.x, h.y - pos.y) < 10) {
          gsap.ticker.remove(run)
          gsap.to(a, { opacity: 0, scale: 0.5, duration: 0.12, onComplete: () => a.remove() })
        }
      }
      gsap.ticker.add(run)
    })
  }

  for (const el of targets) gsap.set(el, { autoAlpha: 0 })

  let n = 0
  const play = (el) => {
    const colour = COLOURS[n++ % COLOURS.length]
    try {
      if (el === targets[0] && finePointer && pointer.known) withAgent(el, colour)
      else draw(el, colour)
    } catch (error) {
      console.error('[sammyfash] wireframe echo failed — showing the image', error)
      gsap.set(el, { autoAlpha: 1 })
    }
  }

  // Each image draws once a quarter of it is on screen.
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue
      io.unobserve(e.target)
      // The hero waits a moment for the first pointer move, so the crew
      // member can come out of the visitor's own cursor.
      if (e.target === targets[0] && !pointer.known && finePointer) {
        const start = performance.now()
        const tick = () => (pointer.known || performance.now() - start > 900 ? play(e.target) : requestAnimationFrame(tick))
        requestAnimationFrame(tick)
      } else play(e.target)
    }
  }, { threshold: 0.25 })
  for (const el of targets) io.observe(el)
}
