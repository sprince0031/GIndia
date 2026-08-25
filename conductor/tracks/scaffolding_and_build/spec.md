# Track Specification: Project Scaffolding & Build Pipeline (`scaffolding_and_build`)

## 1. Overview
Establish the core client-side project architecture, build toolchain, asset directory structure, and TypeScript environment for the **GIndia** 3D interactive web application.

## 2. Requirements & Objectives
- **Build Toolchain:** Configure Vite with TypeScript support, enabling fast HMR and optimized static production builds configured with relative paths (`base: './'`) for seamless GitHub Pages deployment.
- **Dependencies:** Install and configure `three`, `@types/three`, `gsap`, and necessary utility packages.
- **Directory Layout:**
  ```text
  ├── public/
  │   └── assets/
  │       ├── in.svg
  │       └── gi-images/
  ├── src/
  │   ├── core/
  │   │   ├── scene-manager.ts
  │   │   └── camera-controller.ts
  │   ├── components/
  │   │   ├── info-card.ts
  │   │   ├── tool-dock.ts
  │   │   ├── fallback-map.ts
  │   │   └── stats-modal.ts
  │   ├── types/
  │   │   └── gi-data.ts
  │   ├── utils/
  │   │   ├── svg-parser.ts
  │   │   └── speech-narrator.ts
  │   ├── style.css
  │   └── main.ts
  ├── data/
  │   └── gi_database.json
  ├── index.html
  ├── package.json
  ├── tsconfig.json
  └── vite.config.ts
  ```
- **HTML & Typography:** Base `index.html` configured with Google Fonts (*Playfair Display* and *Plus Jakarta Sans*), viewport meta tags, canvas container, and frosted UI overlay root nodes.
- **CSS Design System:** CSS custom properties for the exhibition palette (`#F9F6F0` alabaster canvas, `#D9531E` terracotta highlight, charcoal typography, glassmorphism filters).

## 3. Acceptance Criteria
1. `npm run dev` starts the Vite development server with zero TypeScript or bundling errors.
2. `npm run build` generates a clean, self-contained `dist/` directory ready for GitHub Pages hosting.
3. Assets (`in.svg` and sample placeholder data) are accessible via the public asset pipeline.
4. CSS styling accurately reflects the museum exhibition palette and typography guidelines.
