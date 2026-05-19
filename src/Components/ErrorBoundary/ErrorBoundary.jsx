import React from "react";
import styled from "styled-components";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorStyled>
          <h3>Something went wrong.</h3>
          <p>{this.state.error?.message}</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </button>
        </ErrorStyled>
      );
    }
    return this.props.children;
  }
}

const ErrorStyled = styled.div`
  width: 100%;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--s-3);
  padding: var(--s-8);
  background: var(--bg-surface);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  color: var(--fg);
  margin: var(--s-5);

  h3 {
    font-size: 17px;
    font-weight: 800;
    letter-spacing: -0.01em;
    color: var(--fg);
  }
  p {
    font-size: 13px;
    color: var(--fg-muted);
    max-width: 24rem;
    text-align: center;
  }
  button {
    background: var(--fg);
    color: #0b0d10;
    border: 0;
    border-radius: var(--r-sm);
    padding: 10px 16px;
    cursor: pointer;
    font-family: inherit;
    font-size: 14px;
    font-weight: 700;
    transition: opacity 120ms;

    &:hover {
      opacity: 0.92;
    }
  }
`;

export default ErrorBoundary;
