/**
 * Contact dialog — opened by anything with [data-contact-open].
 *
 * Submits to Formspree when VITE_FORM_ENDPOINT is set, and falls back to the
 * visitor's mail client when it is not — so the form works either way.
 *
 * Handles the states a real submission has: in flight (control disabled so a
 * double click cannot send twice), rate limited, rejected with field errors,
 * and unreachable. Any other backend that accepts a JSON POST and answers with
 * a 2xx works unchanged.
 */
import { gsap } from 'gsap'
import { prefersReducedMotion, qs, qsa } from './utils.js'
import { stopScroll, startScroll } from './scroll.js'
import { drawFrame } from './frame.js'

/**
 * Formspree form endpoint, e.g. 'https://formspree.io/f/xldbqvzk'.
 *
 * Set VITE_FORM_ENDPOINT in .env (see .env.example) or paste the URL into the
 * fallback below — either works. While it is empty the form still functions,
 * falling back to the visitor's mail client.
 *
 * The form id is not a secret: it ships in the client bundle either way.
 */
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || ''
const MAIL_TO = 'me@sammyfash.com'

/**
 * Pull a human message out of an error response without betting on a schema.
 * Formspree does not publish the raw contract, and a third-party shape can
 * change under you — so try the plausible shapes and fall through to null.
 */
async function readError(response) {
  try {
    const body = await response.json()
    if (Array.isArray(body?.errors) && body.errors.length) {
      return body.errors.map((e) => e?.message).filter(Boolean).join(' ') || null
    }
    return body?.error || body?.message || null
  } catch {
    return null   // not JSON, or an empty body
  }
}

export function initContact() {
  const dialog = qs('.contact')
  if (!dialog) return

  const panel = qs('.contact__panel', dialog)
  const scrim = qs('.contact__scrim', dialog)
  const form = qs('form', dialog)
  const status = qs('.contact__status', dialog)
  const submit = qs('button[type="submit"]', form)
  const submitLabel = qs('.pill__label', submit)
  // Read the resting label rather than repeating it, so changing the button's
  // wording in the markup cannot leave the form restoring the old one.
  const submitIdle = submitLabel.textContent
  const fields = qsa('.contact__field', form)

  let open = false
  let sending = false
  let frameDrawn = false
  let lastFocused = null

  const setOpen = (next) => {
    if (next === open) return
    open = next
    dialog.dataset.open = String(open)
    dialog.setAttribute('aria-hidden', String(!open))
    document.body.dataset.contactOpen = String(open)

    if (open) {
      lastFocused = document.activeElement
      stopScroll()
    } else {
      startScroll()
    }

    if (prefersReducedMotion()) {
      gsap.set([scrim, panel], { opacity: open ? 1 : 0 })
      gsap.set(qsa('.frame__edge, .frame i', panel), { scaleX: 1, scaleY: 1, opacity: 1 })
    } else if (open) {
      gsap.timeline()
        .set([scrim, panel], { opacity: 0 })
        .to(scrim, { opacity: 1, duration: 0.35, ease: 'power2.out' })
        .fromTo(panel,
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, '-=0.2')
    } else {
      gsap.to([panel, scrim], { opacity: 0, duration: 0.28, ease: 'power2.in' })
    }

    if (open) {
      // The hairline box is collapsed by CSS until something draws it; do that
      // on first open rather than at load, so it animates when the panel lands.
      if (!frameDrawn && !prefersReducedMotion()) {
        frameDrawn = true
        drawFrame(qs('.frame', panel), { delay: 0.25 })
      }
      // Let the panel land before pulling focus, so the reveal is not jarring.
      setTimeout(() => qs('input, textarea', form)?.focus({ preventScroll: true }), 120)
    } else {
      lastFocused?.focus?.({ preventScroll: true })
    }
  }

  for (const trigger of qsa('[data-contact-open]')) {
    trigger.addEventListener('click', (event) => {
      event.preventDefault()
      setOpen(true)
    })
  }

  qs('.contact__close', dialog)?.addEventListener('click', () => setOpen(false))
  scrim?.addEventListener('click', () => setOpen(false))

  document.addEventListener('keydown', (event) => {
    if (!open) return
    if (event.key === 'Escape') { setOpen(false); return }
    if (event.key !== 'Tab') return

    const focusables = qsa('a[href], button:not([disabled]), input, textarea', dialog)
      .filter((el) => el.offsetParent !== null)
    if (!focusables.length) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
  })

  // --- validation ----------------------------------------------------------
  const validate = (field) => {
    const input = qs('input, textarea', field)
    const error = qs('.contact__error', field)
    const value = input.value.trim()

    let message = ''
    if (!value) message = `${field.dataset.label} is required.`
    else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      message = 'That email does not look right.'
    }

    field.dataset.invalid = String(Boolean(message))
    error.textContent = message
    input.setAttribute('aria-invalid', String(Boolean(message)))
    return !message
  }

  for (const field of fields) {
    const input = qs('input, textarea', field)
    // Only nag after the first failed submit, then correct live.
    input.addEventListener('blur', () => { if (field.dataset.touched) validate(field) })
    input.addEventListener('input', () => { if (field.dataset.invalid === 'true') validate(field) })
  }

  // --- submit ---------------------------------------------------------------
  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    for (const field of fields) field.dataset.touched = 'true'
    const ok = fields.map(validate).every(Boolean)
    if (!ok) {
      status.dataset.state = 'error'
      status.textContent = 'Check the highlighted fields.'
      qs('[data-invalid="true"] input, [data-invalid="true"] textarea', form)?.focus()
      return
    }

    const data = Object.fromEntries(new FormData(form).entries())
    status.dataset.state = ''
    status.textContent = ''

    if (!ENDPOINT) {
      // No backend wired up yet — hand it to the visitor's mail client.
      const body = `${data.message}\n\n— ${data.name}\n${data.email}`
      window.location.href =
        `mailto:${MAIL_TO}?subject=${encodeURIComponent(`New enquiry from ${data.name}`)}` +
        `&body=${encodeURIComponent(body)}`
      dialog.dataset.sent = 'true'
      return
    }

    // Formspree's own guidance: disable the control until the response lands,
    // or a double click sends twice. `pointer-events: none` alone would not
    // stop a second Enter press.
    if (sending) return
    sending = true
    form.dataset.sending = 'true'
    submit.disabled = true
    submitLabel.textContent = 'Sending…'

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, _subject: `New enquiry from ${data.name}` }),
      })

      if (response.ok) {
        dialog.dataset.sent = 'true'
        form.reset()
        for (const field of fields) delete field.dataset.touched
        return
      }

      status.dataset.state = 'error'
      status.textContent = response.status === 429
        ? 'That is a lot of messages at once. Wait a minute and try again.'
        : (await readError(response)) || `Could not send (${response.status}). Email ${MAIL_TO} instead.`
    } catch (error) {
      // Network-level failure: offline, DNS, CORS, blocked by an extension.
      console.error('[sammyfash] contact form', error)
      status.dataset.state = 'error'
      status.textContent = `Could not reach the server. Email ${MAIL_TO} instead.`
    } finally {
      sending = false
      form.dataset.sending = 'false'
      submit.disabled = false
      submitLabel.textContent = submitIdle
    }
  })

  return { close: () => setOpen(false) }
}
