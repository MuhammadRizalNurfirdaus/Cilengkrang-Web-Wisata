import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./assets/css/style.css";
// import ErrorBoundary from "./components/ErrorBoundary"; // Optional in prod but useful here

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <ErrorBoundary> */}
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
    {/* </ErrorBoundary> */}
  </React.StrictMode>
);
