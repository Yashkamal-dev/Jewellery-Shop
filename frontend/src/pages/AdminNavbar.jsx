import React from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="admin-navbar">
      <Link to="/admin/products" className="admin-logo">
        ✦ Admin Panel
      </Link>

      <div className="admin-navbar-links">
        <Link to="/admin/products">Products</Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/orders">Orders</Link>

        <button onClick={handleLogout} className="admin-logout">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;