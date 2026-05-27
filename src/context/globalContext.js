import React, { useContext, useState, useCallback } from "react";
import axios from "axios";
import { EXPENSE, INCOME } from "../config/categories";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const GlobalContext = React.createContext();

const DEFAULT_ERROR = "Something went wrong. Please try again.";

export const GlobalProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [activeCycle, setActiveCycle] = useState(null);
  const [cyclesLoaded, setCyclesLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [loadingCount, setLoadingCount] = useState(0);
  const loading = loadingCount > 0;
  const [refreshKey, setRefreshKey] = useState(0);

  const addIncome = async (income) => {
    await axios
      .post(`${BASE_URL}add-income`, income)
      .catch((err) => {
        setError(err.response?.data?.message ?? DEFAULT_ERROR);
      });
    getIncomes();
  };

  const getIncomes = useCallback(async () => {
    setLoadingCount((c) => c + 1);
    try {
      const response = await axios.get(`${BASE_URL}get-incomes`);
      setIncomes(response.data);
    } finally {
      setLoadingCount((c) => c - 1);
    }
  }, []);

  const deleteIncome = async (id) => {
    await axios.delete(`${BASE_URL}delete-income/${id}`);
    getIncomes();
  };

  const totalIncome = () =>
    incomes.reduce((acc, item) => acc + item.amount, 0);

  const addExpense = async (expense) => {
    await axios
      .post(`${BASE_URL}add-expense`, expense)
      .catch((err) => {
        setError(err.response?.data?.message ?? DEFAULT_ERROR);
      });
    getExpenses();
  };

  const getExpenses = useCallback(async () => {
    setLoadingCount((c) => c + 1);
    try {
      const response = await axios.get(`${BASE_URL}get-expenses`);
      setExpenses(response.data);
    } finally {
      setLoadingCount((c) => c - 1);
    }
  }, []);

  const deleteExpense = async (id) => {
    await axios.delete(`${BASE_URL}delete-expense/${id}`);
    getExpenses();
  };

  const totalExpenses = () =>
    expenses.reduce((acc, item) => acc + item.amount, 0);

  const addTransfer = async (transfer) => {
    await axios
      .post(`${BASE_URL}add-transfer`, transfer)
      .catch((err) => {
        setError(err.response?.data?.message ?? DEFAULT_ERROR);
      });
    getTransfers();
  };

  const getTransfers = useCallback(async () => {
    setLoadingCount((c) => c + 1);
    try {
      const response = await axios.get(`${BASE_URL}get-transfers`);
      setTransfers(response.data);
    } finally {
      setLoadingCount((c) => c - 1);
    }
  }, []);

  const deleteTransfer = async (id) => {
    await axios.delete(`${BASE_URL}delete-transfer/${id}`);
    getTransfers();
  };

  const totalsByCategory = (items, catalog) => {
    const totals = Object.fromEntries(catalog.map((c) => [c.id, 0]));
    items.forEach((item) => {
      if (item.category in totals) {
        totals[item.category] += item.amount;
      }
    });
    return catalog.map((c) => totals[c.id]);
  };

  const expCat = () => totalsByCategory(expenses, EXPENSE);
  const incCat = () => totalsByCategory(incomes, INCOME);

  const sumTransferCat = (catId) =>
    transfers
      .filter((t) => t.category === catId)
      .reduce(
        (acc, t) => acc + (t.direction === "out" ? t.amount : -t.amount),
        0
      );

  const outstandingLent = () => {
    const lentOut = transfers
      .filter((t) => t.category === "lending_money" && t.direction === "out")
      .reduce((acc, t) => acc + t.amount, 0);
    const lentBack = transfers
      .filter((t) => t.category === "lent_money" && t.direction === "in")
      .reduce((acc, t) => acc + t.amount, 0);
    return lentOut - lentBack;
  };

  const totalInvested = () =>
    transfers
      .filter((t) => t.category === "investments")
      .reduce(
        (acc, t) => acc + (t.direction === "out" ? t.amount : -t.amount),
        0
      );

  const netTransferOut = () =>
    transfers.reduce(
      (acc, t) => acc + (t.direction === "out" ? t.amount : -t.amount),
      0
    );

  const netCash = () => totalIncome() - totalExpenses() - netTransferOut();

  const totalBalance = () => totalIncome() - totalExpenses();

  // ── Cycles ────────────────────────────────────────────────────────────────

  const getCycles = useCallback(async () => {
    const res = await axios.get(`${BASE_URL}cycles`);
    setCycles(res.data);
    const active = res.data.find((c) => c.isActive) || null;
    setActiveCycle(active);
    setCyclesLoaded(true);
    return { cycles: res.data, active };
  }, []);

  // Boot: resolve cycle state first, only load transactions if a cycle is active.
  // Avoids the backend's 409 NO_ACTIVE_CYCLE on every transaction endpoint.
  const bootstrap = useCallback(async () => {
    setRefreshKey((k) => k + 1);
    setLoadingCount((c) => c + 1);
    try {
      const { active } = await getCycles();
      if (active) {
        await Promise.all([getIncomes(), getExpenses(), getTransfers()]);
      }
    } catch (e) {
      setError(e.response?.data?.message ?? DEFAULT_ERROR);
    } finally {
      setLoadingCount((c) => c - 1);
    }
  }, [getCycles, getIncomes, getExpenses, getTransfers]);

  // Open a cycle (first one or, after closing, the next). Throws on failure so
  // the caller can sequence close→open and surface errors.
  const openCycle = async (payload) => {
    const res = await axios.post(`${BASE_URL}cycles/open`, payload);
    return res.data;
  };

  // Close the active cycle. Returns { cycle, netCash } — netCash feeds carry-over.
  const closeCycle = async (endDate) => {
    const res = await axios.post(`${BASE_URL}cycles/close`, { endDate });
    return res.data;
  };

  const compareCycles = useCallback(async (ids) => {
    if (!ids.length) return [];
    const res = await axios.get(`${BASE_URL}cycles/compare`, {
      params: { ids: ids.join(",") },
    });
    return res.data;
  }, []);

  const getCycleTransactions = useCallback(async (id) => {
    const res = await axios.get(`${BASE_URL}cycles/${id}/transactions`);
    return res.data; // { incomes, expenses, transfers }
  }, []);

  const deleteCycle = async (id) => {
    await axios.delete(`${BASE_URL}cycles/${id}`);
  };

  const exportCycles = (n) => {
    const url = n ? `${BASE_URL}cycles/export?n=${n}` : `${BASE_URL}cycles/export`;
    window.open(url, "_blank");
  };

  const refreshAll = useCallback(() => {
    getIncomes();
    getExpenses();
    getTransfers();
  }, [getIncomes, getExpenses, getTransfers]);

  const HISTORY_LIMIT = 6;

  const transactionHistory = () => {
    const history = [...incomes, ...expenses, ...transfers];
    history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return history.slice(0, HISTORY_LIMIT);
  };

  return (
    <GlobalContext.Provider
      value={{
        addIncome,
        getIncomes,
        incomes,
        deleteIncome,
        expenses,
        totalIncome,
        addExpense,
        getExpenses,
        deleteExpense,
        expCat,
        incCat,
        totalExpenses,
        totalBalance,
        transactionHistory,
        transfers,
        addTransfer,
        getTransfers,
        deleteTransfer,
        outstandingLent,
        totalInvested,
        netCash,
        sumTransferCat,
        error,
        setError,
        loading,
        refreshAll,
        cycles,
        activeCycle,
        cyclesLoaded,
        getCycles,
        bootstrap,
        openCycle,
        closeCycle,
        deleteCycle,
        compareCycles,
        getCycleTransactions,
        exportCycles,
        refreshKey,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
