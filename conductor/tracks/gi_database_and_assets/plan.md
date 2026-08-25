# Implementation Plan: Local GI Database & Media Asset Pipeline (`gi_database_and_assets`)

## Phase 1: Database Construction & Data Modeling
- [ ] Task 1.1: Construct comprehensive JSON database (`data/gi_database.json`) covering all 28 Indian states and Union Territories with accurate SVG ID mappings (`IN-WB`, `IN-TN`, `IN-KA`, etc.), spotlight products, categories, registration years, cultural narratives, key highlights, and phonetic pronunciation.
- [ ] Task 1.2: Update and enrich `src/types/gi-data.ts` to support enhanced summary metrics, category filters, and search indexing structures.
- [ ] Task 1.3: Validate that all state IDs in `gi_database.json` match paths in `public/assets/in.svg`.

## Phase 2: Database Query Module & Search Engine
- [ ] Task 2.1: Implement `src/utils/database.ts` providing typed query functions:
    - `getAllStates()`, `getStateById(id: string)`
    - `getProductsByState(stateId: string)`
    - `getProductById(productId: string)`
    - `filterProductsByCategory(category: GICategory)`
    - `searchProducts(query: string)`
    - `getNationalStats()`
- [ ] Task 2.2: Implement multi-token fuzzy search and state aggregation logic.

## Phase 3: Media Asset Pipeline & Offline Artwork
- [ ] Task 3.1: Curate and populate `public/assets/gi-images/` with optimized WebP/SVG imagery for spotlight GI products.
- [ ] Task 3.2: Implement SVG artistic fallback generator in `src/utils/artwork-generator.ts` for zero-failure offline display.
- [ ] Task 3.3: Implement `src/utils/asset-loader.ts` for image preloading and browser memory caching.

## Phase 4: Verification & Build Check
- [ ] Task 4.1: Write a smoke verification routine in `src/main.ts` testing database queries, search indexing, and image loading.
- [ ] Task 4.2: Execute `npm run build` to confirm clean TypeScript compilation and bundle generation into `dist/`.