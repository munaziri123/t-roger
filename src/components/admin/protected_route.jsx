import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!isAdmin) {
    // If not logged in as admin, redirect to login page
    return <Navigate to="/admin" replace />;
  }

  // Otherwise, render the protected component
  return children;
};

export default ProtectedRoute;
