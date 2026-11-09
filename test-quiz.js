// Self-check for the Mock Exam: node test-quiz.js
// Answers are re-derived from rules or from executable twins of the shown code, never copied from the data.
const fs = require('fs'), vm = require('vm'), assert = require('assert');
const ctx = { console }; ctx.globalThis = ctx; vm.createContext(ctx);
['quiz-data.js', 'quiz-data4.js', 'quiz-data5.js', 'quiz-interact.js', 'quiz.js'].forEach(f => vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f }));
const E = ctx.QUIZ_ENGINE, IX = ctx.QUIZ_IX, P = ctx.MOCK_PARTS, qs = P.qs;
const has = (g, a, b) => g.edges.some(e => e[0] === a && e[1] === b);
const decisions = g => new Set(g.edges.map(e => e[0]).filter(n => g.edges.filter(e => e[0] === n).length > 1)).size;

// ---- shape: 40 questions, topic mix, every question well formed
assert.strictEqual(qs.length, 40);
const cnt = {}; qs.forEach(q => cnt[q.tp] = (cnt[q.tp] || 0) + 1);
assert.strictEqual(JSON.stringify(cnt, Object.keys(cnt).sort()), JSON.stringify({ DFD: 10, ERR: 10, GIT: 8, UNIT: 12 }), 'topic mix ' + JSON.stringify(cnt));
qs.forEach((q0, i) => {
  const q = E.autoQuestion(q0), id = 'Q#' + (i + 1) + ' [' + q.tp + ']';
  if (!q.type) { assert.strictEqual(q.o.length, 4, id + ' needs 4 options'); assert(q.o[q.a], id + ' a'); return; }
  assert(IX.types.includes(q.type), id + ' type'); assert.strictEqual(q.a, 1, id);
  if (q.code) assert(IX.code(q.code).includes('vs-l'), id + ' code renders');
  if (q.type === 'drop') {
    const slotIds = IX.slotsOf(q).map(s => s.id);
    assert.strictEqual(new Set(slotIds).size, slotIds.length, id + ' duplicate slot ids');
    assert.strictEqual(new Set(q.chips.map(c => c.id)).size, q.chips.length, id + ' duplicate chip ids');
    q.chips.forEach(c => assert(slotIds.includes(c.to), id + ' chip "' + c.t + '" has no slot'));
    if (q.layout !== 'buckets') { assert.strictEqual(q.chips.length, q.slots.length, id + ' chips must equal slots'); assert.strictEqual(new Set(q.chips.map(c => c.to)).size, q.slots.length, id + ' two chips share a slot'); }
    else slotIds.forEach(s => assert(q.chips.some(c => c.to === s), id + ' empty bucket ' + s));
    if (q.layout === 'svg') { q.slots.forEach(s => assert(q.graph.nodes.some(n => n.id === s.id && n.slot), id + ' slot not a node')); const txt = q.code.map(l => l[0]).join('\n'); q.chips.forEach(c => assert(txt.includes(c.t), id + ' chip "' + c.t + '" not in code')); }
  }
  if (q.type === 'table') q.rows.forEach(r => assert.strictEqual(r.length, q.head.length, id + ' row width'));
  if (q.type === 'path' || q.type === 'num') q.graph.edges.forEach(e => { const n = new Set(q.graph.nodes.map(x => x.id)); assert(n.has(e[0]) && n.has(e[1]), id + ' edge to missing node'); });
});

// ---- DFD tap: errors derived by the rule checker, reading questions by predicate
const tapq = qs.filter(q => q.type === 'tap');
assert.strictEqual(tapq.length, 7);
tapq.forEach(q => {
  const keys = new Set(); E.check(q.spec).forEach(e => keys.add(e.r === 2 ? 'n:' + e.id : 'f' + e.flow));
  if (q.tp === 'ERR') assert.strictEqual(keys.size, q.n, 'ERR tap expects ' + q.n + ' got ' + keys.size);
  else { assert(q.want.length >= 2, 'DFD tap want'); assert.strictEqual(E.check(q.spec).length, 0, 'reading diagram must be error-free'); }
});
const tapDfd = P.all.filter(q => q.type === 'tap' && q.tp === 'DFD');
assert.strictEqual(tapDfd.map(q => q.want.join()).join('|'), 'n:s,n:a|f2,f3|f1,f3');

