import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/AdminHome.css'; // Import the CSS
import Header from '../../pages/Header';
import Footer from '../../pages/Footer';


export default function AdminHome() {
  const navigate = useNavigate();

  return (
        <>
          <Header />

    <div className="admin-home-container">
      <h1>Welcome, Admin!</h1>
      <div className="admin-home-buttons">
        <button onClick={() => navigate('/admin/dashboard')}>View User List</button>
        <button onClick={() => navigate('/admin/add-book')}>Add Books</button>
        <button onClick={() => navigate('/admin/books')}>View Books List</button>
      </div>
    </div>
              <Footer />
    </>

  );
}
