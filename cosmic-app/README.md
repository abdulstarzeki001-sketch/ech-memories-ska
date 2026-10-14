# NAFSAM COSMIC · React Preview
A self-contained, non-destructive React + Vite + TypeScript + Tailwind CSS v4 experience under `/cosmic/`.
## Build
From repository root run `npm install`, `npm run check:types`, `npm run build`. Static output is `public/`. The React app goes to `public/cosmic/`, while seven original HTML archives remain unchanged.
## Navigation
Seven modules use hash routing (`#/home`, `#/photos`, etc.). Each module links to the original archive without copying private contents. The existing `index.html` entry experience remains the production landing page.
## Animation
GSAP + ScrollTrigger animates only visible headings and hero, Motion handles card entrances, optional React Three Fiber scene loads only for WebGL2-capable displays wider than 900px when reduced motion is off. Mobile defaults to CSS-only orbits; animations are user-toggleable.
## Security and production
Personal archives, encrypted files, media JSON, storage endpoints and access flows have not been modified. The original archive is not being re-authenticated by this preview; preserving the existing browser entry behavior does not imply server-side access control. Do not copy confidential plaintext into the repository. Keep this change on an isolated branch until CI and preview validation pass.
## Cloudflare
Workflow `.github/workflows/cosmic-preview.yml` checks type safety and the build, and conditionally deploys a branch preview using existing Cloudflare credentials and project variable. Merge only after approving the preview.
