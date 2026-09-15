import React, { useEffect, useState } from "react";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.log("Error fetching users:", error);
      });
  }, []);

  // Filter out admin accounts to show only client/customer users
  const clientUsers = users.filter((user) => user.role !== "admin");

  return (
    <div className="admin-users-page">
      <div className="admin-users-container">

        {/* Header */}
        <div className="admin-users-header">
          <p className="admin-small-title">ACCOUNTS</p>
          <h1>Registered Users</h1>
          <p>View all registered client and customer accounts.</p>
        </div>

        {/* User Count */}
        <div className="admin-users-count">
          <span>Total Clients: <strong>{clientUsers.length}</strong></span>
        </div>

        {/* User Cards Grid */}
        {clientUsers.length === 0 ? (
          <div className="admin-no-data">
            <p>No client users found.</p>
          </div>
        ) : (
          <div className="admin-users-grid">
            {clientUsers.map((user) => (
              <div key={user._id} className="admin-user-card">
                <div className="user-card-header">
                  <div className="user-avatar">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="user-title-info">
                    <h3>{user.name || "Unnamed User"}</h3>
                    <span className={`role-badge role-${user.role || "user"}`}>
                      {user.role || "user"}
                    </span>
                  </div>
                </div>

                <div className="user-card-details">
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{user.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">User ID:</span>
                    <span className="detail-value user-id-text">{user._id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminUsers;