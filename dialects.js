/* ============================================================
   Kotoba — dialect atlas
   Map selection, prefecture panel, audio chips and a small quiz.
   ============================================================ */
(function () {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var paths = $$('.pref');
  var panels = $$('.dx-panel');
  var legend = $$('.dx-legend__item');
  var select = $('#dx-pref-select');
  var status = $('#dx-map-status');
  var mapWrap = $('#dx-map-wrap');
  var tip = $('#dx-map-tip');
  var mobile = window.matchMedia('(max-width: 900px)');

  if (!paths.length) return;

  function findPath(pref) {
    for (var i = 0; i < paths.length; i += 1) {
      if (paths[i].dataset.pref === pref) return paths[i];
    }
    return null;
  }

  function panelFor(region) {
    for (var i = 0; i < panels.length; i += 1) {
      if (panels[i].dataset.panel === region) return panels[i];
    }
    return null;
  }

  function legendFor(region) {
    for (var i = 0; i < legend.length; i += 1) {
      if (legend[i].dataset.region === region) return legend[i];
    }
    return null;
  }

  function regionName(region) {
    var button = legendFor(region);
    if (!button) return region;
    return $('.dx-legend__name', button).textContent.trim();
  }

  function selectRegion(region, prefName, options) {
    options = options || {};
    var regionPaths = paths.filter(function (path) { return path.dataset.region === region; });
    if (!regionPaths.length) return;

    var current = prefName ? findPath(prefName) : null;
    if (current && current.dataset.region !== region) current = null;
    if (!current) {
      var button = legendFor(region);
      current = button ? findPath(button.dataset.anchor) : null;
    }
    if (!current) current = regionPaths[0];

    paths.forEach(function (path) {
      path.classList.remove('is-active', 'is-current');
    });
    regionPaths.forEach(function (path) {
      path.classList.add('is-active');
    });
    current.classList.add('is-current');
    // Keep the selected outline above its neighbours, below the city labels.
    current.parentNode.appendChild(current);

    panels.forEach(function (panel) {
      panel.classList.toggle('is-active', panel.dataset.panel === region);
    });

    legend.forEach(function (button) {
      var on = button.dataset.region === region;
      button.classList.toggle('is-active', on);
      button.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    if (select) select.value = current.dataset.pref;

    var panel = panelFor(region);
    if (panel) {
      var where = $('[data-where]', panel);
      if (where) where.textContent = current.dataset.en + ' ' + current.dataset.pref + ' · ' + regionName(region);
    }

    if (status) status.textContent = 'Showing ' + regionName(region) + ' · ' + current.dataset.en;

    if (options.scroll && mobile.matches) {
      window.setTimeout(function () {
        if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
  }

  /* ---------------- map ---------------- */

  paths.forEach(function (path) {
    path.addEventListener('click', function () {
      selectRegion(path.dataset.region, path.dataset.pref, { scroll: true });
    });

    path.addEventListener('pointermove', function (event) {
      if (!tip || event.pointerType === 'touch') return;
      var rect = mapWrap.getBoundingClientRect();
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;
      tip.textContent = path.dataset.en + ' · ' + path.dataset.pref + ' · ' + path.dataset.regionName;
      tip.hidden = false;
      var tipRect = tip.getBoundingClientRect();
      var left = Math.max(8, Math.min(x + 14, rect.width - tipRect.width - 8));
      var top = Math.max(8, Math.min(y + 14, rect.height - tipRect.height - 8));
      tip.style.left = left + 'px';
      tip.style.top = top + 'px';
    });

    path.addEventListener('pointerleave', function () {
      if (tip) tip.hidden = true;
    });
  });

  if (mapWrap && tip) {
    mapWrap.addEventListener('pointerleave', function () {
      tip.hidden = true;
    });
  }

  /* ---------------- legend + select ---------------- */

  legend.forEach(function (button) {
    button.addEventListener('click', function () {
      selectRegion(button.dataset.region, button.dataset.anchor);
    });
  });

  if (select) {
    select.addEventListener('change', function () {
      var option = select.options[select.selectedIndex];
      if (!option) return;
      selectRegion(option.dataset.region, option.value, { scroll: true });
    });
  }

  /* ---------------- “very” chips ---------------- */

  $$('.dx-hook__pick').forEach(function (button) {
    button.addEventListener('click', function () {
      selectRegion(button.dataset.region, button.dataset.pref);
      var atlas = $('#atlas');
      if (atlas) atlas.scrollIntoView({ behavior: 'smooth', block: 'start' });
      var panel = panelFor(button.dataset.region);
      if (panel) {
        var heading = $('h3', panel);
        if (heading) {
          heading.setAttribute('tabindex', '-1');
          window.setTimeout(function () { heading.focus({ preventScroll: true }); }, 450);
        }
      }
    });
  });

  /* ---------------- quiz ---------------- */

  var score = 0;
  var scoreEl = $('#dx-quiz-score');

  $$('.dx-quiz__item').forEach(function (item) {
    var answer = item.dataset.answer;
    var answerName = item.dataset.answerName;
    var buttons = $$('.dx-quiz__options button', item);
    var feedback = $('.dx-quiz__feedback', item);
    var explore = $('.dx-quiz__explore', item);

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        if (item.dataset.done) return;
        item.dataset.done = '1';

        var right = button.dataset.choice === answer;
        item.classList.add(right ? 'is-correct' : 'is-wrong');
        button.classList.add(right ? 'is-correct' : 'is-wrong');

        buttons.forEach(function (other) {
          other.disabled = true;
          if (other.dataset.choice === answer) other.classList.add('is-answer');
        });

        if (feedback) {
          feedback.textContent = right
            ? 'Right — ' + answerName + '. Press the map link to see it.'
            : 'Not quite — that one belongs to ' + answerName + '. Press the map link to see it.';
        }

        if (right) {
          score += 1;
          if (scoreEl) scoreEl.textContent = String(score);
        }

        if (explore) explore.hidden = false;
      });
    });

    if (explore) {
      explore.addEventListener('click', function () {
        selectRegion(explore.dataset.region, null);
        var atlas = $('#atlas');
        if (atlas) atlas.scrollIntoView({ behavior: 'smooth', block: 'start' });
        var panel = panelFor(explore.dataset.region);
        if (panel) {
          var heading = $('h3', panel);
          if (heading) {
            heading.setAttribute('tabindex', '-1');
            window.setTimeout(function () { heading.focus({ preventScroll: true }); }, 450);
          }
        }
      });
    }
  });
})();
