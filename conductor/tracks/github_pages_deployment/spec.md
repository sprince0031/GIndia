# Track Specification: GitHub Pages CI/CD & Production Deployment (`github_pages_deployment`)

## 1. Overview & Objectives
Configure production static build optimization, automated GitHub Actions CI/CD workflow, and exhibition documentation to enable zero-maintenance, serverless hosting on GitHub Pages at `/GIndia/`.

---

## 2. Functional Requirements

### 2.1 Vite Configuration & Base Path Resolution
- **Base URL Configuration:** Configure `base: process.env.BASE_URL || '/GIndia/'` in `vite.config.ts`.
- **Static Asset Handling:** Verify all SVG maps, product illustrations, category backgrounds, fonts, and stylesheets resolve properly under subpath `/GIndia/`.
- **Chunk Size Optimization:** Configure Rollup manual chunking for Three.js, GSAP, and application core to optimize bundle loading.

### 2.2 GitHub Actions CI/CD Workflow (`.github/workflows/deploy.yml`)
- **Triggers:** Automated trigger on `push` to `main` branch, plus manual `workflow_dispatch`.
- **Build Matrix:** Node.js 20 LTS environment.
- **Pipeline Steps:**
  1. Checkout repository (`actions/checkout@v4`).
  2. Setup Node.js (`actions/setup-node@v4`) with npm dependency cache.
  3. Install dependencies (`npm ci`).
  4. Typecheck & Build (`npm run build`).
  5. Setup Pages (`actions/configure-pages@v5`).
  6. Upload build artifact (`actions/upload-pages-artifact@v3` from `dist/`).
  7. Deploy to GitHub Pages (`actions/deploy-pages@v4`).
- **Permissions:** Configure `pages: write`, `id-token: write`, and `contents: read`.

### 2.3 Comprehensive Exhibition Documentation (`README.md`)
- **Exhibition Overview & Visual Design Philosophy:** Gallery-grade spatial visualization of Geographical Indications of India.
- **Key Features Showcase:** 3D Extruded Three.js map, Cerulean Azure accents, interactive 2D vector fallback, local audio narration, category filters, and responsive mobile modal dialogs.
- **Data & Asset Architecture:** 50 featured GI products across 36 States/UTs, modular SVG artwork layers.
- **Local Development & Build Instructions:** `npm install`, `npm run dev`, `npm run build`, `npm run preview`.
- **Deployment & Hosting Guide:** GitHub Pages setup and live URL link.

---

## 3. Acceptance Criteria
1. `vite.config.ts` builds cleanly for `/GIndia/` without broken asset paths.
2. `.github/workflows/deploy.yml` is syntactically valid and ready for automatic GitHub Pages deployment.
3. `README.md` provides rich, comprehensive exhibition documentation.
4. `npm run build` runs with zero errors and generates a fully self-contained `dist/` directory.
