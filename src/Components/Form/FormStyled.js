import styled from "styled-components";

const FormStyled = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--s-3);

  .input,
  input.input,
  input[type="text"],
  input[type="number"],
  input[type="email"],
  input[type="password"],
  input[type="date"],
  textarea,
  select {
    width: 100%;
    height: 44px;
    padding: 0 var(--s-3);
    background: var(--bg-inset);
    color: var(--fg);
    border: 1px solid var(--line);
    border-radius: var(--r-sm);
    font-family: inherit;
    font-size: 14px;
    font-weight: 500;
    outline: none;
    transition: border-color 120ms ease, background 120ms ease;
    appearance: none;
  }

  input::placeholder,
  textarea::placeholder {
    color: var(--fg-faint);
  }

  input:focus,
  textarea:focus,
  select:focus {
    border-color: var(--line-focus);
    background: var(--bg-inset-2);
  }

  textarea {
    height: auto;
    min-height: 80px;
    padding: var(--s-3);
    resize: vertical;
  }

  .react-datepicker-wrapper {
    width: 100%;
  }
  .react-datepicker__input-container input {
    width: 100%;
  }

  .field-row-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--s-3);
  }

  .submit-btn {
    margin-top: var(--s-2);
    button {
      width: 100%;
    }
  }

  .error_msg,
  .error-msg {
    padding: 10px 12px;
    background: rgba(232, 60, 50, 0.12);
    color: #ff857d;
    border: 1px solid rgba(232, 60, 50, 0.3);
    border-radius: var(--r-sm);
    font-size: 13px;
    font-weight: 600;
    margin: 0;
  }

  .success_msg {
    padding: 10px 12px;
    background: rgba(66, 173, 0, 0.12);
    color: #9be37b;
    border: 1px solid rgba(66, 173, 0, 0.3);
    border-radius: var(--r-sm);
    font-size: 13px;
    font-weight: 600;
    margin: 0;
  }
`;

export default FormStyled;
