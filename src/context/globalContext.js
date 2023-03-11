import React, { useContext, useState } from "react";
import axios from "axios";

const BASE_URL = "https://xpens.onrender.com/api/v1/";

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [limits, setLimits] = useState([]);
  const [error, setError] = useState(null);
  // const [limiter, setlimiter] = useState(null);
  // const [expensesWCategory, setExpensesWCategory] = useState([]);

  const emailid = localStorage.getItem("email");

  //calculate incomes
  const addIncome = async (income) => {
    const response = await axios
      .post(`${BASE_URL}add-income/${emailid}`, income)
      .catch((err) => {
        setError(err.response.data.message);
      });
    getIncomes();
  };

  const getIncomes = async () => {
    const response = await axios.get(`${BASE_URL}get-incomes/${emailid}`);
    setIncomes(response.data);
    // console.log(response.data);
  };

  const deleteIncome = async (id) => {
    const res = await axios.delete(`${BASE_URL}delete-income/${id}`);
    getIncomes();
  };

  const totalIncome = () => {
    let totalIncome = 0;
    incomes.forEach((income) => {
      totalIncome = totalIncome + income.amount;
    });

    return totalIncome;
  };

  //calculate incomes
  const addExpense = async (income) => {
    const response = await axios
      .post(`${BASE_URL}add-expense/${emailid}`, income)
      .catch((err) => {
        setError(err.response.data.message);
      });
    getExpenses();
  };

  const getExpenses = async () => {
    const response = await axios.get(`${BASE_URL}get-expenses/${emailid}`);
    setExpenses(response.data);
    // console.log(response.data);
  };

  const deleteExpense = async (id) => {
    const res = await axios.delete(`${BASE_URL}delete-expense/${id}`);
    getExpenses();
  };

  const totalExpenses = () => {
    let totalIncome = 0;
    expenses.forEach((income) => {
      totalIncome = totalIncome + income.amount;
    });

    return totalIncome;
  };

  const expCat = () => {
    let eduAmount = 0;
    let grocAmount = 0;
    let healthAmount = 0;
    let subAmount = 0;
    let takeawayAmount = 0;
    let shopAmount = 0;
    let travelAmount = 0;
    let otherAmount = 0;
    expenses.forEach((income) => {
      if (income.category === "education") {
        eduAmount += income.amount;
      } else if (income.category === "groceries") {
        grocAmount += income.amount;
      } else if (income.category === "health") {
        healthAmount += income.amount;
      } else if (income.category === "subscriptions") {
        subAmount += income.amount;
      } else if (income.category === "takeaways") {
        takeawayAmount += income.amount;
      } else if (income.category === "shopping") {
        shopAmount += income.amount;
      } else if (income.category === "travelling") {
        travelAmount += income.amount;
      } else if (income.category === "other") {
        otherAmount += income.amount;
      }
    });

    return [
      eduAmount,
      grocAmount,
      healthAmount,
      subAmount,
      takeawayAmount,
      shopAmount,
      travelAmount,
      otherAmount,
    ];
  };

  const incCat = () => {
    let salaryAmount = 0;
    let freelanceAmount = 0;
    let invAmount = 0;
    let stocksAmount = 0;
    let cryptoAmount = 0;
    let loanAmount = 0;
    let pocketAmount = 0;
    let otherAmount = 0;
    incomes.forEach((income) => {
      if (income.category === "salary") {
        salaryAmount += income.amount;
      } else if (income.category === "freelancing") {
        freelanceAmount += income.amount;
      } else if (income.category === "investments") {
        invAmount += income.amount;
      } else if (income.category === "stocks") {
        stocksAmount += income.amount;
      } else if (income.category === "crypto") {
        cryptoAmount += income.amount;
      } else if (income.category === "loan") {
        loanAmount += income.amount;
      } else if (income.category === "pocketmoney") {
        pocketAmount += income.amount;
      } else if (income.category === "other") {
        otherAmount += income.amount;
      }
    });

    return [
      salaryAmount,
      freelanceAmount,
      invAmount,
      stocksAmount,
      cryptoAmount,
      loanAmount,
      pocketAmount,
      otherAmount,
    ];
  };

  const getLimit = async () => {
    const response = await axios.get(`${BASE_URL}get-limit/${emailid}`);
    setLimits(response.data[0].limit);
    // setlimiter(response.data[0].limit);
  };

  const updateLimit = async (uplimit) => {
    const res = await axios.put(
      `${BASE_URL}update-limit/${emailid}/${uplimit}`
    );
    getLimit();
    // console.log(incomes);
    // return await axios.put(`${BASE_URL}update-limit`, limit);
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
        // limiter,
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
