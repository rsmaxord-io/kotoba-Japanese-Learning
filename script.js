/* ============================================================
   Kotoba — interactions
   Vanilla JS. Everything works without it except the kana
   chart, quiz and filters, which are labelled in the UI.
   ============================================================ */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  /* ---------------- helpers ---------------- */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  var toastEl = null;
  var toastTimer = null;
  function toast(message) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 3200);
  }

  /* ---------------- audio ----------------
     Bundled Japanese voice clips are used first. Browser speech is
     only a fallback for a missing clip, so the site never depends on
     whichever robot voice a device happens to have installed. */

  var speechSupported = 'speechSynthesis' in window;
  var warnedNoVoice = false;
  var audioMap = window.KOTOBA_AUDIO || {};
  var currentAudio = null;

  function japaneseVoice() {
    if (!speechSupported) return null;
    var voices = window.speechSynthesis.getVoices();
    for (var i = 0; i < voices.length; i++) {
      if (/^ja/i.test(voices[i].lang)) return voices[i];
    }
    return null;
  }

  function clearButton(button) {
    if (button) button.classList.remove('is-speaking');
  }

  function listeningStatus(message) {
    document.querySelectorAll('.audio-now-playing').forEach(function(el){el.textContent=message;});
  }

  function stopAudio() {
    if (speechSupported) window.speechSynthesis.cancel();
    listeningStatus('Ready to listen');
    if (currentAudio) {
      try {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      } catch (e) { /* no-op */ }
      currentAudio = null;
    }
    var previous = $('.speak.is-speaking');
    if (previous) previous.classList.remove('is-speaking');
  }

  /* Only used when a bundled clip is missing.  Keep the fallback at a
     natural pace and neutral pitch; the old lowered pitch is what made
     browser speech sound accented. */
  var VOICE_SHAPE = {
    'std-f': { rate: 0.97, pitch: 1.0 },
    'std-m': { rate: 0.97, pitch: 1.0 },
    'kansai-m': { rate: 0.96, pitch: 1.0 },
    'kansai-f': { rate: 0.97, pitch: 1.0 }
  };

  function voiceShape(voice) {
    if (VOICE_SHAPE[voice]) return VOICE_SHAPE[voice];
    if (voice && voice.indexOf('dialect-') === 0) return { rate: 0.97, pitch: 1.0 };
    return VOICE_SHAPE['std-f'];
  }

  function fallbackSpeak(text, button, voice) {
    voice = voice || 'std-f';
    if (!speechSupported) {
      toast('Audio is unavailable. Try Chrome, Edge or Safari, or check your connection.');
      return;
    }
    if (!japaneseVoice() && !warnedNoVoice) {
      warnedNoVoice = true;
      toast('No Japanese voice found. Add one in your system settings for audio.');
    }

    window.speechSynthesis.cancel();
    var shape = voiceShape(voice);
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = shape.rate * ((window.KOTOBA_LISTENING || {}).rate || 1);
    utterance.pitch = shape.pitch;
    utterance.onstart = function () { listeningStatus('System voice fallback · synthesized Japanese'); };
    utterance.onend = function () { listeningStatus('Ready to listen'); };
    var systemVoice = japaneseVoice();
    if (systemVoice) utterance.voice = systemVoice;

    if (button) {
      button.classList.add('is-speaking');
      var clear = function () { button.classList.remove('is-speaking'); listeningStatus('Ready to listen'); };
      utterance.onend = clear;
      utterance.onerror = clear;
      setTimeout(function () {
        if (!window.speechSynthesis.speaking) clear();
      }, 4000);
    }

    window.speechSynthesis.speak(utterance);
  }

  function playBundled(text, button, voice) {
    var src = audioMap[voice + '|' + text] || audioMap[text];
    if (!src) return false;

    stopAudio();
    var audio = window.KotobaAudio.create(src);
    audio.preload = 'auto';
    audio.playbackRate = (window.KOTOBA_LISTENING || {}).rate || 1;
    audio.preservesPitch = true;
    audio.webkitPreservesPitch = true;
    currentAudio = audio;
    if (button) button.classList.add('is-speaking');

    audio.addEventListener('playing', function () { listeningStatus(/^(kansai-|dialect-)/.test(voice) ? 'Playing a synthetic dialect reading · intonation unverified' : 'Playing standard Japanese · synthesized'); });
    var finish = function () {
      listeningStatus('Ready to listen');
      if (currentAudio === audio) currentAudio = null;
      clearButton(button);
    };
    var failedOnce = false;
    function failOnce() { if (failedOnce || (currentAudio && currentAudio !== audio)) return; failedOnce = true; finish(); listeningStatus('Audio could not load. Tap again to retry, or read the text.'); }
    audio.addEventListener('ended', finish);
    audio.addEventListener('error', function () {
      failOnce();
    });

    var playback = audio.play();
    if (playback && typeof playback.catch === 'function') {
      playback.catch(function () {
        failOnce();
      });
    }
    return true;
  }

  function speak(text, button, voice) {
    if (!text) return;
    voice = voice || 'std-f';
    if (/^(kansai-|dialect-)/.test(voice) && !(window.KOTOBA_LISTENING || {}).dialects) {
      (window.kotobaNotice || toast)('This is a synthetic reading, not native regional intonation. Enable synthetic dialect readings in the Listening studio to hear it.');
      return;
    }
    if (playBundled(text, button, voice)) return;
    fallbackSpeak(text, button, voice);
  }

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-speak]');
    if (!trigger) return;
    event.preventDefault();
    speak(
      trigger.getAttribute('data-speak'),
      trigger.classList.contains('speak') ? trigger : null,
      trigger.getAttribute('data-voice') || 'std-f'
    );
  });

  if (speechSupported) {
    window.speechSynthesis.getVoices();
    if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = function () { window.speechSynthesis.getVoices(); };
    }
  }

  document.addEventListener('kotoba:audio-settings', function () {
    stopAudio();
    if (speechSupported) window.speechSynthesis.cancel();
  });
  document.addEventListener('kotoba:lesson', function () {
    stopAudio();
    if (speechSupported) window.speechSynthesis.cancel();
  });

  /* ---------------- header ---------------- */

  var navToggle = $('.nav-toggle');
  var nav = $('#site-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      document.body.classList.toggle('nav-open', !open);
    });
    $$('a', nav).forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      });
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && document.body.classList.contains('nav-open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
        navToggle.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) {
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      }
    });
  }

  /* ---------------- reveal on scroll ---------------- */

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealTargets = $$('[data-reveal]');
  if (revealTargets.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealTargets.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
      revealTargets.forEach(function (el) { revealObserver.observe(el); });
    }
  }

  /* ---------------- footer year ---------------- */

  $$('.js-year').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ============================================================
     KANA CHART + QUIZ
     ============================================================ */

  var CHARTS = {
    hiragana: {
      label: 'Hiragana',
      basic: [
        { label: 'a', cells: [['あ', 'a'], ['い', 'i'], ['う', 'u'], ['え', 'e'], ['お', 'o']] },
        { label: 'ka', cells: [['か', 'ka'], ['き', 'ki'], ['く', 'ku'], ['け', 'ke'], ['こ', 'ko']] },
        { label: 'sa', cells: [['さ', 'sa'], ['し', 'shi'], ['す', 'su'], ['せ', 'se'], ['そ', 'so']] },
        { label: 'ta', cells: [['た', 'ta'], ['ち', 'chi'], ['つ', 'tsu'], ['て', 'te'], ['と', 'to']] },
        { label: 'na', cells: [['な', 'na'], ['に', 'ni'], ['ぬ', 'nu'], ['ね', 'ne'], ['の', 'no']] },
        { label: 'ha', cells: [['は', 'ha'], ['ひ', 'hi'], ['ふ', 'fu'], ['へ', 'he'], ['ほ', 'ho']] },
        { label: 'ma', cells: [['ま', 'ma'], ['み', 'mi'], ['む', 'mu'], ['め', 'me'], ['も', 'mo']] },
        { label: 'ya', cells: [['や', 'ya'], ['', ''], ['ゆ', 'yu'], ['', ''], ['よ', 'yo']] },
        { label: 'ra', cells: [['ら', 'ra'], ['り', 'ri'], ['る', 'ru'], ['れ', 're'], ['ろ', 'ro']] },
        { label: 'wa', cells: [['わ', 'wa'], ['', ''], ['', ''], ['', ''], ['を', 'wo']] },
        { label: 'n', cells: [['ん', 'n'], ['', ''], ['', ''], ['', ''], ['', '']] }
      ],
      voiced: [
        { label: 'ga', cells: [['が', 'ga'], ['ぎ', 'gi'], ['ぐ', 'gu'], ['げ', 'ge'], ['ご', 'go']] },
        { label: 'za', cells: [['ざ', 'za'], ['じ', 'ji'], ['ず', 'zu'], ['ぜ', 'ze'], ['ぞ', 'zo']] },
        { label: 'da', cells: [['だ', 'da'], ['ぢ', 'ji'], ['づ', 'zu'], ['で', 'de'], ['ど', 'do']] },
        { label: 'ba', cells: [['ば', 'ba'], ['び', 'bi'], ['ぶ', 'bu'], ['べ', 'be'], ['ぼ', 'bo']] },
        { label: 'pa', cells: [['ぱ', 'pa'], ['ぴ', 'pi'], ['ぷ', 'pu'], ['ぺ', 'pe'], ['ぽ', 'po']] }
      ]
    },
    katakana: {
      label: 'Katakana',
      basic: [
        { label: 'a', cells: [['ア', 'a'], ['イ', 'i'], ['ウ', 'u'], ['エ', 'e'], ['オ', 'o']] },
        { label: 'ka', cells: [['カ', 'ka'], ['キ', 'ki'], ['ク', 'ku'], ['ケ', 'ke'], ['コ', 'ko']] },
        { label: 'sa', cells: [['サ', 'sa'], ['シ', 'shi'], ['ス', 'su'], ['セ', 'se'], ['ソ', 'so']] },
        { label: 'ta', cells: [['タ', 'ta'], ['チ', 'chi'], ['ツ', 'tsu'], ['テ', 'te'], ['ト', 'to']] },
        { label: 'na', cells: [['ナ', 'na'], ['ニ', 'ni'], ['ヌ', 'nu'], ['ネ', 'ne'], ['ノ', 'no']] },
        { label: 'ha', cells: [['ハ', 'ha'], ['ヒ', 'hi'], ['フ', 'fu'], ['ヘ', 'he'], ['ホ', 'ho']] },
        { label: 'ma', cells: [['マ', 'ma'], ['ミ', 'mi'], ['ム', 'mu'], ['メ', 'me'], ['モ', 'mo']] },
        { label: 'ya', cells: [['ヤ', 'ya'], ['', ''], ['ユ', 'yu'], ['', ''], ['ヨ', 'yo']] },
        { label: 'ra', cells: [['ラ', 'ra'], ['リ', 'ri'], ['ル', 'ru'], ['レ', 're'], ['ロ', 'ro']] },
        { label: 'wa', cells: [['ワ', 'wa'], ['', ''], ['', ''], ['', ''], ['ヲ', 'wo']] },
        { label: 'n', cells: [['ン', 'n'], ['', ''], ['', ''], ['', ''], ['', '']] }
      ],
      voiced: [
        { label: 'ga', cells: [['ガ', 'ga'], ['ギ', 'gi'], ['グ', 'gu'], ['ゲ', 'ge'], ['ゴ', 'go']] },
        { label: 'za', cells: [['ザ', 'za'], ['ジ', 'ji'], ['ズ', 'zu'], ['ゼ', 'ze'], ['ゾ', 'zo']] },
        { label: 'da', cells: [['ダ', 'da'], ['ヂ', 'ji'], ['ヅ', 'zu'], ['デ', 'de'], ['ド', 'do']] },
        { label: 'ba', cells: [['バ', 'ba'], ['ビ', 'bi'], ['ブ', 'bu'], ['ベ', 'be'], ['ボ', 'bo']] },
        { label: 'pa', cells: [['パ', 'pa'], ['ピ', 'pi'], ['プ', 'pu'], ['ペ', 'pe'], ['ポ', 'po']] }
      ]
    }
  };

  var chartRoot = $('#kana-chart');
  if (chartRoot) {
    var chartPanel = $('#chart-view');
    var quizPanel = $('#quiz-view');
    var chartTabs = $$('[data-script]');
    var viewTabs = $$('[data-view]');
    var romajiToggle = $('#romaji-toggle');
    var detail = $('#kana-detail');
    var activeScript = 'hiragana';
    var showRomaji = true;

    function makeRow(row) {
      var rowEl = document.createElement('div');
      rowEl.className = 'kana-row';

      var label = document.createElement('span');
      label.className = 'kana-row__label';
      label.textContent = row.label;
      rowEl.appendChild(label);

      row.cells.forEach(function (cell) {
        if (!cell[0]) {
          var blank = document.createElement('span');
          blank.className = 'kana-cell kana-cell--empty';
          blank.setAttribute('aria-hidden', 'true');
          rowEl.appendChild(blank);
          return;
        }
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'kana-cell';
        button.setAttribute('aria-label', cell[0] + ', ' + cell[1]);
        button.dataset.kana = cell[0];
        button.dataset.romaji = cell[1];

        var kana = document.createElement('span');
        kana.className = 'kana-cell__char';
        kana.lang = 'ja';
        kana.textContent = cell[0];

        var romaji = document.createElement('span');
        romaji.className = 'kana-cell__romaji';
        romaji.textContent = cell[1];

        button.appendChild(kana);
        button.appendChild(romaji);
        rowEl.appendChild(button);
      });

      return rowEl;
    }

    function makeSubhead(title, note) {
      var head = document.createElement('div');
      head.className = 'kana-subhead';
      var strong = document.createElement('strong');
      strong.textContent = title;
      var span = document.createElement('span');
      span.textContent = note;
      head.appendChild(strong);
      head.appendChild(span);
      return head;
    }

    function renderChart() {
      chartRoot.innerHTML = '';
      chartRoot.classList.toggle('romaji-hidden', !showRomaji);

      var data = CHARTS[activeScript];
      chartRoot.appendChild(makeSubhead('Basic 46', 'gojūon'));
      var basicGrid = document.createElement('div');
      basicGrid.className = 'kana-grid';
      data.basic.forEach(function (row) { basicGrid.appendChild(makeRow(row)); });
      chartRoot.appendChild(basicGrid);

      chartRoot.appendChild(makeSubhead('Voiced & semi-voiced', 'dakuten · handakuten'));
      var voicedGrid = document.createElement('div');
      voicedGrid.className = 'kana-grid';
      data.voiced.forEach(function (row) { voicedGrid.appendChild(makeRow(row)); });
      chartRoot.appendChild(voicedGrid);

      resetDetail();
    }

    function resetDetail() {
      if (!detail) return;
      detail.innerHTML = '';
      var hint = document.createElement('p');
      hint.className = 'kana-detail__hint';
      hint.textContent = 'Tap any kana to hear it and see how it is written.';
      detail.appendChild(hint);
    }

    function selectKana(button, rowLabel) {
      $$('.kana-cell.is-selected', chartRoot).forEach(function (el) {
        el.classList.remove('is-selected');
      });
      button.classList.add('is-selected');

      var kana = button.dataset.kana;
      var romaji = button.dataset.romaji;

      detail.innerHTML = '';
      var charEl = document.createElement('span');
      charEl.className = 'kana-detail__char';
      charEl.lang = 'ja';
      charEl.textContent = kana;

      var meta = document.createElement('div');
      meta.className = 'kana-detail__meta';
      var title = document.createElement('p');
      title.className = 'kana-detail__title';
      title.textContent = romaji;
      var sub = document.createElement('p');
      sub.className = 'kana-detail__sub';
      sub.textContent = CHARTS[activeScript].label + ' · ' + rowLabel + '-row';
      meta.appendChild(title);
      meta.appendChild(sub);

      var sound = document.createElement('button');
      sound.type = 'button';
      sound.className = 'speak';
      sound.setAttribute('aria-label', 'Hear ' + kana);
      sound.innerHTML = '<svg class="speak__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>';
      sound.addEventListener('click', function () { speak(kana, sound); });

      detail.appendChild(charEl);
      detail.appendChild(meta);
      detail.appendChild(sound);

      speak(kana);
    }

    chartRoot.addEventListener('click', function (event) {
      var cell = event.target.closest('.kana-cell:not(.kana-cell--empty)');
      if (!cell) return;
      var row = cell.parentElement.querySelector('.kana-row__label');
      selectKana(cell, row ? row.textContent : '');
    });

    chartTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        chartTabs.forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
        tab.setAttribute('aria-selected', 'true');
        activeScript = tab.dataset.script;
        renderChart();
        if (quizPanel && quizPanel.classList.contains('is-active')) {
          startQuiz();
        }
      });
    });

    if (romajiToggle) {
      romajiToggle.addEventListener('click', function () {
        showRomaji = !showRomaji;
        romajiToggle.setAttribute('aria-pressed', String(showRomaji));
        romajiToggle.textContent = showRomaji ? 'Hide romaji' : 'Show romaji';
        chartRoot.classList.toggle('romaji-hidden', !showRomaji);
      });
    }

    /* ---- quiz ---- */

    var QUIZ_LENGTH = 10;
    var quiz = { score: 0, answered: 0, locked: false, timer: null, lastRomaji: '' };
    var quizBody = $('#quiz-body');
    var quizSummary = $('#quiz-summary');
    var quizPrompt = $('#quiz-prompt');
    var quizOptions = $('#quiz-options');
    var quizFeedback = $('#quiz-feedback');
    var quizScore = $('#quiz-score-live');
    var quizProgress = $('#quiz-progress');
    var quizFinal = $('#quiz-final-score');
    var quizMessage = $('#quiz-message');
    var quizRestart = $('#quiz-restart');

    function quizPool() {
      var pool = [];
      CHARTS[activeScript].basic.forEach(function (row) {
        row.cells.forEach(function (cell) {
          if (cell[0]) pool.push({ kana: cell[0], romaji: cell[1] });
        });
      });
      return pool;
    }

    function shuffle(list) {
      for (var i = list.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = list[i];
        list[i] = list[j];
        list[j] = temp;
      }
      return list;
    }

    function startQuiz() {
      clearTimeout(quiz.timer);
      quiz.score = 0;
      quiz.answered = 0;
      quiz.locked = false;
      quiz.lastRomaji = '';
      if (quizSummary) quizSummary.hidden = true;
      if (quizBody) quizBody.hidden = false;
      if (quizFeedback) quizFeedback.textContent = '';
      updateQuizMeta();
      nextQuestion();
    }

    function updateQuizMeta() {
      if (quizScore) quizScore.textContent = String(quiz.score);
      if (quizProgress) quizProgress.textContent = quiz.answered + ' / ' + QUIZ_LENGTH;
    }

    function nextQuestion() {
      var pool = quizPool();
      var item;
      do {
        item = pool[Math.floor(Math.random() * pool.length)];
      } while (pool.length > 1 && item.romaji === quiz.lastRomaji);
      quiz.lastRomaji = item.romaji;

      var allRomaji = [];
      pool.forEach(function (entry) {
        if (allRomaji.indexOf(entry.romaji) === -1) allRomaji.push(entry.romaji);
      });
      var distractors = shuffle(allRomaji.filter(function (r) { return r !== item.romaji; })).slice(0, 3);
      var options = shuffle(distractors.concat([item.romaji]));

      quizPrompt.textContent = item.kana;
      quizOptions.innerHTML = '';
      quizFeedback.textContent = '';

      options.forEach(function (option) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'quiz-option';
        button.textContent = option;
        button.dataset.value = option;
        button.addEventListener('click', function () { answer(item, button); });
        quizOptions.appendChild(button);
      });

      updateQuizMeta();
    }

    function answer(item, chosen) {
      if (quiz.locked) return;
      quiz.locked = true;

      var buttons = $$('.quiz-option', quizOptions);
      buttons.forEach(function (button) {
        button.disabled = true;
        if (button.dataset.value === item.romaji) button.classList.add('is-correct');
      });

      var correct = chosen.dataset.value === item.romaji;
      if (correct) {
        quiz.score += 1;
        quizFeedback.textContent = 'Correct — ' + item.kana + ' is “' + item.romaji + '”.';
      } else {
        chosen.classList.add('is-wrong');
        quizFeedback.textContent = 'Not quite. ' + item.kana + ' is “' + item.romaji + '”.';
      }

      quiz.answered += 1;
      updateQuizMeta();

      quiz.timer = setTimeout(function () {
        quiz.locked = false;
        if (quiz.answered >= QUIZ_LENGTH) {
          endQuiz();
        } else {
          nextQuestion();
        }
      }, correct ? 750 : 1400);
    }

    function endQuiz() {
      if (quizBody) quizBody.hidden = true;
      if (quizSummary) quizSummary.hidden = false;
      if (quizFinal) quizFinal.textContent = String(quiz.score);
      if (quizMessage) {
        var ratio = quiz.score / QUIZ_LENGTH;
        quizMessage.textContent = ratio === 1
          ? 'Perfect round. Try the other script next.'
          : ratio >= 0.7
            ? 'Strong work. A little more repetition and this set is yours.'
            : 'Keep going — five minutes a day is enough to make this stick.';
      }
    }

    if (quizRestart) {
      quizRestart.addEventListener('click', startQuiz);
    }

    viewTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        viewTabs.forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
        tab.setAttribute('aria-selected', 'true');
        var showQuiz = tab.dataset.view === 'quiz';
        if (showQuiz) {
          if (chartPanel) chartPanel.hidden = true;
          if (quizPanel) quizPanel.classList.add('is-active');
          startQuiz();
        } else {
          clearTimeout(quiz.timer);
          if (chartPanel) chartPanel.hidden = false;
          if (quizPanel) quizPanel.classList.remove('is-active');
        }
      });
    });

    var quizReview = $('#quiz-review');
    if (quizReview) {
      quizReview.addEventListener('click', function (event) {
        event.preventDefault();
        var chartTab = viewTabs.filter(function (tab) { return tab.dataset.view === 'chart'; })[0];
        if (chartTab) chartTab.click();
        if (chartPanel) {
          chartPanel.scrollIntoView({
            behavior: reduceMotion ? 'auto' : 'smooth',
            block: 'start'
          });
        }
      });
    }

    renderChart();
  }

  /* ============================================================
     PHRASE FILTER
     ============================================================ */

  var phraseSearch = $('#phrase-search');
  var phrasesGrid = $('#phrases-grid');
  if (phrasesGrid) {
    var phraseCards = $$('.phrase-card', phrasesGrid);
    var chips = $$('[data-filter]');
    var countEl = $('#phrase-count');
    var emptyEl = $('#no-results');
    var activeFilter = 'all';

    function applyPhrases() {
      var query = phraseSearch ? phraseSearch.value.trim().toLowerCase() : '';
      var visible = 0;

      phraseCards.forEach(function (card) {
        var matchesCategory = activeFilter === 'all' || card.dataset.cat === activeFilter;
        var haystack = card.textContent.toLowerCase();
        var matchesQuery = !query || haystack.indexOf(query) !== -1;
        var show = matchesCategory && matchesQuery;
        card.classList.toggle('is-hidden', !show);
        if (show) visible += 1;
      });

      if (countEl) countEl.textContent = String(visible);
      if (emptyEl) emptyEl.classList.toggle('is-visible', visible === 0);
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) {
          c.classList.remove('is-active');
          c.setAttribute('aria-pressed', 'false');
        });
        chip.classList.add('is-active');
        chip.setAttribute('aria-pressed', 'true');
        activeFilter = chip.dataset.filter;
        applyPhrases();
      });
    });

    if (phraseSearch) {
      phraseSearch.addEventListener('input', applyPhrases);
      phraseSearch.addEventListener('search', applyPhrases);
    }

    applyPhrases();
  }

  /* ============================================================
     LESSONS: scrollspy, progress, completion
     ============================================================ */

  var lessonSections = $$('.lesson[id]');
  var lessonLinks = $$('.lesson-nav a');
  if (lessonSections.length && lessonLinks.length) {
    if ('IntersectionObserver' in window) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          lessonLinks.forEach(function (link) {
            link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
          });
        });
      }, { rootMargin: '-20% 0px -65% 0px', threshold: 0 });
      lessonSections.forEach(function (section) { spy.observe(section); });
    }
  }

  var completeButtons = $$('.js-complete');
  if (completeButtons.length) {
    var STORAGE_KEY = 'kotoba-lessons-v1';
    var progressBar = $('#progress-bar');
    var progressText = $('#progress-text');

    function readProgress() {
      try {
        var raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (error) {
        return [];
      }
    }

    function writeProgress(list) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (error) {
        /* storage unavailable — progress lasts for this page view only */
      }
    }

    function syncProgress() {
      var done = readProgress();
      var count = 0;
      completeButtons.forEach(function (button) {
        var isDone = done.indexOf(button.dataset.lesson) !== -1;
        button.setAttribute('aria-pressed', String(isDone));
        button.textContent = isDone ? 'Lesson complete ✓' : 'Mark as complete';
        if (isDone) count += 1;
      });
      if (progressText) progressText.textContent = count + ' of ' + completeButtons.length;
      if (progressBar) progressBar.style.width = Math.round((count / completeButtons.length) * 100) + '%';
    }

    completeButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var done = readProgress();
        var id = button.dataset.lesson;
        var index = done.indexOf(id);
        if (index === -1) {
          done.push(id);
        } else {
          done.splice(index, 1);
        }
        writeProgress(done);
        syncProgress();
      });
    });

    syncProgress();
  }
})();
