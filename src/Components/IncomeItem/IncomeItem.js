import React from "react";
import styled from "styled-components";
import { dateFormat } from "../../utils/dateFormat";
import {
  bitcoin,
  book,
  calender,
  card,
  shopping,
  comment,
  food,
  freelance,
  medical,
  money,
  piggy,
  stocks,
  takeaway,
  trash,
  tv,
  users,
  other,
} from "../../utils/Icons";
import Button from "../Button/Button";

function IncomeItem({
  id,
  title,
  amount,
  date,
  category,
  description,
  deleteItem,
  indicatorColor,
  type,
}) {
  const categoryIcon = () => {
    switch (category) {
      case "salary":
        return money;
      case "freelancing":
        return freelance;
      case "investments":
        return stocks;
      case "stocks":
        return users;
      case "crypto":
        return bitcoin;
      case "loan":
        return card;
      case "pocketmoney":
        return piggy;
      case "other":
        return other;
      default:
        return "";
    }
  };

  const expenseCatIcon = () => {
    switch (category) {
      case "education":
        return book;
      case "groceries":
        return food;
      case "health":
        return medical;
      case "subscriptions":
        return tv;
      case "takeaways":
        return takeaway;
      case "shopping":
        return shopping;
      case "travelling":
        return freelance;
      case "other":
        return other;
      default:
        return "";
    }
  };

  // console.log("type", type);

  return (
    <IncomeItemStyled indicator={indicatorColor}>
      <div className="icon">
        {type === "expense" ? expenseCatIcon() : categoryIcon()}
      </div>
      <div className="content">
        <h5>{title}</h5>
        <div className="inner-content">
          <div className="text">
            <p>₹ {amount}</p>
            <p>
              {calender} {dateFormat(date)}
            </p>
            <p>
              {comment}
              {description}
            </p>
          </div>
          <div className="btn-con">
            <Button
              icon={trash}
              bPad={"0.3rem"}
              bRad={"50%"}
              bg={"var(--primary-color"}
              color={"#000"}
              iColor={"#000"}
              hColor={"var(--color-green)"}
              onClick={() => deleteItem(id)}
            />
          </div>
        </div>
      </div>
    </IncomeItemStyled>
  );
}

const IncomeItemStyled = styled.div`
  background: rgb(49, 54, 60);
  border: 0.1rem solid rgb(69, 69, 69);
  // box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
  border-radius: 1rem;
  padding: 0.7rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: #222260;
  /* height: fit-content; */
  /* display: flex;
  -ms-wrap-flow: end;
  flex-wrap: wrap-reverse; */
  .icon {
    width: 10%;
    background: rgb(49, 54, 60);
    display: flex;
    color: #000;
    opacity: 0.8;
    align-items: center;
    justify-content: center;
    i {
      font-size: 1.5rem;
    }
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    h5 {
      font-size: 1.2rem;
      padding-left: 1.5rem;
      position: relative;
      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 50%;
        background: ${(props) => props.indicator};
      }
    }

    .inner-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .text {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        p {
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--primary-color);
          opacity: 0.8;
        }
      }
    }
  }
  @media (max-width: 425px) {
    gap: 0.7rem;
    .icon {
      width: 7%;
      i {
        font-size: 1.5rem;
      }
    }
    .content {
      gap: 0.5rem;
      h5 {
        font-size: 0.9rem;
        padding-left: 1rem;
      }
      .inner-content {
        justify-content: space-between;
        align-items: center;
        .text {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          p {
            font-size: 0.7rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
        }
        .btn-con {
          width: 8%;
        }
      }
    }
  }
`;

export default IncomeItem;
