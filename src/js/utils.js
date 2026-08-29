/** Shared helpers: reduced-motion detection and the text splitter. */

const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

export const prefersReducedMotion = () => reduceQuery.matches

export const onReducedMotionChange = (fn) => reduceQuery.addEventListener('change', fn)

export const lerp = (a, b, t) => a + (b - a) * t

export const clamp = (n, min, max) => Math.min(Math.max(n, min), max)

/**
 * Nothing on this site may stay invisible because an animation did not run.
 * Anything that hides content behind JS calls this when it gives up.
 */
export function revealAll() {
  for (const el of document.querySelectorAll('[data-reveal]')) el.style.visibility = 'visible'
  for (const el of document.querySelectorAll('.line')) el.classList.add('is-open')
  for (const el of document.querySelectorAll('.grid-lines span, .rule')) el.style.transform = 'none'
  document.querySelector('.preloader')?.remove()
}

/**
 * The `.line` mask is only needed while text slides up into place. Once it has
 * landed, release it — otherwise a tight line-height clips descenders forever.
 * Pass the result straight to a tween's `onComplete`.
 */
export function openLines(elements) {
  return () => {
    for (const el of elements) el.closest?.('.line')?.classList.add('is-open')
  }
}

export const qs  = (sel, root = document) => root.querySelector(sel)
export const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel))

/**
 * Wrap every word of `el` in <span class="word">. Idempotent: the original
 * text is stashed so the element can be re-split after a resize.
 */
export function splitWords(el) {
  const source = el.dataset.splitSource ?? (el.dataset.splitSource = el.textContent)
  const words = source.trim().split(/\s+/)
  el.innerHTML = words.map((w) => `<span class="word">${escapeHtml(w)}</span>`).join(' ')
  return Array.from(el.querySelectorAll('.word'))
}

/**
 * Split into words, measure where the browser actually broke the lines, then
 * regroup each visual line inside an overflow-hidden mask so it can slide up.
 * Returns the inner (moving) elements.
 */
export function splitLines(el) {
  const words = splitWords(el)
  if (!words.length) return []

  // Group by the line box the browser actually put each word on. The tolerance
  // absorbs the sub-pixel jitter you get when a fallback glyph sneaks into a line.
  const tolerance = parseFloat(getComputedStyle(el).fontSize) * 0.4
  const rows = []
  for (const word of words) {
    const top = word.offsetTop
    const row = rows[rows.length - 1]
    if (row && Math.abs(top - row.top) < tolerance) row.words.push(word.textContent)
    else rows.push({ top, words: [word.textContent] })
  }

  el.innerHTML = rows
    .map(({ words: line }) => `<span class="line"><span class="line__inner">${
      line.map((w) => `<span class="word">${escapeHtml(w)}</span>`).join(' ')
    }</span></span>`)
    .join('')

  return Array.from(el.querySelectorAll('.line__inner'))
}

/** Wrap every character in <span class="char">, keeping words unbreakable. */
export function splitChars(el) {
  const source = el.dataset.splitSource ?? (el.dataset.splitSource = el.textContent)
  el.innerHTML = source
    .trim()
    .split(/(\s+)/)
    .map((chunk) => {
      if (/^\s+$/.test(chunk)) return ' '
      const chars = Array.from(chunk)
        .map((c) => `<span class="char">${escapeHtml(c)}</span>`)
        .join('')
      return `<span class="word">${chars}</span>`
    })
    .join('')
  return Array.from(el.querySelectorAll('.char'))
}

/**
 * Line splitting depends on the final font metrics and the final box width, so
 * every caller has to (a) wait for webfonts, (b) refuse to measure a box that
 * has not been laid out yet, and (c) redo the work when the width changes.
 * This wraps all three: `apply` receives the fresh `.line__inner` elements.
 */
export function watchLines(el, apply) {
  let last = -1

  const run = () => {
    const width = el.getBoundingClientRect().width
    // A zero-width box has not been laid out — the ResizeObserver will call back.
    if (width < 1) return
    if (Math.abs(width - last) < 1) return
    last = width
    apply(splitLines(el))
  }

  const ro = new ResizeObserver(run)
  ro.observe(el)

  if (document.fonts?.status === 'loaded') run()
  else document.fonts?.ready.then(run) ?? run()

  return () => ro.disconnect()
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ))
}
