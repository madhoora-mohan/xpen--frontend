import React, { useEffect } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import { InnerLayout } from "../../styles/Layouts";
import IncomeItem from "../IncomeItem/IncomeItem";
import TransferForm from "./TransferForm";
import Spinner from "../Spinner/Spinner";
import { formatRupee } from "../../utils/currency";
import { refresh } from "../../utils/Icons";

function Transfers() {
  const {
    transfers,
    getTransfers,
    deleteTransfer,
    outstandingLent,
    loading,
    refreshAll,
  } = useGlobalContext();

  useEffect(() => {
    getTransfers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading)
    return (
      <TransferStyled>
        <InnerLayout>
          <div className="top">
            <h3>Transfers</h3>
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
      </TransferStyled>
    );

  return (
    <TransferStyled>
      <InnerLayout>
        <div className="top">
          <h3>Transfers</h3>
          <button
            className="reload-mobile"
            onClick={refreshAll}
            title="Reload data"
            aria-label="Reload data"
          >
            {refresh}
          </button>
        </div>
        <h3 className="summary-line">
          Outstanding Lending: <span>{formatRupee(outstandingLent())}</span>
        </h3>
        <div className="income-content">
          <div className="form-container">
            <TransferForm />
          </div>
          <div className="inc-cont">
            <div className="incomes">
              {transfers.map((t) => (
                <IncomeItem
                  key={t._id}
                  id={t._id}
                  title={t.title}
                  description={t.description}
                  amount={t.amount}
                  date={t.date}
                  type="transfer"
                  direction={t.direction}
                  category={t.category}
                  indicatorColor="var(--color-accent)"
                  deleteItem={deleteTransfer}
                />
              ))}
            </div>
          </div>
        </div>
      </InnerLayout>
    </TransferStyled>
  );
}

const TransferStyled = styled.div`
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0;
  }
  scroll-behavior: smooth;
  height: 100%;
  .top h3 {
    padding-left: 1rem;
    padding-bottom: 0.5rem;
    font-weight: 600;
  }
  .top .reload-mobile {
    display: none;
  }
  .summary-line {
    margin: 0;
    padding: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgb(49, 54, 60);
    border: 0.1rem solid rgb(69, 69, 69);
    border-radius: 1rem;
    font-size: 1.5rem;
    font-weight: 500;
    gap: 0.5rem;
    color: #fff;
    span {
      font-size: 1.5rem;
      font-weight: 600;
      color: #6fa8dc;
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
    .top {
      width: 100vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-bottom: 1.5rem;
      h3 {
        background-color: black;
        padding: 1rem;
        padding-top: 1.5rem;
        width: 100%;
        text-align: center;
        position: absolute;
        z-index: 1000;
        margin-top: -3.5rem;
        margin-left: -2rem;
        border: 0.1rem solid rgb(69, 69, 69);
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
  }
  @media (max-width: 425px) {
    .income-content {
      display: flex;
      flex-direction: column;
      .form-container {
        margin-left: -6rem;
      }
    }
    .summary-line {
      font-size: 1.2rem;
      span {
        font-size: 1.2rem;
      }
    }
  }
`;

export default Transfers;
