# NAFSAM — Cosmic Experience

This repository retains the existing seven-section Arabic memory archive and encrypted viewer. The futuristic redesign is **additive**, implemented in two independent layers:

1. `cosmic-system.css` / `cosmic-system.js`: shared progressive enhancement to existing entry + seven HTML pages. Native navigation and original content are preserved.
2. `future-lab/`: an independent React + TypeScript + Vite + Tailwind + GSAP ScrollTrigger + Motion + React Three Fiber interactive prototype built to `public/future-lab/`.

## Local development

```bash
npm install
npm run dev:future
npm run check
npm run build
```

Visit the Vite development URL for the prototype, or open `/future-lab/` after publishing `public`.

## GitHub Pages

The GitHub Pages workflow now runs `npm run check` and `npm run build`, then uploads the generated `public/` directory only. The main archive and `/future-lab/` React bundle are published together at the repository Pages URL. GitHub Pages is a static host: the AI Studio Cloudflare API functions will not work there without configuring a separate compatible backend.

## Cloudflare Pages

- Production branch: `main`
- Build command: `npm run build`
- Output directory: `public`
- Node.js: 22 or newer
- GitHub Actions validates pull requests but **only deploys on main** (or manual dispatch).
- Required GitHub secrets for Actions deployment: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
- **Required:** set `vars.CLOUDFLARE_PAGES_PROJECT` explicitly to the correct Cloudflare Pages project. There is no default: this prevents accidental overwrites of a different project.

## Preservation, performance, security

Original media metadata, page content, routes, encrypted JSON data, and protected archive viewer are left unchanged.
The new prototype is an interface/navigation showcase; its "assistant" is **local route search, not a cloud AI service**.
The site preserves the original visitor-name form, which **is not real authentication**. Never treat client-side name input or encrypted files shipped to public storage as server-side access control.
On small screens, reduced-motion settings, data-saving networks, and devices without WebGL, the hero falls back to a CSS illustration.
Do not deploy the repository root as assets: only deploy the generated `public/` directory.

## AI Studio — two features

- Assistant: upload your own TXT/MD/JSON or paste notes; relevant snippets (max 5) are sent to Workers AI only after clicking Ask. No automatic extraction from encrypted or private archive.
- Classification: one pasted text and up to 6 image files per request batch. Images are resized client-side; AI produces label, tags, description and an explicitly visible date only.
- Endpoints: `functions/api/ai/assistant.js` and `functions/api/ai/classify.js`, using Cloudflare Pages Functions and Workers AI.
- **Required:** configure Workers AI binding called `AI` and secret `NAFSAM_AI_ACCESS_KEY` (24+ random characters) on **both** Preview and Production Pages environments, and redeploy. No AI works if these are absent.
- The owner types the access key in the AI Studio; it is held in React memory only, not saved to localStorage. Secure the site with Cloudflare Access before using confidential archives in production. No server-side uploads or indexing of the archive have been implemented.
- For `@cf/meta/llama-3.2-11b-vision-instruct`, you must accept the model license before image classification is enabled.
- AI calls may incur Cloudflare fees; provide a proper rate limiter and per-user auth before offering the endpoint publicly.
