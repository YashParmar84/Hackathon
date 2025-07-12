import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const SwapContext = createContext(null);

export const SwapProvider = ({ children }) => {
  const [swapRequests, setSwapRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  };

  const sendSwapRequest = async (requestData) => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('http://localhost:8000/api/v1/swap-requests/send', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          toUserId: requestData.toUserId,
          skillOffered: requestData.skillOffered,
          skillRequested: requestData.skillRequested,
          message: requestData.message || ''
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send swap request');
      }

      return data.data.swapRequest;
    } catch (error) {
      setError(error.message || 'Failed to send swap request');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getMyRequests = async (status = null, type = 'all', page = 1) => {
    try {
      setLoading(true);
      setError('');

      let url = 'http://localhost:8000/api/v1/swap-requests/my-requests?';
      const params = new URLSearchParams();
      
      if (status) params.append('status', status);
      if (type) params.append('type', type);
      if (page) params.append('page', page);
      
      url += params.toString();

      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch requests');
      }

      setSwapRequests(data.data.requests);
      return data.data;
    } catch (error) {
      setError(error.message || 'Failed to fetch requests');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const acceptSwapRequest = async (requestId, responseMessage = '') => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`http://localhost:8000/api/v1/swap-requests/${requestId}/accept`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ responseMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to accept request');
      }

      // Update local state
      setSwapRequests(prev => prev.map(req => 
        req._id === requestId ? { ...req, status: 'accepted', responseMessage } : req
      ));

      return data.data.swapRequest;
    } catch (error) {
      setError(error.message || 'Failed to accept request');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const rejectSwapRequest = async (requestId, responseMessage = '') => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`http://localhost:8000/api/v1/swap-requests/${requestId}/reject`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ responseMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reject request');
      }

      // Update local state
      setSwapRequests(prev => prev.map(req => 
        req._id === requestId ? { ...req, status: 'rejected', responseMessage } : req
      ));

      return data.data.swapRequest;
    } catch (error) {
      setError(error.message || 'Failed to reject request');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cancelSwapRequest = async (requestId) => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`http://localhost:8000/api/v1/swap-requests/${requestId}/cancel`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel request');
      }

      // Update local state
      setSwapRequests(prev => prev.map(req => 
        req._id === requestId ? { ...req, status: 'cancelled' } : req
      ));

      return data.data.swapRequest;
    } catch (error) {
      setError(error.message || 'Failed to cancel request');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const completeSwapRequest = async (requestId) => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`http://localhost:8000/api/v1/swap-requests/${requestId}/complete`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to complete request');
      }

      // Update local state
      setSwapRequests(prev => prev.map(req => 
        req._id === requestId ? { ...req, status: 'completed' } : req
      ));

      return data.data.swapRequest;
    } catch (error) {
      setError(error.message || 'Failed to complete request');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getSwapRequest = async (requestId) => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`http://localhost:8000/api/v1/swap-requests/${requestId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch request');
      }

      return data.data.swapRequest;
    } catch (error) {
      setError(error.message || 'Failed to fetch request');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addSwapRatingReview = async (requestId, rating, comment = '') => {
    try {
      setLoading(true);
      setError('');

      // Validate rating
      if (!rating || rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      const response = await fetch(`http://localhost:8000/api/v1/swap-requests/${requestId}/rate`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          rating,
          comment
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit review');
      }

      // Update local state
      setSwapRequests(prev => prev.map(req => 
        req._id === requestId ? { 
          ...req, 
          ...data.data.swapRequest 
        } : req
      ));

      return data.data.swapRequest;
    } catch (error) {
      setError(error.message || 'Failed to submit review');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SwapContext.Provider value={{
      swapRequests,
      loading,
      error,
      sendSwapRequest,
      getMyRequests,
      acceptSwapRequest,
      rejectSwapRequest,
      cancelSwapRequest,
      completeSwapRequest,
      getSwapRequest,
      addSwapRatingReview
    }}>
      {children}
    </SwapContext.Provider>
  );
};

export const useSwap = () => {
  const context = useContext(SwapContext);
  if (!context) {
    throw new Error('useSwap must be used within a SwapProvider');
  }
  return context;
};