import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, MapPin, BookOpen, Target, Clock, ArrowRight } from 'lucide-react';

export const AuthProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    location: '',
    skillsOffered: [],
    skillsWanted: [],
    availability: [],
    isPublic: true
  });

  const availabilityOptions = [
    { value: 'weekdays', label: 'Weekdays' },
    { value: 'weekends', label: 'Weekends' },
    { value: 'evenings', label: 'Evenings' },
    { value: 'mornings', label: 'Mornings' },
    { value: 'afternoons', label: 'Afternoons' }
  ];

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        skillsOffered: user.skillsOffered || [],
        skillsWanted: user.skillsWanted || [],
        availability: user.availability || [],
        isPublic: user.isPublic !== undefined ? user.isPublic : true
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateUserProfile(profileData);
      setSuccess('Profile completed successfully! Redirecting to dashboard...');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
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
    const skill = prompt(`Enter ${type === 'skillsOffered' ? 'skill you offer' : 'skill you want to learn'}:`);
    if (skill && skill.trim()) {
      handleSkillChange(type, skill.trim(), 'add');
    }
  };

  const removeSkill = (type, skill) => {
    handleSkillChange(type, skill, 'remove');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <User className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Complete Your Profile</h1>
            <p className="text-gray-400">Welcome to SkillSwap! Let's set up your profile to get started.</p>
          </div>

          {/* Welcome message */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
            <p className="text-blue-400 text-sm">
              Tell us about yourself so other users can find you for skill swaps!
            </p>
          </div>

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
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
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
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <button
                  type="button"
                  onClick={() => addSkill('skillsOffered')}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  + Add Skill
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profileData.skillsOffered.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm flex items-center"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill('skillsOffered', skill)}
                      className="ml-2 text-white hover:text-red-300"
                    >
                      ×
                    </button>
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
                <button
                  type="button"
                  onClick={() => addSkill('skillsWanted')}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  + Add Skill
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profileData.skillsWanted.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-600 text-white rounded-full text-sm flex items-center"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill('skillsWanted', skill)}
                      className="ml-2 text-white hover:text-red-300"
                    >
                      ×
                    </button>
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
                      className="mr-2 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                  className="mr-2 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-gray-300 text-sm">
                  Make my profile public to other users
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center"
              >
                {loading ? 'Saving...' : 'Complete Profile & Continue'}
                {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 