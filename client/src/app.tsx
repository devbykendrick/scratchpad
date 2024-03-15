import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import { Navigate } from "react-router-dom";
import QuickNotesView from "./components/Views/QuickNotesView";
import LoginView from "./components/Views/LoginView";
// import SignupView from "./components/Views/SignupView";

function App() {
  const { user } = useAuthContext();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <QuickNotesView /> : <Navigate to="/login" />}
        />
        {/* <Route
          path="/signup"
          element={!user ? <SignupView /> : <Navigate to="/" />}
        /> */}
        <Route
          path="/login"
          element={!user ? <LoginView /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
