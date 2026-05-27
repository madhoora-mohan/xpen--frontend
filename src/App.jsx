import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import styled from "styled-components";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import { MainLayout } from "./styles/Layouts";
import Navigation from "./Components/Navigation/Navigation";
import Dashboard from "./Components/Dashboard/Dashboard";
import Income from "./Components/Income/Income";
import Expenses from "./Components/Expenses/Expenses";
import Transfers from "./Components/Transfers/Transfers";
import ExpensePattern from "./Components/ExpensePattern/ExpensePattern";
import FirstCycleGate from "./Components/Cycles/FirstCycleGate";
import { Home } from "./Components/Home";
import GlobalFAB from "./Components/FAB/GlobalFAB";
import ErrorBoundary from "./Components/ErrorBoundary/ErrorBoundary";
import { useAuth } from "./context/AuthContext";
import { useGlobalContext } from "./context/globalContext";
import { refresh } from "./utils/Icons";

const PAGE_TITLES = {
  1: "Dashboard",
  2: "Incomes",
  3: "Expenses",
  4: "Transfers",
  5: "Expense Pattern",
};

function Shell() {
  const [active, setActive] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const {
    bootstrap,
    getIncomes,
    getExpenses,
    getTransfers,
    cyclesLoaded,
    activeCycle,
    loading,
  } = useGlobalContext();

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    const es = new EventSource(
      `${process.env.REACT_APP_API_BASE_URL}events`,
      { withCredentials: true }
    );

    es.addEventListener("income_changed", () => getIncomes());
    es.addEventListener("expense_changed", () => getExpenses());
    es.addEventListener("transfer_changed", () => getTransfers());

    return () => es.close();
  }, [getIncomes, getExpenses, getTransfers]);

  const displayData = () => {
    // Gate: no active cycle → block the app until the user creates one.
    if (cyclesLoaded && !activeCycle) {
      return <FirstCycleGate />;
    }
    switch (active) {
      case 1:
        return <Dashboard setActive={setActive} />;
      case 2:
        return <Income />;
      case 3:
        return <Expenses />;
      case 4:
        return <Transfers />;
      case 5:
        return <ExpensePattern />;
      default:
        return <Dashboard setActive={setActive} />;
    }
  };

  const onReload = () => {
    bootstrap();
  };

  return (
    <AppStyled>
      <MainLayout>
        <ErrorBoundary>
          <Navigation
            active={active}
            setActive={setActive}
            drawerOpen={drawerOpen}
            closeDrawer={() => setDrawerOpen(false)}
          />
        </ErrorBoundary>
        <div className="main">
          <div className="topbar">
            <button
              type="button"
              className="menu-btn"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <i className="fa-solid fa-bars" />
            </button>
            <h1>{PAGE_TITLES[active]}</h1>
            <div className="right">
              <button
                type="button"
                className={`icon-btn${loading ? " spinning" : ""}`}
                onClick={onReload}
                title="Reload data"
                aria-label="Reload data"
                disabled={loading}
              >
                {refresh}
              </button>
            </div>
          </div>
          <ErrorBoundary>
            <main>{displayData()}</main>
          </ErrorBoundary>
        </div>
        {/* Global quick-add FAB — mobile/tablet only (hidden ≥900px via CSS).
            Suppressed on the first-cycle gate, where quick-add has no cycle to
            write into. */}
        {!(cyclesLoaded && !activeCycle) && (
          <GlobalFAB drawerOpen={drawerOpen} />
        )}
      </MainLayout>
    </AppStyled>
  );
}

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      {isLoggedIn && <Route path="/" exact element={<Shell />} />}
      {!isLoggedIn && <Route path="/signup" exact element={<Signup />} />}
      {isLoggedIn && (
        <Route path="/signup" exact element={<Navigate replace to="/" />} />
      )}
      {!isLoggedIn && <Route path="/login" exact element={<Login />} />}
      {isLoggedIn && (
        <Route path="/login" exact element={<Navigate replace to="/" />} />
      )}
      {!isLoggedIn && <Route path="/home" exact element={<Home />} />}
      {isLoggedIn && (
        <Route path="/home" exact element={<Navigate replace to="/" />} />
      )}
      {!isLoggedIn && (
        <Route path="/" exact element={<Navigate replace to="/home" />} />
      )}
    </Routes>
  );
}

const AppStyled = styled.div`
  min-height: 100vh;
  background: var(--bg-deep);
  color: var(--fg);

  .main {
    min-width: 0;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow-y: auto;

    @media (max-width: 899px) {
      overflow-y: visible;
      overflow-x: clip;
    }
  }

  main {
    flex: 1;
    width: 100%;
  }

  .topbar {
    position: sticky;
    top: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    gap: var(--s-3);
    padding: 0 var(--s-5);
    height: var(--topbar-h);
    background: rgba(11, 13, 16, 0.7);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--line);
  }

  .topbar h1 {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--fg);
    white-space: nowrap;
    pointer-events: none;
  }

  .topbar .menu-btn {
    width: 40px;
    height: 40px;
    border: 0;
    background: transparent;
    border-radius: var(--r-sm);
    display: grid;
    place-items: center;
    color: var(--fg);
    cursor: pointer;
    font-size: 16px;
  }
  .topbar .menu-btn:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  .topbar .right {
    margin-left: auto;
    display: flex;
    gap: var(--s-2);
    align-items: center;
  }

  .topbar .icon-btn {
    width: 40px;
    height: 40px;
    padding: 0;
    border: 0;
    background: transparent;
    border-radius: var(--r-sm);
    display: grid;
    place-items: center;
    color: var(--fg-muted);
    cursor: pointer;
    font-size: 15px;
  }
  .topbar .icon-btn:hover {
    color: var(--fg);
    background: rgba(255, 255, 255, 0.06);
  }
  .topbar .icon-btn.spinning {
    animation: spin 0.8s linear infinite;
    opacity: 0.5;
    cursor: default;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (min-width: 900px) {
    .topbar .menu-btn {
      display: none;
    }
    .topbar h1 {
      display: none;
    }
    .topbar {
      background: transparent;
      border-bottom: 0;
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
      height: 0;
      padding: 0;
    }
    .topbar .right {
      position: absolute;
      top: 16px;
      right: 24px;
      z-index: 5;
    }
  }
`;

export default App;
