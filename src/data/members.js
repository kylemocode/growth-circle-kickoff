// 7/5 創始會員實體迎新聚會名單
//
// PIN 設計：
//   會員 1xxx, 2xxx, ... 5xxx（首碼 = R1 桌號、後三碼 = 卡號）
//   工作人員 9xxx（首碼 9 = 不分桌、任意走動）
//   備用 0xxx（首碼 0 = 預備用，當天現場分配）
//
// 桌號路線（會員 #01–#40）依 wiki/實體迎新-7月5日/04-換桌卡片配置.md 的均勻演算法
// 桌號路線（候補 + 工作人員 + 備用）給彈性桌號（不參與輪桌平衡）

const STAFF_FLEX_TABLES = [0, 0, 0]  // 工作人員走動，桌號為 0 = 無固定桌

// 卡號 1-40 對應的 R1/R2/R3 桌號（來自 wiki）
const CARD_LAYOUT_40 = [
  [1, 3, 5], [1, 5, 3], [1, 2, 4], [1, 5, 2], [1, 2, 3], [1, 4, 2], [1, 4, 5], [1, 3, 4],
  [2, 4, 1], [2, 1, 5], [2, 3, 5], [2, 5, 4], [2, 5, 1], [2, 3, 4], [2, 4, 3], [2, 1, 3],
  [3, 4, 5], [3, 5, 4], [3, 5, 2], [3, 1, 2], [3, 2, 5], [3, 2, 1], [3, 4, 1], [3, 1, 4],
  [4, 1, 2], [4, 1, 5], [4, 5, 3], [4, 5, 1], [4, 3, 1], [4, 2, 5], [4, 3, 2], [4, 2, 3],
  [5, 2, 4], [5, 4, 3], [5, 3, 1], [5, 4, 2], [5, 1, 3], [5, 3, 2], [5, 2, 1], [5, 1, 4],
]

// === 報名者名單（依 Discord 留言順序）===
// 來源：Discord 訊息 1519271702213951601 下方留言（2026-06-29 撈取）
const SIGNUPS = [
  // ── 正式名額（先報先卡位）──
  { display: 'Lina Wang', email: 'nanalilynina@gmail.com' },
  { display: 'Roger',     email: 'johnsui89@gmail.com' },
  { display: 'Rossi',     email: 'a171421876@gmail.com' },
  { display: 'Han',       email: 'lexiex94@gmail.com' },
  { display: 'Aping',     email: 'hanna222085@gmail.com' },
  { display: 'Marx',      email: 'maxmax199685@gmail.com' },
  // ── ↓ 此線以下為「最後 5 位」(Kyle 在 Discord 標的) ──
  { display: 'Luju',      email: 'luyiju.u@gmail.com' },
  { display: 'Ling',      email: 'chitsutote7@gmail.com' },
  { display: 'Monica',    email: 'linyawun031@gmail.com' },
  { display: 'Avery',     email: 'angellinbalabababa@gmail.com' },
  { display: 'Key',       email: 'springfield0329@gmail.com' },
  { display: 'Roger Y.',  email: 'rogeryoun123@gmail.com' },
  { display: 'Ada',       email: '3aaasoftpro2025@gmail.com' },
  { display: 'Judy',      email: 'yachu2012@gmail.com' },
  { display: 'Nina',      email: 'smilenina80@gmail.com' },
  { display: 'Michael',   email: '82832332z@gmail.com' },
  { display: '阿榮',       email: 'stu90233@gmail.com' },
  { display: 'Vita',      email: 'vita60127@gmail.com' },
  { display: 'Mini',      email: 'mini88112910@gmail.com' },
  { display: 'Andrew',    email: 'jk831224@gmail.com' },
  { display: 'Ike',       email: 'aiiuii634@gmail.com' },
  { display: 'Lynn',      email: 'sprout8154@gmail.com' },
  { display: 'Shown',     email: 'lksh010586@gmail.com' },
  { display: 'Lois',      email: 'chen.lois.68@gmail.com' },
  { display: 'James',     email: 'jameschen798@gmail.com' },
  { display: '葉葉',       email: 'lin040716@gmail.com' },
  { display: 'Chloe',     email: 'savava2@gmail.com' },
  { display: 'Joann',     email: 'a181722@gmail.com' },
  { display: 'Trudy',     email: 'ttjkvoop@gmail.com' },
  { display: 'Steven',    email: 'stevenchang421@gmail.com' },  // 原 .con 拼錯，幫修正
  { display: 'Leon',      email: 'boypie510@gmail.com' },
  { display: 'Popo',      email: 'pochunlin227@gmail.com' },
  { display: 'Celia',     email: 'a35cindyvip@gmail.com' },
  { display: 'Piske',     email: 'hello@piskelin.com' },
  { display: 'Barron',    email: 'abcs92212@gmail.com' },
  { display: 'Yoshi',     email: 'yoshi.wind.wing@gmail.com' },
  { display: 'Sansa',     email: 'sallie811021@gmail.com' },
  { display: 'Chair',     email: 'chairhongyihua@gmail.com' },
  { display: 'Daniel',    email: 'tsohsi576@gmail.com' },
  { display: 'Sean',      email: 'prosealogy@gmail.com' },
  { display: 'Honda',     email: 'dada7949@gmail.com' },
]
// → 共 41 位（已超過 40 名額；第 41 位 Honda 暫排候補，當天若有人請假可遞補）

