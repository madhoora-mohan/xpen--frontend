import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from "../../context/globalContext";
import Button from "../Button/Button";
import { plus } from "../../utils/Icons";
import FormStyled from "../Form/FormStyled";

function ExpenseForm() {
  const emailid = localStorage.getItem("email");
  // const user = localStorage.getItem("username"); // used for email alert (see FUTURE_TODOS.md)
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
    await addExpense(inputState);
    if (limits > totalBalance() - inputState.amount) {
      setError(
        "Your Savings are dropping below your set Limit!! Reduce Your Expenses!!"
      );

      // TODO: re-enable email alert once emailjs is set up (see FUTURE_TODOS.md)
      // if (window.Email) {
      //   window.Email.send({
      //     SecureToken: process.env.REACT_APP_SMTP_TOKEN,
      //     To: emailid,
      //     From: process.env.REACT_APP_SMTP_FROM,
      //     Subject: "Your Savings are dropping " + user,
      //     Body:
      //       "Your Savings are dropping below your set limit of " +
      //       limits +
      //       "!! Try to limit your expenses!!",
      //   }).then(() =>
      //     alert(
      //       "Your Savings are dropping below your set Limit!! Try to limit your expenses!!"
      //     )
      //   );
      // }
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
    <FormStyled onSubmit={handleSubmit}>
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
          type="number"
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
          bg={"var(--color-accent)"}
          color={"#fff"}
        />
      </div>
    </FormStyled>
  );
}

export default ExpenseForm;
