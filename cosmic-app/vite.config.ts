import {defineConfig} from 'vite';
import tailwindcss from '@tailwindcss/vite';
import {fileURLToPath} from 'node:url';
export default defineConfig({
  root:fileURLToPath(new URL('.',import.meta.url)),
  base:'./',
  plugins:[tailwindcss()],
  build:{outDir:fileURLToPath(new URL('../public/cosmic/',import.meta.url)),emptyOutDir:true,assetsDir:'assets',target:'es2022',cssCodeSplit:true,rollupOptions:{output:{manualChunks(id){if(id.includes('node_modules/three/')||id.includes('node_modules/@react-three/'))return 'scene3d';}}}},
});
