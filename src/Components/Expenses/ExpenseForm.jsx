import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from "../../context/globalContext";
import Button from "../Button/Button";
import { plus } from "../../utils/Icons";
import { EXPENSE } from "../../config/categories";
import CategorySelect from "../CategorySelect/CategorySelect";
import FormStyled from "../Form/FormStyled";
import Field from "../Form/Field";

function ExpenseForm() {
  const emailid = localStorage.getItem("email");
  const { addExpense, error, setError } = useGlobalContext();
  const empty = {
    email: emailid,
    title: "",
    amount: "",
    date: null,
    category: "",
    description: "",
  };
  const [inputState, setInputState] = useState(empty);

  const { title, amount, date, category, description } = inputState;

  const handleInput = (name) => (e) => {
    setInputState({ ...inputState, [name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }
    if (!date) {
      setError("Date is required.");
      return;
    }
    if (!category) {
      setError("Category is required.");
      return;
    }
    const numericAmount = Number(amount);
    await addExpense({ ...inputState, amount: numericAmount });
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
          placeholder="e.g. Lunch with team"
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
      <Field label="Category" required>
        <CategorySelect
          options={EXPENSE}
          value={category}
          onChange={(id) => {
            setInputState({ ...inputState, category: id });
            setError("");
          }}
          placeholder="Select expense category"
        />
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
        <Button name="Add expense" icon={plus} variant="primary" size="lg" block type="submit" />
      </div>
    </FormStyled>
  );
}

export default ExpenseForm;
