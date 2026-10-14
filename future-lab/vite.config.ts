import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
export default defineConfig({
  root: path.resolve(process.cwd(), 'future-lab'),
  base: './',
  plugins: [react()],
  build: { outDir: path.resolve(process.cwd(), 'public/future-lab'), emptyOutDir: true, sourcemap: false, target: 'es2020' },
  server: { port: 5173, host: '0.0.0.0' }
});