import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173", // URL por defecto de Vite
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      // implementar event listeners de Node.js aquí
    },
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});

