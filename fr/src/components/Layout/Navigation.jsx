import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Search, ArrowLeftRight, LogOut, Settings, Home } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Navigation = () => {
  const { user, logout, isGuest } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'browse', label: 'Browse', icon: Search, path: '/browse' },
    { id: 'request', label: 'Requests', icon: ArrowLeftRight, path: '/request' },
    { id: 'profile', label: 'Profile', icon: Settings, path: '/profile' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isGuest) {
    return (
      <nav className="bg-gray-900 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-2 mr-3">
                <ArrowLeftRight className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SkillSwap</span>
            </div>

            {/* Guest indicator */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Browsing as Guest</span>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white transition-colors"
                title="Exit Guest Mode"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-2 mr-3">
                <ArrowLeftRight className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SkillSwap</span>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex space-x-8">
            {navItems.map(({ id, label, icon: Icon, path }) => (
              <Link
                key={id}
                to={path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <span className="ml-2 text-white font-medium hidden md:block">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-white transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-700">
          <div className="flex space-x-1 px-2 py-2">
            {navItems.map(({ id, label, icon: Icon, path }) => (
              <Link
                key={id}
                to={path}
                className={`flex-1 flex flex-col items-center py-2 rounded-md text-xs font-medium transition-colors ${
                  location.pathname === path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};