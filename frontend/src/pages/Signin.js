import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../admin/context/AdminAuthContext';
import '../styles/Sign.css';
import Header from './Header';
import Footer from './Footer';

function SignIn() {
  const navigate = useNavigate();
  const { login: updateAdminAuthStatus } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('user');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');

    try {
      // This API call is correct as per our latest backend configuration
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          requiredUserType: userType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token); // Correctly stores the token
        localStorage.setItem('user', JSON.stringify(data.user)); // Correctly stores user info
        updateAdminAuthStatus(data.user);
        if (userType === 'admin') {
          navigate('/admin/home');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your network connection or try again later.');
    }
  };

  return (
    <>
      <Header />
      <div className="netflix-auth-bg">
        <form className="netflix-auth-form" onSubmit={handleLogin}>
          <h2 className="netflix-title">Sign In</h2>

          {error && (
            <p className="netflix-error">
              {error}
            </p>
          )}

          <input
            className="netflix-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="netflix-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            className="netflix-select"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button className="netflix-btn" type="submit">Login</button>

          <p className="auth-switch">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="netflix-link">Sign up now</Link>
          </p>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default SignIn;