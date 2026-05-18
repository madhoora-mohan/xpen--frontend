import React from "react";
import styled from "styled-components";
import { dateFormat } from "../../utils/dateFormat";
import { calender, comment, trash, arrowUp, arrowDown } from "../../utils/Icons";
import { getCategory } from "../../config/categories";
import { formatRupee } from "../../utils/currency";
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
  direction,
}) {
  const cat = getCategory(type, category);
  const dotColor = cat.color || indicatorColor;

  return (
    <IncomeItemStyled indicator={dotColor}>
      <div className="icon">{cat.icon}</div>
      <div className="content">
        <h5>
          {title}
          <span className="cat-label">{cat.label}</span>
          {type === "transfer" && direction && (
            <span className={`dir-badge ${direction}`}>
              {direction === "out" ? arrowUp : arrowDown} {direction.toUpperCase()}
            </span>
          )}
        </h5>
        <div className="inner-content">
          <div className="text">
            <p>{formatRupee(amount)}</p>
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
  border-radius: 1rem;
  padding: 0.7rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: #222260;
  .icon {
    width: 10%;
    background: rgb(49, 54, 60);
    display: flex;
    color: #fff;
    opacity: 0.85;
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
      display: flex;
      align-items: center;
      gap: 0.6rem;
      flex-wrap: wrap;
      color: #fff;
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
      .cat-label {
        font-size: 0.7rem;
        font-weight: 500;
        padding: 0.15rem 0.5rem;
        border-radius: 0.5rem;
        background: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.75);
      }
      .dir-badge {
        font-size: 0.65rem;
        padding: 0.15rem 0.4rem;
        border-radius: 0.5rem;
        display: inline-flex;
        align-items: center;
        gap: 0.2rem;
        &.out {
          background: rgba(204, 0, 0, 0.2);
          color: #ff8b8b;
        }
        &.in {
          background: rgba(56, 118, 29, 0.25);
          color: #9ee6a0;
        }
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
      .btn-con {
        flex-shrink: 0;
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
