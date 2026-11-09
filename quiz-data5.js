/* Mock Exam: 40 questions, four topics mixed in one set (DFD 10, Error detection 10, Git 8, Unit test 12).
   Interactive: drop (drag chips), tap (tap spots on a DFD), table (type numbers into blank cells), path (tap graph nodes), num (type numbers).
   Plain multiple-choice questions are taken from the existing banks (quiz-data.js, quiz-data4.js).
   Interactive questions carry a:1 (engine stores 1 = right, 0 = wrong) and tp = topic tag. */
(function (root) {
  'use strict';
  function X(tp, type, q, extra, why, src) { var r = { tp: tp, type: type, q: q, a: 1, why: why, src: src }; for (var k in extra) r[k] = extra[k]; return r; }
  function C(id, t, to) { return { id: id, t: t, to: to }; }
  function order(labels, cmds) { return { layout: 'rows', slots: labels.map(function (l, i) { return { id: 's' + i, label: l }; }), chips: cmds.map(function (c, i) { return C('c' + i, c, 's' + i); }) }; }
  function match(pairs) { return { layout: 'rows', slots: pairs.map(function (p, i) { return { id: 's' + i, label: p[0] }; }), chips: pairs.map(function (p, i) { return C('c' + i, p[1], 's' + i); }) }; }
  var R = 'ขั้นที่ ';

  /* ================= DFD understanding (4 interactive) ================= */
  var dfdMatch = X('DFD', 'drop', '<b>ลากความหมายไปจับคู่</b> กับองค์ประกอบของ DFD แต่ละตัว',
    match([['External entity', 'แหล่งหรือปลายทางของข้อมูลที่อยู่นอกระบบ'], ['Process', 'แปลงข้อมูลขาเข้าให้เป็นข้อมูลขาออก'], ['Data store', 'ที่เก็บข้อมูลไว้ใช้ภายหลัง'], ['Data flow', 'ข้อมูลที่เคลื่อนที่ระหว่างองค์ประกอบ']]),
    'External entity อยู่นอกระบบ, Process เปลี่ยนข้อมูล, Data store เก็บข้อมูล, Data flow คือเส้นข้อมูล', 'L6 หน้า 27–28');

  var SA = { w: 700, h: 340,
    n: [['e', 's', 'นักศึกษา', 70, 90], ['e', 'a', 'อาจารย์', 70, 270], ['p', 'p1', 'ลงทะเบียน', 330, 90, '1.0'], ['p', 'p2', 'อนุมัติ', 330, 270, '2.0'], ['s', 'd1', 'ผลลงทะเบียน', 600, 180, 'D1']],
    f: [['s', 'p1', 'คำขอลงทะเบียน'], ['p1', 'd1', 'ข้อมูลลงทะเบียน'], ['d1', 'p2', 'รายการรออนุมัติ'], ['a', 'p2', 'คำตัดสิน'], ['p2', 'd1', 'สถานะอนุมัติ'], ['p2', 's', 'ผลแจ้งนักศึกษา']] };
  var SB = { w: 780, h: 340,
    n: [['e', 'c', 'ลูกค้า', 70, 90], ['p', 'o', 'รับออเดอร์', 290, 90, '1.0'], ['s', 'm', 'เมนู', 290, 250, 'D1'], ['p', 'k', 'ชงเครื่องดื่ม', 510, 90, '2.0'], ['s', 'st', 'วัตถุดิบ', 510, 260, 'D2'], ['e', 'w', 'พนักงาน', 700, 90]],
    f: [['c', 'o', 'ออเดอร์'], ['m', 'o', 'ราคาเมนู'], ['o', 'k', 'ใบสั่งชง'], ['st', 'k', 'คงเหลือ'], ['k', 'st', 'ใช้ไป'], ['k', 'w', 'เครื่องดื่ม']] };
  function fk(spec, fn) { var o = []; spec.f.forEach(function (f, i) { if (fn(f)) o.push('f' + i); }); return o; }
  function nk(spec, fn) { var o = []; spec.n.forEach(function (n) { if (fn(n)) o.push('n:' + n[1]); }); return o; }
  var dfdTap1 = X('DFD', 'tap', 'จาก DFD นี้ <b>แตะ External entity ทั้งหมด</b> (กล่องสี่เหลี่ยมนอกระบบ)', { spec: SA, want: nk(SA, function (n) { return n[0] === 'e'; }) },
    'External entity คือกล่องสี่เหลี่ยมที่อยู่นอกระบบ ในรูปนี้มี "นักศึกษา" และ "อาจารย์"', 'L6 หน้า 27–28');
  var dfdTap2 = X('DFD', 'tap', 'จาก DFD นี้ <b>แตะ Data flow ทุกเส้นที่เข้าสู่ Process 2.0 (อนุมัติ)</b>', { spec: SA, want: fk(SA, function (f) { return f[1] === 'p2'; }) },
    'Flow ที่เข้า Process 2.0 คือลูกศรที่ปลายชี้ไปที่ 2.0: "รายการรออนุมัติ" จาก D1 และ "คำตัดสิน" จากอาจารย์', 'L6 หน้า 27–28');
  var dfdTap3 = X('DFD', 'tap', 'จาก DFD นี้ <b>แตะ Data flow ทุกเส้นที่ออกจาก Data store</b>', { spec: SB, want: fk(SB, function (f) { return f[0] === 'm' || f[0] === 'st'; }) },
    'Flow ที่ออกจาก Data store คือลูกศรที่เริ่มจากกล่อง D1 หรือ D2 ซึ่งมี "ราคาเมนู" และ "คงเหลือ" (ส่วน "ใช้ไป" เป็นขาเข้า D2)', 'L6 หน้า 27–28');

  /* ================= Error detection (4 interactive) ================= */
  function errQ(n, spec, why) { return X('ERR', 'tap', '<b>แตะจุดที่ผิดกฎของ DFD</b> ให้ครบ (มีทั้งหมด ' + n + ' จุด) แตะได้ทั้งเส้น Flow และกล่อง Process', { spec: spec, n: n }, why, 'L7 หน้า 9; L6 หน้า 27–28'); }
  var err1 = errQ(2, { w: 700, h: 340,
    n: [['e', 'm', 'สมาชิก', 70, 80], ['p', 'p1', 'ยืมหนังสือ', 330, 80, '1.0'], ['s', 'd1', 'การยืม', 330, 240, 'D1'], ['e', 'l', 'บรรณารักษ์', 70, 260]],
    f: [['m', 'p1', 'คำขอยืม'], ['p1', 'd1', 'รายการยืม'], ['m', 'l', 'คำถาม'], ['p1', 'l', '']] },
    'ผิด 2 จุด: Flow "คำถาม" ต่อ External entity กับ External entity โดยตรง ไม่ผ่าน process และ Flow จาก process ไปบรรณารักษ์ไม่มีชื่อ');
  var err2 = errQ(2, { w: 700, h: 360,
    n: [['e', 'c', 'ลูกค้า', 70, 170], ['p', 'p1', 'รับชำระเงิน', 320, 170, '1.0'], ['s', 'd1', 'ใบเสร็จ', 580, 90, 'D1'], ['p', 'p2', 'ออกใบเสร็จ', 190, 310, '2.0'], ['p', 'p3', 'สรุปยอดขาย', 470, 310, '3.0']],
    f: [['c', 'p1', 'เงินสด'], ['p1', 'd1', 'รายการชำระ'], ['p2', 'c', 'ใบเสร็จ'], ['p1', 'p3', 'ยอดชำระ']] },
    'ผิด 2 จุด: Process 2.0 มี output แต่ไม่มี input (ข้อมูลโผล่มาจากไหนไม่รู้) และ Process 3.0 มี input แต่ไม่มี output (ข้อมูลหายเข้าหลุมดำ)');
  var err3 = errQ(2, { w: 700, h: 360,
    n: [['e', 'u', 'ผู้ใช้', 70, 170], ['p', 'p1', 'สมัครสมาชิก', 330, 80, '1.0'], ['s', 'd1', 'ผู้ใช้', 590, 80, 'D1'], ['s', 'd2', 'ประวัติ', 590, 290, 'D2'], ['p', 'p2', 'ส่งอีเมล', 330, 290, '2.0']],
    f: [['u', 'p1', 'ข้อมูลสมัคร'], ['p1', 'd1', 'ข้อมูลผู้ใช้'], ['d1', 'd2', 'ข้อมูลสำรอง'], ['p1', 'p2', ''], ['p2', 'u', 'อีเมลยืนยัน']] },
    'ผิด 2 จุด: Flow "ข้อมูลสำรอง" ต่อ Data store กับ Data store โดยตรง และ Flow จาก 1.0 ไป 2.0 ไม่มีชื่อ');
  var err4 = errQ(3, { w: 700, h: 360,
    n: [['e', 't', 'ครู', 70, 70], ['p', 'p1', 'บันทึกคะแนน', 320, 70, '1.0'], ['s', 'd1', 'คะแนน', 320, 190, 'D1'], ['p', 'p2', 'คิดเกรด', 320, 310, '2.0'], ['e', 's', 'นักเรียน', 600, 70], ['p', 'p3', 'รายงานผล', 600, 310, '3.0']],
    f: [['t', 'p1', 'คะแนนสอบ'], ['p1', 'd1', 'คะแนนรวม'], ['d1', 'p2', 'คะแนน'], ['s', 'd1', 'ผลการเรียน'], ['d1', 'p3', ''], ['p3', 's', 'ใบรายงานผล']] },
    'ผิด 3 จุด: Flow "ผลการเรียน" ต่อ External entity กับ Data store โดยตรง, Flow จาก D1 ไป 3.0 ไม่มีชื่อ และ Process 2.0 มี input แต่ไม่มี output');

  /* ================= Git (4 interactive) ================= */
  var gitOrder1 = X('GIT', 'drop', 'คุณ <b>clone</b> โปรเจกต์มา แก้ไฟล์ แล้วต้องส่งงานขึ้น remote <b>เรียงคำสั่ง</b> ให้ถูกตามลำดับ',
    order([R + '1', R + '2', R + '3', R + '4'], ['git clone [url]', 'git add [file]', 'git commit -m "msg"', 'git push']),
    'clone ดึงโปรเจกต์ → add นำไฟล์เข้า staging → commit บันทึกลง local repository → push ส่งขึ้น remote', 'L11; Git cheat sheet');
  var gitOrder2 = X('GIT', 'drop', 'อยากทำฟีเจอร์ใหม่แยกจาก main แล้วนำกลับมารวม <b>เรียงคำสั่ง</b> ให้ถูกตามลำดับ (ขั้นที่ 3 ถึง 5 ต้องอยู่ถูก branch)',
    order([R + '1', R + '2', R + '3', R + '4', R + '5'], ['git branch feature', 'git checkout feature', 'git commit -m "msg"', 'git checkout main', 'git merge feature']),
    'สร้าง branch → สลับไป branch นั้น → commit งาน → กลับ main → merge feature เข้า main', 'L11; Git cheat sheet');
  var gitMatch = X('GIT', 'drop', '<b>ลากคำอธิบายไปจับคู่</b> กับคำสั่ง Git แต่ละคำสั่ง',
    match([['git status', 'แสดงไฟล์ที่ถูกแก้ไขใน working directory และที่ staged ไว้สำหรับ commit ถัดไป'], ['git diff', 'แสดงความต่างของสิ่งที่แก้แล้วแต่ยังไม่ staged'], ['git reset [file]', 'เอาไฟล์ออกจาก staging โดยเก็บการแก้ไขไว้ใน working directory'], ['git branch', 'แสดงรายการ branch (ตัวที่มี * คือ branch ที่ใช้อยู่)'], ['git merge [branch]', 'รวมประวัติของ branch ที่ระบุเข้ากับ branch ปัจจุบัน']]),
    'อ้างตาม Git cheat sheet ที่แจกในวิชา', 'Git cheat sheet');
  var gitBucket = X('GIT', 'drop', 'การเปลี่ยนแปลงของไฟล์อยู่ที่ไหน <b>ลากสถานการณ์ไปวางในพื้นที่ของ Git</b> ที่ถูกต้อง', {
    layout: 'buckets', slots: [{ id: 'w', label: 'Working directory' }, { id: 's', label: 'Staging area' }, { id: 'r', label: 'Local repository' }],
    chips: [C('a', 'แก้ไฟล์ report.txt แต่ยังไม่ได้สั่งอะไร', 'w'), C('b', 'หลังสั่ง git add report.txt', 's'), C('c', 'หลังสั่ง git commit -m "v1"', 'r'), C('d', 'หลัง git reset report.txt', 'w'), C('e', 'git diff --staged จะแสดงความต่างของส่วนนี้', 's'), C('f', 'git log เห็นประวัติของส่วนนี้', 'r')]
  }, 'add ย้ายการแก้ไขเข้า staging, commit ย้ายเข้า local repository, reset [file] ดึงออกจาก staging กลับมาเป็นการแก้ไขใน working directory', 'L11 หน้า 20–21; Git cheat sheet');

  /* ================= Unit test (11 interactive) ================= */
  function pick(lo, hi) { return function (n) { return n.length === 1 && n[0] >= lo && n[0] <= hi; }; }
  var HE = '(พิมพ์เอง ไม่มีตัวเลือกให้)';
  var ecp1 = X('UNIT', 'table', '<b>ECP</b> หาค่ามากที่สุดจาก 2 ค่า (First, Second): พิมพ์ <b>คู่ค่าทดสอบ</b> ที่เป็นตัวแทนของแต่ละ Class ' + HE, {
    head: ['Class', 'Representative (First, Second)'],
    rows: [['First > Second', { in: 'a', ok: function (n) { return n.length === 2 && n[0] > n[1]; }, show: 'เช่น 10, 7' }], ['Second > First', { in: 'b', ok: function (n) { return n.length === 2 && n[1] > n[0]; }, show: 'เช่น 8, 12' }], ['First = Second', { in: 'c', ok: function (n) { return n.length === 2 && n[0] === n[1]; }, show: 'เช่น 6, 6' }]]
  }, 'ตัวแทนแต่ละ Class ใช้ทดสอบแทนทั้ง Class เช่น (10, 7), (8, 12), (6, 6) ค่าอื่นที่ทำให้เงื่อนไขของ Class นั้นจริงก็ใช้ได้', 'L12 หน้า 22');
  var ecp2 = X('UNIT', 'table', 'ช่องกรอกรับจำนวนเต็ม <b>1 – 1000</b> ทำ <b>ECP</b>: พิมพ์ <b>ค่าทดสอบ 1 ค่า</b> ที่เป็นตัวแทนของแต่ละ Class ' + HE, {
    head: ['Class', 'Representative'],
    rows: [['≤ 0 (Invalid)', { in: 'a', ok: pick(-1e9, 0), show: 'ค่าใดก็ได้ ≤ 0 เช่น -5' }], ['1 – 1000 (Valid)', { in: 'b', ok: pick(1, 1000), show: 'ค่าใดก็ได้ 1–1000 เช่น 500' }], ['≥ 1001 (Invalid)', { in: 'c', ok: pick(1001, 1e9), show: 'ค่าใดก็ได้ ≥ 1001 เช่น 2000' }]]
  }, 'แบ่งเป็น 3 Class: ≤ 0 (Invalid), 1–1000 (Valid), ≥ 1001 (Invalid) แต่ละ Class เลือกตัวแทน 1 ค่า', 'L12 หน้า 24');
  var BVH = ['Class', 'All Cases', 'Belonging Cases', 'Reduced Class'];
  function cells(i, a, b, c) { return [{ in: 'a' + i, set: a }, { in: 'b' + i, set: b }, { in: 'c' + i, set: c }]; }
  var bva1 = X('UNIT', 'table', '<b>BVA</b> ตาราง Age Classification แบบสไลด์ (boundary, +1, −1): พิมพ์ตัวเลขลงทุกช่องที่ว่าง ' + HE, {
    head: BVH, rows: [
      ['Low (≤ −1)'].concat(cells(0, [-1, 0], [-1], [-1])),
      ['0-12'].concat(cells(1, [-1, 0, 1, 11, 12, 13], [0, 1, 11, 12], [0, 12])),
      ['13-19'].concat(cells(2, [12, 13, 14, 18, 19, 20], [13, 14, 18, 19], [13, 19])),
      ['20-35'].concat(cells(3, [19, 20, 21, 34, 35, 36], [20, 21, 34, 35], [20, 35])),
      ['36-120'].concat(cells(4, [35, 36, 37, 119, 120, 121], [36, 37, 119, 120], [36, 120])),
      ['High (≥ 121)'].concat(cells(5, [120, 121], [121], [121]))]
  }, 'All Cases = ค่าขอบ ±1 ของแต่ละขอบ, Belonging Cases = เฉพาะค่าใน All Cases ที่อยู่ใน Class นั้นจริง, Reduced Class = ค่าขอบของ Class (ต่ำสุดกับสูงสุด) ส่วน Low และ High มีค่าขอบเดียว', 'L12 หน้า 27–28');
  var bva2 = X('UNIT', 'table', '<b>BVA</b> ช่องกรอกรับค่า <b>1 – 1000</b> (Exercise 4): พิมพ์ตัวเลขลงทุกช่องที่ว่าง ' + HE, {
    head: BVH, rows: [
      ['< 1'].concat(cells(0, [0, 1], [0], [0])),
      ['1 – 1000'].concat(cells(1, [0, 1, 2, 999, 1000, 1001], [1, 2, 999, 1000], [1, 1000])),
      ['> 1000'].concat(cells(2, [1000, 1001], [1001], [1001]))]
  }, 'ช่วง 1–1000: ขอบล่าง 1 ให้ 0,1,2 ขอบบน 1000 ให้ 999,1000,1001 ส่วน Class ที่ต่ำกว่า 1 ใช้ 0 และ Class ที่สูงกว่า 1000 ใช้ 1001 เป็นตัวแทน', 'L12 หน้า 29');

  /* code is shown like VS Code; each line is [text, number] (no number = not a node / flow chart box) */
  var LN = function (a) { return a.map(function (t, i) { return [t, i + 1]; }); };
  var fc1 = X('UNIT', 'drop', 'อ่านโค้ด แล้ว <b>ลากข้อความไปวางในกล่อง</b> ของ Flow Chart ให้ตรงกับโค้ด', {
    layout: 'svg',
    code: LN(['int x = sc.nextInt();', 'String r = "odd";', 'if (x % 2 == 0) {', '    r = "even";', '}', 'System.out.println(r);']),
    graph: { w: 400, h: 480, label: 'Flow Chart ของโค้ดที่ให้',
      nodes: [{ id: 's', k: 'start', x: 200, y: 28, t: 'Start' }, { id: 'n1', k: 'proc', x: 200, y: 92, slot: true }, { id: 'n2', k: 'proc', x: 200, y: 158, slot: true }, { id: 'n3', k: 'dec', x: 200, y: 240, slot: true }, { id: 'n4', k: 'proc', x: 200, y: 326, slot: true }, { id: 'n5', k: 'proc', x: 200, y: 396, slot: true }, { id: 'e', k: 'end', x: 200, y: 448, t: 'End' }],
      edges: [['s', 'n1'], ['n1', 'n2'], ['n2', 'n3'], ['n3', 'n4', 'Yes'], ['n4', 'n5'], ['n3', 'n5', 'No', [[350, 240], [350, 396]]], ['n5', 'e']] },
    slots: [{ id: 'n1', label: 'บรรทัด 1' }, { id: 'n2', label: 'บรรทัด 2' }, { id: 'n3', label: 'บรรทัด 3 (decision)' }, { id: 'n4', label: 'บรรทัด 4' }, { id: 'n5', label: 'บรรทัด 6' }],
    chips: [C('a', 'int x = sc.nextInt();', 'n1'), C('b', 'String r = "odd";', 'n2'), C('c', 'x % 2 == 0', 'n3'), C('d', 'r = "even";', 'n4'), C('e', 'System.out.println(r);', 'n5')]
  }, 'บรรทัด 3 เป็นเงื่อนไข จึงเป็น decision: ถ้า Yes ทำ r = "even" แล้วไป println ถ้า No ข้ามไป println เลย (if ที่ไม่มี else)', 'L12 หน้า 31–35');
  var fc2 = X('UNIT', 'drop', 'อ่านโค้ด แล้ว <b>ลากข้อความไปวางในกล่อง</b> ของ Flow Chart ให้ตรงกับโค้ด (มี loop)', {
    layout: 'svg',
    code: LN(['int sum = 0;', 'int i = 1;', 'while (i <= n) {', '    sum += i;', '    i++;', '}', 'System.out.println(sum);']),
    graph: { w: 400, h: 520, label: 'Flow Chart ของโค้ดที่ให้ (มี loop)',
      nodes: [{ id: 's', k: 'start', x: 200, y: 28, t: 'Start' }, { id: 'n1', k: 'proc', x: 200, y: 92, slot: true }, { id: 'n2', k: 'proc', x: 200, y: 150, slot: true }, { id: 'n3', k: 'dec', x: 200, y: 228, slot: true }, { id: 'n4', k: 'proc', x: 200, y: 312, slot: true }, { id: 'n5', k: 'proc', x: 200, y: 372, slot: true }, { id: 'n6', k: 'proc', x: 200, y: 440, slot: true }, { id: 'e', k: 'end', x: 200, y: 492, t: 'End' }],
      edges: [['s', 'n1'], ['n1', 'n2'], ['n2', 'n3'], ['n3', 'n4', 'Yes'], ['n4', 'n5'], ['n5', 'n3', '', [[350, 372], [350, 228]]], ['n3', 'n6', 'No', [[40, 228], [40, 440]]], ['n6', 'e']] },
    slots: [{ id: 'n1', label: 'บรรทัด 1' }, { id: 'n2', label: 'บรรทัด 2' }, { id: 'n3', label: 'บรรทัด 3 (decision)' }, { id: 'n4', label: 'บรรทัด 4' }, { id: 'n5', label: 'บรรทัด 5' }, { id: 'n6', label: 'บรรทัด 7' }],
    chips: [C('a', 'int sum = 0;', 'n1'), C('b', 'int i = 1;', 'n2'), C('c', 'i <= n', 'n3'), C('d', 'sum += i;', 'n4'), C('e', 'i++;', 'n5'), C('f', 'System.out.println(sum);', 'n6')]
  }, 'while เป็น decision (i <= n): Yes วน sum += i; i++; แล้วย้อนกลับมาตรวจเงื่อนไขใหม่ No ออกจาก loop ไป println', 'L12 หน้า 35');

  var CODE_IF = [['int score = sc.nextInt();', 1], ['if (score >= 50) {', 2], ['    grade = "pass";', 3], ['} else {'], ['    grade = "fail";', 4], ['}'], ['if (score >= 80) {', 5], ['    bonus = true;', 6], ['}'], ['System.out.println(grade);', 7]];
  function circ(a) { return a.map(function (v) { return { id: v[0], k: 'circ', x: v[1], y: v[2], t: v[0] }; }); }
  var G_IF = { w: 400, h: 460, label: 'Flow graph ของโค้ดที่ให้ (7 node)',
    nodes: circ([['1', 200, 30], ['2', 200, 105], ['3', 110, 185], ['4', 290, 185], ['5', 200, 265], ['6', 110, 345], ['7', 200, 425]]),
    edges: [['1', '2'], ['2', '3', 'T'], ['2', '4', 'F'], ['3', '5'], ['4', '5'], ['5', '6', 'T'], ['5', '7', 'F'], ['6', '7']] };
  var CODE_LOOP = [['int count(int[] a) {'], ['    int c = 0, i = 0;', 1], ['    while (i < a.length) {', 2], ['        if (a[i] > 0) {', 3], ['            c++;', 4], ['        }'], ['        i++;', 5], ['    }'], ['    return c;', 6], ['}']];
  var G_LOOP = { w: 400, h: 460, label: 'Flow graph ของโค้ดที่ให้ (6 node มี loop)',
    nodes: circ([['1', 200, 30], ['2', 200, 105], ['3', 200, 185], ['4', 110, 265], ['5', 200, 345], ['6', 330, 425]]),
    edges: [['1', '2'], ['2', '3', 'T'], ['2', '6', 'F', [[330, 105]]], ['3', '4', 'T'], ['3', '5', 'F'], ['4', '5'], ['5', '2', '', [[40, 345], [40, 105]]]] };
  var NOTE = ' (เลขหน้าบรรทัดในโค้ด = หมายเลข Node)';

  var path1 = X('UNIT', 'path', 'ถ้าป้อน <b>score = 90</b> โปรแกรมจะวิ่งผ่าน Node ใดบ้าง <b>แตะ Node ตามลำดับ</b> จากต้นจนจบ' + NOTE, { code: CODE_IF, graph: G_IF, ans: ['1', '2', '3', '5', '6', '7'] },
    '90 ≥ 50 จึงเข้า Node 3, ต่อด้วย Node 5 ซึ่ง 90 ≥ 80 จึงเข้า Node 6 แล้วจบที่ Node 7 : 1 → 2 → 3 → 5 → 6 → 7', 'L12 หน้า 32–34');
  var path2 = X('UNIT', 'path', 'ถ้าป้อน <b>a = {5, -2}</b> เมธอด count จะวิ่งผ่าน Node ใดบ้าง <b>แตะ Node ตามลำดับ</b> (Node ซ้ำได้ เพราะมี loop)' + NOTE, { code: CODE_LOOP, graph: G_LOOP, ans: ['1', '2', '3', '4', '5', '2', '3', '5', '2', '6'] },
    'รอบแรก a[0]=5 > 0 เข้า Node 4 แล้ว i++ (5) รอบสอง a[1]=-2 ไม่ > 0 ข้าม Node 4 ไป 5 แล้วกลับ 2 จน i = 2 ออก loop ไป Node 6 : 1,2,3,4,5,2,3,5,2,6', 'L12 หน้า 35');
  var vg1 = X('UNIT', 'num', 'จาก flow graph ของโค้ดนี้ หา <b>Cyclomatic Complexity V(G) = E − N + 2</b> (E = จำนวน edge, N = จำนวน node)', { code: CODE_IF, graph: G_IF, fields: [{ label: 'E (edges)', ans: 8 }, { label: 'N (nodes)', ans: 7 }, { label: 'V(G)', ans: 3 }] },
    'นับ edge ได้ 8 เส้น, node 7 ตัว V(G) = 8 − 7 + 2 = 3 (ตรวจซ้ำ: decision 2 ตัว + 1 = 3) แปลว่ามี independent path 3 เส้น', 'L12 หน้า 32–34');
  var vg2 = X('UNIT', 'num', 'จาก flow graph ของเมธอด count (มี loop) หา <b>V(G) = E − N + 2</b>', { code: CODE_LOOP, graph: G_LOOP, fields: [{ label: 'E (edges)', ans: 7 }, { label: 'N (nodes)', ans: 6 }, { label: 'V(G)', ans: 3 }] },
    'นับ edge ได้ 7 เส้น (รวมเส้น 5 → 2 ที่ย้อนกลับ), node 6 ตัว V(G) = 7 − 6 + 2 = 3 (ตรวจซ้ำ: decision 2 ตัว คือ while กับ if + 1 = 3)', 'L12 หน้า 35');
  var tc1 = X('UNIT', 'num', 'ต้องการให้โปรแกรมวิ่งตาม path <b>1 → 2 → 4 → 5 → 7</b> กรอกค่า <b>score</b> (จำนวนเต็ม) ที่ทำได้ 1 ค่า', { code: CODE_IF, graph: G_IF, fields: [{ label: 'score =', ok: function (v) { return Math.floor(v) === v && v < 50; }, show: 'จำนวนเต็มใดก็ได้ที่ < 50 เช่น 30' }] },
    'ต้องเข้า Node 4 (else ของ score >= 50) จึงต้อง score < 50 และข้าม Node 6 ได้อยู่แล้วเพราะ score < 80 ค่าอย่าง 30 หรือ 0 ใช้ได้', 'L12 หน้า 32–34');

  /* ================= plain multiple-choice from the existing banks, evenly spaced ================= */
  function bank(id, tp, n) {
    var all = [];
    root.QUIZ.topics.filter(function (t) { return t.id === id; })[0].sets.forEach(function (s) { s.qs.forEach(function (q) { all.push(q); }); });
    var o = [];
    for (var k = 0; k < n; k++) { var q = { tp: tp }, src = all[Math.floor((k + 0.5) * all.length / n)]; for (var f in src) q[f] = src[f]; o.push(q); }
    return o;
  }
  var all = [dfdMatch, dfdTap1, dfdTap2, dfdTap3, err1, err2, err3, err4, gitOrder1, gitOrder2, gitMatch, gitBucket, ecp1, ecp2, bva1, bva2, fc1, fc2, path1, path2, vg1, vg2, tc1]
    .concat(bank('dfd', 'DFD', 6), bank('err', 'ERR', 6), bank('git', 'GIT', 4), bank('unit', 'UNIT', 1));
  /* fixed shuffle: topics are mixed, and every reload gives the same exam */
  var seed = 11, qs = all.slice();
  for (var i = qs.length - 1; i > 0; i--) { seed = (seed * 1103515245 + 12345) % 2147483648; var j = seed % (i + 1), t = qs[i]; qs[i] = qs[j]; qs[j] = t; }

  root.QUIZ.topics.unshift({ id: 'mock', name: 'ข้อสอบรวมทุกหัวข้อ (Mock Exam) · 40 ข้อ', sets: [{ title: 'DFD + Error detection + Git + Unit test ปนกัน ลาก/แตะ/พิมพ์ได้', qs: qs }] });
  root.MOCK_PARTS = { all: all, qs: qs };
})(typeof window !== 'undefined' ? window : globalThis);
