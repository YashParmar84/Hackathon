import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Star, Clock, Send, Mail, Calendar, Users, Award, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { SwapRequestModal } from '../Swaps/SwapRequestModal';

export const UserProfile = ({ userId, onBack }) => {
  const { getUserByIdAPI, user: currentUser, isGuest } = useAuth();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUserByIdAPI(userId);
        setUser(userData);
      } catch (err) {
        setError('Failed to load user profile: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, getUserByIdAPI]);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center space-x-1">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <div key={`full-${i}`} className="relative">
            <Star className="w-6 h-6 text-yellow-400 fill-current drop-shadow-sm" />
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-400 opacity-20 rounded-full"></div>
          </div>
        ))}
        
        {/* Half star */}
        {hasHalfStar && (
          <div className="relative w-6 h-6">
            <Star className="w-6 h-6 text-gray-400 fill-current" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-6 h-6 text-yellow-400 fill-current drop-shadow-sm" />
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-400 opacity-20 rounded-full"></div>
            </div>
          </div>
        )}
        
        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            className="w-6 h-6 text-gray-500"
          />
        ))}
      </div>
    );
  };

  const formatRating = (rating) => {
    if (rating % 1 === 0) {
      return rating.toFixed(0);
    }
    return rating.toFixed(1);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-white mb-4">Loading Profile...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Error Loading Profile</h2>
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">User Not Found</h2>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const canRequestSwap = currentUser && currentUser.id !== user._id && !isGuest;

  const handleRequestSwap = () => {
    if (isGuest) {
      // Redirect to signup - this would be handled by parent component
      return;
    }
    setShowRequestModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Browse
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        {/* Cover Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32 relative">
          <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-4xl border-4 border-gray-800">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 pb-8 px-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
              {user.location && (
                <p className="text-gray-400 flex items-center mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  {user.location}
                </p>
              )}
              {/* Enhanced Rating Display */}
              {user.averageRating > 0 && user.totalRatings > 0 && (
                <div className="flex items-center space-x-6 mb-6 p-6 bg-gradient-to-br from-gray-700/80 to-gray-600/60 rounded-xl border border-gray-500/30 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <User className="w-6 h-6 text-blue-400" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                    </div>
                    <span className="text-white font-semibold text-lg">Community Rating</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    {renderStars(user.averageRating)}
                    <div className="flex items-center space-x-3">
                      <span className="text-white text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                        {formatRating(user.averageRating)}
                      </span>
                      <span className="text-gray-300 text-base font-medium">
                        ({user.totalRatings} {user.totalRatings === 1 ? 'person' : 'people'} rated)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {canRequestSwap && (
              <button
                onClick={handleRequestSwap}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center"
              >
                <Send className="w-5 h-5 mr-2" />
                Request Skill Swap
              </button>
            )}

            {isGuest && (
              <button
                onClick={() => {/* This would trigger signup */}}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center"
              >
                <Send className="w-5 h-5 mr-2" />
                Sign Up to Request
              </button>
            )}
          </div>

          {/* Statistics Section */}
          {(user.totalSwaps > 0 || user.completedSwaps > 0 || user.averageRating > 0) && (
            <div className="mb-8 p-6 bg-gray-700 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-400" />
                Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{user.totalSwaps || 0}</div>
                  <div className="text-gray-400 text-sm">Total Swaps</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{user.completedSwaps || 0}</div>
                  <div className="text-gray-400 text-sm">Completed</div>
                </div>
                {user.averageRating > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{formatRating(user.averageRating)}</div>
                    <div className="text-gray-400 text-sm">Avg Rating</div>
                  </div>
                )}
                {user.totalRatings > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{user.totalRatings}</div>
                    <div className="text-gray-400 text-sm">Reviews</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bio */}
          {user.bio && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-3">About</h3>
              <p className="text-gray-300 leading-relaxed">{user.bio}</p>
            </div>
          )}

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Skills Offered */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                Skills I Can Teach
              </h3>
              {user.skillsOffered && user.skillsOffered.length > 0 ? (
                <div className="space-y-2">
                  {user.skillsOffered.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3 text-blue-300"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No skills listed yet</p>
              )}
            </div>

            {/* Skills Wanted */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                Skills I Want to Learn
              </h3>
              {user.skillsWanted && user.skillsWanted.length > 0 ? (
                <div className="space-y-2">
                  {user.skillsWanted.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-green-600/20 border border-green-500/30 rounded-lg p-3 text-green-300"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No skills listed yet</p>
              )}
            </div>
          </div>

          {/* Availability */}
          {user.availability && user.availability.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-3 text-purple-500" />
                Availability
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.availability.map((time, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-purple-600/20 border border-purple-500/30 text-purple-300 rounded-lg"
                  >
                    {time}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-white mb-4">Contact Information</h3>
            <div className="flex items-center text-gray-400">
              <Mail className="w-5 h-5 mr-3" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Swap Request Modal */}
      {showRequestModal && (
        <SwapRequestModal
          targetUser={user}
          onClose={() => setShowRequestModal(false)}
        />
      )}
    </div>
  );
};