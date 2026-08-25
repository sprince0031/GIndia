# Implementation Plan: Three.js 3D Interactive Map Engine (`threejs_map_engine`)

## Phase 1: Three.js Scene Architecture & Studio Lighting
- [x] Task 1.1: Implement `src/core/scene-manager.ts` configuring `THREE.WebGLRenderer` (with antialiasing, PCF soft shadows, ACESFilmic tone mapping), camera, scene graph, and responsive viewport resize handlers.
- [x] Task 1.2: Implement the museum lighting pipeline (warm directional key light with shadow maps, sky/ground hemisphere ambient light, and circular soft contact shadow plane).

## Phase 2: SVG Extrusion & State Mesh Construction
- [x] Task 2.1: Implement `src/utils/svg-parser.ts` to parse `public/assets/in.svg` with `THREE.SVGLoader`, constructing beveled `THREE.ExtrudeGeometry` meshes for all states.
- [x] Task 2.2: Calculate normalized bounding boxes, center the 3D map at `(0, 0, 0)`, and precompute 3D geometric centroids for every state ID (`INWB`, `INTN`, etc.).
- [x] Task 2.3: Implement stoneware base materials, dark perimeter boundary line segments, and glowing terracotta highlight materials.

## Phase 3: Camera Kinematics, Raycasting & Elevation Physics
- [x] Task 3.1: Implement `src/core/camera-controller.ts` with constrained OrbitControls, polar/azimuth bounds, smooth inertia damping, and GSAP `focusOnState(stateId)` interpolation.
- [x] Task 3.2: Implement `src/core/interaction-manager.ts` providing high-performance raycasting, hover detection, touch events, and GSAP Z-axis kinetic mesh elevation (+10 units).
- [x] Task 3.3: Implement 3D-to-2D screen coordinate projection helper (`toScreenPosition(vector3)`).

## Phase 4: Integration & Build Verification
- [x] Task 4.1: Wire the 3D engine in `src/main.ts`, connecting state selection and camera reset with the exhibition UI controls.
- [x] Task 4.2: Execute `npm run build` to confirm clean TypeScript compilation and bundle generation into `dist/`.