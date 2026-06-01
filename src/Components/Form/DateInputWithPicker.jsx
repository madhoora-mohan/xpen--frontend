import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import DatePicker from "react-datepicker";
import styled from "styled-components";

const DROPDOWN_WIDTH = 300;
const CALENDAR_HEIGHT = 320; // conservative estimate for above/below logic

const pad = (n) => String(n).padStart(2, "0");
const toDisplay = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${String(d.getFullYear()).slice(-2)}`;

const DateInputWithPicker = ({ selected, onChange, placeholder = "DD/MM/YY", inputClassName = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [inputText, setInputText] = useState(selected ? toDisplay(selected) : "");
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setInputText(selected ? toDisplay(selected) : "");
    }
  }, [selected]);

  const handleDateChange = (date) => {
    onChange(date);
    setInputText(toDisplay(date));
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputText(val);
    const trimmed = val.trim();

    let parts;
    // 8-digit no-separator: ddmmyyyy
    if (/^\d{8}$/.test(trimmed)) {
      parts = [trimmed.slice(0, 2), trimmed.slice(2, 4), trimmed.slice(4, 8)];
    } else {
      // split on /, -, space, or _
      parts = trimmed.split(/[\/\-\s_]/);
    }

    if (parts.length !== 3) return;
    const [day, month, rawYear] = parts.map((p) => parseInt(p, 10));
    if (isNaN(day) || isNaN(month) || isNaN(rawYear)) return;
    const year = rawYear < 100 ? 2000 + rawYear : rawYear;
    const date = new Date(year, month - 1, day);
    if (date.getDate() === day && date.getMonth() === month - 1) onChange(date);
  };

  const handleBlur = () => {
    setInputText(selected ? toDisplay(selected) : "");
  };

  const handleCalendarBtnClick = () => {
    inputRef.current?.blur();
    if (!isOpen && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      let left = rect.left + rect.width / 2 - DROPDOWN_WIDTH / 2;
      left = Math.max(12, Math.min(left, window.innerWidth - DROPDOWN_WIDTH - 12));

      // Open above the input if there isn't enough room below
      const spaceBelow = window.innerHeight - rect.bottom;
      const top = spaceBelow >= CALENDAR_HEIGHT + 8
        ? rect.bottom + 4
        : Math.max(8, rect.top - CALENDAR_HEIGHT - 4);

      setDropdownPos({ top, left });
    }
    setIsOpen((v) => !v);
  };

  return (
    <Wrapper ref={wrapperRef}>
      <InputWrapper>
        <DateInput
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={inputText}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoComplete="off"
          className={inputClassName}
        />
        <CalendarBtn type="button" onClick={handleCalendarBtnClick} aria-label="Open calendar">
          <i className="fa-solid fa-calendar-days" />
        </CalendarBtn>
      </InputWrapper>

      {isOpen && ReactDOM.createPortal(
        <>
          <Backdrop onMouseDown={() => setIsOpen(false)} />
          <PickerContainer
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <DatePicker
              selected={selected}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              inline
            />
          </PickerContainer>
        </>,
        document.body
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const DateInput = styled.input`
  && {
    width: 100%;
    padding-right: 44px;
  }
`;

const CalendarBtn = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 40px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--fg-muted);
  cursor: pointer;
  display: grid;
  place-items: center;
  font-size: 15px;
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

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9998;
`;

const PickerContainer = styled.div`
  position: fixed;
  z-index: 9999;
  width: ${DROPDOWN_WIDTH}px;
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
    width: 100%;
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

    &:hover { background: var(--accent-income); }
  }

  .react-datepicker__day--today {
    font-weight: 700;
    color: var(--fg);
  }

  .react-datepicker__navigation-icon::before {
    border-color: var(--fg-muted);
  }
`;

export default DateInputWithPicker;
