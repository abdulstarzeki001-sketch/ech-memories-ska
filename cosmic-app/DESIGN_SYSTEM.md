# NAFSAM Cosmic V2 — Design and component specification

## Direction
Cosmic luxury meets a minimal AI command interface. Keep authentic memory media in the existing archival routes, separated from the new presentation layer.

### Colors
- Deep void: `#040711`, second surface: `#111e3b`.
- Premium text: `#eff4ff`, supporting copy `#99a7bf`.
- Main cyan: `#87e7ff`; muted gold `#d9bd86`.
- Hairline borders: `rgba(172,196,242,.12)`.
- Semantic planets: violet `#bbafff`, cyan `#83e7fb`, rose `#f4acc5`, gold `#eed09b`.

### Layout
- 320px: two-column compact portal grid, fixed 7-slot navigation, 44px targets, lite CSS sphere.
- 390px: comfortable card gutters and responsive hero.
- 768px: two-column cards and touch-first orbital graphic.
- 1024px: three-column cards, split hero, optional WebGL2.
- 1440px: 1290px content width, generous whitespace, balanced reading order.

### Components
- `CosmicBackdrop` — blurred nebula / star field CSS.
- `TopBar` — brand, language and motion settings.
- `Hero` — editorial masthead + celestial nucleus.
- `OrbitalScene` — lazy-loaded optional React Three Fiber; no WebGL on reduced-motion or sub-900px.
- `ModuleCard` — accessible actionable portal with distinct semantic icon and accent.
- `DetailPage` — full module landing page linking to the original archive.
- `NavDock` — 7 equal navigation slots on all device sizes.
- `SearchModal` and `SettingsModal` — keyboard accessible controls.
- Legacy site remains in place, with shared non-invasive theme and nav CSS/JS.

### Motion and performance
- GSAP/ScrollTrigger: hero staggering and one-time section heading reveals.
- Motion: viewport-triggered cards and route transitions.
- WebGL only when viewport >=900px + WebGL2 available + reduced motion disabled.
- DPR capped at 1.35; star count 360; no compressed shaders/textures downloaded.
- Reduced motion disables non-essential transitions; settings include motion toggle.
- All interactive elements keyboard-focusable and nav screen-reader labeled.
- Browser smoke tests: RTL, 7 links, 320/390/768/1440px, no horizontal scroll, route navigation, search, language and reduced-motion compatibility.

### Production constraints
- Do not overwrite `index.html` gateway or media assets.
- Do not place private plaintext in the public app bundle.
- Do not merge before Cloudflare branch preview and CI review.
