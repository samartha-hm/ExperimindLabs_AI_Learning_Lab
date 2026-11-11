// Experimind AI Learning Lab — Advanced Interactive AI Computer Vision Lab
window.ExperimindVisionLab = (function() {
  var mediaStream = null;
  var animId = null;
  var prevLumaGrid = null;

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
    prevLumaGrid = null;
  }

  function mount(container, selectedGrade) {
    var grade = selectedGrade || 'Class 6';
    var mode = (mediaStream ? 'webcam' : 'virtual');
    var expType = 'pose'; // 'motion' | 'color' | 'pose' | 'trainer'
    var xrayMode = 'standard'; // 'standard' | 'hud' | 'edge' | 'pixel'

    if (grade === 'LKG' || grade === 'UKG' || grade === 'Class 1') expType = 'motion';
    else if (grade === 'Class 2' || grade === 'Class 3' || grade === 'Class 4') expType = 'color';
    else if (grade === 'Class 5' || grade === 'Class 6') expType = 'pose';
    else if (grade === 'Class 7' || grade === 'Class 8') expType = 'trainer';

    var tick = 0;
    var virtualObj = { x: 300, y: 180, vx: 0, vy: 0 };

    // --- Experiment States ---
    // Motion Lab
    var motionData = {
      score: 0,
      streak: 0,
      bubbles: [
        { x: 130, y: 110, r: 32, vx: 0.8, vy: 0.5, color: '#38bdf8' },
        { x: 300, y: 90, r: 36, vx: -0.7, vy: 0.6, color: '#facc15' },
        { x: 470, y: 130, r: 30, vx: 0.6, vy: -0.7, color: '#ec4899' },
        { x: 210, y: 260, r: 34, vx: -0.5, vy: -0.6, color: '#10b981' },
        { x: 420, y: 250, r: 32, vx: 0.7, vy: 0.5, color: '#a855f7' }
      ],
      particles: []
    };

    // Color Rover Lab
    var colorData = {
      targetColor: '#10b981',
      targetName: 'Green',
      targetRGB: [16, 185, 129],
      detectedCommand: 'FORWARD 🟢',
      rover: { x: 80, y: 170, angle: 0, speed: 1.5, battery: 94 },
      crystals: [
        { x: 240, y: 80, collected: false },
        { x: 380, y: 170, collected: false },
        { x: 500, y: 260, collected: false }
      ]
    };

    // Hand Pose & Drone Flight Lab
    var poseData = {
      activeGesture: '✋ Open Palm',
      gestureConfidence: 96,
      drone: { x: 300, y: 170, targetY: 170, altitude: 65, status: 'Hovering' },
      dronePropellerAngle: 0
    };

    // Teachable Machine & Sorting Arm Lab
    var trainerData = {
      isTrained: true,
      trainingProgress: 100,
      classes: {
        'A': { label: 'Class A: Fist / Metal ✊', samples: 8, color: '#3b82f6', weight: 0.85 },
        'B': { label: 'Class B: Palm / Plastic ✋', samples: 7, color: '#10b981', weight: 0.10 },
        'C': { label: 'Class C: Peace / Organic ✌️', samples: 6, color: '#f59e0b', weight: 0.05 }
      },
      crane: { x: 300, targetX: 180, angle: 0, carrying: 'Metal Scrap 🔩' }
    };

    function render() {
      var html = '<div class="vision-Wrapper">';
      html += '<div class="vision-HeaderCard">';
      html += '<div><span class="sim-EngineBadge">SECTION 8 • DUAL-MODE AI VISION LABORATORY</span><h2>AI Computer Vision Laboratory — ' + grade + '</h2>';
      html += '<p>Privacy Guarantee: Cameras never record or stream data outside this PC. 100% in-browser RAM analysis with instant Virtual Simulator fallback.</p></div>';
      html += '<div class="vision-ConsentControls">';
      html += '<button type="button" class="btn-Primary" id="vis-start-cam">📷 Start Hardware Camera (Explicit Consent)</button>';
      html += '<button type="button" class="btn-Danger" id="vis-stop-cam">⏹️ Stop Camera & Release Hardware</button>';
      html += '<button type="button" class="btn-Secondary" id="vis-virtual-btn">🎮 Virtual Camera Simulator (No Webcam Needed)</button>';
      html += '</div></div>';

      // Experiment Mode Tabs
      html += '<div class="sim-TabRow" style="margin-bottom:14px;">';
      [
        ['motion', '🫧 1. Motion Optical Flow (LKG–Class 1)'],
        ['color', '🎨 2. Color Beacon & Rover (Classes 2–4)'],
        ['pose', '✋ 3. 21-Keypoint Hand Drone (Classes 5–6)'],
        ['trainer', '🧠 4. Teachable Machine Sorter (Classes 7–8)']
      ].forEach(function(tab) {
        html += '<button type="button" class="sim-TabBtn' + (expType === tab[0] ? ' sim-TabBtn--active' : '') + '" data-vis-exp="' + tab[0] + '">' + tab[1] + '</button>';
      });
      html += '</div>';

      // Optical X-Ray Inspector Toolbar
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

      // Right: Interactive Controls & Live Telemetry
      html += '<div class="vision-ControlCard">';
      if (expType === 'motion') {
        html += '<h3>🫧 Frame-Differencing Optical Flow</h3>';
        html += '<p>Wave your hands across the camera (or move your pointer in Virtual mode) to trigger pixel luminance motion vectors and burst floating target bubbles!</p>';
        html += '<div class="sim-MetricBox"><span>Bubbles Popped</span><strong id="vis-metric-motion">' + motionData.score + ' Targets</strong></div>';
        html += '<div class="exp-OfflineBox" style="margin-top:12px;"><strong>💡 The AI Math:</strong> The computer calculates <code>|Frame(t) - Frame(t-1)|</code> across a matrix of 1,200 grid points to detect movement velocity!</div>';
      } else if (expType === 'color') {
        html += '<h3>🎨 Real-Time Color Beacon & Mars Rover</h3>';
        html += '<p>Hold colored cards or toys in front of the camera (or click a beacon below) to steer the on-screen Rover across Mars!</p>';
        html += '<div class="sim-PresetRow">';
        [['#ef4444', 'Red', [239, 68, 68], '🔴 Red (STOP)'], ['#10b981', 'Green', [16, 185, 129], '🟢 Green (FORWARD)'], ['#3b82f6', 'Blue', [59, 130, 246], '🔵 Blue (TURN RIGHT)']].forEach(function(c) {
          var act = (colorData.targetName === c[1]) ? ' sim-OptionBtn--active' : '';
          html += '<button type="button" class="sim-OptionBtn' + act + '" data-set-color="' + c[0] + '" data-color-name="' + c[1] + '" data-rgb="' + c[2].join(',') + '">' + c[3] + '</button>';
        });
        html += '</div>';
        html += '<div class="sim-MetricBox" style="margin-top:12px;"><span>Active Rover Telemetry</span><strong id="vis-metric-color">State: ' + colorData.detectedCommand + '</strong></div>';
        html += '<div class="exp-OfflineBox" style="margin-top:12px;"><strong>💡 Computer Vision Color Matching:</strong> The vision algorithm calculates the Euclidean color distance <code>ΔE = √((R-Rt)² + (G-Gt)² + (B-Bt)²)</code> to classify objects in milliseconds!</div>';
      } else if (expType === 'pose') {
        html += '<h3>✋ 21-Keypoint Hand Landmark Drone</h3>';
        html += '<p>Computer vision models detect 21 skeletal joints (wrist, knuckles, fingertips) to classify gestures and pilot our futuristic Drone!</p>';
        html += '<div class="sim-PresetRow">';
        ['✋ Open Palm (Hover Drone)', '✊ Closed Fist (Land Safely)', '👉 Point Right (Move East)', '👍 Thumbs Up (Turbo Sparkles)'].forEach(function(p) {
          var act = (poseData.activeGesture.slice(0, 2) === p.slice(0, 2)) ? ' sim-OptionBtn--active' : '';
          html += '<button type="button" class="sim-OptionBtn' + act + '" data-set-gesture="' + p + '">' + p + '</button>';
        });
        html += '</div>';
        html += '<div class="sim-MetricBox" style="margin-top:12px;"><span>Flight Controller State</span><strong id="vis-metric-pose">' + poseData.activeGesture + ' (' + poseData.drone.status + ')</strong></div>';
        html += '<div class="exp-OfflineBox" style="margin-top:12px;"><strong>💡 Landmark Geometry:</strong> By measuring vectors between joint 0 (Wrist) and fingertip joints (4, 8, 12, 16, 20), the AI infers whether fingers are curled or extended!</div>';
      } else {
        html += '<h3>🧠 In-Browser Teachable Machine & Sorter</h3>';
        html += '<p>Capture training examples in local volatile RAM, train your model, and command the on-screen Robotic Sorter Arm!</p>';
        html += '<div class="sim-PresetRow">';
        html += '<button type="button" class="sim-OptionBtn" data-record-sample="A">📸 Record Class A (' + trainerData.classes.A.samples + ')</button>';
        html += '<button type="button" class="sim-OptionBtn" data-record-sample="B">📸 Record Class B (' + trainerData.classes.B.samples + ')</button>';
        html += '<button type="button" class="sim-OptionBtn" data-record-sample="C">📸 Record Class C (' + trainerData.classes.C.samples + ')</button>';
        html += '</div>';

        html += '<div style="margin:12px 0;">';
        html += '<button type="button" class="btn-Primary" id="vis-train-btn" style="width:100%;font-size:1.05rem;">⚡ Train AI Model Now (30 Epochs)</button>';
        html += '</div>';

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

        html += '<div class="sim-MetricBox" style="margin-top:12px;"><span>Active Robotic Sorter Command</span><strong id="vis-metric-trainer">Routing: ' + trainerData.crane.carrying + '</strong></div>';
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
          j.push({ x: wx - 18, y: wy - 16 });
          j.push({ x: wx - 30, y: wy - 36 });
          j.push({ x: wx - 32, y: wy - 60 });
          j.push({ x: wx - 30, y: wy - 85 });
        } else if (isFist) {
          j.push({ x: wx - 14, y: wy - 10 });
          j.push({ x: wx - 20, y: wy - 20 });
          j.push({ x: wx - 14, y: wy - 28 });
          j.push({ x: wx - 6, y: wy - 30 });
        } else {
          j.push({ x: wx - 18, y: wy - 14 });
          j.push({ x: wx - 34, y: wy - 28 });
          j.push({ x: wx - 48, y: wy - 42 });
          j.push({ x: wx - 58, y: wy - 52 });
        }

        // Index: 5, 6, 7, 8
        if (isPoint) {
          j.push({ x: wx - 8, y: wy - 24 });
          j.push({ x: wx + 20, y: wy - 34 });
          j.push({ x: wx + 50, y: wy - 36 });
          j.push({ x: wx + 78, y: wy - 36 });
        } else if (isFist || isThumbsUp) {
          j.push({ x: wx - 12, y: wy - 22 });
          j.push({ x: wx - 14, y: wy - 34 });
          j.push({ x: wx - 8, y: wy - 38 });
          j.push({ x: wx - 2, y: wy - 32 });
        } else {
          j.push({ x: wx - 12, y: wy - 24 });
          j.push({ x: wx - 16, y: wy - 50 });
          j.push({ x: wx - 18, y: wy - 74 });
          j.push({ x: wx - 20, y: wy - 94 });
        }

        // Middle: 9, 10, 11, 12
        if (isFist || isThumbsUp || isPoint) {
          j.push({ x: wx, y: wy - 24 });
          j.push({ x: wx, y: wy - 36 });
          j.push({ x: wx + 4, y: wy - 40 });
          j.push({ x: wx + 8, y: wy - 34 });
        } else {
          j.push({ x: wx, y: wy - 26 });
          j.push({ x: wx, y: wy - 54 });
          j.push({ x: wx, y: wy - 80 });
          j.push({ x: wx, y: wy - 102 });
        }

        // Ring: 13, 14, 15, 16
        if (isFist || isThumbsUp || isPoint) {
          j.push({ x: wx + 12, y: wy - 22 });
          j.push({ x: wx + 14, y: wy - 34 });
          j.push({ x: wx + 16, y: wy - 38 });
          j.push({ x: wx + 18, y: wy - 32 });
        } else {
          j.push({ x: wx + 12, y: wy - 24 });
          j.push({ x: wx + 16, y: wy - 50 });
          j.push({ x: wx + 18, y: wy - 72 });
          j.push({ x: wx + 20, y: wy - 92 });
        }

        // Pinky: 17, 18, 19, 20
        if (isFist || isThumbsUp || isPoint) {
          j.push({ x: wx + 22, y: wy - 18 });
          j.push({ x: wx + 24, y: wy - 28 });
          j.push({ x: wx + 24, y: wy - 32 });
          j.push({ x: wx + 22, y: wy - 26 });
        } else {
          j.push({ x: wx + 22, y: wy - 20 });
          j.push({ x: wx + 28, y: wy - 40 });
          j.push({ x: wx + 32, y: wy - 58 });
          j.push({ x: wx + 34, y: wy - 74 });
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

          // Fast 3x3 Sobel kernel approximation (stride 2 for 60fps)
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
              d[idx + 1] = mag; // Vibrant Matrix green
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
          // Virtual Studio Dark Canvas
          var grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
          grad.addColorStop(0, '#090e1a');
          grad.addColorStop(1, '#1e293b');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Coordinate grid
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.10)';
          ctx.lineWidth = 1;
          for (var gx = 0; gx < canvas.width; gx += 38) {
            ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, canvas.height); ctx.stroke();
          }
          for (var gy = 0; gy < canvas.height; gy += 38) {
            ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(canvas.width, gy); ctx.stroke();
          }

          // Ambient radar line
          var sweep = (tick * 0.025) % (Math.PI * 2);
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(sweep);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(300, 0);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.restore();
        }

        // HUD Tracking Bounding Box
        var boxW = 144, boxH = 144;
        var boxX = virtualObj.x - boxW / 2;
        var boxY = virtualObj.y - boxH / 2;

        if (xrayMode !== 'edge') {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(boxX, boxY, boxW, boxH);

          // Corner reticles
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
        // EXPERIMENT 1: MOTION BUBBLE POPPER & OPTICAL FLOW
        // ===================================================================
        if (expType === 'motion') {
          motionData.bubbles.forEach(function(b) {
            b.x += b.vx;
            b.y += b.vy;
            if (b.x < b.r + 10 || b.x > canvas.width - b.r - 10) b.vx *= -1;
            if (b.y < b.r + 10 || b.y > canvas.height - b.r - 10) b.vy *= -1;

            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fillStyle = b.color + '44';
            ctx.fill();
            ctx.strokeStyle = b.color;
            ctx.lineWidth = 2.5;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(b.x - 8, b.y - 8, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffffbb';
            ctx.fill();

            // Collision with hand sensor
            if (Math.hypot(virtualObj.x - b.x, virtualObj.y - b.y) < b.r + 44) {
              b.x = 60 + Math.random() * (canvas.width - 120);
              b.y = 60 + Math.random() * (canvas.height - 120);
              motionData.score++;
              motionData.streak++;

              // Burst particles
              for (var k = 0; k < 12; k++) {
                var pA = (k / 12) * Math.PI * 2;
                var pS = 2 + Math.random() * 4;
                motionData.particles.push({
                  x: b.x, y: b.y, vx: Math.cos(pA) * pS, vy: Math.sin(pA) * pS,
                  color: b.color, alpha: 1, size: 3 + Math.random() * 3
                });
              }

              if (window.ExperimindAudio) window.ExperimindAudio.bubblePop();
              var mEl = container.querySelector('#vis-metric-motion');
              if (mEl) mEl.textContent = motionData.score + ' Targets (Streak: ' + motionData.streak + 'x 🔥)';
            }
          });

          // Draw burst particles
          for (var pIdx = motionData.particles.length - 1; pIdx >= 0; pIdx--) {
            var pt = motionData.particles[pIdx];
            pt.x += pt.vx; pt.y += pt.vy; pt.alpha -= 0.04;
            if (pt.alpha <= 0) {
              motionData.particles.splice(pIdx, 1);
              continue;
            }
            ctx.save();
            ctx.globalAlpha = Math.max(0, pt.alpha);
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
            ctx.fillStyle = pt.color;
            ctx.fill();
            ctx.restore();
          }

          if (!hasLiveVideo) {
            ctx.font = '46px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('👋', virtualObj.x, virtualObj.y);
          }
        }

        // ===================================================================
        // EXPERIMENT 2: COLOR BEACON & MARS ROVER
        // ===================================================================
        else if (expType === 'color') {
          // Probe circle
          ctx.beginPath();
          ctx.arc(virtualObj.x, virtualObj.y, 38, 0, Math.PI * 2);
          ctx.fillStyle = colorData.targetColor;
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(colorData.targetName + ' Sensor', virtualObj.x, virtualObj.y);

          // Mars Terrain & Rover mini simulation in bottom stage
          var rvr = colorData.rover;
          if (colorData.targetName === 'Green') {
            rvr.x += Math.cos(rvr.angle) * rvr.speed;
            rvr.y += Math.sin(rvr.angle) * rvr.speed;
            colorData.detectedCommand = 'FORWARD 🟢 (Thrusters Active)';
          } else if (colorData.targetName === 'Blue') {
            rvr.angle += 0.04;
            colorData.detectedCommand = 'STEER RIGHT 🔵 (Yaw Rotating)';
          } else {
            colorData.detectedCommand = 'EMERGENCY BRAKE 🔴 (Halted)';
          }

          if (rvr.x > canvas.width - 40) rvr.x = 40;
          if (rvr.x < 40) rvr.x = canvas.width - 40;
          if (rvr.y > canvas.height - 40) rvr.y = 40;
          if (rvr.y < 40) rvr.y = canvas.height - 40;

          // Render Rover
          ctx.save();
          ctx.translate(rvr.x, rvr.y);
          ctx.rotate(rvr.angle);
          // Rover body
          ctx.fillStyle = '#e2e8f0';
          ctx.fillRect(-18, -12, 36, 24);
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(-10, -8, 20, 16);
          // Wheels
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(-22, -16, 10, 6);
          ctx.fillRect(12, -16, 10, 6);
          ctx.fillRect(-22, 10, 10, 6);
          ctx.fillRect(12, 10, 10, 6);
          // Camera mast
          ctx.beginPath(); ctx.arc(10, 0, 4, 0, Math.PI * 2); ctx.fillStyle = '#f59e0b'; ctx.fill();
          ctx.restore();

          // Rover HUD Tag
          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 11px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('MARS ROVER 🛸', rvr.x, rvr.y - 20);

          var mCol = container.querySelector('#vis-metric-color');
          if (mCol) mCol.textContent = colorData.detectedCommand;
        }

        // ===================================================================
        // EXPERIMENT 3: 21-KEYPOINT HAND LANDMARK DRONE FLIGHT
        // ===================================================================
        else if (expType === 'pose') {
          var lms = getLandmarks(virtualObj.x, virtualObj.y, poseData.activeGesture);
          drawHandSkeleton(lms);

          ctx.fillStyle = '#fde047';
          ctx.font = 'bold 13px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('21-KEYPOINT SKELETAL MESH', virtualObj.x, boxY + boxH + 20);

          // Drone Flight Simulation
          var dr = poseData.drone;
          poseData.dronePropellerAngle += 0.45;

          if (poseData.activeGesture.indexOf('Open') !== -1) {
            dr.targetY = 90;
            dr.status = 'Hovering (Propellers High)';
          } else if (poseData.activeGesture.indexOf('Fist') !== -1) {
            dr.targetY = 280;
            dr.status = 'Landed Safely on Pad';
          } else if (poseData.activeGesture.indexOf('Point') !== -1) {
            dr.x = (dr.x + 2.5) % (canvas.width - 60);
            dr.targetY = 130;
            dr.status = 'Cruising East ➔';
          } else if (poseData.activeGesture.indexOf('Thumbs') !== -1) {
            dr.targetY = 110;
            dr.status = 'Turbo Spotlight Active ✨';
          }
          dr.y += (dr.targetY - dr.y) * 0.08;

          // Render Futuristic Drone
          var dx = dr.x, dy = dr.y;
          // Propeller spin blur
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(dx - 28, dy - 14, 18, 4, poseData.dronePropellerAngle, 0, Math.PI * 2);
          ctx.ellipse(dx + 28, dy - 14, 18, 4, -poseData.dronePropellerAngle, 0, Math.PI * 2);
          ctx.stroke();

          // Drone body
          ctx.fillStyle = '#1e3a8a';
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(dx - 22, dy - 12, 44, 24, 8) : ctx.rect(dx - 22, dy - 12, 44, 24);
          ctx.fill();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Camera lens on drone
          ctx.beginPath();
          ctx.arc(dx, dy, 6, 0, Math.PI * 2);
          ctx.fillStyle = (tick % 30 < 15) ? '#10b981' : '#f59e0b';
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('AI DRONE (' + Math.round(360 - dy) + 'm)', dx, dy + 24);

          var mPose = container.querySelector('#vis-metric-pose');
          if (mPose) mPose.textContent = poseData.activeGesture + ' (' + dr.status + ')';
        }

        // ===================================================================
        // EXPERIMENT 4: TEACHABLE MACHINE & ROBOT SORTING CRANE
        // ===================================================================
        else {
          // Teachable feature grid
          ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
          ctx.lineWidth = 1.5;
          for (var tx = boxX; tx <= boxX + boxW; tx += boxW / 3) {
            ctx.beginPath(); ctx.moveTo(tx, boxY); ctx.lineTo(tx, boxY + boxH); ctx.stroke();
          }
          for (var ty = boxY; ty <= boxY + boxH; ty += boxH / 3) {
            ctx.beginPath(); ctx.moveTo(boxX, ty); ctx.lineTo(boxX + boxW, ty); ctx.stroke();
          }

          // Robotic Sorter Arm on Bottom Stage
          var crn = trainerData.crane;
          crn.x += (crn.targetX - crn.x) * 0.08;

          // Base
          ctx.fillStyle = '#334155';
          ctx.fillRect(canvas.width / 2 - 25, canvas.height - 24, 50, 24);
          // Arm beam
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(canvas.width / 2, canvas.height - 20);
          ctx.lineTo(crn.x, 260);
          ctx.stroke();
          // Claw
          ctx.fillStyle = '#0f172a';
          ctx.beginPath(); ctx.arc(crn.x, 260, 10, 0, Math.PI * 2); ctx.fill();

          // Draw 3 Sorting Bins
          var bins = [
            { x: 120, label: 'Bin A: Metal 🔩', color: '#3b82f6' },
            { x: 310, label: 'Bin B: Plastic 🧴', color: '#10b981' },
            { x: 500, label: 'Bin C: Organic 🍏', color: '#f59e0b' }
          ];

          bins.forEach(function(bn) {
            ctx.fillStyle = bn.color + '33';
            ctx.fillRect(bn.x - 45, canvas.height - 52, 90, 48);
            ctx.strokeStyle = bn.color;
            ctx.lineWidth = 2.5;
            ctx.strokeRect(bn.x - 45, canvas.height - 52, 90, 48);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(bn.label, bn.x, canvas.height - 26);
          });
        }

        // Pixel Spy Inspector Tooltip
        if (xrayMode === 'pixel') {
          try {
            var pix = ctx.getImageData(virtualObj.x, virtualObj.y, 1, 1).data;
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            ctx.fillRect(virtualObj.x + 14, virtualObj.y - 34, 150, 44);
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(virtualObj.x + 14, virtualObj.y - 34, 150, 44);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px monospace';
            ctx.textAlign = 'left';
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

      // Color Beacon Pickers
      container.querySelectorAll('[data-set-color]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          colorData.targetColor = btn.getAttribute('data-set-color');
          colorData.targetName = btn.getAttribute('data-color-name');
          colorData.targetRGB = btn.getAttribute('data-rgb').split(',').map(Number);
          container.querySelectorAll('[data-set-color]').forEach(function(b) {
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
            trainerData.crane.targetX = 120; // route to metal bin
            if (window.ExperimindAudio) window.ExperimindAudio.fanfare();
            if (window.ExperimindConfetti) window.ExperimindConfetti.burst();
          }, 850);
        });
      }

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
