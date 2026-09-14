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
      console.log(error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin - Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
            }}
          >
            <h3>Order ID: {order._id}</h3>

            <p>
              User ID: {order.userId?._id || order.userId}
            </p>

            <p>
              Total Amount: ₹{order.totalAmount}
            </p>

            <p>
              Status: {order.status || "Pending"}
            </p>

            <h4>Products:</h4>

            {order.products &&
              order.products.map((item, index) => (
                <div key={index}>
                  <p>
                    Product ID: {item.productId?._id || item.productId}
                  </p>

                  <p>
                    Quantity: {item.quantity}
                  </p>
                </div>
              ))}

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default AdminOrders;

