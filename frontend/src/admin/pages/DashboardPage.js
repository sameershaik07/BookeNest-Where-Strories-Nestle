import React from 'react';
// Assuming UserList is located at src/admin/components/UserList.js
import UserList from '../components/UserList';
// Import the main admin dashboard styles
import '../../styles/AdminDash.css';
// Import useAdminAuth to access logout functionality and admin user data
import { useAdminAuth } from '../context/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../../pages/Header';
import Footer from '../../pages/Footer';


export default function DashboardPage() {
  // Destructure admin state and logout function from the context
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  // Function to handle user logout
  const handleLogout = () => {
    logout(); // Call the logout function from AdminAuthContext
    navigate('/signin'); // Redirect to sign-in page after logout
  };

  // Placeholder for handling user edit action (passed to UserList)
  const handleEditUser = (userId) => {
    console.log("Admin wants to edit user with ID:", userId);
    // Here you would typically navigate to an edit user form,
    // or open a modal with user details for editing.
    // Example: navigate(`/admin/users/edit/${userId}`);
  };

  return (
            <>
          <Header />


    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        {/* Display welcome message using admin's name from context */}
        <h1>Welcome, {admin ? admin.name : 'Admin'}!</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <div className="admin-dashboard-content">
        {/* Render the UserList component */}
        <UserList onEdit={handleEditUser} />
        {/* You can add more admin-specific components or sections here */}
        {/* For example:
        <section className="dashboard-section">
          <h2>Analytics Overview</h2>
          <p>Charts and graphs would go here.</p>
        </section>
        <section className="dashboard-section">
          <h2>Content Management</h2>
          <p>Tools for managing books, categories, etc.</p>
        </section>
        */}
      </div>
    </div>
              <Footer />
    </>

  );
}
