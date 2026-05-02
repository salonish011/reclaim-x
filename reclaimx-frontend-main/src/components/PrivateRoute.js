import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children }) {
  const { token } = useAuth();

  // If logged in (token exists), show the page
  // If NOT logged in, redirect to /login
  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;