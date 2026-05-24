import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import { InnerLayout } from "../../styles/Layouts";
import { formatRupee } from "../../utils/currency";
import Form from "../Form/Form";
import IncomeItem from "../IncomeItem/IncomeItem";
import Spinner from "../Spinner/Spinner";
import EmptyState from "../EmptyState/EmptyState";
import { trend } from "../../utils/Icons";

function Income() {
  const { incomes, deleteIncome, totalIncome, loading } = useGlobalContext();

  const [expandedId, setExpandedId] = useState(null);
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
          <p className="page-sub">Where money came from this month</p>
          <Spinner />
        </InnerLayout>
      </IncomeStyled>
    );

  return (
    <IncomeStyled>
      <InnerLayout>
        <h2 className="page-title">Incomes</h2>
        <p className="page-sub">Where money came from this month</p>

        <div className="total-banner income">
          <div className="label">Total income</div>
          <div className="value">{formatRupee(totalIncome())}</div>
        </div>

        <div className="row-spacer" />

        <div className="form-page-grid">
          <div className="card">
            <h3 className="card-h3">Add income</h3>
            <Form />
          </div>
          <div>
            {list.length === 0 ? (
              <EmptyState
                icon={trend}
                title="No incomes yet"
                sub="Log your salary, bonus, or cashback"
              />
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

export default Income;
