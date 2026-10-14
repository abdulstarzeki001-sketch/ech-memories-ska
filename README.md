# NAFSAM Celestial Cinema v3

Complete custom cinematic Arabic RTL website built with React 19, Vite, TypeScript, Tailwind CSS, GSAP ScrollTrigger, Motion, Three.js and React Three Fiber. Content from the original archive is preserved.

## Main routes
/index.html and /home.html: full cinematic portal. /photos.html: 143 image gallery and lightbox. /videos.html: 243 videos with posters and on-demand playback. /songs.html: 46 songs with a player. /journey.html, /writings.html and /feelings.html: textual memories. /future-lab/: independent app route. /classic/: complete legacy pages, scripts, styles and media manifest.

## Run
npm install
npm run dev:future
npm run check
npm run build

Build copies legacy pages to public/classic, bundles React into public/future-lab/assets, publishes compiled application to all 8 root HTML routes, verifies original archive integrity.

## GitHub Pages
Select Settings > Pages > Source: GitHub Actions. Branch-source publication serves TSX source and breaks this site. The provided workflow uploads only the generated public directory.

## Cloudflare Pages
Use GitHub integration: production branch main, Node 24, build command npm run build, output public. Or set GitHub secrets CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID, plus the explicit repository variable CLOUDFLARE_PAGES_PROJECT. No target project defaults, to avoid overwriting unrelated projects. Cloudflare AI endpoints additionally need an AI binding and secret NAFSAM_AI_ACCESS_KEY. AI endpoints do not function on static GitHub Pages.

## Performance and privacy
WebGL is lazy-loaded on supported desktops only. iPhone and smaller iPad viewports use a CSS scene; videos and images are lazy-loaded. Seven-item bottom navigation stays visible and RTL-friendly. The original CDN is publicly accessible; hiding links does not make the archive private. Add proper access control and private storage before hosting confidential media.
