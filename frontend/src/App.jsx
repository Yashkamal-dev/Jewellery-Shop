import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";

import AdminNavbar from "./pages/AdminNavbar";
import AdminProducts from "./pages/AdminProducts";
import AdminUsers from "./pages/AdminUsers";
import AdminOrders from "./pages/AdminOrders";

import "./App.css";


// =========================================================
// ADMIN PROTECTION
// =========================================================

function AdminRoute({ children }) {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (!user || user.role !== "admin") {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return children;
}


// =========================================================
// APP
// =========================================================

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =================================================
            USER PAGES
        ================================================= */}

        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />

        <Route
          path="/products"
          element={
            <>
              <Navbar />
              <Products />
            </>
          }
        />

        <Route
          path="/cart"
          element={
            <>
              <Navbar />
              <Cart />
            </>
          }
        />

        <Route
          path="/signup"
          element={
            <>
              <Navbar />
              <Signup />
            </>
          }
        />

        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <Login />
            </>
          }
        />


        {/* =================================================
            ADMIN LOGIN
        ================================================= */}

        <Route
          path="/admin/login"
          element={
            <>
              <Navbar />
              <AdminLogin />
            </>
          }
        />


        {/* =================================================
            ADMIN MAIN URL
        ================================================= */}

        <Route
          path="/admin"
          element={
            <Navigate
              to="/admin/login"
              replace
            />
          }
        />


        {/* =================================================
            ADMIN PRODUCTS
        ================================================= */}

        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminNavbar />
              <AdminProducts />
            </AdminRoute>
          }
        />


        {/* =================================================
            ADMIN USERS
        ================================================= */}

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminNavbar />
              <AdminUsers />
            </AdminRoute>
          }
        />


        {/* =================================================
            ADMIN ORDERS
        ================================================= */}

        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminNavbar />
              <AdminOrders />
            </AdminRoute>
          }
        />


        {/* =================================================
            UNKNOWN URL
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;