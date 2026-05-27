import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { signout, fileexport } from "../../utils/Icons";
import { menuItems } from "../../utils/menuItems";
import { useGlobalContext } from "../../context/globalContext";
import { useAuth } from "../../context/AuthContext";
import { formatRupee } from "../../utils/currency";

const MONTH_OPTIONS = [1, 3, 6, 9, 12, 18, 24, 36];

function ExportModal({ onClose, onConfirm }) {
  const [months, setMonths] = useState(3);
  return (
    <ExportModalStyled>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-box">
        <h3 className="modal-title">Export to Excel</h3>
        <p className="modal-sub">Download a spreadsheet with one sheet per cycle.</p>
        <label className="modal-field">
          <span className="modal-label">How many months?</span>
          <select
            value={months === 0 ? "all" : months}
            onChange={(e) =>
              setMonths(e.target.value === "all" ? 0 : Number(e.target.value))
            }
          >
            {MONTH_OPTIONS.map((m) => (
              <option key={m} value={m}>{m} month{m === 1 ? "" : "s"}</option>
            ))}
            <option value="all">All cycles</option>
          </select>
        </label>
        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-download" onClick={() => onConfirm(months)}>
            {fileexport} Download
          </button>
        </div>
      </div>
    </ExportModalStyled>
  );
}

function Brand() {
  return (
    <div className="brand">
      <div className="brand-mark">X$</div>
      <div>
        <div className="brand-name">Xpenz</div>
        <div className="brand-tag">Track and Analyse</div>
      </div>
    </div>
  );
}

function UserCard({ username, savings }) {
  const initial = (username || "M")[0].toUpperCase();
  return (
    <div className="user-card">
      <div className="avatar">{initial}</div>
      <div className="user-meta">
        <div className="user-name">{username || "User"}</div>
        <div className="user-sub">Savings: {formatRupee(savings)}</div>
      </div>
    </div>
  );
}

