import React, { useEffect, useState } from "react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();

      if (response.ok) {
        setOrders(data);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="admin-orders-page">
      <div className="admin-orders-container">

        {/* Header */}
        <div className="admin-orders-header">
          <p className="admin-small-title">SALES & TRANSACTIONS</p>
          <h1>Customer Orders</h1>
          <p>Review all customer orders, item breakdowns, and order status.</p>
        </div>

        {/* Orders Count */}
        <div className="admin-orders-count">
          <span>Total Orders: <strong>{orders.length}</strong></span>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="admin-no-data">
            <p>No orders found.</p>
          </div>
        ) : (
          <div className="admin-orders-list">
            {orders.map((order) => (
              <div key={order._id} className="admin-order-card">

                {/* Top: Order ID, Date, Status */}
                <div className="order-card-top">
                  <div>
                    <span className="order-id-label">Order ID: </span>
                    <strong className="order-id-val">{order._id}</strong>
                    {order.orderDate && (
                      <span className="order-date">
                        {" "}• {new Date(order.orderDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <span className={`status-badge status-${order.status ? order.status.toLowerCase() : "pending"}`}>
                    {order.status || "Pending"}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="order-customer-section">
                  <div className="customer-info-box">
                    <span className="customer-label">Customer Name:</span>
                    <span className="customer-val">{order.customerName || order.userId?.name || order.userId || "N/A"}</span>
                  </div>
                  <div className="customer-info-box">
                    <span className="customer-label">Customer Email:</span>
                    <span className="customer-val">{order.customerEmail || order.userId?.email || "N/A"}</span>
                  </div>
                </div>

                {/* Ordered Items */}
                <div className="order-products-section">
                  <h4>Ordered Items:</h4>
                  {order.products && order.products.length > 0 ? (
                    <table className="order-products-table">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Qty</th>
                          <th>Price</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.products.map((item, index) => (
                          <tr key={index}>
                            <td>{item.name || item.productId?._id || item.productId || "Product"}</td>
                            <td>{item.quantity || 1}</td>
                            <td>₹{item.price || 0}</td>
                            <td>₹{(item.price || 0) * (item.quantity || 1)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="no-items-text">No items in this order.</p>
                  )}
                </div>

                {/* Order Footer: Total Amount */}
                <div className="order-card-bottom">
                  <span className="total-label">Total Amount:</span>
                  <span className="total-val">₹{order.totalAmount}</span>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminOrders;

