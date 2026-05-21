import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import App from "./App";
import { GlobalProvider } from "./context/globalContext";
import { AuthProvider } from "./context/AuthContext";
import { GlobalStyle } from "./styles/GlobalStyle";
import { BrowserRouter } from "react-router-dom";

axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    if (status === 401 && url.includes("/api/v1/")) {
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("email");
      localStorage.removeItem("username");
      sessionStorage.setItem("sessionExpired", "1");
      window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GlobalStyle />
    <BrowserRouter>
      <AuthProvider>
        <GlobalProvider>
          <App />
        </GlobalProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
