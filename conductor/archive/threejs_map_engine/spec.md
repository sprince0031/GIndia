# Track Specification: Three.js 3D Interactive Map Engine (`threejs_map_engine`)

## 1. Overview
Build the foundational Three.js 3D WebGL rendering engine that transforms 2D vector boundaries (`in.svg`) into an interactive, extruded 3D architectural relief sculpture of India. The engine features warm gallery studio lighting, stoneware-to-terracotta material transitions, kinetic Z-axis state elevation physics, responsive raycasting hit-detection, and a constrained exhibition camera controller.

## 2. Functional Requirements

### 2.1 3D Geometry Extrusion & Scene Graph
- **SVG Vector Path Processing:** Load and parse `public/assets/in.svg` using `THREE.SVGLoader`, converting state path shapes into `THREE.ExtrudeGeometry` with beveled edges (`depth: 14`, `bevelEnabled: true`, `bevelThickness: 2`, `bevelSegments: 2`).
- **Scene Hierarchy & Coordinate Normalization:**
  - Center and scale the entire India landmass to fit the 3D viewport at the world origin `(0, 0, 0)`.
  - Group each state/UT as a distinct named mesh tagged with its exact state ID (`INWB`, `INTN`, etc.).
  - Precompute bounding boxes and geometric centroids `(x, y, z)` for each state mesh to support dynamic 3D-to-2D screen projection in subsequent tracks.
- **Architectural Ground Shadow & Contact Plane:** Add a subtle ground shadow plane beneath the floating 3D map with soft radial falloff to produce a floating gallery art-piece aesthetic.

### 2.2 Materials, Shading & Lighting Pipeline
- **Stoneware Base Material:** Matte `THREE.MeshStandardMaterial` (`color: #E4DDD3`, `roughness: 0.75`, `metalness: 0.08`) reflecting an understated natural stone texture.
- **Terracotta Highlight Material:** Warm `THREE.MeshStandardMaterial` (`color: #D9531E`, `emissive: #331005`, `roughness: 0.45`) activated on state hover or selection.
- **Boundary Line Accents:** Crisp edge line geometry (`THREE.LineSegments` / perimeter strokes in `#9C8E7E`) framing each state border for clean geographic delineation.
- **Museum Studio Lighting:**
  - Key Directional Light: Warm sunlight (`#FFF8EE`, intensity: 1.8) casting soft PCF shadows.
  - Ambient Hemisphere Light: Sky/ground gradient (`#FFFFFF` sky, `#E5DFC5` ground, intensity: 0.9) ensuring zero pitch-black shadow zones.

### 2.3 Interactive Raycasting & Camera Kinematics
- **Tactile Z-Axis Elevation Physics:**
  - Hovering over a state elevates its mesh vertically (+10 units) with smooth GSAP easing over 250ms and shifts material color to terracotta.
  - Selecting a state locks the elevated state and triggers a camera focus tween.
- **Raycaster Hit-Detection:** High-performance raycasting filtered strictly to the interactive state mesh group, supporting pointermove, mouse click, and mobile touch events.
- **Constrained Exhibition Camera Controller:**
  - Customized OrbitControls with constrained polar angles (30° to 75°), azimuth limits, and zoom bounds (preventing inverted or underground perspectives).
  - Smooth damping (`enableDamping: true`, `dampingFactor: 0.05`).
  - GSAP-powered focus animation (`focusOnState(stateId)`) gently interpolating camera position and target.
- **Reset Camera Action:** Seamlessly resets camera position and zoom to the default gallery exhibition angle.

## 3. Non-Functional Requirements
- **Performance:** Maintain stable 60 FPS rendering on modern GPUs and mobile devices.
- **Memory Safety:** Strict resource disposal (`geometry.dispose()`, `material.dispose()`) on scene reconstruction or resize.
- **Viewport Responsiveness:** Smooth canvas resizing handling window resize and device pixel ratio (`Math.min(window.devicePixelRatio, 2)`).

## 4. Acceptance Criteria
1. The 3D India map renders completely with all 36 states and Union Territories extruded and properly aligned.
2. Hovering over any state highlights it in terracotta and raises it with smooth 3D kinetic elevation.
3. Clicking on any state selects it, triggers the focus camera transition, and emits state selection events.
4. Camera orbit controls are smooth, damped, and constrained within natural museum viewing angles.
5. "Reset View" button smoothly animates the camera back to the original exhibition perspective.
6. `npm run build` compiles with zero errors and passes strict TypeScript validation.

## 5. Out of Scope
- DOM info card rendering and SVG connector lines (covered in Track 4: `spatial_cards_tracers`).
- Speech audio narration and auto-tour loop (covered in Track 5: `kiosk_mode_narration`).