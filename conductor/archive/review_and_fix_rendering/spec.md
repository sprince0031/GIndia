# Track Specification: Fix Layout Styling, Tailwind Pipeline, and 3D Canvas Rendering (`review_and_fix_rendering`)

## 1. Overview
Resolve the layout collapse and visual rendering issues observed during local preview. Configure Tailwind CSS and PostCSS into the Vite build toolchain, establish robust fullscreen positioning for the WebGL canvas and UI layers, update asset URLs to use Vite's base path resolution, implement responsive 3D camera auto-framing, and wire up the Search and Statistics modals.

## 2. Functional Requirements

### 2.1 Tailwind CSS & PostCSS Pipeline Integration
- Install `tailwindcss`, `postcss`, and `autoprefixer` as development dependencies.
- Create `tailwind.config.js` with full GIndia exhibition design tokens:
  - Canvas colors: `#F9F6F0`, `#F3EFE6`
  - Stoneware colors: `#E5DFC5`, `#D8CFB0`
  - Terracotta colors: `#D9531E`, `#B83E10`
  - Accent colors: Indigo `#2B4C7E`, Saffron `#E08D3C`, Gold `#C5A059`, Ink `#1A202C`
  - Font families: `font-serif` (Playfair Display / Cormorant Garamond), `font-sans` (Plus Jakarta Sans)
- Create `postcss.config.js` to process `@tailwind base; @tailwind components; @tailwind utilities;` in `src/style.css`.
- Ensure explicit fallback dimensions (`100vw`, `100vh`, `position: fixed`, `overflow: hidden`) on `#app` and `#canvas-container` so the Three.js canvas always fills the entire viewport.

### 2.2 Asset Path & Base URL Normalization
- Update `SvgMapParser.loadAndParse()` and `AssetLoader` to resolve assets using `import.meta.env.BASE_URL`, guaranteeing `assets/in.svg` and `assets/gi-images/` load cleanly in `npm run dev`, `npm run preview`, and GitHub Pages subpaths.

### 2.3 Responsive Camera Auto-Framing & Lighting Polishing
- Implement camera distance auto-calculation based on container width/height ratio so the 3D extruded map of India is centered and framed nicely (~75–80% viewport coverage) on initial load and resize.
- Fine-tune shadow camera parameters and directional lighting for crisp beveled relief shadows without artifacts.

### 2.4 Search & Statistics Modal Interactivity
- Implement Search Modal dialog (`Ctrl+K` or Header button) with live multi-token search filtering and click-to-navigate.
- Implement Exhibition Stats Modal showing total GI tags, category breakdowns, and top state leaderboards.

## 3. Non-Functional Requirements
- Zero unstyled layout flash on load.
- Seamless compatibility with `npm run dev`, `npm run preview`, and static production hosting.
- Clean TypeScript compilation with 0 errors.

## 4. Acceptance Criteria
1. When running `npm run dev` or `npm run preview`, the full 3D extruded map of India renders centered on the warm `#F9F6F0` gallery background.
2. The UI header, left vertical floating tool dock, category menu, and info cards are styled with proper glassmorphism, fonts, and icons.
3. Hovering over states shows terracotta highlight elevation; clicking opens the spatial info card with dynamic 3D tracer rays.
4. "Search GI Products" and "Exhibition Stats" header buttons open functional, interactive modal dialogs.
5. `npm run build` compiles with zero errors.