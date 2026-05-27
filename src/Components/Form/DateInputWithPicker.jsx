import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import styled from "styled-components";

const DateInputWithPicker = ({ selected, onChange, placeholder = "DD / MM / YYYY" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleDateChange = (date) => {
    onChange(date);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const val = e.target.value.trim();
    if (!val) {
      onChange(null);
      return;
    }

    const parts = val.split("/");
    if (parts.length !== 3) return;

    const [day, month, year] = parts.map((p) => parseInt(p, 10));
    if (isNaN(day) || isNaN(month) || isNaN(year)) return;

    const date = new Date(year, month - 1, day);
    if (date.getDate() === day && date.getMonth() === month - 1) {
      onChange(date);
    }
  };

  const displayValue = selected
    ? `${String(selected.getDate()).padStart(2, "0")}/${String(
        selected.getMonth() + 1
      ).padStart(2, "0")}/${selected.getFullYear()}`
    : "";

  return (
    <Wrapper ref={wrapperRef}>
      <InputWrapper>
        <input
          ref={inputRef}
          type="text"
          className="input"
          inputMode="decimal"
          value={displayValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          autoComplete="off"
        />
        <CalendarBtn
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open calendar"
        >
          <i className="fa-solid fa-calendar-days" />
        </CalendarBtn>
      </InputWrapper>

      {isOpen && (
        <PickerContainer>
          <DatePicker
            selected={selected}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            inline
            autoFocus
          />
        </PickerContainer>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  position: relative;

  .input {
    flex: 1;
    padding-right: 44px;
  }
`;

const CalendarBtn = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 44px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--fg-muted);
  cursor: pointer;
  display: grid;
  place-items: center;
  font-size: 16px;
  transition: color 150ms;
  border-radius: 0 var(--r-sm) var(--r-sm) 0;

  &:hover {
    color: var(--fg);
    background: rgba(255, 255, 255, 0.04);
  }

  &:active {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const PickerContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 100;
  margin-top: 4px;
  background: var(--bg-surface);
  border: 1px solid var(--line-strong);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-pop);
  padding: 12px;

  .react-datepicker {
    background: transparent;
    border: none;
    box-shadow: none;
    font-family: inherit;
  }

  .react-datepicker__month-container {
    width: 100%;
  }

  .react-datepicker__header {
    background: transparent;
    border-bottom: 1px solid var(--line);
  }

  .react-datepicker__current-month,
  .react-datepicker__day-name {
    color: var(--fg);
  }

  .react-datepicker__day {
    width: 32px;
    height: 32px;
    line-height: 32px;
    border-radius: var(--r-xs);
    margin: 2px;
    color: var(--fg-muted);
    font-size: 13px;

    &:hover {
      background: var(--bg-inset);
      color: var(--fg);
    }
  }

  .react-datepicker__day--selected {
    background: var(--accent-income);
    color: #0b0d10;
    font-weight: 700;

    &:hover {
      background: var(--accent-income);
    }
  }

  .react-datepicker__day--today {
    font-weight: 700;
    color: var(--fg);
  }
`;

export default DateInputWithPicker;
