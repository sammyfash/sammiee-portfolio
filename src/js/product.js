/**
 * Product case study: the shared case-page motion, plus the Design /
 * Development switch and a little depth on the staged devices.
 *
 * The switch is a real ARIA tablist (arrow keys, Home/End, roving tabindex).
 * The chosen half is mirrored into ?view= so a link can open the page on the
 * half that matches the role it was sent for.
 */
import '../styles/main.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { boot, guard } from './boot.js'
import { initCase } from './case.js'
import { initFooter } from './footer.js'
import { prefersReducedMotion, qs, qsa } from './utils.js'
import { getLenis } from './scroll.js'
import { initLightbox } from './lightbox.js'

gsap.registerPlugin(ScrollTrigger)

const VIEWS = ['design', 'development']
const root = document.documentElement

/**
 * The Development half darkens the page while it is on screen. A scene, not a
 * theme: it is never stored, and it lifts at the outcome block so the footer
 * returns to the visitor's own theme.
 */
let sceneTrigger = null
let animTimer = null
function setScene(dark) {
  if ((root.dataset.scene === 'dark') === dark) return
  if (!prefersReducedMotion()) {
    root.dataset.sceneAnim = ''
    clearTimeout(animTimer)
    animTimer = setTimeout(() => delete root.dataset.sceneAnim, 700)
  }
  if (dark) root.dataset.scene = 'dark'
  else delete root.dataset.scene
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.content = dark || root.dataset.theme === 'dark' ? '#000000' : '#f3f2ee'
}
function watchScene(view) {
  sceneTrigger?.kill()
  sceneTrigger = null
  if (view !== 'development') { setScene(false); return }
  const panel = qs('#development')
  if (!panel) return
  sceneTrigger = ScrollTrigger.create({
    trigger: panel,
    start: 'top bottom',
    end: 'bottom 55%',
    onToggle: (self) => setScene(self.isActive),
  })
  setScene(sceneTrigger.isActive)
}

function initSwitch() {
  const page = qs('.pcase')
  const bar = qs('[data-product-switch]')
  if (!page || !bar) return

  const tabs = qsa('[role="tab"]', bar)
  const panels = qsa('[data-panel]', page)

  const show = (view, { focus = false, scroll = false, push = false } = {}) => {
    if (!VIEWS.includes(view)) view = 'design'
    page.dataset.view = view
    for (const t of tabs) {
      const on = t.dataset.view === view
      t.setAttribute('aria-selected', String(on))
      t.tabIndex = on ? 0 : -1
      if (on && focus) t.focus()
    }
    for (const p of panels) p.hidden = p.dataset.panel !== view

    const url = new URL(location.href)
    url.searchParams.set('view', view)
    history[push ? 'pushState' : 'replaceState'](null, '', url)

    // Panels that were display:none have never been measured.
    const panel = panels.find((p) => !p.hidden)
    gsap.set(qsa('[data-reveal]', panel), { visibility: 'visible' })
    ScrollTrigger.refresh()
    watchScene(view)

    if (scroll && panel) {
      // Measure the panel, not the switch: the switch is sticky, so its own
      // position is wherever it happens to be pinned. Reading the rect forces
      // layout, so the panel that was just shown is measurable now.
      const top = Math.max(0, panel.getBoundingClientRect().top + scrollY - 110)
      if (scrollY > top) {
        // Lenis owns the scroll position: it has to learn the new page height
        // first, then make the jump itself, or it pulls the page back.
        const lenis = getLenis()
        if (lenis) {
          lenis.resize()
          lenis.scrollTo(top, { immediate: true, force: true })
        } else {
          window.scrollTo(0, top)
        }
        ScrollTrigger.update()
      }
    }
    if (!prefersReducedMotion() && panel) {
      gsap.fromTo(panel, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', clearProps: 'all' })
    }
  }

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => show(t.dataset.view, { scroll: true, push: true }))
    t.addEventListener('keydown', (e) => {
      const n = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key]
      if (n === undefined) return
      e.preventDefault()
      show(tabs[(n + tabs.length) % tabs.length].dataset.view, { focus: true, push: true })
    })
  })
  addEventListener('popstate', () => show(new URL(location.href).searchParams.get('view')))
  show(new URL(location.href).searchParams.get('view'))
}

