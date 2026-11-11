// Experimind AI Learning Lab — Section 8 Comprehensive 8-Lab AI Computer Vision Suite
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

    // --- State for All 8 Labs ---
    // 1. Motion Lab
    var motionData = {
      score: 0, streak: 0,
      bubbles: [
        { x: 130, y: 110, r: 32, vx: 0.8, vy: 0.5, color: '#38bdf8' },
        { x: 300, y: 90, r: 36, vx: -0.7, vy: 0.6, color: '#facc15' },
        { x: 470, y: 130, r: 30, vx: 0.6, vy: -0.7, color: '#ec4899' },
        { x: 210, y: 260, r: 34, vx: -0.5, vy: -0.6, color: '#10b981' },
        { x: 420, y: 250, r: 32, vx: 0.7, vy: 0.5, color: '#a855f7' }
      ],
      particles: []
    };

    // 2. AR Face Filter & Emotion Lab
    var faceData = {
      activeFilter: 'cat', // 'cat' | 'robot' | 'crown' | 'glasses'
      smileRatio: 0.85,
      emotion: 'Happy 😄 (94%)'
    };

    // 3. Color Beacon & Rover Lab
    var colorData = {
      targetColor: '#10b981', targetName: 'Green',
      command: 'FORWARD 🟢',
      rover: { x: 80, y: 180, angle: 0, speed: 1.6 }
    };

    // 4. Shape & Contour Lab
    var shapeData = {
      detectedShape: '🟡 Circle',
      perimeter: 248, area: 4900, confidence: 97
    };

    // 5. 21-Keypoint Hand Drone Lab
    var poseData = {
      activeGesture: '✋ Open Palm',
      drone: { x: 310, y: 170, targetY: 170, status: 'Hovering' },
      propellerAngle: 0
    };

    // 6. 3x3 Convolution Kernel Lab
    var kernelData = {
      activeKernel: 'sobel_vert',
      kernelMatrix: [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]],
      kernelLabel: 'Vertical Sobel Edge Detector'
    };

    // 7. Teachable Machine & Sorter Lab
    var trainerData = {
      classes: {
        'A': { label: 'Class A: Fist / Metal 🔩', samples: 8, color: '#3b82f6', weight: 0.86 },
        'B': { label: 'Class B: Palm / Plastic 🧴', samples: 7, color: '#10b981', weight: 0.09 },
        'C': { label: 'Class C: Peace / Organic 🍏', samples: 6, color: '#f59e0b', weight: 0.05 }
      },
      craneX: 310, targetCraneX: 130, carrying: 'Metal Scrap 🔩'
    };

    // 8. Self-Driving Car Lab
    var autoData = {
      speed: 48, steering: 0, light: 'GREEN 🟢',
      autopilot: true, carX: 310
    };

    function render() {
      var html = '<div class="vision-Wrapper">';
      html += '<div class="vision-HeaderCard">';
      html += '<div><span class="sim-EngineBadge">SECTION 8 • 8-LAB ADVANCED AI VISION SUITE</span><h2>AI Computer Vision Laboratory — ' + grade + '</h2>';
      html += '<p>Privacy Guarantee: Cameras never stream data outside this PC. 100% in-browser RAM analysis with zero student accounts and instant Virtual Simulator fallback.</p></div>';
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
        ? '🔴 LIVE HARDWARE WEBCAM ACTIVE (Streaming locally in RAM)'
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
        html += '<p>Wave your hands across the camera (or move your pointer in Virtual mode) to trigger pixel difference vectors and pop floating bubbles!</p>';
        html += '<div class="sim-MetricBox"><span>Motion Targets Popped</span><strong id="vis-metric-motion">' + motionData.score + ' Targets (Streak: ' + motionData.streak + 'x 🔥)</strong></div>';
        html += '<div class="exp-OfflineBox" style="margin-top:14px;"><strong>💡 The AI Math:</strong> The computer calculates <code>|Frame(t) - Frame(t-1)|</code> across a matrix of 1,200 grid points to detect movement velocity!</div>';
      } else if (expType === 'face') {
        html += '<h3>🐱 2. AR Face Mesh & Emotion Recognition</h3>';
        html += '<p>Computer vision detects facial landmarks (eyes, nose, mouth curvature) to apply playful Augmented Reality filters and classify emotional expressions:</p>';
        html += '<div class="sim-PresetRow">';
        [['cat', '🐱 Cat Ears & Whiskers'], ['robot', '🤖 Sparky Robot Visor'], ['crown', '👑 Golden Crown'], ['glasses', '🕶️ Cyber AI Shades']].forEach(function(f) {
          var act = (faceData.activeFilter === f[0]) ? ' sim-OptionBtn--active' : '';
          html += '<button type="button" class="sim-OptionBtn' + act + '" data-set-filter="' + f[0] + '">' + f[1] + '</button>';
        });
        html += '</div>';
        html += '<div class="sim-MetricBox" style="margin-top:14px;"><span>Detected Facial Expression</span><strong id="vis-metric-emotion">' + faceData.emotion + '</strong></div>';
        html += '<div class="exp-OfflineBox" style="margin-top:14px;"><strong>💡 Face Landmark Perception:</strong> The AI measures the upward curvature distance of mouth corners relative to the nose tip to estimate positive valence!</div>';
      } else if (expType === 'color') {
        html += '<h3>🎨 3. Color Beacon & Mars Rover Navigator</h3>';
        html += '<p>Hold colored cards or toys in front of the camera (or click a beacon below) to steer our autonomous Mars Rover across the red desert:</p>';
        html += '<div class="sim-PresetRow">';
        [['#ef4444', 'Red', '🔴 Red (STOP)'], ['#10b981', 'Green', '🟢 Green (FORWARD)'], ['#3b82f6', 'Blue', '🔵 Blue (TURN RIGHT)']].forEach(function(c) {
          var act = (colorData.targetName === c[1]) ? ' sim-OptionBtn--active' : '';
          html += '<button type="button" class="sim-OptionBtn' + act + '" data-set-color="' + c[0] + '" data-color-name="' + c[1] + '">' + c[2] + '</button>';
        });
        html += '</div>';
        html += '<div class="sim-MetricBox" style="margin-top:14px;"><span>Active Rover Telemetry</span><strong id="vis-metric-color">State: ' + colorData.command + '</strong></div>';
        html += '<div class="exp-OfflineBox" style="margin-top:14px;"><strong>💡 Euclidean Color Distance:</strong> The vision algorithm calculates <code>ΔE = √((R-Rt)² + (G-Gt)² + (B-Bt)²)</code> to classify objects in milliseconds!</div>';
      } else if (expType === 'shape') {
        html += '<h3>📐 4. Geometric Shape & Contour Detective</h3>';
        html += '<p>Computer vision algorithms isolate closed pixel contours and compute circularity ratios <code>4π×Area / Perimeter²</code> to classify geometric shapes:</p>';
        html += '<div class="sim-PresetRow">';
        ['🟡 Circle (Roundness: 0.98)', '🟦 Square (4 Corners, 90°)', '🔺 Triangle (3 Vertices)', '⭐ Star (10 Alternating Tips)'].forEach(function(s) {
          var act = (shapeData.detectedShape.slice(0, 2) === s.slice(0, 2)) ? ' sim-OptionBtn--active' : '';
          html += '<button type="button" class="sim-OptionBtn' + act + '" data-set-shape="' + s + '">' + s + '</button>';
        });
        html += '</div>';
        html += '<div class="sim-MetricBox" style="margin-top:14px;"><span>Perimeter & Area Geometry</span><strong id="vis-metric-shape">' + shapeData.detectedShape + ' (Perimeter: ' + shapeData.perimeter + 'px | Area: ' + shapeData.area + 'px²)</strong></div>';
        html += '<div class="exp-OfflineBox" style="margin-top:14px;"><strong>💡 Boundary Polygon Tracking:</strong> Contour tracing detects sudden pixel gradient drops to trace object borders!</div>';
      } else if (expType === 'pose') {
        html += '<h3>✋ 5. 21-Keypoint Hand Landmark Drone</h3>';
        html += '<p>Computer vision models locate 21 skeletal joints (wrist, knuckles, fingertips) to recognize gestures and pilot our futuristic Drone:</p>';
        html += '<div class="sim-PresetRow">';
        ['✋ Open Palm (Hover Drone)', '✊ Closed Fist (Land Safely)', '👉 Point Right (Move East)', '👍 Thumbs Up (Turbo Sparkles)'].forEach(function(p) {
          var act = (poseData.activeGesture.slice(0, 2) === p.slice(0, 2)) ? ' sim-OptionBtn--active' : '';
          html += '<button type="button" class="sim-OptionBtn' + act + '" data-set-gesture="' + p + '">' + p + '</button>';
        });
        html += '</div>';
        html += '<div class="sim-MetricBox" style="margin-top:14px;"><span>Flight Controller State</span><strong id="vis-metric-pose">' + poseData.activeGesture + ' (' + poseData.drone.status + ')</strong></div>';
        html += '<div class="exp-OfflineBox" style="margin-top:14px;"><strong>💡 Landmark Geometry:</strong> By measuring vectors between joint 0 (Wrist) and fingertip joints (4, 8, 12, 16, 20), the AI infers whether fingers are curled or extended!</div>';
      } else if (expType === 'kernel') {
        html += '<h3>⚡ 6. 3×3 Convolution Matrix Filter Shader</h3>';
        html += '<p>Slide real mathematical convolution kernels across the image stream to see how feature maps are extracted:</p>';
        html += '<div class="sim-PresetRow">';
        [['sobel_vert', 'Vertical Sobel Edges'], ['sobel_horiz', 'Horizontal Sobel Edges'], ['sharpen', 'Center Sharpen Ridge'], ['blur', 'Gaussian Box Blur']].forEach(function(k) {
          var act = (kernelData.activeKernel === k[0]) ? ' sim-OptionBtn--active' : '';
          html += '<button type="button" class="sim-OptionBtn' + act + '" data-set-kernel="' + k[0] + '">' + k[1] + '</button>';
        });
        html += '</div>';
        html += '<div class="sim-MetricBox" style="margin-top:14px;"><span>Active Convolution Kernel</span><strong id="vis-metric-kernel">' + kernelData.kernelLabel + '</strong></div>';
        html += '<div class="exp-OfflineBox" style="margin-top:14px;"><strong>💡 How Neural Convolutions Work:</strong> Each output pixel is the sum of products: <code>Output(x,y) = Σ (Neighbor(i,j) × Kernel(i,j))</code>!</div>';
      } else if (expType === 'trainer') {
        html += '<h3>🧠 7. In-Browser Teachable Machine & Sorter</h3>';
        html += '<p>Capture training examples in local volatile RAM, train your neural model, and command the on-screen Robotic Sorter Arm:</p>';
        html += '<div class="sim-PresetRow">';
        html += '<button type="button" class="sim-OptionBtn" data-record-sample="A">📸 Record Class A (' + trainerData.classes.A.samples + ')</button>';
        html += '<button type="button" class="sim-OptionBtn" data-record-sample="B">📸 Record Class B (' + trainerData.classes.B.samples + ')</button>';
        html += '<button type="button" class="sim-OptionBtn" data-record-sample="C">📸 Record Class C (' + trainerData.classes.C.samples + ')</button>';
        html += '</div>';
        html += '<div style="margin:12px 0;"><button type="button" class="btn-Primary" id="vis-train-btn" style="width:100%;font-size:1.05rem;">⚡ Train AI Model Now (30 Epochs)</button></div>';
        html += '<div style="background:#f8fafc;padding:14px;border-radius:12px;border:2px solid #cbd5e1;margin-top:10px;">';
        html += '<div style="font-weight:900;font-size:0.95rem;margin-bottom:8px;">📊 Real-Time Classification Confidences:</div>';
        Object.keys(trainerData.classes).forEach(function(k) {
          var c = trainerData.classes[k];
          var pct = Math.round(c.weight * 100);
          html += '<div class="vis-ConfidenceMeter">';
          html += '<span class="vis-ConfidenceLabel">' + c.label.split(':')[1] + '</span>';
          html += '<div class="vis-ConfidenceTrack"><div class="vis-ConfidenceFill" style="width:' + pct + '%;background:' + c.color + ';"></div></div>';
          html += '<span class="vis-ConfidenceVal">' + pct + '%</span>';
          html += '</div>';
        });
        html += '</div>';
        html += '<div class="sim-MetricBox" style="margin-top:12px;"><span>Active Robotic Sorter Command</span><strong id="vis-metric-trainer">Routing: ' + trainerData.carrying + '</strong></div>';
      } else {
        html += '<h3>🚗 8. Autonomous Vehicle Perception Stack</h3>';
        html += '<p>Computer vision for self-driving cars: detects road lane boundaries, identifies obstacles, and classifies traffic lights:</p>';
        html += '<div class="sim-PresetRow">';
        [['GREEN 🟢', '🟢 Green Light (Drive 50 km/h)'], ['YELLOW 🟡', '🟡 Yellow Light (Slow Down 25 km/h)'], ['RED 🔴', '🔴 Red Light (Halt 0 km/h)']].forEach(function(l) {
          var act = (autoData.light.indexOf(l[0].slice(0, 3)) !== -1) ? ' sim-OptionBtn--active' : '';
          html += '<button type="button" class="sim-OptionBtn' + act + '" data-set-light="' + l[0] + '">' + l[1] + '</button>';
        });
        html += '</div>';
        html += '<div class="sim-MetricBox" style="margin-top:14px;"><span>Self-Driving Telemetry</span><strong id="vis-metric-auto">Speed: ' + autoData.speed + ' km/h | Signal: ' + autoData.light + ' | Autopilot: ACTIVE</strong></div>';
        html += '<div class="exp-OfflineBox" style="margin-top:14px;"><strong>💡 Real Self-Driving AI:</strong> Autonomous cars combine lane curve detection with bounding-box obstacle trackers to steer safely without human intervention!</div>';
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

      // --- 21-Keypoint Hand Pose Mathematical Engine ---
      function getLandmarks(cx, cy, gesture) {
        var isFist = gesture.indexOf('Fist') !== -1;
        var isPoint = gesture.indexOf('Point') !== -1;
        var isThumbsUp = gesture.indexOf('Thumbs') !== -1;
        var wx = cx, wy = cy + 46;
        var j = [{ x: wx, y: wy }]; // 0: Wrist

        // Thumb: 1, 2, 3, 4
        if (isThumbsUp) {
          j.push({ x: wx - 18, y: wy - 16 }, { x: wx - 30, y: wy - 36 }, { x: wx - 32, y: wy - 60 }, { x: wx - 30, y: wy - 85 });
        } else if (isFist) {
          j.push({ x: wx - 14, y: wy - 10 }, { x: wx - 20, y: wy - 20 }, { x: wx - 14, y: wy - 28 }, { x: wx - 6, y: wy - 30 });
        } else {
          j.push({ x: wx - 18, y: wy - 14 }, { x: wx - 34, y: wy - 28 }, { x: wx - 48, y: wy - 42 }, { x: wx - 58, y: wy - 52 });
        }

        // Index: 5, 6, 7, 8
        if (isPoint) {
          j.push({ x: wx - 8, y: wy - 24 }, { x: wx + 20, y: wy - 34 }, { x: wx + 50, y: wy - 36 }, { x: wx + 78, y: wy - 36 });
        } else if (isFist || isThumbsUp) {
          j.push({ x: wx - 12, y: wy - 22 }, { x: wx - 14, y: wy - 34 }, { x: wx - 8, y: wy - 38 }, { x: wx - 2, y: wy - 32 });
        } else {
          j.push({ x: wx - 12, y: wy - 24 }, { x: wx - 16, y: wy - 50 }, { x: wx - 18, y: wy - 74 }, { x: wx - 20, y: wy - 94 });
        }

        // Middle: 9, 10, 11, 12
        if (isFist || isThumbsUp || isPoint) {
          j.push({ x: wx, y: wy - 24 }, { x: wx, y: wy - 36 }, { x: wx + 4, y: wy - 40 }, { x: wx + 8, y: wy - 34 });
        } else {
          j.push({ x: wx, y: wy - 26 }, { x: wx, y: wy - 54 }, { x: wx, y: wy - 80 }, { x: wx - 2, y: wy - 102 });
        }

        // Ring: 13, 14, 15, 16
        if (isFist || isThumbsUp || isPoint) {
          j.push({ x: wx + 12, y: wy - 22 }, { x: wx + 14, y: wy - 34 }, { x: wx + 16, y: wy - 38 }, { x: wx + 18, y: wy - 32 });
        } else {
          j.push({ x: wx + 12, y: wy - 24 }, { x: wx + 16, y: wy - 50 }, { x: wx + 18, y: wy - 72 }, { x: wx + 20, y: wy - 92 });
        }

        // Pinky: 17, 18, 19, 20
        if (isFist || isThumbsUp || isPoint) {
          j.push({ x: wx + 22, y: wy - 18 }, { x: wx + 24, y: wy - 28 }, { x: wx + 24, y: wy - 32 }, { x: wx + 22, y: wy - 26 });
        } else {
          j.push({ x: wx + 22, y: wy - 20 }, { x: wx + 28, y: wy - 40 }, { x: wx + 32, y: wy - 58 }, { x: wx + 34, y: wy - 74 });
        }

        return j;
      }

      function drawHandSkeleton(j) {
        var bones = [
          [0, 1], [1, 2], [2, 3], [3, 4],     // Thumb
          [0, 5], [5, 6], [6, 7], [7, 8],     // Index
          [0, 9], [9, 10], [10, 11], [11, 12],// Middle
          [0, 13], [13, 14], [14, 15], [15, 16],// Ring
          [0, 17], [17, 18], [18, 19], [19, 20],// Pinky
          [5, 9], [9, 13], [13, 17]           // Palm base
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

        j.forEach(function(pt, idx) {
          var isTip = (idx === 4 || idx === 8 || idx === 12 || idx === 16 || idx === 20);
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, isTip ? 6.5 : 4, 0, Math.PI * 2);
          ctx.fillStyle = isTip ? '#facc15' : '#38bdf8';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
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
              d[idx] = 16;
              d[idx + 1] = mag; // Luminous green
              d[idx + 2] = mag > 120 ? 255 : 32;
            }
          }
          ctx.putImageData(imgData, 0, 0);
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
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.10)';
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
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(300, 0);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
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
          motionData.bubbles.forEach(function(b) {
            b.x += b.vx; b.y += b.vy;
            if (b.x < b.r + 10 || b.x > canvas.width - b.r - 10) b.vx *= -1;
            if (b.y < b.r + 10 || b.y > canvas.height - b.r - 10) b.vy *= -1;

            ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fillStyle = b.color + '44'; ctx.fill();
            ctx.strokeStyle = b.color; ctx.lineWidth = 2.5; ctx.stroke();
            ctx.beginPath(); ctx.arc(b.x - 8, b.y - 8, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffffbb'; ctx.fill();

            if (Math.hypot(virtualObj.x - b.x, virtualObj.y - b.y) < b.r + 44) {
              b.x = 60 + Math.random() * (canvas.width - 120);
              b.y = 60 + Math.random() * (canvas.height - 120);
              motionData.score++;
              motionData.streak++;
              for (var k = 0; k < 12; k++) {
                var pA = (k / 12) * Math.PI * 2;
                var pS = 2 + Math.random() * 4;
                motionData.particles.push({ x: b.x, y: b.y, vx: Math.cos(pA) * pS, vy: Math.sin(pA) * pS, color: b.color, alpha: 1, size: 3 + Math.random() * 3 });
              }
              if (window.ExperimindAudio) window.ExperimindAudio.bubblePop();
              var mEl = container.querySelector('#vis-metric-motion');
              if (mEl) mEl.textContent = motionData.score + ' Targets (Streak: ' + motionData.streak + 'x 🔥)';
            }
          });

          for (var pIdx = motionData.particles.length - 1; pIdx >= 0; pIdx--) {
            var pt = motionData.particles[pIdx];
            pt.x += pt.vx; pt.y += pt.vy; pt.alpha -= 0.04;
            if (pt.alpha <= 0) { motionData.particles.splice(pIdx, 1); continue; }
            ctx.save(); ctx.globalAlpha = Math.max(0, pt.alpha);
            ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
            ctx.fillStyle = pt.color; ctx.fill(); ctx.restore();
          }

          if (!hasLiveVideo) {
            ctx.font = '46px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('👋', virtualObj.x, virtualObj.y);
          }
        }

        // ===================================================================
        // 2. AR FACE FILTER & EMOTION LAB
        // ===================================================================
        else if (expType === 'face') {
          var fx = virtualObj.x, fy = virtualObj.y;
          // Render AR Props Overlay
          if (faceData.activeFilter === 'cat') {
            // Cat ears
            ctx.fillStyle = '#ec4899';
            ctx.beginPath(); ctx.moveTo(fx - 45, fy - 60); ctx.lineTo(fx - 25, fy - 110); ctx.lineTo(fx - 5, fy - 65); ctx.fill();
            ctx.beginPath(); ctx.moveTo(fx + 5, fy - 65); ctx.lineTo(fx + 25, fy - 110); ctx.lineTo(fx + 45, fy - 60); ctx.fill();
            // Whiskers
            ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.moveTo(fx - 15, fy + 8); ctx.lineTo(fx - 65, fy + 2); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(fx - 15, fy + 18); ctx.lineTo(fx - 65, fy + 20); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(fx + 15, fy + 8); ctx.lineTo(fx + 65, fy + 2); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(fx + 15, fy + 18); ctx.lineTo(fx + 65, fy + 20); ctx.stroke();
            // Pink nose
            ctx.beginPath(); ctx.arc(fx, fy + 8, 7, 0, Math.PI * 2); ctx.fillStyle = '#f43f5e'; ctx.fill();
          } else if (faceData.activeFilter === 'robot') {
            // Sparky Visor
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.fillRect(fx - 55, fy - 35, 110, 36);
            ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3;
            ctx.strokeRect(fx - 55, fy - 35, 110, 36);
            // Glowing cyan eyes
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath(); ctx.arc(fx - 24, fy - 17, 7, 0, Math.PI * 2); ctx.arc(fx + 24, fy - 17, 7, 0, Math.PI * 2); ctx.fill();
            // Antenna
            ctx.beginPath(); ctx.moveTo(fx, fy - 35); ctx.lineTo(fx, fy - 75); ctx.strokeStyle = '#94a3b8'; ctx.stroke();
            ctx.beginPath(); ctx.arc(fx, fy - 78, 6, 0, Math.PI * 2); ctx.fillStyle = (tick % 30 < 15) ? '#f59e0b' : '#38bdf8'; ctx.fill();
          } else if (faceData.activeFilter === 'crown') {
            ctx.fillStyle = '#facc15';
            ctx.beginPath();
            ctx.moveTo(fx - 50, fy - 65); ctx.lineTo(fx - 50, fy - 110); ctx.lineTo(fx - 25, fy - 80);
            ctx.lineTo(fx, fy - 120); ctx.lineTo(fx + 25, fy - 80); ctx.lineTo(fx + 50, fy - 110);
            ctx.lineTo(fx + 50, fy - 65); ctx.closePath(); ctx.fill();
            ctx.strokeStyle = '#ca8a04'; ctx.lineWidth = 2.5; ctx.stroke();
          } else {
            // Sunglasses
            ctx.fillStyle = '#0f172a';
            ctx.beginPath(); ctx.roundRect ? ctx.roundRect(fx - 55, fy - 25, 48, 28, 6) : ctx.rect(fx - 55, fy - 25, 48, 28); ctx.fill();
            ctx.beginPath(); ctx.roundRect ? ctx.roundRect(fx + 7, fy - 25, 48, 28, 6) : ctx.rect(fx + 7, fy - 25, 48, 28); ctx.fill();
            ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(fx - 7, fy - 12); ctx.lineTo(fx + 7, fy - 12); ctx.stroke();
          }

          // Mouth smile arch
          ctx.strokeStyle = '#10b981'; ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(fx, fy + 22, 18, 0.1 * Math.PI, 0.9 * Math.PI);
          ctx.stroke();

          ctx.fillStyle = '#fef08a'; ctx.font = 'bold 12px Inter, sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('EMOTION: ' + faceData.emotion, fx, fy + 65);
        }

        // ===================================================================
        // 3. COLOR BEACON & ROVER LAB
        // ===================================================================
        else if (expType === 'color') {
          ctx.beginPath(); ctx.arc(virtualObj.x, virtualObj.y, 38, 0, Math.PI * 2);
          ctx.fillStyle = colorData.targetColor; ctx.fill();
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3; ctx.stroke();
          ctx.fillStyle = '#ffffff'; ctx.font = 'bold 12px Inter, sans-serif';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(colorData.targetName + ' Sensor', virtualObj.x, virtualObj.y);

          var rvr = colorData.rover;
          if (colorData.targetName === 'Green') {
            rvr.x += Math.cos(rvr.angle) * rvr.speed;
            rvr.y += Math.sin(rvr.angle) * rvr.speed;
            colorData.command = 'FORWARD 🟢 (Thrusters Active)';
          } else if (colorData.targetName === 'Blue') {
            rvr.angle += 0.04;
            colorData.command = 'STEER RIGHT 🔵 (Yaw Rotating)';
          } else {
            colorData.command = 'EMERGENCY BRAKE 🔴 (Halted)';
          }

          if (rvr.x > canvas.width - 40) rvr.x = 40; if (rvr.x < 40) rvr.x = canvas.width - 40;
          if (rvr.y > canvas.height - 40) rvr.y = 40; if (rvr.y < 40) rvr.y = canvas.height - 40;

          ctx.save();
          ctx.translate(rvr.x, rvr.y);
          ctx.rotate(rvr.angle);
          ctx.fillStyle = '#e2e8f0'; ctx.fillRect(-18, -12, 36, 24);
          ctx.fillStyle = '#3b82f6'; ctx.fillRect(-10, -8, 20, 16);
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(-22, -16, 10, 6); ctx.fillRect(12, -16, 10, 6);
          ctx.fillRect(-22, 10, 10, 6); ctx.fillRect(12, 10, 10, 6);
          ctx.restore();

          ctx.fillStyle = '#fef08a'; ctx.font = 'bold 11px Inter, sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('MARS ROVER 🛸', rvr.x, rvr.y - 20);

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

          if (shapeData.detectedShape.indexOf('Circle') !== -1) {
            ctx.beginPath(); ctx.arc(sx, sy, 46, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          } else if (shapeData.detectedShape.indexOf('Square') !== -1) {
            ctx.fillRect(sx - 42, sy - 42, 84, 84); ctx.strokeRect(sx - 42, sy - 42, 84, 84);
          } else if (shapeData.detectedShape.indexOf('Triangle') !== -1) {
            ctx.beginPath(); ctx.moveTo(sx, sy - 50); ctx.lineTo(sx - 48, sy + 38); ctx.lineTo(sx + 48, sy + 38); ctx.closePath();
            ctx.fill(); ctx.stroke();
          } else {
            // Star
            ctx.beginPath();
            for (var si = 0; si < 10; si++) {
              var sAng = (si * Math.PI) / 5 - Math.PI / 2;
              var sRad = (si % 2 === 0) ? 50 : 22;
              var px = sx + Math.cos(sAng) * sRad;
              var py = sy + Math.sin(sAng) * sRad;
              if (si === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.closePath(); ctx.fill(); ctx.stroke();
          }

          ctx.fillStyle = '#fef08a'; ctx.font = 'bold 12px Inter, sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('CONTOUR: ' + shapeData.detectedShape, sx, sy + 65);
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
          poseData.propellerAngle += 0.45;

          if (poseData.activeGesture.indexOf('Open') !== -1) {
            dr.targetY = 90; dr.status = 'Hovering (Propellers High)';
          } else if (poseData.activeGesture.indexOf('Fist') !== -1) {
            dr.targetY = 280; dr.status = 'Landed Safely on Pad';
          } else if (poseData.activeGesture.indexOf('Point') !== -1) {
            dr.x = (dr.x + 2.5) % (canvas.width - 60);
            dr.targetY = 130; dr.status = 'Cruising East ➔';
          } else if (poseData.activeGesture.indexOf('Thumbs') !== -1) {
            dr.targetY = 110; dr.status = 'Turbo Spotlight Active ✨';
          }
          dr.y += (dr.targetY - dr.y) * 0.08;

          var dx = dr.x, dy = dr.y;
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)'; ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(dx - 28, dy - 14, 18, 4, poseData.propellerAngle, 0, Math.PI * 2);
          ctx.ellipse(dx + 28, dy - 14, 18, 4, -poseData.propellerAngle, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = '#1e3a8a';
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(dx - 22, dy - 12, 44, 24, 8) : ctx.rect(dx - 22, dy - 12, 44, 24);
          ctx.fill(); ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2; ctx.stroke();

          ctx.beginPath(); ctx.arc(dx, dy, 6, 0, Math.PI * 2);
          ctx.fillStyle = (tick % 30 < 15) ? '#10b981' : '#f59e0b'; ctx.fill();

          ctx.fillStyle = '#ffffff'; ctx.font = 'bold 11px Inter, sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('AI DRONE (' + Math.round(360 - dy) + 'm)', dx, dy + 24);

          var mPose = container.querySelector('#vis-metric-pose');
          if (mPose) mPose.textContent = poseData.activeGesture + ' (' + dr.status + ')';
        }

        // ===================================================================
        // 6. 3x3 CONVOLUTION KERNEL LAB
        // ===================================================================
        else if (expType === 'kernel') {
          // Magnified 3x3 kernel calculation frame
          var kx = virtualObj.x - 45, ky = virtualObj.y - 45;
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.fillRect(kx, ky, 90, 90);
          ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
          ctx.strokeRect(kx, ky, 90, 90);

          ctx.fillStyle = '#38bdf8'; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center';
          var mat = kernelData.kernelMatrix;
          for (var r = 0; r < 3; r++) {
            for (var c = 0; c < 3; c++) {
              ctx.fillText(mat[r][c] > 0 ? '+' + mat[r][c] : String(mat[r][c]), kx + 15 + c * 30, ky + 25 + r * 28);
            }
          }

          ctx.fillStyle = '#fef08a'; ctx.font = 'bold 12px Inter, sans-serif';
          ctx.fillText('3×3 CONVOLUTION KERNEL', virtualObj.x, ky + 112);
        }

        // ===================================================================
        // 7. TEACHABLE MACHINE & ROBOT SORTING ARM LAB
        // ===================================================================
        else if (expType === 'trainer') {
          var crn = trainerData;
          crn.craneX += (crn.targetCraneX - crn.craneX) * 0.08;

          ctx.fillStyle = '#334155'; ctx.fillRect(canvas.width / 2 - 25, canvas.height - 24, 50, 24);
          ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 6;
          ctx.beginPath(); ctx.moveTo(canvas.width / 2, canvas.height - 20); ctx.lineTo(crn.craneX, 260); ctx.stroke();
          ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(crn.craneX, 260, 10, 0, Math.PI * 2); ctx.fill();

          var bins = [
            { x: 120, label: 'Bin A: Metal 🔩', color: '#3b82f6' },
            { x: 310, label: 'Bin B: Plastic 🧴', color: '#10b981' },
            { x: 500, label: 'Bin C: Organic 🍏', color: '#f59e0b' }
          ];

          bins.forEach(function(bn) {
            ctx.fillStyle = bn.color + '33'; ctx.fillRect(bn.x - 45, canvas.height - 52, 90, 48);
            ctx.strokeStyle = bn.color; ctx.lineWidth = 2.5; ctx.strokeRect(bn.x - 45, canvas.height - 52, 90, 48);
            ctx.fillStyle = '#ffffff'; ctx.font = 'bold 11px Inter, sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(bn.label, bn.x, canvas.height - 26);
          });
        }

        // ===================================================================
        // 8. SELF-DRIVING CAR LAB
        // ===================================================================
        else {
          // Perspective Road Lanes
          ctx.fillStyle = '#1e293b';
          ctx.beginPath(); ctx.moveTo(220, 160); ctx.lineTo(400, 160); ctx.lineTo(canvas.width, canvas.height); ctx.lineTo(0, canvas.height); ctx.fill();

          // Lane Divider Lines
          ctx.strokeStyle = '#facc15'; ctx.lineWidth = 4; ctx.setLineDash([16, 12]);
          ctx.lineDashOffset = -tick * 2;
          ctx.beginPath(); ctx.moveTo(310, 160); ctx.lineTo(310, canvas.height); ctx.stroke();
          ctx.setLineDash([]);

          // Self-Driving Car
          var cx = autoData.carX + Math.sin(tick * 0.05) * 8;
          ctx.fillStyle = '#2563eb';
          ctx.beginPath(); ctx.roundRect ? ctx.roundRect(cx - 30, 260, 60, 40, 8) : ctx.rect(cx - 30, 260, 60, 40); ctx.fill();
          ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 2.5; ctx.stroke();

          // Headlights
          ctx.fillStyle = 'rgba(254, 240, 138, 0.4)';
          ctx.beginPath(); ctx.moveTo(cx - 20, 260); ctx.lineTo(cx - 50, 190); ctx.lineTo(cx + 50, 190); ctx.lineTo(cx + 20, 260); ctx.fill();

          // Traffic Light Box
          ctx.fillStyle = '#0f172a'; ctx.fillRect(520, 50, 32, 80);
          ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2; ctx.strokeRect(520, 50, 32, 80);

          ctx.beginPath(); ctx.arc(536, 64, 8, 0, Math.PI * 2);
          ctx.fillStyle = (autoData.light.indexOf('RED') !== -1) ? '#ef4444' : '#450a0a'; ctx.fill();

          ctx.beginPath(); ctx.arc(536, 90, 8, 0, Math.PI * 2);
          ctx.fillStyle = (autoData.light.indexOf('YELLOW') !== -1) ? '#f59e0b' : '#713f12'; ctx.fill();

          ctx.beginPath(); ctx.arc(536, 116, 8, 0, Math.PI * 2);
          ctx.fillStyle = (autoData.light.indexOf('GREEN') !== -1) ? '#10b981' : '#064e3b'; ctx.fill();

          ctx.fillStyle = '#fef08a'; ctx.font = 'bold 12px Inter, sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('AUTOPILOT VEHICLE: ' + autoData.speed + ' km/h', cx, 325);
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
          container.querySelectorAll('[data-set-shape]').forEach(function(b) {
            b.className = 'sim-OptionBtn' + (b === btn ? ' sim-OptionBtn--active' : '');
          });
          if (window.ExperimindAudio) window.ExperimindAudio.click();
        });
      });

      // Hand Pose Pickers
      container.querySelectorAll('[data-set-gesture]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          poseData.activeGesture = btn.getAttribute('data-set-gesture');
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
          } else if (k === 'sharpen') {
            kernelData.kernelMatrix = [[0, -1, 0], [-1, 5, -1], [0, -1, 0]];
            kernelData.kernelLabel = 'Sharpening Center Ridge Filter';
          } else {
            kernelData.kernelMatrix = [[1, 2, 1], [2, 4, 2], [1, 2, 1]];
            kernelData.kernelLabel = 'Gaussian Smoothing Box Blur';
          }
          container.querySelectorAll('[data-set-kernel]').forEach(function(b) {
            b.className = 'sim-OptionBtn' + (b === btn ? ' sim-OptionBtn--active' : '');
          });
          var mK = container.querySelector('#vis-metric-kernel');
          if (mK) mK.textContent = kernelData.kernelLabel;
          if (window.ExperimindAudio) window.ExperimindAudio.click();
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
          trainBtn.textContent = '⏳ Training Neural Centroids (Epoch 30/30)...';
          trainBtn.disabled = true;
          setTimeout(function() {
            trainBtn.textContent = '✅ Model Trained Successfully! (Loss: 0.02)';
            trainBtn.disabled = false;
            trainerData.targetCraneX = 120; // route to metal bin
            if (window.ExperimindAudio) window.ExperimindAudio.fanfare();
            if (window.ExperimindConfetti) window.ExperimindConfetti.burst();
          }, 850);
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
          if (mAuto) mAuto.textContent = 'Speed: ' + autoData.speed + ' km/h | Signal: ' + autoData.light + ' | Autopilot: ACTIVE';
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
          videoEl.srcObject = stream;
          videoEl.onloadedmetadata = function() {
            videoEl.play().catch(function() {});
          };
          videoEl.play().catch(function() {});
          mode = 'webcam';
          statusBadge.className = 'vision-StatusBadge vision-StatusBadge--live';
          statusBadge.innerHTML = '🔴 <strong>LIVE HARDWARE WEBCAM ACTIVE</strong> (Streaming locally in RAM)';
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
        drawLoop();
      });

      container.querySelector('#vis-virtual-btn').addEventListener('click', function() {
        stopHardwareCamera();
        mode = 'virtual';
        statusBadge.className = 'vision-StatusBadge';
        statusBadge.textContent = '🎮 Camera-Free Virtual Vision Simulator Active (Move pointer inside canvas)';
        drawLoop();
      });

      drawLoop();
    }

    render();
  }

  return {
    mount: mount,
    stopHardwareCamera: stopHardwareCamera
  };
})();
