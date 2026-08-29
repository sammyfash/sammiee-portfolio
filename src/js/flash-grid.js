/**
 * Flash grid — the hover "particles".
 *
 * Same trick olivierlarose.com uses: an overlay of fixed-size empty cells. The
 * one under the pointer flashes instantly, then fades back over ~1s. It reads
 * as particles trailing the cursor, but it is just N divs and one delegated
 * listener per layer — no canvas, no per-frame work when the pointer is still.
 *
 * Any element marked `data-flash-grid` becomes a layer. It must sit *behind*
 * content that has `pointer-events: none`, otherwise the content swallows the
 * pointer before the cells ever see it.
 */
import { gsap } from 'gsap'
import { prefersReducedMotion, qsa } from './utils.js'

const CELL = 64          // px, matches the reference
const FADE = 1.15        // seconds for a lit cell to return to transparent
const MAX_CELLS = 1200   // guard against absurd viewports

export function initFlashGrids() {
  if (prefersReducedMotion()) return
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

  for (const layer of qsa('[data-flash-grid]')) initLayer(layer)
}

function initLayer(layer) {
  // Tuning lives in CSS so the look can be dialled without touching JS.
  const flash = Number(getComputedStyle(layer).getPropertyValue('--cell-flash')) || 0.2

  const build = () => {
    const { width, height } = layer.getBoundingClientRect()
    if (width < 1 || height < 1) return

    const cols = Math.ceil(width / CELL)
    const rows = Math.ceil(height / CELL)
    if (cols * rows > MAX_CELLS) { layer.replaceChildren(); return }

    // One string beats cols*rows appendChild calls, and this reruns on resize.
    layer.innerHTML = Array.from({ length: cols }, () =>
      `<div class="flash-col">${'<div class="flash-cell"></div>'.repeat(rows)}</div>`
    ).join('')
  }

  build()

  let frame = null
  new ResizeObserver(() => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(build)
  }).observe(layer)

  // Delegated: pointerover fires once per cell entered and bubbles, so a single
  // listener covers every cell and survives the rebuild on resize.
  layer.addEventListener('pointerover', (event) => {
    const cell = event.target
    if (!cell.classList?.contains('flash-cell')) return

    gsap.killTweensOf(cell)
    gsap.set(cell, { opacity: flash })
    gsap.to(cell, { opacity: 0, duration: FADE, ease: 'power2.out' })
  })
}
