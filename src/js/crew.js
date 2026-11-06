/**
 * The build crew (experiment).
 *
 * Below the hero, the homepage is assembled in front of the visitor by a small
 * team of coloured cursors, the way a Figma file fills up when several people
 * work in it at once. Everything starts as a wireframe: the cursor drags out a
 * rectangle on the element's own edge (rounded corners included), and only
 * then is the element filled in.
 *
 *   text    rectangle round the text, then the lines are typed in
 *   piece   rectangle on the element's border, then it fills and its label is typed
 *   image   rectangle on the card, then the picture is dragged in through the
 *           frame, clipped by it
 *   frame   the hairline box is dragged out, then drawn
 *   line    a rule is drawn from end to end
 *   group   repeated components: the first is built as a piece, then it is
 *           duplicated into each copy's place and the copies are retyped
 *           with their real words, often by other crew members at once
 *
 * The crew hides behind the visitor's own (much bigger) cursor. Members pop
 * out of it when there is something to build, and run back to hide behind it
 * when they finish. Work runs faster while the page is scrolled faster.
 *
 * Content is never at risk: anything already scrolled past is shown at once,
 * a failure reveals everything (boot.js), and reduced motion or ?crew=off
 * leaves the page to its normal reveals.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { getLenis } from './scroll.js'
import { drawFrame } from './frame.js'
import { prefersReducedMotion, clamp, qs, qsa } from './utils.js'

gsap.registerPlugin(ScrollTrigger, SplitText)

/** The site's icon hues, one per crew member. */
const COLOURS = ['#0895fa', '#22c55e', '#fb923c', '#e879f9', '#22d3ee', '#edaa0b']
/** Seconds per character while typing, at normal speed. */
const CHAR = 0.009
/** Seconds per character while retyping a duplicated label. */
const RETYPE = 0.036
/** The side each work card's picture is dragged in from, in turn: [x, y] in card widths and heights. */
const ANGLES = [[1, 1], [-1, -1], [1, 0], [-1, 1], [1, -1], [0, 1], [-1, 0], [0, -1]]

export const crewEnabled = () =>
  !prefersReducedMotion() && new URL(location.href).searchParams.get('crew') !== 'off'

/* --------------------------------------------------------------------------
   What gets built, in order
   -------------------------------------------------------------------------- */
function plan() {
  const t = (el, kind, extra = {}) => (el ? { el, kind, ...extra } : null)
  const group = (els, extra = {}) => (els.length > 1
    ? { el: els[0], kind: 'group', master: els[0], copies: els.slice(1), ...extra }
    : t(els[0], 'piece', extra))
  const tasks = []

  const about = qs('.about')
  if (about) {
    tasks.push(
      t(qs('.about__box', about), 'frame', { frame: qs('.frame', about) }),
      t(qs('.about__statement', about), 'text'),
      t(qs('.about__text', about), 'text'),
      t(qs('.about__more', about), 'piece'),
    )
  }

  const work = qs('.work')
  if (work) {
    const lenses = qsa('.work__lens', work)
    tasks.push(
      t(qs('.work__title .line__inner', work), 'text', { reveal: qs('.work__title', work) }),
      t(qs('.work__intro', work), 'text'),
      t(qs('.work__filter', work), 'shell'),
      t(lenses[0], 'piece'),
      group(lenses.slice(1)),
    )
    qsa('.work__item', work).filter((item) => !item.hidden).forEach((item, n) => tasks.push(t(item, 'image', { n })))
  }

  const hire = qs('.hire')
  if (hire) {
    tasks.push(
      t(qs('.rule', hire), 'line'),
      t(qs('.hire__title', hire), 'text'),
      t(qs('.hire__lead', hire), 'text'),
      t(qs('.hire__proof', hire), 'shell'),
      group(qsa('.hire__stat', hire), { parts: (s) => qsa('dt, dd', s) }),
      t(qs('.hire__caps', hire), 'shell'),
      group(qsa('.cap', hire), { parts: (c) => qsa('.cap__title', c), chips: (c) => qsa('.cap__list li', c) }),
      t(qs('.hire__cta', hire), 'shell'),
      t(qs('.hire__cta .pill', hire), 'piece'),
      group(qsa('.hire__cta .link-wipe', hire)),
    )
  }

  const footer = qs('.site-footer')
  if (footer) {
    tasks.push(
      t(qs('.site-footer__box', footer), 'frame', { frame: qs('.frame', footer) }),
      t(qs('.site-footer__heading', footer), 'text'),
      t(qs('.site-footer__availability', footer), 'text'),
      t(qs('.site-footer__button', footer), 'piece'),
      t(qs('.site-footer__contact', footer), 'shell'),
      t(qs('.site-footer__email', footer), 'piece'),
      group(qsa('.site-footer__social a', footer)),
      t(qs('.site-footer__fineprint', footer), 'text'),
    )
  }
  return tasks.filter(Boolean)
}

