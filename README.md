# Experimind AI Learning Lab — Innovation for Education (v5.0.0 Production Release)

**Official Repository:** [samartha-hm/ExperimindLabs_AI_Learning_Lab](https://github.com/samartha-hm/ExperimindLabs_AI_Learning_Lab)

**Company:** Experimind Labs (`src/config/brand.js`)

**Tagline:** Innovation for Education

**Target Audience:** Pre-Primary (LKG, UKG), Primary (Classes 1–2), Preparatory (Classes 3–5), and Middle School (Classes 6–8)

**Deployment Target:** Windows 10 / 11 School Computer Labs (4 GB RAM minimum, 100% Offline-First, Zero Admin Rights Required)

## 🌟 Platform Overview & The 5 Core School Lab Pillars

**Experimind AI Learning Lab (v5.0.0)** transforms standard school computer labs into interactive Artificial Intelligence, Coding, and Computational Thinking discovery centers aligned with the [CBSE Computational Thinking & AI (CT & AI) Curriculum (2026–27)](https://cbseacademic.nic.in/ct-ai.html), [NCF-SE 2023](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2184211), and the [AI4K12 Five Big Ideas Framework](https://ai4k12.org/gradeband-progression-charts/).

| Pillar # | Navigation Tab | Core Capabilities & Student Experience | 
| ----- | ----- | ----- | 
| **01** | **🎮 AI Educational Games** | **80 interactive hands-on simulators** across 10 grade levels (LKG, UKG, Classes 1–8) powered by 10 reusable HTML5 Canvas & logic simulation engines (`ENG-01` to `ENG-10`) with live **Python / NumPy / Scikit-Learn Code Bridges** for middle school. | 
| **02** | **💻 Free AI-Related Software** | In-platform step-by-step student guides, Windows Start Menu offline launch paths, and unplugged group activities for [Scratch 3.0 Desktop](https://scratch.mit.edu/download), [GCompris](https://www.gcompris.net/downloads-en.html), [Google Teachable Machine](https://teachablemachine.withgoogle.com/), [Blockly Games](https://blockly.games/), and [Code.org Hour of AI](https://code.org/en-US/hour-of-ai). | 
| **03** | **🎥 AI Tutorial Videos & Digital Learning Resources** | Master-detail interactive academy featuring a grade-band playlist sidebar, widescreen **100% offline procedural HTML5 Canvas animated movies** (plus online `youtube-nocookie.com` embeds), **Digital Study Guides**, **3D Flip Flashcards**, **Brain Checkpoint Quizzes**, and **Printable Study Worksheets**. | 
| **04** | **📖 CBSE AI Reference Book** | 100% offline digital textbook & student handbook reader covering **5 reference books and 19 units** (Classes 6, 7, 8 Student Handbooks, CT & AI Framework, and Student Capstone Guide) with visual concept architecture flowcharts, self-check Q&A accordions, and 1-click links to matching lab simulators. | 
| **05** | **📷 Webcam (AI Vision Arcade)** | **8 interactive motion-and-pointer computer vision games** (AI Ninja Fruit Slicer, Air Xylophone Synth, Magic Air Painter & Quick-Draw Guesser, AR Stadium Goalkeeper, AI Rock-Paper-Scissors Arena, Emoji Mimic & AR Masks, Teachable Space Arcade, and Cyborg Matrix ASCII / Thermal IR / LiDAR Vision) with explicit webcam consent and camera-free mouse/touch fallback. | 

## ✨ What's New in v5.0.0 (`1fe39fd`)

* **Calibrated Desktop & Kiosk Viewport Scaling (`4090555`):** Eliminates bulky kiosk overscaling with a crisp `88%` default UI zoom and live in-header zoom adjustment controls tailored for `1366×768` and `1920×1080` school lab monitors.

* **Horizontal Banner Official Brand Asset:** Cropped `10_Brand_Assets/Experimind_Labs_Official_Logo.png` to a clean horizontal aspect ratio with base64 fallback synchronization in `src/config/brand.js`.

* **100% Child-First Interface:** Removed all teacher-mode gates and star-badge clutter so students can launch any game, book chapter, animated tutorial, or webcam experiment in a single click.

* **Multi-Layer Neural Network Playground & Python Code Bridge (`bdd42e8`):** Added dynamic hidden-layer and neuron controls (`ENG-08` inspired by [TensorFlow Playground](https://playground.tensorflow.org/)) and live Python code inspection for Classes 6–8.

## 🚀 Quick Start & School Lab Deployment

### Method 1: One-Click Windows Portable Launcher (Recommended)

Double-click `Launch_Experimind_Lab.bat` from any folder or USB drive:

```
Launch_Experimind_Lab.bat

```

The launcher automatically detects 64-bit or 32-bit Microsoft Edge or Google Chrome and opens the platform in clean desktop `--app` mode with zero administrator privileges required.

### Method 2: Direct Browser Launch (100% Offline)

Double-click `index.html` in Windows Explorer to open directly in Edge, Chrome, Firefox, or Brave.

### Pre-Deployment Verification Suite

Run the automated PowerShell readiness audit before copying the folder to school lab PCs:

```
powershell -ExecutionPolicy Bypass -File .\Verify_Lab_Readiness.ps1

```

Confirms all 16 required source, asset, and configuration gates report `[PASS]`.

## 📂 Repository Structure

```
ExperimindLabs_AI_Learning_Lab/
├── index.html                        # Main SPA entry point (6-tab student navigation + confetti canvas)
├── Launch_Experimind_Lab.bat         # Zero-admin Windows 10/11 Edge & Chrome app-mode launcher
├── Verify_Lab_Readiness.ps1          # 16-gate pre-deployment integrity & checksum verifier
├── 00_MASTER_REQUIREMENTS.md         # Authoritative v3.0/v5.0 specification & 80-lesson matrix
├── README.md                         # Project documentation & deployment guide
├── favicon.ico / favicon.png         # Official application icons
├── 10_Brand_Assets/
│   ├── Experimind_Labs_Official_Logo.png
│   └── Experimind_Labs_Official_Logo.svg
└── src/
    ├── app.js                        # Main controller, router, 5-pillar home hub & Video/Book Academies
    ├── videoPlayer.js                # 12 bespoke procedural HTML5 Canvas animated movie engines
    ├── config/
    │   └── brand.js                  # Experimind Labs brand configuration & fallback data URI
    ├── data/
    │   ├── curriculum80.js           # Complete 10-grade, 80-lesson CBSE CT & AI + AI4K12 dataset
    │   ├── externalPlatforms.js      # Scratch 3, GCompris, Teachable Machine, Blockly & Code.org guides
    │   ├── videoHub.js               # 12 tutorial modules, quizzes, notebook notes & worksheets
    │   └── referenceBooks.js         # 5 offline CBSE AI textbooks & capstone guides (19 chapters)
    ├── simulators/
    │   └── engines.js                # All 10 interactive HTML5 Canvas/DOM simulator engines (ENG-01..10)
    ├── vision/
    │   └── visionLab.js              # 8-Game AI Webcam & Computer Vision Arcade (WebRTC + Virtual Mode)
    ├── audio/
    │   └── soundEngine.js            # Muted-by-default Web Audio API synthesizer & fanfare engine
    └── styles/
        └── main.css                  # Responsive widescreen kid-first tactile 3D design system

```

## 🔒 Child Safety, Privacy & Ethical Guardrails

1. **Zero Student Personal Data (PII):** Never requests, stores, or transmits student names, emails, photographs, or voice recordings.

2. **Zero Logins or Cloud Accounts:** Immediate 1-click access to all 80 games, 19 textbook chapters, 12 video tutorials, and 8 webcam labs.

3. **Local RAM Webcam Processing:** All optical-flow and pixel analysis in `src/vision/visionLab.js` runs strictly in an offscreen `80×50` volatile RAM canvas and is never saved to disk.

4. **Muted-by-Default Classroom Audio:** Boots with `🔇 Sound: Off` to keep 30-seat computer labs quiet until toggled on.