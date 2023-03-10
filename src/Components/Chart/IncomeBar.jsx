import React from "react";
import styled from "styled-components";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useGlobalContext } from "../../context/globalContext";
import { Bar } from "react-chartjs-2";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function IncomeBar() {
  const { incCat } = useGlobalContext();
  const config = {
    data: {
      labels: [
        "Salary",
        "Freelancing",
        "Investments",
        "Stocks",
        "Crypto",
        "Loan",
        "Pocket Money",
        "Other",
      ],
      datasets: [
        {
          data: [
            incCat()[0],
            incCat()[1],
            incCat()[2],
            incCat()[3],
            incCat()[4],
            incCat()[5],
            incCat()[6],
            incCat()[7],
          ],
          backgroundColor: ["rgba(97,216,92, 0.2)"],
          borderColor: ["rgb(97,216,92)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  };
  return (
    <PieChartStyled>
      <div className="piechart">
        <div className="pie">
          <h6>Income Categories</h6>
          <Bar {...config}></Bar>
        </div>
      </div>
    </PieChartStyled>
  );
}

const PieChartStyled = styled.div`
  .piechart {
    display: flex;
    justify-content: center;
    background-color: white;
    border-radius: 1rem;
    width: 100%;
    .pie {
      width: 100%;
      position: relative;
      height: 14.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding-top: 1rem;
      /* font-variant: small-caps; */
      h6 {
        color: black;
      }
    }
  }
  @media (max-width: 1000px) {
    .piechart {
      .pie {
        padding: 0.6rem;
        height: 20rem;
      }
    }
  }
  @media (max-width: 425px) {
    .piechart {
      /* width: 25rem; */
      /* margin-left: 6.5rem; */
      .pie {
        /* width: 25rem; */
        height: 13rem;
      }
    }
  }
  @media (max-width: 375px) {
    .piechart {
      /* width: 25rem; */
      .pie {
        /* width: 25rem; */
        height: 12rem;

      }
    }
  }
  @media (max-width: 375px) {
    .piechart {
      /* border-radius: 20%;
      border: 1.5px solid black; */
      .pie {
        height: 11rem;

      }
    }
  }
`;

export default IncomeBar;
