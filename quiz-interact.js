/* Interactive question types for the quiz engine (loaded before quiz.js).
   q.type: 'drop' (drag chips into slots/buckets/flow-chart nodes), 'path' (tap nodes of a flow graph in order),
           'num' (fill numbers), 'tap' (tap the wrong spots on a DFD).
   Every type works with mouse, touch (pointer events) and keyboard/tap fallback (tap chip, then tap slot). */
(function (root) {
  'use strict';

  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function shuffle(a) { var r = a.slice(); for (var i = r.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = r[i]; r[i] = r[j]; r[j] = t; } return r; }

  /* ---------- code block, VS Code Dark+ colours. lines: [text, nodeNo?] ---------- */
  var CTL = /^(if|else|for|while|do|return|break|continue|switch|case|default|new|try|catch|throw)$/;
  var STO = /^(int|boolean|double|float|long|char|void|public|private|static|final|class|true|false|null)$/;
  function hi(t) {
    var re = /(\/\/.*)|("(?:[^"\\]|\\.)*")|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_]\w*)\b(\s*\()?/g, o = '', last = 0, m;
    while ((m = re.exec(t))) {
      o += esc(t.slice(last, m.index)); last = re.lastIndex;
      var c = m[1] ? 'cm' : m[2] ? 'st' : m[3] ? 'nu' : CTL.test(m[4]) ? 'k2' : STO.test(m[4]) ? 'k1' : m[5] ? 'fn' : /^[A-Z]/.test(m[4]) ? 'ty' : 'va';
      o += '<span class="' + c + '">' + esc(m[1] || m[2] || m[3] || m[4]) + '</span>' + (m[5] ? esc(m[5]) : '');
    }
    return o + esc(t.slice(last));
  }
  function codeHtml(lines) {
    return '<div class="vs" aria-label="โค้ดที่ให้"><div class="vs-bar">Main.java</div><div class="vs-body">' + lines.map(function (l) {
      return '<div class="vs-l"><i class="vs-n">' + (l[1] || '') + '</i><code>' + hi(l[0]) + '</code></div>';
    }).join('') + '</div></div>';
  }

  /* ---------- flow graph renderer ----------
     g.nodes: {id, k:'start'|'end'|'proc'|'dec'|'circ', x, y, t?, slot?}   g.edges: [from, to, label?, via?[[x,y]..]] */
  function half(n) { return n.k === 'circ' ? [17, 17] : n.k === 'dec' ? [70, 32] : (n.k === 'start' || n.k === 'end') ? [48, 17] : [100, 20]; }
  function clip(n, tx, ty, pad) {
    var dx = tx - n.x, dy = ty - n.y, len = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / len, uy = dy / len, h = half(n), t;
    if (n.k === 'circ') t = 17;
    else if (n.k === 'dec') t = 1 / (Math.abs(ux) / h[0] + Math.abs(uy) / h[1]);
    else t = Math.min(ux ? h[0] / Math.abs(ux) : 1e9, uy ? h[1] / Math.abs(uy) : 1e9);
    return [n.x + ux * (t + pad), n.y + uy * (t + pad)];
  }
  function shape(n) {
    var x = n.x, y = n.y;
    if (n.k === 'circ') return '<circle class="sh" cx="' + x + '" cy="' + y + '" r="17"/>';
    if (n.k === 'dec') return '<polygon class="sh" points="' + x + ',' + (y - 32) + ' ' + (x + 70) + ',' + y + ' ' + x + ',' + (y + 32) + ' ' + (x - 70) + ',' + y + '"/>';
    if (n.k === 'start' || n.k === 'end') return '<rect class="sh" x="' + (x - 48) + '" y="' + (y - 17) + '" width="96" height="34" rx="17"/>';
    return '<rect class="sh" x="' + (x - 100) + '" y="' + (y - 20) + '" width="200" height="40" rx="3"/>';
  }
  /* o.slotText(id) -> shown text in a slot; o.cls(id) -> extra class; o.ecls(i) -> extra edge class; o.node = true marks nodes tappable */
  function drawGraph(g, o) {
    o = o || {};
    var N = {}, out = [];
    g.nodes.forEach(function (n) { N[n.id] = n; });
    out.push('<svg class="ixg" viewBox="0 0 ' + g.w + ' ' + g.h + '" role="img" aria-label="' + esc(g.label || 'แผนภาพ flow graph') + '">');
    out.push('<defs><marker id="ixar" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>');
    g.edges.forEach(function (e, i) {
      var a = N[e[0]], b = N[e[1]], via = e[3] || [], pts = [[a.x, a.y]].concat(via, [[b.x, b.y]]);
      var p0 = clip(a, pts[1][0], pts[1][1], 1), pn = clip(b, pts[pts.length - 2][0], pts[pts.length - 2][1], 2);
      var d = 'M' + p0[0].toFixed(1) + ',' + p0[1].toFixed(1);
      for (var k = 1; k < pts.length - 1; k++) d += ' L' + pts[k][0] + ',' + pts[k][1];
      d += ' L' + pn[0].toFixed(1) + ',' + pn[1].toFixed(1);
      out.push('<path class="ie ' + (o.ecls ? o.ecls(i, e) : '') + '" d="' + d + '" marker-end="url(#ixar)"/>');
      if (e[2]) {
        var sx = p0[0], sy = p0[1], tx = pts[1][0], ty = pts[1][1], mx = (sx + tx) / 2, my = (sy + ty) / 2, dx = tx - sx, dy = ty - sy, L = Math.sqrt(dx * dx + dy * dy) || 1;
        var vert = Math.abs(dx) < Math.abs(dy);
        out.push('<text class="il" x="' + (vert ? mx + 20 : mx).toFixed(1) + '" y="' + (vert ? my + 5 : my - 8).toFixed(1) + '" text-anchor="middle">' + esc(e[2]) + '</text>');
      }
    });
    g.nodes.forEach(function (n) {
      var extra = o.cls ? o.cls(n.id) : '', txt = n.t, open;
      if (n.slot) {
        var s = o.slotText ? o.slotText(n.id) : '';
        open = '<g class="ix-slot ' + extra + (s ? ' filled' : '') + '" data-slot="' + n.id + '" tabindex="0" role="button" aria-label="ช่องว่างใน flow chart">';
        txt = s || '?';
      } else if (o.node && n.k === 'circ') open = '<g class="ix-node ' + extra + '" data-n="' + n.id + '" tabindex="0" role="button" aria-label="Node ' + esc(n.t) + '">';
      else open = '<g class="' + extra + '">';
      out.push(open + shape(n) + '<text class="' + (n.slot && !o.slotText(n.id) ? 'ph' : 'nt') + '" x="' + n.x + '" y="' + (n.y + 5) + '" text-anchor="middle">' + esc(txt) + '</text></g>');
    });
    out.push('</svg>');
    return out.join('');
  }

  /* ---------- type: drop ---------- */
  var T = {};
  function chipHtml(c, st, extra) {
    return '<button type="button" class="ixc' + (st.sel === c.id ? ' sel' : '') + (extra || '') + '" data-c="' + c.id + '">' + esc(c.t) + '</button>';
  }
  function chipById(q, id) { return q.chips.filter(function (c) { return c.id === id; })[0]; }
  function inSlot(q, st, slot) { return st.order.filter(function (id) { return st.pos[id] === slot; }); }
  /* grid layout: q.head = header texts, q.rows = rows of cells; a cell is a string or {slot} (a drop zone) */
  function slotsOf(q) {
    if (q.slots) return q.slots;
    var o = [];
    q.rows.forEach(function (r) { r.forEach(function (c, j) { if (typeof c !== 'string') o.push({ id: c.slot, label: r[0] + ' · ' + q.head[j] }); }); });
    return o;
  }
  function want(q, slot) { return q.chips.filter(function (c) { return c.to === slot; }).map(function (c) { return c.t; }).sort(); }
  /* identical numbers (e.g. 12 in two cells) are interchangeable, so grade by the text in each slot, not by chip id */
  function markOf(q, st, c) {
    if (!st.checked) return '';
    var got = st.pos[c.id];
    return got !== null && want(q, got).indexOf(c.t) >= 0 ? ' ok' : ' no';
  }
  T.drop = {
    init: function (q, st) { st.pos = {}; q.chips.forEach(function (c) { st.pos[c.id] = null; }); st.order = shuffle(q.chips.map(function (c) { return c.id; })); st.sel = null; },
    cap: function (q, slot) { return q.layout === 'buckets' ? 0 : q.layout === 'grid' ? (q.cap || 0) : 1; },
    view: function (q, st) {
      var h = '<p class="ix-hint">' + (st.checked ? 'ตรวจแล้ว: เขียว = วางถูก แดง = วางผิด' : 'ลากชิปไปวางในช่อง หรือแตะชิปแล้วแตะช่อง (แตะชิปที่วางแล้วเพื่อเอาออก)') + '</p>';
      function zone(s) {
        var ids = inSlot(q, st, s.id);
        return '<div class="ix-zone' + (st.sel && !st.checked ? ' armed' : '') + '" data-slot="' + s.id + '">' + ids.map(function (id) { var c = chipById(q, id); return chipHtml(c, st, markOf(q, st, c)); }).join('') + (ids.length ? '' : '<span class="ix-empty">วางที่นี่</span>') + '</div>';
      }
      if (q.layout === 'svg') {
        h += '<div class="ix-split">' + (q.code ? codeHtml(q.code) : '') + '<div class="ix-fig">' + drawGraph(q.graph, {
          slotText: function (id) { var ids = inSlot(q, st, id); return ids.length ? chipById(q, ids[0]).t : ''; },
          cls: function (id) { var ids = inSlot(q, st, id); if (!ids.length) return st.sel && !st.checked ? 'armed' : ''; return markOf(q, st, chipById(q, ids[0])).trim(); }
        }) + '</div></div>';
      } else if (q.layout === 'grid') {
        h += '<div class="ix-gridwrap"><table class="ix-grid"><thead><tr>' + q.head.map(function (x) { return '<th>' + esc(x) + '</th>'; }).join('') + '</tr></thead><tbody>' +
          q.rows.map(function (r) { return '<tr>' + r.map(function (c) { return typeof c === 'string' ? '<td class="ix-st">' + esc(c) + '</td>' : '<td>' + zone({ id: c.slot }) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
      } else if (q.layout === 'buckets') {
        h += '<div class="ix-buckets">' + q.slots.map(function (s) { return '<div class="ix-bucket"><b>' + esc(s.label) + '</b>' + zone(s) + '</div>'; }).join('') + '</div>';
      } else {
        h += '<div class="ix-rows">' + q.slots.map(function (s) { return '<div class="ix-row"><span class="ix-lab">' + esc(s.label) + '</span>' + zone(s) + '</div>'; }).join('') + '</div>';
      }
      var pool = st.order.filter(function (id) { return st.pos[id] === null; });
      h += '<div class="ix-pool" data-pool="1"><span class="ix-poolt">ชิปคำตอบ</span>' + pool.map(function (id) { var c = chipById(q, id); return chipHtml(c, st, markOf(q, st, c)); }).join('') + (pool.length ? '' : '<span class="ix-empty">วางครบแล้ว</span>') + '</div>';
      if (!st.checked) h += '<div class="ix-act"><button type="button" class="btn" data-act="check">ตรวจคำตอบ</button><button type="button" class="btn alt" data-act="clear">ล้างที่วาง</button></div><p class="ix-msg" aria-live="polite"></p>';
      return h;
    },
    bind: function (q, box, st, api) {
      if (st.checked) return;
      var drg = null, lastTap = 0;
      function place(id, slot) {
        var cap = T.drop.cap(q, slot), occ = inSlot(q, st, slot).filter(function (x) { return x !== id; });
        if (cap && occ.length >= cap) occ.slice(0, occ.length - cap + 1).forEach(function (x) { st.pos[x] = null; });
        st.pos[id] = slot; st.sel = null; api.rerender();
      }
      function unplace(id) { st.pos[id] = null; st.sel = null; api.rerender(); }
      function tapChip(id) {
        if (st.pos[id] !== null) unplace(id);
        else { st.sel = st.sel === id ? null : id; api.rerender(); }
      }
      function down(e) {
        var el = e.target.closest('.ixc'); if (!el || (e.button && e.button > 0)) return;
        drg = { id: el.dataset.c, x: e.clientX, y: e.clientY, el: el, ghost: null };
      }
      function move(e) {
        if (!box.isConnected) { off(); return; }
        if (!drg) return;
        if (!drg.ghost && Math.abs(e.clientX - drg.x) + Math.abs(e.clientY - drg.y) > 8) {
          drg.ghost = drg.el.cloneNode(true); drg.ghost.classList.add('ghost'); drg.ghost.removeAttribute('data-c'); document.body.appendChild(drg.ghost); drg.el.classList.add('lift');
        }
        if (drg.ghost) { drg.ghost.style.left = (e.clientX - drg.ghost.offsetWidth / 2) + 'px'; drg.ghost.style.top = (e.clientY - drg.ghost.offsetHeight / 2) + 'px'; }
      }
      function up(e) {
        if (!drg) return;
        var d = drg; drg = null; lastTap = Date.now();
        if (d.ghost) {
          d.ghost.remove();
          var t = document.elementFromPoint(e.clientX, e.clientY), s = t && t.closest('[data-slot]');
          if (s && box.contains(s)) place(d.id, s.dataset.slot);
          else if (t && t.closest('.ix-pool') && box.contains(t)) unplace(d.id);
          else api.rerender();
        } else tapChip(d.id);
      }
      function off() { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', cancel); }
      function cancel() { if (drg && drg.ghost) drg.ghost.remove(); drg = null; if (box.isConnected) api.rerender(); }
      box.addEventListener('pointerdown', down);
      window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', cancel);
      box.addEventListener('click', function (e) {
        var act = e.target.closest('[data-act]');
        if (act) { if (act.dataset.act === 'check') api.check(); else { q.chips.forEach(function (c) { st.pos[c.id] = null; }); st.sel = null; api.rerender(); } return; }
        var chip = e.target.closest('.ixc');
        if (chip) { if (e.detail === 0) tapChip(chip.dataset.c); return; }
        if (Date.now() - lastTap < 120) return;
        var s = e.target.closest('[data-slot]');
        if (s) {
          var slot = s.dataset.slot, occ = inSlot(q, st, slot);
          if (st.sel) place(st.sel, slot); else if (occ.length && T.drop.cap(q, slot) === 1) unplace(occ[0]);
        } else if (e.target.closest('.ix-pool') && st.sel) { st.sel = null; api.rerender(); }
      });
      box.addEventListener('keydown', function (e) {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.closest && e.target.closest('g[data-slot]')) { e.preventDefault(); e.target.closest('g[data-slot]').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); }
      });
    },
    ready: function (q, st) {
      var miss = q.chips.filter(function (c) { return st.pos[c.id] === null; }).length;
      return miss ? 'ยังมีชิปเหลือในกล่องด้านล่าง ' + miss + ' ชิป วางให้ครบทุกช่องก่อนกดตรวจ' : true;
    },
    grade: function (q, st) {
      return slotsOf(q).every(function (s) { return inSlot(q, st, s.id).map(function (id) { return chipById(q, id).t; }).sort().join('|') === want(q, s.id).join('|'); });
    },
    solution: function (q) { return slotsOf(q).map(function (s) { return s.label + ' = ' + want(q, s.id).join(', '); }).join(' · '); }
  };

  /* ---------- type: path (tap graph nodes in order) ---------- */
  function edgeOf(q, a, b) { for (var i = 0; i < q.graph.edges.length; i++) if (q.graph.edges[i][0] === a && q.graph.edges[i][1] === b) return i; return -1; }
  T.path = {
    init: function (q, st) { st.seq = []; },
    view: function (q, st) {
      var walked = {}, want = {};
      for (var i = 1; i < st.seq.length; i++) walked[edgeOf(q, st.seq[i - 1], st.seq[i])] = 1;
      for (var j = 1; j < q.ans.length; j++) want[edgeOf(q, q.ans[j - 1], q.ans[j])] = 1;
      var good = st.checked && st.ok;
      var h = '<p class="ix-hint">' + (st.checked ? 'เส้นสีเขียวคือเส้นทางที่ถูก' + (st.ok ? '' : ' เส้นสีแดงคือเส้นทางที่คุณเลือก') : 'แตะ Node ตามลำดับการทำงาน เริ่มจาก Node แรก (แตะได้เฉพาะ Node ที่มีลูกศรต่อจาก Node ล่าสุด)') + '</p>';
      h += '<div class="ix-split">' + (q.code ? codeHtml(q.code) : '') +
        '<div class="ix-fig">' + drawGraph(q.graph, {
          node: !st.checked,
          cls: function (id) { var c = st.seq.indexOf(id) >= 0 ? 'on' : ''; if (st.checked && q.ans.indexOf(id) >= 0) c += ' ok'; if (st.checked && !good && st.seq.indexOf(id) >= 0 && q.ans.indexOf(id) < 0) c += ' no'; return c; },
          ecls: function (i) { if (st.checked) return want[i] ? 'ok' : (walked[i] ? 'no' : ''); return walked[i] ? 'walk' : ''; }
        }) + '</div></div>';
      h += '<p class="ix-seq"><span>เส้นทางที่เลือก:</span> <b>' + (st.seq.length ? st.seq.join(' → ') : '(ยังไม่ได้เลือก)') + '</b></p>';
      if (!st.checked) h += '<div class="ix-act"><button type="button" class="btn" data-act="check">ตรวจคำตอบ</button><button type="button" class="btn alt" data-act="undo">ลบตัวล่าสุด</button><button type="button" class="btn alt" data-act="clear">ล้างทั้งหมด</button></div><p class="ix-msg" aria-live="polite"></p>';
      return h;
    },
    bind: function (q, box, st, api) {
      if (st.checked) return;
      function step(id) {
        var last = st.seq[st.seq.length - 1];
        if (last !== undefined && edgeOf(q, last, id) < 0) { var m = box.querySelector('.ix-msg'); if (m) m.textContent = 'ไม่มีลูกศรจาก ' + last + ' ไป ' + id + ' ลองแตะ Node ที่ลูกศรชี้ไป'; return; }
        st.seq.push(id); api.rerender();
      }
      box.addEventListener('click', function (e) {
        var act = e.target.closest('[data-act]');
        if (act) { var a = act.dataset.act; if (a === 'check') api.check(); else if (a === 'undo') { st.seq.pop(); api.rerender(); } else { st.seq = []; api.rerender(); } return; }
        var n = e.target.closest('[data-n]'); if (n) step(n.dataset.n);
      });
      box.addEventListener('keydown', function (e) {
        var n = e.target.closest && e.target.closest('g[data-n]');
        if (n && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); step(n.dataset.n); }
      });
    },
    ready: function (q, st) { return st.seq.length >= 2 ? true : 'เลือกอย่างน้อย 2 Node ก่อนตรวจ'; },
    grade: function (q, st) { return st.seq.join(',') === q.ans.join(','); },
    solution: function (q) { return q.ans.join(' → '); }
  };

  /* ---------- type: num (fill numbers) ---------- */
  function parse(v) { v = String(v == null ? '' : v).trim(); return v === '' ? NaN : Number(v); }
  function fieldOk(f, v) { return f.ok ? !!f.ok(v) : v === f.ans; }
  T.num = {
    init: function (q, st) { st.v = q.fields.map(function () { return ''; }); },
    view: function (q, st) {
      var h = '<p class="ix-hint">' + (st.checked ? 'ตรวจแล้ว' : 'พิมพ์ตัวเลขในช่อง แล้วกดตรวจคำตอบ (กด Enter ก็ได้)') + '</p>';
      if (q.graph) h += '<div class="ix-split">' + (q.code ? codeHtml(q.code) : '') + '<div class="ix-fig">' + drawGraph(q.graph, {}) + '</div></div>';
      h += '<div class="ix-fields">' + q.fields.map(function (f, i) {
        var ok = st.checked ? fieldOk(f, parse(st.v[i])) : null;
        return '<label class="ix-f' + (ok === null ? '' : ok ? ' ok' : ' no') + '"><span>' + esc(f.label) + '</span><input class="ix-in" type="text" inputmode="decimal" autocomplete="off" data-i="' + i + '" value="' + esc(st.v[i]) + '"' + (st.checked ? ' disabled' : '') + '>' + (ok === false ? '<small>เฉลย ' + esc(f.show !== undefined ? f.show : f.ans) + '</small>' : '') + '</label>';
      }).join('') + '</div>';
      if (!st.checked) h += '<div class="ix-act"><button type="button" class="btn" data-act="check">ตรวจคำตอบ</button></div><p class="ix-msg" aria-live="polite"></p>';
      return h;
    },
    bind: function (q, box, st, api) {
      if (st.checked) return;
      box.addEventListener('input', function (e) { var i = e.target.dataset && e.target.dataset.i; if (i !== undefined) st.v[+i] = e.target.value; });
      box.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.classList.contains('ix-in')) { e.preventDefault(); api.check(); } });
      box.addEventListener('click', function (e) { if (e.target.closest('[data-act="check"]')) api.check(); });
    },
    ready: function (q, st) { return st.v.every(function (v) { return !isNaN(parse(v)); }) ? true : 'กรอกตัวเลขให้ครบทุกช่องก่อน'; },
    grade: function (q, st) { return q.fields.every(function (f, i) { return fieldOk(f, parse(st.v[i])); }); },
    solution: function (q) { return q.fields.map(function (f) { return f.label + ' = ' + (f.show !== undefined ? f.show : f.ans); }).join(' · '); }
  };

  /* ---------- type: table (blank cells the student types into). cell = {in, set:[numbers]} or {in, ok(numbers), show} ---------- */
  function numsOf(t) { return (String(t).match(/-?\d+(?:\.\d+)?/g) || []).map(Number); }
  function uniq(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }).sort(function (x, y) { return x - y; }).join(); }
  function cellList(q) { var o = []; q.rows.forEach(function (r) { r.forEach(function (c, j) { if (typeof c !== 'string') o.push({ c: c, label: r[0] + ' · ' + q.head[j] }); }); }); return o; }
  function cellOk(c, v) { var n = numsOf(v); return c.ok ? !!c.ok(n) : uniq(n) === uniq(c.set); }
  T.table = {
    init: function (q, st) { st.v = {}; },
    view: function (q, st) {
      var h = '<p class="ix-hint">' + (st.checked ? 'ตรวจแล้ว' : 'พิมพ์ตัวเลขลงในช่องว่างทุกช่อง คั่นด้วยจุลภาค เช่น -1, 0, 1 (ลำดับไม่สำคัญ) แล้วกดตรวจ') + '</p>';
      h += '<div class="ix-gridwrap"><table class="ix-grid"><thead><tr>' + q.head.map(function (x) { return '<th>' + esc(x) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        q.rows.map(function (r) {
          return '<tr>' + r.map(function (c) {
            if (typeof c === 'string') return '<td class="ix-st">' + esc(c) + '</td>';
            var ok = st.checked ? cellOk(c, st.v[c.in] || '') : null;
            return '<td class="ix-tc' + (ok === null ? '' : ok ? ' ok' : ' no') + '"><input class="ix-in ix-cell" type="text" autocomplete="off" data-id="' + c.in + '" value="' + esc(st.v[c.in] || '') + '"' + (st.checked ? ' disabled' : '') + ' aria-label="ช่องกรอก">' +
              (ok === false ? '<small>เฉลย ' + esc(c.show || c.set.join(', ')) + '</small>' : '') + '</td>';
          }).join('') + '</tr>';
        }).join('') + '</tbody></table></div>';
      if (!st.checked) h += '<div class="ix-act"><button type="button" class="btn" data-act="check">ตรวจคำตอบ</button></div><p class="ix-msg" aria-live="polite"></p>';
      return h;
    },
    bind: function (q, box, st, api) {
      if (st.checked) return;
      box.addEventListener('input', function (e) { var d = e.target.dataset && e.target.dataset.id; if (d) st.v[d] = e.target.value; });
      box.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.classList.contains('ix-cell')) { e.preventDefault(); api.check(); } });
      box.addEventListener('click', function (e) { if (e.target.closest('[data-act="check"]')) api.check(); });
    },
    ready: function (q, st) { return cellList(q).every(function (x) { return numsOf(st.v[x.c.in] || '').length; }) ? true : 'ยังมีช่องที่ว่างอยู่ พิมพ์ตัวเลขให้ครบทุกช่องก่อนตรวจ'; },
    grade: function (q, st) { return cellList(q).every(function (x) { return cellOk(x.c, st.v[x.c.in] || ''); }); },
    solution: function (q) { return cellList(q).map(function (x) { return x.label + ' = ' + (x.c.show || x.c.set.join(', ')); }).join(' · '); }
  };

  /* ---------- type: tap (tap the wrong spots on a DFD) ---------- */
  function tapExpected(q) {
    if (q.want) return q.want.slice();
    var set = [];
    root.QUIZ_ENGINE.check(q.spec).forEach(function (e) { var k = e.r === 2 ? 'n:' + e.id : 'f' + e.flow; if (set.indexOf(k) < 0) set.push(k); });
    return set;
  }
  function tapName(q, k) {
    var nm = {}; q.spec.n.forEach(function (n) { nm[n[1]] = n[2]; });
    if (k.charAt(0) === 'n') return (q.want ? '"' : 'Process "') + nm[k.slice(2)] + (q.want ? '"' : '" ไม่มี input หรือ output');
    var f = q.spec.f[+k.slice(1)];
    return 'Flow ' + nm[f[0]] + ' → ' + nm[f[1]] + (f[2] ? ' ("' + f[2] + '")' : ' (ไม่มีชื่อ)');
  }
  T.tap = {
    init: function (q, st) { st.sel = []; },
    view: function (q, st) {
      var want = tapExpected(q);
      var h = '<p class="ix-hint">' + (st.checked ? 'เขียว = เลือกถูก แดง = เลือกผิด เส้นประแดง = จุดผิดที่คุณพลาด' : 'แตะเส้น Flow หรือรูป Process ที่ผิดกฎ (แตะซ้ำเพื่อยกเลิก) เลือกได้หลายจุด') + '</p>';
      h += '<div class="qfig ix-fig">' + root.QUIZ_ENGINE.drawDFD(q.spec, function (k) {
        var on = st.sel.indexOf(k) >= 0, w = want.indexOf(k) >= 0;
        if (!st.checked) return on ? 'sel' : '';
        return on ? (w ? 'ok' : 'no') : (w ? 'miss' : '');
      }) + '</div>';
      h += '<p class="ix-seq"><span>เลือกแล้ว:</span> <b>' + st.sel.length + ' จุด</b></p>';
      if (!st.checked) h += '<div class="ix-act"><button type="button" class="btn" data-act="check">ตรวจคำตอบ</button><button type="button" class="btn alt" data-act="clear">ล้างที่เลือก</button></div><p class="ix-msg" aria-live="polite"></p>';
      return h;
    },
    bind: function (q, box, st, api) {
      if (st.checked) return;
      box.addEventListener('click', function (e) {
        var act = e.target.closest('[data-act]');
        if (act) { if (act.dataset.act === 'check') api.check(); else { st.sel = []; api.rerender(); } return; }
        var hit = e.target.closest('[data-k]'); if (!hit) return;
        var k = hit.getAttribute('data-k'), i = st.sel.indexOf(k);
        if (i >= 0) st.sel.splice(i, 1); else st.sel.push(k);
        api.rerender();
      });
    },
    ready: function (q, st) { return st.sel.length ? true : 'แตะอย่างน้อย 1 จุดก่อนตรวจ'; },
    grade: function (q, st) { var w = tapExpected(q); return w.length === st.sel.length && w.every(function (k) { return st.sel.indexOf(k) >= 0; }); },
    solution: function (q) { return tapExpected(q).map(function (k) { return tapName(q, k); }).join(' · '); }
  };

  /* ---------- mount ---------- */
  function mount(q, box, st, done) {
    var t = T[q.type];
    if (!st.init) { t.init(q, st); st.init = true; }
    function msg(s) { var m = box.querySelector('.ix-msg'); if (m) m.textContent = s || ''; }
    function render() { box.innerHTML = t.view(q, st); }
    function check() {
      if (st.checked) return;
      var r = t.ready ? t.ready(q, st) : true;
      if (r !== true) { msg(r); return; }
      st.checked = true; st.ok = t.grade(q, st);
      done(st.ok);
    }
    render();
    t.bind(q, box, st, { rerender: render, check: check });
  }

  root.QUIZ_IX = { code: codeHtml, slotsOf: slotsOf, mount: mount, solution: function (q) { return T[q.type].solution(q); }, types: Object.keys(T), drawGraph: drawGraph };
})(typeof window !== 'undefined' ? window : globalThis);
