import React from 'react';
import { MapPin, Star, Clock, Send, Eye, Users } from 'lucide-react';

export const UserCard = ({ user, onRequestSwap, onViewProfile, currentUserId, isGuest }) => {
  const canRequestSwap = !isGuest && currentUserId && currentUserId !== user._id;

  const handleRequestSwap = () => {
    if (isGuest) {
      // This will be handled by parent component to redirect to signup
      onRequestSwap(user);
    } else {
      onRequestSwap(user);
    }
  };

  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(user._id);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < fullStars 
                ? 'text-yellow-400 fill-current' 
                : i === fullStars && hasHalfStar 
                ? 'text-yellow-400 fill-current opacity-50'
                : 'text-gray-400'
            }`}
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

  return (
    <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={user.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`w-full h-full flex items-center justify-center ${user.profilePhoto ? 'hidden' : ''}`}>
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="ml-3">
            <h3 className="text-white font-semibold text-lg">{user.name}</h3>
            {user.location && (
              <p className="text-gray-400 text-sm flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {user.location}
              </p>
            )}
          </div>
        </div>
        
        {/* Enhanced Rating Display */}
        {user.averageRating > 0 && user.totalRatings > 0 && (
          <div className="flex flex-col items-end">
            <div className="flex items-center space-x-2">
              {renderStars(user.averageRating)}
              <div className="text-right">
                <span className="text-white text-sm font-bold">
                  {formatRating(user.averageRating)}
                </span>
              </div>
            </div>
            <div className="text-right mt-1">
              <span className="text-gray-400 text-xs">
                {user.totalRatings} {user.totalRatings === 1 ? 'rating' : 'ratings'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Swap Statistics */}
      {(user.totalSwaps > 0 || user.completedSwaps > 0) && (
        <div className="mb-4 p-3 bg-gray-700 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-300">
              <Users className="w-4 h-4 mr-2" />
              <span>Swap Stats</span>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <div className="text-center">
                <div className="text-white font-medium">{user.totalSwaps || 0}</div>
                <div className="text-gray-400">Total</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-medium">{user.completedSwaps || 0}</div>
                <div className="text-gray-400">Completed</div>
              </div>
                <div className="text-center text-white">
                {user?.averageRating?.toFixed(1)}
                  <div className="text-gray-400">Avg Rating</div>
                </div>
            </div>
          </div>
        </div>
      )}

      {user.bio && (
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{user.bio}</p>
      )}

      {/* Skills Offered */}
      {user.skillsOffered && Array.isArray(user.skillsOffered) && user.skillsOffered.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Can Teach:</h4>
          <div className="flex flex-wrap gap-2">
            {user.skillsOffered.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs"
              >
                {skill}
              </span>
            ))}
            {user.skillsOffered.length > 3 && (
              <span className="px-2 py-1 bg-gray-600 text-gray-300 rounded-full text-xs">
                +{user.skillsOffered.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Skills Wanted */}
      {user.skillsWanted && Array.isArray(user.skillsWanted) && user.skillsWanted.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Wants to Learn:</h4>
          <div className="flex flex-wrap gap-2">
            {user.skillsWanted.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-600 text-white rounded-full text-xs"
              >
                {skill}
              </span>
            ))}
            {user.skillsWanted.length > 3 && (
              <span className="px-2 py-1 bg-gray-600 text-gray-300 rounded-full text-xs">
                +{user.skillsWanted.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Availability */}
      {user.availability && Array.isArray(user.availability) && user.availability.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Available:
          </h4>
          <div className="flex flex-wrap gap-1">
            {user.availability.map((time, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
              >
                {time}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {onViewProfile && (
          <button
            onClick={handleViewProfile}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Profile
          </button>
        )}
        
        {(canRequestSwap || isGuest) && (
          <button
            onClick={handleRequestSwap}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <Send className="w-4 h-4 mr-2" />
            {isGuest ? 'Sign Up to Request' : 'Request Swap'}
          </button>
        )}
      </div>
    </div>
  );
};