import { useState, useEffect } from 'react'
import PinGate from './screens/PinGate'
import Home from './screens/Home'
import Bingo from './screens/Bingo'
import Cafe from './screens/Cafe'
import QRCollect from './screens/QRCollect'

const ME_KEY = 'gck_me_v1'

export default function App() {
  const [me, setMe] = useState(null)
  const [screen, setScreen] = useState('home')
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(ME_KEY)
    if (saved) {
      try { setMe(JSON.parse(saved)) } catch {}
    }
  }, [])

  function login(member) {
    setMe(member)
    localStorage.setItem(ME_KEY, JSON.stringify(member))
    // 觸發「閘門拉開」轉場
    setTransitioning(true)
    setTimeout(() => setTransitioning(false), 450)
  }

  function logout() {
    setMe(null)
    setScreen('home')
    localStorage.removeItem(ME_KEY)
  }

  if (!me) return <PinGate onLogin={login} />

  return (
    <>
      {screen === 'home' && <Home me={me} go={setScreen} onLogout={logout} />}
      {screen === 'bingo' && <Bingo me={me} back={() => setScreen('home')} />}
      {screen === 'cafe' && <Cafe me={me} back={() => setScreen('home')} />}
      {screen === 'qr' && <QRCollect me={me} back={() => setScreen('home')} />}

      {transitioning && <GateOpen />}
    </>
  )
}

function GateOpen() {
  return (
    <div className="gate-open-overlay">
      <div className="gate-open-top" />
      <div className="gate-open-bottom" />

      <style>{`
        .gate-open-overlay {
          position: fixed;
          inset: 0;
          z-index: 999;
          pointer-events: none;
          overflow: hidden;
        }
        .gate-open-top, .gate-open-bottom {
          position: absolute;
          left: 0;
          right: 0;
          height: 50vh;
          background: var(--ink-900);
          will-change: transform;
        }
        .gate-open-top {
          top: 0;
          border-bottom: 4px solid var(--orange-500);
          animation: gateOpenTop 0.45s cubic-bezier(0.76, 0, 0.24, 1) forwards;
        }
        .gate-open-bottom {
          bottom: 0;
          border-top: 4px solid var(--orange-500);
          animation: gateOpenBottom 0.45s cubic-bezier(0.76, 0, 0.24, 1) forwards;
        }
        @keyframes gateOpenTop {
          0% { transform: translateY(0); }
          100% { transform: translateY(-110%); }
        }
        @keyframes gateOpenBottom {
          0% { transform: translateY(0); }
          100% { transform: translateY(110%); }
        }
      `}</style>
    </div>
  )
}
