# Implementation Plan: Project Scaffolding & Build Pipeline (`scaffolding_and_build`)

## Phase 1: Environment & Dependency Setup
- [x] Initialize `package.json` with scripts (`dev`, `build`, `preview`).
- [x] Install production dependencies: `three`, `gsap`.
- [x] Install dev dependencies: `typescript`, `@types/three`, `@types/gsap`, `vite`.
- [x] Create `tsconfig.json` with strict mode enabled and DOM library support.
- [x] Create `vite.config.ts` with `base: './'` for GitHub Pages serverless static hosting.

## Phase 2: Directory Structure & Asset Organization
- [x] Create `public/assets/` and copy `in.svg` into it.
- [x] Create `public/assets/gi-images/` directory for regional GI photography.
- [x] Create `src/` directory hierarchy (`src/core/`, `src/components/`, `src/types/`, `src/utils/`).

## Phase 3: Base HTML Shell & Design Tokens
- [x] Create `index.html` with exhibition header, WebGL canvas container, 2D fallback wrapper, floating tool dock, and dynamic card overlays.
- [x] Create `src/style.css` implementing CSS custom properties for warm alabaster canvas, terracotta accent, typography fonts, and glassmorphic UI cards.
- [x] Create `src/main.ts` entrypoint validating TypeScript compilation and DOM mounting.

## Phase 4: Verification & Build Check
- [x] Run `npm run build` to verify clean static asset generation into `dist/`.
- [x] Run `npm run preview` to verify zero runtime console errors.