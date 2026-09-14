import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
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

        <Link to="/signup">
          Sign Up
        </Link>

        <Link
          to="/login"
          className="navbar-login"
        >
          Login
        </Link>

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