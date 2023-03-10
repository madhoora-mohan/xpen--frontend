import React, { useEffect } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import History from "../../History/History";
import { InnerLayout } from "../../styles/Layouts";
import Chart from "../Chart/Chart";
import ExpenseBar from "../Chart/ExpenseBar";
import PieChart from "../Chart/PieChart";
import IncomeBar from "../Chart/IncomeBar";

function Dashboard() {
  const {
    totalExpenses,
    incomes,
    expenses,
    totalIncome,
    totalBalance,
    getIncomes,
    getExpenses,
    // expCat,
  } = useGlobalContext();

  useEffect(() => {
    getIncomes();
    getExpenses();
    // getExpensesWCategory();
  }, []);
  // console.log("heyyy " + getExpensesWCategory);

  // getExpenses().forEach((element) => {
  //   console.log(element);
  // });

  return (
    <DashboardStyled>
      <InnerLayout>
        <div className="top">
          <h3>Dashboard</h3>
          <div className="stats-con">
            <div className="chart-con line">
              <Chart />
            </div>
            <div className="chart-con">
              <PieChart />
            </div>
            <div className="chart-con">
              <ExpenseBar />
            </div>
            <div className="chart-con">
              <IncomeBar />
            </div>
          </div>
        </div>
        <div className="no-graph">
          <div className="amount-con">
            <div className="income">
              <h2>Total Income</h2>
              <p>₹ {totalIncome()}</p>
            </div>
            <div className="expense">
              <h2>Total Expense</h2>
              <p>₹ {totalExpenses()}</p>
            </div>
            <div className="balance">
              <h2>Savings</h2>
              <p>₹ {totalBalance()}</p>
            </div>
          </div>
          <div className="history-con">
            <History />
            <h2 className="salary-title">
              Min <span>Income</span>Max
            </h2>
            <div className="salary-item">
              <p>₹{Math.min(...incomes.map((item) => item.amount))}</p>
              <p>₹{Math.max(...incomes.map((item) => item.amount))}</p>
            </div>
            <h2 className="salary-title">
              Min <span>Expense</span>Max
            </h2>
            <div className="salary-item">
              <p>₹{Math.min(...expenses.map((item) => item.amount))}</p>
              <p>₹{Math.max(...expenses.map((item) => item.amount))}</p>
            </div>
          </div>
        </div>
      </InnerLayout>
    </DashboardStyled>
  );
}

const DashboardStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  /* padding: 1rem; */
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 0;
  }
  scroll-behavior: smooth;
  height: 100%;
  /* width: 50%; */
  .top {
    h3 {
      /* padding-left: 0.5rem;
      padding-bottom: 0.5rem; */
      font-size: 1.5rem;
      font-weight: 600;
    }
    .stats-con {
      display: grid;
      grid-template-rows: repeat(2, 50%);
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      .chart-con {
        grid-column: span 2;
      }
    }
  }
  .no-graph {
    /* margin: -0.5rem; */
    .amount-con {
      display: flex;
      justify-content: space-between;
      /* gap: 0.5rem; */
      margin-top: 2rem;
      color: rgb(255, 255, 255);
      .income {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 33%;
        background: rgb(49, 54, 60);
        border: 0.1rem solid rgb(69, 69, 69);
        border-radius: 1rem;
        padding: 1rem;
        h2 {
          font-size: 1.2rem;
          font-weight: 600;
        }
        p {
          font-size: 1.5rem;
          font-weight: 500;
          color: var(--color-green);
          opacity: 0.6;
        }
      }
      .expense {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 33%;
        align-items: center;
        background: rgb(49, 54, 60);
        border: 0.1rem solid rgb(69, 69, 69);
        border-radius: 1rem;
        padding: 0.4rem;
        h2 {
          font-size: 1.2rem;
          font-weight: 600;
        }
        p {
          color: rgb(255, 30, 0);
          opacity: 0.6;
          font-size: 1.5rem;
          font-weight: 500;
        }
      }

      .balance {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 33%;
        background: rgb(49, 54, 60);
        border: 0.1rem solid rgb(69, 69, 69);
        border-radius: 1rem;
        padding: 0.4rem;
        h2 {
          font-size: 1.2rem;
          font-weight: 600;
        }
        p {
          color: #fff;
          opacity: 0.6;
          font-size: 1.5rem;
          font-weight: 500;
        }
      }
    }

    .history-con {
      display: flex;
      flex-direction: column;
      h2 {
        margin: 1rem 0;
        font-size: 1.5rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .salary-title {
        padding: 10px;
        font-size: 1.1rem;
        span {
          font-size: 1.5rem;
          // font-weight: 600;
        }
      }
      .salary-item {
        background: rgb(49, 54, 60);
        border: 0.1rem solid rgb(69, 69, 69);
        border-radius: 0.8rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        p {
          padding: 0.5rem;
          color: #fff;
          opacity: 0.8;
          font-weight: 400;
          font-size: 1.3rem;
        }
      }
    }
  }
  @media (max-width: 1000px) {
    .top {
      display: flex;
      flex-direction: column;
      align-items: center;
      h3 {
        padding-bottom: 1rem;
        padding-left: 0rem;
      }
      .stats-con {
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        gap: 2.5rem;
        width: 100%;
      }
    }
  }
  @media (max-width: 730px) {
    .no-graph {
      .amount-con {
        .expense,
        .income,
        .balance {
          h2 {
            font-size: 1rem;
            font-weight: 600;
          }
          p {
            font-size: 1.2rem;
            font-weight: 500;
          }
        }
      }
    }
  }
  @media (max-width: 920px) {
    width: 100vw;
    padding-left: 0rem;
    margin-left: 0rem;
    /* overflow: hidden; */
    .top {
      width: 100vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      /* justify-content: center; */
      /* margin-left: -0.5rem; */
      h3 {
        background-color: black;
        padding: 1rem;
        width: 100%;
        text-align: center;
        position: absolute;
        z-index: 1000;
        border: 0.1rem solid rgb(69, 69, 69);
        margin-top: -3.5rem;
        /* margin-left: -0.5rem; */
        border-bottom-right-radius: 1rem;
        border-bottom-left-radius: 1rem;
      }
      .stats-con {
        width: 95vw;
      }
      .stats-con .line {
        padding-top: 2rem;
      }
    }
  }
  @media (max-width: 425px) {
    .top {
      .stats-con .line {
        padding-top: 1.5rem;
      }
    }
  }
@media (max-width: 425px) {
  .no-graph {
      .amount-con {
        .expense,
        .income,
        .balance {
          padding: 0.5rem;}}}
}

  @media (max-width: 375px) {
    .no-graph {
      .amount-con {
        .expense,
        .income,
        .balance {
          border-radius: 0.8rem;
          h2 {
            font-size: 1rem;
            font-weight: 600;
          }
          p {
            font-size: 1rem;
            font-weight: 500;
          }
        }
      }
    }

  }
  @media (max-width: 320px) {
    .no-graph {
      .amount-con {
        .expense,
        .income,
        .balance {
          h2 {
            font-size: 0.8rem;
            font-weight: 600;
          }
          p {
            font-size: 0.9rem;
            font-weight: 500;
          }
        }
      }
    }

  }
`;

export default Dashboard;