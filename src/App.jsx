import { useState, useEffect } from 'react'
import PinGate from './screens/PinGate'
import Home from './screens/Home'
import Bingo from './screens/Bingo'
import Cafe from './screens/Cafe'
import Admin from './screens/Admin'

const ME_KEY = 'gck_me_v1'

export default function App() {
  const [me, setMe] = useState(null)
  const [screen, setScreen] = useState('home')
  const [transition, setTransition] = useState(null)  // null | 'closing' | 'open'

  useEffect(() => {
    const saved = localStorage.getItem(ME_KEY)
    if (saved) {
      try { setMe(JSON.parse(saved)) } catch {}
    }
  }, [])

  function login(member) {
    // Phase 1: 閘門關上（PinGate 還在後面）
    setTransition('closing')
    // Phase 2: 320ms 後關上完成，切到 Home（被閘門蓋住）
    setTimeout(() => {
      setMe(member)
      localStorage.setItem(ME_KEY, JSON.stringify(member))
      setTransition('open')
    }, 320)
    // Phase 3: 閘門拉開後移除
    setTimeout(() => setTransition(null), 320 + 400 + 50)
  }

  function logout() {
    setMe(null)
    setScreen('home')
    localStorage.removeItem(ME_KEY)
  }

  return (
    <>
      {!me && <PinGate onLogin={login} />}
      {me && screen === 'home' && <Home me={me} go={setScreen} onLogout={logout} />}
      {me && screen === 'bingo' && <Bingo me={me} back={() => setScreen('home')} />}
      {me && screen === 'cafe' && <Cafe me={me} back={() => setScreen('home')} />}
      {me && screen === 'admin' && <Admin me={me} back={() => setScreen('home')} />}

      {transition && <GateTransition phase={transition} />}
    </>
  )
}

// 一體式閘門動畫：
// closing → 上下從畫面外滑入（320ms）
// open    → 上下往外滑出（400ms）
function GateTransition({ phase }) {
  return (
    <div className="gate-transition">
      <div className={`gate-half gate-top ${phase}`} />
      <div className={`gate-half gate-bottom ${phase}`} />

      <style>{`
        .gate-transition {
          position: fixed;
          inset: 0;
          z-index: 999;
          pointer-events: none;
          overflow: hidden;
        }
        .gate-half {
          position: absolute;
          left: 0;
          right: 0;
          height: 50.5vh;
          background: var(--ink-900);
          will-change: transform;
        }
        .gate-top {
          top: 0;
          border-bottom: 4px solid var(--orange-500);
        }
        .gate-bottom {
          bottom: 0;
          border-top: 4px solid var(--orange-500);
        }

        /* Phase: closing — 從畫面外往中間滑 */
        .gate-top.closing {
          animation: gateInTop 0.32s cubic-bezier(0.7, 0, 0.3, 1) forwards;
        }
        .gate-bottom.closing {
          animation: gateInBottom 0.32s cubic-bezier(0.7, 0, 0.3, 1) forwards;
        }
        @keyframes gateInTop {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        @keyframes gateInBottom {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        /* Phase: open — 從中間往外滑 */
        .gate-top.open {
          transform: translateY(0);
          animation: gateOutTop 0.4s 0.05s cubic-bezier(0.7, 0, 0.3, 1) forwards;
        }
        .gate-bottom.open {
          transform: translateY(0);
          animation: gateOutBottom 0.4s 0.05s cubic-bezier(0.7, 0, 0.3, 1) forwards;
        }
        @keyframes gateOutTop {
          from { transform: translateY(0); }
          to { transform: translateY(-101%); }
        }
        @keyframes gateOutBottom {
          from { transform: translateY(0); }
          to { transform: translateY(101%); }
        }
      `}</style>
    </div>
  )
}
