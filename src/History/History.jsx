import React from "react";
import styled from "styled-components";
import { useGlobalContext } from "../context/globalContext";
import { formatRupee } from "../utils/currency";
import { dateFormat } from "../utils/dateFormat";
import { getCategory } from "../config/categories";
import EmptyState from "../Components/EmptyState/EmptyState";
import { comment } from "../utils/Icons";

const signFor = (type, direction) => {
  if (type === "expense") return "-";
  if (type === "transfer") return direction === "out" ? "-" : "+";
  return "+";
};

const toneFor = (type, direction) => {
  if (type === "expense") return "expense";
  if (type === "income") return "income";
  return direction === "out" ? "transfer-out" : "transfer-in";
};

function History() {
  const { transactionHistory } = useGlobalContext();
  const history = transactionHistory();

  if (history.length === 0) {
    return (
      <EmptyState
        icon={comment}
        title="Nothing yet"
        sub="Add an income or expense to start"
      />
    );
  }

  return (
    <HistoryStyled>
      {history.map((item) => {
        const { _id, title, amount, date, type, direction, category } = item;
        const cat = getCategory(type, category);
        const tone = toneFor(type, direction);
        const sign = signFor(type, direction);
        const safe = amount <= 0 ? 0 : amount;
        return (
          <div key={_id} className="history-row">
            <div className="h-icon" style={{ background: cat.color || "#888" }}>
              {cat.icon}
            </div>
            <div className="h-body">
              <div className="h-title">{title}</div>
              <div className="h-sub">
                {dateFormat(date)} · {cat.label}
              </div>
            </div>
            <div className={`h-amt ${tone}`}>
              {sign}
              {formatRupee(safe)}
            </div>
          </div>
        );
      })}
    </HistoryStyled>
  );
}

const HistoryStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  .history-row {
    display: grid;
    grid-template-columns: 32px 1fr auto;
    gap: var(--s-3);
    align-items: center;
    padding: 10px;
    border-radius: var(--r-sm);
    transition: background 120ms ease;

    &:hover {
      background: var(--bg-inset);
    }
  }

  .h-icon {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    display: grid;
    place-items: center;
    color: #0b0d10;
    flex-shrink: 0;

    i {
      font-size: 14px;
    }
  }

  .h-body {
    min-width: 0;
  }

  .h-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--fg);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .h-sub {
    font-size: 11px;
    color: var(--fg-faint);
    font-weight: 500;
  }

  .h-amt {
    font-size: 14px;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;

    &.income {
      color: var(--accent-income);
    }
    &.expense {
      color: var(--accent-expense);
    }
    &.transfer-out {
      color: var(--accent-lending);
    }
    &.transfer-in {
      color: var(--accent-balance);
    }
  }
`;

export default History;
