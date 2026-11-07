/* ============================================================
   Kotoba — the 100-level lesson reader
   Renders the course from lessons-data/unitNN.js,
   the study-guide layer from guideNN.js, and the output layer
   from lessons-data/output.js.
   ============================================================ */
(function () {
  'use strict';

  var UNITS = [
    { n: 1, title: 'Sounds and first words', jp: '音と はじめての ことば', jlpt: 'Pre-N5', range: '1–10', colour: '#7f9bb5',
      promise: 'Read the kana and say your first real sentences.',
      why: 'Sound comes first. Ten short levels build the mouth and the ear that every later level leans on.' },
    { n: 2, title: 'The N5 core', jp: 'N5の きほん', jlpt: 'N5', range: '11–20', colour: '#7fa77a',
      promise: 'Build the polite sentence machine: です, ます, を, に.',
      why: 'This is the grammar that unlocks the next eighty levels. Slow now means fast later.' },
    { n: 3, title: 'Daily life, N5', jp: 'まいにちの せいかつ', jlpt: 'N5', range: '21–30', colour: '#c9a650',
      promise: 'Handle an ordinary day in Japan: time, money, trains, food.',
      why: 'Survival Japanese is motivating because you can use it this week, not in two years.' },
    { n: 4, title: 'The bridge to N4', jp: 'N4への はし', jlpt: 'N5 → N4', range: '31–40', colour: '#c08a5e',
      promise: 'Join ideas together instead of speaking in single sentences.',
      why: 'The て-form is the hinge between textbook Japanese and the Japanese people actually speak.' },
    { n: 5, title: 'Practical N4', jp: 'つかえる N4', jlpt: 'N4', range: '41–50', colour: '#c4624d',
      promise: 'Tell a story, describe a person, give a short talk.',
      why: 'This is where output starts to sound like you rather than like a drill.' },
    { n: 6, title: 'N3 and your own voice', jp: 'N3と じぶんの ことば', jlpt: 'N3', range: '51–60', colour: '#8d76ad',
      promise: 'Say what happened to you, and what you were made to do.',
      why: 'Passive and causative are the grammar of experience, memory and workplace life.' },
    { n: 7, title: 'Nuance and opinion', jp: 'ニュアンスと いけん', jlpt: 'N3', range: '61–70', colour: '#5f9e9a',
      promise: 'Hear the gap between what is said and what is meant.',
      why: 'Nuance is the point where learners stop translating and start listening.' },
    { n: 8, title: 'N2: the working language', jp: 'N2の にほんご', jlpt: 'N2', range: '71–80', colour: '#b87087',
      promise: 'Work in Japanese: keigo, meetings, email, disagreement.',
      why: 'N2 is the level employers and universities actually ask for. It is a practical door.' },
    { n: 9, title: 'N2: range and speed', jp: 'N2の ひろがり', jlpt: 'N2', range: '81–90', colour: '#8f7d5a',
      promise: 'Argue, hedge, and separate fact from opinion.',
      why: 'This unit trains the reading and speaking that news, reports and interviews demand.' },
    { n: 10, title: 'N1: the long conversation', jp: 'N1の ながい かいわ', jlpt: 'N1', range: '91–100', colour: '#3f5f8a',
      promise: 'Hold a long conversation, and keep it alive when it gets hard.',
      why: 'The last ten levels are about range, repair and confidence, not another vocabulary list.' }
  ];

  var lessons = window.KOTOBA_LESSONS || [];
  if (!lessons.length) return;

  /* The output layer adds writing and speaking to levels that had
     none. It is merged here so the rest of the reader never has to
     care where a task came from. */
  var OUTPUT = {};
  (window.KOTOBA_OUTPUT || []).forEach(function (entry) { OUTPUT[entry.n] = entry; });

  lessons.forEach(function (lesson) {
    var extra = OUTPUT[lesson.n];
    if (!extra) return;
    ['write', 'writeModel', 'speak', 'speakModel'].forEach(function (key) {
      if (extra[key]) lesson[key] = extra[key];
    });
  });

  lessons.sort(function (a, b) { return a.n - b.n; });

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reader = $('#lesson-reader');
  var ladder = $('#level-ladder');
  var pager = $('#lesson-pager');
  var titleEl = $('#lesson-current-title');
  var subEl = $('#lesson-current-sub');
  var progressText = $('#lesson-progress-text');
  var progressBar = $('#lesson-progress-bar');
  var reviewDock = $('#review-dock');
  var search = $('#lesson-search');
  var filters = $$('[data-level-filter]');

  /* ---------------- memory ----------------
     v2 stores a timestamp and a repetition count per level, which is
     what makes spaced review possible. v1 stored a bare array; it is
     migrated on first read so nobody loses progress. */

  var STORAGE = 'kotoba-course-v2';
  var LEGACY = 'kotoba-course-v1';
  var DAY = 86400000;
  var INTERVALS = [1, 3, 7, 21];

  var state = readState();
  var activeFilter = 'all';
  var current = 1;
  var query = '';
  var timer = null;

  function readState() {
    var next = { levels: {} };
    try {
      var raw = window.localStorage.getItem(STORAGE);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.levels) return parsed;
      }
      var old = window.localStorage.getItem(LEGACY);
      if (old) {
        var list = JSON.parse(old);
        if (Array.isArray(list)) {
          list.forEach(function (n) {
            next.levels[n] = { done: Date.now(), reps: 0 };
          });
        }
      }
    } catch (e) { /* private mode, no storage */ }
    return next;
  }

  function saveState() {
    try { window.localStorage.setItem(STORAGE, JSON.stringify(state)); } catch (e) { /* no-op */ }
  }

  function entryFor(n) { return state.levels[n] || null; }
  function isDone(n) { return !!entryFor(n); }
  function doneCount() { return Object.keys(state.levels).length; }

  function dueAt(entry) {
    var gap = INTERVALS[Math.min(entry.reps || 0, INTERVALS.length - 1)];
    return (entry.done || 0) + gap * DAY;
  }

  function isDue(n) {
    var entry = entryFor(n);
    if (!entry) return false;
    if ((entry.reps || 0) >= INTERVALS.length) return false;
    return Date.now() >= dueAt(entry);
  }

  function dueLevels() {
    return lessons.filter(function (lesson) { return isDue(lesson.n); })
      .sort(function (a, b) { return dueAt(entryFor(a.n)) - dueAt(entryFor(b.n)); });
  }

  function esc(value) {
    return String(value === undefined || value === null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function unitFor(n) {
    for (var i = 0; i < UNITS.length; i += 1) {
      if (n <= i * 10 + 10) return UNITS[i];
    }
    return UNITS[UNITS.length - 1];
  }

  function levelClass(lesson) {
    var j = (lesson.jlpt || '').toLowerCase();
    if (j.indexOf('pre') === 0) return 'pre';
    if (j.indexOf('n5') === 0) return 'n5';
    if (j.indexOf('n4') === 0) return 'n4';
    if (j.indexOf('n3') === 0) return 'n3';
    if (j.indexOf('n2') === 0) return 'n2';
    if (j.indexOf('n1') === 0) return 'n1';
    return 'n5';
  }

  function matches(lesson) {
    if (activeFilter === 'due' && !isDue(lesson.n)) return false;
    if (activeFilter !== 'all' && activeFilter !== 'due' && levelClass(lesson) !== activeFilter) return false;
    if (!query) return true;
    var guide = guideFor(lesson.n);
    var guideHay = '';
    if (guide) {
      guideHay = [
        guide.ref,
        (guide.vocab || []).map(function (v) { return v.join(' '); }).join(' '),
        (guide.kanji || []).map(function (k) { return k.join(' '); }).join(' '),
        (guide.dialogue || []).map(function (d) { return d.join(' '); }).join(' '),
        guide.reading ? [guide.reading.jp, guide.reading.ks, guide.reading.en].join(' ') : '',
        (guide.check || []).join(' ')
      ].join(' ');
    }
    var hay = [
      lesson.n, lesson.title, lesson.can, lesson.pattern, lesson.explain,
      lesson.drill, lesson.curious, lesson.write, lesson.speak,
      modelText(lesson.writeModel), modelText(lesson.speakModel),
      (function () { var t = textbookFor(lesson.n); return t ? t.form + ' ' + t.pitfall : ''; })(),
      (lesson.words || []).join(' '),
      (lesson.ex || []).map(function (x) { return [x.jp, x.ks, x.en, x.kanji].join(' '); }).join(' '),
      guideHay
    ].join(' ').toLowerCase();
    return hay.indexOf(query) !== -1;
  }

  function modelText(model) {
    if (!model) return '';
    if (typeof model === 'string') return model;
    return [model.jp, model.en, model.ks].join(' ');
  }

  /* ---------------- ladder ---------------- */

  function renderLadder() {
    var html = '';
    UNITS.forEach(function (unit) {
      var items = lessons.filter(function (lesson) {
        return lesson.n > (unit.n - 1) * 10 && lesson.n <= unit.n * 10;
      });
      var shown = items.filter(matches);
      if (!shown.length) return;
      var done = items.filter(function (lesson) { return isDone(lesson.n); }).length;
      html += '<div class="level-unit" data-unit="' + unit.n + '" style="--unit-colour:' + unit.colour + '">';
      html += '<div class="level-unit__label"><span>' + esc(unit.jlpt) + '</span><b>Unit ' + unit.n + '</b><em>' + esc(unit.range) + '</em>' +
        '<span class="level-unit__count">' + done + '/' + items.length + '</span></div>';
      html += '<div class="level-unit__buttons">';
      items.forEach(function (lesson) {
        var ok = matches(lesson);
        html += '<button class="level-btn' + (lesson.n === current ? ' is-active' : '') + (isDone(lesson.n) ? ' is-done' : '') + (isDue(lesson.n) ? ' is-due' : '') + (ok ? '' : ' is-filtered') +
          '" type="button" data-level="' + lesson.n + '" aria-label="Level ' + lesson.n + ': ' + esc(lesson.title) + '"' +
          (lesson.n === current ? ' aria-current="true"' : '') + '>' +
          '<span class="level-btn__n">' + lesson.n + '</span>' +
          '<span class="level-btn__t">' + esc(lesson.title) + '</span></button>';
      });
      html += '</div></div>';
    });
    ladder.innerHTML = html;
  }

  /* ---------------- reader ---------------- */

  function speakButton(text, voice, label) {
    return '<button class="speak" type="button" data-speak="' + esc(text) + '" data-voice="' + esc(voice) + '" aria-label="' + esc(label) + '">' +
      '<svg class="speak__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">' +
      '<path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/></svg>' +
      '<span class="speak__bars" aria-hidden="true"><i></i><i></i><i></i></span></button>';
  }

  function tinySpeak(text, voice, label) {
    return '<button class="speak speak--tiny" type="button" data-speak="' + esc(text) + '" data-voice="' + esc(voice) + '" aria-label="' + esc(label) + '">' +
      '<svg class="speak__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">' +
      '<path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/></svg></button>';
  }

  var gameState = {};
  var selectedViews = {};
  var THEMES = ['🔎','👋','🍜','🧭','📷','🌱','💬','✉️','📰','✨'];
  function missionBlock(lesson) {
    var mission = (window.KOTOBA_MISSIONS || [])[lesson.n - 1] || [lesson.title, lesson.can];
    return '<section class="mission-card"><span class="mission-card__icon" aria-hidden="true">' + THEMES[Math.floor((lesson.n - 1)/10)] + '</span><div><small>Your mission · Level ' + lesson.n + '</small><h3>' + esc(mission[0]) + '</h3><p>' + esc(mission[1]) + '</p><p class="mission-card__task"><b>Make it yours:</b> ' + esc(lesson.drill) + '</p></div></section>';
  }
  function viewButtons(n) {
    return '<div class="lesson-views" role="group" aria-label="Choose your lesson activity">' + [['mission','Quick mission'],['conversation','Conversation'],['output','Write & speak'],['full','Full lesson']].map(function(item) {return '<button type="button" data-view-choice="' + item[0] + '" aria-pressed="' + (item[0] === (selectedViews[n] || 'mission')) + '">' + esc(item[1]) + '</button>';}).join('') + '</div>';
  }
  function gameBlock(lesson) {
    var g = gameState[lesson.n] || {at:0, solved:false};
    gameState[lesson.n] = g;
    var examples = lesson.ex || [];
    if(examples.length < 2) return '';
    var ex = examples[g.at];
    // Rotate the ordering by level and question without moving it after a retry.
    var options = examples.map(function(item,index){return {item:item,index:index};});
    var shift = (lesson.n + g.at) % options.length;
    options = options.slice(shift).concat(options.slice(0,shift));
    return '<section class="mission-game" aria-label="Listen and discover"><div class="mission-game__top"><span>Listen & discover</span><span>' + (g.at+1) + ' / ' + examples.length + '</span></div><h3>What did you hear?</h3><p class="mission-game__prompt">Play the standard Japanese, then choose its meaning. Replay as often as you like.</p><button class="mission-game__listen" type="button" data-speak="' + esc(ex.jp) + '" data-voice="std-f">▶ Listen to the clue</button><details class="mission-game__transcript"><summary>Need a reading hint?</summary><p lang="ja">' + esc(ex.jp) + '</p></details><div class="mission-game__choices">' + options.map(function(o){return '<button type="button" data-game-answer="' + o.index + '"' + (g.solved?' disabled':'') + (g.solved && o.index===g.at?' data-result="correct"':'') + '>' + esc(o.item.en) + '</button>';}).join('') + '</div><p class="mission-game__feedback" role="status">' + (g.solved ? 'You found it! Say the Japanese back once and picture the meaning.' : 'No score to protect. Every replay is practice.') + '</p><button class="mission-game__next" type="button" data-game-next' + (g.solved?'':' hidden') + '>' + (g.at < examples.length-1?'Next discovery →':'Try the three clues again ↻') + '</button></section>';
  }
  document.addEventListener('click', function(event) {
    var view = event.target.closest('[data-view-choice]');
    if (view) {
      var sheet = view.closest('.lesson-sheet');
      sheet.setAttribute('data-view',view.getAttribute('data-view-choice'));
      selectedViews[current] = view.getAttribute('data-view-choice');
      $$('[data-view-choice]',sheet).forEach(function(b){b.setAttribute('aria-pressed',String(b===view));});
      if(view.getAttribute('data-view-choice')==='full') $('.lesson-toolkit',sheet).open = true;
      return;
    }
    var answer = event.target.closest('[data-game-answer]');
    if(answer) {
      var g = gameState[current], game=answer.closest('.mission-game');
      if(g.solved) return;
      var correct = Number(answer.getAttribute('data-game-answer'))===g.at;
      answer.setAttribute('data-result',correct?'correct':'retry');
      $('.mission-game__feedback',game).textContent = correct ? 'You found it! Say the Japanese back once and picture the meaning.' : 'Keep exploring. Replay the clue, or open the reading hint, then try another meaning.';
      if(correct) {g.solved=true;$$('[data-game-answer]',game).forEach(function(b){b.disabled=true;});$('[data-game-next]',game).hidden=false;}
      return;
    }
    var next = event.target.closest('[data-game-next]');
    if(next) {
      var lesson=lessons.filter(function(l){return l.n===current;})[0];
      gameState[current]={at:(gameState[current].at+1)%lesson.ex.length,solved:false};
      next.closest('.mission-game').outerHTML=gameBlock(lesson);
      var listen=$('.mission-game__listen',reader);
      if(listen) listen.focus();
    }
  });

  /* ---------------- study-guide layer ----------------
     guideNN.js adds vocabulary, kanji, a dialogue, a short
     reading and a checklist to each level. Everything here is
     optional: a level without guide data still renders. */

  function guideFor(n) {
    var map = window.KOTOBA_GUIDE || {};
    return map[n] || null;
  }

  function textbookFor(n) {
    var map = window.KOTOBA_TEXTBOOK || {};
    return map[n] || null;
  }

  function textbookBlock(n) {
    var book = textbookFor(n);
    if (!book) return '';
    return '<section class="textbook">' +
      (book.form ? '<div class="textbook__row"><span class="textbook__label">How it is built</span><p>' + esc(book.form) + '</p></div>' : '') +
      (book.pitfall ? '<div class="textbook__row textbook__row--warn"><span class="textbook__label">Watch out</span><p>' + esc(book.pitfall) + '</p></div>' : '') +
      '</section>';
  }

  function guideBar(guide) {
    var parts = [];
    if (guide.ref) parts.push('<span class="lesson-guidebar__ref">' + esc(guide.ref) + '</span>');
    if (guide.time) parts.push('<span>' + esc(guide.time) + '</span>');
    if (guide.vocab) parts.push('<span>' + guide.vocab.length + ' new words</span>');
    if (guide.kanji && guide.kanji.length) parts.push('<span>' + guide.kanji.length + ' kanji</span>');
    return parts.length ? '<div class="lesson-guidebar">' + parts.join('<i aria-hidden="true">·</i>') + '</div>' : '';
  }

  function vocabBlock(vocab) {
    if (!vocab || !vocab.length) return '';
    var items = vocab.map(function (item) {
      var kana = item[0] || '';
      var kanji = item[1] || '';
      var en = item[2] || '';
      var pos = item[3] || '';
      var head = kanji && kanji !== '—' ? kanji : kana;
      return '<li class="vocab-item">' +
        '<span class="vocab-item__head" lang="ja">' + esc(head) + '</span>' +
        '<span class="vocab-item__kana" lang="ja">' + esc(kana) + '</span>' +
        '<span class="vocab-item__en">' + esc(en) + (pos ? ' <em>' + esc(pos) + '</em>' : '') + '</span>' +
        tinySpeak(kana, 'std-f', 'Hear ' + kana) +
        '</li>';
    }).join('');
    return '<section class="lesson-vocab"><h3>New words</h3><ul class="vocab-grid">' + items + '</ul></section>';
  }

  function kanjiBlock(kanji) {
    if (!kanji || !kanji.length) return '';
    var items = kanji.map(function (item) {
      var char = item[0] || '';
      var read = item[1] || '';
      var en = item[2] || '';
      var word = item[3] || '';
      return '<li class="kanji-chip">' +
        '<span class="kanji-chip__char" lang="ja">' + esc(char) + '</span>' +
        '<span class="kanji-chip__body"><span class="kanji-chip__read" lang="ja">' + esc(read) + '</span>' +
        '<span class="kanji-chip__en">' + esc(en) + '</span>' +
        (word ? '<span class="kanji-chip__word" lang="ja">' + esc(word) + '</span>' : '') + '</span>' +
        (word ? tinySpeak(word, 'std-f', 'Hear ' + word) : '') +
        '</li>';
    }).join('');
    return '<section class="lesson-kanji"><h3>Kanji for this level</h3><ul class="kanji-strip">' + items + '</ul></section>';
  }

  function dialogueBlock(dialogue) {
    if (!dialogue || !dialogue.length) return '';
    var items = dialogue.map(function (line) {
      var who = line[0] || '';
      var jp = line[1] || '';
      var ks = line[2] || '';
      var en = line[3] || '';
      var showKs = ks && ks !== jp;
      var stdVoice = who === 'B' ? 'std-m' : 'std-f';
      var ksVoice = who === 'B' ? 'kansai-m' : 'kansai-f';
      return '<li class="dlg-line">' +
        '<span class="dlg-line__who" aria-hidden="true">' + esc(who) + '</span>' +
        '<div class="dlg-line__body">' +
          '<p class="dlg-line__jp" lang="ja">' + esc(jp) + '</p>' +
          (showKs ? '<p class="dlg-line__ks" lang="ja"><span>Kansai</span>' + esc(ks) + '</p>' : '') +
          '<p class="dlg-line__en">' + esc(en) + '</p>' +
        '</div>' +
        '<div class="dlg-line__audio">' + tinySpeak(jp, stdVoice, 'Hear the standard line') +
          (showKs ? tinySpeak(ks, ksVoice, 'Hear the Osaka line') : '') + '</div>' +
        '</li>';
    }).join('');
    return '<section class="lesson-dialogue"><h3>Dialogue</h3><p class="lesson-dialogue__hint">Read the standard line, then the Osaka line. Change the scene, keep the shape.</p><ol class="dlg-list">' + items + '</ol></section>';
  }

  function readingBlock(reading) {
    if (!reading || !reading.jp) return '';
    var ks = reading.ks && reading.ks !== reading.jp ? reading.ks : '';
    return '<section class="lesson-reading"><h3>Read it</h3>' +
      '<div class="lesson-reading__box"><p class="lesson-reading__jp" lang="ja">' + esc(reading.jp) + '</p>' +
      (ks ? '<p class="lesson-reading__ks" lang="ja"><span>Kansai</span>' + esc(ks) + '</p>' : '') +
      '<p class="lesson-reading__en">' + esc(reading.en) + '</p></div>' +
      '<div class="lesson-reading__audio">' + tinySpeak(reading.jp, 'std-f', 'Hear the reading') +
      (ks ? tinySpeak(ks, 'kansai-m', 'Hear the Osaka reading') : '') + '</div></section>';
  }

  function checkBlock(check) {
    if (!check || !check.length) return '';
    var items = check.map(function (item) {
      return '<li><span aria-hidden="true">✓</span>' + esc(item) + '</li>';
    }).join('');
    return '<section class="lesson-check"><h3>Before you move on</h3><ul>' + items + '</ul></section>';
  }

  /* ---------------- output studio ----------------
     Every level now ends with one writing task and one speaking
     task. The scaffold is deliberately the same every time: the
     repetition is the point. Criteria are generated from the level
     data so they stay honest about what was actually taught. */

  function modelBlock(model, voice, label) {
    if (!model) return '';
    var jp = typeof model === 'string' ? model : model.jp;
    var en = typeof model === 'string' ? '' : model.en;
    var ks = typeof model === 'string' ? '' : model.ks;
    if (!jp) return '';
    var sameKs = ks && ks === jp;
    return '<details class="output-card__model">' +
      '<summary>Compare with a model</summary>' +
      '<div class="output-card__model-body">' +
        '<p lang="ja">' + esc(jp) + '</p>' +
        (ks ? '<p class="output-card__ks" lang="ja"><span>Kansai</span>' +
          (sameKs ? '<em>Same sounds here — the vowels and beats do not change.</em>' : esc(ks)) + '</p>' : '') +
        (en ? '<p class="output-card__en">' + esc(en) + '</p>' : '') +
        '<div class="output-card__audio">' + tinySpeak(jp, voice, label) +
          (ks && !sameKs ? tinySpeak(ks, 'kansai-m', 'Hear the Osaka version') : '') + '</div>' +
      '</div></details>';
  }

  function readJSON(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }

  function writeJSON(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* no-op */ }
  }

  function criteriaBlock(lesson, kind) {
    var words = lesson.words || [];
    var pick = '';
    for (var i = 0; i < words.length; i += 1) {
      var candidate = words[i][1] || words[i][0] || '';
      if (candidate && lesson.pattern.indexOf(candidate) === -1) { pick = candidate; break; }
    }
    if (!pick && words.length) pick = words[0][1] || words[0][0] || '';
    var list = [];
    list.push(lesson.n <= 7 ? 'Practises the sounds or characters from this level.' : 'Uses a pattern or phrase from this level.');
    list.push(kind === 'write'
      ? (lesson.n <= 7 ? 'Writes a few characters or words from the examples.' : lesson.n <= 10 ? 'Writes a greeting or a short answer that fits the task.' : 'Follows the task and uses the register shown in the examples.')
      : (lesson.n <= 7 ? 'Says a few sounds or words slowly, one beat at a time.' : 'Tries the task aloud; looking at the examples is welcome.'));
    if (pick) list.push('Borrows one word from this level: <b lang="ja">' + esc(pick) + '</b>.');
    list.push(kind === 'write'
      ? 'You can read your own sentence aloud without stopping.'
      : 'You said it three times and the third was smoother than the first.');
    var checked = readJSON('kotoba-checks-v1-' + lesson.n + '-' + kind, []);
    return '<div class="output-card__criteria"><span>Success looks like — tick what you did</span><ul>' +
      list.map(function (item, index) {
        var on = checked.indexOf(index) !== -1;
        return '<li><label><input type="checkbox" data-criterion="' + lesson.n + '" data-kind="' + kind + '" data-index="' + index + '"' + (on ? ' checked' : '') + '><span>' + item + '</span></label></li>';
      }).join('') + '</ul></div>';
  }

  function countChars(value) {
    return String(value || '').replace(/\s+/g, '').length;
  }

  function draftBlock(lesson, kind) {
    var key = 'kotoba-draft-v1-' + lesson.n + '-' + kind;
    var draft = '';
    try { draft = window.localStorage.getItem(key) || ''; } catch (e) { /* no-op */ }
    return '<label class="output-card__draft-wrap"><span class="output-card__draft-label">Your answer</span>' +
      '<textarea class="output-card__draft" data-draft="' + lesson.n + '" data-kind="' + kind + '" rows="4" ' +
      'placeholder="' + (kind === 'write' ? 'Write here. Kana or kanji, your choice.' : 'Jot three keywords, then speak from them.') + '">' + esc(draft) + '</textarea>' +
      '<span class="output-card__draft-meta"><b data-count="' + lesson.n + '-' + kind + '">' + countChars(draft) + '</b> characters · saved on this device</span></label>';
  }

  function timerBlock(lesson) {
    return '<div class="output-card__timer"><button class="output-card__timer-btn" type="button" data-timer="' + lesson.n + '">Start 30s</button>' +
      '<span class="output-card__clock" data-clock="' + lesson.n + '">0:30</span>' +
      '<span class="output-card__timer-note">Speak until it stops. Do not restart it.</span></div>';
  }

  function outputCard(lesson, kind) {
    var prompt = kind === 'write' ? lesson.write : lesson.speak;
    if (!prompt) return '';
    var model = kind === 'write' ? lesson.writeModel : lesson.speakModel;
    var steps = kind === 'write' ? [
      ['Steal the frame.', 'Copy the shape of one example above. Keep its ending.'],
      ['Change only the content.', 'Your city, your day, your opinion. Do not invent new grammar.'],
      ['Read it back once.', 'Say it out loud before you open the model answer.']
    ] : [
      ['Pick your starting point.', 'Choose one example or a few keywords that fit this task.'],
      ['Say it out loud three times.', 'The first is for accuracy, the second for rhythm, the third for nerve.'],
      ['Record once, then listen.', 'Listen for long vowels and small っ, not for a perfect accent.']
    ];
    return '<article class="output-card output-card--' + kind + '">' +
      '<span class="output-card__tag">' + (kind === 'write' ? 'Write' : 'Speak') + '</span>' +
      '<h4>' + esc(prompt) + '</h4>' +
      '<ol class="output-card__steps">' +
        steps.map(function (step) {
          return '<li><b>' + esc(step[0]) + '</b> ' + esc(step[1]) + '</li>';
        }).join('') +
      '</ol>' +
      (kind === 'write' ? draftBlock(lesson, kind) : timerBlock(lesson)) +
      criteriaBlock(lesson, kind) +
      modelBlock(model, 'std-f', 'Hear the model answer') +
      '</article>';
  }

  function outputBlock(lesson) {
    if (!lesson.write && !lesson.speak) return '';
    return '<section class="lesson-output" id="output">' +
      '<div class="lesson-output__head"><div><span class="lesson-output__eyebrow">Output</span>' +
      '<h3>Now make it yours</h3></div>' +
      '<p>Make one small thing your own. Try it, compare with a model, and notice what you can already do.</p></div>' +
      '<div class="lesson-output__grid">' + outputCard(lesson, 'write') + outputCard(lesson, 'speak') + '</div>' +
      '</section>';
  }

  /* ---------------- unit band ---------------- */

  function unitBand(unit) {
    var items = lessons.filter(function (lesson) {
      return lesson.n > (unit.n - 1) * 10 && lesson.n <= unit.n * 10;
    });
    var done = items.filter(function (lesson) { return isDone(lesson.n); }).length;
    return '<section class="unit-band" style="--unit-colour:' + unit.colour + '">' +
      '<div class="unit-band__num"><span>Unit</span><b>' + String(unit.n).padStart(2, '0') + '</b></div>' +
      '<div class="unit-band__body">' +
        '<p class="unit-band__promise">' + esc(unit.promise) + '</p>' +
        '<p class="unit-band__why">' + esc(unit.why) + '</p>' +
      '</div>' +
      '<div class="unit-band__meter"><b>' + done + '/' + items.length + '</b><span>levels done</span></div>' +
      '</section>';
  }

  /* ---------------- spaced review ---------------- */

  function reviewStrip(lesson) {
    var entry = entryFor(lesson.n);
    var chips = INTERVALS.map(function (gap, index) {
      var stateClass = '';
      var label = gap + 'd';
      if (!entry) {
        stateClass = index === 0 ? 'is-next' : '';
      } else if (index < (entry.reps || 0)) {
        stateClass = 'is-past';
      } else if (index === (entry.reps || 0)) {
        stateClass = isDue(lesson.n) ? 'is-due' : 'is-next';
      }
      return '<li class="review-chip ' + stateClass + '">' + label + '</li>';
    }).join('');
    var action = entry
      ? '<button class="review-btn" type="button" data-reviewed="' + lesson.n + '">I reviewed this</button>'
      : '<span class="review-strip__hint">Finish the level to start the schedule.</span>';
    return '<div class="review-strip"><div class="review-strip__label"><span>Spaced review</span>' +
      '<ol class="review-strip__chips">' + chips + '</ol></div>' + action + '</div>';
  }

  function renderReviewDock() {
    if (!reviewDock) return;
    var due = dueLevels();
    var next = lessons.filter(function (lesson) { return !isDone(lesson.n); })[0];
    if (due.length) {
      var chips = due.slice(0, 4).map(function (lesson) {
        return '<button class="review-dock__chip" type="button" data-level="' + lesson.n + '">' +
          '<b>' + lesson.n + '</b><span>' + esc(lesson.title) + '</span></button>';
      }).join('');
      reviewDock.innerHTML = '<div class="review-dock__head"><span class="review-dock__tag">Due today</span>' +
        '<b>' + due.length + ' level' + (due.length === 1 ? '' : 's') + '</b></div>' +
        '<p>Short, timed review is what makes a pattern stick. Five minutes here beats an hour of new material.</p>' +
        '<div class="review-dock__chips">' + chips + '</div>';
      reviewDock.classList.add('is-due');
      return;
    }
    reviewDock.classList.remove('is-due');
    if (next) {
      reviewDock.innerHTML = '<div class="review-dock__head"><span class="review-dock__tag">Next step</span>' +
        '<b>Level ' + next.n + '</b></div>' +
        '<p>Nothing is due for review. Next up: level ' + next.n + ' — ' + esc(next.title) + '.</p>' +
        '<button class="review-dock__go" type="button" data-level="' + next.n + '">Continue →</button>';
    } else {
      reviewDock.innerHTML = '<div class="review-dock__head"><span class="review-dock__tag">All 100</span>' +
        '<b>Complete</b></div>' +
        '<p>You have finished the course. Keep the reviews going, and take the patterns into real conversations.</p>';
    }
  }

  /* ---------------- reader ---------------- */

  function renderReader() {
    var lesson = lessons.filter(function (item) { return item.n === current; })[0];
    if (!lesson) return;
    if (timer) { window.clearInterval(timer); timer = null; }
    var unit = unitFor(lesson.n);
    var jlpt = lesson.jlpt || unit.jlpt;
    var guide = guideFor(lesson.n);
    var ladderSummary = $('#ladder-summary');
    if (ladderSummary) ladderSummary.textContent = 'Level ' + lesson.n + ' · Unit ' + unit.n;

    if (titleEl) titleEl.textContent = 'Level ' + lesson.n + ' · ' + lesson.title;
    if (subEl) subEl.textContent = 'Unit ' + unit.n + ' · ' + unit.title + ' · ' + jlpt;

    var rows = (lesson.ex || []).map(function (ex) {
      var display = ex.kanji || ex.jp;
      var ks = ex.ks && ex.ks !== ex.jp ? ex.ks : '';
      return '<div class="lesson-line">' +
        '<div class="lesson-line__std"><span class="lesson-line__tag">Standard</span>' +
        '<p lang="ja">' + esc(display) + '</p>' +
        (ex.kanji ? '<p class="lesson-line__kana" lang="ja">' + esc(ex.jp) + '</p>' : '') +
        (ex.romaji ? '<details class="romaji-hint"><summary>Reading bridge · romaji</summary><p>' + esc(ex.romaji) + '</p></details>' : '') +
        '<p class="lesson-line__en">' + esc(ex.en) + '</p></div>' +
        speakButton(ex.jp, 'std-f', 'Hear the standard line') +
        (ks ? '<div class="lesson-line__ks"><span class="lesson-line__tag lesson-line__tag--ks">Kansai</span>' +
          '<p lang="ja">' + esc(ks) + '</p></div>' + speakButton(ks, 'kansai-m', 'Hear the Osaka line') : '') +
        '</div>';
    }).join('');

    var words = (lesson.words || []).map(function (word) {
      var kanji = word[0] || '';
      var kana = word[1] || '';
      var en = word[2] || '';
      return '<li class="lesson-word"><span class="lesson-word__kanji" lang="ja">' + esc(kanji || kana) + '</span>' +
        '<span class="lesson-word__kana" lang="ja">' + esc(kana) + '</span>' +
        '<span class="lesson-word__en">' + esc(en) + '</span>' +
        speakButton(kana, 'std-f', 'Hear ' + kana) + '</li>';
    }).join('');

    var next = lessons.filter(function (item) { return item.n === lesson.n + 1; })[0];
    var nextStep = next
      ? '<button class="next-step" type="button" data-level="' + next.n + '">' +
          '<span>Next level</span><b>' + next.n + ' · ' + esc(next.title) + '</b>' +
          '<em>+' + (isDone(next.n) ? 'review' : 'one new pattern') + '</em></button>'
      : '<div class="next-step next-step--end"><span>End of the course</span><b>Keep the conversation going.</b></div>';

    reader.innerHTML =
      '<article class="lesson-sheet" data-view="' + (selectedViews[lesson.n] || 'mission') + '" id="level-' + lesson.n + '">' +
        '<header class="lesson-sheet__head">' +
          '<div class="lesson-sheet__badges"><span class="badge badge--level">Level ' + lesson.n + '</span>' +
          '<span class="badge badge--jlpt">' + esc(jlpt) + '</span>' +
          '<span class="badge badge--unit">Unit ' + unit.n + ' · ' + esc(unit.title) + '</span></div>' +
          '<h2>' + esc(lesson.title) + '</h2>' +
          '<p class="lesson-sheet__can"><b>By the end:</b> ' + esc(lesson.can) + '</p>' +
        '</header>' +
        missionBlock(lesson) +
        viewButtons(lesson.n) +
        '<p class="lesson-view-hint">A quick mission is a first pass. Come back for the conversation and your own writing or speaking.</p>' +
        '<div class="lesson-audio-settings"></div>' +
        unitBand(unit) +
        (guide ? guideBar(guide) : '') +
        '<div class="lesson-pattern"><span>The pattern</span><p lang="ja">' + esc(lesson.pattern) + '</p></div>' +
        '<details class="lesson-toolkit"><summary>Open the language toolkit · grammar, vocabulary &amp; kanji</summary>' +
        '<p class="lesson-explain">' + esc(lesson.explain) + '</p>' +
        textbookBlock(lesson.n) +
        (guide ? vocabBlock(guide.vocab) : '') +
        (guide ? kanjiBlock(guide.kanji) : '') + '</details>' +
        (guide ? dialogueBlock(guide.dialogue) : '') +
        '<section class="lesson-examples"><h3>Say it</h3>' + rows + '</section>' +
        gameBlock(lesson) +
        (guide ? readingBlock(guide.reading) : '') +
        '<section class="lesson-words"><h3>Words to keep</h3><ul>' + words + '</ul></section>' +
        '<section class="lesson-drill"><h3>Try it</h3><p>' + esc(lesson.drill) + '</p>' +
          '<details><summary>Show a model answer</summary><p lang="ja">' + esc(lesson.answer) + '</p></details></section>' +
        outputBlock(lesson) +
        '<aside class="lesson-curious"><span>Stay curious</span><p>' + esc(lesson.curious) + '</p></aside>' +
        (guide ? checkBlock(guide.check) : '') +
        reviewStrip(lesson) +
        '<footer class="lesson-sheet__foot">' +
          '<button class="complete-btn' + (isDone(lesson.n) ? ' is-done' : '') + '" type="button" data-complete="' + lesson.n + '" aria-pressed="' + (isDone(lesson.n) ? 'true' : 'false') + '">' +
            (isDone(lesson.n) ? '✓ Completed' : 'Mark this level complete') + '</button>' +
          nextStep +
        '</footer>' +
      '</article>';

    if (selectedViews[lesson.n] === 'full') $('.lesson-toolkit',reader).open = true;
    reader.dispatchEvent(new CustomEvent('kotoba:lesson', {bubbles:true}));
    renderPager(lesson);
    renderLadder();
    renderReviewDock();
    renderUnitCards();
    updateProgress();
  }

  function renderPager(lesson) {
    var prev = lessons.filter(function (item) { return item.n === lesson.n - 1; })[0];
    var next = lessons.filter(function (item) { return item.n === lesson.n + 1; })[0];
    pager.innerHTML =
      (prev ? '<button class="lesson-pager__btn" type="button" data-level="' + prev.n + '"><span>← Previous</span><b>' + prev.n + ' · ' + esc(prev.title) + '</b></button>' : '<span></span>') +
      (next ? '<button class="lesson-pager__btn lesson-pager__btn--next" type="button" data-level="' + next.n + '"><span>Next →</span><b>' + next.n + ' · ' + esc(next.title) + '</b></button>' : '<span></span>');
  }

  function updateProgress() {
    var count = doneCount();
    if (progressText) progressText.textContent = count + ' / 100';
    if (progressBar) progressBar.style.width = count + '%';
  }

  function selectLevel(n, options) {
    options = options || {};
    if (!lessons.some(function (item) { return item.n === n; })) return;
    current = n;
    if (options.scroll) {
      var target = $('#start');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (history.replaceState) history.replaceState(null, '', '#level-' + n);
    renderReader();
  }

  /* ---------------- events ---------------- */

  document.addEventListener('click', function (event) {
    var levelBtn = event.target.closest('[data-level]');
    if (levelBtn) {
      selectLevel(Number(levelBtn.getAttribute('data-level')), { scroll: false });
      return;
    }
    var completeBtn = event.target.closest('[data-complete]');
    if (completeBtn) {
      var n = Number(completeBtn.getAttribute('data-complete'));
      if (isDone(n)) {
        delete state.levels[n];
      } else {
        state.levels[n] = { done: Date.now(), reps: 0 };
      }
      saveState();
      renderReader();
      if (isDone(n)) document.dispatchEvent(new CustomEvent('kotoba:celebrate', {detail:{n:n}}));
      return;
    }
    var reviewedBtn = event.target.closest('[data-reviewed]');
    if (reviewedBtn) {
      var rn = Number(reviewedBtn.getAttribute('data-reviewed'));
      var entry = entryFor(rn);
      if (entry) {
        entry.reps = Math.min((entry.reps || 0) + 1, INTERVALS.length);
        entry.done = Date.now();
        saveState();
        renderReader();
      }
    }
  });

  filters.forEach(function (button) {
    button.addEventListener('click', function () {
      filters.forEach(function (item) {
        item.classList.remove('is-active');
        item.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('is-active');
      button.setAttribute('aria-pressed', 'true');
      activeFilter = button.getAttribute('data-level-filter');
      renderLadder();
    });
  });

  if (search) {
    search.addEventListener('input', function () {
      query = search.value.trim().toLowerCase();
      renderLadder();
    });
  }

  document.addEventListener('keydown', function (event) {
    var tag = (event.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || event.target.isContentEditable) return;
    if (event.key === 'ArrowRight' && current < 100) selectLevel(current + 1, { scroll: false });
    if (event.key === 'ArrowLeft' && current > 1) selectLevel(current - 1, { scroll: false });
  });

  /* ---------------- workbook ----------------
     Drafts and criteria ticks are saved per level, so a learner can
     close the page and come back to the same sentence. */

  document.addEventListener('input', function (event) {
    var draft = event.target.closest('[data-draft]');
    if (!draft) return;
    var key = 'kotoba-draft-v1-' + draft.getAttribute('data-draft') + '-' + draft.getAttribute('data-kind');
    try { window.localStorage.setItem(key, draft.value); } catch (e) { /* no-op */ }
    var count = $('[data-count="' + draft.getAttribute('data-draft') + '-' + draft.getAttribute('data-kind') + '"]');
    if (count) count.textContent = countChars(draft.value);
  });

  document.addEventListener('change', function (event) {
    var box = event.target.closest('[data-criterion]');
    if (!box) return;
    var key = 'kotoba-checks-v1-' + box.getAttribute('data-criterion') + '-' + box.getAttribute('data-kind');
    var list = readJSON(key, []);
    var index = Number(box.getAttribute('data-index'));
    var at = list.indexOf(index);
    if (box.checked && at === -1) list.push(index);
    if (!box.checked && at !== -1) list.splice(at, 1);
    writeJSON(key, list);
  });

  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-timer]');
    if (!button) return;
    var clock = $('[data-clock="' + button.getAttribute('data-timer') + '"]');
    if (timer) { window.clearInterval(timer); timer = null; }
    if (button.getAttribute('data-running') === 'true') {
      button.removeAttribute('data-running');
      button.textContent = 'Start 30s';
      if (clock) clock.textContent = '0:30';
      return;
    }
    button.setAttribute('data-running', 'true');
    button.textContent = 'Stop';
    var left = 30;
    if (clock) clock.textContent = '0:30';
    timer = window.setInterval(function () {
      left -= 1;
      if (clock) clock.textContent = '0:' + (left < 10 ? '0' : '') + left;
      if (left <= 0) {
        window.clearInterval(timer);
        timer = null;
        button.removeAttribute('data-running');
        button.textContent = 'Start again';
        if (clock) clock.textContent = 'Done';
      }
    }, 1000);
  });

  /* ---------------- unit cards ---------------- */

  var unitGrid = $('#unit-grid');
  function renderUnitCards() {
    if (!unitGrid) return;
    unitGrid.innerHTML = UNITS.map(function (unit) {
      var items = lessons.filter(function (lesson) { return lesson.n > (unit.n - 1) * 10 && lesson.n <= unit.n * 10; });
      var first = items[0];
      var done = items.filter(function (lesson) { return isDone(lesson.n); }).length;
      return '<a class="unit-card" href="#level-' + (first ? first.n : 1) + '" data-jump="' + (first ? first.n : 1) + '" style="--unit-colour:' + unit.colour + '">' +
        '<span class="unit-card__num">' + String(unit.n).padStart(2, '0') + '</span>' +
        '<span class="unit-card__jlpt">' + esc(unit.jlpt) + ' · ' + esc(unit.range) + '</span>' +
        '<h3>' + esc(unit.title) + '</h3>' +
        '<p lang="ja">' + esc(unit.jp) + '</p>' +
        '<span class="unit-card__meta">' + done + '/' + items.length + ' done · 1 pattern a level</span>' +
        '</a>';
    }).join('');
  }

  document.addEventListener('click', function (event) {
    var jump = event.target.closest('[data-jump]');
    if (!jump) return;
    event.preventDefault();
    selectLevel(Number(jump.getAttribute('data-jump')), { scroll: true });
  });

  document.addEventListener('click', function(event) {
    var link = event.target.closest('a[href^="#level-"]');
    if (!link || link.hasAttribute('data-jump')) return;
    var match = /^#level-(\d+)$/.exec(link.getAttribute('href'));
    if (match) {event.preventDefault(); selectLevel(Number(match[1]), {scroll:true});}
  });
  window.addEventListener('hashchange', function() {
    var match = /^#level-(\d+)$/.exec(window.location.hash);
    if (match) selectLevel(Number(match[1]), {scroll:true});
  });

  /* ---------------- boot ---------------- */

  var hash = /#level-(\d+)/.exec(window.location.hash);
  if (hash) current = Math.max(1, Math.min(100, Number(hash[1])));
  var ladderDetails = $('#ladder-details');
  if (ladderDetails && window.matchMedia('(max-width: 900px)').matches) ladderDetails.removeAttribute('open');
  renderReader();
  renderLadder();
  updateProgress();
})();
