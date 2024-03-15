import React from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthContextProvider } from "./context/AuthContext";
import { useAuthContext } from "./hooks/useAuthContext";
import App from "./app";
import "./index.css";

const { user } = useAuthContext();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContextProvider>
      {user ? (
        <GoogleOAuthProvider
          clientId={`${import.meta.env.VITE_GOOGLE_CLIENT_ID}`}
        >
          <App />
        </GoogleOAuthProvider>
      ) : (
        <GoogleOAuthProvider clientId={""}>
          <App />
        </GoogleOAuthProvider>
      )}
    </AuthContextProvider>
  </React.StrictMode>
);
