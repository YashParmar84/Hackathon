import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingPage as LandingPageComponent } from '../components/Landing/LandingPage';

export const LandingPage = () => {
  const navigate = useNavigate();

  const handleShowAuth = (mode) => {
    navigate(`/auth/${mode}`);
  };

  return <LandingPageComponent onShowAuth={handleShowAuth} />;
}; 