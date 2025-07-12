import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', isVisible, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-400" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/50';
      case 'error':
        return 'bg-red-500/10 border-red-500/50';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/50';
      default:
        return 'bg-green-500/10 border-green-500/50';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      default:
        return 'text-green-400';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right">
      <div className={`flex items-center space-x-3 p-4 rounded-lg border ${getBgColor()} shadow-lg`}>
        {getIcon()}
        <span className={`font-medium ${getTextColor()}`}>{message}</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}; 