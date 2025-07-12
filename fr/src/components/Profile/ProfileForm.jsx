import React, { useState, useEffect } from 'react';
import { Save, Plus, X, User, MapPin, Clock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const ProfileForm = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    bio: '',
    isPublic: true,
    skillsOffered: [],
    skillsWanted: [],
    availability: []
  });
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState([]);

  const availabilityOptions = ['Weekends', 'Weekdays', 'Evenings', 'Mornings', 'Afternoons'];

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        location: user.location || '',
        bio: user.bio || '',
        isPublic: user.isPublic,
        skillsOffered: user.skillsOffered,
        skillsWanted: user.skillsWanted,
        availability: user.availability
      });
      setSelectedAvailability(user.availability);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      ...formData,
      availability: selectedAvailability
    });
  };

  const addSkillOffered = () => {
    if (newSkillOffered.trim() && !formData.skillsOffered.includes(newSkillOffered.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsOffered: [...prev.skillsOffered, newSkillOffered.trim()]
      }));
      setNewSkillOffered('');
    }
  };

  const addSkillWanted = () => {
    if (newSkillWanted.trim() && !formData.skillsWanted.includes(newSkillWanted.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsWanted: [...prev.skillsWanted, newSkillWanted.trim()]
      }));
      setNewSkillWanted('');
    }
  };

  const removeSkillOffered = (skill) => {
    setFormData(prev => ({
      ...prev,
      skillsOffered: prev.skillsOffered.filter(s => s !== skill)
    }));
  };

  const removeSkillWanted = (skill) => {
    setFormData(prev => ({
      ...prev,
      skillsWanted: prev.skillsWanted.filter(s => s !== skill)
    }));
  };

  const toggleAvailability = (option) => {
    setSelectedAvailability(prev =>
      prev.includes(option)
        ? prev.filter(a => a !== option)
        : [...prev, option]
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-xl p-8">
      <div className="flex items-center mb-8">
        <User className="w-8 h-8 text-blue-500 mr-3" />
        <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location (Optional)
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="City, State"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            rows={3}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell others about yourself..."
          />
        </div>

        {/* Privacy Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
          <div className="flex items-center">
            {formData.isPublic ? (
              <Eye className="w-5 h-5 text-green-500 mr-3" />
            ) : (
              <EyeOff className="w-5 h-5 text-red-500 mr-3" />
            )}
            <div>
              <h3 className="text-white font-medium">Profile Visibility</h3>
              <p className="text-gray-400 text-sm">
                {formData.isPublic ? 'Your profile is visible to everyone' : 'Your profile is private'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, isPublic: !prev.isPublic }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              formData.isPublic ? 'bg-blue-600' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.isPublic ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Skills Offered */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Skills You Can Offer
          </label>
          <div className="flex mb-3">
            <input
              type="text"
              value={newSkillOffered}
              onChange={(e) => setNewSkillOffered(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillOffered())}
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a skill you can teach"
            />
            <button
              type="button"
              onClick={addSkillOffered}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skillsOffered.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-full text-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkillOffered(skill)}
                  className="ml-2 hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Skills Wanted */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Skills You Want to Learn
          </label>
          <div className="flex mb-3">
            <input
              type="text"
              value={newSkillWanted}
              onChange={(e) => setNewSkillWanted(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillWanted())}
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a skill you want to learn"
            />
            <button
              type="button"
              onClick={addSkillWanted}
              className="px-4 py-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skillsWanted.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-full text-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkillWanted(skill)}
                  className="ml-2 hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Availability
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availabilityOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggleAvailability(option)}
                className={`p-3 rounded-lg border transition-colors ${
                  selectedAvailability.includes(option)
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Profile
        </button>
      </form>
    </div>
  );
};