# Experimind AI Learning Lab — Innovation for Education

[![Offline-First](https://img.shields.io/badge/Architecture-100%25%20Offline--First-emerald.svg)](#)
[![CBSE CT & AI](https://img.shields.io/badge/Curriculum-CBSE%20CT%20%26%20AI%202026--27-blue.svg)](#)
[![AI4K12](https://img.shields.io/badge/Pedagogy-AI4K12%20Five%20Big%20Ideas-purple.svg)](#)
[![Target Grades](https://img.shields.io/badge/Grades-LKG%20to%20Class%208%20(10%20Tiers)-amber.svg)](#)
[![Zero Admin Rights](https://img.shields.io/badge/Deployment-Zero%20Admin%20Required-success.svg)](#)

> **Official Experimind Labs Educational Platform**  
> **Tagline:** Innovation for Education  
> **Target Audience:** Pre-Primary (LKG, UKG), Primary (Classes 1–2), Preparatory (Classes 3–5), and Middle School (Classes 6–8)  
> **Platform Scope:** 10 Grade Levels • 80 Interactive Simulators • Dual-Mode AI Vision Lab • 12 Animated Explainer Movies • Volatile Session Star Certificates  

---

## 🌟 Overview & School Lab Transformation

Experimind AI Learning Lab transforms standard school computer lab desktop computers (running Windows 10/11 with 4 GB RAM) into rich, interactive AI & Computational Thinking learning centers without requiring internet access, administrative privileges, npm builds, or cloud accounts.

### Key Highlights
* **100% Child-First UX:** Playful, tactile, and encouraging interface with zero logins, zero student tracking, zero PII collection, and zero teacher-mode clutter.
* **Simulator-First Split Layout:** 65% interactive simulation arena on the left; 35% visual 3-step mission guide, collapsible Sparky's Secret Brain Boost, and interactive star quiz on the right.
* **10 Reusable HTML5 Simulation Engines (`ENG-01` to `ENG-10`):** From sensory bubble popping and drag-and-drop sorting to 2D robot maze navigation, logic circuits, Scratch-style block coding, ML decision trees, perceptron neural networks, and IoT sensor simulators.
* **Dual-Mode AI Vision Lab:** Instant camera-free virtual simulator mode + explicit opt-in hardware webcam processing strictly in local volatile RAM.
* **Built-In Animated Movie Theatre:** 12 four-part animated explainer movies with animated Sparky mascot, floating stars, dynamic chapter scrubbers, and Web Audio/Speech API narration for younger readers.
* **Celebration & Progress Loop:** Universal Canvas Confetti particle explosions on winning stars + volatile on-screen printable Session Star Certificates (resets cleanly when the browser closes).

---

## 🚀 How to Launch in School Computer Labs

### Method 1: One-Click Windows Launcher (Recommended)
Double-click:
```bat
Launch_Experimind_Lab.bat
```
This automatically detects Microsoft Edge or Google Chrome and boots directly into full-screen desktop app mode.

### Method 2: Direct Browser Launch (100% Offline)
Open `index.html` directly in any modern web browser (Edge, Chrome, Firefox, Brave):
```
index.html
```

### Deployment Verification
Run the included verification script in PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File .\Verify_Lab_Readiness.ps1
```
All 13 core deployment gates must report `[PASS]`.

---

## 📚 Curriculum Matrix & Simulator Engines

The 80 lessons are mapped across 10 grade levels aligned with CBSE CT & AI (2026–27), NCF-SE 2023, and the AI4K12 Five Big Ideas:

| Engine | Simulator Engine Name | Key Mechanics | Grade Levels |
| :--- | :--- | :--- | :--- |
| `ENG-01` | **Pattern, Classification & Sorter** | HTML5 Drag-and-Drop & click-to-place, category baskets, pattern sequences | LKG, UKG, Class 1 |
| `ENG-02` | **Spatial & Discovery Playground** | Physics bubble bursting particles, bee maze pathing, hand-eye coordination | LKG, UKG |
| `ENG-03` | **RoboGrid Path Simulator** | 2D tile grid, directional command cards, step stepper, obstacle bug detection | Classes 1 – 4 |
| `ENG-04` | **IPO & Logic Gate Workbench** | Glowing conduits, 5-bit binary switchboards, Boolean `AND`/`OR`/`NOT`/`IF-ELSE` gates | Classes 1 – 5 |
| `ENG-05` | **Visual Block Coding Studio** | Scratch-style snap blocks, Cartesian stage, sprite physics, Pen trail drawing | Classes 3 – 5 |
| `ENG-06` | **Data Detective & Sorting Lab** | Animated bubble sort visualizer, interactive spring-up bar charts, scatter plots | Classes 3 – 7 |
| `ENG-07` | **Rule-Based vs. ML Classifier Lab** | Decision trees, NLP tokenization & stop-word filters, 2D feature decision boundaries | Classes 6 – 8 |
| `ENG-08` | **Neural Network & Perceptron Lab** | Forward-pass synapse pulses, weight sliders, bias thresholds, activation gauge | Classes 7 – 8 |
| `ENG-09` | **Computer Vision Pixel & Filter Matrix**| 6×6 pixel matrices, 3×3 convolution kernels (Sobel edge, sharpen, blur), heatmaps | Classes 6 – 8 |
| `ENG-10` | **Smart IoT & AI Ethics Auditor** | Environmental sensor sliders, animated actuators (sprinklers, fans), 4Ws ethics auditor | Classes 6 – 8 |

---

## 🔒 Child Privacy & Classroom Ergonomics

1. **Zero Student PII:** The platform never asks for, records, or uploads names, emails, photos, or voice recordings.
2. **Volatile Session State:** All earned stars and progress exist strictly in memory (`sessionStars`) and clear when the browser window closes.
3. **Muted by Default:** Sound effects default to `🔇 Sound: Off` so a 30-computer classroom stays silent unless headphones or teacher permission are granted.
4. **Hardware Webcam Isolation:** The hardware webcam starts ONLY after explicit user consent (`📷 Start Hardware Camera`) and releases all media tracks immediately on `⏹️ Stop Camera`.

---

## 🏢 Brand & Copyright

* **Organization:** Experimind Labs
* **Tagline:** Innovation for Education
* **Product:** Experimind AI Learning Lab
* **Version:** 3.0 (CBSE CT & AI 2026–27 Complete Edition)
