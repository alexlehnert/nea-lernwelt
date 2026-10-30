/*
 * Lernwelt-Bausteine für die Apps (wird wie lernwelt-app.css von tools/lw_look.py eingebunden).
 * - lwSheet(): Rückmeldung und Weiter-Knopf in einer festen Leiste am unteren Rand, wie im Konzept „Übung“.
 *   So ist der Weiter-Knopf nach jeder Antwort sofort sichtbar, ohne zu scrollen.
 * - Zurück-Pfeil: kam Nea aus der Lernwelt, geht es per Verlauf dorthin zurück, wo sie war (meist die Heft-Seite).
 */
(function () {
  'use strict';
  window.lwSheet = function (parent, ok, els) {
    var sh = document.createElement('div');
    sh.className = 'lw-sheet ' + (ok ? 'ok' : 'bad');
    els.forEach(function (e) { if (e) sh.appendChild(e); });
    var sp = document.createElement('div');
    sp.className = 'lw-sheet-space';
    parent.appendChild(sp);
    parent.appendChild(sh);
    sp.style.height = (sh.offsetHeight + 16) + 'px';
    // Was über der Leiste stand (z. B. die richtige Antwort), bleibt sichtbar.
    var prev = sp.previousElementSibling;
    if (prev) {
      var d = prev.getBoundingClientRect().bottom - (window.innerHeight - sh.offsetHeight) + 12;
      if (d > 0) window.scrollBy({ top: d, behavior: 'smooth' });
    }
    var b = sh.querySelector('button');
    if (b) b.focus({ preventScroll: true });
    return sh;
  };

  var moved = false;
  window.addEventListener('hashchange', function () { moved = true; });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.lw-back');
    if (!a || moved) return;
    var r = document.referrer, o = location.origin;
    if (r.indexOf(o + '/') === 0 && /^\/(index\.html)?$/.test(r.slice(o.length).replace(/[?#].*$/, '')) && history.length > 1) {
      e.preventDefault();
      history.back();
    }
  });
})();
