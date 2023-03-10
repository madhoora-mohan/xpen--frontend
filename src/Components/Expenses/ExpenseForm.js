import React, { useState } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from "../../context/globalContext";
import Button from "../Button/Button";
import { plus } from "../../utils/Icons";

function ExpenseForm() {
  const emailid = localStorage.getItem("email");
  const user = localStorage.getItem("username");
  const { addExpense, error, setError, totalBalance, limits, getLimit } =
    useGlobalContext();
  const [inputState, setInputState] = useState({
    email: emailid,
    title: "",
    amount: "",
    date: "",
    category: "",
    description: "",
  });

  const { title, amount, date, category, description } = inputState;

  const handleInput = (name) => (e) => {
    setInputState({ ...inputState, [name]: e.target.value });
    setError("");
    getLimit();
    // console.log(inputState);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addExpense(inputState);
    // console.log(inputState);
    // console.log(limits, totalBalance());
    if (limits > totalBalance() - inputState.amount) {
      // console.log(limits, totalBalance());
      setError(
        "Your Savings are dropping below your set Limit!! Reduce Your Expenses!!"
      );

      window.Email.send({
        SecureToken: "8d1d2a07-af18-472b-a490-3cd0d83c0978",
        To: emailid,
        From: "madhooramohan.s2003@gmail.com",
        Subject: "Your Savings are dropping " + user,
        Body:
          "Your Savings are dropping below your set limit of " +
          limits +
          "!! Try to limit your expenses!!",
      }).then((message) =>
        alert(
          "Your Savings are dropping below your set Limit!! Try to limit your expenses!!"
        )
      );
    }
    setInputState({
      email: emailid,
      title: "",
      amount: "",
      date: "",
      category: "",
      description: "",
    });
  };
  return (
    <ExpenseFormStyled onSubmit={handleSubmit}>
      {error && <p className="error_msg">{error}</p>}
      <div className="input-control">
        <input
          type="text"
          value={title}
          name={"title"}
          placeholder="Expense Title*"
          onChange={handleInput("title")}
        />
      </div>
      <div className="input-control">
        <input
          value={amount}
          type="Number"
          name={"amount"}
          placeholder={"Expense Amount*"}
          onChange={handleInput("amount")}
        />
      </div>
      <div className="input-control">
        <DatePicker
          id="date"
          placeholderText="Enter A Date*"
          selected={date}
          dateFormat="dd/MM/yyyy"
          onChange={(date) => {
            setInputState({ ...inputState, date: date });
          }}
        />
      </div>
      <div className="selects input-control">
        <select
          required
          value={category}
          name="category"
          id="category"
          onChange={handleInput("category")}
        >
          <option value="" disabled>
            Select Option*
          </option>

          <option value="education">Education</option>
          <option value="groceries">Groceries</option>
          <option value="health">Health</option>
          <option value="subscriptions">Subscriptions</option>
          <option value="takeaways">Takeouts</option>
          <option value="shopping">Shopping</option>
          <option value="travelling">Travelling</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="input-control">
        <input
          name="description"
          type="text"
          value={description}
          placeholder="Add A Short Description"
          // id="description"
          // cols="15"
          // rows="2"
          className="desc"
          onChange={handleInput("description")}
        ></input>
        <h5 className="input-control">* - Required fields</h5>
      </div>
      <div className="submit-btn">
        <Button
          name={"Add Expense"}
          icon={plus}
          bPad={".5rem 1rem"}
          bRad={"1.5rem"}
          bg={"var(--color-accent"}
          color={"#fff"}
        />
      </div>
    </ExpenseFormStyled>
  );
}

const ExpenseFormStyled = styled.form`
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
export default ExpenseForm;
