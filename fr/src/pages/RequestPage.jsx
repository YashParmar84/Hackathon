import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SwapRequests } from '../components/Swaps/SwapRequests';

export const RequestPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-6xl mx-auto p-4">
        <SwapRequests />
      </div>
    </div>
  );
}; 