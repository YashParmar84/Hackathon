import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, MapPin, BookOpen, Target, Clock, Eye, EyeOff } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUserProfile, getUserProfile } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    location: '',
    skillsOffered: [],
    skillsWanted: [],
    availability: [],
    isPublic: true,
    profilePhoto: ''
  });

  const [newSkill, setNewSkill] = useState('');
  const [skillType, setSkillType] = useState('skillsOffered');
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const availabilityOptions = [
    { value: 'weekdays', label: 'Weekdays' },
    { value: 'weekends', label: 'Weekends' },
    { value: 'evenings', label: 'Evenings' },
    { value: 'mornings', label: 'Mornings' },
    { value: 'afternoons', label: 'Afternoons' }
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          setLoading(true);
          const profileData = await getUserProfile();
          
          setProfileData({
            name: profileData.name || '',
            bio: profileData.bio || '',
            location: profileData.location || '',
            skillsOffered: profileData.skillsOffered || [],
            skillsWanted: profileData.skillsWanted || [],
            availability: profileData.availability || [],
            isPublic: profileData.isPublic !== undefined ? profileData.isPublic : true,
            profilePhoto: profileData.profilePhoto || ''
          });
        } catch (err) {
          setError('Failed to load profile data: ' + err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateUserProfile(profileData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setError('');
    try {
      const freshData = await getUserProfile();
      setProfileData({
        name: freshData.name || '',
        bio: freshData.bio || '',
        location: freshData.location || '',
        skillsOffered: freshData.skillsOffered || [],
        skillsWanted: freshData.skillsWanted || [],
        availability: freshData.availability || [],
        isPublic: freshData.isPublic !== undefined ? freshData.isPublic : true,
        profilePhoto: freshData.profilePhoto || ''
      });
      setSuccess('Profile data refreshed successfully!');
    } catch (err) {
      setError('Failed to refresh profile: ' + err.message);
    } finally {
      setRefreshing(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSkillChange = (type, skill, action) => {
    setProfileData(prev => ({
      ...prev,
      [type]: action === 'add' 
        ? [...prev[type], skill]
        : prev[type].filter(s => s !== skill)
    }));
  };

  const handleAvailabilityChange = (availability) => {
    setProfileData(prev => ({
      ...prev,
      availability: prev.availability.includes(availability)
        ? prev.availability.filter(a => a !== availability)
        : [...prev.availability, availability]
    }));
  };

  const addSkill = (type) => {
    setSkillType(type);
    setShowSkillInput(true);
    setNewSkill('');
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      handleSkillChange(skillType, newSkill.trim(), 'add');
      setNewSkill('');
      setShowSkillInput(false);
    }
  };

  const handleCancelAddSkill = () => {
    setNewSkill('');
    setShowSkillInput(false);
  };

  const removeSkill = (type, skill) => {
    handleSkillChange(type, skill, 'remove');
  };

  const getProfilePhotoUrl = (profilePhoto) => {
    if (!profilePhoto) return null;
    // Convert Windows backslashes to forward slashes and construct the full URL
    const normalizedPath = profilePhoto.replace(/\\/g, '/');
    return `http://localhost:8000/api/v1/uploads/${normalizedPath}`;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const uploadProfilePhoto = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setUploadingPhoto(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('profilePhoto', selectedFile);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/profile/upload-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload photo');
      }

      // Refresh profile data to get updated photo URL
      await handleRefresh();
      setSelectedFile(null);
      setSuccess('Profile photo updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <User className="w-8 h-8 text-blue-500 mr-3" />
              <h1 className="text-3xl font-bold text-white">Profile</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {loading && (
            <div className="bg-blue-500/10 border border-blue-500/50 text-blue-400 rounded-lg p-3 mb-4">
              Loading profile data...
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 rounded-lg p-3 mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photo */}
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 border-2 border-gray-600">
                    {user?.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center ${user?.profilePhoto ? 'hidden' : ''}`}>
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  </div>
                  {isEditing && (
                    <div className="absolute -bottom-2 -right-2">
                      <label className="cursor-pointer">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-medium text-white mb-2">Profile Photo</h3>
                <p className="text-gray-400 text-sm mb-3">
                  Upload a profile photo to make your profile more personal
                </p>
                
                {isEditing && (
                  <div className="space-y-3">
                    {!selectedFile ? (
                      <div className="flex items-center space-x-2">
                        <label className="cursor-pointer">
                          <div className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Choose Photo</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </label>
                        <span className="text-gray-400 text-sm">or click the camera icon on the photo</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-300">
                            Selected: {selectedFile.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedFile(null)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={uploadProfilePhoto}
                          disabled={uploadingPhoto}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                        >
                          {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                    placeholder="City, State"
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Skills Offered */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-300">
                  <BookOpen className="inline w-4 h-4 mr-2" />
                  Skills You Offer
                </label>
                {isEditing && !showSkillInput && (
                  <button
                    type="button"
                    onClick={() => addSkill('skillsOffered')}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    + Add Skill
                  </button>
                )}
              </div>
              
              {/* Skill Input Modal */}
              {showSkillInput && skillType === 'skillsOffered' && isEditing && (
                <div className="mb-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Enter skill you offer..."
                      className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      disabled={!newSkill.trim()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelAddSkill}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {profileData.skillsOffered.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm flex items-center"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeSkill('skillsOffered', skill)}
                        className="ml-2 text-white hover:text-red-300"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Skills Wanted */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-300">
                  <Target className="inline w-4 h-4 mr-2" />
                  Skills You Want to Learn
                </label>
                {isEditing && !showSkillInput && (
                  <button
                    type="button"
                    onClick={() => addSkill('skillsWanted')}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    + Add Skill
                  </button>
                )}
              </div>
              
              {/* Skill Input Modal */}
              {showSkillInput && skillType === 'skillsWanted' && isEditing && (
                <div className="mb-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Enter skill you want to learn..."
                      className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      disabled={!newSkill.trim()}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelAddSkill}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {profileData.skillsWanted.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-600 text-white rounded-full text-sm flex items-center"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeSkill('skillsWanted', skill)}
                        className="ml-2 text-white hover:text-red-300"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <div className="flex items-center mb-3">
                <Clock className="w-4 h-4 mr-2 text-gray-300" />
                <label className="block text-sm font-medium text-gray-300">
                  Availability
                </label>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availabilityOptions.map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profileData.availability.includes(option.value)}
                      onChange={() => handleAvailabilityChange(option.value)}
                      disabled={!isEditing}
                      className="mr-2 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                    />
                    <span className="text-gray-300 text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Profile Visibility */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={profileData.isPublic}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mr-2 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <span className="text-gray-300 text-sm">
                  Make my profile public to other users
                </span>
              </label>
            </div>

            {/* Submit Button */}
            {isEditing && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}; 