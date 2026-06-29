import { useState, useEffect } from 'react'
import { listAllPhotos, clearAllPhotos } from '../data/photos'

export default function Admin({ me, back }) {
  const [photos, setPhotos] = useState([])
  const [active, setActive] = useState(null)
  const [filter, setFilter] = useState('all')  // all | mine

  useEffect(() => {
    refresh()
  }, [])

  function refresh() {
    setPhotos(listAllPhotos().sort((a, b) => b.ts - a.ts))
  }

  function handleClear() {
    if (!confirm('確定清除「所有」合照？此操作無法復原')) return
    clearAllPhotos()
    refresh()
  }

  const shown = filter === 'mine'
    ? photos.filter(p => p.ownerCardNum === me.cardNum)
    : photos

  return (
    <div className="screen fade-in-up">
      <header className="topbar">
        <button onClick={back} className="btn-ghost back-btn">← 回首頁</button>
        <div className="topbar-logo" style={{ fontSize: 13 }}>
          <img src="/kettlebell.svg" alt="" style={{ width: 22, height: 22 }} />
          <span>ADMIN</span>
        </div>
      </header>

      <div className="fade-in-up-1">
        <div className="h-eyebrow">PHOTO WALL</div>
        <h1 className="h-title">合照牆</h1>
        <p className="h-sub">
          所有 Builder 在今晚 BINGO 過程中拍下的合照<br />
          <span className="text-muted" style={{ fontSize: 12 }}>
            ⚠️ 目前為本機 demo：只顯示這台手機上的紀錄。串雲端後將顯示全場資料
          </span>
        </p>
      </div>

      <div className="admin-toolbar fade-in-up-2">
        <div className="admin-stats">
          <span className="admin-stat">
            <b>{shown.length}</b> 張照片
          </span>
          {filter === 'all' && (
            <span className="admin-stat">
              <b>{new Set(photos.map(p => p.ownerCardNum)).size}</b> 位參與者
            </span>
          )}
        </div>
        <div className="admin-filter">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >全場</button>
          <button
            className={filter === 'mine' ? 'active' : ''}
            onClick={() => setFilter('mine')}
          >我的</button>
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="admin-empty">
          <img src="/icon-self.svg" alt="" className="admin-empty-icon" />
          <div className="admin-empty-title">還沒有人拍合照</div>
          <div className="admin-empty-desc">
            完成 BINGO 第一格時會自動觸發拍照
          </div>
        </div>
      ) : (
        <div className="admin-grid">
          {shown.map((p) => (
            <button key={p.id} className="admin-cell" onClick={() => setActive(p)}>
              <img src={p.dataUrl} alt="" />
              <div className="admin-cell-overlay">
                <div className="admin-cell-name">
                  #{String(p.ownerCardNum).padStart(2, '0')} {p.ownerName}
                </div>
                {p.withName && (
                  <div className="admin-cell-with">+ {p.withName}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {photos.length > 0 && (
        <button onClick={handleClear} className="admin-clear">
          清除所有合照（DEV）
        </button>
      )}

      {/* Lightbox */}
      {active && (
        <div className="lightbox" onClick={() => setActive(null)}>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setActive(null)}>✕</button>
            <img src={active.dataUrl} alt="" className="lightbox-img" />
            <div className="lightbox-meta">
              <div className="lightbox-name">
                #{String(active.ownerCardNum).padStart(2, '0')} {active.ownerName}
              </div>
              {active.withName && (
                <div className="lightbox-with">+ {active.withName}</div>
              )}
              <div className="lightbox-ts">
                {new Date(active.ts).toLocaleString('zh-TW')}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .back-btn { font-size: 14px; font-weight: 700; color: var(--ink-700); }

        .admin-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
          padding: 12px 16px;
          background: var(--paper);
          border: 2px solid var(--ink-900);
          border-radius: var(--r-md);
          box-shadow: 3px 3px 0 0 var(--ink-900);
        }
        .admin-stats { display: flex; gap: 14px; }
        .admin-stat { font-size: 13px; color: var(--muted); }
        .admin-stat b { color: var(--ink-900); font-weight: 900; font-size: 18px; margin-right: 2px; }
        .admin-filter {
          display: flex;
          background: var(--ink-100);
          padding: 3px;
          border-radius: 999px;
        }
        .admin-filter button {
          padding: 5px 12px;
          font-size: 12px;
          font-weight: 800;
          color: var(--muted);
          border-radius: 999px;
        }
        .admin-filter button.active {
          background: var(--ink-900);
          color: white;
        }

        .admin-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
        }
        @media (min-width: 480px) {
          .admin-grid { grid-template-columns: repeat(4, 1fr); }
        }
        .admin-cell {
          position: relative;
          aspect-ratio: 1;
          background: var(--ink-100);
          border: 2px solid var(--ink-900);
          border-radius: var(--r-sm);
          overflow: hidden;
          padding: 0;
          transition: transform 0.15s;
        }
        .admin-cell:hover { transform: scale(1.02); }
        .admin-cell img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .admin-cell-overlay {
          position: absolute;
          inset: auto 0 0 0;
          background: linear-gradient(to top, rgba(0,0,0,0.85), transparent);
          color: white;
          padding: 16px 8px 6px;
          text-align: left;
        }
        .admin-cell-name {
          font-size: 11px;
          font-weight: 800;
          line-height: 1.2;
        }
        .admin-cell-with {
          font-size: 10px;
          opacity: 0.85;
          margin-top: 2px;
        }

        .admin-empty {
          padding: 60px 20px;
          background: var(--paper);
          border: 2px dashed var(--ink-200);
          border-radius: var(--r-md);
          text-align: center;
        }
        .admin-empty-icon { width: 64px; opacity: 0.5; margin-bottom: 12px; }
        .admin-empty-title { font-size: 16px; font-weight: 800; }
        .admin-empty-desc { font-size: 13px; color: var(--muted); margin-top: 4px; }

        .admin-clear {
          margin-top: 24px;
          padding: 10px;
          color: var(--red);
          font-size: 12px;
          font-weight: 700;
          opacity: 0.7;
        }
        .admin-clear:hover { opacity: 1; }

        .lightbox {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.92);
          z-index: 300;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: fadeIn 0.2s;
        }
        .lightbox-inner {
          width: 100%;
          max-width: 500px;
          animation: fadeInUp 0.3s;
        }
        .lightbox-close {
          position: absolute;
          top: calc(var(--safe-top) + 12px);
          right: 12px;
          width: 40px; height: 40px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          color: white;
          font-size: 18px;
          display: flex; align-items: center; justify-content: center;
        }
        .lightbox-img {
          width: 100%;
          border-radius: var(--r-md);
          display: block;
        }
        .lightbox-meta {
          color: white;
          padding: 14px 4px;
        }
        .lightbox-name { font-size: 18px; font-weight: 900; }
        .lightbox-with { font-size: 14px; opacity: 0.85; margin-top: 2px; }
        .lightbox-ts {
          font-family: var(--font-mono);
          font-size: 11px;
          opacity: 0.5;
          margin-top: 8px;
        }
      `}</style>
    </div>
  )
}
