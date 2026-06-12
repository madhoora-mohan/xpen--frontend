import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import { getCategory } from "../../config/categories";
import { formatRupee } from "../../utils/currency";
import { dateFormat } from "../../utils/dateFormat";
import { arrowDown } from "../../utils/Icons";

const TYPES = [
  { key: "incomes",   type: "income",   label: "Incomes"   },
  { key: "expenses",  type: "expense",  label: "Expenses"  },
  { key: "transfers", type: "transfer", label: "Transfers" },
];

const byDateDesc = (a, b) => {
  const dateDiff = new Date(b.date) - new Date(a.date);
  if (dateDiff !== 0) return dateDiff;
  return new Date(b.createdAt) - new Date(a.createdAt);
};

function transferTone(item) {
  return item.direction === "in" ? "transfer-in" : "transfer-out";
}
function transferSign(item) {
  return item.direction === "in" ? "+" : "−";
}

function CycleTransactions({ cycleIds }) {
  const { getCycleTransactions, cycles } = useGlobalContext();
  const [open, setOpen] = useState(false);
  const [cycleOpen, setCycleOpen] = useState({});
  const [cycleData, setCycleData] = useState({});
  const [typeOpen, setTypeOpen] = useState({});

  const idsKey = cycleIds.join(",");
  useEffect(() => {
    setCycleOpen({});
    setCycleData({});
    setTypeOpen({});
  }, [idsKey]);

  const cycleList = cycleIds
    .map((id) => cycles.find((c) => c._id === id))
    .filter(Boolean);

  const toggleCycle = useCallback(
    async (cycleId) => {
      setCycleOpen((prev) => ({ ...prev, [cycleId]: !prev[cycleId] }));

      setCycleData((prev) => {
        const d = prev[cycleId];
        if (!d?.loaded && !d?.loading) {
          getCycleTransactions(cycleId).then((result) => {
            setCycleData((p) => ({
              ...p,
              [cycleId]: {
                incomes: (result.incomes || []).slice().sort(byDateDesc),
                expenses: (result.expenses || []).slice().sort(byDateDesc),
                transfers: (result.transfers || []).slice().sort(byDateDesc),
                loaded: true,
                loading: false,
              },
            }));
          });
          return { ...prev, [cycleId]: { loading: true } };
        }
        return prev;
      });
    },
    [getCycleTransactions]
  );

  const toggleType = (cycleId, typeKey) => {
    const k = `${cycleId}-${typeKey}`;
    setTypeOpen((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  const loadedCycleCount = Object.values(cycleData).filter((d) => d?.loaded).length;
  const totalTxns = Object.values(cycleData).reduce((acc, d) => {
    if (!d?.loaded) return acc;
    return acc + d.incomes.length + d.expenses.length + d.transfers.length;
  }, 0);

  return (
    <TxnStyled>
      {/* ── Level 1: parent ── */}
      <button type="button" className="acc-head lv1" onClick={() => setOpen((o) => !o)}>
        <span>
          Past Transactions
          {loadedCycleCount > 0 && <em> ({totalTxns})</em>}
          <span className="cycles-badge">
            {cycleIds.length} cycle{cycleIds.length === 1 ? "" : "s"}
          </span>
        </span>
        <span className={`chev ${open ? "up" : ""}`}>{arrowDown}</span>
      </button>

      {open && (
        <div className="lv1-body">
          {cycleList.map((cycle) => {
            const isCycleOpen = !!cycleOpen[cycle._id];
            const data = cycleData[cycle._id];
            const cycleTxns =
              data?.loaded
                ? data.incomes.length + data.expenses.length + data.transfers.length
                : null;

            return (
              <div className="cycle-wrap" key={cycle._id}>
                {/* ── Level 2: cycle ── */}
                <button
                  type="button"
                  className="acc-head lv2"
                  onClick={() => toggleCycle(cycle._id)}
                >
                  <span className="lv2-label">
                    <span className={`cycle-pip${cycle.isActive ? " active" : ""}`} />
                    <span className="cycle-name">{cycle.label}</span>
                    {cycle.isActive && <span className="active-tag">Active</span>}
                    {cycleTxns !== null && <em className="count"> ({cycleTxns})</em>}
                  </span>
                  <span className={`chev ${isCycleOpen ? "up" : ""}`}>{arrowDown}</span>
                </button>

                {isCycleOpen && (
                  <div className="lv2-body">
                    {data?.loading && <p className="muted">Loading…</p>}

                    {!data?.loading && data?.loaded &&
                      TYPES.map(({ key, type, label }) => {
                        const items = data[key];
                        const isTypeOpen = !!typeOpen[`${cycle._id}-${key}`];

                        return (
                          <div className="type-wrap" key={key}>
                            {/* ── Level 3: type ── */}
                            <button
                              type="button"
                              className="acc-head lv3"
                              onClick={() => toggleType(cycle._id, key)}
                            >
                              <span>
                                {label} <em>({items.length})</em>
                              </span>
                              <span className={`chev ${isTypeOpen ? "up" : ""}`}>
                                {arrowDown}
                              </span>
                            </button>

                            {isTypeOpen && (
                              <div className="rows">
                                {items.length === 0 ? (
                                  <p className="muted">
                                    No {label.toLowerCase()} in this cycle
                                  </p>
                                ) : (
                                  items.map((it) => {
                                    const cat = getCategory(type, it.category);
                                    const sign =
                                      type === "transfer"
                                        ? transferSign(it)
                                        : type === "income"
                                        ? "+"
                                        : "−";
                                    const tone =
                                      type === "transfer" ? transferTone(it) : type;
                                    return (
                                      <div className="row" key={it._id}>
                                        <span
                                          className="r-badge"
                                          style={{ borderColor: `${cat.color}55` }}
                                        >
                                          <span
                                            className="r-cat-icon"
                                            style={{ background: cat.color }}
                                          >
                                            {cat.icon}
                                          </span>
                                        </span>
                                        <span className="r-body">
                                          <span className="r-title">{it.title}</span>
                                          <span className="r-cat" style={{ color: cat.color }}>
                                            {cat.label}
                                          </span>
                                        </span>
                                        <span className="r-date">{dateFormat(it.date)}</span>
                                        <span className={`r-amt ${tone}`}>
                                          {sign}{formatRupee(it.amount)}
                                        </span>
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </TxnStyled>
  );
}

const TxnStyled = styled.div`
  background: var(--bg-surface);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  overflow: hidden;

  /* ── Shared head styles ── */
  .acc-head {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: transparent;
    border: 0;
    color: var(--fg);
    font-family: inherit;
    cursor: pointer;

    em {
      color: var(--fg-faint);
      font-style: normal;
      font-weight: 600;
    }
  }
  .acc-head:hover {
    background: var(--bg-inset);
  }

  /* Level 1 */
  .lv1 {
    padding: var(--s-4) var(--s-5);
    font-size: 15px;
    font-weight: 700;
  }

  /* Level 2 */
  .lv2 {
    padding: var(--s-3) var(--s-5) var(--s-3) calc(var(--s-5) + 4px);
    font-size: 14px;
    font-weight: 600;
    color: var(--fg-muted);
    border-top: 1px solid var(--line);
  }

  /* Level 3 */
  .lv3 {
    padding: var(--s-2) var(--s-5) var(--s-2) calc(var(--s-5) + var(--s-5));
    font-size: 13px;
    font-weight: 600;
    color: var(--fg-faint);
    border-top: 1px solid var(--line-faint, var(--line));
  }

  /* ── Level 1 body ── */
  .lv1-body {
    border-top: 1px solid var(--line);
  }

  /* ── Cycle block ── */
  .cycle-wrap {
    &:last-child .lv2 {
      border-bottom: 0;
    }
  }

  .lv2-label {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  .cycle-pip {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--fg-faint);
    flex-shrink: 0;
    &.active {
      background: var(--accent-income);
    }
  }

  .cycle-name {
    font-weight: 700;
    color: var(--fg);
  }

  .active-tag {
    font-size: 10px;
    font-weight: 700;
    color: var(--accent-income);
    background: color-mix(in srgb, var(--accent-income) 15%, transparent);
    border: 1px solid color-mix(in srgb, var(--accent-income) 30%, transparent);
    border-radius: 999px;
    padding: 1px 6px;
    letter-spacing: 0.02em;
  }

  .count {
    color: var(--fg-faint);
    font-weight: 600;
  }

  /* ── Level 2 body ── */
  .lv2-body {
    /* no extra border; type-wrap provides borders */
  }

  /* ── Type block ── */
  .type-wrap {
    &:last-child .lv3 {
      border-bottom: 0;
    }
  }

  /* ── Rows ── */
  .rows {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 0 var(--s-3) var(--s-3) calc(var(--s-5) + var(--s-5) + var(--s-2));
  }

  .muted {
    color: var(--fg-faint);
    font-size: 13px;
    padding: var(--s-2) var(--s-5);
  }

  .row {
    display: grid;
    grid-template-columns: 32px 1fr auto auto;
    gap: var(--s-2);
    align-items: center;
    padding: 5px var(--s-2);
    border-radius: var(--r-sm);

    &:hover {
      background: var(--bg-inset);
    }
  }

  .r-badge {
    width: 32px;
    height: 32px;
    border-radius: var(--r-xs);
    border: 1px solid var(--line);
    display: grid;
    place-items: center;
    background: var(--bg-deep);
    flex-shrink: 0;
  }

  .r-cat-icon {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    display: grid;
    place-items: center;
    color: #1a1a1a;

    i {
      font-size: 11px;
    }
  }

  .r-body {
    display: flex;
    flex-direction: column;
    min-width: 0;
    gap: 1px;
  }

  .r-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--fg);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .r-cat {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.01em;
  }

  .r-date {
    font-size: 11px;
    color: var(--fg-faint);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .r-amt {
    font-size: 13px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;

    &.income       { color: var(--accent-income); }
    &.expense      { color: var(--accent-expense); }
    &.transfer-out { color: var(--accent-lending); }
    &.transfer-in  { color: var(--accent-balance); }
  }

  /* ── Chevron ── */
  .chev {
    display: inline-flex;
    transition: transform 150ms ease;
    color: var(--fg-muted);
    font-size: 12px;
    flex-shrink: 0;
  }
  .chev.up {
    transform: rotate(180deg);
  }

  /* ── Badges ── */
  .cycles-badge {
    display: inline-flex;
    align-items: center;
    margin-left: 8px;
    font-size: 11px;
    font-weight: 600;
    color: var(--fg-faint);
    background: var(--bg-inset);
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 1px 8px;
    vertical-align: middle;
  }

  @media (max-width: 600px) {
    .row {
      grid-template-columns: 32px 1fr auto;
    }
    .r-date {
      display: none;
    }
    .lv3 {
      padding-left: var(--s-5);
    }
    .rows {
      padding-left: var(--s-4);
    }
  }
`;

export default CycleTransactions;
