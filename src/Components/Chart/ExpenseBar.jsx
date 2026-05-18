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
import { EXPENSE } from "../../config/categories";
import { Bar } from "react-chartjs-2";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ExpenseBar() {
  const { expCat } = useGlobalContext();
  const totals = expCat();

  const active = EXPENSE.map((c, i) => ({ ...c, total: totals[i] })).filter(
    (c) => c.total > 0
  );

  const config = {
    data: {
      labels: active.map((c) => c.label),
      datasets: [
        {
          data: active.map((c) => c.total),
          backgroundColor: active.map((c) => c.color),
          borderColor: active.map((c) => c.color),
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          ticks: {
            font: { size: 9 },
            maxRotation: 45,
            minRotation: 45,
          },
          grid: { display: false },
        },
        y: {
          ticks: { font: { size: 9 } },
          grid: { color: "rgba(0,0,0,0.06)" },
        },
      },
    },
  };

  return (
    <ExpenseBarStyled>
      <div className="piechart">
        <div className="pie">
          <h6>Expense Categories</h6>
          <div className="chart-wrap">
            {active.length > 0 ? (
              <Bar {...config} />
            ) : (
              <p className="empty">No expenses yet</p>
            )}
          </div>
        </div>
      </div>
    </ExpenseBarStyled>
  );
}

const ExpenseBarStyled = styled.div`
  .piechart {
    display: flex;
    justify-content: center;
    background-color: white;
    border-radius: 1rem;
    width: 100%;
    .pie {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.8rem 0.6rem 0.6rem;
      h6 {
        color: #333;
        font-size: 0.85rem;
        font-weight: 600;
        margin-bottom: 0.4rem;
      }
      .chart-wrap {
        width: 100%;
        position: relative;
        height: 12rem;
      }
      .empty {
        color: #999;
        font-size: 0.9rem;
        margin: auto;
      }
    }
  }
  @media (max-width: 1000px) {
    .piechart .pie .chart-wrap {
      height: 16rem;
    }
  }
  @media (max-width: 425px) {
    .piechart .pie .chart-wrap {
      height: 11rem;
    }
  }
`;

export default ExpenseBar;
