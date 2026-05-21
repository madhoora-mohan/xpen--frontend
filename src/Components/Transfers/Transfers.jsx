import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import { InnerLayout } from "../../styles/Layouts";
import IncomeItem from "../IncomeItem/IncomeItem";
import TransferForm from "./TransferForm";
import Spinner from "../Spinner/Spinner";
import EmptyState from "../EmptyState/EmptyState";
import { formatRupee } from "../../utils/currency";
import { transfers as transfersIcon } from "../../utils/Icons";
import { fuzzyMatch } from "../../utils/fuzzySearch";

function Transfers() {
  const { transfers, getTransfers, deleteTransfer, loading } = useGlobalContext();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const handleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id));

  useEffect(() => {
    getTransfers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalOut = useMemo(
    () =>
      transfers
        .filter((t) => t.direction === "out")
        .reduce((a, t) => a + Number(t.amount || 0), 0),
    [transfers]
  );
  const totalIn = useMemo(
    () =>
      transfers
        .filter((t) => t.direction === "in")
        .reduce((a, t) => a + Number(t.amount || 0), 0),
    [transfers]
  );

  const list = useMemo(() => {
    return transfers
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .filter((t) => {
        const dirMatch =
          filter === "all" ? true : t.direction === filter;
        const searchMatch = !search || (
          fuzzyMatch(search, t.title) ||
          fuzzyMatch(search, t.description)
        );
        return dirMatch && searchMatch;
      });
  }, [transfers, filter, search]);

  if (loading)
    return (
      <TransferStyled>
        <InnerLayout>
          <h2 className="page-title">Transfers</h2>
          <p className="page-sub">Lending, investing, and money in motion</p>
          <Spinner />
        </InnerLayout>
      </TransferStyled>
    );

  return (
    <TransferStyled>
      <InnerLayout>
        <h2 className="page-title">Transfers</h2>
        <p className="page-sub">Lending, investing, and money in motion</p>

        <div className="stat-2up">
          <div className="stat" data-tone="lending">
            <div className="stat-label" style={{ color: "var(--accent-lending)" }}>
              <span className="dot" /> Out
            </div>
            <div className="stat-value">{formatRupee(totalOut)}</div>
            <div className="stat-foot">Lent + invested + cashed out</div>
          </div>
          <div className="stat" data-tone="balance">
            <div className="stat-label" style={{ color: "var(--accent-balance)" }}>
              <span className="dot" /> In
            </div>
            <div className="stat-value">{formatRupee(totalIn)}</div>
            <div className="stat-foot">Returns received</div>
          </div>
        </div>

        <div className="row-spacer" />

        <div className="form-page-grid">
          <div className="card">
            <h3 className="card-h3">Add transfer</h3>
            <TransferForm />
          </div>
          <div>
            <div className="toolbar">
              <div className="search-wrap">
                <i className="fa-solid fa-magnifying-glass ico" />
                <input
                  className="input"
                  type="text"
                  placeholder="Search transfers"
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
              <button
                type="button"
                className={"filter-chip" + (filter === "out" ? " active" : "")}
                onClick={() => setFilter("out")}
              >
                <span
                  className="chip-swatch"
                  style={{ background: "var(--accent-lending)" }}
                />
                Out
              </button>
              <button
                type="button"
                className={"filter-chip" + (filter === "in" ? " active" : "")}
                onClick={() => setFilter("in")}
              >
                <span
                  className="chip-swatch"
                  style={{ background: "var(--accent-balance)" }}
                />
                In
              </button>
            </div>

            {list.length === 0 ? (
              <EmptyState
                icon={transfersIcon}
                title="No transfers found"
                sub={
                  transfers.length === 0
                    ? "Log a loan, investment, or cash conversion"
                    : "No matches for your filters"
                }
              />
            ) : (
              <div className="scroll-list">
                {list.map((t) => (
                  <IncomeItem
                    key={t._id}
                    id={t._id}
                    title={t.title}
                    description={t.description}
                    amount={t.amount}
                    date={t.date}
                    type="transfer"
                    direction={t.direction}
                    category={t.category}
                    deleteItem={deleteTransfer}
                    isExpanded={expandedId === t._id}
                    onExpand={handleExpand}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </InnerLayout>
    </TransferStyled>
  );
}

const TransferStyled = styled.div`
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

  .stat-2up {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--s-3);
  }

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
    }
    .stat-foot {
      font-size: 11px;
      color: var(--fg-faint);
      font-weight: 600;
    }
    &[data-tone="lending"] .stat-value {
      color: var(--accent-lending);
    }
    &[data-tone="balance"] .stat-value {
      color: var(--accent-balance);
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
    flex: 1;
    min-width: 180px;

    .ico {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--fg-faint);
      pointer-events: none;
      font-size: 14px;
    }

    .input {
      width: 100%;
      height: 40px;
      padding: 0 var(--s-3) 0 38px;
      background: var(--bg-inset);
      color: var(--fg);
      border: 1px solid var(--line);
      border-radius: var(--r-sm);
      font-family: inherit;
      font-size: 14px;
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
    min-height: 32px;

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

export default Transfers;
