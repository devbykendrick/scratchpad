import React from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthContextProvider } from "./context/AuthContext";
import App from "./app";
import "./index.css";

const GOOGLE_CLIENT_ID = "";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <GoogleOAuthProvider clientId={`${GOOGLE_CLIENT_ID}`}>
        <App />
      </GoogleOAuthProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
