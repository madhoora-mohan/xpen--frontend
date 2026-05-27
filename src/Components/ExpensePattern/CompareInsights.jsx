import React from "react";
import styled from "styled-components";
import { formatRupee } from "../../utils/currency";
import { getCategory } from "../../config/categories";
import { categoryValue, sumByCategory } from "./compareUtils";
import { arrowUp, arrowDown } from "../../utils/Icons";

function CompareInsights({ summaries, hidden = new Set() }) {
  const n = summaries.length;
  const first = summaries[0];
  const last = summaries[n - 1];

  const visible = (id) => !hidden.has(id);

  // Filtered total for a summary (sum only visible categories)
  const filteredTotal = (s) =>
    Object.entries(s?.expenseByCategory || {})
      .filter(([id]) => visible(id))
      .reduce((a, [, v]) => a + Number(v), 0);

  // ── Biggest movers: first cycle → last cycle in range ──────────────────────
  let movers = [];
  if (n >= 2 && first && last) {
    const ids = new Set([
      ...Object.keys(first.expenseByCategory || {}),
      ...Object.keys(last.expenseByCategory || {}),
    ]);
    movers = Array.from(ids)
      .filter(visible)
      .map((id) => ({
        id,
        d: categoryValue(last, "expense", id) - categoryValue(first, "expense", id),
      }))
      .filter((m) => m.d !== 0)
      .sort((a, b) => Math.abs(b.d) - Math.abs(a.d))
      .slice(0, 3);
  }

  // ── Spend trend: first → last ───────────────────────────────────────────────
  const firstExp = filteredTotal(first);
  const lastExp = filteredTotal(last);
  const trendDelta = lastExp - firstExp;
  const trendPct = n >= 2 && firstExp ? (trendDelta / firstExp) * 100 : null;
  const trendUp = trendDelta > 0;

  // ── Biggest category: cumulative across range ───────────────────────────────
  const catTotals = sumByCategory(summaries, "expense");
  const biggestCatEntry =
    Object.entries(catTotals)
      .filter(([id]) => visible(id))
      .sort((a, b) => b[1] - a[1])[0] || null;
  const biggestCat = biggestCatEntry
    ? { ...getCategory("expense", biggestCatEntry[0]), total: biggestCatEntry[1] }
    : null;

  // ── Most volatile: highest std dev across cycles ────────────────────────────
  const allCatIds = Object.keys(catTotals).filter(visible);
  const volatilityRanked = allCatIds
    .map((id) => {
      const vals = summaries.map((s) => categoryValue(s, "expense", id));
      const nonZero = vals.filter((v) => v > 0);
      if (nonZero.length < 2) return null;
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      const stdDev = Math.sqrt(
        vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length
      );
      return { id, stdDev, min: Math.min(...nonZero), max: Math.max(...nonZero) };
    })
    .filter(Boolean)
    .sort((a, b) => b.stdDev - a.stdDev);
  const volatile = volatilityRanked[0] || null;
  const volatileCat = volatile ? getCategory("expense", volatile.id) : null;

  return (
    <InsightsStyled>
      {/* 1 — Biggest movers */}
      <div className="ins-card">
        <div className="ins-label">Biggest movers</div>
        {n >= 2 && movers.length > 0 ? (
          <>
            <ul className="mover-list">
              {movers.map(({ id, d }) => {
                const cat = getCategory("expense", id);
                const up = d > 0;
                return (
                  <li key={id}>
                    <span className={`arrow ${up ? "bad" : "good"}`}>
                      {up ? arrowUp : arrowDown}
                    </span>
                    <span className="m-cat">{cat.label}</span>
                    <span className={`m-amt ${up ? "bad" : "good"}`}>
                      {up ? "+" : "−"}{formatRupee(Math.abs(d))}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="ins-foot">{first?.label} → {last?.label}</div>
          </>
        ) : (
          <div className="ins-foot muted">Add another cycle to compare</div>
        )}
      </div>

      {/* 2 — Spend trend */}
      <div className="ins-card">
        <div className="ins-label">Spend trend</div>
        {n >= 2 && trendPct !== null ? (
          <>
            <div className={`ins-value ${trendUp ? "bad" : "good"}`}>
              <span className="arrow">{trendUp ? arrowUp : arrowDown}</span>
              {`${Math.abs(trendPct).toFixed(0)}%`}
            </div>
            <div className="ins-foot">
              {formatRupee(firstExp)} → {formatRupee(lastExp)}
            </div>
            <div className="ins-foot">{first?.label} → {last?.label}</div>
          </>
        ) : (
          <div className="ins-foot muted">Add more cycles to see a trend</div>
        )}
      </div>

      {/* 3 — Biggest category */}
      <div className="ins-card">
        <div className="ins-label">Biggest category</div>
        {biggestCat ? (
          <>
            <div className="ins-value">{formatRupee(biggestCat.total)}</div>
            <div className="cat-pill" style={{ borderColor: `${biggestCat.color}55` }}>
              <span className="cat-swatch" style={{ background: biggestCat.color }} />
              {biggestCat.label}
            </div>
            <div className="ins-foot">
              across {n} cycle{n === 1 ? "" : "s"}
            </div>
          </>
        ) : (
          <div className="ins-foot muted">No expenses yet</div>
        )}
      </div>

      {/* 4 — Most volatile */}
      <div className="ins-card">
        <div className="ins-label">Most volatile</div>
        {volatile && volatileCat ? (
          <>
            <div className="vol-range">
              <span className="vol-min">{formatRupee(volatile.min)}</span>
              <span className="vol-sep">→</span>
              <span className="vol-max">{formatRupee(volatile.max)}</span>
            </div>
            <div className="cat-pill" style={{ borderColor: `${volatileCat.color}55` }}>
              <span className="cat-swatch" style={{ background: volatileCat.color }} />
              {volatileCat.label}
            </div>
            <div className="ins-foot">highest spend swings</div>
          </>
        ) : (
          <div className="ins-foot muted">Need more cycles to detect variance</div>
        )}
      </div>
    </InsightsStyled>
  );
}

const InsightsStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--s-3);

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }

  .ins-card {
    background: var(--bg-surface);
    border: 1px solid var(--line);
    border-radius: var(--r-md);
    padding: var(--s-4);
    min-height: 104px;
    display: flex;
    flex-direction: column;
  }
  .ins-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--fg-muted);
    margin-bottom: 8px;
  }
  .ins-value {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }
  .ins-value.bad  { color: var(--accent-expense); }
  .ins-value.good { color: var(--accent-income); }

  .arrow {
    display: inline-flex;
    font-size: 0.7em;
  }
  .arrow.bad  { color: var(--accent-expense); }
  .arrow.good { color: var(--accent-income); }

  .ins-foot {
    font-size: 11px;
    color: var(--fg-faint);
    font-weight: 600;
    margin-top: auto;
    padding-top: 4px;
  }
  .ins-foot.muted {
    margin-top: 8px;
  }

  /* ── Mover list ── */
  .mover-list {
    list-style: none;
    margin: 0 0 4px;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex: 1;
  }
  .mover-list li {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: var(--fg);
  }
  .m-cat {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .m-amt {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .m-amt.bad  { color: var(--accent-expense); }
  .m-amt.good { color: var(--accent-income); }

  /* ── Category pill ── */
  .cat-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-top: 6px;
    font-size: 11px;
    font-weight: 700;
    color: var(--fg-muted);
    background: var(--bg-inset);
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 2px 8px 2px 5px;
    width: fit-content;
  }
  .cat-swatch {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    flex-shrink: 0;
  }

  /* ── Volatility range ── */
  .vol-range {
    display: flex;
    align-items: baseline;
    gap: 4px;
    font-variant-numeric: tabular-nums;
    flex-wrap: wrap;
  }
  .vol-min {
    font-size: 13px;
    font-weight: 700;
    color: var(--accent-income);
  }
  .vol-sep {
    font-size: 11px;
    color: var(--fg-faint);
  }
  .vol-max {
    font-size: 13px;
    font-weight: 700;
    color: var(--accent-expense);
  }
`;

export default CompareInsights;
