import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Ensure this import is correct and library is installed

// Create context with default undefined
const AdminAuthContext = createContext(undefined);

// Provider component
export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null); // Will store admin user data if logged in as admin

  // Function to check admin status from localStorage (e.g., after page refresh)
  const checkAdminStatus = () => {
    console.log('AdminAuthProvider: checkAdminStatus called');
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    console.log('AdminAuthProvider: Token from localStorage:', token);
    console.log('AdminAuthProvider: User string from localStorage:', userString);

    if (token && userString) {
      try {
        // Attempt to decode the token
        const decodedToken = jwtDecode(token);
        console.log('AdminAuthProvider: Decoded Token:', decodedToken);

        // Attempt to parse user data
        const user = JSON.parse(userString);
        console.log('AdminAuthProvider: Parsed User Data:', user);

        // Check if token is expired (optional, but good practice)
        const currentTime = Date.now() / 1000; // in seconds
        if (decodedToken.exp < currentTime) {
          console.log('AdminAuthProvider: Token expired.');
          logout(); // Log out if token is expired
          return;
        }

        // Set admin state if the user_type from the stored user data is 'admin'
        if (user.user_type === 'admin') {
          console.log('AdminAuthProvider: User is an admin. Setting admin state.');
          setAdmin(user); // Set the admin state to the user object
        } else {
          console.log('AdminAuthProvider: User is NOT an admin. Setting admin state to null.');
          setAdmin(null); // Not an admin
        }
      } catch (error) {
        console.error("AdminAuthProvider: Error decoding token or parsing user data:", error);
        // If an error occurs during decoding or parsing, it means the stored data is invalid
        logout(); // Clear invalid data
      }
    } else {
      console.log('AdminAuthProvider: No token or user data found. Setting admin state to null.');
      setAdmin(null); // No token or user data found
    }
  };

  // Run this check when the component mounts
  useEffect(() => {
    console.log('AdminAuthProvider: useEffect running on mount.');
    checkAdminStatus();
    // Optionally, add event listener for storage changes if multiple tabs are open
    window.addEventListener('storage', checkAdminStatus);
    return () => {
      console.log('AdminAuthProvider: Cleaning up storage event listener.');
      window.removeEventListener('storage', checkAdminStatus);
    };
  }, []); // Empty dependency array ensures this runs once on mount

  // This 'login' function is now used by SignIn.js to update the context state
  // after a successful backend API call.
  const login = (userData) => {
    console.log('AdminAuthProvider: login function called with userData:', userData);
    if (userData && userData.user_type === 'admin') {
      setAdmin(userData);
      console.log('AdminAuthProvider: Admin state updated to userData.');
    } else {
      setAdmin(null); // Ensure it's null if not admin
      console.log('AdminAuthProvider: Admin state set to null (not admin).');
    }
  };

  const logout = () => {
    console.log('AdminAuthProvider: logout function called.');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAdmin(null);
  };

  // Make sure to provide the login and logout functions through the context
  return (
    <AdminAuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

// Custom hook to use admin auth context safely
export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
