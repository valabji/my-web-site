import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deployed to GitHub Pages on a custom domain (valabji.com via CNAME),
// so the site is served from the root — base stays '/'.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
})
