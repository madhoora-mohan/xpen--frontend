import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import { InnerLayout } from "../../styles/Layouts";
import { formatRupee } from "../../utils/currency";
import Form from "../Form/Form";
import IncomeItem from "../IncomeItem/IncomeItem";
import MonthlyInsight from "../Insight/MonthlyInsight";
import Spinner from "../Spinner/Spinner";
import EmptyState from "../EmptyState/EmptyState";
import { trend } from "../../utils/Icons";

function Income() {
  const { incomes, deleteIncome, totalIncome, loading } = useGlobalContext();

  const [expandedId, setExpandedId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const handleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id));

  const list = useMemo(
    () => incomes.slice().sort((a, b) => new Date(b.date) - new Date(a.date)),
    [incomes]
  );

  if (loading)
    return (
      <IncomeStyled>
        <InnerLayout>
          <h2 className="page-title">Incomes</h2>
          <Spinner />
        </InnerLayout>
      </IncomeStyled>
    );

  return (
    <IncomeStyled>
      <InnerLayout>
        <h2 className="page-title">Incomes</h2>

        <div className="mobile-head">
        <div className="total-banner income">
          <div className="label">Total income</div>
          <div className="value">{formatRupee(totalIncome())}</div>
        </div>

        <div className="row-spacer" />

        <button
          className="accordion-trigger"
          aria-expanded={isFormOpen}
          onClick={() => setIsFormOpen((o) => !o)}
        >
          <i className="fa-solid fa-plus" style={{ fontSize: 13 }} />
          <span>Add income</span>
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
                  <h3 className="card-h3">Add income</h3>
                  <Form />
                </div>
              </div>
            </div>
            <div className="insight-slot">
              <MonthlyInsight items={incomes} type="income" />
            </div>
          </div>
          <div className="list-col">
            {list.length === 0 ? (
              <div className="empty-slot">
                <EmptyState
                  icon={trend}
                  title="No incomes yet"
                  sub="Log your salary, bonus, or cashback"
                />
              </div>
            ) : (
              <div className="scroll-list">
                {list.map((income) => {
                  const { _id, title, amount, date, category, description, type } = income;
                  return (
                    <IncomeItem
                      key={_id}
                      id={_id}
                      title={title}
                      description={description}
                      amount={amount}
                      date={date}
                      type={type || "income"}
                      category={category}
                      deleteItem={deleteIncome}
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
    </IncomeStyled>
  );
}

const IncomeStyled = styled.div`
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
    &.income .value {
      color: var(--accent-income);
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

    /* Banner + toggle stay fixed at top */
    .mobile-head { flex-shrink: 0; }

    /* Everything below banner+toggle scrolls */
    .form-page-grid {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      padding-bottom: calc(var(--s-10) + var(--s-6));
    }

    .form-col { display: contents; }

    /* list items render at natural height — outer scroll handles it */
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

export default Income;
