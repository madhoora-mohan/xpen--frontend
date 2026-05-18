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
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </ErrorStyled>
      );
    }
    return this.props.children;
  }
}

const ErrorStyled = styled.div`
  flex: 1;
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  padding: 2rem;
  background: rgb(32, 38, 44);
  border: 0.3rem solid rgb(49, 54, 60);
  border-radius: 1rem;
  color: #fff;
  @media (max-width: 920px) {
    width: 100vw;
    margin: 0;
    border: none;
    border-radius: 0;
  }
  h3 {
    font-size: 1.1rem;
    font-weight: 500;
  }
  p {
    font-size: 0.85rem;
    color: rgb(122, 122, 160);
    max-width: 24rem;
    text-align: center;
  }
  button {
    background: rgb(49, 54, 60);
    color: #fff;
    border: none;
    border-radius: 0.5rem;
    padding: 0.4rem 1rem;
    cursor: pointer;
    font-size: 0.85rem;
    &:hover {
      background: rgb(70, 76, 83);
    }
  }
`;

export default ErrorBoundary;
