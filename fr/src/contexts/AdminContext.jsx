import React, { createContext, useContext, useState } from 'react';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  };

  // Dashboard Statistics
  const getDashboardStats = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:8000/api/v1/admin/dashboard/stats', {
        headers: getAuthHeaders(),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard stats');
      }
      
      return data.data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get Users
  const getUsers = async (params = {}) => {
    try {
      setLoading(true);
      setError('');
      
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        status: params.status || 'active',
        role: params.role || 'user',
        search: params.search || '',
      });
      
      const response = await fetch(`http://localhost:8000/api/v1/admin/users?${queryParams}`, {
        headers: getAuthHeaders(),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users');
      }
      
      return data.data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get User Details
  const getUserDetails = async (userId) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`http://localhost:8000/api/v1/admin/users/${userId}`, {
        headers: getAuthHeaders(),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user details');
      }
      
      return data.data.user;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update User Status
  const updateUserStatus = async (userId, status, flagReason = '') => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`http://localhost:8000/api/v1/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, flagReason }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user status');
      }
      
      return data.data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Add Review Notes
  const addReviewNotes = async (userId, reviewNotes) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`http://localhost:8000/api/v1/admin/users/${userId}/review-notes`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reviewNotes }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add review notes');
      }
      
      return data.data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reject Skill Description
  const rejectSkill = async (userId, skillType, skillName, reason) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`http://localhost:8000/api/v1/admin/users/${userId}/skills`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({ skillType, skillName, reason }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reject skill');
      }
      
      return data.data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Ban User
  const banUser = async (userId, reason, duration = null) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`http://localhost:8000/api/v1/admin/users/${userId}/ban`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason, duration }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to ban user');
      }
      
      return data.data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get Flagged Users
  const getFlaggedUsers = async (params = {}) => {
    try {
      setLoading(true);
      setError('');
      
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        status: params.status || 'disabled',
      });
      
      const response = await fetch(`http://localhost:8000/api/v1/admin/flagged-users?${queryParams}`, {
        headers: getAuthHeaders(),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch flagged users');
      }
      
      return data.data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get Swaps
  const getSwaps = async (params = {}) => {
    try {
      setLoading(true);
      setError('');
      
      const queryParams = new URLSearchParams({
        status: params.status || 'pending',
        page: params.page || 1,
        limit: params.limit || 10,
        dateFrom: params.dateFrom || '',
        dateTo: params.dateTo || '',
      });
      
      const response = await fetch(`http://localhost:8000/api/v1/admin/swaps?${queryParams}`, {
        headers: getAuthHeaders(),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch swaps');
      }
      
      return data.data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Send Platform Message
  const sendPlatformMessage = async (title, message, type = 'all') => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:8000/api/v1/admin/platform-message', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, message, type }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send platform message');
      }
      
      return data.data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Generate Report
  const generateReport = async (reportType, format = 'json', dateFrom = '', dateTo = '') => {
    try {
      setLoading(true);
      setError('');
      
      const queryParams = new URLSearchParams({
        reportType,
        format,
        dateFrom,
        dateTo,
      });
      
      const response = await fetch(`http://localhost:8000/api/v1/admin/reports?${queryParams}`, {
        headers: getAuthHeaders(),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate report');
      }
      
      return data.data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminContext.Provider value={{
      loading,
      error,
      getDashboardStats,
      getUsers,
      getUserDetails,
      updateUserStatus,
      addReviewNotes,
      rejectSkill,
      banUser,
      getFlaggedUsers,
      getSwaps,
      sendPlatformMessage,
      generateReport,
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}; 