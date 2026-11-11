// Experimind AI Learning Lab — 10 Interactive Simulator Engines (ENG-01 .. ENG-10)
window.ExperimindSimulators = (function() {
  var activeCleanup = null;

  function cleanup() {
    if (typeof activeCleanup === 'function') {
      try { activeCleanup(); } catch (e) {}
      activeCleanup = null;
    }
  }

  function awardSimStar(lessonId, statusEl, message) {
    if (window.ExperimindApp && typeof window.ExperimindApp.awardStar === 'function') {
      window.ExperimindApp.awardStar(lessonId, 'sim');
    }
    if (window.ExperimindConfetti) window.ExperimindConfetti.burst();
    if (window.ExperimindAudio) window.ExperimindAudio.fanfare();
    if (statusEl) {
      statusEl.className = 'sim-Banner sim-Banner--success';
      statusEl.innerHTML = '🌟 <strong>Challenge Completed!</strong> ' + (message || 'You earned the Hands-On Lab Star for this lesson!');
    }
  }

  // =========================================================================
  // ENG-01: Pattern, Classification & Sequence Sorter
  // =========================================================================
  function mountEng01(container, lesson) {
    var cfg = lesson.simConfig || {};
    var mode = cfg.mode || 'sort';

    if (mode === 'sort') {
      var bins = cfg.bins || ['Group A', 'Group B'];
      var items = (cfg.items || []).map(function(it, idx) {
        return { id: idx, label: it.label, bin: it.bin, placedBin: null };
      });
      var selectedItemId = items.length ? items[0].id : null;

      function renderSort() {
        var remaining = items.filter(function(i) { return i.placedBin === null; });
        if (selectedItemId !== null && !remaining.some(function(i) { return i.id === selectedItemId; })) {
          selectedItemId = remaining.length ? remaining[0].id : null;
        }
        var doneCount = items.length - remaining.length;

        var html = '<div class="sim-Card">';
        html += '<div class="sim-HeaderRow"><div><span class="sim-EngineBadge">ENG-01 • Classification Sorter</span><h4>' + (cfg.title || lesson.title) + '</h4></div>';
        html += '<div class="sim-ProgressPill">' + doneCount + ' / ' + items.length + ' Sorted</div></div>';
        html += '<p class="sim-Instr">🖱️ <strong>Drag & Drop</strong> any item token into its matching category basket, or <strong>Click</strong> to select and drop!</p>';

        html += '<div class="sim-TokenTray">';
        if (remaining.length === 0) {
          html += '<div class="sim-EmptyDone">🎉 All items sorted accurately!</div>';
        } else {
          remaining.forEach(function(it) {
            var activeCls = (it.id === selectedItemId) ? ' sim-Token--selected' : '';
            html += '<button type="button" draggable="true" class="sim-Token' + activeCls + '" data-item-id="' + it.id + '">' + it.label + '</button>';
          });
        }
        html += '</div>';

        html += '<div class="sim-BinGrid">';
        bins.forEach(function(bName, bIdx) {
          var binItems = items.filter(function(i) { return i.placedBin === bIdx; });
          html += '<div class="sim-BinCard" data-bin-idx="' + bIdx + '">';
          html += '<div class="sim-BinTitle">' + bName + '</div>';
          html += '<div class="sim-BinActionHint">Drop or click here ⤵</div>';
          html += '<div class="sim-BinItems">';
          binItems.forEach(function(bi) {
            html += '<span class="sim-PlacedChip">✅ ' + bi.label + '</span>';
          });
          html += '</div></div>';
        });
        html += '</div>';

        html += '<div class="sim-FooterActions">';
        html += '<button type="button" class="btn-Secondary" id="sim-reset-btn">🔄 Reset Items</button>';
        html += '</div>';
        html += '<div id="sim-status" class="sim-Banner">Drag or click an item token and place it in the right basket!</div>';
        html += '</div>';
        container.innerHTML = html;

        var statusEl = container.querySelector('#sim-status');
        if (doneCount === items.length && items.length > 0) {
          awardSimStar(lesson.id, statusEl, 'All ' + items.length + ' items classified into the right bins!');
        }

        function handleDropOrClick(itemId, bIdx) {
          var itemObj = items.find(function(i) { return i.id === itemId; });
          if (!itemObj) return;
          if (itemObj.bin === bIdx) {
            itemObj.placedBin = bIdx;
            if (window.ExperimindAudio) window.ExperimindAudio.snap();
            renderSort();
          } else {
            if (window.ExperimindAudio) window.ExperimindAudio.retry();
            if (statusEl) {
              statusEl.className = 'sim-Banner sim-Banner--warn';
              statusEl.innerHTML = '🤔 Hmmm, <strong>' + itemObj.label + '</strong> does not match <strong>' + bins[bIdx] + '</strong>. Check its features and try another basket!';
            }
          }
        }

        container.querySelectorAll('[data-item-id]').forEach(function(btn) {
          btn.addEventListener('dragstart', function(ev) {
            var iId = btn.getAttribute('data-item-id');
            ev.dataTransfer.setData('text/plain', iId);
            btn.classList.add('sim-Token--dragging');
          });
          btn.addEventListener('dragend', function() {
            btn.classList.remove('sim-Token--dragging');
          });
          btn.addEventListener('click', function() {
            selectedItemId = parseInt(btn.getAttribute('data-item-id'), 10);
            if (window.ExperimindAudio) window.ExperimindAudio.click();
            renderSort();
          });
        });

        container.querySelectorAll('[data-bin-idx]').forEach(function(binEl) {
          binEl.addEventListener('dragover', function(ev) {
            ev.preventDefault();
            binEl.classList.add('sim-BinCard--dragover');
          });
          binEl.addEventListener('dragleave', function() {
            binEl.classList.remove('sim-BinCard--dragover');
          });
          binEl.addEventListener('drop', function(ev) {
            ev.preventDefault();
            binEl.classList.remove('sim-BinCard--dragover');
            var iIdStr = ev.dataTransfer.getData('text/plain');
            var iId = parseInt(iIdStr, 10);
            if (isNaN(iId)) iId = selectedItemId;
            if (iId === null || isNaN(iId)) return;
            handleDropOrClick(iId, parseInt(binEl.getAttribute('data-bin-idx'), 10));
          });
          binEl.addEventListener('click', function() {
            if (selectedItemId === null) return;
            handleDropOrClick(selectedItemId, parseInt(binEl.getAttribute('data-bin-idx'), 10));
          });
        });

        var resetBtn = container.querySelector('#sim-reset-btn');
        if (resetBtn) {
          resetBtn.addEventListener('click', function() {
            items.forEach(function(i) { i.placedBin = null; });
            selectedItemId = items.length ? items[0].id : null;
            renderSort();
          });
        }
      }
      renderSort();
      return;
    }

    // Mode: 'odd' or 'sequence'
    var rounds = cfg.rounds || [];
    var currentRound = 0;
    var completedAll = false;

    function renderRounds() {
      var r = rounds[currentRound] || rounds[0];
      var html = '<div class="sim-Card">';
      html += '<div class="sim-HeaderRow"><div><span class="sim-EngineBadge">ENG-01 • Pattern & Rule Lab</span><h4>' + (cfg.title || lesson.title) + '</h4></div>';
      html += '<div class="sim-ProgressPill">Round ' + (currentRound + 1) + ' of ' + rounds.length + '</div></div>';

      if (mode === 'sequence') {
        html += '<p class="sim-Instr">' + (r.hint || 'Look at the repeating pattern train and pick what comes next:') + '</p>';
        html += '<div class="sim-TrainTrack">';
        (r.sequence || []).forEach(function(car, cIdx) {
          var isMystery = (car === '❓');
          html += '<div class="sim-TrainCar' + (isMystery ? ' sim-TrainCar--mystery' : '') + '"><span class="sim-TrainEmoji">' + car + '</span><span class="sim-TrainIdx">Car ' + (cIdx + 1) + '</span></div>';
        });
        html += '</div>';
      } else {
        html += '<p class="sim-Instr">' + (r.prompt || 'Pick the option that solves the pattern:') + '</p>';
      }

      html += '<div class="sim-OptionGrid">';
      (r.options || []).forEach(function(opt, oIdx) {
        html += '<button type="button" class="sim-OptionBtn" data-opt-idx="' + oIdx + '">' + opt + '</button>';
      });
      html += '</div>';

      html += '<div class="sim-FooterActions"><button type="button" class="btn-Secondary" id="sim-restart-rounds">🔄 Restart Rounds</button></div>';
      html += '<div id="sim-status" class="sim-Banner">' + (completedAll ? '🌟 All rounds mastered!' : 'Click an option button above to test your answer!') + '</div>';
      html += '</div>';
      container.innerHTML = html;

      var statusEl = container.querySelector('#sim-status');
      if (completedAll) {
        awardSimStar(lesson.id, statusEl, 'You completed all ' + rounds.length + ' pattern rounds!');
      }

      container.querySelectorAll('[data-opt-idx]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var idx = parseInt(btn.getAttribute('data-opt-idx'), 10);
          if (idx === r.answer) {
            if (window.ExperimindAudio) window.ExperimindAudio.pop();
            if (currentRound + 1 < rounds.length) {
              currentRound++;
              renderRounds();
              var st = container.querySelector('#sim-status');
              if (st) {
                st.className = 'sim-Banner sim-Banner--success';
                st.innerHTML = '✅ Great job! Moving to Round ' + (currentRound + 1) + '...';
              }
            } else {
              completedAll = true;
              renderRounds();
            }
          } else {
            if (window.ExperimindAudio) window.ExperimindAudio.retry();
            if (statusEl) {
              statusEl.className = 'sim-Banner sim-Banner--warn';
              statusEl.innerHTML = '💡 Not quite! Look closely at the pattern rule and try another choice.';
            }
          }
        });
      });

      var restartBtn = container.querySelector('#sim-restart-rounds');
      if (restartBtn) {
        restartBtn.addEventListener('click', function() {
          currentRound = 0;
          completedAll = false;
          renderRounds();
        });
      }
    }
    renderRounds();
  }

  // =========================================================================
  // ENG-02: Spatial & Mouse Discovery Playground (Canvas Bubbles & Path)
  // =========================================================================
  function mountEng02(container, lesson) {
    var cfg = lesson.simConfig || {};
    var mode = cfg.mode || 'bubbles';
    var targetCount = cfg.targetCount || 8;
    var score = 0;

    var html = '<div class="sim-Card">';
    html += '<div class="sim-HeaderRow"><div><span class="sim-EngineBadge">ENG-02 • Spatial Canvas Playground</span><h4>' + (cfg.theme || lesson.title) + '</h4></div>';
    html += '<div class="sim-ProgressPill" id="eng02-counter">0 / ' + targetCount + ' Completed</div></div>';
    html += '<p class="sim-Instr">' + (mode === 'bubbles'
      ? 'Move your mouse pointer over each glowing rainbow bubble and left-click to pop it!'
      : 'Click each numbered golden stepping stone in order (1 ➔ ' + targetCount + ') to guide Buzzy the Bee to the Hive!') + '</p>';
    html += '<div class="sim-CanvasWrap"><canvas id="eng02-canvas" width="680" height="340"></canvas></div>';
    html += '<div class="sim-FooterActions"><button type="button" class="btn-Secondary" id="eng02-reset">🔄 Reset Playground</button></div>';
    html += '<div id="sim-status" class="sim-Banner">Click inside the interactive canvas above to begin!</div>';
    html += '</div>';
    container.innerHTML = html;

    var canvas = container.querySelector('#eng02-canvas');
    var ctx = canvas.getContext('2d');
    var counterEl = container.querySelector('#eng02-counter');
    var statusEl = container.querySelector('#sim-status');
    var animId = null;

    var items = [];
    var burstParticles = [];
    function initItems() {
      score = 0;
      items = [];
      burstParticles = [];
      if (mode === 'bubbles') {
        var colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#eab308'];
        for (var i = 0; i < targetCount; i++) {
          items.push({
            x: 80 + (i % 4) * 160 + (Math.random() * 30 - 15),
            y: 90 + Math.floor(i / 4) * 150 + (Math.random() * 24 - 12),
            r: 36,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2,
            color: colors[i % colors.length],
            popped: false,
            label: '🫧'
          });
        }
      } else {
        for (var j = 0; j < targetCount; j++) {
          items.push({
            x: 75 + j * (530 / Math.max(1, targetCount - 1)),
            y: (j % 2 === 0) ? 110 : 230,
            r: 32,
            stepNum: j + 1,
            visited: false
          });
        }
      }
      if (counterEl) counterEl.textContent = '0 / ' + targetCount + ' Completed';
    }

    function drawFrame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Soft meadow background
      var grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#eff6ff');
      grad.addColorStop(1, '#dcfce7');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (mode === 'bubbles') {
        items.forEach(function(b) {
          if (b.popped) return;
          b.x += b.vx;
          b.y += b.vy;
          if (b.x < b.r + 12 || b.x > canvas.width - b.r - 12) b.vx *= -1;
          if (b.y < b.r + 12 || b.y > canvas.height - b.r - 12) b.vy *= -1;

          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fillStyle = b.color + '33';
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = b.color;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(b.x - 10, b.y - 10, 7, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffffaa';
          ctx.fill();

          ctx.font = '24px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('✨', b.x, b.y);
        });

        // Render burst particles
        for (var pIdx = burstParticles.length - 1; pIdx >= 0; pIdx--) {
          var bp = burstParticles[pIdx];
          bp.x += bp.vx;
          bp.y += bp.vy;
          bp.alpha -= 0.04;
          if (bp.alpha <= 0) {
            burstParticles.splice(pIdx, 1);
            continue;
          }
          ctx.save();
          ctx.globalAlpha = Math.max(0, bp.alpha);
          ctx.beginPath();
          ctx.arc(bp.x, bp.y, bp.size, 0, Math.PI * 2);
          ctx.fillStyle = bp.color;
          ctx.fill();
          ctx.restore();
        }
      } else {
        // Draw connecting path lines
        ctx.beginPath();
        items.forEach(function(st, idx) {
          if (idx === 0) ctx.moveTo(st.x, st.y);
          else ctx.lineTo(st.x, st.y);
        });
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 5;
        ctx.setLineDash([8, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        items.forEach(function(st, idx) {
          ctx.beginPath();
          ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
          ctx.fillStyle = st.visited ? '#10b981' : (idx === score ? '#f59e0b' : '#ffffff');
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = st.visited ? '#047857' : '#334155';
          ctx.stroke();

          ctx.fillStyle = st.visited ? '#ffffff' : '#0f172a';
          ctx.font = 'bold 18px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(idx === targetCount - 1 ? '🍯' : String(st.stepNum), st.x, st.y);
        });

        // Draw bee on current step
        var beePos = score > 0 ? items[Math.min(score - 1, items.length - 1)] : { x: 32, y: 55 };
        ctx.font = '32px sans-serif';
        ctx.fillText('🐝', beePos.x, beePos.y - 38);
      }

      animId = requestAnimationFrame(drawFrame);
    }

    canvas.addEventListener('click', function(ev) {
      var rect = canvas.getBoundingClientRect();
      var scaleX = canvas.width / rect.width;
      var scaleY = canvas.height / rect.height;
      var mx = (ev.clientX - rect.left) * scaleX;
      var my = (ev.clientY - rect.top) * scaleY;

      if (mode === 'bubbles') {
        for (var i = 0; i < items.length; i++) {
          var b = items[i];
          if (!b.popped && Math.hypot(mx - b.x, my - b.y) <= b.r + 10) {
            b.popped = true;
            score++;
            if (window.ExperimindAudio) window.ExperimindAudio.bubblePop();
            // Spawn droplet sparkle burst
            for (var k = 0; k < 10; k++) {
              var pAngle = (k / 10) * Math.PI * 2;
              var pSpd = 2 + Math.random() * 4;
              burstParticles.push({
                x: b.x,
                y: b.y,
                vx: Math.cos(pAngle) * pSpd,
                vy: Math.sin(pAngle) * pSpd,
                size: 3 + Math.random() * 3,
                color: b.color,
                alpha: 1
              });
            }
            if (counterEl) counterEl.textContent = score + ' / ' + targetCount + ' Completed';
            if (score >= targetCount) {
              awardSimStar(lesson.id, statusEl, 'You popped all ' + targetCount + ' bubbles with precision!');
            }
            break;
          }
        }
      } else {
        var nextStone = items[score];
        if (!nextStone) return;
        if (Math.hypot(mx - nextStone.x, my - nextStone.y) <= nextStone.r + 14) {
          nextStone.visited = true;
          score++;
          if (window.ExperimindAudio) window.ExperimindAudio.pop();
          if (counterEl) counterEl.textContent = score + ' / ' + targetCount + ' Completed';
          if (score >= targetCount) {
            awardSimStar(lesson.id, statusEl, 'Buzzy reached the Beehive along all ' + targetCount + ' stones!');
          }
        } else {
          if (window.ExperimindAudio) window.ExperimindAudio.retry();
          if (statusEl) {
            statusEl.className = 'sim-Banner sim-Banner--warn';
            statusEl.innerHTML = '🐝 Click Stone <strong>#' + (score + 1) + '</strong> next to stay on the path!';
          }
        }
      }
    });

    container.querySelector('#eng02-reset').addEventListener('click', function() {
      initItems();
      if (statusEl) {
        statusEl.className = 'sim-Banner';
        statusEl.textContent = 'Playground reset! Click inside the canvas to begin.';
      }
    });

    initItems();
    drawFrame();
    activeCleanup = function() {
      if (animId) cancelAnimationFrame(animId);
    };
  }

  // =========================================================================
  // ENG-03: RoboGrid Autonomous Path & Maze Simulator
  // =========================================================================
  function mountEng03(container, lesson) {
    var cfg = lesson.simConfig || {};
    var gridSize = cfg.gridSize || 5;
    var start = cfg.start || [0, 0];
    var goal = cfg.goal || [gridSize - 1, gridSize - 1];
    var obstacles = cfg.obstacles || [];
    var spriteIcon = cfg.sprite || '🤖';
    var goalIcon = cfg.goalIcon || '🔋';
    var obstacleIcon = cfg.obstacleIcon || '🪨';
    var queue = (cfg.presetQueue || []).slice();
    var robotPos = [start[0], start[1]];
    var activeStepIdx = -1;
    var timerId = null;

    function isObstacle(cx, cy) {
      return obstacles.some(function(o) { return o[0] === cx && o[1] === cy; });
    }

    function expandQueue(rawQ) {
      var expanded = [];
      for (var i = 0; i < rawQ.length; i++) {
        if (rawQ[i] === '🔁 ×2' && expanded.length > 0) {
          expanded.push(expanded[expanded.length - 1]);
        } else if (rawQ[i] !== '🔁 ×2') {
          expanded.push(rawQ[i]);
        }
      }
      return expanded;
    }

    function renderGrid() {
      var html = '<div class="sim-Card">';
      html += '<div class="sim-HeaderRow"><div><span class="sim-EngineBadge">ENG-03 • RoboGrid Path Simulator</span><h4>' + (cfg.theme || lesson.title) + '</h4></div>';
      html += '<div class="sim-ProgressPill">Pos: (' + robotPos[0] + ', ' + robotPos[1] + ') ➔ Goal: (' + goal[0] + ', ' + goal[1] + ')</div></div>';

      html += '<div class="sim-RoboLayout">';
      // Left: 2D Grid
      html += '<div class="sim-GridBoard" style="grid-template-columns: repeat(' + gridSize + ', 1fr);">';
      for (var r = 0; r < gridSize; r++) {
        for (var c = 0; c < gridSize; c++) {
          var isRob = (robotPos[0] === c && robotPos[1] === r);
          var isG = (goal[0] === c && goal[1] === r);
          var isObs = isObstacle(c, r);
          var cellCls = 'sim-GridCell';
          if (isRob) cellCls += ' sim-GridCell--robot';
          else if (isG) cellCls += ' sim-GridCell--goal';
          else if (isObs) cellCls += ' sim-GridCell--obs';

          var content = '';
          if (isRob) content = '<span class="sim-CellEmoji">' + spriteIcon + '</span>';
          else if (isG) content = '<span class="sim-CellEmoji">' + goalIcon + '</span>';
          else if (isObs) content = '<span class="sim-CellEmoji">' + obstacleIcon + '</span>';

          html += '<div class="' + cellCls + '"><span class="sim-CoordTag">(' + c + ',' + r + ')</span>' + content + '</div>';
        }
      }
      html += '</div>';

      // Right: Controls & Command Queue
      html += '<div class="sim-RoboControls">';
      html += '<div class="sim-SubLabel">1. Add Direction Commands:</div>';
      html += '<div class="sim-CmdBtnRow">';
      ['⬆️', '⬇️', '⬅️', '➡️', '🔁 ×2'].forEach(function(cmd) {
        html += '<button type="button" class="sim-CmdBtn" data-add-cmd="' + cmd + '">' + cmd + '</button>';
      });
      html += '</div>';

      html += '<div class="sim-SubLabel">2. Program Queue (' + queue.length + ' blocks — click a block to remove):</div>';
      html += '<div class="sim-QueueStrip">';
      if (queue.length === 0) {
        html += '<span class="sim-QueueEmpty">Queue is empty. Click arrow buttons above!</span>';
      } else {
        queue.forEach(function(cmd, idx) {
          var hl = (idx === activeStepIdx) ? ' sim-QueueChip--active' : '';
          html += '<button type="button" class="sim-QueueChip' + hl + '" data-del-idx="' + idx + '" title="Click to remove step">' + (idx + 1) + '. ' + cmd + '</button>';
        });
      }
      html += '</div>';

      html += '<div class="sim-ExecRow">';
      html += '<button type="button" class="btn-Primary" id="robo-run">▶️ Run Program</button>';
      html += '<button type="button" class="btn-Secondary" id="robo-reset">🔄 Reset Position</button>';
      html += '<button type="button" class="btn-Secondary" id="robo-clear">🗑️ Clear Queue</button>';
      html += '</div>';
      html += '</div></div>';

      html += '<div id="sim-status" class="sim-Banner">Build your arrow sequence and click <strong>▶️ Run Program</strong>!</div>';
      html += '</div>';
      container.innerHTML = html;

      var statusEl = container.querySelector('#sim-status');
      if (robotPos[0] === goal[0] && robotPos[1] === goal[1]) {
        awardSimStar(lesson.id, statusEl, spriteIcon + ' reached the goal (' + goal[0] + ',' + goal[1] + ') in ' + queue.length + ' blocks!');
      }

      container.querySelectorAll('[data-add-cmd]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          if (timerId) return;
          queue.push(btn.getAttribute('data-add-cmd'));
          if (window.ExperimindAudio) window.ExperimindAudio.click();
          renderGrid();
        });
      });

      container.querySelectorAll('[data-del-idx]').forEach(function(chip) {
        chip.addEventListener('click', function() {
          if (timerId) return;
          var idx = parseInt(chip.getAttribute('data-del-idx'), 10);
          queue.splice(idx, 1);
          renderGrid();
        });
      });

      container.querySelector('#robo-reset').addEventListener('click', function() {
        if (timerId) { clearInterval(timerId); timerId = null; }
        robotPos = [start[0], start[1]];
        activeStepIdx = -1;
        renderGrid();
      });

      container.querySelector('#robo-clear').addEventListener('click', function() {
        if (timerId) { clearInterval(timerId); timerId = null; }
        queue = [];
        robotPos = [start[0], start[1]];
        activeStepIdx = -1;
        renderGrid();
      });

      container.querySelector('#robo-run').addEventListener('click', function() {
        if (timerId) return;
        robotPos = [start[0], start[1]];
        var steps = expandQueue(queue);
        if (steps.length === 0) {
          if (statusEl) {
            statusEl.className = 'sim-Banner sim-Banner--warn';
            statusEl.innerHTML = '⚠️ Add at least one direction arrow to the queue before pressing Run!';
          }
          return;
        }
        var sIdx = 0;
        timerId = setInterval(function() {
          if (sIdx >= steps.length) {
            clearInterval(timerId);
            timerId = null;
            activeStepIdx = -1;
            renderGrid();
            if (robotPos[0] !== goal[0] || robotPos[1] !== goal[1]) {
              var st = container.querySelector('#sim-status');
              if (st) {
                st.className = 'sim-Banner sim-Banner--warn';
                st.innerHTML = '🔍 Program finished at (' + robotPos[0] + ',' + robotPos[1] + '), but the goal is at (' + goal[0] + ',' + goal[1] + '). Adjust your steps and try again!';
              }
            }
            return;
          }
          var move = steps[sIdx];
          activeStepIdx = Math.min(sIdx, queue.length - 1);
          var nx = robotPos[0];
          var ny = robotPos[1];
          if (move === '⬆️') ny -= 1;
          else if (move === '⬇️') ny += 1;
          else if (move === '⬅️') nx -= 1;
          else if (move === '➡️') nx += 1;

          if (nx < 0 || nx >= gridSize || ny < 0 || ny >= gridSize || isObstacle(nx, ny)) {
            clearInterval(timerId);
            timerId = null;
            if (window.ExperimindAudio) window.ExperimindAudio.retry();
            renderGrid();
            var stErr = container.querySelector('#sim-status');
            if (stErr) {
              stErr.className = 'sim-Banner sim-Banner--warn';
              stErr.innerHTML = '🚧 <strong>Bug Detected at Step ' + (sIdx + 1) + ' (' + move + ')!</strong> Path blocked at (' + nx + ',' + ny + '). Click a block in the queue to remove it and debug!';
            }
            return;
          }

          robotPos = [nx, ny];
          if (robotPos[0] === goal[0] && robotPos[1] === goal[1]) {
            if (window.ExperimindAudio) window.ExperimindAudio.battery();
          } else {
            if (window.ExperimindAudio) window.ExperimindAudio.robotStep();
          }
          sIdx++;
          renderGrid();
        }, 380);
      });
    }

    renderGrid();
    activeCleanup = function() {
      if (timerId) clearInterval(timerId);
    };
  }

  // =========================================================================
  // ENG-04: IPO Pipeline, Binary Switchboard & Boolean Logic Gates
  // =========================================================================
  function mountEng04(container, lesson) {
    var cfg = lesson.simConfig || {};
    var mode = cfg.mode || 'ipo';

    if (mode === 'binary') {
      var bits = [0, 0, 0, 0, 0];
      var weights = [16, 8, 4, 2, 1];
      var targets = [cfg.targetNumber || 13, 21, 7];
      var tIdx = 0;

      function renderBinary() {
        var sum = bits.reduce(function(acc, b, idx) { return acc + b * weights[idx]; }, 0);
        var target = targets[tIdx];
        var html = '<div class="sim-Card">';
        html += '<div class="sim-HeaderRow"><div><span class="sim-EngineBadge">ENG-04 • 5-Bit Binary Switchboard</span><h4>' + (cfg.title || lesson.title) + '</h4></div>';
        html += '<div class="sim-ProgressPill">Target Decimal: <strong>' + target + '</strong> | Current: <strong>' + sum + '</strong></div></div>';
        html += '<p class="sim-Instr">Click the 5 binary switches (`16 - 8 - 4 - 2 - 1`) to toggle between <strong>0 (OFF)</strong> and <strong>1 (ON)</strong> until the sum equals <strong>' + target + '</strong>!</p>';

        html += '<div class="sim-BinaryRow">';
        weights.forEach(function(w, idx) {
          var on = bits[idx] === 1;
          html += '<button type="button" class="sim-BitCard' + (on ? ' sim-BitCard--on' : '') + '" data-bit-idx="' + idx + '">';
          html += '<div class="sim-BitWeight">Place Value: ' + w + '</div>';
          html += '<div class="sim-BitBulb">' + (on ? '💡 1' : '⚫ 0') + '</div>';
          html += '<div class="sim-BitAdd">+' + (on ? w : 0) + '</div>';
          html += '</button>';
        });
        html += '</div>';

        html += '<div class="sim-MathReadout">Binary Code: <code>' + bits.join('') + '</code> = ' +
          weights.map(function(w, i) { return bits[i] ? w : 0; }).join(' + ') + ' = <strong>' + sum + '</strong></div>';
        html += '<div id="sim-status" class="sim-Banner">Flip the switches so the total equals ' + target + '!</div>';
        html += '</div>';
        container.innerHTML = html;

        var statusEl = container.querySelector('#sim-status');
        if (sum === target) {
          if (tIdx + 1 < targets.length) {
            statusEl.className = 'sim-Banner sim-Banner--success';
            statusEl.innerHTML = '✅ Correct! Binary <code>' + bits.join('') + '</code> = ' + target + '! <button type="button" class="btn-Primary" id="next-bin-btn" style="margin-left:12px;">Next Target (' + targets[tIdx + 1] + ') ➔</button>';
            var nxt = container.querySelector('#next-bin-btn');
            if (nxt) {
              nxt.addEventListener('click', function() {
                tIdx++;
                bits = [0, 0, 0, 0, 0];
                renderBinary();
              });
            }
          } else {
            awardSimStar(lesson.id, statusEl, 'You mastered 5-bit binary encoding across all targets!');
          }
        }

        container.querySelectorAll('[data-bit-idx]').forEach(function(btn) {
          btn.addEventListener('click', function() {
            var idx = parseInt(btn.getAttribute('data-bit-idx'), 10);
            bits[idx] = bits[idx] ? 0 : 1;
            if (window.ExperimindAudio) window.ExperimindAudio.click();
            renderBinary();
          });
        });
      }
      renderBinary();
      return;
    }

    if (mode === 'gates') {
      var swA = false;
      var swB = false;
      var gateMode = (cfg.gateType === 'IF_ELSE') ? 'IF_ELSE' : 'AND';
      var testedCount = 0;

      function renderGates() {
        var out = false;
        if (gateMode === 'AND') out = swA && swB;
        else if (gateMode === 'OR') out = swA || swB;
        else if (gateMode === 'NOT') out = !swA;
        else if (gateMode === 'IF_ELSE') out = swA;

        var html = '<div class="sim-Card">';
        html += '<div class="sim-HeaderRow"><div><span class="sim-EngineBadge">ENG-04 • Logic & Decision Workbench</span><h4>' + (cfg.title || lesson.title) + '</h4></div>';
        html += '<div class="sim-ProgressPill">States Tested: ' + testedCount + ' / 3</div></div>';

        if (cfg.gateType !== 'IF_ELSE') {
          html += '<div class="sim-TabRow">';
          ['AND', 'OR', 'NOT'].forEach(function(g) {
            html += '<button type="button" class="sim-TabBtn' + (gateMode === g ? ' sim-TabBtn--active' : '') + '" data-gate="' + g + '">' + g + ' Gate</button>';
          });
          html += '</div>';
        }

        html += '<div class="sim-GateArena">';
        html += '<div class="sim-GateInputs">';
        html += '<button type="button" class="sim-SwitchBtn' + (swA ? ' sim-SwitchBtn--on' : '') + '" id="toggle-swa">' +
          (cfg.conditionLabel || 'Input Switch A') + ': <strong>' + (swA ? 'TRUE (1)' : 'FALSE (0)') + '</strong></button>';
        if (gateMode !== 'NOT' && gateMode !== 'IF_ELSE') {
          html += '<button type="button" class="sim-SwitchBtn' + (swB ? ' sim-SwitchBtn--on' : '') + '" id="toggle-swb">' +
            'Input Switch B: <strong>' + (swB ? 'TRUE (1)' : 'FALSE (0)') + '</strong></button>';
        }
        html += '</div>';

        html += '<div class="sim-GateProcessor">🔶 <strong>' + gateMode + '</strong> Logic Processor</div>';

        if (gateMode === 'IF_ELSE') {
          html += '<div class="sim-GateOutput ' + (out ? 'sim-GateOutput--on' : 'sim-GateOutput--else') + '">' +
            (out ? ('✅ ' + (cfg.trueOutput || 'IF Branch Active')) : ('🟦 ' + (cfg.falseOutput || 'ELSE Branch Active'))) + '</div>';
        } else {
          html += '<div class="sim-GateOutput ' + (out ? 'sim-GateOutput--on' : '') + '">' +
            (out ? '💡 OUTPUT = 1 (ACTIVE / ON)' : '⚫ OUTPUT = 0 (OFF)') + '</div>';
        }
        html += '</div>';

        html += '<div id="sim-status" class="sim-Banner">Toggle the input switches above to test at least 3 logic combinations!</div>';
        html += '</div>';
        container.innerHTML = html;

        var statusEl = container.querySelector('#sim-status');
        if (testedCount >= 3) {
          awardSimStar(lesson.id, statusEl, 'You verified the conditional & Boolean gate truth states!');
        }

        container.querySelectorAll('[data-gate]').forEach(function(b) {
          b.addEventListener('click', function() {
            gateMode = b.getAttribute('data-gate');
            testedCount++;
            renderGates();
          });
        });

        var btnA = container.querySelector('#toggle-swa');
        if (btnA) {
          btnA.addEventListener('click', function() {
            swA = !swA;
            testedCount++;
            if (window.ExperimindAudio) window.ExperimindAudio.click();
            renderGates();
          });
        }
        var btnB = container.querySelector('#toggle-swb');
        if (btnB) {
          btnB.addEventListener('click', function() {
            swB = !swB;
            testedCount++;
            if (window.ExperimindAudio) window.ExperimindAudio.click();
            renderGates();
          });
        }
      }
      renderGates();
      return;
    }

    // Default mode: 'ipo'
    var scenarios = cfg.scenarios || [];
    var sIdx = 0;
    var stage = 0; // 0=Input, 1=Process, 2=Output, 3=Quiz answered
    var completedScenarios = 0;

    function renderIpo() {
      var sc = scenarios[sIdx] || {
        name: lesson.title,
        input: '📥 Input Data / Ingredients',
        process: '⚙️ Step-by-Step Algorithm Process',
        output: '📤 Final Verified Output!',
        question: 'Which stage transforms the input into the final result?',
        options: ['The Process stage', 'Turning off the power', 'Skipping steps'],
        correct: 0
      };

      var html = '<div class="sim-Card">';
      html += '<div class="sim-HeaderRow"><div><span class="sim-EngineBadge">ENG-04 • IPO & Flowchart Workbench</span><h4>' + sc.name + '</h4></div>';
      html += '<div class="sim-ProgressPill">Scenario ' + (sIdx + 1) + ' of ' + Math.max(1, scenarios.length) + '</div></div>';

      html += '<div class="sim-IpoPipeline">';
      var steps = [
        { label: '1. INPUT', text: sc.input },
        { label: '2. PROCESS', text: sc.process },
        { label: '3. OUTPUT', text: sc.output }
      ];
      steps.forEach(function(st, idx) {
        var active = stage >= idx;
        html += '<div class="sim-IpoBox' + (active ? ' sim-IpoBox--active' : '') + '">';
        html += '<div class="sim-IpoTag">' + st.label + '</div>';
        html += '<div class="sim-IpoText">' + st.text + '</div>';
        html += '</div>';
        if (idx < 2) html += '<div class="sim-IpoArrow">➔</div>';
      });
      html += '</div>';

      if (stage < 2) {
        html += '<div class="sim-FooterActions"><button type="button" class="btn-Primary" id="ipo-step-btn">▶️ Trigger Next Pipeline Stage (' + steps[stage + 1].label + ')</button></div>';
      } else {
        html += '<div class="sim-MiniCheck"><strong>🔍 Lab Check:</strong> ' + sc.question + '<div class="sim-OptionGrid">';
        (sc.options || []).forEach(function(opt, oIdx) {
          html += '<button type="button" class="sim-OptionBtn" data-ipo-ans="' + oIdx + '">' + opt + '</button>';
        });
        html += '</div></div>';
      }

      html += '<div id="sim-status" class="sim-Banner">Step through the pipeline and answer the lab check!</div>';
      html += '</div>';
      container.innerHTML = html;

      var statusEl = container.querySelector('#sim-status');
      if (completedScenarios >= Math.max(1, scenarios.length)) {
        awardSimStar(lesson.id, statusEl, 'All IPO & Flowchart pipelines verified!');
      }

      var stepBtn = container.querySelector('#ipo-step-btn');
      if (stepBtn) {
        stepBtn.addEventListener('click', function() {
          stage++;
          if (window.ExperimindAudio) window.ExperimindAudio.pop();
          renderIpo();
        });
      }

      container.querySelectorAll('[data-ipo-ans]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var ans = parseInt(btn.getAttribute('data-ipo-ans'), 10);
          if (ans === sc.correct) {
            completedScenarios++;
            if (sIdx + 1 < scenarios.length) {
              sIdx++;
              stage = 0;
              if (window.ExperimindAudio) window.ExperimindAudio.pop();
              renderIpo();
            } else {
              renderIpo();
            }
          } else {
            if (window.ExperimindAudio) window.ExperimindAudio.retry();
            if (statusEl) {
              statusEl.className = 'sim-Banner sim-Banner--warn';
              statusEl.innerHTML = '💡 Think carefully about the order of steps and try another answer!';
            }
          }
        });
      });
    }
    renderIpo();
  }

  // =========================================================================
  // ENG-05: Visual Block Coding, Cartesian Stage & Spirograph Studio
  // =========================================================================
  function mountEng05(container, lesson) {
    var cfg = lesson.simConfig || {};
    var mode = cfg.mode || 'blocks';

    if (mode === 'spiro') {
      var sides = cfg.defaultSides || 6;
      var angle = cfg.defaultAngle || 60;
      var stepLen = cfg.defaultStep || 65;
      var color = '#3b82f6';

      function renderSpiro() {
        var html = '<div class="sim-Card">';
        html += '<div class="sim-HeaderRow"><div><span class="sim-EngineBadge">ENG-05 • Loop Art & Spirograph Studio</span><h4>' + (cfg.title || lesson.title) + '</h4></div>';
        html += '<div class="sim-ProgressPill">Repeat ' + sides + '× [Move ' + stepLen + ', Turn ' + angle + '°]</div></div>';

        html += '<div class="sim-SpiroLayout">';
        html += '<div class="sim-CanvasWrap"><canvas id="spiro-canvas" width="420" height="300"></canvas></div>';
        html += '<div class="sim-SpiroControls">';
        html += '<label class="sim-SliderLabel">🔁 Repeat Loop Count: <strong>' + sides + '</strong><input type="range" min="3" max="24" value="' + sides + '" id="sp-sides"></label>';
        html += '<label class="sim-SliderLabel">📐 Turn Angle (Degrees): <strong>' + angle + '°</strong><input type="range" min="15" max="165" step="5" value="' + angle + '" id="sp-angle"></label>';
        html += '<label class="sim-SliderLabel">📏 Forward Step Size: <strong>' + stepLen + ' px</strong><input type="range" min="30" max="95" step="5" value="' + stepLen + '" id="sp-step"></label>';
        html += '<div class="sim-PresetRow">';
        html += '<button type="button" class="sim-MiniBtn" data-preset="4,90,75,#10b981">Square (4×90°)</button>';
        html += '<button type="button" class="sim-MiniBtn" data-preset="6,60,65,#3b82f6">Hexagon (6×60°)</button>';
        html += '<button type="button" class="sim-MiniBtn" data-preset="12,150,85,#8b5cf6">12-Point Star</button>';
        html += '<button type="button" class="sim-MiniBtn" data-preset="18,100,70,#ec4899">Mandala (18×)</button>';
        html += '</div>';
        html += '<button type="button" class="btn-Primary" id="sp-verify" style="margin-top:10px;width:100%;">🎨 Draw & Complete Loop Challenge</button>';
        html += '</div></div>';
        html += '<div id="sim-status" class="sim-Banner">Adjust the Repeat Loop sliders or pick a geometric preset!</div>';
        html += '</div>';
        container.innerHTML = html;

        var cv = container.querySelector('#spiro-canvas');
        var ctx = cv.getContext('2d');
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, cv.width, cv.height);

        // Coordinate crosshairs
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cv.width / 2, 0); ctx.lineTo(cv.width / 2, cv.height);
        ctx.moveTo(0, cv.height / 2); ctx.lineTo(cv.width, cv.height / 2);
        ctx.stroke();

        // Turtle path
        var x = cv.width / 2;
        var y = cv.height / 2;
        var dir = 0;
        ctx.beginPath();
        ctx.moveTo(x, y);
        for (var i = 0; i < sides; i++) {
          for (var j = 0; j < 4; j++) {
            x += Math.cos(dir) * (stepLen * 0.55);
            y += Math.sin(dir) * (stepLen * 0.55);
            ctx.lineTo(x, y);
            dir += (90 * Math.PI) / 180;
          }
          dir += (angle * Math.PI) / 180;
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        container.querySelector('#sp-sides').addEventListener('input', function(e) {
          sides = parseInt(e.target.value, 10);
          renderSpiro();
        });
        container.querySelector('#sp-angle').addEventListener('input', function(e) {
          angle = parseInt(e.target.value, 10);
          renderSpiro();
        });
        container.querySelector('#sp-step').addEventListener('input', function(e) {
          stepLen = parseInt(e.target.value, 10);
          renderSpiro();
        });
        container.querySelectorAll('[data-preset]').forEach(function(btn) {
          btn.addEventListener('click', function() {
            var parts = btn.getAttribute('data-preset').split(',');
            sides = parseInt(parts[0], 10);
            angle = parseInt(parts[1], 10);
            stepLen = parseInt(parts[2], 10);
            color = parts[3];
            if (window.ExperimindAudio) window.ExperimindAudio.click();
            renderSpiro();
          });
        });
        container.querySelector('#sp-verify').addEventListener('click', function() {
          awardSimStar(lesson.id, container.querySelector('#sim-status'), 'Loop Spirograph rendered with ' + sides + ' iterations!');
        });
      }
      renderSpiro();
      return;
    }

    // Mode: 'blocks' (Visual Block Coding & Cartesian Stage)
    var scriptBlocks = (cfg.preset || ['MOVE_60', 'TURN_90', 'MOVE_60', 'SCORE_10']).slice();
    var spriteState = { x: 0, y: 0, dir: 0, score: 0, bubble: '', trail: [{ x: 0, y: 0 }] };

    var BLOCK_CATALOG = {
      'MOVE_60': { label: '🟦 Move 60 Steps', color: '#2563eb' },
      'TURN_90': { label: '🟦 Turn Right 90°', color: '#2563eb' },
      'TURN_L90': { label: '🟦 Turn Left 90°', color: '#2563eb' },
      'SCORE_10': { label: '🟧 Change Score by +10', color: '#ea580c' },
      'SAY_HELLO': { label: '🟪 Say "Hello AI Lab!"', color: '#7c3aed' },
      'BROADCAST_START': { label: '🟨 Broadcast [Goal_Signal]', color: '#ca8a04' }
    };

    function runBlockStack() {
      spriteState = { x: 0, y: 0, dir: 0, score: 0, bubble: '', trail: [{ x: 0, y: 0 }] };
      scriptBlocks.forEach(function(bCode) {
        if (bCode === 'MOVE_60') {
          var rad = (spriteState.dir * Math.PI) / 180;
          spriteState.x = Math.round(spriteState.x + Math.cos(rad) * 60);
          spriteState.y = Math.round(spriteState.y + Math.sin(rad) * 60);
          spriteState.x = Math.max(-160, Math.min(160, spriteState.x));
          spriteState.y = Math.max(-100, Math.min(100, spriteState.y));
          spriteState.trail.push({ x: spriteState.x, y: spriteState.y });
        } else if (bCode === 'TURN_90') {
          spriteState.dir = (spriteState.dir + 90) % 360;
        } else if (bCode === 'TURN_L90') {
          spriteState.dir = (spriteState.dir + 270) % 360;
        } else if (bCode === 'SCORE_10') {
          spriteState.score += 10;
        } else if (bCode === 'SAY_HELLO') {
          spriteState.bubble = 'Hello AI Lab! 🚀';
        } else if (bCode === 'BROADCAST_START') {
          spriteState.bubble = '📡 Signal Broadcasted!';
          spriteState.score += 10;
        }
      });
    }

    function renderBlocks() {
      var html = '<div class="sim-Card">';
      html += '<div class="sim-HeaderRow"><div><span class="sim-EngineBadge">ENG-05 • Visual Block Coding Studio</span><h4>' + (cfg.title || lesson.title) + '</h4></div>';
      html += '<div class="sim-ProgressPill">X: ' + spriteState.x + ' | Y: ' + (-spriteState.y) + ' | Dir: ' + spriteState.dir + '° | Score: ' + spriteState.score + '</div></div>';

      html += '<div class="sim-BlockStudioGrid">';
      // Palette + Script Stack
      html += '<div class="sim-BlockColumn">';
      html += '<div class="sim-SubLabel">1. Click a Code Block to Snap to Script:</div>';
      html += '<div class="sim-PaletteGrid">';
      Object.keys(BLOCK_CATALOG).forEach(function(k) {
        html += '<button type="button" class="sim-CodeBlockBtn" style="border-left: 5px solid ' + BLOCK_CATALOG[k].color + ';" data-add-block="' + k + '">' + BLOCK_CATALOG[k].label + '</button>';
      });
      html += '</div>';

      html += '<div class="sim-SubLabel" style="margin-top:10px;">2. Active Script Stack (When 🟢 Flag Clicked):</div>';
      html += '<div class="sim-ScriptStack">';
      html += '<div class="sim-HatBlock">🟢 when green flag clicked</div>';
      scriptBlocks.forEach(function(bCode, idx) {
        var meta = BLOCK_CATALOG[bCode] || { label: bCode, color: '#475569' };
        html += '<div class="sim-StackedBlock" style="background:' + meta.color + ';" data-rem-block="' + idx + '" title="Click to remove">' + (idx + 1) + '. ' + meta.label + ' ✖</div>';
      });
      html += '</div>';

      html += '<div class="sim-ExecRow" style="margin-top:10px;">';
      html += '<button type="button" class="btn-Primary" id="blocks-run">🟢 Run Green Flag</button>';
      html += '<button type="button" class="btn-Secondary" id="blocks-clear">🔄 Reset Stack</button>';
      html += '</div></div>';

      // Right: Cartesian Stage Canvas
      html += '<div class="sim-StageColumn">';
      html += '<div class="sim-CanvasWrap"><canvas id="stage-canvas" width="380" height="270"></canvas></div>';
      html += '</div></div>';

      html += '<div id="sim-status" class="sim-Banner">Snap blocks into your script and click <strong>🟢 Run Green Flag</strong>!</div>';
      html += '</div>';
      container.innerHTML = html;

      var cv = container.querySelector('#stage-canvas');
      var ctx = cv.getContext('2d');
      var cx = cv.width / 2;
      var cy = cv.height / 2;

      // Grid background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      for (var gx = 0; gx <= cv.width; gx += 38) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, cv.height); ctx.stroke();
      }
      for (var gy = 0; gy <= cv.height; gy += 38) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(cv.width, gy); ctx.stroke();
      }
      // Axes
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, 0); ctx.lineTo(cx, cv.height);
      ctx.moveTo(0, cy); ctx.lineTo(cv.width, cy);
      ctx.stroke();

      // Draw trail
      if (spriteState.trail.length > 1) {
        ctx.beginPath();
        spriteState.trail.forEach(function(pt, i) {
          if (i === 0) ctx.moveTo(cx + pt.x, cy + pt.y);
          else ctx.lineTo(cx + pt.x, cy + pt.y);
        });
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 3.5;
        ctx.stroke();
      }

      // Draw sprite
      var sx = cx + spriteState.x;
      var sy = cy + spriteState.y;
      ctx.font = '30px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🐱', sx, sy);

      if (spriteState.bubble) {
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.fillText(spriteState.bubble, sx, sy - 26);
      }

      container.querySelectorAll('[data-add-block]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          scriptBlocks.push(btn.getAttribute('data-add-block'));
          if (window.ExperimindAudio) window.ExperimindAudio.snap();
          renderBlocks();
        });
      });

      container.querySelectorAll('[data-rem-block]').forEach(function(el) {
        el.addEventListener('click', function() {
          var idx = parseInt(el.getAttribute('data-rem-block'), 10);
          scriptBlocks.splice(idx, 1);
          renderBlocks();
        });
      });

      container.querySelector('#blocks-run').addEventListener('click', function() {
        runBlockStack();
        renderBlocks();
        awardSimStar(lesson.id, container.querySelector('#sim-status'), 'Script executed! Sprite moved to (' + spriteState.x + ', ' + (-spriteState.y) + ') with Score = ' + spriteState.score + '!');
      });

      container.querySelector('#blocks-clear').addEventListener('click', function() {
        scriptBlocks = (cfg.preset || ['MOVE_60', 'TURN_90']).slice();
        spriteState = { x: 0, y: 0, dir: 0, score: 0, bubble: '', trail: [{ x: 0, y: 0 }] };
        renderBlocks();
      });
    }

    runBlockStack();
    renderBlocks();
  }

  // =========================================================================
  // ENG-06: Data Detective: Interactive Charts, Sorting, Binary Search & KNN
  // =========================================================================
  function mountEng06(container, lesson) {
    var cfg = lesson.simConfig || {};
    var mode = cfg.mode || 'chart';

    if (mode === 'sort_algo') {
      var arr = (cfg.initialArray || [64, 25, 12, 48, 19, 82, 33]).slice();
      var swaps = 0;
      var iPtr = 0;

      function isSorted(a) {
        for (var k = 0; k < a.length - 1; k++) {
          if (a[k] > a[k + 1]) return false;
        }
        return true;
      }

      function renderSortAlgo() {
        var sorted = isSorted(arr);
        var html = '<div class="sim-Card">';
        html += '<div class="sim-HeaderRow"><div><span class="sim-EngineBadge">ENG-06 • Sorting Algorithm Visualizer</span><h4>' + (cfg.title || lesson.title) + '</h4></div>';
        html += '<div class="sim-ProgressPill">Swaps Performed: ' + swaps + '</div></div>';
        html += '<p class="sim-Instr">Click <strong>⏯️ Step Bubble Pass</strong> or <strong>⚡ Auto-Sort All</strong> to watch neighboring out-of-order bars swap into ascending order!</p>';

        html += '<div class="sim-BarChartStage">';
        arr.forEach(function(val, idx) {
          var isPair = (!sorted && (idx === iPtr || idx === iPtr + 1));
          var hPct = Math.round((val / 95) * 100);
          html += '<div class="sim-BarCol">';
          html += '<div class="sim-BarValue">' + val + '</div>';
          html += '<div class="sim-BarVisual' + (sorted ? ' sim-BarVisual--sorted' : (isPair ? ' sim-BarVisual--active' : '')) + '" style="height:' + Math.max(18, hPct * 1.6) + 'px;"></div>';
          html += '<div class="sim-BarLabel">[' + idx + ']</div>';
          html += '</div>';
        });
        html += '</div>';

        html += '<div class="sim-FooterActions">';
        html += '<button type="button" class="btn-Primary" id="sort-step">⏯️ Step Next Comparison</button>';
        html += '<button type="button" class="btn-Primary" id="sort-all">⚡ Complete Full Sort</button>';
        html += '<button type="button" class="btn-Secondary" id="sort-reset">🔄 Scramble Array</button>';
        html += '</div>';
        html += '<div id="sim-status" class="sim-Banner">' + (sorted ? '🎉 Array is 100% sorted in ascending order!' : 'Comparing index [' + iPtr + '] (' + arr[iPtr] + ') and [' + (iPtr + 1) + '] (' + arr[iPtr + 1] + ')...') + '</div>';
        html += '</div>';
        container.innerHTML = html;

        if (sorted) {
          awardSimStar(lesson.id, container.querySelector('#sim-status'), 'Sorted the entire array in ' + swaps + ' swaps!');
        }

        container.querySelector('#sort-step').addEventListener('click', function() {
          if (isSorted(arr)) return;
          if (arr[iPtr] > arr[iPtr + 1]) {
            var tmp = arr[iPtr];
            arr[iPtr] = arr[iPtr + 1];
            arr[iPtr + 1] = tmp;
            swaps++;
          }
          iPtr = (iPtr + 1) % (arr.length - 1);
          if (window.ExperimindAudio) window.ExperimindAudio.click();
          renderSortAlgo();
        });

        container.querySelector('#sort-all').addEventListener('click', function() {
          for (var p = 0; p < arr.length; p++) {
            for (var q = 0; q < arr.length - 1; q++) {
              if (arr[q] > arr[q + 1]) {
                var t = arr[q]; arr[q] = arr[q + 1]; arr[q + 1] = t;
                swaps++;
              }
            }
          }
          renderSortAlgo();
        });

        container.querySelector('#sort-reset').addEventListener('click', function() {
          arr = (cfg.initialArray || [64, 25, 12, 48, 19, 82, 33]).slice();
          swaps = 0;
          iPtr = 0;
          renderSortAlgo();
        });
      }
      renderSortAlgo();
      return;
    }

    if (mode === 'binary_search') {
      var lockers = [4, 9, 15, 22, 28, 34, 41, 47, 53, 60, 68, 74, 81, 89, 95];
      var targetVal = 68; // index 10
      var revealed = {};
      var guesses = 0;
      var low = 0, high = lockers.length - 1;

      function renderBinSearch() {
        var found = Object.keys(revealed).some(function(k) { return lockers[k] === targetVal; });
        var mid = Math.floor((low + high) / 2);
        var html = '<div class="sim-Card">';
        html += '<div class="sim-HeaderRow"><div><span class="sim-EngineBadge">ENG-06 • Binary Search Detective</span><h4>' + (cfg.title || lesson.title) + '</h4></div>';
        html += '<div class="sim-ProgressPill">Target Value: <strong>' + targetVal + '</strong> | Guesses: ' + guesses + ' / 4</div></div>';
        html += '<p class="sim-Instr">Find secret value <strong>' + targetVal + '</strong> in the 15 sorted lockers! Hint: Click the highlighted <strong>Midpoint Locker #' + (mid + 1) + '</strong> to cut the search space in half!</p>';

        html += '<div class="sim-LockerGrid">';
        lockers.forEach(function(val, idx) {
          var isRev = !!revealed[idx];
          var OutOfRange = (idx < low || idx > high) && !isRev;
          var isMid = (idx === mid && !found);
          var cls = 'sim-LockerBtn';
          if (isRev && val === targetVal) cls += ' sim-LockerBtn--found';
          else if (isRev) cls += ' sim-LockerBtn--opened';
          else if (OutOfRange) cls += ' sim-LockerBtn--eliminated';
          else if (isMid) cls += ' sim-LockerBtn--mid';

          html += '<button type="button" class="' + cls + '" data-locker="' + idx + '">';
          html += '<div class="sim-LockerNum">Locker #' + (idx + 1) + '</div>';
          html += '<div class="sim-LockerVal">' + (isRev ? val : (isMid ? '🎯 MID' : '🔒')) + '</div>';
          html += '</button>';
        });
        html += '</div>';

        html += '<div class="sim-FooterActions"><button type="button" class="btn-Secondary" id="bsearch-reset">🔄 New Target Number</button></div>';
        html += '<div id="sim-status" class="sim-Banner">Click Midpoint Locker #' + (mid + 1) + ' to test Binary Search!</div>';
        html += '</div>';
        container.innerHTML = html;

        var statusEl = container.querySelector('#sim-status');
        if (found) {
          awardSimStar(lesson.id, statusEl, 'Found target ' + targetVal + ' in just ' + guesses + ' binary search checks (vs. ' + (lockers.indexOf(targetVal) + 1) + ' in linear search)!');
        }

        container.querySelectorAll('[data-locker]').forEach(function(btn) {
          btn.addEventListener('click', function() {
            if (found) return;
            var idx = parseInt(btn.getAttribute('data-locker'), 10);
            if (!revealed[idx]) {
              revealed[idx] = true;
              guesses++;
              if (lockers[idx] < targetVal) low = Math.max(low, idx + 1);
              else if (lockers[idx] > targetVal) high = Math.min(high, idx - 1);
              if (window.ExperimindAudio) window.ExperimindAudio.pop();
            }
            renderBinSearch();
          });
        });

        container.querySelector('#bsearch-reset').addEventListener('click', function() {
          var pickIdx = [2, 5, 10, 12][Math.floor(Math.random() * 4)];
          targetVal = lockers[pickIdx];
          revealed = {};
          guesses = 0;
          low = 0;
          high = lockers.length - 1;
          renderBinSearch();
        });
      }
      renderBinSearch();
      return;
    }

    if (mode === 'knn') {
      var mx = 7, my = 8, kVal = 3;
      var points = [
        { x: 8, y: 8.5, label: '🍎 Apple', color: '#ef4444' },
        { x: 7.5, y: 7.8, label: '🍎 Apple', color: '#ef4444' },
        { x: 8.8, y: 9.0, label: '🍎 Apple', color: '#ef4444' },
        { x: 8.2, y: 2.2, label: '🍌 Banana', color: '#eab308' },
        { x: 7.4, y: 3.0, label: '🍌 Banana', color: '#eab308' },
        { x: 9.0, y: 2.5, label: '🍌 Banana', color: '#eab308' },
        { x: 2.0, y: 2.5, label: '🍋 Lemon', color: '#10b981' },
        { x: 2.8, y: 3.2, label: '🍋 Lemon', color: '#10b981' },
        { x: 1.8, y: 4.0, label: '🍋 Lemon', color: '#10b981' }
      ];
      var testedRegions = {};

      function renderKnn() {
        var dists = points.map(function(pt) {
          return { pt: pt, d: Math.hypot(pt.x - mx, pt.y - my) };
        }).sort(function(a, b) { return a.d - b.d; });
        var nearest = dists.slice(0, kVal);
        var votes = {};
        nearest.forEach(function(n) {
          votes[n.pt.label] = (votes[n.pt.label] || 0) + 1;
        });
        var winner = Object.keys(votes).sort(function(a, b) { return votes[b] - votes[a]; })[0];
        testedRegions[winner] = true;

        var html = '<div class="sim-Card">';
        html += '<div class="sim-HeaderRow"><div><span class="sim-EngineBadge">ENG-06 • 2D Feature Space & KNN Classifier</span><h4>' + (cfg.title || lesson.title) + '</h4></div>';
        html += '<div class="sim-ProgressPill">Prediction (K=' + kVal + '): <strong>' + winner + '</strong></div></div>';

        html += '<div class="sim-SpiroLayout">';
        html += '<div class="sim-CanvasWrap"><canvas id="knn-canvas" width="400" height="280"></canvas></div>';
        html += '<div class="sim-SpiroControls">';
        html += '<label class="sim-SliderLabel">🍬 Feature X (Sweetness): <strong>' + mx.toFixed(1) + '</strong><input type="range" min="1" max="9.5" step="0.5" value="' + mx + '" id="knn-x"></label>';
        html += '<label class="sim-SliderLabel">🥨 Feature Y (Crunchiness): <strong>' + my.toFixed(1) + '</strong><input type="range" min="1" max="9.5" step="0.5" value="' + my + '" id="knn-y"></label>';
        html += '<div class="sim-PresetRow">';
        html += '<button type="button" class="sim-MiniBtn" data-knn-pt="8,8.2">Test Crunchy Sweet (8, 8.2)</button>';
        html += '<button type="button" class="sim-MiniBtn" data-knn-pt="8,2.5">Test Soft Sweet (8, 2.5)</button>';
        html += '<button type="button" class="sim-MiniBtn" data-knn-pt="2.2,3">Test Sour Cluster (2.2, 3)</button>';
        html += '</div>';
        html += '<div class="sim-VoteBox"><strong>Nearest ' + kVal + ' Neighbors Vote:</strong><br>' +
          nearest.map(function(n) { return n.pt.label + ' (dist ' + n.d.toFixed(1) + ')'; }).join(' • ') + '</div>';
        html += '</div></div>';
        html += '<div id="sim-status" class="sim-Banner">Move the Mystery Point sliders across at least 2 cluster regions (' + Object.keys(testedRegions).length + '/2 explored)!</div>';
        html += '</div>';
        container.innerHTML = html;

        var cv = container.querySelector('#knn-canvas');
        var ctx = cv.getContext('2d');
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, cv.width, cv.height);

        function toPx(x, y) {
          return [35 + (x / 10) * 340, 250 - (y / 10) * 225];
        }

        // Draw lines to K nearest neighbors
        var mPx = toPx(mx, my);
        nearest.forEach(function(n) {
          var pPx = toPx(n.pt.x, n.pt.y);
          ctx.beginPath();
          ctx.moveTo(mPx[0], mPx[1]);
          ctx.lineTo(pPx[0], pPx[1]);
          ctx.strokeStyle = '#93c5fd';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        });

        // Draw training points
        points.forEach(function(pt) {
          var xy = toPx(pt.x, pt.y);
          ctx.beginPath();
          ctx.arc(xy[0], xy[1], 8, 0, Math.PI * 2);
          ctx.fillStyle = pt.color;
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        });

        // Draw mystery star
        ctx.beginPath();
        ctx.arc(mPx[0], mPx[1], 11, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillText('❓ MYSTERY', mPx[0] - 32, mPx[1] - 16);

        if (Object.keys(testedRegions).length >= 2) {
          awardSimStar(lesson.id, container.querySelector('#sim-status'), 'You classified mystery points across multiple feature clusters!');
        }

        container.querySelector('#knn-x').addEventListener('input', function(e) {
          mx = parseFloat(e.target.value);
          renderKnn();
        });
        container.querySelector('#knn-y').addEventListener('input', function(e) {
          my = parseFloat(e.target.value);
          renderKnn();
        });
        container.querySelectorAll('[data-knn-pt]').forEach(function(b) {
          b.addEventListener('click', function() {
            var p = b.getAttribute('data-knn-pt').split(',');
            mx = parseFloat(p[0]);
            my = parseFloat(p[1]);
            if (window.ExperimindAudio) window.ExperimindAudio.pop();
            renderKnn();
          });
        });
      }
      renderKnn();
      return;
    }

    // Default mode: 'chart' (Interactive Bar Chart Builder)
    var cats = cfg.categories || ['Item A', 'Item B', 'Item C'];
    var vals = (cfg.initial || [2, 3, 4]).slice();
    var targets = cfg.targets || [5, 4, 7];
    var maxVal = cfg.maxVal || 10;

    function renderChart() {
      var allMatch = vals.every(function(v, i) { return v === targets[i]; });
      var html = '<div class="sim-Card">';
      html += '<div class="sim-HeaderRow"><div><span class="sim-EngineBadge">ENG-06 • Data Detective Chart Builder</span><h4>' + (cfg.title || lesson.title) + '</h4></div>';
      html += '<div class="sim-ProgressPill">' + (allMatch ? '✅ Dataset Verified' : 'Calibrating Bars...') + '</div></div>';
      html += '<p class="sim-Instr">Use the <strong>+</strong> and <strong>−</strong> buttons below each column so every bar matches its Target Count!</p>';

      html += '<div class="sim-BarChartStage">';
      cats.forEach(function(cName, idx) {
        var v = vals[idx];
        var t = targets[idx];
        var match = (v === t);
        var hPx = Math.round((v / maxVal) * 160);
        html += '<div class="sim-BarCol">';
        html += '<div class="sim-BarTarget">Target: ' + t + '</div>';
        html += '<div class="sim-BarValue"><strong>' + v + '</strong></div>';
        html += '<div class="sim-BarVisual' + (match ? ' sim-BarVisual--sorted' : '') + '" style="height:' + Math.max(14, hPx) + 'px;"></div>';
        html += '<div class="sim-BarLabel">' + cName + '</div>';
        html += '<div class="sim-BarBtnPair">';
        html += '<button type="button" class="sim-MiniBtn" data-ch-dec="' + idx + '">−</button>';
        html += '<button type="button" class="sim-MiniBtn" data-ch-inc="' + idx + '">+</button>';
        html += '</div></div>';
      });
      html += '</div>';

      html += '<div class="sim-FooterActions"><button type="button" class="btn-Secondary" id="chart-auto-match">⚡ Match Target Values</button></div>';
      html += '<div id="sim-status" class="sim-Banner">Adjust each bar until all columns turn green!</div>';
      html += '</div>';
      container.innerHTML = html;

      if (allMatch) {
        awardSimStar(lesson.id, container.querySelector('#sim-status'), 'All data columns match the verified target counts!');
      }

      container.querySelectorAll('[data-ch-inc]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var i = parseInt(btn.getAttribute('data-ch-inc'), 10);
          vals[i] = Math.min(maxVal, vals[i] + 1);
          if (window.ExperimindAudio) window.ExperimindAudio.click();
          renderChart();
        });
      });
      container.querySelectorAll('[data-ch-dec]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var i = parseInt(btn.getAttribute('data-ch-dec'), 10);
          vals[i] = Math.max(0, vals[i] - 1);
          if (window.ExperimindAudio) window.ExperimindAudio.click();
          renderChart();
        });
      });
      container.querySelector('#chart-auto-match').addEventListener('click', function() {
        vals = targets.slice();
        renderChart();
      });
    }
    renderChart();
  }

  // =========================================================================
  // ENG-07: Supervised ML, Decision Tree, NLP Tokenizer & Confusion Matrix
  // =========================================================================
  function mountEng07(container, lesson) {
    var cfg = lesson.simConfig || {};
    var mode = cfg.mode || 'supervised';

    if (mode === 'tree') {
      var q1 = true, q2 = true;
      var explored = {};

      function renderTree() {
        var leaf = '';
        if (q1 && q2) leaf = '🐬 Dolphin (Aquatic + Breathe Air / Fins)';
        else if (q1 && !q2) leaf = '🐙 Octopus (Aquatic + 8 Tentacles)';
        else if (!q1 && q2) leaf = '🦅 Bald Eagle (Land/Sky + Feathered Wings)';
        else leaf = '🦁 African Lion (Land/Sky + Four Legs & Mane)';
        explored[leaf] = true;

        var html = '<div class="sim-Card">';
        html += '<div class="sim-HeaderRow"><div><span class="sim-EngineBadge">ENG-07 • Decision Tree Classifier</span><h4>' + (cfg.title || lesson.title) + '</h4></div>';
        html += '<div class="sim-ProgressPill">Leaves Explored: ' + Object.keys(explored).length + ' / 3</div></div>';

        html += '<div class="sim-TreeContainer">';
        html += '<div class="sim-TreeNode sim-TreeNode--root">🌳 <strong>Root Node Q1:</strong> Does the creature live in the ocean?<div class="sim-TabRow" style="margin-top:8px;">';
        html += '<button type="button" class="sim-TabBtn' + (q1 ? ' sim-TabBtn--active' : '') + '" id="tree-q1-yes">YES (Aquatic) 🌊</button>';
        html += '<button type="button" class="sim-TabBtn' + (!q1 ? ' sim-TabBtn--active' : '') + '" id="tree-q1-no">NO (Land / Sky) 🏞️</button>';
        html += '</div></div>';

        html += '<div class="sim-TreeNode">🌿 <strong>Branch Node Q2:</strong> ' + (q1 ? 'Does it swim with fins and breathe air?' : 'Does it have feathers and wings?') + '<div class="sim-TabRow" style="margin-top:8px;">';
        html += '<button type="button" class="sim-TabBtn' + (q2 ? ' sim-TabBtn--active' : '') + '" id="tree-q2-yes">YES ✅</button>';
        html += '<button type="button" class="sim-TabBtn' + (!q2 ? ' sim-TabBtn--active' : '') + '" id="tree-q2-no">NO ❌</button>';
        html += '</div></div>';

        html += '<div class="sim-TreeNode sim-TreeNode--leaf">🍃 <strong>Predicted Leaf Node Classification:</strong><br><span style="font-size:1.2rem;">' + leaf + '</span></div>';
        html += '</div>';

        html += '<div id="sim-status" class="sim-Banner">Toggle the Root and Branch answers to reach at least 3 different Leaf predictions!</div>';
        html += '</div>';
        container.innerHTML = html;

        if (Object.keys(explored).length >= 3) {
          awardSimStar(lesson.id, container.querySelector('#sim-status'), 'You traversed the Decision Tree to 3 distinct Leaf classifications!');
        }

        container.querySelector('#tree-q1-yes').addEventListener('click', function() { q1 = true; renderTree(); });
        container.querySelector('#tree-q1-no').addEventListener('click', function() { q1 = false; renderTree(); });
        container.querySelector('#tree-q2-yes').addEventListener('click', function() { q2 = true; renderTree(); });
        container.querySelector('#tree-q2-no').addEventListener('click', function() { q2 = false; renderTree(); });
      }
      renderTree();
      return;
    }

    if (mode === 'nlp') {
      var samples = [
        { text: 'The science robotics lab is super awesome and helpful!', intent: 'POSITIVE_FEEDBACK 🌟', sentiment: 'Positive (+0.92)', stopWords: ['the', 'is', 'and'], keywords: ['science', 'robotics', 'lab', 'super', 'awesome', 'helpful'] },
        { text: 'What is the weather forecast for rainy tomorrow in school?', intent: 'WEATHER_QUERY 🌦️', sentiment: 'Neutral (0.00)', stopWords: ['what', 'is', 'the', 'for', 'in'], keywords: ['weather', 'forecast', 'rainy', 'tomorrow', 'school'] },
        { text: 'Please set a morning alarm timer for 6 AM tomorrow', intent: 'ALARM_TIMER_SET ⏰', sentiment: 'Neutral (+0.10)', stopWords: ['a', 'for'], keywords: ['please', 'set', 'morning', 'alarm', 'timer', '6', 'am', 'tomorrow'] },
        { text: 'This broken sensor is terribly slow and frustrating', intent: 'TECH_SUPPORT_ALERT 🛠️', sentiment: 'Negative (-0.85)', stopWords: ['this', 'is', 'and'], keywords: ['broken', 'sensor', 'terribly', 'slow', 'frustrating'] }
      ];
      var curIdx = 0;
      var testedNlp = {};

      function renderNlp() {
        var s = samples[curIdx];
        testedNlp[curIdx] = true;
        var rawTokens = s.text.replace(/[!?.]/g, '').split(' ');

        var html = '<div class="sim-Card">';
        html += '<div class="sim-HeaderRow"><div><span class="sim-EngineBadge">ENG-07 • NLP Tokenizer & Intent Analyzer</span><h4>' + (cfg.title || lesson.title) + '</h4></div>';
        html += '<div class="sim-ProgressPill">Sentences Analyzed: ' + Object.keys(testedNlp).length + ' / 3</div></div>';

        html += '<div class="sim-SubLabel">1. Pick a Sample Utterance to Process:</div>';
        html += '<div class="sim-OptionGrid">';
        samples.forEach(function(smp, idx) {
          html += '<button type="button" class="sim-OptionBtn' + (idx === curIdx ? ' sim-OptionBtn--active' : '') + '" data-nlp-idx="' + idx + '">"' + smp.text + '"</button>';
        });
        html += '</div>';

        html += '<div class="sim-SubLabel" style="margin-top:12px;">2. Word Tokenization & Stop-Word Filter (Gray = Filtered Stop Word, Blue = Keyword Token):</div>';
        html += '<div class="sim-TokenTray">';
        rawTokens.forEach(function(tok) {
          var isStop = s.stopWords.indexOf(tok.toLowerCase()) !== -1;
          html += '<span class="sim-NlpToken ' + (isStop ? 'sim-NlpToken--stop' : 'sim-NlpToken--key') + '">' + tok + (isStop ? ' (stop)' : ' ★') + '</span>';
        });
        html += '</div>';

        html += '<div class="sim-NlpResultRow">';
        html += '<div class="sim-MetricBox"><span>Detected Intent Bucket</span><strong>' + s.intent + '</strong></div>';
        html += '<div class="sim-MetricBox"><span>Sentiment Score</span><strong>' + s.sentiment + '</strong></div>';
        html += '</div>';

        html += '<div id="sim-status" class="sim-Banner">Click at least 3 different sentences above to inspect tokenization and sentiment!</div>';
        html += '</div>';
        container.innerHTML = html;

        if (Object.keys(testedNlp).length >= 3) {
          awardSimStar(lesson.id, container.querySelector('#sim-status'), 'You analyzed tokenization, stop-words, and intent across 3 utterances!');
        }

        container.querySelectorAll('[data-nlp-idx]').forEach(function(b) {
          b.addEventListener('click', function() {
            curIdx = parseInt(b.getAttribute('data-nlp-idx'), 10);
            if (window.ExperimindAudio) window.ExperimindAudio.click();
            renderNlp();
          });
        });
      }
      renderNlp();
      return;
    }

    if (mode === 'confusion_matrix') {
      var tp = 42, fp = 8, fn = 12, tn = 38;

      function renderCM() {
        var total = Math.max(1, tp + fp + fn + tn);
        var acc = ((tp + tn) / total) * 100;
        var prec = (tp / Math.max(1, tp + fp)) * 100;
        var rec = (tp / Math.max(1, tp + fn)) * 100;
        var f1 = (prec + rec > 0) ? (2 * prec * rec) / (prec + rec) : 0;

        var html = '<div class="sim-Card">';
        html += '<div class="sim-HeaderRow"><div><span class="sim-EngineBadge">ENG-07 • Confusion Matrix & F1 Calculator</span><h4>' + (cfg.title || lesson.title) + '</h4></div>';
        html += '<div class="sim-ProgressPill">F1-Score: <strong>' + f1.toFixed(1) + '%</strong></div></div>';

        html += '<div class="sim-CmGrid">';
        html += '<div class="sim-CmCell sim-CmCell--good"><strong>True Positive (TP): ' + tp + '</strong><span>Reality: YES • AI: YES</span><input type="range" min="10" max="60" value="' + tp + '" id="cm-tp"></div>';
        html += '<div class="sim-CmCell sim-CmCell--warn"><strong>False Positive (FP): ' + fp + '</strong><span>Type 1 Error (False Alarm)</span><input type="range" min="1" max="30" value="' + fp + '" id="cm-fp"></div>';
        html += '<div class="sim-CmCell sim-CmCell--bad"><strong>False Negative (FN): ' + fn + '</strong><span>Type 2 Error (Dangerous Miss)</span><input type="range" min="1" max="30" value="' + fn + '" id="cm-fn"></div>';
        html += '<div class="sim-CmCell sim-CmCell--good"><strong>True Negative (TN): ' + tn + '</strong><span>Reality: NO • AI: NO</span><input type="range" min="10" max="60" value="' + tn + '" id="cm-tn"></div>';
        html += '</div>';

        html += '<div class="sim-NlpResultRow">';
        html += '<div class="sim-MetricBox"><span>Accuracy</span><strong>' + acc.toFixed(1) + '%</strong></div>';
        html += '<div class="sim-MetricBox"><span>Precision</span><strong>' + prec.toFixed(1) + '%</strong></div>';
        html += '<div class="sim-MetricBox"><span>Recall</span><strong>' + rec.toFixed(1) + '%</strong></div>';
        html += '<div class="sim-MetricBox"><span>F1-Score</span><strong>' + f1.toFixed(1) + '%</strong></div>';
        html += '</div>';

        html += '<div id="sim-status" class="sim-Banner">Reduce False Positives (FP) and False Negatives (FN) so both Precision and Recall exceed 85%!</div>';
        html += '</div>';
        container.innerHTML = html;

        if (prec >= 85 && rec >= 85) {
          awardSimStar(lesson.id, container.querySelector('#sim-status'), 'High-reliability model achieved! Precision = ' + prec.toFixed(1) + '%, Recall = ' + rec.toFixed(1) + '%!');
        }

        container.querySelector('#cm-tp').addEventListener('input', function(e) { tp = parseInt(e.target.value, 10); renderCM(); });
        container.querySelector('#cm-fp').addEventListener('input', function(e) { fp = parseInt(e.target.value, 10); renderCM(); });
        container.querySelector('#cm-fn').addEventListener('input', function(e) { fn = parseInt(e.target.value, 10); renderCM(); });
        container.querySelector('#cm-tn').addEventListener('input', function(e) { tn = parseInt(e.target.value, 10); renderCM(); });
      }
      renderCM();
      return;
    }

    // Default mode: 'supervised' or 'rule_vs_ml'
    var classASamples = 10;
    var classBSamples = 30;
    var noiseResistance = 70;
    var trained = false;

    function renderSup() {
      var total = classASamples + classBSamples;
      var balanceRatio = Math.min(classASamples, classBSamples) / Math.max(1, Math.max(classASamples, classBSamples));
      var testAcc = Math.min(98, Math.round(52 + balanceRatio * 34 + (noiseResistance / 100) * 12));

      var html = '<div class="sim-Card">';
      html += '<div class="sim-HeaderRow"><div><span class="sim-EngineBadge">ENG-07 • Supervised ML & Dataset Bias Lab</span><h4>' + (cfg.title || lesson.title) + '</h4></div>';
      html += '<div class="sim-ProgressPill">Unseen Test Accuracy: <strong>' + (trained ? testAcc + '%' : 'Not Trained') + '</strong></div></div>';

      html += '<p class="sim-Instr">Balance your labeled training samples across both classes and click <strong>⚡ Train & Evaluate Model</strong> to achieve >= 90% unseen test accuracy!</p>';

      html += '<div class="sim-SpiroControls">';
      html += '<label class="sim-SliderLabel">🍏 Class A Labeled Samples: <strong>' + classASamples + ' samples</strong><input type="range" min="5" max="40" step="5" value="' + classASamples + '" id="ml-ca"></label>';
      html += '<label class="sim-SliderLabel">🍎 Class B Labeled Samples: <strong>' + classBSamples + ' samples</strong><input type="range" min="5" max="40" step="5" value="' + classBSamples + '" id="ml-cb"></label>';
      html += '<label class="sim-SliderLabel">🔬 Feature Diversity (Lighting/Angles): <strong>' + noiseResistance + '%</strong><input type="range" min="30" max="100" step="10" value="' + noiseResistance + '" id="ml-div"></label>';
      html += '</div>';

      html += '<div class="sim-NlpResultRow">';
      html += '<div class="sim-MetricBox"><span>Dataset Balance Ratio</span><strong>' + Math.round(balanceRatio * 100) + '% ' + (balanceRatio >= 0.8 ? '✅ Balanced' : '⚠️ Biased/Skewed') + '</strong></div>';
      html += '<div class="sim-MetricBox"><span>Total Training Set</span><strong>' + total + ' Labeled Examples</strong></div>';
      html += '<div class="sim-MetricBox"><span>Unseen Test Accuracy</span><strong>' + (trained ? testAcc + '%' : 'Click Train Below') + '</strong></div>';
      html += '</div>';

      html += '<div class="sim-FooterActions"><button type="button" class="btn-Primary" id="ml-train-btn">⚡ Train Model & Run 20% Test Split</button></div>';
      html += '<div id="sim-status" class="sim-Banner">Adjust sample sliders to eliminate bias (aim for 30+ samples in both Class A and Class B) and click Train!</div>';
      html += '</div>';
      container.innerHTML = html;

      if (trained && testAcc >= 90) {
        awardSimStar(lesson.id, container.querySelector('#sim-status'), 'Balanced Supervised Model achieved ' + testAcc + '% accuracy on unseen test data!');
      } else if (trained) {
        var st = container.querySelector('#sim-status');
        if (st) {
          st.className = 'sim-Banner sim-Banner--warn';
          st.innerHTML = '⚠️ Test Accuracy is ' + testAcc + '%. Class imbalance causes bias! Equalize Class A and Class B samples above 30 and increase Feature Diversity.';
        }
      }

      container.querySelector('#ml-ca').addEventListener('input', function(e) { classASamples = parseInt(e.target.value, 10); trained = false; renderSup(); });
      container.querySelector('#ml-cb').addEventListener('input', function(e) { classBSamples = parseInt(e.target.value, 10); trained = false; renderSup(); });
      container.querySelector('#ml-div').addEventListener('input', function(e) { noiseResistance = parseInt(e.target.value, 10); trained = false; renderSup(); });
      container.querySelector('#ml-train-btn').addEventListener('click', function() {
        trained = true;
        if (window.ExperimindAudio) window.ExperimindAudio.pop();
        renderSup();
      });
    }
    renderSup();
  }

  // =========================================================================
  // ENG-08: Neural Network & Perceptron Playground
  // =========================================================================
  function mountEng08(container, lesson) {
    var cfg = lesson.simConfig || {};
    var x1 = 1, x2 = 1, x3 = 0;
    var w1 = 1.2, w2 = 1.0, w3 = 0.8, bias = -1.5;
    var actFn = 'sigmoid';

    function renderNN() {
      var z = (x1 * w1) + (x2 * w2) + (x3 * w3) + bias;
      var out = 0;
      if (actFn === 'step') out = z >= 0 ? 1 : 0;
      else if (actFn === 'relu') out = Math.max(0, z);
      else out = 1 / (1 + Math.exp(-z));

      var fired = out >= 0.75;

      var html = '<div class="sim-Card">';
      html += '<div class="sim-HeaderRow"><div><span class="sim-EngineBadge">ENG-08 • Neural Network & Perceptron Lab</span><h4>' + (cfg.title || lesson.title) + '</h4></div>';
      html += '<div class="sim-ProgressPill">Output Activation: <strong>' + out.toFixed(2) + (fired ? ' 🔥 FIRED' : ' 💤 QUIET') + '</strong></div></div>';

      html += '<div class="sim-TabRow">';
      [['sigmoid', 'Sigmoid (0..1 Probability)'], ['step', 'Step Function (0 or 1)'], ['relu', 'ReLU max(0, z)']].forEach(function(pair) {
        html += '<button type="button" class="sim-TabBtn' + (actFn === pair[0] ? ' sim-TabBtn--active' : '') + '" data-act="' + pair[0] + '">' + pair[1] + '</button>';
      });
      html += '</div>';

      html += '<div class="sim-NnGrid">';
      // Inputs + Weights
      [
        { idx: 1, label: 'x1: Sunny Sky ☀️', xVal: x1, wVal: w1 },
        { idx: 2, label: 'x2: Dry Field 🏟️', xVal: x2, wVal: w2 },
        { idx: 3, label: 'x3: Coach Ready  whistle', xVal: x3, wVal: w3 }
      ].forEach(function(node) {
        html += '<div class="sim-NnRow">';
        html += '<button type="button" class="sim-SwitchBtn' + (node.xVal ? ' sim-SwitchBtn--on' : '') + '" data-nn-x="' + node.idx + '">' + node.label + ' = <strong>' + node.xVal + '</strong></button>';
        html += '<label class="sim-SliderLabel">Weight w' + node.idx + ': <strong>' + node.wVal.toFixed(1) + '</strong><input type="range" min="-2.0" max="2.5" step="0.1" value="' + node.wVal + '" data-nn-w="' + node.idx + '"></label>';
        html += '<div class="sim-NnProd">Signal: ' + (node.xVal * node.wVal).toFixed(2) + '</div>';
        html += '</div>';
      });
      html += '</div>';

      html += '<label class="sim-SliderLabel" style="margin-top:10px;">⚖️ Neuron Threshold Bias (b): <strong>' + bias.toFixed(1) + '</strong><input type="range" min="-3.0" max="2.0" step="0.1" value="' + bias + '" id="nn-bias"></label>';

      html += '<div class="sim-MathReadout">Weighted Sum <code>z = (' + x1 + '×' + w1.toFixed(1) + ') + (' + x2 + '×' + w2.toFixed(1) + ') + (' + x3 + '×' + w3.toFixed(1) + ') + (' + bias.toFixed(1) + ') = ' + z.toFixed(2) + '</code> ➔ <strong>Output = ' + out.toFixed(2) + '</strong></div>';
      html += '<div id="sim-status" class="sim-Banner">Tune inputs, weights, and bias until Output Activation reaches >= 0.80!</div>';
      html += '</div>';
      container.innerHTML = html;

      if (out >= 0.80) {
        awardSimStar(lesson.id, container.querySelector('#sim-status'), 'Neuron activated strongly (Output = ' + out.toFixed(2) + ') with z = ' + z.toFixed(2) + '!');
      }

      container.querySelectorAll('[data-act]').forEach(function(b) {
        b.addEventListener('click', function() { actFn = b.getAttribute('data-act'); renderNN(); });
      });
      container.querySelectorAll('[data-nn-x]').forEach(function(b) {
        b.addEventListener('click', function() {
          var idx = parseInt(b.getAttribute('data-nn-x'), 10);
          if (idx === 1) x1 = x1 ? 0 : 1;
          if (idx === 2) x2 = x2 ? 0 : 1;
          if (idx === 3) x3 = x3 ? 0 : 1;
          if (window.ExperimindAudio) window.ExperimindAudio.click();
          renderNN();
        });
      });
      container.querySelectorAll('[data-nn-w]').forEach(function(sl) {
        sl.addEventListener('input', function(e) {
          var idx = parseInt(sl.getAttribute('data-nn-w'), 10);
          var v = parseFloat(e.target.value);
          if (idx === 1) w1 = v;
          if (idx === 2) w2 = v;
          if (idx === 3) w3 = v;
          renderNN();
        });
      });
      container.querySelector('#nn-bias').addEventListener('input', function(e) {
        bias = parseFloat(e.target.value);
        renderNN();
      });
    }
    renderNN();
  }

  // =========================================================================
  // ENG-09: Computer Vision Pixel Matrix & 3x3 Convolution Filter Lab
  // =========================================================================
  function mountEng09(container, lesson) {
    var cfg = lesson.simConfig || {};
    var showNums = true;
    var kernelName = 'vert_edge';
    var scannedCount = 0;

    var PRESETS = {
      'vline': [
        [0,0,255,255,0,0],
        [0,0,255,255,0,0],
        [0,0,255,255,0,0],
        [0,0,255,255,0,0],
        [0,0,255,255,0,0],
        [0,0,255,255,0,0]
      ],
      'hline': [
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [255,255,255,255,255,255],
        [255,255,255,255,255,255],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0]
      ],
      'cross': [
        [0,0,255,255,0,0],
        [0,0,255,255,0,0],
        [255,255,255,255,255,255],
        [255,255,255,255,255,255],
        [0,0,255,255,0,0],
        [0,0,255,255,0,0]
      ]
    };

    var KERNELS = {
      'vert_edge': { label: 'Vertical Edge Filter', k: [[-1,0,1],[-1,0,1],[-1,0,1]] },
      'horiz_edge': { label: 'Horizontal Edge Filter', k: [[-1,-1,-1],[0,0,0],[1,1,1]] },
      'sharpen': { label: 'Sharpen Center Filter', k: [[0,-1,0],[-1,5,-1],[0,-1,0]] }
    };

    var grid = PRESETS.cross.map(function(r) { return r.slice(); });

    function computeFeatureMap() {
      var k = KERNELS[kernelName].k;
      var out = [];
      for (var r = 0; r < 6; r++) {
        var row = [];
        for (var c = 0; c < 6; c++) {
          var sum = 0;
          for (var kr = -1; kr <= 1; kr++) {
            for (var kc = -1; kc <= 1; kc++) {
              var rr = Math.min(5, Math.max(0, r + kr));
              var cc = Math.min(5, Math.max(0, c + kc));
              sum += grid[rr][cc] * k[kr + 1][kc + 1];
            }
          }
          row.push(Math.min(255, Math.max(0, Math.round(Math.abs(sum) / 2))));
        }
        out.push(row);
      }
      return out;
    }

    function renderPixels() {
      var fmap = computeFeatureMap();
      var html = '<div class="sim-Card">';
      html += '<div class="sim-HeaderRow"><div><span class="sim-EngineBadge">ENG-09 • Computer Vision Pixel & Kernel Lab</span><h4>' + (cfg.title || lesson.title) + '</h4></div>';
      html += '<div class="sim-ProgressPill">Kernel Scans: ' + scannedCount + ' / 2</div></div>';
      html += '<p class="sim-Instr">Click any pixel in the left 6×6 Input Matrix to toggle brightness (`0` vs `255`), and switch Convolution Kernels to inspect the output Feature Map!</p>';

      html += '<div class="sim-TabRow">';
      Object.keys(KERNELS).forEach(function(kId) {
        html += '<button type="button" class="sim-TabBtn' + (kernelName === kId ? ' sim-TabBtn--active' : '') + '" data-kernel="' + kId + '">' + KERNELS[kId].label + '</button>';
      });
      html += '</div>';

      html += '<div class="sim-PixelDualGrid">';
      // Input Pixel Grid
      html += '<div><div class="sim-SubLabel">Input Image Matrix (0 = Black, 255 = White):</div><div class="sim-PixelMatrix">';
      for (var r = 0; r < 6; r++) {
        for (var c = 0; c < 6; c++) {
          var v = grid[r][c];
          var bg = 'rgb(' + v + ',' + v + ',' + v + ')';
          var fg = v > 128 ? '#0f172a' : '#f8fafc';
          html += '<button type="button" class="sim-PixelCell" style="background:' + bg + ';color:' + fg + ';" data-px="' + r + ',' + c + '">' + (showNums ? v : '') + '</button>';
        }
      }
      html += '</div></div>';

      // Convolved Feature Map
      html += '<div><div class="sim-SubLabel">Convolved Feature Map (' + KERNELS[kernelName].label + '):</div><div class="sim-PixelMatrix">';
      for (var fr = 0; fr < 6; fr++) {
        for (var fc = 0; fc < 6; fc++) {
          var fv = fmap[fr][fc];
          var fbg = 'rgb(0,' + fv + ',' + Math.min(255, fv + 40) + ')';
          var ffg = fv > 130 ? '#0f172a' : '#f8fafc';
          html += '<div class="sim-PixelCell" style="background:' + fbg + ';color:' + ffg + ';">' + (showNums ? fv : '') + '</div>';
        }
      }
      html += '</div></div></div>';

      html += '<div class="sim-FooterActions">';
      html += '<button type="button" class="btn-Secondary" data-px-preset="vline">Vertical Bar</button>';
      html += '<button type="button" class="btn-Secondary" data-px-preset="hline">Horizontal Bar</button>';
      html += '<button type="button" class="btn-Secondary" data-px-preset="cross">Plus Cross</button>';
      html += '</div>';
      html += '<div id="sim-status" class="sim-Banner">Click pixels or switch between Vertical and Horizontal Edge Filters!</div>';
      html += '</div>';
      container.innerHTML = html;

      if (scannedCount >= 2) {
        awardSimStar(lesson.id, container.querySelector('#sim-status'), 'You extracted edge feature maps across multiple convolution filters!');
      }

      container.querySelectorAll('[data-px]').forEach(function(cell) {
        cell.addEventListener('click', function() {
          var rc = cell.getAttribute('data-px').split(',');
          var rr = parseInt(rc[0], 10), cc = parseInt(rc[1], 10);
          grid[rr][cc] = grid[rr][cc] > 128 ? 0 : 255;
          scannedCount++;
          if (window.ExperimindAudio) window.ExperimindAudio.click();
          renderPixels();
        });
      });

      container.querySelectorAll('[data-kernel]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          kernelName = btn.getAttribute('data-kernel');
          scannedCount++;
          if (window.ExperimindAudio) window.ExperimindAudio.pop();
          renderPixels();
        });
      });

      container.querySelectorAll('[data-px-preset]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var p = btn.getAttribute('data-px-preset');
          grid = PRESETS[p].map(function(r) { return r.slice(); });
          scannedCount++;
          renderPixels();
        });
      });
    }
    renderPixels();
  }

  // =========================================================================
  // ENG-10: Smart IoT Sensor Workbench & AI Ethics / 4Ws Governance Auditor
  // =========================================================================
  function mountEng10(container, lesson) {
    var cfg = lesson.simConfig || {};
    var mode = cfg.mode || 'iot';

    if (mode === 'ethics') {
      var scenarios = cfg.scenarios || [];
      var approved = {};

      function renderEthics() {
        var doneCount = Object.keys(approved).length;
        var html = '<div class="sim-Card">';
        html += '<div class="sim-HeaderRow"><div><span class="sim-EngineBadge">ENG-10 • AI Governance & 4Ws Auditor</span><h4>' + (cfg.title || lesson.title) + '</h4></div>';
        html += '<div class="sim-ProgressPill">' + doneCount + ' / ' + scenarios.length + ' Audited</div></div>';
        html += '<p class="sim-Instr">Review each real-world scenario below and click <strong>🛡️ Activate Ethical Guardrail / Verify Scope</strong> to lock in the responsible standard!</p>';

        html += '<div class="sim-EthicsList">';
        scenarios.forEach(function(sc, idx) {
          var isDone = !!approved[idx];
          html += '<div class="sim-EthicsCard' + (isDone ? ' sim-EthicsCard--done' : '') + '">';
          html += '<div class="sim-EthicsHeader"><strong>' + sc.title + '</strong><span class="sim-RiskBadge">' + sc.risk + '</span></div>';
          html += '<p class="sim-EthicsDesc">' + sc.desc + '</p>';
          if (isDone) {
            html += '<div class="sim-GuardrailActive">✅ <strong>Verified Standard:</strong> ' + sc.safeAction + '</div>';
          } else {
            html += '<button type="button" class="btn-Primary" data-audit-idx="' + idx + '">🛡️ Apply Guardrail: ' + sc.safeAction + '</button>';
          }
          html += '</div>';
        });
        html += '</div>';

        html += '<div id="sim-status" class="sim-Banner">Audit all ' + scenarios.length + ' scenarios above to earn your Governance Star!</div>';
        html += '</div>';
        container.innerHTML = html;

        if (doneCount === scenarios.length && scenarios.length > 0) {
          awardSimStar(lesson.id, container.querySelector('#sim-status'), 'All ' + scenarios.length + ' ethical guardrails and 4Ws scopes verified!');
        }

        container.querySelectorAll('[data-audit-idx]').forEach(function(btn) {
          btn.addEventListener('click', function() {
            var idx = parseInt(btn.getAttribute('data-audit-idx'), 10);
            approved[idx] = true;
            if (window.ExperimindAudio) window.ExperimindAudio.pop();
            renderEthics();
          });
        });
      }
      renderEthics();
      return;
    }

    // Default mode: 'iot' (Smart Home / Smart Agriculture / Smart City IoT Sensor Lab)
    var s1 = 34, s2 = 22, s3 = 1;
    var changes = 0;

    function renderIot() {
      var preset = cfg.presetMode || 'smart_home';
      var fanOn = s1 >= 30 && s3 === 1;
      var valveOn = s2 < 35;
      var alertOn = (s1 >= 38 || s2 >= 80);

      var html = '<div class="sim-Card">';
      html += '<div class="sim-HeaderRow"><div><span class="sim-EngineBadge">ENG-10 • Smart IoT Sensor & Actuator Network</span><h4>' + (cfg.title || lesson.title) + '</h4></div>';
      html += '<div class="sim-ProgressPill">Sensor Tests: ' + changes + ' / 3</div></div>';

      html += '<div class="sim-SpiroControls">';
      html += '<label class="sim-SliderLabel">🌡️ Sensor 1 (Temperature / River Level): <strong>' + s1 + ' units</strong><input type="range" min="15" max="45" value="' + s1 + '" id="iot-s1"></label>';
      html += '<label class="sim-SliderLabel">💧 Sensor 2 (' + (preset === 'smart_agri' ? 'Soil Moisture %' : 'Daylight / Rainfall %') + '): <strong>' + s2 + '%</strong><input type="range" min="5" max="95" step="5" value="' + s2 + '" id="iot-s2"></label>';
      html += '<button type="button" class="sim-SwitchBtn' + (s3 ? ' sim-SwitchBtn--on' : '') + '" id="iot-s3">📡 Sensor 3 (Motion / Edge Node Online): <strong>' + (s3 ? 'DETECTED (1)' : 'CLEAR (0)') + '</strong></button>';
      html += '</div>';

      html += '<div class="sim-NlpResultRow">';
      html += '<div class="sim-MetricBox"><span>🌀 Smart Cooling / Relay</span><strong>' + (fanOn ? '🟢 ON (Temp>=30 & Motion=1)' : '⚪ STANDBY (Saving Power)') + '</strong></div>';
      html += '<div class="sim-MetricBox"><span>🚿 Automated Valve / LEDs</span><strong>' + (valveOn ? '🟢 ACTIVE (Level < 35%)' : '⚪ OFF (Threshold Met)') + '</strong></div>';
      html += '<div class="sim-MetricBox"><span>🚨 Early-Warning Siren</span><strong>' + (alertOn ? '🔴 TRIGGERED (High Spike!)' : '🟢 NORMAL SAFE') + '</strong></div>';
      html += '</div>';

      html += '<div id="sim-status" class="sim-Banner">Adjust the 3 IoT sensor inputs above to observe how actuators respond automatically!</div>';
      html += '</div>';
      container.innerHTML = html;

      if (changes >= 3) {
        awardSimStar(lesson.id, container.querySelector('#sim-status'), 'Smart IoT Sensor-to-Actuator automation verified!');
      }

      container.querySelector('#iot-s1').addEventListener('input', function(e) { s1 = parseInt(e.target.value, 10); changes++; renderIot(); });
      container.querySelector('#iot-s2').addEventListener('input', function(e) { s2 = parseInt(e.target.value, 10); changes++; renderIot(); });
      container.querySelector('#iot-s3').addEventListener('click', function() { s3 = s3 ? 0 : 1; changes++; if (window.ExperimindAudio) window.ExperimindAudio.click(); renderIot(); });
    }
    renderIot();
  }

  return {
    cleanup: cleanup,
    mount: function(container, lesson) {
      cleanup();
      if (!container || !lesson) return;
      var eng = lesson.engine || 'ENG-01';
      if (eng === 'ENG-01') mountEng01(container, lesson);
      else if (eng === 'ENG-02') mountEng02(container, lesson);
      else if (eng === 'ENG-03') mountEng03(container, lesson);
      else if (eng === 'ENG-04') mountEng04(container, lesson);
      else if (eng === 'ENG-05') mountEng05(container, lesson);
      else if (eng === 'ENG-06') mountEng06(container, lesson);
      else if (eng === 'ENG-07') mountEng07(container, lesson);
      else if (eng === 'ENG-08') mountEng08(container, lesson);
      else if (eng === 'ENG-09') mountEng09(container, lesson);
      else mountEng10(container, lesson);
    }
  };
})();
