import React from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import History from "../../History/History";
import { InnerLayout } from "../../styles/Layouts";
import PieChart from "../Chart/PieChart";
import Spinner from "../Spinner/Spinner";
import DashboardCycleWidgets from "./DashboardCycleWidgets";
import { formatRupee } from "../../utils/currency";

function Dashboard({ setActive }) {
  const {
    totalExpenses,
    totalSavings,
    outstandingLent,
    netCash,
    expenses,
    loading,
  } = useGlobalContext();

  const expense = totalExpenses();
  const savings = totalSavings();
  if (loading)
    return (
      <DashboardStyled>
        <InnerLayout>
          <div className="page-head">
            <h2 className="page-title">Dashboard</h2>
            <p className="page-sub">Your money at a glance — this month</p>
          </div>
          <Spinner />
        </InnerLayout>
      </DashboardStyled>
    );

  return (
    <DashboardStyled>
      <InnerLayout>
        <div className="page-head">
          <h2 className="page-title">Dashboard</h2>
          <p className="page-sub">Your money at a glance — this month</p>
        </div>

        <div className="content-grid">
        <div className="stat-grid">
          <div className="stat" data-tone="expense">
            <div className="stat-label" style={{ color: "var(--accent-expense)" }}>
              <span className="dot" /> Total expense
            </div>
            <div className="stat-value">{formatRupee(expense)}</div>
            <div className="stat-foot">{expenses.length} entries</div>
          </div>
          <div className="stat" data-tone="balance">
            <div className="stat-label" style={{ color: "var(--accent-balance)" }}>
              <span className="dot" /> Bank balance
            </div>
            <div className="stat-value">{formatRupee(netCash())}</div>
            <div className="stat-foot">Liquid cash</div>
          </div>
          <div className="stat" data-tone="lending">
            <div className="stat-label" style={{ color: "var(--accent-lending)" }}>
              <span className="dot" /> Outstanding lending
            </div>
            <div className="stat-value">{formatRupee(outstandingLent())}</div>
            <div className="stat-foot">Pending returns</div>
          </div>
          <div className="stat" data-tone="savings">
            <div className="stat-label">
              <span className="dot" /> Savings
            </div>
            <div className="stat-value">{formatRupee(savings)}</div>
            <div className="stat-foot">Net + invested</div>
          </div>
          <DashboardCycleWidgets />
        </div>

          <div className="card pie-card">
            <PieChart />
          </div>

          <div className="card history-card">
            <div className="card-head">
              <h3>Recent history</h3>
              {setActive && (
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => setActive(3)}
                >
                  View all
                </button>
              )}
            </div>
            <History />
          </div>

        </div>
      </InnerLayout>
    </DashboardStyled>
  );
}

const DashboardStyled = styled.div`
  width: 100%;

  .page-head {
    margin-bottom: var(--s-5);

    @media (max-width: 899px) {
      display: none;
    }
  }
  .page-title {
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin: 0 0 var(--s-2);
  }
  .page-sub {
    color: var(--fg-muted);
    font-size: 14px;
    margin: 0;
  }

  @media (min-width: 900px) {
    .page-head {
      position: sticky;
      top: 0;
      z-index: 10;
      background: var(--bg-deep);
      margin: calc(-1 * var(--s-6)) calc(-1 * var(--s-6)) var(--s-5);
      padding: var(--s-5) var(--s-6) var(--s-4);
      border-bottom: 1px solid var(--line);
    }
  }

  .content-grid {
    display: grid;
    grid-template-areas:
      "stats   stats"
      "pie     history";
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    gap: var(--s-5);

    @media (max-width: 899px) {
      grid-template-areas:
        "pie"
        "stats"
        "history";
      grid-template-columns: 1fr;
    }
  }

  .stat-grid {
    grid-area: stats;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--s-3);

    @media (max-width: 720px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .cycle-row {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: 1fr 1fr;
    gap: var(--s-3);

    @media (max-width: 720px) {
      grid-template-columns: 1fr;
    }
  }

  .pie-card   { grid-area: pie; }
  .history-card { grid-area: history; }

  .stat {
    min-width: 0;
    background: var(--bg-surface);
    border: 1px solid var(--line);
    border-radius: var(--r-md);
    padding: var(--s-4);
    display: flex;
    flex-direction: column;
    gap: 6px;

    .stat-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      color: var(--fg-muted);
    }
    .dot {
      width: 6px;
      height: 6px;
      border-radius: 3px;
      background: currentColor;
      opacity: 0.7;
    }
    .stat-value {
      font-size: clamp(15px, 4vw, 22px);
      font-weight: 800;
      letter-spacing: -0.02em;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
      overflow: hidden;
      color: var(--fg);
    }
    .stat-foot {
      font-size: 11px;
      color: var(--fg-faint);
      font-weight: 600;
    }

    &[data-tone="income"] .stat-value {
      color: var(--accent-income);
    }
    &[data-tone="expense"] .stat-value {
      color: var(--accent-expense);
    }
    &[data-tone="balance"] .stat-value {
      color: var(--accent-balance);
    }
    &[data-tone="lending"] .stat-value {
      color: var(--accent-lending);
    }
    &[data-tone="savings"] .stat-value {
      color: var(--fg);
    }
  }

  .burn-widget {
    .burn-progress {
      height: 5px;
      border-radius: var(--r-pill);
      background: var(--bg-inset-2);
      overflow: hidden;
      margin: 2px 0;

      .burn-bar {
        height: 100%;
        border-radius: var(--r-pill);
        background: var(--accent-income);
        transition: width 400ms ease;
      }
    }
    .burn-projected {
      color: var(--accent-income);
      font-weight: 700;
    }
  }

  .cycle-widget {
    .cw-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px;
      min-width: 0;

      .stat-label {
        justify-content: flex-start;
        flex: 1;
        min-width: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .cw-select {
      flex-shrink: 0;
      background: var(--bg-inset);
      color: var(--fg);
      border: 1px solid var(--line);
      border-radius: var(--r-sm);
      font-family: inherit;
      font-size: 11px;
      font-weight: 600;
      padding: 2px 4px;
      max-width: 90px;
      cursor: pointer;
    }
    .spark-wrap {
      position: relative;
      height: 120px;
      margin: 4px 0 2px;
      overflow: hidden;
      min-width: 0;

      @media (min-width: 721px) {
        height: 80px;
      }
    }
    .cw-empty {
      font-size: 11px;
      color: var(--fg-faint);
    }
  }

  .card {
    background: var(--bg-surface);
    border: 1px solid var(--line);
    border-radius: var(--r-lg);
    padding: var(--s-5);
  }

  .card-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--s-3);
    margin-bottom: var(--s-4);

    h3 {
      margin: 0;
      font-size: 17px;
      font-weight: 800;
      letter-spacing: -0.01em;
    }
    .card-sub {
      margin: 4px 0 0;
      font-size: 12px;
      color: var(--fg-muted);
    }
  }

  .link-btn {
    background: transparent;
    border: 1px solid var(--line);
    color: var(--fg-muted);
    font-family: inherit;
    font-weight: 700;
    font-size: 13px;
    padding: 0 12px;
    height: 32px;
    border-radius: var(--r-sm);
    cursor: pointer;
    white-space: nowrap;

    &:hover {
      color: var(--fg);
    }
  }


  @media (max-width: 720px) {
    .page-title {
      font-size: 22px;
    }
  }
`;

export default Dashboard;
