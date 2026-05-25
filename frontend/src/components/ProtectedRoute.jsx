import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false, userOnly = false }) => {
  const { user, isAuthenticated, loading, token } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // 1. Not logged in -> Redirect to login (standard protection)
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Logged in as User, trying to access Admin page
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // 3. Logged in as Admin, trying to access User specific page (e.g. Profile)
  if (userOnly && user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
