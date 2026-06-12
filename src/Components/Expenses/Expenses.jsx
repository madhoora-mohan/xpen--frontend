import React, { useEffect, useMemo, useRef, useState } from "react"; // useEffect kept for the moreOpen click-outside handler
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import { InnerLayout } from "../../styles/Layouts";
import { formatRupee } from "../../utils/currency";
import IncomeItem from "../IncomeItem/IncomeItem";
import ExpenseForm from "./ExpenseForm";
import MonthlyInsight from "../Insight/MonthlyInsight";
import Spinner from "../Spinner/Spinner";
import EmptyState from "../EmptyState/EmptyState";
import { expenses as expensesIcon } from "../../utils/Icons";
import { getCategory } from "../../config/categories";
import { fuzzyMatch } from "../../utils/fuzzySearch";

function Expenses() {
  const { expenses, deleteExpense, totalExpenses, loading } = useGlobalContext();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [moreOpen, setMoreOpen] = useState(false);
  const [moreAlign, setMoreAlign] = useState("left");
  const [expandedId, setExpandedId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const moreRef = useRef(null);

  const handleMoreToggle = () => {
    if (!moreOpen && moreRef.current) {
      const rect = moreRef.current.getBoundingClientRect();
      setMoreAlign(rect.left > window.innerWidth / 2 ? "right" : "left");
    }
    setMoreOpen((o) => !o);
  };

  const handleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id));

  const { topCats, remainingCats } = useMemo(() => {
    const tally = {};
    expenses.forEach((e) => {
      tally[e.category] = (tally[e.category] || 0) + 1;
    });
    const sorted = Object.entries(tally)
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id);
    return { topCats: sorted.slice(0, 3), remainingCats: sorted.slice(3) };
  }, [expenses]);

  useEffect(() => {
    if (!moreOpen) return;
    const handler = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [moreOpen]);

  const list = useMemo(() => {
    return expenses
      .slice()
      .sort((a, b) => {
        const dateDiff = new Date(b.date) - new Date(a.date);
        if (dateDiff !== 0) return dateDiff;
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
      .filter((e) => {
        if (filter !== "all" && e.category !== filter) return false;
        if (!search) return true;
        const cat = getCategory("expense", e.category);
        return (
          fuzzyMatch(search, e.title) ||
          fuzzyMatch(search, e.description) ||
          fuzzyMatch(search, cat.label)
        );
      });
  }, [expenses, filter, search]);

  if (loading)
    return (
      <ExpenseStyled>
        <InnerLayout>
          <h2 className="page-title">Expenses</h2>
          <Spinner />
        </InnerLayout>
      </ExpenseStyled>
    );

  return (
    <ExpenseStyled>
      <InnerLayout>
        <h2 className="page-title">Expenses</h2>

        <div className="mobile-head">
        <div className="total-banner expense">
          <div className="label">Total expense</div>
          <div className="value">{formatRupee(totalExpenses())}</div>
        </div>

        <div className="row-spacer" />

        <button
          className="accordion-trigger"
          aria-expanded={isFormOpen}
          onClick={() => setIsFormOpen((o) => !o)}
        >
          <i className="fa-solid fa-plus" style={{ fontSize: 13 }} />
          <span>Add expense</span>
          <i
            className="fa-solid fa-chevron-down"
            style={{
              marginLeft: "auto",
              fontSize: 11,
              color: "var(--fg-muted)",
              transition: "transform 200ms ease",
              transform: isFormOpen ? "rotate(180deg)" : "none",
            }}
          />
        </button>
        </div>{/* end mobile-head */}

        <div className="form-page-grid">
          <div className="form-col">
            <div
              className="accordion-panel"
              style={{ gridTemplateRows: isFormOpen ? "1fr" : "0fr" }}
            >
              <div className="accordion-panel-inner">
                <div className="card" style={{ marginTop: 8 }}>
                  <h3 className="card-h3">Add expense</h3>
                  <ExpenseForm />
                </div>
              </div>
            </div>
            <div className="insight-slot">
              <MonthlyInsight items={expenses} type="expense" />
            </div>
          </div>
          <div className="list-col">
            <div className="toolbar">
              <div className="search-wrap">
                <i className="fa-solid fa-magnifying-glass ico" />
                <input
                  className="input"
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                type="button"
                className={"filter-chip" + (filter === "all" ? " active" : "")}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              {topCats.map((id) => {
                const c = getCategory("expense", id);
                return (
                  <button
                    type="button"
                    key={id}
                    className={"filter-chip" + (filter === id ? " active" : "")}
                    onClick={() => setFilter(id)}
                  >
                    <span className="chip-swatch" style={{ background: c.color }} />
                    {c.label}
                  </button>
                );
              })}
              {remainingCats.length > 0 && (
                <div className="more-wrap" ref={moreRef}>
                  <button
                    type="button"
                    className={"filter-chip" + (remainingCats.includes(filter) ? " active" : "")}
                    onClick={handleMoreToggle}
                  >
                    {remainingCats.includes(filter)
                      ? (() => {
                          const c = getCategory("expense", filter);
                          return (
                            <>
                              <span className="chip-swatch" style={{ background: c.color }} />
                              {c.label}
                            </>
                          );
                        })()
                      : "More"}
                    <i className={"fa-solid fa-chevron-" + (moreOpen ? "up" : "down") + " more-chevron"} />
                  </button>
                  {moreOpen && (
                    <div
                      className="more-dropdown"
                      style={moreAlign === "right" ? { left: "auto", right: 0 } : { left: 0, right: "auto" }}
                    >
                      {remainingCats.map((id) => {
                        const c = getCategory("expense", id);
                        return (
                          <button
                            type="button"
                            key={id}
                            className={"more-item" + (filter === id ? " active" : "")}
                            onClick={() => { setFilter(id); setMoreOpen(false); }}
                          >
                            <span className="chip-swatch" style={{ background: c.color }} />
                            {c.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {list.length === 0 ? (
              <div className="empty-slot">
                <EmptyState
                  icon={expensesIcon}
                  title="No expenses found"
                  sub={
                    expenses.length === 0
                      ? "Add your first expense to start tracking"
                      : "No matches for your filters"
                  }
                />
              </div>
            ) : (
              <div className="scroll-list">
                {list.map((item) => {
                  const { _id, title, amount, date, category, description, type } = item;
                  return (
                    <IncomeItem
                      key={_id}
                      id={_id}
                      title={title}
                      description={description}
                      amount={amount}
                      date={date}
                      type={type || "expense"}
                      category={category}
                      deleteItem={deleteExpense}
                      isExpanded={expandedId === _id}
                      onExpand={handleExpand}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </InnerLayout>
    </ExpenseStyled>
  );
}

const ExpenseStyled = styled.div`
  width: 100%;

  .page-title {
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin: 0 0 var(--s-4);
  }

  .total-banner {
    display: flex;
    align-items: baseline;
    gap: var(--s-3);
    background: var(--bg-surface);
    border: 1px solid var(--line);
    border-radius: var(--r-lg);
    padding: var(--s-4) var(--s-5);

    .label {
      font-size: 13px;
      font-weight: 600;
      color: var(--fg-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .value {
      margin-left: auto;
      font-size: 22px;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
    }
    &.expense .value {
      color: var(--accent-expense);
    }
  }

  .row-spacer {
    height: var(--s-5);
  }

  .form-page-grid {
    display: grid;
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    gap: var(--s-5);
    align-items: stretch;

    @media (max-width: 980px) {
      grid-template-columns: 1fr;
    }
  }

  .form-col {
    display: flex;
    flex-direction: column;
    gap: 14px;
    min-height: 0;
    overflow: hidden;
  }

  .list-col {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .empty-slot {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  /* Insight panel: desktop-only, sits below the form */
  .insight-slot {
    display: flex;
    flex-direction: column;
  }
  @media (max-width: 980px) {
    .insight-slot {
      display: none;
    }
  }

  /* Mobile accordion form */
  .accordion-trigger {
    display: none;
    width: 100%;
    height: 40px;
    border-radius: 10px;
    background: transparent;
    border: 1px dashed var(--line-strong);
    color: var(--fg);
    align-items: center;
    gap: 8px;
    padding: 0 14px;
    font-family: inherit;
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
    margin-bottom: 0;
    transition: background 150ms ease;
  }
  .accordion-trigger[aria-expanded="true"] {
    background: var(--bg-inset-2);
  }
  @media (max-width: 899px) {
    .accordion-trigger {
      display: flex;
    }
  }

  .accordion-panel {
    display: grid;
    transition: grid-template-rows 300ms cubic-bezier(0.4, 0, 0.2, 1);
  }
  @media (min-width: 900px) {
    .accordion-panel {
      grid-template-rows: 1fr !important;
    }
  }
  .accordion-panel-inner {
    overflow: hidden;
    min-height: 0;
  }

  .card {
    background: var(--bg-surface);
    border: 1px solid var(--line);
    border-radius: var(--r-lg);
    padding: var(--s-5);
  }

  .card-h3 {
    margin: 0 0 var(--s-4);
    font-size: 15px;
    font-weight: 800;
    letter-spacing: -0.01em;
  }

  .toolbar {
    display: flex;
    align-items: center;
    gap: var(--s-2);
    margin-bottom: var(--s-3);
    flex-wrap: wrap;
  }

  .search-wrap {
    position: relative;
    width: 160px;
    flex-shrink: 0;

    .ico {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--fg-faint);
      pointer-events: none;
      font-size: 13px;
    }

    .input {
      width: 100%;
      height: 32px;
      padding: 0 var(--s-3) 0 32px;
      background: var(--bg-inset);
      color: var(--fg);
      border: 1px solid var(--line);
      border-radius: var(--r-sm);
      font-family: inherit;
      font-size: 13px;
      font-weight: 500;
      outline: none;
      transition: border-color 120ms, background 120ms;
    }
    .input::placeholder {
      color: var(--fg-faint);
    }
    .input:focus {
      border-color: var(--line-focus);
      background: var(--bg-inset-2);
    }
  }

  .more-wrap {
    position: relative;
  }

  .more-chevron {
    font-size: 10px;
    margin-left: 2px;
  }

  .more-dropdown {
    position: absolute;
    top: calc(100% + 6px);
    width: max-content;
    min-width: 140px;
    background: var(--bg-surface);
    border: 1px solid var(--line);
    border-radius: var(--r-md);
    box-shadow: var(--shadow-pop);
    z-index: 50;
    padding: var(--s-1);
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .more-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 7px 10px;
    border-radius: var(--r-sm);
    background: transparent;
    border: none;
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    color: var(--fg-muted);
    cursor: pointer;
    text-align: left;
    white-space: nowrap;
    transition: background 100ms, color 100ms;

    &:hover {
      background: var(--bg-inset);
      color: var(--fg);
    }
    &.active {
      background: var(--bg-inset-2);
      color: var(--fg);
    }
  }

  .filter-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: var(--r-pill);
    background: var(--bg-surface);
    border: 1px solid var(--line);
    font-family: inherit;
    font-size: 12px;
    font-weight: 600;
    color: var(--fg-muted);
    cursor: pointer;
    height: 32px;
    transition: background 120ms, color 120ms, border-color 120ms;

    &.active {
      background: var(--bg-inset-2);
      color: var(--fg);
      border-color: var(--line-strong);
    }

    .chip-swatch {
      width: 8px;
      height: 8px;
      border-radius: 2px;
      display: inline-block;
    }
  }

  .scroll-list {
    flex: 1;
    min-height: 0;
    max-height: none;
    overflow-y: auto;
    padding-right: 4px;

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: var(--bg-inset-2);
      border-radius: 3px;
    }
  }

  /* Desktop: page fills the viewport so the list scrolls internally and the
     insight panel fills the space below the form. */
  @media (min-width: 981px) {
    display: flex;
    flex-direction: column;
    height: 100vh;
    min-height: 0;

    ${InnerLayout} {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
    }

    .form-page-grid {
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }
  }

  /* Mobile: banner+trigger pinned at top, form+list scroll below */
  @media (max-width: 899px) {
    height: calc(100vh - var(--topbar-h));
    display: flex;
    flex-direction: column;
    min-height: 0;

    ${InnerLayout} {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      padding-bottom: 0;
    }

    .page-title { display: none; }
    .row-spacer { height: var(--s-2); }

    .mobile-head { flex-shrink: 0; }

    .form-page-grid {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      padding-bottom: calc(var(--s-10) + var(--s-6));
    }

    .form-col { display: contents; }

    .scroll-list {
      overflow-y: visible;
      max-height: none;
      flex: none;
    }

    .empty-slot { flex: none; }
  }

  @media (max-width: 720px) {
    .page-title {
      font-size: 22px;
    }
  }
`;

export default Expenses;
