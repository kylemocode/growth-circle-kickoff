import { useState, useEffect, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Html5Qrcode } from 'html5-qrcode'
import { findMemberByPin, MEMBERS } from '../data/members'

const key = (id) => `gck_qr_${id}`

export default function QRCollect({ me, back }) {
  const [mode, setMode] = useState('mine')
  const [collected, setCollected] = useState(() => {
    const s = localStorage.getItem(key(me.id))
    return s ? JSON.parse(s) : []
  })
  const [toast, setToast] = useState(null)

  useEffect(() => {
    localStorage.setItem(key(me.id), JSON.stringify(collected))
  }, [collected, me.id])

  function addCollected(pin) {
    if (pin === me.pin) {
      setToast({ type: 'error', text: '這是你自己呀 🙃' })
      return
    }
    const m = findMemberByPin(pin)
    if (!m) {
      setToast({ type: 'error', text: 'PIN 不存在' })
      return
    }
    if (collected.includes(m.id)) {
      setToast({ type: 'info', text: `已經收集過 ${m.name} 了` })
      return
    }
    setCollected([...collected, m.id])
    setToast({ type: 'success', text: `+ ${m.name} ✨` })
  }

  const myQrValue = `gck://pin/${me.pin}`

  return (
    <div className="screen fade-in-up">
      <header className="topbar">
        <button onClick={back} className="btn-ghost back-btn">← 回首頁</button>
        <div className="topbar-logo" style={{ fontSize: 13 }}>
          <img src="/kettlebell.svg" alt="" style={{ width: 22, height: 22 }} />
          <span>QR · COLLECT</span>
        </div>
      </header>

      <div className="fade-in-up-1">
        <div className="h-eyebrow">EXCHANGE & COLLECT</div>
        <h1 className="h-title">📸 QR 互掃收集</h1>
        <p className="h-sub">給對方掃你的 QR，或掃對方的 QR · 收集今晚遇到的夥伴</p>
      </div>

      <div className="qr-tabs fade-in-up-2">
        <button className={`qr-tab ${mode === 'mine' ? 'active' : ''}`} onClick={() => setMode('mine')}>
          我的 QR
        </button>
        <button className={`qr-tab ${mode === 'scan' ? 'active' : ''}`} onClick={() => setMode('scan')}>
          掃別人
        </button>
        <button className={`qr-tab ${mode === 'collection' ? 'active' : ''}`} onClick={() => setMode('collection')}>
          收集 <span className="qr-tab-count">{collected.length}</span>
        </button>
      </div>

      {mode === 'mine' && (
        <div className="qr-mine fade-in-up-3">
          <div className="qr-mine-card">
            <div className="text-mono qr-mine-label">SHOW THIS QR</div>
            <div className="qr-mine-name">{me.name}</div>
            <div className="qr-wrap">
              <QRCodeSVG value={myQrValue} size={220} level="M" />
            </div>
            <div className="qr-mine-divider">— 或 —</div>
            <div className="qr-mine-pin-hint">讓對方手動輸入你的 PIN</div>
            <div className="big-pin">{me.pin}</div>
          </div>
        </div>
      )}

      {mode === 'scan' && <Scanner onScan={addCollected} />}

      {mode === 'collection' && (
        <div className="fade-in-up-3">
          <div className="collection-stats">
            <div>
              <div className="text-mono" style={{ fontSize: 11, fontWeight: 800, color: 'var(--orange-300)', letterSpacing: '0.15em' }}>COLLECTED</div>
              <div style={{ fontSize: 32, fontWeight: 900, lineHeight: 1 }}>
                {collected.length}
                <span style={{ fontSize: 16, opacity: 0.6 }}> / {MEMBERS.length - 1}</span>
              </div>
            </div>
            {collected.length >= 10 && <div className="badge-collect">🏆 社交達人</div>}
          </div>

          {collected.length === 0 ? (
            <div className="empty-state">
              <div className="empty-emoji">🌱</div>
              <div className="empty-title">還沒收集到夥伴</div>
              <div className="empty-desc">切到「掃別人」開始收集吧</div>
            </div>
          ) : (
            <div className="collection-grid">
              {collected.map((id, i) => {
                const m = MEMBERS.find((x) => x.id === id)
                if (!m) return null
                return (
                  <div key={id} className="collection-card" style={{ animationDelay: `${i * 0.04}s` }}>
                    <div className="collection-emoji">👤</div>
                    <div className="collection-name">{m.name}</div>
                    <div className="collection-card-num">#{String(m.cardNum).padStart(2, '0')}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <style>{`
        .back-btn { font-size: 14px; font-weight: 700; color: var(--ink-700); }

        .qr-tabs {
          display: flex;
          gap: 6px;
          background: var(--ink-100);
          padding: 6px;
          border-radius: var(--r-md);
          border: 2px solid var(--ink-900);
          margin-bottom: var(--s-5);
        }
        .qr-tab {
          flex: 1;
          padding: 10px 8px;
          font-size: 13px;
          font-weight: 800;
          border-radius: var(--r-sm);
          color: var(--muted);
          transition: all 0.15s;
        }
        .qr-tab.active {
          background: var(--ink-900);
          color: white;
        }
        .qr-tab-count {
          background: var(--orange-500);
          color: white;
          padding: 2px 8px;
          border-radius: 999px;
          font-size: 11px;
          margin-left: 2px;
          font-family: var(--font-mono);
        }
        .qr-tab.active .qr-tab-count { background: var(--orange-500); }

        .qr-mine-card {
          background: var(--paper);
          border: 2.5px solid var(--ink-900);
          border-radius: var(--r-md);
          padding: 24px 20px;
          text-align: center;
          box-shadow: 4px 4px 0 0 var(--orange-500);
        }
        .qr-mine-label {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.18em;
          color: var(--orange-600);
        }
        .qr-mine-name {
          font-size: 24px;
          font-weight: 900;
          margin: 6px 0 18px;
          letter-spacing: -0.02em;
        }
        .qr-wrap {
          display: inline-flex;
          padding: 14px;
          background: white;
          border: 2px solid var(--ink-900);
          border-radius: var(--r-md);
          box-shadow: 4px 4px 0 0 var(--ink-900);
        }
        .qr-mine-divider {
          margin: 24px 0 12px;
          font-size: 12px;
          font-weight: 700;
          color: var(--ink-400);
          letter-spacing: 0.1em;
        }
        .qr-mine-pin-hint {
          font-size: 12px;
          color: var(--muted);
        }
        .big-pin {
          font-family: var(--font-mono);
          font-size: 40px;
          font-weight: 900;
          letter-spacing: 0.25em;
          color: var(--ink-900);
          margin-top: 6px;
        }

        .collection-stats {
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
        .collection-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        @media (min-width: 480px) {
          .collection-grid { grid-template-columns: repeat(4, 1fr); }
        }
        .collection-card {
          background: var(--paper);
          border: 2px solid var(--ink-900);
          border-radius: var(--r-md);
          padding: 12px 8px;
          text-align: center;
          box-shadow: 2px 2px 0 0 var(--ink-900);
          animation: fadeInUp 0.4s ease-out both;
        }
        .collection-emoji { font-size: 28px; }
        .collection-name { font-size: 12px; font-weight: 800; margin-top: 4px; }
        .collection-card-num {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--muted);
          font-weight: 700;
        }
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: var(--paper);
          border: 2px dashed var(--ink-200);
          border-radius: var(--r-md);
        }
        .empty-emoji { font-size: 56px; margin-bottom: 12px; }
        .empty-title { font-size: 16px; font-weight: 800; margin-bottom: 4px; }
        .empty-desc { font-size: 13px; color: var(--muted); }
      `}</style>
    </div>
  )
}

function Scanner({ onScan }) {
  const [manualPin, setManualPin] = useState('')
  const [showManual, setShowManual] = useState(false)
  const [error, setError] = useState(null)
  const scannerRef = useRef(null)

  useEffect(() => {
    if (showManual) return

    const elId = 'qr-reader'
    let scanner = null

    try {
      scanner = new Html5Qrcode(elId)
      scannerRef.current = scanner
      scanner
        .start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decoded) => {
            const m = decoded.match(/gck:\/\/pin\/(\d{4})/)
            if (m) onScan(m[1])
          },
          () => {}
        )
        .catch((err) => {
          console.warn('Scanner error:', err)
          setError(err?.message || '無法啟動相機')
        })
    } catch (e) {
      setError(e?.message || '無法啟動相機')
    }

    return () => {
      if (scanner) {
        scanner
          .stop()
          .catch(() => {})
          .then(() => scanner.clear())
      }
    }
  }, [onScan, showManual])

  function submitManual(e) {
    e.preventDefault()
    if (manualPin.length === 4) {
      onScan(manualPin)
      setManualPin('')
    }
  }

  return (
    <div className="scanner-card fade-in-up-3">
      {!showManual ? (
        <>
          <div className="scanner-hint">把對方的 QR 對準框框</div>
          <div id="qr-reader" className="scanner-stage" />
          {error && (
            <div className="scanner-error">
              ⚠️ {error}
              <div style={{ marginTop: 6, fontSize: 11 }}>
                需要相機權限 · 在 iPhone 請用 Safari、Android 用 Chrome
              </div>
            </div>
          )}
          <button onClick={() => setShowManual(true)} className="btn btn-secondary btn-block" style={{ marginTop: 14 }}>
            或手動輸入 PIN
          </button>
        </>
      ) : (
        <form onSubmit={submitManual}>
          <div className="scanner-hint" style={{ marginBottom: 14 }}>
            輸入對方的 4 位數 PIN
          </div>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            value={manualPin}
            onChange={(e) => setManualPin(e.target.value.replace(/\D/g, ''))}
            placeholder="0000"
            className="big-pin-input"
            autoFocus
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button type="button" onClick={() => setShowManual(false)} className="btn btn-secondary" style={{ flex: 1 }}>
              掃 QR
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={manualPin.length !== 4}>
              送出 ✓
            </button>
          </div>
        </form>
      )}

      <style>{`
        .scanner-card {
          background: var(--paper);
          border: 2.5px solid var(--ink-900);
          border-radius: var(--r-md);
          padding: 18px;
          box-shadow: 4px 4px 0 0 var(--ink-900);
        }
        .scanner-hint {
          font-size: 13px;
          color: var(--muted);
          font-weight: 700;
          text-align: center;
          margin-bottom: 12px;
        }
        .scanner-stage {
          width: 100%;
          aspect-ratio: 1;
          border: 2px solid var(--ink-900);
          border-radius: var(--r-md);
          overflow: hidden;
          background: var(--ink-100);
        }
        .scanner-error {
          background: #FEE2E2;
          color: var(--red);
          padding: 12px;
          border-radius: var(--r-sm);
          font-size: 13px;
          font-weight: 600;
          margin-top: 10px;
          text-align: center;
        }
        .big-pin-input {
          width: 100%;
          padding: 16px;
          font-size: 28px;
          font-weight: 900;
          text-align: center;
          letter-spacing: 0.3em;
          font-family: var(--font-mono);
          border: 2.5px solid var(--ink-900);
          border-radius: var(--r-md);
          background: var(--paper);
          box-shadow: 3px 3px 0 0 var(--ink-900);
        }
        .big-pin-input:focus {
          outline: none;
          background: var(--orange-50);
        }
      `}</style>
    </div>
  )
}

function Toast({ type, text, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 1800)
    return () => clearTimeout(t)
  }, [onClose])

  const bg = type === 'success' ? 'var(--green)' : type === 'error' ? 'var(--red)' : 'var(--ink-800)'
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'calc(24px + var(--safe-bottom))',
        left: '50%',
        transform: 'translateX(-50%)',
        background: bg,
        color: 'white',
        padding: '14px 22px',
        borderRadius: 999,
        fontWeight: 800,
        fontSize: 14,
        boxShadow: 'var(--shadow-lg)',
        border: '2px solid var(--ink-900)',
        animation: 'fadeInUp 0.25s',
        zIndex: 200,
        maxWidth: 'calc(100vw - 40px)',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  )
}
