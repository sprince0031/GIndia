# Implementation Plan: Exhibition Kiosk Mode & Local Audio Narration (`kiosk_mode_narration`)

## Phase 1: Local Speech Synthesis Audio Engine
- [x] Task 1.1: Implement `src/core/audio-narrator.ts` managing `window.speechSynthesis`, `en-IN` voice detection, playback cadence (`rate: 0.94`), and rich storytelling narration script templates.
- [x] Task 1.2: Provide methods for `speakProduct()`, `pause()`, `resume()`, `cancel()`, completion callbacks, and mute state persistence in `localStorage`.

## Phase 2: Autonomous Tour Choreographer & Camera Trajectory
- [x] Task 2.1: Implement `src/core/tour-manager.ts` with the 36-state geographic regional itinerary (Himalayas $\rightarrow$ Plains $\rightarrow$ Delta $\rightarrow$ Northeast $\rightarrow$ West $\rightarrow$ South $\rightarrow$ Islands).
- [x] Task 2.2: Implement sequential step advancement, dynamic dwell timing (~7–9s), camera fly-to interpolation, and spatial card synchronization.
- [x] Task 2.3: Implement visitor interaction detection and 20-second idle auto-resume watchdog.

## Phase 3: Bottom Narration Bar & UI Dock Controls
- [x] Task 3.1: Connect bottom `#narration-bar` controls (Previous `⏮`, Pause/Resume `⏯`, Next `⏭`, and active state/product captions).
- [x] Task 3.2: Wire dock buttons (`#dock-tour-toggle` and `#dock-speech-toggle`) with active states and tooltips.

## Phase 4: Integration & Build Verification
- [x] Task 4.1: Integrate `TourManager` and `AudioNarrator` into `src/main.ts`.
- [x] Task 4.2: Execute `npm run build` to verify clean TypeScript compilation and static bundle generation into `dist/`.