import React, { useState, useEffect, useRef } from 'react';
import { X, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSwap } from '../../contexts/SwapContext';
import { useToast } from '../../contexts/ToastContext';

export const SwapRequestModal = ({ targetUser, onClose }) => {
  const { user: currentUser, getAuthHeaders } = useAuth();
  const { sendSwapRequest, loading, error } = useSwap();
  const { showSuccess, showError } = useToast();
  const [selectedSkillOffered, setSelectedSkillOffered] = useState('');
  const [selectedSkillWanted, setSelectedSkillWanted] = useState('');
  const [message, setMessage] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [mySkills, setMySkills] = useState({ skillsOffered: [], skillsWanted: [] });
  const [skillsLoading, setSkillsLoading] = useState(true);
  const hasFetchedSkills = useRef(false);

  // Fetch current user's skills from my-skills API
  useEffect(() => {
    const fetchMySkills = async () => {
      try {
        setSkillsLoading(true);
        hasFetchedSkills.current = true;
        
        console.log('Fetching skills in modal...');
        const response = await fetch('http://localhost:8000/api/v1/users/my-skills', {
          method: 'GET',
          headers: getAuthHeaders(),
        });

        const data = await response.json();
        console.log('My skills API response in modal:', data); // Debug log
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch skills');
        }

        // Extract skills from the specific API response format
        const skillsOffered = data.data?.skillsOffered || [];
        const skillsWanted = data.data?.skillsWanted || [];
        
        console.log('Skills from API in modal:', { skillsOffered, skillsWanted });
        
        setMySkills({
          skillsOffered: skillsOffered,
          skillsWanted: skillsWanted
        });
        
      } catch (error) {
        console.error('Failed to fetch skills in modal:', error);
        
        // Fallback to user profile data on error
        const fallbackSkills = {
          skillsOffered: currentUser?.skillsOffered || [],
          skillsWanted: currentUser?.skillsWanted || []
        };
        
        console.log('Using fallback skills in modal due to error:', fallbackSkills);
        setMySkills(fallbackSkills);
        
        if (fallbackSkills.skillsOffered.length === 0) {
          setValidationError('Failed to load your skills. Please update your profile first.');
        }
      } finally {
        setSkillsLoading(false);
      }
    };

    // Always fetch skills when modal opens
    if (currentUser) {
      fetchMySkills();
    } else {
      setSkillsLoading(false);
    }
  }, [currentUser, getAuthHeaders]);

  // Reset form when modal opens
  useEffect(() => {
    setSelectedSkillOffered('');
    setSelectedSkillWanted('');
    setMessage('');
    setValidationError('');
    hasFetchedSkills.current = false; // Reset fetch flag
  }, [targetUser]);

  // Find matching skills with proper null checks and case-insensitive comparison
  const currentUserSkillsOffered = mySkills.skillsOffered || [];
  const currentUserSkillsWanted = mySkills.skillsWanted || [];
  const targetUserSkillsOffered = targetUser?.skillsOffered || [];
  const targetUserSkillsWanted = targetUser?.skillsWanted || [];

  console.log('Current skills state in modal:', {
    currentUserSkillsOffered,
    currentUserSkillsWanted,
    targetUserSkillsOffered,
    targetUserSkillsWanted,
    mySkills
  });

  const matchingSkills = currentUserSkillsOffered.filter(skill =>
    targetUserSkillsWanted.some(targetSkill => 
      targetSkill.toLowerCase() === skill.toLowerCase()
    )
  ) || [];

  const skillsIWant = targetUserSkillsOffered.filter(skill =>
    currentUserSkillsWanted.some(mySkill => 
      mySkill.toLowerCase() === skill.toLowerCase()
    )
  ) || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!currentUser) {
      setValidationError('You must be logged in to send swap requests.');
      return;
    }

    if (!selectedSkillOffered || !selectedSkillWanted) {
      setValidationError('Please select both a skill to offer and a skill to request.');
      return;
    }

    // Check if skills are available
    if (currentUserSkillsOffered.length === 0) {
      setValidationError('You need to add skills to your profile before sending requests. Please update your profile first.');
      return;
    }

    if (targetUserSkillsOffered.length === 0) {
      setValidationError('This user has no skills available for swapping.');
      return;
    }

    setLocalLoading(true);
    try {
      const result = await sendSwapRequest({
        toUserId: targetUser._id,
        skillOffered: selectedSkillOffered,
        skillRequested: selectedSkillWanted,
        message: message.trim() || ''
      });
      
      // Show success toast
      showSuccess(`Swap request sent successfully to ${targetUser.name}!`);
      
      onClose();
    } catch (error) {
      console.error('Failed to send swap request:', error);
      setValidationError(error.message || 'Failed to send swap request. Please try again.');
      showError('Failed to send swap request. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  const canSubmit = selectedSkillOffered && selectedSkillWanted && 
                   currentUserSkillsOffered.length > 0 && 
                   targetUserSkillsOffered.length > 0;

  if (skillsLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-white">Loading your skills...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Request Skill Swap</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {targetUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <h3 className="text-white font-medium">{targetUser.name}</h3>
              {targetUser.location && (
                <p className="text-gray-400 text-sm">{targetUser.location}</p>
              )}
            </div>
          </div>
        </div>

      

        {/* Error Display */}
        {validationError && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-red-300 text-sm">{validationError}</p>
          </div>
        )}

        {/* Success indicators */}
        {matchingSkills.length > 0 && (
          <div className="mb-4 p-3 bg-green-900/50 border border-green-500 rounded-lg flex items-start">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-green-300 text-sm">
              Great match! You can teach {matchingSkills.length} skill{matchingSkills.length > 1 ? 's' : ''} they want to learn.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Skill I can offer */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Skill I can teach:
            </label>
            <select
              value={selectedSkillOffered}
              onChange={(e) => setSelectedSkillOffered(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a skill you can teach</option>
              {currentUserSkillsOffered.length === 0 ? (
                <option value="" disabled>No skills available - Update your profile first</option>
              ) : matchingSkills.length > 0 ? (
                <>
                  <optgroup label="Perfect Matches">
                    {matchingSkills.map(skill => (
                      <option key={skill} value={skill}>{skill} ⭐</option>
                    ))}
                  </optgroup>
                  <optgroup label="Other Skills">
                    {currentUserSkillsOffered.filter(skill => !matchingSkills.includes(skill)).map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </optgroup>
                </>
              ) : (
                currentUserSkillsOffered.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))
              )}
            </select>
            {currentUserSkillsOffered.length === 0 && (
              <p className="text-yellow-400 text-xs mt-1">
                ⚠️ You need to add skills to your profile first
              </p>
            )}
          
          </div>

          {/* Skill I want */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Skill I want to learn:
            </label>
            <select
              value={selectedSkillWanted}
              onChange={(e) => setSelectedSkillWanted(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a skill you want to learn</option>
              {targetUserSkillsOffered.length === 0 ? (
                <option value="" disabled>No skills available from this user</option>
              ) : skillsIWant.length > 0 ? (
                <>
                  <optgroup label="Skills You Want">
                    {skillsIWant.map(skill => (
                      <option key={skill} value={skill}>{skill} ⭐</option>
                    ))}
                  </optgroup>
                  <optgroup label="Other Skills They Offer">
                    {targetUserSkillsOffered.filter(skill => !skillsIWant.includes(skill)).map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </optgroup>
                </>
              ) : (
                targetUserSkillsOffered.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))
              )}
            </select>
            {targetUserSkillsOffered.length === 0 && (
              <p className="text-yellow-400 text-xs mt-1">
                ⚠️ This user hasn't added any skills to their profile
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a personal message to introduce yourself and explain your learning goals..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={localLoading || !canSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {localLoading ? (
                'Sending...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};