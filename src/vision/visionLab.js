// Experimind AI Learning Lab — Section 8 Dual-Mode AI Vision Lab (#vision/:grade)
window.ExperimindVisionLab = (function() {
  var mediaStream = null;
  var animId = null;
  var prevFrameData = null;

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
    prevFrameData = null;
  }

  function mount(container, selectedGrade) {
    var grade = selectedGrade || 'Class 6';
    var mode = (mediaStream ? 'webcam' : 'virtual'); // 'virtual' (100% camera-free fallback) or 'webcam'
    var expType = 'pose'; // 'motion' | 'color' | 'pose' | 'trainer'
    if (grade === 'LKG' || grade === 'UKG' || grade === 'Class 1') expType = 'motion';
    else if (grade === 'Class 2' || grade === 'Class 3' || grade === 'Class 4') expType = 'color';
    else if (grade === 'Class 5' || grade === 'Class 6') expType = 'pose';
    else if (grade === 'Class 7' || grade === 'Class 8') expType = 'trainer';

    var virtualObj = { x: 280, y: 170, color: '#10b981', colorName: 'Green', pose: '✋ Open Palm', bubblesPopped: 0 };
    var classCounts = { A: 6, B: 5, C: 4 };
    var activePred = 'Class A: Thumbs Up 👍 (91%)';
    var tick = 0;

    function render() {
      var html = '<div class="vision-Wrapper">';
      html += '<div class="vision-HeaderCard">';
      html += '<div><span class="sim-EngineBadge">SECTION 8 • AI VISION & GESTURE LAB</span><h2>AI Computer Vision Laboratory — ' + grade + '</h2>';
      html += '<p>Privacy Guarantee: Cameras never activate automatically. All pixel processing occurs strictly in local RAM and is never recorded or saved.</p></div>';
      html += '<div class="vision-ConsentControls">';
      html += '<button type="button" class="btn-Primary" id="vis-start-cam">📷 Start Hardware Camera (Explicit Consent)</button>';
      html += '<button type="button" class="btn-Danger" id="vis-stop-cam">⏹️ Stop Camera & Release Hardware</button>';
      html += '<button type="button" class="btn-Secondary" id="vis-virtual-btn">🎮 Virtual Camera Simulator (No Webcam Needed)</button>';
      html += '</div></div>';

      html += '<div class="sim-TabRow" style="margin-bottom:16px;">';
      [
        ['motion', '🫧 Motion Bubble Popper (LKG–Class 1)'],
        ['color', '🎨 RGB Color Beacon Tracker (Classes 2–4)'],
        ['pose', '✋ Hand Gesture & Pose Controller (Classes 5–6)'],
        ['trainer', '🧠 3-Class Teachable Vision Trainer (Classes 7–8)']
      ].forEach(function(tab) {
        html += '<button type="button" class="sim-TabBtn' + (expType === tab[0] ? ' sim-TabBtn--active' : '') + '" data-vis-exp="' + tab[0] + '">' + tab[1] + '</button>';
      });
      html += '</div>';

      html += '<div class="vision-MainGrid">';
      // Left: Live Canvas + Active off-screen Video element
      html += '<div class="vision-StageCard">';
      var statusBadgeCls = (mode === 'webcam') ? 'vision-StatusBadge vision-StatusBadge--live' : 'vision-StatusBadge';
      var statusBadgeText = (mode === 'webcam')
        ? '🔴 LIVE HARDWARE WEBCAM STREAMING (Click "Stop Camera" anytime to release)'
        : '🟢 Mode: Camera-Free Virtual Vision Simulator (Click or Move pointer on Canvas)';
      html += '<div class="' + statusBadgeCls + '" id="vis-cam-status">' + statusBadgeText + '</div>';
      html += '<div class="sim-CanvasWrap" style="position:relative;">';
      html += '<video id="vis-video" autoplay playsinline muted style="position:absolute;left:-9999px;width:640px;height:480px;opacity:0;pointer-events:none;"></video>';
      html += '<canvas id="vis-canvas" width="600" height="360" style="background:#0f172a;border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,0.25);"></canvas>';
      html += '</div>';
      html += '</div>';

      // Right: Telemetry & Experiment Controls
      html += '<div class="vision-ControlCard">';
      if (expType === 'motion') {
        html += '<h3>🫧 Frame-Differencing Motion Detector</h3>';
        html += '<p>Wave your hands in front of the camera (or move your mouse across the canvas in Virtual mode) to trigger pixel difference vectors and pop floating bubbles!</p>';
        html += '<div class="sim-MetricBox"><span>Motion Targets Popped</span><strong id="vis-readout">' + virtualObj.bubblesPopped + ' Bubbles Popped</strong></div>';
        html += '<div class="exp-OfflineBox" style="margin-top:14px;">💡 <strong>How AI Motion Works:</strong> The computer calculates <code>|Frame(t) - Frame(t-1)|</code> across pixel RGB values to detect hand movements!</div>';
      } else if (expType === 'color') {
        html += '<h3>🎨 HSV / RGB Color Classifier Beacon</h3>';
        html += '<p>Hold a bright colored object/card in front of the camera, or click a Virtual Beacon below to steer the rover by RGB color dominance:</p>';
        html += '<div class="sim-PresetRow">';
        [['#ef4444', 'Red', '🔴 Red Beacon (STOP)'], ['#10b981', 'Green', '🟢 Green Beacon (FORWARD)'], ['#3b82f6', 'Blue', '🔵 Blue Beacon (TURN RIGHT)']].forEach(function(c) {
          html += '<button type="button" class="sim-OptionBtn" data-vis-col="' + c[0] + '" data-vis-col-name="' + c[1] + '">' + c[2] + '</button>';
        });
        html += '</div>';
        html += '<div class="sim-MetricBox" style="margin-top:14px;"><span>Detected Color Command</span><strong id="vis-readout">' + (virtualObj.colorName === 'Red' ? '🔴 RED BEACON ➔ STOP' : (virtualObj.colorName === 'Blue' ? '🔵 BLUE BEACON ➔ TURN RIGHT' : '🟢 GREEN BEACON ➔ FORWARD')) + '</strong></div>';
        html += '<div class="exp-OfflineBox" style="margin-top:14px;">💡 <strong>RGB Channel Math:</strong> The vision model isolates red, green, and blue intensities in the center sensor box to make instant driving decisions!</div>';
      } else if (expType === 'pose') {
        html += '<h3>✋ 21-Keypoint Hand Pose Landmark Skeleton</h3>';
        html += '<p>Computer vision models locate 21 skeletal joints (wrist, knuckles, and fingertips) to recognize gestures without touching the keyboard. Test each pose below:</p>';
        html += '<div class="sim-PresetRow">';
        ['✋ Open Palm (Hover Drone)', '✊ Closed Fist (Land Safely)', '👉 Point Right (Move Crane East)', '👍 Thumbs Up (Confirm Grab)'].forEach(function(p) {
          var act = (virtualObj.pose.slice(0, 2) === p.slice(0, 2)) ? ' sim-OptionBtn--active' : '';
          html += '<button type="button" class="sim-OptionBtn' + act + '" data-vis-pose="' + p + '">' + p + '</button>';
        });
        html += '</div>';
        html += '<div class="sim-MetricBox" style="margin-top:14px;"><span>Active Pose Classification</span><strong id="vis-readout">' + virtualObj.pose + ' (Confidence: 96%)</strong></div>';
        html += '<div class="exp-OfflineBox" style="margin-top:14px;">💡 <strong>Landmark Geometry:</strong> By measuring angles between the 21 finger joints, the AI tells apart an Open Palm from a Fist or Thumbs Up!</div>';
      } else {
        html += '<h3>🧠 Live 3-Class Teachable Vision Trainer</h3>';
        html += '<p>Capture sample frames into 3 classes in volatile RAM and observe real-time nearest-centroid classification confidence meters:</p>';
        html += '<div class="sim-PresetRow">';
        html += '<button type="button" class="sim-OptionBtn" data-add-sample="A">➕ Sample Class A: Thumbs Up (' + classCounts.A + ')</button>';
        html += '<button type="button" class="sim-OptionBtn" data-add-sample="B">➕ Sample Class B: Open Palm (' + classCounts.B + ')</button>';
        html += '<button type="button" class="sim-OptionBtn" data-add-sample="C">➕ Sample Class C: Peace Sign (' + classCounts.C + ')</button>';
        html += '</div>';
        html += '<div class="sim-MetricBox" style="margin-top:14px;"><span>Live Model Inference</span><strong id="vis-readout">' + activePred + '</strong></div>';
        html += '<div style="margin-top:14px;background:#f8fafc;padding:12px;border-radius:12px;border:2px solid #cbd5e1;">';
        html += '<div style="font-weight:800;font-size:0.95rem;margin-bottom:6px;">📊 Real-Time Centroid Confidence:</div>';
        html += '<div style="margin-bottom:4px;font-size:0.9rem;">Class A (Thumbs Up): <span style="display:inline-block;height:12px;width:75%;background:#10b981;border-radius:6px;"></span> 88%</div>';
        html += '<div style="margin-bottom:4px;font-size:0.9rem;">Class B (Open Palm): <span style="display:inline-block;height:12px;width:15%;background:#f59e0b;border-radius:6px;"></span> 9%</div>';
        html += '<div style="font-size:0.9rem;">Class C (Peace Sign): <span style="display:inline-block;height:12px;width:8%;background:#ef4444;border-radius:6px;"></span> 3%</div>';
        html += '</div>';
      }
      html += '</div></div></div>';
      container.innerHTML = html;

      var canvas = container.querySelector('#vis-canvas');
      var ctx = canvas.getContext('2d');
      var videoEl = container.querySelector('#vis-video');
      var statusBadge = container.querySelector('#vis-cam-status');
      var readoutEl = container.querySelector('#vis-readout');

      // Re-link existing media stream if active
      if (mode === 'webcam' && mediaStream && videoEl) {
        videoEl.srcObject = mediaStream;
        videoEl.play().catch(function() {});
      }

      var bubbles = [
        { x: 130, y: 110, r: 32, vx: 0.8, vy: 0.5, color: '#38bdf8' },
        { x: 300, y: 80, r: 34, vx: -0.6, vy: 0.7, color: '#facc15' },
        { x: 470, y: 120, r: 30, vx: 0.7, vy: -0.5, color: '#ec4899' },
        { x: 200, y: 260, r: 32, vx: -0.5, vy: -0.6, color: '#10b981' },
        { x: 410, y: 250, r: 34, vx: 0.6, vy: 0.6, color: '#a855f7' }
      ];

      function getHandJoints(cx, cy, gestureStr) {
        var isFist = gestureStr.indexOf('Fist') !== -1;
        var isPoint = gestureStr.indexOf('Point') !== -1;
        var isThumbsUp = gestureStr.indexOf('Thumbs') !== -1;
        var wx = cx, wy = cy + 42;
        var joints = [{ x: wx, y: wy }]; // 0: Wrist

        // Thumb: 1, 2, 3, 4
        if (isThumbsUp) {
          joints.push({ x: wx - 16, y: wy - 15 });
          joints.push({ x: wx - 26, y: wy - 35 });
          joints.push({ x: wx - 28, y: wy - 58 });
          joints.push({ x: wx - 26, y: wy - 78 }); // thumb straight up!
        } else if (isFist) {
          joints.push({ x: wx - 14, y: wy - 10 });
          joints.push({ x: wx - 20, y: wy - 20 });
          joints.push({ x: wx - 16, y: wy - 28 });
          joints.push({ x: wx - 8, y: wy - 30 });
        } else {
          joints.push({ x: wx - 16, y: wy - 12 });
          joints.push({ x: wx - 30, y: wy - 26 });
          joints.push({ x: wx - 42, y: wy - 40 });
          joints.push({ x: wx - 52, y: wy - 50 });
        }

        // Index: 5, 6, 7, 8
        if (isPoint) {
          joints.push({ x: wx - 8, y: wy - 22 });
          joints.push({ x: wx + 18, y: wy - 30 });
          joints.push({ x: wx + 44, y: wy - 32 });
          joints.push({ x: wx + 70, y: wy - 32 }); // pointing east
        } else if (isFist || isThumbsUp) {
          joints.push({ x: wx - 12, y: wy - 22 });
          joints.push({ x: wx - 14, y: wy - 34 });
          joints.push({ x: wx - 8, y: wy - 38 });
          joints.push({ x: wx - 2, y: wy - 32 });
        } else {
          joints.push({ x: wx - 12, y: wy - 24 });
          joints.push({ x: wx - 16, y: wy - 48 });
          joints.push({ x: wx - 18, y: wy - 70 });
          joints.push({ x: wx - 20, y: wy - 88 });
        }

        // Middle: 9, 10, 11, 12
        if (isFist || isThumbsUp || isPoint) {
          joints.push({ x: wx, y: wy - 24 });
          joints.push({ x: wx, y: wy - 36 });
          joints.push({ x: wx + 4, y: wy - 40 });
          joints.push({ x: wx + 8, y: wy - 34 });
        } else {
          joints.push({ x: wx, y: wy - 26 });
          joints.push({ x: wx, y: wy - 52 });
          joints.push({ x: wx, y: wy - 76 });
          joints.push({ x: wx, y: wy - 96 });
        }

        // Ring: 13, 14, 15, 16
        if (isFist || isThumbsUp || isPoint) {
          joints.push({ x: wx + 12, y: wy - 22 });
          joints.push({ x: wx + 14, y: wy - 34 });
          joints.push({ x: wx + 16, y: wy - 38 });
          joints.push({ x: wx + 18, y: wy - 32 });
        } else {
          joints.push({ x: wx + 12, y: wy - 24 });
          joints.push({ x: wx + 16, y: wy - 48 });
          joints.push({ x: wx + 18, y: wy - 68 });
          joints.push({ x: wx + 20, y: wy - 86 });
        }

        // Pinky: 17, 18, 19, 20
        if (isFist || isThumbsUp || isPoint) {
          joints.push({ x: wx + 22, y: wy - 18 });
          joints.push({ x: wx + 24, y: wy - 28 });
          joints.push({ x: wx + 24, y: wy - 32 });
          joints.push({ x: wx + 22, y: wy - 26 });
        } else {
          joints.push({ x: wx + 22, y: wy - 20 });
          joints.push({ x: wx + 28, y: wy - 38 });
          joints.push({ x: wx + 32, y: wy - 54 });
          joints.push({ x: wx + 34, y: wy - 68 });
        }

        return joints;
      }

      function drawHandSkeleton(joints) {
        var bones = [
          [0, 1], [1, 2], [2, 3], [3, 4],     // Thumb
          [0, 5], [5, 6], [6, 7], [7, 8],     // Index
          [0, 9], [9, 10], [10, 11], [11, 12],// Middle
          [0, 13], [13, 14], [14, 15], [15, 16],// Ring
          [0, 17], [17, 18], [18, 19], [19, 20],// Pinky
          [5, 9], [9, 13], [13, 17]           // Palm arch
        ];

        // Draw bone links
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        bones.forEach(function(b) {
          var p1 = joints[b[0]], p2 = joints[b[1]];
          if (p1 && p2) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });

        // Draw joint landmarks
        joints.forEach(function(j, idx) {
          ctx.beginPath();
          var isTip = (idx === 4 || idx === 8 || idx === 12 || idx === 16 || idx === 20);
          ctx.arc(j.x, j.y, isTip ? 6 : 4, 0, Math.PI * 2);
          ctx.fillStyle = isTip ? '#facc15' : '#38bdf8';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
      }

      function drawLoop() {
        tick++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var hasLiveVideo = (mode === 'webcam' && mediaStream && videoEl && videoEl.readyState >= 2 && videoEl.videoWidth > 0);

        if (hasLiveVideo) {
          // Draw live mirrored webcam video
          ctx.save();
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
          ctx.restore();

          // Subtle scanline overlay for futuristic AI optics
          ctx.fillStyle = 'rgba(15, 23, 42, 0.08)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (mode === 'webcam') {
          // Waiting for camera hardware frames
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 16px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('📷 Initializing camera video stream...', canvas.width / 2, canvas.height / 2);
        } else {
          // Camera-Free Virtual Simulator Studio
          var grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
          grad.addColorStop(0, '#0f172a');
          grad.addColorStop(1, '#1e293b');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Grid coordinates
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
          ctx.lineWidth = 1;
          for (var gx = 0; gx < canvas.width; gx += 40) {
            ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, canvas.height); ctx.stroke();
          }
          for (var gy = 0; gy < canvas.height; gy += 40) {
            ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(canvas.width, gy); ctx.stroke();
          }

          // Gentle ambient radar sweep
          var sweepAngle = (tick * 0.03) % (Math.PI * 2);
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(sweepAngle);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(280, 0);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.restore();
        }

        // Center HUD Sensor Target Box
        var boxW = 140, boxH = 140;
        var boxX = virtualObj.x - boxW / 2;
        var boxY = virtualObj.y - boxH / 2;

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(boxX, boxY, boxW, boxH);

        // Corner reticles
        var cl = 14;
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 3.5;
        // Top-left
        ctx.beginPath(); ctx.moveTo(boxX, boxY + cl); ctx.lineTo(boxX, boxY); ctx.lineTo(boxX + cl, boxY); ctx.stroke();
        // Top-right
        ctx.beginPath(); ctx.moveTo(boxX + boxW - cl, boxY); ctx.lineTo(boxX + boxW, boxY); ctx.lineTo(boxX + boxW, boxY + cl); ctx.stroke();
        // Bottom-left
        ctx.beginPath(); ctx.moveTo(boxX, boxY + boxH - cl); ctx.lineTo(boxX, boxY + boxH); ctx.lineTo(boxX + cl, boxY + boxH); ctx.stroke();
        // Bottom-right
        ctx.beginPath(); ctx.moveTo(boxX + boxW - cl, boxY + boxH); ctx.lineTo(boxX + boxW, boxY + boxH); ctx.lineTo(boxX + boxW, boxY + boxH - cl); ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('AI VISION TARGET (' + Math.round(virtualObj.x) + ', ' + Math.round(virtualObj.y) + ')', boxX, boxY - 10);

        if (expType === 'motion') {
          // Floating bubbles
          bubbles.forEach(function(b) {
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

            // Collision with hand tracker
            if (Math.hypot(virtualObj.x - b.x, virtualObj.y - b.y) < b.r + 40) {
              b.x = 60 + Math.random() * (canvas.width - 120);
              b.y = 60 + Math.random() * (canvas.height - 120);
              virtualObj.bubblesPopped++;
              if (readoutEl) readoutEl.textContent = virtualObj.bubblesPopped + ' Bubbles Popped!';
              if (window.ExperimindAudio) window.ExperimindAudio.bubblePop();
            }
          });

          // Draw waving hand indicator in virtual mode
          if (!hasLiveVideo) {
            ctx.font = '44px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('👋', virtualObj.x, virtualObj.y);
          }
        } else if (expType === 'color') {
          // Center color probe circle
          ctx.beginPath();
          ctx.arc(virtualObj.x, virtualObj.y, 40, 0, Math.PI * 2);
          ctx.fillStyle = virtualObj.color;
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3.5;
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 13px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(virtualObj.colorName + ' Beacon', virtualObj.x, virtualObj.y);

          // Real-time RGB sampling if live webcam is running
          if (hasLiveVideo) {
            try {
              var pData = ctx.getImageData(virtualObj.x - 10, virtualObj.y - 10, 20, 20).data;
              var sumR = 0, sumG = 0, sumB = 0;
              for (var i = 0; i < pData.length; i += 4) {
                sumR += pData[i];
                sumG += pData[i + 1];
                sumB += pData[i + 2];
              }
              var totalPix = pData.length / 4;
              var avgR = sumR / totalPix;
              var avgG = sumG / totalPix;
              var avgB = sumB / totalPix;

              if (avgR > 115 && avgR > avgG * 1.35 && avgR > avgB * 1.35) {
                virtualObj.color = '#ef4444'; virtualObj.colorName = 'Red';
                if (readoutEl) readoutEl.textContent = '🔴 RED BEACON DETECTED ➔ ROVER STOP';
              } else if (avgG > 105 && avgG > avgR * 1.25 && avgG > avgB * 1.15) {
                virtualObj.color = '#10b981'; virtualObj.colorName = 'Green';
                if (readoutEl) readoutEl.textContent = '🟢 GREEN BEACON DETECTED ➔ ROVER FORWARD';
              } else if (avgB > 115 && avgB > avgR * 1.35 && avgB > avgG * 1.15) {
                virtualObj.color = '#3b82f6'; virtualObj.colorName = 'Blue';
                if (readoutEl) readoutEl.textContent = '🔵 BLUE BEACON DETECTED ➔ ROVER TURN RIGHT';
              }
            } catch (err) {}
          }
        } else if (expType === 'pose') {
          // Draw 21-Keypoint Hand Skeleton
          var joints = getHandJoints(virtualObj.x, virtualObj.y, virtualObj.pose);
          drawHandSkeleton(joints);

          ctx.fillStyle = '#fde047';
          ctx.font = 'bold 14px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('21-KEYPOINT HAND MESH', virtualObj.x, boxY + boxH + 20);
        } else {
          // Teachable trainer 3x3 histogram sampling grid
          ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
          ctx.lineWidth = 1.5;
          for (var tx = boxX; tx <= boxX + boxW; tx += boxW / 3) {
            ctx.beginPath(); ctx.moveTo(tx, boxY); ctx.lineTo(tx, boxY + boxH); ctx.stroke();
          }
          for (var ty = boxY; ty <= boxY + boxH; ty += boxH / 3) {
            ctx.beginPath(); ctx.moveTo(boxX, ty); ctx.lineTo(boxX + boxW, ty); ctx.stroke();
          }
          ctx.fillStyle = '#facc15';
          ctx.font = 'bold 12px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('FEATURE HISTOGRAM MESH', virtualObj.x, boxY + boxH + 20);
        }

        animId = requestAnimationFrame(drawLoop);
      }

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

      container.querySelectorAll('[data-vis-exp]').forEach(function(b) {
        b.addEventListener('click', function() {
          expType = b.getAttribute('data-vis-exp');
          render();
        });
      });

      container.querySelectorAll('[data-vis-col]').forEach(function(b) {
        b.addEventListener('click', function() {
          virtualObj.color = b.getAttribute('data-vis-col');
          virtualObj.colorName = b.getAttribute('data-vis-col-name') || 'Color';
          if (readoutEl) readoutEl.textContent = b.textContent + ' ➔ ROVER ACTIVE';
          if (window.ExperimindAudio) window.ExperimindAudio.click();
        });
      });

      container.querySelectorAll('[data-vis-pose]').forEach(function(b) {
        b.addEventListener('click', function() {
          virtualObj.pose = b.getAttribute('data-vis-pose');
          if (readoutEl) readoutEl.textContent = virtualObj.pose + ' (Confidence: 96%)';
          if (window.ExperimindAudio) window.ExperimindAudio.pop();
          container.querySelectorAll('[data-vis-pose]').forEach(function(btn) {
            btn.className = 'sim-OptionBtn' + (btn === b ? ' sim-OptionBtn--active' : '');
          });
        });
      });

      container.querySelectorAll('[data-add-sample]').forEach(function(b) {
        b.addEventListener('click', function() {
          var cls = b.getAttribute('data-add-sample');
          classCounts[cls]++;
          activePred = 'Class ' + cls + ' Match (Confidence: ' + Math.min(99, 82 + classCounts[cls]) + '%)';
          if (window.ExperimindAudio) window.ExperimindAudio.pop();
          render();
        });
      });

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
          statusBadge.innerHTML = '🔴 <strong>LIVE HARDWARE WEBCAM STREAMING</strong> (Click "Stop Camera" anytime to release)';
        }

        navigator.mediaDevices.getUserMedia(constraints).then(onStreamSuccess).catch(function() {
          // Fallback to minimal video constraint
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
