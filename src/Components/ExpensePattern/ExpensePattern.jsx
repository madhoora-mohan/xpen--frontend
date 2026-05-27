import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { InnerLayout } from "../../styles/Layouts";
import { useGlobalContext } from "../../context/globalContext";
import Spinner from "../Spinner/Spinner";
import StartNextCycle from "../Cycles/StartNextCycle";
import CompareCharts from "./CompareCharts";
import CompareInsights from "./CompareInsights";
import CycleTransactions from "./CycleTransactions";
import { collectCategories } from "./compareUtils";

const TYPE = "expense";

function ExpensePattern() {
  const { cycles, activeCycle, compareCycles, deleteCycle, bootstrap, refreshKey } = useGlobalContext();
  const [n, setN] = useState(3);
  const [hidden, setHidden] = useState(new Set());
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showStart, setShowStart] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // The N most recent cycles (incl. active), oldest→newest for the x-axis.
  const chronological = useMemo(() => {
    const recent = cycles.slice(0, n);
    return [...recent].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  }, [cycles, n]);

  const idsKey = chronological.map((c) => c._id).join(",");

  useEffect(() => {
    let cancelled = false;
    const ids = idsKey ? idsKey.split(",") : [];
    if (!ids.length) {
      setSummaries([]);
      return;
    }
    setLoading(true);
    compareCycles(ids)
      .then((data) => {
        if (cancelled) return;
        const byId = Object.fromEntries(data.map((s) => [String(s.cycleId), s]));
        // Re-order to match chronological selection (compare order isn't guaranteed).
        const ordered = ids.map((id) => byId[id]).filter(Boolean);
        setSummaries(ordered);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [idsKey, compareCycles, refreshKey]);

  const allCategories = useMemo(
    () => collectCategories(summaries, TYPE),
    [summaries]
  );
  const visibleCategories = allCategories.filter((c) => !hidden.has(c.id));

  const toggleCat = (id) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <ExpensePatternStyled>
      <InnerLayout>
        <div className="head">
          <div className="head-left">
            <div className="title-row">
              <h2 className="page-title">Expense Pattern</h2>
              {/* Desktop: button in header. Mobile/tab: cycle name badge instead. */}
              <button
                type="button"
                className="next-month-btn"
                onClick={() => setShowStart(true)}
              >
                <i className="fa-solid fa-calendar-plus" />
                Start next cycle
              </button>
              {activeCycle && (
                <span className="cycle-name-badge">{activeCycle.label}</span>
              )}
            </div>
            <p className="page-sub">Compare your expenses cycle by cycle</p>
          </div>
        </div>


        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="chips-bar">
              {allCategories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={hidden.has(c.id) ? "chip off" : "chip"}
                  onClick={() => toggleCat(c.id)}
                >
                  <span className="dot" style={{ background: c.color }} />
                  {c.label}
                </button>
              ))}
            </div>

            <CompareCharts
              summaries={summaries}
              type={TYPE}
              visibleCategories={visibleCategories}
              n={n}
              setN={setN}
              totalCycles={cycles.length}
            />

            <h3 className="section-title">Insights</h3>
            <CompareInsights summaries={summaries} hidden={hidden} />

            <h3 className="section-title">Past Transactions</h3>
            <CycleTransactions cycleIds={cycles.slice(0, 3).map((c) => c._id)} />
          </>
        )}
        {/* Mobile/tab only — full-width start-cycle action at bottom of page */}
        <button
          type="button"
          className="next-cycle-bottom"
          onClick={() => setShowStart(true)}
        >
          <i className="fa-solid fa-calendar-plus" />
          Start next cycle
        </button>

        {activeCycle && !confirmDelete && (
          <button
            type="button"
            className="delete-cycle-link"
            onClick={() => setConfirmDelete(true)}
          >
            Delete current cycle
          </button>
        )}
        {activeCycle && confirmDelete && (
          <div className="delete-cycle-confirm">
            <p>
              Delete <strong>{activeCycle.label}</strong> and all its transactions?
              This cannot be undone.
            </p>
            <div className="delete-cycle-actions">
              <button
                type="button"
                className="dca-cancel"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="dca-go"
                disabled={deleting}
                onClick={async () => {
                  setDeleting(true);
                  try {
                    await deleteCycle(activeCycle._id);
                    await bootstrap();
                  } catch {
                    setDeleting(false);
                    setConfirmDelete(false);
                  }
                }}
              >
                {deleting ? "Deleting…" : "Yes, delete"}
              </button>
            </div>
          </div>
        )}
      </InnerLayout>
      {showStart && <StartNextCycle onClose={() => setShowStart(false)} />}
    </ExpensePatternStyled>
  );
}

