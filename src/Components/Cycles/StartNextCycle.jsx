import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import moment from "moment";
import { useGlobalContext } from "../../context/globalContext";
import Button from "../Button/Button";
import Field from "../Form/Field";
import FormStyled from "../Form/FormStyled";
import DateInputWithPicker from "../Form/DateInputWithPicker";
import { formatRupee } from "../../utils/currency";

function StartNextCycle({ onClose }) {
  const { activeCycle, closeCycle, openCycle, bootstrap } = useGlobalContext();

  const [step, setStep] = useState("close"); // "close" → "open"
  const [endDate, setEndDate] = useState(new Date());
  const [netCash, setNetCash] = useState(0);

  const [startDate, setStartDate] = useState(null);
  const [label, setLabel] = useState("");
  const [newEndDate, setNewEndDate] = useState(null);
  const [carry, setCarry] = useState(false);

  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const handleClose = async (e) => {
    e.preventDefault();
    if (!endDate) {
      setErr("Pick the end date for the current cycle.");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      const { netCash: nc } = await closeCycle(endDate);
      setNetCash(nc);
      setCarry(nc > 0);
      const nextStart = moment(endDate).add(1, "day").toDate();
      setStartDate(nextStart);
      setLabel(moment(nextStart).format("MMMM YYYY"));
      setStep("open");
    } catch (e2) {
      setErr(e2.response?.data?.message ?? "Could not close the cycle. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleOpen = async (e) => {
    e.preventDefault();
    if (!label.trim()) {
      setErr("A label is required.");
      return;
    }
    if (!startDate) {
      setErr("A start date is required.");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      await openCycle({
        startDate,
        label: label.trim(),
        endDate: newEndDate || undefined,
        carryOver: { bankBalance: carry },
      });
      await bootstrap();
      onClose();
    } catch (e2) {
      // Close already succeeded — stay on the open step so the user can retry
      // opening without re-closing.
      setErr(e2.response?.data?.message ?? "Could not open the new cycle. Try again.");
      setBusy(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Start next cycle</h3>
          <button type="button" className="x" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {step === "close" ? (
          <FormStyled onSubmit={handleClose}>
            <p className="step-note">
              Close <strong>{activeCycle?.label}</strong> first. We'll compute its
              closing balance so you can carry it over.
            </p>
            <Field label="End date of current cycle" required>
              <DateInputWithPicker
                selected={endDate}
                onChange={(d) => {
                  setEndDate(d);
                  setErr("");
                }}
              />
            </Field>
            {err && <p className="error_msg">{err}</p>}
            <div className="actions">
              <Button name="Cancel" variant="ghost" onClick={onClose} />
              <Button
                name={busy ? "Closing…" : "Close & continue"}
                variant="primary"
                type="submit"
                disabled={busy}
              />
            </div>
          </FormStyled>
        ) : (
          <FormStyled onSubmit={handleOpen}>
            <p className="step-note">
              Closed. Closing balance:{" "}
              <strong>{formatRupee(netCash)}</strong>. Now open the next cycle.
            </p>
            <Field label="Label" required>
              <input
                type="text"
                className="input"
                value={label}
                placeholder='e.g. "June 2026"'
                onChange={(e) => {
                  setLabel(e.target.value);
                  setErr("");
                }}
              />
            </Field>
            <div className="field-row-2">
              <Field label="Start date" required>
                <DateInputWithPicker
                  selected={startDate}
                  onChange={(d) => {
                    setStartDate(d);
                    setErr("");
                  }}
                />
              </Field>
              <Field label="End date">
                <DateInputWithPicker
                  selected={newEndDate}
                  onChange={(d) => setNewEndDate(d)}
                />
              </Field>
            </div>
            {netCash > 0 && (
              <label className="carry">
                <input
                  type="checkbox"
                  checked={carry}
                  onChange={(e) => setCarry(e.target.checked)}
                />
                Carry {formatRupee(netCash)} bank balance over to the new cycle
              </label>
            )}
            {err && <p className="error_msg">{err}</p>}
            <div className="actions">
              <Button
                name={busy ? "Opening…" : "Open new cycle"}
                variant="primary"
                type="submit"
                disabled={busy}
              />
            </div>
          </FormStyled>
        )}
      </div>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--s-4);

  .modal {
    width: 100%;
    max-width: 440px;
    background: var(--bg-surface);
    border: 1px solid var(--line);
    border-radius: var(--r-lg);
    padding: var(--s-5);
  }

  .modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--s-4);
    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 800;
    }
    .x {
      background: transparent;
      border: 0;
      color: var(--fg-muted);
      font-size: 22px;
      line-height: 1;
      cursor: pointer;
    }
    .x:hover {
      color: var(--fg);
    }
  }

  .step-note {
    margin: 0 0 var(--s-4);
    color: var(--fg-muted);
    font-size: 13px;
    line-height: 1.5;
  }

  .carry {
    display: flex;
    align-items: center;
    gap: var(--s-2);
    font-size: 13px;
    color: var(--fg);
    margin-top: var(--s-3);
    cursor: pointer;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--s-2);
    margin-top: var(--s-5);
  }
`;

export default StartNextCycle;
