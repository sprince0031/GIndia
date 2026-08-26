# Implementation Plan: WebGL Fallback & Cross-Device Mobile/Tablet UX (`webgl_fallback_ux`)

## Phase 1: Interactive 2D SVG Map Engine & Pan/Zoom Controller
- [x] Task 1.1: Implement `src/core/svg-map-engine.ts` managing 2D SVG map rendering, viewBox transformations, drag panning, mouse wheel zoom, and pinch-to-zoom touch gestures.
- [x] Task 1.2: Implement 2D state hover elevation, terracotta `#D9531E` highlight shaders, single-state selection exclusivity, and centroid calculation.
- [x] Task 1.3: Integrate 2D category filter synchronization and dynamic 2D SVG tracer bezier rays.

## Phase 2: Responsive Mobile Info Card Modal & Dismissal Controls
- [x] Task 2.1: Update `src/components/info-card.ts` and `src/style.css` to render a centered modal with backdrop blur on viewports `< 768px`.
- [x] Task 2.2: Add prominent 44x44px header close button, backdrop tap-to-dismiss listener, and bottom "Close" button.
- [x] Task 2.3: Ensure smooth GSAP entrance/exit modal transitions and mobile touch scroll within card content.

## Phase 3: Tour & Ambient Banner Integration
- [x] Task 3.1: Wire `TourManager` step changes and camera viewBox panning to `SvgMapEngine` in 2D fallback mode.
- [x] Task 3.2: Implement ambient 2D Mode notification banner with dismiss control.

## Phase 4: Build Verification & Mobile Testing
- [x] Task 4.1: Execute `npm run build` to verify clean TypeScript compilation and bundle creation in `dist/`.