const ExpensePatternStyled = styled.div`
  width: 100%;

  .head {
    margin-bottom: var(--s-5);
  }

  @media (min-width: 900px) {
    .head {
      position: sticky;
      top: 0;
      z-index: 10;
      background: var(--bg-deep);
      margin: calc(-1 * var(--s-6)) calc(-1 * var(--s-6)) var(--s-5);
      padding: var(--s-5) var(--s-6) var(--s-4);
      border-bottom: 1px solid var(--line);
    }
  }
  .head-left {
    display: flex;
    flex-direction: column;
    gap: var(--s-2);
  }
  .title-row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
  .page-title {
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin: 0;
  }
  .next-month-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    height: 32px;
    background: var(--bg-surface);
    border: 1px solid var(--line-strong);
    border-radius: var(--r-sm);
    color: var(--fg-muted);
    font-family: inherit;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: color 120ms, background 120ms;

    i { font-size: 12px; }

    &:hover {
      color: var(--fg);
      background: var(--bg-inset);
    }

    display: none;
  }

  .cycle-name-badge {
    display: block;
    font-size: 18px;
    font-weight: 700;
    color: var(--fg-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .next-cycle-bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    margin-top: var(--s-5);
    padding: 14px;
    border-radius: var(--r-md);
    background: rgba(111, 168, 220, 0.07);
    border: 1px solid #6fa8dc;
    color: #6fa8dc;
    font-family: inherit;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: background 120ms;

    i { font-size: 14px; }

    &:hover {
      background: rgba(111, 168, 220, 0.14);
    }
  }

  .page-sub {
    color: var(--fg-muted);
    font-size: 14px;
    margin: 0;
  }

  .chips-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: var(--s-4);
  }



  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--bg-inset);
    border: 1px solid var(--line);
    color: var(--fg);
    font-family: inherit;
    font-size: 12px;
    font-weight: 600;
    padding: 5px 10px;
    border-radius: 999px;
    cursor: pointer;
  }
  .chip .dot {
    width: 8px;
    height: 8px;
    border-radius: 2px;
  }
  .chip.off {
    opacity: 0.4;
    text-decoration: line-through;
  }

  .section-title {
    font-size: 17px;
    font-weight: 800;
    letter-spacing: -0.01em;
    margin: var(--s-6) 0 var(--s-4);
  }

  .delete-cycle-link {
    display: block;
    width: 100%;
    margin-top: var(--s-3);
    background: none;
    border: none;
    padding: 0;
    color: var(--accent-expense);
    font-family: inherit;
    font-size: 13px;
    text-align: center;
    cursor: pointer;
    text-decoration: underline;
    opacity: 0.7;
    &:hover { opacity: 1; }
  }

  .delete-cycle-confirm {
    margin-top: var(--s-3);
    padding: var(--s-3) var(--s-4);
    background: color-mix(in srgb, var(--color-danger, #e53935) 8%, transparent);
    border: 1px solid color-mix(in srgb, var(--color-danger, #e53935) 30%, transparent);
    border-radius: var(--r-md);

    p {
      margin: 0 0 var(--s-3);
      font-size: 13px;
      color: var(--fg);
      line-height: 1.5;
    }
  }

  .delete-cycle-actions {
    display: flex;
    gap: var(--s-2);
    justify-content: flex-end;

    button {
      padding: 6px 14px;
      border-radius: var(--r-sm);
      border: 1px solid transparent;
      font-family: inherit;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }
  }

  .dca-cancel {
    background: var(--bg-surface);
    border-color: var(--line) !important;
    color: var(--fg-muted);
    &:hover { color: var(--fg); }
  }

  .dca-go {
    background: var(--color-danger, #e53935);
    color: #fff;
    &:hover { opacity: 0.9; }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }
`;

export default ExpensePattern;
