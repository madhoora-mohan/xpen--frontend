import React from "react";
import styled from "styled-components";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { MONTH_PALETTE, categoryValue } from "./compareUtils";
import { formatRupee } from "../../utils/currency";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const commonOptions = {
  maintainAspectRatio: false,
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: {
      position: "bottom",
      labels: { boxWidth: 10, font: { size: 10 }, color: "#9aa0a6" },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.dataset.label}: ${formatRupee(ctx.parsed.y)}`,
      },
    },
  },
  scales: {
    x: { ticks: { font: { size: 10 }, color: "#9aa0a6" }, grid: { display: false } },
    y: {
      ticks: { font: { size: 10 }, color: "#9aa0a6" },
      grid: { color: "rgba(255,255,255,0.06)" },
    },
  },
};

const PRESETS = [3, 6, 9, 12, 18, 24, 36];

function generateOptions(totalCycles) {
  const ceilingIdx = PRESETS.findIndex((p) => p >= totalCycles);
  const idx = ceilingIdx === -1 ? PRESETS.length - 1 : ceilingIdx;
  return PRESETS.slice(0, idx + 1);
}

function CompareCharts({ summaries, type, visibleCategories, n, setN, totalCycles }) {
  const rangeOptions = generateOptions(totalCycles);

  const cycleLabels = summaries.map((s) => s.label);

  const lineData = {
    labels: cycleLabels,
    datasets: visibleCategories.map((cat) => ({
      label: cat.label,
      data: summaries.map((s) => categoryValue(s, type, cat.id)),
      borderColor: cat.color,
      backgroundColor: cat.color,
      tension: 0.3,
      pointRadius: 2,
      borderWidth: 2,
    })),
  };

  // Bar chart: always the 3 most recent cycles, categories present in all 3
  const barSummaries = summaries.slice(-3);
  const barCategories = visibleCategories.filter((cat) => {
    const nonZeroCount = barSummaries.filter(
      (s) => categoryValue(s, type, cat.id) > 0
    ).length;
    return nonZeroCount === barSummaries.length;
  });

  const barData = {
    labels: barCategories.map((c) => c.label),
    datasets: barSummaries.map((s, i) => ({
      label: s.label,
      data: barCategories.map((cat) => categoryValue(s, type, cat.id)),
      backgroundColor: MONTH_PALETTE[i % MONTH_PALETTE.length],
      borderRadius: 3,
    })),
  };

  const hasLineData = visibleCategories.length > 0 && summaries.length > 0;
  const hasBarData = barCategories.length > 0 && barSummaries.length > 0;

  return (
    <ChartsStyled>
      <div className="chart-card">
        <div className="card-head">
          <h4>Trend over cycles</h4>
          <div className="range-right">
            <span className="avail-note">{totalCycles} available</span>
            <select
              className="range-select"
              value={n}
              onChange={(e) => setN(Number(e.target.value))}
            >
              {rangeOptions.map((o) => (
                <option key={o} value={o}>{o} cycles</option>
              ))}
            </select>
          </div>
        </div>
        <div className="chart-wrap">
          {hasLineData ? (
            <Line data={lineData} options={commonOptions} />
          ) : (
            <p className="empty">Nothing to plot</p>
          )}
        </div>
      </div>
      <div className="chart-card">
        <h4>By category, upto 3 cycles</h4>
        <div className="chart-wrap">
          {hasBarData ? (
            <Bar data={barData} options={commonOptions} />
          ) : (
            <p className="empty">Nothing to plot</p>
          )}
        </div>
      </div>
    </ChartsStyled>
  );
}

const ChartsStyled = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--s-4);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }

  .chart-card {
    background: var(--bg-surface);
    border: 1px solid var(--line);
    border-radius: var(--r-lg);
    padding: var(--s-5);

    h4 {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      color: var(--fg);
    }
  }

  .card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--s-3);
    margin-bottom: var(--s-4);
  }

  .range-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .avail-note {
    font-size: 10px;
    font-weight: 600;
    color: var(--fg-faint);
    white-space: nowrap;
  }

  .range-select {
    background: var(--bg-inset);
    color: var(--fg);
    border: 1px solid var(--line-strong);
    border-radius: var(--r-sm);
    padding: 4px 8px;
    font-family: inherit;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    height: 26px;
    flex-shrink: 0;
  }
  .chart-wrap {
    position: relative;
    height: 18rem;
  }
  .empty {
    color: var(--fg-faint);
    text-align: center;
    margin-top: 6rem;
  }
`;

export default CompareCharts;
