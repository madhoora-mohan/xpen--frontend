import React from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import { InnerLayout } from "../../styles/Layouts";
import Button from "../Button/Button";
import { plus } from "../../utils/Icons";
import { useState, useEffect } from "react";

function Limit() {
  const { totalBalance, limits, getLimit, updateLimit, error, setError } =
    useGlobalContext();
  // const [error, setError] = useState("");
  const [inputState, setInputState] = useState({
    limit: "",
  });
  useEffect(() => {
    getLimit();
  }, []);
  useEffect(() => {
    totalBalance();
  }, []);
  // console.log(limits);
  const { limit } = inputState;
  // console.log(inputState);

  const handleInput = (name) => (e) => {
    setInputState({ ...inputState, [name]: e.target.value });
    // console.log(inputState);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (totalBalance() < limit) {
      setError(
        "Your Savings are dropping below your set Limit!! Reduce Your Expenses!!"
      );
    }
    // setError("");

    // console.log("HIIIIII CHELLAM");
    // updateLimit(inputState.limit);
    // Number(inputState.limit);
    // console.log(parseInt(inputState.limit, 10), "yo");
    if (parseInt(inputState.limit, 10) > 0) {
      const ans = updateLimit(parseInt(inputState.limit, 10)).then(
        (response) => {
          // setError("");
        }
      );
    }
    setInputState({
      limit: "",
    });
  };
  if (inputState.limit < 0) {
    setError("Limit must be a positive number!");
  }
  return (
    <LimitStyled>
      <InnerLayout>
        <div className="top">
          <h3>Set Limit</h3>
        </div>
        <h3 className="total-income">
          Savings: <span>₹{totalBalance()}</span>
        </h3>
      </InnerLayout>
      <div className="center">
        <div className="limiter">
          <h3>Set Minimum Limit</h3>
          <h4>Current Limit: {limits}</h4>
          {error && <p className="error_msg">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="number"
              value={limit}
              name={"limit"}
              placeholder="Limit"
              onChange={handleInput("limit")}
              // onChange={(e) => {
              //   setInputState(e.target.value);
              // }}
            />
            <div className="submit-btn">
              <Button
                name={"Set limit"}
                icon={plus}
                bPad={".6rem 1.6rem"}
                bRad={"1.5rem"}
                bg={"var(--color-accent"}
                color={"#fff"}
              />
            </div>
          </form>
        </div>
      </div>
    </LimitStyled>
  );
}

const LimitStyled = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  /* justify-content: center; */
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 0;
  }
  scroll-behavior: smooth;
  height: 100%;
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
  .top {
    h3 {
      padding-left: 1rem;
      padding-bottom: 0.5rem;
      font-size: 1.4rem;
      font-weight: 600;
      display: flex;
      justify-content: center;
    }
  }
  .total-income {
    display: flex;
    justify-content: center;
    /* align-items: center; */
    background: rgb(49, 54, 60);
    border: 0.1rem solid rgb(69, 69, 69);
    // box-shadow: 0rem 1px 15px rgba(0, 0, 0, 0.06);
    border-radius: 1rem;
    padding: 0.5rem;
    font-weight: 600;
    font-size: 1.3rem;
    gap: 0.5rem;
    span {
      font-size: 1.3rem;
      font-weight: 600;
    }
  }
  .center {
    display: flex;
    justify-content: center;
    /* text-align: center; */
    align-items: center;
    .limiter {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 50%;
      /* height: fit-content; */
      background: rgb(49, 54, 60);
      border: 0.1rem solid rgb(69, 69, 69);
      // box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
      border-radius: 1rem;
      padding: 0.5rem;
      margin: 1rem 0;
      gap: 1rem;
      h3 {
        padding-bottom: 1rem;
        font-weight: 600;
        font-size: 1.3rem;
      }
      h4 {
        font-weight: 600;
        font-size: 1rem;
      }
      form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 1rem 0;
        font-size: 2rem;
        gap: 1.5rem;
      }

      input {
        width: 80%;
        border-radius: 1rem;
        border: 0.1rem solid rgb(88, 88, 88);
        font-size: 1.2rem;
        color: rgba(255, 255, 255, 0.6);
        background: rgb(69, 69, 69);
        padding: 0.5rem;

        &::placeholder {
          color: rgb(91, 94, 97);
        }
      }
      .submit-btn {
        button {
          justify-content: center;
          font-size: 0.8rem;
          &:hover {
            background: var(--color-green) !important;
          }
        }
      }
    }
  }
  @media (max-width: 920px) {
    width: 100vw;
    .top {
      width: 100vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-bottom: 1.5rem;
      h3 {
        background-color: black;
        padding: 1rem;
        padding-top: 1.3rem;
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
  @media (max-width: 1440px) {
    .center {
      padding: 0rem;
      margin: 0rem;
      .limiter {
        width: 30%;
        h3 {
          font-size: 1.2rem;
        }
        h4 {
          font-size: 1.2rem;
        }
        form {
          input {
            padding: 0.6rem;
          }
        }
      }
    }
  }
  @media (max-width: 425px) {
    .center {
      .limiter {
        width: 60% !important;
        h3 {
          font-size: 1rem;
        }
        h4 {
          font-size: 0.8rem;
        }
        form {
          input {
            font-size: 1rem;
            padding: 0.4rem;
          }
        }
      }
    }
  }
  @media (max-width: 375px) {
    .center {
      .limiter {
        h3 {
          font-size: 0.6rem;
        }
        h4 {
          font-size: 0.6rem;
        }
        form {
          input {
            font-size: 0.6rem;
            padding: 0.2rem;
          }
        }
      }
    }
  }
  @media (max-width: 768px) {
    .center {
      .limiter {
        width: 40%;
        h3 {
          font-size: 1rem;
        }
        h4 {
          font-size: 0.8rem;
        }
        form {
          input {
            font-size: 1rem;
            padding: 0.4rem;
          }
        }
      }
    }
  }
`;

export default Limit;
