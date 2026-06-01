import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

function CategorySelect({ options, value, onChange, placeholder = "Select Category" }) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  // Close on outside click — must also guard the portaled menu node
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (
        wrapRef.current && !wrapRef.current.contains(e.target) &&
        menuRef.current && !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  // Close on page scroll (so the fixed menu doesn't drift), but ignore
  // scroll events that originate inside the menu itself.
  useEffect(() => {
    if (!open) return;
    const onScroll = (e) => {
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      setOpen(false);
    };
    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll, true);
  }, [open]);

  const handleToggle = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
    setOpen((v) => !v);
  };

  const selected = options.find((o) => o.id === value);

  return (
    <Wrap ref={wrapRef}>
      <button
        ref={triggerRef}
        type="button"
        className={selected ? "trigger" : "trigger placeholder"}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected ? (
          <>
            <span className="trigger-swatch" style={{ background: selected.color }}>
              <span className="trigger-icon">{selected.icon}</span>
            </span>
            <span className="trigger-label">{selected.label}</span>
          </>
        ) : (
          <span className="placeholder-text">{placeholder}</span>
        )}
        <span className="caret" aria-hidden="true" />
      </button>

      {open && ReactDOM.createPortal(
        <MenuList
          ref={menuRef}
          role="listbox"
          style={{
            position: "fixed",
            top: menuPos.top,
            left: menuPos.left,
            width: menuPos.width,
            zIndex: 9999,
          }}
        >
          {options.map((opt) => (
            <OptionItem
              key={opt.id}
              role="option"
              aria-selected={opt.id === value}
              className={opt.id === value ? "selected" : ""}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(opt.id);
                setOpen(false);
              }}
            >
              <span className="opt-swatch" style={{ background: opt.color }}>
                <span className="opt-icon">{opt.icon}</span>
              </span>
              <span className="opt-label">{opt.label}</span>
            </OptionItem>
          ))}
        </MenuList>,
        document.body
      )}
    </Wrap>
  );
}

const Wrap = styled.div`
  position: relative;
  width: 100%;

  .trigger {
    width: 100%;
    height: 44px;
    padding: 0 36px 0 var(--s-3);
    background: var(--bg-inset);
    border: 1px solid var(--line);
    border-radius: var(--r-sm);
    color: var(--fg);
    font-family: inherit;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: var(--s-3);
    text-align: left;
    cursor: pointer;
    position: relative;
    transition: border-color 120ms ease, background 120ms ease;

    &:hover {
      background: var(--bg-inset-2);
    }
    &:focus-visible {
      outline: none;
      border-color: var(--line-focus);
      background: var(--bg-inset-2);
    }
  }

  .trigger.placeholder .placeholder-text {
    color: var(--fg-faint);
  }

  .trigger-swatch {
    width: 22px;
    height: 22px;
    border-radius: 5px;
    display: grid;
    place-items: center;
    color: #0b0d10;
    flex-shrink: 0;
  }

  .trigger-icon i {
    font-size: 12px;
  }

  .trigger-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .caret {
    position: absolute;
    right: 14px;
    top: 50%;
    width: 8px;
    height: 8px;
    border-right: 1.5px solid currentColor;
    border-bottom: 1.5px solid currentColor;
    transform: translateY(-70%) rotate(45deg);
    opacity: 0.6;
    pointer-events: none;
  }
`;

const MenuList = styled.ul`
  background: var(--bg-inset);
  border: 1px solid var(--line-strong);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-pop);
  max-height: 280px;
  overflow-y: auto;
  padding: 4px;
  list-style: none;
  margin: 0;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--bg-inset-2);
    border-radius: 3px;
  }

  .opt-icon i {
    font-size: 12px;
  }
`;

const OptionItem = styled.li`
  display: flex;
  align-items: center;
  gap: var(--s-3);
  padding: 8px 10px;
  border-radius: var(--r-xs);
  cursor: pointer;
  font-size: 14px;
  color: var(--fg);

  &:hover {
    background: var(--bg-inset-2);
  }

  &.selected {
    background: var(--bg-inset-2);
  }

  .opt-swatch {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    display: grid;
    place-items: center;
    color: #0b0d10;
    flex-shrink: 0;
  }

  .opt-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export default CategorySelect;
