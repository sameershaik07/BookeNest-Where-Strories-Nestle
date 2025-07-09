import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sign.css';
import Header from './Header';
import Footer from './Footer';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cpassword: '',
    user_type: 'user',
  });

  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('red');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.cpassword) {
      setMessage('All fields are required.');
      setMessageColor('red');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setMessage('Please enter a valid email.');
      setMessageColor('red');
      return;
    }

    if (formData.password !== formData.cpassword) {
      setMessage('Passwords do not match.');
      setMessageColor('red');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      user_type: formData.user_type,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Registration successful! You can now log in.');
        setMessageColor('green');
        setFormData({
          name: '',
          email: '',
          password: '',
          cpassword: '',
          user_type: 'user',
        });
      } else {
        setMessage(data.message || 'Registration failed. Please try again.');
        setMessageColor('red');
      }
    } catch (error) {
      setMessage('Server error. Please try again later.');
      setMessageColor('red');
    }
  };

  return (
    <>
      <Header />
      <div className="netflix-auth-bg">
        <form className="netflix-auth-form" onSubmit={handleSubmit}>
          <h2 className="netflix-title">Register Now</h2>
          {message && <p className="netflix-message" style={{ color: messageColor }}>{message}</p>}

          <input
            className="netflix-input"
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            className="netflix-input"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            className="netflix-input"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            className="netflix-input"
            type="password"
            name="cpassword"
            placeholder="Confirm your password"
            value={formData.cpassword}
            onChange={handleChange}
            required
          />

          <select
            name="user_type"
            value={formData.user_type}
            onChange={handleChange}
            className="netflix-select"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button className="netflix-btn" type="submit">Register Now</button>

          <p className="netflix-switch">
            Already have an account? <Link to="/signin" className="netflix-link">Login now</Link>
          </p>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default Signup;