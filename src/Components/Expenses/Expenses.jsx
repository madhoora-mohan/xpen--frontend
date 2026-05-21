import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import { InnerLayout } from "../../styles/Layouts";
import { formatRupee } from "../../utils/currency";
import IncomeItem from "../IncomeItem/IncomeItem";
import ExpenseForm from "./ExpenseForm";
import Spinner from "../Spinner/Spinner";
import EmptyState from "../EmptyState/EmptyState";
import { expenses as expensesIcon } from "../../utils/Icons";
import { getCategory } from "../../config/categories";
import { fuzzyMatch } from "../../utils/fuzzySearch";

function Expenses() {
  const { expenses, getExpenses, deleteExpense, totalExpenses, loading } =
    useGlobalContext();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [moreOpen, setMoreOpen] = useState(false);
  const [moreAlign, setMoreAlign] = useState("left");
  const [expandedId, setExpandedId] = useState(null);
  const moreRef = useRef(null);

  const handleMoreToggle = () => {
    if (!moreOpen && moreRef.current) {
      const rect = moreRef.current.getBoundingClientRect();
      setMoreAlign(rect.left > window.innerWidth / 2 ? "right" : "left");
    }
    setMoreOpen((o) => !o);
  };

  const handleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id));

  useEffect(() => {
    getExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      .sort((a, b) => new Date(b.date) - new Date(a.date))
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
          <p className="page-sub">Log what you spent and where it went</p>
          <Spinner />
        </InnerLayout>
      </ExpenseStyled>
    );

  return (
    <ExpenseStyled>
      <InnerLayout>
        <h2 className="page-title">Expenses</h2>
        <p className="page-sub">Log what you spent and where it went</p>

        <div className="total-banner expense">
          <div className="label">Total expense</div>
          <div className="value">{formatRupee(totalExpenses())}</div>
        </div>

        <div className="row-spacer" />

        <div className="form-page-grid">
          <div className="card">
            <h3 className="card-h3">Add expense</h3>
            <ExpenseForm />
          </div>
          <div>
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
              <EmptyState
                icon={expensesIcon}
                title="No expenses found"
                sub={
                  expenses.length === 0
                    ? "Add your first expense to start tracking"
                    : "No matches for your filters"
                }
              />
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
    margin: 0 0 var(--s-2);
  }
  .page-sub {
    color: var(--fg-muted);
    font-size: 14px;
    margin: 0 0 var(--s-5);
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

    @media (max-width: 980px) {
      grid-template-columns: 1fr;
    }
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
    max-height: min(600px, 55vh);
    overflow-y: auto;
    padding-right: 4px;

    @media (max-width: 899px) {
      max-height: 40vh;
    }

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: var(--bg-inset-2);
      border-radius: 3px;
    }
  }

  @media (max-width: 720px) {
    .page-title {
      font-size: 22px;
    }
  }
`;

export default Expenses;
