import React, { useState } from 'react';
import { Check, X, Star, MessageSquare, Trash2, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSwap } from '../../contexts/SwapContext';

export const SwapRequestCard = ({ request }) => {
  const { user: currentUser } = useAuth();
  const { updateSwapRequest, deleteSwapRequest } = useSwap();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const isReceiver = currentUser?.id === request.toUserId;
  const isSender = currentUser?.id === request.fromUserId;
  const canRate = request.status === 'completed' && !request.rating;
  
  const otherUser = isReceiver ? request.fromUser : request.toUser;

  const handleAccept = () => {
    updateSwapRequest(request.id, { status: 'accepted' });
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      updateSwapRequest(request.id, { 
        status: 'rejected',
        rejectionReason: rejectionReason.trim()
      });
      setShowRejectModal(false);
      setRejectionReason('');
    }
  };

  const handleDelete = () => {
    deleteSwapRequest(request.id);
  };

  const handleComplete = () => {
    updateSwapRequest(request.id, { status: 'completed' });
  };

  const handleSubmitRating = () => {
    updateSwapRequest(request.id, { rating, feedback: feedback.trim() || undefined });
    setShowRatingModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'accepted': return 'text-green-400 bg-green-400/10';
      case 'rejected': return 'text-red-400 bg-red-400/10';
      case 'completed': return 'text-blue-400 bg-blue-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <Check className="w-4 h-4" />;
      case 'rejected': return <X className="w-4 h-4" />;
      case 'completed': return <Star className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <>
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {otherUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <h3 className="text-white font-medium">{otherUser.name}</h3>
              <p className="text-gray-400 text-sm">
                {isReceiver ? 'Wants to learn from you' : 'You want to learn from them'}
              </p>
            </div>
          </div>
          
          <div className={`flex items-center px-3 py-1 rounded-full text-sm ${getStatusColor(request.status)}`}>
            {getStatusIcon(request.status)}
            <span className="ml-1 capitalize">{request.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-700 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-300 mb-1">
              {isReceiver ? 'They can teach:' : 'You can teach:'}
            </h4>
            <span className="inline-block px-2 py-1 bg-blue-600 text-white rounded-full text-sm">
              {request.skillOffered}
            </span>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-300 mb-1">
              {isReceiver ? 'They want to learn:' : 'You want to learn:'}
            </h4>
            <span className="inline-block px-2 py-1 bg-green-600 text-white rounded-full text-sm">
              {request.skillWanted}
            </span>
          </div>
        </div>

        {request.message && (
          <div className="bg-gray-700 rounded-lg p-3 mb-4">
            <div className="flex items-center text-gray-300 text-sm mb-2">
              <MessageSquare className="w-4 h-4 mr-1" />
              Message:
            </div>
            <p className="text-gray-200 text-sm">{request.message}</p>
          </div>
        )}

        {request.rejectionReason && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
            <div className="flex items-center text-red-400 text-sm mb-2">
              <AlertCircle className="w-4 h-4 mr-1" />
              Rejection Reason:
            </div>
            <p className="text-red-300 text-sm">{request.rejectionReason}</p>
          </div>
        )}

        {request.rating && request.feedback && (
          <div className="bg-gray-700 rounded-lg p-3 mb-4">
            <div className="flex items-center text-yellow-400 text-sm mb-2">
              <Star className="w-4 h-4 mr-1 fill-current" />
              Rating: {request.rating}/5
            </div>
            <p className="text-gray-200 text-sm">{request.feedback}</p>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <span>Requested on {request.createdAt.toLocaleDateString()}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {request.status === 'pending' && isReceiver && (
            <>
              <button
                onClick={handleAccept}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Check className="w-4 h-4 mr-2" />
                Accept
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </button>
            </>
          )}

          {request.status === 'pending' && isSender && (
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Request
            </button>
          )}

          {request.status === 'accepted' && (
            <button
              onClick={handleComplete}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <Check className="w-4 h-4 mr-2" />
              Mark as Completed
            </button>
          )}

          {canRate && (
            <button
              onClick={() => setShowRatingModal(true)}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <Star className="w-4 h-4 mr-2" />
              Rate Experience
            </button>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Reject Request</h2>
              <button
                onClick={() => setShowRejectModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Please provide a reason for rejection:
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Explain why you're rejecting this request..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Rate Your Experience</h2>
              <button
                onClick={() => setShowRatingModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rating (1-5 stars)
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setRating(num)}
                    className={`p-1 ${rating >= num ? 'text-yellow-400' : 'text-gray-600'}`}
                  >
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Feedback (Optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Share your experience..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRating}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};