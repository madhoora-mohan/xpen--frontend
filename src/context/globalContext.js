import React, { useContext, useState } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const GlobalContext = React.createContext();

const DEFAULT_ERROR = "Something went wrong. Please try again.";

export const GlobalProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [limits, setLimits] = useState([]);
  const [error, setError] = useState(null);

  const emailid = localStorage.getItem("email");

  const addIncome = async (income) => {
    await axios
      .post(`${BASE_URL}add-income/${emailid}`, income)
      .catch((err) => {
        setError(err.response?.data?.message ?? DEFAULT_ERROR);
      });
    getIncomes();
  };

  const getIncomes = async () => {
    const response = await axios.get(`${BASE_URL}get-incomes/${emailid}`);
    setIncomes(response.data);
    // console.log(response.data);
  };

  const deleteIncome = async (id) => {
    await axios.delete(`${BASE_URL}delete-income/${id}`);
    getIncomes();
  };

  const totalIncome = () => {
    let total = 0;
    incomes.forEach((income) => {
      total = total + income.amount;
    });

    return total;
  };

  const addExpense = async (expense) => {
    await axios
      .post(`${BASE_URL}add-expense/${emailid}`, expense)
      .catch((err) => {
        setError(err.response?.data?.message ?? DEFAULT_ERROR);
      });
    getExpenses();
  };

  const getExpenses = async () => {
    const response = await axios.get(`${BASE_URL}get-expenses/${emailid}`);
    setExpenses(response.data);
    // console.log(response.data);
  };

  const deleteExpense = async (id) => {
    await axios.delete(`${BASE_URL}delete-expense/${id}`);
    getExpenses();
  };

  const totalExpenses = () => {
    let total = 0;
    expenses.forEach((expense) => {
      total = total + expense.amount;
    });

    return total;
  };

  const EXPENSE_CATEGORIES = [
    "education",
    "groceries",
    "health",
    "subscriptions",
    "takeaways",
    "shopping",
    "travelling",
    "other",
  ];

  const INCOME_CATEGORIES = [
    "salary",
    "freelancing",
    "investments",
    "stocks",
    "crypto",
    "loan",
    "pocketmoney",
    "other",
  ];

  const expCat = () => {
    const totals = Object.fromEntries(EXPENSE_CATEGORIES.map((c) => [c, 0]));
    expenses.forEach((expense) => {
      if (expense.category in totals) {
        totals[expense.category] += expense.amount;
      }
    });
    return EXPENSE_CATEGORIES.map((c) => totals[c]);
  };

  const incCat = () => {
    const totals = Object.fromEntries(INCOME_CATEGORIES.map((c) => [c, 0]));
    incomes.forEach((income) => {
      if (income.category in totals) {
        totals[income.category] += income.amount;
      }
    });
    return INCOME_CATEGORIES.map((c) => totals[c]);
  };

  const getLimit = async () => {
    const response = await axios.get(`${BASE_URL}get-limit/${emailid}`);
    setLimits(response.data[0].limit);
  };

  const updateLimit = async (uplimit) => {
    await axios.put(`${BASE_URL}update-limit/${emailid}/${uplimit}`);
    getLimit();
  };

  const totalBalance = () => {
    return totalIncome() - totalExpenses();
  };

  const transactionHistory = () => {
    const history = [...incomes, ...expenses];
    history.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return history.slice(0, 3);
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
        limits,
        setLimits,
        getLimit,
        updateLimit,
        totalExpenses,
        totalBalance,
        transactionHistory,
        error,
        setError,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
