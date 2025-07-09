import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../styles/Header.css';

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null); // 'user' or 'admin'
    const navigate = useNavigate();

    // Effect to check authentication status on mount and storage changes
    useEffect(() => {
        const checkAuthStatus = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    // Check if the token is expired
                    if (decodedToken.exp * 1000 < Date.now()) {
                        // Token is expired, remove it
                        localStorage.removeItem('token');
                        setIsAuthenticated(false);
                        setUserRole(null);
                    } else {
                        setIsAuthenticated(true);
                        setUserRole(decodedToken.role); // Assuming your token has a 'role' field
                    }
                } catch (error) {
                    console.error("Error decoding token or token is invalid:", error);
                    localStorage.removeItem('token'); // Clear invalid token
                    setIsAuthenticated(false);
                    setUserRole(null);
                }
            } else {
                setIsAuthenticated(false);
                setUserRole(null);
            }
        };

        checkAuthStatus(); // Run once on mount

        // Add event listener to re-check auth status if local storage changes (e.g., login/logout from another tab)
        window.addEventListener('storage', checkAuthStatus);

        return () => {
            window.removeEventListener('storage', checkAuthStatus); // Clean up event listener
        };

    }, []);

    // handleDashboardNavigation function is removed as the Dashboard tab is removed
    // const handleDashboardNavigation = () => { /* ... */ };

    // --- NEW: handleLogout function ---
    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token from local storage
        setIsAuthenticated(false);        // Update authentication state
        setUserRole(null);                // Clear user role
        navigate('/signin');              // Redirect to signin page after logout
        alert('You have been logged out.'); // Provide feedback to the user
    };
    // --- END NEW ---

    return (
        <header style={{ position: 'relative', zIndex: 9999 }}>
            <div className="logo-container">
                <Link to="/" className="logo-link">
                    <img src="/assets/logo.png" alt="BookNest Logo" className="logo-img" />
                    <span className="brand-name">BOOKNEST</span>
                </Link>
            </div>

            <nav className="navbar">
                <Link to="/" className="menu-link">Home</Link>

                <div className="dropdown">
                    <span className="menu-link">Categories ▾</span>
                    <div className="dropdown-content">
                        <Link to="/categories/top">Top Category</Link>
                        <Link to="/categories/fiction">Fiction</Link>
                        <Link to="/categories/non-fiction">Non-Fiction</Link>
                        <Link to="/categories/children">Children</Link>
                    </div>
                </div>

                <Link to="/top-picks" className="menu-link">Top Picks</Link>
                <Link to="/contact" className="menu-link">Contact</Link>

                {/* Dashboard/SignIn Link (common for user/admin) - REMOVED THIS SECTION */}
                {/*
                <span className="menu-link" onClick={handleDashboardNavigation} style={{ cursor: 'pointer' }}>
                    {isAuthenticated ? 'Dashboard' : 'Sign In'}
                </span>
                */}

                <Link to="/cart" className="menu-link">Cart</Link>

                {/* Account Link & Logout: If signed in, "Account" links to Dashboard; otherwise, to Sign Up */}
                {isAuthenticated ? (
                    <>
                        {/* When signed in, "Account" links to Dashboard */}
                        <Link to="/dashboard" className="menu-link">Account</Link>
                        <span className="menu-link" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                            Logout
                        </span>
                    </>
                ) : (
                    // When not signed in, "Account" links to Sign Up
                    <Link to="/signup" className="menu-link">Account</Link>
                )}
            </nav>
        </header>
    );
};

export default Header;