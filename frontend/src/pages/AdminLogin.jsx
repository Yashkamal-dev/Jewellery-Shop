import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      if (data.user.role !== "admin") {
        alert("You are not an admin");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/admin/products");
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <p className="auth-small-title">ADMINISTRATION</p>

        <h1>Admin Login</h1>

        <p className="auth-subtitle">
          Sign in to access the jewellery admin dashboard.
        </p>

        <form onSubmit={handleLogin}>
          <label>Admin Email</label>
          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Admin Password</label>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="auth-button">
            Admin Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;

