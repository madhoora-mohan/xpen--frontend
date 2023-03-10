import React from "react";
import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

import { Line } from "react-chartjs-2";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";

ChartJs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Chart() {
  const { incomes, expenses } = useGlobalContext();

  const data = {
    labels: incomes.map((inc) => {
      const date = inc.date;
      const me = date.split("T")[0].split("-");
      return me.reverse().join("-");
    }),
    datasets: [
      {
        label: "Income",
        data: [
          ...incomes.map((income) => {
            const { amount } = income;
            return amount;
          }),
        ],
        backgroundColor: "rgb(57, 206, 51)",
        tension: 0.2,
      },
      {
        label: "Expenses",
        data: [
          ...expenses.map((expense) => {
            const { amount } = expense;
            return amount;
          }),
        ],
        backgroundColor: "rgba(255, 0, 0,0.8)",
        tension: 0.2,
      },
    ],
  };

  return (
    <ChartStyled>
      <Line data={data} className="line" />
    </ChartStyled>
  );
}

const ChartStyled = styled.div`
  background: #fcf6f9;
  border: 0.1rem solid #ffffff;
  box-shadow: 0rem 0.1rem 0.6rem rgba(0, 0, 0, 0.6);
  padding: 0.5rem;
  display: flex;
  height: 14.5rem;
  justify-content: center;
  align-items: center;
  border-radius: 1rem;
  .line {
    font-weight: 800;
  }
  @media (max-width: 1000px) {
    height: 18rem;
  }
  @media (max-width: 425px) {
    /* width: 25rem; */
    height: 13rem;
  }
  @media (max-width: 375px) {
    /* width: 25rem; */
    height: 13rem;
    border-radius: 2rem;
    /* height: 15rem; */
    .line {
      font-weight: bold;
    }
  }
  @media (max-width: 350px) {
    height: 12rem;
    border-radius: 3.2rem;
  }
  @media (max-width: 320px) {
    height: 11.4rem;
    border-radius: 3.8rem;
  }
`;

export default Chart;
