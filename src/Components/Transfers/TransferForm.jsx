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

function TransferForm() {
  const emailid = localStorage.getItem("email");
  const { addTransfer, error, setError } = useGlobalContext();

  const empty = {
    email: emailid,
    title: "",
    amount: "",
    date: "",
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
      {error && <p className="error_msg">{error}</p>}
      <div className="input-control">
        <input
          type="text"
          value={title}
          name="title"
          placeholder="Transfer Title*"
          onChange={handleInput("title")}
        />
      </div>
      <div className="input-control">
        <input
          value={amount}
          type="number"
          name="amount"
          placeholder="Transfer Amount*"
          onChange={handleInput("amount")}
        />
      </div>
      <div className="input-control">
        <DatePicker
          id="date"
          placeholderText="Enter A Date*"
          selected={date}
          dateFormat="dd/MM/yyyy"
          onChange={(d) => setInputState({ ...inputState, date: d })}
        />
      </div>
      <div className="input-control">
        <CategorySelect
          options={TRANSFER}
          value={category}
          onChange={(id) => setInputState({ ...inputState, category: id })}
          placeholder="Select Transfer Category*"
        />
      </div>
      <DirectionRow>
        <button
          type="button"
          className={direction === "out" ? "dir-btn active" : "dir-btn"}
          onClick={() => !isDirectionLocked && setInputState({ ...inputState, direction: "out" })}
          disabled={isDirectionLocked}
        >
          Money Out
        </button>
        <button
          type="button"
          className={direction === "in" ? "dir-btn active" : "dir-btn"}
          onClick={() => !isDirectionLocked && setInputState({ ...inputState, direction: "in" })}
          disabled={isDirectionLocked}
        >
          Money In
        </button>
      </DirectionRow>
      <div className="input-control">
        <input
          name="description"
          type="text"
          value={description}
          placeholder="Add A Short Description"
          className="desc"
          onChange={handleInput("description")}
        />
      </div>
      <div className="submit-btn">
        <Button
          name="Add Transfer"
          icon={plus}
          bPad=".5rem 1rem"
          bRad="1.5rem"
          bg="var(--color-accent)"
          color="#fff"
        />
      </div>
    </FormStyled>
  );
}

const DirectionRow = styled.div`
  display: flex;
  gap: 0.5rem;
  .dir-btn {
    flex: 1;
    padding: 0.6rem;
    border-radius: 0.8rem;
    border: 0.1rem solid rgb(69, 69, 69);
    background: rgb(86, 88, 88);
    color: rgba(255, 255, 255, 0.6);
    font-family: inherit;
    font-size: 0.95rem;
    cursor: pointer;
    &.active {
      background: var(--color-accent);
      color: #fff;
      opacity: 1;
    }
    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
`;

export default TransferForm;
