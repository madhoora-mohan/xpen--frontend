import React from "react";
import styled from "styled-components";

function EmptyState({ icon, title, sub }) {
  return (
    <EmptyStyled>
      <div className="empty-mark">{icon}</div>
      <h4>{title}</h4>
      {sub && <p>{sub}</p>}
    </EmptyStyled>
  );
}

const EmptyStyled = styled.div`
  text-align: center;
  padding: var(--s-8) var(--s-4);
  color: var(--fg-faint);

  .empty-mark {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    margin: 0 auto;
    background: var(--bg-inset);
    display: grid;
    place-items: center;
    color: var(--fg-faint);
    i {
      font-size: 22px;
    }
  }

  h4 {
    color: var(--fg-muted);
    font-size: 14px;
    font-weight: 700;
    margin: var(--s-2) 0 4px;
  }
  p {
    font-size: 13px;
    margin: 0;
  }
`;

export default EmptyState;
