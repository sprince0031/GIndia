# Track Specification: Local GI Database & Media Asset Pipeline (`gi_database_and_assets`)

## 1. Overview
Construct a comprehensive, typed local JSON database (`data/gi_database.json`) and an offline-resilient media asset pipeline for all Geographical Indication (GI) products across India's states and union territories. The database serves as the single source of truth for 3D state mapping, spatial UI info cards, real-time search, category filtering, exhibition statistics, and browser speech narration.

## 2. Functional Requirements

### 2.1 Schema & Data Modeling
- **Normalized Data Architecture:**
  - `states`: Mapping of SVG state codes (e.g. `IN-WB`, `IN-TN`, `IN-KA`, `IN-KL`, `IN-UP`, `IN-GJ`, `IN-MH`, `IN-AS`, `IN-RJ`, `IN-AP`, `IN-TG`, `IN-OR`, `IN-BR`, `IN-MP`, `IN-HP`, `IN-GA`, `IN-NL`, `IN-PB`, `IN-HR`, `IN-UT`, `IN-SK`, `IN-MN`, `IN-ML`, `IN-MZ`, `IN-TR`, `IN-AR`, `IN-JH`, `IN-CT`, `IN-LA`, `IN-DL`, `IN-PY`, etc.) to name, capital, cardinal orientation (`east`, `west`, `north`, `south`, `central`, `northeast`), total GI count, and spotlight product IDs.
  - `products`: Comprehensive list of GI products containing:
    - Unique string ID (e.g., `darjeeling-tea`, `kashmir-pashmina`)
    - Product title and regional origin
    - Category classification (`Handicraft`, `Agricultural`, `Food Stuff`, `Manufactured`, `Natural Goods`)
    - Official GI Registration number & year
    - In-depth curatorial description emphasizing traditional craftsmanship and terroir
    - 3–4 key feature bullet highlights
    - Phonetic pronunciation text for Web Speech API narration
    - Primary local WebP image reference & supplementary region photo
  - `categories`: Metadata definition for each of the 5 primary GI categories with assigned color tokens and badge styles.
  - `summary`: Precomputed national and regional statistics (total registered GI count, category breakdown, top-ranked states).

### 2.2 Pan-India Coverage & Curation
- Comprehensive coverage spanning all 28 Indian States and 8 Union Territories.
- Each state features 1–3 curated spotlight products with full multimedia descriptions, plus a supplementary list of other recognized GI goods.

### 2.3 Media Asset Pipeline & Offline Resilience
- Optimized local WebP photographic assets placed in `public/assets/gi-images/`.
- Embedded SVG fallback artwork/patterns for each category to guarantee 100% offline self-containment without broken links.
- Image preloader utility in `src/utils/asset-loader.ts` to warm up image caches during state selection and tour cycling.

## 3. Non-Functional Requirements
- **Performance:** JSON database loads and parses in < 15ms; zero external network queries required.
- **Type Safety:** 100% TypeScript type validation conforming to `src/types/gi-data.ts`.
- **Zero Runtime Dependencies:** Pure client-side data querying without external databases or backend services.

## 4. Acceptance Criteria
1. `data/gi_database.json` contains complete records for all Indian states/UTs with accurate SVG ID mappings.
2. TypeScript data loader (`src/utils/database.ts`) loads, validates, and exposes query helpers (`getProductById`, `getProductsByState`, `searchProducts`, `getCategoryStats`).
3. Local WebP image assets and SVG graphic fallbacks load smoothly in the browser without 404 errors.
4. Unit/smoke test passes verifying all `stateId` references in `gi_database.json` correspond to valid SVG IDs in `in.svg`.

## 5. Out of Scope
- Direct 3D WebGL rendering (covered in Track 3: `threejs_map_engine`).
- Speech synthesizer playback loop (covered in Track 5: `kiosk_mode_narration`).