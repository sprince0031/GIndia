# Development Workflow: GIndia

## 1. Methodology: Modular Track-Driven Development
Development proceeds iteratively through discrete, well-defined Conductor tracks. Each track encapsulates a cohesive feature set or technical milestone, validated before moving to the next.

### Track Lifecycle:
1. **Specification (`spec.md`):** Detail functional requirements, architectural interfaces, and acceptance criteria.
2. **Implementation Plan (`plan.md`):** Break down implementation into atomic tasks and verification steps.
3. **Execution & Verification:** Implement code, execute build checks, and verify in-browser rendering.
4. **Milestone Review & Commit:** Stage and commit with structured Conventional Commit messages.

## 2. Roadmap of Tracks
1. **Track 1: Project Scaffolding & Build Pipeline**
   - Initialize Vite + TypeScript + Tailwind CSS structure, asset folders, and base HTML template.
2. **Track 2: Local GI Database & Media Asset Pipeline**
   - Construct typed JSON database (`data/gi_database.json`) covering Indian GI products across all states/UTs with authentic metadata and offline graphics.
3. **Track 3: Three.js 3D Interactive Map Engine**
   - Implement `SVGLoader` extrusion from `in.svg`, warm gallery lighting, terracotta highlight materials, raycasting state selection, and hover elevation.
4. **Track 4: Spatial UI Cards & Dynamic 3D Tracers**
   - Implement floating product info cards with directional orientation (East/West), dynamic SVG bezier tracer rays anchored to 3D state centroids, and category filters.
5. **Track 5: Exhibition Kiosk Mode & Local Audio Narration**
   - Implement automated hands-free exhibition tour loop, camera lerping, and Web Speech API audio narration.
6. **Track 6: WebGL Fallback & Cross-Device UX**
   - 2D SVG vector interactive fallback for non-WebGL devices, mobile carousel drawer, touch ergonomics, and statistics dashboard modal.
7. **Track 7: GitHub Pages CI/CD & Production Deployment**
   - GitHub Actions workflow for automated testing, bundling, and deployment to GitHub Pages (`GIndia`).

## 3. Commit Conventions
All Git commit messages strictly follow the Conventional Commits specification:
- `feat:` A new feature or user-facing capability
- `fix:` A bug fix or rendering patch
- `style:` Formatting, CSS visual styling, or layout tweaks
- `refactor:` Code restructuring without changing behavior
- `docs:` Documentation or Conductor track updates
- `chore:` Tooling, dependency, or build configuration updates
