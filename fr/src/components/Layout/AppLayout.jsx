import React from 'react';
import { Navigation } from './Navigation';

export const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      <main className="p-4 pt-8">
        {children}
      </main>
    </div>
  );
}; 