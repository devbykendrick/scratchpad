// import React from "react";
// import { createRoot } from "react-dom/client";
// import { GoogleOAuthProvider } from "@react-oauth/google";
// import { AuthContextProvider } from "./context/AuthContext";
// import App from "./app";
// import "./index.css";

// createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <AuthContextProvider>
//       <GoogleOAuthProvider clientId={`${import.meta.env.GOOGLE_CLIENT_ID}`}>
//         <App />
//       </GoogleOAuthProvider>
//     </AuthContextProvider>
//   </React.StrictMode>
// );

import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthContextProvider } from "./context/AuthContext";
import App from "./app";
import "./index.css";

function AppWithGoogleAuth() {
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/google-client-id")
      .then((response) => response.json())
      .then((data) => {
        setGoogleClientId(data.googleClientId);
      })
      .catch((error) =>
        console.error("Error fetching Google Client ID:", error)
      );
  }, []);

  return (
    <React.StrictMode>
      <AuthContextProvider>
        {googleClientId && (
          <GoogleOAuthProvider clientId={googleClientId}>
            <App />
          </GoogleOAuthProvider>
        )}
      </AuthContextProvider>
    </React.StrictMode>
  );
}

createRoot(document.getElementById("root")!).render(<AppWithGoogleAuth />);
