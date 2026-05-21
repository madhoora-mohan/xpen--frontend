import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import { InnerLayout } from "../../styles/Layouts";
import Button from "../Button/Button";
import Field from "../Form/Field";
import { plus } from "../../utils/Icons";
import { formatRupee } from "../../utils/currency";

function Limit() {
  const {
    totalBalance,
    limits,
    getLimit,
    updateLimit,
    error,
    setError,
  } = useGlobalContext();
  const [limit, setLimit] = useState("");
  const [okMsg, setOkMsg] = useState("");

  useEffect(() => {
    getLimit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const n = parseInt(limit, 10);
    if (isNaN(n) || n <= 0) {
      setError("Limit must be a positive number!");
      setOkMsg("");
      return;
    }
    if (totalBalance() < n) {
      setError(
        "Your Savings are dropping below your set Limit!! Reduce Your Expenses!!"
      );
    } else {
      setError("");
    }
    await updateLimit(n);
    setOkMsg(`Limit updated to ${formatRupee(n)}`);
    setLimit("");
    setTimeout(() => setOkMsg(""), 2400);
  };

  const savings = totalBalance();
  const limitNumber = Number(limits) || 0;
  const tone =
    limitNumber <= 0
      ? "good"
      : savings < limitNumber
      ? "bad"
      : savings < limitNumber * 1.5
      ? "warn"
      : "good";
  const ratioMax = Math.max(limitNumber * 2, 1);
  const ratio = limitNumber > 0
    ? Math.min(100, Math.max(8, (savings / ratioMax) * 100))
    : 0;
  const statusPill =
    limitNumber <= 0
      ? "No limit set"
      : tone === "bad"
      ? "⚠ Below limit"
      : tone === "warn"
      ? "Close to limit"
      : "On track";

  return (
    <LimitStyled>
      <InnerLayout>
        <h2 className="page-title">Set savings limit</h2>
        <p className="page-sub">
          Get a heads-up when your savings dip below this floor
        </p>

        <div className="total-banner">
          <div className="label">Current savings</div>
          <div className="value">{formatRupee(savings)}</div>
        </div>

        <div className="limit-card">
          <h3 className="limit-card-title">Minimum savings limit</h3>
          <div className="current">
            <div className="l">Current limit</div>
            <div className="v num">{formatRupee(limitNumber)}</div>
          </div>

          <div className="progress">
            <div
              className={"bar " + tone}
              style={{ width: `${ratio}%` }}
            />
          </div>
          <div className="progress-labels">
            <span>0</span>
            <span>{statusPill}</span>
            <span>{formatRupee(limitNumber * 2)}</span>
          </div>

          <form onSubmit={handleSubmit}>
            <Field label="New limit (₹)">
              <input
                type="number"
                className="input"
                value={limit}
                name="limit"
                placeholder="e.g. 10000"
                onChange={(e) => {
                  setLimit(e.target.value);
                  setError("");
                  setOkMsg("");
                }}
              />
            </Field>
            {error && <p className="error_msg">{error}</p>}
            {okMsg && <p className="success_msg">{okMsg}</p>}
            <div className="submit-row">
              <Button
                name="Save limit"
                icon={plus}
                variant="primary"
                size="lg"
                block
                type="submit"
              />
            </div>
          </form>
        </div>
      </InnerLayout>
    </LimitStyled>
  );
}

const LimitStyled = styled.div`
  width: 100%;

  .page-title {
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin: 0 0 var(--s-2);
  }
  .page-sub {
    color: var(--fg-muted);
    font-size: 14px;
    margin: 0 0 var(--s-5);
  }

  .total-banner {
    max-width: 480px;
    margin: 0 auto;
    display: flex;
    align-items: baseline;
    gap: var(--s-3);
    background: var(--bg-surface);
    border: 1px solid var(--line);
    border-radius: var(--r-lg);
    padding: var(--s-4) var(--s-5);

    .label {
      font-size: 13px;
      font-weight: 600;
      color: var(--fg-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .value {
      margin-left: auto;
      font-size: 22px;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
      color: var(--fg);
    }
  }

  .limit-card {
    max-width: 480px;
    margin: var(--s-5) auto 0;
    background: var(--bg-surface);
    border: 1px solid var(--line);
    border-radius: var(--r-lg);
    padding: var(--s-6);
    display: flex;
    flex-direction: column;
    gap: var(--s-3);
  }

  .limit-card-title {
    margin: 0 0 var(--s-2);
    font-size: 16px;
    font-weight: 800;
    letter-spacing: -0.01em;
  }

  .current {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: var(--s-3) var(--s-4);
    background: var(--bg-inset);
    border-radius: var(--r-md);

    .v {
      font-size: 22px;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
    }
    .l {
      color: var(--fg-muted);
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
  }

  .progress {
    position: relative;
    height: 8px;
    background: var(--bg-inset);
    border-radius: 4px;
    overflow: hidden;

    .bar {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      border-radius: 4px;
      transition: width 240ms;
      &.good {
        background: var(--accent-income);
      }
      &.warn {
        background: var(--accent-warn);
      }
      &.bad {
        background: var(--accent-expense);
      }
    }
  }

  .progress-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
    font-size: 11px;
    color: var(--fg-muted);
    font-weight: 600;
  }

  form {
    margin-top: var(--s-3);
    display: flex;
    flex-direction: column;
    gap: var(--s-3);
  }

  .input {
    width: 100%;
    height: 44px;
    padding: 0 var(--s-3);
    background: var(--bg-inset);
    color: var(--fg);
    border: 1px solid var(--line);
    border-radius: var(--r-sm);
    font-family: inherit;
    font-size: 14px;
    font-weight: 500;
    outline: none;
    transition: border-color 120ms, background 120ms;
  }
  .input:focus {
    border-color: var(--line-focus);
    background: var(--bg-inset-2);
  }
  .input::placeholder {
    color: var(--fg-faint);
  }

  .error_msg {
    padding: 10px 12px;
    background: rgba(232, 60, 50, 0.12);
    color: #ff857d;
    border: 1px solid rgba(232, 60, 50, 0.3);
    border-radius: var(--r-sm);
    font-size: 13px;
    font-weight: 600;
    margin: 0;
  }
  .success_msg {
    padding: 10px 12px;
    background: rgba(66, 173, 0, 0.12);
    color: #9be37b;
    border: 1px solid rgba(66, 173, 0, 0.3);
    border-radius: var(--r-sm);
    font-size: 13px;
    font-weight: 600;
    margin: 0;
  }

  .submit-row {
    margin-top: var(--s-2);
  }

  @media (max-width: 720px) {
    .page-title {
      font-size: 22px;
    }
  }
`;

export default Limit;
