import { useState, useEffect } from 'react'
import { BINGO_TASKS, BINGO_LINES } from '../data/bingoTasks'
import { savePhoto } from '../data/photos'
import PhotoCapture from '../components/PhotoCapture'

function shuffleByPin(pin) {
  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8]
  let seed = 0
  for (const c of pin) seed = seed * 31 + c.charCodeAt(0)
  seed = Math.abs(seed) || 1
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    seed = (seed * 16807) % 2147483647
    const j = seed % (i + 1)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function Bingo({ me, back }) {
  const key = `gck_bingo_${me.id}`

  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(key)
    if (saved) return JSON.parse(saved)
    return { order: shuffleByPin(me.pin), cells: Array(9).fill(null) }
  })
  const [activeCell, setActiveCell] = useState(null)
  const [photoOpen, setPhotoOpen] = useState(false)
  const [pendingPhoto, setPendingPhoto] = useState(null)  // { dataUrl, withName }
  const [input, setInput] = useState('')
  const [celebrate, setCelebrate] = useState(false)

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [state, key])

  const lines = BINGO_LINES.filter((line) => line.every((i) => state.cells[i]))
  const bingo = lines.length >= 3
  const lineCellSet = new Set(lines.flat())

  useEffect(() => {
    if (bingo && !localStorage.getItem(`${key}_celebrated`)) {
      setCelebrate(true)
      localStorage.setItem(`${key}_celebrated`, '1')
    }
  }, [bingo, key])

  function openCell(i) {
    if (state.cells[i]) return
    setActiveCell(i)
    setInput('')
    setPendingPhoto(null)
    // 先開拍照
    setPhotoOpen(true)
  }

  function onPhotoCaptured({ dataUrl, withName }) {
    setPhotoOpen(false)
    if (withName) setInput(withName)
    // 微小延遲確保 PhotoCapture 完全卸載再掛 confirm modal
    setTimeout(() => setPendingPhoto({ dataUrl, withName }), 60)
  }

  function onPhotoCancel() {
    setPhotoOpen(false)
    setActiveCell(null)
  }

  function saveCell() {
    if (!input.trim() || !pendingPhoto) return
    // 存合照
    savePhoto({
      me,
      with: pendingPhoto.withName ? { cardNum: null, name: pendingPhoto.withName } : null,
      taskIdx: state.order[activeCell],
      dataUrl: pendingPhoto.dataUrl,
    })
    // 存格子答案
    const next = { ...state, cells: [...state.cells] }
    next.cells[activeCell] = input.trim()
    setState(next)
    setActiveCell(null)
    setPendingPhoto(null)
  }

  function clearCell(i) {
    if (!confirm('要清除這格嗎？')) return
    const next = { ...state, cells: [...state.cells] }
    next.cells[i] = null
    setState(next)
  }

  const filled = state.cells.filter(Boolean).length

  return (
    <div className="screen fade-in-up">
      <header className="topbar">
        <button onClick={back} className="btn-ghost back-btn">← 回首頁</button>
        <div className="topbar-logo" style={{ fontSize: 13 }}>
          <img src="/kettlebell.svg" alt="" style={{ width: 22, height: 22 }} />
          <span>BINGO</span>
        </div>
      </header>

      <div className="fade-in-up-1">
        <div className="h-eyebrow">CONNECT THE DOTS</div>
        <h1 className="h-title screen-title-row">
          <img src="/icon-bingo.svg" alt="" className="screen-title-icon" />
          連連看 BINGO
        </h1>
        <p className="h-sub">
          找一個還沒聊過的 Builder，挑一格交換答案。<br />
          連 <b style={{ color: 'var(--orange-600)' }}>3 條線</b> 就 BINGO，全填滿可換 AAPD 周邊。
        </p>
      </div>

      <div className="status-bar fade-in-up-2">
        <div className="status-item">
          <div className="status-num">{filled}</div>
          <div className="status-label">/9 完成</div>
        </div>
        <div className="status-divider" />
        <div className="status-item">
          <div className="status-num">{lines.length}</div>
          <div className="status-label">/3 條線</div>
        </div>
        {bingo && <div className="status-bingo">BINGO!</div>}
      </div>

      <div className="bingo-grid fade-in-up-3">
        {state.cells.map((cell, i) => {
          const task = BINGO_TASKS[state.order[i]]
          const isFilled = !!cell
          const inLine = lineCellSet.has(i)
          return (
            <button
              key={i}
              className={`bingo-cell ${isFilled ? 'filled' : ''} ${inLine ? 'in-line' : ''}`}
              onClick={() => (isFilled ? clearCell(i) : openCell(i))}
            >
              <div className="bingo-cell-num">{i + 1}</div>
              <div className="bingo-cell-task">{task.text}</div>
              {isFilled && (
                <div className="bingo-cell-check">
                  <span>✓</span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {activeCell !== null && !photoOpen && pendingPhoto && (
        <div className="modal-overlay" onClick={() => { setActiveCell(null); setPendingPhoto(null) }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-eyebrow">第 {activeCell + 1} 格 · 完成 Check-in</div>
            <div className="modal-task">{BINGO_TASKS[state.order[activeCell]].text}</div>

            <div className="cell-photo-preview">
              <img src={pendingPhoto.dataUrl} alt="" />
              <button onClick={() => setPhotoOpen(true)} className="cell-photo-retake">重拍</button>
            </div>

            <textarea
              className="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="對方的答案 + Discord 暱稱"
              rows={3}
              autoFocus
            />
            <div className="modal-actions">
              <button onClick={() => { setActiveCell(null); setPendingPhoto(null) }} className="btn btn-secondary" style={{ flex: 1 }}>
                取消
              </button>
              <button
                onClick={saveCell}
                className="btn btn-primary"
                style={{ flex: 2 }}
                disabled={!input.trim()}
              >
                完成 ✓
              </button>
            </div>
          </div>
        </div>
      )}

      <PhotoCapture
        open={photoOpen}
        taskText={activeCell !== null ? BINGO_TASKS[state.order[activeCell]].text : ''}
        onClose={onPhotoCancel}
        onCapture={onPhotoCaptured}
      />

      {celebrate && (
        <div className="modal-overlay" onClick={() => setCelebrate(false)}>
          <div className="modal pop" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
            <img src="/icon-founding.svg" alt="" className="celebrate-icon" />
            <h2 className="h-title" style={{ color: 'var(--orange-500)', textAlign: 'center', fontSize: 36 }}>
              BINGO!
            </h2>
            <p style={{ color: 'var(--muted)', marginBottom: 24, lineHeight: 1.6 }}>
              你連成了 <b style={{ color: 'var(--ink-900)' }}>{lines.length} 條線</b>！<br />
              繼續完成更多格，可以兌換 AAPD 周邊
            </p>
            <button onClick={() => setCelebrate(false)} className="btn btn-primary btn-block">
              繼續訓練
            </button>
          </div>
        </div>
      )}

      <style>{`
        .back-btn {
          font-size: 14px;
          font-weight: 700;
          color: var(--ink-700);
        }
        .status-bar {
          display: flex;
          align-items: center;
          gap: 0;
          margin-bottom: var(--s-5);
          padding: 16px 20px;
          background: var(--ink-900);
          color: white;
          border-radius: var(--r-md);
          border: 2.5px solid var(--ink-900);
          box-shadow: 4px 4px 0 0 var(--orange-500);
        }
        .status-item {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }
        .status-num {
          font-family: var(--font-mono);
          font-size: 28px;
          font-weight: 900;
          line-height: 1;
        }
        .status-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--orange-300);
        }
        .status-divider {
          width: 1px;
          height: 28px;
          background: rgba(255, 255, 255, 0.2);
          margin: 0 16px;
        }
        .status-bingo {
          margin-left: auto;
          background: var(--orange-500);
          color: white;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 900;
          animation: pulse 1.5s infinite;
        }

        .bingo-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        .bingo-cell {
          position: relative;
          aspect-ratio: 1;
          border: 2.5px solid var(--ink-900);
          border-radius: var(--r-md);
          background: var(--paper);
          padding: 10px 8px;
          display: flex;
          flex-direction: column;
          text-align: left;
          color: var(--ink-700);
          transition: all 0.15s;
          box-shadow: 3px 3px 0 0 var(--ink-900);
          overflow: hidden;
        }
        .bingo-cell:hover {
          transform: translate(-1px, -1px);
          box-shadow: 4px 4px 0 0 var(--orange-500);
        }
        .bingo-cell:active {
          transform: translate(2px, 2px);
          box-shadow: 1px 1px 0 0 var(--ink-900);
        }
        .bingo-cell.filled {
          background: var(--orange-50);
        }
        .bingo-cell.in-line {
          background: var(--orange-500);
          color: white;
          box-shadow: 3px 3px 0 0 var(--ink-900);
        }
        .bingo-cell.in-line .bingo-cell-num { color: rgba(255,255,255,0.7); }
        .bingo-cell.in-line .bingo-cell-check { background: white; color: var(--orange-500); }

        .bingo-cell-num {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 800;
          color: var(--ink-400);
          line-height: 1;
        }
        .bingo-cell-task {
          font-size: 11px;
          font-weight: 700;
          line-height: 1.35;
          margin-top: 6px;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .bingo-cell-check {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 22px;
          height: 22px;
          background: var(--orange-500);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 900;
          border: 2px solid var(--ink-900);
        }

        @media (max-width: 380px) {
          .bingo-cell { padding: 8px 6px; }
          .bingo-cell-task { font-size: 10px; }
        }

        .cell-photo-preview {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          border-radius: var(--r-md);
          border: 2px solid var(--ink-900);
          overflow: hidden;
          margin-bottom: 14px;
          background: var(--ink-100);
        }
        .cell-photo-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .cell-photo-retake {
          position: absolute;
          right: 10px; bottom: 10px;
          background: rgba(17, 20, 24, 0.85);
          color: white;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
          border: 1.5px solid white;
          backdrop-filter: blur(8px);
        }

        .modal-eyebrow {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--orange-600);
          margin-bottom: 6px;
        }
        .modal-task {
          font-size: 17px;
          font-weight: 800;
          line-height: 1.4;
          margin-bottom: 16px;
          color: var(--ink-900);
        }
        .modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 14px;
        }
        .celebrate-icon {
          width: 96px;
          height: 96px;
          margin: 0 auto 12px;
          display: block;
          animation: pulse 1.5s infinite;
        }
        .screen-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .screen-title-icon {
          width: 32px;
          height: 32px;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  )
}
