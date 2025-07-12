import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/Auth/LoginForm';
import { RegisterForm } from '../components/Auth/RegisterForm';
import { ForgotPasswordForm } from '../components/Auth/ForgotPasswordForm';

export const AuthPage = () => {
  const { mode } = useParams();
  const navigate = useNavigate();

  const handleToggle = (newMode) => {
    navigate(`/auth/${newMode}`);
  };

  const handleBack = () => {
    navigate('/');
  };

  const renderAuthForm = () => {
    switch (mode) {
      case 'login':
        return (
          <LoginForm 
            onToggle={handleToggle} 
            onBack={handleBack}
            onForgotPassword={() => handleToggle('forgot')}
          />
        );
      case 'register':
        return (
          <RegisterForm 
            onToggle={handleToggle} 
            onBack={handleBack}
          />
        );
      case 'forgot':
        return (
          <ForgotPasswordForm onBack={() => handleToggle('login')} />
        );
      default:
        // Redirect to login if invalid auth mode
        navigate('/auth/login', { replace: true });
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      {renderAuthForm()}
    </div>
  );
}; 