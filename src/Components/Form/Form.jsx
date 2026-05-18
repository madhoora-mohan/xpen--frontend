import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from "../../context/globalContext";
import Button from "../Button/Button";
import { plus } from "../../utils/Icons";
import { INCOME } from "../../config/categories";
import CategorySelect from "../CategorySelect/CategorySelect";
import FormStyled from "./FormStyled";

function Form() {
  const emailid = localStorage.getItem("email");
  const { addIncome, error, setError } = useGlobalContext();
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
    // setError("");
  };

  const handleSubmit = (e) => {
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
    addIncome(inputState);
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
          placeholder="Income Title*"
          onChange={handleInput("title")}
        />
      </div>
      <div className="input-control">
        <input
          value={amount}
          type="number"
          name={"amount"}
          placeholder={"Income Amount*"}
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
      <div className="input-control">
        <CategorySelect
          options={INCOME}
          value={category}
          onChange={(id) => setInputState({ ...inputState, category: id })}
          placeholder="Select Income Category*"
        />
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
      </div>

      <div className="submit-btn">
        <Button
          name={"Add Income"}
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

export default Form;
