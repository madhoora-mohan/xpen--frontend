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
      .pie {
        height: 13rem;
        margin-left: 1rem;
      }
    }
  }

  @media (max-width: 375px) {
    .piechart {
      border-radius: 2rem;
      .pie {
        /* height: 13rem; */
      }
    }
  }
  @media (max-width: 365px) {
    .piechart {
      border-radius: 2.5rem;
      .pie {
        /* height: 13rem; */
        /* margin-left: 0.9rem; */
      }
    }
  }
  @media (max-width: 350px) {
    .piechart {
      border-radius: 3rem;
      .pie {
        height: 12rem;
      }
    }
  }
  @media (max-width: 340px) {
    .piechart {
      border-radius: 3rem;
      .pie {
        height: 11.5rem;
        margin-left: 0.5rem;
      }
    }
  }
  @media (max-width: 320px) {
    .piechart {
      border-radius: 3.5rem;
      .pie {
        height: 11.5rem;
        margin-left: 0.5rem;
      }
    }
  }
`;

export default IncomeBar;
