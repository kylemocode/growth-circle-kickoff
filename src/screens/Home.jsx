export default function Home({ me, go, onLogout }) {
  return (
    <div className="screen home-screen">
      <header className="topbar fade-in-up">
        <div className="topbar-logo">
          <img src="/kettlebell.svg" alt="" className="topbar-bell" />
          <img src="/aapd-logo-full.svg" alt="AAPD" className="topbar-aapd" />
        </div>
        <button onClick={onLogout} className="btn-ghost" style={{ fontSize: 13, fontWeight: 700 }}>登出</button>
      </header>

      {/* Hero card */}
      <div className="hero-card hero-card-enter">
        <div className="hero-card-content">
          <div className="hero-card-eyebrow">HELLO, BUILDER</div>
          <div className="hero-card-name">{me.name}</div>
          <div className="hero-card-meta">
            <span className="hero-meta-pill">卡 #{String(me.cardNum).padStart(2, '0')}</span>
            <span className="hero-meta-pill mono">PIN {me.pin}</span>
          </div>
        </div>
        <div className="hero-card-ip" aria-hidden="true">
          <img src="/ip-boy.png" alt="" />
        </div>
      </div>

      {/* Tables */}
      <div className="section-head fade-in-up-2">
        <div className="h-eyebrow">YOUR ROUTE TONIGHT</div>
        <h2 className="h-title section-title-with-icon">
          <img src="/icon-cafe.svg" alt="" className="section-icon" />
          今晚你的桌號路線
        </h2>
        <p className="h-sub">世界咖啡館 3 輪 · 桌長留下 · 會員按桌號移動</p>
      </div>

      <div className="tables-row fade-in-up-3">
        {[
          { label: 'R1', table: me.r1, time: '19:45' },
          { label: 'R2', table: me.r2, time: '20:00' },
          { label: 'R3', table: me.r3, time: '20:15' },
        ].map((r) => (
          <div key={r.label} className="table-card">
            <div className="table-card-label">{r.label}</div>
            <div className="table-card-time">{r.time}</div>
            <div className="table-card-num">{r.table}</div>
            <div className="table-card-foot">號桌</div>
          </div>
        ))}
      </div>

      {/* Modules */}
      <div className="section-head fade-in-up-4" style={{ marginTop: 'var(--s-6)' }}>
        <div className="h-eyebrow">TRAINING MENU</div>
        <h2 className="h-title section-title-with-icon">
          <img src="/icon-founding.svg" alt="" className="section-icon" />
          今晚的訓練菜單
        </h2>
        <p className="h-sub">點選任一個進入</p>
      </div>

      <div className="modules fade-in-up-5">
        <button className="module-card" onClick={() => go('bingo')}>
          <div className="module-icon module-icon-orange">
            <img src="/icon-bingo.svg" alt="" />
          </div>
          <div className="module-body">
            <div className="module-title">連連看 BINGO</div>
            <div className="module-desc">找夥伴交換答案 · 連 3 線 = BINGO</div>
          </div>
          <div className="module-arrow">→</div>
        </button>

        <button className="module-card" onClick={() => go('cafe')}>
          <div className="module-icon module-icon-blue">
            <img src="/icon-cafe.svg" alt="" />
          </div>
          <div className="module-body">
            <div className="module-title">世界咖啡館</div>
            <div className="module-desc">3 題 · 換桌動線 · 海報共創</div>
          </div>
          <div className="module-arrow">→</div>
        </button>

        <button className="module-card" onClick={() => go('admin')}>
          <div className="module-icon module-icon-yellow">
            <img src="/icon-qr.svg" alt="" />
          </div>
          <div className="module-body">
            <div className="module-title">📸 合照牆（Admin）</div>
            <div className="module-desc">當天所有 Builder 的合照</div>
          </div>
          <div className="module-arrow">→</div>
        </button>
      </div>

      <div className="home-footer fade-in-up-5">
        <span className="text-mono">{me.pin}</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span>AAPD Growth Circle</span>
      </div>

      <style>{`
        .home-screen { gap: 0; }

        /* Hero card */
        @keyframes heroEnter {
          0% { opacity: 0; transform: translateY(40px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .hero-card {
          position: relative;
          background: var(--ink-900);
          color: white;
          border: 2.5px solid var(--ink-900);
          border-radius: var(--r-lg);
          padding: 28px 24px;
          box-shadow: 6px 6px 0 0 var(--orange-500);
          margin-bottom: var(--s-7);
          overflow: hidden;
        }
        .hero-card-eyebrow {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: var(--orange-300);
          margin-bottom: 8px;
        }
        .hero-card-name {
          font-size: clamp(28px, 8vw, 36px);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
        }
        .hero-card-meta {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .hero-meta-pill {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
          border: 1.5px solid rgba(255, 255, 255, 0.3);
        }
        .hero-meta-pill.mono { font-family: var(--font-mono); }

        .hero-card { display: flex; align-items: flex-end; gap: 16px; }
        .hero-card-enter {
          animation:
            heroEnter 0.7s 0.1s cubic-bezier(0.34, 1.56, 0.64, 1) backwards,
            cardBreath 5s 1.5s ease-in-out infinite;
        }
        @keyframes cardBreath {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-3px) scale(1.005); }
        }
        .hero-card-content { flex: 1; min-width: 0; }
        .hero-card-ip {
          flex-shrink: 0;
          width: 130px;
          height: 130px;
          margin-right: -8px;
          margin-bottom: -28px;
          position: relative;
        }
        .hero-card-ip img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(3px 3px 0 rgba(0,0,0,0.3));
        }
        @media (max-width: 380px) {
          .hero-card-ip { width: 110px; height: 110px; }
        }

        /* Section head */
        .section-head { margin-bottom: var(--s-4); }
        .section-title-with-icon {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .section-icon {
          width: 32px;
          height: 32px;
          flex-shrink: 0;
        }

        /* Tables row */
        .tables-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .table-card {
          background: var(--paper);
          border: 2.5px solid var(--ink-900);
          border-radius: var(--r-md);
          padding: 14px 8px;
          text-align: center;
          box-shadow: 4px 4px 0 0 var(--ink-900);
          transition: transform 0.15s;
        }
        .table-card:hover {
          transform: translate(-1px, -1px);
          box-shadow: 5px 5px 0 0 var(--ink-900);
        }
        .table-card-label {
          font-family: var(--font-mono);
          font-size: 13px;
          font-weight: 800;
          color: var(--orange-500);
          letter-spacing: 0.1em;
        }
        .table-card-time {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--muted);
          margin-top: 2px;
        }
        .table-card-num {
          font-size: 52px;
          font-weight: 900;
          color: var(--ink-900);
          line-height: 1;
          margin: 6px 0 2px;
          letter-spacing: -0.04em;
        }
        .table-card-foot {
          font-size: 11px;
          color: var(--muted);
          font-weight: 700;
        }

        /* Modules */
        .modules { display: flex; flex-direction: column; gap: 12px; }
        .module-card {
          display: flex;
          align-items: center;
          gap: 16px;
          width: 100%;
          padding: 18px;
          background: var(--paper);
          border: 2.5px solid var(--ink-900);
          border-radius: var(--r-md);
          box-shadow: 4px 4px 0 0 var(--ink-900);
          transition: all 0.12s;
          text-align: left;
        }
        .module-card:hover {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0 0 var(--orange-500);
        }
        .module-card:active {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 0 var(--ink-900);
        }
        .module-icon {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--r-md);
          border: 2px solid var(--ink-900);
          flex-shrink: 0;
          overflow: hidden;
        }
        .module-icon img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .module-icon-orange { background: var(--orange-100); }
        .module-icon-blue { background: var(--blue-100); }
        .module-icon-yellow { background: #FFF1B8; }
        .module-body { flex: 1; min-width: 0; }
        .module-title {
          font-size: 17px;
          font-weight: 900;
          color: var(--ink-900);
          margin-bottom: 4px;
        }
        .module-desc {
          font-size: 13px;
          color: var(--muted);
          font-weight: 500;
        }
        .module-arrow {
          font-size: 24px;
          color: var(--ink-400);
          font-weight: 900;
          transition: transform 0.15s, color 0.15s;
          flex-shrink: 0;
        }
        .module-card:hover .module-arrow {
          color: var(--orange-500);
          transform: translateX(4px);
        }

        /* Footer */
        .home-footer {
          margin-top: var(--s-7);
          padding: var(--s-4) 0;
          text-align: center;
          font-size: 11px;
          color: var(--muted);
          font-weight: 700;
          letter-spacing: 0.1em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
      `}</style>
    </div>
  )
}
