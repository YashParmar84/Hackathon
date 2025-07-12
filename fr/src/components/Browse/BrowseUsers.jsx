import React, { useState, useMemo , useEffect } from 'react';
import { Search, Filter, Users } from 'lucide-react';
import { UserCard } from './UserCard';
import { SwapRequestModal } from '../Swaps/SwapRequestModal';
import { UserProfile } from '../Profile/UserProfile';
import { useAuth } from '../../contexts/AuthContext';

export const BrowseUsers = ({ onShowAuth }) => {
  const { user: currentUser, getAllPublicUsers, isGuest, getAuthHeaders } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [viewingProfile, setViewingProfile] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  

  // Fetch current user's skills when page loads
  useEffect(() => {
    const fetchMySkills = async () => {
      if (!currentUser || isGuest) return;
      
      try {
        console.log('Fetching my skills on BrowseUsers page load...');
        
        // Get auth headers from context or fallback to localStorage
        let headers = {};
        if (getAuthHeaders) {
          headers = getAuthHeaders();
        } else {
          // Fallback: get token from localStorage
          const token = localStorage.getItem('token');
          headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          };
        }
        
        const response = await fetch('http://localhost:8000/api/v1/users/my-skills', {
          method: 'GET',
          headers: headers,
        });

        const data = await response.json();
        console.log('My skills API response on BrowseUsers:', data);
        
        if (response.ok) {
          const skillsOffered = data.data?.skillsOffered || [];
          console.log('Skills loaded on BrowseUsers:', skillsOffered);
        } else {
          console.error('Failed to fetch skills on BrowseUsers:', data.message);
        }
      } catch (error) {
        console.error('Error fetching skills on BrowseUsers:', error);
      }
    };

    fetchMySkills();
  }, [currentUser, isGuest, getAuthHeaders]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const users = await getAllPublicUsers();  
        // Ensure users is an array and filter out current user
        const filteredUsers = Array.isArray(users) ? users : [];
        setAllUsers(filteredUsers);
      } catch (err) {
        setError('Failed to load users: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [getAllPublicUsers]);

  // Get all unique skills for filter dropdown
  const allSkills = useMemo(() => {
    const skills = new Set();
    allUsers.forEach(user => {
      if (user.skillsOffered && Array.isArray(user.skillsOffered)) {
        user.skillsOffered.forEach(skill => skills.add(skill));
      }
      if (user.skillsWanted && Array.isArray(user.skillsWanted)) {
        user.skillsWanted.forEach(skill => skills.add(skill));
      }
    });
    return Array.from(skills).sort();
  }, [allUsers]);

  // Filter users based on search and skill filter
  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => {
      // Don't show current user (check _id field)
      if (currentUser && user._id === currentUser.id) return false;
      
      // Only show public profiles
      if (!user.isPublic) return false;

      // Search filter
      const matchesSearch = searchTerm === '' || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.skillsOffered && user.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))) ||
        (user.skillsWanted && user.skillsWanted.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))) ||
        (user.location && user.location.toLowerCase().includes(searchTerm.toLowerCase()));

      // Skill filter
      const matchesSkill = selectedSkillFilter === '' ||
        (user.skillsOffered && user.skillsOffered.includes(selectedSkillFilter)) ||
        (user.skillsWanted && user.skillsWanted.includes(selectedSkillFilter));

      return matchesSearch && matchesSkill;
    });
  }, [searchTerm, selectedSkillFilter, currentUser, allUsers]);

  const handleRequestSwap = (user) => {
    if (isGuest) {
      onShowAuth('register');
      return;
    }
    setSelectedUser(user);
    setShowRequestModal(true);
  };

  const handleCloseModal = () => {
    setShowRequestModal(false);
    setSelectedUser(null);
  };

  const handleViewProfile = (userId) => {
    setViewingProfile(userId);
  };

  const handleBackFromProfile = () => {
    setViewingProfile(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white mb-4">Loading Users...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">Error Loading Users</h2>
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (viewingProfile) {
    return (
      <UserProfile 
        userId={viewingProfile} 
        onBack={handleBackFromProfile}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <Users className="w-8 h-8 text-blue-500 mr-3" />
          <h1 className="text-3xl font-bold text-white">
            {isGuest ? 'Discover Our Community' : 'Browse Users'}
          </h1>
        </div>

        {isGuest && (
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4 mb-6">
            <p className="text-blue-300">
              You're browsing as a guest. 
              <button 
                onClick={() => onShowAuth('register')}
                className="text-blue-400 hover:text-blue-300 font-medium ml-1"
              >
                Sign up
              </button> to send skill swap requests!
            </p>
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, skills, or location..."
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedSkillFilter}
              onChange={(e) => setSelectedSkillFilter(e.target.value)}
              className="pl-10 pr-8 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none min-w-[200px]"
            >
              <option value="">All Skills</option>
              {allSkills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <p className="text-gray-400 mb-6">
          {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* User Grid */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <UserCard
              key={user.id}
              user={user}
              onRequestSwap={handleRequestSwap}
              onViewProfile={handleViewProfile}
              currentUserId={currentUser?.id}
              isGuest={isGuest}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No users found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
        </div>
      )}

      {/* Swap Request Modal */}
      {showRequestModal && selectedUser && (
        <SwapRequestModal
          targetUser={selectedUser}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};