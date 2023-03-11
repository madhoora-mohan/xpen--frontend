import React, { useState } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from "../../context/globalContext";
import Button from "../Button/Button";
import { plus } from "../../utils/Icons";

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
          <option value="salary">Salary</option>
          <option value="freelancing">Freelancing</option>
          <option value="investments">Investments</option>
          <option value="stocks">Stocks</option>
          <option value="crypto">Crypto</option>
          <option value="loan">Loan</option>
          <option value="pocketmoney">Pocket Money</option>
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
          name={"Add Income"}
          icon={plus}
          bPad={".5rem 1rem"}
          bRad={"1.5rem"}
          bg={"var(--color-accent"}
          color={"#fff"}
        />
      </div>
    </FormStyled>
  );
}

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
export default Form;
