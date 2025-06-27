import React from 'react';
import '../styles/Home.css';

const Account = () => {
  const user = {
    name: "Demo User",
    email: "demo@example.com",
    user_type: "user"
  };

  return (
    <div style={{ padding: "30px", color: "#fff", maxWidth: "600px", margin: "40px auto" }}>
      <h2>My Account</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.user_type}</p>
    </div>
  );
};

export default Account;
