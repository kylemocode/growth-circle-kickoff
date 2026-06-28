// 合照儲存（純前端：DataURL 存進 localStorage）
// 未來接 Firebase 時，把這層改成 cloud API 即可
//
// 結構：
//   photos[me.id] = [{ id, ts, withCardNum, withName, taskIdx, dataUrl }, ...]
//
// 同時維護「全場合照彙整」key（給 Admin 用）：
//   gck_photos_all = [{ id, ownerCardNum, ownerName, withCardNum, withName, taskIdx, ts, dataUrl }, ...]

const KEY_MINE = (id) => `gck_photos_${id}`
const KEY_ALL = 'gck_photos_all'

export function listMyPhotos(myId) {
  const s = localStorage.getItem(KEY_MINE(myId))
  return s ? JSON.parse(s) : []
}

export function listAllPhotos() {
  const s = localStorage.getItem(KEY_ALL)
  return s ? JSON.parse(s) : []
}

export function savePhoto({ me, with: other, taskIdx, dataUrl }) {
  const photo = {
    id: `${me.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ts: Date.now(),
    withCardNum: other?.cardNum ?? null,
    withName: other?.name ?? '',
    taskIdx,
    dataUrl,
  }

  // 個人
  const mine = listMyPhotos(me.id)
  mine.push(photo)
  localStorage.setItem(KEY_MINE(me.id), JSON.stringify(mine))

  // 全場（含 owner 資訊）
  const all = listAllPhotos()
  all.push({
    ...photo,
    ownerCardNum: me.cardNum,
    ownerName: me.name,
  })
  localStorage.setItem(KEY_ALL, JSON.stringify(all))

  return photo
}

export function clearAllPhotos() {
  localStorage.removeItem(KEY_ALL)
  // 同時清個人（用 prefix 掃）
  Object.keys(localStorage).forEach((k) => {
    if (k.startsWith('gck_photos_') && k !== KEY_ALL) {
      localStorage.removeItem(k)
    }
  })
}