/* --------------------------------------------------------------------------
   Measuring
   -------------------------------------------------------------------------- */
const toPage = (r) => ({ x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height })
const pageRect = (el) => toPage(el.getBoundingClientRect())

/** The box the text itself occupies, not the block it sits in. */
const textRect = (el) => {
  const range = document.createRange()
  range.selectNodeContents(el)
  const r = range.getBoundingClientRect()
  return r.width ? toPage(r) : pageRect(el)
}

const radiusOf = (el) => getComputedStyle(el).borderRadius || '0px'

/** The visible text nodes of an element, in reading order. */
const textNodes = (el) => {
  const out = []
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.nodeValue.trim() && !n.parentElement.closest('svg, [aria-hidden="true"]')
      ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
  })
  while (walk.nextNode()) out.push(walk.currentNode)
  return out
}

const ink = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  const l = 0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)
  return l > 150 ? '#0b0b0b' : '#ffffff'
}

const ICONS = `
  <svg class="crew-agent__arrow" viewBox="0 0 16 18" aria-hidden="true"><path d="M1 1v14.2l3.9-3.6 2.7 5.8 2.4-1.1-2.7-5.7h5.4z"/></svg>
  <svg class="crew-agent__beam" viewBox="0 0 10 18" aria-hidden="true"><path d="M2 1.5h2.2c.5 0 .8.3.8.8v13.4c0 .5-.3.8-.8.8H2M8 1.5H5.8c-.5 0-.8.3-.8.8v13.4c0 .5.3.8.8.8H8M3.4 9h3.2"/></svg>`

/* --------------------------------------------------------------------------
   The crew
   -------------------------------------------------------------------------- */
