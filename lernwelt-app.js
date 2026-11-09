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

  // Zurück zur Heft-Seite (Lernkonzept: raus geht es immer eine Ebene hoch, nie in eine eigene Übersicht der App).
  // Kam Nea von der Lernwelt, per Verlauf zurück (die Heft-Seite steht dann an derselben Stelle), sonst per Link.
  function fromHub() {
    var r = document.referrer, o = location.origin;
    return r.indexOf(o + '/') === 0 && /^\/(index\.html)?$/.test(r.slice(o.length).replace(/[?#].*$/, '')) && history.length > 1;
  }
  window.lwHeft = function () {
    var id = location.pathname.replace(/^.*\//, '').replace(/\.html$/, '');
    if (fromHub() && !moved) history.back();
    else location.href = 'index.html#heft-' + id;
  };
  // Start einer App: lwStart('home', kapitelSprung). Ohne Anker zeigt die App ihre Übersicht wie bisher.
  // Mit Anker (Nea kam über ein Kapitel der Lernwelt) springt sie ins Kapitel, und danach führt jeder
  // Aufruf von home() zurück zur Heft-Seite statt in die eigene Übersicht der App.
  window.lwStart = function (name, jump) {
    var real = window[name];
    if (!location.hash) { real(); return; }
    var boot = true;
    window[name] = function () { return boot ? real.apply(this, arguments) : window.lwHeft(); };
    var ok = false;
    try { ok = jump(); } finally { boot = false; }
    if (!ok) { window[name] = real; real(); }
  };

  var moved = false;
  window.addEventListener('hashchange', function () { moved = true; });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.lw-back');
    if (!a || moved) return;
    if (fromHub()) {
      e.preventDefault();
      history.back();
    }
  });
})();
