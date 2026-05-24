import React, { useEffect } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import History from "../../History/History";
import { InnerLayout } from "../../styles/Layouts";
import PieChart from "../Chart/PieChart";
import Spinner from "../Spinner/Spinner";
import { formatRupee } from "../../utils/currency";

function Dashboard({ setActive }) {
  const {
    totalExpenses,
    totalIncome,
    totalBalance,
    getIncomes,
    getExpenses,
    getTransfers,
    outstandingLent,
    netCash,
    incomes,
    expenses,
    loading,
  } = useGlobalContext();

  useEffect(() => {
    getIncomes();
    getExpenses();
    getTransfers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const income = totalIncome();
  const expense = totalExpenses();
  const savings = totalBalance();
  if (loading)
    return (
      <DashboardStyled>
        <InnerLayout>
          <h2 className="page-title">Dashboard</h2>
          <p className="page-sub">Your money at a glance — this month</p>
          <Spinner />
        </InnerLayout>
      </DashboardStyled>
    );

  return (
    <DashboardStyled>
      <InnerLayout>
        <h2 className="page-title">Dashboard</h2>
        <p className="page-sub">Your money at a glance — this month</p>

        <div className="content-grid">
        <div className="stat-grid">
          <div className="stat" data-tone="income">
            <div className="stat-label" style={{ color: "var(--accent-income)" }}>
              <span className="dot" /> Total income
            </div>
            <div className="stat-value">{formatRupee(income)}</div>
            <div className="stat-foot">{incomes.length} entries</div>
          </div>
          <div className="stat" data-tone="expense">
            <div className="stat-label" style={{ color: "var(--accent-expense)" }}>
              <span className="dot" /> Total expense
            </div>
            <div className="stat-value">{formatRupee(expense)}</div>
            <div className="stat-foot">{expenses.length} entries</div>
          </div>
          <div className="stat" data-tone="savings">
            <div className="stat-label">
              <span className="dot" /> Savings
            </div>
            <div className="stat-value">{formatRupee(savings)}</div>
            <div className="stat-foot">Income − Expense</div>
          </div>
          <div className="stat" data-tone="lending">
            <div className="stat-label" style={{ color: "var(--accent-lending)" }}>
              <span className="dot" /> Outstanding lending
            </div>
            <div className="stat-value">{formatRupee(outstandingLent())}</div>
            <div className="stat-foot">Pending returns</div>
          </div>
          <div className="stat" data-tone="balance">
            <div className="stat-label" style={{ color: "var(--accent-balance)" }}>
              <span className="dot" /> Bank balance
            </div>
            <div className="stat-value">{formatRupee(netCash())}</div>
            <div className="stat-foot">Liquid cash</div>
          </div>
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

  .page-title {
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin: 0 0 var(--s-2);
  }
  .page-sub {
    color: var(--fg-muted);
    font-size: 14px;
    margin: 0 0 var(--s-5);
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
    grid-template-columns: repeat(3, 1fr);
    gap: var(--s-3);

    @media (max-width: 720px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .pie-card   { grid-area: pie; }
  .history-card { grid-area: history; }

  .stat {
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
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.02em;
      font-variant-numeric: tabular-nums;
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
