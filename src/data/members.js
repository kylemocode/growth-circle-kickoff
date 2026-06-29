// 7/5 創始會員實體迎新聚會名單
//
// PIN 設計（簡化版）：
//   會員 0001-0041（4 位數補零的純流水號）
//   工作人員 9001-9005
//   備用 0101-0103（避開 0001-0041 區段）

// 41 人 × 5 桌 × 3 輪 的均勻分桌（local search 產生）
// 每桌每輪 8 或 9 人；每人三輪都換桌
const CARD_LAYOUT_41 = [
  [2, 3, 5],  // 卡 01
  [5, 3, 4],  // 卡 02
  [5, 1, 2],  // 卡 03
  [3, 1, 2],  // 卡 04
  [1, 2, 3],  // 卡 05
  [4, 3, 2],  // 卡 06
  [3, 2, 1],  // 卡 07
  [3, 2, 4],  // 卡 08
  [1, 5, 2],  // 卡 09
  [2, 1, 4],  // 卡 10
  [2, 1, 3],  // 卡 11
  [1, 2, 5],  // 卡 12
  [5, 4, 1],  // 卡 13
  [1, 2, 4],  // 卡 14
  [5, 2, 1],  // 卡 15
  [5, 2, 3],  // 卡 16
  [1, 4, 2],  // 卡 17
  [1, 3, 5],  // 卡 18
  [3, 1, 5],  // 卡 19
  [1, 4, 3],  // 卡 20
  [2, 4, 5],  // 卡 21
  [4, 1, 3],  // 卡 22
  [2, 5, 4],  // 卡 23
  [4, 5, 1],  // 卡 24
  [5, 1, 4],  // 卡 25
  [3, 5, 4],  // 卡 26
  [4, 3, 1],  // 卡 27
  [4, 2, 5],  // 卡 28
  [3, 4, 5],  // 卡 29
  [5, 4, 3],  // 卡 30
  [4, 2, 3],  // 卡 31
  [3, 5, 1],  // 卡 32
  [2, 4, 1],  // 卡 33
  [4, 5, 2],  // 卡 34
  [2, 3, 1],  // 卡 35
  [1, 5, 3],  // 卡 36
  [4, 1, 5],  // 卡 37
  [5, 3, 2],  // 卡 38
  [1, 3, 4],  // 卡 39
  [2, 5, 3],  // 卡 40
  [3, 4, 2],  // 卡 41
]

// === 報名者名單（依 Discord 留言順序）===
// 來源：Discord 訊息 1519271702213951601 下方留言（2026-06-29 撈取）
const SIGNUPS = [
  { display: 'Lina Wang', email: 'nanalilynina@gmail.com' },
  { display: 'Roger',     email: 'johnsui89@gmail.com' },
  { display: 'Rossi',     email: 'a171421876@gmail.com' },
  { display: 'Han',       email: 'lexiex94@gmail.com' },
  { display: 'Aping',     email: 'hanna222085@gmail.com' },
  { display: 'Marx',      email: 'maxmax199685@gmail.com' },
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

// === 工作人員（PIN 9xxx）===
const STAFF = [
  { display: 'Kyle',  email: 'kyle@aapd.com.tw',   role: '社群經理' },
  { display: 'Simon', email: 'simon@aapd.com.tw',  role: '館長' },
  { display: 'Elisa', email: 'elisa@aapd.com.tw',  role: '營運總監' },
  { display: 'Aimi',  email: 'aimi@aapd.com.tw',   role: '教練經理' },
  { display: 'Mia',   email: 'mia@aapd.com.tw',    role: '行銷' },
]

// === 備用 PIN（0101-0103，現場分配）===
const SPARE_COUNT = 3

// === 組裝最終會員清單 ===
function pad4(n) {
  return String(n).padStart(4, '0')
}

// 1. 報名者 — 41 位全部有桌號（用 41 人 layout）
const SIGNUP_MEMBERS = SIGNUPS.map((s, i) => {
  const cardNum = i + 1
  const [r1, r2, r3] = CARD_LAYOUT_41[i]
  return {
    id: cardNum,
    cardNum,
    pin: pad4(cardNum),         // 0001, 0002, ..., 0041
    name: s.display,
    email: s.email,
    r1, r2, r3,
    kind: 'member',
  }
})

// 2. 工作人員（PIN 9001-9005）
const STAFF_MEMBERS = STAFF.map((s, i) => ({
  id: 900 + i + 1,
  cardNum: 900 + i + 1,
  pin: `9${pad4(i + 1).slice(1)}`,  // 9001, 9002, ..., 9005
  name: s.display,
  email: s.email,
  role: s.role,
  r1: 0, r2: 0, r3: 0,
  kind: 'staff',
}))

// 3. 備用（PIN 0101-0103，避開報名者 0001-0041 區段）
const SPARE_MEMBERS = Array.from({ length: SPARE_COUNT }, (_, i) => ({
  id: 100 + i + 1,
  cardNum: 100 + i + 1,
  pin: pad4(100 + i + 1),       // 0101, 0102, 0103
  name: `備用 ${i + 1}`,
  email: '',
  r1: 0, r2: 0, r3: 0,
  kind: 'spare',
}))

export const MEMBERS = [...SIGNUP_MEMBERS, ...STAFF_MEMBERS, ...SPARE_MEMBERS]

export function findMemberByPin(pin) {
  return MEMBERS.find((m) => m.pin === pin)
}
