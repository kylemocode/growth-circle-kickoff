import { useState, useRef, useEffect } from 'react'
import { findMemberByPin } from '../data/members'

export default function PinGate({ onLogin }) {
  const [digits, setDigits] = useState(['', '', '', ''])
  const [error, setError] = useState(false)
  const [unlocking, setUnlocking] = useState(null)  // null | member
  const refs = [useRef(), useRef(), useRef(), useRef()]

  useEffect(() => {
    setTimeout(() => refs[0].current?.focus(), 200)
  }, [])

  function handleChange(i, val) {
    if (unlocking) return
    const num = val.replace(/\D/g, '').slice(-1)
    setError(false)
    const next = [...digits]
    next[i] = num
    setDigits(next)
    if (num && i < 3) refs[i + 1].current?.focus()
    if (next.every(d => d !== '')) {
      setTimeout(() => tryLogin(next.join('')), 120)
    }
  }

  function handleKey(i, e) {
    if (unlocking) return
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      e.preventDefault()
      refs[i - 1].current?.focus()
      const next = [...digits]
      next[i - 1] = ''
      setDigits(next)
    }
  }

  function tryLogin(pin) {
    const member = findMemberByPin(pin)
    if (member) {
      // 標記成功 → 4 格變橘色 pop，並立刻通知 App 接手轉場
      setUnlocking(member)
      onLogin(member)
    } else {
      setError(true)
      setTimeout(() => setError(false), 600)
      setDigits(['', '', '', ''])
      refs[0].current?.focus()
    }
  }

  return (
    <div className="pin-screen">
      <div className="pin-bg-grid" />

      <div className="pin-content fade-in-up">
        <div className="pin-logo-wrap fade-in-up-1">
          <img src="/kettlebell.png" alt="" className="pin-kettlebell" />
        </div>

        <div className="pin-event-meta fade-in-up-2">
          <span className="pin-event-date">2026.07.05 SUN</span>
          <span className="pin-event-divider">/</span>
          <span className="pin-event-tag">KICKOFF EVENT</span>
        </div>

        <div className="pin-aapd-logo fade-in-up-3">
          <img src="/aapd-logo-full.svg" alt="AAPD" />
        </div>

        <h1 className="pin-title fade-in-up-3">
          <span className="pin-title-en">GROWTH CIRCLE</span><br/>
          <span className="pin-title-sm">創始會員實體迎新</span>
        </h1>

        <p className="pin-sub fade-in-up-4">
          輸入名牌上的 <b>4 位數 PIN</b>，開始今晚的訓練
        </p>

        <div className={`pin-boxes fade-in-up-5 ${error ? 'shake' : ''} ${unlocking ? 'success' : ''}`}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={refs[i]}
              className={`pin-box ${d ? 'filled' : ''} ${unlocking ? 'success' : ''}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKey(i, e)}
              onFocus={(e) => e.target.select()}
              aria-label={`PIN 第 ${i + 1} 碼`}
            />
          ))}
        </div>

        <div className="pin-error-slot">
          {error && <div className="pin-error">PIN 不正確，再試一次 🤔</div>}
        </div>

      </div>

      <style>{`
        .pin-screen {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: calc(var(--safe-top) + var(--s-5)) var(--s-5) calc(var(--safe-bottom) + var(--s-5));
          position: relative;
          overflow: hidden;
          background: var(--paper);
        }
        .pin-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(17, 20, 24, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(17, 20, 24, 0.06) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
          mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%);
        }

        .pin-event-meta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: var(--s-5);
          padding: 6px 14px;
          border: 1.5px solid var(--ink-300);
          border-radius: 999px;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--ink-700);
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
        }
        .pin-event-date { color: var(--orange-600); }
        .pin-event-divider { color: var(--ink-300); }
        .pin-event-tag { color: var(--ink-900); }

        .pin-content {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 440px;
          text-align: center;
        }
        .pin-logo-wrap {
          width: 120px;
          height: 120px;
          margin: 0 auto var(--s-5);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pinPulse 3s ease-in-out infinite;
        }
        @keyframes pinPulse {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-6px) rotate(3deg); }
        }
        .pin-kettlebell {
          width: 120px;
          height: 120px;
          object-fit: contain;
          filter: drop-shadow(4px 4px 0 var(--ink-900));
        }
        .pin-eyebrow-row {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-bottom: var(--s-5);
          flex-wrap: wrap;
        }
        .pin-aapd-logo {
          margin-bottom: var(--s-4);
          display: flex;
          justify-content: center;
        }
        .pin-aapd-logo img {
          height: clamp(40px, 7vw, 52px);
          width: auto;
        }
        .pin-title {
          font-size: clamp(32px, 10vw, 48px);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.03em;
          margin: 0 0 var(--s-5);
          color: var(--ink-900);
        }
        .pin-title-en {
          font-family: var(--font-mono);
          font-size: 0.55em;
          letter-spacing: 0.08em;
          color: var(--orange-500);
          display: inline-block;
          margin-top: 4px;
        }
        .pin-title-sm {
          display: inline-block;
          font-size: 0.42em;
          font-weight: 700;
          color: var(--ink-700);
          letter-spacing: 0.02em;
          margin-top: 8px;
        }
        .pin-sub {
          font-size: 14px;
          color: var(--muted);
          margin: 0 0 var(--s-6);
        }
        .pin-sub b {
          color: var(--orange-600);
          font-weight: 800;
        }
        .pin-boxes {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-bottom: 8px;
        }
        .pin-box {
          width: 56px;
          height: 68px;
          border: 2.5px solid var(--ink-900);
          border-radius: var(--r-md);
          background: var(--paper);
          color: var(--ink-900);
          font-family: var(--font-mono);
          font-size: 30px;
          font-weight: 900;
          text-align: center;
          transition: all 0.15s;
          box-shadow: 3px 3px 0 0 var(--ink-900);
        }
        @media (max-width: 380px) {
          .pin-box { width: 50px; height: 62px; font-size: 26px; }
          .pin-boxes { gap: 10px; }
        }
        .pin-box:focus {
          outline: none;
          background: var(--orange-50);
        }
        .pin-box.filled {
          background: var(--orange-500);
          color: white;
          border-color: var(--ink-900);
        }
        .pin-error-slot {
          height: 28px;
          margin-top: var(--s-3);
        }
        .pin-error {
          color: var(--red);
          font-size: 14px;
          font-weight: 700;
          animation: fadeIn 0.2s;
        }

        /* PIN success state */
        .pin-box.success {
          background: var(--orange-500);
          color: white;
          animation: pinSuccess 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes pinSuccess {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
