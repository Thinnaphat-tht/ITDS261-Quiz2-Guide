/* Quiz engine: hub, runner, DFD renderer and rule checker. Data lives in quiz-data.js (window.QUIZ). */
(function (root) {
  'use strict';

  /* ---------- DFD rule checker (rules from lecturer slides L6/L7) ----------
     spec.n: nodes  ['e'|'p'|'s', id, label, x, y, num?]
     spec.f: flows  [fromId, toId, label]
     R1 flow must start or end at a process; R2 process needs >=1 input and >=1 output; R3 flow must be named */
  function check(spec) {
    var kind = {}, errs = [];
    spec.n.forEach(function (n) { kind[n[1]] = n[0]; });
    spec.f.forEach(function (f, i) {
      if (kind[f[0]] !== 'p' && kind[f[1]] !== 'p') errs.push({ r: 1, flow: i, label: f[2] });
      if (!f[2]) errs.push({ r: 3, flow: i, label: '' });
    });
    spec.n.forEach(function (n) {
      if (n[0] !== 'p') return;
      var hasIn = spec.f.some(function (f) { return f[1] === n[1]; });
      var hasOut = spec.f.some(function (f) { return f[0] === n[1]; });
      if (!hasIn || !hasOut) errs.push({ r: 2, id: n[1], label: n[2], noIn: !hasIn, noOut: !hasOut });
    });
    return errs;
  }

  /* ---------- DFD renderer (Gane/Sarson shapes, as in slide L6 p42) ---------- */
  var SIZE = { e: [100, 42], p: [118, 58], s: [128, 36] };
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function drawDFD(spec) {
    var W = spec.w || 620, H = spec.h || 320, N = {}, out = [];
    spec.n.forEach(function (n) { N[n[1]] = n; });
    out.push('<svg class="dfd" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="แผนภาพ DFD">');
    out.push('<defs><marker id="ar" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="currentColor"/></marker></defs>');
    spec.n.forEach(function (n) {
      var k = n[0], x = n[3], y = n[4], s = SIZE[k], w = s[0], h = s[1], l = x - w / 2, t = y - h / 2;
      if (k === 'e') {
        out.push('<rect class="sh" x="' + l + '" y="' + t + '" width="' + w + '" height="' + h + '"/><text x="' + x + '" y="' + (y + 5) + '" text-anchor="middle">' + esc(n[2]) + '</text>');
      } else if (k === 'p') {
        out.push('<rect class="sh" x="' + l + '" y="' + t + '" width="' + w + '" height="' + h + '" rx="10"/>');
        if (n[5]) out.push('<line class="sh" x1="' + l + '" x2="' + (l + w) + '" y1="' + (t + 20) + '" y2="' + (t + 20) + '"/><text x="' + x + '" y="' + (t + 15) + '" text-anchor="middle">' + esc(n[5]) + '</text><text x="' + x + '" y="' + (t + 40) + '" text-anchor="middle">' + esc(n[2]) + '</text>');
        else out.push('<text x="' + x + '" y="' + (y + 5) + '" text-anchor="middle">' + esc(n[2]) + '</text>');
      } else {
        out.push('<line class="sh" x1="' + l + '" x2="' + (l + w) + '" y1="' + t + '" y2="' + t + '"/><line class="sh" x1="' + l + '" x2="' + (l + w) + '" y1="' + (t + h) + '" y2="' + (t + h) + '"/>');
        if (n[5]) out.push('<line class="sh" x1="' + (l + 34) + '" x2="' + (l + 34) + '" y1="' + t + '" y2="' + (t + h) + '"/><text x="' + (l + 17) + '" y="' + (y + 5) + '" text-anchor="middle">' + esc(n[5]) + '</text><text x="' + (l + 34 + (w - 34) / 2) + '" y="' + (y + 5) + '" text-anchor="middle">' + esc(n[2]) + '</text>');
        else out.push('<text x="' + x + '" y="' + (y + 5) + '" text-anchor="middle">' + esc(n[2]) + '</text>');
      }
    });
    var pairCount = {}, pairIdx = {};
    spec.f.forEach(function (f) { var k = [f[0], f[1]].sort().join('|'); pairCount[k] = (pairCount[k] || 0) + 1; });
    spec.f.forEach(function (f) {
      var a = N[f[0]], b = N[f[1]], k = [f[0], f[1]].sort().join('|');
      var idx = pairIdx[k] = (pairIdx[k] === undefined ? 0 : pairIdx[k] + 1), off = (idx - (pairCount[k] - 1) / 2) * 24 * (f[0] > f[1] ? -1 : 1);
      var dx = b[3] - a[3], dy = b[4] - a[4], len = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / len, uy = dy / len;
      var px = -uy * off, py = ux * off;
      function edge(n, sx, sy) {
        var s = SIZE[n[0]], hw = s[0] / 2 + 3, hh = s[1] / 2 + 3, tx = sx === 0 ? 1e9 : hw / Math.abs(sx), ty = sy === 0 ? 1e9 : hh / Math.abs(sy);
        return Math.min(tx, ty);
      }
      var da = edge(a, ux, uy), db = edge(b, ux, uy);
      var x1 = a[3] + ux * da + px, y1 = a[4] + uy * da + py, x2 = b[3] - ux * db + px, y2 = b[4] - uy * db + py;
      out.push('<line class="fl" x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" marker-end="url(#ar)"/>');
      var sg = off > 0 ? 1 : off < 0 ? -1 : (Math.abs(uy) < 0.3 ? -1 : 0), lx = (x1 + x2) / 2 - uy * sg * 12 * (off ? 1 : 0.6), ly = (y1 + y2) / 2 + ux * sg * 12 * (off ? 1 : 0.6) + 4;
      if (Math.abs(uy) >= 0.3 && !off) lx += 8 * (ux >= 0 ? 1 : -1) + (Math.abs(ux) < 0.3 ? 0 : 0);
      if (f[2]) out.push('<text class="fx" x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" text-anchor="' + (Math.abs(uy) >= 0.3 && !off ? 'start' : 'middle') + '">' + esc(f[2]) + '</text>');
    });
    out.push('</svg>');
    return out.join('');
  }

  /* ---------- auto answers for diagram questions ---------- */
  function autoQuestion(q) {
    if (!q.auto) return q;
    var errs = check(q.spec), flowNames = q.spec.f.map(function (f) { return f[2]; }).filter(Boolean);
    var procNames = q.spec.n.filter(function (n) { return n[0] === 'p'; }).map(function (n) { return n[2]; });
    var r1 = errs.filter(function (e) { return e.r === 1; }), r2 = errs.filter(function (e) { return e.r === 2; }), r3 = errs.filter(function (e) { return e.r === 3; });
    function uniq(a) { return a.filter(function (v, i) { return a.indexOf(v) === i; }); }
    function nums(c) { var o = [c]; [1, 2, 3, c > 1 ? -1 : 4, c > 2 ? -2 : 5].forEach(function (d) { var v = c + d; if (v >= 0 && o.indexOf(v) < 0 && o.length < 4) o.push(v); }); return o.map(String); }
    var o;
    if (q.auto === 'count') o = nums(errs.length);
    else if (q.auto === 'count1') o = nums(r1.length);
    else if (q.auto === 'count2') o = nums(r2.length);
    else if (q.auto === 'count3') o = nums(r3.length);
    else if (q.auto === 'flow1') { o = [r1[0].label].concat(uniq(flowNames).filter(function (x) { return x !== r1[0].label; }).slice(0, 3)); }
    else if (q.auto === 'proc2') { o = [r2[0].label].concat(procNames.filter(function (x) { return x !== r2[0].label; }).slice(0, 3)); }
    else return q;
    var copy = {}; for (var k in q) copy[k] = q[k];
    copy.o = o; copy.a = 0; return copy;
  }

  /* ---------- UI ---------- */
  var S = root.QUIZ, host, state = null, resetArmed = false;
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } }
  function shuffle(a) { var r = a.slice(); for (var i = r.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = r[i]; r[i] = r[j]; r[j] = t; } return r; }
  function key(t, s) { return 'q2-best-' + t + '-' + s; }

  function hub() {
    state = null; resetArmed = false;
    var h = '<h1 class="sheet">ข้อสอบ แยกตามเรื่อง</h1><p>เลือกเรื่อง แล้วเลือกชุด ชุด 1–3 ชุดละ 20 ข้อ ชุด 4 มี 30 ข้อ เฉลยทันทีทีละข้อ ตอบถูกมีเสียงติ๊ง ตอบผิดมีเสียงแอ๊ด (ปิดเสียงได้ที่ปุ่มด้านล่าง) ข้อสอบทั้งหมดผมแต่งเองจากกฎในสไลด์ ไม่ใช่ข้อสอบจริงของอาจารย์ ทุกข้อบอกหน้าสไลด์ที่ใช้อ้างอิง</p>';
    S.topics.forEach(function (t) {
      h += '<h2 class="sub2">' + t.name + '</h2>';
      if (!t.sets.length) { h += '<p><small>' + (t.note || 'ยังไม่เปิด') + '</small></p>'; return; }
      h += '<div class="sets">';
      t.sets.forEach(function (s, i) {
        var b = store(key(t.id, i));
        h += '<button class="setcard" type="button" data-t="' + t.id + '" data-s="' + i + '"><b>ชุด ' + (i + 1) + '</b><span>' + s.title + '</span><i>' + (b === null ? 'ยังไม่เคยทำ' : 'คะแนนสูงสุด ' + b + ' / ' + s.qs.length) + '</i></button>';
      });
      h += '</div>';
    });
    h += '<p style="margin-top:28px"><button class="btn alt" id="qmute" type="button">เสียงเฉลย: ' + (store('q2-mute') === '1' ? 'ปิดอยู่ (กดเพื่อเปิด)' : 'เปิดอยู่ (กดเพื่อปิด)') + '</button> <button class="btn alt" id="qreset" type="button">ล้างคะแนนสูงสุดทั้งหมด</button></p>';
    host.innerHTML = h;
  }

  function start(tid, si, only) {
    var t = S.topics.filter(function (x) { return x.id === tid; })[0], set = t.sets[si];
    var qs = set.qs.map(function (q, i) { q = autoQuestion(q); q._i = i; return q; });
    if (only) qs = qs.filter(function (q) { return only.indexOf(q._i) >= 0; });
    state = { t: t, si: si, qs: qs, i: 0, ans: qs.map(function () { return null; }), orders: qs.map(function (q) { return shuffle(q.o.map(function (_, k) { return k; })); }), only: only ? only.slice() : null };
    show(true);
  }

  function tally() {
    var st = state, done = 0, right = 0;
    st.ans.forEach(function (a, i) { if (a !== null) { done++; if (a === st.qs[i].a) right++; } });
    return { done: done, right: right };
  }

  function show(scroll) {
    var st = state, q = st.qs[st.i], a = st.ans[st.i], n = st.qs.length, c = tally(), last = st.i === n - 1;
    var h = '<h1 class="sr">' + st.t.name + ' ชุด ' + (st.si + 1) + ' ข้อ ' + (st.i + 1) + '</h1><div class="qhead"><button class="btn alt" id="qback" type="button">&larr; กลับ</button><span>' + st.t.name + ' · ชุด ' + (st.si + 1) + (st.only ? ' (ข้อที่พลาด)' : '') + '</span><button class="btn alt" id="qrestart" type="button">เริ่มชุดนี้ใหม่ (Reset)</button></div>';
    h += '<p class="qprog"><b>ข้อ ' + (st.i + 1) + ' / ' + n + '</b> · ตอบแล้ว ' + c.done + ' / ' + n + ' · ถูก <span class="g">' + c.right + '</span> · ผิด <span class="r">' + (c.done - c.right) + '</span></p>';
    h += '<div class="chips">';
    st.qs.forEach(function (x, i) {
      var v = st.ans[i], cls = 'chip' + (i === st.i ? ' cur' : '') + (v === null ? '' : (v === x.a ? ' ok' : ' no'));
      h += '<button type="button" class="' + cls + '" data-j="' + i + '" aria-label="ข้อ ' + (i + 1) + '">' + (i + 1) + '</button>';
    });
    h += '</div>';
    h += '<p class="qtext">' + q.q + '</p>';
    if (q.spec) h += '<div class="qfig">' + drawDFD(q.spec) + '</div>';
    if (q.img) h += '<div class="qfig"><img src="' + q.img + '" alt="รูปสไลด์ประกอบข้อสอบ"></div>';
    h += '<div class="opts">';
    st.orders[st.i].forEach(function (k, p) {
      var cls = 'opt' + (a === null ? '' : (k === q.a ? ' right' : (k === a ? ' wrong' : '')));
      h += '<button class="' + cls + '" type="button" data-k="' + k + '"' + (a === null ? '' : ' disabled') + '><i>' + 'ABCD'[p] + '</i><span>' + q.o[k] + '</span></button>';
    });
    h += '</div><div id="qfb" aria-live="polite">';
    if (a !== null) h += feedback(q, a);
    h += '</div><div class="qnav">' + (st.i > 0 ? '<button class="btn alt" id="qprev" type="button">&larr; ข้อก่อนหน้า</button>' : '<span></span>') +
      '<button class="btn" id="qnext" type="button">' + (last ? 'ดูคะแนน' : (a === null ? 'ข้ามข้อนี้' : 'ข้อถัดไป')) + '</button></div>';
    host.innerHTML = h;
    if (scroll) window.scrollTo(0, host.getBoundingClientRect().top + window.scrollY - 80);
    if (a !== null) { var nx = host.querySelector('#qnext'); if (nx) nx.focus({ preventScroll: true }); }
  }

  function feedback(q, a) {
    var ok = a === q.a;
    return '<div class="fb ' + (ok ? 'ok' : 'no') + '"><b>' + (ok ? 'ถูก' : 'ผิด') + '</b> ' + q.why + (q.src ? '<small class="src">อ้างอิง: ' + q.src + '</small>' : '') + '</div>';
  }

  function answer(k) {
    var st = state; if (st.ans[st.i] !== null) return;
    st.ans[st.i] = +k; show(false);
    fx(+k === st.qs[st.i].a);
  }

  /* feedback effect: sparkle + chime when right, shake + buzz when wrong (sound can be muted) */
  var AC = null;
  function sound(ok) {
    if (store('q2-mute') === '1') return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      var t = AC.currentTime, notes = ok ? [[988, 0, .12], [1319, .09, .26]] : [[170, 0, .16], [130, .14, .3]];
      notes.forEach(function (n) {
        var o = AC.createOscillator(), g = AC.createGain();
        o.type = ok ? 'sine' : 'sawtooth'; o.frequency.value = n[0];
        g.gain.setValueAtTime(.0001, t + n[1]); g.gain.exponentialRampToValueAtTime(ok ? .16 : .09, t + n[1] + .02); g.gain.exponentialRampToValueAtTime(.0001, t + n[2]);
        o.connect(g); g.connect(AC.destination); o.start(t + n[1]); o.stop(t + n[2] + .02);
      });
    } catch (e) { /* no audio available */ }
  }
  function fx(ok) {
    var el = host.querySelector(ok ? '.opt.right' : '.opt.wrong'), chip = host.querySelector('.chip.cur'), fb = host.querySelector('.fb');
    sound(ok);
    if (el) el.classList.add(ok ? 'pop' : 'shake');
    if (chip) chip.classList.add(ok ? 'pop' : 'shake');
    if (fb) fb.classList.add('in');
    if (ok && el) {
      for (var i = 0; i < 10; i++) {
        var s = document.createElement('span'), a = i / 10 * 6.283;
        s.className = 'spark'; s.style.setProperty('--dx', Math.round(Math.cos(a) * (46 + i % 3 * 14)) + 'px'); s.style.setProperty('--dy', Math.round(Math.sin(a) * (30 + i % 3 * 10)) + 'px');
        el.appendChild(s);
      }
      setTimeout(function () { el.querySelectorAll('.spark').forEach(function (x) { x.remove(); }); }, 900);
    }
  }

  function finish() {
    var st = state, n = st.qs.length, c = tally(), pct = Math.round(c.right / n * 100), wrong = [], skipped = n - c.done;
    st.qs.forEach(function (q, i) { if (st.ans[i] !== q.a) wrong.push(q._i); });
    if (!st.only) { var k = key(st.t.id, st.si), b = store(k); if (b === null || +b < c.right) store(k, String(c.right)); }
    st.wrongIdx = wrong;
    var h = '<h1 class="sheet">จบชุด: ' + st.t.name + ' · ชุด ' + (st.si + 1) + '</h1><div class="score ' + (pct >= 85 ? 'good' : pct < 60 ? 'low' : '') + '"><b>' + c.right + '</b> / ' + n + ' <span>(' + pct + '%)</span></div>';
    h += '<p>' + (skipped ? 'ข้ามไป ' + skipped + ' ข้อ (นับเป็นยังไม่ถูก) ' : '') + (pct >= 85 ? 'แม่นแล้ว ไปชุดถัดไปได้' : pct >= 60 ? 'พอใช้ ทวนข้อที่พลาดแล้วทำซ้ำอีกรอบ' : 'ยังไม่แน่น กลับไปอ่านแผ่นแบบของเรื่องนี้ก่อนทำซ้ำ') + '</p>';
    if (wrong.length) {
      h += '<h2 class="sub2">ข้อที่พลาดหรือข้าม (' + wrong.length + ')</h2><ol class="wl">';
      wrong.forEach(function (i) { var q = autoQuestion(st.t.sets[st.si].qs[i]); h += '<li><span>' + q.q + '</span><b>เฉลย: ' + q.o[q.a] + '</b><small>' + q.why + '</small></li>'; });
      h += '</ol>';
    }
    h += '<p><button class="btn" id="qagain" type="button">ทำชุดนี้ใหม่ (Reset)</button> ' + (wrong.length && !st.only ? '<button class="btn alt" id="qwrong" type="button">ทำเฉพาะข้อที่พลาด</button> ' : '') + '<button class="btn alt" id="qhub" type="button">กลับหน้าเลือกชุด</button> <button class="btn alt" id="qreview" type="button">ดูข้อสอบที่ทำ</button></p>';
    host.innerHTML = h;
    window.scrollTo(0, host.getBoundingClientRect().top + window.scrollY - 80);
  }

  function init() {
    host = document.getElementById('qroot'); if (!host || !S) return;
    host.addEventListener('click', function (e) {
      var c = e.target.closest('button'); if (!c) return;
      if (c.classList.contains('setcard')) start(c.dataset.t, +c.dataset.s);
      else if (c.classList.contains('opt')) answer(c.dataset.k);
      else if (c.classList.contains('chip')) { state.i = +c.dataset.j; show(true); }
      else if (c.id === 'qnext') { if (state.i >= state.qs.length - 1) finish(); else { state.i++; show(true); } }
      else if (c.id === 'qprev') { state.i--; show(true); }
      else if (c.id === 'qback' || c.id === 'qhub') hub();
      else if (c.id === 'qrestart' || c.id === 'qagain') start(state.t.id, state.si, state.only);
      else if (c.id === 'qwrong') start(state.t.id, state.si, state.wrongIdx.slice());
      else if (c.id === 'qreview') { state.i = 0; show(true); }
      else if (c.id === 'qmute') { store('q2-mute', store('q2-mute') === '1' ? '0' : '1'); hub(); }
      else if (c.id === 'qreset') {
        if (!resetArmed) { resetArmed = true; c.textContent = 'กดอีกครั้งเพื่อยืนยันการล้างคะแนนทั้งหมด'; }
        else { S.topics.forEach(function (t) { t.sets.forEach(function (_, i) { store(key(t.id, i), null); }); }); hub(); }
      }
    });
    window.addEventListener('keydown', function (e) {
      if (!state || !host.offsetParent || e.ctrlKey || e.metaKey || e.altKey || !host.querySelector('.qtext')) return;
      var n = 'abcd1234'.indexOf(e.key.toLowerCase());
      if (n >= 0 && state.ans[state.i] === null) { var b = host.querySelectorAll('.opt')[n % 4]; if (b) { e.preventDefault(); answer(b.dataset.k); } }
      else if (e.key === 'Enter' && state.ans[state.i] !== null) { var nx = host.querySelector('#qnext'); if (nx && document.activeElement !== nx) nx.click(); }
      else if (e.key === 'ArrowRight' && state.i < state.qs.length - 1) { state.i++; show(true); }
      else if (e.key === 'ArrowLeft' && state.i > 0) { state.i--; show(true); }
    });
    hub();
  }

  root.QUIZ_ENGINE = { check: check, drawDFD: drawDFD, autoQuestion: autoQuestion };
  if (typeof document !== 'undefined') { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init(); }
})(typeof window !== 'undefined' ? window : globalThis);
