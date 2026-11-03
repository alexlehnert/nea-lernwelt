/*
 * Chat-Aufgabe für alle Fächer (Vorbild: der Klassenchat in Ethik „Gemeinsam stark“).
 * Ein Chat läuft Nachricht für Nachricht ab, mit „schreibt …“-Punkten. An den Lücken schreibt Nea selbst:
 * sie tippt den passenden Vorschlag an (wie die Wortvorschläge über der Handy-Tastatur) oder schreibt ihn.
 * Aussehen in lernwelt-app.css (.lwc …), Farbe vom Fach über opts.fach (ma, en, bio, geo, mu, eth).
 *
 *   lwChat(container, {
 *     title: 'Ruby', sub: 'online', ava: 'R',     Kopf des Chats (ava: 1–2 Zeichen oder ein Emoji)
 *     fach: 'en',                                Fachfarbe
 *     people: { Ruby: '#E0567A' },               Farben der Personen (sonst automatisch)
 *     say: text => …,                            optional: Antippen einer Nachricht liest sie vor
 *     lines: [
 *       { w: 'Ruby', t: 'Hi! Where are you?' },               Nachricht von jemand anderem
 *       { n: 'Eine Stunde später …' },                        Erzähltext in der Mitte
 *       { t: 'I ___ in the park.', a: ['am'], o: ['am', 'is', 'are'], ex: 'Bei I immer am.' },
 *                                                             Neas Nachricht mit Lücke: a = richtige Antworten,
 *                                                             o = Vorschläge, ex = Tipp bei Fehler, type: true = selbst schreiben
 *       { me: true, t: 'Bis gleich!' }                        Neas Nachricht ohne Lücke
 *     ],
 *     onAnswer: (line, ok, value) => …,           nach jeder Lücke
 *     onEnd: results => …                          am Ende: [{ line, ok, value }]
 *   })
 */
