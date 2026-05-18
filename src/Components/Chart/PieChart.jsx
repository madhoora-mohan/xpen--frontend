import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { useGlobalContext } from "../../context/globalContext";
import { EXPENSE } from "../../config/categories";

Chart.register(ArcElement, Tooltip, Legend);

const WIDE = 600;

function PieChart() {
  const { expCat } = useGlobalContext();
  const [isWide, setIsWide] = useState(window.innerWidth >= WIDE);

  useEffect(() => {
    const handler = () => setIsWide(window.innerWidth >= WIDE);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

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
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: !isWide,
      cutout: "55%",
      layout: { padding: 0 },
      plugins: {
        legend: {
          display: true,
          position: isWide ? "right" : "bottom",
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            font: { size: isWide ? 13 : 11 },
            color: "#fff",
            padding: 8,
          },
        },
        tooltip: {
          callbacks: {
            label: (ctx) =>
              ` ${ctx.label}: ₹${ctx.parsed.toLocaleString("en-IN")}`,
          },
        },
      },
    },
  };

  return (
    <PieChartStyled>
      <h6>Expense Breakdown</h6>
      {active.length > 0 ? (
        <div className="chart-group">
          <div className="chart-wrap">
            <Doughnut {...config} />
          </div>
        </div>
      ) : (
        <p className="empty">No expenses yet</p>
      )}
    </PieChartStyled>
  );
}

const PieChartStyled = styled.div`
  background: rgb(49, 54, 60);
  border: 0.1rem solid rgb(69, 69, 69);
  border-radius: 1rem;
  padding: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;

  h6 {
    color: #fff;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .chart-group {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .chart-wrap {
      width: 260px;
    }
  }

  .empty {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.9rem;
    padding: 2rem 0;
  }

  @media (min-width: 480px) {
    .chart-group .chart-wrap {
      width: 320px;
    }
  }

  @media (min-width: ${WIDE}px) {
    .chart-group .chart-wrap {
      width: 500px;
      height: 230px;
    }
  }

  @media (min-width: 900px) {
    padding: 1.25rem;
  }
`;

export default PieChart;
