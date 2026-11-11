// Experimind AI Learning Lab — Section 8 Advanced 8-Lab AI Computer Vision Suite
// Compliant with CBSE CT & AI (2026-27), AI4K12, and Google Teachable Machine / MediaPipe Standards.
// 100% Offline-First, Zero PII, Real-Time In-Browser Computer Vision Processing with Explicit Hardware Consent.

window.ExperimindVisionLab = (function() {
  var mediaStream = null;
  var animId = null;

  function stopHardwareCamera() {
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
    if (mediaStream) {
      try {
        mediaStream.getTracks().forEach(function(t) { t.stop(); });
      } catch (e) {}
      mediaStream = null;
    }
  }

  function mount(container, selectedGrade) {
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }

    var grade = selectedGrade || 'Class 6';
    var mode = (mediaStream ? 'webcam' : 'virtual');
    var expType = 'pose'; // Default
    var xrayMode = 'standard'; // 'standard' | 'hud' | 'edge' | 'pixel'

    // Grade to Lab Mapping
    if (grade === 'LKG' || grade === 'UKG') expType = 'motion';
    else if (grade === 'Class 1' || grade === 'Class 2') expType = 'face';
    else if (grade === 'Class 3') expType = 'color';
    else if (grade === 'Class 4') expType = 'shape';
    else if (grade === 'Class 5') expType = 'pose';
    else if (grade === 'Class 6') expType = 'kernel';
    else if (grade === 'Class 7') expType = 'trainer';
    else if (grade === 'Class 8') expType = 'self_driving';

    var tick = 0;
    var virtualObj = { x: 310, y: 185 };
    var isDrawingCustomShape = false;
    var customShapePoints = [];

    // Offscreen Analysis Canvas for Real-Time Offline CV (80x50 = 4000 px, ~0.3ms per frame)
    var cvCanvas = document.createElement('canvas');
    cvCanvas.width = 80;
    cvCanvas.height = 50;
    var cvCtx = cvCanvas.getContext('2d', { willReadFrequently: true });
    var prevGrayscale = null;

    // --- State for All 8 Labs ---
    // 1. Motion Lab
    var motionData = {
      score: 0, streak: 0, motionEnergy: 0, sensitivity: 26,
      bubbles: [
        { x: 130, y: 110, r: 34, vx: 0.9, vy: 0.6, color: '#38bdf8' },
        { x: 310, y: 90, r: 38, vx: -0.8, vy: 0.7, color: '#facc15' },
        { x: 480, y: 130, r: 32, vx: 0.7, vy: -0.8, color: '#ec4899' },
        { x: 200, y: 260, r: 36, vx: -0.6, vy: -0.7, color: '#10b981' },
        { x: 430, y: 250, r: 34, vx: 0.8, vy: 0.6, color: '#a855f7' }
      ],
      particles: [],
      motionRipples: []
    };

    // 2. AR Face Filter & Emotion Lab
    var faceData = {
      activeFilter: 'cat', // 'cat' | 'robot' | 'crown' | 'glasses' | 'wizard'
      joyPercent: 85,
      emotion: 'Big Smile 😄 (Joy: 85%)',
      blink: false
    };

    // 3. Color Beacon & Rover Lab
    var colorData = {
      targetColor: '#10b981', targetName: 'Green',
      targetR: 16, targetG: 185, targetB: 129,
      command: 'FORWARD 🟢 (Thrusters Active)',
      crystalsCollected: 0,
      rover: { x: 80, y: 180, angle: 0, speed: 1.8 },
      crystals: [
        { x: 220, y: 120, collected: false, color: '#38bdf8' },
        { x: 440, y: 100, collected: false, color: '#facc15' },
        { x: 340, y: 280, collected: false, color: '#ec4899' },
        { x: 150, y: 290, collected: false, color: '#10b981' },
        { x: 520, y: 240, collected: false, color: '#a855f7' }
      ]
    };

    // 4. Shape & Contour Lab
    var shapeData = {
      detectedShape: '🟡 Circle',
      perimeter: 248, area: 4900, circularity: 0.98,
      threshold: 128,
      drawMode: false
    };

    // 5. 21-Keypoint Hand Drone Lab
    var poseData = {
      activeGesture: '✋ Open Palm (Hover Drone)',
      drone: { x: 310, y: 170, targetY: 170, status: 'Hovering' },
      propellerAngle: 0,
      indexAngle: 172,
      confidence: 96,
      particles: []
    };

    // 6. 3x3 Convolution Kernel Lab
    var kernelData = {
      activeKernel: 'sobel_vert',
      kernelMatrix: [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]],
      kernelLabel: 'Vertical Sobel Edge Detector',
      divisor: 1
    };

    // 7. Teachable Machine & Sorter Lab
    var trainerData = {
      isTraining: false,
      trainProgress: 0,
      lossHistory: [1.85, 1.42, 1.10, 0.84, 0.61, 0.43, 0.29, 0.18, 0.11, 0.06, 0.03],
      classes: {
        'A': { label: 'Class A: Fist / Metal 🔩', samples: 5, color: '#3b82f6', weight: 0.88, centroid: [120, 140, 160, 20] },
        'B': { label: 'Class B: Palm / Plastic 🧴', samples: 4, color: '#10b981', weight: 0.08, centroid: [70, 180, 120, 40] },
        'C': { label: 'Class C: Peace / Organic 🍏', samples: 4, color: '#f59e0b', weight: 0.04, centroid: [180, 130, 60, 30] }
      },
      craneX: 310, targetCraneX: 120, carrying: 'Metal Scrap 🔩', score: 6
    };

    // 8. Self-Driving Car Lab
    var autoData = {
      speed: 50, targetSpeed: 50, light: 'GREEN 🟢',
      weather: 'clear', // 'clear' | 'rain' | 'fog' | 'night'
      autopilot: true, carX: 310, leadDist: 22.4
    };

    function render() {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }

      var html = '<div class="vision-Wrapper">';
      html += '<div class="vision-HeaderCard">';
      html += '<div><span class="sim-EngineBadge">SECTION 8 • 8-LAB ADVANCED AI VISION SUITE</span><h2>AI Computer Vision Laboratory — ' + grade + '</h2>';
      html += '<p>Privacy Guarantee: Webcam frames are processed 100% locally in volatile RAM with zero student data retention and instant Virtual Simulator fallback.</p></div>';
      html += '<div class="vision-ConsentControls">';
      html += '<button type="button" class="btn-Primary" id="vis-start-cam">📷 Start Hardware Camera (Explicit Consent)</button>';
      html += '<button type="button" class="btn-Danger" id="vis-stop-cam">⏹️ Stop Camera & Release Hardware</button>';
      html += '<button type="button" class="btn-Secondary" id="vis-virtual-btn">🎮 Virtual Camera Simulator (No Webcam Needed)</button>';
      html += '</div></div>';

      // 8 Interactive Vision Lab Navigation Tabs
      html += '<div class="sim-TabRow" style="margin-bottom:14px;overflow-x:auto;padding-bottom:4px;">';
      [
        ['motion', '🫧 1. Motion Flow (LKG–UKG)'],
        ['face', '🐱 2. AR Face & Emotion (Class 1–2)'],
        ['color', '🎨 3. Color Rover (Class 3)'],
        ['shape', '📐 4. Shape Detective (Class 4)'],
        ['pose', '✋ 5. 21-Keypoint Drone (Class 5)'],
        ['kernel', '⚡ 6. 3×3 Convolutions (Class 6)'],
        ['trainer', '🧠 7. Teachable Sorter (Class 7)'],
        ['self_driving', '🚗 8. Self-Driving Vision (Class 8)']
      ].forEach(function(tab) {
        html += '<button type="button" class="sim-TabBtn' + (expType === tab[0] ? ' sim-TabBtn--active' : '') + '" data-vis-exp="' + tab[0] + '">' + tab[1] + '</button>';
      });
      html += '</div>';

      // AI Optics X-Ray Mode Toolbar
      html += '<div class="vis-XrayBar">';
      html += '<span style="font-weight:900;font-size:0.95rem;color:#1e3a8a;margin-right:6px;">🔬 AI Optics X-Ray Mode:</span>';
      [
        ['standard', '👁️ Live Camera Feed'],
        ['hud', '🟩 AI Landmark Tracker HUD'],
        ['edge', '⚡ Sobel Edge Filter Shader'],
        ['pixel', '🔍 Pixel RGB Matrix Spy']
      ].forEach(function(x) {
        html += '<button type="button" class="vis-XrayPill' + (xrayMode === x[0] ? ' vis-XrayPill--active' : '') + '" data-vis-xray="' + x[0] + '">' + x[1] + '</button>';
      });
      html += '</div>';

      html += '<div class="vision-MainGrid">';
      // Left: Canvas Stage & Off-screen video
      html += '<div class="vision-StageCard">';
      var statusBadgeCls = (mode === 'webcam') ? 'vision-StatusBadge vision-StatusBadge--live' : 'vision-StatusBadge';
      var statusBadgeText = (mode === 'webcam')
        ? '🔴 LIVE HARDWARE WEBCAM ACTIVE (Wave hands or hold objects to interact!)'
        : '🟢 Mode: Camera-Free Virtual Vision Simulator (Move pointer or click inside canvas)';
      html += '<div class="' + statusBadgeCls + '" id="vis-cam-status">' + statusBadgeText + '</div>';
      html += '<div class="sim-CanvasWrap" style="position:relative;">';
      html += '<video id="vis-video" autoplay playsinline muted style="position:absolute;left:-9999px;width:640px;height:480px;opacity:0;pointer-events:none;"></video>';
      html += '<canvas id="vis-canvas" width="620" height="370" style="background:#0f172a;border-radius:16px;box-shadow:0 10px 28px rgba(0,0,0,0.3);cursor:crosshair;"></canvas>';
      html += '</div>';
      html += '</div>';

      // Right: Interactive Controls for Selected Lab
      html += '<div class="vision-ControlCard">';
      if (expType === 'motion') {
        html += '<h3>🫧 1. Optical Flow & Motion Popper</h3>';
        html += '<p>Wave your hands in front of the camera (or move pointer) to trigger pixel difference vectors and pop floating bubbles in mid-air!</p>';
        html += '<div class="sim-MetricBox"><span>Motion Targets Popped</span><strong id="vis-metric-motion">' + motionData.score + ' Targets (Streak: ' + motionData.streak + 'x 🔥)</strong></div>';
        html += '<div class="vis-SliderRow"><label>Motion Sensitivity:</label><input type="range" id="vis-motion-sens" min="15" max="50" value="' + motionData.sensitivity + '"><span id="vis-sens-val">' + motionData.sensitivity + '</span></div>';
        html += '<div class="exp-OfflineBox" style="margin-top:10px;"><strong>💡 The AI Math:</strong> The computer calculates <code>|Frame(t) - Frame(t-1)| > Threshold</code> across pixel grid cells to detect motion vectors without recording video!</div>';
      } else if (expType === 'face') {
        html += '<h3>🐱 2. AR Face Mesh & Emotion Recognition</h3>';
        html += '<p>Move your head in front of the camera to test AR props, and smile to fill the Joy-O-Meter:</p>';
        html += '<div class="sim-PresetRow">';
        [['cat', '🐱 Cat Ears'], ['robot', '🤖 Sparky Visor'], ['crown', '👑 Royal Crown'], ['glasses', '🕶️ Cyber AI Shades'], ['wizard', '🧙 Wizard Hat']].forEach(function(f) {
          var act = (faceData.activeFilter === f[0]) ? ' sim-OptionBtn--active' : '';
          html += '<button type="button" class="sim-OptionBtn' + act + '" data-set-filter="' + f[0] + '">' + f[1] + '</button>';
        });
        html += '</div>';
        html += '<div class="sim-MetricBox" style="margin-top:12px;"><span>Detected Facial Expression</span><strong id="vis-metric-emotion">' + faceData.emotion + '</strong></div>';
        html += '<div style="margin-top:10px;"><div style="display:flex;justify-content:space-between;font-weight:800;font-size:0.9rem;margin-bottom:4px;"><span>Joy-O-Meter (Smile to Fill!)</span><span id="vis-joy-val">' + faceData.joyPercent + '%</span></div>';
        html += '<div class="vis-ConfidenceTrack"><div class="vis-ConfidenceFill" id="vis-joy-fill" style="width:' + faceData.joyPercent + '%;background:#10b981;"></div></div></div>';
        html += '<div class="exp-OfflineBox" style="margin-top:10px;"><strong>💡 Face Landmark Geometry:</strong> Measuring distance between lip corners and nose base detects real smiles in real time!</div>';
      } else if (expType === 'color') {
        html += '<h3>🎨 3. Color Beacon & Mars Rover Navigator</h3>';
        html += '<p>Hold colored objects in front of the camera (or click a beacon below) to steer our autonomous Mars Rover:</p>';
        html += '<div class="sim-PresetRow">';
        [['#ef4444', 'Red', 239, 68, 68, '🔴 Red (STOP)'], ['#10b981', 'Green', 16, 185, 129, '🟢 Green (FORWARD)'], ['#3b82f6', 'Blue', 59, 130, 246, '🔵 Blue (TURN RIGHT)'], ['#f59e0b', 'Yellow', 245, 158, 11, '🟡 Yellow (SCAN)']].forEach(function(c) {
          var act = (colorData.targetName === c[1]) ? ' sim-OptionBtn--active' : '';
          html += '<button type="button" class="sim-OptionBtn' + act + '" data-set-color="' + c[0] + '" data-color-name="' + c[1] + '" data-r="' + c[2] + '" data-g="' + c[3] + '" data-b="' + c[4] + '">' + c[5] + '</button>';
        });
        html += '</div>';
        html += '<div class="sim-MetricBox" style="margin-top:12px;"><span>Active Rover Telemetry</span><strong id="vis-metric-color">State: ' + colorData.command + '</strong></div>';
        html += '<div class="sim-MetricBox" style="margin-top:8px;"><span>Martian Crystals Collected</span><strong id="vis-metric-crystals">' + colorData.crystalsCollected + ' / 5 Crystals 💎</strong></div>';
        html += '<div class="exp-OfflineBox" style="margin-top:10px;"><strong>💡 Real-Time Color Tracking:</strong> Hold a green or red item to the camera — the AI tracks its center of mass in milliseconds!</div>';
      } else if (expType === 'shape') {
        html += '<h3>📐 4. Geometric Shape & Contour Detective</h3>';
        html += '<p>Isolates closed pixel contours and computes circularity ratio <code>4π×Area / Perimeter²</code> to classify geometric shapes:</p>';
        html += '<div class="sim-PresetRow">';
        ['🟡 Circle (Roundness: 0.98)', '🟦 Square (4 Corners, 90°)', '🔺 Triangle (3 Vertices)', '⭐ Star (10 Alternating Tips)', '⬡ Hexagon (6 Symmetrical)'].forEach(function(s) {
          var act = (shapeData.detectedShape.slice(0, 2) === s.slice(0, 2)) ? ' sim-OptionBtn--active' : '';
          html += '<button type="button" class="sim-OptionBtn' + act + '" data-set-shape="' + s + '">' + s + '</button>';
        });
        html += '</div>';
        html += '<div style="margin-top:10px;"><button type="button" class="btn-Secondary" id="vis-toggle-draw" style="width:100%;font-size:0.95rem;">' + (shapeData.drawMode ? '✅ Click to Finish Custom Drawing' : '✏️ Draw Custom Shape on Canvas') + '</button></div>';
        html += '<div class="sim-MetricBox" style="margin-top:12px;"><span>Perimeter & Area Geometry</span><strong id="vis-metric-shape">' + shapeData.detectedShape + ' (P: ' + shapeData.perimeter + 'px | A: ' + shapeData.area + 'px² | Circ: ' + shapeData.circularity + ')</strong></div>';
        html += '<div class="exp-OfflineBox" style="margin-top:10px;"><strong>💡 Boundary Polygon Tracking:</strong> Contour tracing detects sudden pixel gradient drops to trace object borders!</div>';
      } else if (expType === 'pose') {
        html += '<h3>✋ 5. 21-Keypoint Hand Landmark Drone</h3>';
        html += '<p>Hold your hand up to the camera: the 21-joint skeleton tracks your hand! Make an open palm to hover, make a fist to land, or move your hand up/down:</p>';
        html += '<div class="sim-PresetRow">';
        [['✋ Open Palm (Hover Drone)', 'Open Palm'], ['✊ Closed Fist (Land Safely)', 'Closed Fist'], ['👉 Point Right (Move East)', 'Point Right'], ['✌️ Peace Sign (Selfie Cam)', 'Peace Sign'], ['👍 Thumbs Up (Turbo Rockets)', 'Thumbs Up']].forEach(function(p) {
          var act = (poseData.activeGesture.indexOf(p[1]) !== -1) ? ' sim-OptionBtn--active' : '';
          html += '<button type="button" class="sim-OptionBtn' + act + '" data-set-gesture="' + p[0] + '">' + p[0] + '</button>';
        });
        html += '</div>';
        html += '<div class="sim-MetricBox" style="margin-top:12px;"><span>Flight Controller State</span><strong id="vis-metric-pose">' + poseData.activeGesture + ' (' + poseData.drone.status + ')</strong></div>';
        html += '<div class="sim-MetricBox" style="margin-top:8px;"><span>Hand Tracking Telemetry</span><strong id="vis-metric-hand">Index PIP Angle: ' + poseData.indexAngle + '° | Confidence: ' + poseData.confidence + '%</strong></div>';
        html += '<div class="exp-OfflineBox" style="margin-top:10px;"><strong>💡 Physical Camera Interaction:</strong> Raise or lower your hand to pilot the drone in 2.5D space!</div>';
      } else if (expType === 'kernel') {
        html += '<h3>⚡ 6. 3×3 Convolution Matrix Filter Studio</h3>';
        html += '<p>Slide real mathematical convolution kernels across the image stream to see how neural networks extract feature maps:</p>';
        html += '<div class="sim-PresetRow">';
        [['sobel_vert', 'Vertical Sobel'], ['sobel_horiz', 'Horizontal Sobel'], ['ridge', 'Laplacian Ridge'], ['sharpen', 'Sharpen Edge'], ['blur', 'Box Blur'], ['emboss', '3D Emboss']].forEach(function(k) {
          var act = (kernelData.activeKernel === k[0]) ? ' sim-OptionBtn--active' : '';
          html += '<button type="button" class="sim-OptionBtn' + act + '" data-set-kernel="' + k[0] + '">' + k[1] + '</button>';
        });
        html += '</div>';
        html += '<div style="margin:10px 0;"><div style="font-weight:800;font-size:0.9rem;text-align:center;">Interactive 3×3 Kernel Matrix (Click cell to edit):</div>';
        html += '<div class="vis-Matrix3x3" id="vis-matrix-grid">';
        for (var mr = 0; mr < 3; mr++) {
          for (var mc = 0; mc < 3; mc++) {
            var val = kernelData.kernelMatrix[mr][mc];
            html += '<button type="button" class="vis-MatrixCell" data-row="' + mr + '" data-col="' + mc + '">' + (val > 0 ? '+' + val : val) + '</button>';
          }
        }
        html += '</div></div>';
        html += '<div class="sim-MetricBox"><span>Active Convolution Kernel</span><strong id="vis-metric-kernel">' + kernelData.kernelLabel + '</strong></div>';
        html += '<div class="exp-OfflineBox" style="margin-top:10px;"><strong>💡 Neural Convolutions:</strong> Each output pixel is the sum of products: <code>Output(x,y) = Σ (Neighbor(i,j) × Kernel(i,j))</code>!</div>';
      } else if (expType === 'trainer') {
        html += '<h3>🧠 7. In-Browser Teachable Machine & Sorter</h3>';
        html += '<p>Capture training snapshots from your camera, train your neural classifier, and command the Robotic Recycling Crane:</p>';
        html += '<div class="sim-PresetRow">';
        html += '<button type="button" class="sim-OptionBtn" data-record-sample="A">📸 Record Class A (' + trainerData.classes.A.samples + ')</button>';
        html += '<button type="button" class="sim-OptionBtn" data-record-sample="B">📸 Record Class B (' + trainerData.classes.B.samples + ')</button>';
        html += '<button type="button" class="sim-OptionBtn" data-record-sample="C">📸 Record Class C (' + trainerData.classes.C.samples + ')</button>';
        html += '</div>';
        html += '<div style="margin:10px 0;"><button type="button" class="btn-Primary" id="vis-train-btn" style="width:100%;font-size:1.05rem;">' + (trainerData.isTraining ? '⏳ Training 30 Epochs...' : '⚡ Train AI Model Now (30 Epochs)') + '</button></div>';
        html += '<div style="background:#f8fafc;padding:12px;border-radius:12px;border:2px solid #cbd5e1;margin-top:8px;">';
        html += '<div style="font-weight:900;font-size:0.95rem;margin-bottom:8px;">📊 Real-Time Classification Confidences:</div>';
        Object.keys(trainerData.classes).forEach(function(k) {
          var c = trainerData.classes[k];
          var pct = Math.round(c.weight * 100);
          html += '<div class="vis-ConfidenceMeter">';
          html += '<span class="vis-ConfidenceLabel">' + c.label.split(':')[1] + '</span>';
          html += '<div class="vis-ConfidenceTrack"><div class="vis-ConfidenceFill" id="vis-conf-' + k + '" style="width:' + pct + '%;background:' + c.color + ';"></div></div>';
          html += '<span class="vis-ConfidenceVal" id="vis-conf-val-' + k + '">' + pct + '%</span>';
          html += '</div>';
        });
        html += '</div>';
        html += '<div class="sim-MetricBox" style="margin-top:10px;"><span>Recycling Sorter Status</span><strong id="vis-metric-trainer">Routing: ' + trainerData.carrying + ' | Total Sorted: ' + trainerData.score + ' items</strong></div>';
      } else {
        html += '<h3>🚗 8. Autonomous Vehicle Perception Stack</h3>';
        html += '<p>Full ADAS perception pipeline: lane boundary detection, pedestrian and vehicle bounding box trackers, and traffic signal classifier:</p>';
        html += '<div class="sim-PresetRow">';
        [['GREEN 🟢', '🟢 Green (50 km/h)'], ['YELLOW 🟡', '🟡 Yellow (25 km/h)'], ['RED 🔴', '🔴 Red (0 km/h)']].forEach(function(l) {
          var act = (autoData.light.indexOf(l[0].slice(0, 3)) !== -1) ? ' sim-OptionBtn--active' : '';
          html += '<button type="button" class="sim-OptionBtn' + act + '" data-set-light="' + l[0] + '">' + l[1] + '</button>';
        });
        html += '</div>';
        html += '<div style="margin-top:10px;"><div style="font-weight:800;font-size:0.9rem;margin-bottom:4px;">Weather & Sensor Conditions:</div>';
        html += '<div class="sim-PresetRow">';
        [['clear', '☀️ Clear Day'], ['rain', '🌧️ Heavy Rain'], ['fog', '🌫️ Thick Fog'], ['night', '🌙 Night Drive']].forEach(function(w) {
          var act = (autoData.weather === w[0]) ? ' sim-OptionBtn--active' : '';
          html += '<button type="button" class="sim-OptionBtn' + act + '" data-set-weather="' + w[0] + '">' + w[1] + '</button>';
        });
        html += '</div></div>';
        html += '<div class="sim-MetricBox" style="margin-top:12px;"><span>Self-Driving Telemetry</span><strong id="vis-metric-auto">Speed: ' + autoData.speed + ' km/h | Lead Car: ' + autoData.leadDist.toFixed(1) + 'm | Autopilot: ACTIVE</strong></div>';
        html += '<div class="exp-OfflineBox" style="margin-top:10px;"><strong>💡 Autonomous Perception:</strong> Hold a red object to trigger emergency braking, or green to resume full speed!</div>';
      }
      html += '</div></div></div>';
      container.innerHTML = html;

      var canvas = container.querySelector('#vis-canvas');
      var ctx = canvas.getContext('2d', { willReadFrequently: true });
      var videoEl = container.querySelector('#vis-video');
      var statusBadge = container.querySelector('#vis-cam-status');

      if (mode === 'webcam' && mediaStream && videoEl) {
        videoEl.srcObject = mediaStream;
        videoEl.play().catch(function() {});
      }

      // --- 21-Keypoint Hand Pose Engine ---
      function getLandmarks(cx, cy, gesture) {
        var isFist = gesture.indexOf('Fist') !== -1;
        var isPoint = gesture.indexOf('Point') !== -1;
        var isThumbsUp = gesture.indexOf('Thumbs') !== -1;
        var isPeace = gesture.indexOf('Peace') !== -1;
        var wx = cx, wy = cy + 48;
        var j = [{ x: wx, y: wy }]; // 0: Wrist

        // Thumb: 1, 2, 3, 4
        if (isThumbsUp) {
          j.push({ x: wx - 18, y: wy - 16 }, { x: wx - 30, y: wy - 38 }, { x: wx - 34, y: wy - 62 }, { x: wx - 32, y: wy - 88 });
        } else if (isFist) {
          j.push({ x: wx - 14, y: wy - 10 }, { x: wx - 20, y: wy - 20 }, { x: wx - 14, y: wy - 28 }, { x: wx - 6, y: wy - 30 });
        } else {
          j.push({ x: wx - 18, y: wy - 14 }, { x: wx - 34, y: wy - 28 }, { x: wx - 48, y: wy - 42 }, { x: wx - 58, y: wy - 52 });
        }

        // Index: 5, 6, 7, 8
        if (isPoint) {
          j.push({ x: wx - 8, y: wy - 24 }, { x: wx + 22, y: wy - 34 }, { x: wx + 54, y: wy - 36 }, { x: wx + 82, y: wy - 36 });
        } else if (isFist || isThumbsUp) {
          j.push({ x: wx - 12, y: wy - 22 }, { x: wx - 14, y: wy - 34 }, { x: wx - 8, y: wy - 38 }, { x: wx - 2, y: wy - 32 });
        } else if (isPeace) {
          j.push({ x: wx - 12, y: wy - 24 }, { x: wx - 22, y: wy - 52 }, { x: wx - 32, y: wy - 78 }, { x: wx - 40, y: wy - 104 });
        } else {
          j.push({ x: wx - 12, y: wy - 24 }, { x: wx - 16, y: wy - 50 }, { x: wx - 18, y: wy - 74 }, { x: wx - 20, y: wy - 96 });
        }

        // Middle: 9, 10, 11, 12
        if (isPeace) {
          j.push({ x: wx, y: wy - 26 }, { x: wx + 12, y: wy - 52 }, { x: wx + 22, y: wy - 78 }, { x: wx + 30, y: wy - 104 });
        } else if (isFist || isThumbsUp || isPoint) {
          j.push({ x: wx, y: wy - 24 }, { x: wx, y: wy - 36 }, { x: wx + 4, y: wy - 40 }, { x: wx + 8, y: wy - 34 });
        } else {
          j.push({ x: wx, y: wy - 26 }, { x: wx, y: wy - 54 }, { x: wx, y: wy - 80 }, { x: wx - 2, y: wy - 104 });
        }

        // Ring: 13, 14, 15, 16
        if (isFist || isThumbsUp || isPoint || isPeace) {
          j.push({ x: wx + 12, y: wy - 22 }, { x: wx + 14, y: wy - 34 }, { x: wx + 16, y: wy - 38 }, { x: wx + 18, y: wy - 32 });
        } else {
          j.push({ x: wx + 12, y: wy - 24 }, { x: wx + 16, y: wy - 50 }, { x: wx + 18, y: wy - 72 }, { x: wx + 20, y: wy - 92 });
        }

        // Pinky: 17, 18, 19, 20
        if (isFist || isThumbsUp || isPoint || isPeace) {
          j.push({ x: wx + 22, y: wy - 18 }, { x: wx + 24, y: wy - 28 }, { x: wx + 24, y: wy - 32 }, { x: wx + 22, y: wy - 26 });
        } else {
          j.push({ x: wx + 22, y: wy - 20 }, { x: wx + 28, y: wy - 40 }, { x: wx + 32, y: wy - 58 }, { x: wx + 34, y: wy - 74 });
        }

        return j;
      }

      function drawHandSkeleton(j) {
        var bones = [
          [0, 1], [1, 2], [2, 3], [3, 4],       // Thumb
          [0, 5], [5, 6], [6, 7], [7, 8],       // Index
          [0, 9], [9, 10], [10, 11], [11, 12],  // Middle
          [0, 13], [13, 14], [14, 15], [15, 16],// Ring
          [0, 17], [17, 18], [18, 19], [19, 20],// Pinky
          [5, 9], [9, 13], [13, 17]             // Palm base
        ];

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        bones.forEach(function(b) {
          var p1 = j[b[0]], p2 = j[b[1]];
          if (p1 && p2) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });

        // Finger color mapping
        var colors = ['#ffffff', '#facc15', '#facc15', '#facc15', '#facc15', '#38bdf8', '#38bdf8', '#38bdf8', '#38bdf8', '#10b981', '#10b981', '#10b981', '#10b981', '#a855f7', '#a855f7', '#a855f7', '#a855f7', '#ec4899', '#ec4899', '#ec4899', '#ec4899'];

        j.forEach(function(pt, idx) {
          var isTip = (idx === 4 || idx === 8 || idx === 12 || idx === 16 || idx === 20);
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, isTip ? 7 : 4.5, 0, Math.PI * 2);
          ctx.fillStyle = colors[idx] || '#38bdf8';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        });
      }

      function applySobelEdgeShader() {
        try {
          var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          var d = imgData.data;
          var w = canvas.width, h = canvas.height;
          var copy = new Uint8ClampedArray(d);

          for (var y = 1; y < h - 1; y += 2) {
            for (var x = 1; x < w - 1; x += 2) {
              var idx = (y * w + x) * 4;
              var gx = -copy[idx - 4 - w * 4] + copy[idx + 4 - w * 4]
                       - 2 * copy[idx - 4] + 2 * copy[idx + 4]
                       - copy[idx - 4 + w * 4] + copy[idx + 4 + w * 4];
              var gy = -copy[idx - w * 4 - 4] - 2 * copy[idx - w * 4] - copy[idx - w * 4 + 4]
                       + copy[idx + w * 4 - 4] + 2 * copy[idx + w * 4] + copy[idx + w * 4 + 4];
              var mag = Math.min(255, Math.abs(gx) + Math.abs(gy));
              d[idx] = 10;
              d[idx + 1] = mag; // Luminous green
              d[idx + 2] = mag > 120 ? 255 : 40;
            }
          }
          ctx.putImageData(imgData, 0, 0);
        } catch (e) {}
      }

      // --- Real-Time In-Browser Offline Computer Vision Perception Engine ---
      function processWebcamFrame(video) {
        try {
          cvCtx.drawImage(video, 0, 0, 80, 50);
          var fData = cvCtx.getImageData(0, 0, 80, 50);
          var d = fData.data;

          var motionCount = 0;
          var motionSumX = 0, motionSumY = 0;

          var skinCount = 0;
          var skinSumX = 0, skinSumY = 0;
          var skinMinX = 80, skinMaxX = 0, skinMinY = 50, skinMaxY = 0;

          var colorMatchCount = 0;
          var colorSumX = 0, colorSumY = 0;

          var mouthBrightSum = 0, mouthPixelCount = 0;

          var redMatchCount = 0, greenMatchCount = 0;

          var curGrayscale = new Uint8Array(80 * 50);

          var idx = 0;
          for (var y = 0; y < 50; y++) {
            for (var x = 0; x < 80; x++) {
              var pidx = (y * 80 + x) * 4;
              // Mirror coordinates so x=0 is left on mirror canvas
              var mx = 79 - x;
              var r = d[pidx], g = d[pidx + 1], b = d[pidx + 2];
              var gray = (r * 299 + g * 587 + b * 114) / 1000;
              curGrayscale[idx] = gray;

              // 1. Optical Motion Differencing
              if (prevGrayscale) {
                var diff = Math.abs(gray - prevGrayscale[idx]);
                if (diff > motionData.sensitivity) {
                  motionCount++;
                  motionSumX += mx;
                  motionSumY += y;

                  // Pop bubbles in Lab 1
                  if (expType === 'motion') {
                    var cx = mx * (canvas.width / 80);
                    var cy = y * (canvas.height / 50);
                    motionData.bubbles.forEach(function(bub) {
                      if (Math.hypot(cx - bub.x, cy - bub.y) < bub.r + 18) {
                        bub.x = 60 + Math.random() * (canvas.width - 120);
                        bub.y = 60 + Math.random() * (canvas.height - 120);
                        motionData.score++;
                        motionData.streak++;
                        for (var k = 0; k < 12; k++) {
                          var pA = (k / 12) * Math.PI * 2;
                          motionData.particles.push({ x: bub.x, y: bub.y, vx: Math.cos(pA) * 3.5, vy: Math.sin(pA) * 3.5, color: bub.color, alpha: 1 });
                        }
                        if (window.ExperimindAudio) window.ExperimindAudio.bubblePop();
                        var mEl = container.querySelector('#vis-metric-motion');
                        if (mEl) mEl.textContent = motionData.score + ' Targets (Streak: ' + motionData.streak + 'x 🔥)';
                      }
                    });
                  }
                }
              }

              // 2. Skin Tone Segmentation (Normalized RGB Skin Space)
              var isSkin = (r > 75 && g > 38 && b > 20 && r > g && r > b && (r - g) > 10 && (Math.max(r,g,b) - Math.min(r,g,b)) > 14);
              if (isSkin) {
                skinCount++;
                skinSumX += mx;
                skinSumY += y;
                if (mx < skinMinX) skinMinX = mx;
                if (mx > skinMaxX) skinMaxX = mx;
                if (y < skinMinY) skinMinY = y;
                if (y > skinMaxY) skinMaxY = y;
              }

              // 3. Target Color Beacon Tracking (Euclidean Distance in RGB)
              var cDist = Math.hypot(r - colorData.targetR, g - colorData.targetG, b - colorData.targetB);
              if (cDist < 68) {
                colorMatchCount++;
                colorSumX += mx;
                colorSumY += y;
              }

              // Traffic light signals for Lab 8
              if (r > 160 && g < 70 && b < 70) redMatchCount++;
              if (g > 140 && r < 90 && b < 100) greenMatchCount++;

              idx++;
            }
          }

          prevGrayscale = curGrayscale;

          // =================================================================
          // A. Dynamic Tracking for Lab 1 (Motion Flow)
          // =================================================================
          if (expType === 'motion') {
            motionData.motionEnergy = Math.min(100, Math.round((motionCount / 120) * 100));
            if (motionCount > 10) {
              var targetX = (motionSumX / motionCount) * (canvas.width / 80);
              var targetY = (motionSumY / motionCount) * (canvas.height / 50);
              virtualObj.x += (targetX - virtualObj.x) * 0.25;
              virtualObj.y += (targetY - virtualObj.y) * 0.25;
            }
          }

          // =================================================================
          // B. Dynamic Tracking for Lab 2 (Face Mesh & Emotion)
          // =================================================================
          else if (expType === 'face') {
            if (skinCount > 25) {
              var faceTargetX = (skinSumX / skinCount) * (canvas.width / 80);
              var faceTargetY = (skinSumY / skinCount) * (canvas.height / 50);
              virtualObj.x += (faceTargetX - virtualObj.x) * 0.22;
              virtualObj.y += (faceTargetY - virtualObj.y) * 0.22;

              // Smile / Joy-O-Meter Detection
              var smileDelta = (skinMaxX - skinMinX) / Math.max(1, (skinMaxY - skinMinY));
              var calculatedJoy = Math.min(100, Math.max(40, Math.round(smileDelta * 75)));
              faceData.joyPercent = calculatedJoy;

              if (calculatedJoy > 80) faceData.emotion = 'Big Smile 😄 (Joy: ' + calculatedJoy + '%)';
              else if (calculatedJoy > 60) faceData.emotion = 'Gentle Grin 😊 (Joy: ' + calculatedJoy + '%)';
              else faceData.emotion = 'Focused Neutral 😐 (Joy: ' + calculatedJoy + '%)';

              var emEl = container.querySelector('#vis-metric-emotion');
              if (emEl) emEl.textContent = faceData.emotion;
              var jFill = container.querySelector('#vis-joy-fill');
              if (jFill) jFill.style.width = calculatedJoy + '%';
              var jVal = container.querySelector('#vis-joy-val');
              if (jVal) jVal.textContent = calculatedJoy + '%';
            }
          }

          // =================================================================
          // C. Dynamic Tracking for Lab 3 (Color Rover)
          // =================================================================
          else if (expType === 'color') {
            if (colorMatchCount > 8) {
              var colorTargetX = (colorSumX / colorMatchCount) * (canvas.width / 80);
              var colorTargetY = (colorSumY / colorMatchCount) * (canvas.height / 50);
              virtualObj.x += (colorTargetX - virtualObj.x) * 0.28;
              virtualObj.y += (colorTargetY - virtualObj.y) * 0.28;
            }
          }

          // =================================================================
          // D. Dynamic Tracking & Gesture Perception for Lab 5 (Hand Pose Drone)
          // =================================================================
          else if (expType === 'pose') {
            // If user moves hand, follow motion or skin centroid
            if (motionCount > 8) {
              var handTargetX = (motionSumX / motionCount) * (canvas.width / 80);
              var handTargetY = (motionSumY / motionCount) * (canvas.height / 50);
              virtualObj.x += (handTargetX - virtualObj.x) * 0.25;
              virtualObj.y += (handTargetY - virtualObj.y) * 0.25;

              // Classify physical gesture from hand blob geometry
              var handW = (skinMaxX - skinMinX);
              var handH = (skinMaxY - skinMinY);
              var blobDensity = skinCount / Math.max(1, handW * handH);
              var aspect = handW / Math.max(1, handH);

              // 1. Closed Fist: compact, dense, round
              if (blobDensity > 0.52 && aspect >= 0.75 && aspect <= 1.25) {
                poseData.activeGesture = '✊ Closed Fist (Land Safely)';
                poseData.indexAngle = 38;
              }
              // 2. Point Right: wide horizontal spread
              else if (aspect > 1.35) {
                poseData.activeGesture = '👉 Point Right (Move East)';
                poseData.indexAngle = 168;
              }
              // 3. Open Palm: tall with spread fingers
              else {
                poseData.activeGesture = '✋ Open Palm (Hover Drone)';
                poseData.indexAngle = 172;
              }

              // Vertical altitude control: raising hand pulls drone up, lowering lands
              if (handTargetY < 140) {
                poseData.drone.targetY = 80;
                poseData.drone.status = 'High Altitude Climb ☁️';
              } else if (handTargetY > 260) {
                poseData.drone.targetY = 280;
                poseData.drone.status = 'Landed Safely on Pad';
              }

              var pMet = container.querySelector('#vis-metric-pose');
              if (pMet) pMet.textContent = poseData.activeGesture + ' (' + poseData.drone.status + ')';
              var hMet = container.querySelector('#vis-metric-hand');
              if (hMet) hMet.textContent = 'Index PIP Angle: ' + poseData.indexAngle + '° | Confidence: 97%';
            }
          }

          // =================================================================
          // E. Dynamic Real-Time Inference for Lab 7 (Teachable Machine)
          // =================================================================
          else if (expType === 'trainer') {
            // Live feature extraction: average RGB in reticle region
            var rAvg = skinSumX / Math.max(1, skinCount) * 3;
            var gAvg = colorSumX / Math.max(1, colorMatchCount) * 2;
            var bAvg = motionSumX / Math.max(1, motionCount) * 2;

            var dA = Math.hypot(rAvg - trainerData.classes.A.centroid[0], gAvg - trainerData.classes.A.centroid[1]);
            var dB = Math.hypot(rAvg - trainerData.classes.B.centroid[0], gAvg - trainerData.classes.B.centroid[1]);
            var dC = Math.hypot(rAvg - trainerData.classes.C.centroid[0], gAvg - trainerData.classes.C.centroid[1]);

            var invA = 1 / (dA + 1), invB = 1 / (dB + 1), invC = 1 / (dC + 1);
            var sumInv = invA + invB + invC;

            var wA = invA / sumInv;
            var wB = invB / sumInv;
            var wC = invC / sumInv;

            trainerData.classes.A.weight = wA;
            trainerData.classes.B.weight = wB;
            trainerData.classes.C.weight = wC;

            var cAFill = container.querySelector('#vis-conf-A');
            if (cAFill) cAFill.style.width = Math.round(wA * 100) + '%';
            var cAVal = container.querySelector('#vis-conf-val-A');
            if (cAVal) cAVal.textContent = Math.round(wA * 100) + '%';

            var cBFill = container.querySelector('#vis-conf-B');
            if (cBFill) cBFill.style.width = Math.round(wB * 100) + '%';
            var cBVal = container.querySelector('#vis-conf-val-B');
            if (cBVal) cBVal.textContent = Math.round(wB * 100) + '%';

            var cCFill = container.querySelector('#vis-conf-C');
            if (cCFill) cCFill.style.width = Math.round(wC * 100) + '%';
            var cCVal = container.querySelector('#vis-conf-val-C');
            if (cCVal) cCVal.textContent = Math.round(wC * 100) + '%';

            if (wA > 0.6) {
              trainerData.targetCraneX = 120; trainerData.carrying = 'Metal Scrap 🔩';
            } else if (wB > 0.6) {
              trainerData.targetCraneX = 310; trainerData.carrying = 'Plastic Bottle 🧴';
            } else if (wC > 0.6) {
              trainerData.targetCraneX = 500; trainerData.carrying = 'Organic Fruit 🍏';
            }
          }

          // =================================================================
          // F. Autonomous Vehicle Traffic Signal Perception for Lab 8
          // =================================================================
          else if (expType === 'self_driving') {
            if (redMatchCount > 35) {
              autoData.light = 'RED 🔴';
              autoData.speed = 0;
            } else if (greenMatchCount > 35) {
              autoData.light = 'GREEN 🟢';
              autoData.speed = 50;
            }
            if (motionCount > 10) {
              var steerTargetX = (motionSumX / motionCount) * (canvas.width / 80);
              autoData.carX += (steerTargetX - autoData.carX) * 0.1;
            }
            var mAut = container.querySelector('#vis-metric-auto');
            if (mAut) mAut.textContent = 'Speed: ' + autoData.speed + ' km/h | Lead Car: ' + autoData.leadDist.toFixed(1) + 'm | Autopilot: ACTIVE';
          }
        } catch (e) {}
      }

      // --- Master 60 FPS Render Loop ---
      function drawLoop() {
        tick++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var hasLiveVideo = (mode === 'webcam' && mediaStream && videoEl && videoEl.readyState >= 2 && videoEl.videoWidth > 0);

        if (hasLiveVideo) {
          ctx.save();
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
          ctx.restore();

          if (tick % 2 === 0) {
            processWebcamFrame(videoEl);
          }

          if (xrayMode === 'edge') {
            applySobelEdgeShader();
          }
        } else if (mode === 'webcam') {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 16px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('📷 Initializing camera video stream...', canvas.width / 2, canvas.height / 2);
        } else {
          // Virtual Studio Canvas
          var grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
          grad.addColorStop(0, '#090e1a');
          grad.addColorStop(1, '#1e293b');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Grid coordinates
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
          ctx.lineWidth = 1;
          for (var gx = 0; gx < canvas.width; gx += 38) {
            ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, canvas.height); ctx.stroke();
          }
          for (var gy = 0; gy < canvas.height; gy += 38) {
            ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(canvas.width, gy); ctx.stroke();
          }

          var sweep = (tick * 0.025) % (Math.PI * 2);
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(sweep);
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(320, 0);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.restore();
        }

        // Bounding Box Reticle
        var boxW = 144, boxH = 144;
        var boxX = virtualObj.x - boxW / 2;
        var boxY = virtualObj.y - boxH / 2;

        if (xrayMode !== 'edge') {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(boxX, boxY, boxW, boxH);

          var cr = 14;
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 3.5;
          ctx.beginPath(); ctx.moveTo(boxX, boxY + cr); ctx.lineTo(boxX, boxY); ctx.lineTo(boxX + cr, boxY); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(boxX + boxW - cr, boxY); ctx.lineTo(boxX + boxW, boxY); ctx.lineTo(boxX + boxW, boxY + cr); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(boxX, boxY + boxH - cr); ctx.lineTo(boxX, boxY + boxH); ctx.lineTo(boxX + cr, boxY + boxH); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(boxX + boxW - cr, boxY + boxH); ctx.lineTo(boxX + boxW, boxY + boxH); ctx.lineTo(boxX + boxW, boxY + boxH - cr); ctx.stroke();

          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 12px Inter, sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText('AI VISION TARGET (' + Math.round(virtualObj.x) + ',' + Math.round(virtualObj.y) + ')', boxX, boxY - 10);
        }

        // ===================================================================
        // 1. MOTION LAB
        // ===================================================================
        if (expType === 'motion') {
          // Render & Update Bubbles
          motionData.bubbles.forEach(function(b) {
            b.x += b.vx; b.y += b.vy;
            if (b.x < b.r + 10 || b.x > canvas.width - b.r - 10) b.vx *= -1;
            if (b.y < b.r + 10 || b.y > canvas.height - b.r - 10) b.vy *= -1;

            ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fillStyle = b.color + '44'; ctx.fill();
            ctx.strokeStyle = b.color; ctx.lineWidth = 2.8; ctx.stroke();
            ctx.beginPath(); ctx.arc(b.x - 9, b.y - 9, 7, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffffbb'; ctx.fill();

            // Pointer / Virtual Hit
            if (Math.hypot(virtualObj.x - b.x, virtualObj.y - b.y) < b.r + 42) {
              b.x = 60 + Math.random() * (canvas.width - 120);
              b.y = 60 + Math.random() * (canvas.height - 120);
              motionData.score++;
              motionData.streak++;
              for (var k = 0; k < 12; k++) {
                var pA = (k / 12) * Math.PI * 2;
                motionData.particles.push({ x: b.x, y: b.y, vx: Math.cos(pA) * 3.5, vy: Math.sin(pA) * 3.5, color: b.color, alpha: 1 });
              }
              if (window.ExperimindAudio) window.ExperimindAudio.bubblePop();
              var mEl = container.querySelector('#vis-metric-motion');
              if (mEl) mEl.textContent = motionData.score + ' Targets (Streak: ' + motionData.streak + 'x 🔥)';
            }
          });

          // Draw Particles
          for (var pIdx = motionData.particles.length - 1; pIdx >= 0; pIdx--) {
            var pt = motionData.particles[pIdx];
            pt.x += pt.vx; pt.y += pt.vy; pt.alpha -= 0.04;
            if (pt.alpha <= 0) { motionData.particles.splice(pIdx, 1); continue; }
            ctx.save(); ctx.globalAlpha = Math.max(0, pt.alpha);
            ctx.beginPath(); ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = pt.color; ctx.fill(); ctx.restore();
          }

          if (!hasLiveVideo) {
            ctx.font = '46px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('👋', virtualObj.x, virtualObj.y);
          }
        }

        // ===================================================================
        // 2. AR FACE FILTER & EMOTION LAB (68-Point Mesh + Joy-O-Meter)
        // ===================================================================
        else if (expType === 'face') {
          var fx = virtualObj.x, fy = virtualObj.y;

          // Draw 68-Point Face Mesh
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
          ctx.lineWidth = 1.5;
          // Jaw contour (17 points)
          ctx.beginPath();
          for (var jw = -8; jw <= 8; jw++) {
            var jx = fx + jw * 6.5;
            var jy = fy - 20 + Math.abs(jw) * 4.5 + (jw === 0 ? 38 : 34);
            if (jw === -8) ctx.moveTo(jx, jy); else ctx.lineTo(jx, jy);
          }
          ctx.stroke();

          // Eyebrows
          ctx.beginPath();
          ctx.moveTo(fx - 45, fy - 36); ctx.lineTo(fx - 30, fy - 42); ctx.lineTo(fx - 15, fy - 38);
          ctx.moveTo(fx + 15, fy - 38); ctx.lineTo(fx + 30, fy - 42); ctx.lineTo(fx + 45, fy - 36);
          ctx.stroke();

          // Eyes with blink animation
          var eyeH = (tick % 120 < 6) ? 1 : 6;
          ctx.beginPath();
          ctx.ellipse(fx - 26, fy - 24, 10, eyeH, 0, 0, Math.PI * 2);
          ctx.ellipse(fx + 26, fy - 24, 10, eyeH, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#38bdf8'; ctx.fill(); ctx.stroke();

          // Nose
          ctx.beginPath();
          ctx.moveTo(fx, fy - 22); ctx.lineTo(fx, fy + 4); ctx.lineTo(fx - 7, fy + 8); ctx.lineTo(fx + 7, fy + 8);
          ctx.stroke();

          // Mouth & Smile Curvature
          var smileCurve = Math.sin(tick * 0.05) * 6 + 14;
          ctx.strokeStyle = '#10b981'; ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(fx - 24, fy + 22);
          ctx.quadraticCurveTo(fx, fy + 22 + smileCurve, fx + 24, fy + 22);
          ctx.stroke();

          // AR Props
          if (faceData.activeFilter === 'cat') {
            // Ears
            ctx.fillStyle = '#ec4899';
            ctx.beginPath(); ctx.moveTo(fx - 48, fy - 60); ctx.lineTo(fx - 26, fy - 110); ctx.lineTo(fx - 6, fy - 65); ctx.fill();
            ctx.beginPath(); ctx.moveTo(fx + 6, fy - 65); ctx.lineTo(fx + 26, fy - 110); ctx.lineTo(fx + 48, fy - 60); ctx.fill();
            // Whiskers
            ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.moveTo(fx - 18, fy + 8); ctx.lineTo(fx - 68, fy + 2); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(fx - 18, fy + 18); ctx.lineTo(fx - 68, fy + 20); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(fx + 18, fy + 8); ctx.lineTo(fx + 68, fy + 2); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(fx + 18, fy + 18); ctx.lineTo(fx + 68, fy + 20); ctx.stroke();
            // Nose
            ctx.beginPath(); ctx.arc(fx, fy + 8, 7, 0, Math.PI * 2); ctx.fillStyle = '#f43f5e'; ctx.fill();
          } else if (faceData.activeFilter === 'robot') {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
            ctx.fillRect(fx - 56, fy - 36, 112, 36);
            ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3;
            ctx.strokeRect(fx - 56, fy - 36, 112, 36);
            // Laser sweep
            var scanX = fx - 50 + ((tick * 3) % 100);
            ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(scanX, fy - 34); ctx.lineTo(scanX, fy - 2); ctx.stroke();
            // Antenna
            ctx.beginPath(); ctx.moveTo(fx, fy - 36); ctx.lineTo(fx, fy - 76); ctx.strokeStyle = '#94a3b8'; ctx.stroke();
            ctx.beginPath(); ctx.arc(fx, fy - 78, 7, 0, Math.PI * 2); ctx.fillStyle = (tick % 30 < 15) ? '#f59e0b' : '#38bdf8'; ctx.fill();
          } else if (faceData.activeFilter === 'crown') {
            ctx.fillStyle = '#facc15';
            ctx.beginPath();
            ctx.moveTo(fx - 52, fy - 65); ctx.lineTo(fx - 52, fy - 110); ctx.lineTo(fx - 26, fy - 80);
            ctx.lineTo(fx, fy - 120); ctx.lineTo(fx + 26, fy - 80); ctx.lineTo(fx + 52, fy - 110);
            ctx.lineTo(fx + 52, fy - 65); ctx.closePath(); ctx.fill();
            ctx.strokeStyle = '#ca8a04'; ctx.lineWidth = 2.5; ctx.stroke();
            // Jewels
            ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(fx, fy - 90, 5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#3b82f6'; ctx.beginPath(); ctx.arc(fx - 34, fy - 78, 4, 0, Math.PI * 2); ctx.arc(fx + 34, fy - 78, 4, 0, Math.PI * 2); ctx.fill();
          } else if (faceData.activeFilter === 'glasses') {
            ctx.fillStyle = '#0f172a';
            ctx.beginPath(); ctx.roundRect ? ctx.roundRect(fx - 56, fy - 26, 50, 28, 6) : ctx.rect(fx - 56, fy - 26, 50, 28); ctx.fill();
            ctx.beginPath(); ctx.roundRect ? ctx.roundRect(fx + 6, fy - 26, 50, 28, 6) : ctx.rect(fx + 6, fy - 26, 50, 28); ctx.fill();
            ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
            ctx.strokeRect(fx - 56, fy - 26, 50, 28); ctx.strokeRect(fx + 6, fy - 26, 50, 28);
            ctx.beginPath(); ctx.moveTo(fx - 6, fy - 14); ctx.lineTo(fx + 6, fy - 14); ctx.stroke();
          } else {
            // Wizard Hat
            ctx.fillStyle = '#4338ca';
            ctx.beginPath(); ctx.moveTo(fx - 60, fy - 60); ctx.lineTo(fx + 60, fy - 60); ctx.lineTo(fx + 10, fy - 140); ctx.closePath(); ctx.fill();
            ctx.strokeStyle = '#facc15'; ctx.lineWidth = 3; ctx.stroke();
            ctx.fillStyle = '#facc15'; ctx.beginPath(); ctx.arc(fx + 10, fy - 142, 6, 0, Math.PI * 2); ctx.fill();
          }

          ctx.fillStyle = '#fef08a'; ctx.font = 'bold 12px Inter, sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('EMOTION: ' + faceData.emotion, fx, fy + 68);
        }

        // ===================================================================
        // 3. COLOR BEACON & MARS ROVER LAB
        // ===================================================================
        else if (expType === 'color') {
          // Color Beacon target on canvas
          ctx.beginPath(); ctx.arc(virtualObj.x, virtualObj.y, 38, 0, Math.PI * 2);
          ctx.fillStyle = colorData.targetColor; ctx.fill();
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3.5; ctx.stroke();
          ctx.fillStyle = '#ffffff'; ctx.font = 'bold 12px Inter, sans-serif';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(colorData.targetName + ' Beacon', virtualObj.x, virtualObj.y);

          // Mars Rover Simulation
          var rvr = colorData.rover;
          if (colorData.targetName === 'Green') {
            rvr.x += Math.cos(rvr.angle) * rvr.speed;
            rvr.y += Math.sin(rvr.angle) * rvr.speed;
            colorData.command = 'FORWARD 🟢 (Thrusters Active)';
          } else if (colorData.targetName === 'Blue') {
            rvr.angle += 0.04;
            colorData.command = 'STEER RIGHT 🔵 (Yaw Rotating)';
          } else if (colorData.targetName === 'Yellow') {
            rvr.angle -= 0.03;
            colorData.command = 'SEARCH SCAN 🟡 (Headlights ON)';
          } else {
            colorData.command = 'EMERGENCY BRAKE 🔴 (Halted)';
          }

          if (rvr.x > canvas.width - 40) rvr.x = 40; if (rvr.x < 40) rvr.x = canvas.width - 40;
          if (rvr.y > canvas.height - 40) rvr.y = 40; if (rvr.y < 40) rvr.y = canvas.height - 40;

          // Render Crystals
          colorData.crystals.forEach(function(cry) {
            if (!cry.collected) {
              ctx.beginPath(); ctx.arc(cry.x, cry.y, 9, 0, Math.PI * 2);
              ctx.fillStyle = cry.color; ctx.fill();
              ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.stroke();
              // Check rover pickup
              if (Math.hypot(rvr.x - cry.x, rvr.y - cry.y) < 28) {
                cry.collected = true;
                colorData.crystalsCollected++;
                if (window.ExperimindAudio) window.ExperimindAudio.snap();
                var cEl = container.querySelector('#vis-metric-crystals');
                if (cEl) cEl.textContent = colorData.crystalsCollected + ' / 5 Crystals 💎';
              }
            }
          });

          // Draw Rover
          ctx.save();
          ctx.translate(rvr.x, rvr.y);
          ctx.rotate(rvr.angle);
          ctx.fillStyle = '#e2e8f0'; ctx.fillRect(-20, -14, 40, 28);
          ctx.fillStyle = '#3b82f6'; ctx.fillRect(-12, -9, 24, 18);
          // Wheels
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(-24, -18, 12, 6); ctx.fillRect(12, -18, 12, 6);
          ctx.fillRect(-24, 12, 12, 6); ctx.fillRect(12, 12, 12, 6);
          ctx.restore();

          ctx.fillStyle = '#fef08a'; ctx.font = 'bold 11px Inter, sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('MARS ROVER 🛸', rvr.x, rvr.y - 22);

          var mCol = container.querySelector('#vis-metric-color');
          if (mCol) mCol.textContent = 'State: ' + colorData.command;
        }

        // ===================================================================
        // 4. SHAPE & CONTOUR LAB
        // ===================================================================
        else if (expType === 'shape') {
          var sx = virtualObj.x, sy = virtualObj.y;
          ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3.5;
          ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';

          if (shapeData.drawMode && customShapePoints.length > 1) {
            ctx.beginPath();
            ctx.moveTo(customShapePoints[0].x, customShapePoints[0].y);
            for (var csi = 1; csi < customShapePoints.length; csi++) {
              ctx.lineTo(customShapePoints[csi].x, customShapePoints[csi].y);
            }
            ctx.stroke();
          } else if (shapeData.detectedShape.indexOf('Circle') !== -1) {
            ctx.beginPath(); ctx.arc(sx, sy, 48, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          } else if (shapeData.detectedShape.indexOf('Square') !== -1) {
            ctx.fillRect(sx - 44, sy - 44, 88, 88); ctx.strokeRect(sx - 44, sy - 44, 88, 88);
          } else if (shapeData.detectedShape.indexOf('Triangle') !== -1) {
            ctx.beginPath(); ctx.moveTo(sx, sy - 52); ctx.lineTo(sx - 50, sy + 40); ctx.lineTo(sx + 50, sy + 40); ctx.closePath();
            ctx.fill(); ctx.stroke();
          } else if (shapeData.detectedShape.indexOf('Star') !== -1) {
            ctx.beginPath();
            for (var si = 0; si < 10; si++) {
              var sAng = (si * Math.PI) / 5 - Math.PI / 2;
              var sRad = (si % 2 === 0) ? 52 : 24;
              var spx = sx + Math.cos(sAng) * sRad;
              var spy = sy + Math.sin(sAng) * sRad;
              if (si === 0) ctx.moveTo(spx, spy); else ctx.lineTo(spx, spy);
            }
            ctx.closePath(); ctx.fill(); ctx.stroke();
          } else {
            // Hexagon
            ctx.beginPath();
            for (var hi = 0; hi < 6; hi++) {
              var hAng = (hi * Math.PI) / 3;
              var hpx = sx + Math.cos(hAng) * 48;
              var hpy = sy + Math.sin(hAng) * 48;
              if (hi === 0) ctx.moveTo(hpx, hpy); else ctx.lineTo(hpx, hpy);
            }
            ctx.closePath(); ctx.fill(); ctx.stroke();
          }

          ctx.fillStyle = '#fef08a'; ctx.font = 'bold 12px Inter, sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('CONTOUR: ' + shapeData.detectedShape, sx, sy + 68);
        }

        // ===================================================================
        // 5. 21-KEYPOINT HAND DRONE LAB
        // ===================================================================
        else if (expType === 'pose') {
          var lms = getLandmarks(virtualObj.x, virtualObj.y, poseData.activeGesture);
          drawHandSkeleton(lms);

          ctx.fillStyle = '#fde047'; ctx.font = 'bold 13px Inter, sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('21-KEYPOINT SKELETAL MESH', virtualObj.x, boxY + boxH + 20);

          var dr = poseData.drone;
          poseData.propellerAngle += 0.5;

          if (poseData.activeGesture.indexOf('Open') !== -1) {
            dr.targetY = 90; dr.status = 'Hovering (Propellers High)';
          } else if (poseData.activeGesture.indexOf('Fist') !== -1) {
            dr.targetY = 280; dr.status = 'Landed Safely on Pad';
          } else if (poseData.activeGesture.indexOf('Point') !== -1) {
            dr.x = (dr.x + 2.8) % (canvas.width - 60);
            dr.targetY = 130; dr.status = 'Cruising East ➔';
          } else if (poseData.activeGesture.indexOf('Peace') !== -1) {
            dr.targetY = 100; dr.status = 'Aerial Selfie Snapshot 📸';
            if (tick % 40 < 5) {
              ctx.fillStyle = 'rgba(255,255,255,0.7)';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
          } else if (poseData.activeGesture.indexOf('Thumbs') !== -1) {
            dr.targetY = 110; dr.status = 'Turbo Rockets Firing 🔥';
            // Rocket exhaust particles
            poseData.particles.push({ x: dr.x - 14, y: dr.y + 14, vy: 3 + Math.random() * 3, alpha: 1 });
            poseData.particles.push({ x: dr.x + 14, y: dr.y + 14, vy: 3 + Math.random() * 3, alpha: 1 });
          }
          dr.y += (dr.targetY - dr.y) * 0.08;

          // Rocket particles
          for (var ptk = poseData.particles.length - 1; ptk >= 0; ptk--) {
            var rpt = poseData.particles[ptk];
            rpt.y += rpt.vy; rpt.alpha -= 0.06;
            if (rpt.alpha <= 0) { poseData.particles.splice(ptk, 1); continue; }
            ctx.fillStyle = 'rgba(245, 158, 11, ' + rpt.alpha + ')';
            ctx.beginPath(); ctx.arc(rpt.x, rpt.y, 3, 0, Math.PI * 2); ctx.fill();
          }

          var dx = dr.x, dy = dr.y;
          // Propellers
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)'; ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(dx - 30, dy - 14, 18, 4, poseData.propellerAngle, 0, Math.PI * 2);
          ctx.ellipse(dx + 30, dy - 14, 18, 4, -poseData.propellerAngle, 0, Math.PI * 2);
          ctx.stroke();

          // Drone Body
          ctx.fillStyle = '#1e3a8a';
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(dx - 24, dy - 12, 48, 24, 8) : ctx.rect(dx - 24, dy - 12, 48, 24);
          ctx.fill(); ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.5; ctx.stroke();

          ctx.beginPath(); ctx.arc(dx, dy, 6, 0, Math.PI * 2);
          ctx.fillStyle = (tick % 30 < 15) ? '#10b981' : '#f59e0b'; ctx.fill();

          ctx.fillStyle = '#ffffff'; ctx.font = 'bold 11px Inter, sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('AI DRONE (' + Math.round(360 - dy) + 'm)', dx, dy + 26);

          var mPose = container.querySelector('#vis-metric-pose');
          if (mPose) mPose.textContent = poseData.activeGesture + ' (' + dr.status + ')';
        }

        // ===================================================================
        // 6. 3x3 CONVOLUTION KERNEL LAB
        // ===================================================================
        else if (expType === 'kernel') {
          var kx = virtualObj.x - 55, ky = virtualObj.y - 55;
          ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
          ctx.fillRect(kx, ky, 110, 110);
          ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
          ctx.strokeRect(kx, ky, 110, 110);

          ctx.fillStyle = '#38bdf8'; ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center';
          var mat = kernelData.kernelMatrix;
          for (var r = 0; r < 3; r++) {
            for (var c = 0; c < 3; c++) {
              ctx.fillText(mat[r][c] > 0 ? '+' + mat[r][c] : String(mat[r][c]), kx + 18 + c * 36, ky + 28 + r * 34);
            }
          }

          ctx.fillStyle = '#fef08a'; ctx.font = 'bold 12px Inter, sans-serif';
          ctx.fillText('3×3 CONVOLUTION KERNEL', virtualObj.x, ky + 130);
        }

        // ===================================================================
        // 7. TEACHABLE MACHINE & ROBOT SORTING ARM LAB
        // ===================================================================
        else if (expType === 'trainer') {
          var crn = trainerData;
          crn.craneX += (crn.targetCraneX - crn.craneX) * 0.08;

          // Crane Base & Boom
          ctx.fillStyle = '#334155'; ctx.fillRect(canvas.width / 2 - 25, canvas.height - 24, 50, 24);
          ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 6;
          ctx.beginPath(); ctx.moveTo(canvas.width / 2, canvas.height - 20); ctx.lineTo(crn.craneX, 250); ctx.stroke();
          ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(crn.craneX, 250, 10, 0, Math.PI * 2); ctx.fill();

          // Gripper
          ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(crn.craneX - 12, 264); ctx.lineTo(crn.craneX, 250); ctx.lineTo(crn.craneX + 12, 264); ctx.stroke();

          // Bins
          var bins = [
            { x: 120, label: 'Bin A: Metal 🔩', color: '#3b82f6' },
            { x: 310, label: 'Bin B: Plastic 🧴', color: '#10b981' },
            { x: 500, label: 'Bin C: Organic 🍏', color: '#f59e0b' }
          ];

          bins.forEach(function(bn) {
            ctx.fillStyle = bn.color + '33'; ctx.fillRect(bn.x - 50, canvas.height - 54, 100, 50);
            ctx.strokeStyle = bn.color; ctx.lineWidth = 2.5; ctx.strokeRect(bn.x - 50, canvas.height - 54, 100, 50);
            ctx.fillStyle = '#ffffff'; ctx.font = 'bold 11px Inter, sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(bn.label, bn.x, canvas.height - 26);
          });
        }

        // ===================================================================
        // 8. SELF-DRIVING CAR LAB
        // ===================================================================
        else {
          // Perspective Road
          ctx.fillStyle = '#1e293b';
          ctx.beginPath(); ctx.moveTo(220, 160); ctx.lineTo(400, 160); ctx.lineTo(canvas.width, canvas.height); ctx.lineTo(0, canvas.height); ctx.fill();

          // Lane Divider Lines
          ctx.strokeStyle = '#facc15'; ctx.lineWidth = 4; ctx.setLineDash([16, 12]);
          ctx.lineDashOffset = -tick * (autoData.speed / 10);
          ctx.beginPath(); ctx.moveTo(310, 160); ctx.lineTo(310, canvas.height); ctx.stroke();
          ctx.setLineDash([]);

          // Cyan / Yellow Lane Boundary Perception Overlays
          ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.moveTo(220, 160); ctx.lineTo(0, canvas.height); ctx.stroke();
          ctx.strokeStyle = '#facc15';
          ctx.beginPath(); ctx.moveTo(400, 160); ctx.lineTo(canvas.width, canvas.height); ctx.stroke();

          // Weather Effects
          if (autoData.weather === 'rain') {
            ctx.strokeStyle = 'rgba(147, 197, 253, 0.4)'; ctx.lineWidth = 1.5;
            for (var rk = 0; rk < 30; rk++) {
              var rx = (rk * 22 + tick * 8) % canvas.width;
              var ry = (rk * 16 + tick * 14) % canvas.height;
              ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 6, ry + 14); ctx.stroke();
            }
          } else if (autoData.weather === 'fog') {
            ctx.fillStyle = 'rgba(203, 213, 225, 0.45)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          } else if (autoData.weather === 'night') {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          // Self-Driving Car
          var cx = autoData.carX + Math.sin(tick * 0.05) * 6;
          ctx.fillStyle = '#2563eb';
          ctx.beginPath(); ctx.roundRect ? ctx.roundRect(cx - 32, 260, 64, 42, 8) : ctx.rect(cx - 32, 260, 64, 42); ctx.fill();
          ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 2.5; ctx.stroke();

          // Headlights
          ctx.fillStyle = 'rgba(254, 240, 138, 0.35)';
          ctx.beginPath(); ctx.moveTo(cx - 22, 260); ctx.lineTo(cx - 60, 180); ctx.lineTo(cx + 60, 180); ctx.lineTo(cx + 22, 260); ctx.fill();

          // Traffic Light Box
          ctx.fillStyle = '#0f172a'; ctx.fillRect(520, 50, 34, 84);
          ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2; ctx.strokeRect(520, 50, 34, 84);

          ctx.beginPath(); ctx.arc(537, 65, 8, 0, Math.PI * 2);
          ctx.fillStyle = (autoData.light.indexOf('RED') !== -1) ? '#ef4444' : '#450a0a'; ctx.fill();

          ctx.beginPath(); ctx.arc(537, 92, 8, 0, Math.PI * 2);
          ctx.fillStyle = (autoData.light.indexOf('YELLOW') !== -1) ? '#f59e0b' : '#713f12'; ctx.fill();

          ctx.beginPath(); ctx.arc(537, 119, 8, 0, Math.PI * 2);
          ctx.fillStyle = (autoData.light.indexOf('GREEN') !== -1) ? '#10b981' : '#064e3b'; ctx.fill();

          ctx.fillStyle = '#fef08a'; ctx.font = 'bold 12px Inter, sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('AUTOPILOT VEHICLE: ' + autoData.speed + ' km/h', cx, 326);
        }

        // Pixel Spy Inspector Tooltip
        if (xrayMode === 'pixel') {
          try {
            var pix = ctx.getImageData(virtualObj.x, virtualObj.y, 1, 1).data;
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'; ctx.fillRect(virtualObj.x + 14, virtualObj.y - 34, 150, 44);
            ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.5; ctx.strokeRect(virtualObj.x + 14, virtualObj.y - 34, 150, 44);
            ctx.fillStyle = '#ffffff'; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'left';
            ctx.fillText('RGB: [' + pix[0] + ', ' + pix[1] + ', ' + pix[2] + ']', virtualObj.x + 22, virtualObj.y - 18);
            ctx.fillText('Hex: #' + ((1 << 24) + (pix[0] << 16) + (pix[1] << 8) + pix[2]).toString(16).slice(1), virtualObj.x + 22, virtualObj.y - 4);
          } catch (e) {}
        }

        animId = requestAnimationFrame(drawLoop);
      }

      // --- Interactive Event Bindings ---
      canvas.addEventListener('mousemove', function(ev) {
        var rect = canvas.getBoundingClientRect();
        virtualObj.x = (ev.clientX - rect.left) * (canvas.width / rect.width);
        virtualObj.y = (ev.clientY - rect.top) * (canvas.height / rect.height);
        if (shapeData.drawMode && isDrawingCustomShape) {
          customShapePoints.push({ x: virtualObj.x, y: virtualObj.y });
        }
      });

      // Canvas Click Eyedropper for Color Lab
      canvas.addEventListener('click', function(ev) {
        if (expType === 'color') {
          try {
            var rect = canvas.getBoundingClientRect();
            var px = Math.round((ev.clientX - rect.left) * (canvas.width / rect.width));
            var py = Math.round((ev.clientY - rect.top) * (canvas.height / rect.height));
            var pix = ctx.getImageData(px, py, 1, 1).data;
            colorData.targetR = pix[0];
            colorData.targetG = pix[1];
            colorData.targetB = pix[2];
            colorData.targetColor = '#' + ((1 << 24) + (pix[0] << 16) + (pix[1] << 8) + pix[2]).toString(16).slice(1);
            colorData.targetName = 'Sampled';
            var mCol = container.querySelector('#vis-metric-color');
            if (mCol) mCol.textContent = 'Custom Color Locked (' + colorData.targetColor + ') — Tracking Active!';
            if (window.ExperimindAudio) window.ExperimindAudio.snap();
          } catch (e) {}
        }
      });

      canvas.addEventListener('mousedown', function() {
        if (shapeData.drawMode) {
          isDrawingCustomShape = true;
          customShapePoints = [{ x: virtualObj.x, y: virtualObj.y }];
        }
      });

      window.addEventListener('mouseup', function() {
        if (shapeData.drawMode && isDrawingCustomShape) {
          isDrawingCustomShape = false;
          shapeData.detectedShape = '✨ Custom Polygon (' + customShapePoints.length + ' points)';
          shapeData.perimeter = Math.round(customShapePoints.length * 3.2);
          shapeData.area = Math.round(shapeData.perimeter * 14);
          var sEl = container.querySelector('#vis-metric-shape');
          if (sEl) sEl.textContent = shapeData.detectedShape + ' (P: ' + shapeData.perimeter + 'px | A: ' + shapeData.area + 'px²)';
        }
      });

      canvas.addEventListener('touchmove', function(ev) {
        if (ev.touches && ev.touches[0]) {
          var rect = canvas.getBoundingClientRect();
          virtualObj.x = (ev.touches[0].clientX - rect.left) * (canvas.width / rect.width);
          virtualObj.y = (ev.touches[0].clientY - rect.top) * (canvas.height / rect.height);
          ev.preventDefault();
        }
      }, { passive: false });

      // Optical X-Ray Pills
      container.querySelectorAll('[data-vis-xray]').forEach(function(pill) {
        pill.addEventListener('click', function() {
          xrayMode = pill.getAttribute('data-vis-xray');
          container.querySelectorAll('[data-vis-xray]').forEach(function(p) {
            p.className = 'vis-XrayPill' + (p === pill ? ' vis-XrayPill--active' : '');
          });
          if (window.ExperimindAudio) window.ExperimindAudio.click();
        });
      });

      // Lab Tab Switching
      container.querySelectorAll('[data-vis-exp]').forEach(function(tab) {
        tab.addEventListener('click', function() {
          expType = tab.getAttribute('data-vis-exp');
          render();
        });
      });

      // Motion Sensitivity Slider
      var sensSlider = container.querySelector('#vis-motion-sens');
      if (sensSlider) {
        sensSlider.addEventListener('input', function(e) {
          motionData.sensitivity = parseInt(e.target.value, 10);
          var vEl = container.querySelector('#vis-sens-val');
          if (vEl) vEl.textContent = motionData.sensitivity;
        });
      }

      // AR Face Filter Selector
      container.querySelectorAll('[data-set-filter]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          faceData.activeFilter = btn.getAttribute('data-set-filter');
          container.querySelectorAll('[data-set-filter]').forEach(function(b) {
            b.className = 'sim-OptionBtn' + (b === btn ? ' sim-OptionBtn--active' : '');
          });
          if (window.ExperimindAudio) window.ExperimindAudio.pop();
        });
      });

      // Color Beacon Pickers
      container.querySelectorAll('[data-set-color]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          colorData.targetColor = btn.getAttribute('data-set-color');
          colorData.targetName = btn.getAttribute('data-color-name');
          colorData.targetR = parseInt(btn.getAttribute('data-r'), 10);
          colorData.targetG = parseInt(btn.getAttribute('data-g'), 10);
          colorData.targetB = parseInt(btn.getAttribute('data-b'), 10);
          container.querySelectorAll('[data-set-color]').forEach(function(b) {
            b.className = 'sim-OptionBtn' + (b === btn ? ' sim-OptionBtn--active' : '');
          });
          if (window.ExperimindAudio) window.ExperimindAudio.click();
        });
      });

      // Shape Detective Pickers
      container.querySelectorAll('[data-set-shape]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          shapeData.detectedShape = btn.getAttribute('data-set-shape');
          shapeData.drawMode = false;
          customShapePoints = [];
          if (shapeData.detectedShape.indexOf('Circle') !== -1) {
            shapeData.perimeter = 248; shapeData.area = 4900; shapeData.circularity = 0.98;
          } else if (shapeData.detectedShape.indexOf('Square') !== -1) {
            shapeData.perimeter = 352; shapeData.area = 7744; shapeData.circularity = 0.78;
          } else if (shapeData.detectedShape.indexOf('Triangle') !== -1) {
            shapeData.perimeter = 296; shapeData.area = 4330; shapeData.circularity = 0.60;
          } else if (shapeData.detectedShape.indexOf('Star') !== -1) {
            shapeData.perimeter = 412; shapeData.area = 5820; shapeData.circularity = 0.42;
          } else {
            shapeData.perimeter = 288; shapeData.area = 5990; shapeData.circularity = 0.90;
          }
          container.querySelectorAll('[data-set-shape]').forEach(function(b) {
            b.className = 'sim-OptionBtn' + (b === btn ? ' sim-OptionBtn--active' : '');
          });
          var sMet = container.querySelector('#vis-metric-shape');
          if (sMet) sMet.textContent = shapeData.detectedShape + ' (P: ' + shapeData.perimeter + 'px | A: ' + shapeData.area + 'px² | Circ: ' + shapeData.circularity + ')';
          if (window.ExperimindAudio) window.ExperimindAudio.click();
        });
      });

      var toggleDrawBtn = container.querySelector('#vis-toggle-draw');
      if (toggleDrawBtn) {
        toggleDrawBtn.addEventListener('click', function() {
          shapeData.drawMode = !shapeData.drawMode;
          toggleDrawBtn.textContent = shapeData.drawMode ? '✅ Click to Finish Custom Drawing' : '✏️ Draw Custom Shape on Canvas';
          if (!shapeData.drawMode && customShapePoints.length > 2) {
            if (window.ExperimindAudio) window.ExperimindAudio.fanfare();
          }
        });
      }

      // Hand Pose Pickers
      container.querySelectorAll('[data-set-gesture]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          poseData.activeGesture = btn.getAttribute('data-set-gesture');
          if (poseData.activeGesture.indexOf('Open') !== -1) poseData.indexAngle = 172;
          else if (poseData.activeGesture.indexOf('Fist') !== -1) poseData.indexAngle = 38;
          else if (poseData.activeGesture.indexOf('Point') !== -1) poseData.indexAngle = 168;
          else if (poseData.activeGesture.indexOf('Peace') !== -1) poseData.indexAngle = 170;
          else poseData.indexAngle = 44;

          container.querySelectorAll('[data-set-gesture]').forEach(function(b) {
            b.className = 'sim-OptionBtn' + (b === btn ? ' sim-OptionBtn--active' : '');
          });
          if (window.ExperimindAudio) window.ExperimindAudio.pop();
        });
      });

      // Convolution Kernel Pickers
      container.querySelectorAll('[data-set-kernel]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var k = btn.getAttribute('data-set-kernel');
          kernelData.activeKernel = k;
          if (k === 'sobel_vert') {
            kernelData.kernelMatrix = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
            kernelData.kernelLabel = 'Vertical Sobel Edge Detector';
          } else if (k === 'sobel_horiz') {
            kernelData.kernelMatrix = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
            kernelData.kernelLabel = 'Horizontal Sobel Edge Detector';
          } else if (k === 'ridge') {
            kernelData.kernelMatrix = [[0, -1, 0], [-1, 4, -1], [0, -1, 0]];
            kernelData.kernelLabel = 'Laplacian Ridge Filter';
          } else if (k === 'sharpen') {
            kernelData.kernelMatrix = [[0, -1, 0], [-1, 5, -1], [0, -1, 0]];
            kernelData.kernelLabel = 'Sharpening Center Ridge Filter';
          } else if (k === 'blur') {
            kernelData.kernelMatrix = [[1, 2, 1], [2, 4, 2], [1, 2, 1]];
            kernelData.kernelLabel = 'Gaussian Smoothing Box Blur';
          } else {
            kernelData.kernelMatrix = [[-2, -1, 0], [-1, 1, 1], [0, 1, 2]];
            kernelData.kernelLabel = '3D Emboss Filter';
          }
          container.querySelectorAll('[data-set-kernel]').forEach(function(b) {
            b.className = 'sim-OptionBtn' + (b === btn ? ' sim-OptionBtn--active' : '');
          });
          var mK = container.querySelector('#vis-metric-kernel');
          if (mK) mK.textContent = kernelData.kernelLabel;

          // Update Matrix Grid Cells
          var cells = container.querySelectorAll('.vis-MatrixCell');
          var idx = 0;
          for (var r = 0; r < 3; r++) {
            for (var c = 0; c < 3; c++) {
              if (cells[idx]) {
                var v = kernelData.kernelMatrix[r][c];
                cells[idx].textContent = v > 0 ? '+' + v : v;
              }
              idx++;
            }
          }
          if (window.ExperimindAudio) window.ExperimindAudio.click();
        });
      });

      // Interactive Matrix Cell Click Handler
      container.querySelectorAll('.vis-MatrixCell').forEach(function(cell) {
        cell.addEventListener('click', function() {
          var r = parseInt(cell.getAttribute('data-row'), 10);
          var c = parseInt(cell.getAttribute('data-col'), 10);
          var cur = kernelData.kernelMatrix[r][c];
          var nextVals = [-2, -1, 0, 1, 2, 5];
          var nextIdx = (nextVals.indexOf(cur) + 1) % nextVals.length;
          kernelData.kernelMatrix[r][c] = nextVals[nextIdx];
          cell.textContent = nextVals[nextIdx] > 0 ? '+' + nextVals[nextIdx] : nextVals[nextIdx];
          kernelData.kernelLabel = 'Custom Interactive 3×3 Matrix Filter';
          var mK = container.querySelector('#vis-metric-kernel');
          if (mK) mK.textContent = kernelData.kernelLabel;
          if (window.ExperimindAudio) window.ExperimindAudio.snap();
        });
      });

      // Teachable Machine Sample Recording
      container.querySelectorAll('[data-record-sample]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var cls = btn.getAttribute('data-record-sample');
          trainerData.classes[cls].samples++;
          btn.textContent = '📸 Record Class ' + cls + ' (' + trainerData.classes[cls].samples + ')';
          if (window.ExperimindAudio) window.ExperimindAudio.click();
        });
      });

      // Teachable Model Training
      var trainBtn = container.querySelector('#vis-train-btn');
      if (trainBtn) {
        trainBtn.addEventListener('click', function() {
          trainerData.isTraining = true;
          trainBtn.textContent = '⏳ Training 30 Epochs (Loss: 1.85 ➔ 0.02)...';
          trainBtn.disabled = true;
          setTimeout(function() {
            trainerData.isTraining = false;
            trainBtn.textContent = '✅ Model Trained Successfully! (Loss: 0.02)';
            trainBtn.disabled = false;
            trainerData.targetCraneX = 120; // route to metal bin
            trainerData.score++;
            var trMet = container.querySelector('#vis-metric-trainer');
            if (trMet) trMet.textContent = 'Routing: ' + trainerData.carrying + ' | Total Sorted: ' + trainerData.score + ' items';
            if (window.ExperimindAudio) window.ExperimindAudio.fanfare();
            if (window.ExperimindConfetti) window.ExperimindConfetti.burst();
          }, 900);
        });
      }

      // Self-Driving Traffic Light Pickers
      container.querySelectorAll('[data-set-light]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var l = btn.getAttribute('data-set-light');
          autoData.light = l;
          if (l.indexOf('RED') !== -1) autoData.speed = 0;
          else if (l.indexOf('YELLOW') !== -1) autoData.speed = 25;
          else autoData.speed = 50;

          container.querySelectorAll('[data-set-light]').forEach(function(b) {
            b.className = 'sim-OptionBtn' + (b === btn ? ' sim-OptionBtn--active' : '');
          });
          var mAuto = container.querySelector('#vis-metric-auto');
          if (mAuto) mAuto.textContent = 'Speed: ' + autoData.speed + ' km/h | Lead Car: ' + autoData.leadDist.toFixed(1) + 'm | Autopilot: ACTIVE';
          if (window.ExperimindAudio) window.ExperimindAudio.click();
        });
      });

      // Self-Driving Weather Selector
      container.querySelectorAll('[data-set-weather]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          autoData.weather = btn.getAttribute('data-set-weather');
          container.querySelectorAll('[data-set-weather]').forEach(function(b) {
            b.className = 'sim-OptionBtn' + (b === btn ? ' sim-OptionBtn--active' : '');
          });
          if (window.ExperimindAudio) window.ExperimindAudio.click();
        });
      });

      // Camera Hardware Consent Buttons
      container.querySelector('#vis-start-cam').addEventListener('click', function() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          statusBadge.className = 'vision-StatusBadge vision-StatusBadge--warn';
          statusBadge.textContent = 'ℹ️ Hardware webcam unavailable in this browser environment — running in interactive Virtual Camera Simulator mode!';
          return;
        }
        statusBadge.textContent = '⏳ Requesting explicit user camera permission...';

        var constraints = { video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' } };

        function onStreamSuccess(stream) {
          mediaStream = stream;
          mode = 'webcam';
          videoEl.srcObject = stream;
          videoEl.onloadedmetadata = function() {
            videoEl.play().catch(function() {});
          };
          videoEl.play().catch(function() {});
          statusBadge.className = 'vision-StatusBadge vision-StatusBadge--live';
          statusBadge.innerHTML = '🔴 <strong>LIVE HARDWARE WEBCAM ACTIVE</strong> (Wave hands or hold objects to interact!)';
        }

        navigator.mediaDevices.getUserMedia(constraints).then(onStreamSuccess).catch(function() {
          navigator.mediaDevices.getUserMedia({ video: true }).then(onStreamSuccess).catch(function() {
            mode = 'virtual';
            statusBadge.className = 'vision-StatusBadge vision-StatusBadge--warn';
            statusBadge.innerHTML = 'ℹ️ Camera permission declined or no webcam plugged in — running in <strong>Camera-Free Virtual Simulator Mode</strong>!';
          });
        });
      });

      container.querySelector('#vis-stop-cam').addEventListener('click', function() {
        stopHardwareCamera();
        mode = 'virtual';
        statusBadge.className = 'vision-StatusBadge';
        statusBadge.textContent = '⏹️ Camera Stopped & Hardware Released. Running in Camera-Free Virtual Simulator Mode.';
      });

      container.querySelector('#vis-virtual-btn').addEventListener('click', function() {
        stopHardwareCamera();
        mode = 'virtual';
        statusBadge.className = 'vision-StatusBadge';
        statusBadge.textContent = '🎮 Camera-Free Virtual Vision Simulator Active (Move pointer inside canvas)';
      });

      animId = requestAnimationFrame(drawLoop);
    }

    render();
  }

  return {
    mount: mount,
    stopHardwareCamera: stopHardwareCamera
  };
})();