function NavList({ active, setActive, onItemClick, setError }) {
  return (
    <ul className="nav-list">
      {menuItems.map((item) => {
        const isActive = active === item.id;
        return (
          <li key={item.id}>
            <button
              type="button"
              className={isActive ? "nav-item active" : "nav-item"}
              onClick={() => {
                setActive(item.id);
                if (setError) setError("");
                if (onItemClick) onItemClick();
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.title}</span>
              <span className="nav-dot" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function NavFooter({ onSignOut, onExport }) {
  return (
    <div className="nav-footer">
      <button type="button" onClick={onSignOut}>
        {signout} Sign out
      </button>
      <button type="button" onClick={onExport}>
        {fileexport} Export
      </button>
    </div>
  );
}


function Navigation({ active, setActive, drawerOpen, closeDrawer }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const {
    totalBalance,
    setError,
    getIncomes,
    getExpenses,
    getTransfers,
    exportCycles,
  } = useGlobalContext();

  const [showExport, setShowExport] = useState(false);
  const username = localStorage.getItem("username");
  const emailid = localStorage.getItem("email");

  useEffect(() => {
    getIncomes();
    getExpenses();
    getTransfers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailid]);

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_AUTH_URL}/logout`);
    } catch {}
    logout();
    navigate("/login");
  };

  const handleExportConfirm = (months) => {
    exportCycles(months);
    setShowExport(false);
  };

  const savings = totalBalance();

  return (
    <>
      <Sidebar>
        <Brand />
        <UserCard username={username} savings={savings} />
        <div className="nav-section">
          <div className="nav-section-label">Workspace</div>
          <NavList active={active} setActive={setActive} setError={setError} />
        </div>
        <div className="spacer" />
        <NavFooter onSignOut={handleLogout} onExport={() => setShowExport(true)} />
      </Sidebar>

      <DrawerBackdrop className={drawerOpen ? "open" : ""} onClick={closeDrawer} />
      <Drawer className={drawerOpen ? "open" : ""}>
        <button
          type="button"
          className="drawer-close"
          onClick={closeDrawer}
          aria-label="Close menu"
        >
          <i className="fa-solid fa-xmark" />
        </button>
        <Brand />
        <UserCard username={username} savings={savings} />
        <div className="nav-section">
          <div className="nav-section-label">Workspace</div>
          <NavList
            active={active}
            setActive={setActive}
            setError={setError}
            onItemClick={closeDrawer}
          />
        </div>
        <div className="spacer" />
        <NavFooter onSignOut={handleLogout} onExport={() => setShowExport(true)} />
      </Drawer>

      {showExport && (
        <ExportModal
          onClose={() => setShowExport(false)}
          onConfirm={handleExportConfirm}
        />
      )}
    </>
  );
}

const navStyles = `
  .brand {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    padding: var(--s-1) var(--s-2);
  }
  .brand-mark {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: var(--accent-income);
    color: #0b0d10;
    display: grid;
    place-items: center;
    font-weight: 900;
    font-size: 13px;
    letter-spacing: -0.02em;
    flex-shrink: 0;
  }
  .brand-name {
    font-size: 17px;
    font-weight: 800;
    letter-spacing: -0.01em;
    color: var(--fg);
  }
  .brand-tag {
    font-size: 11px;
    color: var(--fg-faint);
    margin-top: -2px;
    font-weight: 500;
  }

  .user-card {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    padding: var(--s-3);
    background: var(--bg-surface);
    border: 1px solid var(--line);
    border-radius: var(--r-md);
  }
  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: linear-gradient(135deg, #ffd966, #f6b26b);
    display: grid;
    place-items: center;
    font-weight: 800;
    color: #1b1b1b;
    flex-shrink: 0;
    font-size: 15px;
  }
  .user-meta {
    min-width: 0;
  }
  .user-name {
    font-size: 14px;
    font-weight: 700;
    color: var(--fg);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .user-sub {
    font-size: 12px;
    color: var(--fg-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nav-section-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--fg-faint);
    text-transform: uppercase;
    padding: var(--s-3) var(--s-2) var(--s-2);
  }

  .nav-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    padding: 10px var(--s-3);
    border: 0;
    border-radius: var(--r-sm);
    background: transparent;
    color: var(--fg-muted);
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    text-align: left;
    min-height: 40px;
    transition: background 120ms, color 120ms;
    box-shadow: none;
  }
  .nav-item:hover {
    color: var(--fg);
    background: rgba(255, 255, 255, 0.04);
  }
  .nav-item.active {
    background: var(--bg-surface);
    color: var(--fg);
    box-shadow: inset 0 0 0 1px var(--line);
  }
  .nav-item.active .nav-icon i,
  .nav-item.active .nav-label {
    color: var(--fg);
  }
  .nav-item.active .nav-dot {
    background: var(--accent-income);
  }
  .nav-icon {
    width: 16px;
    display: grid;
    place-items: center;
  }
  .nav-icon i {
    font-size: 14px;
    color: inherit;
  }
  .nav-label {
    flex: 1;
  }
  .nav-dot {
    width: 4px;
    height: 16px;
    border-radius: 2px;
    background: transparent;
    transition: background 120ms;
  }

  .spacer {
    flex: 1;
  }

  .nav-footer {
    display: flex;
    gap: var(--s-2);
    padding-top: var(--s-3);
    border-top: 1px solid var(--line);
  }
  .nav-footer button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px;
    border: 0;
    background: transparent;
    border-radius: var(--r-sm);
    color: var(--fg-muted);
    font-family: inherit;
    font-size: 12px;
    font-weight: 600;
    min-height: 40px;
    cursor: pointer;
  }
  .nav-footer button:hover {
    color: var(--fg);
    background: rgba(255, 255, 255, 0.04);
  }
  .nav-footer button i {
    font-size: 12px;
  }
`;

const Sidebar = styled.aside`
  height: 100vh;
  padding: var(--s-5) var(--s-4);
  background: var(--bg-app);
  border-right: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  gap: var(--s-5);
  overflow-y: auto;

  ${navStyles}

  &::-webkit-scrollbar {
    width: 0;
  }

  @media (max-width: 899px) {
    display: none;
  }
`;

const Drawer = styled.nav`
  position: fixed;
  z-index: 95;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background: var(--bg-app);
  border-right: 1px solid var(--line);
  padding: var(--s-5) var(--s-4);
  transform: translateX(-100%);
  transition: transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1);
  display: flex;
  flex-direction: column;
  gap: var(--s-5);
  overflow-y: auto;

  ${navStyles}

  &.open {
    transform: translateX(0);
  }

  .drawer-close {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 36px;
    height: 36px;
    border-radius: var(--r-sm);
    border: 0;
    background: transparent;
    display: grid;
    place-items: center;
    color: var(--fg-muted);
    cursor: pointer;
    font-size: 16px;
  }
  .drawer-close:hover {
    color: var(--fg);
    background: rgba(255, 255, 255, 0.06);
  }

  @media (min-width: 900px) {
    display: none;
  }
`;

const ExportModalStyled = styled.div`
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(11, 13, 16, 0.7);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 200;
  }

  .modal-box {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 201;
    background: var(--bg-surface);
    border: 1px solid var(--line-strong);
    border-radius: var(--r-lg);
    padding: var(--s-5);
    width: min(340px, calc(100vw - 32px));
    box-shadow: var(--shadow-pop);
  }

  .modal-title {
    font-size: 16px;
    font-weight: 800;
    letter-spacing: -0.01em;
    margin: 0 0 var(--s-1);
    color: var(--fg);
  }

  .modal-sub {
    font-size: 13px;
    color: var(--fg-muted);
    margin: 0 0 var(--s-4);
  }

  .modal-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: var(--s-5);
  }

  .modal-label {
    font-size: 11px;
    font-weight: 700;
    color: var(--fg-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  select {
    width: 100%;
    height: 38px;
    padding: 0 var(--s-3);
    background: var(--bg-inset);
    color: var(--fg);
    border: 1px solid var(--line-strong);
    border-radius: var(--r-sm);
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }

  .modal-actions {
    display: flex;
    gap: var(--s-2);
    justify-content: flex-end;
  }

  .btn-cancel {
    height: 36px;
    padding: 0 14px;
    border-radius: var(--r-sm);
    border: 1px solid var(--line);
    background: transparent;
    color: var(--fg-muted);
    font-family: inherit;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;

    &:hover { color: var(--fg); background: var(--bg-inset); }
  }

  .btn-download {
    height: 36px;
    padding: 0 16px;
    border-radius: var(--r-sm);
    border: none;
    background: var(--fg);
    color: #0b0d10;
    font-family: inherit;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;

    i { font-size: 13px; }

    &:hover { opacity: 0.9; }
  }
`;

const DrawerBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 90;
  background: var(--bg-overlay);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  opacity: 0;
  pointer-events: none;
  transition: opacity 200ms;

  &.open {
    opacity: 1;
    pointer-events: auto;
  }

  @media (min-width: 900px) {
    display: none;
  }
`;

export default Navigation;
