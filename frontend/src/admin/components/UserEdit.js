import React, { useEffect, useState } from 'react';
import { fetchUserById, updateUser } from '../api/adminApi';
import '../../styles/UserEdit.css';

export default function UserEdit({ userId, onBack }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ username: '', email: '' });

  useEffect(() => {
    setLoading(true);
    fetchUserById(userId)
      .then(user => {
        setUser(user);
        setFormData({ username: user.username, email: user.email });
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch user');
        setLoading(false);
      });
  }, [userId]);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSaving(true);
    updateUser(userId, formData)
      .then(() => {
        setSaving(false);
        onBack();
      })
      .catch(err => {
        setError(err.message || 'Failed to update user');
        setSaving(false);
      });
  };

  if (loading) return <p>Loading user data...</p>;
  if (error) return <p className="user-edit-error">{error}</p>;

  return (
    <div className="user-edit">
      <h3>Edit User</h3>
      <form onSubmit={handleSubmit} className="user-edit-form">
        <label>
          Username:
          <input 
            name="username" 
            value={formData.username} 
            onChange={handleChange} 
            required 
          />
        </label>
        <label>
          Email:
          <input 
            name="email" 
            type="email"
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </label>
        <div className="user-edit-buttons">
          <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          <button type="button" onClick={onBack} disabled={saving}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
