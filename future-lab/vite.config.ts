import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
export default defineConfig({
  root: fileURLToPath(new URL('./', import.meta.url)),
  base: './',
  plugins: [react()],
  build: { outDir: fileURLToPath(new URL('../public/future-lab', import.meta.url)), emptyOutDir: true, sourcemap: false, target: 'es2020' },
  server: { port: 5173, host: '0.0.0.0' }
});