# Track Specification: Spatial UI Cards & Dynamic 3D Tracers (`spatial_cards_tracers`)

## 1. Overview
Implement the responsive, spatial exhibition product card interface and dynamic 3D-to-2D connecting line tracers. Floating product cards position themselves intelligently relative to the selected state's geographic orientation (Eastern states anchor to the right, Western/Northern states to the left), connected by real-time animated SVG bezier tracer rays originating directly from the state's 3D centroid.

## 2. Functional Requirements

### 2.1 Spatial Card Layout & Responsive Architecture
- **Geographic Directional Positioning:**
  - States with `orientation: 'east'` or `'northeast'` anchor floating product cards to the right side of the screen.
  - States with `orientation: 'west'`, `'north'`, `'south'`, or `'central'` anchor cards to the left side.
- **Multi-Product Support:**
  - On desktop/kiosk displays (>1024px), multiple spotlight products for a state display in a spatial vertical grid with quick product tabs.
  - On mobile/tablet screens (<1024px), cards render in a bottom-docked swipeable carousel with pagination dots.
- **Curatorial Exhibition Card Anatomy:**
  - Bold product heading with state and registration number badge.
  - Category badge with custom color styling (Handicrafts `#2B4C7E`, Agriculture `#2E7559`, Food `#E08D3C`, Manufactured `#785696`, Natural `#8C6432`).
  - High-resolution local image with lazy fallback.
  - In-depth curatorial description and key bullet points.
  - "Listen" button triggering speech narration hook.
  - Prominent "×" close button for instant dismissal.

### 2.2 Dynamic 3D-to-2D Tracer Rays
- **Screen Coordinate Projection:** Use Three.js `camera.project()` to continuously calculate the 2D pixel coordinates `(x, y)` of the active state's 3D centroid on every render frame.
- **SVG Cubic Bezier Curves:** Generate smooth cubic bezier curve paths `<path class="tracer-line" d="M x1 y1 C cx1 cy1, cx2 cy2, x2 y2" />` connecting the state's 3D anchor pin to the nearest edge of the active info card.
- **Visual Styling & Animation:**
  - Pulsing circular anchor node on the 3D state surface.
  - Animated traveling dashed light effect along the ray (`stroke-dasharray`, `stroke-dashoffset`).
  - Terracotta gradient stroke (`#D9531E` to `rgba(217, 83, 30, 0.4)`).
  - Hide tracers automatically when the card is closed, during rapid rotation, or when the centroid is behind the camera frustum.

### 2.3 Category Tag Filtering & 3D Map Interactivity
- Selecting a category from the toolbar highlights matching states in the 3D scene (terracotta material glow + Z-elevation) while non-matching states subtly dim.
- Selecting "All" restores the standard stoneware gallery map state.
- Closing a card dismisses the UI panel, fades out tracer lines, and lowers the elevated 3D state back to rest.

## 3. Non-Functional Requirements
- **60 FPS Performance:** Tracer bezier calculation must run in < 1ms per frame using direct SVG DOM attribute updates.
- **Memory Safety:** Automatically cleanup and detach SVG DOM elements when states change or cards dismiss.
- **Touch Friendly:** Minimum 44px hit targets on close buttons, tabs, and category chips.

## 4. Acceptance Criteria
1. Clicking any state on the 3D map displays its rich product info card on the correct spatial side (East -> Right, West -> Left).
2. An animated SVG bezier ray connects the 3D state centroid directly to the active card, maintaining alignment during camera drag and zoom.
3. Multiple products for a state can be navigated smoothly via tabs (desktop) and carousel (mobile).
4. Category filter chips accurately highlight matching states and filter product cards.
5. Clicking "×" closes the card, clears the tracer line, and deselects the 3D mesh.
6. `npm run build` compiles with zero TypeScript errors.

## 5. Out of Scope
- Automated speech synthesizer tour loop (covered in Track 5: `kiosk_mode_narration`).
- 2D SVG canvas fallback mode (covered in Track 6: `webgl_fallback_ux`).