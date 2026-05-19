import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

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
        <div className="brand">
          <div className="brand-mark">X$</div>
          <div>
            <div className="brand-name">Xpenz</div>
            <div className="brand-tag">Track and Analyse</div>
          </div>
        </div>
        <div className="kicker">Personal finance · refreshed</div>
        <h1>
          Money clarity,
          <br />
          in a few taps.
        </h1>
        <p className="intro">
          Log income, expenses, and transfers. See a clear breakdown by category.
          Set a savings floor and get notified before you cross it.
        </p>
        <ul className="features">
          <li>
            <span className="tick">✓</span> Track finances visually with category
            breakdowns
          </li>
          <li>
            <span className="tick">✓</span> Set a savings threshold and get email
            alerts
          </li>
          <li>
            <span className="tick">✓</span> Export everything to CSV when you
            need it
          </li>
        </ul>
        <div className="cta-row">
          <Link to="/signup" className="btn btn-primary">
            Get started — it's free
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Login
          </Link>
          <button type="button" className="btn btn-ghost" onClick={openGithub}>
            <i className="fa-brands fa-github" />
            View on GitHub
          </button>
        </div>
      </div>

      <div className="right">
        <div className="hero-preview">
          <div className="hp-row">
            <span>Xpenz</span>
            <span>This month</span>
          </div>
          <div className="hp-savings">
            <div className="hp-savings-label">SAVINGS</div>
            <div className="hp-amt num">₹ 89,427</div>
            <div className="hp-progress">
              <div className="hp-progress-bar" />
            </div>
          </div>
          <div className="hp-stats">
            <div className="hp-card">
              <div className="hp-label">INCOME</div>
              <div className="hp-card-amt income num">₹1,00,000</div>
            </div>
            <div className="hp-card">
              <div className="hp-label">EXPENSE</div>
              <div className="hp-card-amt expense num">₹10,573</div>
            </div>
          </div>
          <div className="hp-card">
            <div className="hp-label" style={{ marginBottom: 6 }}>
              RECENT
            </div>
            {[
              { t: "Rent", a: "-₹7,500", c: "#E69138", neg: true },
              { t: "Lunch", a: "-₹1,230", c: "#F6B26B", neg: true },
              { t: "May Salary", a: "+₹1,00,000", c: "#38761D", neg: false },
            ].map((r, i) => (
              <div key={i} className={"hp-row-item" + (i > 0 ? " sep" : "")}>
                <span className="hp-row-l">
                  <span
                    className="hp-row-dot"
                    style={{ background: r.c }}
                  />
                  {r.t}
                </span>
                <span className={"num hp-row-a " + (r.neg ? "expense" : "income")}>
                  {r.a}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LandingStyled>
  );
};

const LandingStyled = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  background:
    radial-gradient(50% 50% at 70% 30%, rgba(66, 173, 0, 0.08), transparent 60%),
    var(--bg-deep);

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
  }

  .left {
    padding: var(--s-10) var(--s-8);
    display: flex;
    flex-direction: column;
    justify-content: center;

    @media (max-width: 720px) {
      padding: var(--s-6) var(--s-5);
    }
  }

  .right {
    display: grid;
    place-items: center;
    padding: var(--s-8);
    border-left: 1px solid var(--line);
    background:
      radial-gradient(60% 60% at 50% 40%, rgba(66, 173, 0, 0.12), transparent 70%),
      var(--bg-app);

    @media (max-width: 880px) {
      border-left: 0;
      border-top: 1px solid var(--line);
      padding: var(--s-6);
    }
  }

  .brand {
    display: flex;
    align-items: center;
    gap: var(--s-3);
  }
  .brand-mark {
    width: 32px;
    height: 32px;
    border-radius: 8px;
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
    margin-top: -2px;
    font-weight: 500;
  }

  .kicker {
    margin-top: var(--s-6);
    color: var(--fg-muted);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1 {
    font-size: clamp(36px, 5vw, 56px);
    font-weight: 900;
    letter-spacing: -0.03em;
    line-height: 1.02;
    margin: var(--s-4) 0 var(--s-3);
    color: var(--fg);
  }

  p.intro {
    font-size: 16px;
    color: var(--fg-muted);
    line-height: 1.6;
    max-width: 46ch;
    margin: 0 0 var(--s-5);
  }

  ul.features {
    display: grid;
    gap: var(--s-2);
    margin: 0 0 var(--s-6);
  }
  ul.features li {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    font-size: 14px;
    color: var(--fg);
    font-weight: 500;
  }
  ul.features li .tick {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    display: grid;
    place-items: center;
    background: rgba(66, 173, 0, 0.15);
    color: var(--accent-income);
    flex-shrink: 0;
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
    transition: transform 120ms, opacity 120ms, background 120ms;
  }
  .btn:hover {
    opacity: 0.92;
  }
  .btn:active {
    transform: translateY(1px);
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
  }
  .btn-ghost:hover {
    color: var(--fg);
  }

  .hero-preview {
    width: 100%;
    max-width: 380px;
    aspect-ratio: 0.62;
    background: var(--bg-surface);
    border: 1px solid var(--line);
    border-radius: 28px;
    padding: 14px;
    box-shadow: var(--shadow-pop);
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden;
  }

  .hp-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    color: var(--fg-muted);
  }

  .hp-savings {
    background: var(--bg-inset);
    border-radius: 14px;
    padding: 14px;
    border: 1px solid var(--line);
  }
  .hp-savings-label {
    font-size: 11px;
    color: var(--fg-muted);
    font-weight: 600;
  }
  .hp-amt {
    font-size: 30px;
    font-weight: 900;
    letter-spacing: -0.02em;
    color: var(--fg);
  }
  .hp-progress {
    height: 6px;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 3px;
    margin-top: 10px;
    position: relative;
    overflow: hidden;
  }
  .hp-progress-bar {
    position: absolute;
    inset: 0;
    width: 72%;
    background: var(--accent-income);
    border-radius: 3px;
  }

  .hp-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .hp-card {
    background: var(--bg-inset);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 10px 12px;
  }
  .hp-label {
    font-size: 10px;
    color: var(--fg-muted);
    font-weight: 600;
  }
  .hp-card-amt {
    font-size: 16px;
    font-weight: 800;
  }
  .hp-card-amt.income {
    color: var(--accent-income);
  }
  .hp-card-amt.expense {
    color: var(--accent-expense);
  }

  .hp-row-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;

    &.sep {
      border-top: 1px solid var(--line);
    }
  }
  .hp-row-l {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--fg);
  }
  .hp-row-dot {
    width: 8px;
    height: 8px;
    border-radius: 2px;
  }
  .hp-row-a {
    font-size: 12px;
    font-weight: 700;
  }
  .hp-row-a.income {
    color: var(--accent-income);
  }
  .hp-row-a.expense {
    color: var(--accent-expense);
  }
`;
