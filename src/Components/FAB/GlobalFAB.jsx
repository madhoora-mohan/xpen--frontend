import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import CategorySelect from "../CategorySelect/CategorySelect";
import StartNextCycle from "../Cycles/StartNextCycle";
import DateInputWithPicker from "../Form/DateInputWithPicker";
import { EXPENSE, INCOME, TRANSFER, getCategory } from "../../config/categories";
import { expenses as expensesIcon, transfers as transfersIcon, trend as incomeIcon, calender } from "../../utils/Icons";

const FAB_OPTIONS = [
  { id: "expense",    label: "Add Expense",      icon: expensesIcon, color: "#ff9e9e" },
  { id: "transfer",   label: "Add Transfer",      icon: transfersIcon, color: "#ff8b8b" },
  { id: "income",     label: "Add Income",        icon: incomeIcon,   color: "var(--accent-income)" },
  { id: "nextmonth",  label: "Start next cycle",  icon: calender,     color: "#6fa8dc" },
];

const FAB_BOTTOM = 20;
const FAB_SIZE = 56;
const SHEET_BOTTOM = FAB_BOTTOM + FAB_SIZE + 8; // 84px — sits just above the FAB

// ─── Quick-add expense form (no description) ──────────────────
function FabExpenseForm({ onDone }) {
  const emailid = localStorage.getItem("email");
  const { addExpense } = useGlobalContext();
  const empty = { email: emailid, title: "", amount: "", date: null, category: "" };
  const [state, setState] = useState(empty);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!state.title.trim()) return setErr("Title is required.");
    if (!state.amount || Number(state.amount) <= 0)
      return setErr("Amount must be greater than zero.");
    if (!state.date) return setErr("Date is required.");
    if (!state.category) return setErr("Category is required.");
    await addExpense({ ...state, amount: Number(state.amount) });
    setState({ ...empty, email: emailid });
    onDone();
  };

  return (
    <SheetForm onSubmit={submit}>
      <div>
        <span className="fl">Title *</span>
        <input
          className="input"
          placeholder="e.g. Lunch with team"
          value={state.title}
          onChange={(e) => { setState({ ...state, title: e.target.value }); setErr(""); }}
        />
      </div>
      <div className="row-2">
        <div>
          <span className="fl">Amount *</span>
          <input
            className="input"
            type="number"
            placeholder="0"
            value={state.amount}
            onChange={(e) => { setState({ ...state, amount: e.target.value }); setErr(""); }}
          />
        </div>
        <div>
          <span className="fl">Date *</span>
          <DateInputWithPicker
            inputClassName="input"
            selected={state.date}
            onChange={(d) => { setState({ ...state, date: d }); setErr(""); }}
          />
        </div>
      </div>
      <div>
        <span className="fl">Category *</span>
        <CategorySelect
          options={EXPENSE}
          value={state.category}
          onChange={(id) => { setState({ ...state, category: id }); setErr(""); }}
          placeholder="Select expense category"
        />
      </div>
      {err && <p className="err">{err}</p>}
      <button type="submit" className="sheet-submit">Add expense</button>
    </SheetForm>
  );
}

