import { useState, useEffect } from 'react'
import { subscribeMyPhotos } from '../data/photos'

export default function MyPhotos({ me, back }) {
  const [photos, setPhotos] = useState([])
  const [active, setActive] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const unsub = subscribeMyPhotos(me.cardNum, (list) => {
      setPhotos(list)
      setLoading(false)
    })
    return () => unsub && unsub()
  }, [me.cardNum])

  function downloadOne(p) {
    const link = document.createElement('a')
    link.href = p.dataUrl
    link.download = `gck-${String(me.cardNum).padStart(2, '0')}-${p.ts}.jpg`
    link.click()
  }

  return (
    <div className="screen fade-in-up">
      <header className="topbar">
        <button onClick={back} className="btn-ghost back-btn">← 回首頁</button>
        <div className="topbar-logo" style={{ fontSize: 13 }}>
          <img src="/kettlebell.svg" alt="" style={{ width: 22, height: 22 }} />
          <span>MY PHOTOS</span>
        </div>
      </header>

      <div className="fade-in-up-1">
        <div className="h-eyebrow">YOUR NIGHT</div>
        <h1 className="h-title">我的合照</h1>
        <p className="h-sub">你今晚 BINGO 過程中拍下的合照</p>
      </div>

      <div className="my-stats">
        <div>
          <div className="text-mono" style={{ fontSize: 11, fontWeight: 800, color: 'var(--orange-300)', letterSpacing: '0.15em' }}>COLLECTED</div>
          <div style={{ fontSize: 32, fontWeight: 900, lineHeight: 1 }}>
            {photos.length}
            <span style={{ fontSize: 16, opacity: 0.6 }}> 張</span>
          </div>
        </div>
        {photos.length >= 9 && <div className="badge-collect">滿格 BINGO ✨</div>}
      </div>

      {loading ? (
        <div className="my-empty">
          <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
          <div className="my-empty-title">載入中...</div>
        </div>
      ) : photos.length === 0 ? (
        <div className="my-empty">
          <img src="/icon-self.svg" alt="" className="my-empty-icon" />
          <div className="my-empty-title">還沒拍合照</div>
          <div className="my-empty-desc">
            BINGO 點空格時會自動觸發拍照
          </div>
        </div>
      ) : (
        <div className="my-grid">
          {photos.map((p, i) => (
            <button key={p.id} className="my-cell" onClick={() => setActive(p)} style={{ animationDelay: `${i * 0.04}s` }}>
              <img src={p.dataUrl} alt="" />
              {p.withName && (
                <div className="my-cell-with">+ {p.withName}</div>
              )}
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
              {active.withName && (
                <div className="lightbox-with">與 {active.withName}</div>
              )}
              <div className="lightbox-ts">
                {new Date(active.ts).toLocaleString('zh-TW')}
              </div>
            </div>
            <button onClick={() => downloadOne(active)} className="btn btn-primary btn-block" style={{ marginTop: 12 }}>
              下載這張
            </button>
          </div>
        </div>
      )}

      <style>{`
        .back-btn { font-size: 14px; font-weight: 700; color: var(--ink-700); }

        .my-stats {
          background: var(--ink-900);
          color: white;
          border-radius: var(--r-md);
          padding: 16px 20px;
          margin-bottom: var(--s-5);
          border: 2.5px solid var(--ink-900);
          box-shadow: 4px 4px 0 0 var(--orange-500);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .badge-collect {
          background: var(--yellow);
          color: var(--ink-900);
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
          border: 2px solid var(--ink-900);
        }

        .my-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        @media (min-width: 480px) {
          .my-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .my-cell {
          position: relative;
          aspect-ratio: 1;
          background: var(--ink-100);
          border: 2px solid var(--ink-900);
          border-radius: var(--r-md);
          overflow: hidden;
          padding: 0;
          box-shadow: 2px 2px 0 0 var(--ink-900);
          animation: fadeInUp 0.4s ease-out both;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .my-cell:hover {
          transform: translate(-1px, -1px);
          box-shadow: 3px 3px 0 0 var(--orange-500);
        }
        .my-cell img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }
        .my-cell-with {
          position: absolute;
          inset: auto 0 0 0;
          background: linear-gradient(to top, rgba(0,0,0,0.85), transparent);
          color: white;
          padding: 18px 8px 6px;
          font-size: 12px;
          font-weight: 800;
          text-align: left;
        }

        .my-empty {
          padding: 60px 20px;
          background: var(--paper);
          border: 2px dashed var(--ink-200);
          border-radius: var(--r-md);
          text-align: center;
        }
        .my-empty-icon { width: 64px; opacity: 0.5; margin-bottom: 12px; }
        .my-empty-title { font-size: 16px; font-weight: 800; }
        .my-empty-desc { font-size: 13px; color: var(--muted); margin-top: 4px; }

        .lightbox {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.92);
          z-index: 300;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          padding-bottom: calc(16px + var(--safe-bottom));
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
          padding: 12px 4px 0;
        }
        .lightbox-with { font-size: 16px; font-weight: 800; }
        .lightbox-ts {
          font-family: var(--font-mono);
          font-size: 11px;
          opacity: 0.5;
          margin-top: 4px;
        }
      `}</style>
    </div>
  )
}
