// Experimind AI Learning Lab v5.0 (100/100 Edition) — Kid-Centric Controller, Confetti & Master-Detail Academy
window.ExperimindConfetti = (function() {
  var canvas = null;
  var ctx = null;
  var particles = [];
  var animFrameId = null;

  function initCanvas() {
    if (!canvas) {
      canvas = document.getElementById('exp-confetti-canvas');
      if (canvas) {
        ctx = canvas.getContext('2d');
        resize();
        window.addEventListener('resize', resize);
      }
    }
  }

  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function burst(x, y, count) {
    initCanvas();
    if (!canvas || !ctx) return;
    var num = count || 85;
    var originX = (typeof x === 'number') ? x : canvas.width / 2;
    var originY = (typeof y === 'number') ? y : canvas.height / 3;
    var colors = ['#facc15', '#38bdf8', '#ec4899', '#10b981', '#a855f7', '#f97316', '#e11d48', '#22c55e'];

    for (var i = 0; i < num; i++) {
      var angle = Math.random() * Math.PI * 2;
      var speed = 4 + Math.random() * 12;
      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: 7 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 14,
        alpha: 1,
        shape: Math.random() > 0.35 ? 'rect' : 'circle',
        gravity: 0.28 + Math.random() * 0.15,
        drag: 0.982
      });
    }

    if (!animFrameId) {
      animFrameId = requestAnimationFrame(loop);
    }
  }

  function loop() {
    if (!canvas || !ctx) {
      animFrameId = null;
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.rotation += p.rotSpeed;
      p.alpha -= 0.009;

      if (p.alpha <= 0 || p.y > canvas.height + 20) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    if (particles.length > 0) {
      animFrameId = requestAnimationFrame(loop);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      animFrameId = null;
    }
  }

  return {
    burst: burst
  };
})();