// ─── Quick-add income form (no description) ───────────────────
function FabIncomeForm({ onDone }) {
  const emailid = localStorage.getItem("email");
  const { addIncome } = useGlobalContext();
  const empty = { email: emailid, title: "", amount: "", date: null, category: "" };
  const [state, setState] = useState(empty);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!state.title.trim()) return setErr("Title is required.");
    if (!state.amount || Number(state.amount) <= 0)
      return setErr("Amount must be greater than zero.");
    if (!state.date) return setErr("Date is required.");
    if (!state.category) return setErr("Category is required.");
    await addIncome({ ...state, amount: Number(state.amount) });
    setState({ ...empty, email: emailid });
    onDone();
  };

  return (
    <SheetForm onSubmit={submit}>
      <div>
        <span className="fl">Title *</span>
        <input
          className="input"
          placeholder="e.g. Monthly salary"
          value={state.title}
          onChange={(e) => { setState({ ...state, title: e.target.value }); setErr(""); }}
        />
      </div>
      <div className="row-2">
        <div>
          <span className="fl">Amount *</span>
          <input
            className="input"
            type="number"
            placeholder="0"
            value={state.amount}
            onChange={(e) => { setState({ ...state, amount: e.target.value }); setErr(""); }}
          />
        </div>
        <div>
          <span className="fl">Date *</span>
          <DateInputWithPicker
            inputClassName="input"
            selected={state.date}
            onChange={(d) => { setState({ ...state, date: d }); setErr(""); }}
          />
        </div>
      </div>
      <div>
        <span className="fl">Category *</span>
        <CategorySelect
          options={INCOME}
          value={state.category}
          onChange={(id) => { setState({ ...state, category: id }); setErr(""); }}
          placeholder="Select income category"
        />
      </div>
      {err && <p className="err">{err}</p>}
      <button type="submit" className="sheet-submit">Add income</button>
    </SheetForm>
  );
}

