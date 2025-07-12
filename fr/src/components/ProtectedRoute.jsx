import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user, isGuest } = useAuth();
  const location = useLocation();

  // Check for token in localStorage as additional validation
  const token = localStorage.getItem('token');

  console.log("ProtectedRoute check:", {
    user: !!user,
    isGuest,
    token: !!token,
    pathname: location.pathname
  });

  // If user is not logged in, not in guest mode, or no token, redirect to landing page
  if ((!user && !isGuest) || !token) {
    console.log("Redirecting to landing page - not authenticated");
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  console.log("Allowing access to protected route");
  return children;
}; 