/** Devices drift at different rates as the scene scrolls past. */
function initDepth() {
  if (prefersReducedMotion()) return
  for (const group of qsa('[data-parallax-group]')) {
    for (const el of qsa('[data-depth]', group)) {
      const depth = Number(el.dataset.depth) || 0
      gsap.fromTo(el, { yPercent: depth * 100 }, {
        yPercent: -depth * 100,
        ease: 'none',
        scrollTrigger: { trigger: group, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      })
    }
  }
}

function initSteps() {
  const page = qs('.pcase')
  if (!page || prefersReducedMotion()) return
  for (const media of qsa('.pstep__media, .pstep__phones, .pspec__swatches, .psplit, .pquality', page)) {
    gsap.from(media, {
      y: 40, opacity: 0, duration: 1.1, ease: 'expo.out',
      scrollTrigger: { trigger: media, start: 'top 88%' },
    })
  }
}

/**
 * Brings the long design half to life, subtly: card grids rise in one after
 * another, each card's icon gives one small nudge as it lands, the impact
 * numbers count up from zero and the size bar fills to its value. All of it
 * runs once. With reduced motion none of it runs and the final values are
 * already in the markup.
 */
const GRIDS = '.glance, .impact, .pcards, .personas, .principles, .bento, .phones, .ptime'
const ICONS = '.pcard__icon, .persona__icon, .impact__icon, .glance__label .icon, .chip .icon'

function nudge(icons, delay = 0) {
  gsap.fromTo(icons, { rotate: 0 }, {
    keyframes: { rotate: [0, -14, 10, -5, 0] },
    duration: 0.7, ease: 'power1.inOut', stagger: 0.08, delay,
    transformOrigin: '50% 60%',
  })
}

function countUp(el) {
  const node = [...el.childNodes].find((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim())
  if (!node) return
  const final = node.textContent
  const match = final.match(/[\d,.]+/)
  if (!match) return
  const target = Number(match[0].replace(/,/g, ''))
  const [before, after] = [final.slice(0, match.index), final.slice(match.index + match[0].length)]
  const grouped = match[0].includes(',')
  // Hold the final width so the unit beside the number doesn't slide.
  const holder = document.createElement('span')
  holder.className = 'impact__num'
  holder.textContent = final
  node.replaceWith(holder)
  holder.style.minWidth = `${holder.getBoundingClientRect().width}px`
  // Screen readers get the final figure, never a number mid-count.
  holder.setAttribute('aria-hidden', 'true')
  const spoken = document.createElement('span')
  spoken.className = 'visually-hidden'
  spoken.textContent = final
  holder.after(spoken)
  const state = { n: 0 }
  const render = () => {
    const n = Math.round(state.n)
    holder.textContent = `${before}${grouped ? n.toLocaleString('en-GB') : n}${after}`
  }
  render()
  return gsap.to(state, { n: target, duration: 1.6, ease: 'power3.out', onUpdate: render, paused: true })
}

function initLife() {
  const page = qs('.pcase')
  if (!page || prefersReducedMotion()) return

  for (const grid of qsa(GRIDS, page)) {
    const items = [...grid.children]
    if (!items.length) continue
    const icons = qsa(ICONS, grid)
    gsap.from(items, {
      y: 28, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08,
      clearProps: 'transform,opacity',
      scrollTrigger: { trigger: grid, start: 'top 88%' },
      onStart: () => { if (icons.length) nudge(icons, 0.35) },
    })
  }

  for (const head of qsa('.psec__head', page)) {
    gsap.from(head.children, {
      y: 18, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.06,
      clearProps: 'transform,opacity',
      scrollTrigger: { trigger: head, start: 'top 90%' },
    })
  }

  const impact = qs('.impact', page)
  if (impact) {
    const counters = qsa('.impact__value', impact).map(countUp).filter(Boolean)
    const bars = qsa('.impact__bar i', impact)
    gsap.set(bars, { scaleX: 0, transformOrigin: '0 50%' })
    ScrollTrigger.create({
      trigger: impact, start: 'top 85%', once: true,
      onEnter: () => {
        counters.forEach((t, i) => t.delay(0.15 + i * 0.1).play())
        gsap.to(bars, { scaleX: 1, duration: 1.6, ease: 'power3.out', delay: 0.3 })
      },
    })
  }

  // A second, smaller nudge whenever a card is pointed at.
  for (const card of qsa('.pcard, .persona, .impact__item', page)) {
    const icon = qs('.pcard__icon, .persona__icon, .impact__icon', card)
    if (icon) card.addEventListener('pointerenter', () => nudge(icon))
  }
}

boot({
  beforePreloader: () => { initFooter(); guard('product switch', initSwitch); guard('lightbox', initLightbox) },
  afterPreloader: () => { initCase(); guard('depth', initDepth); guard('steps', initSteps); guard('life', initLife) },
})
