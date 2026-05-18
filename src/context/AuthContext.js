import React, { useContext, useState } from "react";

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("loggedIn"));

  const login = (email, username) => {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("email", email);
    localStorage.setItem("username", username);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
