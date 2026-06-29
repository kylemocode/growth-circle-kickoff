// 合照儲存
// - 雲端：Firestore (photos collection) + Cloud Storage（圖檔）
// - Fallback：純 localStorage（沒 Firebase 設定或斷網時可用，但無法跨裝置）

import {
  collection,
  doc,
  setDoc,
  getDocs,
  orderBy,
  query,
  where,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore'
import { ref, uploadString, getDownloadURL } from 'firebase/storage'
import { db, storage, fbReady } from '../firebase'

const COL = 'photos'

const LK_ALL = 'gck_photos_all'
const LK_MINE = (id) => `gck_photos_${id}`

// ── Local helpers（fallback / 失敗時暫存）───────────────────
function lsList(key) {
  const s = localStorage.getItem(key)
  return s ? JSON.parse(s) : []
}
function lsPush(key, item) {
  const arr = lsList(key)
  arr.push(item)
  localStorage.setItem(key, JSON.stringify(arr))
}

// ── Public API ────────────────────────────────────────────

/**
 * 上傳合照到雲端 + 本機緩存。
 * 上傳失敗也會存在 localStorage，至少自己看得到。
 */
export async function savePhoto({ me, with: other, taskIdx, dataUrl }) {
  const id = `${me.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  const ts = Date.now()
  const meta = {
    id,
    ts,
    ownerCardNum: me.cardNum,
    ownerName: me.name,
    withCardNum: other?.cardNum ?? null,
    withName: other?.name ?? '',
    taskIdx,
  }

  // 1) 本機先存（保證使用者立刻看得到）
  lsPush(LK_MINE(me.id), { ...meta, dataUrl })
  lsPush(LK_ALL, { ...meta, dataUrl })

  // 2) 嘗試上雲（失敗會跳 alert 給你看真實錯誤訊息）
  if (!fbReady) {
    console.error('[savePhoto] Firebase not configured')
    return meta
  }
  try {
    // 上傳圖檔
    const path = `photos/${id}.jpg`
    const storageRef = ref(storage, path)
    console.log('[savePhoto] uploading to', path)
    await uploadString(storageRef, dataUrl, 'data_url', { contentType: 'image/jpeg' })
    const url = await getDownloadURL(storageRef)
    console.log('[savePhoto] storage uploaded, url =', url.slice(0, 80) + '...')

    // 寫 Firestore（只存 URL，不存 dataUrl）
    await setDoc(doc(db, COL, id), {
      ...meta,
      url,
      createdAt: Timestamp.fromMillis(ts),
    })
    console.log('[savePhoto] firestore doc written:', id)
  } catch (e) {
    console.error('[savePhoto] cloud upload failed:', e)
    // 暫時顯示 alert 方便 debug；找到問題後可拿掉
    alert(`雲端上傳失敗：${e.code || ''}\n${e.message || e}`)
  }

  return meta
}

/**
 * 取回「我的合照」— 同步函式（讀 localStorage，立即回傳）
 */
export function listMyPhotos(myId) {
  return lsList(LK_MINE(myId))
}

/**
 * 即時訂閱「我的合照」— 個人頁用
 * 回傳 unsubscribe()
 */
export function subscribeMyPhotos(myCardNum, onChange) {
  if (!fbReady) {
    onChange(lsList(LK_MINE(myCardNum)))
    return () => {}
  }
  const q = query(
    collection(db, COL),
    where('ownerCardNum', '==', myCardNum),
    orderBy('ts', 'desc')
  )
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => {
        const data = d.data()
        return { ...data, dataUrl: data.url || data.dataUrl }
      })
      onChange(list)
    },
    (e) => {
      console.warn('[subscribeMyPhotos] error', e)
      onChange(lsList(LK_MINE(myCardNum)))
    }
  )
}

/**
 * 取回「全場合照」一次性（讀 Firestore，fallback localStorage）
 */
export async function listAllPhotos() {
  if (!fbReady) return lsList(LK_ALL)
  try {
    const q = query(collection(db, COL), orderBy('ts', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => {
      const data = d.data()
      // 統一輸出格式：用 url 當作 dataUrl 來源（Admin 頁讀 dataUrl）
      return { ...data, dataUrl: data.url || data.dataUrl }
    })
  } catch (e) {
    console.warn('[listAllPhotos] cloud read failed, fallback to localStorage', e)
    return lsList(LK_ALL)
  }
}

/**
 * 即時訂閱「全場合照」— Admin 頁專用
 * 回傳 unsubscribe()
 */
export function subscribeAllPhotos(onChange) {
  if (!fbReady) {
    // 沒雲端：直接回 localStorage 一次
    onChange(lsList(LK_ALL))
    return () => {}
  }
  const q = query(collection(db, COL), orderBy('ts', 'desc'))
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => {
        const data = d.data()
        return { ...data, dataUrl: data.url || data.dataUrl }
      })
      onChange(list)
    },
    (e) => {
      console.warn('[subscribeAllPhotos] error', e)
      onChange(lsList(LK_ALL))
    }
  )
}

/**
 * 清除「本機」合照（雲端清不掉，要去 Firebase Console）
 */
export function clearAllPhotos() {
  localStorage.removeItem(LK_ALL)
  Object.keys(localStorage).forEach((k) => {
    if (k.startsWith('gck_photos_') && k !== LK_ALL) {
      localStorage.removeItem(k)
    }
  })
}
