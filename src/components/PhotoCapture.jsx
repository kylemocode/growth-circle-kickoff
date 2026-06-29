import { useEffect, useRef, useState } from 'react'

// PhotoCapture：相機 + 拍照彈窗
//
// Props:
//   open: boolean
//   taskText: string   — 顯示用，告訴使用者「為了某格而拍」
//   onClose(): void
//   onCapture({ dataUrl, withName? }): void
//
// 流程：
//   1. 打開 → 啟動前鏡頭
//   2. 預覽 + 對方名字輸入欄
//   3. 拍 → 顯示縮圖 + 重拍 / 確認
//   4. 確認 → onCapture({ dataUrl, withName })
//
// 限制：純前端、用 canvas 壓縮成 720x720 JPEG，避免 localStorage 爆掉

// 注意：圖檔要塞進 Firestore document，所以單張 < 700KB 比較安全
// 600x600 + JPEG 0.7 大概 80-150KB
const FRAME_SIZE = 600
const JPEG_QUALITY = 0.7

export default function PhotoCapture({ open, taskText, onClose, onCapture }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)  // dataUrl
  const [withName, setWithName] = useState('')
  const [facing, setFacing] = useState('user')  // 'user' | 'environment'

  // 每次重新打開時，清掉舊狀態（preview / withName / error）
  useEffect(() => {
    if (open) {
      setPreview(null)
      setWithName('')
      setError(null)
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      stopCamera()
      return
    }
    startCamera(facing)
    return () => stopCamera()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, facing])

  async function startCamera(mode) {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 1280 },
        },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => {})
      }
    } catch (e) {
      console.error('camera error:', e)
      setError(e?.message || '無法啟動相機')
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }

  function toggleFacing() {
    setFacing((f) => (f === 'user' ? 'environment' : 'user'))
  }

  function snap() {
    const video = videoRef.current
    if (!video) return

    // 用 canvas 處理：center-crop 成正方形 + 壓縮
    const canvas = document.createElement('canvas')
    canvas.width = FRAME_SIZE
    canvas.height = FRAME_SIZE
    const ctx = canvas.getContext('2d')

    const vw = video.videoWidth
    const vh = video.videoHeight
    const side = Math.min(vw, vh)
    const sx = (vw - side) / 2
    const sy = (vh - side) / 2

    // 前鏡頭水平翻轉，後鏡頭不翻
    if (facing === 'user') {
      ctx.translate(FRAME_SIZE, 0)
      ctx.scale(-1, 1)
    }

    ctx.drawImage(video, sx, sy, side, side, 0, 0, FRAME_SIZE, FRAME_SIZE)
    const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY)
    setPreview(dataUrl)
    stopCamera()
  }

  function retake() {
    setPreview(null)
    startCamera(facing)
  }

  function confirm(e) {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (!preview) return
    // 不要在這裡 setPreview(null) / setWithName('') —
    // 那會讓 component 在被卸載前先「視覺切回相機預覽」造成閃爍。
    // 直接通知 parent，parent 會 setOpen(false) 讓本元件卸載，cleanup 留給 useEffect
    onCapture({ dataUrl: preview, withName: withName.trim() })
  }

  function close() {
    // 同理：不在這裡重設內部 state
    onClose()
  }

  if (!open) return null

  return (
    <div className="cap-overlay" onClick={close}>
      <div className="cap-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cap-head">
          <div className="cap-eyebrow">CHECK-IN PHOTO</div>
          <button onClick={close} className="cap-close">✕</button>
        </div>

        <div className="cap-task">
          {taskText && (
            <>
              <span className="cap-task-label">這格題目：</span>
              <span className="cap-task-text">{taskText}</span>
            </>
          )}
        </div>

        <div className="cap-stage">
          {error ? (
            <div className="cap-error">
              <div style={{ fontSize: 32, marginBottom: 8 }}>📵</div>
              {error}
              <div style={{ marginTop: 6, fontSize: 11, opacity: 0.75 }}>
                需要相機權限 · 在 iPhone 請用 Safari、Android 用 Chrome
              </div>
            </div>
          ) : preview ? (
            <img src={preview} alt="preview" className="cap-preview" />
          ) : (
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className={`cap-video ${facing === 'user' ? 'mirror' : ''}`}
            />
          )}
        </div>

        {!error && !preview && (
          <div className="cap-controls">
            <button onClick={toggleFacing} className="cap-icon-btn" aria-label="切換鏡頭">
              ⟳
            </button>
            <button onClick={snap} className="cap-shutter" aria-label="拍照">
              <span />
            </button>
            <div style={{ width: 44 }} />
          </div>
        )}

        {preview && (
          <>
            <input
              type="text"
              value={withName}
              onChange={(e) => setWithName(e.target.value)}
              placeholder="跟誰拍的？（選填）"
              className="cap-name-input"
            />
            <div className="cap-actions">
              <button onClick={retake} className="btn btn-secondary" style={{ flex: 1 }}>
                重拍
              </button>
              <button onClick={confirm} className="btn btn-primary" style={{ flex: 2 }}>
                確認 ✓
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        .cap-overlay {
          position: fixed;
          inset: 0;
          background: rgba(17, 20, 24, 0.7);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--s-4);
          padding-bottom: calc(var(--s-4) + var(--safe-bottom));
          animation: fadeIn 0.2s;
        }
        .cap-modal {
          background: var(--paper);
          border: 2.5px solid var(--ink-900);
          border-radius: var(--r-lg);
          padding: 18px;
          width: 100%;
          max-width: 440px;
          box-shadow: var(--shadow-lg);
          animation: fadeInUp 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .cap-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .cap-eyebrow {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.18em;
          color: var(--orange-600);
        }
        .cap-close {
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          color: var(--ink-700);
          border-radius: 50%;
        }
        .cap-close:hover { background: var(--ink-100); }

        .cap-task {
          background: var(--orange-50);
          border-left: 4px solid var(--orange-500);
          padding: 10px 14px;
          border-radius: var(--r-sm);
          font-size: 13px;
          line-height: 1.5;
          margin-bottom: 14px;
        }
        .cap-task-label {
          font-weight: 800;
          color: var(--orange-700);
        }
        .cap-task-text { color: var(--ink-900); }

        .cap-stage {
          width: 100%;
          aspect-ratio: 1;
          background: var(--ink-900);
          border: 2px solid var(--ink-900);
          border-radius: var(--r-md);
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cap-video, .cap-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .cap-video.mirror { transform: scaleX(-1); }
        .cap-error {
          color: white;
          text-align: center;
          padding: 24px;
          font-size: 13px;
          font-weight: 700;
        }

        .cap-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 14px;
          padding: 0 8px;
        }
        .cap-icon-btn {
          width: 44px; height: 44px;
          border-radius: 50%;
          background: var(--ink-100);
          border: 2px solid var(--ink-900);
          font-size: 20px;
          display: flex; align-items: center; justify-content: center;
        }
        .cap-shutter {
          width: 64px; height: 64px;
          border-radius: 50%;
          background: var(--ink-900);
          border: 4px solid var(--paper);
          box-shadow: 0 0 0 2.5px var(--ink-900);
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.1s;
        }
        .cap-shutter:active { transform: scale(0.92); }
        .cap-shutter span {
          display: block;
          width: 50px; height: 50px;
          border-radius: 50%;
          background: var(--orange-500);
        }

        .cap-name-input {
          width: 100%;
          padding: 12px 14px;
          border: 2px solid var(--ink-200);
          border-radius: var(--r-md);
          font-size: 15px;
          margin-top: 12px;
        }
        .cap-name-input:focus { outline: none; border-color: var(--orange-500); }

        .cap-actions {
          display: flex;
          gap: 10px;
          margin-top: 12px;
        }
      `}</style>
    </div>
  )
}