// === 工作人員（PIN 9xxx）===
const STAFF = [
  { display: 'Kyle',  email: 'kyle@aapd.com.tw',   role: '社群經理' },
  { display: 'Simon', email: 'simon@aapd.com.tw',  role: '館長' },
  { display: 'Elisa', email: 'elisa@aapd.com.tw',  role: '營運總監' },
  { display: 'Aimi',  email: 'aimi@aapd.com.tw',   role: '教練經理' },
  { display: 'Mia',   email: 'mia@aapd.com.tw',    role: '行銷' },
]

// === 備用（PIN 0xxx，當天活動現場分配，例如多到的人、臨時報名）===
const SPARE_COUNT = 3

// === 組裝最終會員清單 ===
function genPin(prefix, num) {
  return `${prefix}${String(num).padStart(3, '0')}`
}

// 1. 報名者（最多 40 位用 CARD_LAYOUT_40，第 41+ 位用桌號 0）
const SIGNUP_MEMBERS = SIGNUPS.map((s, i) => {
  const cardNum = i + 1
  if (i < 40) {
    const [r1, r2, r3] = CARD_LAYOUT_40[i]
    return {
      id: cardNum,
      cardNum,
      pin: genPin(r1, cardNum),
      name: s.display,
      email: s.email,
      r1, r2, r3,
      kind: 'member',
    }
  } else {
    // 候補：桌號 0 = 現場分配
    return {
      id: cardNum,
      cardNum,
      pin: genPin(0, cardNum),
      name: s.display,
      email: s.email,
      r1: 0, r2: 0, r3: 0,
      kind: 'waitlist',
    }
  }
})

// 2. 工作人員（PIN 9xxx）
const STAFF_MEMBERS = STAFF.map((s, i) => ({
  id: 900 + i + 1,
  cardNum: 900 + i + 1,
  pin: genPin(9, i + 1),  // 9001, 9002, ..., 9005
  name: s.display,
  email: s.email,
  role: s.role,
  r1: 0, r2: 0, r3: 0,    // 工作人員可隨意走動
  kind: 'staff',
}))

// 3. 備用 PIN（0xxx, 100+）
const SPARE_MEMBERS = Array.from({ length: SPARE_COUNT }, (_, i) => ({
  id: 100 + i + 1,
  cardNum: 100 + i + 1,
  pin: genPin(0, 100 + i + 1),  // 0101, 0102, 0103
  name: `備用 ${i + 1}`,
  email: '',
  r1: 0, r2: 0, r3: 0,
  kind: 'spare',
}))

export const MEMBERS = [...SIGNUP_MEMBERS, ...STAFF_MEMBERS, ...SPARE_MEMBERS]

export function findMemberByPin(pin) {
  return MEMBERS.find((m) => m.pin === pin)
}
