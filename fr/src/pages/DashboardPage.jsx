import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BrowseUsers } from '../components/Browse/BrowseUsers';

export const DashboardPage = () => {
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();

  const handleShowAuth = (mode) => {
    navigate(`/auth/${mode}`);
  };

  if (isGuest) {
    return <BrowseUsers onShowAuth={handleShowAuth} />;
  }

  return <BrowseUsers onShowAuth={handleShowAuth} />;
}; 