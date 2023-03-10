import React from "react";
import styled from "styled-components";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
import { useGlobalContext } from "../../context/globalContext";

Chart.register(ArcElement);

function PieChart() {
  const { totalExpenses, totalIncome, totalBalance } = useGlobalContext();
  const config = {
    data: {
      labels: ["Income", "Expense", "Savings"],
      datasets: [
        {
          data: [totalIncome(), totalExpenses(), totalBalance()],
          backgroundColor: [
            "rgba(57, 206, 51, 0.8)",
            "rgba(255, 0, 0,0.6)",
            "rgba(0, 0, 255, 0.6)",
          ],
          hoverOffset: 4,
          borderRadius: 10,
          spacing: 2,
        },
      ],
    },
    options: {
      cutout: 60,
    },
  };
  return (
    <PieChartStyled>
      <div className="piechart">
        <div className="pie">
          <Doughnut {...config}></Doughnut>
          <div className="cont">
            <p>
              Incomes: <span>₹{totalIncome()}</span>
            </p>
            <p>
              Expense: <span>₹{totalExpenses()}</span>
            </p>
            <p>
              Savings: <span>₹{totalBalance()}</span>
            </p>
          </div>
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
      justify-content: center;
      overflow: hidden;
      .cont {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1rem;
        font-size: 1rem;
        font-weight: 800;
        align-items: center;
      }
    }
  }
  @media (max-width: 1160px) {
    .cont {
      p {
        display: flex;
        flex-direction: column;
      }
    }
  }
  @media (max-width: 1000px) {
    .piechart {
      padding-top: 0.5rem;
      padding-bottom: 1rem;
      .pie {
        height: 18rem;
        .cont {
          p {
            font-size: 1.3rem;
          }
        }
      }
    }
  }
  @media (max-width: 425px) {
    .piechart {
      width: 25rem;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      .pie {
        width: 25rem;
        height: 14rem;
        .cont {
          p {
            font-size: 1rem;
          }
        }
      }
    }
  }
  @media (max-width: 375px) {
    .piechart {
      padding-top: 0rem;
      padding-bottom: 0rem;
      .pie {
        /* width: 25rem; */
        /* height: 13rem; */
        .cont {
          p {
            font-size: 0.8rem;
          }
        }
      }
    }
  }
  @media (max-width: 320px) {
    .piechart {
      
      .pie {
        /* width: 25rem; */
        height: 14rem;
        .cont {
          p {
            font-size: 0.7rem;
          }
        }
      }
    }
  }
`;

export default PieChart;
