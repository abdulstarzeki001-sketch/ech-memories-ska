# Nafsam Archive

Static HTML memory archive prepared for GitHub Pages and Cloudflare Pages.

## Cloudflare Pages

- Production branch: `main`
- Framework preset: None
- Build command: `node build-cloudflare.cjs`
- Deploy command: `npx wrangler deploy`
- Static assets directory: `public` (configured in `wrangler.jsonc`)
- Root directory: repository root

The top-level `index.html` is the entry page. Cloudflare will automatically redeploy after each push when the GitHub repository is connected.

## Deployment hygiene

Cloudflare must deploy only the generated `public/` directory. Do not use `--assets=.`; that uploads repository metadata such as `.git`.
