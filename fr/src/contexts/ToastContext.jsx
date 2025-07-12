import React, { createContext, useContext, useState } from 'react';
import { Toast } from '../components/Toast/Toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    message: '',
    type: 'success',
    isVisible: false,
    duration: 3000
  });

  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({
      message,
      type,
      isVisible: true,
      duration
    });
  };

  const hideToast = () => {
    setToast(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  const showSuccess = (message, duration = 3000) => {
    showToast(message, 'success', duration);
  };

  const showError = (message, duration = 4000) => {
    showToast(message, 'error', duration);
  };

  const showWarning = (message, duration = 4000) => {
    showToast(message, 'warning', duration);
  };

  return (
    <ToastContext.Provider value={{
      showToast,
      showSuccess,
      showError,
      showWarning,
      hideToast
    }}>
      {children}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}; 