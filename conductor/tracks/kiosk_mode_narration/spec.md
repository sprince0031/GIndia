# Track Specification: Exhibition Kiosk Mode & Local Audio Narration (`kiosk_mode_narration`)

## 1. Overview
Implement the hands-free autonomous museum kiosk tour mode and offline audio narration engine. The kiosk mode guides visitors through a curated regional journey across all Indian states and Union Territories, smoothly animating the 3D camera to each state, displaying spatial product cards with dynamic tracer lines, and narrating cultural insights using the browser's local `window.speechSynthesis` engine (100% offline, zero cloud API costs).

## 2. Functional Requirements

### 2.1 Autonomous Tour Sequence & Camera Choreography
- **Curated Geographic Flow:** Tour sequentially visits states along a natural regional journey:
  1. *North & Himalayas:* Ladakh, Jammu & Kashmir, Himachal Pradesh, Uttarakhand, Punjab, Haryana, Chandigarh, Delhi.
  2. *Central Heartland:* Rajasthan, Madhya Pradesh, Uttar Pradesh, Chhattisgarh.
  3. *Eastern & Delta:* Bihar, Jharkhand, West Bengal, Odisha.
  4. *Northeastern Hills:* Sikkim, Assam, Arunachal Pradesh, Nagaland, Manipur, Mizoram, Tripura, Meghalaya.
  5. *Western Coast:* Gujarat, Dadra & Daman, Maharashtra, Goa.
  6. *Southern Peninsula & Deccan:* Telangana, Andhra Pradesh, Karnataka, Kerala, Tamil Nadu, Puducherry.
  7. *Island Territories:* Andaman & Nicobar, Lakshadweep.
- **Smooth GSAP Camera Lerping:** When advancing to a state, the camera smoothly arcs and zooms towards the state centroid while the spatial info card slides in.
- **Dynamic Dwell Time:** Each stop remains active for ~7–9 seconds or until the speech synthesis concludes before automatically advancing to the next state.
- **Visitor Takeover & Idle Auto-Resume:** If a user manually rotates the camera, clicks a state, or filters a category, the tour pauses immediately. After 20 seconds of user inactivity, the tour resumes automatically.

### 2.2 Local Speech Synthesis Audio Engine
- **Voice Selection:** Intelligently detect and select natural Indian English speech synthesis voices (`en-IN`, Microsoft/Google/Apple localized voices), falling back gracefully to standard English voices.
- **Storytelling Audio Scripts:** Dynamically construct engaging museum-grade voiceovers for each product:
  - Mentioning the state origin, product heritage, unique artisanal craft, or agricultural terroir.
- **Playback & Bottom Narration Bar:**
  - Floating bottom bar with pulsing active indicator.
  - Previous (`⏮`), Play/Pause (`⏯`), and Next (`⏭`) skip buttons.
  - Live animated caption showing the active state and product.
  - Tool dock mute toggle (`dock-speech-toggle`) with `localStorage` persistence.

## 3. Non-Functional Requirements
- **100% Offline Capable:** Zero external network requests or third-party cloud audio dependencies.
- **Performance:** Audio playback and camera lerping must run smoothly without frame stutter (<60 FPS drop).
- **Graceful Error Handling:** In environments where `speechSynthesis` is blocked or unavailable, the tour continues visually with timer captions without error.

## 4. Acceptance Criteria
1. Clicking the "Auto Tour" dock button starts the autonomous exhibition loop.
2. The 3D camera flies smoothly between states, highlighting each state in terracotta and opening its spatial info card and dynamic tracer ray.
3. Local speech synthesis speaks the curated product introduction clearly in Indian English.
4. Bottom narration bar displays active captions and allows pausing, resuming, skipping, and going back.
5. User interaction pauses the tour; 20 seconds of idle time resumes it.
6. `npm run build` compiles with zero TypeScript errors.