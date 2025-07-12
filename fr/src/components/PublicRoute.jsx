import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const PublicRoute = ({ children }) => {
  const { user, isGuest } = useAuth();
  const token = localStorage.getItem('token');

  // If user is logged in, in guest mode, or has valid token, redirect to dashboard
  if (user || isGuest || token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}; 