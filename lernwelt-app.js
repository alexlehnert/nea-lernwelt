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

  /* Lernpfad für Lernseiten, die alle Kapitel als <section id> untereinander haben (Terme, Pflanzenzelle).
   * lwKapitel({ ids, names, test, hide, stand })
   *   ids/names  Kapitel in der Reihenfolge des Hefts; test = id eines Abschnitts, der der Große Test ist
   *   hide       Selektoren, die im Kapitel-Modus verschwinden (Sprungleiste, Merkzettel …)
   *   stand(id)  optional: Text unter der Kapitel-Leiste, z. B. „2 von 3 Sternen“
   * Mit #<kapitel> zeigt die Seite nur dieses Kapitel und unten „Weiter“ und „Zum Heft“.
   * Ohne Anker oder mit #alles bleibt alles auf einer Seite (Entdecken). */
  window.lwKapitel = function (o) {
    var all = o.ids.concat(o.test ? [o.test] : []);
    var nav = document.createElement('nav');
    nav.className = 'lw-kapnav';
    nav.setAttribute('aria-label', 'Lernpfad');
    function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function render() {
      var h = location.hash.slice(1), on = all.indexOf(h) >= 0;
      document.documentElement.classList.toggle('lw-kapmode', on);
      all.forEach(function (id) { var e = document.getElementById(id); if (e) e.hidden = on && id !== h; });
      (o.hide || []).forEach(function (sel) { document.querySelectorAll(sel).forEach(function (e) { e.hidden = on; }); });
      if (!on) { nav.remove(); return; }
      var i = o.ids.indexOf(h), isTest = h === o.test, nx = i >= 0 ? o.ids[i + 1] : null;
      var head = isTest ? 'Großer Test' : 'Kapitel ' + (i + 1) + ' von ' + o.ids.length;
      var st = o.stand ? o.stand(h) : '';
      nav.innerHTML = '<div class="lw-kapnav-t"><b>' + head + '</b>' + (st ? '<span>' + esc(st) + '</span>' : '') + '</div>' +
        (nx ? '<a class="lw-kapnav-go" href="#' + nx + '">Weiter: ' + esc(o.names[i + 1]) + '</a>'
          : (!isTest && o.test ? '<a class="lw-kapnav-go" href="#' + o.test + '">Zum Großen Test</a>' : '')) +
        '<button type="button" class="lw-kapnav-heft">Zum Heft</button>';
      nav.querySelector('.lw-kapnav-heft').onclick = function () { window.lwHeft(); };
      var sec = document.getElementById(h);
      if (sec) sec.after(nav);
    }
    window.addEventListener('hashchange', function () { render(); window.scrollTo(0, 0); });
    render();
    if (all.indexOf(location.hash.slice(1)) >= 0) setTimeout(function () { window.scrollTo(0, 0); }, 0);
    return { refresh: render };
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
