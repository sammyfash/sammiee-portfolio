/*
 * Runs synchronously in <head>, before any CSS paints, so the right theme is on
 * <html> from the first frame. Kept outside the module bundle on purpose: a
 * module script is deferred, which is exactly the flash this prevents. The CSP
 * forbids inline scripts, hence a file rather than a snippet.
 *
 * Order of authority: a choice the visitor made with the switch, then their
 * operating system's preference, then light.
 */
(function () {
  var t = null
  try { t = localStorage.getItem('theme') } catch (e) { /* storage blocked */ }
  if (t !== 'light' && t !== 'dark') {
    t = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  document.documentElement.dataset.theme = t
})()
