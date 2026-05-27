import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import moment from "moment";
import { useGlobalContext } from "../../context/globalContext";
import Button from "../Button/Button";
import Field from "../Form/Field";
import FormStyled from "../Form/FormStyled";
import { plus } from "../../utils/Icons";

function FirstCycleGate() {
  const { openCycle, bootstrap } = useGlobalContext();
  const [label, setLabel] = useState(moment().format("MMMM YYYY"));
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!label.trim()) {
      setErr("A label is required (e.g. \"May 2026\").");
      return;
    }
    if (!startDate) {
      setErr("A start date is required.");
      return;
    }
    setSubmitting(true);
    setErr("");
    try {
      await openCycle({
        startDate,
        label: label.trim(),
        endDate: endDate || undefined,
      });
      await bootstrap();
    } catch (e2) {
      setErr(e2.response?.data?.message ?? "Could not create the cycle. Try again.");
      setSubmitting(false);
    }
  };

  return (
    <GateStyled>
      <div className="gate-card">
        <h2>Start your first cycle</h2>
        <p className="gate-sub">
          Xpenz tracks your money in monthly cycles. Create one to begin logging
          incomes, expenses and transfers.
        </p>
        <FormStyled onSubmit={handleSubmit}>
          <Field label="Label" required>
            <input
              type="text"
              className="input"
              value={label}
              placeholder='e.g. "May 2026"'
              onChange={(e) => {
                setLabel(e.target.value);
                setErr("");
              }}
            />
          </Field>
          <div className="field-row-2">
            <Field label="Start date" required>
              <DatePicker
                placeholderText="DD / MM / YYYY"
                selected={startDate}
                dateFormat="dd/MM/yyyy"
                onChange={(d) => {
                  setStartDate(d);
                  setErr("");
                }}
              />
            </Field>
            <Field label="End date">
              <DatePicker
                placeholderText="DD / MM / YYYY"
                selected={endDate}
                dateFormat="dd/MM/yyyy"
                isClearable
                onChange={(d) => {
                  setEndDate(d);
                  setErr("");
                }}
              />
            </Field>
          </div>
          {err && <p className="error_msg">{err}</p>}
          <div className="submit-btn">
            <Button
              name={submitting ? "Creating…" : "Create cycle"}
              icon={plus}
              variant="primary"
              size="lg"
              block
              type="submit"
              disabled={submitting}
            />
          </div>
        </FormStyled>
      </div>
    </GateStyled>
  );
}

const GateStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: var(--s-6) var(--s-5);

  .gate-card {
    width: 100%;
    max-width: 460px;
    background: var(--bg-surface);
    border: 1px solid var(--line);
    border-radius: var(--r-lg);
    padding: var(--s-6);
    margin-top: var(--s-6);
  }

  h2 {
    margin: 0 0 var(--s-2);
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.02em;
  }
  .gate-sub {
    margin: 0 0 var(--s-5);
    color: var(--fg-muted);
    font-size: 14px;
    line-height: 1.5;
  }
`;

export default FirstCycleGate;
