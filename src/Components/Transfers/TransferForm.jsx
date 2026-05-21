import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import Button from "../Button/Button";
import { plus } from "../../utils/Icons";
import { TRANSFER, getCategory } from "../../config/categories";
import CategorySelect from "../CategorySelect/CategorySelect";
import FormStyled from "../Form/FormStyled";
import Field from "../Form/Field";

function TransferForm() {
  const emailid = localStorage.getItem("email");
  const { addTransfer, error, setError } = useGlobalContext();

  const empty = {
    email: emailid,
    title: "",
    amount: "",
    date: null,
    category: "",
    description: "",
    direction: "out",
  };
  const [inputState, setInputState] = useState(empty);
  const { title, amount, date, category, description, direction } = inputState;
  const isDirectionLocked = ["lending_money", "lent_money"].includes(category);

  useEffect(() => {
    if (!category) return;
    const def = getCategory("transfer", category).defaultDirection;
    if (def) {
      setInputState((s) => ({ ...s, direction: def }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const handleInput = (name) => (e) => {
    setInputState({ ...inputState, [name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError("Title is required.");
    if (!amount || Number(amount) <= 0)
      return setError("Amount must be greater than zero.");
    if (!date) return setError("Date is required.");
    if (!category) return setError("Category is required.");
    if (direction !== "in" && direction !== "out")
      return setError("Direction is required.");
    await addTransfer(inputState);
    setInputState({ ...empty, email: emailid });
  };

  return (
    <FormStyled onSubmit={handleSubmit}>
      <Field label="Title" required>
        <input
          type="text"
          className="input"
          value={title}
          name="title"
          placeholder="e.g. Loan to A"
          onChange={handleInput("title")}
        />
      </Field>
      <div className="field-row-2">
        <Field label="Amount" required>
          <input
            type="number"
            className="input"
            value={amount}
            name="amount"
            placeholder="0"
            onChange={handleInput("amount")}
          />
        </Field>
        <Field label="Date" required>
          <DatePicker
            id="date"
            placeholderText="DD / MM / YYYY"
            selected={date}
            dateFormat="dd/MM/yyyy"
            onChange={(d) => {
              setInputState({ ...inputState, date: d });
              setError("");
            }}
          />
        </Field>
      </div>
      <Field label="Type" required>
        <CategorySelect
          options={TRANSFER}
          value={category}
          onChange={(id) => {
            setInputState({ ...inputState, category: id });
            setError("");
          }}
          placeholder="Select transfer type"
        />
      </Field>
      <Field label="Direction">
        <DirectionRow>
          <button
            type="button"
            className={direction === "out" ? "dir-btn active" : "dir-btn"}
            onClick={() =>
              !isDirectionLocked && setInputState({ ...inputState, direction: "out" })
            }
            disabled={isDirectionLocked}
          >
            Money out
          </button>
          <button
            type="button"
            className={direction === "in" ? "dir-btn active" : "dir-btn"}
            onClick={() =>
              !isDirectionLocked && setInputState({ ...inputState, direction: "in" })
            }
            disabled={isDirectionLocked}
          >
            Money in
          </button>
        </DirectionRow>
      </Field>
      <Field label="Description">
        <input
          name="description"
          type="text"
          className="input"
          value={description}
          placeholder="Add a short note (optional)"
          onChange={handleInput("description")}
        />
      </Field>
      {error && <p className="error_msg">{error}</p>}
      <div className="submit-btn">
        <Button name="Add transfer" icon={plus} variant="primary" size="lg" block type="submit" />
      </div>
    </FormStyled>
  );
}

const DirectionRow = styled.div`
  display: flex;
  gap: 4px;
  background: var(--bg-deep);
  padding: 4px;
  border-radius: var(--r-sm);
  border: 1px solid var(--line);

  .dir-btn {
    flex: 1;
    padding: 8px 12px;
    border-radius: 6px;
    border: 0;
    background: transparent;
    color: var(--fg-muted);
    font-family: inherit;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    min-height: 36px;
    transition: background 120ms, color 120ms, box-shadow 120ms;

    &.active {
      background: var(--bg-surface);
      color: var(--fg);
      box-shadow: inset 0 0 0 1px var(--line);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
`;

export default TransferForm;
