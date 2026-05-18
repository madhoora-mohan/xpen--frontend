import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

function CategorySelect({ options, value, onChange, placeholder = "Select Category*" }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const selected = options.find((o) => o.id === value);

  return (
    <Wrap ref={wrapRef}>
      <button type="button" className="trigger" onClick={() => setOpen((v) => !v)}>
        {selected ? (
          <span className="row">
            <span className="swatch" style={{ background: selected.color }} />
            <span className="icon">{selected.icon}</span>
            <span className="label">{selected.label}</span>
          </span>
        ) : (
          <span className="placeholder">{placeholder}</span>
        )}
        <span className="caret">▾</span>
      </button>
      {open && (
        <ul className="panel" role="listbox">
          {options.map((opt) => (
            <li
              key={opt.id}
              role="option"
              aria-selected={opt.id === value}
              className={opt.id === value ? "option selected" : "option"}
              onClick={() => {
                onChange(opt.id);
                setOpen(false);
              }}
            >
              <span className="swatch" style={{ background: opt.color }} />
              <span className="icon">{opt.icon}</span>
              <span className="label">{opt.label}</span>
            </li>
          ))}
        </ul>
      )}
    </Wrap>
  );
}

const Wrap = styled.div`
  position: relative;
  width: 100%;
  .trigger {
    width: 100%;
    height: 2.5rem;
    padding: 0 0.8rem;
    background: rgb(86, 88, 88);
    border: 0.1rem solid rgb(69, 69, 69);
    border-radius: 0.8rem;
    color: #fff;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    font-family: inherit;
    &:hover {
      opacity: 0.9;
    }
  }
  .row,
  .option {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    min-width: 0;
  }
  .swatch {
    width: 0.9rem;
    height: 0.9rem;
    border-radius: 50%;
    flex-shrink: 0;
    border: 0.05rem solid rgba(255, 255, 255, 0.2);
  }
  .icon {
    width: 1.2rem;
    text-align: center;
    color: rgba(255, 255, 255, 0.85);
    i {
      font-size: 0.95rem;
    }
  }
  .label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
  .caret {
    color: rgba(255, 255, 255, 0.6);
    margin-left: 0.5rem;
  }
  .panel {
    position: absolute;
    top: calc(100% + 0.3rem);
    left: 0;
    right: 0;
    z-index: 50;
    max-height: 16rem;
    overflow-y: auto;
    background: rgb(40, 44, 50);
    border: 0.1rem solid rgb(69, 69, 69);
    border-radius: 0.8rem;
    padding: 0.3rem;
    list-style: none;
    margin: 0;
    box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.4);
    &::-webkit-scrollbar {
      width: 0.4rem;
    }
    &::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 0.4rem;
    }
  }
  .option {
    padding: 0.5rem 0.6rem;
    border-radius: 0.5rem;
    color: #fff;
    cursor: pointer;
    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }
    &.selected {
      background: rgba(255, 255, 255, 0.12);
    }
  }
`;

export default CategorySelect;
