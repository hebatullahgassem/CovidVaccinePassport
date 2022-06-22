import React from "react";
import covid from "../images/Covid.jpg";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { logout, currentUser } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={covid} alt={covid} width="70"></img>
          <span className="text-danger">Egyption Covid-19 vaccination</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {!currentUser && (
              <li className="nav-item me-2">
                <Link to="/login" className="btn btn-primary">
                  login
                </Link>
              </li>
            )}

            {currentUser && (
              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  className="btn btn-danger me-lg-1 mb-sm-2 mt-2 mt-md-0"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
