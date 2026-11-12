// Experimind AI Learning Lab — Procedural Topic-Specific HTML5 Canvas Video Engine (Top 1% Edition)
window.ExperimindVideoPlayer = (function() {
  var activePlayers = {};

  var VIDEO_SCENES = {
    'vid-01': [
      { title: '1. Big Scary Problems?', caption: 'When a problem is HUGE (like building a robot castle), where do we start?', bg: '#1e3a8a', icon: '🏰', subIcon: '🤔' },
      { title: '2. Decomposition!', caption: 'Break the giant castle into 4 small, easy steps: Base ➔ Walls ➔ Towers ➔ Flag!', bg: '#065f46', icon: '🧱', subIcon: '✨' },
      { title: '3. Spot the Pattern!', caption: 'Look for repeating colors and shapes so you can build 10x faster!', bg: '#7c2d12', icon: '🔁', subIcon: '🌈' },
      { title: '4. Write the Algorithm!', caption: 'Put your steps in exact 1-2-3 order—that is Computational Thinking!', bg: '#4c1d95', icon: '🚀', subIcon: '🏆' }
    ],
    'vid-02': [
      { title: '1. What is an Algorithm?', caption: 'An algorithm is a step-by-step recipe to finish a job—like guiding a robot or brushing teeth!', bg: '#0f172a', icon: '🪥', subIcon: '😁' },
      { title: '2. Sequence Bug Alert!', caption: 'If Step 2 and Step 3 are swapped, the robot hits a wall—that mistake is called a BUG!', bg: '#7f1d1d', icon: '🐞', subIcon: '🚧' },
      { title: '3. Step 1 ➔ Step 2 ➔ Step 3', caption: 'Debugging fixes the broken arrow so the robot glides along every tile in order!', bg: '#065f46', icon: '✅', subIcon: '🤖' },
      { title: '4. Computers Follow Steps Literally', caption: 'Clear, unambiguous instructions help robots and computers achieve any goal!', bg: '#1e40af', icon: '🎯', subIcon: '🌟' }
    ],
    'vid-03': [
      { title: '1. The 3-Stage Computer Factory', caption: 'Every computer algorithm works like a factory pipeline: INPUT ➔ PROCESS ➔ OUTPUT!', bg: '#1e3a8a', icon: '🏭', subIcon: '⚡' },
      { title: '2. Stage 1: INPUT', caption: 'Sensors, keyboards, and mice feed raw ingredients (data) into the pipeline!', bg: '#047857', icon: '⌨️', subIcon: '🖱️' },
      { title: '3. Stage 2: PROCESS', caption: 'The CPU Brain spins through your algorithm rules to calculate, sort, or transform!', bg: '#6d28d9', icon: '🧠', subIcon: '⚙️' },
      { title: '4. Stage 3: OUTPUT', caption: 'The screen, speakers, or robot motors deliver the finished result!', bg: '#b45309', icon: '🖥️', subIcon: '🎉' }
    ],
    'vid-04': [
      { title: '1. Coding Like Interlocking Bricks!', caption: 'In Scratch and Block Studio, you snap colorful command blocks together with zero syntax errors!', bg: '#b45309', icon: '🐱', subIcon: '🧩' },
      { title: '2. Event Hat Blocks', caption: 'Start with a golden Event block: "when green flag clicked" triggers your stack!', bg: '#065f46', icon: '🟢', subIcon: '🎬' },
      { title: '3. Repeat Loops & Spirographs', caption: 'Place Move & Turn blocks inside a Repeat loop to draw stars and geometric patterns!', bg: '#1d4ed8', icon: '🔁', subIcon: '❄️' },
      { title: '4. Variables & Game Scoreboards', caption: 'Add a Score variable box that increments every time your sprite collects a star!', bg: '#7e22ce', icon: '🎮', subIcon: '🏆' }
    ],
    'vid-05': [
      { title: '1. Fixed Rules vs. Learning Patterns', caption: 'A timer toaster follows blind rules. Artificial Intelligence learns patterns from DATA!', bg: '#0f172a', icon: '🧠', subIcon: '✨' },
      { title: '2. The 3 Domains: Data, Vision & NLP', caption: 'AI crunches number tables, recognizes objects in camera pixels, and understands speech!', bg: '#1e40af', icon: '📷', subIcon: '🎙️' },
      { title: '3. Neural Connections That Adapt', caption: 'As more examples flow through the network, strong connections light up and improve!', bg: '#047857', icon: '📊', subIcon: '🔍' },
      { title: '4. Solving Real-World Challenges', caption: 'From crop health detection to early flood alerts, AI empowers human innovators!', bg: '#4c1d95', icon: '🌍', subIcon: '💚' }
    ],
    'vid-06': [
      { title: '1. Supervised Learning: Labeled Examples', caption: 'We teach a classifier by feeding labeled training data (Apples vs. Bananas)!', bg: '#1e3a8a', icon: '🍎', subIcon: '🍌' },
      { title: '2. Plotting Features on X and Y Axes', caption: 'Each fruit becomes a point on a 2D graph based on Sweetness (X) and Crunchiness (Y)!', bg: '#065f46', icon: '📏', subIcon: '📈' },
      { title: '3. Sweeping the Decision Boundary', caption: 'The machine learning algorithm finds the optimal boundary line separating the two clusters!', bg: '#6d28d9', icon: '🎯', subIcon: '⚡' },
      { title: '4. Predicting Unseen Test Points', caption: 'When a mystery fruit lands on the graph, which side of the boundary it falls on decides its class!', bg: '#b45309', icon: '🤖', subIcon: '🌟' }
    ],
    'vid-07': [
      { title: '1. Step 1 of Teachable Machine: GATHER', caption: 'Every accurate ML model starts by collecting diverse sample frames into class buckets!', bg: '#1d4ed8', icon: '📷', subIcon: '🗂️' },
      { title: '2. Class A, Class B & Class C Buckets', caption: 'Capture 25+ snapshots for each gesture or object category in browser memory!', bg: '#047857', icon: '👍', subIcon: '✋' },
      { title: '3. Vary Angles, Distance & Lighting', caption: 'Rotating and moving objects during capture prevents overfitting to one background!', bg: '#7c2d12', icon: '🔄', subIcon: '💡' },
      { title: '4. Balanced Datasets = Fair Accuracy', caption: 'Keeping sample counts equal across all classes ensures unbiased training!', bg: '#4c1d95', icon: '⚖️', subIcon: '✅' }
    ],
    'vid-08': [
      { title: '1. Sliding 3×3 Convolution Filters', caption: 'Computer Vision scans images with a 3×3 math window to extract edges and shapes!', bg: '#0f172a', icon: '🖼️', subIcon: '⚡' },
      { title: '2. Live Softmax Confidence Meters', caption: 'The output layer outputs probabilities: 94% Class A, 4% Class B, 2% Class C!', bg: '#065f46', icon: '📊', subIcon: '🐱' },
      { title: '3. Debugging Misclassified Edge Cases', caption: 'When confidence splits 50%/50%, we add clearer boundary examples and retrain!', bg: '#b45309', icon: '🔧', subIcon: '🎯' },
      { title: '4. Real-Time Browser Inference', caption: 'Test your trained vision model live in our Webcam tab with zero cloud uploads!', bg: '#1e40af', icon: '🚀', subIcon: '🏆' }
    ],
    'vid-09': [
      { title: '1. How Dataset Bias Happens', caption: 'If 90% of training samples come from one group, the AI scale tips unfairly!', bg: '#7f1d1d', icon: '🍏', subIcon: '⚠️' },
      { title: '2. The Background Shortcut Trap', caption: 'An AI might accidentally learn snow = wolf if all wolf photos have snowy backgrounds!', bg: '#92400e', icon: '⚖️', subIcon: '🔍' },
      { title: '3. Auditing Precision & Recall', caption: 'Engineers inspect the Confusion Matrix across every subgroup to catch hidden errors!', bg: '#1e3a8a', icon: '📋', subIcon: '🛡️' },
      { title: '4. Rebalancing for Fair & Inclusive AI', caption: 'Adding diverse, balanced training samples restores equilibrium and fairness!', bg: '#065f46', icon: '🌍', subIcon: '🤝' }
    ],
    'vid-10': [
      { title: '1. Breaking Text into Word Tokens', caption: 'NLP pipelines split sentences into tokens and filter out low-signal stop-words!', bg: '#1e3a8a', icon: '💬', subIcon: '🧩' },
      { title: '2. Next-Token Probability Distribution', caption: 'Given context tokens, an LLM scores candidate next words: "kitchen" (52%), "park" (31%)!', bg: '#4c1d95', icon: '🎲', subIcon: '📈' },
      { title: '3. Statistical Patterns, Not Human Feelings', caption: 'Chatbots predict token sequences mathematically—they do not have feelings or beliefs.', bg: '#0f172a', icon: '🤖', subIcon: '💡' },
      { title: '4. Guarding Against Hallucinations', caption: 'Always verify AI answers against trusted textbooks and never share private PII!', bg: '#047857', icon: '🕵️', subIcon: '✅' }
    ],
    'vid-11': [
      { title: '1. The 4 Pillars of Responsible AI', caption: 'Privacy, Fairness, Explainability, and Human-in-the-Loop Accountability!', bg: '#0f172a', icon: '🛡️', subIcon: '⚖️' },
      { title: '2. Explicit Consent & Data Minimization', caption: 'Sensors and cameras must never record students without clear, opt-in permission!', bg: '#1e40af', icon: '🔒', subIcon: '📷' },
      { title: '3. Human-in-the-Loop Oversight', caption: 'Doctors, teachers, and engineers always review high-stakes AI recommendations!', bg: '#065f46', icon: '👩‍⚕️', subIcon: '🤝' },
      { title: '4. AI for Sustainable Development (SDGs)', caption: 'Design ethical AI that conserves water, improves health, and empowers communities!', bg: '#6d28d9', icon: '🌟', subIcon: '🚀' }
    ],
    'vid-12': [
      { title: '1. How Generative AI Synthesizes Media', caption: 'Generative models refine random noise into structured images, audio, and code!', bg: '#4c1d95', icon: '🎨', subIcon: '✨' },
      { title: '2. Spotting Deepfakes & Synthetic Artifacts', caption: 'Inspect lighting consistency, edge artifacts, and verify across official sources!', bg: '#991b1b', icon: '🔎', subIcon: '⚠️' },
      { title: '3. Co-Pilot for Brainstorming, Not Plagiarism', caption: 'Use AI to explore ideas while keeping your own creative voice and critical thinking!', bg: '#065f46', icon: '🧠', subIcon: '✍️' },
      { title: '4. The Responsible AI Innovator Pledge', caption: 'Build transparent, ethical, and creative technology that benefits everyone!', bg: '#1e40af', icon: '🏆', subIcon: '🌈' }
    ]
  };

  function stopAll() {
    Object.keys(activePlayers).forEach(function(k) {
      if (activePlayers[k] && activePlayers[k].animId) {
        cancelAnimationFrame(activePlayers[k].animId);
      }
    });
    activePlayers = {};
    if (window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
  }

  function speakText(text) {
    if (!window.ExperimindAudio || !window.ExperimindAudio.isEnabled()) return;
    if (!window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      var utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.98;
      utter.pitch = 1.06;
      window.speechSynthesis.speak(utter);
    } catch (e) {}
  }

  // Bespoke procedural diagram renderer per video topic
  function drawProceduralDiagram(ctx, vid, sceneIdx, tick, w, h) {
    var t = tick * 0.04;
    ctx.save();

    if (vid === 'vid-01') {
      // Decomposition Tree: 1 Top Master Block splitting into 4 animated sub-blocks
      var topX = w / 2, topY = 86;
      var subs = [
        { x: 140, y: 175, label: '1. Base 🧱', col: '#38bdf8' },
        { x: 260, y: 175, label: '2. Walls 🏰', col: '#10b981' },
        { x: 380, y: 175, label: '3. Towers 🗼', col: '#f59e0b' },
        { x: 500, y: 175, label: '4. Flag 🚩', col: '#ec4899' }
      ];
      subs.forEach(function(sb, i) {
        ctx.beginPath();
        ctx.moveTo(topX, topY + 20);
        ctx.lineTo(sb.x, sb.y - 22);
        ctx.strokeStyle = (i <= sceneIdx) ? sb.col : 'rgba(255,255,255,0.25)';
        ctx.lineWidth = (i <= sceneIdx) ? 3.5 : 1.5;
        ctx.stroke();

        var bob = (i === sceneIdx) ? Math.sin(t * 2) * 6 : 0;
        ctx.fillStyle = (i <= sceneIdx) ? sb.col : 'rgba(30,41,59,0.8)';
        ctx.beginPath();
        ctx.roundRect(sb.x - 52, sb.y - 20 + bob, 104, 40, 10);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(sb.label, sb.x, sb.y + 4 + bob);
      });
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.roundRect(topX - 95, topY - 22, 190, 42, 12);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillText('🏰 Big Problem: Castle', topX, topY + 4);
    }

    else if (vid === 'vid-02') {
      // Algorithm Step Track: 5 tiles with animated Robot & Bug fix
      var startX = 115, y0 = 135, gap = 102;
      var steps = ['1. Start 🟢', '2. Open Cap', '3. Squeeze', '4. Brush 🪥', '5. Smile 😁'];
      for (var i = 0; i < 5; i++) {
        var tx = startX + i * gap;
        var isBug = (sceneIdx === 1 && i === 2);
        ctx.fillStyle = isBug ? '#ef4444' : '#1e293b';
        ctx.strokeStyle = isBug ? '#fca5a5' : '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(tx - 44, y0 - 28, 88, 56, 12);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(isBug ? '🐞 BUG!' : steps[i], tx, y0 + 4);
      }
      var robIdx = (tick * 0.03) % 4;
      if (sceneIdx === 1 && robIdx > 2) robIdx = 2;
      var rx = startX + robIdx * gap;
      ctx.font = '34px sans-serif';
      ctx.fillText('🤖', rx, y0 - 44);
    }

    else if (vid === 'vid-03') {
      // IPO Factory Pipeline with animated conveyor packets
      var boxes = [
        { x: 140, y: 135, title: '📥 INPUT', sub: 'Raw Data (5, 3)', col: '#10b981' },
        { x: 320, y: 135, title: '⚙️ CPU PROCESS', sub: 'Rule: Add (5 + 3)', col: '#6366f1' },
        { x: 500, y: 135, title: '📤 OUTPUT', sub: 'Result = 8!', col: '#f59e0b' }
      ];
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(205, 135); ctx.lineTo(435, 135); ctx.stroke();

      // Moving packet
      var px = 160 + ((tick * 2.5) % 320);
      ctx.beginPath(); ctx.arc(px, 135, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#fde047'; ctx.fill();

      boxes.forEach(function(b, idx) {
        var pulse = (sceneIdx === idx + 1) ? Math.sin(t * 2.5) * 5 : 0;
        ctx.fillStyle = b.col;
        ctx.beginPath();
        ctx.roundRect(b.x - 72, b.y - 36 + pulse, 144, 72, 14);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(b.title, b.x, b.y - 6 + pulse);
        ctx.font = '12px Inter, sans-serif';
        ctx.fillText(b.sub, b.x, b.y + 16 + pulse);
      });
    }

    else if (vid === 'vid-04') {
      // Block Coding Stack on Left + Live Rotating Spirograph Star on Right
      var blocks = [
        { label: '🟢 when flag clicked', col: '#eab308', y: 78 },
        { label: '🔁 repeat 8 times', col: '#f97316', y: 112 },
        { label: '  🟦 move 60 steps', col: '#2563eb', y: 146 },
        { label: '  🟦 turn 135 degrees', col: '#2563eb', y: 180 }
      ];
      blocks.forEach(function(b, i) {
        var active = (i <= sceneIdx);
        ctx.fillStyle = active ? b.col : 'rgba(255,255,255,0.15)';
        ctx.beginPath();
        ctx.roundRect(80, b.y, 210, 30, 8);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(b.label, 92, b.y + 19);
      });
      // Right: Rotating Spirograph Star
      var cx = 460, cy = 138;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.4);
      ctx.beginPath();
      for (var k = 0; k < 8; k++) {
        var ang = (k * 135 * Math.PI) / 180;
        var sx = Math.cos(ang) * 58, sy = Math.sin(ang) * 58;
        if (k === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
      ctx.font = '26px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🐱', cx, cy + 8);
    }

    else if (vid === 'vid-05' || vid === 'vid-10') {
      // Neural Network / Token Graph with Live Signal Pulses
      var l1 = [85, 138, 190], l2 = [75, 120, 165, 205], l3 = [110, 165];
      var x1 = 150, x2 = 320, x3 = 490;
      l1.forEach(function(y1, i) {
        l2.forEach(function(y2, j) {
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
          ctx.strokeStyle = 'rgba(147, 197, 253, 0.35)'; ctx.lineWidth = 1.8; ctx.stroke();
          if ((i + j) % 2 === 0) {
            var p = ((tick * 0.02 + i * 0.2 + j * 0.15) % 1);
            ctx.beginPath();
            ctx.arc(x1 + (x2 - x1) * p, y1 + (y2 - y1) * p, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#fde047'; ctx.fill();
          }
        });
      });
      l2.forEach(function(y2, j) {
        l3.forEach(function(y3) {
          ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x3, y3);
          ctx.strokeStyle = 'rgba(52, 211, 153, 0.45)'; ctx.lineWidth = 2; ctx.stroke();
        });
      });
      [ [x1, l1, '#3b82f6'], [x2, l2, '#8b5cf6'], [x3, l3, '#10b981'] ].forEach(function(grp) {
        grp[1].forEach(function(yy) {
          ctx.beginPath(); ctx.arc(grp[0], yy, 14, 0, Math.PI * 2);
          ctx.fillStyle = grp[2]; ctx.fill();
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.stroke();
        });
      });
    }

    else if (vid === 'vid-06') {
      // 2D Scatter Plot + Animated Sweeping Decision Boundary Line
      var gx = 170, gy = 68, gw = 300, gh = 140;
      ctx.fillStyle = 'rgba(15,23,42,0.75)';
      ctx.fillRect(gx, gy, gw, gh);
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
      ctx.strokeRect(gx, gy, gw, gh);
      var apples = [[210, 95], [235, 110], [195, 120], [250, 88]];
      var bananas = [[380, 175], [410, 160], [435, 185], [360, 190]];
      apples.forEach(function(pt) {
        ctx.beginPath(); ctx.arc(pt[0], pt[1], 8, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444'; ctx.fill();
      });
      bananas.forEach(function(pt) {
        ctx.beginPath(); ctx.arc(pt[0], pt[1], 8, 0, Math.PI * 2);
        ctx.fillStyle = '#facc15'; ctx.fill();
      });
      // Sweeping boundary line
      var sweep = Math.sin(t) * 18;
      ctx.beginPath();
      ctx.moveTo(gx + 30, gy + gh - 10 + sweep);
      ctx.lineTo(gx + gw - 30, gy + 10 - sweep);
      ctx.strokeStyle = '#10b981'; ctx.lineWidth = 3.5;
      ctx.setLineDash([6, 4]); ctx.stroke(); ctx.setLineDash([]);
    }

    else if (vid === 'vid-07' || vid === 'vid-08') {
      // 3 Class Confidence Bars + Sliding 3x3 Viewfinder
      var classes = [
        { name: 'Class A (Thumbs Up 👍)', pct: 88 + Math.round(Math.sin(t) * 6), col: '#10b981', y: 85 },
        { name: 'Class B (Open Palm ✋)', pct: 8, col: '#3b82f6', y: 132 },
        { name: 'Class C (Peace Sign ✌️)', pct: 4, col: '#f59e0b', y: 179 }
      ];
      classes.forEach(function(c) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(c.name + ' — ' + c.pct + '%', 140, c.y);
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(140, c.y + 8, 360, 16);
        ctx.fillStyle = c.col;
        ctx.fillRect(140, c.y + 8, (360 * c.pct) / 100, 16);
      });
    }

    else if (vid === 'vid-09') {
      // Animated Algorithmic Bias Balance Scale
      var cx = w / 2, cy = 140;
      var tilt = (sceneIdx < 2) ? 0.28 : Math.sin(t) * 0.03;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(tilt);
      ctx.strokeStyle = '#fde047'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(-140, 0); ctx.lineTo(140, 0); ctx.stroke();
      ctx.fillStyle = '#10b981'; ctx.fillRect(-165, 0, 50, 28);
      ctx.fillStyle = '#ef4444'; ctx.fillRect(115, 0, 50, 28);
      ctx.fillStyle = '#ffffff'; ctx.font = 'bold 12px Inter, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(sceneIdx < 2 ? '10%' : '50%', -140, 18);
      ctx.fillText(sceneIdx < 2 ? '90% BIASED' : '50% FAIR', 140, 18);
      ctx.restore();
      // Fulcrum triangle
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - 26, cy + 55); ctx.lineTo(cx + 26, cy + 55); ctx.closePath(); ctx.fill();
    }

    else {
      // Ethics Shield & Generative AI Grid (vid-11, vid-12)
      var cx = w / 2, cy = 136;
      var pillars = ['🔒 Privacy', '⚖️ Fairness', '🔍 Explainable', '👩‍⚕️ Human Loop'];
      pillars.forEach(function(p, i) {
        var ang = t * 0.6 + (i * Math.PI) / 2;
        var px = cx + Math.cos(ang) * 145;
        var py = cy + Math.sin(ang) * 52;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#38bdf8';
        ctx.beginPath(); ctx.roundRect(px - 56, py - 16, 112, 32, 10); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 12px Inter, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(p, px, py + 4);
      });
      ctx.beginPath(); ctx.arc(cx, cy, 34, 0, Math.PI * 2);
      ctx.fillStyle = '#2563eb'; ctx.fill();
      ctx.strokeStyle = '#fde047'; ctx.lineWidth = 3; ctx.stroke();
      ctx.font = '28px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(vid === 'vid-12' ? '🎨' : '🛡️', cx, cy + 10);
    }

    ctx.restore();
  }

  function mountPlayer(container, videoObj) {
    var vid = videoObj.id;
    if (activePlayers[vid] && activePlayers[vid].animId) {
      cancelAnimationFrame(activePlayers[vid].animId);
    }

    var scenes = VIDEO_SCENES[vid] || VIDEO_SCENES['vid-01'];
    var state = {
      playing: true,
      sceneIdx: 0,
      progress: 0,
      tick: 0,
      animId: null
    };
    activePlayers[vid] = state;

    var html = '<div class="anim-PlayerBox">';
    html += '<div class="sim-CanvasWrap"><canvas id="vcanvas-' + vid + '" width="680" height="340"></canvas></div>';
    html += '<div class="anim-ControlsBar">';
    html += '<button type="button" class="btn-Primary" id="vplay-' + vid + '">⏸️ Pause</button>';
    html += '<button type="button" class="btn-Secondary" id="vprev-' + vid + '">⏮️ Prev Scene</button>';
    html += '<button type="button" class="btn-Secondary" id="vnext-' + vid + '">⏭️ Next Scene</button>';
    html += '<button type="button" class="btn-Secondary" id="vspeak-' + vid + '">🔊 Read Aloud</button>';
    html += '<div class="anim-ScenePills" id="vpills-' + vid + '"></div>';
    html += '</div></div>';
    container.innerHTML = html;

    var canvas = container.querySelector('#vcanvas-' + vid);
    var ctx = canvas.getContext('2d');
    var playBtn = container.querySelector('#vplay-' + vid);
    var pillsEl = container.querySelector('#vpills-' + vid);

    function updatePills() {
      if (!pillsEl) return;
      var pHtml = '';
      scenes.forEach(function(sc, idx) {
        var cls = (idx === state.sceneIdx) ? 'sim-TabBtn sim-TabBtn--active' : 'sim-TabBtn';
        pHtml += '<button type="button" class="' + cls + '" data-scene="' + idx + '">Part ' + (idx + 1) + '</button>';
      });
      pillsEl.innerHTML = pHtml;
      pillsEl.querySelectorAll('[data-scene]').forEach(function(b) {
        b.addEventListener('click', function() {
          state.sceneIdx = parseInt(b.getAttribute('data-scene'), 10);
          state.progress = 0;
          state.playing = true;
          if (playBtn) playBtn.textContent = '⏸️ Pause';
          speakText(scenes[state.sceneIdx].caption);
          updatePills();
        });
      });
    }

    function wrapText(context, text, x, y, maxWidth, lineHeight) {
      var words = text.split(' ');
      var line = '';
      for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          context.fillText(line, x, y);
          line = words[n] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      context.fillText(line, x, y);
    }

    function draw() {
      var sc = scenes[state.sceneIdx] || scenes[0];
      if (state.playing) {
        state.tick++;
        state.progress += 0.28;
        if (state.progress >= 100) {
          state.progress = 0;
          if (state.sceneIdx + 1 < scenes.length) {
            state.sceneIdx++;
            if (window.ExperimindAudio) window.ExperimindAudio.pop();
            speakText(scenes[state.sceneIdx].caption);
            updatePills();
          } else {
            state.playing = false;
            if (playBtn) playBtn.textContent = '🔁 Replay Movie';
            if (window.ExperimindAudio) window.ExperimindAudio.fanfare();
          }
        }
      }

      var grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, sc.bg);
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Top chapter banner
      ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.fillRect(20, 14, canvas.width - 40, 38);
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('🎬 ' + sc.title + ' (Part ' + (state.sceneIdx + 1) + ' of ' + scenes.length + ')', 32, 38);

      // Draw topic-specific procedural diagram in the center stage!
      drawProceduralDiagram(ctx, vid, state.sceneIdx, state.tick, canvas.width, canvas.height);

      // Subtitle caption box at bottom
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.fillRect(20, 224, canvas.width - 40, 84);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 224, canvas.width - 40, 84);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.textAlign = 'center';
      wrapText(ctx, sc.caption, canvas.width / 2, 254, canvas.width - 76, 24);

      // Progress bar
      var totalPct = ((state.sceneIdx * 100 + state.progress) / (scenes.length * 100));
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fillRect(20, 320, canvas.width - 40, 8);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(20, 320, (canvas.width - 40) * totalPct, 8);

      state.animId = requestAnimationFrame(draw);
    }

    playBtn.addEventListener('click', function() {
      if (!state.playing && state.sceneIdx === scenes.length - 1 && state.progress >= 95) {
        state.sceneIdx = 0;
        state.progress = 0;
      }
      state.playing = !state.playing;
      playBtn.textContent = state.playing ? '⏸️ Pause' : '▶️ Play';
      if (state.playing) speakText(scenes[state.sceneIdx].caption);
    });

    container.querySelector('#vprev-' + vid).addEventListener('click', function() {
      state.sceneIdx = Math.max(0, state.sceneIdx - 1);
      state.progress = 0;
      state.playing = true;
      playBtn.textContent = '⏸️ Pause';
      speakText(scenes[state.sceneIdx].caption);
      updatePills();
    });

    container.querySelector('#vnext-' + vid).addEventListener('click', function() {
      state.sceneIdx = Math.min(scenes.length - 1, state.sceneIdx + 1);
      state.progress = 0;
      state.playing = true;
      playBtn.textContent = '⏸️ Pause';
      speakText(scenes[state.sceneIdx].caption);
      updatePills();
    });

    container.querySelector('#vspeak-' + vid).addEventListener('click', function() {
      if (window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
          var utter = new SpeechSynthesisUtterance(scenes[state.sceneIdx].caption);
          utter.rate = 0.98;
          utter.pitch = 1.06;
          window.speechSynthesis.speak(utter);
        } catch (e) {}
      }
    });

    updatePills();
    if (window.ExperimindAudio) window.ExperimindAudio.pop();
    speakText(scenes[0].caption);
    draw();
  }

  return {
    mountPlayer: mountPlayer,
    stopAll: stopAll
  };
})();
