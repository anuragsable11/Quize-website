import fs from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), apiFunctions()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        // Framework and UI libraries change rarely, so ship them as separately cached files
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|react-router|scheduler|cookie|set-cookie-parser)[\\/]/, priority: 20 },
            { name: 'ui', test: /node_modules[\\/](radix-ui|@radix-ui|@floating-ui|sonner|lucide-react|cn|next-themes|aria-hidden|react-remove-scroll[^\\/]*|use-callback-ref|use-sidecar|get-nonce|detect-node-es|tslib)[\\/]/, priority: 10 },
          ],
        },
      },
    },
  },
})

// On Vercel, api/<name>.ts is deployed as a serverless function at /api/<name>. This runs the same
// files in the dev server, so the AI features work with `npm run dev` too.
function apiFunctions(): Plugin {
  return {
    name: 'api-functions',
    apply: 'serve',
    configResolved(config) {
      // Server-only secrets from .env. The browser only ever sees VITE_* variables, so these stay private.
      // Vite restarts in the same process when .env changes, so forget the old values first; the set
      // lives on globalThis because this file is re-run on restart. Variables set in the shell win.
      const global = globalThis as { apiEnvKeys?: Set<string> }
      const fromFile = (global.apiEnvKeys ??= new Set())
      for (const key of fromFile) delete process.env[key]
      fromFile.clear()

      const env = loadEnv(config.mode, config.envDir, '')
      for (const key of ['HF_TOKEN', 'HF_MODEL']) {
        if (env[key] && !process.env[key]) {
          process.env[key] = env[key]
          fromFile.add(key)
        }
      }
    },
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        const name = req.url?.split('?')[0].replace(/^\//, '') ?? ''
        if (!/^[a-z][a-z-]*$/.test(name) || !fs.existsSync(path.join(server.config.root, 'api', `${name}.ts`))) return next()

        try {
          const handler = (await server.ssrLoadModule(`/api/${name}.ts`))[req.method ?? 'GET']
          if (typeof handler !== 'function') {
            res.statusCode = 405
            return res.end()
          }

          const headers = new Headers()
          for (const [key, value] of Object.entries(req.headers)) {
            if (typeof value === 'string') headers.set(key, value)
          }
          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk)
          const body = chunks.length ? Buffer.concat(chunks).toString() : undefined

          const response: Response = await handler(new Request(`http://localhost${req.originalUrl}`, { method: req.method, headers, body }))
          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(await response.text())
        } catch (err) {
          next(err)
        }
      })
    },
  }
}
