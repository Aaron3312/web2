import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

// Get the repository name (assuming GitHub Pages will be at /<repo-name>/)
// If deploying to a custom domain, you can remove this
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || ''

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.NODE_ENV === 'production' ? `/${repoName}/` : '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
})