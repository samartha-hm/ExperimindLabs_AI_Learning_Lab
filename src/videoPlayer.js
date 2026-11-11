// Experimind AI Learning Lab — Built-In HTML5 Canvas Animated Video Player
window.ExperimindVideoPlayer = (function() {
  var activePlayers = {};

  var VIDEO_SCENES = {
    'vid-01': [
      { title: '1. Big Scary Problems?', caption: 'When a problem is HUGE (like building a robot castle), where do we start?', bg: '#1e3a8a', icon: '🏰', subIcon: '🤔' },
      { title: '2. Decomposition!', caption: 'Break the giant castle into small, easy steps: Base ➔ Walls ➔ Towers ➔ Flag!', bg: '#065f46', icon: '🧱', subIcon: '✨' },
      { title: '3. Spot the Pattern!', caption: 'Look for repeating colors and shapes so you can build 10x faster!', bg: '#7c2d12', icon: '🔁', subIcon: '🌈' },
      { title: '4. Write the Algorithm!', caption: 'Put your steps in exact 1-2-3 order—that is Computational Thinking!', bg: '#4c1d95', icon: '🚀', subIcon: '🏆' }
    ],
    'vid-02': [
      { title: '1. What is an Algorithm?', caption: 'An algorithm is a step-by-step recipe to finish a job—like brushing your teeth!', bg: '#0f172a', icon: '🪥', subIcon: '😁' },
      { title: '2. Order Matters!', caption: 'If you put toothpaste on AFTER brushing, your algorithm has a silly BUG!', bg: '#7f1d1d', icon: '🐞', subIcon: '🤪' },
      { title: '3. Step 1 ➔ Step 2 ➔ Step 3', caption: '1. Open cap ➔ 2. Squeeze paste ➔ 3. Brush for 2 mins ➔ 4. Rinse & smile!', bg: '#065f46', icon: '✅', subIcon: '🦷' },
      { title: '4. Computers Follow Steps Literally', caption: 'Clear, ordered steps help robots and computers do amazing things!', bg: '#1e40af', icon: '🤖', subIcon: '🌟' }
    ],
    'vid-03': [
      { title: '1. The Secret Inside Every Computer', caption: 'Every computer algorithm works like a 3-stage factory: INPUT ➔ PROCESS ➔ OUTPUT!', bg: '#1e3a8a', icon: '🏭', subIcon: '⚡' },
      { title: '2. Stage 1: INPUT', caption: 'You give the computer ingredients—like typing 5 + 3 or clicking the mouse!', bg: '#047857', icon: '⌨️', subIcon: '🖱️' },
      { title: '3. Stage 2: PROCESS', caption: 'The CPU Brain follows the algorithm rules to add, sort, or draw!', bg: '#6d28d9', icon: '🧠', subIcon: '⚙️' },
      { title: '4. Stage 3: OUTPUT', caption: 'The monitor and speakers show you the finished answer: 8!', bg: '#b45309', icon: '🖥️', subIcon: '🎉' }
    ],
    'vid-04': [
      { title: '1. Coding Like LEGO Bricks!', caption: 'In Scratch and Block Studio, you never get typing errors—you snap colorful blocks together!', bg: '#b45309', icon: '🐱', subIcon: '🧩' },
      { title: '2. Green Flag Event!', caption: 'Start with a yellow Event block: "When Green Flag Clicked" wakes up your character!', bg: '#065f46', icon: '🟢', subIcon: '🎬' },
      { title: '3. Motion & Repeat Loops', caption: 'Snap blue Move & Turn blocks inside an orange Repeat loop to dance and draw stars!', bg: '#1d4ed8', icon: '🔁', subIcon: '❄️' },
      { title: '4. Create Your Own Games!', caption: 'Add a Score variable and sound effects to invent stories and games!', bg: '#7e22ce', icon: '🎮', subIcon: '🏆' }
    ],
    'vid-05': [
      { title: '1. Normal Machines vs. AI', caption: 'A normal toaster just runs a timer. Artificial Intelligence learns patterns from DATA!', bg: '#0f172a', icon: '🧠', subIcon: '✨' },
      { title: '2. Seeing, Hearing & Understanding', caption: 'AI can recognize faces in photos, understand spoken words, and play strategy games!', bg: '#1e40af', icon: '📷', subIcon: '🎙️' },
      { title: '3. Learning From Thousands of Examples', caption: 'Instead of a programmer writing 1,000 rules, the AI studies examples to find the pattern!', bg: '#047857', icon: '📊', subIcon: '🔍' },
      { title: '4. Using AI to Help the World', caption: 'Scientists use AI to spot plant diseases, forecast floods, and protect wildlife!', bg: '#4c1d95', icon: '🌍', subIcon: '💚' }
    ],
    'vid-06': [
      { title: '1. How Does a Machine Learn?', caption: 'Imagine teaching a baby robot to tell Apples from Bananas using Supervised Learning!', bg: '#1e3a8a', icon: '🍎', subIcon: '🍌' },
      { title: '2. Measuring Features', caption: 'The computer measures numerical features: Color, Roundness, and Sweetness!', bg: '#065f46', icon: '📏', subIcon: '📈' },
      { title: '3. Drawing the Decision Boundary', caption: 'After seeing 50 labeled fruits, the model draws a line separating Apples from Bananas!', bg: '#6d28d9', icon: '🎯', subIcon: '⚡' },
      { title: '4. Testing on a Mystery Fruit!', caption: 'When a brand-new fruit arrives, the trained model predicts its class in milliseconds!', bg: '#b45309', icon: '🤖', subIcon: '🌟' }
    ],
    'vid-07': [
      { title: '1. Step 1 of Teachable Machine: GATHER', caption: 'Every great AI model starts by gathering clear examples grouped into Classes!', bg: '#1d4ed8', icon: '📷', subIcon: '🗂️' },
      { title: '2. Class A vs. Class B vs. Class C', caption: 'Record 25+ sample pictures for Thumbs Up, Open Palm, and Peace Sign!', bg: '#047857', icon: '👍', subIcon: '✋' },
      { title: '3. Variety Makes AI Smarter!', caption: 'Tilt your hand left, right, closer, and further so the AI learns every angle!', bg: '#7c2d12', icon: '🔄', subIcon: '💡' },
      { title: '4. Keep Your Classes Balanced!', caption: 'Give every class a fair, equal number of samples before clicking Train!', bg: '#4c1d95', icon: '⚖️', subIcon: '✅' }
    ],
    'vid-08': [
      { title: '1. Gather ➔ Train ➔ Test!', caption: 'Once your image samples are ready, click Train Model right inside the browser!', bg: '#0f172a', icon: '🖼️', subIcon: '⚡' },
      { title: '2. Live Confidence Bars', caption: 'Watch the confidence meter: 96% Cat vs. 4% Dog shows how sure the AI is!', bg: '#065f46', icon: '📊', subIcon: '🐱' },
      { title: '3. Catching Tricky Mistakes', caption: 'If a new angle tricks the model, add more training samples to fix the blind spot!', bg: '#b45309', icon: '🔧', subIcon: '🎯' },
      { title: '4. Try It Right Here in Experimind!', caption: 'Open our AI Vision Lab (#vision) to train a 3-class detector right now!', bg: '#1e40af', icon: '🚀', subIcon: '🏆' }
    ],
    'vid-09': [
      { title: '1. What is Algorithmic Bias?', caption: 'If you only show an AI photos of red apples, it will think green apples are NOT apples!', bg: '#7f1d1d', icon: '🍏', subIcon: '⚠️' },
      { title: '2. Skewed Data = Unfair AI', caption: 'When one group is missing from training data, the AI makes unfair mistakes in the real world.', bg: '#92400e', icon: '⚖️', subIcon: '🔍' },
      { title: '3. Auditing the Confusion Matrix', caption: 'Engineers test accuracy across every group to catch hidden bias early!', bg: '#1e3a8a', icon: '📋', subIcon: '🛡️' },
      { title: '4. Fair & Inclusive AI for All', caption: 'Balanced, diverse datasets make technology helpful and fair for everyone!', bg: '#065f46', icon: '🌍', subIcon: '🤝' }
    ],
    'vid-10': [
      { title: '1. How Do Chatbots Talk?', caption: 'Large Language Models split sentences into word pieces called TOKENS!', bg: '#1e3a8a', icon: '💬', subIcon: '🧩' },
      { title: '2. Predicting the Next Word', caption: 'Given "The hungry puppy ran to the...", the AI calculates probabilities: "bowl" (78%)!', bg: '#4c1d95', icon: '🎲', subIcon: '📈' },
      { title: '3. Do Chatbots Have Feelings?', caption: 'No! Chatbots don\'t think or feel—they are super-fast pattern predictors.', bg: '#0f172a', icon: '🤖', subIcon: '💡' },
      { title: '4. Always Double-Check Facts!', caption: 'Sometimes chatbots guess wrong ("hallucinate"), so smart kids always verify facts!', bg: '#047857', icon: '🕵️', subIcon: '✅' }
    ],
    'vid-11': [
      { title: '1. Not Just What Computers CAN Do...', caption: 'Ethics asks: What SHOULD computers do to keep people safe and respected?', bg: '#0f172a', icon: '🛡️', subIcon: '⚖️' },
      { title: '2. Privacy & Permission First!', caption: 'Cameras and microphones must NEVER record people without clear permission!', bg: '#1e40af', icon: '🔒', subIcon: '📷' },
      { title: '3. Humans Stay in Charge!', caption: 'Doctors, teachers, and judges must always review important AI recommendations.', bg: '#065f46', icon: '👩‍⚕️', subIcon: '🤝' },
      { title: '4. You Are the Future AI Builder!', caption: 'Every line of code you write can make your school and planet kinder and safer!', bg: '#6d28d9', icon: '🌟', subIcon: '🚀' }
    ],
    'vid-12': [
      { title: '1. What is Generative AI?', caption: 'Instead of just sorting photos, Generative AI creates brand-new art, music, and stories!', bg: '#4c1d95', icon: '🎨', subIcon: '✨' },
      { title: '2. Spotting Deepfakes & Fake Photos', caption: 'Look closely for weird hands, garbled text, and always check trusted news sources!', bg: '#991b1b', icon: '🔎', subIcon: '⚠️' },
      { title: '3. Brainstorming Partner, Not a Replacement!', caption: 'Use AI to spark ideas, but always write your own stories and do your own thinking!', bg: '#065f46', icon: '🧠', subIcon: '✍️' },
      { title: '4. Responsible Creators!', caption: 'Always give credit, respect artists, and use creative AI honestly!', bg: '#1e40af', icon: '🏆', subIcon: '🌈' }
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
      utter.pitch = 1.08;
      window.speechSynthesis.speak(utter);
    } catch (e) {}
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
      progress: 0, // 0..100 within current scene
      tick: 0,
      animId: null
    };
    activePlayers[vid] = state;

    var html = '<div class="anim-PlayerBox">';
    html += '<div class="sim-CanvasWrap"><canvas id="vcanvas-' + vid + '" width="640" height="340"></canvas></div>';
    html += '<div class="anim-ControlsBar">';
    html += '<button type="button" class="btn-Primary" id="vplay-' + vid + '">⏸️ Pause</button>';
    html += '<button type="button" class="btn-Secondary" id="vprev-' + vid + '">⏮️ Prev Scene</button>';
    html += '<button type="button" class="btn-Secondary" id="vnext-' + vid + '">⏭️ Next Scene</button>';
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
        state.progress += 0.32;
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
            if (window.ExperimindAudio) window.ExperimindAudio.success();
            if (window.ExperimindConfetti) window.ExperimindConfetti.burst();
          }
        }
      }

      // Draw animated gradient backdrop
      var grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, sc.bg);
      grad.addColorStop(1, '#0b1329');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Animated floating twinkling stars
      for (var i = 0; i < 18; i++) {
        var px = (i * 41 + state.tick * 0.4) % canvas.width;
        var py = (i * 29 + Math.sin(state.tick * 0.04 + i) * 16 + 55) % (canvas.height - 110);
        var twinkle = (Math.sin(state.tick * 0.1 + i) + 1) * 0.5;
        ctx.beginPath();
        ctx.arc(px, py, 1.5 + twinkle * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, ' + (0.2 + twinkle * 0.6) + ')';
        ctx.fill();
      }

      // Top chapter banner
      ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
      ctx.fillRect(20, 14, canvas.width - 40, 42);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(20, 14, canvas.width - 40, 42);
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 17px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('🎬 ' + sc.title + ' (Part ' + (state.sceneIdx + 1) + ' of ' + scenes.length + ')', 34, 41);

      // Animated center characters & connecting signal beam
      var bounce = Math.sin(state.tick * 0.08) * 10;
      var cx1 = 230, cx2 = 450, cy = 138 + bounce;

      // Draw Sparky Mascot on Left Stage
      var spX = 72, spY = 140 + bounce * 0.6;
      // Shadow
      ctx.beginPath();
      ctx.ellipse(spX, spY + 44, 26, 8, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fill();
      // Antenna
      ctx.beginPath();
      ctx.moveTo(spX, spY - 24);
      ctx.lineTo(spX, spY - 40);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(spX, spY - 43, 6, 0, Math.PI * 2);
      ctx.fillStyle = (state.tick % 40 < 20) ? '#f59e0b' : '#38bdf8';
      ctx.fill();
      // Head
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(spX - 26, spY - 24, 52, 42, 10) : ctx.rect(spX - 26, spY - 24, 52, 42);
      ctx.fill();
      ctx.strokeStyle = '#1d4ed8';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      // Visor Screen
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(spX - 20, spY - 18, 40, 22);
      // Blinking Eyes
      var isBlink = (state.tick % 100 > 92);
      ctx.fillStyle = '#38bdf8';
      if (isBlink) {
        ctx.fillRect(spX - 14, spY - 8, 10, 2);
        ctx.fillRect(spX + 4, spY - 8, 10, 2);
      } else {
        ctx.beginPath();
        ctx.arc(spX - 9, spY - 7, 4.5, 0, Math.PI * 2);
        ctx.arc(spX + 9, spY - 7, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
      // Cheerful Name Tag
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SPARKY 🤖', spX, spY + 30);

      // Glowing signal line between icons
      ctx.beginPath();
      ctx.moveTo(cx1 + 42, cy);
      ctx.lineTo(cx2 - 42, cy);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 8]);
      ctx.lineDashOffset = -state.tick * 1.5;
      ctx.stroke();
      ctx.setLineDash([]);

      // Circle 1
      ctx.beginPath();
      ctx.arc(cx1, cy, 46, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.20)';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      ctx.font = '46px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sc.icon, cx1, cy);

      // Circle 2
      ctx.beginPath();
      ctx.arc(cx2, cy - bounce * 1.3, 46, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(250, 204, 21, 0.22)';
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.stroke();
      ctx.fillText(sc.subIcon, cx2, cy - bounce * 1.3);

      // Subtitle caption box at bottom
      ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
      ctx.fillRect(20, 222, canvas.width - 40, 86);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 222, canvas.width - 40, 86);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 17px Inter, sans-serif';
      ctx.textAlign = 'center';
      wrapText(ctx, sc.caption, canvas.width / 2, 254, canvas.width - 76, 25);

      // Bottom overall progress bar
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