window.ExperimindApp = (function() {
  var state = {
    route: 'home',       // 'home' | 'grade' | 'lesson' | 'game' | 'vision' | 'external' | 'videos' | 'books' | 'simulators'
    param: '',
    bandFilter: 'all',
    searchQuery: '',
    quizAnswers: {},     // lessonId -> { qIdx: selectedIdx }
    // Video & Digital Learning Resources Academy State (Khan Academy / BrainPOP style)
    selectedVideoId: 'vid-01',
    videoBandFilter: 'all',
    videoPlayerMode: 'animated', // 'animated' (100% offline canvas) | 'youtube' (youtube-nocookie embed)
    videoSubTab: 'guide',        // 'guide' | 'flashcards' | 'quiz' | 'worksheet'
    flippedCards: {},            // key -> bool
    checkpointAnswers: {},       // vidId -> optIdx
    selectedBookId: 'cbse-ai-class6'
  };

  function getCurriculum() {
    return window.EXPERIMIND_CURRICULUM || { grades: [], lessons: [] };
  }

  function findLesson(lessonId) {
    var lessons = getCurriculum().lessons || [];
    return lessons.find(function(l) { return l.id === lessonId; }) || lessons[0];
  }

  function updateHeaderBadges() {
    var soundBtn = document.getElementById('header-sound-btn');
    if (soundBtn && window.ExperimindAudio) {
      var on = window.ExperimindAudio.isEnabled();
      soundBtn.textContent = on ? '🔊 Sound: ON' : '🔇 Sound: Off';
      soundBtn.className = 'exp-TogglePill' + (on ? ' exp-TogglePill--on' : '');
    }
  }

  function navigate(route, param) {
    if (window.ExperimindSimulators) window.ExperimindSimulators.cleanup();
    if (window.ExperimindVisionLab) window.ExperimindVisionLab.stopHardwareCamera();
    if (window.ExperimindVideoPlayer) window.ExperimindVideoPlayer.stopAll();
    state.route = route || 'home';
    state.param = param || '';
    var newHash = '#' + state.route + (state.param ? '/' + encodeURIComponent(state.param) : '');
    if (window.location.hash !== newHash) {
      try { history.replaceState(null, '', newHash); } catch (e) {}
    }
    renderApp();
    window.scrollTo(0, 0);
  }

  function renderHome(mainEl) {
    var curr = getCurriculum();
    var grades = curr.grades || [];
    var lessons = curr.lessons || [];

    var html = '<section class="exp-HeroBanner">';
    html += '<div>';
    html += '<span class="exp-HeroBadge">🤖 EXPERIMIND LABS • INNOVATION FOR EDUCATION</span>';
    html += '<h1>Experimind AI Learning Lab</h1>';
    html += '<p>Explore all 5 core AI Lab pillars below: play 80 interactive AI Educational Games from LKG to Class 8, launch Free AI Software, watch AI Tutorial Videos & Digital Learning Resources, read the CBSE AI Reference Book, and experiment with the live AI Webcam!</p>';
    html += '<div class="exp-HeroActionRow">';
    html += '<button type="button" class="btn-Primary" data-nav="simulators" data-param="" style="background:#facc15;color:#0f172a;border-color:#eab308;border-bottom-color:#ca8a04;">🎮 Play AI Educational Games</button>';
    html += '<button type="button" class="btn-Primary" data-nav="videos" data-param="">🎥 AI Tutorial Videos & Resources</button>';
    html += '<button type="button" class="btn-Primary" data-nav="vision" data-param="Class 6" style="background:#10b981;border-color:#059669;border-bottom-color:#047857;">📷 Open AI Webcam Lab</button>';
    html += '</div></div>';

    html += '<div class="exp-HeroKpiGrid">';
    html += '<div class="exp-HeroKpiCard"><strong>10 Classes</strong><span>LKG, UKG & Classes 1–8</span></div>';
    html += '<div class="exp-HeroKpiCard"><strong>80 AI Games</strong><span>Hands-On Interactive Labs</span></div>';
    html += '<div class="exp-HeroKpiCard"><strong>5 Lab Pillars</strong><span>Games • Apps • Videos • Books • Webcam</span></div>';
    html += '<div class="exp-HeroKpiCard"><strong>100% Offline</strong><span>Zero Logins • Child-First UX</span></div>';
    html += '</div></section>';

    // THE 5 CORE SCHOOL LAB DELIVERABLES (Matching the Official Proposal Screenshot 1-to-1)
    html += '<h2 style="font-size:1.55rem;font-weight:900;margin-bottom:14px;color:#0f172a;">🚀 The 5 Core AI Learning Lab Pillars (Click Any Module to Launch)</h2>';
    html += '<div class="exp-FivePillarsGrid">';
    [
      { route: 'simulators', param: '', icon: '🎮', color: '#2563eb', title: 'AI Educational Games', desc: '80 interactive games & simulations mapped across LKG, UKG, and Classes 1 to 8.' },
      { route: 'external', param: '', icon: '💻', color: '#f59e0b', title: 'Free AI-related Software', desc: 'Scratch 3.0 Desktop, GCompris, Google Teachable Machine, Blockly Games & Code.org.' },
      { route: 'videos', param: '', icon: '🎥', color: '#8b5cf6', title: 'AI Tutorial Videos & Digital Learning Resources', desc: 'Interactive theater with animated lessons, study guides, flashcards, quizzes & worksheets.' },
      { route: 'books', param: '', icon: '📖', color: '#10b981', title: 'CBSE Artificial Intelligence Reference Book', desc: '100% offline digital student handbooks, chapters, and project guides for Classes 3–8.' },
      { route: 'vision', param: 'Class 6', icon: '📷', color: '#ec4899', title: 'Webcam (AI Vision Lab)', desc: '8 guided step-by-step webcam & virtual camera games: motion, AR face, rover, drone & ML!' }
    ].forEach(function(p) {
      html += '<button type="button" class="exp-PillarCard" style="border-bottom-color:' + p.color + ';" data-nav="' + p.route + '" data-param="' + p.param + '">';
      html += '<div class="exp-PillarIcon" style="color:' + p.color + ';">' + p.icon + '</div>';
      html += '<div><div style="font-size:1.15rem;font-weight:900;color:#0f172a;margin-bottom:4px;">' + p.title + '</div>';
      html += '<div style="font-size:0.9rem;color:#475569;font-weight:600;line-height:1.4;">' + p.desc + '</div></div>';
      html += '</button>';
    });
    html += '</div>';

    // Class-by-Class Browser
    html += '<h2 style="font-size:1.55rem;font-weight:900;margin-bottom:14px;color:#0f172a;">🏫 Pick Your Class (LKG, UKG & Classes 1 to 8)</h2>';
    html += '<div class="exp-FilterRow">';
    html += '<div class="exp-BandTabs">';
    [
      ['all', '🌈 All 10 Classes'],
      ['pre-primary', '🐣 LKG & UKG'],
      ['primary', '🚀 Classes 1 & 2'],
      ['preparatory', '🧩 Classes 3, 4 & 5'],
      ['middle', '🧠 Classes 6, 7 & 8']
    ].forEach(function(b) {
      html += '<button type="button" class="exp-BandTab' + (state.bandFilter === b[0] ? ' exp-BandTab--active' : '') + '" data-band="' + b[0] + '">' + b[1] + '</button>';
    });
    html += '</div>';
    html += '<input type="search" class="exp-SearchInput" id="home-search-input" placeholder="🔍 Search any of the 80 AI games (e.g. Robot, Bubble, Neural, IoT)..." value="' + state.searchQuery.replace(/"/g, '&quot;') + '">';
    html += '</div>';

    if (state.searchQuery.trim().length > 0) {
      var q = state.searchQuery.trim().toLowerCase();
      var matches = lessons.filter(function(l) {
        return l.title.toLowerCase().indexOf(q) !== -1 ||
               l.subtitle.toLowerCase().indexOf(q) !== -1 ||
               l.gradeName.toLowerCase().indexOf(q) !== -1 ||
               l.id.toLowerCase().indexOf(q) !== -1;
      });
      html += '<h3 style="margin-bottom:18px;">🎮 Found ' + matches.length + ' AI Educational Games Matching "' + state.searchQuery + '"</h3>';
      html += '<div class="exp-LessonGrid">';
      matches.forEach(function(l) {
        html += renderLessonCardHtml(l);
      });
      html += '</div>';
    } else {
      var filteredGrades = grades.filter(function(g) {
        return state.bandFilter === 'all' || g.bandCode === state.bandFilter;
      });
      html += '<div class="exp-GradeGrid">';
      filteredGrades.forEach(function(g) {
        html += '<div class="exp-GradeCard" style="border-top: 8px solid ' + g.accent + ';">';
        html += '<div><div class="exp-GradeHeader"><span class="exp-GradeIcon">' + g.icon + '</span><span class="exp-GradeAge">' + g.ageRange + '</span></div>';
        html += '<h3>' + g.name + '</h3>';
        html += '<div class="exp-GradeFramework">✨ 8 Interactive AI Games & Simulators</div>';
        html += '<p class="exp-GradeSummary">' + g.summary + '</p></div>';
        html += '<div class="exp-GradeFooter">';
        html += '<button type="button" class="btn-Secondary" data-nav="vision" data-param="' + g.id + '">📷 Webcam Lab</button>';
        html += '<button type="button" class="btn-Primary" data-nav="grade" data-param="' + g.id + '">🎮 Open 8 Games ➔</button>';
        html += '</div></div>';
      });
      html += '</div>';
    }

    mainEl.innerHTML = html;

    mainEl.querySelectorAll('[data-band]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        state.bandFilter = btn.getAttribute('data-band');
        renderHome(mainEl);
      });
    });

    var searchIn = mainEl.querySelector('#home-search-input');
    if (searchIn) {
      searchIn.addEventListener('input', function(e) {
        state.searchQuery = e.target.value;
        renderHome(mainEl);
        var el = mainEl.querySelector('#home-search-input');
        if (el) {
          el.focus();
          el.setSelectionRange(el.value.length, el.value.length);
        }
      });
    }

    bindNavButtons(mainEl);
  }

  function renderLessonCardHtml(l) {
    var html = '<div class="exp-LessonCard">';
    html += '<div><div class="exp-LessonMetaRow">';
    html += '<span class="exp-LessonNumBadge">' + l.gradeId + ' • Game #' + l.lessonNumber + ' (' + l.id + ')</span>';
    html += '<span style="font-size:0.84rem;font-weight:800;color:#059669;background:#ecfdf5;padding:4px 10px;border-radius:99px;">Interactive Lab</span></div>';
    html += '<h3 style="font-size:1.32rem;font-weight:900;margin-bottom:6px;">' + l.icon + ' ' + l.title + '</h3>';
    html += '<div style="font-size:0.95rem;font-weight:800;color:#4f46e5;margin-bottom:10px;">' + l.subtitle + '</div>';
    html += '<p style="font-size:0.98rem;color:#334155;margin-bottom:18px;">' + l.overview + '</p></div>';
    html += '<div style="display:flex;justify-content:space-between;gap:10px;padding-top:14px;border-top:2px dashed #e2e8f0;">';
    html += '<button type="button" class="btn-Primary" data-nav="lesson" data-param="' + l.id + '" style="flex:1;">🎮 Play Lab Game</button>';
    html += '<button type="button" class="btn-Secondary" data-nav="game" data-param="' + l.id + '">⛶ Fullscreen</button>';
    html += '</div></div>';
    return html;
  }

  function renderGradeView(mainEl) {
    var curr = getCurriculum();
    var g = (curr.grades || []).find(function(gr) { return gr.id === state.param; }) || curr.grades[0];
    var gLessons = (curr.lessons || []).filter(function(l) { return l.gradeId === g.id; });

    var html = '<div style="margin-bottom:22px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">';
    html += '<button type="button" class="btn-Secondary" data-nav="home" data-param="">← Back to All 10 Classes</button>';
    html += '<div style="display:flex;gap:10px;flex-wrap:wrap;">';
    html += '<button type="button" class="btn-Primary" data-nav="vision" data-param="' + g.id + '">📷 Open ' + g.shortName + ' Webcam Lab</button>';
    html += '<button type="button" class="btn-Secondary" data-nav="videos" data-param="">🎥 AI Tutorial Videos & Resources</button>';
    html += '</div></div>';

    html += '<div class="vision-HeaderCard" style="border-left: 8px solid ' + g.accent + ';">';
    html += '<div><span class="sim-EngineBadge">' + g.band + ' • ' + g.ageRange + '</span>';
    html += '<h2 style="font-size:2.1rem;font-weight:900;margin:8px 0;">' + g.icon + ' ' + g.name + ' — 8 AI Educational Games</h2>';
    html += '<p style="color:#e2e8f0;font-size:1.08rem;">' + g.summary + '</p></div></div>';

    html += '<div class="exp-LessonGrid">';
    gLessons.forEach(function(l) {
      html += renderLessonCardHtml(l);
    });
    html += '</div>';

    mainEl.innerHTML = html;
    bindNavButtons(mainEl);
  }

  function renderAllSimulators(mainEl) {
    var curr = getCurriculum();
    var lessons = curr.lessons || [];
    var filtered = lessons.filter(function(l) {
      return state.bandFilter === 'all' || l.bandCode === state.bandFilter;
    });

    var html = '<div class="vision-HeaderCard">';
    html += '<div><span class="sim-EngineBadge">PILLAR 1 • 80 INTERACTIVE HANDS-ON LABS</span>';
    html += '<h2 style="font-size:2rem;font-weight:900;margin:6px 0;">🎮 AI Educational Games (LKG to Class 8)</h2>';
    html += '<p style="color:#e2e8f0;">Filter by grade band below and click any game card to launch its interactive simulator!</p></div></div>';

    html += '<div class="exp-FilterRow">';
    html += '<div class="exp-BandTabs">';
    [
      ['all', '🌈 All 80 Games'],
      ['pre-primary', '🐣 LKG & UKG (16 Games)'],
      ['primary', '🚀 Classes 1 & 2 (16 Games)'],
      ['preparatory', '🧩 Classes 3–5 (24 Games)'],
      ['middle', '🧠 Classes 6–8 (24 Games)']
    ].forEach(function(b) {
      html += '<button type="button" class="exp-BandTab' + (state.bandFilter === b[0] ? ' exp-BandTab--active' : '') + '" data-sim-band="' + b[0] + '">' + b[1] + '</button>';
    });
    html += '</div></div>';

    html += '<div class="exp-LessonGrid">';
    filtered.forEach(function(l) {
      html += renderLessonCardHtml(l);
    });
    html += '</div>';
    mainEl.innerHTML = html;

    mainEl.querySelectorAll('[data-sim-band]').forEach(function(b) {
      b.addEventListener('click', function() {
        state.bandFilter = b.getAttribute('data-sim-band');
        renderAllSimulators(mainEl);
      });
    });
    bindNavButtons(mainEl);
  }

  function renderLessonView(mainEl, isFullscreenGame) {
    var curr = getCurriculum();
    var lessons = curr.lessons || [];
    var lesson = findLesson(state.param);
    var lIdx = lessons.indexOf(lesson);
    var prevLesson = lIdx > 0 ? lessons[lIdx - 1] : null;
    var nextLesson = lIdx + 1 < lessons.length ? lessons[lIdx + 1] : null;

    if (isFullscreenGame) {
      var gHtml = '<div style="margin-bottom:18px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">';
      gHtml += '<button type="button" class="btn-Secondary" data-nav="lesson" data-param="' + lesson.id + '">← Back to Split Lesson View (' + lesson.id + ')</button>';
      gHtml += '<div style="font-weight:900;font-size:1.15rem;color:#1e40af;">🎯 Your Mission: ' + lesson.handsOnChallenge + '</div>';
      if (nextLesson) gHtml += '<button type="button" class="btn-Primary" data-nav="game" data-param="' + nextLesson.id + '">Next Game (' + nextLesson.id + ') ▶</button>';
      gHtml += '</div>';
      gHtml += '<div class="exp-SimPane" id="fullscreen-sim-mount"></div>';
      mainEl.innerHTML = gHtml;
      bindNavButtons(mainEl);
      window.ExperimindSimulators.mount(document.getElementById('fullscreen-sim-mount'), lesson);
      return;
    }

    var html = '<div style="margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">';
    html += '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">';
    html += '<button type="button" class="btn-Secondary" data-nav="grade" data-param="' + lesson.gradeId + '">← ' + lesson.gradeId + ' Games</button>';
    if (prevLesson) html += '<button type="button" class="btn-Secondary" data-nav="lesson" data-param="' + prevLesson.id + '">◀ Prev Game</button>';
    if (nextLesson) html += '<button type="button" class="btn-Primary" data-nav="lesson" data-param="' + nextLesson.id + '">Next Game (' + nextLesson.title + ') ▶</button>';
    html += '</div>';
    html += '<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">';
    html += '<button type="button" class="btn-Primary" data-nav="game" data-param="' + lesson.id + '">⛶ Make Game Giant Fullscreen!</button>';
    html += '</div></div>';

    // SIMULATOR-FIRST LAYOUT: Left 7 cols = Interactive Game Arena; Right 5 cols = Mission, Story & Quiz
    html += '<div class="exp-LessonSplit">';
    html += '<div class="exp-SimPane">';
    html += '<div class="exp-ChallengeBox" style="margin-top:0;margin-bottom:18px;">';
    html += '<div style="font-weight:900;font-size:1.1rem;color:#854d0e;margin-bottom:4px;">🎯 YOUR HANDS-ON MISSION:</div>';
    html += '<p style="font-size:1.05rem;font-weight:700;color:#713f12;">' + lesson.handsOnChallenge + '</p>';
    html += '</div>';
    html += '<div id="lesson-sim-mount"></div>';
    html += '</div>';

    // Right Column: Kid-Friendly Story Steps, Sparky's Brain Boost & 3-Question Quiz
    html += '<div class="exp-TheoryPane">';
    html += '<span class="sim-EngineBadge">' + lesson.gradeId + ' • Game #' + lesson.lessonNumber + '</span>';
    html += '<h2 style="font-size:1.75rem;font-weight:900;margin:6px 0 4px;">' + lesson.icon + ' ' + lesson.title + '</h2>';
    html += '<div style="font-weight:800;color:#4f46e5;margin-bottom:12px;">' + lesson.subtitle + '</div>';
    html += '<p style="color:#1e293b;font-size:1.05rem;margin-bottom:16px;">' + lesson.overview + '</p>';

    html += '<h4 style="font-size:1rem;font-weight:900;text-transform:uppercase;color:#1e40af;">🚀 How It Works (3 Easy Steps):</h4>';
    html += '<div class="exp-ConceptList">';
    (lesson.concepts || []).forEach(function(c, idx) {
      html += '<div class="exp-ConceptItem"><strong>' + (idx + 1) + '.</strong> ' + c + '</div>';
    });
    html += '</div>';

    html += '<div style="margin:18px 0;">';
    html += '<button type="button" class="btn-Secondary" id="reveal-insight-btn" style="width:100%;text-align:left;display:flex;justify-content:space-between;align-items:center;">';
    html += '<span>🤖 Click for Sparky\'s Secret Brain Boost! 💡</span><span>▼</span></button>';
    html += '<div id="insight-drawer" class="exp-InsightBox" style="display:none;">';
    html += '<strong>🤖 Sparky\'s Fun Fact:</strong><br>' + lesson.discussionGuide;
    html += '</div></div>';

    html += '<div style="margin-top:22px;padding-top:18px;border-top:3px dashed #cbd5e1;">';
    html += '<h3 style="font-size:1.3rem;font-weight:900;margin-bottom:14px;">🧠 Quick 3-Question Brain Check!</h3>';
    html += '<div id="lesson-quiz-mount"></div>';
    html += '</div></div></div>';

    mainEl.innerHTML = html;
    bindNavButtons(mainEl);

    var revBtn = document.getElementById('reveal-insight-btn');
    var drawer = document.getElementById('insight-drawer');
    if (revBtn && drawer) {
      revBtn.addEventListener('click', function() {
        drawer.style.display = (drawer.style.display === 'none') ? 'block' : 'none';
        if (window.ExperimindAudio) window.ExperimindAudio.pop();
      });
    }

    window.ExperimindSimulators.mount(document.getElementById('lesson-sim-mount'), lesson);
    renderQuiz(document.getElementById('lesson-quiz-mount'), lesson);
  }

  function renderQuiz(quizEl, lesson) {
    if (!quizEl) return;
    if (!state.quizAnswers[lesson.id]) state.quizAnswers[lesson.id] = {};
    var ansMap = state.quizAnswers[lesson.id];
    var questions = lesson.quiz || [];

    var correctCount = 0;
    var html = '';
    questions.forEach(function(q, qIdx) {
      var chosen = ansMap[qIdx];
      var isCorrect = (chosen === q.correctIndex);
      if (isCorrect) correctCount++;

      html += '<div style="background:#f8fafc;border:2px solid #cbd5e1;border-radius:14px;padding:16px;margin-bottom:14px;">';
      html += '<div style="font-weight:800;font-size:1.05rem;margin-bottom:10px;">Q' + (qIdx + 1) + '. ' + q.question + '</div>';
      html += '<div style="display:flex;flex-direction:column;gap:8px;">';
      (q.options || []).forEach(function(opt, oIdx) {
        var btnStyle = 'padding:12px 16px;border-radius:12px;border:2px solid #cbd5e1;border-bottom:4px solid #94a3b8;background:#ffffff;text-align:left;cursor:pointer;font-weight:700;font-size:1rem;';
        if (chosen === oIdx) {
          if (oIdx === q.correctIndex) {
            btnStyle = 'padding:12px 16px;border-radius:12px;border:2px solid #10b981;border-bottom:4px solid #059669;background:#dcfce7;color:#065f46;text-align:left;cursor:pointer;font-weight:900;font-size:1rem;';
          } else {
            btnStyle = 'padding:12px 16px;border-radius:12px;border:2px solid #f59e0b;border-bottom:4px solid #d97706;background:#fef3c7;color:#92400e;text-align:left;cursor:pointer;font-weight:800;font-size:1rem;';
          }
        }
        html += '<button type="button" style="' + btnStyle + '" data-q-idx="' + qIdx + '" data-o-idx="' + oIdx + '">' + opt + '</button>';
      });
      html += '</div>';
      if (chosen !== undefined) {
        html += '<div style="margin-top:10px;font-size:0.98rem;font-weight:700;color:' + (isCorrect ? '#065f46' : '#92400e') + ';">' +
          (isCorrect ? '🎉 <strong>Awesome!</strong> ' + q.explanation : '🤔 <strong>Almost!</strong> Try clicking another answer choice above!') + '</div>';
      }
      html += '</div>';
    });

    if (correctCount === questions.length && questions.length > 0) {
      html += '<div class="sim-Banner sim-Banner--success">🎉 <strong>All 3 Questions Mastered!</strong> Great job understanding ' + lesson.title + '!</div>';
    }

    quizEl.innerHTML = html;

    quizEl.querySelectorAll('[data-q-idx]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var qi = parseInt(btn.getAttribute('data-q-idx'), 10);
        var oi = parseInt(btn.getAttribute('data-o-idx'), 10);
        state.quizAnswers[lesson.id][qi] = oi;
        if (oi === questions[qi].correctIndex) {
          if (window.ExperimindAudio) window.ExperimindAudio.pop();
          var allRight = questions.every(function(qq, idx) { return state.quizAnswers[lesson.id][idx] === qq.correctIndex; });
          if (allRight) {
            if (window.ExperimindAudio) window.ExperimindAudio.fanfare();
            if (window.ExperimindConfetti) window.ExperimindConfetti.burst();
          }
        } else {
          if (window.ExperimindAudio) window.ExperimindAudio.retry();
        }
        renderQuiz(quizEl, lesson);
      });
    });
  }

  function renderExternalPlatforms(mainEl) {
    var platforms = window.EXPERIMIND_EXTERNAL_PLATFORMS || [];
    var html = '<div class="vision-HeaderCard">';
    html += '<div><span class="sim-EngineBadge">PILLAR 2 • FREE AI-RELATED SOFTWARE (SCRATCH & SUITABLE TOOLS)</span>';
    html += '<h2 style="font-size:2rem;font-weight:900;margin:6px 0;">💻 Free AI-Related Software (Scratch & Suitable Tools)</h2>';
    html += '<p style="color:#e2e8f0;">Step-by-step student guides for Scratch 3.0 Desktop, GCompris, Google Teachable Machine, Blockly Games, and Code.org Hour of AI!</p></div></div>';

    platforms.forEach(function(p) {
      html += '<div class="exp-ExtCard" style="border-left: 8px solid ' + p.accentColor + ';">';
      html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:14px;margin-bottom:16px;">';
      html += '<div><span class="sim-EngineBadge">' + p.grades + ' • ' + p.badge + '</span>';
      html += '<h3 style="font-size:1.5rem;font-weight:900;margin-top:4px;">' + p.icon + ' ' + p.name + '</h3></div>';
      var offlineRoute = {
        'ext-scratch': { nav: 'lesson', param: 'C3-04', label: '⚡ Play Built-In Offline Block Studio ➔', file: 'Scratch 3 Desktop Setup (.exe)' },
        'ext-gcompris': { nav: 'lesson', param: 'LKG-02', label: '⚡ Play Built-In Offline Logic Sorter ➔', file: 'GCompris Educational Suite Setup (.exe)' },
        'ext-teachable': { nav: 'vision', param: 'Class 8', label: '⚡ Open Built-In Offline AI Vision Trainer ➔', file: 'Teachable_Machine_Offline/Launch_Teachable_Machine_Offline.bat' },
        'ext-blockly': { nav: 'lesson', param: 'C3-03', label: '⚡ Play Built-In Offline Robo-Maze ➔', file: 'Blockly_Games/Launch_Blockly_Games.bat' },
        'ext-codeorg': { nav: 'lesson', param: 'C5-06', label: '⚡ Play Built-In Offline Ocean ML Lab ➔', file: 'CodeOrg_AI_For_Oceans/Launch_CodeOrg_AI_For_Oceans.bat' }
      }[p.id];

      html += '<div style="display:flex;gap:10px;flex-wrap:wrap;">';
      if (offlineRoute) {
        html += '<button type="button" class="btn-Primary" style="background:#10b981;border-color:#059669;border-bottom-color:#047857;" data-nav="' + offlineRoute.nav + '" data-param="' + offlineRoute.param + '">' + offlineRoute.label + '</button>';
      }
      html += '<a href="' + p.webLaunchUrl + '" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer" class="btn-Secondary" style="text-decoration:none;">🌐 Launch ' + p.name + ' Online ↗</a>';
      html += '</div></div>';

      html += '<div class="exp-ConceptItem" style="margin-bottom:16px;"><strong>🎯 What You Will Build:</strong> ' + p.learningObjective + '</div>';

      html += '<div style="background:#f8fafc;padding:18px;border-radius:14px;border:2px solid #cbd5e1;margin-bottom:14px;">';
      html += '<strong style="font-size:1.05rem;">🖱️ Easy Step-by-Step Guide:</strong><ol style="padding-left:22px;margin-top:8px;font-size:1.02rem;">';
      (p.gameplaySteps || []).forEach(function(st) { html += '<li style="margin-bottom:6px;">' + st + '</li>'; });
      html += '</ol></div>';

      html += '<div style="background:#eff6ff;border:2px solid #93c5fd;padding:14px 16px;border-radius:12px;font-size:1rem;margin-bottom:12px;line-height:1.6;">';
      html += '<strong>💻 How to Open Offline on School Lab PCs:</strong><br>';
      html += '• <strong>1. Instant Built-In Simulator:</strong> Click the green button above to play 100% offline inside Experimind.<br>';
      if (offlineRoute && offlineRoute.file) {
        html += '• <strong>2. Standalone Offline Tool on USB:</strong> Run <code>Offline_AI_Software_Installers/' + offlineRoute.file + '</code> directly on your PC!';
      }
      html += '</div>';

      html += '<div class="exp-OfflineBox"><strong>🎮 Fun Unplugged Game With Friends:</strong> ' + p.offlineClassroomAlternative + '</div>';
      html += '</div>';
    });

    mainEl.innerHTML = html;
  }

  // =========================================================================
  // REDESIGNED PILLAR 3: AI TUTORIAL VIDEOS & DIGITAL LEARNING RESOURCES
  // Master-Detail Cinema Academy Layout (Like Khan Academy, BrainPOP & Code.org)
  // =========================================================================
  function renderVideoHub(mainEl) {
    if (window.ExperimindVideoPlayer) window.ExperimindVideoPlayer.stopAll();
    var allVideos = window.EXPERIMIND_VIDEOS || [];
    var curBand = state.videoBandFilter || 'all';

    var filtered = allVideos.filter(function(v) {
      if (curBand === 'all') return true;
      return v.gradeBand === curBand;
    });

    var activeVid = filtered.find(function(v) { return v.id === state.selectedVideoId; }) || filtered[0] || allVideos[0];
    if (activeVid) state.selectedVideoId = activeVid.id;

    var html = '<div class="vision-HeaderCard" style="background:linear-gradient(135deg,#1e3a8a,#3b82f6,#6d28d9);">';
    html += '<div><span class="sim-EngineBadge">PILLAR 3 • INTERACTIVE VIDEO THEATER & DIGITAL STUDY ACADEMY</span>';
    html += '<h2 style="font-size:2rem;font-weight:900;margin:6px 0;">🎥 AI Tutorial Videos & Digital Learning Resources</h2>';
    html += '<p style="color:#e2e8f0;">Pick any topic from the playlist on the left to watch the widescreen animated lesson, explore digital study cards, flip interactive flashcards, and take the Brain Quiz!</p></div></div>';

    html += '<div class="exp-VideoAcademySplit">';

    // LEFT COLUMN: Course Playlist Sidebar
    html += '<aside class="exp-PlaylistSidebar">';
    html += '<div style="font-weight:900;font-size:1.1rem;margin-bottom:10px;color:#0f172a;">📚 Course Playlist (' + filtered.length + ' Modules)</div>';
    html += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;">';
    [
      ['all', 'All (12)'],
      ['primary', 'LKG–Class 3'],
      ['prep', 'Classes 4–5'],
      ['middle', 'Classes 6–8']
    ].forEach(function(tb) {
      var act = (curBand === tb[0]) ? ' sim-TabBtn--active' : '';
      html += '<button type="button" class="sim-TabBtn' + act + '" style="padding:6px 10px;font-size:0.82rem;" data-video-filter="' + tb[0] + '">' + tb[1] + '</button>';
    });
    html += '</div>';

    filtered.forEach(function(v, idx) {
      var isSel = activeVid && v.id === activeVid.id;
      var quizDone = state.checkpointAnswers[v.id] !== undefined && v.checkpoint && state.checkpointAnswers[v.id] === v.checkpoint.correct;
      html += '<button type="button" class="exp-PlaylistItem' + (isSel ? ' exp-PlaylistItem--active' : '') + '" data-select-vid="' + v.id + '">';
      html += '<div style="font-size:1.75rem;">' + v.icon + '</div>';
      html += '<div style="flex:1;min-width:0;">';
      html += '<div style="font-size:0.76rem;font-weight:800;color:#2563eb;">' + v.grades + ' • ' + v.duration + (quizDone ? ' • ✅ Done' : '') + '</div>';
      html += '<div style="font-size:0.95rem;font-weight:800;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + v.title.replace(/^Tutorial \d+:\s*/, '') + '</div>';
      html += '</div></button>';
    });
    html += '</aside>';

    // RIGHT COLUMN: Main Cinema Theater + 4 Interactive Digital Learning Resource Tabs
    html += '<section class="exp-AcademyStage">';
    if (activeVid) {
      html += '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:14px;">';
      html += '<div><span class="exp-LessonNumBadge">' + activeVid.grades + ' • ' + activeVid.duration + ' • ' + activeVid.source + '</span>';
      html += '<h3 style="font-size:1.65rem;font-weight:900;margin-top:6px;color:#0f172a;">' + activeVid.icon + ' ' + activeVid.title + '</h3></div>';
      html += '<div style="display:flex;gap:8px;flex-wrap:wrap;">';
      html += '<button type="button" class="sim-TabBtn' + (state.videoPlayerMode === 'animated' ? ' sim-TabBtn--active' : '') + '" id="vmode-animated">🎬 Offline Animated Movie</button>';
      html += '<button type="button" class="sim-TabBtn' + (state.videoPlayerMode === 'youtube' ? ' sim-TabBtn--active' : '') + '" id="vmode-youtube">▶️ YouTube Embed</button>';
      html += '<a href="' + activeVid.youtubeUrl + '" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer" class="btn-Secondary" style="text-decoration:none;padding:8px 14px;font-size:0.9rem;">🌐 Open YouTube ↗</a>';
      html += '</div></div>';

      // Widescreen Player Stage
      if (state.videoPlayerMode === 'youtube') {
        html += '<div style="position:relative;padding-bottom:52%;height:0;overflow:hidden;border-radius:16px;background:#0f172a;margin-bottom:18px;border:3px solid #334155;">';
        html += '<iframe src="https://www.youtube-nocookie.com/embed/' + activeVid.youtubeId + '?rel=0&modestbranding=1" title="' + activeVid.title.replace(/"/g, '') + '" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
        html += '</div>';
      } else {
        html += '<div id="academy-vplayer-mount" style="margin-bottom:18px;"></div>';
      }

      // 4 Interactive Digital Resource Tabs (BrainPOP / Khan Academy Style)
      html += '<div class="sim-TabRow" style="border-bottom:2px solid #e2e8f0;padding-bottom:12px;margin-bottom:18px;">';
      [
        ['guide', '📘 1. Digital Study Guide & Notes'],
        ['flashcards', '🃏 2. Interactive Flip Flashcards'],
        ['quiz', '🧠 3. Interactive Brain Quiz'],
        ['worksheet', '🎮 4. Hands-On Game & Printable Sheet']
      ].forEach(function(st) {
        var act = (state.videoSubTab === st[0]) ? ' sim-TabBtn--active' : '';
        html += '<button type="button" class="sim-TabBtn' + act + '" data-vsubtab="' + st[0] + '">' + st[1] + '</button>';
      });
      html += '<button type="button" class="btn-Primary" style="margin-left:auto;" data-nav="lesson" data-param="' + activeVid.mappedLessonId + '">🎮 Play Matching Simulator (' + activeVid.mappedLessonId + ') ➔</button>';
      html += '</div>';

      // TAB 1: DIGITAL STUDY GUIDE & VISUAL NOTES
      if (state.videoSubTab === 'guide') {
        html += '<div style="display:grid;grid-template-columns:1.2fr 1fr;gap:18px;">';
        html += '<div style="background:#f8fafc;border:2px solid #cbd5e1;border-radius:16px;padding:18px;">';
        html += '<h4 style="font-size:1.15rem;font-weight:900;color:#1e3a8a;margin-bottom:12px;">📌 Key Learning Takeaways</h4>';
        (activeVid.keyConcepts || []).forEach(function(kc, kIdx) {
          html += '<div class="exp-ConceptItem" style="margin-bottom:10px;"><strong>' + (kIdx + 1) + '.</strong> ' + kc + '</div>';
        });
        html += '</div>';

        html += '<div style="background:#fffbeb;border:2px solid #fde047;border-radius:16px;padding:18px;">';
        html += '<h4 style="font-size:1.15rem;font-weight:900;color:#854d0e;margin-bottom:12px;">📝 Student Notebook Cheat-Sheet</h4>';
        if (activeVid.learningResource && activeVid.learningResource.notebookNotes) {
          activeVid.learningResource.notebookNotes.forEach(function(nt) {
            html += '<div style="padding:10px 12px;background:#ffffff;border-radius:10px;border:1px solid #fde68a;margin-bottom:8px;font-weight:700;font-size:0.96rem;">✨ ' + nt + '</div>';
          });
        }
        html += '<div style="margin-top:12px;padding:12px;background:#fef3c7;border-radius:10px;font-size:0.94rem;"><strong>🔬 Lab Challenge Link:</strong> ' + (activeVid.learningResource ? activeVid.learningResource.labExperiment : 'Try the interactive simulator!') + '</div>';
        html += '</div></div>';
      }

      // TAB 2: INTERACTIVE FLIP FLASHCARDS
      else if (state.videoSubTab === 'flashcards') {
        html += '<div><h4 style="font-size:1.15rem;font-weight:900;color:#1e3a8a;">🃏 Click Any Flashcard Below to Flip Between Question & Answer!</h4>';
        html += '<div class="exp-FlashcardGrid">';
        (activeVid.keyConcepts || []).forEach(function(kc, cIdx) {
          var cardKey = activeVid.id + '_' + cIdx;
          var isFlipped = !!state.flippedCards[cardKey];
          var parts = kc.split(':');
          var term = parts.length > 1 ? parts[0] : 'Concept Card #' + (cIdx + 1);
          var def = parts.length > 1 ? parts.slice(1).join(':').trim() : kc;
          html += '<div class="exp-Flashcard' + (isFlipped ? ' exp-Flashcard--flipped' : '') + '" data-flip-card="' + cardKey + '">';
          html += '<div style="font-size:0.82rem;font-weight:900;text-transform:uppercase;color:' + (isFlipped ? '#065f46' : '#1e40af') + ';">' + (isFlipped ? '✅ Answer / Definition (Click to Flip)' : '❓ Key Term #' + (cIdx + 1) + ' (Click to Reveal)') + '</div>';
          html += '<div style="font-size:1.15rem;font-weight:900;color:#0f172a;margin:12px 0;">' + (isFlipped ? def : term) + '</div>';
          html += '<div style="font-size:0.84rem;font-weight:700;color:#475569;">🔄 Tap card to flip</div>';
          html += '</div>';
        });
        html += '</div></div>';
      }

      // TAB 3: INTERACTIVE BRAIN CHECKPOINT QUIZ
      else if (state.videoSubTab === 'quiz') {
        var ans = state.checkpointAnswers[activeVid.id];
        var isAnswered = ans !== undefined && ans !== null;
        var isCorrect = isAnswered && activeVid.checkpoint && ans === activeVid.checkpoint.correct;
        html += '<div style="background:#f8fafc;border:2px solid #cbd5e1;border-radius:18px;padding:22px;">';
        html += '<h4 style="font-size:1.25rem;font-weight:900;color:#1e3a8a;margin-bottom:10px;">🧠 Interactive Video Comprehension Check</h4>';
        if (activeVid.checkpoint) {
          html += '<div style="font-size:1.12rem;font-weight:800;margin-bottom:14px;">' + activeVid.checkpoint.q + '</div>';
          html += '<div style="display:flex;flex-direction:column;gap:10px;">';
          activeVid.checkpoint.options.forEach(function(opt, oIdx) {
            var style = 'padding:14px 18px;border-radius:12px;border:2px solid #cbd5e1;background:#fff;text-align:left;font-weight:800;font-size:1.02rem;cursor:pointer;';
            if (isAnswered) {
              if (oIdx === activeVid.checkpoint.correct) style = 'padding:14px 18px;border-radius:12px;border:2px solid #10b981;background:#dcfce7;color:#065f46;text-align:left;font-weight:900;font-size:1.02rem;cursor:pointer;';
              else if (oIdx === ans) style = 'padding:14px 18px;border-radius:12px;border:2px solid #f59e0b;background:#fef3c7;color:#92400e;text-align:left;font-weight:800;font-size:1.02rem;cursor:pointer;';
            }
            html += '<button type="button" style="' + style + '" data-chk-vid="' + activeVid.id + '" data-chk-opt="' + oIdx + '">' + opt + '</button>';
          });
          html += '</div>';
          if (isAnswered) {
            html += '<div class="sim-Banner ' + (isCorrect ? 'sim-Banner--success' : 'sim-Banner--warn') + '" style="margin-top:14px;">' +
              (isCorrect ? activeVid.checkpoint.feedback : '🤔 Almost! Read the Digital Study Guide tab or try another option above!') + '</div>';
          }
        }
        html += '</div>';
      }

      // TAB 4: HANDS-ON UNPLUGGED GAME & PRINTABLE STUDY WORKSHEET
      else {
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;">';
        html += '<div class="exp-OfflineBox" style="margin:0;">';
        html += '<h4 style="font-size:1.15rem;font-weight:900;color:#065f46;margin-bottom:8px;">🎮 Unplugged Classroom Game With Friends</h4>';
        html += '<p style="font-size:1.02rem;line-height:1.6;">' + activeVid.offlineAlternative + '</p></div>';

        html += '<div style="background:#f8fafc;border:2px solid #cbd5e1;border-radius:16px;padding:18px;">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">';
        html += '<h4 style="font-size:1.15rem;font-weight:900;color:#1e3a8a;">📄 Printable Digital Worksheet</h4>';
        html += '<button type="button" class="btn-Secondary" onclick="window.print()">🖨️ Print Sheet</button></div>';
        html += '<p style="font-size:0.98rem;margin-bottom:12px;"><strong>Hands-On Simulator Task:</strong> ' + (activeVid.learningResource ? activeVid.learningResource.labExperiment : 'Complete the matching simulator.') + '</p>';
        html += '<button type="button" class="btn-Primary" style="width:100%;" data-nav="lesson" data-param="' + activeVid.mappedLessonId + '">🚀 Launch Matching Simulator (' + activeVid.mappedLessonId + ')</button>';
        html += '</div></div>';
      }
    }
    html += '</section></div>';

    mainEl.innerHTML = html;
    bindNavButtons(mainEl);

    if (activeVid && state.videoPlayerMode === 'animated') {
      var mountEl = document.getElementById('academy-vplayer-mount');
      if (mountEl && window.ExperimindVideoPlayer) {
        window.ExperimindVideoPlayer.mountPlayer(mountEl, activeVid);
      }
    }

    mainEl.querySelectorAll('[data-video-filter]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        state.videoBandFilter = btn.getAttribute('data-video-filter');
        if (window.ExperimindAudio) window.ExperimindAudio.click();
        renderVideoHub(mainEl);
      });
    });

    mainEl.querySelectorAll('[data-select-vid]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        state.selectedVideoId = btn.getAttribute('data-select-vid');
        if (window.ExperimindAudio) window.ExperimindAudio.pop();
        renderVideoHub(mainEl);
      });
    });

    var modeAnimBtn = document.getElementById('vmode-animated');
    var modeYtBtn = document.getElementById('vmode-youtube');
    if (modeAnimBtn) {
      modeAnimBtn.addEventListener('click', function() {
        state.videoPlayerMode = 'animated';
        renderVideoHub(mainEl);
      });
    }
    if (modeYtBtn) {
      modeYtBtn.addEventListener('click', function() {
        state.videoPlayerMode = 'youtube';
        renderVideoHub(mainEl);
      });
    }

    mainEl.querySelectorAll('[data-vsubtab]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        state.videoSubTab = btn.getAttribute('data-vsubtab');
        if (window.ExperimindAudio) window.ExperimindAudio.click();
        renderVideoHub(mainEl);
      });
    });

    mainEl.querySelectorAll('[data-flip-card]').forEach(function(card) {
      card.addEventListener('click', function() {
        var k = card.getAttribute('data-flip-card');
        state.flippedCards[k] = !state.flippedCards[k];
        if (window.ExperimindAudio) window.ExperimindAudio.pop();
        renderVideoHub(mainEl);
      });
    });

    mainEl.querySelectorAll('[data-chk-vid]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var vid = btn.getAttribute('data-chk-vid');
        var opt = parseInt(btn.getAttribute('data-chk-opt'), 10);
        state.checkpointAnswers[vid] = opt;
        var vObj = allVideos.find(function(item) { return item.id === vid; });
        if (vObj && vObj.checkpoint && opt === vObj.checkpoint.correct) {
          if (window.ExperimindAudio) window.ExperimindAudio.fanfare();
          if (window.ExperimindConfetti) window.ExperimindConfetti.burst();
        } else if (window.ExperimindAudio) {
          window.ExperimindAudio.retry();
        }
        renderVideoHub(mainEl);
      });
    });
  }

  function renderBooksHub(mainEl) {
    var books = window.EXPERIMIND_REFERENCE_BOOKS || [];
    var selId = state.selectedBookId || (books[0] ? books[0].id : '');
    var currentBook = books.find(function(b) { return b.id === selId; }) || books[0];

    var html = '<div class="vision-HeaderCard" style="background:linear-gradient(135deg,#1e3a8a,#2563eb,#059669);">';
    html += '<div><span class="sim-EngineBadge">PILLAR 4 • 100% OFFLINE DIGITAL AI TEXTBOOK & PROJECT LIBRARY</span>';
    html += '<h2 style="font-size:2rem;font-weight:900;margin:6px 0;">📖 CBSE Artificial Intelligence Reference Book</h2>';
    html += '<p style="color:#e2e8f0;">Read complete official CBSE AI Student Handbooks (Classes 6, 7, 8), Curriculum Frameworks, and Student Capstone Project Guides right here 100% offline!</p></div></div>';

    html += '<div class="sim-TabRow" style="margin-bottom:18px;overflow-x:auto;padding-bottom:6px;">';
    books.forEach(function(b) {
      var act = (b.id === currentBook.id) ? ' sim-TabBtn--active' : '';
      html += '<button type="button" class="sim-TabBtn' + act + '" data-select-book="' + b.id + '">' + b.icon + ' ' + b.grade + '</button>';
    });
    html += '</div>';

    if (currentBook) {
      html += '<div class="exp-VidCard" style="margin-bottom:20px;border-left:8px solid ' + currentBook.color + ';">';
      html += '<div class="exp-LessonMetaRow"><span class="exp-LessonNumBadge" style="background:' + currentBook.color + ';color:#fff;">' + currentBook.code + '</span><span style="font-weight:900;color:' + currentBook.color + ';">' + currentBook.grade + '</span></div>';
      html += '<h2 style="font-size:1.8rem;font-weight:900;margin:10px 0;">' + currentBook.icon + ' ' + currentBook.title + '</h2>';
      html += '<p style="font-size:1.05rem;color:#475569;margin-bottom:14px;">' + currentBook.description + '</p>';
      html += '<div style="display:flex;gap:12px;flex-wrap:wrap;">';
      html += '<button type="button" class="btn-Primary" style="background:' + currentBook.color + ';border-color:' + currentBook.color + ';" onclick="window.print()">🖨️ Print / Save Study Guide</button>';
      html += '<a href="' + currentBook.officialPdfUrl + '" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer" class="btn-Secondary" style="text-decoration:none;display:inline-flex;align-items:center;gap:6px;">🌐 Official CBSE PDF (cbseacademic.nic.in) ↗</a>';
      html += '</div></div>';

      html += '<h3 style="font-size:1.4rem;font-weight:900;margin:24px 0 16px 0;color:#0f172a;">📚 Complete Offline Chapters & Interactive Lab Links (' + currentBook.units.length + ' Units):</h3>';
      html += '<div style="display:flex;flex-direction:column;gap:18px;">';
      currentBook.units.forEach(function(u) {
        html += '<div class="exp-VidCard" style="border-top:4px solid ' + currentBook.color + ';">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px;">';
        html += '<span class="exp-LessonNumBadge" style="background:' + currentBook.color + ';color:#fff;">' + u.unitNumber + '</span>';
        html += '<span style="font-size:0.88rem;font-weight:800;color:' + currentBook.color + ';">CBSE Official Student Competency</span>';
        html += '</div>';

        html += '<h3 style="font-size:1.35rem;font-weight:900;margin-bottom:10px;color:#1e3a8a;">' + u.title + '</h3>';
        html += '<p style="font-size:1rem;color:#334155;margin-bottom:12px;line-height:1.6;">' + u.summary + '</p>';

        html += '<div style="background:#f1f5f9;border-left:4px solid ' + currentBook.color + ';border-radius:8px;padding:12px 14px;margin-bottom:14px;">';
        html += '<div style="font-weight:800;font-size:0.88rem;color:#475569;margin-bottom:4px;">🎯 What You Will Master:</div>';
        html += '<div style="font-size:0.95rem;color:#0f172a;font-weight:700;">' + u.competencies + '</div>';
        html += '</div>';

        if (u.keyConcepts && u.keyConcepts.length > 0) {
          html += '<div style="background:linear-gradient(135deg,#0f172a,#1e3a8a);border-radius:14px;padding:16px;margin-bottom:14px;color:#fff;">';
          html += '<div style="font-size:0.8rem;font-weight:900;color:#facc15;letter-spacing:0.05em;text-transform:uppercase;margin-bottom:10px;">🗺️ Visual Concept Blueprint & Architecture Flow</div>';
          html += '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">';
          u.keyConcepts.forEach(function(kc, kIdx) {
            html += '<div style="flex:1;min-width:150px;background:rgba(255,255,255,0.12);border:1.5px solid rgba(255,255,255,0.28);border-radius:10px;padding:10px 12px;font-weight:800;font-size:0.9rem;">';
            html += '<span style="color:#38bdf8;margin-right:4px;">0' + (kIdx + 1) + '.</span> ' + kc + '</div>';
            if (kIdx < u.keyConcepts.length - 1) {
              html += '<span style="font-size:1.3rem;color:#facc15;font-weight:900;">➔</span>';
            }
          });
          html += '</div></div>';
        }

        if (u.chapterContent && u.chapterContent.length > 0) {
          html += '<div class="exp-BookChapterBox">';
          html += '<div style="font-weight:900;font-size:1.05rem;color:#1e3a8a;margin-bottom:10px;display:flex;align-items:center;gap:6px;">📖 Complete Textbook Chapter Reading:</div>';
          u.chapterContent.forEach(function(para) {
            html += '<p style="margin-bottom:8px;">' + para + '</p>';
          });
          html += '</div>';
        }

        if (u.reviewQuestions && u.reviewQuestions.length > 0) {
          html += '<div style="margin:14px 0;background:#f8fafc;padding:12px 14px;border-radius:10px;border:1.5px solid #e2e8f0;">';
          html += '<div style="font-weight:900;font-size:0.92rem;color:#1e3a8a;margin-bottom:8px;">💡 Self-Check Chapter Review Questions (Click to reveal answers):</div>';
          u.reviewQuestions.forEach(function(rq, qIdx) {
            html += '<details class="exp-ReviewQBox" style="margin-bottom:6px;cursor:pointer;">';
            html += '<summary style="font-weight:800;">Q' + (qIdx + 1) + ': ' + rq.q + '</summary>';
            html += '<p style="padding:8px;background:#ecfdf5;border-radius:6px;margin-top:4px;"><strong>Ans:</strong> ' + rq.a + '</p>';
            html += '</details>';
          });
          html += '</div>';
        }

        if (u.matchingLessonId) {
          html += '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-top:14px;padding-top:12px;border-top:1px dashed #cbd5e1;">';
          html += '<button type="button" class="btn-Primary" style="font-size:0.98rem;" data-nav="lesson" data-param="' + u.matchingLessonId + '">🎮 Play Matching AI Game Simulator (' + u.matchingLessonId + ')</button>';
          html += '</div>';
        }
        html += '</div>';
      });
      html += '</div>';
    }

    mainEl.innerHTML = html;
    bindNavButtons(mainEl);

    mainEl.querySelectorAll('[data-select-book]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        state.selectedBookId = btn.getAttribute('data-select-book');
        if (window.ExperimindAudio) window.ExperimindAudio.click();
        renderBooksHub(mainEl);
      });
    });
  }

  function bindNavButtons(root) {
    root.querySelectorAll('[data-nav]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var r = btn.getAttribute('data-nav');
        var p = btn.getAttribute('data-param');
        if (window.ExperimindAudio) window.ExperimindAudio.click();
        navigate(r, p);
      });
    });
  }

  function renderApp() {
    updateHeaderBadges();
    document.querySelectorAll('[data-top-route]').forEach(function(b) {
      var r = b.getAttribute('data-top-route');
      var active = (state.route === r) || (r === 'home' && (state.route === 'grade' || state.route === 'lesson' || state.route === 'game'));
      b.className = 'exp-NavBtn' + (active ? ' exp-NavBtn--active' : '');
    });

    var mainEl = document.getElementById('exp-main-view');
    if (!mainEl) return;

    if (state.route === 'grade') renderGradeView(mainEl);
    else if (state.route === 'lesson') renderLessonView(mainEl, false);
    else if (state.route === 'game') renderLessonView(mainEl, true);
    else if (state.route === 'simulators') renderAllSimulators(mainEl);
    else if (state.route === 'vision') window.ExperimindVisionLab.mount(mainEl, state.param || 'Class 6');
    else if (state.route === 'external') renderExternalPlatforms(mainEl);
    else if (state.route === 'videos') renderVideoHub(mainEl);
    else if (state.route === 'books') renderBooksHub(mainEl);
    else renderHome(mainEl);
  }

  function init() {
    var brand = window.EXPERIMIND_BRAND || {};
    var logoImg = document.getElementById('brand-logo-img');
    if (logoImg && brand.logoDataUri) {
      logoImg.onerror = function() {
        logoImg.onerror = null;
        logoImg.src = brand.logoDataUri;
      };
    }

    document.querySelectorAll('[data-top-route]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var r = btn.getAttribute('data-top-route');
        if (window.ExperimindAudio) window.ExperimindAudio.click();
        navigate(r, r === 'vision' ? 'Class 6' : '');
      });
    });

    var homeLogoBtn = document.getElementById('brand-home-btn');
    if (homeLogoBtn) {
      homeLogoBtn.addEventListener('click', function() {
        navigate('home', '');
      });
    }

    var soundBtn = document.getElementById('header-sound-btn');
    if (soundBtn) {
      soundBtn.addEventListener('click', function() {
        if (window.ExperimindAudio) window.ExperimindAudio.toggle();
        updateHeaderBadges();
      });
    }

    initZoom();
    renderApp();
  }

  var ZOOM_LEVELS = [0.75, 0.80, 0.88, 0.95, 1.00, 1.10];
  var currentZoomIndex = 2; // Default: 0.88 (88%)

  function applyZoom(zoom) {
    document.body.style.zoom = zoom;
    var label = document.getElementById('zoom-level-label');
    if (label) {
      label.textContent = '🔍 ' + Math.round(zoom * 100) + '%';
    }
    try {
      localStorage.setItem('experimind_zoom', zoom.toString());
    } catch(e) {}
  }

  function initZoom() {
    var saved = null;
    try {
      saved = parseFloat(localStorage.getItem('experimind_zoom'));
    } catch(e) {}
    if (!isNaN(saved) && saved >= 0.70 && saved <= 1.25) {
      for (var i = 0; i < ZOOM_LEVELS.length; i++) {
        if (Math.abs(ZOOM_LEVELS[i] - saved) < 0.03) {
          currentZoomIndex = i;
          break;
        }
      }
      applyZoom(ZOOM_LEVELS[currentZoomIndex]);
    } else {
      applyZoom(ZOOM_LEVELS[currentZoomIndex]);
    }

    var btnOut = document.getElementById('zoom-out-btn');
    var btnIn = document.getElementById('zoom-in-btn');
    var btnReset = document.getElementById('zoom-level-label');

    if (btnOut) {
      btnOut.addEventListener('click', function() {
        if (currentZoomIndex > 0) {
          currentZoomIndex--;
          applyZoom(ZOOM_LEVELS[currentZoomIndex]);
          if (window.ExperimindAudio) window.ExperimindAudio.click();
        }
      });
    }

    if (btnIn) {
      btnIn.addEventListener('click', function() {
        if (currentZoomIndex < ZOOM_LEVELS.length - 1) {
          currentZoomIndex++;
          applyZoom(ZOOM_LEVELS[currentZoomIndex]);
          if (window.ExperimindAudio) window.ExperimindAudio.click();
        }
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', function() {
        currentZoomIndex = 2; // Default 88%
        applyZoom(ZOOM_LEVELS[currentZoomIndex]);
        if (window.ExperimindAudio) window.ExperimindAudio.click();
      });
    }

    window.addEventListener('keydown', function(e) {
      if (e.ctrlKey && (e.key === '-' || e.key === '_')) {
        e.preventDefault();
        if (currentZoomIndex > 0) {
          currentZoomIndex--;
          applyZoom(ZOOM_LEVELS[currentZoomIndex]);
        }
      } else if (e.ctrlKey && (e.key === '+' || e.key === '=')) {
        e.preventDefault();
        if (currentZoomIndex < ZOOM_LEVELS.length - 1) {
          currentZoomIndex++;
          applyZoom(ZOOM_LEVELS[currentZoomIndex]);
        }
      } else if (e.ctrlKey && e.key === '0') {
        e.preventDefault();
        currentZoomIndex = 2;
        applyZoom(ZOOM_LEVELS[currentZoomIndex]);
      }
    });
  }

  return {
    init: init,
    navigate: navigate
  };
})();

window.addEventListener('DOMContentLoaded', function() {
  window.ExperimindApp.init();
});
