import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { PROJECTS } from './content/projects.mjs'

/**
 * Cloudflare Pages serves /bmoni from bmoni.html, so internal links are clean.
 * Without this the dev server would 404 on exactly the URLs production serves,
 * and every local click would have to use a different href than the real site.
 */
function cleanUrls() {
  const slugs = new Set(PROJECTS.map((p) => p.slug))
  const rewrite = (req, _res, next) => {
    const [path, query] = req.url.split('?')
    const slug = path.replace(/^\/+|\/+$/g, '')
    if (slugs.has(slug)) req.url = `/${slug}.html${query ? `?${query}` : ''}`
    next()
  }
  return {
    name: 'clean-urls',
    // Block bodies on purpose: `middlewares.use()` returns the connect app,
    // which is itself a function — an arrow returning it would look to Vite
    // like a post-hook and get invoked with no arguments.
    configureServer(server) { server.middlewares.use(rewrite) },
    configurePreviewServer(server) { server.middlewares.use(rewrite) },
  }
}

export default defineConfig({
  appType: 'mpa',
  plugins: [cleanUrls()],
  server: { host: true, port: 5174, strictPort: false },
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    rollupOptions: {
      // One entry per generated case study, straight from the content file.
      input: Object.fromEntries([
        ['home', resolve(process.cwd(), 'index.html')],
        ...PROJECTS.map((p) => [p.slug, resolve(process.cwd(), `${p.slug}.html`)]),
      ]),
    },
  },
})
