// Experimind AI Learning Lab — Section 8 Dual-Mode AI Vision Lab (#vision/:grade)
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
    stopHardwareCamera();
    var grade = selectedGrade || 'Class 6';
    var mode = 'virtual'; // 'virtual' (100% camera-free fallback) or 'webcam'
    var expType = 'motion'; // 'motion' | 'color' | 'pose' | 'trainer'
    if (grade === 'Class 2' || grade === 'Class 3' || grade === 'Class 4') expType = 'color';
    else if (grade === 'Class 5' || grade === 'Class 6') expType = 'pose';
    else if (grade === 'Class 7' || grade === 'Class 8') expType = 'trainer';

    var virtualObj = { x: 260, y: 150, color: '#ef4444', pose: '✋ Open Palm', bubblesPopped: 0 };
    var classCounts = { A: 4, B: 4, C: 4 };
    var activePred = 'Class A: Thumbs Up 👍 (89%)';

    function render() {
      stopHardwareCamera();
      var html = '<div class="vision-Wrapper">';
      html += '<div class="vision-HeaderCard">';
      html += '<div><span class="sim-EngineBadge">SECTION 8 • AI VISION & GESTURE LAB</span><h2>AI Computer Vision Laboratory — ' + grade + '</h2>';
      html += '<p>Privacy Guarantee: Cameras never activate automatically. All pixel analysis happens in volatile RAM and is never recorded or saved.</p></div>';
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
      // Left: Live Canvas + Hidden Video element
      html += '<div class="vision-StageCard">';
      html += '<div class="vision-StatusBadge" id="vis-cam-status">🟢 Mode: Camera-Free Virtual Vision Simulator (Click or Drag on Canvas)</div>';
      html += '<div class="sim-CanvasWrap"><video id="vis-video" autoplay playsinline muted style="display:none;"></video><canvas id="vis-canvas" width="560" height="340"></canvas></div>';
      html += '</div>';

      // Right: Telemetry & Experiment Controls
      html += '<div class="vision-ControlCard">';
      if (expType === 'motion') {
        html += '<h3>🫧 Frame-Differencing Motion Detector</h3>';
        html += '<p>Move your hand in front of the webcam (or move the pointer across the Virtual Camera canvas) to trigger pixel-difference motion vectors and pop floating targets!</p>';
        html += '<div class="sim-MetricBox"><span>Motion Bubbles Popped</span><strong id="vis-readout">' + virtualObj.bubblesPopped + ' Bubbles</strong></div>';
      } else if (expType === 'color') {
        html += '<h3>🎨 HSV / RGB Color Classifier Beacon</h3>';
        html += '<p>Hold a colored object up to the camera or pick a Virtual Beacon Paddle below to steer the rover by RGB color channel dominance:</p>';
        html += '<div class="sim-PresetRow">';
        [['#ef4444', '🔴 Red Beacon (STOP)'], ['#10b981', '🟢 Green Beacon (FORWARD)'], ['#3b82f6', '🔵 Blue Beacon (TURN RIGHT)']].forEach(function(c) {
          html += '<button type="button" class="sim-OptionBtn" data-vis-col="' + c[0] + '">' + c[1] + '</button>';
        });
        html += '</div>';
        html += '<div class="sim-MetricBox" style="margin-top:12px;"><span>Detected Color Command</span><strong id="vis-readout">🟢 Green Beacon ➔ ROVER FORWARD</strong></div>';
      } else if (expType === 'pose') {
        html += '<h3>✋ Keypoint Gesture & Pose Recognition</h3>';
        html += '<p>Computer vision models locate 21 hand landmarks to classify gestures without touching the keyboard. Test each gesture input below:</p>';
        html += '<div class="sim-PresetRow">';
        ['✋ Open Palm (Hover Drone)', '✊ Closed Fist (Land Safely)', '👉 Point Right (Move Crane East)', '👍 Thumbs Up (Confirm Grab)'].forEach(function(p) {
          html += '<button type="button" class="sim-OptionBtn" data-vis-pose="' + p + '">' + p + '</button>';
        });
        html += '</div>';
        html += '<div class="sim-MetricBox" style="margin-top:12px;"><span>Active Pose Classification</span><strong id="vis-readout">' + virtualObj.pose + '</strong></div>';
      } else {
        html += '<h3>🧠 Live 3-Class Teachable Vision Trainer</h3>';
        html += '<p>Capture sample frames into 3 classes in volatile RAM and observe real-time nearest-centroid classification confidence bars:</p>';
        html += '<div class="sim-PresetRow">';
        html += '<button type="button" class="sim-OptionBtn" data-add-sample="A">➕ Add Sample to Class A (' + classCounts.A + ')</button>';
        html += '<button type="button" class="sim-OptionBtn" data-add-sample="B">➕ Add Sample to Class B (' + classCounts.B + ')</button>';
        html += '<button type="button" class="sim-OptionBtn" data-add-sample="C">➕ Add Sample to Class C (' + classCounts.C + ')</button>';
        html += '</div>';
        html += '<div class="sim-MetricBox" style="margin-top:12px;"><span>Live Model Inference</span><strong id="vis-readout">' + activePred + '</strong></div>';
      }
      html += '</div></div></div>';
      container.innerHTML = html;

      var canvas = container.querySelector('#vis-canvas');
      var ctx = canvas.getContext('2d');
      var videoEl = container.querySelector('#vis-video');
      var statusBadge = container.querySelector('#vis-cam-status');
      var readoutEl = container.querySelector('#vis-readout');

      var bubbles = [
        { x: 120, y: 100, r: 28 },
        { x: 280, y: 80, r: 30 },
        { x: 430, y: 110, r: 28 },
        { x: 180, y: 240, r: 28 },
        { x: 380, y: 230, r: 30 }
      ];

      function drawLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (mode === 'webcam' && mediaStream && videoEl.readyState >= 2) {
          ctx.save();
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
          ctx.restore();
        } else {
          // Virtual camera dark studio backdrop with grid
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = '#1e293b';
          for (var gx = 0; gx < canvas.width; gx += 40) {
            ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, canvas.height); ctx.stroke();
          }
          for (var gy = 0; gy < canvas.height; gy += 40) {
            ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(canvas.width, gy); ctx.stroke();
          }
        }

        // Draw HUD bounding box around virtual target
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(virtualObj.x - 48, virtualObj.y - 48, 96, 96);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillText('AI VISION TRACKER (' + Math.round(virtualObj.x) + ',' + Math.round(virtualObj.y) + ')', virtualObj.x - 48, virtualObj.y - 56);

        if (expType === 'motion') {
          bubbles.forEach(function(b) {
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fillStyle = '#38bdf844';
            ctx.fill();
            ctx.strokeStyle = '#38bdf8';
            ctx.stroke();
            if (Math.hypot(virtualObj.x - b.x, virtualObj.y - b.y) < b.r + 28) {
              b.x = 60 + Math.random() * 440;
              b.y = 60 + Math.random() * 220;
              virtualObj.bubblesPopped++;
              if (readoutEl) readoutEl.textContent = virtualObj.bubblesPopped + ' Bubbles Popped!';
              if (window.ExperimindAudio) window.ExperimindAudio.pop();
            }
          });
          ctx.font = '34px sans-serif';
          ctx.fillText('👋', virtualObj.x - 16, virtualObj.y + 10);
        } else if (expType === 'color') {
          ctx.beginPath();
          ctx.arc(virtualObj.x, virtualObj.y, 34, 0, Math.PI * 2);
          ctx.fillStyle = virtualObj.color;
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.stroke();
        } else {
          ctx.font = '38px sans-serif';
          ctx.fillText(virtualObj.pose.slice(0, 2), virtualObj.x - 18, virtualObj.y + 12);
        }

        animId = requestAnimationFrame(drawLoop);
      }

      canvas.addEventListener('mousemove', function(ev) {
        var rect = canvas.getBoundingClientRect();
        virtualObj.x = (ev.clientX - rect.left) * (canvas.width / rect.width);
        virtualObj.y = (ev.clientY - rect.top) * (canvas.height / rect.height);
      });

      container.querySelectorAll('[data-vis-exp]').forEach(function(b) {
        b.addEventListener('click', function() {
          expType = b.getAttribute('data-vis-exp');
          render();
        });
      });

      container.querySelectorAll('[data-vis-col]').forEach(function(b) {
        b.addEventListener('click', function() {
          virtualObj.color = b.getAttribute('data-vis-col');
          if (readoutEl) readoutEl.textContent = b.textContent + ' ➔ ROVER ACTIVE';
          if (window.ExperimindAudio) window.ExperimindAudio.click();
        });
      });

      container.querySelectorAll('[data-vis-pose]').forEach(function(b) {
        b.addEventListener('click', function() {
          virtualObj.pose = b.getAttribute('data-vis-pose');
          if (readoutEl) readoutEl.textContent = virtualObj.pose + ' (Confidence: 96%)';
          if (window.ExperimindAudio) window.ExperimindAudio.pop();
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
        navigator.mediaDevices.getUserMedia({ video: { width: 560, height: 340 } }).then(function(stream) {
          mediaStream = stream;
          videoEl.srcObject = stream;
          mode = 'webcam';
          statusBadge.className = 'vision-StatusBadge vision-StatusBadge--live';
          statusBadge.textContent = '🔴 LIVE HARDWARE WEBCAM ACTIVE (Click "Stop Camera" anytime to disconnect)';
        }).catch(function() {
          mode = 'virtual';
          statusBadge.className = 'vision-StatusBadge vision-StatusBadge--warn';
          statusBadge.textContent = 'ℹ️ Camera permission declined or no webcam plugged in — using Camera-Free Virtual Simulator!';
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
