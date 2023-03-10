import React from "react";
import styled from "styled-components";
import { useGlobalContext } from "../context/globalContext";

function History() {
  const { transactionHistory } = useGlobalContext();

  const [...history] = transactionHistory();

  return (
    <HistoryStyled>
      <h2>Recent History</h2>
      {history.map((item) => {
        const { _id, title, amount, type } = item;
        return (
          <div key={_id} className="history-item">
            <p
              style={{
                color: "rgba(255,255,255,0.8)",
              }}
            >
              {title}
            </p>

            <p
              style={{
                color:
                  type === "expense" ? "rgb(200,40,24)" : "var(--color-green)",
                opacity: 0.8,
              }}
            >
              {type === "expense"
                ? "₹" + `-${amount <= 0 ? 0 : amount}`
                : "₹" + `${amount <= 0 ? 0 : amount}`}
            </p>
          </div>
        );
      })}
    </HistoryStyled>
  );
}

const HistoryStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  // border: 3px solid rgb(49, 54, 60);
  padding: 10px;
  font-weight: 800;
  padding-bottom: 20px;
  border-radius: 10px;
  .history-item {
    background: rgb(49, 54, 60);
    border: 2px solid rgb(69, 69, 69);
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    padding: 1rem;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

export default History;