// ─── Quick-add transfer form (no description) ─────────────────
function FabTransferForm({ onDone }) {
  const emailid = localStorage.getItem("email");
  const { addTransfer } = useGlobalContext();
  const empty = {
    email: emailid, title: "", amount: "", date: null, category: "", direction: "out",
  };
  const [state, setState] = useState(empty);
  const [err, setErr] = useState("");
  const isDirectionLocked = ["lending_money", "lent_money"].includes(state.category);

  useEffect(() => {
    if (!state.category) return;
    const def = getCategory("transfer", state.category).defaultDirection;
    if (def) setState((s) => ({ ...s, direction: def }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.category]);

  const submit = async (e) => {
    e.preventDefault();
    if (!state.title.trim()) return setErr("Title is required.");
    if (!state.amount || Number(state.amount) <= 0)
      return setErr("Amount must be greater than zero.");
    if (!state.date) return setErr("Date is required.");
    if (!state.category) return setErr("Category is required.");
    if (state.direction !== "in" && state.direction !== "out")
      return setErr("Direction is required.");
    await addTransfer({ ...state, amount: Number(state.amount) });
    setState({ ...empty, email: emailid });
    onDone();
  };

  return (
    <SheetForm onSubmit={submit}>
      <div>
        <span className="fl">Title *</span>
        <input
          className="input"
          placeholder="e.g. Loan to A"
          value={state.title}
          onChange={(e) => { setState({ ...state, title: e.target.value }); setErr(""); }}
        />
      </div>
      <div className="row-2">
        <div>
          <span className="fl">Amount *</span>
          <input
            className="input"
            type="number"
            placeholder="0"
            value={state.amount}
            onChange={(e) => { setState({ ...state, amount: e.target.value }); setErr(""); }}
          />
        </div>
        <div>
          <span className="fl">Date *</span>
          <DateInputWithPicker
            inputClassName="input"
            selected={state.date}
            onChange={(d) => { setState({ ...state, date: d }); setErr(""); }}
          />
        </div>
      </div>
      <div>
        <span className="fl">Type *</span>
        <CategorySelect
          options={TRANSFER}
          value={state.category}
          onChange={(id) => { setState({ ...state, category: id }); setErr(""); }}
          placeholder="Select transfer type"
        />
      </div>
      <div>
        <span className="fl">Direction</span>
        <div className="dir-toggle">
          <button
            type="button"
            className={state.direction === "out" ? "active" : ""}
            disabled={isDirectionLocked}
            onClick={() => !isDirectionLocked && setState({ ...state, direction: "out" })}
          >
            Money out
          </button>
          <button
            type="button"
            className={state.direction === "in" ? "active" : ""}
            disabled={isDirectionLocked}
            onClick={() => !isDirectionLocked && setState({ ...state, direction: "in" })}
          >
            Money in
          </button>
        </div>
      </div>
      {err && <p className="err">{err}</p>}
      <button type="submit" className="sheet-submit">Add transfer</button>
    </SheetForm>
  );
}

function FormSheet({ active, onBack, onDone }) {
  const opt = FAB_OPTIONS.find((o) => o.id === active);
  const visible = !!opt;
  return (
    <div
      className="fab-sheet"
      style={{
        transform: visible ? "translateY(0)" : "translateY(calc(100% + 90px))",
      }}
    >
      <div className="sheet-handle-wrap">
        <div className="sheet-handle" />
      </div>
      <div className="sheet-header">
        <button type="button" className="sheet-back" onClick={onBack}>
          <i className="fa-solid fa-arrow-left" />
          Back
        </button>
        <h3>{opt?.label}</h3>
        <div style={{ width: 52 }} />
      </div>
      <div className="sheet-body">
        {active === "expense"  && <FabExpenseForm  onDone={onDone} />}
        {active === "income"   && <FabIncomeForm   onDone={onDone} />}
        {active === "transfer" && <FabTransferForm onDone={onDone} />}
      </div>
    </div>
  );
}

function GlobalFAB({ drawerOpen }) {
  const [state, setState] = useState("closed");
  const isOpen = state !== "closed";
  const isForm = state === "expense" || state === "income" || state === "transfer";

  const close = () => setState("closed");
  const toggle = () => setState((s) => (s === "closed" ? "open" : "closed"));

  // Avoid a z-index tie with the mobile nav drawer: collapse the FAB when the
  // drawer opens.
  useEffect(() => {
    if (drawerOpen) setState("closed");
  }, [drawerOpen]);

  // Next Month reuses the existing cycle modal instead of a placeholder.
  if (state === "nextmonth") {
    return <StartNextCycle onClose={close} />;
  }

  return (
    <Wrap>
      <div
        className="fab-backdrop"
        onClick={close}
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
      />

      {FAB_OPTIONS.map((opt, i) => {
        const visible = state === "open";
        return (
          <button
            key={opt.id}
            type="button"
            className="fab-pill"
            onClick={() => setState(opt.id)}
            style={{
              bottom: SHEET_BOTTOM + 4 + i * 56,
              opacity: visible ? 1 : 0,
              transform: visible
                ? "translateY(0) scale(1)"
                : "translateY(12px) scale(0.92)",
              transition: `opacity 180ms ${i * 55}ms ease, transform 220ms ${i * 55}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
              pointerEvents: visible ? "auto" : "none",
            }}
          >
            <span className="pill-icon" style={{ background: opt.color }}>
              {opt.icon}
            </span>
            {opt.label}
          </button>
        );
      })}

      <FormSheet
        active={isForm ? state : null}
        onBack={() => setState("open")}
        onDone={close}
      />

      <button
        type="button"
        className="fab-btn"
        onClick={toggle}
        aria-label={isOpen ? "Close quick add" : "Quick add"}
        style={{ transform: isOpen ? "rotate(405deg)" : "rotate(0deg)" }}
      >
        <i className="fa-solid fa-plus" />
      </button>
    </Wrap>
  );
}

const Wrap = styled.div`
  /* The whole FAB system is mobile/tablet only. */
  @media (min-width: 900px) {
    display: none;
  }

  .fab-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(11, 13, 16, 0.65);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    transition: opacity 250ms ease;
    z-index: 80;
  }

  .fab-pill {
    position: fixed;
    right: 16px;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    gap: 10px;
    padding: 6px 6px 6px 14px;
    background: var(--bg-surface);
    border: 1px solid var(--line-strong);
    border-radius: 999px;
    color: var(--fg);
    font-family: inherit;
    font-weight: 700;
    font-size: 13px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    white-space: nowrap;
    cursor: pointer;
    z-index: 92;

    .pill-icon {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      color: #0b0d10;
      display: grid;
      place-items: center;
      flex-shrink: 0;

      i { font-size: 18px; }
    }
  }

  .fab-sheet {
    position: fixed;
    left: 0;
    right: 0;
    bottom: ${SHEET_BOTTOM}px;
    max-height: calc(100vh - ${SHEET_BOTTOM}px - 20px);
    background: var(--bg-surface);
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    border-top: 1px solid var(--line-strong);
    box-shadow: 0 -12px 40px rgba(0, 0, 0, 0.5);
    z-index: 95;
    display: flex;
    flex-direction: column;
    transition: transform 360ms cubic-bezier(0.4, 0, 0.2, 1);

    .sheet-handle-wrap {
      padding: 10px 16px 0;
      display: flex;
      justify-content: center;
      flex-shrink: 0;
    }
    .sheet-handle {
      width: 36px;
      height: 4px;
      border-radius: 2px;
      background: var(--line-strong);
    }

    .sheet-header {
      display: flex;
      align-items: center;
      padding: 10px 16px;
      border-bottom: 1px solid var(--line);
      flex-shrink: 0;

      h3 {
        margin: 0 auto;
        font-size: 15px;
        font-weight: 800;
      }
    }
    .sheet-back {
      display: flex;
      align-items: center;
      gap: 5px;
      color: var(--fg-muted);
      font-family: inherit;
      font-weight: 700;
      font-size: 13px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 6px 0;

      i { font-size: 13px; }
    }

    .sheet-body {
      flex: 1;
      overflow-y: auto;
      padding: 12px 16px 14px;
    }
  }

  .fab-btn {
    position: fixed;
    bottom: ${FAB_BOTTOM}px;
    right: 16px;
    width: ${FAB_SIZE}px;
    height: ${FAB_SIZE}px;
    border-radius: 50%;
    background: var(--accent-income);
    color: #0b0d10;
    display: grid;
    place-items: center;
    box-shadow: 0 6px 24px rgba(66, 173, 0, 0.45), 0 2px 8px rgba(0, 0, 0, 0.3);
    border: none;
    cursor: pointer;
    transition: transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: 100;

    i { font-size: 24px; }
  }
`;

const SheetForm = styled.form`
  display: grid;
  gap: 7px;

  .fl {
    display: block;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--fg-muted);
    margin-bottom: 5px;
  }

  .input,
  .react-datepicker__input-container input {
    width: 100%;
    height: 34px;
    padding: 0 var(--s-3);
    background: var(--bg-inset);
    color: var(--fg);
    border: 1px solid var(--line);
    border-radius: var(--r-sm);
    font-family: inherit;
    font-size: 12.5px;
    font-weight: 500;
    outline: none;
    transition: border-color 120ms ease, background 120ms ease;
    appearance: none;
  }
  .input::placeholder {
    color: var(--fg-faint);
  }
  .input:focus,
  .react-datepicker__input-container input:focus {
    border-color: var(--line-focus);
    background: var(--bg-inset-2);
  }
  .react-datepicker-wrapper {
    width: 100%;
  }

  .row-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 7px;
  }

  .dir-toggle {
    display: flex;
    gap: 3px;
    background: var(--bg-deep);
    padding: 3px;
    border-radius: 7px;
    border: 1px solid var(--line);

    button {
      flex: 1;
      height: 28px;
      border-radius: 5px;
      border: none;
      background: transparent;
      color: var(--fg-muted);
      font-family: inherit;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;

      &.active {
        background: var(--bg-surface);
        color: var(--fg);
        box-shadow: inset 0 0 0 1px var(--line);
      }
      &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
      }
    }
  }

  .err {
    margin: 0;
    padding: 8px 10px;
    background: rgba(232, 60, 50, 0.12);
    color: #ff857d;
    border: 1px solid rgba(232, 60, 50, 0.3);
    border-radius: var(--r-sm);
    font-size: 12px;
    font-weight: 600;
  }

  .sheet-submit {
    height: 40px;
    border-radius: 8px;
    background: var(--fg);
    color: #0b0d10;
    font-family: inherit;
    font-weight: 700;
    font-size: 13px;
    border: none;
    cursor: pointer;
    margin-top: 4px;
  }
`;

export default GlobalFAB;
