import React, { useEffect } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import { InnerLayout } from "../../styles/Layouts";
import Form from "../Form/Form";
import IncomeItem from "../IncomeItem/IncomeItem";

function Income() {
  const { incomes, getIncomes, deleteIncome, totalIncome } = useGlobalContext();

  useEffect(() => {
    getIncomes();
  }, []);
  return (
    <IncomeStyled>
      <InnerLayout>
        <div className="top">
        <h3>Incomes</h3></div>
        <h3 className="total-income">
          Total Income: <span>₹{totalIncome()}</span>
        </h3>
        <div className="income-content">
          <div className="form-container">
            <Form />
          </div>
          <div className="inc-cont">
            <div className="incomes">
              {incomes.map((income) => {
                const {
                  _id,
                  title,
                  amount,
                  date,
                  category,
                  description,
                  type,
                } = income;
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
                    indicatorColor="var(--color-green)"
                    deleteItem={deleteIncome}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </InnerLayout>
    </IncomeStyled>
  );
}

const IncomeStyled = styled.div`
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
      color: var(--color-green);
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
    .inc-cont {
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
        /* align-items: flex-start; */
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

        }
      }

    }
    @media (min-width: 1024px) {
      .income-content{
        .form-container{
           /* width:50rem; */
        }
      }
   
  }
`;

export default Income;
