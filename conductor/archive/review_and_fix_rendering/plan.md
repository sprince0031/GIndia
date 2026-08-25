# Implementation Plan: Fix Layout Styling, Tailwind Pipeline, and 3D Canvas Rendering (`review_and_fix_rendering`)

## Phase 1: Tailwind CSS & PostCSS Build Toolchain
- [x] Task 1.1: Install `tailwindcss`, `postcss`, and `autoprefixer` as development dependencies.
- [x] Task 1.2: Create `tailwind.config.js` configured with GIndia design tokens (canvas, terracotta, stoneware, ink, font families, glassmorphism).
- [x] Task 1.3: Create `postcss.config.js` and ensure all utility classes in `src/style.css` and `index.html` compile natively.

## Phase 2: Viewport Architecture & Base URL Asset Resolution
- [x] Task 2.1: Add explicit fallback geometry rules in `src/style.css` for `#app`, `#canvas-container`, `#tracer-svg-layer`, and SVG icon constraints.
- [x] Task 2.2: Update `src/utils/svg-parser.ts`, `src/utils/asset-loader.ts`, and `src/main.ts` to resolve assets using `import.meta.env.BASE_URL`.

## Phase 3: Camera Auto-Framing & Lighting Tuning
- [x] Task 3.1: Implement responsive camera distance auto-framing in `src/core/camera-controller.ts` based on viewport aspect ratio.
- [x] Task 3.2: Fine-tune directional light intensity, PCF shadow bias, and ground shadow alignment.

## Phase 4: Search & Statistics Modals Integration
- [x] Task 4.1: Implement `src/components/modals.ts` managing Search Dialog (`Ctrl+K`) and Exhibition Statistics Leaderboard.
- [x] Task 4.2: Wire modal triggers and navigation in `src/main.ts`.

## Phase 5: Build & Preview Verification
- [x] Task 5.1: Execute `npm run build` and verify static compilation.