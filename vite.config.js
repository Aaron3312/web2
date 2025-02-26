import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Asegúrate de que la base URL coincida exactamente con tu repositorio
  base: '/web2/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
})