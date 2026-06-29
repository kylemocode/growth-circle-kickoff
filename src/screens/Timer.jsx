import { useState, useEffect, useRef } from 'react'

const PRESETS = [5, 10, 15, 20]

export default function Timer({ me, back }) {
  const [minutes, setMinutes] = useState(15)
  const [totalSec, setTotalSec] = useState(15 * 60)
  const [remaining, setRemaining] = useState(15 * 60)
  const [running, setRunning] = useState(false)
  const [finishedAt, setFinishedAt] = useState(null)
  const intervalRef = useRef(null)

  // Tick
  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(intervalRef.current)
          setRunning(false)
          setFinishedAt(Date.now())
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running])

  // Auto-reset after finish 5s
  useEffect(() => {
    if (!finishedAt) return
    const t = setTimeout(() => {
      setFinishedAt(null)
      setRemaining(totalSec)
    }, 5000)
    return () => clearTimeout(t)
  }, [finishedAt, totalSec])

  function setPreset(m) {
    if (running) return
    setMinutes(m)
    setTotalSec(m * 60)
    setRemaining(m * 60)
  }

  function start() {
    if (remaining === 0) setRemaining(totalSec)
    setRunning(true)
  }

  function pause() {
    setRunning(false)
  }

  function reset() {
    setRunning(false)
    setRemaining(totalSec)
    setFinishedAt(null)
  }

  const mm = Math.floor(remaining / 60)
  const ss = remaining % 60
  const display = `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`

  const progress = totalSec > 0 ? remaining / totalSec : 0  // 1 → 0
  const isFinishing = remaining > 0 && remaining <= 60   // 最後 60 秒
  const isTimeUp = finishedAt !== null

  return (
    <div className={`timer-screen ${isFinishing ? 'is-finishing' : ''} ${isTimeUp ? 'is-up' : ''}`}>
      <div className="timer-bg-grid" />

      <header className="timer-top">
        <button onClick={back} className="btn-ghost back-btn">← 回首頁</button>
        <div className="topbar-logo" style={{ fontSize: 13 }}>
          <img src="/kettlebell.svg" alt="" style={{ width: 22, height: 22 }} />
          <span>TIMER</span>
        </div>
      </header>

      {/* Time Up 全螢幕狀態 */}
      {isTimeUp ? (
        <div className="timeup-stage fade-in-up">
          <img src="/kettlebell.png" alt="" className="timeup-bell" />
          <div className="timeup-eyebrow">TIME UP</div>
          <div className="timeup-title">時間到！</div>
          <div className="timeup-sub">5 秒後回到設定畫面</div>
        </div>
      ) : (
        <div className="timer-stage">
          <div className="timer-eyebrow">TRAINING TIMER</div>

          <div className="timer-display-wrap">
            {/* progress ring */}
            <svg className="progress-ring" viewBox="0 0 240 240" aria-hidden="true">
              <circle cx="120" cy="120" r="112" className="progress-track" />
              <circle
                cx="120" cy="120" r="112"
                className="progress-bar"
                style={{
                  strokeDasharray: `${2 * Math.PI * 112}`,
                  strokeDashoffset: `${2 * Math.PI * 112 * (1 - progress)}`,
                }}
              />
            </svg>
            <div className={`timer-display ${remaining === 0 ? 'zero' : ''}`}>{display}</div>
          </div>

          {!running && (
            <div className="presets fade-in-up-1">
              {PRESETS.map((m) => (
                <button
                  key={m}
                  className={`preset ${m === minutes ? 'active' : ''}`}
                  onClick={() => setPreset(m)}
                >
                  {m}<span>分</span>
                </button>
              ))}
              <button
                className="preset preset-custom"
                onClick={() => {
                  const v = prompt('自訂分鐘數', String(minutes))
                  const n = parseInt(v || '', 10)
                  if (n > 0 && n < 999) setPreset(n)
                }}
              >
                自訂
              </button>
            </div>
          )}

          <div className="controls fade-in-up-2">
            {running ? (
              <button onClick={pause} className="btn-pill btn-pill-secondary">
                ⏸ 暫停
              </button>
            ) : (
              <button onClick={start} className="btn-pill btn-pill-primary">
                {remaining < totalSec && remaining > 0 ? '繼續' : '啟動'}
              </button>
            )}
            <button onClick={reset} className="btn-pill btn-pill-ghost" disabled={remaining === totalSec && !running}>
              重置
            </button>
          </div>

          <img src="/ip-boy.png" alt="" className="timer-deco" />
        </div>
      )}

      <style>{`
        .timer-screen {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: calc(var(--safe-top) + var(--s-4)) var(--s-5) calc(var(--safe-bottom) + var(--s-5));
          background: var(--ink-900);
          color: white;
          position: relative;
          overflow: hidden;
          transition: background 0.4s;
        }
        .timer-screen.is-finishing {
          background: #4a1a14;
        }
        .timer-screen.is-up {
          background: linear-gradient(135deg, var(--orange-500), var(--orange-600));
        }
        .timer-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%);
          pointer-events: none;
        }
        .timer-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 1;
        }
        .back-btn {
          color: rgba(255,255,255,0.7);
          font-size: 14px;
          font-weight: 700;
        }
        .timer-screen .topbar-logo { color: white; }
        .timer-screen .topbar-logo img { filter: brightness(0) invert(1); }

        .timer-stage {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 0;
          position: relative;
          z-index: 1;
        }

        .timer-eyebrow {
          font-family: var(--font-mono);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.25em;
          color: var(--orange-300);
          margin-bottom: 8px;
        }
        .is-finishing .timer-eyebrow { color: #ff8a7a; }

        .timer-display-wrap {
          position: relative;
          width: clamp(280px, 60vw, 480px);
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 16px 0;
        }
        .progress-ring {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }
        .progress-track {
          fill: none;
          stroke: rgba(255,255,255,0.08);
          stroke-width: 6;
        }
        .progress-bar {
          fill: none;
          stroke: var(--orange-500);
          stroke-width: 6;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.95s linear, stroke 0.3s;
        }
        .is-finishing .progress-bar { stroke: #ff5a44; }

        .timer-display {
          font-family: var(--font-mono);
          font-size: clamp(72px, 18vw, 140px);
          font-weight: 900;
          letter-spacing: -0.02em;
          line-height: 1;
          color: white;
          font-variant-numeric: tabular-nums;
        }
        .is-finishing .timer-display {
          color: #ffdcd5;
          animation: pulse 1s infinite;
        }
        .timer-display.zero { color: var(--orange-300); }

        .presets {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 24px;
          margin-top: 16px;
        }
        .preset {
          background: rgba(255,255,255,0.08);
          border: 2px solid rgba(255,255,255,0.15);
          color: white;
          padding: 10px 18px;
          border-radius: var(--r-md);
          font-size: 18px;
          font-weight: 900;
          font-family: var(--font-mono);
          transition: all 0.15s;
        }
        .preset span {
          font-size: 11px;
          margin-left: 2px;
          opacity: 0.6;
        }
        .preset:hover {
          background: rgba(255,255,255,0.15);
        }
        .preset.active {
          background: var(--orange-500);
          border-color: var(--orange-500);
          color: white;
        }
        .preset-custom {
          font-size: 13px;
          font-family: var(--font-tc);
          letter-spacing: 0.05em;
        }

        .controls {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .btn-pill {
          padding: 14px 28px;
          border-radius: 999px;
          border: 2px solid;
          font-size: 16px;
          font-weight: 900;
          letter-spacing: 0.05em;
          transition: transform 0.1s, box-shadow 0.15s;
        }
        .btn-pill:active { transform: scale(0.96); }
        .btn-pill-primary {
          background: var(--orange-500);
          border-color: var(--orange-500);
          color: white;
          box-shadow: 0 8px 24px rgba(245, 120, 37, 0.4);
          padding: 18px 36px;
          font-size: 18px;
        }
        .btn-pill-primary:hover { background: var(--orange-600); }
        .btn-pill-secondary {
          background: rgba(255,255,255,0.15);
          border-color: white;
          color: white;
          padding: 18px 36px;
          font-size: 18px;
        }
        .btn-pill-ghost {
          background: transparent;
          border-color: rgba(255,255,255,0.3);
          color: rgba(255,255,255,0.85);
        }
        .btn-pill:disabled {
          opacity: 0.35;
          cursor: not-allowed;
          transform: none !important;
        }

        .timer-deco {
          position: absolute;
          bottom: -10px;
          right: -10px;
          width: 140px;
          height: 140px;
          opacity: 0.4;
          filter: drop-shadow(2px 2px 0 rgba(0,0,0,0.3));
          pointer-events: none;
          animation: bobIp 4s ease-in-out infinite;
        }
        @keyframes bobIp {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(-3deg); }
        }
        @media (max-width: 480px) {
          .timer-deco { width: 100px; height: 100px; bottom: -8px; right: -8px; opacity: 0.3; }
        }

        /* Time Up screen */
        .timeup-stage {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          z-index: 1;
        }
        .timeup-bell {
          width: 160px;
          height: 160px;
          animation: bellSpin 2s linear infinite;
          filter: drop-shadow(4px 4px 0 rgba(0,0,0,0.3));
        }
        @keyframes bellSpin {
          0% { transform: rotate(-10deg) scale(1); }
          50% { transform: rotate(10deg) scale(1.05); }
          100% { transform: rotate(-10deg) scale(1); }
        }
        .timeup-eyebrow {
          font-family: var(--font-mono);
          font-size: 18px;
          font-weight: 900;
          letter-spacing: 0.3em;
          color: rgba(255,255,255,0.85);
        }
        .timeup-title {
          font-size: clamp(64px, 16vw, 120px);
          font-weight: 900;
          letter-spacing: -0.04em;
          color: white;
          line-height: 1;
          text-shadow: 4px 4px 0 rgba(0,0,0,0.2);
        }
        .timeup-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.75);
          font-weight: 700;
        }
      `}</style>
    </div>
  )
}
