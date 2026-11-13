# AGENT.md — Experimind AI Learning Lab Architecture Guide

## 1. Project Overview & Architecture
**Experimind AI Learning Lab** is an enterprise-grade, offline-first educational platform designed for Windows 10/11 school computer labs across 10 grade levels (LKG, UKG, Classes 1–8).
- **Core Technology:** Zero-build vanilla web architecture (`index.html` + modular ES5/ES6 vanilla JavaScript in `src/`). No npm, no node build steps, no webpack, no external CDN dependencies required at runtime.
- **Offline Guarantee:** 100% functional without internet connectivity.
- **Privacy Guarantee:** Zero Student PII, zero accounts, zero forced logins, ephemeral in-memory session state.

## 2. Directory Structure & Key Files
- `index.html`: Main SPA container with 6-tab navigation, zoom controls, and sound toggle.
- `src/app.js`: Master application router, state management, and 5-pillar home hub.
- `src/simulators/engines.js`: 10 interactive Canvas simulation engines (`ENG-01` to `ENG-10`) with Python Code Bridges for Classes 6–8.
- `src/vision/visionLab.js`: 8-game AI Computer Vision & Webcam Arcade with optical-flow tracking and mouse/touch fallback.
- `src/videoPlayer.js`: 12 bespoke procedural Canvas animated movie engines.
- `src/data/curriculum80.js`: 80 CBSE AI & Computational Thinking lessons.
- `src/data/externalPlatforms.js`: 5 Free AI software guides & launch paths.
- `src/data/videoHub.js`: Master-detail video modules, quizzes, flashcards, study guides.
- `src/data/referenceBooks.js`: 5 offline CBSE AI textbooks & capstone guides (19 units).
- `src/audio/soundEngine.js`: Native Web Audio procedural synthesizer.
- `src/styles/main.css`: Responsive, tactile design system with default 88% kiosk zoom.
- `10_Brand_Assets/`: Official cropped horizontal logo (`Experimind_Labs_Official_Logo.png`) and SVG.
- `Offline_AI_Software_Installers/`: Standalone offline bundles for Scratch 3.0, GCompris, Google Blockly, Teachable Machine, and Code.org AI for Oceans.

## 3. Deployment & Update Utilities
- `Launch_Experimind_Lab.bat`: Dual-mode kiosk launcher with silent fast-forward `git pull --ff-only` when online, immediate offline fallback.
- `Sync_Latest_Updates.bat`: Automated update sync utility for school PCs (git pull or direct GitHub zip download/extract).
- `Push_To_GitHub.bat`: 1-click git add, commit, and push utility.
- `.github/workflows/deploy-pages.yml`: GitHub Actions workflow for auto-deploying to GitHub Pages.
- `Verify_Lab_Readiness.ps1`: Automated pre-deployment gate verifier and cryptographic integrity checker.
