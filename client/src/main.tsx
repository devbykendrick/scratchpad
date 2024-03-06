import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Deck from "./Deck.tsx";
import QuickNotesView from "./components/Views/QuickNotesView.tsx";
import HomeView from "./components/Views/HomeView.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeView />,
  },
  {
    path: "/decks/:deckId",
    element: <Deck />,
  },
  {
    path: "/quick-notes",
    element: <QuickNotesView />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
