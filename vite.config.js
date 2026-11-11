import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// Sitio multipágina: una entrada HTML por página del diseño.
// base './' -> rutas relativas, así funciona igual en la raíz o bajo /raiz-tostadores/ (GitHub Pages).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    cssMinify: false, // el CSS se publica tal como está en el diseño
    assetsInlineLimit: 0, // imágenes y SVG como archivos, no incrustados
    rollupOptions: {
      output: { manualChunks: (id) => (id.includes('node_modules') ? 'react' : undefined) },
      input: {
        home: resolve(__dirname, 'index.html'),
        tienda: resolve(__dirname, 'tienda/index.html'),
        ficha: resolve(__dirname, 'ficha/index.html'),
        suscripcion: resolve(__dirname, 'suscripcion/index.html'),
        cuenta: resolve(__dirname, 'cuenta/index.html')
      }
    }
  }
});
