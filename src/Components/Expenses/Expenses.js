import React, { useEffect } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import { InnerLayout } from "../../styles/Layouts";
import IncomeItem from "../IncomeItem/IncomeItem";
import ExpenseForm from "./ExpenseForm";

function Expenses() {
  const { expenses, getExpenses, deleteExpense, totalExpenses } =
    useGlobalContext();

  useEffect(() => {
    getExpenses();
  }, []);
  return (
    <ExpenseStyled>
      <InnerLayout>
        <div className="top">
        <h3>Expenses</h3></div>
        <h3 className="total-income">
          Total Expense: <span>₹{totalExpenses()}</span>
        </h3>
        <div className="income-content">
          <div className="form-container">
            <ExpenseForm />
          </div>
          <div className="exp-cont">
            <div className="incomes">
              {expenses.map((income) => {
                const {
                  _id,
                  title,
                  amount,
                  date,
                  category,
                  description,
                  type,
                } = income;
                // console.log(income);
                // console.log(_id);
                return (
                  <IncomeItem
                    key={_id}
                    id={_id}
                    title={title}
                    description={description}
                    amount={amount}
                    date={date}
                    type={type}
                    category={category}
                    indicatorColor="rgb(196,2,1)"
                    deleteItem={deleteExpense}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </InnerLayout>
    </ExpenseStyled>
  );
}

const ExpenseStyled = styled.div`
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0;
  }
  scroll-behavior: smooth;
  height: 100%;
  .top{
  h3 {
    padding-left: 1rem;
    padding-bottom: 0.5rem;
    font-weight: 600;
  }}

  .total-income {
    margin: 0rem;
    padding: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgb(49, 54, 60);
    border: 0.1rem solid rgb(69, 69, 69);
    // box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    border-radius: 1rem;
    font-size: 1.5rem;
    font-weight: 500;
    gap: 0.5rem;
    color: #fff;
    span {
      font-size: 1.5rem;
      font-weight: 600;
      color: rgb(196, 2, 1);
    }
  }
  .income-content {
    padding-top: 1.5rem;
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    .form-container {
      width: 40%;
    }
    /* overflow: hidden; */
    .exp-cont {
      width: 99%;
      .incomes {
        flex: 1;
        overflow: auto;
        &::-webkit-scrollbar {
          width: 0;
        }
        scroll-behavior: smooth;
        height: 25rem;
      }
    }
  }
  @media (max-width: 920px) {
    width: 100vw;
    overflow-x: hidden;
    .top{
      width: 100vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-bottom: 1.5rem;
      h3{
        background-color: black;
        padding: 1rem;
        padding-top: 1.5rem;
        width: 100%;
        text-align: center;
        position: absolute;
        z-index: 1000;
        margin-top: -3.5rem;
        margin-left: -2rem;
        border-bottom-right-radius: 1rem;
        border-bottom-left-radius: 1rem;
      }
    }
    }
    @media (max-width: 425px) {      
      .income-content{
        display: flex;
        flex-direction: column;
        /* justify-content: center; */
        align-items: center;
        .inc-cont{
          .incomes{
          /* width: 90%; */
          /* margin: 1rem; */
        }
        }
        .form-container{
          margin-left: -6rem;
        }
      }
      .total-income{
        font-size: 1.2rem;
        span{
          font-size: 1.2rem;

        }}

    }
`;

export default Expenses;
