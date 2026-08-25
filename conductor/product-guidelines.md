# Product Guidelines: GIndia Exhibition Design & UX System

## 1. Design Philosophy: The Floating Living Artifact
GIndia is conceived as a digital art centerpiece for social science exhibitions. The aesthetic balances timeless Indian craftsmanship—earthy clays, handloom textures, and natural pigments—with sleek modern exhibition technology. The 3D map appears as an architectural relief sculpture hovering weightlessly above a gallery canvas.

## 2. Visual Identity & Color Palette

### 2.1 Core Palette
- **Gallery Canvas (Background):** `#F9F6F0` (Warm Alabaster / Parchment) — Provides an organic, non-glare exhibition backdrop.
- **Base Geometry (Neutral Landmass):** `#EAE5DB` to `#DFD8CA` — Clean, understated stoneware stone tone.
- **Terracotta Accent (Active / Hover / Highlight):** `#D9531E` / `#C85A32` — Warm Indian terracotta clay that draws instant visual focus.
- **Secondary Heritage Accents:**
  - **Royal Indigo:** `#2B4C7E` (Used for GI Category tags and Craftsmanship indicators)
  - **Saffron Ochre:** `#E08D3C` (Used for Agriculture / Food tags)
  - **Warm Brass / Gold:** `#C5A059` (Subtle decorative accents and borders)
- **Ink & Typography:**
  - **Primary Ink:** `#1A202C` (Deep Charcoal for headings and primary copy)
  - **Secondary Ink:** `#4A5568` (Muted Slate for metadata and subtitles)
  - **Borders & Dividers:** `rgba(26, 32, 44, 0.08)` (Hairline subtle separators)

### 2.2 Material & Lighting Properties (Three.js)
- **Lighting Setup:** Soft directional warm sunlight paired with ambient sky hemisphere lighting and subtle contact shadows cast on the plane beneath the map.
- **Surface Quality:** Matte/diffuse finish on state meshes with subtle specular sheen on hover.
- **Glassmorphism / Frosted Overlays:** Semi-transparent backdrops (`rgba(249, 246, 240, 0.85)` with `backdrop-filter: blur(12px)`) for info cards and tool docks.

## 3. Typography & Curatorial Tone

### 3.1 Font Stack
- **Exhibition Titles & Regional Headers:** *Playfair Display* or *Cormorant Garamond* (Editorial Serif, conveying artisanal prestige and academic depth).
- **Body, Metadata, Badges & Numbers:** *Plus Jakarta Sans* or *Inter* (Crisp geometric sans-serif for high legibility on 4K kiosks and mobile viewports).

### 3.2 Curatorial Voice & Copywriting
- **Authoritative yet Engaging:** Descriptive summaries focus on what makes the product unique, its geographical origin, traditional artisanal process, and cultural heritage.
- **Information Density:** Cleanly segmented with badges (e.g., `GI #43`, `Handicrafts`, `Registered: 2004`) to facilitate rapid scanning.

### 3.3 Speech Narration Guidelines (Web Speech API)
- **Natural Cadence:** Moderate rate (~0.95x - 1.0x speed) with natural pauses between state names and product titles.
- **Pronunciation Safeguards:** Clean phonetic text preprocessing for Indian states and regional names.
- **Visitor Control:** Prominent toggle with visual soundwave/speaker indicator, instant mute, and replay capabilities.

## 4. Motion Choreography & Spatial Interactions

### 4.1 3D State Physics & Elevation
- **Hover / Touch Trigger:** Smooth vertical lift (Z-axis translation +4 to +8 units) accompanied by a color transition to terracotta over 280ms easing.
- **Camera Lerping:** Gentle, cinematic panning and tilting when selecting states, avoiding jarring snaps.

### 4.2 Dynamic Spatial Tracers
- **3D-to-2D Anchor Rays:** Dynamic SVG/Canvas bezier curves drawn from the projected 3D centroid of the selected state directly to the active info card.
- **Continuous Recalculation:** Tracer coordinates dynamically update on camera orbit, pan, or window resize to ensure permanent spatial anchoring.

### 4.3 Adaptive Layout & Mobile Responsiveness
- **Desktop / Kiosk Viewports (>1024px):** Spatial info card placement (Eastern states anchor to the right, Western to the left); multi-card grid when multiple GI tags belong to one state.
- **Tablet / Mobile Viewports (<1024px):** Bottom-anchored or overlay modal carousel with high-contrast dismissal ("×" close button) and swipe gesture support.
- **Touch Ergonomics:** Minimum 44x44px touch targets on all interactive elements.
