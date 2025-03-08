import { defineConfig } from "cypress";


export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    defaultCommandTimeout: 10000, // Tiempo de espera predeterminado para la mayoría de comandos
    pageLoadTimeout: 30000,      // Tiempo de espera para cargar la página
    requestTimeout: 15000,       // Tiempo de espera para peticiones XHR/AJAX
    responseTimeout: 30000,      // Tiempo de espera para respuestas
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

