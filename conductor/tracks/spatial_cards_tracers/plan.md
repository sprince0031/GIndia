# Implementation Plan: Spatial UI Cards & Dynamic 3D Tracers (`spatial_cards_tracers`)

## Phase 1: Spatial Info Card Component & Layout
- [x] Task 1.1: Implement `src/components/info-card.ts` creating the glassmorphic exhibition product card DOM elements (title, state name, category badge, local photography with SVG fallback, curatorial description, bullet highlights, narration trigger, and close button).
- [x] Task 1.2: Implement directional spatial placement logic (Eastern states anchored to right; Western/Northern/Southern states anchored to left) and multi-product navigation tabs.
- [x] Task 1.3: Implement mobile-responsive bottom sheet carousel mode for screens under 1024px with touch swipe gestures.

## Phase 2: Dynamic 3D-to-2D Tracer Line Renderer
- [x] Task 2.1: Implement `src/components/tracer-layer.ts` computing screen-projected coordinates from the active state's 3D centroid and drawing dynamic SVG cubic bezier curves to the card's anchor point.
- [x] Task 2.2: Add animated pulsing anchor node on the state surface and traveling dashed gradient ray styling.
- [x] Task 2.3: Register real-time recalculation callback in `SceneManager` to ensure permanent spatial anchoring during camera orbit, pan, and zoom.

## Phase 3: Category Filter Engine & 3D Map Highlighting
- [x] Task 3.1: Implement category filtering logic in `src/core/category-filter.ts` that highlights matching state meshes with terracotta elevation while dimming non-matching states.
- [x] Task 3.2: Wire category flyout buttons in the tool dock to filter both the 3D map highlights and the product registry.

## Phase 4: Integration & Build Verification
- [x] Task 4.1: Integrate `InfoCardManager`, `TracerLayer`, and `CategoryFilter` into `src/main.ts`, connecting state selection, card dismissal, and camera focus.
- [x] Task 4.2: Execute `npm run build` to confirm clean TypeScript compilation and static bundle generation into `dist/`.