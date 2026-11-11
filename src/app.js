// Experimind AI Learning Lab v4.1 — Kid-Centric Main Controller, Confetti & Router
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
    route: 'home',       // 'home' | 'grade' | 'lesson' | 'game' | 'vision' | 'external' | 'videos' | 'simulators'
    param: '',
    bandFilter: 'all',
    searchQuery: '',
    earnedStars: {},     // lessonId -> { explore: true, sim: bool, quiz: bool }
    quizAnswers: {},     // lessonId -> { qIdx: selectedIdx }
    openVideoIds: {}     // videoId -> bool
  };

  function getCurriculum() {
    return window.EXPERIMIND_CURRICULUM || { grades: [], lessons: [] };
  }

  function findLesson(lessonId) {
    var lessons = getCurriculum().lessons || [];
    return lessons.find(function(l) { return l.id === lessonId; }) || lessons[0];
  }

  function countTotalStars() {
    var total = 0;
    Object.keys(state.earnedStars).forEach(function(lid) {
      var st = state.earnedStars[lid];
      if (st.explore) total++;
      if (st.sim) total++;
      if (st.quiz) total++;
    });
    return total;
  }

  function getLessonStars(lid) {
    return state.earnedStars[lid] || { explore: false, sim: false, quiz: false };
  }

  function awardStar(lessonId, starType) {
    if (!state.earnedStars[lessonId]) {
      state.earnedStars[lessonId] = { explore: false, sim: false, quiz: false };
    }
    if (!state.earnedStars[lessonId][starType]) {
      state.earnedStars[lessonId][starType] = true;
      updateHeaderBadges();
      if (starType === 'sim' || starType === 'quiz') {
        if (window.ExperimindConfetti) window.ExperimindConfetti.burst();
        if (window.ExperimindAudio) window.ExperimindAudio.fanfare();
      }
    }
  }

  function updateHeaderBadges() {
    var starEl = document.getElementById('header-star-badge');
    if (starEl) {
      starEl.textContent = '⭐ ' + countTotalStars() + ' Stars Won!';
    }
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
    html += '<span class="exp-HeroBadge">🤖 WELCOME YOUNG SCIENTISTS & CODERS!</span>';
    html += '<h1>Experimind AI Learning Lab</h1>';
    html += '<p>Pick your class below to play 80 interactive robot, coding, and AI games, train your own smart camera, and watch animated AI movies!</p>';
    html += '<div class="exp-HeroActionRow">';
    html += '<button type="button" class="btn-Primary" data-nav="lesson" data-param="LKG-01" style="background:#facc15;color:#0f172a;border-color:#eab308;border-bottom-color:#ca8a04;">🫧 Play Bubble Garden (LKG–UKG)</button>';
    html += '<button type="button" class="btn-Primary" data-nav="lesson" data-param="C1-04">🤖 Play RoboGrid Maze (Classes 1–5)</button>';
    html += '<button type="button" class="btn-Primary" data-nav="lesson" data-param="C7-07" style="background:#10b981;border-color:#059669;border-bottom-color:#047857;">🧠 Play Brain Neuron Lab (Classes 6–8)</button>';
    html += '</div></div>';

    html += '<div class="exp-HeroKpiGrid">';
    html += '<div class="exp-HeroKpiCard"><strong>10 Classes</strong><span>LKG, UKG & Classes 1–8</span></div>';
    html += '<div class="exp-HeroKpiCard"><strong>80 Games</strong><span>Hands-On AI Simulators</span></div>';
    html += '<div class="exp-HeroKpiCard"><strong>12 Movies</strong><span>Animated Video Explainers</span></div>';
    html += '<div class="exp-HeroKpiCard"><strong>AI Camera</strong><span>Wave Hands & Pop Bubbles!</span></div>';
    html += '</div></section>';

    // Kid-Friendly Band Filter + Search
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
    html += '<input type="search" class="exp-SearchInput" id="home-search-input" placeholder="🔍 Find a game (e.g. Robot, Bubble, Maze, Brain)..." value="' + state.searchQuery.replace(/"/g, '&quot;') + '">';
    html += '</div>';

    if (state.searchQuery.trim().length > 0) {
      var q = state.searchQuery.trim().toLowerCase();
      var matches = lessons.filter(function(l) {
        return l.title.toLowerCase().indexOf(q) !== -1 ||
               l.subtitle.toLowerCase().indexOf(q) !== -1 ||
               l.gradeName.toLowerCase().indexOf(q) !== -1 ||
               l.id.toLowerCase().indexOf(q) !== -1;
      });
      html += '<h2 style="margin-bottom:18px;">🎮 Found ' + matches.length + ' Games Matching "' + state.searchQuery + '"</h2>';
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
        var gLessons = lessons.filter(function(l) { return l.gradeId === g.id; });
        var gStars = 0;
        gLessons.forEach(function(l) {
          var st = getLessonStars(l.id);
          if (st.explore) gStars++;
          if (st.sim) gStars++;
          if (st.quiz) gStars++;
        });
        html += '<div class="exp-GradeCard" style="border-top: 8px solid ' + g.accent + ';">';
        html += '<div><div class="exp-GradeHeader"><span class="exp-GradeIcon">' + g.icon + '</span><span class="exp-GradeAge">' + g.ageRange + '</span></div>';
        html += '<h3>' + g.name + '</h3>';
        html += '<div class="exp-GradeFramework">✨ 8 Interactive Games & AI Labs</div>';
        html += '<p class="exp-GradeSummary">' + g.summary + '</p></div>';
        html += '<div class="exp-GradeFooter">';
        html += '<span style="font-size:1rem;font-weight:900;color:#b45309;">⭐ ' + gStars + ' / 24 Stars</span>';
        html += '<div style="display:flex;gap:8px;">';
        html += '<button type="button" class="btn-Secondary" data-nav="vision" data-param="' + g.id + '" title="Open AI Camera Lab">📷 Camera</button>';
        html += '<button type="button" class="btn-Primary" data-nav="grade" data-param="' + g.id + '">🎮 Play 8 Games ➔</button>';
        html += '</div></div></div>';
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
    var st = getLessonStars(l.id);
    var starIcons = (st.explore ? '⭐' : '☆') + (st.sim ? '⭐' : '☆') + (st.quiz ? '⭐' : '☆');
    var html = '<div class="exp-LessonCard">';
    html += '<div><div class="exp-LessonMetaRow">';
    html += '<span class="exp-LessonNumBadge">' + l.gradeId + ' • Game #' + l.lessonNumber + '</span>';
    html += '<span class="exp-LessonStarRow" title="3 Stars to Win!">' + starIcons + '</span></div>';
    html += '<h3 style="font-size:1.32rem;font-weight:900;margin-bottom:6px;">' + l.icon + ' ' + l.title + '</h3>';
    html += '<div style="font-size:0.95rem;font-weight:800;color:#4f46e5;margin-bottom:10px;">' + l.subtitle + '</div>';
    html += '<p style="font-size:0.98rem;color:#334155;margin-bottom:18px;">' + l.overview + '</p></div>';
    html += '<div style="display:flex;justify-content:space-between;gap:10px;padding-top:14px;border-top:2px dashed #e2e8f0;">';
    html += '<button type="button" class="btn-Primary" data-nav="lesson" data-param="' + l.id + '" style="flex:1;">🎮 Play Lab Game</button>';
    html += '<button type="button" class="btn-Secondary" data-nav="game" data-param="' + l.id + '">⛶ Giant Screen</button>';
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
    html += '<button type="button" class="btn-Primary" data-nav="vision" data-param="' + g.id + '">📷 Open ' + g.shortName + ' Magic AI Camera</button>';
    html += '<button type="button" class="btn-Secondary" data-nav="videos" data-param="">🎬 Watch Animated AI Movies</button>';
    html += '</div></div>';

    html += '<div class="vision-HeaderCard" style="border-left: 8px solid ' + g.accent + ';">';
    html += '<div><span class="sim-EngineBadge">' + g.band + ' • ' + g.ageRange + '</span>';
    html += '<h2 style="font-size:2.1rem;font-weight:900;margin:8px 0;">' + g.icon + ' ' + g.name + ' — Pick a Game to Play!</h2>';
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
    var lessons = getCurriculum().lessons || [];
    var html = '<div style="margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">';
    html += '<div><h2 style="font-size:2rem;font-weight:900;">🎮 All 80 Interactive AI & Coding Games (LKG to Class 8)</h2><p style="color:#475569;font-size:1.05rem;">Click any game card below to start playing immediately!</p></div>';
    html += '<button type="button" class="btn-Secondary" data-nav="home" data-param="">← Back to Classes</button></div>';

    html += '<div class="exp-LessonGrid">';
    lessons.forEach(function(l) {
      html += renderLessonCardHtml(l);
    });
    html += '</div>';
    mainEl.innerHTML = html;
    bindNavButtons(mainEl);
  }

  function renderLessonView(mainEl, isFullscreenGame) {
    var curr = getCurriculum();
    var lessons = curr.lessons || [];
    var lesson = findLesson(state.param);
    var lIdx = lessons.indexOf(lesson);
    var prevLesson = lIdx > 0 ? lessons[lIdx - 1] : null;
    var nextLesson = lIdx + 1 < lessons.length ? lessons[lIdx + 1] : null;

    awardStar(lesson.id, 'explore');

    if (isFullscreenGame) {
      var gHtml = '<div style="margin-bottom:18px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">';
      gHtml += '<button type="button" class="btn-Secondary" data-nav="lesson" data-param="' + lesson.id + '">← Back to Lesson & Quiz (' + lesson.id + ')</button>';
      gHtml += '<div style="font-weight:900;font-size:1.15rem;color:#1e40af;">🎯 Your Mission: ' + lesson.handsOnChallenge + '</div>';
      if (nextLesson) gHtml += '<button type="button" class="btn-Primary" data-nav="game" data-param="' + nextLesson.id + '">Next Game (' + nextLesson.id + ') ▶</button>';
      gHtml += '</div>';
      gHtml += '<div class="exp-SimPane" id="fullscreen-sim-mount"></div>';
      mainEl.innerHTML = gHtml;
      bindNavButtons(mainEl);
      window.ExperimindSimulators.mount(document.getElementById('fullscreen-sim-mount'), lesson);
      return;
    }

    var st = getLessonStars(lesson.id);
    var html = '<div style="margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">';
    html += '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">';
    html += '<button type="button" class="btn-Secondary" data-nav="grade" data-param="' + lesson.gradeId + '">← ' + lesson.gradeId + ' Games</button>';
    if (prevLesson) html += '<button type="button" class="btn-Secondary" data-nav="lesson" data-param="' + prevLesson.id + '">◀ Prev Game</button>';
    if (nextLesson) html += '<button type="button" class="btn-Primary" data-nav="lesson" data-param="' + nextLesson.id + '">Next Game (' + nextLesson.title + ') ▶</button>';
    html += '</div>';
    html += '<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">';
    html += '<span class="exp-StarBadge">Your Stars: ' + (st.explore ? '⭐' : '☆') + (st.sim ? '⭐' : '☆') + (st.quiz ? '⭐' : '☆') + '</span>';
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

    // Kid-Friendly Secret Brain Boost
    html += '<div style="margin:18px 0;">';
    html += '<button type="button" class="btn-Secondary" id="reveal-insight-btn" style="width:100%;text-align:left;display:flex;justify-content:space-between;align-items:center;">';
    html += '<span>🤖 Click for Sparky\'s Secret Brain Boost! 💡</span><span>▼</span></button>';
    html += '<div id="insight-drawer" class="exp-InsightBox" style="display:none;">';
    html += '<strong>🤖 Sparky\'s Fun Fact:</strong><br>' + lesson.discussionGuide;
    html += '</div></div>';

    // Interactive 3-Question Fun Quiz
    html += '<div style="margin-top:22px;padding-top:18px;border-top:3px dashed #cbd5e1;">';
    html += '<h3 style="font-size:1.3rem;font-weight:900;margin-bottom:14px;">🏆 Win Your 3rd Star! (Quick 3-Question Quiz)</h3>';
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
      awardStar(lesson.id, 'quiz');
      html += '<div class="sim-Banner sim-Banner--success">🏆 <strong>You Got All 3 Right!</strong> You won the Quiz Star for ' + lesson.title + '!</div>';
    }

    quizEl.innerHTML = html;

    quizEl.querySelectorAll('[data-q-idx]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var qi = parseInt(btn.getAttribute('data-q-idx'), 10);
        var oi = parseInt(btn.getAttribute('data-o-idx'), 10);
        state.quizAnswers[lesson.id][qi] = oi;
        if (oi === questions[qi].correctIndex) {
          if (window.ExperimindAudio) window.ExperimindAudio.pop();
        } else {
          if (window.ExperimindAudio) window.ExperimindAudio.retry();
        }
        renderQuiz(quizEl, lesson);
      });
    });
  }

  function renderExternalPlatforms(mainEl) {
    var platforms = window.EXPERIMIND_EXTERNAL_PLATFORMS || [];
    var html = '<div style="margin-bottom:24px;">';
    html += '<span class="sim-EngineBadge">🚀 MORE AWESOME CODING & AI PLAYGROUNDS</span>';
    html += '<h2 style="font-size:2rem;font-weight:900;margin:6px 0;">Explore Scratch, GCompris, Teachable Machine & Blockly!</h2>';
    html += '<p style="color:#475569;font-size:1.08rem;">Follow the easy 1-2-3 steps below to build your own games on your computer or in your browser!</p>';
    html += '</div>';

    platforms.forEach(function(p) {
      html += '<div class="exp-ExtCard" style="border-left: 8px solid ' + p.accentColor + ';">';
      html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:14px;margin-bottom:16px;">';
      html += '<div><span class="sim-EngineBadge">' + p.grades + ' • ' + p.badge + '</span>';
      html += '<h3 style="font-size:1.5rem;font-weight:900;margin-top:4px;">' + p.icon + ' ' + p.name + '</h3></div>';
      html += '<div style="display:flex;gap:10px;flex-wrap:wrap;">';
      html += '<a href="' + p.webLaunchUrl + '" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer" class="btn-Primary" style="text-decoration:none;">🌐 Open ' + p.name + ' in New Tab ↗</a>';
      html += '</div></div>';

      html += '<div class="exp-ConceptItem" style="margin-bottom:16px;"><strong>🎯 What You Will Build:</strong> ' + p.learningObjective + '</div>';

      html += '<div style="background:#f8fafc;padding:18px;border-radius:14px;border:2px solid #cbd5e1;margin-bottom:14px;">';
      html += '<strong style="font-size:1.05rem;">🖱️ Easy Step-by-Step Guide:</strong><ol style="padding-left:22px;margin-top:8px;font-size:1.02rem;">';
      (p.gameplaySteps || []).forEach(function(st) { html += '<li style="margin-bottom:6px;">' + st + '</li>'; });
      html += '</ol></div>';

      html += '<div style="background:#eff6ff;border:2px solid #93c5fd;padding:14px 16px;border-radius:12px;font-size:1rem;margin-bottom:12px;">';
      html += '<strong>💻 How to Open Offline on Your School Computer:</strong> <code>' + p.windowsStartMenuPath + '</code></div>';

      html += '<div class="exp-OfflineBox"><strong>🎮 Fun Unplugged Game With Friends:</strong> ' + p.offlineClassroomAlternative + '</div>';
      html += '</div>';
    });

    mainEl.innerHTML = html;
  }

  function renderVideoHub(mainEl) {
    if (window.ExperimindVideoPlayer) window.ExperimindVideoPlayer.stopAll();
    var videos = window.EXPERIMIND_VIDEOS || [];
    var html = '<div style="margin-bottom:24px;">';
    html += '<span class="sim-EngineBadge">🎬 ANIMATED AI & CODING MOVIE THEATRE</span>';
    html += '<h2 style="font-size:2rem;font-weight:900;margin:6px 0;">Watch Animated AI & Coding Movies!</h2>';
    html += '<p style="color:#475569;font-size:1.08rem;">Click <strong>▶️ Play Animated Movie</strong> on any card below to watch our built-in 4-part animated explainer right here (100% offline-ready, with optional voice narration when Sound is ON!).</p>';
    html += '</div>';

    html += '<div class="exp-LessonGrid">';
    videos.forEach(function(v) {
      var isOpen = !!state.openVideoIds[v.id];
      html += '<div class="exp-VidCard">';
      html += '<div class="exp-LessonMetaRow"><span class="exp-LessonNumBadge">' + v.grades + ' • ' + v.duration + '</span><span style="font-size:0.9rem;font-weight:800;color:#4f46e5;">' + v.source + '</span></div>';
      html += '<h3 style="font-size:1.35rem;font-weight:900;margin-bottom:10px;">' + v.icon + ' ' + v.title + '</h3>';

      if (isOpen) {
        html += '<div id="vplayer-mount-' + v.id + '"></div>';
      } else {
        html += '<div style="background:linear-gradient(135deg,#1e3a8a,#2563eb,#4f46e5);color:#fff;border-radius:16px;padding:32px 20px;text-align:center;margin-bottom:14px;border-bottom:6px solid #172554;">';
        html += '<div style="font-size:3.2rem;margin-bottom:8px;">' + v.icon + ' 🎬</div>';
        html += '<div style="font-weight:800;font-size:1.1rem;margin-bottom:14px;">4-Part Interactive Animated Movie (' + v.duration + ')</div>';
        html += '<button type="button" class="btn-Primary" style="background:#facc15;color:#0f172a;border-color:#eab308;border-bottom-color:#ca8a04;font-size:1.08rem;" data-toggle-vid="' + v.id + '">▶️ Play Animated Movie Right Here!</button>';
        html += '</div>';
      }

      html += '<div style="font-size:0.98rem;margin-bottom:12px;"><strong>🌟 Cool Things You\'ll Learn:</strong><ul style="padding-left:20px;margin-top:6px;">';
      (v.keyConcepts || []).forEach(function(kc) { html += '<li style="margin-bottom:4px;">' + kc + '</li>'; });
      html += '</ul></div>';

      html += '<div class="exp-OfflineBox"><strong>🎮 Try This Game With Friends:</strong> ' + v.offlineAlternative + '</div>';

      html += '<div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:14px;padding-top:12px;border-top:2px dashed #e2e8f0;">';
      html += '<button type="button" class="btn-Primary" data-nav="lesson" data-param="' + v.mappedLessonId + '">🎮 Play Matching Game (' + v.mappedLessonId + ')</button>';
      if (isOpen) {
        html += '<button type="button" class="btn-Secondary" data-toggle-vid="' + v.id + '">⏹️ Close Movie</button>';
      }
      html += '<a href="' + v.youtubeUrl + '" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer" class="btn-Secondary" style="text-decoration:none;">🌐 Watch on YouTube ↗</a>';
      html += '</div></div>';
    });
    html += '</div>';

    mainEl.innerHTML = html;
    bindNavButtons(mainEl);

    videos.forEach(function(v) {
      if (state.openVideoIds[v.id]) {
        var mountEl = document.getElementById('vplayer-mount-' + v.id);
        if (mountEl && window.ExperimindVideoPlayer) {
          window.ExperimindVideoPlayer.mountPlayer(mountEl, v);
        }
      }
    });

    mainEl.querySelectorAll('[data-toggle-vid]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var vid = btn.getAttribute('data-toggle-vid');
        state.openVideoIds[vid] = !state.openVideoIds[vid];
        renderVideoHub(mainEl);
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

    renderApp();
  }

  return {
    init: init,
    navigate: navigate,
    awardStar: awardStar
  };
})();

window.addEventListener('DOMContentLoaded', function() {
  window.ExperimindApp.init();
});
