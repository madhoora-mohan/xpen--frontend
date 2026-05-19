import React from "react";
import styled from "styled-components";

function Field({ label, required, hint, htmlFor, children, className }) {
  const Wrap = htmlFor ? FieldWrap : FieldWrap.withComponent("div");
  return (
    <Wrap className={className} htmlFor={htmlFor}>
      {label && (
        <span className="field-label">
          {label}
          {required && <span className="field-required">*</span>}
        </span>
      )}
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </Wrap>
  );
}

const FieldWrap = styled.label`
  display: block;
  width: 100%;

  .field-label {
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: var(--fg-muted);
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .field-required {
    color: var(--accent-expense);
    margin-left: 2px;
  }

  .field-hint {
    display: block;
    font-size: 11px;
    color: var(--fg-faint);
    margin-top: 4px;
  }
`;

export default Field;
