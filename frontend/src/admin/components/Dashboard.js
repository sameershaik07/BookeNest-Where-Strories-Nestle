import React, { useState } from 'react';
import UserList from './UserList';
import UserEdit from './UserEdit';
import { useAdminAuth } from '../context/AdminAuthContext';
import '../../styles/AdminDash.css';

export default function Dashboard() {
  const { admin, logout } = useAdminAuth();
  const [editingUserId, setEditingUserId] = useState(null);

  if (!admin) {
    return <p>Please log in as admin to view the dashboard.</p>;
  }

  return (
    <div className="admin-dashboard">
      <header>
        <h2>Welcome, {admin.username}</h2>
        <button onClick={logout}>Logout</button>
      </header>

      {editingUserId ? (
        <UserEdit userId={editingUserId} onBack={() => setEditingUserId(null)} />
      ) : (
        <UserList onEdit={setEditingUserId} />
      )}
    </div>
  );
}
