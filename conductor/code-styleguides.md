# Code Style Guides: GIndia

## 1. TypeScript & JavaScript Standards
- **Standard:** Modern TypeScript (strict mode enabled) / ES2022+ standards.
- **Formatting:** Prettier conventions (2 spaces indentation, single quotes, trailing commas in multiline objects/arrays, 100-character print width).
- **Naming Conventions:**
  - `PascalCase` for classes, TypeScript types/interfaces, and Three.js custom object constructors.
  - `camelCase` for variable names, function names, object properties, and module instances.
  - `SCREAMING_SNAKE_CASE` for application constants and configuration thresholds.
  - `kebab-case` for file and directory names (e.g., `scene-manager.ts`, `gi-database.json`).
- **Module Structure:** Pure ES modules (`import` / `export`), avoiding global state mutation and enforcing single-responsibility components.

## 2. Three.js & WebGL Performance Best Practices
- **Resource Lifecycle & Memory Safety:**
  - Always explicitly call `.dispose()` on geometries, materials, and textures when removing or replacing 3D objects to prevent WebGL memory leaks.
  - Reuse shared materials and geometry templates wherever possible instead of instantiating duplicates.
- **Render Loop Optimization:**
  - Maintain a centralized `requestAnimationFrame` loop in `SceneManager`.
  - Pause rendering or throttle to low framerate when the tab is hidden or when the camera is stationary and no animation is running.
- **Raycasting & Interaction:**
  - Limit raycaster hit-testing targets strictly to the interactive state mesh group rather than traversing the entire scene graph.

## 3. CSS & Design Tokens
- **Variables & Tokens:** Use CSS Custom Properties defined in `:root` for color palette (e.g., `--color-canvas: #F9F6F0;`, `--color-terracotta: #D9531E;`, `--font-serif`, `--font-sans`).
- **Class Naming:** BEM or semantic utility conventions (e.g., `info-card`, `info-card__header`, `tool-dock__item`).
- **Glassmorphism:** Standardize backdrop filters with fallbacks for unsupported browsers.

## 4. Local Database & JSON Schemas
- **JSON Structure:** Strictly typed JSON with explicit keys: `id`, `name`, `state`, `category`, `year`, `description`, `details`, `image`.
- **Validation:** Type validation via TypeScript interfaces before consuming in UI cards.