// ---- ECP/BVA tables
const ecp1 = P.all.find(q => q.q.includes('หาค่ามากที่สุด')), ecp2 = P.all.find(q => q.q.includes('ช่องกรอกรับจำนวนเต็ม'));
const okOf = (q, row) => q.rows[row][1].ok;
assert(okOf(ecp1, 0)([10, 7]) && !okOf(ecp1, 0)([7, 10]) && !okOf(ecp1, 0)([6, 6]) && okOf(ecp1, 1)([8, 12]) && okOf(ecp1, 2)([6, 6]) && !okOf(ecp1, 2)([6, 7]) && !okOf(ecp1, 2)([6]));
for (let v = -3; v <= 1004; v++) { assert.strictEqual(okOf(ecp2, 0)([v]), v <= 0); assert.strictEqual(okOf(ecp2, 1)([v]), v >= 1 && v <= 1000); assert.strictEqual(okOf(ecp2, 2)([v]), v >= 1001); }
const allC = ([, lo, hi]) => lo === -Infinity ? [hi, hi + 1] : hi === Infinity ? [lo - 1, lo] : [lo - 1, lo, lo + 1, hi - 1, hi, hi + 1];
const belong = c => allC(c).filter(v => v >= c[1] && v <= c[2]);
const reduced = c => c[1] === -Infinity || c[2] === Infinity ? belong(c) : [c[1], c[2]];
const sorted = a => a.slice().sort((x, y) => x - y).join();
const bva1 = P.all.find(q => q.q.includes('Age Classification')), bva2 = P.all.find(q => q.q.includes('Exercise 4'));
[[bva1, [['Low', -Infinity, -1], ['0-12', 0, 12], ['13-19', 13, 19], ['20-35', 20, 35], ['36-120', 36, 120], ['High', 121, Infinity]]],
 [bva2, [['<1', -Infinity, 0], ['1-1000', 1, 1000], ['>1000', 1001, Infinity]]]].forEach(([q, cl]) => {
  assert.strictEqual(q.rows.length, cl.length);
  cl.forEach((c, i) => { const [, a, b, r] = q.rows[i]; assert.strictEqual(sorted(a.set), sorted(allC(c)), 'All ' + c[0]); assert.strictEqual(sorted(b.set), sorted(belong(c)), 'Belonging ' + c[0]); assert.strictEqual(sorted(r.set), sorted(reduced(c)), 'Reduced ' + c[0]); });
});

// ---- flow charts: twin of the code -> trace -> every step is an edge, and slot text = statement
const [fc1, fc2] = P.all.filter(q => q.layout === 'svg');
const txt1 = { n1: 'int x = sc.nextInt();', n2: 'String r = "odd";', n3: 'x % 2 == 0', n4: 'r = "even";', n5: 'System.out.println(r);' };
fc1.chips.forEach(c => assert.strictEqual(txt1[c.to], c.t));
const txt2 = { n1: 'int sum = 0;', n2: 'int i = 1;', n3: 'i <= n', n4: 'sum += i;', n5: 'i++;', n6: 'System.out.println(sum);' };
fc2.chips.forEach(c => assert.strictEqual(txt2[c.to], c.t));
function run1(x) { const t = ['s', 'n1', 'n2', 'n3']; if (x % 2 === 0) t.push('n4'); t.push('n5', 'e'); return t; }
function run2(n) { const t = ['s', 'n1', 'n2', 'n3']; for (let i = 1; i <= n; i++) t.push('n4', 'n5', 'n3'); t.push('n6', 'e'); return t; }
const edgesOk = (g, t, m) => { for (let k = 1; k < t.length; k++) assert(has(g, t[k - 1], t[k]), m + ' missing edge ' + t[k - 1] + '->' + t[k]); };
[3, 4, 0].forEach(x => edgesOk(fc1.graph, run1(x), 'FC1 x=' + x)); [0, 1, 2, 5].forEach(n => edgesOk(fc2.graph, run2(n), 'FC2 n=' + n));
assert.strictEqual(fc1.graph.edges.length, 7); assert.strictEqual(fc2.graph.edges.length, 8);

// ---- path / V(G) / test case (two-if code and loop code)
function runIf(score) { const t = ['1', '2']; t.push(score >= 50 ? '3' : '4'); t.push('5'); if (score >= 80) t.push('6'); t.push('7'); return t; }
function runLoop(a) { const t = ['1', '2']; for (let i = 0; i < a.length; i++) { t.push('3'); if (a[i] > 0) t.push('4'); t.push('5', '2'); } t.push('6'); return t; }
const [path1, path2] = P.all.filter(q => q.type === 'path'), [vg1, vg2] = P.all.filter(q => q.type === 'num' && q.fields.length === 3), tc1 = P.all.find(q => q.type === 'num' && q.fields.length === 1);
[0, 30, 49, 50, 79, 80, 90, 100].forEach(s => edgesOk(path1.graph, runIf(s), 'IF score ' + s));
[[], [5], [5, -2], [-1, -1], [1, 2, 3]].forEach(a => edgesOk(path2.graph, runLoop(a), 'LOOP ' + JSON.stringify(a)));
assert.strictEqual(path1.ans.join(), runIf(90).join()); assert.strictEqual(path2.ans.join(), runLoop([5, -2]).join());
[[vg1, 8, 7], [vg2, 7, 6]].forEach(([q, e, n]) => {
  assert.strictEqual(q.graph.edges.length, e); assert.strictEqual(q.graph.nodes.length, n);
  const f = Object.fromEntries(q.fields.map(x => [x.label, x.ans])); assert.strictEqual(f['E (edges)'], e); assert.strictEqual(f['N (nodes)'], n); assert.strictEqual(f['V(G)'], e - n + 2);
  assert.strictEqual(e - n + 2, decisions(q.graph) + 1, 'V(G) = decisions + 1');
});
assert.strictEqual(new Set([20, 60, 90].map(s => runIf(s).join())).size, 3);
for (let s = -5; s <= 120; s++) assert.strictEqual(runIf(s).join() === '1,2,4,5,7', tc1.fields[0].ok(s), 'TC score ' + s);
assert(!tc1.fields[0].ok(30.5));
console.log('all checks passed: ' + qs.length + ' questions ' + JSON.stringify(cnt));
