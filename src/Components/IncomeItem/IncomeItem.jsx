import React from "react";
import styled, { css } from "styled-components";
import { dateFormat } from "../../utils/dateFormat";
import { trash } from "../../utils/Icons";
import { getCategory } from "../../config/categories";
import { formatRupee } from "../../utils/currency";

function IncomeItem({
  id,
  title,
  amount,
  date,
  category,
  description,
  deleteItem,
  type,
  direction,
  isExpanded,
  onExpand,
}) {
  const cat = getCategory(type, category);
  const catColor = cat.color || "#888";

  const d = new Date(date);
  const badgeDay = String(d.getDate()).padStart(2, "0");
  const badgeMon = d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();

  const sign =
    type === "income"
      ? "+"
      : type === "expense"
      ? "-"
      : direction === "out"
      ? "-"
      : "+";

  const amountTone =
    type === "income"
      ? "income"
      : type === "expense"
      ? "expense"
      : direction === "out"
      ? "transfer-out"
      : "transfer-in";

  const safeAmount = amount < 0 ? 0 : amount;

  return (
    <ItemStyled
      $color={catColor}
      $isExpanded={isExpanded}
      onClick={() => onExpand && onExpand(id)}
    >
      <div className="tx-date-badge">
        <span className="badge-mon" style={{ color: catColor }}>{badgeMon}</span>
        <span className="badge-day">{badgeDay}</span>
      </div>
      <div className="tx-body">
        <div className="tx-title">
          {title}
          <i className={`fa-solid fa-chevron-down expand-caret${isExpanded ? " open" : ""}`} />
        </div>
        <div className="tx-meta">
          <span className="cat-name" style={{ color: catColor }}>
            <span className="cat-icon-box" style={{ background: catColor }}>
              {cat.icon}
            </span>
            {cat.label}
          </span>
        </div>
      </div>
      <div className={`tx-amount ${amountTone}`}>
        {sign}
        {formatRupee(safeAmount)}
      </div>
      <button
        type="button"
        className="tx-delete"
        onClick={(e) => { e.stopPropagation(); deleteItem(id); }}
        aria-label="Delete"
        title="Delete"
      >
        {trash}
      </button>

      {/* grid-template-rows: 0fr → 1fr gives exact-height smooth animation */}
      <div className="tx-desc-row">
        <div className="tx-desc-inner">
          <span className="tx-full-date">{dateFormat(date)}</span>
          <p className="tx-desc">
            {description || <span className="no-desc">No description added</span>}
          </p>
        </div>
      </div>
    </ItemStyled>
  );
}

const ItemStyled = styled.div`
  display: grid;
  grid-template-columns: 52px 1fr auto auto;
  align-items: center;
  gap: var(--s-3);
  padding: 6px var(--s-4);
  background: ${({ $color }) =>
    `linear-gradient(90deg, ${$color}33 0%, ${$color}14 60%, ${$color}08 100%), var(--bg-surface)`};
  border: 1px solid ${({ $color }) => `${$color}55`};
  border-left: 3px solid ${({ $color }) => $color};
  border-radius: var(--r-md);
  cursor: pointer;
  transition: background 120ms ease;

  & + & {
    margin-top: var(--s-2);
  }

  &:hover .tx-delete {
    opacity: 1;
  }

  .tx-date-badge {
    width: 52px;
    height: 52px;
    background: var(--bg-deep);
    border: 1px solid ${({ $color }) => `${$color}66`};
    border-radius: var(--r-sm);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    align-self: center;
  }

  .badge-mon {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.06em;
    line-height: 1;
  }

  .badge-day {
    font-size: 18px;
    font-weight: 900;
    color: var(--fg);
    line-height: 1;
    font-variant-numeric: tabular-nums;
    margin-top: 2px;
  }

  .tx-body {
    min-width: 0;
    align-self: center;
  }

  .tx-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--fg);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .expand-caret {
    font-size: 10px;
    color: var(--fg-faint);
    flex-shrink: 0;
    transition: transform 240ms ease;
    &.open { transform: rotate(180deg); }
  }

  .tx-meta {
    display: flex;
    flex-wrap: nowrap;
    gap: 6px;
    align-items: center;
    font-size: 12px;
    color: var(--fg-muted);
    margin-top: 2px;
    overflow: hidden;
  }

  .cat-name {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.01em;
    filter: brightness(1.05);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .cat-icon-box {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    display: grid;
    place-items: center;
    color: #1a1a1a;
    flex-shrink: 0;

    i { font-size: 10px; }
  }

  .tx-amount {
    font-size: 15px;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.01em;
    white-space: nowrap;
    align-self: center;
  }
  .tx-amount.expense      { color: var(--accent-expense); }
  .tx-amount.income       { color: var(--accent-income); }
  .tx-amount.transfer-out { color: var(--accent-lending); }
  .tx-amount.transfer-in  { color: var(--accent-balance); }

  .tx-delete {
    width: 36px;
    height: 36px;
    border-radius: var(--r-sm);
    background: transparent;
    border: 0;
    color: var(--fg-faint);
    display: grid;
    place-items: center;
    cursor: pointer;
    opacity: 0;
    align-self: center;
    transition: opacity 120ms ease, color 120ms ease, background 120ms ease;

    i { font-size: 14px; }

    &:hover {
      color: var(--color-delete);
      background: rgba(232, 60, 50, 0.1);
    }
  }

  /* grid-template-rows: 0fr→1fr = exact content height, single-stage, no overshoot */
  .tx-desc-row {
    grid-column: 2 / -1;
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 240ms ease;
  }

  .tx-desc-inner {
    overflow: hidden;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .tx-full-date {
    font-size: 11px;
    color: var(--fg-faint);
    font-weight: 600;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    padding-top: var(--s-2);
  }

  .tx-desc {
    font-size: 12px;
    color: var(--fg-muted);
    line-height: 1.5;
    margin: 0;

    .no-desc {
      color: var(--fg-faint);
      font-style: italic;
    }
  }

  ${({ $isExpanded }) =>
    $isExpanded &&
    css`
      .tx-desc-row {
        grid-template-rows: 1fr;
      }
    `}

  @media (max-width: 899px) {
    grid-template-columns: 44px 1fr auto auto;
    padding: 5px var(--s-3);
    gap: var(--s-2);

    .tx-delete { opacity: 1; }

    .tx-date-badge {
      width: 44px;
      height: 44px;
    }

    .badge-mon { font-size: 9px; }
    .badge-day { font-size: 16px; }

    .tx-title  { font-size: 13px; }
    .tx-amount { font-size: 13px; }

    .tx-delete {
      width: 30px;
      height: 30px;
    }
  }
`;

export default IncomeItem;
