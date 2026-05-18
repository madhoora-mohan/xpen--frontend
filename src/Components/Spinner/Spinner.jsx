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
  height: 100%;

  .spinner {
    width: 2.5rem;
    height: 2.5rem;
    border: 0.25rem solid rgba(255, 255, 255, 0.12);
    border-top-color: var(--color-accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default Spinner;
