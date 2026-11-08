/* DFD glossary: one data list drives the map on S1 and the tap-for-meaning popups on S1/S2. */
(function () {
  var M = "currentColor", A = "var(--accent-ink)";
  function c(h) { return h ? A : M; }
  function w(h) { return h ? 2.6 : 1.5; }
  function ent(x, y, h) { return '<rect x="' + x + '" y="' + y + '" width="24" height="18" fill="none" stroke="' + c(h) + '" stroke-width="' + w(h) + '"/>'; }
  function proc(x, y, n, h, pw, ph) {
    pw = pw || 30; ph = ph || 32;
    return '<rect x="' + x + '" y="' + y + '" width="' + pw + '" height="' + ph + '" rx="5" fill="none" stroke="' + c(h) + '" stroke-width="' + w(h) + '"/>' +
      '<line x1="' + x + '" y1="' + (y + 12) + '" x2="' + (x + pw) + '" y2="' + (y + 12) + '" stroke="' + c(h) + '" stroke-width="1.2"/>' +
      (n ? '<text x="' + (x + pw / 2) + '" y="' + (y + 10) + '" text-anchor="middle" font-size="10" fill="' + c(h) + '">' + n + '</text>' : "");
  }
  function arr(x1, y1, x2, y2, h, dash) {
    var a = Math.atan2(y2 - y1, x2 - x1), s = 6;
    var p1 = (x2 - s * Math.cos(a - .45)) + "," + (y2 - s * Math.sin(a - .45)), p2 = (x2 - s * Math.cos(a + .45)) + "," + (y2 - s * Math.sin(a + .45));
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + c(h) + '" stroke-width="' + w(h) + '"' + (dash ? ' stroke-dasharray="4 3"' : "") + '/>' +
      '<polygon points="' + x2 + "," + y2 + " " + p1 + " " + p2 + '" fill="' + c(h) + '"/>';
  }
  function store(x, y, h) {
    return '<path d="M' + (x + 30) + " " + y + "H" + x + "V" + (y + 16) + "H" + (x + 30) + "M" + (x + 9) + " " + y + "V" + (y + 16) + '" fill="none" stroke="' + c(h) + '" stroke-width="' + w(h) + '"/>';
  }
  function doc(x, y, ww, hh, h, inner) {
    return '<path d="M' + x + " " + y + "H" + (x + ww - 8) + "L" + (x + ww) + " " + (y + 8) + "V" + (y + hh) + "H" + x + 'Z" fill="none" stroke="' + c(h) + '" stroke-width="' + w(h) + '"/>' + (inner || "");
  }
  function lines(x, y, n, len) { var s = ""; for (var i = 0; i < n; i++) s += '<line x1="' + x + '" y1="' + (y + i * 7) + '" x2="' + (x + len - (i % 2) * 8) + '" y2="' + (y + i * 7) + '" stroke="' + M + '" stroke-width="1.2"/>'; return s; }
  function txt(x, y, t, h, size) { return '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-size="' + (size || 10) + '" fill="' + c(h) + '">' + t + "</text>"; }
  /* the small "Level 1 -> zoomed child" picture, with three highlight options */
  function zoom(hp, hz, hc) {
    return proc(4, 14, "1", hp, 28, 32) +
      '<path d="M32 14L54 4M32 46L54 56" fill="none" stroke="' + c(hz) + '" stroke-width="' + w(hz) + '" stroke-dasharray="3 3"/>' +
      '<rect x="54" y="4" width="64" height="52" fill="none" stroke="' + c(hc) + '" stroke-width="' + w(hc) + '"/>' +
      proc(58, 18, "1.1", hc, 24, 26) + arr(82, 31, 90, 31, false) + proc(90, 18, "1.2", hc, 24, 26);
  }
  function base(he, hp, hf, hs) { return ent(2, 21, he) + arr(26, 30, 44, 30, hf) + proc(44, 14, "1", hp) + arr(74, 30, 86, 30, hf) + store(87, 22, hs); }
  function table(hcol) {
    var s = '<rect x="8" y="6" width="104" height="48" fill="none" stroke="' + A + '" stroke-width="2"/>';
    s += '<line x1="40" y1="6" x2="40" y2="54" stroke="' + A + '" stroke-width="1.5"/><line x1="8" y1="30" x2="112" y2="30" stroke="' + A + '" stroke-width="1.5"/>';
    for (var i = 0; i < 4; i++) { var x = 58 + i * 16; s += '<line x1="' + (x - 8) + '" y1="6" x2="' + (x - 8) + '" y2="54" stroke="' + M + '" stroke-width=".8"/>';
      s += '<circle cx="' + x + '" cy="18" r="3.5" ' + (i % 2 ? 'fill="none" stroke="' + M + '"' : 'fill="' + M + '"') + '/><text x="' + x + '" y="46" text-anchor="middle" font-size="10" fill="' + M + '">✓</text>'; }
    return s + txt(24, 22, "IF", true, 9) + txt(24, 46, "DO", true, 9);
  }

  var T = [
    /* group 1: shapes */
    { g: 0, k: "external entity", re: /external entit(?:y|ies)/i, th: "คน องค์กร หรือระบบ<b>ภายนอก</b>ที่ส่งหรือรับข้อมูลกับระบบ (producer/consumer of data) วาดเป็นสี่เหลี่ยม", svg: base(true) },
    { g: 0, k: "process", re: /process(?:es)?(?! spec)/i, th: "<b>ตัวแปลงข้อมูล</b> รับ input มาทำอะไรสักอย่าง แล้วส่ง output ออก มีเลขกำกับด้านบน (Gane/Sarson เป็นกล่องมุมมน)", svg: base(false, true) },
    { g: 0, k: "data flow", re: /data ?flows?(?! diagram)/i, th: "ลูกศร = <b>ข้อมูลที่กำลังเคลื่อนที่</b> ต้องมีชื่อเสมอ และปลายข้างหนึ่งต้องเป็น process", svg: base(false, false, true) },
    { g: 0, k: "data store", re: /data ?stores?/i, th: "<b>ที่เก็บข้อมูลถาวร</b> (ไฟล์/ฐานข้อมูล) มีเลข D1, D2 เชื่อมได้กับ process เท่านั้น ลูกศรออก = อ่าน ลูกศรเข้า = เขียน", svg: base(false, false, false, true) },
    { g: 0, k: "control flow", re: /control flows?/i, th: "<b>ลูกศรเส้นประ</b> = สัญญาณ/event (จริงหรือเท็จ) ที่สั่งให้ process ทำงาน ไม่ใช่ข้อมูล", svg: proc(46, 14, "", false) + arr(4, 30, 44, 30, true, true) + arr(76, 30, 112, 30, false) + txt(22, 22, "OK", true, 9) },
    /* group 2: levels and zoom */
    { g: 1, k: "context diagram", re: /context diagram|level[- ]0(?! process)/i, th: "<b>ภาพบนสุด (Level 0)</b> ทั้งระบบเป็น process เดียวเลข <b>0</b> รอบๆ เป็น external entity ทั้งหมด", svg: ent(2, 21) + arr(26, 30, 42, 30) + proc(42, 14, "0", true, 36) + arr(78, 30, 94, 30) + ent(94, 21) },
    { g: 1, k: "level", re: /level ?[123]\b/i, th: "<b>ระดับการซูม</b>: Level 0 = context (เลข 0) • Level 1 = เลข 1, 2, 3 • Level 2 = 1.1, 1.2 • Level 3 = 1.1.1", svg: zoom(true, false, true) },
    { g: 1, k: "detailed dfd", re: /detailed dfd/i, th: "DFD ที่<b>ซูมลงมาแล้ว</b> (Level 1 ลงไป) แตกเป็นหลาย process มีได้ <b>1–7 process</b> ต่อภาพ", svg: proc(4, 16, "1", true, 24, 28) + arr(28, 30, 46, 30) + proc(46, 16, "2", true, 24, 28) + arr(70, 30, 88, 30) + proc(88, 16, "3", true, 24, 28) },
    { g: 1, k: "parent diagram", re: /parent(?: diagram| process)?/i, th: "<b>ภาพแม่</b> = ภาพระดับบน ที่มี process ซึ่งจะถูกซูมลงไป", svg: zoom(true, false, false) },
    { g: 1, k: "child diagram", re: /child(?: diagram)?/i, th: "<b>ภาพลูก</b> = ภาพที่ได้จากการซูม process หนึ่งของภาพแม่ ให้เห็นรายละเอียดข้างใน", svg: zoom(false, false, true) },
    { g: 1, k: "decomposition", re: /decompos\w*/i, th: "<b>การแตก/ซูม</b> process หนึ่งออกเป็นภาพลูกที่ละเอียดขึ้น", svg: zoom(false, true, false) },
    { g: 1, k: "balancing", re: /balanc\w*/i, th: "<b>ซูมแล้วของเข้า-ออกต้องเท่าเดิม</b>: flow เข้า/ออกของ process แม่ ต้องโผล่ที่ขอบภาพลูกครบ ไม่ขาดไม่เกิน ส่วนข้างในเพิ่มได้", svg: arr(2, 30, 14, 30, true) + proc(14, 16, "1", false, 24, 28) + arr(38, 30, 50, 30, true) + txt(56, 34, "=", false, 14) + '<rect x="66" y="8" width="44" height="44" fill="none" stroke="' + M + '" stroke-width="1.2" stroke-dasharray="3 3"/>' + arr(62, 30, 72, 30, true) + proc(72, 22, "", false, 14, 16) + arr(86, 30, 92, 30) + proc(92, 22, "", false, 14, 16) + arr(106, 30, 118, 30, true) },
    { g: 1, k: "primitive process", re: /primitive process(?: spec\w*)?/i, th: "process <b>ชั้นล่างสุด</b> ที่ไม่ซูมต่อแล้ว อธิบายข้างในด้วย PSPEC แทน", svg: proc(10, 14, "1.1.1", true, 40) + arr(50, 30, 76, 30, false, true) + doc(78, 12, 30, 36, false, lines(84, 24, 3, 18)) },
    /* group 3: checks */
    { g: 2, k: "internal consistency", re: /internal consistency/i, th: "ตรวจความถูกต้อง<b>ภายในภาพเดียว</b>: ทุกอย่างมีชื่อ, process มีทั้ง in และ out, ไม่เกิน 7 process, flow มี process ปลายหนึ่ง", svg: base() + '<rect x="0" y="4" width="120" height="52" fill="none" stroke="' + A + '" stroke-width="2" stroke-dasharray="5 3"/>' },
    { g: 2, k: "hierarchical consistency", re: /hierarchical consistency/i, th: "ตรวจความถูกต้อง<b>ระหว่างชั้น</b> (แม่-ลูก): เลขตรงกับแม่, flow แม่-ลูกตรงกัน, ทุกภาพมีแม่ยกเว้น context", svg: zoom(false, true, false) },
    /* group 4: descriptions */
    { g: 3, k: "pspec", re: /pspec|process specification/i, th: "<b>ใบอธิบายว่า process ข้างในทำอะไร</b> เขียนเป็น narrative, pseudocode, สมการ, ตาราง หรือแผนภาพก็ได้", svg: proc(8, 14, "1.1", false) + arr(38, 30, 62, 30, false, true) + doc(64, 6, 46, 48, true, lines(71, 22, 4, 30)) },
    { g: 3, k: "structured english", re: /structured english/i, th: "PSPEC แบบ<b>ภาษาอังกฤษเขียนเหมือนโค้ด</b>: IF-THEN-ELSE, CASE, REPEAT-UNTIL, DO WHILE", svg: doc(14, 4, 92, 52, true, '<g font-family="Consolas,monospace" font-size="10" fill="' + M + '"><text x="22" y="20">IF ...</text><text x="30" y="33">THEN ...</text><text x="30" y="46">ELSE ...</text></g>') },
    { g: 3, k: "decision table", re: /decision tables?/i, th: "PSPEC แบบ<b>ตาราง</b>: เงื่อนไข (conditions) × กฎ (rules) บอกว่าต้องทำอะไร (actions)", svg: table() },
    { g: 3, k: "policy", re: /polic(?:y|ies)/i, th: "<b>ชุดกฎ</b>ที่บอกว่าจะทำ process อย่างไร มักเขียนออกมาเป็น decision table", svg: table() },
    { g: 3, k: "cspec", re: /cspec|control specification/i, th: "<b>ใบอธิบาย control flow</b> ว่า event ไหนทำให้เกิดอะไร (state diagram หรือตาราง)", svg: doc(14, 4, 92, 52, true, '<circle cx="40" cy="32" r="9" fill="none" stroke="' + M + '" stroke-width="1.5"/><circle cx="84" cy="32" r="9" fill="none" stroke="' + M + '" stroke-width="1.5"/>' + arr(49, 32, 75, 32)) },
    { g: 3, k: "data dictionary", re: /data dictionary/i, th: "<b>พจนานุกรมข้อมูล</b> บอกว่า flow/store แต่ละตัวประกอบด้วยข้อมูลอะไรบ้าง", svg: doc(14, 4, 92, 52, true, '<g font-family="Consolas,monospace" font-size="10" fill="' + M + '"><text x="22" y="22">order =</text><text x="30" y="36">id + item</text><text x="30" y="49">+ qty</text></g>') }
  ];
  function svg(t) { return '<svg class="gi" viewBox="0 0 120 60" aria-hidden="true" font-family="Chakra Petch,sans-serif">' + t.svg + "</svg>"; }
  function name(t) { return t.k.replace(/\b\w/g, function (m) { return m.toUpperCase(); }).replace("Pspec", "PSPEC").replace("Cspec", "CSPEC").replace("Dfd", "DFD"); }

  /* 1. map */
  var map = document.getElementById("glmap");
  if (map) {
    var G = ["1 · ชิ้นส่วนในภาพ (วาดอะไรได้บ้าง)", "2 · ระดับและการซูม (ภาพไหนอยู่ชั้นไหน)", "3 · การตรวจ (ถูกต้องไหม)", "4 · ใบอธิบาย (ข้างใน process ทำอะไร)"];
    map.innerHTML = G.map(function (g, gi) {
      return '<h3 class="subsec">' + g + '</h3><div class="glgrid">' + T.filter(function (t) { return t.g === gi; }).map(function (t) {
        return '<div class="gcard">' + svg(t) + '<b class="gt">' + name(t) + "</b><span>" + t.th + "</span></div>";
      }).join("") + "</div>";
    }).join("");
  }

  /* 2. dashed terms with a popup meaning */
  var all = new RegExp(T.map(function (t) { return "(\\b(?:" + t.re.source + "))"; }).join("|"), "gi");
  var blocks = document.querySelectorAll("#dfd p, #dfd li, #dfd td, #dfd .def, #err p, #err li, #err td");
  /* mark each term once per h2 section, so the page is not covered in dashes */
  var seenBy = new Map();
  function section(bl) {
    var e = bl; while (e.parentElement && !e.parentElement.classList.contains("page")) e = e.parentElement;
    while (e && e.tagName !== "H2") e = e.previousElementSibling;
    return e || bl.closest(".page");
  }
  blocks.forEach(function (bl) {
    if (bl.closest("#glmap, .hunt, figure, .chk")) return;
    var sec = section(bl); if (!seenBy.has(sec)) seenBy.set(sec, {});
    var seen = seenBy.get(sec), walker = document.createTreeWalker(bl, NodeFilter.SHOW_TEXT, null), nodes = [], n;
    while ((n = walker.nextNode())) if (!n.parentNode.closest("code, a, .term, h1, h2, h3, th")) nodes.push(n);
    nodes.forEach(function (node) {
      var s = node.nodeValue, out = [], last = 0, m;
      all.lastIndex = 0;
      while ((m = all.exec(s))) {
        var i = 1; while (!m[i]) i++;
        var t = T[i - 1]; if (seen[t.k]) continue; seen[t.k] = 1;
        out.push(document.createTextNode(s.slice(last, m.index)));
        var sp = document.createElement("span"); sp.className = "term"; sp.tabIndex = 0; sp.setAttribute("role", "button");
        sp.setAttribute("aria-label", m[0] + ": ดูความหมาย"); sp.dataset.i = i - 1; sp.textContent = m[0]; out.push(sp);
        last = m.index + m[0].length;
      }
      if (!out.length) return;
      out.push(document.createTextNode(s.slice(last)));
      var f = document.createDocumentFragment(); out.forEach(function (x) { f.appendChild(x); });
      node.parentNode.replaceChild(f, node);
    });
  });

  var tip = document.createElement("div"); tip.id = "gtip"; tip.setAttribute("role", "tooltip"); tip.hidden = true; document.body.appendChild(tip);
  var cur = null;
  function show(el) {
    var t = T[+el.dataset.i]; cur = el;
    tip.innerHTML = svg(t) + '<b class="gt">' + name(t) + "</b><span>" + t.th + '</span><a href="#dfd" class="gmore">ดูแผนที่คำศัพท์ทั้งหมด</a>';
    tip.hidden = false; el.setAttribute("aria-describedby", "gtip");
    var r = el.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
    var x = Math.max(8, Math.min(r.left, innerWidth - tw - 8)), y = r.bottom + 8;
    if (y + th > innerHeight - 8) y = Math.max(8, r.top - th - 8);
    tip.style.left = x + "px"; tip.style.top = y + "px";
  }
  var ht = 0;
  function hide() { clearTimeout(ht); if (cur) cur.removeAttribute("aria-describedby"); cur = null; tip.hidden = true; }
  /* mouse: short grace period so the pointer can travel from the word into the popup */
  function later() { clearTimeout(ht); ht = setTimeout(hide, 250); }
  document.addEventListener("pointerover", function (e) { var el = e.target.closest && e.target.closest(".term"); if (el && e.pointerType === "mouse") { clearTimeout(ht); show(el); } });
  document.addEventListener("pointerout", function (e) { var el = e.target.closest && e.target.closest(".term"); if (el && e.pointerType === "mouse") later(); });
  tip.addEventListener("pointerenter", function () { clearTimeout(ht); });
  tip.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") later(); });
  document.addEventListener("click", function (e) {
    var el = e.target.closest(".term");
    if (el) { show(el); return; }
    if (e.target.closest(".gmore")) { hide(); setTimeout(function () { var g = document.getElementById("glmap"); if (g) g.scrollIntoView({ block: "start" }); }, 150); return; }
    if (!tip.contains(e.target)) hide();
  });
  document.addEventListener("focusin", function (e) { if (e.target.classList && e.target.classList.contains("term")) show(e.target); else if (!tip.contains(e.target)) hide(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && cur) { var el = cur; hide(); el.focus(); }
    if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("term")) { e.preventDefault(); show(e.target); }
  });
  addEventListener("scroll", function () { if (cur && document.activeElement !== cur) hide(); else if (cur) show(cur); }, { passive: true });
  addEventListener("hashchange", hide);
  window.GLOSSARY = T; /* for tests */
})();
