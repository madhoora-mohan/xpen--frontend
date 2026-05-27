import React, { useState, useEffect, useMemo } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useGlobalContext } from "../../context/globalContext";
import { formatRupee } from "../../utils/currency";
import { getCategory } from "../../config/categories";
import { collectCategories, categoryValue } from "../ExpensePattern/compareUtils";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

// Off-white for the "All" view; categories use their own color.
const ALL_COLOR = "#E6E6E6";
// Oldest→newest opacity, sliced so the most recent cycle is always full strength.
const ALPHAS = [0.3, 0.55, 1];

function withAlpha(hex, alpha) {
  const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${a}`;
}

// Cumulative spend (optionally filtered to one category) plotted against % of
// the cycle elapsed (0–100), so cycles of different lengths overlay honestly.
// Active cycles have no end date — fall back to last activity as the effective
// end so the curve spans 0–100% of its life so far.
function cumulativePoints(expenses, start, end, cat) {
  const startMs = new Date(start).getTime();
  const sorted = [...(expenses || [])]
    .filter((e) => e.amount && (cat === "all" || e.category === cat))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const lastTxnMs = sorted.length
    ? new Date(sorted[sorted.length - 1].date).getTime()
    : startMs;
  const endMs = end ? new Date(end).getTime() : Math.max(lastTxnMs, startMs + 86400000);
  const span = Math.max(1, endMs - startMs);
  let cum = 0;
  const pts = [{ x: 0, y: 0 }];
  sorted.forEach((e) => {
    cum += e.amount;
    const pct = Math.min(100, Math.max(0, ((new Date(e.date).getTime() - startMs) / span) * 100));
    pts.push({ x: pct, y: cum });
  });
  return pts;
}

// Total spend within the first `days` days from `start` (day 0 = start day).
// Day-based so it needs no end date — used to compare cycles at the same age.
function spendInFirstDays(expenses, start, days) {
  const startMs = new Date(start).getTime();
  let sum = 0;
  (expenses || []).forEach((e) => {
    if (!e.amount) return;
    const dayIdx = Math.floor((new Date(e.date).getTime() - startMs) / 86400000);
    if (dayIdx >= 0 && dayIdx < days) sum += e.amount;
  });
  return sum;
}

const wormOptions = {
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        title: (items) => items[0]?.dataset?.label || "",
        label: (ctx) => ` ${formatRupee(ctx.parsed.y)} by ${Math.round(ctx.parsed.x)}%`,
      },
    },
  },
  scales: {
    x: { type: "linear", min: 0, max: 100, display: false },
    y: { display: false, beginAtZero: true },
  },
  elements: { point: { radius: 0 } },
};

function DashboardCycleWidgets() {
  const { cycles, activeCycle, compareCycles, expenses, incomes, transfers, getCycleTransactions } =
    useGlobalContext();
  const [summaries, setSummaries] = useState([]);
  const [cat, setCat] = useState("all");
  const [txnCache, setTxnCache] = useState({});

  // Last 3 cycles (incl. active), oldest→newest.
  const chronological = useMemo(() => {
    const recent = cycles.slice(0, 3);
    return [...recent].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  }, [cycles]);

  const idsKey = chronological.map((c) => c._id).join(",");

  useEffect(() => {
    let cancelled = false;
    const ids = idsKey ? idsKey.split(",") : [];
    if (!ids.length) {
      setSummaries([]);
      return;
    }
    compareCycles(ids).then((data) => {
      if (cancelled) return;
      const byId = Object.fromEntries(data.map((s) => [String(s.cycleId), s]));
      setSummaries(ids.map((id) => byId[id]).filter(Boolean));
    });
    return () => {
      cancelled = true;
    };
  }, [idsKey, compareCycles]);

  // Per-cycle transactions back the worm curves. Closed cycles are immutable, so
  // cache by id for the session.
  useEffect(() => {
    chronological.forEach((cyc) => {
      if (txnCache[cyc._id]) return;
      getCycleTransactions(cyc._id).then((data) =>
        setTxnCache((prev) => (prev[cyc._id] ? prev : { ...prev, [cyc._id]: data }))
      );
    });
  }, [chronological, getCycleTransactions, txnCache]);

  // Only categories that appear in more than one of the cycles — a cross-cycle
  // trend isn't meaningful for a category that exists in just a single cycle.
  const expenseCats = useMemo(
    () =>
      collectCategories(summaries, "expense").filter(
        (c) => summaries.filter((s) => categoryValue(s, "expense", c.id) > 0).length > 1
      ),
    [summaries]
  );

  const baseColor = cat === "all" ? ALL_COLOR : getCategory("expense", cat).color;

  // Cumulative spend curves for the recent cycles, normalized by cycle %.
  const wormSeries = useMemo(() => {
    return chronological
      .map((cyc) => {
        const txns = txnCache[cyc._id];
        if (!txns) return null;
        const summ = summaries.find((s) => String(s.cycleId) === String(cyc._id));
        return {
          id: cyc._id,
          label: summ?.label || cyc.label || "Cycle",
          points: cumulativePoints(txns.expenses, cyc.startDate, cyc.endDate, cat),
        };
      })
      .filter(Boolean);
  }, [chronological, txnCache, summaries, cat]);

  const wormData = {
    datasets: wormSeries.map((c, i) => {
      const alphas = ALPHAS.slice(ALPHAS.length - wormSeries.length);
      return {
        label: c.label,
        data: c.points,
        borderColor: withAlpha(baseColor, alphas[i] ?? 1),
        borderWidth: i === wormSeries.length - 1 ? 2.5 : 1.5,
        tension: 0.3,
        fill: false,
      };
    }),
  };

  // Daily burn rate for the active cycle.
  const latestSummary = summaries[summaries.length - 1];
  const cycleStart = activeCycle?.startDate ? new Date(activeCycle.startDate) : null;
  const cycleEnd = activeCycle?.endDate ? new Date(activeCycle.endDate) : null;

  const latestTxnDate = useMemo(() => {
    const dates = [...expenses, ...incomes, ...transfers]
      .map((t) => new Date(t.date))
      .filter((d) => !isNaN(d));
    return dates.length ? new Date(Math.max(...dates)) : null;
  }, [expenses, incomes, transfers]);

  const now = new Date();
  const refDate = latestTxnDate && latestTxnDate > now ? latestTxnDate : now;
  const daysElapsed = cycleStart
    ? Math.max(1, Math.floor((refDate - cycleStart) / (1000 * 60 * 60 * 24)) + 1)
    : 0;
  const cycleTotal = latestSummary?.totalExpenses || 0;
  const dailyRate = daysElapsed > 0 ? cycleTotal / daysElapsed : 0;
  const totalDays =
    cycleEnd && cycleStart
      ? Math.floor((cycleEnd - cycleStart) / (1000 * 60 * 60 * 24)) + 1
      : null;
  const projected = totalDays ? dailyRate * totalDays : null;

  // Pace vs the previous cycle at the same age (same elapsed-day count). Needs
  // only startDate + the prev cycle's dated txns (already cached for the worm),
  // so it's always computable — no reliance on an end date.
  const prevCycle =
    chronological.length > 1 ? chronological[chronological.length - 2] : null;
  const prevTxns = prevCycle ? txnCache[prevCycle._id] : null;
  // Compare daily *rates*, which already normalize for differing cycle lengths.
  // One caveat: if the previous cycle was shorter than the days elapsed so far,
  // divide only by the days it actually ran — otherwise the missing days would
  // dilute its rate and overstate the current cycle's pace.
  const prevLen =
    prevCycle?.endDate && prevCycle?.startDate
      ? Math.floor((new Date(prevCycle.endDate) - new Date(prevCycle.startDate)) / 86400000) + 1
      : daysElapsed;
  const prevDenom = Math.max(1, Math.min(daysElapsed, prevLen));
  const prevRate =
    prevTxns && daysElapsed > 0
      ? spendInFirstDays(prevTxns.expenses, prevCycle.startDate, daysElapsed) / prevDenom
      : null;
  const paceLoading = prevCycle && !prevTxns; // prev-cycle txns still fetching
  const paceDelta =
    prevRate && prevRate > 0 ? Math.round(((dailyRate - prevRate) / prevRate) * 100) : null;
  // Bar: previous cycle's same-age rate is the 100% reference; fill caps there.
  const pacePct =
    prevRate && prevRate > 0 ? Math.min(100, Math.round((dailyRate / prevRate) * 100)) : null;
  const paceOver = paceDelta != null && paceDelta > 0;

  return (
    <div className="cycle-row">
      {/* Spend trend — cumulative spend curves, last 3 cycles, by category */}
      <div className="stat cycle-widget spend-widget" data-tone="expense">
        <div className="cw-header">
          <div className="stat-label" style={{ color: baseColor }}>
            <span className="dot" /> Spend trend
          </div>
          <select className="cw-select" value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="all">All</option>
            {expenseCats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="spark-wrap">
          {wormSeries.length > 0 ? (
            <Line data={wormData} options={wormOptions} />
          ) : (
            <span className="cw-empty">Loading…</span>
          )}
        </div>
        <div className="stat-foot">
          cumulative spend · last {wormSeries.length || summaries.length || 0} cycles
        </div>
      </div>

      {/* Daily burn rate */}
      <div className="stat cycle-widget burn-widget">
        <div className="stat-label">
          <span className="dot" /> Daily burn rate
        </div>
        {activeCycle && daysElapsed > 0 ? (
          <>
            <div
              className="stat-value"
              style={{ display: "flex", alignItems: "baseline", gap: 3 }}
            >
              {formatRupee(dailyRate)}
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg-faint)" }}>
                /day
              </span>
            </div>
            {pacePct !== null && (
              <div className="burn-progress">
                <div
                  className="burn-bar"
                  style={{
                    width: `${pacePct}%`,
                    background: paceOver ? "var(--accent-expense)" : "var(--accent-income)",
                  }}
                />
              </div>
            )}
            <div className="stat-foot">
              {paceLoading ? (
                "comparing…"
              ) : paceDelta === null ? (
                prevCycle ? "no prior spend to compare" : "first cycle"
              ) : (
                <span
                  style={{
                    color: paceOver ? "var(--accent-expense)" : "var(--accent-income)",
                    fontWeight: 700,
                  }}
                >
                  {paceDelta > 0 ? "▲" : paceDelta < 0 ? "▼" : "■"} {Math.abs(paceDelta)}% vs{" "}
                  {formatRupee(prevRate)}/day last cycle
                </span>
              )}
            </div>
            <div className="stat-foot">
              {formatRupee(cycleTotal)} over {daysElapsed} day{daysElapsed === 1 ? "" : "s"}
            </div>
            {projected !== null && (
              <div className="stat-foot burn-projected">on track for {formatRupee(projected)}</div>
            )}
          </>
        ) : (
          <>
            <div className="stat-value">—</div>
            <div className="stat-foot">No active cycle</div>
          </>
        )}
      </div>
    </div>
  );
}

export default DashboardCycleWidgets;
