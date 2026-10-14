# NAFSAM — Cosmic Experience

This repository retains the existing seven-section Arabic memory archive and encrypted viewer. The futuristic redesign is **additive**, implemented in two independent layers:

1. \`cosmic-system.css\` / \`cosmic-system.js\`: shared progressive enhancement to existing entry + seven HTML pages. Native navigation and original content are preserved.
2. \`future-lab/\`: an independent React + TypeScript + Vite + Tailwind + GSAP ScrollTrigger + Motion + React Three Fiber interactive prototype built to \`public/future-lab/\`.

## Local development

\`\`\`bash
npm install
npm run dev:future
npm run check
npm run build
\`\`\`

Visit the Vite development URL for the prototype, or open \`/future-lab/\` after publishing \`public\`.

## Cloudflare Pages

- Production branch: \`main\`
- Build command: \`npm run build\`
- Output directory: \`public\`
- Node.js: 22 or newer
- GitHub Actions validates pull requests but **only deploys on main** (or manual dispatch).
- Required GitHub secrets for Actions deployment: \`CLOUDFLARE_API_TOKEN\`, \`CLOUDFLARE_ACCOUNT_ID\`.
- \`vars.CLOUDFLARE_PAGES_PROJECT\` should be set to the actual Pages project name (default remains the existing \`ech-nafasm-ska\`).

## Preservation, performance, security

Original media metadata, page content, routes, encrypted JSON data, and protected archive viewer are left unchanged.
The new prototype is an interface/navigation showcase; its "assistant" is **local route search, not a cloud AI service**.
The site preserves the original visitor-name form, which **is not real authentication**. Never treat client-side name input or encrypted files shipped to public storage as server-side access control.
On small screens, reduced-motion settings, data-saving networks, and devices without WebGL, the hero falls back to a CSS illustration.
Do not deploy the repository root as assets: only deploy the generated \`public/\` directory.