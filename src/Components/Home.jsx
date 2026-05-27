import React from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const fillProg = keyframes`
  from { width: 0; }
  to   { width: 89%; }
`;

const growBar = keyframes`
  from { transform: scaleY(0); }
  to   { transform: scaleY(1); }
`;

const softPulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.78; }
`;

const BAR_DATA = [
  { label: "Dec", h: 45 },
  { label: "Jan", h: 62 },
  { label: "Feb", h: 38 },
  { label: "Mar", h: 71 },
  { label: "Apr", h: 55 },
  { label: "May", h: 88, active: true },
];

const TRANSACTIONS = [
  { label: "May Salary",  amount: "+₹1,00,000", color: "#42AD00", icon: "fa-briefcase" },
  { label: "Rent",        amount: "−₹7,500",    color: "#CC4125", icon: "fa-house"     },
  { label: "Transport",   amount: "−₹1,230",    color: "#F6B26B", icon: "fa-bus"       },
];

const FEATURES = [
  { icon: "fa-rotate",        title: "Budget Cycles",    desc: "Monthly scoped periods"    },
  { icon: "fa-chart-bar",     title: "Expense Patterns", desc: "Cross-cycle comparisons"   },
  { icon: "fa-bolt",          title: "Real-time Sync",   desc: "Live across all devices"   },
  { icon: "fa-mobile-screen", title: "Installable PWA",  desc: "Home screen, no store"     },
];

export const Home = () => {
  const openGithub = () => {
    window.open(
      "https://github.com/madhoora-mohan/xpen--frontend",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <LandingStyled>
      <div className="left">
        <div className="brand a0">
          <div className="brand-mark">X$</div>
          <div>
            <div className="brand-name">Xpenz</div>
            <div className="brand-tag">Personal Finance</div>
          </div>
        </div>

        <div className="kicker a1">
          <span className="kicker-pip" />
          Cycle-based · Real-time · Installable
        </div>

        <h1 className="a2">
          Money clarity,
          <br />
          <span className="h1-green">in a few taps.</span>
        </h1>

        <p className="intro a3">
          Budget by cycle. Log income, expenses, and transfers with category
          breakdowns. Spot patterns across months. Installs like a native app
          on any device — no app store needed.
        </p>

        <div className="feat-grid a4">
          {FEATURES.map((f, i) => (
            <div key={i} className="feat">
              <div className="feat-icon">
                <i className={"fa-solid " + f.icon} />
              </div>
              <div>
                <div className="feat-title">{f.title}</div>
                <div className="feat-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="cta-row a5">
          <Link to="/signup" className="btn btn-primary">
            Get started — it's free
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Login
          </Link>
          <button type="button" className="btn btn-ghost" onClick={openGithub}>
            <i className="fa-brands fa-github" />
            GitHub
          </button>
        </div>
      </div>

      <div className="right">
        <div className="phone">
          <div className="phone-status">
            <span>9:41</span>
            <div className="phone-icons">
              <i className="fa-solid fa-signal" />
              <i className="fa-solid fa-wifi" />
              <i className="fa-solid fa-battery-full" />
            </div>
          </div>

          <div className="phone-header">
            <div>
              <div className="phone-month">May 2025</div>
              <div className="phone-cycle-sub">Cycle 5</div>
            </div>
            <span className="cycle-badge">● Active</span>
          </div>

          <div className="savings-card">
            <div className="card-label">SAVINGS</div>
            <div className="savings-amt num">₹89,427</div>
            <div className="savings-stats">
              <span className="ss-item income">
                <i className="fa-solid fa-arrow-up" /> ₹1,00,000
              </span>
              <span className="ss-item expense">
                <i className="fa-solid fa-arrow-down" /> ₹10,573
              </span>
            </div>
            <div className="prog-track">
              <div className="prog-fill" />
            </div>
            <div className="prog-meta">
              <span>Cycle progress</span>
              <span className="income">89% saved</span>
            </div>
          </div>

          <div className="inner-card">
            <div className="card-label">EXPENSE PATTERN</div>
            <div className="bars">
              {BAR_DATA.map((b, i) => (
                <div key={i} className="bar-col">
                  <div
                    className={"bar" + (b.active ? " bar--hi" : "")}
                    style={{ "--h": b.h + "%" }}
                  />
                  <span className="bar-lbl">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="inner-card">
            <div className="card-label">RECENT</div>
            {TRANSACTIONS.map((t, i) => (
              <div key={i} className={"txn" + (i > 0 ? " txn--sep" : "")}>
                <div className="txn-left">
                  <span className="txn-dot" style={{ background: t.color }}>
                    <i className={"fa-solid " + t.icon} />
                  </span>
                  <span className="txn-name">{t.label}</span>
                </div>
                <span className={"txn-amt num " + (t.amount.startsWith("+") ? "income" : "expense")}>
                  {t.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glow-orb" />
      </div>
    </LandingStyled>
  );
};

const LandingStyled = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  background: var(--bg-deep);
  overflow: hidden;

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
  }

  /* ── Left column ── */
  .left {
    padding: var(--s-10) var(--s-8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    z-index: 1;

    @media (max-width: 720px) {
      padding: var(--s-6) var(--s-5);
    }
  }

  /* staggered entrance */
  .a0 { animation: ${fadeUp} 0.48s ease both 0ms; }
  .a1 { animation: ${fadeUp} 0.48s ease both 70ms; }
  .a2 { animation: ${fadeUp} 0.48s ease both 140ms; }
  .a3 { animation: ${fadeUp} 0.48s ease both 210ms; }
  .a4 { animation: ${fadeUp} 0.48s ease both 280ms; }
  .a5 { animation: ${fadeUp} 0.48s ease both 350ms; }

  .brand {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    margin-bottom: var(--s-6);
  }
  .brand-mark {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    background: var(--accent-income);
    color: #0b0d10;
    display: grid;
    place-items: center;
    font-weight: 900;
    font-size: 13px;
    letter-spacing: -0.02em;
    flex-shrink: 0;
  }
  .brand-name {
    font-size: 17px;
    font-weight: 800;
    letter-spacing: -0.01em;
  }
  .brand-tag {
    font-size: 11px;
    color: var(--fg-faint);
    margin-top: -1px;
    font-weight: 500;
  }

  .kicker {
    display: flex;
    align-items: center;
    gap: var(--s-2);
    color: var(--fg-muted);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    margin-bottom: var(--s-4);
  }
  .kicker-pip {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent-income);
    box-shadow: 0 0 8px var(--accent-income);
    flex-shrink: 0;
  }

  h1 {
    font-size: clamp(36px, 5vw, 56px);
    font-weight: 900;
    letter-spacing: -0.03em;
    line-height: 1.02;
    margin: 0 0 var(--s-4);
    color: var(--fg);
  }
  .h1-green {
    color: var(--accent-income);
  }

  p.intro {
    font-size: 15px;
    color: var(--fg-muted);
    line-height: 1.65;
    max-width: 46ch;
    margin: 0 0 var(--s-6);
  }

  .feat-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--s-3);
    margin-bottom: var(--s-6);

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }
  .feat {
    display: flex;
    align-items: flex-start;
    gap: var(--s-3);
    padding: var(--s-3);
    background: var(--bg-surface);
    border: 1px solid var(--line);
    border-radius: var(--r-md);
    transition: border-color 150ms;

    &:hover {
      border-color: var(--line-strong);
    }
  }
  .feat-icon {
    width: 30px;
    height: 30px;
    border-radius: var(--r-sm);
    background: rgba(66, 173, 0, 0.12);
    color: var(--accent-income);
    display: grid;
    place-items: center;
    font-size: 12px;
    flex-shrink: 0;
  }
  .feat-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--fg);
    margin-bottom: 2px;
  }
  .feat-desc {
    font-size: 11px;
    color: var(--fg-faint);
    font-weight: 500;
  }

  .cta-row {
    display: flex;
    gap: var(--s-3);
    flex-wrap: wrap;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--s-2);
    padding: 0 var(--s-4);
    height: 44px;
    border-radius: var(--r-sm);
    font-weight: 700;
    font-size: 14px;
    letter-spacing: -0.005em;
    border: 1px solid transparent;
    cursor: pointer;
    white-space: nowrap;
    text-decoration: none;
    transition: transform 120ms, opacity 120ms;
    &:hover { opacity: 0.9; }
    &:active { transform: translateY(1px); }
  }
  .btn-primary {
    background: var(--fg);
    color: #0b0d10;
  }
  .btn-secondary {
    background: var(--bg-inset);
    color: var(--fg);
    border-color: var(--line-strong);
  }
  .btn-ghost {
    background: transparent;
    color: var(--fg-muted);
    border-color: var(--line);
    &:hover { color: var(--fg); }
  }

  /* ── Right column ── */
  .right {
    display: grid;
    place-items: center;
    padding: var(--s-8);
    border-left: 1px solid var(--line);
    background:
      radial-gradient(60% 60% at 50% 40%, rgba(66, 173, 0, 0.1), transparent 70%),
      var(--bg-app);
    position: relative;
    overflow: hidden;
    animation: ${slideIn} 0.55s ease both 180ms;

    @media (max-width: 880px) {
      border-left: none;
      border-top: 1px solid var(--line);
      padding: var(--s-6);
    }
  }

  .glow-orb {
    position: absolute;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(66, 173, 0, 0.14), transparent 70%);
    bottom: -80px;
    right: -60px;
    pointer-events: none;
  }

  /* ── Phone mockup ── */
  .phone {
    width: 100%;
    max-width: 295px;
    background: var(--bg-surface);
    border: 1px solid var(--line-strong);
    border-radius: 28px;
    padding: 16px 14px;
    box-shadow: var(--shadow-pop);
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
    z-index: 1;
  }

  .phone-status {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10px;
    color: var(--fg-faint);
    font-weight: 700;
    padding: 0 2px;
  }
  .phone-icons {
    display: flex;
    gap: 5px;
    font-size: 9px;
  }

  .phone-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .phone-month {
    font-size: 15px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--fg);
  }
  .phone-cycle-sub {
    font-size: 11px;
    color: var(--fg-faint);
    font-weight: 600;
  }
  .cycle-badge {
    font-size: 10px;
    font-weight: 700;
    color: var(--accent-income);
    background: rgba(66, 173, 0, 0.12);
    border: 1px solid rgba(66, 173, 0, 0.25);
    border-radius: var(--r-pill);
    padding: 3px 8px;
  }

  /* savings card */
  .savings-card {
    background: var(--bg-inset);
    border: 1px solid var(--line);
    border-radius: 16px;
    padding: 12px;
  }
  .card-label {
    font-size: 9px;
    color: var(--fg-faint);
    font-weight: 700;
    letter-spacing: 0.08em;
    margin-bottom: 4px;
  }
  .savings-amt {
    font-size: 28px;
    font-weight: 900;
    letter-spacing: -0.03em;
    color: var(--fg);
    margin-bottom: 6px;
    animation: ${softPulse} 3.5s ease-in-out infinite;
  }
  .savings-stats {
    display: flex;
    gap: var(--s-3);
    margin-bottom: 10px;
  }
  .ss-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 700;
    &.income { color: var(--accent-income); }
    &.expense { color: var(--accent-expense); }
  }
  .prog-track {
    height: 5px;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 3px;
    overflow: hidden;
  }
  .prog-fill {
    height: 100%;
    background: var(--accent-income);
    border-radius: 3px;
    animation: ${fillProg} 1s cubic-bezier(0.4, 0, 0.2, 1) both 700ms;
  }
  .prog-meta {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    font-size: 10px;
    color: var(--fg-faint);
    .income { color: var(--accent-income); }
  }

  /* shared inner card */
  .inner-card {
    background: var(--bg-inset);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 10px 12px;
  }

  /* bar chart */
  .bars {
    display: flex;
    align-items: flex-end;
    gap: 5px;
    height: 50px;
    margin-top: 6px;
  }
  .bar-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    height: 100%;
    justify-content: flex-end;
  }
  .bar {
    width: 100%;
    height: var(--h);
    background: rgba(255, 255, 255, 0.12);
    border-radius: 3px 3px 0 0;
    transform-origin: bottom;
    animation: ${growBar} 0.55s cubic-bezier(0.4, 0, 0.2, 1) both;
    &.bar--hi {
      background: var(--accent-income);
      box-shadow: 0 0 8px rgba(66, 173, 0, 0.3);
    }
  }
  .bar-col:nth-child(1) .bar { animation-delay: 800ms; }
  .bar-col:nth-child(2) .bar { animation-delay: 860ms; }
  .bar-col:nth-child(3) .bar { animation-delay: 920ms; }
  .bar-col:nth-child(4) .bar { animation-delay: 980ms; }
  .bar-col:nth-child(5) .bar { animation-delay: 1040ms; }
  .bar-col:nth-child(6) .bar { animation-delay: 1100ms; }
  .bar-lbl {
    font-size: 9px;
    color: var(--fg-faint);
    font-weight: 600;
  }

  /* transactions */
  .txn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    &.txn--sep { border-top: 1px solid var(--line); }
  }
  .txn-left {
    display: flex;
    align-items: center;
    gap: var(--s-2);
  }
  .txn-dot {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    display: grid;
    place-items: center;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.85);
    flex-shrink: 0;
  }
  .txn-name {
    font-size: 12px;
    font-weight: 600;
    color: var(--fg);
  }
  .txn-amt {
    font-size: 12px;
    font-weight: 700;
    &.income { color: var(--accent-income); }
    &.expense { color: var(--accent-expense); }
  }

  /* global color helpers used inline */
  .income { color: var(--accent-income); }
  .expense { color: var(--accent-expense); }
`;
