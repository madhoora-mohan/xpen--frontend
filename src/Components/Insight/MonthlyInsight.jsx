import React, { useMemo } from "react";
import { formatRupee } from "../../utils/currency";
import { getCategory } from "../../config/categories";
import { useGlobalContext } from "../../context/globalContext";

function MonthlyInsight({ items = [], type = "expense" }) {
  const { activeCycle, totalExpenses } = useGlobalContext();
  const accent = type === "income" ? "var(--accent-income)" : "var(--accent-expense)";
  const topLabel = type === "income" ? "Top source" : "Top cat.";

  const cycleLabel = activeCycle?.label ?? new Date().toLocaleDateString("en-GB", { month: "long" });
  const cycleStartStr = activeCycle?.startDate ?? null;

  const stats = useMemo(() => {
    if (!items.length) return null;

    const cycleStart = cycleStartStr ? new Date(cycleStartStr) : null;

    const total = items.reduce((a, b) => a + Number(b.amount), 0);

    const latestTxnDate = items.reduce((max, t) => {
      const d = new Date(t.date);
      return !isNaN(d) && d > max ? d : max;
    }, new Date(0));
    const now = new Date();
    const refDate = latestTxnDate > now ? latestTxnDate : now;

    const daysElapsed = cycleStart
      ? Math.max(1, Math.floor((refDate - cycleStart) / (1000 * 60 * 60 * 24)) + 1)
      : Math.max(1, now.getDate());
    const avgPerDay = total / daysElapsed;

    const catTally = {};
    items.forEach((e) => {
      catTally[e.category] = (catTally[e.category] || 0) + Number(e.amount);
    });
    const topCatId = Object.entries(catTally).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topCat = topCatId ? getCategory(type, topCatId) : { label: "—" };

    const localDay = (d) => {
      const dt = new Date(d);
      return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
    };
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const dd = new Date(refDate);
      dd.setDate(refDate.getDate() - (6 - i));
      const dayStr = localDay(dd);
      return items
        .filter((e) => localDay(e.date) === dayStr)
        .reduce((a, b) => a + Number(b.amount), 0);
    });
    const maxDay = Math.max(...last7, 1);

    return { total, avgPerDay, topCat, last7, maxDay };
  }, [items, type, cycleStartStr]);

  // Coverage ratio — only relevant for income panel
  const expTotal = totalExpenses();
  const incTotal = stats?.total ?? 0;
  const coveragePct = incTotal > 0 ? (expTotal / incTotal) * 100 : 0;
  const coverageBarPct = Math.min(coveragePct, 100);
  const coverageColor =
    coveragePct < 70
      ? "var(--accent-income)"
      : coveragePct < 90
      ? "var(--accent-warn)"
      : "var(--accent-expense)";
  const remaining = incTotal - expTotal;

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--line)",
        borderRadius: 12,
        padding: 10,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <h3 style={{ margin: 0, fontSize: 12.5, fontWeight: 800, letterSpacing: "-0.01em" }}>
          This cycle
        </h3>
        <span
          style={{
            fontSize: 10,
            padding: "2px 8px",
            borderRadius: 999,
            background: "var(--bg-inset)",
            color: "var(--fg-muted)",
            fontWeight: 700,
            border: "1px solid var(--line)",
          }}
        >
          {cycleLabel}
        </span>
      </div>

      {stats ? (
        <>
          {/* 2-stat row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, flexShrink: 0 }}>
            <StatTile label="Avg / day" value={formatRupee(stats.avgPerDay)} color="var(--fg)" />
            <StatTile label={topLabel} value={stats.topCat.label} color={accent} />
          </div>

          {/* Bottom section — coverage for income, daily bars for expense */}
          <div style={{ paddingTop: 8, borderTop: "1px solid var(--line)" }}>
            <div
              style={{
                fontSize: 9.5,
                color: "var(--fg-muted)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                marginBottom: 6,
              }}
            >
              {type === "income" ? "Expense coverage" : "Daily trend · last 7 days"}
            </div>

            {type === "income" ? (
              <>
                {/* Progress bar */}
                <div
                  style={{
                    height: 8,
                    background: "var(--bg-inset-2)",
                    borderRadius: 999,
                    overflow: "hidden",
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${coverageBarPct}%`,
                      background: coverageColor,
                      borderRadius: 999,
                      transition: "width 400ms ease",
                    }}
                  />
                </div>
                {/* Pct + remaining */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: coverageColor, fontVariantNumeric: "tabular-nums" }}>
                    {coveragePct.toFixed(0)}% spent
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: remaining >= 0 ? "var(--fg-faint)" : "var(--accent-expense)", fontVariantNumeric: "tabular-nums" }}>
                    {remaining >= 0
                      ? `${formatRupee(remaining)} left`
                      : `${formatRupee(Math.abs(remaining))} over`}
                  </span>
                </div>
              </>
            ) : (
              /* Daily bars */
              <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 40 }}>
                {stats.last7.map((amt, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${Math.max(4, (amt / stats.maxDay) * 100)}%`,
                      background: i === 6 ? accent : "var(--bg-inset-2)",
                      borderRadius: 2,
                      minHeight: 4,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div style={{ padding: "12px 0", textAlign: "center", color: "var(--fg-faint)", fontSize: 12 }}>
          No data yet
        </div>
      )}
    </div>
  );
}

const StatTile = ({ label, value, color }) => (
  <div
    style={{
      background: "var(--bg-inset)",
      border: "1px solid var(--line)",
      borderRadius: 7,
      padding: "6px 8px",
    }}
  >
    <div style={{ fontSize: 9, color: "var(--fg-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
      {label}
    </div>
    <div
      style={{
        fontSize: 13,
        fontWeight: 800,
        color,
        marginTop: 1,
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {value}
    </div>
  </div>
);

export default MonthlyInsight;
