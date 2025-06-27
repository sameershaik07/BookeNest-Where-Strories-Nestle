import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../api/adminApi';
import '../../styles/UserList.css';

export default function UserList({ onEdit }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchUsers()
      .then(users => {
        setUsers(users);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load users');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="user-list-error">{error}</p>;

  return (
    <div className="user-list">
      <h3>User List</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Username</th><th>Email</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>
                <button onClick={() => onEdit(u.id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
