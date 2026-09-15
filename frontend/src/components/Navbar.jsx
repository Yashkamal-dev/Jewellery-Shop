import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // State to check if user is logged in
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Re-check localStorage whenever the page route changes
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    setUser(savedUser ? JSON.parse(savedUser) : null);
  }, [location]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">

      <Link to="/" className="navbar-logo">
        ✦ Jewellery Store
      </Link>

      <div className="navbar-links">

        <Link to="/">
          Home
        </Link>

        <Link to="/products">
          Products
        </Link>

        <Link to="/cart">
          Cart
        </Link>

        {user ? (
          <button
            type="button"
            onClick={handleLogout}
            className="navbar-logout"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/signup">
              Sign Up
            </Link>

            <Link
              to="/login"
              className="navbar-login"
            >
              Login
            </Link>
          </>
        )}

        <Link
          to="/admin"
          className="navbar-admin"
        >
          Admin
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;