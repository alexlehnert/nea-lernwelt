/*
 * Lernwelt-Sync: hält den localStorage der Lern-Apps mit Supabase abgeglichen.
 *
 * Die Apps speichern ihren Fortschritt unverändert in localStorage. Dieses Skript
 * - lädt nach dem Login den Fortschritt aus Supabase in localStorage (Pull),
 * - schickt jede Änderung an localStorage an Supabase (Push, gebündelt),
 * - leitet App-Seiten ohne Login zur Startseite um.
 * Konflikte: pro Schlüssel gewinnt der neueste Stand (updated_at).
 *
 * Außerdem auf App-Seiten:
 * - Kapitel-Fortschritt: Eine App meldet mit LW.kapitel(fn) eine Funktion, die [{t, p}] liefert
 *   (Kapitelname, Anteil 0–1). Nach jeder Änderung der App wird sie neu berechnet und unter
 *   lernwelt-fortschritt-<heft> gespeichert.
 * - Lernzeit: Sekunden, in denen eine App sichtbar offen ist, pro Tag unter lernwelt-zeit.
 */
(function () {
  'use strict';
  var C = window.LW_CONFIG || {};
  var IS_HUB = !!(document.currentScript && document.currentScript.dataset.hub);
  var META = 'lernwelt-sync-meta';
  var USER = 'lernwelt-user';
  var RELOADED = 'lernwelt-reloaded';
  var DOMAIN = '@lernwelt.local';
  var HEFT = location.pathname.replace(/^.*\//, '').replace(/\.html$/, '');
  var FORT = 'lernwelt-fortschritt-' + HEFT;
  var ZEIT = 'lernwelt-zeit';

  if (!C.url || !C.key || !window.supabase) {
    window.LW = { configured: false, ready: Promise.resolve(null) };
    return;
  }

  var sb = window.supabase.createClient(C.url, C.key, {
    auth: { persistSession: true, autoRefreshToken: true, storageKey: 'sb-lernwelt-auth' }
  });
  var LS = window.localStorage;
  var setRaw = Storage.prototype.setItem;
  var removeRaw = Storage.prototype.removeItem;
  var session = null;
  var pulled = false;          // erst nach dem Pull zählen Änderungen als „neu“
  var early = new Set();       // Änderungen der App, bevor der Pull fertig war
  var dirty = new Set();
  var timer = null;

  function tracked(k) {
    return typeof k === 'string' && k.indexOf('sb-') !== 0 && k !== META && k !== USER;
  }
  function readMeta() {
    try { return JSON.parse(LS.getItem(META) || '{}') || {}; } catch (e) { return {}; }
  }
  function writeMeta(m) {
    try { setRaw.call(LS, META, JSON.stringify(m)); } catch (e) {}
  }
  function trackedKeys() {
    var out = [];
    for (var i = 0; i < LS.length; i++) { var k = LS.key(i); if (tracked(k)) out.push(k); }
    return out;
  }
  function clearLocal() {
    trackedKeys().forEach(function (k) { removeRaw.call(LS, k); });
    removeRaw.call(LS, META);
  }

  function touched(k) {
    if (!pulled) { early.add(k); return; }
    var m = readMeta(); m[k] = Date.now(); writeMeta(m);
    dirty.add(k); schedule(1200);
  }
  Storage.prototype.setItem = function (k, v) {
    setRaw.call(this, k, v);
    if (this === LS && tracked(k)) {
      touched(k);
      if (k.indexOf('lernwelt-') !== 0) scheduleReport();
    }
  };
  Storage.prototype.removeItem = function (k) {
    removeRaw.call(this, k);
    if (this === LS && tracked(k)) touched(k);
  };

  function rowsFor(keys) {
    var m = readMeta();
    return keys.map(function (k) {
      return { user_id: session.user.id, key: k, value: LS.getItem(k),
        updated_at: new Date(m[k] || Date.now()).toISOString() };
    });
  }
  function schedule(ms) {
    clearTimeout(timer);
    timer = setTimeout(flush, ms);
  }
  function flush() {
    if (!session || !dirty.size) return Promise.resolve();
    var keys = Array.from(dirty); dirty.clear();
    return sb.from('progress').upsert(rowsFor(keys)).then(function (res) {
      if (res.error) { keys.forEach(function (k) { dirty.add(k); }); schedule(5000); }
    }, function () { keys.forEach(function (k) { dirty.add(k); }); schedule(5000); });
  }
  // Beim Verlassen der Seite: letzter Stand per keepalive, damit nichts verloren geht.
  function flushOnLeave() {
    if (!session || !dirty.size) return;
    var rows = rowsFor(Array.from(dirty)); dirty.clear();
    try {
      fetch(C.url + '/rest/v1/progress', {
        method: 'POST', keepalive: true,
        headers: { apikey: C.key, Authorization: 'Bearer ' + session.access_token,
          'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates' },
        body: JSON.stringify(rows)
      });
    } catch (e) {}
  }
  // Kapitel-Fortschritt der App neu berechnen und speichern, wenn er sich geändert hat.
  var kapFn = null, kapTimer = null;
  function scheduleReport() {
    if (!kapFn) return;
    clearTimeout(kapTimer);
    kapTimer = setTimeout(report, 600);
  }
  function report() {
    if (!kapFn || !pulled || IS_HUB) return;
    var list;
    try { list = kapFn(); } catch (e) { return; }
    if (!list || !list.length) return;
    var k = list.map(function (x) {
      var p = Math.max(0, Math.min(1, +x.p || 0));
      return { t: String(x.t), p: Math.round(p * 100) / 100 };
    });
    var old = null;
    try { old = JSON.parse(LS.getItem(FORT) || 'null'); } catch (e) {}
    if (old && JSON.stringify(old.k) === JSON.stringify(k)) return;
    LS.setItem(FORT, JSON.stringify({ k: k, ts: Date.now() }));
  }

  // Lernzeit: alle 20 s zählen, solange die App sichtbar ist; jede Minute und beim Verlassen speichern.
  var secs = 0;
  function dayKey(d) {
    d = d || new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }
  function saveTime() {
    if (!secs || !session || !pulled) return;
    var z = {};
    try { z = JSON.parse(LS.getItem(ZEIT) || '{}') || {}; } catch (e) {}
    var d = dayKey();
    z[d] = (z[d] || 0) + secs;
    secs = 0;
    var keys = Object.keys(z).sort();
    while (keys.length > 120) delete z[keys.shift()];
    LS.setItem(ZEIT, JSON.stringify(z));
  }
  if (!IS_HUB) {
    setInterval(function () {
      if (document.visibilityState !== 'visible' || !session) return;
      secs += 20;
      if (secs >= 60) saveTime();
    }, 20000);
    window.addEventListener('pagehide', saveTime);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') saveTime();
    });
  }

  window.addEventListener('pagehide', flushOnLeave);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') flushOnLeave();
  });

  function adoptUser(uid) {
    var last = LS.getItem(USER);
    if (last !== uid) clearLocal();   // anderes Kind am selben Gerät: lokalen Stand leeren
    setRaw.call(LS, USER, uid);
  }

  // Holt den Stand aus Supabase. Gibt true zurück, wenn sich lokal etwas geändert hat.
  function pull() {
    return sb.from('progress').select('key,value,updated_at').then(function (res) {
      if (res.error) throw res.error;
      var m = readMeta(), changed = false, remote = {};
      res.data.forEach(function (row) {
        var t = Date.parse(row.updated_at), k = row.key;
        remote[k] = t;
        if (!(k in m) || t > m[k]) {
          if (row.value === null) {
            if (LS.getItem(k) !== null) { removeRaw.call(LS, k); changed = true; }
          } else if (LS.getItem(k) !== row.value) {
            setRaw.call(LS, k, row.value); changed = true;
          }
          m[k] = t;
          early.delete(k);
        }
      });
      // Lokaler Stand, der neuer ist oder in Supabase fehlt, wird hochgeladen.
      // (early enthält nur noch Schlüssel, die Supabase nicht überschrieben hat.)
      var now = Date.now();
      early.forEach(function (k) { m[k] = now; });
      trackedKeys().concat(Array.from(early)).forEach(function (k) {
        if (!(k in m)) m[k] = now;
        if (!(k in remote) || m[k] > remote[k]) dirty.add(k);
      });
      early.clear();
      writeMeta(m);
      pulled = true;
      schedule(300);
      return changed;
    });
  }

  function start(s) {
    session = s;
    if (!s) return Promise.resolve(null);
    adoptUser(s.user.id);
    return pull().then(function (changed) {
      // App-Seite: Wenn der Stand aus Supabase anders war, einmal neu laden,
      // damit die App ihn einliest.
      if (!IS_HUB) {
        if (changed && !sessionStorage.getItem(RELOADED)) {
          sessionStorage.setItem(RELOADED, '1');
          location.reload();
          return new Promise(function () {});
        }
        sessionStorage.removeItem(RELOADED);
        scheduleReport();
      }
      return s;
    }, function () { pulled = true; return s; });
  }

  sb.auth.onAuthStateChange(function (_e, s) { if (s) session = s; });

  var ready = sb.auth.getSession().then(function (res) {
    var s = res.data && res.data.session;
    if (!s && !IS_HUB) { location.replace('/index.html'); return new Promise(function () {}); }
    return start(s);
  });

  window.LW = {
    configured: true,
    ready: ready,
    user: function () { return session && session.user; },
    kapitel: function (fn) { kapFn = fn; scheduleReport(); },
    day: dayKey,
    signIn: function (name, password) {
      name = String(name || '').trim().toLowerCase();
      var email = name.indexOf('@') >= 0 ? name : name + DOMAIN;
      return sb.auth.signInWithPassword({ email: email, password: password }).then(function (res) {
        if (res.error) throw res.error;
        return start(res.data.session);
      });
    },
    signOut: function () {
      return flush().then(function () { return sb.auth.signOut(); }).then(function () {
        session = null; clearLocal(); removeRaw.call(LS, USER);
      });
    }
  };
})();
