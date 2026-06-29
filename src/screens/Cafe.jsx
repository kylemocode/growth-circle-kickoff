import { useState } from 'react'
import { CAFE_QUESTIONS } from '../data/cafeQuestions'

export default function Cafe({ me, back }) {
  const [activeRound, setActiveRound] = useState(0)
  const myTables = [me.r1, me.r2, me.r3]
  const q = CAFE_QUESTIONS[activeRound]
  const myTable = myTables[activeRound]

  return (
    <div className="screen fade-in-up">
      <header className="topbar">
        <button onClick={back} className="btn-ghost back-btn">← 回首頁</button>
        <div className="topbar-logo" style={{ fontSize: 13 }}>
          <img src="/kettlebell.svg" alt="" style={{ width: 22, height: 22 }} />
          <span>CAFÉ</span>
        </div>
      </header>

      <div className="fade-in-up-1">
        <div className="h-eyebrow">WORLD CAFÉ</div>
        <h1 className="h-title screen-title-row">
          <img src="/icon-cafe.svg" alt="" className="screen-title-icon" />
          世界咖啡館
        </h1>
        <p className="h-sub">3 輪換桌討論 · 桌長留下 · 海報共創</p>
      </div>

      <div className="round-tabs fade-in-up-2">
        {CAFE_QUESTIONS.map((q, i) => (
          <button
            key={i}
            className={`round-tab ${activeRound === i ? 'active' : ''}`}
            onClick={() => setActiveRound(i)}
          >
            <div className="round-tab-label">R{q.round}</div>
            <div className="round-tab-table">
              <span>桌</span>
              <strong>{myTables[i]}</strong>
            </div>
          </button>
        ))}
      </div>

      <div className="round-detail fade-in-up-3" key={activeRound}>
        <div className="round-detail-head">
          <span className="pill pill-ink">R{q.round}</span>
        </div>
        <h2 className="round-title">{q.title}</h2>
        <p className="round-desc">{q.description}</p>
      </div>

      <div className="my-table fade-in-up-4">
        <div className="my-table-body">
          <div className="my-table-label">這一輪你的桌號</div>
          <div className="my-table-num">{myTable}</div>
          <div className="my-table-foot">號桌 · TABLE {myTable}</div>
        </div>
      </div>

      <div className="rules fade-in-up-5">
        <div className="rules-head">三條規則</div>
        <ul className="rules-list">
          <li><b>邊講邊寫</b>　海報是大家的筆記，不是桌長的</li>
          <li><b>換題換桌</b>　每 15 分鐘換一輪、會員換桌、桌長留下</li>
          <li><b>沒有結論</b>　不用講完整、可以打斷、可以反對</li>
        </ul>
      </div>

      <style>{`
        .round-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: var(--s-5);
        }
        .round-tab {
          flex: 1;
          padding: 14px 6px 12px;
          background: var(--paper);
          border: 2.5px solid var(--ink-900);
          border-radius: var(--r-md);
          text-align: center;
          box-shadow: 3px 3px 0 0 var(--ink-900);
          transition: all 0.15s;
        }
        .round-tab.active {
          background: var(--orange-500);
          color: white;
          box-shadow: 3px 3px 0 0 var(--ink-900);
          transform: translate(-1px, -1px);
        }
        .round-tab:not(.active):hover {
          transform: translate(-1px, -1px);
          box-shadow: 4px 4px 0 0 var(--ink-900);
        }
        .round-tab-label {
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--orange-600);
          margin-bottom: 2px;
        }
        .round-tab.active .round-tab-label { color: white; }
        .round-tab-table {
          font-size: 11px;
          font-weight: 700;
          color: var(--muted);
          margin-top: 4px;
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 2px;
        }
        .round-tab.active .round-tab-table { color: rgba(255,255,255,0.85); }
        .round-tab-table strong {
          font-size: 22px;
          font-weight: 900;
          color: var(--ink-900);
          line-height: 1;
        }
        .round-tab.active .round-tab-table strong { color: white; }

        .round-detail {
          background: var(--paper);
          border: 2.5px solid var(--ink-900);
          border-radius: var(--r-md);
          padding: 20px;
          box-shadow: 4px 4px 0 0 var(--ink-900);
          margin-bottom: var(--s-5);
        }
        .round-detail-head {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .round-title {
          font-size: 22px;
          font-weight: 900;
          line-height: 1.3;
          margin: 0 0 12px;
          color: var(--ink-900);
          letter-spacing: -0.01em;
        }
        .round-desc {
          font-size: 14px;
          color: var(--ink-700);
          line-height: 1.7;
          margin: 0;
        }

        .my-table {
          background: linear-gradient(135deg, var(--orange-500), var(--orange-600));
          border: 2.5px solid var(--ink-900);
          border-radius: var(--r-md);
          padding: 28px 20px;
          margin-bottom: var(--s-5);
          color: white;
          text-align: center;
          box-shadow: 4px 4px 0 0 var(--ink-900);
          position: relative;
          overflow: hidden;
        }
        .my-table::before {
          content: '☕';
          position: absolute;
          top: -10px; right: -10px;
          font-size: 100px;
          opacity: 0.12;
          transform: rotate(-15deg);
        }
        .my-table-body { position: relative; z-index: 1; }
        .my-table-label {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 4px;
        }
        .my-table-num {
          font-size: 96px;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.05em;
          margin: 0;
        }
        .my-table-foot {
          font-family: var(--font-mono);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.9);
          margin-top: 4px;
        }

        .rules {
          background: var(--paper);
          border: 2px solid var(--ink-200);
          border-radius: var(--r-md);
          padding: 18px;
        }
        .rules-head {
          font-size: 14px;
          font-weight: 800;
          margin-bottom: 10px;
        }
        .rules-list {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .rules-list li {
          font-size: 13px;
          color: var(--ink-700);
          line-height: 1.7;
          padding-left: 22px;
          position: relative;
        }
        .rules-list li::before {
          content: '·';
          position: absolute;
          left: 8px;
          color: var(--orange-500);
          font-weight: 900;
        }
        .rules-list li b {
          color: var(--ink-900);
          font-weight: 800;
        }

        .back-btn {
          font-size: 14px;
          font-weight: 700;
          color: var(--ink-700);
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
