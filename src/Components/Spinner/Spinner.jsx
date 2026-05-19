import React from "react";
import styled from "styled-components";

function Spinner() {
  return (
    <SpinnerStyled>
      <div className="spinner" />
    </SpinnerStyled>
  );
}

const SpinnerStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 40vh;

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--line);
    border-top-color: var(--accent-income);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
`;

export default Spinner;
