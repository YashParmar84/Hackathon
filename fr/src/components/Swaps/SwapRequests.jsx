import React, { useState, useEffect } from 'react';
import { useSwap } from '../../contexts/SwapContext';
import { useAuth } from '../../contexts/AuthContext';
import { Check, X, Clock, Send, User, MessageSquare, Calendar, Star } from 'lucide-react';
import { SwapRatingModal } from './SwapRatingModal';

export const SwapRequests = () => {
  const { user: currentUser } = useAuth();
  const { 
    swapRequests, 
    loading, 
    error, 
    getMyRequests, 
    acceptSwapRequest, 
    rejectSwapRequest, 
    cancelSwapRequest, 
    completeSwapRequest 
  } = useSwap();
  
  const [activeTab, setActiveTab] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [responseMessage, setResponseMessage] = useState('');
  const [respondingTo, setRespondingTo] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRequestForRating, setSelectedRequestForRating] = useState(null);

  useEffect(() => {
    loadRequests();
  }, [activeTab, selectedStatus]);

  const loadRequests = async () => {
    try {
      const status = selectedStatus === 'all' ? null : selectedStatus;
      await getMyRequests(status, activeTab);
    } catch (error) {
      console.error('Failed to load requests:', error);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await acceptSwapRequest(requestId, responseMessage);
      setResponseMessage('');
      setRespondingTo(null);
    } catch (error) {
      console.error('Failed to accept request:', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await rejectSwapRequest(requestId, responseMessage);
      setResponseMessage('');
      setRespondingTo(null);
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  const handleCancel = async (requestId) => {
    try {
      await cancelSwapRequest(requestId);
    } catch (error) {
      console.error('Failed to cancel request:', error);
    }
  };

  const handleComplete = async (requestId) => {
    try {
      await completeSwapRequest(requestId);
    } catch (error) {
      console.error('Failed to complete request:', error);
    }
  };

  const handleRateSwap = (request) => {
    setSelectedRequestForRating(request);
    setShowRatingModal(true);
  };

  const handleRatingSubmitted = () => {
    loadRequests(); // Reload to show updated rating status
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400';
      case 'accepted': return 'text-green-400';
      case 'rejected': return 'text-red-400';
      case 'cancelled': return 'text-gray-400';
      case 'completed': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <Check className="w-4 h-4" />;
      case 'rejected': return <X className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      case 'completed': return <Check className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canRateSwap = (request) => {
    if (request.status !== 'completed') return false;
    
    const isFromUser = request.fromUser._id === currentUser.id;
    const isToUser = request.toUser._id === currentUser.id;
    
    if (!isFromUser && !isToUser) return false;
    
    // Check if user has already submitted a rating
    if (isFromUser) {
      return !request.userARatingSubmitted;
    } else {
      return !request.userBRatingSubmitted;
    }
  };

  const getRatingStatus = (request) => {
    const isFromUser = request.fromUser._id === currentUser.id;
    const isToUser = request.toUser._id === currentUser.id;
    
    if (!isFromUser && !isToUser) return null;
    
    if (isFromUser) {
      if (request.userARatingSubmitted) {
        return { status: 'submitted', rating: request.userARating?.rating };
      }
    } else {
      if (request.userBRatingSubmitted) {
        return { status: 'submitted', rating: request.userBRating?.rating };
      }
    }
    
    return { status: 'pending' };
  };

  if (loading) {
  return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-white">Loading requests...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={loadRequests}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Swap Requests</h2>
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 text-sm">Total: {swapRequests.length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('incoming')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'incoming'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Incoming
          </button>
            <button
            onClick={() => setActiveTab('outgoing')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'outgoing'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
            Outgoing
            </button>
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Requests List */}
        <div className="space-y-4">
        {swapRequests.length === 0 ? (
          <div className="text-center py-12">
            <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No requests found</h3>
            <p className="text-gray-400">You don't have any swap requests yet.</p>
          </div>
        ) : (
          swapRequests.map((request) => {
            const isIncoming = request.toUser._id === currentUser.id;
            const otherUser = isIncoming ? request.fromUser : request.toUser;
            const canRespond = isIncoming && request.status === 'pending';
            const canCancel = !isIncoming && request.status === 'pending';
            const canComplete = request.status === 'accepted';
            const canRate = canRateSwap(request);
            const ratingStatus = getRatingStatus(request);

            return (
              <div key={request._id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {otherUser.profilePhoto ? (
                        <img
                          src={otherUser.profilePhoto}
                          alt={otherUser.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        otherUser.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-white font-medium">{otherUser.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <span className={`flex items-center ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1 capitalize">{request.status}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(request.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Skill Offered</h4>
                    <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
                      {request.skillOffered}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Skill Requested</h4>
                    <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">
                      {request.skillRequested}
                    </span>
                  </div>
                </div>

                {request.message && (
                  <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center mb-2">
                      <MessageSquare className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-400">Message</span>
                    </div>
                    <p className="text-gray-300 text-sm">{request.message}</p>
                  </div>
                )}

                {request.responseMessage && (
                  <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center mb-2">
                      <MessageSquare className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-400">Response</span>
                    </div>
                    <p className="text-gray-300 text-sm">{request.responseMessage}</p>
                  </div>
                )}

                {/* Rating Status for Completed Swaps */}
                {request.status === 'completed' && (
                  <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Star className="w-4 h-4 text-yellow-400 mr-2" />
                      <span className="text-sm font-medium text-gray-400">Rating Status</span>
                    </div>
                    {ratingStatus ? (
                      <div className="flex items-center space-x-2">
                        {ratingStatus.status === 'submitted' ? (
                          <>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < ratingStatus.rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-green-400 text-sm">✓ Review submitted</span>
                          </>
                        ) : (
                          <span className="text-yellow-400 text-sm">Pending review</span>
                        )}
        </div>
      ) : (
                      <span className="text-gray-400 text-sm">Not eligible for rating</span>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {canRespond && (
                    <div className="flex-1 space-y-2">
                      <textarea
                        value={responseMessage}
                        onChange={(e) => setResponseMessage(e.target.value)}
                        placeholder="Add a response message (optional)..."
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAccept(request._id)}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(request._id)}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}

                  {canCancel && (
                    <button
                      onClick={() => handleCancel(request._id)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      Cancel Request
                    </button>
                  )}

                  {canComplete && (
                    <button
                      onClick={() => handleComplete(request._id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Mark Complete
                    </button>
                  )}

                  {canRate && (
                    <button
                      onClick={() => handleRateSwap(request)}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm flex items-center"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Rate Experience
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
        </div>

      {/* Rating Modal */}
      {showRatingModal && selectedRequestForRating && (
        <SwapRatingModal
          swapRequest={selectedRequestForRating}
          onClose={() => {
            setShowRatingModal(false);
            setSelectedRequestForRating(null);
          }}
          onRatingSubmitted={handleRatingSubmitted}
        />
      )}
    </div>
  );
};