export function initCrew() {
  const tasks = plan()
  if (!tasks.length) return

  document.documentElement.classList.add('crew-on')
  const layer = document.createElement('div')
  layer.className = 'crew'
  layer.setAttribute('aria-hidden', 'true')
  document.body.appendChild(layer)

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const pointer = { x: innerWidth / 2, y: innerHeight * 0.9, known: false }
  addEventListener('pointermove', (e) => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.known = true }, { passive: true })
  /** Where the crew hides: behind the visitor's cursor, or just below the screen on touch. */
  const home = () => (finePointer && pointer.known
    ? { x: pointer.x + scrollX, y: pointer.y + scrollY }
    : { x: scrollX + innerWidth / 2, y: scrollY + innerHeight + 30 })

  const agents = COLOURS.map((colour, i) => {
    const el = document.createElement('div')
    el.className = 'crew-agent'
    el.style.setProperty('--c', colour)
    el.innerHTML = ICONS
    layer.appendChild(el)
    return {
      el, colour, i, state: 'hidden',
      pos: { x: 0, y: 0 },
      setX: gsap.quickSetter(el, 'x', 'px'),
      setY: gsap.quickSetter(el, 'y', 'px'),
    }
  })

  /* ---- hide everything still to be built, keeping its space ------------- */
  const hide = (el) => { gsap.killTweensOf(el); gsap.set(el, { autoAlpha: 0 }) }
  for (const task of tasks) {
    if (task.kind === 'shell') { gsap.set(task.el, { visibility: 'visible' }); continue }
    if (task.kind === 'group') { for (const el of [task.master, ...task.copies]) hide(el) } else hide(task.el)
    if (task.reveal) gsap.set(task.reveal, { visibility: 'visible' })
    if (task.kind === 'line') gsap.set(task.el, { scaleX: 0, transformOrigin: 'left center', autoAlpha: 1 })
  }

  const queue = []
  let speed = 1

  /** The final state, at once: scrolled past, or the lens hid it mid-build. */
  const finish = (task) => {
    if (task.done) return
    task.done = true
    task.restore?.()
    const els = task.kind === 'group' ? [task.master, ...task.copies] : [task.el]
    for (const el of els) gsap.set(el, { autoAlpha: 1, clearProps: 'transform' })
    for (const el of task.chipsAll ?? []) gsap.set(el, { autoAlpha: 1 })
    if (task.kind === 'line') gsap.set(task.el, { scaleX: 1 })
    if (task.kind === 'frame' && task.frame) drawFrame(task.frame)?.progress(1)
    if (task.kind === 'image') {
      gsap.set(qs('picture', task.el), { x: 0, y: 0, rotation: 0 })
      gsap.set(qs('.work__meta', task.el), { autoAlpha: 1 })
    }
    if (task.reveal) task.reveal.querySelector('.line')?.classList.add('is-open')
  }

  /* ---- motion helpers: every step measures the page just before it moves */
  const live = new Set()
  /** Play a tween at the current speed and wait for it. */
  const go = (tween) => {
    tween.timeScale(speed)
    live.add(tween)
    return new Promise((resolve) => tween.eventCallback('onComplete', () => { live.delete(tween); resolve() }))
  }
  const wait = (s) => go(gsap.to({}, { duration: s }))
  const tool = (agent, name) => { agent.el.dataset.tool = name }
  const move = (agent, x, y, ease = 'power3.inOut') => go(gsap.to(agent.pos, {
    x, y, ease, duration: clamp(Math.hypot(x - agent.pos.x, y - agent.pos.y) / 1600, 0.16, 0.55),
  }))

  /** A selection box on `rect`, ready to be dragged out from its top-left corner. */
  const makeBox = (agent, rect, radius = '0px') => {
    const b = document.createElement('div')
    b.className = 'crew-box'
    b.style.setProperty('--c', agent.colour)
    b.style.setProperty('--ink', ink(agent.colour))
    b.style.borderRadius = radius
    // Small boxes (chips, buttons) skip the size label: a row of them got noisy.
    const label = rect.w >= 140 && rect.h >= 34 ? `<span class="crew-box__size">${Math.round(rect.w)} × ${Math.round(rect.h)}</span>` : ''
    b.innerHTML = `<i></i><i></i><i></i><i></i>${label}`
    gsap.set(b, { x: rect.x, y: rect.y, width: 0, height: 0 })
    layer.appendChild(b)
    return b
  }

  /** Drag out a rectangle on an element's own edge, from top-left to bottom-right. */
  const dragBox = async (agent, rect, radius, boxes) => {
    tool(agent, 'arrow')
    await move(agent, rect.x, rect.y)
    const b = makeBox(agent, rect, radius)
    boxes.push(b)
    const p = { k: 0 }
    await go(gsap.to(p, {
      k: 1, ease: 'power2.inOut', duration: clamp(Math.hypot(rect.w, rect.h) / 2300, 0.2, 0.5),
      onUpdate: () => {
        agent.pos.x = rect.x + rect.w * p.k
        agent.pos.y = rect.y + rect.h * p.k
        gsap.set(b, { width: rect.w * p.k, height: rect.h * p.k })
      },
    }))
    const size = b.querySelector('.crew-box__size')
    if (size) gsap.to(size, { opacity: 1, duration: 0.1 })
    return b
  }
  const dropBox = (b) => { followers.delete(b); gsap.to(b, { opacity: 0, duration: 0.3, onComplete: () => b.remove() }) }
  /** Keep a box on its element's edge every frame, while the element changes size. */
  const followers = new Map()
  const follow = (b, el) => followers.set(b, el)

  /**
   * Hold an element at the size it has now, so nothing around it reflows while
   * it is being built; returns the undo. Only the properties it sets are put
   * back, never GSAP's own inline styles. (On a phone, typing a paragraph and
   * retyping a copied card both changed heights, and the page jumped.)
   */
  const hold = (el, { width = false, clip = false } = {}) => {
    const r = el.getBoundingClientRect()
    const keys = ['height', 'boxSizing', ...(width ? ['width', 'whiteSpace'] : []), ...(clip ? ['overflow'] : [])]
    const before = keys.map((k) => el.style[k])
    el.style.boxSizing = 'border-box'
    el.style.height = `${r.height}px`
    if (width) { el.style.width = `${r.width}px`; el.style.whiteSpace = 'nowrap' }
    if (clip) el.style.overflow = 'hidden'
    return () => keys.forEach((k, i) => { el.style[k] = before[i] })
  }
  /** A pill, chip or other piece that sits in a row: its width matters too. */
  const inRow = (el) => /inline/.test(getComputedStyle(el).display) || /flex/.test(getComputedStyle(el.parentElement).display)

  /** Type an element in, line by line, the I-beam riding the last letter. */
  const typeInto = async (agent, el) => {
    tool(agent, 'beam')
    const release = hold(el)
    const split = SplitText.create(el, { type: 'lines', linesClass: 'crew-line' })
    gsap.set(el, { autoAlpha: 1 })
    const lines = split.lines.map((line) => {
      const lr = line.getBoundingClientRect()
      const range = document.createRange()
      range.selectNodeContents(line)
      const tr = range.getBoundingClientRect()
      const left = Math.max(0, tr.left - lr.left)
      gsap.set(line, { clipPath: `inset(-25% ${lr.width - left}px -25% ${left - 1}px)` })
      return { line, lr, tr, left, full: Math.max(1, tr.width), chars: line.textContent.trim().length || 1 }
    })
    for (const l of lines) {
      const y = l.tr.top + scrollY + l.tr.height / 2
      await go(gsap.to(agent.pos, { x: l.tr.left + scrollX, y, duration: 0.06, ease: 'power2.out' }))
      const p = { c: 0 }
      await go(gsap.to(p, {
        c: l.chars, duration: l.chars * CHAR, ease: 'none',
        onUpdate: () => {
          const visible = l.left + l.full * (Math.round(p.c) / l.chars)
          gsap.set(l.line, { clipPath: `inset(-25% ${Math.max(0, l.lr.width - visible)}px -25% ${l.left - 1}px)` })
          agent.pos.x = l.lr.left + scrollX + visible
        },
      }))
    }
    split.revert()
    release()
  }

  /** Retype a duplicated label: select the copied words, then type the real ones. */
  const retype = async (agent, job) => {
    tool(agent, 'beam')
    if (job.parent) gsap.set(job.parent, { autoAlpha: 1 })
    const range = document.createRange()
    range.selectNodeContents(job.node)
    const r = range.getBoundingClientRect()
    if (r.width) {
      const pr = toPage(r)
      await move(agent, pr.x + pr.w, pr.y + pr.h / 2, 'power2.out')
      const sel = document.createElement('div')
      sel.className = 'crew-select'
      sel.style.setProperty('--c', agent.colour)
      gsap.set(sel, { x: pr.x, y: pr.y, width: pr.w, height: pr.h })
      layer.appendChild(sel)
      await wait(0.16)
      sel.remove()
    }
    job.node.nodeValue = ''
    const p = { n: 0 }
    await go(gsap.to(p, {
      n: job.final.length, duration: Math.max(0.12, job.final.length * RETYPE), ease: 'none',
      onUpdate: () => {
        job.node.nodeValue = job.final.slice(0, Math.round(p.n))
        range.selectNodeContents(job.node)
        const rr = range.getBoundingClientRect()
        if (rr.width) { agent.pos.x = rr.right + scrollX; agent.pos.y = rr.top + scrollY + rr.height / 2 }
      },
    }))
    job.node.nodeValue = job.final
  }

  /* ---- a crew member pops out of the visitor's cursor ------------------- */
  const popOut = (agent) => {
    if (agent.state === 'hidden') {
      const h = home()
      agent.pos.x = h.x; agent.pos.y = h.y
      agent.setX(h.x); agent.setY(h.y)
      gsap.fromTo(agent.el, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.22, ease: 'back.out(2.5)' })
    } else {
      gsap.to(agent.el, { opacity: 1, scale: 1, duration: 0.15 })
    }
    agent.state = 'work'
  }

  /* ---- the steps of each kind of task ------------------------------------ */
  const steps = {
    async text(agent, task, boxes) {
      await dragBox(agent, textRect(task.el), '0px', boxes)
      await typeInto(agent, task.el)
      task.reveal?.querySelector('.line')?.classList.add('is-open')
    },
    async piece(agent, task, boxes, el = task.el, chips = []) {
      await dragBox(agent, pageRect(el), radiusOf(el), boxes)
      const parts = task.parts?.(el) ?? [el]
      if (!parts.includes(el)) {
        for (const part of parts) gsap.set(part, { autoAlpha: 0 })
        for (const chip of chips) gsap.set(chip, { autoAlpha: 0 })
        gsap.set(el, { autoAlpha: 1 })
      }
      for (const part of parts) await typeInto(agent, part)
      // Chips inside the piece: each gets its own rectangle, then its label.
      for (const chip of chips) {
        await dragBox(agent, pageRect(chip), radiusOf(chip), boxes)
        await typeInto(agent, chip)
      }
    },
    async image(agent, task, boxes) {
      const card = qs('.work__card', task.el) ?? task.el
      const pic = qs('picture', card)
      const meta = qs('.work__meta', card)
      const rect = pageRect(card)
      await dragBox(agent, rect, radiusOf(card), boxes)
      // The empty frame appears. The picture waits outside it, clipped away, on
      // a different side for each card, and is dragged in through the frame.
      const [ax, ay] = ANGLES[task.n % ANGLES.length]
      const ox = ax * rect.w * 1.04, oy = ay * rect.h * 1.18
      gsap.set(pic, { x: ox, y: oy, rotation: (ax || ay) * 2.5 })
      gsap.set(meta, { autoAlpha: 0 })
      gsap.set(task.el, { autoAlpha: 1 })
      // The cursor grips the picture near the corner that leads it in.
      const gx = rect.x + rect.w * (0.5 - ax * 0.38), gy = rect.y + rect.h * (0.5 - ay * 0.34)
      await move(agent, gx + ox, gy + oy)
      // A hand-drawn path, not a slide: a curve with a wobble, a slight
      // overshoot, then it settles square in the frame.
      const bend = (ay ? ax || 0.6 : 0.6) * 0.07
      const ride = () => { agent.pos.x = gx + gsap.getProperty(pic, 'x'); agent.pos.y = gy + gsap.getProperty(pic, 'y') }
      await go(gsap.timeline({ onUpdate: ride })
        .to(pic, { x: ox * 0.45 + rect.h * bend, y: oy * 0.4 - rect.w * bend * 0.6, rotation: (ax || ay) * -1.2, duration: 0.42, ease: 'power1.inOut' })
        .to(pic, { x: -ox * 0.025, y: -oy * 0.03, rotation: 0.4, duration: 0.36, ease: 'power2.out' })
        .to(pic, { x: 0, y: 0, rotation: 0, duration: 0.22, ease: 'power2.inOut' }))
      gsap.to(meta, { autoAlpha: 1, duration: 0.25 })
    },
    async frame(agent, task, boxes) {
      await dragBox(agent, pageRect(task.el), '0px', boxes)
      gsap.set(task.el, { autoAlpha: 1 })
      await go(drawFrame(task.frame))
    },
    async line(agent, task) {
      const r = pageRect(task.el)
      await move(agent, r.x, r.y)
      await go(gsap.timeline()
        .to(agent.pos, { x: r.x + r.w, duration: 0.5, ease: 'power2.inOut' })
        .to(task.el, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, '<'))
    },
    async group(agent, task, boxes) {
      const { master, copies } = task
      await steps.piece(agent, task, boxes, master, task.chips?.(master) ?? [])
      task.chipsAll = copies.flatMap((c) => task.chips?.(c) ?? [])

      // Each copy takes the master's words while keeping its own final size:
      // the copy and every element holding text in it are held, so nothing
      // reflows (a row of pills never re-wraps, a stacked card never grows).
      // Copied words that are longer than the real ones are clipped until retyped.
      const masterNodes = textNodes(master)
      const finals = copies.map((c) => textNodes(c).map((n) => n.nodeValue))
      for (const c of copies) {
        const holders = new Set([c, ...textNodes(c).map((n) => n.parentElement)])
        c.crewUndo = [...holders].map((el) => hold(el, { width: inRow(el), clip: true }))
      }
      const release = (c) => { c.crewUndo?.forEach((undo) => undo()); c.crewUndo = null }
      task.restore = () => copies.forEach((c, ci) => {
        textNodes(c).forEach((n, k) => { if (finals[ci][k] != null) n.nodeValue = finals[ci][k] })
        release(c)
      })
      task.release = release
      const jobs = []
      copies.forEach((c, ci) => {
        textNodes(c).forEach((n, k) => {
          const m = masterNodes[k]
          n.nodeValue = m ? m.nodeValue : ''
          // A copy with more chips than the master: the extras wait to be typed.
          const parent = m ? null : n.parentElement
          if (parent) gsap.set(parent, { autoAlpha: 0 })
          jobs.push({ copy: c, node: n, final: finals[ci][k], parent })
        })
        for (const chip of task.chips?.(c) ?? []) if (!jobs.some((j) => j.parent === chip)) gsap.set(chip, { autoAlpha: 1 })
      })

      // Duplicate: each copy slides out into its own place,
      // inside its own rectangle, the crew member holding it.
      const groupBoxes = []
      tool(agent, 'arrow')
      // Each copy comes out of the one before it (Alt-drag in Figma), so it only
      // ever crosses into its own slot and never sweeps over the other copies.
      let prev = master
      for (const c of copies) {
        const from = pageRect(prev), to = pageRect(c)
        prev = c
        const b = makeBox(agent, to, radiusOf(c))
        const size = b.querySelector('.crew-box__size')
        if (size) size.style.opacity = 1
        groupBoxes.push(b)
        gsap.set(c, { autoAlpha: 1 })
        await move(agent, from.x + 14, from.y + 14)
        const s = { k: 0 }
        await go(gsap.to(s, {
          k: 1, ease: 'power2.inOut', duration: clamp(Math.hypot(from.x - to.x, from.y - to.y) / 1600, 0.22, 0.45),
          onUpdate: () => {
            const dx = (from.x - to.x) * (1 - s.k), dy = (from.y - to.y) * (1 - s.k)
            gsap.set(c, { x: dx, y: dy })
            gsap.set(b, { x: to.x + dx, y: to.y + dy, width: to.w, height: to.h })
            agent.pos.x = to.x + dx + 14; agent.pos.y = to.y + dy + 14
          },
        }))
        gsap.set(c, { clearProps: 'transform' })
        follow(b, c)
      }

      // Hand the retyping out, one copy each, so several crew members work at once.
      const byCopy = new Map()
      for (const j of jobs) {
        if (!byCopy.has(j.copy)) byCopy.set(j.copy, [])
        byCopy.get(j.copy).push(j)
      }
      let left = byCopy.size
      const done = () => {
        if (--left > 0) return
        task.done = true
        task.restore = null
        groupBoxes.forEach(dropBox)
      }
      if (!byCopy.size) { left = 1; done() }
      queue.unshift(...[...byCopy.values()].map((list) => ({ kind: 'retype', el: list[0].copy, list, group: task, onDone: done })))
    },
    async retype(agent, task) {
      for (const job of task.list) await retype(agent, job)
      // Its real words are in and fit exactly: let go of the held size.
      task.group.release(task.el)
    },
  }

  /* ---- one task, start to finish, for one crew member -------------------- */
  const run = async (agent, task) => {
    popOut(agent)
    const boxes = []
    try {
      await steps[task.kind](agent, task, boxes)
    } catch (error) {
      // A step that fails must not leave its part hidden: show it as built.
      console.error('[sammyfash] crew task failed — showing it as built', error)
      task.kind === 'retype' ? skipRetype(task) : finish(task)
    }
    if (task.kind !== 'group') task.done = true
    if (task.kind !== 'retype') task.onDone?.()
    else if (!task.skipped) task.onDone?.()
    if (task.kind !== 'image' && task.kind !== 'line' && task.kind !== 'retype') gsap.set(task.el, { clearProps: 'transform' })
    boxes.forEach(dropBox)
    agent.state = 'home'
    tool(agent, 'arrow')
    dispatch()
  }

  /** Put a retype job's copy straight to its real words. */
  const skipRetype = (task) => {
    task.skipped = true
    for (const j of task.list) { j.node.nodeValue = j.final; if (j.parent) gsap.set(j.parent, { autoAlpha: 1 }) }
    task.group.release?.(task.el)
    task.onDone?.()
  }

  /** Hand the next ready tasks to free crew members, nearest first. */
  const dispatch = () => {
    for (let k = queue.length - 1; k >= 0; k--) {
      const task = queue[k]
      // Already scrolled past it: show it, no point building out of sight.
      if (task.el.getBoundingClientRect().bottom < 0) {
        queue.splice(k, 1)
        task.kind === 'retype' ? skipRetype(task) : finish(task)
      }
    }
    while (queue.length) {
      const free = agents.filter((a) => a.state !== 'work')
      if (!free.length) return
      const task = queue.shift()
      const r = pageRect(task.el)
      const h = home()
      const at = (a) => (a.state === 'hidden' ? h : a.pos)
      free.sort((a, b) => Math.hypot(at(a).x - r.x, at(a).y - r.y) - Math.hypot(at(b).x - r.x, at(b).y - r.y))
      run(free[0], task)
    }
  }

  const enqueue = (task) => {
    if (task.done || task.queued || task.kind === 'shell') return
    task.queued = true
    queue.push(task)
    dispatch()
  }

  // A part starts once its section fills about a quarter of the screen, so the
  // build is seen from its start instead of half-done at the bottom edge.
  for (const task of tasks) task.section = task.el.closest('section, footer')
  const ready = (task) => {
    const atBottom = scrollY >= document.documentElement.scrollHeight - innerHeight - 2
    const top = task.el.getBoundingClientRect().top
    const sectionTop = task.section?.getBoundingClientRect().top ?? top
    // At the end of the page nothing can scroll any higher: anything on screen starts.
    if (atBottom) return top < innerHeight
    return top < innerHeight * 0.85 && sectionTop < innerHeight * 0.75
  }

  // A lens can hide a card before it is built and show it later: place every
  // waiting card at once when the lens changes.
  for (const b of qsa('[data-lens]')) b.addEventListener('click', () => {
    for (const task of tasks) if (task.kind === 'image' && !task.done) {
      const k = queue.indexOf(task)
      if (k >= 0) queue.splice(k, 1)
      finish(task)
    }
  })

  /* ---- every frame: speed from scroll velocity, and running home -------- */
  let sweep = 0
  gsap.ticker.add((_, dt) => {
    const v = Math.abs(getLenis()?.velocity ?? 0)
    speed += (1 + Math.min(v / 22, 2.5) - speed) * 0.15
    for (const tw of live) tw.timeScale(speed)

    // Which parts are ready to build, checked a few times a second.
    sweep += dt
    if (sweep > 120) {
      sweep = 0
      for (const task of tasks) if (!task.done && !task.queued && task.kind !== 'shell' && ready(task)) enqueue(task)
    }

    for (const [b, el] of followers) {
      const r = pageRect(el)
      gsap.set(b, { x: r.x, y: r.y, width: r.w, height: r.h })
    }

    const h = home()
    for (const a of agents) {
      if (a.state === 'home') {
        // Run back to the visitor's cursor and slip in behind it.
        a.pos.x += (h.x - a.pos.x) * 0.2
        a.pos.y += (h.y - a.pos.y) * 0.2
        if (Math.hypot(h.x - a.pos.x, h.y - a.pos.y) < 10) {
          a.state = 'hidden'
          gsap.to(a.el, { opacity: 0, scale: 0.5, duration: 0.12 })
        }
      }
      if (a.state !== 'hidden') { a.setX(a.pos.x); a.setY(a.pos.y) }
    }
  })

  ScrollTrigger.refresh()
}
