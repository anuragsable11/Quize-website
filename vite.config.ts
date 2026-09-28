import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
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
