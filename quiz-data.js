/* Quiz data. Questions are written by the author from the lecturer's slides, not official exam questions.
   Q(question, [correct, wrong, wrong, wrong], explanation, source)  - correct option is ALWAYS first; the engine shuffles.
   A(auto, spec, question, explanation, source) - options and answer are computed from the diagram by the rule checker. */
(function (root) {
  'use strict';
  function Q(q, o, why, src, extra) { var r = { q: q, o: o, a: 0, why: why, src: src }; if (extra) for (var k in extra) r[k] = extra[k]; return r; }
  function A(auto, spec, q, why, src) { return { auto: auto, spec: spec, q: q, why: why, src: src }; }
  function I(img, q, o, why, src) { return Q(q, o, why, src, { img: img }); }

  /* ---------- diagrams (n: nodes, f: flows) ---------- */
  var DA = { w: 560, h: 300,
    n: [['e', 'c', 'ลูกค้า', 80, 150], ['p', 'p1', 'รับคำสั่งซื้อ', 300, 150, '1.0'], ['s', 'd1', 'คำสั่งซื้อ', 300, 262, 'D1']],
    f: [['c', 'p1', 'รายการสั่งซื้อ'], ['p1', 'c', 'ใบยืนยัน'], ['p1', 'd1', 'บันทึกคำสั่งซื้อ'], ['c', 'd1', 'ข้อมูลลูกค้า']] };
  var DB = { w: 700, h: 260,
    n: [['e', 'u', 'ผู้ใช้', 70, 130], ['p', 'p1', 'ตรวจสอบรหัส', 290, 130, '1.0'], ['p', 'p2', 'บันทึกประวัติ', 560, 130, '2.0']],
    f: [['u', 'p1', 'ชื่อและรหัสผ่าน'], ['p1', 'u', 'ผลเข้าสู่ระบบ'], ['p1', 'p2', 'ข้อมูลเข้าสู่ระบบ']] };
  var DC = { w: 520, h: 360,
    n: [['e', 't', 'ครู', 70, 70], ['p', 'p1', 'บันทึกคะแนน', 300, 70, '1.0'], ['s', 'd1', 'คะแนน', 300, 180, 'D1'], ['p', 'p2', 'พิมพ์ใบคะแนน', 300, 290, '2.0'], ['e', 'st', 'นักเรียน', 70, 290]],
    f: [['t', 'p1', 'คะแนนสอบ'], ['p1', 'd1', 'คะแนนที่บันทึก'], ['d1', 'p2', 'คะแนนนักเรียน'], ['p2', 'st', 'ใบคะแนน'], ['t', 'st', 'ผลสอบ']] };
  var DD = { w: 520, h: 200,
    n: [['e', 'c', 'ลูกค้า', 80, 100], ['p', 'p1', 'ออกใบเสร็จ', 340, 100, '1.0']],
    f: [['c', 'p1', ''], ['p1', 'c', 'ใบเสร็จ']] };
  var DE = { w: 560, h: 300,
    n: [['e', 'e1', 'นักศึกษา', 80, 110], ['p', 'p1', 'ค้นหาหนังสือ', 310, 110, '1.0'], ['s', 'd1', 'หนังสือ', 310, 240, 'D1']],
    f: [['e1', 'p1', 'ชื่อหนังสือ'], ['d1', 'p1', 'ข้อมูลหนังสือ'], ['p1', 'e1', 'ผลการค้นหา']] };

  var DF = { w: 700, h: 340,
    n: [['e', 'e1', 'ผู้ป่วย', 70, 70], ['p', 'p1', 'นัดหมาย', 320, 70, '1.0'], ['s', 'd1', 'การนัดหมาย', 320, 210, 'D1'], ['p', 'p2', 'ส่งการแจ้งเตือน', 580, 210, '2.0']],
    f: [['e1', 'p1', 'คำขอนัด'], ['p1', 'd1', 'ข้อมูลนัด'], ['e1', 'd1', 'ประวัติผู้ป่วย'], ['d1', 'p2', 'นัดที่ใกล้ถึง']] };
  var DG = { w: 640, h: 340,
    n: [['s', 'd1', 'สินค้า', 90, 70, 'D1'], ['s', 'd2', 'คลังสำรอง', 90, 270, 'D2'], ['p', 'p1', 'ตรวจสต็อก', 360, 170, '1.0'], ['e', 'm', 'ผู้จัดการ', 570, 170]],
    f: [['d1', 'd2', 'ย้ายสินค้า'], ['d1', 'p1', 'จำนวนสินค้า'], ['p1', 'm', ''], ['m', 'p1', 'คำสั่งเติมของ']] };

  var DH = { w: 830, h: 400,
    n: [['p', 'p1', 'รับชำระเงิน', 300, 70, '1.0'], ['e', 'b', 'ธนาคาร', 690, 70], ['e', 'c', 'ลูกค้า', 690, 210], ['p', 'p2', 'ออกใบเสร็จ', 450, 210, '2.0'],
      ['s', 'd1', 'การชำระเงิน', 140, 210, 'D1'], ['s', 'd2', 'สำรองข้อมูล', 140, 350, 'D2'], ['p', 'p3', 'ตรวจสอบยอด', 450, 350, '3.0']],
    f: [['c', 'p1', 'ข้อมูลบัตร'], ['p1', 'b', 'คำขอตัดเงิน'], ['b', 'p1', 'ผลตัดเงิน'], ['p1', 'd1', 'ธุรกรรม'], ['d1', 'p2', 'รายการชำระ'], ['p2', 'd1', ''],
      ['p2', 'c', 'ใบเสร็จ'], ['d1', 'd2', 'ข้อมูลสำรอง'], ['c', 'b', 'ข้อมูลบัตรซ้ำ'], ['d1', 'p3', 'ยอดคงเหลือ']] };
  var DI = { w: 720, h: 330,
    n: [['e', 'a', 'ผู้สมัคร', 70, 80], ['p', 'p1', 'รับใบสมัคร', 260, 80, '1.0'], ['p', 'p2', 'พิจารณา', 470, 80, '2.0'], ['e', 'o', 'เจ้าหน้าที่', 650, 80],
      ['s', 'd1', 'ใบสมัคร', 260, 230, 'D1'], ['p', 'p3', 'แจ้งผล', 470, 250, '3.0']],
    f: [['a', 'p1', 'ใบสมัคร'], ['p1', 'd1', 'ข้อมูลใบสมัคร'], ['d1', 'p2', 'ข้อมูลผู้สมัคร'], ['p2', 'o', 'ผลสรุป'], ['o', 'p2', ''], ['p2', 'p3', 'ผลพิจารณา'], ['a', 'd1', 'สำเนาบัตร']] };
  var DJ = { w: 760, h: 220,
    n: [['s', 'd1', 'ข้อมูลเก่า', 110, 110, 'D1'], ['p', 'p1', 'ปรับปรุงข้อมูล', 380, 110, '1.0'], ['s', 'd2', 'ข้อมูลใหม่', 650, 110, 'D2']],
    f: [['d1', 'p1', 'ข้อมูลที่ต้องแก้'], ['p1', 'd2', 'ข้อมูลที่แก้แล้ว']] };
  var DK = { w: 600, h: 320,
    n: [['e', 'w', 'พนักงาน', 80, 110], ['p', 'p1', 'อัปเดตสต็อก', 330, 110, '1.0'], ['s', 'd1', 'สต็อก', 330, 250, 'D1']],
    f: [['w', 'p1', 'รายการรับของ'], ['p1', 'd1', 'ยอดใหม่'], ['d1', 'p1', 'ยอดเดิม'], ['p1', 'w', 'ใบยืนยัน']] };

  var R1 = 'L7 หน้า 9; L6 หน้า 27–28', R2 = 'L7 หน้า 9; L6 หน้า 28', R3 = 'L6 หน้า 27';

  /* ======================= TOPIC 1: DFD Understanding ======================= */
  var dfd1 = [
    Q('DFD แสดงอะไรเป็นหลัก?', ['ข้อมูลที่ไหลผ่านระบบ เริ่มจากเป็น input แล้วถูกแปลงเป็น output', 'ลำดับการเรียกฟังก์ชันภายในโปรแกรม', 'โครงสร้างตารางและความสัมพันธ์ของฐานข้อมูล', 'ลำดับเวลาของข้อความที่ส่งระหว่าง object'], 'สไลด์บอกว่า data flows through a system, beginning as input and transformed into output', 'L6 หน้า 14'),
    Q('External entity คืออะไร?', ['ผู้ผลิตหรือผู้ใช้ข้อมูล (producer or consumer of data) ที่อยู่นอกระบบ', 'ที่เก็บข้อมูลถาวรของระบบ', 'ตัวแปลง input ให้เป็น output', 'ข้อมูลที่กำลังเคลื่อนที่ระหว่างองค์ประกอบ'], 'External entity คือคน องค์กร หรือระบบภายนอกที่เพิ่มข้อมูลเข้าระบบหรือรับข้อมูลจากระบบ', 'L6 หน้า 11'),
    Q('ข้อใดเป็นตัวอย่างของ external entity ตามสไลด์?', ['เซนเซอร์ (sensor)', 'ฐานข้อมูลสินค้าที่อยู่ในระบบ', 'การคำนวณเกรดเฉลี่ย', 'เส้นลูกศรที่ส่งใบเสร็จ'], 'สไลด์ยกตัวอย่างว่า a person, a device, a sensor, a computer-based system', 'L6 หน้า 11'),
    Q('Process ใน DFD คืออะไร?', ['ตัวแปลงข้อมูล (data transformer) ที่เปลี่ยน input เป็น output', 'ผู้ผลิตข้อมูลที่อยู่นอกระบบ', 'ที่เก็บข้อมูลที่ใช้ซ้ำภายหลัง', 'ชื่อที่ใช้ติดป้ายลูกศร'], 'Process เป็นกิจกรรมหรือฟังก์ชันที่เกิดการจัดการและแปลงข้อมูล', 'L6 หน้า 12'),
    Q('ข้อใดเป็นตัวอย่างของ process ตามสไลด์?', ['คำนวณเกรดเฉลี่ย (calculate grade point average)', 'นักศึกษา', 'ตารางรายชื่อนักศึกษา', 'ใบเสร็จรับเงิน'], 'สไลด์ยกตัวอย่าง process แบบ perform computations ว่าเช่นการคำนวณเกรดเฉลี่ย', 'L6 หน้า 13'),
    Q('Data flow คืออะไร?', ['ข้อมูลที่กำลังเคลื่อนที่ (data in motion) เป็น input ของ process หรือ output ของ process', 'ที่เก็บข้อมูลถาวร', 'องค์กรภายนอกที่ส่งข้อมูลเข้าระบบ', 'ฟังก์ชันที่ทำการคำนวณ'], 'สไลด์: a data flow is data in motion; input of data to a process, or the output of data from a process', 'L6 หน้า 14'),
    Q('Data store คืออะไร?', ['ที่เก็บข้อมูลถาวรที่ process ต้องใช้และ/หรือสร้างขึ้น', 'ตัวแปลงข้อมูลที่ทำการคำนวณ', 'ผู้ใช้ที่เป็นเจ้าของข้อมูล', 'ข้อมูลที่ไหลผ่านลูกศร'], 'Data store คือ storage of persistent data required and/or produced by the process', 'L6 หน้า 16'),
    Q('ลูกศรที่ชี้ออกจาก data store ไปยัง process มีความหมายว่าอะไร?', ['เป็นการดึงข้อมูล (data retrieval)', 'เป็นการอัปเดตข้อมูลใน store', 'เป็นการสร้าง external entity ใหม่', 'เป็นการลบ data store ทิ้ง'], 'Data flows leaving the data store are data retrievals', 'L6 หน้า 16'),
    Q('ลูกศรที่ชี้เข้า data store มีความหมายว่าอะไร?', ['เป็นการอัปเดตหรือเพิ่มข้อมูลใหม่ (updates or new data added)', 'เป็นการดึงข้อมูลออกมาแสดง', 'เป็นการส่งข้อมูลไป external entity', 'เป็นสัญญาณควบคุมแบบ control flow'], 'Data flows entering the data store are updates or new data added', 'L6 หน้า 16'),
    Q('สัญลักษณ์ process แบบ Yourdon/DeMarco คือรูปอะไร?', ['วงกลม', 'สี่เหลี่ยมมุมมนแบ่งสองช่อง', 'สี่เหลี่ยมจัตุรัส', 'เส้นขนานสองเส้น'], 'ในสไลด์แบบ Yourdon/DeMarco ใช้วงกลมแทน process', 'L6 หน้า 10'),
    Q('สัญลักษณ์ process แบบ Gane/Sarson คือรูปอะไร?', ['สี่เหลี่ยมมุมมนที่แบ่งเป็นสองช่อง', 'วงกลม', 'สี่เหลี่ยมจัตุรัสธรรมดา', 'เส้นขนานสองเส้น'], 'แบบ Gane/Sarson ใช้สี่เหลี่ยมมุมมนแบ่งช่อง (ช่องบนใส่เลข)', 'L6 หน้า 10'),
    Q('Data store แบบ Yourdon/DeMarco วาดเป็นอะไร?', ['เส้นขนานสองเส้น', 'วงกลม', 'สี่เหลี่ยมมุมมน', 'ลูกศรเส้นประ'], 'ในสไลด์แบบ Yourdon/DeMarco data store เป็นเส้นขนานสองเส้น', 'L6 หน้า 10'),
    Q('ประโยค "ข้อมูลต้องมีที่มาและต้องถูกส่งไปที่ใดที่หนึ่งเสมอ" ใช้อธิบายองค์ประกอบใด?', ['External entity', 'Process', 'Data flow', 'Data store'], 'สไลด์ External entity: data must always originate somewhere and must always be sent to something', 'L6 หน้า 11'),
    Q('ประโยค "ข้อมูลต้องถูกประมวลผลเสมอเพื่อให้ระบบทำงานได้" ใช้อธิบายองค์ประกอบใด?', ['Process', 'External entity', 'Data store', 'Data flow'], 'สไลด์ Process: data must always be processed in some way to achieve system function', 'L6 หน้า 12'),
    Q('ตาม Data Flow Packet Concept ข้อมูลที่ต้องเดินทางไปด้วยกันควรวาดอย่างไร?', ['เป็น data flow เส้นเดียว ไม่ว่าจะมีเอกสารกี่ใบ', 'แยกเป็น data flow หนึ่งเส้นต่อเอกสารหนึ่งใบ', 'วาดเป็น data store', 'วาดเป็น process ใหม่คั่นกลาง'], 'Data that should travel together should be shown as a single data flow, no matter how many physical documents are included', 'L6 หน้า 15'),
    Q('การสร้าง ลบ หรืออัปเดตข้อมูลในไฟล์หรือฐานข้อมูลถูกเรียกใน DFD ว่าอะไร?', ['Data store', 'External entity', 'Control flow', 'PSPEC'], 'The creation, deletion, or update of data in a file or database (called a data store on the DFD)', 'L6 หน้า 14'),
    Q('ข้อใดเป็นตัวอย่างของ process ที่ "ตัดสินใจ" (make decisions) ตามสไลด์?', ['ตรวจสอบว่ามีสินค้าที่สั่งพร้อมส่งหรือไม่', 'ลูกค้าที่สั่งสินค้า', 'ตารางสินค้าคงคลัง', 'ใบกำกับภาษีที่ออกให้ลูกค้า'], 'สไลด์ยกตัวอย่าง make decisions เช่น determine availability of ordered products', 'L6 หน้า 13'),
    Q('ข้อใดไม่ใช่สิ่งที่ process ทำตามสไลด์?', ['เป็นผู้ผลิตข้อมูลจากภายนอกระบบ', 'คำนวณข้อมูล', 'เรียงลำดับหรือสรุปข้อมูล', 'กระตุ้นให้ process อื่นทำงาน'], 'ผู้ผลิตข้อมูลจากภายนอกคือ external entity ไม่ใช่ process', 'L6 หน้า 11, 13'),
    Q('ข้อใดอธิบายความต่างของ data flow กับ data store ได้ถูกต้อง?', ['data flow คือข้อมูลที่กำลังเคลื่อนที่ ส่วน data store คือที่เก็บข้อมูลถาวร', 'data flow เก็บข้อมูลถาวร ส่วน data store คือข้อมูลที่กำลังเคลื่อนที่', 'ทั้งสองอย่างเป็นข้อมูลที่เคลื่อนที่เหมือนกัน', 'ทั้งสองอย่างเป็นผู้ผลิตข้อมูลจากภายนอก'], 'Data flow คือ data in motion ส่วน data store คือ storage of persistent data', 'L6 หน้า 14, 16'),
    Q('ข้อใดอธิบายสัญลักษณ์ data store แบบ Gane/Sarson ได้ถูกต้องที่สุด?', ['สี่เหลี่ยมปลายเปิด มีช่องรหัส (เช่น D1) ที่ด้านซ้าย', 'วงกลมมีเส้นแบ่งกลาง', 'สี่เหลี่ยมมุมมนมีตัวเลขด้านบน', 'ลูกศรหนาตรงกลางแผนภาพ'], 'ภาพสไลด์แสดง data store แบบ Gane/Sarson เป็นสี่เหลี่ยมปลายเปิดมีช่องรหัสทางซ้าย', 'L6 หน้า 10, 16')
  ];

  var dfd2 = [
    Q('Context diagram ต้องแสดง process ทั้งระบบเป็นกี่ process?', ['1 process (process ศูนย์)', '2 process', '3 ถึง 7 process', 'เท่ากับจำนวน external entity'], 'Context diagram แสดงกระบวนการทางธุรกิจทั้งหมดเป็น process เดียว', 'L6 หน้า 20; L7 หน้า 5'),
    Q('process เดียวใน context diagram ต้องมีหมายเลขอะไร?', ['0', '1', '1.0', 'ไม่ต้องมีหมายเลข'], 'ใน internal consistency ระบุว่า the process must be numbered 0', 'L6 หน้า 29'),
    Q('Context diagram ต้องแสดงอะไรบ้าง?', ['external entity ทั้งหมดที่รับข้อมูลจากหรือส่งข้อมูลให้ระบบ', 'data store ทุกตัวของระบบ', 'process ย่อยทุกตัวพร้อมคำอธิบาย', 'PSPEC ของทุก process'], 'Shows all the external entities that receive information from or contribute information to the system', 'L6 หน้า 20'),
    Q('ตามแนวทางการวาด DFD ควรเริ่มวาดจากแผนภาพใด?', ['context level diagram (level 0)', 'level 3 ที่ละเอียดที่สุด', 'child diagram ของ process 1', 'PSPEC ของ process แรก'], 'Always begin with a context level diagram (also called level 0)', 'L6 หน้า 18'),
    Q('Process ใน Level 1 ให้เลขแบบใด?', ['จำนวนเต็ม เช่น 1, 2, 3', 'มีจุดหนึ่งจุด เช่น 1.1', 'มีจุดสองจุด เช่น 1.1.1', 'ใช้ 0 ทั้งหมด'], 'Level 1 processes are always numbered with integer value', 'L6 หน้า 33'),
    Q('Process ใน Level 2 ให้เลขแบบใด?', ['มีจุดหนึ่งจุด เช่น 1.1, 1.2', 'เป็นจำนวนเต็ม เช่น 1, 2', 'มีจุดสองจุด เช่น 1.1.1', 'ขึ้นต้นด้วย 0'], 'Level 2 processes always have one dot: parent number dot unique number', 'L6 หน้า 33'),
    Q('Process ใน Level 3 ให้เลขแบบใด?', ['มีจุดสองจุด เช่น 1.1.1', 'มีจุดหนึ่งจุด เช่น 1.1', 'เป็นจำนวนเต็ม', 'ใช้ตัวอักษร A, B, C'], 'Level 3 processes always have two dots: parent number dot unique number', 'L6 หน้า 33'),
    Q('Process หมายเลข 3.2 อยู่ใน DFD ระดับใด และเป็นลูกของ process ใด?', ['Level 2 เป็นลูกของ process 3', 'Level 1 เป็นลูกของ process 2', 'Level 3 เป็นลูกของ process 3.2.1', 'Level 0 เป็นลูกของ context'], 'เลขที่มีหนึ่งจุดคือ Level 2 และเลขหน้าจุดคือเลขของ parent process', 'L6 หน้า 33–34'),
    Q('ตามสไลด์ ระบบส่วนใหญ่ต้องการ flow model กี่ระดับ?', ['ประมาณ 3 ถึง 7 ระดับ', '1 ถึง 2 ระดับ', '8 ถึง 12 ระดับ', 'ระดับเดียวพอเสมอ'], 'Most systems require between 3 and 7 levels for an adequate flow model', 'L6 หน้า 24'),
    Q('Detailed DFD หนึ่งแผ่นควรมี process ไม่เกินกี่ตัวตามสไลด์?', ['7', '5', '10', 'ไม่จำกัด'], 'Internal consistency: Detailed DFDs - at least one process and no more than seven processes', 'L6 หน้า 29'),
    Q('Decomposition ใน DFD หมายถึงอะไร?', ['การแตก process ให้เป็น child diagram ที่แสดงรายละเอียดของส่วนนั้นมากขึ้น', 'การรวม process หลายตัวเป็นตัวเดียว', 'การลบ data store ที่ไม่ใช้', 'การเปลี่ยนสัญลักษณ์จาก Yourdon เป็น Gane'], 'To build the hierarchy use decomposition: child diagrams show a portion of the parent diagram in greater detail', 'L6 หน้า 17'),
    Q('Balancing คืออะไร?', ['การทำให้ข้อมูลที่แสดงในระดับหนึ่งของ DFD ตรงกับระดับถัดไป', 'การทำให้ทุก process มีจำนวนลูกศรเท่ากัน', 'การทำให้จำนวน entity เท่ากับ data store', 'การเรียงเลข process ตามลำดับ'], 'Balancing ensures that information presented at one level of a DFD is accurately represented in the next level', 'L6 หน้า 25'),
    Q('ใน child diagram สิ่งใดเพิ่มได้ตามสไลด์ โดยไม่ถือว่าผิดการ balance?', ['process ใหม่และ data flow ใหม่ (รวมถึง error line และ transaction file)', 'external entity ใหม่ที่ parent ไม่มีเลย', 'process ที่เลขซ้ำกับ parent', 'context diagram ใหม่'], 'Child diagram adds new processes and new data flows; error lines and transaction files may be added on a detailed child diagram', 'L6 หน้า 25–26'),
    Q('ข้อใดคือกฎของ data flow ในสไลด์?', ['data flow ต้องมีชื่อเสมอ', 'data flow ไม่ต้องมีชื่อถ้าเห็นชัดเจน', 'data flow ต้องเชื่อมระหว่าง entity กับ entity', 'data flow ควรบอกวิธี implement'], 'A data flow should never go unnamed', 'L6 หน้า 27'),
    Q('ในงาน logical modeling ชื่อของ data flow ควรเป็นแบบใด?', ['อธิบายข้อมูล โดยไม่บอกวิธี implement', 'บอกชื่อตารางและชนิดฐานข้อมูลที่ใช้', 'ใช้ชื่อฟังก์ชันที่เขียนในโค้ด', 'ใช้ตัวเลขแทนชื่อ'], 'In logical modeling, data flow names should describe the data flow without describing the implementation', 'L6 หน้า 27'),
    Q('ตามกฎ data flow ทุกเส้นต้องเริ่มและ/หรือจบที่องค์ประกอบใด?', ['process', 'external entity', 'data store', 'context diagram'], 'All data flows must begin and/or end at a process', 'L6 หน้า 27'),
    Q('Process ต้องมี data flow อย่างน้อยกี่เส้น?', ['อย่างน้อย 1 input และ 1 output', 'อย่างน้อย 1 input เท่านั้น', 'อย่างน้อย 1 output เท่านั้น', 'ไม่มีข้อกำหนด'], 'Processes need to have at least one input data flow and one output data flow', 'L7 หน้า 9; L6 หน้า 28'),
    Q('ใน internal consistency data store ต้องเป็นตัวเชื่อมระหว่างอะไร?', ['ระหว่างสอง process', 'ระหว่าง external entity สองตัว', 'ระหว่าง external entity กับ data store อีกตัว', 'ระหว่าง context diagram กับ child'], 'Data store: must be an interface between two processes', 'L6 หน้า 30'),
    Q('ตาม hierarchical consistency input data flow ของ parent diagram ต้องเป็นอย่างไรใน child diagram?', ['ต้องปรากฏใน child diagram เป็น input', 'ต้องเปลี่ยนเป็น output', 'ไม่ต้องปรากฏ', 'ต้องเปลี่ยนเป็น data store'], 'An input (output) data flow on a parent diagram must appear on a child diagram as input (output)', 'L6 หน้า 31'),
    Q('Process ใน DFD ต้องแตกต่อเป็นอะไรตาม hierarchical consistency?', ['DFD แผ่นอื่น หรือ primitive process specification', 'external entity', 'data store สองตัว', 'context diagram'], 'Process must decompose to either another diagram or a primitive process specification', 'L6 หน้า 31')
  ];

  var dfd3 = [
    Q('ถ้ามี data flow เส้นหนึ่งจาก external entity ตรงเข้า data store โดยไม่ผ่าน process จะละเมิดกฎใด?', ['data flow ต้องเริ่มหรือจบที่ process', 'process ต้องมีเลขกำกับ', 'context diagram ต้องมี process เดียว', 'ชื่อ flow ต้องเป็น logical'], 'ปลายทั้งสองข้างไม่ใช่ process จึงผิดกฎ All data flows must either originate or terminate at a process', R1),
    Q('Detailed DFD แผ่นหนึ่งมี 8 process ถือว่าอย่างไรตามสไลด์?', ['เกินข้อกำหนด (ไม่เกิน 7 process)', 'ถูกต้องเพราะไม่มีข้อจำกัด', 'ผิดเพราะต้องมี process เดียว', 'ถูกต้องเพราะ Level 1 ต้องมี 8'], 'Detailed DFDs: at least one process, no more than seven processes', 'L6 หน้า 29'),
    Q('data flow จาก data store "ข้อมูลลูกค้า" ไปยัง process "ตรวจสอบสิทธิ์" หมายถึงอะไร?', ['การดึงข้อมูล (retrieval) จาก store', 'การอัปเดตข้อมูลใน store', 'การสร้าง external entity', 'การลบข้อมูลทั้งหมดใน store'], 'ลูกศรที่ออกจาก data store คือการดึงข้อมูล', 'L6 หน้า 16'),
    Q('Context diagram ที่เขียนเลข process เป็น 1 ผิดอย่างไร?', ['process ใน context diagram ต้องเลข 0', 'ต้องไม่มี process เลย', 'ต้องใช้ตัวอักษรแทนเลข', 'ไม่ผิด เพราะเริ่มที่ 1 ได้'], 'The process must be numbered 0', 'L6 หน้า 29'),
    Q('จากตัวอย่าง Library Query System process 1.2 "Search by author name" เป็น child ของ process ใด?', ['1 Search for book', '2 Check member status', '0 Library Query System', '1.1 Search by book name'], 'เลข 1.2 มาจาก parent เลข 1 บวกเลขเฉพาะ 2', 'L6 หน้า 35–37'),
    Q('ข้อใดอธิบาย expansion ratio ได้ถูกต้อง?', ['ลดลงเมื่อจำนวนระดับของ DFD เพิ่มขึ้น', 'เพิ่มขึ้นเมื่อจำนวนระดับเพิ่มขึ้น', 'คงที่ทุกระดับ', 'เท่ากับจำนวน entity ในระบบ'], 'The expansion ratio decreases as the number of levels increase', 'L6 หน้า 24'),
    Q('data flow เส้นเดียวสามารถทำอย่างไรเมื่อลงระดับที่ละเอียดขึ้นได้ตามสไลด์?', ['ถูกขยายเป็นหลายส่วนได้ (data dictionary ให้รายละเอียด)', 'ต้องคงเป็นเส้นเดียวเสมอ', 'ต้องลบออก', 'ต้องเปลี่ยนเป็น data store'], 'A single data flow item (arrow) may be expanded as levels increase (data dictionary provides information)', 'L6 หน้า 24'),
    Q('กลุ่ม data flow ใน child ที่แตกจาก data flow เส้นเดียวของ parent ต้องเป็นอย่างไร?', ['ต้องรวมแล้วตรงกับองค์ประกอบ (composition) ของ flow ใน parent', 'ต้องมีจำนวนเส้นเท่ากับ process ใน parent', 'ต้องไม่ตั้งชื่อ', 'ต้องเป็น data store ทั้งหมด'], 'A set of data flows on a child diagram split from a data flow on a parent must match the parent data flow\'s composition', 'L6 หน้า 32'),
    Q('Data flow ต้องแตกรายละเอียดต่อเป็นอะไรตาม hierarchical consistency?', ['record definition หรือ element definition (เทียบ ERD ได้)', 'process definition', 'entity ใหม่', 'control specification'], 'A data flow must decompose to either a record definition or an element definition', 'L6 หน้า 32'),
    Q('Data store ต้องแตกรายละเอียดต่อเป็นอะไรตาม hierarchical consistency?', ['file definition หรือ record definition (เทียบ ERD ได้)', 'process specification', 'external entity', 'state diagram'], 'A data store must decompose to either a file definition or a record definition', 'L6 หน้า 32'),
    Q('Primitive process specification ต้องสอดคล้องกับ DFD อย่างไร?', ['input/output ตรงกับ primitive process ใน DFD และใช้ identifier เดียวกัน', 'ใช้ชื่อใดก็ได้', 'มี input มากกว่า DFD เสมอ', 'ไม่ต้องกำกับ identifier'], 'All inputs and outputs must match those of the corresponding primitive process, and use the same identifier', 'L6 หน้า 32'),
    Q('ข้อใดไม่ใช่รูปแบบของ PSPEC ที่สไลด์ระบุ?', ['state transition table (เป็นรูปแบบของ CSPEC)', 'narrative', 'pseudocode (PDL)', 'equations'], 'PSPEC ใช้ narrative, PDL, equations, tables, diagrams/charts ส่วน state transition table เป็น combinatorial spec ของ CSPEC', 'L7 หน้า 11, 24'),
    Q('ใน design model PSPEC หนึ่งชุดจะแมปเป็นอะไร?', ['one or more components ในการออกแบบซอฟต์แวร์', 'external entity', 'data store หนึ่งตัวเสมอ', 'control flow'], 'PSPEC maps to one or more components in the software design', 'L7 หน้า 19–20'),
    Q('Structured English คืออะไร?', ['ไวยากรณ์ภาษาสำหรับระบุตรรกะของ process ตามจุดแข็งของ structured programming และภาษาอังกฤษ', 'ภาษาโปรแกรมที่ใช้เขียนระบบจริง', 'แผนภาพแสดงสถานะของ object', 'ตารางข้อมูลของ data store'], 'Structured English: a language syntax for specifying the logic of a process, based on structured programming and natural English', 'L7 หน้า 14'),
    Q('Decision table ใช้ทำอะไร?', ['ระบุชุดเงื่อนไขและ action ที่สอดคล้อง เพื่อ implement policy', 'แสดงการไหลของข้อมูลระหว่าง entity', 'เก็บข้อมูลของ data store', 'อธิบาย event แบบ Boolean ด้วยเส้นประ'], 'Decision table: a tabular form that specifies a set of conditions and their corresponding actions, as required to implement a policy', 'L7 หน้า 17'),
    Q('Policy ในบริบทของ decision table คืออะไร?', ['ชุดกฎที่กำหนดว่า process จะทำให้เสร็จอย่างไร', 'ข้อมูลที่เก็บใน data store', 'รูปแบบการให้เลข process', 'ชื่อของ data flow'], 'Policy: a set of rules that govern how a process is to be completed', 'L7 หน้า 17'),
    Q('Control flow วาดเป็นเส้นแบบใด และเขียนชื่ออะไรไว้ข้างเส้น?', ['ลูกศรเส้นประ และเขียนชื่อ event ข้างลูกศร', 'ลูกศรทึบ และเขียนชื่อ data store', 'เส้นขนานสองเส้น และเขียนเลข process', 'เส้นตรงไม่มีหัวลูกศร และเขียนชื่อ entity'], 'Control flow: dotted arrow line, direction by the arrow, name of the event beside the arrow', 'L7 หน้า 23'),
    Q('Event ของ control flow ตามสไลด์คืออะไร?', ['เงื่อนไขแบบ Boolean', 'ข้อมูลหลายชิ้นรวมกัน', 'ตาราง decision table', 'ชื่อของ process'], 'An event is a Boolean condition that can be ascertained by listing sensors, interrupts, switches, or data conditions', 'L7 หน้า 22'),
    Q('Control specification (CSPEC) แบบ sequential spec คืออะไร?', ['state diagram', 'decision table', 'activation table', 'state transition table'], 'CSPEC: state diagram เป็น sequential spec ส่วน state transition table, decision tables, activation tables เป็น combinatorial spec', 'L7 หน้า 24'),
    Q('Control flow ต่างจาก data flow ตรงใด?', ['เป็นสัญญาณที่สั่งงานหรือบอกว่าเกิดเหตุการณ์ ณ จุดเวลาหนึ่ง ไม่ใช่ข้อมูลที่เคลื่อนที่', 'control flow เก็บข้อมูลถาวรเหมือน data store', 'control flow ต้องไหลเข้า entity เท่านั้น', 'control flow ไม่มีทิศทาง'], 'A control flow is a signal that carries out a command or indicates that something has occurred, at a discrete point in time', 'L7 หน้า 22')
  ];

  /* ======================= TOPIC 2: Error detection in DFD ======================= */
  var err1 = [
    A('count', DA, 'แผนภาพนี้มีจุดที่ผิดกฎกี่จุด?', 'มีจุดเดียว คือ flow "ข้อมูลลูกค้า" จาก external entity ตรงไป data store D1 ไม่ผ่าน process (process 1.0 มี input และ output ครบ)', R1),
    A('flow1', DA, 'data flow เส้นใดในแผนภาพนี้ผิดกฎ?', 'flow "ข้อมูลลูกค้า" เชื่อม entity กับ data store ตรงๆ ไม่มี process อยู่ปลายใดปลายหนึ่ง', R1),
    Q('ควรแก้ flow "ข้อมูลลูกค้า" ในแผนภาพนั้นอย่างไร?', ['ให้ผ่าน process (เช่น 1.0) แล้วจึงเขียนเข้า D1', 'ลบ data store D1 ออก', 'เปลี่ยนชื่อ flow เป็นภาษาอังกฤษ', 'เปลี่ยนลูกค้าให้เป็น process'], 'data flow ต้องเริ่มหรือจบที่ process การเขียนเข้า store จึงต้องผ่าน process', R1, { img: null }),
    A('count', DB, 'แผนภาพนี้มีจุดที่ผิดกฎกี่จุด?', 'มีจุดเดียว คือ process 2.0 "บันทึกประวัติ" มี input แต่ไม่มี output เลย', R2),
    A('proc2', DB, 'process ใดในแผนภาพนี้ผิดกฎ?', '2.0 บันทึกประวัติ มี flow เข้าจาก 1.0 แต่ไม่มี flow ออก ผิดกฎ process ต้องมีอย่างน้อย 1 input และ 1 output', R2),
    Q('ควรแก้ process 2.0 ที่มีแต่ input อย่างไร?', ['เพิ่ม output data flow ที่ออกจาก process นั้น', 'ลบชื่อ process ออก', 'เปลี่ยน process เป็น external entity', 'ลบ flow ที่เข้า process'], 'process ต้องมีทั้ง input และ output จึงต้องเพิ่ม output (เช่นเขียนลง data store หรือส่งผลออก)', R2),
    A('count', DC, 'แผนภาพนี้มีจุดที่ผิดกฎกี่จุด?', 'มีจุดเดียว คือ flow "ผลสอบ" จากครูตรงไปยังนักเรียน (entity ถึง entity) ส่วน flow อื่นผ่าน process ทั้งหมด', R1),
    A('flow1', DC, 'data flow เส้นใดในแผนภาพนี้ผิดกฎ?', 'flow "ผลสอบ" เชื่อม external entity สองตัวโดยตรง', R1),
    Q('ถ้าครูต้องส่ง "ผลสอบ" ให้นักเรียนจริงๆ ในแผนภาพนั้น ควรแก้ให้ถูกกฎอย่างไร?', ['ส่งผ่าน process (เช่น 2.0 พิมพ์ใบคะแนน) ไปยังนักเรียน', 'ลบนักเรียนออกจากแผนภาพ', 'ใช้ data store เชื่อมครูกับนักเรียนโดยตรง', 'ตั้งชื่อ flow ใหม่ให้ยาวขึ้น'], 'flow ระหว่าง entity ต้องผ่าน process เสมอ', R1),
    A('count', DD, 'แผนภาพนี้มีจุดที่ผิดกฎกี่จุด?', 'มีจุดเดียว คือ flow จากลูกค้าไปยัง 1.0 ไม่มีชื่อ (process 1.0 มีทั้ง input และ output)', R3),
    Q('จุดที่ผิดในแผนภาพนั้นคือข้อใด?', ['flow จากลูกค้าไปยัง 1.0 ไม่มีชื่อกำกับ', 'ลูกค้าไม่ควรเชื่อมกับ process', 'process 1.0 ไม่มี output', 'ใบเสร็จต้องเก็บใน data store'], 'A data flow should never go unnamed', R3),
    A('count', DE, 'แผนภาพนี้มีจุดที่ผิดกฎกี่จุด?', 'ไม่มีจุดผิด: ทุก flow มีชื่อและมี process อยู่ปลายหนึ่ง (data store ส่งข้อมูลให้ process ได้) และ process 1.0 มี input กับ output ครบ', R1),
    Q('flow จาก data store ไปยัง data store อีกตัวโดยตรงผิดกฎอะไร?', ['data flow ต้องเริ่มหรือจบที่ process', 'process ต้องมีอย่างน้อย 1 input', 'data flow ต้องมีชื่อ', 'context diagram ต้องมี process เดียว'], 'store ต่อ store ไม่มี process อยู่ปลายใดเลย', R1),
    Q('flow จาก external entity ไปยัง data store โดยตรงผิดกฎอะไร?', ['data flow ต้องเริ่มหรือจบที่ process', 'data store ต้องมีเลขกำกับ', 'external entity ต้องอยู่ใน data store', 'ผิดเพราะ flow ไม่มีลูกศร'], 'ต้องมี process คั่นระหว่าง entity กับ store', R1),
    Q('process ที่มีเฉพาะ data flow เข้า (input) ไม่มี output ผิดกฎอะไร?', ['process ต้องมีอย่างน้อย 1 input และ 1 output', 'process ต้องเลข 0', 'process ต้องเชื่อมกับ entity เท่านั้น', 'data flow ต้องไม่มีชื่อ'], 'ข้อมูลที่เข้า process ต้องถูกแปลงเป็น output', R2),
    Q('process ที่มีเฉพาะ data flow ออก (output) ไม่มี input ผิดกฎอะไร?', ['process ต้องมีอย่างน้อย 1 input และ 1 output', 'data flow ต้องออกจาก data store เท่านั้น', 'process ต้องไม่มีเลข', 'ต้องเป็น context diagram'], 'process ต้องมีทั้ง input และ output', R2),
    Q('ข้อใดเป็น data flow ที่ถูกกฎ?', ['process ไปยัง data store', 'external entity ไปยัง external entity', 'data store ไปยัง data store', 'external entity ไปยัง data store'], 'สามข้อที่เหลือไม่มี process อยู่ปลายใดเลย ส่วน process ไปยัง store ถูกกฎ', R1),
    Q('data flow ที่ตั้งชื่อว่า "SQL INSERT INTO orders" ผิดหลักข้อใด?', ['ชื่อใน logical modeling ควรบอกข้อมูล ไม่บอกวิธี implement', 'ชื่อ flow ต้องเป็นตัวเลข', 'ชื่อ flow ต้องเหมือนชื่อ process', 'flow ห้ามมีชื่อ'], 'In logical modeling, data flow names should describe the data flow without describing the implementation', R3),
    Q('เมื่อพบ flow ระหว่าง external entity กับ external entity โดยตรง วิธีแก้ที่ถูกคือข้อใด?', ['เพิ่ม process คั่นกลางระหว่างสอง entity', 'ย้าย entity ทั้งสองเข้าไปเป็น data store', 'ลบชื่อ flow', 'เปลี่ยนลูกศรเป็นเส้นประ'], 'flow ต้องเริ่มหรือจบที่ process จึงต้องมี process อยู่ระหว่างกลาง', R1),
    Q('process คั่นกลางระหว่าง data store สองตัว (store → process → store) ถูกหรือผิดกฎ?', ['ถูกกฎ ถ้า process มี input และ output ครบ', 'ผิด เพราะ process ห้ามเชื่อมกับ data store', 'ผิด เพราะ data store ต้องอยู่นอก process', 'ผิด เพราะ ต้องมี external entity ด้วย'], 'flow แต่ละเส้นมี process อยู่ปลายหนึ่ง และ process มี input กับ output จึงถูกกฎ', R1)
  ];

  var err2 = [
    A('count', DF, 'แผนภาพนี้มีจุดที่ผิดกฎกี่จุด?', 'มี 2 จุด: flow "ประวัติผู้ป่วย" จาก entity เข้า D1 ตรงๆ และ process 2.0 "ส่งการแจ้งเตือน" ไม่มี output', 'L7 หน้า 9; L6 หน้า 28'),
    A('flow1', DF, 'data flow เส้นใดในแผนภาพนี้ที่ไม่มี process อยู่ปลายใดเลย?', 'flow "ประวัติผู้ป่วย" เชื่อม external entity กับ data store ตรงๆ', R1),
    A('proc2', DF, 'process ใดในแผนภาพนี้ที่ไม่มี output?', '2.0 ส่งการแจ้งเตือน มีแต่ flow เข้าจาก D1 ไม่มี flow ออก', R2),
    A('count', DG, 'แผนภาพนี้มีจุดที่ผิดกฎกี่จุด?', 'มี 2 จุด: flow "ย้ายสินค้า" เชื่อม data store สองตัวโดยตรง และ flow จาก 1.0 ไปยังผู้จัดการไม่มีชื่อ', 'L6 หน้า 27–28'),
    A('count1', DG, 'ในแผนภาพนี้ มี flow ที่ไม่มี process อยู่ปลายใดเลยกี่เส้น?', '1 เส้น คือ "ย้ายสินค้า" (store → store) flow อื่นล้วนมี process 1.0 อยู่ปลายหนึ่ง', R1),
    A('count3', DG, 'ในแผนภาพนี้ มี data flow ที่ไม่มีชื่อกี่เส้น?', '1 เส้น คือ flow จาก 1.0 ตรวจสต็อก ไปยังผู้จัดการ', R3),
    Q('process ที่มีแต่ input ควรแก้อย่างไรให้ถูกกฎ?', ['เพิ่ม output data flow ที่ออกจาก process', 'เปลี่ยน process เป็น data store', 'ลบ input ทั้งหมด', 'ย้าย process ไปไว้ใน context diagram'], 'process ต้องมีอย่างน้อย 1 input และ 1 output', R2),
    Q('data flow ที่ไม่มีชื่อควรแก้อย่างไร?', ['ตั้งชื่อที่อธิบายข้อมูลที่ไหล โดยไม่บอกวิธี implement', 'ลบลูกศรทิ้ง', 'ตั้งชื่อเป็นตัวเลขเรียงลำดับ', 'เปลี่ยนเป็นเส้นประ'], 'A data flow should never go unnamed และชื่อใน logical modeling อธิบายข้อมูล', R3),
    Q('จากข้อใดที่ทำให้ DFD "ผิดกฎของสไลด์" แน่นอนที่สุด?', ['มี flow ระหว่าง entity กับ entity โดยตรง', 'process ตั้งชื่อเป็นกริยา', 'มี data store มากกว่า process', 'มีหลาย flow ที่ชื่อต่างกัน'], 'กฎของสไลด์ระบุว่าทุก flow ต้องเริ่มหรือจบที่ process', R1),
    Q('ข้อใดต้องตรวจโดยดูที่ process (ไม่ใช่ดูที่ flow แต่ละเส้น)?', ['process ต้องมี input และ output อย่างน้อยอย่างละ 1', 'flow ต้องมีชื่อ', 'flow ต้องไม่เชื่อม entity กับ entity', 'flow ต้องไม่เชื่อม store กับ store'], 'กฎ input/output เป็นกฎของ process ส่วนอีกสามข้อตรวจได้จากแต่ละ flow', R2),
    Q('process 3 ตัวต่อกัน (1.0 → 2.0 → 3.0) โดยแต่ละตัวมี input และ output ครบ และไม่มี store/entity ถือว่า?', ['ไม่ผิดกฎ ถ้าทุก flow มีชื่อ', 'ผิด เพราะ process ห้ามต่อกัน', 'ผิด เพราะต้องมี data store คั่นทุกครั้ง', 'ผิด เพราะต้องมี entity ทุกคู่'], 'process → process เป็น flow ที่มี process อยู่ปลายหนึ่ง ถูกกฎ (process 1.0 ตัวแรกต้องมี input จากที่ใดที่หนึ่ง)', R1)
  ];

  var err3 = [
    A('count', DH, 'แผนภาพนี้มีจุดที่ผิดกฎรวมกี่จุด?', 'มี 4 จุด: store→store (ข้อมูลสำรอง), entity→entity (ข้อมูลบัตรซ้ำ), flow ไม่มีชื่อ (2.0 ไปยัง D1) และ process 3.0 มีแต่ input', 'L7 หน้า 9; L6 หน้า 27–28'),
    A('count1', DH, 'ในแผนภาพนี้ มี flow ที่ไม่มี process อยู่ปลายใดเลยกี่เส้น?', '2 เส้น: "ข้อมูลสำรอง" (D1 → D2) และ "ข้อมูลบัตรซ้ำ" (ลูกค้า → ธนาคาร)', R1),
    A('count2', DH, 'ในแผนภาพนี้ มี process ที่ผิดกฎ input/output กี่ตัว?', '1 ตัว คือ 3.0 ตรวจสอบยอด ที่มีเฉพาะ input จาก D1', R2),
    A('count3', DH, 'ในแผนภาพนี้ มี data flow ที่ไม่มีชื่อกี่เส้น?', '1 เส้น คือ flow จาก 2.0 ออกใบเสร็จ ไปยัง D1', R3),
    A('count', DI, 'แผนภาพนี้มีจุดที่ผิดกฎรวมกี่จุด?', 'มี 3 จุด: ผู้สมัคร→D1 (entity→store), flow จากเจ้าหน้าที่ไป 2.0 ไม่มีชื่อ และ process 3.0 ไม่มี output', 'L7 หน้า 9; L6 หน้า 27–28'),
    A('proc2', DI, 'process ใดในแผนภาพนี้ที่ไม่มี output?', '3.0 แจ้งผล มี input จาก 2.0 แต่ไม่มี flow ออก', R2),
    A('count3', DI, 'ในแผนภาพนี้ มี data flow ที่ไม่มีชื่อกี่เส้น?', '1 เส้น คือ flow จากเจ้าหน้าที่ไปยัง 2.0 พิจารณา', R3),
    A('count', DJ, 'แผนภาพนี้ (D1 → 1.0 → D2) มีจุดที่ผิดกฎกี่จุด?', 'ไม่มีจุดผิด: process 1.0 มี input จาก D1 และ output ไป D2 และทุก flow มี process อยู่ปลายหนึ่ง', R1),
    A('count', DK, 'แผนภาพนี้ มี data flow สองทิศระหว่าง 1.0 กับ D1 และมีจุดที่ผิดกฎกี่จุด?', 'ไม่มีจุดผิด: process อ่านจาก store (ยอดเดิม) และเขียนกลับ (ยอดใหม่) ได้ และมี flow ครบมีชื่อ', R1),
    Q('Parent diagram มี process 2 รับ flow "คำขอ" จาก external entity แต่ child diagram ของ process 2 ไม่มี flow "คำขอ" เข้าเลย ผิดกฎใด?', ['input flow ของ parent ต้องปรากฏใน child เป็น input (ไม่ balance)', 'process ต้องมีเลข 0', 'data store ต้องอยู่ระหว่างสอง process', 'flow ต้องไม่มีชื่อ'], 'An input data flow on a parent diagram must appear on a child diagram as input', 'L6 หน้า 31'),
    Q('Child diagram ของ process 3 เพิ่ม error line ที่ออกจาก process ย่อยเพื่อรายงานข้อผิดพลาดภายใน ถือว่า?', ['ไม่ผิด child เพิ่ม error line และ transaction file ได้', 'ผิด เพราะ child ห้ามมี flow ที่ parent ไม่มี', 'ผิด เพราะ error ต้องอยู่ใน context diagram', 'ผิด เพราะ flow ต้องมีชื่อภาษาอังกฤษ'], 'Error lines and transaction files may be added on a detailed child diagram', 'L6 หน้า 26'),
    Q('Child diagram ของ process 3 ใช้เลข process 1.1, 1.2 แทนที่จะเป็น 3.1, 3.2 ผิดกฎใด?', ['process ต้องให้เลขสอดคล้องกับ parent (numbered with respect to its parent)', 'process ต้องเป็นจำนวนเต็ม', 'ห้ามใช้จุดในเลข', 'เลขต้องเริ่มที่ 0'], 'Process must be numbered with respect to its parent', 'L6 หน้า 31, 33'),
    Q('Context diagram ที่มี process 2 ตัว ผิดกฎใด?', ['context diagram ต้องมี process เพียงตัวเดียว', 'context diagram ต้องไม่มี entity', 'context diagram ต้องมี data store', 'ไม่ผิด'], 'Context diagram: must contain only one process', 'L6 หน้า 29'),
    Q('Level 1 DFD แผ่นหนึ่งมี 9 process ผิดอย่างไร?', ['เกินข้อกำหนด (detailed DFD ไม่เกิน 7 process)', 'ไม่ผิด', 'ผิด เพราะต้องมีเลขคู่', 'ผิด เพราะต้องมี 3 process พอดี'], 'No more than seven processes', 'L6 หน้า 29'),
    Q('Context diagram ที่ process มีเฉพาะ flow เข้าจาก entity ไม่มี flow ออกไป entity ผิดกฎใด?', ['ต้องมีอย่างน้อย 1 input จาก entity และ 1 output ไป entity', 'ต้องมี data store สอง', 'ต้องไม่มี entity', 'process ต้องเลข 1'], 'Context diagram: at least one input from an external entity and one output to an external entity', 'L6 หน้า 29'),
    Q('DFD ที่ไม่ใช่ context diagram แต่ไม่มี parent diagram อ้างถึง ผิดกฎใด?', ['ต้องมี parent diagram เสมอ ยกเว้น context diagram', 'ต้องมี data store อย่างน้อย 2', 'ต้องมี external entity ทุกตัว', 'ไม่ผิด'], 'A parent diagram must exist unless it is a context diagram', 'L6 หน้า 31'),
    Q('ในการวิเคราะห์ DFD ที่มีหลายข้อผิด ควรตรวจอะไรเป็นลำดับแรกตามกฎของสไลด์เพื่อหา flow ผิดอย่างเป็นระบบ?', ['ไล่ดูทีละ flow ว่ามี process อยู่ปลายหนึ่งหรือไม่ แล้วไล่ดูทีละ process ว่ามี input/output ครบหรือไม่ และ flow มีชื่อหรือไม่', 'นับจำนวนลูกศรทั้งหมด', 'ดูว่ามีกี่สีในแผนภาพ', 'ดูชื่อ process ว่ายาวไหม'], 'ทั้งสามกฎหลักตรวจได้ทีละองค์ประกอบ: flow ทุกเส้นเริ่มหรือจบที่ process, process ทุกตัวมี input/output, flow ทุกเส้นมีชื่อ', R1)
  ];

  /* ======================= TOPIC 3: Git functions ======================= */
  var git1 = [
    Q('Software Configuration Management (CM) คืออะไร?', ['วินัยและเทคนิคในการเริ่มต้น ประเมิน และควบคุมการเปลี่ยนแปลงของผลิตภัณฑ์ซอฟต์แวร์ ทั้งระหว่างและหลังการพัฒนา', 'การทดสอบซอฟต์แวร์ก่อนส่งมอบให้ลูกค้า', 'การออกแบบโครงสร้างฐานข้อมูลของระบบ', 'การเขียนคู่มือผู้ใช้'], 'CM encompasses the disciplines and techniques of initiating, evaluating and controlling change to software products during and after the software engineering process', 'L11 หน้า 4'),
    Q('มาตรฐานใดคือ Software Configuration Management Plans?', ['IEEE 828', 'IEEE 1042', 'IEEE 830', 'ISO 9001'], 'สไลด์: IEEE 828 Software Configuration Management Plans ส่วน IEEE 1042 เป็น Guide to SCM', 'L11 หน้า 4'),
    Q('IEEE 1042 คือมาตรฐานเรื่องใด?', ['Guide to Software Configuration Management', 'Software Configuration Management Plans', 'Software Requirements Specification', 'Unit Testing'], 'สไลด์: IEEE 1042 Guide to Software Configuration Management', 'L11 หน้า 4'),
    Q('Configuration item คืออะไร?', ['ซอฟต์แวร์ เอกสาร ฮาร์ดแวร์ หรืองานที่เปลี่ยนแปลงได้ และเราต้องการติดตามและควบคุม', 'เฉพาะไฟล์ source code เท่านั้น', 'บุคคลในทีมพัฒนา', 'คำสั่ง Git ที่ใช้บ่อย'], 'A piece of software, a document, a piece of hardware or work product which is subject to change is a configuration item', 'L11 หน้า 6'),
    Q('ข้อใดเป็น configuration item ได้ตามสไลด์?', ['เวอร์ชันของคอมไพเลอร์ที่ใช้ (system configuration)', 'ตารางนัดประชุมส่วนตัวของสมาชิก', 'ความเห็นที่พูดในห้องประชุมแต่ไม่ได้บันทึก', 'เบอร์โทรศัพท์ของลูกค้า'], 'สไลด์ยกตัวอย่าง system configurations (e.g. version of compiler used) รวมถึงโค้ด test drivers เอกสาร requirement/design และคู่มือ', 'L11 หน้า 6'),
    Q('ข้อเสียของ version numbering แบบเรียงเส้น (V1, V1.1, V1.2) ตามสไลด์คืออะไร?', ['ชื่อเวอร์ชันไม่มีความหมาย (names are not meaningful)', 'ใช้กับเอกสารไม่ได้', 'ต้องใช้ attribute หลายตัวเสมอ', 'ห้ามมีเลขทศนิยม'], 'Version numbering: simple naming scheme uses a linear derivation; names are not meaningful', 'L11 หน้า 7'),
    Q('Attribute-based identification ระบุเวอร์ชันอย่างไร?', ['ใช้ชุด attribute เช่น วันที่ ผู้สร้าง ภาษา ลูกค้า สถานะ รวมกันระบุเวอร์ชัน', 'ใช้เลขเรียงเส้น V1, V2', 'ใช้ชื่อ branch อย่างเดียว', 'ใช้ขนาดไฟล์'], 'Attributes such as Date, Creator, Programming Language, Customer, Status; the combination identifies the version', 'L11 หน้า 7'),
    Q('Version Control System (VCS) เป็นส่วนประกอบของอะไร?', ['Configuration management', 'Unit testing', 'Requirements modeling', 'Usability testing'], 'It is a component in configuration management', 'L11 หน้า 10'),
    Q('ข้อใดไม่ใช่วัตถุประสงค์ของ VCS ตามสไลด์?', ['ทดสอบความถูกต้องของโค้ดโดยอัตโนมัติ', 'กู้คืน configuration ก่อนหน้า', 'ประสานการเปลี่ยนแปลงระหว่างคน', 'ระบุเวอร์ชันและ component'], 'วัตถุประสงค์ 3 ข้อ: restoring previous configurations, coordinating changes, identifying versions and components', 'L11 หน้า 10'),
    Q('Git คืออะไรตามสไลด์?', ['ระบบควบคุมเวอร์ชันแบบกระจาย (distributed) ฟรีและ open-source', 'ระบบควบคุมเวอร์ชันแบบรวมศูนย์ที่ต้องซื้อลิขสิทธิ์', 'โปรแกรมทดสอบ unit test', 'ฐานข้อมูลเก็บ requirement'], 'Git is a free and open-source distributed version control system', 'L11 หน้า 15'),
    Q('ข้อใดไม่ใช่คุณสมบัติของ distributed version control ตามสไลด์?', ['ทุกการทำงานต้องต่อกับเซิร์ฟเวอร์กลางเสมอ', 'เกือบทุกการทำงานทำแบบ offline ได้', 'เกือบทุก repository ที่ clone มาเป็น backup ได้', 'เกือบทุก repository มีประวัติครบ'], 'Almost everything is local, works offline, every clone is a backup, all repositories have the full history', 'L11 หน้า 16'),
    Q('Staging area (index) ใน Git คืออะไร?', ['ที่รวบรวมการเปลี่ยนแปลงที่จะถูก commit ใช้เตรียมก่อน commit', 'repository บนเซิร์ฟเวอร์', 'branch หลักของโปรเจกต์', 'ไฟล์ log ของ Git'], 'These are changes which will be committed; the staging area can be used to prepare for the commit', 'L11 หน้า 17'),
    Q('จุดเด่นของ Git ที่ต่างจาก VCS อื่นตามสไลด์คืออะไร?', ['มีแนวคิด staging area (index)', 'ไม่มี branch', 'ต้องต่ออินเทอร์เน็ตตลอด', 'เก็บเฉพาะไฟล์ล่าสุด ไม่เก็บประวัติ'], 'Unlike other version control systems, GIT has a concept of the staging area (index)', 'L11 หน้า 17'),
    Q('ไฟล์สถานะ untracked เมื่อสั่ง git add จะเปลี่ยนเป็นสถานะใด?', ['staged', 'unmodified', 'modified', 'untracked เหมือนเดิม'], 'File status lifecycle: untracked --add--> staged', 'L11 หน้า 18–19'),
    Q('ไฟล์สถานะ staged เมื่อ commit แล้วจะเป็นสถานะใด?', ['unmodified', 'modified', 'untracked', 'staged เหมือนเดิม'], 'staged --commit--> unmodified', 'L11 หน้า 18–19'),
    Q('ไฟล์ unmodified เมื่อเราแก้ไข (edit) จะเป็นสถานะใด?', ['modified', 'staged', 'untracked', 'committed'], 'unmodified --edit--> modified', 'L11 หน้า 18–19'),
    Q('ไฟล์ modified ต้องทำอะไรจึงจะกลับไปเป็น staged?', ['git add', 'git commit', 'git push', 'git log'], 'modified --add--> staged', 'L11 หน้า 18–19'),
    Q('ไฟล์ staged ถ้าทำ remove ตาม lifecycle ในสไลด์จะกลับเป็นสถานะใด?', ['untracked', 'unmodified', 'modified', 'committed'], 'staged --remove--> untracked', 'L11 หน้า 18'),
    Q('CVS ในสไลด์ทำงานแบบใด?', ['มี repository กลาง ผู้ใช้ checkout มาแก้แล้ว checkin กลับ', 'ทุกคนมี repository เต็มของตัวเองแบบ Git', 'ไม่มีการเก็บเวอร์ชัน', 'ใช้ staging area เหมือน Git'], 'ภาพ CVS: Alice และ Bob checkout/checkin กับ Repository กลางตัวเดียว', 'L11 หน้า 12'),
    Q('"Decentralized but Centralized" หมายความว่าอย่างไร?', ['ทุกคนมี repository ของตัวเอง แต่ push/pull ผ่าน repository กลางร่วมกัน', 'ทุกคนใช้คอมพิวเตอร์เครื่องเดียวกัน', 'ห้ามใช้ repository กลาง', 'ต้อง commit ลงเซิร์ฟเวอร์โดยตรงเท่านั้น'], 'ภาพสไลด์แสดงแต่ละคนมี repo ของตัวเองและ push/pull กับ origin กลาง', 'L11 หน้า 24')
  ];

  var git2 = [
    Q('git add <file> ทำอะไร?', ['นำการเปลี่ยนแปลงที่เลือกจาก working directory เข้า staging area', 'ส่ง commit ขึ้น remote', 'ดึงข้อมูลจาก remote แล้ว merge', 'สร้าง branch ใหม่'], 'Add: adding selected changes from the working directory to the staging area; specifies which changes will be in the next commit', 'L11 หน้า 20'),
    Q('git commit -m "message" ทำอะไร?', ['นำ staged changes เข้า local repository และสร้างเวอร์ชันใหม่ (commit)', 'ส่งไฟล์ขึ้น remote ทันที', 'ลบไฟล์ออกจาก staging area', 'ดึง branch ทั้งหมดจาก remote'], 'Commit: adding the staged changes to the local repository; creates a new version; message describes the changes', 'L11 หน้า 21'),
    Q('git pull ทำอะไร?', ['ดึงการเปลี่ยนแปลงจาก remote แล้ว merge เข้า branch ปัจจุบัน (fetch + merge)', 'ส่ง local commits ไป remote', 'ดึงข้อมูลอย่างเดียวโดยไม่ merge', 'ลบ branch บน remote'], 'Pull fetches the remote changes and merges them into the current branch', 'L11 หน้า 22; cheat sheet'),
    Q('git push ทำอะไร?', ['ส่ง local commits ไป remote repository ให้คนอื่นเห็น', 'ดึงการเปลี่ยนแปลงจาก remote', 'stage ไฟล์', 'ดูประวัติ commit'], 'Push: adding the local commits to the remote repository; makes local changes available to other collaborators', 'L11 หน้า 23'),
    Q('git push อาจถูกปฏิเสธเมื่อใด?', ['เมื่อ remote มีการเปลี่ยนแปลงที่ local ยังไม่มี', 'เมื่อ commit message ยาวเกินไป', 'เมื่อยังไม่ได้สร้าง branch ใหม่', 'เมื่อไฟล์อยู่ในสถานะ unmodified'], 'Push may be rejected if the remote repository contains changes that are not in the local repository (ต้อง pull ก่อน)', 'L11 หน้า 23'),
    Q('git fetch [alias] ต่างจาก git pull อย่างไร?', ['fetch ดึงทุก branch จาก remote มาเฉยๆ ยังไม่ merge', 'fetch ส่งข้อมูลขึ้น remote', 'fetch ลบ branch บน remote', 'fetch เหมือน pull ทุกอย่าง'], 'cheat sheet: git fetch = fetch down all the branches; git pull = fetch and merge', 'Git cheat sheet'),
    Q('git status แสดงอะไร?', ['ไฟล์ที่แก้ใน working directory และไฟล์ที่ staged รอ commit', 'ประวัติ commit ทั้งหมด', 'รายชื่อ branch บน remote', 'ความต่างระหว่างสอง branch'], 'git status: show modified files in working directory, staged for your next commit', 'Git cheat sheet'),
    Q('git diff (ไม่มี option) แสดงอะไร?', ['สิ่งที่แก้แล้วแต่ยังไม่ stage', 'สิ่งที่ stage แล้วแต่ยังไม่ commit', 'ประวัติ commit', 'รายชื่อไฟล์ที่ถูกลบ'], 'git diff: diff of what is changed but not staged', 'Git cheat sheet'),
    Q('git diff --staged แสดงอะไร?', ['สิ่งที่ stage แล้วแต่ยังไม่ commit', 'สิ่งที่แก้แต่ยังไม่ stage', 'ความต่างระหว่าง local กับ remote', 'ไฟล์ที่ untracked'], 'git diff --staged: diff of what is staged but not yet committed', 'Git cheat sheet'),
    Q('git reset [file] ทำอะไร?', ['เอาไฟล์ออกจาก stage (unstage) แต่การแก้ไขยังอยู่ใน working directory', 'ลบไฟล์ออกจากเครื่องถาวร', 'ย้อน working tree ไป commit เก่าและลบการแก้ไข', 'ส่งไฟล์ขึ้น remote'], 'git reset [file]: unstage a file while retaining the changes in working directory', 'Git cheat sheet'),
    Q('git init ทำอะไร?', ['ทำให้โฟลเดอร์ที่มีอยู่เป็น Git repository', 'ดึง repository จาก URL', 'สร้าง branch ใหม่', 'ตั้งชื่อผู้ใช้'], 'git init: initialize an existing directory as a Git repository', 'Git cheat sheet'),
    Q('git clone [url] ทำอะไร?', ['ดึง repository ทั้งก้อนจากที่เก็บบน URL มาไว้ในเครื่อง', 'สร้าง repository เปล่า', 'ส่ง commit ขึ้น URL', 'ลบ repository'], 'git clone: retrieve an entire repository from a hosted location via URL', 'Git cheat sheet'),
    Q('git branch [branch-name] ทำอะไร?', ['สร้าง branch ใหม่ที่ commit ปัจจุบัน', 'สลับไปยัง branch นั้น', 'ลบ branch นั้น', 'merge branch นั้น'], 'git branch [branch-name]: create a new branch at the current commit (git branch เฉยๆ = แสดงรายการ branch)', 'Git cheat sheet'),
    Q('คำสั่งใดใช้สลับไปทำงานบน branch อื่น?', ['git checkout', 'git branch', 'git merge', 'git log'], 'git checkout: switch to another branch and check it out into your working directory', 'Git cheat sheet'),
    Q('git merge [branch] ทำอะไร?', ['รวมประวัติของ branch ที่ระบุเข้ามาใน branch ปัจจุบัน', 'สร้าง branch ใหม่', 'ส่ง branch ขึ้น remote', 'ลบ branch ที่ระบุ'], 'git merge [branch]: merge the specified branch\'s history into the current one', 'Git cheat sheet'),
    Q('git log แสดงอะไร?', ['ประวัติ commit ของ branch ปัจจุบัน', 'ไฟล์ที่แก้แต่ยังไม่ stage', 'รายชื่อ remote', 'เนื้อหาของ stash'], 'git log: show all commits in the current branch\'s history', 'Git cheat sheet'),
    Q('git stash ใช้ทำอะไร?', ['เก็บงานที่แก้และ stage ไว้ชั่วคราว เพื่อเปลี่ยนไปทำ branch อื่น', 'ลบงานที่ยังไม่ commit ทิ้งถาวร', 'ส่งงานขึ้น remote', 'สร้าง tag'], 'TEMPORARY COMMITS: temporarily store modified, tracked files in order to change branches', 'Git cheat sheet'),
    Q('git stash pop ทำอะไร?', ['นำงานที่อยู่บนสุดของ stash กลับมาใน working directory', 'ทิ้งงานบนสุดของ stash', 'แสดงรายการ stash ทั้งหมด', 'สร้าง stash ใหม่'], 'git stash pop: write working from top of stash stack (stash drop = ทิ้ง, stash list = ดูรายการ)', 'Git cheat sheet'),
    Q('git rm [file] ทำอะไร?', ['ลบไฟล์ออกจากโปรเจกต์และ stage การลบนั้นรอ commit', 'unstage ไฟล์', 'เปลี่ยนชื่อไฟล์', 'ลบ branch'], 'git rm [file]: delete the file from project and stage the removal for commit', 'Git cheat sheet'),
    Q('ลำดับคำสั่งที่ถูกต้องเพื่อนำไฟล์ใหม่ขึ้นไปบน remote คือข้อใด?', ['git add → git commit → git push', 'git commit → git add → git push', 'git push → git add → git commit', 'git pull → git push → git add'], 'add เข้า staging, commit เข้า local repository, push ส่งขึ้น remote', 'L11 หน้า 19–23')
  ];

  var git3 = [
    Q('Branch เริ่มต้นของ Git ตามสไลด์ชื่ออะไร?', ['master', 'develop', 'feature', 'hotfix'], 'Git has one default branch called the "master" branch', 'L11 หน้า 25'),
    Q('ข้อใดอธิบาย master branch ได้ถูกต้อง?', ['deploy ได้ เป็น production code และต้อง stable', 'ใช้ทดลองโค้ดใหม่ที่ยังไม่ทดสอบ', 'ใช้เก็บเฉพาะเอกสาร', 'ลบทิ้งได้ทุกครั้งที่ release'], 'The master branch is deployable, it is your production code, and it is meant to be stable', 'L11 หน้า 25'),
    Q('"Social contract" ของ open-source เรื่อง master คืออะไร?', ['ห้าม push สิ่งที่ยังไม่ทดสอบหรือทำให้ build พังเข้า master', 'ทุกคนต้อง push เข้า master ทุกวัน', 'master ห้ามมี commit เกิน 100', 'ต้องลบ master หลัง release'], 'Never, ever push anything to master that is not tested, or that breaks the build', 'L11 หน้า 25'),
    Q('ข้อใดไม่ใช่เหตุผลในการสร้าง branch ใหม่ตามสไลด์?', ['เมื่อต้องการลบประวัติ commit ทั้งหมดของโปรเจกต์', 'เพิ่ม feature ใหม่', 'ทำ release ใหม่ของซอฟต์แวร์', 'แก้ bug'], 'When to create a branch: adding a new feature, working on a new release, experimenting, fixing a bug', 'L11 หน้า 26'),
    Q('Main branches ใน Git branching model มีอะไรบ้าง?', ['master และ develop', 'feature และ hotfix', 'release และ feature', 'master เพียงอย่างเดียว'], 'The main branches always include master and develop', 'L11 หน้า 28'),
    Q('develop branch สะท้อนสถานะใด?', ['งานพัฒนาล่าสุดที่ส่งมอบแล้วสำหรับ release ถัดไป', 'production-ready เสมอ', 'เฉพาะการแก้บั๊กด่วน', 'โค้ดทดลองของแต่ละคน'], 'develop reflects a state with the latest delivered development changes for the next release', 'L11 หน้า 28'),
    Q('master branch ใน branching model สะท้อนสถานะใด?', ['production-ready เสมอ', 'งานล่าสุดที่ยังไม่ทดสอบ', 'feature ที่ยังทำไม่เสร็จ', 'งานทดลอง'], 'master: the source code always reflects a production-ready state', 'L11 หน้า 28'),
    Q('Feature branch (topic branch) ใช้ทำอะไร?', ['พัฒนา feature ใหม่สำหรับ release ที่จะมาหรือในอนาคตไกล', 'แก้บั๊กวิกฤตบน production', 'เตรียม production release', 'เก็บ tag ของเวอร์ชัน'], 'Feature branches are used to develop new features for the upcoming or a distant future release', 'L11 หน้า 30'),
    Q('Release branch มีไว้เพื่ออะไร?', ['เตรียม production release ใหม่ ทำให้ develop ว่างรับ feature ของ release ถัดไป', 'พัฒนา feature ใหม่ระยะยาว', 'แก้บั๊กด่วนบน production', 'แทนที่ master'], 'Release branches support preparation of a new production release; the develop branch is cleared to receive features for the next big release', 'L11 หน้า 31'),
    Q('Hotfix branch ใช้เมื่อใด?', ['ต้องแก้สถานะที่ไม่พึงประสงค์ของ production ที่ใช้งานอยู่ทันที', 'เริ่ม feature ใหม่', 'เตรียม release ปกติ', 'ทดลองไอเดียใหม่'], 'Hotfix branches arise from the necessity to act immediately upon an undesired state of a live production version', 'L11 หน้า 32'),
    Q('Hotfix branch แตกออกมาจากที่ใด?', ['tag บน master ที่ตรงกับเวอร์ชัน production', 'develop', 'feature branch', 'release branch ล่าสุด'], 'A hotfix branch may be branched off from the corresponding tag on the master branch that marks the production version', 'L11 หน้า 32'),
    Q('สถานการณ์: production เวอร์ชัน 1.2 มีบั๊กร้ายแรงต้องแก้ทันที ควรทำอย่างไร?', ['สร้าง hotfix branch จาก tag 1.2 บน master', 'สร้าง feature branch จาก develop', 'แก้ตรงบน develop แล้วรอ release ถัดไป', 'สร้าง release branch ใหม่จาก develop'], 'บั๊กวิกฤตบน production ใช้ hotfix ที่แตกจาก tag บน master', 'L11 หน้า 32'),
    Q('สถานการณ์: จะเริ่มทำ feature ใหม่สำหรับ release ถัดไป ควรแตก branch จากที่ใด?', ['develop (สร้าง feature branch)', 'master (สร้าง hotfix)', 'tag 1.0', 'release branch'], 'ภาพ feature branches แตกจาก develop และ merge กลับเข้า develop', 'L11 หน้า 30'),
    Q('งานที่ทำบน release branch ตามภาพในสไลด์ควรเป็นงานแบบใด?', ['เฉพาะการแก้บั๊ก (only bugfixes)', 'feature ใหม่ขนาดใหญ่', 'ทดลองไอเดีย', 'ลบโค้ดทั้งหมด'], 'ภาพ release branch มีป้ายว่า Only bugfixes!', 'L11 หน้า 31'),
    Q('การแก้บั๊กบน release branch ควรทำอะไรต่อตามภาพในสไลด์?', ['merge กลับเข้า develop อย่างต่อเนื่อง', 'ทิ้งไปเมื่อ release เสร็จ', 'ส่งเข้า feature branch เท่านั้น', 'ไม่ต้องทำอะไร'], 'Bugfixes from rel. branch may be continuously merged back into develop', 'L11 หน้า 31, 33'),
    Q('เมื่อ release branch พร้อม จะ merge เข้าที่ใดและเกิดอะไรขึ้นบน master?', ['merge เข้า master และติด tag เวอร์ชัน (เช่น 1.0)', 'merge เข้า feature branch', 'ไม่ merge ที่ไหนเลย', 'merge เข้า hotfix'], 'ภาพ release branch ลูกศรไปที่ master พร้อม Tag 1.0', 'L11 หน้า 31'),
    Q('เมื่อแก้ hotfix เสร็จ ต้อง merge กลับเข้าที่ใดบ้างตามภาพในสไลด์?', ['ทั้ง master (ติด tag ใหม่ เช่น 1.2.1) และ develop', 'master อย่างเดียว', 'develop อย่างเดียว', 'feature branch'], 'ภาพ hotfix: merge เข้า master เป็น Tag 1.2.1 และ merge เข้า develop', 'L11 หน้า 32'),
    Q('ปัญหาหลักของการแตก branch ตามสไลด์คืออะไร?', ['conflict ตอน merge', 'branch ใช้พื้นที่มากเกินไป', 'ทำให้ commit หาย', 'branch ห้ามลบ'], 'Branching can cause problems due to conflicts at merge; resolving conflicts without tool support is painful', 'L11 หน้า 27'),
    Q('Supporting branches ใน branching model มีอะไรบ้าง?', ['feature, release, hotfix', 'master, develop', 'origin, remote', 'stash, tag'], 'Supporting branches: feature branches, release branches, hotfix branches', 'L11 หน้า 29'),
    Q('สองคนแก้บรรทัดเดียวกันของไฟล์แล้ว merge จะเกิดอะไรและควรทำอย่างไร?', ['เกิด conflict ต้องแก้ conflict ก่อนจึง commit การ merge ได้', 'Git เลือกของคนที่ commit ก่อนเสมอ', 'Git ลบไฟล์นั้นทิ้ง', 'ไม่มีผลอะไร'], 'Merges are usually automatic; conflicts will occur and must be resolved (pull: relatively easy to deal with)', 'L11 หน้า 22, 27')
  ];

  /* ======================= TOPIC 4: Unit test ======================= */
  var unit1 = [
    Q('Testing ตามสไลด์ L13 คืออะไร?', ['กิจกรรมหาว่าโค้ด (method, class, program) ให้พฤติกรรมตามที่ตั้งใจหรือไม่', 'การเขียน requirement', 'การออกแบบหน้าจอ', 'การ deploy ระบบ'], 'Testing is the activity of finding out whether a piece of code produces the intended behavior', 'L13 หน้า 4'),
    Q('Unit testing ทำกับอะไร?', ['หน่วยที่เล็กที่สุดที่ทดสอบได้ของ source code', 'ระบบที่ integrate ครบ', 'กลุ่มของ module', 'เฉพาะหน้าจอผู้ใช้'], 'Performs on individual units of source code (= smallest testable part)', 'L13 หน้า 5'),
    Q('test phase ใดเล็กสุด เร็วสุด ต้นทุนต่ำสุด และทำบ่อยที่สุด?', ['Unit testing', 'Integration testing', 'System testing', 'Acceptance testing'], 'Unit testing: smallest tests, fastest to run, lowest cost, done frequently', 'L13 หน้า 5'),
    Q('test phase ใดต้นทุนสูงสุดและทำนานๆ ครั้ง?', ['System testing', 'Unit testing', 'Integration testing', 'Regression testing'], 'System testing: full system test, highest cost, run infrequently', 'L13 หน้า 5'),
    Q('Integration testing คืออะไร?', ['ทดสอบการทำงานร่วมกันระหว่างหน่วยหรือคอมโพเนนต์ที่รวมกัน เพื่อหาปัญหาการสื่อสาร', 'ทดสอบ method เดียวแยกจากส่วนอื่น', 'ทดสอบกับผู้ใช้จริง', 'ทดสอบความเร็วของฮาร์ดแวร์'], 'Testing the interaction between integrated units or components to check for communication issues', 'L13 หน้า 15'),
    Q('ตัวอย่าง integration test ในสไลด์คือข้อใด?', ['ทดสอบฟังก์ชันที่ต้องพึ่งการเชื่อมต่อฐานข้อมูล', 'ทดสอบสูตรคำนวณ VAT ใน method เดียว', 'ให้ผู้ใช้ลองทำงานแล้วจับเวลา', 'สแกนหาช่องโหว่'], 'Testing a function that relies on a database connection, where both components are required to work together', 'L13 หน้า 15'),
    Q('System testing คืออะไร?', ['ทดสอบระบบที่ integrate ครบ ว่าตรงตาม functional และ non-functional requirement', 'ทดสอบเฉพาะ interface ระหว่าง module', 'ทดสอบ method เดียว', 'ตรวจโค้ดโดยไม่รัน'], 'Testing the complete integrated system to verify it meets functional and non-functional requirements', 'L13 หน้า 18'),
    Q('Non-functional testing ตรวจอะไร?', ['performance, usability และ reliability', 'ว่าระบบทำฟังก์ชันที่คาดหวัง', 'ช่องโหว่ด้านความปลอดภัยเท่านั้น', 'ชื่อตัวแปร'], 'Non-functional Testing: checks performance, usability, and reliability', 'L13 หน้า 18'),
    Q('Security testing ตามสไลด์ทดสอบอะไร?', ['ช่องโหว่ที่อาจเกิดขึ้น (potential vulnerabilities)', 'ความเร็วในการตอบสนอง', 'ความสวยงามของหน้าจอ', 'การทำงานร่วมกันของ module'], 'Security Testing: tests for potential vulnerabilities', 'L13 หน้า 18'),
    Q('จากตารางเปรียบเทียบ test ระดับใดต้องใช้ scaffolding มาก (often extensive)?', ['Integration test', 'Module/Unit test', 'System test', 'ทุกระดับเท่ากัน'], 'ตาราง: Scaffolding required: Unit = Some, Integration = Often extensive, System = Some', 'L13 หน้า 16'),
    Q('System test ใช้อะไรเป็น specification?', ['Requirements specification', 'Module interface', 'Interface specs และ module breakdown', 'Source code'], 'ตาราง: Specification ของ System test = Requirements specification', 'L13 หน้า 16'),
    Q('Unit test มองหา fault ที่ใด?', ['Modules', 'Interactions และ compatibility', 'System functionality', 'Requirements'], 'ตาราง: Looking for faults in: Unit = Modules', 'L13 หน้า 16'),
    Q('Integration test มองหา fault ที่ใด?', ['Interactions และ compatibility', 'Modules', 'System functionality', 'User interface'], 'ตาราง: Looking for faults in: Integration = Interactions, compatibility', 'L13 หน้า 16'),
    Q('System test มองเห็นโครงสร้างภายใน (visible structure) ระดับใด?', ['ไม่เห็นเลย (none)', 'Coding details', 'Modular structure', 'เห็นทุกบรรทัด'], 'ตาราง: Visible structure: Unit = coding details, Integration = modular structure, System = none', 'L13 หน้า 16'),
    Q('ข้อใดเป็นคุณสมบัติของ unit test ที่ดี?', ['แต่ละ test โฟกัสที่ function หรือ method เดียว ไม่พึ่งส่วนอื่น', 'test หนึ่งตัวควรทดสอบทั้งระบบ', 'ควรรันช้าเพื่อความละเอียด', 'ควรรันด้วยมือเท่านั้น'], 'Each test should only focus on one function or method, avoiding dependencies on other parts', 'L13 หน้า 6'),
    Q('ข้อใดไม่ใช่คุณสมบัติของ unit test ที่ดี?', ['ผลลัพธ์เปลี่ยนไปตามเวลาหรือสภาพแวดล้อมภายนอก', 'รันได้เร็ว', 'รันอัตโนมัติใน CI/CD ได้', 'ได้ผลเหมือนเดิมทุกครั้ง'], 'Each test should yield the same result every time it runs, independent of external factors', 'L13 หน้า 6'),
    Q('ข้อใดถูกต้องเกี่ยวกับ integration กับ unit testing?', ['Integration testing ชดเชย unit testing ที่ไม่เพียงพอไม่ได้', 'ถ้าทำ integration แล้วไม่ต้องทำ unit test', 'Unit level มี controllability ต่ำที่สุด', 'Integration ทำก่อน unit เสมอ'], 'Integration testing can never compensate for inadequate unit testing; unit level has maximum controllability and visibility', 'L13 หน้า 17'),
    Q('ถ้า integration testing พบ fault ภายใน module เดียว แปลว่าอะไร?', ['unit testing ของ module นั้นไม่เพียงพอ', 'interface spec ผิด', 'system test ผิด', 'ไม่มีความหมายอะไร'], 'If module faults are revealed in integration testing, they signal inadequate unit testing', 'L13 หน้า 17'),
    Q('ถ้า fault เกิดที่ interface ระหว่าง module ที่เขียนถูกต้องทั้งคู่ ต้องย้อนไปดูที่ใด?', ['การแบ่ง module และ interface specification', 'unit test ของแต่ละ module', 'requirement ของผู้ใช้', 'ฮาร์ดแวร์'], 'Errors can be traced to module breakdown and interface specifications', 'L13 หน้า 17'),
    Q('ข้อใดไม่ใช่เวลาที่ควรทำ regression testing ตามสไลด์?', ['ก่อนเขียนโค้ดบรรทัดแรกของโปรเจกต์', 'หลังแก้บั๊ก', 'หลังเพิ่ม feature หรือ enhancement', 'หลังปรับปรุง performance'], 'When to use: after bug fixes, after new features or enhancement, after performance improvements, during routine maintenance', 'L13 หน้า 23–24')
  ];

  var unit2 = [
    Q('JUnit คืออะไรตามสไลด์?', ['unit testing framework ที่เป็นเครื่องมือมาตรฐานของ TDD ใน Java', 'ภาษาโปรแกรมใหม่', 'เครื่องมือวาด DFD', 'ระบบควบคุมเวอร์ชัน'], 'JUnit is part of unit testing frameworks and has become the standard tool for Test-Driven Development in Java', 'L13 หน้า 7, 9'),
    Q('JUnit ถูกนำเข้าโปรเจกต์ในรูปแบบใด?', ['ลิงก์เป็น JAR ตอน compile-time', 'ติดตั้งเป็นโปรแกรมแยกบนเซิร์ฟเวอร์', 'เขียนเป็น HTML', 'เป็น plugin ของเบราว์เซอร์'], 'JUnit is linked as a JAR at compile-time', 'L13 หน้า 9'),
    Q('JUnit มีสิ่งใดให้ใช้บ้าง?', ['Annotation ระบุ test method, assertion ตรวจผล และ test runner รันเทส', 'ตัวแปลภาษา Java ใหม่', 'ฐานข้อมูลเก็บผลเทส', 'เครื่องมือวาด UML'], 'JUnit provides annotations, utility methods to assert expected results, and test runners', 'L13 หน้า 9'),
    Q('JUnit ทำงานร่วมกับเครื่องมือใดได้ตามสไลด์?', ['Eclipse, Ant, Maven', 'Photoshop, Figma', 'MySQL, MongoDB', 'Word, Excel'], 'JUnit Framework can be easily integrated with Eclipse, Ant, Maven', 'L13 หน้า 9'),
    Q('ลำดับใน JUnit Checklist คือข้อใด?', ['Initialize → Write test cases → Write a test suite → Execute test suite', 'Write a test suite → Initialize → Execute → Write test cases', 'Execute → Initialize → Write test cases → Write a test suite', 'Write test cases → Execute → Initialize → Write a test suite'], 'ภาพ JUnit Checklist: Initialize, Write test cases, Write a test suite, Execute test suite', 'L13 หน้า 10'),
    Q('Annotation @Test ใช้บอกอะไร?', ['บอก JUnit ว่า method นี้รันเป็น test ได้', 'บอกว่า method นี้ต้องรันก่อนทุกเทส', 'บอกว่าคลาสนี้เป็น main', 'บอกว่า method นี้ห้ามรัน'], '@Test informs JUnit that this method can be run as a test', 'L13 หน้า 11'),
    Q('ใน test class lifecycle method ใดรันครั้งเดียวก่อนเทสทั้งหมดในคลาส?', ['@BeforeClass', '@Before', '@After', '@AfterClass'], 'ภาพ Test Class Lifecycle: @BeforeClass → (for each @Test: @Before, @Test, @After) → @AfterClass', 'L13 หน้า 11'),
    Q('method ใดรันก่อน @Test แต่ละตัวทุกครั้ง?', ['@Before', '@BeforeClass', '@AfterClass', '@Test'], 'ใน lifecycle, @Before รันก่อนแต่ละ test case', 'L13 หน้า 11'),
    Q('method ใดรันหลัง @Test แต่ละตัวทุกครั้ง?', ['@After', '@AfterClass', '@Before', '@BeforeClass'], 'ใน lifecycle, @After รันหลังแต่ละ test case', 'L13 หน้า 11'),
    Q('assertEquals(expected, actual) ตรวจอะไร?', ['ค่า primitive หรือ object สองค่าเท่ากัน', 'object ไม่เป็น null', 'เงื่อนไขเป็นจริง', 'สอง reference ชี้ object เดียวกัน'], 'void assertEquals(boolean expected, boolean actual): checks that two primitives/objects are equal', 'L13 หน้า 12'),
    Q('กำหนด int val1 = 5; int val2 = 6; คำสั่ง assertTrue(val1 < val2) ให้ผลอย่างไร?', ['ผ่าน เพราะ 5 < 6 เป็นจริง', 'ไม่ผ่าน เพราะ 5 < 6 เป็นเท็จ', 'error เพราะ assertTrue ใช้กับ int ไม่ได้', 'ผ่านเฉพาะเมื่อรันซ้ำ'], 'assertTrue ตรวจว่าเงื่อนไขเป็นจริง ตัวอย่างในสไลด์ใช้ assertTrue(val1 < val2)', 'L13 หน้า 12–13'),
    Q('กำหนด String str3 = null; คำสั่ง assertNull(str3) ให้ผลอย่างไร?', ['ผ่าน เพราะ str3 เป็น null', 'ไม่ผ่าน เพราะ str3 เป็น null', 'error ตอน compile', 'ผ่านเฉพาะเมื่อ str3 = "abc"'], 'assertNull checks that an object is null', 'L13 หน้า 12–13'),
    Q('assertSame(object1, object2) ตรวจอะไร?', ['สอง reference ชี้ไปที่ object ตัวเดียวกัน', 'ค่าของสอง object เท่ากัน', 'object ไม่เป็น null', 'อาร์เรย์สองชุดเท่ากัน'], 'The assertSame() method tests if two object references point to the same object', 'L13 หน้า 12'),
    Q('assertArrayEquals(expectedArray, resultArray) ตรวจอะไร?', ['อาร์เรย์สองชุดเท่ากัน', 'อาร์เรย์ไม่ว่าง', 'สองอาร์เรย์เป็น object เดียวกัน', 'อาร์เรย์เรียงลำดับแล้ว'], 'assertArrayEquals() will test whether two arrays are equal to each other', 'L13 หน้า 12'),
    Q('Student("Morakot","Choetkiertikul",...) ที่ getDisplayName() คืน firstName + " " + lastName ถ้าเขียน assertEquals("MorakotChoetkiertikul", displayName) ผลคือ?', ['ไม่ผ่าน เพราะค่าจริงมีช่องว่างคั่น', 'ผ่าน', 'error ตอน compile', 'ผ่านเพราะไม่สนช่องว่าง'], 'ค่าจริงคือ "Morakot Choetkiertikul" (มีช่องว่าง) ไม่ตรงกับ expected', 'L13 หน้า 14'),
    Q('จากตัวอย่างเดียวกัน assertEquals("Morakot Choetkiertikul", displayName) ผลคือ?', ['ผ่าน', 'ไม่ผ่าน', 'error เพราะชื่อยาวเกิน', 'ไม่ผ่านเพราะลำดับ argument ผิด'], 'getDisplayName คืนชื่อ + ช่องว่าง + นามสกุล ตรงกับ expected', 'L13 หน้า 14'),
    Q('Verification ตาม Ammann & Offutt คืออะไร?', ['ตรวจว่าผลผลิตของแต่ละ phase ตรงกับ requirement ที่กำหนดใน phase ก่อนหน้า (building the software right?)', 'ประเมินซอฟต์แวร์ตอนท้ายว่าตรงกับการใช้งานที่ตั้งใจ (building the right software?)', 'การรันโปรแกรมจริงเท่านั้น', 'การให้ผู้ใช้กดลองเล่น'], 'Verification: determining whether the products of a given phase fulfill the requirements established during the previous phase — Are we building the software right?', 'L12 หน้า 13'),
    Q('Validation ตาม Ammann & Offutt คืออะไร?', ['ประเมินซอฟต์แวร์ตอนท้ายการพัฒนาว่าตรงกับการใช้งานที่ตั้งใจ (building the right software?)', 'ตรวจผลของแต่ละ phase เทียบ phase ก่อนหน้า', 'การ review โค้ดโดยไม่รัน', 'การนับบรรทัดโค้ด'], 'Validation: evaluating software at the end of development to ensure compliance with intended usage — Are we building the right software?', 'L12 หน้า 13'),
    Q('Software failure คืออะไร?', ['พฤติกรรมภายนอกที่ไม่ถูกต้องเมื่อเทียบกับ requirement', 'ข้อบกพร่องที่อยู่นิ่งในโค้ด (static defect)', 'สถานะภายในที่ผิดพลาด', 'การทดสอบที่ไม่ผ่านเพราะเขียนเทสผิด'], 'Software Failure: external, incorrect behavior with respect to the requirements', 'L12 หน้า 15'),
    Q('Software fault คืออะไร?', ['ข้อบกพร่องที่อยู่นิ่งในซอฟต์แวร์ (static defect)', 'พฤติกรรมภายนอกที่ผิด', 'สถานะภายในที่ผิด ซึ่งเป็นผลของ fault', 'ผู้ใช้ใช้งานผิดวิธี'], 'Software Fault: a static defect in the software; Error: incorrect internal state that manifests a fault', 'L12 หน้า 15')
  ];

  var unit3 = [
    Q('Black-box testing เรียกอีกชื่อว่าอะไร และเน้นอะไร?', ['behavioral/functional testing เน้น functional requirement', 'glass-box testing เน้นเส้นทางในโค้ด', 'structural testing เน้นลูป', 'unit testing เน้น method เดียว'], 'Black-box: also called behavioral or functional testing; focuses on the functional requirements', 'L12 หน้า 20'),
    Q('White-box testing เรียกอีกชื่อว่าอะไร?', ['glass-box หรือ structural testing', 'behavioral testing', 'acceptance testing', 'usability testing'], 'White-box: also called glass-box/structural testing; uses control structure to derive test cases', 'L12 หน้า 31'),
    Q('Equivalence Class Partitioning (ECP) ทำอย่างไร?', ['แบ่ง input เป็นกลุ่มที่ถือว่าเทียบเท่ากัน แล้วใช้ตัวแทนหนึ่งค่าต่อกลุ่ม', 'ทดสอบทุกค่าที่เป็นไปได้', 'ทดสอบเฉพาะค่าที่ขอบ', 'นับจำนวน decision node'], 'Divide the input into several classes deemed equivalent; representative for each class is used for testing', 'L12 หน้า 22'),
    Q('ช่อง Age รับค่า 18–56 ตาม ECP มีกี่ class?', ['3 class (≤17 invalid, 18–56 valid, ≥57 invalid)', '1 class', '2 class', '56 class'], 'Valid class 18–56, invalid class 1: ≤17, invalid class 2: ≥57', 'L12 หน้า 23'),
    Q('ช่องรับตัวเลข 1–1000 ค่าใดเป็นตัวแทนของ invalid class ได้ (ECP)?', ['0', '1', '500', '1000'], 'class: ≤0 invalid, 1–1000 valid, ≥1001 invalid ดังนั้น 0 อยู่ใน invalid class', 'L12 หน้า 24'),
    Q('หลักการของ Boundary Value Analysis (BVA) คืออะไร?', ['ทดสอบที่ขอบของแต่ละ class (ค่าขอบ, +1, -1) เพราะขอบเกิดข้อผิดพลาดบ่อย', 'ทดสอบค่ากลางของ class เท่านั้น', 'ทดสอบทุกเส้นทางในโค้ด', 'สุ่มค่าทดสอบ'], 'Boundaries are error-prone; do ECP then add test cases for boundaries (boundary, +1, -1)', 'L12 หน้า 27'),
    Q('BVA ใช้ได้กับค่าแบบใดตามสไลด์?', ['ค่าที่เรียงลำดับได้ (ordinal) จัดเป็นช่วงได้', 'ค่าทุกชนิดรวมถึงชื่อสี', 'เฉพาะข้อความ', 'เฉพาะค่า boolean'], 'Only for ordinal values, i.e., can be organized and sorted in intervals', 'L12 หน้า 27'),
    Q('ช่องรับ 1–1000 ด้วย BVA แบบ reduced ได้ test case ใดบ้าง?', ['0, 1, 1000, 1001', '1, 500, 1000', '0, 500, 1001', '-1, 0, 1'], 'Exercise 4: Case 1 = 0 invalid, 1 valid, 1000 valid, 1001 invalid', 'L12 หน้า 29'),
    Q('ตั๋วอุทยาน: class อายุ 18–60 (200 บาท) ด้วย BVA แบบ reduced ใช้ค่าใด?', ['18 และ 60', '17 และ 61', '19 และ 59', '18 และ 61'], 'เฉลย Exercise 5: class 18–60 reduced = 18, 60 expected 200', 'L12 หน้า 30; L13 หน้า 34'),
    Q('ตั๋วอุทยาน: อายุ 61 ปี ค่าที่คาดหวังคือเท่าใด?', ['100 บาท', 'ฟรี', '200 บาท', 'Error: Invalid Age'], 'อายุมากกว่า 60 จ่าย 100 บาท (เฉลย class >60 ใช้ 61 ได้ 100)', 'L12 หน้า 30'),
    Q('ตั๋วอุทยาน: อายุ 12 ปี ค่าที่คาดหวังคือเท่าใด?', ['100 บาท', 'ฟรี', '200 บาท', 'Error'], 'อายุต่ำกว่า 12 ฟรี ดังนั้น 12 อยู่ใน class 12–17 จ่าย 100 บาท', 'L12 หน้า 30'),
    Q('ส่วนลดสมาชิก (ECP, Exercise 6): ยอดซื้อ 2,599 บาท ได้ผลใด?', ['ลด 10%', 'ไม่ได้ลด', 'ลด 5%', 'ลด 20%'], 'เฉลย Exercise 6: class 1,000–4,999 ตัวแทน 2,599 → 10% discount', 'L13 หน้า 36'),
    Q('ส่วนลดสมาชิก (BVA, Exercise 7): class 1–500 แบบ reduced ใช้ค่าใด?', ['1 และ 500', '0 และ 501', '2 และ 499', '1 และ 501'], 'เฉลย Exercise 7: class 1–500 reduced = 1, 500 no discount', 'L13 หน้า 38'),
    Q('ส่วนลดสมาชิก (Exercise 7): ยอดซื้อ 100,001 บาท ได้ผลใด?', ['Error: Invalid input', 'ลด 20%', 'ลด 10%', 'ไม่ได้ลด'], 'ยอดมากกว่า 100,000 เป็น invalid input', 'L13 หน้า 38'),
    Q('จำนวน independent path (cyclomatic number) คำนวณอย่างไร?', ['จำนวน decision node + 1', 'จำนวน statement + 1', 'จำนวน decision node × 2', '2 ยกกำลังจำนวน decision node'], '1) Calculate the number of independent path => #Decision node + 1', 'L12 หน้า 36'),
    Q('โปรแกรมมี binary decision 3 ตัวต่อกัน มี logical path ทั้งหมดกี่เส้น และ independent path กี่เส้น?', ['8 และ 4', '4 และ 8', '6 และ 3', '3 และ 4'], 'Each binary decision has 2 paths, 3 in sequence = 2^3 = 8 logical paths; cyclomatic number = 3 + 1 = 4', 'L12 หน้า 37'),
    Q('ชุด path จะเป็น linearly independent เมื่อใด?', ['แต่ละ path เพิ่ม edge ใหม่อย่างน้อยหนึ่งเส้นที่ path ก่อนหน้าไม่มี', 'ทุก path มีความยาวเท่ากัน', 'ทุก path ผ่านทุก node', 'path ไม่ซ้ำ node กันเลย'], 'A set of paths is linearly independent if each path introduces at least one new edge not included in the previous paths', 'L12 หน้า 36'),
    Q('ตัวอย่าง simple loop ในสไลด์ (decision C1 หนึ่งตัว) มี linearly independent path กี่เส้น?', ['2', '1', '3', '4'], 'decision 1 + 1 = 2: S1-C1-S3 และ S1-C1-S2-C1-S3', 'L12 หน้า 35'),
    Q('Exercise 8 (Zoo get_ticket_price) ตามที่เฉลยในคาบ (โน้ตลายมือ) cyclomatic complexity เท่ากับเท่าใด?', ['4 (decision node 3 + 1)', '5 (decision node 4 + 1)', '3', '8'], 'โน้ตลายมือ: CC = decision node + 1 = 3 + 1 = 4 โดยขีดฆ่า 4+1 และเขียนว่าเหลือ 3 condition (C4 ไม่ควรมี)', 'L13 หน้า 39–40 (โน้ตลายมือ)'),
    Q('ตามสไลด์ ควรหยุด testing เมื่อใด (คำตอบแบบง่าย)?', ['เมื่อรัน test case ที่วางแผนไว้ครบ และแก้ทุกปัญหาที่พบแล้ว', 'เมื่อหมดเวลาทำงานของวัน', 'เมื่อพบบั๊กตัวแรก', 'เมื่อเขียนโค้ดเสร็จ'], 'Simple answer, stop when all planned test cases are executed and all problems found are fixed', 'L12 หน้า 39')
  ];

  root.QUIZ = { topics: [
    { id: 'dfd', name: 'DFD Understanding (นิยามและกฎ)', sets: [
      { title: 'นิยามและสัญลักษณ์', qs: dfd1 },
      { title: 'กฎ ระดับ เลข และ balancing', qs: dfd2 },
      { title: 'ประยุกต์ ผสมหลายเรื่อง และ PSPEC/Control flow', qs: dfd3 } ] },
    { id: 'err', name: 'Error detection in DFD', sets: [
      { title: 'จับผิดทีละกฎ', qs: err1 },
      { title: 'โจทย์จากสไลด์และหลายจุดผิด', qs: err2 },
      { title: 'DFD ใหญ่ ซ่อนผิดหลายจุด + hierarchy', qs: err3 } ] },
    { id: 'git', name: 'Git functions', sets: [
      { title: 'CM, VCS, staging area และสถานะไฟล์', qs: git1 },
      { title: 'คำสั่ง Git (add, commit, pull, push และ cheat sheet)', qs: git2 },
      { title: 'Branching model และสถานการณ์จริง', qs: git3 } ] },
    { id: 'unit', name: 'Unit test', sets: [
      { title: 'ระดับการทดสอบ และ unit test ที่ดี', qs: unit1 },
      { title: 'JUnit, assertion, V&V, fault/failure', qs: unit2 },
      { title: 'ECP, BVA และ path analysis (คำนวณ)', qs: unit3 } ] }
  ] };
})(typeof window !== 'undefined' ? window : globalThis);
