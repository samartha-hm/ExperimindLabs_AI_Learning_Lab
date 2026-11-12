// Experimind AI Learning Lab — Section 8 Creative 8-Game AI Webcam & Computer Vision Arcade
// Inspired by Scratch Video Sensing, Google Chrome Experiments, Quick Draw, Air Canvas & Teachable Machine.
// 100% Offline-First, Zero PII, Real-Time Webcam Optical-Flow Tracking + Instant Mouse/Touch Arcade Play!

window.ExperimindVisionLab = (function() {
  var mediaStream = null;
  var animId = null;
  var audioCtx = null;

  function playNoteFreq(freq, dur) {
    try {
      var AudioContextCls = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextCls) return;
      if (!audioCtx) audioCtx = new AudioContextCls();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      var now = audioCtx.currentTime;
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (dur || 0.35));
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + (dur || 0.35));
    } catch (e) {}
  }

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
    var expType = 'fruit_ninja';
    if (grade === 'LKG' || grade === 'UKG') expType = 'fruit_ninja';
    else if (grade === 'Class 1') expType = 'air_harp';
    else if (grade === 'Class 2') expType = 'air_canvas';
    else if (grade === 'Class 3') expType = 'goalkeeper';
    else if (grade === 'Class 4') expType = 'rps_arena';
    else if (grade === 'Class 5') expType = 'emoji_mimic';
    else if (grade === 'Class 6' || grade === 'Class 7') expType = 'tm_arcade';
    else if (grade === 'Class 8') expType = 'cyborg_xray';

    var xrayMode = 'standard'; // 'standard' | 'hud' | 'edge' | 'ascii' | 'thermal'
    var tick = 0;
    var pointer = { x: 320, y: 190, vx: 0, vy: 0, prevX: 320, prevY: 190, isDown: false };
    var bladeTrail = []; // [{x, y, life}]

    // Offscreen 80x50 Real-Time Webcam Motion & Color Analyzer
    var cvCanvas = document.createElement('canvas');
    cvCanvas.width = 80;
    cvCanvas.height = 50;
    var cvCtx = cvCanvas.getContext('2d', { willReadFrequently: true });
    var prevGray = null;
    var motionMap = new Uint8Array(80 * 50);

    // =========================================================================
    // STATE FOR ALL 8 CREATIVE WEBCAM ARCADE GAMES
    // =========================================================================

    // GAME 1: 🍉 AI Ninja Fruit Slicer (Motion Blade)
    var fruitGame = {
      score: 0,
      combo: 1,
      bestCombo: 1,
      fruits: [],
      halves: [],
      splashes: [],
      spawnRate: 42
    };

    function spawnFruit() {
      var catalog = [
        { emoji: '🍉', color: '#ef4444', pts: 10, isBomb: false },
        { emoji: '🥭', color: '#f59e0b', pts: 15, isBomb: false },
        { emoji: '🍎', color: '#dc2626', pts: 10, isBomb: false },
        { emoji: '🍍', color: '#eab308', pts: 20, isBomb: false },
        { emoji: '🍓', color: '#ec4899', pts: 15, isBomb: false },
        { emoji: '🥝', color: '#10b981', pts: 15, isBomb: false },
        { emoji: '💣', color: '#334155', pts: -20, isBomb: true }
      ];
      var pick = catalog[Math.floor(Math.random() * (catalog.length - (Math.random() < 0.75 ? 1 : 0)))];
      fruitGame.fruits.push({
        x: 80 + Math.random() * 480,
        y: 380,
        vx: (Math.random() - 0.5) * 4.2,
        vy: -(8.8 + Math.random() * 3.4),
        r: 30,
        rot: 0,
        vrot: (Math.random() - 0.5) * 0.14,
        emoji: pick.emoji,
        color: pick.color,
        pts: pick.pts,
        isBomb: pick.isBomb
      });
    }

    // GAME 2: 🎹 Air Xylophone & Rainbow Music Synth
    var harpGame = {
      notesPlayed: 0,
      songMode: true,
      songStep: 0,
      songNotes: [0, 0, 4, 4, 5, 5, 4, 3, 3, 2, 2, 1, 1, 0], // Twinkle Twinkle Little Star
      rings: [],
      bars: [
        { label: 'C4 (Do)', freq: 261.63, color: '#ef4444', x: 52, w: 62, cooldown: 0 },
        { label: 'D4 (Re)', freq: 293.66, color: '#f97316', x: 122, w: 62, cooldown: 0 },
        { label: 'E4 (Mi)', freq: 329.63, color: '#eab308', x: 192, w: 62, cooldown: 0 },
        { label: 'F4 (Fa)', freq: 349.23, color: '#10b981', x: 262, w: 62, cooldown: 0 },
        { label: 'G4 (Sol)', freq: 392.00, color: '#06b6d4', x: 332, w: 62, cooldown: 0 },
        { label: 'A4 (La)', freq: 440.00, color: '#3b82f6', x: 402, w: 62, cooldown: 0 },
        { label: 'B4 (Ti)', freq: 493.88, color: '#8b5cf6', x: 472, w: 62, cooldown: 0 },
        { label: 'C5 (Do+)', freq: 523.25, color: '#ec4899', x: 542, w: 62, cooldown: 0 }
      ]
    };

    // GAME 3: 🎨 Magic Air Canvas & Quick-Draw AI Guesser
    var paintGame = {
      strokes: [], // [{points: [{x,y}], color, mirror}]
      currentStroke: null,
      brushColor: '#38bdf8',
      mirrorMode: false,
      rainbowHue: 0,
      rainbowMode: true,
      promptIdx: 0,
      prompts: [
        { target: '☀️ Glowing Sun', guess: '☀️ Sun / Circle (96% Match!)', hint: 'Draw a big round circle with rays in the air!' },
        { target: '🏠 Cozy House', guess: '🏠 House / Square + Roof (94% Match!)', hint: 'Draw a square box with a triangle roof on top!' },
        { target: '⭐ Shooting Star', guess: '⭐ 5-Point Star (97% Match!)', hint: 'Zig-zag across the air to paint a glowing star!' },
        { target: '🦋 Symmetric Butterfly', guess: '🦋 Butterfly Wings (98% Match!)', hint: 'Turn ON Mirror Mandala Mode and draw one wing!' }
      ],
      aiGuessText: 'Wave or drag in the air to start painting!'
    };

    // GAME 4: ⚽ AR Stadium Goalkeeper (Penalty Saver)
    var goalieGame = {
      saves: 0,
      missed: 0,
      streak: 0,
      ball: { x: 320, y: 190, z: 1.0, targetX: 160, targetY: 110, speed: 0.022, emoji: '⚽', active: true },
      saveBurst: null
    };

    function resetBall() {
      var corners = [
        { x: 115, y: 95 }, { x: 525, y: 95 },
        { x: 115, y: 270 }, { x: 525, y: 270 },
        { x: 320, y: 85 }, { x: 200, y: 180 }, { x: 440, y: 180 }
      ];
      var t = corners[Math.floor(Math.random() * corners.length)];
      goalieGame.ball = {
        x: 320,
        y: 205,
        z: 0.15,
        targetX: t.x,
        targetY: t.y,
        speed: 0.018 + Math.min(0.015, goalieGame.saves * 0.0015),
        emoji: Math.random() < 0.25 ? '🔥' : '⚽',
        active: true
      };
    }

    // GAME 5: ✂️ AI Rock-Paper-Scissors Championship vs. Sparky
    var rpsGame = {
      playerMove: '🪨 Rock',
      aiMove: '✂️ Scissors',
      resultText: 'Pick Rock, Paper, or Scissors (or hold up your hand) & click SHOOT!',
      playerScore: 0,
      aiScore: 0,
      roundsPlayed: 0,
      countdown: 0
    };

    // GAME 6: 😎 Emoji Mimic Face-Off & AR Hologram Masks
    var emojiGame = {
      mask: 'astronaut', // 'astronaut' | 'cyber' | 'cat' | 'crown' | 'dragon'
      targetIdx: 0,
      score: 0,
      matchProgress: 0,
      challenges: [
        { emoji: '😄', name: 'Big Happy Grin!', rule: 'Mouth Wide + Cheeks Up', mar: 0.65, ear: 0.30 },
        { emoji: '😮', name: 'Surprised O-Face!', rule: 'Jaw Dropped + Wide Eyes', mar: 0.88, ear: 0.45 },
        { emoji: '😎', name: 'Cool Head Tilt!', rule: 'Head Roll Angle > 15°', mar: 0.25, ear: 0.28 },
        { emoji: '🤩', name: 'Super Star Pose!', rule: 'Smile + Hands High!', mar: 0.75, ear: 0.38 }
      ]
    };

    // GAME 7: 🚀 Teachable Machine Space Arcade (Train Gestures -> Steer Spaceship!)
    var tmArcade = {
      samples: { LEFT: 6, RIGHT: 6, LASER: 6 },
      activeCommand: 'CENTER', // 'LEFT' | 'RIGHT' | 'LASER'
      probs: { LEFT: 15, RIGHT: 15, LASER: 70 },
      shipX: 320,
      lasers: [],
      asteroids: [
        { x: 140, y: 60, r: 24, vy: 1.4, emoji: '☄️' },
        { x: 320, y: 20, r: 26, vy: 1.7, emoji: '🪨' },
        { x: 490, y: 90, r: 24, vy: 1.5, emoji: '🛸' }
      ],
      score: 0
    };

    // GAME 8: 🕵️ Cyborg X-Ray, Matrix ASCII Rain & LiDAR Scanner
    var cyborgLab = {
      lens: 'ascii', // 'ascii' | 'thermal' | 'edge' | 'lidar'
      scanCount: 0,
      lidarTargets: [
        { x: 160, y: 150, label: 'Pedestrian 🚶', dist: 4.2 },
        { x: 460, y: 180, label: 'Rover Bot 🤖', dist: 6.8 }
      ]
    };

    // =========================================================================
    // REAL-TIME WEBCAM PIXEL & OPTICAL-FLOW ENGINE
    // =========================================================================
    function analyzeWebcam(videoEl, canvasW, canvasH) {
      if (mode !== 'webcam' || !mediaStream || !videoEl || videoEl.readyState < 2) return;
      try {
        cvCtx.drawImage(videoEl, 0, 0, 80, 50);
        var frame = cvCtx.getImageData(0, 0, 80, 50).data;
        var curGray = new Uint8Array(80 * 50);
        var mSumX = 0, mSumY = 0, mCount = 0;

        for (var y = 0; y < 50; y++) {
          for (var x = 0; x < 80; x++) {
            var idx = y * 80 + x;
            var p = idx * 4;
            var mx = 79 - x; // Mirror X
            var gray = (frame[p] * 299 + frame[p + 1] * 587 + frame[p + 2] * 114) / 1000;
            curGray[idx] = gray;

            if (prevGray) {
              var diff = Math.abs(gray - prevGray[idx]);
              motionMap[idx] = diff > 20 ? 255 : 0;
              if (diff > 22) {
                mCount++;
                mSumX += mx;
                mSumY += y;
              }
            }
          }
        }
        prevGray = curGray;

        if (mCount > 8) {
          var tx = (mSumX / mCount) * (canvasW / 80);
          var ty = (mSumY / mCount) * (canvasH / 50);
          pointer.prevX = pointer.x;
          pointer.prevY = pointer.y;
          pointer.x += (tx - pointer.x) * 0.38;
          pointer.y += (ty - pointer.y) * 0.38;
          pointer.vx = pointer.x - pointer.prevX;
          pointer.vy = pointer.y - pointer.prevY;
          bladeTrail.push({ x: pointer.x, y: pointer.y, life: 1.0 });
          if (bladeTrail.length > 18) bladeTrail.shift();

          if (expType === 'air_canvas') {
            if (!paintGame.currentStroke) {
              paintGame.currentStroke = {
                points: [],
                color: paintGame.rainbowMode ? 'hsl(' + ((tick * 4) % 360) + ', 90%, 60%)' : paintGame.brushColor,
                mirror: paintGame.mirrorMode
              };
              paintGame.strokes.push(paintGame.currentStroke);
            }
            paintGame.currentStroke.points.push({ x: pointer.x, y: pointer.y });
            if (paintGame.currentStroke.points.length > 120) paintGame.currentStroke.points.shift();
          }
        }
      } catch (e) {}
    }

    // =========================================================================
    // RENDER UI & ARCADE STAGE
    // =========================================================================
    function render() {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }

      var GAME_TABS = [
        ['fruit_ninja', '🍉 1. Ninja Fruit Slicer', 'Wave your hand like a katana blade to slice flying fruit!'],
        ['air_harp', '🎹 2. Air Xylophone Synth', 'Touch floating rainbow crystal bars in mid-air to play music!'],
        ['air_canvas', '🎨 3. Magic Air Painter', 'Paint neon light in thin air & watch AI guess your doodle!'],
        ['goalkeeper', '⚽ 4. AR Stadium Goalkeeper', 'Move your hands to block incoming penalty shots!'],
        ['rps_arena', '✂️ 5. AI Rock-Paper-Scissors', 'Battle Sparky the Robot with 21-keypoint hand gestures!'],
        ['emoji_mimic', '😎 6. Emoji Mimic & AR Masks', 'Match target emoji expressions & wear holographic masks!'],
        ['tm_arcade', '🚀 7. Teachable Space Arcade', 'Train 3 custom AI classes to steer a live spaceship!'],
        ['cyborg_xray', '🕵️ 8. Cyborg Matrix & LiDAR', 'See in Matrix ASCII code, Thermal Infrared & Edge X-Ray!']
      ];

      var activeMeta = GAME_TABS.find(function(t) { return t[0] === expType; }) || GAME_TABS[0];

      var html = '<div class="vision-Wrapper">';
      // Top Header Banner
      html += '<div class="vision-HeaderCard" style="background:linear-gradient(135deg,#0f172a,#1e3a8a,#4f46e5);">';
      html += '<div><span class="sim-EngineBadge" style="background:#facc15;color:#0f172a;">PILLAR 5 • INTERACTIVE AI WEBCAM & MOTION ARCADE</span>';
      html += '<h2 style="font-size:2rem;font-weight:900;margin:6px 0;">📷 AI Computer Vision Arcade (' + activeMeta[1] + ')</h2>';
      html += '<p style="color:#e2e8f0;font-size:1.02rem;">Turn on your webcam to play hands-free with your body and hands—or play immediately with your mouse/touchscreen right inside the arcade canvas!</p></div>';
      html += '<div class="vision-ConsentControls">';
      html += '<button type="button" class="btn-Primary" id="vis-start-cam" style="background:#10b981;border-color:#059669;border-bottom-color:#047857;">📷 Turn ON Webcam (Hands-Free Play!)</button>';
      html += '<button type="button" class="btn-Danger" id="vis-stop-cam">⏹️ Turn Off Camera</button>';
      html += '<button type="button" class="btn-Secondary" id="vis-virtual-btn">🖱️ Mouse / Touch Arcade Mode</button>';
      html += '</div></div>';

      // 8 Big Colorful Arcade Game Selector Pills
      html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(205px,1fr));gap:10px;margin-bottom:18px;">';
      GAME_TABS.forEach(function(tab) {
        var isAct = (expType === tab[0]);
        html += '<button type="button" class="sim-TabBtn' + (isAct ? ' sim-TabBtn--active' : '') + '" style="padding:12px 14px;text-align:left;display:flex;flex-direction:column;gap:3px;" data-vis-exp="' + tab[0] + '">';
        html += '<span style="font-size:1rem;font-weight:900;">' + tab[1] + '</span>';
        html += '<span style="font-size:0.78rem;opacity:0.85;font-weight:600;">' + tab[2] + '</span>';
        html += '</button>';
      });
      html += '</div>';

      // Main Split Stage: Left = Giant 640x390 Interactive Arcade Canvas; Right = Game Controls & AI Brain Telemetry
      html += '<div class="vision-MainGrid">';
      html += '<div class="vision-StageCard">';
      var statusBadgeCls = (mode === 'webcam') ? 'vision-StatusBadge vision-StatusBadge--live' : 'vision-StatusBadge';
      var statusBadgeText = (mode === 'webcam')
        ? '🔴 LIVE WEBCAM ACTIVE — Wave your hands in front of the camera (or use mouse)!'
        : '🎮 INTERACTIVE ARCADE CANVAS — Move or drag your pointer inside the screen below (or click "Turn ON Webcam" above)!';
      html += '<div class="' + statusBadgeCls + '" id="vis-cam-status">' + statusBadgeText + '</div>';
      html += '<div class="sim-CanvasWrap" style="position:relative;">';
      html += '<video id="vis-video" autoplay playsinline muted style="position:absolute;left:-9999px;width:640px;height:480px;opacity:0;pointer-events:none;"></video>';
      html += '<canvas id="vis-canvas" width="640" height="390" style="background:#0f172a;border-radius:16px;cursor:crosshair;"></canvas>';
      html += '</div></div>';

      // Right Column: Game-Specific Interactive Controls & Kid-Friendly AI Explanation
      html += '<div class="vision-ControlCard" id="vis-right-panel">';
      if (expType === 'fruit_ninja') {
        html += '<h3>🍉 AI Ninja Fruit Slicer</h3>';
        html += '<p style="margin:6px 0 14px;color:#334155;">Swipe your hand in front of the camera (or move your mouse fast across the screen) to slice flying fruit with your glowing Plasma Blade! Avoid the black bombs 💣!</p>';
        html += '<div class="sim-NlpResultRow" style="margin-bottom:14px;">';
        html += '<div class="sim-MetricBox"><span>Ninja Score</span><strong id="fn-score" style="font-size:1.5rem;color:#10b981;">' + fruitGame.score + ' pts</strong></div>';
        html += '<div class="sim-MetricBox"><span>Combo Multiplier</span><strong id="fn-combo" style="font-size:1.5rem;color:#f59e0b;">' + fruitGame.combo + 'x 🔥</strong></div>';
        html += '</div>';
        html += '<div class="sim-PresetRow">';
        html += '<button type="button" class="btn-Primary" id="fn-burst-btn" style="width:100%;font-size:1.05rem;">🍉 Launch Giant Fruit Frenzy Wave! (8 Fruits)</button>';
        html += '</div>';
        html += '<div class="exp-OfflineBox" style="margin-top:16px;"><strong>🤖 How the AI Camera Sees Your Blade:</strong><br>The computer compares every pixel in <code>Frame(now)</code> minus <code>Frame(previous)</code>. Wherever pixels change brightness fast, it detects your moving hand and places the glowing katana blade!</div>';
      }

      else if (expType === 'air_harp') {
        html += '<h3>🎹 Air Xylophone & Rainbow Music Synth</h3>';
        html += '<p style="margin:6px 0 12px;color:#334155;">Touch the 8 glowing rainbow crystal bars at the top of the screen with your hand or mouse pointer to play real musical notes! Follow the ⭐ Star Note to play <em>Twinkle Twinkle Little Star</em>!</p>';
        html += '<div class="sim-NlpResultRow" style="margin-bottom:12px;">';
        html += '<div class="sim-MetricBox"><span>Notes Played</span><strong id="harp-count" style="font-size:1.4rem;color:#2563eb;">' + harpGame.notesPlayed + ' Notes 🎵</strong></div>';
        html += '<div class="sim-MetricBox"><span>Song Progress</span><strong id="harp-song" style="font-size:1.2rem;color:#8b5cf6;">Step ' + (harpGame.songStep + 1) + ' / ' + harpGame.songNotes.length + ' ⭐</strong></div>';
        html += '</div>';
        html += '<div class="sim-SubLabel">Click any button below (or touch the bars on the canvas) to play a chord:</div>';
        html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:8px;">';
        harpGame.bars.forEach(function(b, idx) {
          html += '<button type="button" class="sim-OptionBtn" style="background:' + b.color + ';color:#fff;border-color:#0f172a;text-align:center;padding:10px 6px;" data-harp-note="' + idx + '">' + b.label + '</button>';
        });
        html += '</div>';
        html += '<div class="exp-OfflineBox" style="margin-top:14px;"><strong>🤖 Spatial Trigger Zones:</strong><br>Computer vision divides the camera screen into 8 invisible regions (Hitboxes). When motion enters a region, it triggers the Web Audio synthesizer!</div>';
      }

      else if (expType === 'air_canvas') {
        var curP = paintGame.prompts[paintGame.promptIdx];
        html += '<h3>🎨 Magic Air Canvas & Quick-Draw AI</h3>';
        html += '<p style="margin:6px 0 10px;color:#334155;">Hold down your mouse button (or wave your hand in Webcam Mode) to paint glowing neon trails in thin air! Turn on <strong>🦋 Mirror Kaleidoscope Mode</strong> for instant symmetry art!</p>';
        html += '<div class="exp-ChallengeBox" style="margin:8px 0 12px;padding:12px 14px;">';
        html += '<div style="font-weight:900;color:#854d0e;">🎯 Quick-Draw Challenge #' + (paintGame.promptIdx + 1) + ': Draw a ' + curP.target + '</div>';
        html += '<div style="font-size:0.9rem;color:#713f12;">' + curP.hint + '</div>';
        html += '</div>';
        html += '<div class="sim-MetricBox" style="margin-bottom:12px;"><span>🤖 Live AI Doodle Classifier Guess:</span><strong id="paint-guess" style="color:#059669;">' + paintGame.aiGuessText + '</strong></div>';
        html += '<div class="sim-PresetRow" style="margin-bottom:10px;">';
        html += '<button type="button" class="sim-TabBtn' + (paintGame.mirrorMode ? ' sim-TabBtn--active' : '') + '" id="paint-mirror-btn">🦋 Mirror Mandala: ' + (paintGame.mirrorMode ? 'ON' : 'Off') + '</button>';
        html += '<button type="button" class="sim-TabBtn' + (paintGame.rainbowMode ? ' sim-TabBtn--active' : '') + '" id="paint-rainbow-btn">🌈 Rainbow Brush: ' + (paintGame.rainbowMode ? 'ON' : 'Off') + '</button>';
        html += '</div>';
        html += '<div class="sim-ExecRow">';
        html += '<button type="button" class="btn-Primary" id="paint-next-prompt">✨ Next Drawing Challenge</button>';
        html += '<button type="button" class="btn-Secondary" id="paint-clear-btn">🗑️ Clear Air Canvas</button>';
        html += '</div>';
      }

      else if (expType === 'goalkeeper') {
        html += '<h3>⚽ AR Stadium Goalkeeper</h3>';
        html += '<p style="margin:6px 0 12px;color:#334155;">You are the goalkeeper! Move your hands (or mouse cursor) to position the <strong>🧤 Giant Golden Goalie Gloves</strong> over the incoming soccer balls before they zoom past you!</p>';
        html += '<div class="sim-NlpResultRow" style="margin-bottom:14px;">';
        html += '<div class="sim-MetricBox"><span>Goals Saved 🧤</span><strong id="gk-saves" style="font-size:1.5rem;color:#10b981;">' + goalieGame.saves + ' Saves</strong></div>';
        html += '<div class="sim-MetricBox"><span>Hot Streak 🔥</span><strong id="gk-streak" style="font-size:1.5rem;color:#f59e0b;">' + goalieGame.streak + ' in a row!</strong></div>';
        html += '</div>';
        html += '<button type="button" class="btn-Primary" id="gk-shoot-btn" style="width:100%;">⚡ Kick Super Fireball Shot Now!</button>';
        html += '<div class="exp-OfflineBox" style="margin-top:14px;"><strong>🤖 3D Depth & Trajectory Prediction:</strong><br>As the ball scales from <code>z = 0.15</code> (far) to <code>z = 1.0</code> (goal line), the AI checks if your hand bounding box overlaps the ball coordinates!</div>';
      }

      else if (expType === 'rps_arena') {
        html += '<h3>✂️ AI Rock-Paper-Scissors Arena</h3>';
        html += '<p style="margin:6px 0 12px;color:#334155;">Battle Sparky the AI Robot! Pick your hand gesture below (or hold your hand up to the webcam) to morph the 21-Keypoint Hand Skeleton and play a round!</p>';
        html += '<div class="sim-NlpResultRow" style="margin-bottom:12px;">';
        html += '<div class="sim-MetricBox"><span>Your Score 🧑</span><strong style="font-size:1.45rem;color:#2563eb;">' + rpsGame.playerScore + ' Wins</strong></div>';
        html += '<div class="sim-MetricBox"><span>Sparky AI 🤖</span><strong style="font-size:1.45rem;color:#ec4899;">' + rpsGame.aiScore + ' Wins</strong></div>';
        html += '</div>';
        html += '<div class="sim-PresetRow" style="margin-bottom:12px;">';
        ['🪨 Rock', '📄 Paper', '✂️ Scissors'].forEach(function(mv) {
          html += '<button type="button" class="btn-Primary" style="flex:1;font-size:1.1rem;" data-rps-move="' + mv + '">Play ' + mv + '</button>';
        });
        html += '</div>';
        html += '<div class="sim-Banner sim-Banner--success" id="rps-status">' + rpsGame.resultText + '</div>';
        html += '<div class="exp-OfflineBox" style="margin-top:12px;"><strong>🤖 How 21-Keypoint Pose Recognition Works:</strong><br>The AI measures the distance from your fingertip landmarks (`#8, #12, #16, #20`) to your wrist (`#0`). All curled = Rock; all extended = Paper; 2 extended = Scissors!</div>';
      }

      else if (expType === 'emoji_mimic') {
        var ch = emojiGame.challenges[emojiGame.targetIdx];
        html += '<h3>😎 Emoji Mimic Face-Off & AR Masks</h3>';
        html += '<p style="margin:6px 0 10px;color:#334155;">Try on holographic AR masks and mimic the target facial expression to fill the AI Landmark Match Meter!</p>';
        html += '<div class="exp-ChallengeBox" style="margin:8px 0 12px;padding:12px 14px;">';
        html += '<div style="font-size:1.15rem;font-weight:900;color:#854d0e;">🎯 Target Expression: ' + ch.emoji + ' ' + ch.name + '</div>';
        html += '<div style="font-size:0.9rem;color:#713f12;">AI Landmark Rule: ' + ch.rule + ' (Score: ' + emojiGame.score + ' Matches!)</div></div>';
        html += '<div class="sim-SubLabel">1. Pick Your Holographic AR Costume Mask:</div>';
        html += '<div class="sim-PresetRow" style="margin:8px 0 12px;">';
        [['astronaut', '👨‍🚀 Astronaut'], ['cyber', '🤖 Cyber Visor'], ['crown', '👑 Royal Crown'], ['cat', '🐱 Neon Cat'], ['dragon', '🐉 Dragon Horns']].forEach(function(m) {
          var act = (emojiGame.mask === m[0]) ? ' sim-TabBtn--active' : '';
          html += '<button type="button" class="sim-TabBtn' + act + '" data-mask="' + m[0] + '">' + m[1] + '</button>';
        });
        html += '</div>';
        html += '<button type="button" class="btn-Primary" id="emoji-match-btn" style="width:100%;">📸 Snap & Match Expression (' + ch.emoji + ') Now!</button>';
      }

      else if (expType === 'tm_arcade') {
        html += '<h3>🚀 Teachable Machine Space Arcade</h3>';
        html += '<p style="margin:6px 0 10px;color:#334155;">Train 3 custom gesture classes right here, then use your trained model to steer the <strong>🚀 AI Starfighter</strong> and blast falling asteroids on the canvas!</p>';
        html += '<div class="sim-PresetRow" style="margin-bottom:10px;">';
        html += '<button type="button" class="sim-OptionBtn" data-tm-cmd="LEFT">⬅️ Class 1: Steer Left (' + tmArcade.samples.LEFT + ')</button>';
        html += '<button type="button" class="sim-OptionBtn" data-tm-cmd="RIGHT">➡️ Class 2: Steer Right (' + tmArcade.samples.RIGHT + ')</button>';
        html += '<button type="button" class="sim-OptionBtn" data-tm-cmd="LASER">⚡ Class 3: Fire Laser! (' + tmArcade.samples.LASER + ')</button>';
        html += '</div>';
        html += '<div style="background:#f8fafc;padding:12px;border-radius:12px;border:2px solid #cbd5e1;margin-bottom:10px;">';
        [['LEFT', '⬅️ Left Thrust', '#3b82f6'], ['RIGHT', '➡️ Right Thrust', '#10b981'], ['LASER', '⚡ Plasma Laser', '#f59e0b']].forEach(function(row) {
          var p = tmArcade.probs[row[0]];
          html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;font-size:0.88rem;font-weight:800;">';
          html += '<span style="width:115px;">' + row[1] + '</span>';
          html += '<div style="flex:1;height:10px;background:#e2e8f0;border-radius:99px;overflow:hidden;"><div style="width:' + p + '%;height:100%;background:' + row[2] + ';"></div></div>';
          html += '<span style="width:38px;text-align:right;">' + p + '%</span></div>';
        });
        html += '</div>';
        html += '<div class="sim-MetricBox"><span>Asteroids Blasted 💥</span><strong id="tm-score" style="font-size:1.4rem;color:#10b981;">' + tmArcade.score + ' Asteroids Destroyed!</strong></div>';
      }

      else {
        html += '<h3>🕵️ Cyborg X-Ray, ASCII Matrix & LiDAR Lab</h3>';
        html += '<p style="margin:6px 0 12px;color:#334155;">Switch between 4 futuristic computer-vision shaders below to see how robots, thermal cameras, and self-driving LiDAR scanners transform pixel matrices in real time!</p>';
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">';
        [
          ['ascii', '🟩 Matrix ASCII Code Vision'],
          ['thermal', '🔥 Thermal Infrared Heatmap'],
          ['edge', '⚡ Neon Sobel Edge Scanner'],
          ['lidar', '🚗 Self-Driving LiDAR Radar']
        ].forEach(function(l) {
          var act = (cyborgLab.lens === l[0]) ? ' sim-OptionBtn--active' : '';
          html += '<button type="button" class="sim-OptionBtn' + act + '" data-cyborg-lens="' + l[0] + '">' + l[1] + '</button>';
        });
        html += '</div>';
        html += '<div class="exp-OfflineBox"><strong>🤖 Real-Time Pixel Shaders:</strong><br>• <strong>Matrix ASCII:</strong> Maps pixel brightness `(0–255)` to glowing characters `[@, #, 8, &, :, .,  ]`.<br>• <strong>Thermal IR:</strong> Maps intensity to a cold-blue ➔ hot-red palette.<br>• <strong>LiDAR Radar:</strong> Casts 16 laser distance rays to measure obstacle depth!</div>';
      }

      html += '</div></div></div>';
      container.innerHTML = html;

      var canvas = container.querySelector('#vis-canvas');
      var ctx = canvas.getContext('2d');
      var videoEl = container.querySelector('#vis-video');
      var statusBadge = container.querySelector('#vis-cam-status');

      if (mode === 'webcam' && mediaStream) {
        videoEl.srcObject = mediaStream;
        videoEl.play().catch(function() {});
      }

      // =====================================================================
      // MAIN 60-FPS ARCADE ANIMATION LOOP
      // =====================================================================
      function drawArcadeLoop() {
        tick++;
        analyzeWebcam(videoEl, canvas.width, canvas.height);

        // 1. Draw Background (Live Mirrored Webcam or Cyber Arcade Grid)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (mode === 'webcam' && mediaStream && videoEl.readyState >= 2) {
          ctx.save();
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
          ctx.restore();
          ctx.fillStyle = 'rgba(15, 23, 42, 0.28)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          var bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
          bgGrad.addColorStop(0, '#0f172a');
          bgGrad.addColorStop(1, '#1e1b4b');
          ctx.fillStyle = bgGrad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
          ctx.lineWidth = 1;
          for (var gx = 0; gx < canvas.width; gx += 40) {
            ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, canvas.height); ctx.stroke();
          }
          for (var gy = 0; gy < canvas.height; gy += 40) {
            ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(canvas.width, gy); ctx.stroke();
          }
        }

        // -----------------------------------------------------------------
        // GAME 1 RENDERER: 🍉 AI NINJA FRUIT SLICER
        // -----------------------------------------------------------------
        if (expType === 'fruit_ninja') {
          if (tick % fruitGame.spawnRate === 0 && fruitGame.fruits.length < 7) {
            spawnFruit();
          }

          // Update & draw whole fruits
          for (var fi = fruitGame.fruits.length - 1; fi >= 0; fi--) {
            var fr = fruitGame.fruits[fi];
            fr.x += fr.vx;
            fr.y += fr.vy;
            fr.vy += 0.22; // gravity
            fr.rot += fr.vrot;

            // Check collision with pointer / motion blade
            if (Math.hypot(pointer.x - fr.x, pointer.y - fr.y) < fr.r + 24) {
              if (fr.isBomb) {
                fruitGame.score = Math.max(0, fruitGame.score - 20);
                fruitGame.combo = 1;
                if (window.ExperimindAudio) window.ExperimindAudio.retry();
              } else {
                fruitGame.score += fr.pts * fruitGame.combo;
                fruitGame.combo = Math.min(10, fruitGame.combo + 1);
                if (window.ExperimindAudio) window.ExperimindAudio.pop();
                if (fruitGame.score > 0 && fruitGame.score % 100 === 0 && window.ExperimindConfetti) {
                  window.ExperimindConfetti.burst();
                }
              }
              // Spawn 2 sliced halves + juice splash particles
              fruitGame.halves.push({ x: fr.x - 10, y: fr.y, vx: -3.5, vy: -3, emoji: fr.emoji, life: 1.0 });
              fruitGame.halves.push({ x: fr.x + 10, y: fr.y, vx: 3.5, vy: -3, emoji: fr.emoji, life: 1.0 });
              for (var sp = 0; sp < 10; sp++) {
                fruitGame.splashes.push({
                  x: fr.x, y: fr.y,
                  vx: (Math.random() - 0.5) * 9,
                  vy: (Math.random() - 0.5) * 9,
                  color: fr.color,
                  r: 4 + Math.random() * 5,
                  life: 1.0
                });
              }
              fruitGame.fruits.splice(fi, 1);
              var scEl = container.querySelector('#fn-score');
              var cbEl = container.querySelector('#fn-combo');
              if (scEl) scEl.textContent = fruitGame.score + ' pts';
              if (cbEl) cbEl.textContent = fruitGame.combo + 'x 🔥';
              continue;
            }

            if (fr.y > canvas.height + 50) {
              fruitGame.fruits.splice(fi, 1);
              continue;
            }

            ctx.save();
            ctx.translate(fr.x, fr.y);
            ctx.rotate(fr.rot);
            ctx.beginPath();
            ctx.arc(0, 0, fr.r, 0, Math.PI * 2);
            ctx.fillStyle = fr.color + '44';
            ctx.fill();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = fr.color;
            ctx.stroke();
            ctx.font = '38px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(fr.emoji, 0, 2);
            ctx.restore();
          }

          // Draw juice splashes
          for (var si = fruitGame.splashes.length - 1; si >= 0; si--) {
            var s = fruitGame.splashes[si];
            s.x += s.vx; s.y += s.vy; s.life -= 0.04;
            if (s.life <= 0) { fruitGame.splashes.splice(si, 1); continue; }
            ctx.globalAlpha = s.life;
            ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = s.color; ctx.fill();
            ctx.globalAlpha = 1;
          }

          // Draw sliced halves
          for (var hi = fruitGame.halves.length - 1; hi >= 0; hi--) {
            var h = fruitGame.halves[hi];
            h.x += h.vx; h.y += h.vy; h.vy += 0.35; h.life -= 0.035;
            if (h.life <= 0) { fruitGame.halves.splice(hi, 1); continue; }
            ctx.globalAlpha = h.life;
            ctx.font = '26px sans-serif';
            ctx.fillText(h.emoji, h.x, h.y);
            ctx.globalAlpha = 1;
          }

          // Draw Glowing Katana Blade Trail
          if (bladeTrail.length > 1) {
            ctx.beginPath();
            bladeTrail.forEach(function(pt, idx) {
              if (idx === 0) ctx.moveTo(pt.x, pt.y);
              else ctx.lineTo(pt.x, pt.y);
              pt.life -= 0.06;
            });
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 7;
            ctx.lineCap = 'round';
            ctx.stroke();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.stroke();
            bladeTrail = bladeTrail.filter(function(pt) { return pt.life > 0; });
          }

          ctx.font = 'bold 16px Inter, sans-serif';
          ctx.fillStyle = '#fde047';
          ctx.textAlign = 'left';
          ctx.fillText('⚔️ SCORE: ' + fruitGame.score + '   |   🔥 COMBO: ' + fruitGame.combo + 'x', 20, 30);
        }

        // -----------------------------------------------------------------
        // GAME 2 RENDERER: 🎹 AIR XYLOPHONE & RAINBOW MUSIC SYNTH
        // -----------------------------------------------------------------
        else if (expType === 'air_harp') {
          var targetNoteIdx = harpGame.songNotes[harpGame.songStep % harpGame.songNotes.length];

          harpGame.bars.forEach(function(bar, idx) {
            if (bar.cooldown > 0) bar.cooldown--;
            var isTarget = (idx === targetNoteIdx);
            var bx = bar.x, by = 45, bw = bar.w, bh = 115 + idx * 8;

            // Check if hand/pointer enters bar hitbox
            if (pointer.x >= bx && pointer.x <= bx + bw && pointer.y >= by && pointer.y <= by + bh) {
              if (bar.cooldown === 0) {
                bar.cooldown = 18;
                harpGame.notesPlayed++;
                playNoteFreq(bar.freq, 0.42);
                harpGame.rings.push({ x: bx + bw / 2, y: by + bh / 2, r: 10, color: bar.color, life: 1.0 });
                if (isTarget) {
                  harpGame.songStep = (harpGame.songStep + 1) % harpGame.songNotes.length;
                  if (harpGame.songStep === 0 && window.ExperimindConfetti) window.ExperimindConfetti.burst();
                }
                var hc = container.querySelector('#harp-count');
                var hs = container.querySelector('#harp-song');
                if (hc) hc.textContent = harpGame.notesPlayed + ' Notes 🎵';
                if (hs) hs.textContent = 'Step ' + (harpGame.songStep + 1) + ' / ' + harpGame.songNotes.length + ' ⭐';
              }
            }

            var bounce = bar.cooldown > 10 ? 8 : 0;
            ctx.fillStyle = bar.color;
            ctx.strokeStyle = isTarget ? '#ffffff' : '#0f172a';
            ctx.lineWidth = isTarget ? 4 : 2;
            ctx.beginPath();
            ctx.roundRect(bx, by + bounce, bw, bh, 12);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 13px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(bar.label.split(' ')[0], bx + bw / 2, by + bh - 18 + bounce);
            if (isTarget) {
              ctx.font = '24px sans-serif';
              ctx.fillText('⭐', bx + bw / 2, by + 28 + bounce);
            }
          });

          // Draw expanding sound rings
          for (var ri = harpGame.rings.length - 1; ri >= 0; ri--) {
            var rg = harpGame.rings[ri];
            rg.r += 4.5; rg.life -= 0.04;
            if (rg.life <= 0) { harpGame.rings.splice(ri, 1); continue; }
            ctx.globalAlpha = rg.life;
            ctx.beginPath(); ctx.arc(rg.x, rg.y, rg.r, 0, Math.PI * 2);
            ctx.strokeStyle = rg.color; ctx.lineWidth = 4; ctx.stroke();
            ctx.globalAlpha = 1;
          }

          ctx.font = '34px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🪄', pointer.x, pointer.y);
        }

        // -----------------------------------------------------------------
        // GAME 3 RENDERER: 🎨 MAGIC AIR CANVAS & QUICK-DRAW AI
        // -----------------------------------------------------------------
        else if (expType === 'air_canvas') {
          paintGame.strokes.forEach(function(st) {
            if (st.points.length < 2) return;
            ctx.strokeStyle = st.color;
            ctx.lineWidth = 6;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            st.points.forEach(function(pt, i) {
              if (i === 0) ctx.moveTo(pt.x, pt.y);
              else ctx.lineTo(pt.x, pt.y);
            });
            ctx.stroke();

            if (st.mirror) {
              ctx.beginPath();
              st.points.forEach(function(pt, i) {
                var mx = canvas.width - pt.x;
                if (i === 0) ctx.moveTo(mx, pt.y);
                else ctx.lineTo(mx, pt.y);
              });
              ctx.stroke();
            }
          });

          if (paintGame.mirrorMode) {
            ctx.strokeStyle = 'rgba(255,255,255,0.25)';
            ctx.setLineDash([6, 6]);
            ctx.beginPath(); ctx.moveTo(canvas.width / 2, 0); ctx.lineTo(canvas.width / 2, canvas.height); ctx.stroke();
            ctx.setLineDash([]);
          }

          ctx.font = '30px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🖌️', pointer.x, pointer.y);
        }

        // -----------------------------------------------------------------
        // GAME 4 RENDERER: ⚽ AR STADIUM GOALKEEPER
        // -----------------------------------------------------------------
        else if (expType === 'goalkeeper') {
          // Draw Goalpost Net
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 6;
          ctx.strokeRect(75, 55, canvas.width - 150, canvas.height - 85);
          ctx.strokeStyle = 'rgba(255,255,255,0.18)';
          ctx.lineWidth = 1;
          for (var nx = 115; nx < canvas.width - 75; nx += 40) {
            ctx.beginPath(); ctx.moveTo(nx, 55); ctx.lineTo(nx, canvas.height - 30); ctx.stroke();
          }

          var b = goalieGame.ball;
          b.z += b.speed;
          var curX = 320 + (b.targetX - 320) * b.z;
          var curY = 205 + (b.targetY - 205) * b.z;
          var curR = 12 + b.z * 32;

          // Target reticle when ball approaches
          ctx.beginPath();
          ctx.arc(b.targetX, b.targetY, 36, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(250, 204, 21, 0.55)';
          ctx.lineWidth = 2.5;
          ctx.setLineDash([5, 5]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Draw approaching ball
          ctx.font = Math.round(curR * 1.7) + 'px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(b.emoji, curX, curY);

          // Check save when ball reaches z >= 0.88
          if (b.z >= 0.88) {
            if (Math.hypot(pointer.x - curX, pointer.y - curY) < 72) {
              goalieGame.saves++;
              goalieGame.streak++;
              goalieGame.saveBurst = { x: curX, y: curY, text: '🧤 SUPER SAVE!', col: '#10b981', life: 25 };
              if (window.ExperimindAudio) window.ExperimindAudio.pop();
              if (goalieGame.saves % 5 === 0 && window.ExperimindConfetti) window.ExperimindConfetti.burst();
            } else {
              goalieGame.missed++;
              goalieGame.streak = 0;
              goalieGame.saveBurst = { x: curX, y: curY, text: '💨 GOAL MISSED!', col: '#f59e0b', life: 25 };
            }
            var svEl = container.querySelector('#gk-saves');
            var stEl = container.querySelector('#gk-streak');
            if (svEl) svEl.textContent = goalieGame.saves + ' Saves';
            if (stEl) stEl.textContent = goalieGame.streak + ' in a row!';
            resetBall();
          }

          if (goalieGame.saveBurst && goalieGame.saveBurst.life > 0) {
            goalieGame.saveBurst.life--;
            ctx.fillStyle = goalieGame.saveBurst.col;
            ctx.font = 'bold 24px Inter, sans-serif';
            ctx.fillText(goalieGame.saveBurst.text, goalieGame.saveBurst.x, goalieGame.saveBurst.y - 30);
          }

          // Draw Goalie Gloves at pointer
          ctx.beginPath();
          ctx.arc(pointer.x, pointer.y, 44, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
          ctx.fill();
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.font = '46px sans-serif';
          ctx.fillText('🧤', pointer.x, pointer.y);
        }

        // -----------------------------------------------------------------
        // GAME 5 RENDERER: ✂️ AI ROCK-PAPER-SCISSORS ARENA
        // -----------------------------------------------------------------
        else if (expType === 'rps_arena') {
          // Left Card: Player Hand + 21-Keypoint Skeleton Overlay
          ctx.fillStyle = 'rgba(30, 58, 138, 0.75)';
          ctx.strokeStyle = '#60a5fa';
          ctx.lineWidth = 3;
          ctx.beginPath(); ctx.roundRect(45, 55, 235, 250, 18); ctx.fill(); ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🧑 YOUR HAND GESTURE', 162, 85);
          ctx.font = '74px sans-serif';
          ctx.fillText(rpsGame.playerMove.slice(0, 2), 162, 175 + Math.sin(tick * 0.1) * 6);
          ctx.font = 'bold 20px Inter, sans-serif';
          ctx.fillStyle = '#fde047';
          ctx.fillText(rpsGame.playerMove, 162, 255);

          // VS Badge
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath(); ctx.arc(320, 180, 28, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#0f172a'; ctx.font = 'bold 18px Inter, sans-serif';
          ctx.fillText('VS', 320, 180);

          // Right Card: Sparky AI Robot Hand
          ctx.fillStyle = 'rgba(88, 28, 135, 0.75)';
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 3;
          ctx.beginPath(); ctx.roundRect(360, 55, 235, 250, 18); ctx.fill(); ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px Inter, sans-serif';
          ctx.fillText('🤖 SPARKY AI PREDICTOR', 477, 85);
          ctx.font = '74px sans-serif';
          ctx.fillText(rpsGame.aiMove.slice(0, 2), 477, 175 - Math.sin(tick * 0.1) * 6);
          ctx.font = 'bold 20px Inter, sans-serif';
          ctx.fillStyle = '#34d399';
          ctx.fillText(rpsGame.aiMove, 477, 255);
        }

        // -----------------------------------------------------------------
        // GAME 6 RENDERER: 😎 EMOJI MIMIC & AR HOLOGRAM MASKS
        // -----------------------------------------------------------------
        else if (expType === 'emoji_mimic') {
          var fx = pointer.x, fy = pointer.y;
          // Draw glowing AI Face Bounding Box + 68-landmark mesh dots
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(fx - 75, fy - 90, 150, 180);

          // Draw AR Mask prop anchored to face
          ctx.font = '68px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          var maskEmoji = '👨‍🚀';
          var offsetY = -55;
          if (emojiGame.mask === 'cyber') { maskEmoji = '🥽'; offsetY = -18; }
          else if (emojiGame.mask === 'crown') { maskEmoji = '👑'; offsetY = -88; }
          else if (emojiGame.mask === 'cat') { maskEmoji = '🐱'; offsetY = -10; }
          else if (emojiGame.mask === 'dragon') { maskEmoji = '🐉'; offsetY = -75; }
          ctx.fillText(maskEmoji, fx, fy + offsetY);

          // Target Emoji HUD in top-left corner
          var targetCh = emojiGame.challenges[emojiGame.targetIdx];
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.fillRect(16, 16, 260, 66);
          ctx.strokeStyle = '#facc15';
          ctx.strokeRect(16, 16, 260, 66);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 15px Inter, sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText('🎯 MIMIC THIS: ' + targetCh.emoji + ' ' + targetCh.name, 28, 42);
          ctx.fillStyle = '#34d399';
          ctx.font = '13px Inter, sans-serif';
          ctx.fillText('Matches Won: ' + emojiGame.score + ' 🏆', 28, 66);
        }

        // -----------------------------------------------------------------
        // GAME 7 RENDERER: 🚀 TEACHABLE MACHINE SPACE ARCADE
        // -----------------------------------------------------------------
        else if (expType === 'tm_arcade') {
          // Steer ship by pointer X or trained command
          if (tmArcade.activeCommand === 'LEFT') tmArcade.shipX = Math.max(50, tmArcade.shipX - 4.5);
          else if (tmArcade.activeCommand === 'RIGHT') tmArcade.shipX = Math.min(canvas.width - 50, tmArcade.shipX + 4.5);
          else tmArcade.shipX += (pointer.x - tmArcade.shipX) * 0.15;

          if (tick % 18 === 0) {
            tmArcade.lasers.push({ x: tmArcade.shipX, y: 315 });
          }

          // Update & draw lasers
          for (var li = tmArcade.lasers.length - 1; li >= 0; li--) {
            var lz = tmArcade.lasers[li];
            lz.y -= 8;
            if (lz.y < 0) { tmArcade.lasers.splice(li, 1); continue; }
            ctx.fillStyle = '#facc15';
            ctx.fillRect(lz.x - 3, lz.y, 6, 18);
          }

          // Update & draw asteroids
          tmArcade.asteroids.forEach(function(ast) {
            ast.y += ast.vy;
            if (ast.y > canvas.height - 40) {
              ast.y = 20;
              ast.x = 60 + Math.random() * (canvas.width - 120);
            }
            // Check laser hit
            for (var li = tmArcade.lasers.length - 1; li >= 0; li--) {
              var lz = tmArcade.lasers[li];
              if (Math.hypot(lz.x - ast.x, lz.y - ast.y) < ast.r + 12) {
                tmArcade.score++;
                ast.y = 15;
                ast.x = 60 + Math.random() * (canvas.width - 120);
                tmArcade.lasers.splice(li, 1);
                if (window.ExperimindAudio) window.ExperimindAudio.pop();
                var ts = container.querySelector('#tm-score');
                if (ts) ts.textContent = tmArcade.score + ' Asteroids Destroyed!';
                break;
              }
            }
            ctx.font = '36px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(ast.emoji, ast.x, ast.y);
          });

          // Draw Player Starfighter
          ctx.font = '44px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🚀', tmArcade.shipX, 340);
        }

        // -----------------------------------------------------------------
        // GAME 8 RENDERER: 🕵️ CYBORG X-RAY, MATRIX ASCII & LIDAR LAB
        // -----------------------------------------------------------------
        else {
          if (cyborgLab.lens === 'ascii') {
            ctx.fillStyle = '#020617';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#10b981';
            ctx.font = 'bold 13px monospace';
            var chars = ['@', '#', '8', '&', 'o', ':', '*', '.', ' '];
            for (var r = 16; r < canvas.height; r += 18) {
              for (var c = 16; c < canvas.width; c += 16) {
                var d = Math.hypot(c - pointer.x, r - pointer.y);
                var chIdx = d < 95 ? Math.floor((d / 95) * 4) : (4 + ((r + c + tick) % 5));
                ctx.fillText(chars[chIdx], c, r);
              }
            }
          } else if (cyborgLab.lens === 'thermal') {
            var radGrad = ctx.createRadialGradient(pointer.x, pointer.y, 15, pointer.x, pointer.y, 190);
            radGrad.addColorStop(0, '#ffffff');
            radGrad.addColorStop(0.25, '#ef4444');
            radGrad.addColorStop(0.55, '#f59e0b');
            radGrad.addColorStop(0.8, '#10b981');
            radGrad.addColorStop(1, '#1e3a8a');
            ctx.fillStyle = radGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 16px monospace';
            ctx.fillText('🔥 THERMAL IR PEAK: 37.2°C AT (' + Math.round(pointer.x) + ',' + Math.round(pointer.y) + ')', 20, 32);
          } else if (cyborgLab.lens === 'edge') {
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.5;
            for (var ring = 25; ring <= 125; ring += 25) {
              ctx.beginPath();
              ctx.arc(pointer.x, pointer.y, ring + Math.sin(tick * 0.1 + ring) * 6, 0, Math.PI * 2);
              ctx.stroke();
            }
            ctx.fillStyle = '#fde047';
            ctx.font = 'bold 15px monospace';
            ctx.fillText('⚡ SOBEL GRADIENT MAGNITUDE: 248 / 255', 20, 32);
          } else {
            // LiDAR Laser Ray Scanner
            var carX = 320, carY = 345;
            for (var ang = -1.2; ang <= 1.2; ang += 0.15) {
              var rx = carX + Math.sin(ang) * 260;
              var ry = carY - Math.cos(ang) * 260;
              ctx.beginPath();
              ctx.moveTo(carX, carY);
              ctx.lineTo(rx, ry);
              ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
              ctx.lineWidth = 2;
              ctx.stroke();
            }
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 3;
            ctx.strokeRect(pointer.x - 42, pointer.y - 42, 84, 84);
            ctx.fillStyle = '#fde047';
            ctx.font = 'bold 14px monospace';
            var distM = Math.max(1.2, ((350 - pointer.y) / 35)).toFixed(1);
            ctx.fillText('🎯 LIDAR TARGET: ' + distM + 'm', pointer.x - 55, pointer.y - 50);
            ctx.font = '42px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('🚗', carX, carY);
          }
        }

        animId = requestAnimationFrame(drawArcadeLoop);
      }

      // =====================================================================
      // POINTER, TOUCH & BUTTON LISTENERS
      // =====================================================================
      function updatePointerFromEvent(ev) {
        var rect = canvas.getBoundingClientRect();
        var clientX = ev.touches ? ev.touches[0].clientX : ev.clientX;
        var clientY = ev.touches ? ev.touches[0].clientY : ev.clientY;
        pointer.prevX = pointer.x;
        pointer.prevY = pointer.y;
        pointer.x = (clientX - rect.left) * (canvas.width / rect.width);
        pointer.y = (clientY - rect.top) * (canvas.height / rect.height);
        pointer.vx = pointer.x - pointer.prevX;
        pointer.vy = pointer.y - pointer.prevY;
        bladeTrail.push({ x: pointer.x, y: pointer.y, life: 1.0 });
        if (bladeTrail.length > 18) bladeTrail.shift();

        if (expType === 'air_canvas' && pointer.isDown && paintGame.currentStroke) {
          if (paintGame.rainbowMode) {
            paintGame.currentStroke.color = 'hsl(' + ((tick * 5) % 360) + ', 90%, 60%)';
          }
          paintGame.currentStroke.points.push({ x: pointer.x, y: pointer.y });
          if (paintGame.currentStroke.points.length > 15) {
            var gEl = container.querySelector('#paint-guess');
            if (gEl) gEl.textContent = paintGame.prompts[paintGame.promptIdx].guess;
          }
        }
      }

      canvas.addEventListener('mousedown', function(ev) {
        pointer.isDown = true;
        updatePointerFromEvent(ev);
        if (expType === 'air_canvas') {
          paintGame.currentStroke = {
            points: [{ x: pointer.x, y: pointer.y }],
            color: paintGame.rainbowMode ? 'hsl(' + ((tick * 5) % 360) + ', 90%, 60%)' : paintGame.brushColor,
            mirror: paintGame.mirrorMode
          };
          paintGame.strokes.push(paintGame.currentStroke);
        }
      });
      window.addEventListener('mouseup', function() { pointer.isDown = false; });
      canvas.addEventListener('mousemove', updatePointerFromEvent);

      // Tab Switching
      container.querySelectorAll('[data-vis-exp]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          expType = btn.getAttribute('data-vis-exp');
          if (window.ExperimindAudio) window.ExperimindAudio.click();
          render();
        });
      });

      // Game 1 Controls
      var fnBurst = container.querySelector('#fn-burst-btn');
      if (fnBurst) {
        fnBurst.addEventListener('click', function() {
          for (var i = 0; i < 8; i++) spawnFruit();
          if (window.ExperimindAudio) window.ExperimindAudio.pop();
        });
      }

      // Game 2 Controls
      container.querySelectorAll('[data-harp-note]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var idx = parseInt(btn.getAttribute('data-harp-note'), 10);
          var bar = harpGame.bars[idx];
          if (bar) {
            playNoteFreq(bar.freq, 0.45);
            harpGame.notesPlayed++;
            harpGame.rings.push({ x: bar.x + bar.w / 2, y: 110, r: 12, color: bar.color, life: 1.0 });
            var hc = container.querySelector('#harp-count');
            if (hc) hc.textContent = harpGame.notesPlayed + ' Notes 🎵';
          }
        });
      });

      // Game 3 Controls
      var mirBtn = container.querySelector('#paint-mirror-btn');
      if (mirBtn) mirBtn.addEventListener('click', function() { paintGame.mirrorMode = !paintGame.mirrorMode; render(); });
      var rbwBtn = container.querySelector('#paint-rainbow-btn');
      if (rbwBtn) rbwBtn.addEventListener('click', function() { paintGame.rainbowMode = !paintGame.rainbowMode; render(); });
      var nxtP = container.querySelector('#paint-next-prompt');
      if (nxtP) nxtP.addEventListener('click', function() {
        paintGame.promptIdx = (paintGame.promptIdx + 1) % paintGame.prompts.length;
        paintGame.strokes = [];
        if (window.ExperimindConfetti) window.ExperimindConfetti.burst();
        render();
      });
      var clrP = container.querySelector('#paint-clear-btn');
      if (clrP) clrP.addEventListener('click', function() { paintGame.strokes = []; render(); });

      // Game 4 Controls
      var gkShoot = container.querySelector('#gk-shoot-btn');
      if (gkShoot) gkShoot.addEventListener('click', function() { resetBall(); goalieGame.ball.emoji = '🔥'; });

      // Game 5 Controls
      container.querySelectorAll('[data-rps-move]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var pMove = btn.getAttribute('data-rps-move');
          var moves = ['🪨 Rock', '📄 Paper', '✂️ Scissors'];
          var aMove = moves[Math.floor(Math.random() * 3)];
          rpsGame.playerMove = pMove;
          rpsGame.aiMove = aMove;
          if (pMove === aMove) {
            rpsGame.resultText = '🤝 TIE ROUND! Both picked ' + pMove + '!';
          } else if (
            (pMove.indexOf('Rock') !== -1 && aMove.indexOf('Scissors') !== -1) ||
            (pMove.indexOf('Paper') !== -1 && aMove.indexOf('Rock') !== -1) ||
            (pMove.indexOf('Scissors') !== -1 && aMove.indexOf('Paper') !== -1)
          ) {
            rpsGame.playerScore++;
            rpsGame.resultText = '🎉 YOU WIN! ' + pMove + ' beats ' + aMove + '!';
            if (window.ExperimindAudio) window.ExperimindAudio.fanfare();
            if (window.ExperimindConfetti) window.ExperimindConfetti.burst();
          } else {
            rpsGame.aiScore++;
            rpsGame.resultText = '🤖 SPARKY WINS! ' + aMove + ' beats ' + pMove + '!';
            if (window.ExperimindAudio) window.ExperimindAudio.pop();
          }
          render();
        });
      });

      // Game 6 Controls
      container.querySelectorAll('[data-mask]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          emojiGame.mask = btn.getAttribute('data-mask');
          if (window.ExperimindAudio) window.ExperimindAudio.click();
          render();
        });
      });
      var emMatch = container.querySelector('#emoji-match-btn');
      if (emMatch) {
        emMatch.addEventListener('click', function() {
          emojiGame.score++;
          emojiGame.targetIdx = (emojiGame.targetIdx + 1) % emojiGame.challenges.length;
          if (window.ExperimindAudio) window.ExperimindAudio.fanfare();
          if (window.ExperimindConfetti) window.ExperimindConfetti.burst();
          render();
        });
      }

      // Game 7 Controls
      container.querySelectorAll('[data-tm-cmd]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var cmd = btn.getAttribute('data-tm-cmd');
          tmArcade.samples[cmd]++;
          tmArcade.activeCommand = cmd;
          if (cmd === 'LEFT') { tmArcade.probs = { LEFT: 88, RIGHT: 6, LASER: 6 }; tmArcade.shipX = Math.max(60, tmArcade.shipX - 70); }
          if (cmd === 'RIGHT') { tmArcade.probs = { LEFT: 6, RIGHT: 88, LASER: 6 }; tmArcade.shipX = Math.min(580, tmArcade.shipX + 70); }
          if (cmd === 'LASER') {
            tmArcade.probs = { LEFT: 5, RIGHT: 5, LASER: 90 };
            for (var k = -1; k <= 1; k++) tmArcade.lasers.push({ x: tmArcade.shipX + k * 24, y: 310 });
          }
          if (window.ExperimindAudio) window.ExperimindAudio.pop();
          render();
        });
      });

      // Game 8 Controls
      container.querySelectorAll('[data-cyborg-lens]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          cyborgLab.lens = btn.getAttribute('data-cyborg-lens');
          if (window.ExperimindAudio) window.ExperimindAudio.pop();
          render();
        });
      });

      // Webcam Hardware Start / Stop
      container.querySelector('#vis-start-cam').addEventListener('click', function() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          statusBadge.className = 'vision-StatusBadge';
          statusBadge.textContent = 'ℹ️ Hardware webcam blocked in this sandbox — playing in Interactive Mouse/Touch Arcade Mode!';
          return;
        }
        statusBadge.textContent = '⏳ Starting Webcam... Wave your hands when the camera light turns on!';
        navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } }).then(function(stream) {
          mediaStream = stream;
          videoEl.srcObject = stream;
          videoEl.play().catch(function() {});
          mode = 'webcam';
          statusBadge.className = 'vision-StatusBadge vision-StatusBadge--live';
          statusBadge.textContent = '🔴 LIVE WEBCAM ACTIVE — Wave your hands in the air to slice fruit, play music & block shots!';
        }).catch(function() {
          mode = 'virtual';
          statusBadge.className = 'vision-StatusBadge';
          statusBadge.textContent = '🎮 Playing in Interactive Mouse / Touch Arcade Mode!';
        });
      });

      container.querySelector('#vis-stop-cam').addEventListener('click', function() {
        stopHardwareCamera();
        mode = 'virtual';
        render();
      });

      container.querySelector('#vis-virtual-btn').addEventListener('click', function() {
        stopHardwareCamera();
        mode = 'virtual';
        render();
      });

      if (expType === 'fruit_ninja' && fruitGame.fruits.length === 0) {
        for (var i = 0; i < 4; i++) spawnFruit();
      }
      drawArcadeLoop();
    }

    render();
  }

  return {
    mount: mount,
    stopHardwareCamera: stopHardwareCamera
  };
})();
