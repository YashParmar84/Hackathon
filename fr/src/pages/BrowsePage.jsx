import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowseUsers } from '../components/Browse/BrowseUsers';

export const BrowsePage = () => {
  const navigate = useNavigate();

  const handleShowAuth = (mode) => {
    navigate(`/auth/${mode}`);
  };

  return <BrowseUsers onShowAuth={handleShowAuth} />;
}; 