(function () {
  'use strict';
  var PAL = ['#E0567A', '#2F80ED', '#E07B12', '#16A05A', '#8B4FE0', '#0E9AA7', '#C2410C'];
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var norm = function (s) { return String(s).replace(/[’‘`´]/g, "'").replace(/[.!?,]+$/g, '').replace(/\s+/g, ' ').trim().toLowerCase(); };
  var shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.random() * (i + 1) | 0, t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var AC = null;
  function pling(hi) {
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === 'suspended') AC.resume();
      var t = AC.currentTime, o = AC.createOscillator(), g = AC.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(hi ? 1046.5 : 880, t);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.07, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + 0.2);
    } catch (e) {}
  }
  var SEND = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.4 20.4 21 12 3.4 3.6 3.4 10.1 15 12 3.4 13.9z"/></svg>';

  window.lwChat = function (parent, o) {
    o = o || {};
    var lines = o.lines || [], cols = {}, ci = 0;
    var col = function (w) { if (o.people && o.people[w]) return o.people[w]; return cols[w] || (cols[w] = PAL[ci++ % PAL.length]); };
    var root = document.createElement('div');
    root.className = 'lwc' + (o.fach ? ' lw-' + o.fach : '');
    root.innerHTML = '<div class="lwc-head"><span class="lwc-ava">' + esc(o.ava || '💬') + '</span><span class="lwc-ht"><b>' + esc(o.title || 'Chat') + '</b>' +
      (o.sub ? '<small>' + esc(o.sub) + '</small>' : '') + '</span></div><div class="lwc-body"></div><div class="lwc-reply" hidden></div>';
    parent.appendChild(root);
    var body = root.querySelector('.lwc-body'), reply = root.querySelector('.lwc-reply');
    var ctl = document.createElement('div'); ctl.className = 'lwc-ctl';
    var skip = document.createElement('button'); skip.type = 'button'; skip.className = 'lwc-skip'; skip.textContent = 'Schneller ⏩';
    ctl.appendChild(skip); parent.appendChild(ctl);
    var i = 0, fast = false, res = [];
    var alive = function () { return root.isConnected; };
    var later = function (f, ms) { setTimeout(function () { if (alive()) f(); }, fast || calm ? Math.min(ms, 80) : ms); };
    var into = function (e) { try { e.scrollIntoView({ block: 'nearest', behavior: calm ? 'auto' : 'smooth' }); } catch (x) { } };
    skip.onclick = function () { fast = true; skip.disabled = true; };

    function bubble(l, html, extra) {
      var me = !!(l.me || l.a), b = document.createElement(o.say ? 'button' : 'div');
      if (o.say) { b.type = 'button'; b.onclick = function () { o.say(b.dataset.say); }; }
      b.className = 'lwc-ln' + (me ? ' me' : '') + (extra ? ' ' + extra : '');
      var c = me ? '' : col(l.w);
      b.innerHTML = (me ? '' : '<span class="lwc-av" style="background:' + c + '">' + esc((l.w || '?')[0]) + '</span>') +
        '<span class="lwc-bub">' + (me ? '' : '<span class="lwc-who" style="color:' + c + '">' + esc(l.w) + '</span>') + '<span class="lwc-tx">' + html + '</span></span>';
      b.dataset.say = (l.say || l.t || '').replace('___', l.a ? l.a[0] : '');
      if (o.say) b.setAttribute('aria-label', (me ? 'Du' : l.w) + ': ' + b.dataset.say + '. Antippen zum Anhören');
      return b;
    }
    function put(e) { body.appendChild(e); into(e); }

    function next() {
      if (!alive()) return;
      if (i >= lines.length) { ctl.remove(); if (o.onEnd) o.onEnd(res); return; }
      var l = lines[i++];
      if (l.a) return ask(l);
      if (l.n) { var p = document.createElement('p'); p.className = 'lwc-nar'; p.textContent = l.n; put(p); return later(next, 900 + l.n.length * 25); }
      var show = function () {
        put(bubble(l, esc(l.t) + (l.photo ? '<span class="lwc-photo"><span>' + (l.pic || '📷') + '</span>' + esc(l.photo) + '</span>' : '')));
        pling(false);
        later(next, 700 + (l.t || '').length * 30);
      };
      if (l.me || fast || calm) return show();
      var ty = document.createElement('div'); ty.className = 'lwc-typing'; ty.innerHTML = '<i></i><i></i><i></i>'; put(ty);
      later(function () { ty.remove(); show(); }, 650);
    }

    function ask(l) {
      fast = false; skip.disabled = false;
      var parts = esc(l.t).split('___');
      var draft = bubble(l, parts[0] + '<span class="lwc-gap">&nbsp;?&nbsp;</span>' + (parts[1] || ''), 'draft');
      if (o.say) draft.disabled = true;
      put(draft);
      reply.hidden = false;
      if (l.type) {
        reply.innerHTML = '<p class="lwc-rl">Schreib das fehlende Wort:</p><form class="lwc-form"><input type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Deine Nachricht"><button type="submit" class="lwc-send" aria-label="Senden">' + SEND + '</button></form>';
        var f = reply.querySelector('form'), inp = f.querySelector('input');
        inp.focus({ preventScroll: true });
        f.onsubmit = function (e) { e.preventDefault(); var v = inp.value.trim(); if (v) done(v); };
      } else {
        var opts = shuffle(l.o && l.o.length ? l.o : l.a);
        reply.innerHTML = '<p class="lwc-rl">Was schreibst du? Tipp an:</p><div class="lwc-sug">' +
          opts.map(function (x, k) { return '<button type="button" class="lwc-chip" data-k="' + k + '">' + esc(x) + '</button>'; }).join('') + '</div>';
        reply.querySelectorAll('.lwc-chip').forEach(function (b) { b.onclick = function () { done(opts[+b.dataset.k], b); }; });
      }
      into(reply);

      function done(v, chip) {
        var ok = l.a.some(function (x) { return norm(x) === norm(v); }), right = l.a[0];
        if (chip) {
          reply.querySelectorAll('.lwc-chip').forEach(function (b) { b.disabled = true; if (l.a.indexOf(b.textContent) >= 0) b.classList.add('ok'); });
          if (!ok) chip.classList.add('bad');
        }
        res.push({ line: l, ok: ok, value: v });
        if (o.onAnswer) o.onAnswer(l, ok, v);
        var hit = l.a.filter(function (x) { return norm(x) === norm(v); })[0];
        var fill = ok ? '<b class="lwc-in">' + esc(hit) + '</b>'
          : '<s class="lwc-wrong">' + esc(v) + '</s> <b class="lwc-in">' + esc(right) + '</b>';
        var sent = bubble(l, parts[0] + fill + (parts[1] || ''), ok ? 'ok' : 'bad');
        sent.querySelector('.lwc-bub').insertAdjacentHTML('beforeend', '<span class="lwc-mark" aria-label="' + (ok ? 'richtig' : 'falsch') + '">' + (ok ? '✓' : '✗') + '</span>');
        draft.replaceWith(sent);
        pling(true);
        var go = function () { reply.hidden = true; reply.innerHTML = ''; next(); };
        if (ok) return later(go, 900);
        if (l.ex) { var n = document.createElement('p'); n.className = 'lwc-tip'; n.textContent = '💡 ' + l.ex; sent.after(n); }
        reply.innerHTML = '<button type="button" class="lwc-cont">Verstanden, weiter im Chat</button>';
        var c = reply.querySelector('button'); c.onclick = go; c.focus({ preventScroll: true }); into(reply);
      }
    }

    next();
    return root;
  };

  /*
   * Mehrere Chats in einer Kachel, für Seiten ohne Runden (z. B. Terme, Pflanzenzelle):
   *   lwChatPanel(container, { fach, people, say, chats: [{ title, sub, ava, name, lines }], onEnd: (index, results) => … })
   * name = kurzer Name für die Auswahl. Ein Chat startet erst, wenn Nea „Chat starten“ antippt.
   */
  window.lwChatPanel = function (host, o) {
    var chats = o.chats || [], cur = 0, done = {};
    var box = document.createElement('div'); box.className = 'lwc-panel'; host.appendChild(box);
    function pick() {
      return '<div class="lwc-pick" role="group" aria-label="Chat auswählen">' + chats.map(function (c, k) {
        return '<button type="button" class="lwc-chip" data-c="' + k + '" aria-pressed="' + (k === cur) + '">' + (done[k] ? '✓ ' : '💬 ') + esc(c.name || c.title) + '</button>';
      }).join('') + '</div>';
    }
    function bindPick() { box.querySelectorAll('[data-c]').forEach(function (b) { b.onclick = function () { cur = +b.dataset.c; menu(); }; }); }
    function menu() {
      var c = chats[cur];
      box.innerHTML = pick() + '<div class="lwc-start"><div class="lwc-head"><span class="lwc-ava">' + esc(c.ava || '💬') + '</span><span class="lwc-ht"><b>' + esc(c.title) + '</b>' +
        (c.sub ? '<small>' + esc(c.sub) + '</small>' : '') + '</span></div><button type="button" class="lwc-cont">' + (done[cur] ? 'Nochmal chatten' : 'Chat starten') + '</button></div>';
      bindPick();
      box.querySelector('.lwc-start').className = 'lwc-start lwc' + (o.fach ? ' lw-' + o.fach : '');
      box.querySelector('.lwc-cont').onclick = run;
    }
    function run() {
      var c = chats[cur];
      box.innerHTML = '';
      window.lwChat(box, { title: c.title, sub: c.sub, ava: c.ava, fach: o.fach, people: o.people, say: o.say, lines: c.lines,
        onEnd: function (res) {
          var k = res.filter(function (r) { return r.ok; }).length, all = k === res.length;
          done[cur] = done[cur] || all;
          if (o.onEnd) o.onEnd(cur, res);
          var end = document.createElement('div'); end.className = 'lwc-end ' + (all ? 'ok' : 'bad');
          end.innerHTML = '<b>' + (all ? 'Super, alles richtig! 🎉' : (k ? 'Fast! ' : '') + k + ' von ' + res.length + ' richtig.') + '</b>' +
            (all ? '' : '<span>Probier den Chat nochmal, dann sitzt es.</span>');
          var row = document.createElement('div'); row.className = 'lwc-endrow';
          var nx = (cur + 1) % chats.length;
          if (chats.length > 1) { var b1 = document.createElement('button'); b1.type = 'button'; b1.className = 'lwc-cont'; b1.textContent = 'Nächster Chat ›'; b1.onclick = function () { cur = nx; menu(); into(box); }; row.appendChild(b1); }
          var b2 = document.createElement('button'); b2.type = 'button'; b2.className = 'lwc-skip'; b2.textContent = 'Nochmal'; b2.onclick = run; row.appendChild(b2);
          end.appendChild(row); box.appendChild(end); into(end);
        } });
    }
    var into = function (e) { try { e.scrollIntoView({ block: 'nearest', behavior: calm ? 'auto' : 'smooth' }); } catch (x) { } };
    menu();
    return box;
  };
})();
