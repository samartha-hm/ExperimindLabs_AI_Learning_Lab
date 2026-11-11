# Experimind AI Learning Lab — Master Requirements, Curriculum & Technical Blueprint (v3.0 Complete Edition)

> **Authoritative Specification & Scratch-Build Resource Pack**  
> **Company:** Experimind Labs (`src/config/brand.js`)  
> **Tagline:** Innovation for Education  
> **Target Audience:** LKG, UKG, and Classes 1 through 8 (10 Grade Levels, 80 Interactive Lab Lessons)  
> **Pedagogical Alignment:** [CBSE Computational Thinking & AI (CT & AI) Curriculum](https://cbseacademic.nic.in/ct-ai.html), [NCF-SE 2023 Mandate](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2184211), and [AI4K12 Five Big Ideas Progression](https://ai4k12.org/gradeband-progression-charts/)  
> **Deployment Target:** Windows 10 / 11 Desktops (4 GB RAM, Dual-Core CPU, 100% Offline-First Portable USB/Folder)  

## 1. Executive Summary & Audit of v2.0 Specification Gaps

### 1.1 The Approved School Charter
The school administration approved the computer lab transformation under the following mandate:
> *"Upgrade the existing Computer Lab through one-time system maintenance, AI-related software installation, supplementary AI curriculum, tutorial video resources thereby creating an AI-enabled learning environment using the school's existing infrastructure."*

### 1.2 Root-Cause Audit: Why Previous Automated Builds Failed
An inspection of the original `00_MASTER_REQUIREMENTS.md` (v2.0) revealed five structural gaps that caused automated code generation to produce generic, non-functional UI:

| Spec Section in v2.0 | Defect Identified in Original File | Fix Implemented in v3.0 Blueprint |
| :--- | :--- | :--- |
| **Section 5 (Curriculum)** | Sections 5.1, 5.2, 5.3, and 5.4 had blank bullet headers (`LKG Focus:`, `Class 1 Focus:`, etc.) and omitted `Class 8 Focus` entirely, despite Section 4.1 requiring 80 lessons. | Full 10-grade × 8-lesson curriculum matrix (80 lessons total) mapped to concrete interactive simulator engines and [CBSE CT & AI](https://cbseacademic.nic.in/ct-ai.html) standards. |
| **Section 4.1 (Simulators)** | Demanded 80 hands-on simulators without defining reusable simulation engine archetypes, causing code generators to emit static forms or fake buttons. | Standardized 10 parameterized HTML5 Canvas/SVG interactive simulation engines that power all 80 lessons with real physics, logic gates, and ML math. |
| **Section 9 (Missing)** | Document jumped directly from Section 8 to Section 10, omitting assessment mechanics, `sessionStars` state rules, and Teacher Mode controls. | Restored Section 9 specifying the interactive quiz engine, volatile `sessionStars` reward loop, and Teacher Mode PIN/Gatekeeper controls. |
| **Section 10.1 (Architecture)** | Contained only the placeholder text `"need to be decided asper the reqiremnetes"`. | Defined a deterministic, zero-admin Windows portable architecture (`DELIVERY/Experimind_AI_Learning_Lab`) with strict UI/UX design tokens. |
| **Section 11 (Verification)** | Left completely empty at the end of the file. | Added an automated + manual pre-deployment verification checklist covering offline execution, hardware limits, and child-privacy compliance. |

### 1.3 Division of Responsibilities & Explicit Guardrails
* **Delivered by Company Operations (In-Person):** Physical AI classroom posters/wall charts, in-person faculty workshops, and physical lab hardware maintenance.
* **Delivered by This Digital Platform:** Standalone Windows launcher (`Launch_Experimind_Lab.bat`), offline-first student portal, 80 interactive simulators and CBSE-mapped lesson sheets, 10 grade-specific AI Vision Lab experiments, curated external platform launcher guides, and embedded privacy-enhanced tutorial videos.
* **Non-Negotiable Exclusions:** No pre-reader voice/audio narration required; zero user accounts, student logins, or PII collection; zero developer disclaimer/hedging text (such as *"NOT bundled or tested"*) anywhere in the UI.

## 2. Core Product Identity & Hardware Parameters

| Parameter | Specification | Implementation Detail |
| :--- | :--- | :--- |
| **Product Name** | Experimind AI Learning Lab | Uniform branding across launcher, navbar, hero banner, and lesson sheets. |
| **Organization** | Experimind Labs | Centralized configuration in `src/config/brand.js`. |
| **Tagline** | Innovation for Education | Rendered in application header and landing screen. |
| **Official Logo** | `Experimind_Labs_Official_Logo.png` | Loaded verbatim from `10_Brand_Assets/Experimind_Labs_Official_Logo.png`. |
| **Target Grades** | LKG, UKG, Classes 1 to 8 | 10 distinct grade tiers × 8 lessons per grade = 80 interactive lessons. |
| **Hardware Target** | Existing School Desktops | Windows 10 / 11 (64-bit), 4 GB RAM minimum, dual-core CPU, 60 fps on integrated graphics. |
| **Network Reliance** | 100% Offline-First Core | All 80 lessons, simulators, assessments, and webcam vision labs run without internet. |
| **Delivery Medium** | Portable USB / Folder | Single root directory (`DELIVERY/Experimind_AI_Learning_Lab`), zero Windows admin rights required. |

## 3. Child Safety, Privacy & Classroom Ergonomics

1. **Zero Student PII Collection:** The platform never requests, stores, or transmits student names, emails, photos, voice recordings, or IDs. Webcam frames in the AI Vision Lab are processed strictly in volatile RAM via HTML5 `<canvas>` and never saved to disk.
2. **Volatile Session Progress (`sessionStars`):** Stars earned from completing simulator challenges and quizzes are stored only in in-memory JavaScript state (`window.sessionStars` / `sessionStorage`) so every new class period starts with a clean slate when the browser closes.
3. **Zero Accounts, Ads, or Analytics:** Instant boot into the grade selector with no login screens, telemetry beacons, or third-party tracking scripts.
4. **Teacher Supervised Gateway for External Links:** Curated external web links ([Google Teachable Machine](https://teachablemachine.withgoogle.com/), [Code.org Hour of AI](https://code.org/en-US/hour-of-ai), [Blockly Games](https://blockly.games/)) require passing a lightweight Teacher Confirmation Modal (`Hold for 2 seconds` or teacher toggle) and open with `target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer"`.
5. **Muted-by-Default Web Audio:** Synthesized Web Audio API feedback chimes (success chord, gentle retry tone, click pop) default to `🔇 Sound: Off` in the top bar so a 30-PC computer lab stays quiet unless permitted.

## 4. Visual Design System & Interactive Simulation Standard

### 4.1 Why Generic AI-Generated UIs Look Unprofessional (And How We Fix It)
To match the polish of [PhET Interactive Simulations](https://phet.colorado.edu/) and [Code.org](https://code.org/), the UI enforces a strict design token system:
* **Full-Screen Fluid Workspace:** Uses `max-width: 1800px; width: 100%; padding: 24px clamp(20px, 3.5vw, 44px);` with a split-pane laboratory layout on desktop monitors (left 38%: interactive lesson narrative, challenge prompt, and quiz; right 62%: live interactive HTML5 Canvas/SVG simulator with fullscreen toggle `#game/:id`).
* **Age-Calibrated Visual Hierarchy:**
  * **Band A (LKG – UKG):** Extra-large touch/mouse targets (`min-height: 72px`), high-contrast primary illustrations, 1-click/drag interactions, zero dense paragraphs, visual star burst rewards.
  * **Band B (Classes 1 – 2):** Visual step cards, icon-guided sequencing boards, friendly robot mascot cues, short 1-sentence instructions.
  * **Band C (Classes 3 – 5):** Block-coding workspace aesthetic, live variable readout badges, grid coordinate overlays, step-by-step algorithm trace controls (`▶️ Run`, `⏯️ Step`, `🔄 Reset`).
  * **Band D (Classes 6 – 8):** Modern AI Studio dashboard aesthetic with live confusion matrices, neuron weight sliders, dataset balance gauges, and IoT sensor wiring canvases.

### 4.2 The 10 Reusable Interactive Simulator Engines
Rather than coding 80 disconnected toy scripts, the platform builds **10 deep, parameterized simulation engines** (`src/simulators/engines/`) configured via per-lesson JSON schemas:

| Engine ID | Simulator Engine Name | Core Interactive Mechanics | Grades Served |
| :--- | :--- | :--- | :--- |
| `ENG-01` | **Pattern & Shape Sorter Canvas** | Drag-and-drop visual sorting bins, odd-one-out spotlight, sequence completion train, size/color matrix. | LKG, UKG |
| `ENG-02` | **Mouse & Spatial Discovery Playground** | Target click bubbles, path tracing without touching walls, double-click treasure chests, keyboard key-match piano. | LKG, UKG |
| `ENG-03` | **Step-by-Step Robot Grid (`RoboGrid`)** | 2D tile grid with obstacles, collectibles, directional command cards (`⬆️`, `⬇️`, `⬅️`, `➡️`, `Loop ×N`, `If Path Blocked`), live execution stepper, and bug-finder mode. | Classes 1 – 4 |
| `ENG-04` | **IPO & Logic Gate Workbench** | Interactive Input ➔ Process ➔ Output pipeline builder, daily-algorithm sorter, and visual `AND` / `OR` / `NOT` / `IF-ELSE` branching switches. | Classes 1 – 5 |
| `ENG-05` | **Visual Block & Scratch-Lite Studio** | Snap-together block workspace with sprite stage, coordinate X/Y readout, repeat loops, event triggers, and variable counters. | Classes 3 – 5 |
| `ENG-06` | **Data Detective & Chart Builder** | Interactive pictogram/bar/scatter chart manipulator, data cleaning filter, and feature-table classifier. | Classes 3 – 7 |
| `ENG-07` | **Rule-Based vs. ML Classifier Lab** | Interactive training sandbox where students label training samples, adjust feature thresholds, test unseen items, and inspect accuracy drops under biased data. | Classes 6 – 8 |
| `ENG-08` | **Neural Network & Perceptron Playground** | Live visual node network with adjustable input switches, weight sliders (`w1..w3`), bias threshold slider, activation gauge, and forward-pass animation. | Classes 7 – 8 |
| `ENG-09` | **Computer Vision Pixel & Filter Matrix** | Interactive pixel grid (grayscale/RGB numbers), edge-detection kernel scanner, and feature heatmap visualizer. | Classes 6 – 8 |
| `ENG-10` | **Smart IoT & AI Ethics Decision Simulator** | Virtual smart-school/smart-home sensor wiring board (temperature, motion, soil moisture, smart relay) + ethical dilemma scenario evaluator. | Classes 6 – 8 |

## 5. Complete Grade-by-Grade Educational Framework (80 Lessons)

Aligned with the [CBSE Computational Thinking and Artificial Intelligence (CT & AI) Curriculum for Classes 3–8](https://cbseacademic.nic.in/web_material/CurriculumMain27/CTAI_Pri_2026-27.pdf), [CBSE Class 6 Student Handbook](https://cbseacademic.nic.in/web_material/CurriculumMain27/CTAI_Pri6SH_2026-27.pdf), [CBSE Class 7 Student Handbook](https://cbseacademic.nic.in/web_material/CurriculumMain27/CTAI_Pri7SH_2026-27.pdf), [CBSE Class 8 Student Handbook](https://cbseacademic.nic.in/web_material/CurriculumMain27/CTAI_Pri8SH_2026-27.pdf), and the [AI4K12 Five Big Ideas Framework](https://ai4k12.org/gradeband-progression-charts/).

### 5.1 Pre-Primary: LKG & UKG (Early Cognitive, Sensory & Digital Discovery)
* **Design Philosophy:** Large colorful SVG illustrations, zero reading barrier, no countdown timers, instant visual celebration, 1-click and simple drag interactions.
* **LKG Focus (8 Interactive Lessons & Simulators):**
  1. `LKG-01` **Tap & Pop Bubble Garden** (`ENG-02`): Left-click cursor targeting and hand-eye coordination.
  2. `LKG-02` **Color Basket Sorter** (`ENG-01`): Grouping primary and secondary colored fruits into matching baskets (foundational classification).
  3. `LKG-03` **Big & Small Safari** (`ENG-01`): Comparing object scale (big elephant vs. small mouse) and ordering by size.
  4. `LKG-04` **Shape Detective House** (`ENG-01`): Matching circles, squares, triangles, and stars into architectural cutouts.
  5. `LKG-05` **Odd-One-Out Toy Shelf** (`ENG-01`): Spotting the item that breaks a category rule (visual feature detection).
  6. `LKG-06` **Choo-Choo Pattern Train** (`ENG-01`): Completing `A-B-A-B` color and shape train car sequences.
  7. `LKG-07` **Animal Sound & Home Match** (`ENG-01`): Associating pets, farm, and jungle animals with their habitats.
  8. `LKG-08` **Happy vs. Sad Face Mirror** (`ENG-01`): Recognizing facial expressions (eyes/mouth cues — precursor to AI emotion perception).
* **UKG Focus (8 Interactive Lessons & Simulators):**
  1. `UKG-01` **Steady-Hand Maze Bridge** (`ENG-02`): Dragging a friendly bee along a winding path from flower to hive.
  2. `UKG-02` **Two-Rule Treasure Sort** (`ENG-01`): Sorting objects by two attributes simultaneously (e.g., *Red AND Round*).
  3. `UKG-03` **Morning-to-Night Story Sequencer** (`ENG-04`): Ordering 4 daily routine picture cards chronologically (first, next, then, last).
  4. `UKG-04` **Growing Pattern Caterpillar** (`ENG-01`): Extending `A-B-C` and `A-A-B` visual patterns.
  5. `UKG-05` **Shadow & Silhouette Matcher** (`ENG-01`): Matching complex object outlines to their full-color objects (edge/shape perception).
  6. `UKG-06` **Count & Load the Cargo Truck** (`ENG-06`): Matching quantities (1–10) to visual number blocks.
  7. `UKG-07` **Left, Right, Up, Down Bunny Hop** (`ENG-03`): Guiding a bunny 3 steps on a giant 4×4 garden grid using directional arrows.
  8. `UKG-08` **Smart vs. Normal Machines Around Us** (`ENG-04`): Sorting everyday objects (wooden chair vs. automatic door / robot vacuum).

### 5.2 Primary: Classes 1 & 2 (Foundational Computational Thinking & Instructions)
* **Class 1 Focus (8 Interactive Lessons & Simulators):**
  1. `C1-01` **Natural vs. Human-Made Explorer** (`ENG-01`): Classifying natural things vs. human-engineered machines.
  2. `C1-02` **Meet the Computer Parts Lab** (`ENG-04`): Interactive wiring of Monitor, CPU, Keyboard, Mouse, and Speaker with role simulation.
  3. `C1-03` **Step-by-Step Sandwich Chef** (`ENG-04`): Sequencing a 5-step recipe — observing hilarious outcomes when steps are out of order.
  4. `C1-04` **RoboGrid: Help Sparky Reach the Battery** (`ENG-03`): Writing 4–6 directional arrow commands on a 5×5 grid.
  5. `C1-05` **Spot the Bug in Sparky's Path** (`ENG-03`): Finding and fixing a single wrong arrow in a pre-written command sequence.
  6. `C1-06` **Mystery Rule Sorter** (`ENG-01`): Discovering the secret rule a sorting machine uses to accept or reject shapes.
  7. `C1-07` **Pictogram Pet Counter** (`ENG-06`): Counting classroom items and stacking visual pictogram bars.
  8. `C1-08` **How Sensors Help Machines "Feel"** (`ENG-04`): Matching human senses (eyes, ears, touch) to machine sensors (camera, microphone, button).
* **Class 2 Focus (8 Interactive Lessons & Simulators):**
  1. `C2-01` **Input ➔ Process ➔ Output (IPO) Factory** (`ENG-04`): Running a virtual juice maker, calculator, and washing machine through IPO stages.
  2. `C2-02` **Decomposition: Breaking Big Tasks into Small Steps** (`ENG-04`): Splitting "Get Ready for School" and "Build a Lego House" into modular sub-tasks.
  3. `C2-03` **RoboGrid Loops: Don't Repeat Yourself!** (`ENG-03`): Replacing `➡️ ➡️ ➡️ ➡️` with a compact `Repeat 4 Times [➡️]` block.
  4. `C2-04` **If-It-Rains Umbrella Switch** (`ENG-04`): Interactive everyday `IF <condition> THEN <action>` weather and traffic-light simulator.
  5. `C2-05` **Secret Code Cipher Wheel** (`ENG-01`): Encoding and decoding words using symbol-to-letter pattern tables.
  6. `C2-06` **Grid Coordinates Treasure Hunt** (`ENG-03`): Locating buried treasure using `(Column A–E, Row 1–5)` coordinates.
  7. `C2-07` **Tally & Bar Chart Toy Store** (`ENG-06`): Converting raw tally marks into a color-coded bar chart to answer comparison questions.
  8. `C2-08` **Rule-Following Robot vs. Thinking Human** (`ENG-04`): Testing what happens when a strict rule-based robot encounters an unexpected obstacle.

### 5.3 Preparatory / Junior: Classes 3 – 5 (CBSE CT & AI Aligned — 50 Hours/Year Framework)
Mapped directly to the [CBSE Classes 3–8 CT & AI Curriculum](https://cbseacademic.nic.in/web_material/CurriculumMain27/CTAI_Pri_2026-27.pdf) where Computational Thinking is integrated with pattern logic, structured algorithms, data organization, and visual block coding.

* **Class 3 Focus (8 Interactive Lessons & Simulators):**
  1. `C3-01` **Algorithms in Daily Life & Flowcharts** (`ENG-04`): Building start-to-end visual flowcharts with Start/Action/End nodes.
  2. `C3-02` **Pattern Abstraction: Hiding Unnecessary Details** (`ENG-01`): Identifying core essential features of objects to create simplified icons/models.
  3. `C3-03` **RoboGrid Maze Navigator & Obstacle Avoidance** (`ENG-03`): Navigating 6×6 mazes with multiple paths and calculating shortest path cost.
  4. `C3-04` **Debugging Lab: Fixing Broken Algorithms** (`ENG-03`): Stepping line-by-line through broken path programs to isolate logical bugs.
  5. `C3-05` **Intro to Block Coding: Events & Motion** (`ENG-05`): Triggering sprite movement and dialogue using `When Green Flag Clicked` and `Move X Steps`.
  6. `C3-06` **Loop Art & Geometric Spirographs** (`ENG-05`): Using `Repeat N` and `Turn Degrees` blocks to draw squares, stars, and snowflakes.
  7. `C3-07` **Data Organization: Sorting & Filtering Tables** (`ENG-06`): Organizing a messy school library table by genre, page count, and rating.
  8. `C3-08` **Smart Helpers: Voice Assistants & Pattern Recognition** (`ENG-07`): Simulating how a voice assistant matches spoken keywords to intent buckets.
* **Class 4 Focus (8 Interactive Lessons & Simulators):**
  1. `C4-01` **Decision Diamond Lab (`IF / ELSE` Flowcharts)** (`ENG-04`): Designing branching sorting machines with two-way conditional diamonds.
  2. `C4-02` **Nested Loops: Grid Painter Simulator** (`ENG-05`): Using an outer row loop and inner column loop to tile a mosaic floor.
  3. `C4-03` **Variables & Scoreboard Counter** (`ENG-05`): Creating and modifying `score`, `lives`, and `timer` variables in an interactive catch game.
  4. `C4-04` **Coordinates & Cartesian Stage (`X, Y`)** (`ENG-05`): Positioning sprites across all four quadrants of a `(-200..200)` coordinate stage.
  5. `C4-05` **Binary Switchboard: How Computers Store Numbers** (`ENG-04`): Flipping `16-8-4-2-1` binary lightbulbs to represent decimal numbers and pixel art.
  6. `C4-06` **Sensor-Driven Maze Robot** (`ENG-03`): Programming an autonomous rover using `While Not At Goal` and `If Wall Ahead Turn Right`.
  7. `C4-07` **Decision Trees: The 20-Questions Animal Guesser** (`ENG-07`): Building and traversing a yes/no feature tree (Has wings? Lives in water?) to classify animals.
  8. `C4-08` **Digital Footprint & Safe Online Choices** (`ENG-10`): Interactive scenario simulator testing password strength, phishing traps, and privacy settings.
* **Class 5 Focus (8 Interactive Lessons & Simulators):**
  1. `C5-01` **Boolean Logic Gates (`AND`, `OR`, `NOT`)** (`ENG-04`): Wiring security alarm circuits that trigger only when specific sensor combinations are active.
  2. `C5-02` **Sorting Algorithms Race (Bubble vs. Selection Sort)** (`ENG-06`): Stepping through card-sorting algorithms and comparing swap counts.
  3. `C5-03` **Search Detective: Linear vs. Binary Search** (`ENG-06`): Finding a hidden number in 100 sorted lockers in under 7 guesses using binary halving.
  4. `C5-04` **Event Broadcasting & Multi-Sprite Coordination** (`ENG-05`): Synchronizing two sprites using `Broadcast [Message]` and `When I Receive`.
  5. `C5-05` **Automation vs. Artificial Intelligence** (`ENG-07`): Comparing a fixed-timer traffic light (automation) against an adaptive camera-based traffic controller (AI).
  6. `C5-06` **How Machines Learn from Examples (Supervised Learning Intro)** (`ENG-07`): Feeding labeled healthy vs. ripened leaf images into a virtual classifier.
  7. `C5-07` **Smart Home Sensor Automation Lab** (`ENG-10`): Connecting light, temperature, and motion sensors to automated fans and solar blinds.
  8. `C5-08` **Testing & Edge Cases: Breaking the System Safely** (`ENG-07`): Stress-testing a sorting algorithm with boundary inputs and unexpected shapes.

### 5.4 Middle School: Classes 6 – 8 (CBSE CT & AI Aligned — 100 Hours/Year Framework)
Mapped directly to the official [CBSE Class 6](https://cbseacademic.nic.in/web_material/CurriculumMain27/CTAI_Pri6SH_2026-27.pdf), [Class 7](https://cbseacademic.nic.in/web_material/CurriculumMain27/CTAI_Pri7SH_2026-27.pdf), and [Class 8](https://cbseacademic.nic.in/web_material/CurriculumMain27/CTAI_Pri8SH_2026-27.pdf) Student Handbooks and [Facilitator Handbooks](https://cbseacademic.nic.in/web_material/Curriculum26/publication/middle/AI_Facilitators_Handbook_VIII.pdf).

* **Class 6 Focus — Early AI Literacy, Data Concepts & Pattern Decisions (8 Interactive Lessons):**
  1. `C6-01` **What is AI? Intelligence vs. Rule-Based Automation** (`ENG-07`): Interactive comparison testing rule scripts vs. adaptive pattern models across changing environments.
  2. `C6-02` **The Three Domains of AI: Data, Computer Vision & NLP** (`ENG-07`): Tri-domain interactive sandbox matching real-world problems to the correct AI domain.
  3. `C6-03` **Structured vs. Unstructured Data Curation Lab** (`ENG-06`): Cleaning missing values, duplicates, and outliers in a school weather dataset.
  4. `C6-04` **Feature Extraction: How Computers See Shapes & Colors** (`ENG-09`): Converting visual objects into numerical feature vectors `(roundness, redness, size)`.
  5. `C6-05` **Pattern Recognition & K-Nearest Neighbors (KNN) Visualized** (`ENG-06`): Plotting mystery fruits on a 2D feature scatter plot (Sweetness vs. Crunchiness) and adjusting `K` neighbors.
  6. `C6-06` **How Computers See Images: The Pixel Matrix** (`ENG-09`): Zooming into an image to manipulate `0–255` grayscale and RGB pixel matrices.
  7. `C6-07` **Natural Language Processing: Tokenization & Sentiment Analyzer** (`ENG-07`): Splitting sentences into word tokens, removing stop-words, and scoring positive/negative sentiment.
  8. `C6-08` **AI Ethics Part 1: Fairness, Privacy & Digital Responsibility** (`ENG-10`): Auditing a smart school-bus routing and facial-check system for privacy and fairness.
* **Class 7 Focus — AI Domains, Classification/Regression/Clustering, Vision & Bias (8 Interactive Lessons):**
  1. `C7-01` **Classification vs. Regression vs. Clustering Workbench** (`ENG-06`): Switching between discrete boundary classification, continuous trendline regression, and unsupervised K-means clustering.
  2. `C7-02` **Training & Testing Split: Why Overfitting Happens** (`ENG-07`): Adjusting train/test ratios (`80/20` vs `100/0`) and observing model failure on unseen test samples.
  3. `C7-03` **Computer Vision Lab: Convolutional Edge & Feature Filters** (`ENG-09`): Sliding a `3×3` vertical/horizontal edge kernel across a pixel matrix to generate feature maps.
  4. `C7-04` **NLP Chatbot Intent & Entity Architecture** (`ENG-07`): Designing a school helpdesk chatbot with intent buckets, confidence thresholds, and fallback responses.
  5. `C7-05` **Data Visualization & Correlation Explorer** (`ENG-06`): Analyzing multi-variable environmental datasets (rainfall, AQI, crop yield) to spot positive/negative correlations.
  6. `C7-06` **Dataset Bias & Algorithmic Auditing Lab** (`ENG-07`): Training a medical/admission classifier on skewed data, inspecting the Confusion Matrix, and rebalancing the dataset.
  7. `C7-07` **Inside a Single Neuron: Weights, Bias & Activation** (`ENG-08`): Tuning input weights (`w1, w2, w3`) and threshold bias (`b`) to build a decision neuron for "Should We Hold Sports Day Outdoors?".
  8. `C7-08` **Smart Agriculture & IoT Sensor Fusion** (`ENG-10`): Wiring soil moisture, DHT temperature, and rain prediction models to automate drip irrigation.
* **Class 8 Focus — The Full AI Project Cycle, Neural Networks & SDG Impact (8 Interactive Lessons):**
  1. `C8-01` **AI Project Cycle Stage 1: Problem Scoping & 4Ws Canvas** (`ENG-10`): Interactive **Who, What, Where, Why** problem-statement builder aligned to UN Sustainable Development Goals (SDGs).
  2. `C8-02` **AI Project Cycle Stage 2: Data Acquisition & Reliability Audit** (`ENG-06`): Designing sensor/survey data pipelines and validating sample size, noise, and consent.
  3. `C8-03` **AI Project Cycle Stage 3: Data Exploration & Feature Engineering** (`ENG-06`): Normalizing features, handling skewed distributions, and selecting high-signal predictors.
  4. `C8-04` **AI Project Cycle Stage 4: Multi-Layer Neural Network Simulator** (`ENG-08`): Configuring hidden layers, learning rate, and epochs to classify complex non-linear patterns.
  5. `C8-05` **AI Project Cycle Stage 5: Model Evaluation (Precision, Recall & F1)** (`ENG-07`): Interactive Confusion Matrix calculator showing why 99% accuracy can still be dangerous when False Negatives are costly.
  6. `C8-06` **No-Code ML Studio (Teachable Machine Offline Sandbox)** (`ENG-07`): Training a live 3-class webcam or sample-image classifier right inside the browser and exporting rules.
  7. `C8-07` **Smart City & Disaster Early-Warning IoT Architecture** (`ENG-10`): Designing a flood/air-quality sensor network with edge AI anomaly detection and emergency alerts.
  8. `C8-08` **AI Ethics, Deepfake Detection & Human-in-the-Loop Governance** (`ENG-10`): Investigating synthetic media artifacts, algorithmic accountability, and designing human-oversight guardrails.

## 6. Curated External Platforms & "No-Rerouting" Activity Guides

Every external tool card in the platform (`#external`) renders a complete **In-Platform Classroom Guide** before offering dual launch buttons (Offline Windows Start Menu path + Teacher-Gated Web Link):

| Platform | Target Grades | Official Source & Offline Package | Local Windows Launch Path |
| :--- | :--- | :--- | :--- |
| **[Scratch 3.0 Desktop](https://scratch.mit.edu/download)** | Classes 3 – 8 | MIT Scratch Offline Editor (`.exe` installer bundled in `installers/`) | `Start Menu ➔ Scratch 3` or `C:\Program Files\Scratch 3\Scratch 3.exe` |
| **[GCompris Educational Suite](https://www.gcompris.net/downloads-en.html)** | LKG – Class 4 | KDE GCompris 64-bit Offline Windows Installer (`.exe` / `.msi`) | `Start Menu ➔ GCompris Educational Game` |
| **[Blockly Games Offline](https://github.com/google/blockly-games/wiki/offline)** | Classes 2 – 6 | Google Open-Source Offline HTML Bundle (pre-extracted in `vendor/blockly-games/`) | Opens `vendor/blockly-games/index.html` 100% offline inside the portal |
| **[Google Teachable Machine](https://teachablemachine.withgoogle.com/)** | Classes 5 – 8 | Live Web Studio (`teachablemachine.withgoogle.com/train`) + Built-in Offline Vision Sandbox fallback | Teacher-gated isolated tab (`target="_blank" rel="noopener noreferrer"`) |
| **[Code.org Hour of AI](https://code.org/en-US/hour-of-ai)** | Classes 1 – 8 | Guided AI & CS Tutorials + Unplugged Offline Activity Sheets | Teacher-gated isolated tab + printable/on-screen unplugged mode |
| **[PhET Interactive Simulations](https://phet.colorado.edu/en/offline-access)** | Classes 3 – 8 | University of Colorado Boulder HTML5 Logic & Circuit Sims | Local HTML5 sims or Teacher-gated isolated tab |

## 7. Embedded Video Tutorials Hub (`#videos`)

* **Privacy-Enhanced On-Demand Player:** Cards never load external iframes on initial page render (preventing slow loads or black error boxes when offline). Each card displays an illustrated SVG thumbnail, key learning bullets, an **Offline Classroom Demonstration Alternative**, and two explicit triggers:
  * `▶️ Load In-Platform Player` (mounts `https://www.youtube-nocookie.com/embed/:videoId?rel=0&modestbranding=1` only after confirming network reachability or user click).
  * `📂 Play Local MP4 Video` (loads local `.mp4` files from `DELIVERY/Experimind_AI_Learning_Lab/media/videos/` if bundled on the USB drive, guaranteeing 100% offline playback).

## 8. AI Vision Lab (`#vision/:grade`)

* **Dual-Mode Architecture (Webcam + Camera-Free Simulation Fallback):**
  * **Live Webcam Mode:** Uses standard browser `navigator.mediaDevices.getUserMedia({ video: true })` ONLY after the student clicks the explicit **`📷 Start Camera`** consent button. A persistent red **`⏹️ Stop Camera & Release Hardware`** button immediately stops all media tracks (`stream.getTracks().forEach(t => t.stop())`).
  * **Camera-Free Simulation Fallback:** Because many primary school desktop PCs lack webcams, every Vision Lab experiment includes a **`🎮 Virtual Camera Simulator Mode`** with draggable virtual hands, colored cards, faces, and motion targets so 100% of students can complete the lab even without a physical webcam.
* **4 Vision Modes Across Grade Tiers:**
  1. **Motion Bubble Popper & Magic Mirror (LKG – Class 1):** Frame-differencing pixel motion detector where waving hands pops virtual bubbles on screen.
  2. **Color & Object Classifier Beacon (Classes 2 – 4):** Real-time HSV/RGB region tracker that identifies red/green/blue paddles held up to the camera to steer a rover.
  3. **Gesture & Pose Command Controller (Classes 5 – 6):** Left/Right/Up/Stop zone gesture detector that controls an on-screen sorting crane.
  4. **Live 3-Class Teachable Vision Trainer (Classes 7 – 8):** Captures live feature histograms for Class A, Class B, and Class C in volatile RAM, runs real-time cosine/Euclidean nearest-centroid inference, and displays live confidence bars.

## 9. Assessment Engine, Session Stars & Teacher Mode (Restored Section 9)

### 9.1 Interactive Check-Your-Understanding Quizzes
* Every lesson (`#lesson/:id`) includes 3 age-calibrated interactive assessment questions at the bottom of the laboratory sheet:
  * **LKG – Class 2:** Visual 2-to-3 option picture cards with instant encouraging visual feedback and zero penalty for retrying.
  * **Classes 3 – 8:** Scenario-based 4-option multiple-choice and algorithm-output prediction questions with detailed `💡 Why this works` explanations.

### 9.2 Volatile `sessionStars` Progress Loop
* Students earn up to **3 Stars per lesson** (`⭐ Read & Explore`, `⭐⭐ Simulator Challenge Completed`, `⭐⭐⭐ Quiz Mastered`).
* Stars are held strictly in volatile memory (`sessionStars`) and displayed in the header badge (`⭐ 12 Stars Earned Today`) with a printable/viewable on-screen **Session Achievement Certificate** that never stores personal data on disk.

### 9.3 Teacher Mode & Classroom Facilitator Drawer
* Toggling **`👩‍🏫 Teacher Mode`** in the top navigation bar (unlocked via a simple 3-second hold or configurable classroom PIN `2026`) reveals:
  * Instant answer keys and `💡 Reveal Key Insight / Discussion Guide` boxes across all 80 lessons.
  * Lesson duration pacing guide (40-minute single period vs. 80-minute double period).
  * One-click launcher verification status for external tools and local video files.

## 10. Technical Architecture, Security & Portable Offline Delivery

### 10.1 Recommended Zero-Admin Portable Stack
To run reliably on Windows 10/11 school desktops (4 GB RAM) from a USB stick or copied folder **without requiring Node.js installation, Python installation, or Administrator privileges**, and without hitting `file://` CORS or `getUserMedia` security blocks in modern browsers:

```
DELIVERY/Experimind_AI_Learning_Lab/
├── Launch_Experimind_Lab.bat         # One-click Windows launcher (starts local loopback server + opens browser in App Mode)
├── Verify_Lab_Readiness.ps1          # Automated deployment self-test & checksum verifier
├── bin/
│   └── caddy_or_minihttpd.exe        # Optional tiny zero-install portable static server (or PowerShell HttpListener fallback)
├── app/
│   ├── index.html                    # Main application entry point (works via http://127.0.0.1:8080 AND direct file:// fallback)
│   ├── assets/
│   │   ├── logo/Experimind_Labs_Official_Logo.png
│   │   ├── icons/                    # Custom SVG educational icon library (zero external CDN font dependencies)
│   │   └── media/videos/             # Optional local MP4 tutorial videos for 100% offline playback
│   ├── css/
│   │   └── main.css                  # Fluid 1800px responsive design system, CSS variables, age-band themes
│   ├── js/
│   │   ├── app.js                    # Hash router (#home, #grade/:g, #lesson/:id, #game/:id, #vision/:g, #external, #videos)
│   │   ├── config/brand.js           # Centralized Experimind Labs branding & constants
│   │   ├── data/curriculum80.js      # Complete 80-lesson CBSE/AI4K12 curriculum, challenges, and quizzes
│   │   ├── data/externalTools.js     # Curated external tools & "No-Rerouting" classroom guides
│   │   ├── data/videoHub.js          # Video metadata, youtube-nocookie embeds & offline alternatives
│   │   ├── simulators/               # All 10 parameterized HTML5 Canvas/SVG interactive simulation engines
│   │   ├── vision/visionLab.js       # WebRTC webcam processor + Camera-Free Virtual Simulator fallback
│   │   └── audio/soundEngine.js      # Muted-by-default Web Audio API synthesizer
│   └── vendor/
│       └── blockly-games/            # Optional pre-bundled offline Blockly Games HTML suite
└── installers/                       # Optional offline installers for lab setup (Scratch 3.0 .exe, GCompris .msi)
```

### 10.2 Why `Launch_Experimind_Lab.bat` Uses a Zero-Admin Loopback Server + Direct `file://` Compatibility
1. **Browser Security for Webcams (`getUserMedia`):** Chrome and Edge restrict webcam access (`navigator.mediaDevices.getUserMedia`) to secure origins (`https://` or `http://localhost` / `http://127.0.0.1`).
2. **Zero-Install PowerShell Loopback Server:** `Launch_Experimind_Lab.bat` uses built-in Windows PowerShell (`System.Net.HttpListener` on `http://127.0.0.1:8765`) requiring **zero installed software and zero admin rights**, and automatically opens Microsoft Edge or Google Chrome in clean `--app=http://127.0.0.1:8765` fullscreen window mode.
3. **100% `file://` Fallback:** Every script and curriculum dataset is compiled into standard browser-native JavaScript (`defer` scripts / single-bundle build) so double-clicking `app/index.html` directly from Windows Explorer still works 100% offline (automatically defaulting the Vision Lab to Virtual Camera Simulator mode if `file://` blocks the hardware webcam).

## 11. Verification Checklist for School Deployment

Before copying `DELIVERY/Experimind_AI_Learning_Lab` to school computers, run `Verify_Lab_Readiness.ps1` and confirm all 12 release gates:

| Gate # | Verification Category | Acceptance Requirement |
| :--- | :--- | :--- |
| **01** | **Brand Asset Integrity** | `Experimind_Labs_Official_Logo.png` is present and matches the official asset byte-for-byte; header and hero display *Experimind AI Learning Lab — Innovation for Education*. |
| **02** | **80-Lesson Completeness** | All 10 grades (LKG, UKG, Classes 1–8) contain exactly 8 lessons each (80 total), with zero placeholder text, zero `TODO` strings, and zero developer disclaimers. |
| **03** | **Live Simulator Mounting** | Every `#lesson/:id` route mounts an interactive HTML5 Canvas/SVG simulator directly inside the lesson view AND expands cleanly to `#game/:id` fullscreen mode. |
| **04** | **100% Offline Execution** | With Wi-Fi/Ethernet unplugged, all 80 lessons, 10 simulator engines, quizzes, sound effects, and AI Vision Lab experiments function with zero network errors or broken icons. |
| **05** | **Fluid Widescreen Layout** | Layout scales cleanly up to `1800px` width without narrow `1120px` sidebars or clipped simulator controls at `1366×768` and `1920×1080` resolutions. |
| **06** | **Child Privacy & Zero PII** | Zero text inputs asking for student name, email, or school ID; closing and reopening the browser resets `sessionStars` to `0`. |
| **07** | **Audio Safety Default** | Application boots with `🔇 Sound: Off`; toggling `🔊 Sound: On` plays gentle Web Audio chimes without external MP3 dependencies. |
| **08** | **External Tool Gatekeeper** | All 5 curated external platforms display full in-platform "How to Use & Classroom Guide" drawers, offline Start Menu paths, and Teacher Confirmation modals on outbound links. |
| **09** | **Video Hub Resilience** | Video cards render clean SVG preview banners and offline classroom activities by default; clicking `▶️ Play` mounts `youtube-nocookie.com` when online or shows a friendly offline guide when disconnected. |
| **10** | **Webcam Consent & Fallback** | Vision Lab never requests camera permissions on page load; `📷 Start Camera` triggers browser consent, `⏹️ Stop Camera` releases hardware light immediately, and `🎮 Virtual Camera Simulator` works on PCs without webcams. |
| **11** | **Low-Spec Performance** | Memory footprint stays under 250 MB RAM in Edge/Chrome on 4 GB Windows 10 PCs, with animation loops paused when tabs or modals are inactive. |
| **12** | **Zero-Admin Portability** | `Launch_Experimind_Lab.bat` launches cleanly from a standard non-admin Windows student account and from a USB drive path containing spaces. |
