import React from 'react';
import AdminLogin from '../components/AdminLogin';
import { AdminAuthProvider } from '../context/AdminAuthContext';

export default function LoginPage() {
  return (
    <AdminAuthProvider>
      <AdminLogin />
    </AdminAuthProvider>
  );
}
