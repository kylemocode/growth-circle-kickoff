import { useState, useEffect } from 'react'
import { subscribeAllPhotos } from '../data/photos'

export default function Admin({ me, back }) {
  const [photos, setPhotos] = useState([])
  const [active, setActive] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const unsub = subscribeAllPhotos((list) => {
      setPhotos(list)
      setLoading(false)
    })
    return () => unsub && unsub()
  }, [])

  const shown = photos

  return (
    <div className="screen screen-wide fade-in-up">
      <header className="topbar">
        <button onClick={back} className="btn-ghost back-btn">← 回首頁</button>
        <div className="topbar-logo" style={{ fontSize: 13 }}>
          <img src="/kettlebell.svg" alt="" style={{ width: 22, height: 22 }} />
          <span>神秘頁面</span>
        </div>
      </header>

      <div className="fade-in-up-1">
        <div className="h-eyebrow">PHOTO WALL</div>
        <h1 className="h-title">合照牆</h1>
        <p className="h-sub">所有 Builder 在今晚 BINGO 過程中拍下的合照</p>
      </div>

      <div className="admin-toolbar fade-in-up-2">
        <div className="admin-stats">
          <span className="admin-stat">
            <b>{shown.length}</b> 張照片
          </span>
          <span className="admin-stat">
            <b>{new Set(photos.map(p => p.ownerCardNum)).size}</b> 位參與者
          </span>
        </div>
      </div>

      {loading ? (
        <div className="admin-empty">
          <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
          <div className="admin-empty-title">載入中...</div>
        </div>
      ) : shown.length === 0 ? (
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


        /* Wide layout：合照牆要投影，桌機版突破預設 720px 寬 */
        .screen-wide {
          max-width: 1600px !important;
        }
        @media (min-width: 1100px) {
          .screen-wide .admin-grid {
            grid-template-columns: repeat(6, 1fr) !important;
            gap: 10px;
          }
        }
        @media (min-width: 1400px) {
          .screen-wide .admin-grid {
            grid-template-columns: repeat(8, 1fr) !important;
          }
        }

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
