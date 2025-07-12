import React, { useState } from 'react';
import { ArrowLeftRight, Users, Star, Search, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserCard } from '../Browse/UserCard';

export const LandingPage = ({ onShowAuth }) => {
  const { getAllUsers, enterGuestMode } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const allUsers = getAllUsers();
  
  const filteredUsers = allUsers.filter(user => {
    if (!searchTerm) return true;
    return user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
           user.skillsWanted.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
  }).slice(0, 6); // Show only first 6 users

  const handleRequestSwap = () => {
    onShowAuth('register');
  };

  const handleBrowseAsGuest = () => {
    enterGuestMode();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-2 mr-3">
                <ArrowLeftRight className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SkillSwap</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => onShowAuth('login')}
                className="flex items-center px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </button>
              <button
                onClick={() => onShowAuth('register')}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Exchange Skills,
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> Grow Together</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect with like-minded individuals, share your expertise, and learn new skills through our innovative skill-swapping platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onShowAuth('register')}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Get Started Free
            </button>
            <button
              onClick={handleBrowseAsGuest}
              className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
            >
              <Users className="w-5 h-5 mr-2" />
              Browse as Guest
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Create Profile</h3>
              <p className="text-gray-400">List your skills and what you want to learn</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Find Matches</h3>
              <p className="text-gray-400">Discover people with complementary skills</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowLeftRight className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Start Swapping</h3>
              <p className="text-gray-400">Exchange knowledge and grow together</p>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Users Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Meet Our Community</h2>
            <p className="text-gray-400 mb-8">Discover talented individuals ready to share their expertise</p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search skills..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredUsers.map(user => (
              <UserCard
                key={user.id}
                user={user}
                onRequestSwap={handleRequestSwap}
                isGuest={true}
              />
            ))}
          </div>

          <div className="text-center">
            <p className="text-gray-400 mb-4">Want to see more profiles and send requests?</p>
            <button
              onClick={() => onShowAuth('register')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Join SkillSwap Today
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gray-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">500+</div>
              <div className="text-gray-400">Active Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">1,200+</div>
              <div className="text-gray-400">Skills Exchanged</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">4.8</div>
              <div className="text-gray-400 flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                Average Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-700">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-2 mr-3">
              <ArrowLeftRight className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">SkillSwap</span>
          </div>
          <p className="text-gray-400">© 2024 SkillSwap. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};