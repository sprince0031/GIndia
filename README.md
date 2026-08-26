# 🏛️ GIndia — Geographical Indications of India
### *An Interactive 3D Spatial Art & Heritage Exhibition*

[![Deploy to GitHub Pages](https://github.com/ParetoSoftware/GIndia/actions/workflows/deploy.yml/badge.svg)](https://github.com/ParetoSoftware/GIndia/actions/workflows/deploy.yml)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r160-black?logo=threedotjs)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**GIndia** is an interactive, serverless 3D web experience designed as a centerpiece art-and-education exhibit celebrating India's rich tapestry of Geographical Indication (GI) products—spanning traditional craftsmanship, agricultural produce, handloom textiles, and culinary heritage across all 36 States and Union Territories.

Hosted on **GitHub Pages**, GIndia is zero-maintenance, client-side only, and built for both large-screen gallery exhibition kiosks and responsive mobile devices.

---

## ✨ Key Features

- **🗺️ 3D Vector Extruded Map of India:**
  - Procedurally converted and extruded from high-precision vector contours (`in.svg`) into Three.js 3D stoneware meshes with PCF contact drop-shadows and museum ambient lighting.
- **🎨 Persian Cerulean Azure Interactivity:**
  - States illuminate in aesthetic **Cerulean Azure (`#0284C7`)** on hover and selection, with smooth elevation transitions and persistent category shading.
- **💫 Dynamic 3D-to-2D Spatial Tracer Rays:**
  - Real-time animated SVG bezier rays connect the 3D centroid of any selected state directly to floating curatorial info cards.
- **🎙️ Autonomous Kiosk Tour & Local Audio Narration:**
  - Automated 36-state national exhibition tour with camera lerp transitions, dwell pacing, caption bars, and natural speech storytelling powered by the Web Speech API (auto-muted on start with single-tap toggle).
- **🎨 Modular Layered Visual Asset Pipeline:**
  - Two-tier decoupled visual presentation: Layer 1 category background plates (`/backgrounds/*.svg`) seamlessly layered beneath Layer 2 standalone transparent product hero artworks.
- **🔍 Quick Search & National Statistics Dashboard:**
  - Instant searchable catalog (`Ctrl+K`) and interactive leaderboard modal detailing state rankings, regional distributions, and registration milestones.
- **📱 Responsive Mobile Modal Dialog with Backdrop Blur:**
  - Viewports `< 768px` render focused centered modals with backdrop blur and explicit dismissal controls (prominent close button, backdrop tap-to-dismiss, and bottom return action).
- **⚡ Hardware-Accelerated 2D SVG Fallback Engine:**
  - Automated WebGL context probing with graceful fallback to a high-performance 2D SVG map engine supporting mouse wheel zoom, pan dragging, and pinch-to-zoom touch gestures.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Bundler & Build** | [Vite 5.4](https://vitejs.dev/) + TypeScript 5.5 | Ultra-fast development, HMR, and optimized static chunk generation |
| **3D Graphics** | [Three.js r160](https://threejs.org/) + `SVGLoader` | Vector extrusion, 3D camera choreography, lighting, and raycasting |
| **Motion & Easing** | [GSAP 3.12](https://greensock.com/gsap/) | Fluid camera tweens, bezier tracer calculations, and card transitions |
| **Styling & Theme** | [Tailwind CSS 3.4](https://tailwindcss.com/) + Glassmorphism | Gallery aesthetic, typography, and responsive layouts |
| **Audio Engine** | Web Speech API (`SpeechSynthesis`) | Zero-bandwidth local offline speech narration |
| **Data Engine** | Local Typed JSON (`data/gi_database.json`) | 50 curated GI products with verified registration numbers and narratives |
| **CI/CD & Hosting** | GitHub Actions + GitHub Pages | Automated test, build, and static deployment pipeline |

---

## 📦 Project Structure

```
GIndia/
├── .github/workflows/
│   └── deploy.yml              # Automated GitHub Pages CI/CD workflow
├── data/
│   └── gi_database.json        # Structured GI metadata across 36 States/UTs
├── public/
│   └── assets/
│       ├── in.svg              # Clean vector base map of India
│       └── gi-images/          # Modular product SVGs (transparent objects)
│           └── backgrounds/    # Category background plates (Handicraft, Food, etc.)
├── src/
│   ├── components/
│   │   ├── info-card.ts        # Layered curatorial card & mobile modal dialog
│   │   ├── modals.ts           # Search dialog (Ctrl+K) & stats modal
│   │   └── tracer-layer.ts     # Dynamic 3D-to-2D bezier ray renderer
│   ├── core/
│   │   ├── audio-narrator.ts   # Web Speech narration engine (auto-muted default)
│   │   ├── camera-controller.ts# Constrained exhibition camera & auto-framing
│   │   ├── category-filter.ts  # Multi-mesh state highlighting & filter manager
│   │   ├── interaction-manager.ts # Raycasting, hover elevation & Cerulean lighting
│   │   ├── scene-manager.ts    # Three.js scene, renderer, and lights
│   │   ├── svg-map-engine.ts   # 2D vector fallback engine with pan & zoom
│   │   └── tour-manager.ts     # Automated exhibition tour choreographer
│   ├── types/
│   │   └── gi-data.ts          # TypeScript interfaces & database models
│   ├── utils/
│   │   ├── asset-loader.ts     # Modular image layer resolution & preloading
│   │   ├── database.ts         # Fast indexed querying & fuzzy search
│   │   └── svg-parser.ts       # 3D extrusion path parser for in.svg
│   ├── main.ts                 # Main exhibition application orchestrator
│   └── style.css               # Design tokens, typography & glassmorphism
├── index.html                  # Exhibition viewport DOM layout
├── package.json                # Project dependencies and npm scripts
├── tailwind.config.js          # GIndia color palette & typography tokens
└── vite.config.ts              # Base path resolution & Rollup manual chunks
```

---

## 🚀 Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or 20 LTS recommended)
- `npm` (version 9 or higher)

### Setup & Execution
```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/GIndia.git
cd GIndia

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** (or **http://localhost:5173**) in your browser.

### Production Build & Preview
```bash
# Build optimized static bundle for deployment
npm run build

# Preview the production build locally
npm run preview
```

---

## 🌐 Deploying to GitHub Pages

1. Push your repository to GitHub under the repository name **`GIndia`**.
2. Navigate to **Settings $\rightarrow$ Pages** in your GitHub repository.
3. Under **Build and deployment $\rightarrow$ Source**, select **GitHub Actions**.
4. Pushing to the `main` branch will automatically trigger `.github/workflows/deploy.yml`, publishing the live exhibit to:
   ```
   https://<your-username>.github.io/GIndia/
   ```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + K` / `Cmd + K` | Open Quick Search Dialog |
| `Space` | Pause / Resume Exhibition Auto-Tour |
| `Escape` | Close active card, modal, or category menu |
| `Double Click / Tap` | Focus camera on targeted state / UT |

---

## 📜 License
This project is open-source and released under the [MIT License](LICENSE).
Metadata and Geographical Indication records sourced from the **Geographical Indications Registry of India (Intellectual Property India)**.
