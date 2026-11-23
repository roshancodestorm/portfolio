import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Runs the GitHub Netlify Functions locally during `npm run dev` / `preview`
 * so the live GitHub Activity section works without a Netlify tunnel.
 * Production still uses the real functions via the redirects in netlify.toml.
 */
function githubFunctionsDev() {
  const routes = new Map([
    ['/api/github-rest', () => import('./netlify/functions/github-rest.js')],
    ['/api/github-graphql', () => import('./netlify/functions/github-graphql.js')],
  ])

  const middleware = async (req, res, next) => {
    const pathname = new URL(req.url || '/', 'http://localhost').pathname
    const load = routes.get(pathname)
    if (!load) return next()

    try {
      const mod = await load()
      const result = await mod.handler({
        httpMethod: req.method || 'GET',
        headers: req.headers,
        body: '',
      })
      res.statusCode = result.statusCode || 200
      for (const [key, value] of Object.entries(result.headers || {})) {
        res.setHeader(key, value)
      }
      res.end(result.body || '')
    } catch {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify({ error: 'LOCAL_FUNCTION_FAILED' }))
    }
  }

  return {
    name: 'github-functions-dev',
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), githubFunctionsDev()],
})
