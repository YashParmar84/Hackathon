import React, { useState } from 'react';
import { X, Star, Send } from 'lucide-react';
import { useSwap } from '../../contexts/SwapContext';

export const SwapRatingModal = ({ swapRequest, onClose, onRatingSubmitted }) => {
  const { addSwapRatingReview, loading, error } = useSwap();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!rating || rating < 1 || rating > 5) {
      setValidationError('Please select a rating between 1 and 5 stars');
      return;
    }

    setLocalLoading(true);
    try {
      await addSwapRatingReview(swapRequest._id, rating, comment);
      onRatingSubmitted && onRatingSubmitted();
      onClose();
    } catch (error) {
      console.error('Failed to submit rating:', error);
      setValidationError(error.message || 'Failed to submit rating. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex items-center justify-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-2xl transition-colors ${
              star <= rating 
                ? 'text-yellow-400 hover:text-yellow-300' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <Star className="w-8 h-8" fill={star <= rating ? 'currentColor' : 'none'} />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Rate Your Swap Experience</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="text-center mb-4">
            <h3 className="text-white font-medium mb-2">How was your skill swap experience?</h3>
            <p className="text-gray-400 text-sm">
              Rate your experience with {swapRequest.toUser?.name || 'the other user'}
            </p>
          </div>
        </div>

        {/* Error Display */}
        {validationError && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-300 text-sm">{validationError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating Stars */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3 text-center">
              Your Rating:
            </label>
            {renderStars()}
            <p className="text-center text-gray-400 text-sm mt-2">
              {rating > 0 && (
                <span>
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Excellent'}
                </span>
              )}
            </p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Additional Comments (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Share your experience, what you learned, or any feedback..."
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
              disabled={localLoading || !rating}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {localLoading ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 