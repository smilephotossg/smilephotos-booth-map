import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Standalone single-page app. Builds to /dist as static files that can be
// deployed to any static host (Vercel, Netlify, Cloudflare Pages) or embedded
// into the Squarespace site via an iframe / Code Block.
export default defineConfig({
  plugins: [react()],
})
