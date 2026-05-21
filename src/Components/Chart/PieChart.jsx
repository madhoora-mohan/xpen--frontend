import React, { useRef, useState } from "react";
import styled from "styled-components";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { useGlobalContext } from "../../context/globalContext";
import { EXPENSE } from "../../config/categories";
import { formatRupee } from "../../utils/currency";

Chart.register(ArcElement, Tooltip, Legend);

function PieChart() {
  const { expCat, totalExpenses } = useGlobalContext();
  const chartRef = useRef(null);
  const [hiddenIds, setHiddenIds] = useState({});

  const totals = expCat();
  const active = EXPENSE.map((c, i) => ({ ...c, total: totals[i] })).filter(
    (c) => c.total > 0
  );

  const toggleLegend = (categoryId) => {
    const chart = chartRef.current;
    if (!chart) return;
    const idx = active.findIndex((c) => c.id === categoryId);
    if (idx === -1) return;
    chart.toggleDataVisibility(idx);
    chart.update();
    setHiddenIds((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const config = {
    data: {
      labels: active.map((c) => c.label),
      datasets: [
        {
          data: active.map((c) => c.total),
          backgroundColor: active.map((c) => c.color),
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: "58%",
      layout: { padding: 0 },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) =>
              ` ${ctx.label}: ${formatRupee(ctx.parsed)}`,
          },
        },
      },
    },
  };

  const total = totalExpenses();
  const sortedActive = active.slice().sort((a, b) => b.total - a.total);

  return (
    <PieChartStyled>
      <div className="card-head">
        <div>
          <h3>Expense breakdown</h3>
          <p className="card-sub">By category, this month</p>
        </div>
        <span className="badge">{active.length} categories</span>
      </div>

      {active.length === 0 ? (
        <div className="empty-pie">
          <i className="fa-solid fa-chart-pie" />
          <p>No expenses yet</p>
          <span>Add your first expense to see the breakdown</span>
        </div>
      ) : (
        <div className="pie-wrap">
          <div className="pie-chart">
            <Doughnut ref={chartRef} {...config} />
            <div className="pie-center">
              <div className="label">Total</div>
              <div className="value">{formatRupee(total)}</div>
            </div>
          </div>
          <div className="pie-legend">
            {sortedActive.map((c) => {
              const isHidden = !!hiddenIds[c.id];
              return (
                <div
                  key={c.id}
                  className={"pie-legend-row" + (isHidden ? " is-hidden" : "")}
                  onClick={() => toggleLegend(c.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && toggleLegend(c.id)}
                >
                  <span className="lbl">
                    <span className="swatch" style={{ background: isHidden ? "var(--bg-inset-2)" : c.color }} />
                    <span className="name">{c.label}</span>
                  </span>
                  <span className="ttl">{formatRupee(c.total)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PieChartStyled>
  );
}

const PieChartStyled = styled.div`
  width: 100%;

  .card-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--s-3);
    margin-bottom: var(--s-4);
  }
  .card-head h3 {
    margin: 0;
    font-size: 17px;
    font-weight: 800;
    letter-spacing: -0.01em;
  }
  .card-head .card-sub {
    margin: 4px 0 0;
    font-size: 12px;
    color: var(--fg-muted);
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: var(--r-pill);
    font-size: 11px;
    font-weight: 700;
    background: var(--bg-inset);
    color: var(--fg-muted);
    border: 1px solid var(--line);
    white-space: nowrap;
  }

  .pie-wrap {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--s-4);
  }

  .pie-chart {
    position: relative;
    width: 240px;
    height: 240px;
    flex-shrink: 0;
  }

  .pie-center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    pointer-events: none;
  }
  .pie-center .label {
    font-size: 11px;
    color: var(--fg-muted);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    line-height: 1;
  }
  .pie-center .value {
    font-size: 20px;
    font-weight: 800;
    color: var(--fg);
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  .pie-legend {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 4px 12px;

    @media (max-width: 600px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .pie-legend-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 5px 6px;
    font-size: 13px;
    color: var(--fg-muted);
    min-width: 0;
    border-radius: var(--r-xs);
    cursor: pointer;
    transition: background 100ms, opacity 120ms;
    outline: none;

    &:hover {
      background: var(--bg-inset);
    }

    &.is-hidden {
      opacity: 0.4;

      .name {
        text-decoration: line-through;
      }
      .ttl {
        text-decoration: line-through;
      }
    }

    .lbl {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }
    .swatch {
      width: 10px;
      height: 10px;
      border-radius: 2px;
      flex-shrink: 0;
      transition: background 120ms;
    }
    .name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .ttl {
      color: var(--fg);
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
  }

  .empty-pie {
    text-align: center;
    padding: var(--s-8) var(--s-4);
    color: var(--fg-faint);

    i {
      font-size: 22px;
      display: inline-grid;
      place-items: center;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--bg-inset);
      color: var(--fg-faint);
    }
    p {
      color: var(--fg-muted);
      font-size: 14px;
      font-weight: 700;
      margin: var(--s-2) 0 4px;
    }
    span {
      font-size: 13px;
    }
  }
`;

export default PieChart;
