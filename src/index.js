import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import App from "./App";
import { GlobalProvider } from "./context/globalContext";
import { AuthProvider } from "./context/AuthContext";
import { GlobalStyle } from "./styles/GlobalStyle";
import { BrowserRouter } from "react-router-dom";

axios.defaults.withCredentials = true;

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
