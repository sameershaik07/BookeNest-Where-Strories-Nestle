import React, { useState } from 'react';
import '../styles/Home.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("Reset link sent! (Simulate backend)");
  };

  return (
    <div className="form-container" style={{ padding: "30px", background: "#1e1e1e", borderRadius: "10px", margin: "50px auto", width: "90%", maxWidth: "400px" }}>
      <form onSubmit={handleSubmit}>
        <h3 style={{ color: "#fff", marginBottom: "20px" }}>Forgot Password</h3>
        {message && <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>}

        <input type="email" name="email" placeholder="Enter your email" required className="box" onChange={(e) => setEmail(e.target.value)} />
        <input type="submit" value="Send Reset Link" className="btn browse-button" />
      </form>
    </div>
  );
};

export default ForgotPassword;
