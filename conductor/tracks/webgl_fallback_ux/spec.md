# Track Specification: WebGL Fallback & Cross-Device Mobile/Tablet UX (`webgl_fallback_ux`)

## 1. Overview & Objectives
Provide a gallery-grade 2D vector fallback map for environments lacking WebGL hardware acceleration (or when WebGL context fails), while optimizing touch ergonomics, responsive layouts, and small-screen presentation across mobile and tablet devices.

---

## 2. Functional Requirements

### 2.1 WebGL Detection & Graceful 2D Fallback Activation
- **Automated WebGL Probing:** Detect WebGL/WebGL2 support on startup.
- **Dynamic Viewport Switching:** If WebGL is unsupported or encounters context loss, smoothly activate `#fallback-container` with the 2D interactive SVG map.
- **Ambient Mode Banner:** Display a discreet, non-intrusive banner indicating *"2D Vector Mode Active (Hardware Acceleration Unavailable)"* with an option to dismiss.

### 2.2 Interactive 2D SVG Vector Map Engine
- **Stoneware & Terracotta Shading:** Render all 36 Indian states and union territories in stoneware beige (`#E6DFD5`), with `#D9531E` terracotta highlights on hover and active selection.
- **Dynamic Pan & Zoom:**
  - Mouse drag / touch drag to pan.
  - Mouse wheel / touch pinch-to-zoom with bounded scale limits.
  - Double-click / double-tap on a state to center and focus.
  - Dock reset button resets viewBox to national overview.
- **Category Filter Synchronization:** Apply terracotta highlights and dimmed state opacity in 2D mode matching active category filter selections.
- **2D Dynamic Tracer Ray:** Render dynamic SVG dashed bezier rays connecting the 2D state centroid to the active info card anchor.

### 2.3 Responsive Mobile & Tablet UX (< 768px)
- **Centered Modal Dialog with Backdrop Blur:** On screens `< 768px`, render the Info Card as a centered, focused modal dialog with dark backdrop blur (`backdrop-blur-md bg-black/60`), highlighting product imagery, audio narration, registration metadata, and highlights.
- **Explicit Modal Dismissal & Close Controls:**
  - **Prominent Header Close Button:** High-contrast `X` button with minimum 44x44px touch target at the top right of the modal card.
  - **Backdrop Tap-to-Dismiss:** Tapping anywhere on the dark backdrop outside the modal immediately closes the modal and deselects the active state.
  - **Bottom Action Dismissal:** An explicit "Close / Return to Map" button at the bottom of the card on mobile viewports.
  - **Keyboard / Gesture Dismissal:** `Escape` key and standard swipe/back gestures smoothly dismiss the modal.

### 2.4 Kiosk Tour & Narration Compatibility in 2D Mode
- Synchronize the 36-state automated regional tour, camera pan-focus, and local audio narration seamlessly within the 2D SVG map engine.

---

## 3. Acceptance Criteria
1. When WebGL is disabled or unavailable, the application loads the interactive 2D SVG map without errors.
2. 2D map supports fluid pan, wheel zoom, touch pinch-to-zoom, and state selection in terracotta.
3. On mobile viewports (< 768px), product info cards open as centered modal dialogs over the darkened, blurred map with clear, prominent close controls (header `X` button, backdrop tap, and bottom dismiss button).
4. Category filters and Kiosk Tour work identically across both 3D and 2D modes.
5. Production build (`npm run build`) compiles cleanly with zero TypeScript errors.
