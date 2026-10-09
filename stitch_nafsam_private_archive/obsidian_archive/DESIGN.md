---
name: Obsidian Archive
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#bbc9cf'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#859399'
  outline-variant: '#3c494e'
  surface-tint: '#47d6ff'
  primary: '#a5e7ff'
  on-primary: '#003543'
  primary-container: '#00d2ff'
  on-primary-container: '#00566a'
  inverse-primary: '#00677f'
  secondary: '#e9c349'
  on-secondary: '#3c2f00'
  secondary-container: '#af8d11'
  on-secondary-container: '#342800'
  tertiary: '#dfdcdb'
  on-tertiary: '#313030'
  tertiary-container: '#c3c0c0'
  on-tertiary-container: '#4f4e4e'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#b6ebff'
  primary-fixed-dim: '#47d6ff'
  on-primary-fixed: '#001f28'
  on-primary-fixed-variant: '#004e60'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
  mono-ui:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style
The design system is centered on the concept of "Digital Immortality"—a cinematic, luxury private memory archive that feels like a futuristic vault. It targets high-net-worth individuals and archivists who value legacy, privacy, and aesthetic prestige. 

The visual direction is **Futuristic Glassmorphism**. The UI should feel like a high-end holographic interface suspended in a deep, infinite void. It utilizes heavy background blurs, multi-layered transparency, and subtle organic movement (aurora-like gradients) to create a sense of depth and "living" memory. The emotional response is one of reverence, calm, and technological sophistication.

## Colors
This design system utilizes a "Deep Obsidian" foundation to maximize the contrast of glass effects and luminous accents.

- **Primary (Ethereal Blue):** Used for active states, data visualization, and "scanning" animations. It represents the "pulse" of the digital archive.
- **Secondary (Prestige Gold):** Reserved for heritage content, milestone markers, and premium features. Use sparingly to maintain its impact.
- **Surface Strategy:** Instead of solid backgrounds, use semi-transparent layers. The background should feature a permanent, slow-moving radial gradient (Aurora) of `#003344` at 10% opacity moving behind the content.
- **Text:** Headers are pure `#FFFFFF` for maximum legibility against dark backgrounds. Body text uses a muted `#A0A0A0` (Silver) to reduce eye strain in immersive viewing sessions.

## Typography
The typography contrasts the classical elegance of **Playfair Display** (for storytelling and editorial headings) with the hyper-modern, technical precision of **Geist** (for UI and navigation).

- **Headings:** Use serif fonts for all content-related titles (e.g., "The Summer of '94").
- **UI & Metadata:** Use sans-serif (Geist) for all functional labels, timestamps, and buttons.
- **Bilingual Support:** Geist provides excellent legibility for LTR (English/Turkish), while the Serif headings should pair with high-contrast Naskh-style fonts for RTL (Arabic/Persian) to maintain the "prestige" feel.
- **Technical Detail:** Small UI labels should use increased letter spacing to mimic the look of premium instrumentation.

## Layout & Spacing
The layout follows a **Fluid Floating Grid** philosophy. Content is not strictly boxed but "drifts" within a generous 12-column system.

- **Vertical Timelines:** A central or offset vertical axis acts as the primary navigation anchor for memory archives. 
- **Floating Dock:** The primary navigation resides in a floating bottom-centered glass container, detached from the screen edges.
- **Margins:** Use wide "breathable" margins (`64px+` on desktop) to evoke a gallery or museum feel. 
- **Adaptation:** On mobile, the 12-column grid collapses to 4. All glass surfaces expand to the edges to maximize screen real estate, while maintaining a `20px` safe area margin.

## Elevation & Depth
Depth is created through **Optics**, not shadows. 
- **Layer 1 (Deepest):** Obsidian `#050505` with a subtle film grain texture (2% opacity) and aurora blurs.
- **Layer 2 (Content Containers):** Semi-transparent white (`3%`) with a `20px` to `40px` backdrop-filter blur. 
- **Layer 3 (Interactive/Hover):** Increase transparency to `8%` and add a `1px` inner glow/border using the Primary Blue or Gold.
- **Scanlines:** A very faint horizontal pattern (1px line every 4px) should be applied to the top-most interactive layer to give a "holographic" readout feel.

## Shapes
The shape language is "Geometric Softness." 
- Use **0.5rem (8px)** as the base radius for most cards and containers.
- Larger sections and hero containers should use **1rem (16px)** to feel more approachable.
- Buttons and interactive "chips" use a **pill-shape** to stand out as touch-ready elements against the more structured grid containers.
- **Borders:** All borders must be thin (1px) and use a linear gradient from `rgba(255,255,255,0.2)` to `transparent` to simulate light hitting the edge of a glass pane.

## Components
- **Buttons:** Primary buttons are pill-shaped with a glass-blur background and a glowing `1px` primary-colored border. Text is always uppercase `mono-ui`.
- **Memory Cards:** High-contrast images with a subtle "vignette" overlay. Metadata (date/location) appears in the `label-caps` style on hover.
- **Floating Dock:** A bottom-aligned navigation bar with a high `backdrop-filter: blur(30px)`. Icons should be thin-stroke (1.5pt) linear icons.
- **Input Fields:** Minimalist under-lines rather than boxes. On focus, the line glows with a Primary Blue gradient that expands from the center.
- **Vertical Timeline:** A thin `1px` dashed line with "node" points that glow when scrolled into view.
- **Grain & Texture:** Apply a global CSS `mix-blend-mode` noise overlay to all glass surfaces to prevent digital color banding and add tactile "film" quality.