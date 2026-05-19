import React, { useEffect } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import History from "../../History/History";
import { InnerLayout } from "../../styles/Layouts";
import PieChart from "../Chart/PieChart";
import Spinner from "../Spinner/Spinner";
import { formatRupee } from "../../utils/currency";
import { refresh } from "../../utils/Icons";

function Dashboard() {
  const {
    totalExpenses,
    totalIncome,
    totalBalance,
    getIncomes,
    getExpenses,
    getTransfers,
    outstandingLent,
    netCash,
    loading,
    refreshAll,
  } = useGlobalContext();

  useEffect(() => {
    getIncomes();
    getExpenses();
    getTransfers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading)
    return (
      <DashboardStyled>
        <InnerLayout>
          <div className="top">
            <h3>Dashboard</h3>
            <button
              className="reload-mobile"
              onClick={refreshAll}
              title="Reload data"
              aria-label="Reload data"
            >
              {refresh}
            </button>
          </div>
          <Spinner />
        </InnerLayout>
      </DashboardStyled>
    );

  return (
    <DashboardStyled>
      <InnerLayout>
        <div className="top">
          <h3>Dashboard</h3>
          <button
            className="reload-mobile"
            onClick={refreshAll}
            title="Reload data"
            aria-label="Reload data"
          >
            {refresh}
          </button>
          <div className="stats-con">
            <PieChart />
          </div>
        </div>
        <div className="no-graph">
          <div className="amount-con">
            <div className="income">
              <h2>Total Income</h2>
              <p>{formatRupee(totalIncome())}</p>
            </div>
            <div className="expense">
              <h2>Total Expense</h2>
              <p>{formatRupee(totalExpenses())}</p>
            </div>
            <div className="balance">
              <h2>Savings</h2>
              <p>{formatRupee(totalBalance())}</p>
            </div>
            <div className="lending">
              <h2>Outstanding Lending</h2>
              <p>{formatRupee(outstandingLent())}</p>
            </div>
            <div className="netcash">
              <h2>Bank Balance</h2>
              <p>{formatRupee(netCash())}</p>
            </div>
          </div>
          <div className="history-con">
            <History />
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
    width: 0.7rem;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 1rem;
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
      width: 100%;
      margin-top: 0.5rem;
    }
    .reload-mobile {
      display: none;
    }
  }
  .no-graph {
    /* margin: -0.5rem; */
    .amount-con {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 0.6rem;
      margin-top: 2rem;
      color: rgb(255, 255, 255);
      .income,
      .expense,
      .balance,
      .lending,
      .netcash {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: rgb(49, 54, 60);
        border: 0.1rem solid rgb(69, 69, 69);
        border-radius: 1rem;
        padding: 0.6rem;
        text-align: center;
        h2 {
          font-size: 1rem;
          font-weight: 600;
        }
        p {
          font-size: 1.2rem;
          font-weight: 500;
          opacity: 0.8;
        }
      }
      .income p {
        color: var(--color-green);
      }
      .expense p {
        color: rgb(255, 30, 0);
      }
      .balance p {
        color: #fff;
      }
      .lending p {
        color: #ff8b8b;
      }
      .netcash p {
        color: #6fa8dc;
      }
    }

    .history-con {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin: 1rem;
      h2 {
        margin: 1rem 0;
        font-size: 1.5rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: space-between;
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
    }
  }
  @media (max-width: 730px) {
    .no-graph {
      .amount-con {
        grid-template-columns: repeat(2, 1fr);
        .expense,
        .income,
        .balance,
        .lending,
        .netcash {
          h2 {
            font-size: 0.9rem;
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
  @media (max-width: 920px) {
    &::-webkit-scrollbar {
      width: 0rem;
    }
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
      .reload-mobile {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        right: 0;
        height: 3.5rem;
        padding: 0 0.5rem 0 1rem;
        background: transparent;
        border: none;
        color: #fff;
        font-size: 1.1rem;
        cursor: pointer;
        z-index: 1001;
      }
    }
    .top {
      .stats-con {
        margin: 1.5rem 1rem 0;
        width: calc(100% - 2rem);
      }
    }
    .no-graph {
      .amount-con {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem;
        margin: 1rem;
      }
    }
  }
  /* @media (max-width: 425px) {
    .top {
      .stats-con .line {
        padding-top: 1.5rem;
      }
    }
  } */
  @media (max-width: 425px) {
    .no-graph {
      .amount-con {
        .expense,
        .income,
        .balance,
        .lending,
        .netcash {
          padding: 0.5rem;
          border-radius: 0.8rem;
        }
      }
    }
  }

  @media (max-width: 375px) {
    .no-graph {
      .amount-con {
        .expense,
        .income,
        .balance,
        .lending,
        .netcash {
          border-radius: 0.8rem;
          h2 {
            font-size: 0.7rem;
            font-weight: 500;
          }
          p {
            font-size: 0.9rem;
            font-weight: 500;
          }
        }
      }
    }
  }
  @media (max-width: 320px) {
    .no-graph {
      .amount-con {
        gap: 0.2rem;
        margin: 0.6rem;
        .expense,
        .income,
        .balance,
        .lending,
        .netcash {
          h2 {
            font-size: 0.6rem;
            font-weight: 600;
          }
          p {
            font-size: 0.8rem;
            font-weight: 500;
          }
        }
      }
    }
  }
`;

export default Dashboard;
