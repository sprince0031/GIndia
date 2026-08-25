# Technology Stack: GIndia

## 1. Core Toolchain & Build System
- **Bundler & Dev Server:** [Vite](https://vitejs.dev/) (Fast HMR, optimized production static bundle generation)
- **Language:** TypeScript / Modern ECMAScript (ES2022+) for type safety, modular design, and robust data schema modeling
- **CSS Architecture:** Modular CSS / Tailwind CSS for minimalist glassmorphic styling, responsive layouts, and typography

## 2. 3D Graphics & Rendering Engine
- **Primary 3D Engine:** [Three.js](https://threejs.org/) (r160+)
  - `SVGLoader`: Converts SVG vector paths (`in.svg`) into extruded 3D state mesh geometries (`ExtrudeGeometry`)
  - `OrbitControls` / Custom Camera Controller: Constrained museum viewing angles, smooth zoom and rotation
  - `Raycaster`: Precise 3D hit testing for state hover, click, and centroid calculation
  - Custom Materials & Shaders: Soft diffuse terracotta highlights, stoneware base materials, and contact shadow plane
- **Animation Engine:** [GSAP](https://greensock.com/gsap/) (GreenSock) for cinematic camera tweens, mesh elevation, and dynamic bezier tracer rendering
- **2D WebGL Fallback:** Graceful fallback using responsive 2D SVG canvas interactivity for legacy environments lacking WebGL hardware acceleration

## 3. Data Architecture & Media Pipeline
- **Database Engine:** Structured local JSON database (`data/gi_database.json`)
  - Schema-validated records with ID, name, state/UT, category (Handicraft, Agriculture, Food, etc.), registration year, detailed cultural narrative, and local image paths
- **Asset Pipeline:**
  - Optimized local WebP / SVG media assets stored in `public/assets/gi-images/` for zero-latency, 100% offline-ready exhibition reliability
  - State boundaries loaded directly from `public/assets/in.svg`

## 4. Audio & Browser APIs
- **Voice Narration:** Native Web Speech API (`window.speechSynthesis`)
  - Zero external cloud/API dependencies, zero latency, offline capable, and zero operating cost
  - Configured with custom rate, pitch, and voice fallback logic for Indian English accents

## 5. Deployment & CI/CD
- **Hosting Target:** GitHub Pages (`GIndia` repository)
- **Serverless Architecture:** 100% static client-side bundle
- **CI/CD Workflow:** GitHub Actions workflow (`.github/workflows/deploy.yml`) to automatically test, build, and deploy the Vite static bundle to the `gh-pages` branch
