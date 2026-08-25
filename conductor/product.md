# Initial Concept
This project contains an attempt at creating an interactive web display of the Geographical Indicator map of India. The initial prompt can be used as a starting point for requirements analysis @[initial_prompts.md] . The state map of India is available as @[in.svg] in svg format. Please expand this project to be hosted as a github page for a github project so that it can be hosted in a serverless manner. The name of the repo should be GIndia. Also build a local database (in csv/sqlite/json whichever is easiest to implement) for all the GI products of India by region and also representative graphics and images that can be used. This purpose is for a Social Science exhibition and this will serve as a centrepiece almost like an art exhibit. Tailour the design and UX accordingly. Upgrade to three.js to use the full power of web rendering. Do not limit to the initial requirement of a single html file.

# Product Guide: GIndia (Geographical Indications of India Interactive 3D Exhibit)

## 1. Vision & Purpose
**GIndia** is an interactive, serverless 3D web experience designed as a centerpiece art-and-education exhibit for a Social Science Exhibition, as well as a permanently hosted, zero-maintenance public GitHub Pages web application. It transforms India's rich cultural heritage, traditional craftsmanship, and agricultural identity into an engaging, gallery-grade spatial visualization powered by Three.js and a comprehensive local database of Geographical Indication (GI) products.

## 2. Target Audience & Exhibition Environments
- **Exhibition Attendees & General Public:** Captivated by a tactile, fluid 3D visual centerpiece with intuitive touch/mouse controls, large-screen gallery presentation, and clear visual hierarchy.
- **Students, Educators & Researchers:** In-depth exploration of regional heritage, product origins, historical significance, GI registration details, and cross-state geographical analysis.
- **Remote / Online Web Visitors:** Fast, lightweight, fully responsive experience accessible across devices ranging from mobile screens to ultrawide kiosk displays.

## 3. Key Feature Scope

### 3.1 3D Interactive Exhibition Map
- **3D Extruded Geometry:** Procedural conversion and 3D extrusion of India's states and union territories from SVG path vectors (`in.svg`) using Three.js.
- **Floating Art-Exhibit Aesthetics:** Off-white gallery background with warm ambient/directional lighting, realistic floor drop-shadows, and floating elevation.
- **Terracotta Accent Interactivity:** Hover and selection animations elevating the targeted state with a rich terracotta highlight.
- **Dynamic 3D-to-2D Tracing Lines:** Responsive line/bezier rays drawn directly from the 3D centroid of the selected state to the corresponding floating UI product cards.
- **WebGL Fallback Mode:** Automatic graceful degradation to an interactive 2D SVG canvas for environments without WebGL hardware acceleration.

### 3.2 Autonomous Exhibition Kiosk & Local Audio Narration
- **Auto-Cycle Spotlight Mode:** Hands-free automated exhibition tour cycling through states and GI products with gentle camera pan/tilt transitions.
- **Local Speech Synthesis Narration:** Voice narration of state and GI product highlights powered by the native browser Web Speech API (zero external API calls, 100% offline-capable, zero operational cost).
- **Kiosk Controls:** Play/Pause loop toggle, adjustable cycle speed, and seamless resume on user interaction.

### 3.3 Curated GI Product Registry & Local Database
- **Local Structured Database (JSON):** Comprehensive dataset of GI-tagged products across Indian states and union territories, categorized by:
  - Handicrafts
  - Agricultural Products
  - Food Stuffs
  - Manufactured Products
  - Natural Goods
- **Rich Media & Cultural Content:** Authentic representative product imagery, cultural/historical descriptions, regional maps, registration numbers, and unique characteristics.
- **Search, Filtering & Analytics:** Real-time search by product name/region, category filter chips, and an interactive statistics modal showcasing GI distribution across India.

### 3.4 Spatial & Responsive Card Layout
- **Directional Orientation:** Spatial placement of info cards relative to state geography (e.g., Eastern states card placement to the right, Western states to the left).
- **Responsive Adaptive Display:** Multi-card spatial distribution on desktop and large screens; touch-friendly carousel with explicit close controls on mobile viewports.
- **Floating Tool Dock:** Minimalist vertical glassmorphic/frosted toolbar on the top-left containing exhibition controls (autoplay, category filter, 3D camera reset, speech narration toggle, stats dashboard).

## 4. Technical & Deployment Architecture
- **Serverless & Static Hosting:** 100% client-side architecture requiring zero backend servers, deployed directly via GitHub Pages under the `GIndia` repository.
- **Continuous Deployment:** Automated GitHub Actions workflow for linting, bundling, and deployment.
