/**
 * Lightbox for case-study images.
 *
 * Markup contract (written by scripts/build-pages.mjs):
 *   <button data-zoom="/img/screens/x.webp" data-zoom-w data-zoom-h
 *           data-zoom-kind="page|phone|image" data-zoom-caption="…">
 *
 * A mockup opens the clean screen behind the photo, not the photo itself, so a
 * reader can judge the design at full resolution. 'page' screens are long
 * desktop captures: they open at reading width and scroll. Everything else
 * opens fitted to the viewport. Click the image (or press +/-) to zoom; drag
 * or scroll to pan; arrows step through every image on the page.
 *
 * Native <dialog>: focus is trapped, Escape closes, and focus returns to the
 * image that opened it.
 */
import { prefersReducedMotion, qsa } from './utils.js'
import { stopScroll, startScroll } from './scroll.js'

const PAD = 24
const READING_WIDTH = 1280

const ICONS = {
  zoomIn: '<path d="M11 8v6M8 11h6"/><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  zoomOut: '<path d="M8 11h6"/><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  prev: '<path d="m15 18-6-6 6-6"/>',
  next: '<path d="m9 18 6-6-6-6"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
}
const icon = (name) =>
  `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`

export function initLightbox() {
  const triggers = qsa('[data-zoom]')
  if (!triggers.length) return

  const dialog = document.createElement('dialog')
  dialog.className = 'lightbox'
  dialog.setAttribute('aria-labelledby', 'lightbox-caption')
  dialog.innerHTML = `
    <div class="lightbox__bar">
      <p class="lightbox__caption" id="lightbox-caption"></p>
      <p class="lightbox__count" aria-live="polite"></p>
      <div class="lightbox__tools">
        <button type="button" class="lightbox__btn" data-act="zoom">${icon('zoomIn')}<span class="lightbox__sr">Zoom in</span></button>
        <button type="button" class="lightbox__btn" data-act="prev">${icon('prev')}<span class="lightbox__sr">Previous image</span></button>
        <button type="button" class="lightbox__btn" data-act="next">${icon('next')}<span class="lightbox__sr">Next image</span></button>
        <button type="button" class="lightbox__btn" data-act="close">${icon('close')}<span class="lightbox__sr">Close</span></button>
      </div>
    </div>
    <div class="lightbox__stage" data-lenis-prevent>
      <img class="lightbox__img" alt="" decoding="async" draggable="false">
    </div>
    <p class="lightbox__hint">Click the image to zoom. Drag or scroll to look around.</p>`
  document.body.append(dialog)

  const stage = dialog.querySelector('.lightbox__stage')
  const img = dialog.querySelector('.lightbox__img')
  const caption = dialog.querySelector('.lightbox__caption')
  const count = dialog.querySelector('.lightbox__count')
  const zoomBtn = dialog.querySelector('[data-act="zoom"]')
  const single = triggers.length < 2
  for (const b of dialog.querySelectorAll('[data-act="prev"], [data-act="next"]')) b.hidden = single

  let index = 0
  let item = null
  let zoomed = false
  let opener = null

  const read = (el) => ({
    src: el.dataset.zoom,
    w: Number(el.dataset.zoomW) || 1600,
    h: Number(el.dataset.zoomH) || 1000,
    kind: el.dataset.zoomKind || 'image',
    caption: el.dataset.zoomCaption || '',
  })

  /** Fitted scale: reading width for long pages, contain for the rest. */
  const baseScale = () => {
    const aw = Math.max(stage.clientWidth - PAD * 2, 100)
    const ah = Math.max(stage.clientHeight - PAD * 2, 100)
    if (item.kind === 'page') return Math.min(aw, READING_WIDTH) / item.w
    return Math.min(aw / item.w, ah / item.h, 1)
  }
  /** Zoomed scale: at least double, and close to the file's own pixels. */
  const zoomScale = () => {
    const b = baseScale()
    return Math.max(b * 2, Math.min(1, b * 3))
  }

  /** Resize the image, keeping the point at (px, py) in the stage still. */
  const layout = (px, py) => {
    const before = img.getBoundingClientRect()
    const s = zoomed ? zoomScale() : baseScale()
    const fx = before.width ? (px - before.left) / before.width : 0.5
    const fy = before.height ? (py - before.top) / before.height : 0
    img.style.width = `${Math.round(item.w * s)}px`
    img.style.height = `${Math.round(item.h * s)}px`
    dialog.dataset.zoomed = String(zoomed)
    zoomBtn.innerHTML = `${icon(zoomed ? 'zoomOut' : 'zoomIn')}<span class="lightbox__sr">${zoomed ? 'Zoom out' : 'Zoom in'}</span>`
    if (px == null) return
    const after = img.getBoundingClientRect()
    stage.scrollLeft += after.left + fx * after.width - px
    stage.scrollTop += after.top + fy * after.height - py
    // An unzoomed page opens at its top, not wherever the zoom left it.
    if (!zoomed && item.kind !== 'page') stage.scrollTo(0, 0)
  }

  const show = (i) => {
    index = (i + triggers.length) % triggers.length
    item = read(triggers[index])
    zoomed = false
    caption.textContent = item.caption
    count.textContent = single ? '' : `${index + 1} of ${triggers.length}`
    img.alt = item.caption
    dialog.dataset.loading = 'true'
    img.onload = () => { dialog.dataset.loading = 'false' }
    img.src = item.src
    if (img.complete) dialog.dataset.loading = 'false'
    layout()
    stage.scrollTo(0, 0)
    // Warm the neighbours so stepping through feels instant.
    for (const n of [index + 1, index - 1]) {
      const t = triggers[(n + triggers.length) % triggers.length]
      if (t) new Image().src = t.dataset.zoom
    }
  }

  const open = (i, from) => {
    opener = from
    document.documentElement.dataset.lightbox = 'open'
    stopScroll()
    dialog.showModal()
    show(i)
    dialog.querySelector('[data-act="close"]').focus({ preventScroll: true })
  }
  const close = () => { if (dialog.open) dialog.close() }
  dialog.addEventListener('close', () => {
    delete document.documentElement.dataset.lightbox
    startScroll()
    img.removeAttribute('src')
    opener?.focus({ preventScroll: true })
  })

  const toggleZoom = (px, py) => {
    zoomed = !zoomed
    const box = stage.getBoundingClientRect()
    layout(px ?? box.left + box.width / 2, py ?? box.top + box.height / 2)
  }

  triggers.forEach((t, i) => t.addEventListener('click', () => open(i, t)))

  dialog.addEventListener('click', (e) => {
    const act = e.target.closest('[data-act]')?.dataset.act
    if (act === 'close') close()
    else if (act === 'prev') show(index - 1)
    else if (act === 'next') show(index + 1)
    else if (act === 'zoom') toggleZoom()
  })

  // Drag to pan with a mouse; a click without movement zooms instead.
  let drag = null
  stage.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    drag = { x: e.clientX, y: e.clientY, left: stage.scrollLeft, top: stage.scrollTop, moved: false }
  })
  window.addEventListener('pointermove', (e) => {
    if (!drag) return
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y
    if (!drag.moved && Math.hypot(dx, dy) < 5) return
    drag.moved = true
    dialog.dataset.dragging = 'true'
    stage.scrollLeft = drag.left - dx
    stage.scrollTop = drag.top - dy
  })
  window.addEventListener('pointerup', () => {
    if (drag) setTimeout(() => { drag = null; delete dialog.dataset.dragging })
  })
  stage.addEventListener('click', (e) => {
    if (drag?.moved) return
    if (e.target === img) toggleZoom(e.clientX, e.clientY)
    else if (e.target === stage) close() // the empty space round the image
  })

  dialog.addEventListener('keydown', (e) => {
    if (e.target.closest('button') && (e.key === 'Enter' || e.key === ' ')) return
    if (e.key === 'ArrowRight' && !single) { e.preventDefault(); show(index + 1) }
    else if (e.key === 'ArrowLeft' && !single) { e.preventDefault(); show(index - 1) }
    else if ((e.key === '+' || e.key === '=') && !zoomed) { e.preventDefault(); toggleZoom() }
    else if ((e.key === '-' || e.key === '0') && zoomed) { e.preventDefault(); toggleZoom() }
  })

  let resizeTimer
  window.addEventListener('resize', () => {
    if (!dialog.open) return
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => layout(), 120)
  })

  if (prefersReducedMotion()) dialog.dataset.still = 'true'
}
