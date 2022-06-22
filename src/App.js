import "./App.css";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import SignUp from "./components/SignUp";
import { Dashboard } from "./components/dashboard";
import { Navigate } from "react-router-dom";
function App() {
  const { currentUser } = useAuth();

  return (
    <>
      <Router>
        <Navbar />
        <div className="container">
          <div className="d-flex align-items-center justify-content-center mt-5">
            <Routes>
              <Route
                path="/"
                exact
                element={currentUser ? <Dashboard /> : <Login />}
              />
              <Route
                path="/login"
                exact
                element={!currentUser ? <Login /> : <Navigate to="/" />}
              />
              <Route
                path="/signup"
                exact
                element={!currentUser && <SignUp />}
              />
              <Route
                path="/dashboard"
                exact
                element={currentUser ? <Dashboard /> : <Login />}
              />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
