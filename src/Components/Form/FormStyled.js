import styled from "styled-components";

const FormStyled = styled.form`
  .error_msg {
    width: 75%;
    padding: 1rem;
    margin: 0;
    font-size: 0.8rem;
    background-color: #f34646;
    color: white;
    border-radius: 0.8rem;
    text-align: center;
  }
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  input,
  textarea,
  select {
    font-family: inherit;
    font-size: 1rem;
    outline: none;
    padding: 1rem 1rem;
    border-radius: 0.8rem;
    border: 0.1rem solid rgb(69, 69, 69);
    background: rgb(86, 88, 88);
    opacity: 0.6;
    resize: none;
    color: rgba(255, 255, 255, 1);
    &::placeholder {
      color: rgba(34, 34, 96, 0.4);
      color: white;
      opacity: 0.3;
    }
  }
  select {
    font-size: 1rem;
    padding: 0.5rem 0.5rem;
  }

  .input-control {
    input {
      height: 2rem;
      width: 100%;
    }
    .desc {
      height: 20%;
    }
    h5 {
      padding-left: 1rem;
      padding-top: 0.5rem;
      color: rgb(80, 80, 80);
    }
  }

  .selects {
    display: flex;
    height: 2.5rem;
    justify-content: flex-end;
    select {
      color: rgba(255, 255, 255, 0.4);
      &:focus,
      &:active {
        color: rgba(255, 255, 255, 1);
      }
    }
  }

  .submit-btn {
    button {
      justify-content: center;
      font-size: 1rem;
      &:hover {
        background: var(--color-green) !important;
      }
    }
  }
  @media (max-width: 425px) {
    width: 15rem;
    gap: 1rem;
    justify-content: left;
  }
`;

export default FormStyled;
