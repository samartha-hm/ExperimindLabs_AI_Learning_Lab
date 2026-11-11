// Experimind AI Learning Lab — Muted-by-Default Web Audio Engine & Kid-Friendly Speech
window.ExperimindAudio = (function() {
  var enabled = false;
  var ctx = null;

  function ensureCtx() {
    if (!ctx) {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) ctx = new AudioCtx();
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  function playTone(freq, duration, type, gainVal, delaySec) {
    if (!enabled) return;
    try {
      ensureCtx();
      if (!ctx) return;
      var now = ctx.currentTime + (delaySec || 0);
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(gainVal || 0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {}
  }

  function speak(text) {
    if (!enabled) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        if (!text || typeof text !== 'string') return;
        var clean = text.replace(/<[^>]*>/g, '').replace(/[🤖🎯🌟🏆💡🎉🤔✅✨🚀]/g, '').trim();
        if (!clean) return;
        var utter = new SpeechSynthesisUtterance(clean);
        utter.rate = 0.95;
        utter.pitch = 1.1;
        window.speechSynthesis.speak(utter);
      } catch (e) {}
    }
  }

  function stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
  }

  return {
    isEnabled: function() { return enabled; },
    toggle: function() {
      enabled = !enabled;
      if (enabled) {
        playTone(523.25, 0.12, 'sine', 0.08, 0);
        playTone(659.25, 0.16, 'sine', 0.08, 0.1);
      } else {
        stopSpeech();
      }
      return enabled;
    },
    click: function() {
      playTone(600, 0.05, 'triangle', 0.05, 0);
    },
    pop: function() {
      playTone(480, 0.05, 'sine', 0.07, 0);
      playTone(760, 0.09, 'sine', 0.07, 0.04);
    },
    bubblePop: function() {
      playTone(650, 0.04, 'sine', 0.09, 0);
      playTone(980, 0.08, 'triangle', 0.08, 0.03);
    },
    snap: function() {
      playTone(850, 0.03, 'square', 0.04, 0);
      playTone(420, 0.06, 'triangle', 0.06, 0.02);
    },
    robotStep: function() {
      playTone(330, 0.04, 'square', 0.03, 0);
      playTone(440, 0.05, 'sine', 0.05, 0.03);
    },
    battery: function() {
      playTone(440, 0.08, 'triangle', 0.07, 0);
      playTone(554.37, 0.09, 'triangle', 0.08, 0.07);
      playTone(659.25, 0.12, 'sine', 0.09, 0.14);
    },
    success: function() {
      playTone(523.25, 0.12, 'triangle', 0.09, 0);
      playTone(659.25, 0.12, 'triangle', 0.09, 0.10);
      playTone(783.99, 0.22, 'triangle', 0.10, 0.20);
    },
    fanfare: function() {
      playTone(523.25, 0.10, 'triangle', 0.09, 0);
      playTone(659.25, 0.10, 'triangle', 0.09, 0.09);
      playTone(783.99, 0.12, 'triangle', 0.10, 0.18);
      playTone(1046.50, 0.35, 'triangle', 0.12, 0.30);
    },
    retry: function() {
      playTone(320, 0.14, 'sine', 0.06, 0);
      playTone(260, 0.18, 'sine', 0.06, 0.11);
    },
    speak: speak,
    stopSpeech: stopSpeech
  };
})();
