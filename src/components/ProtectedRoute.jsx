import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useSupabase();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
