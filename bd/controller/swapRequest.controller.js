const SwapRequest = require('../models/swapRequest.model');
const User = require('../models/user.model');

const sendSwapRequest = async (req, res) => {
    try {
        const { toUserId, skillOffered, skillRequested, message } = req.body;
        const fromUserId = req.user._id;

        if (!toUserId || !skillOffered || !skillRequested) {
            return res.status(400).json({
                success: false,
                message: 'toUserId, skillOffered, and skillRequested are required'
            });
        }

        if (fromUserId.toString() === toUserId) {
            return res.status(400).json({
                success: false,
                message: 'Cannot send request to yourself'
            });
        }

        const toUser = await User.findById(toUserId);
        if (!toUser || toUser.status !== 'active') {
            return res.status(404).json({
                success: false,
                message: 'Target user not found or inactive'
            });
        }

        // Check if target user ispublic
        if (!toUser.isPublic) {
            return res.status(403).json({
                success: false,
                message: 'Cannot send request to private user'
            });
        }

        const existingRequest = await SwapRequest.findOne({
            fromUser: fromUserId,
            toUser: toUserId,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: 'You already have a pending request with this user'
            });
        }

        const swapRequest = new SwapRequest({
            fromUser: fromUserId,
            toUser: toUserId,
            skillOffered,
            skillRequested,
            message: message || ''
        });

        await swapRequest.save();

        await swapRequest.populate([
            { path: 'fromUser', select: 'name email' },
            { path: 'toUser', select: 'name email' }
        ]);

        res.status(201).json({
            success: true,
            message: 'Swap request sent successfully',
            data: {
                swapRequest
            }
        });

    } catch (error) {
        console.error('Error sending swap request:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending swap request'
        });
    }
};

const getMyRequests = async (req, res) => {
    try {
        const userId = req.user._id;
        const { status, type = 'all', page = 1, limit = 10 } = req.query;

        let query = {};
        
        if (type === 'incoming') {
            query.toUser = userId;
        } else if (type === 'outgoing') {
            query.fromUser = userId;
        } else {
            query.$or = [
                { fromUser: userId },
                { toUser: userId }
            ];
        }

        if (status && ['pending', 'accepted', 'rejected', 'cancelled', 'completed'].includes(status)) {
            query.status = status;
        }

        const requests = await SwapRequest.find(query)
            .populate('fromUser', 'name email profilePhoto')
            .populate('toUser', 'name email profilePhoto')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await SwapRequest.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                requests,
                totalPages: Math.ceil(total / limit),
                currentPage: parseInt(page),
                totalRequests: total
            }
        });

    } catch (error) {
        console.error('Error getting my requests:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting requests'
        });
    }
};

// Accept a swap request
const acceptSwapRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { responseMessage } = req.body;
        const userId = req.user._id;

        const swapRequest = await SwapRequest.findById(requestId);
        
        if (!swapRequest) {
            return res.status(404).json({
                success: false,
                message: 'Swap request not found'
            });
        }

        // Check if user is the recipient of the request
        if (swapRequest.toUser.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only accept requests sent to you'
            });
        }

        // Check if request is still pending
        if (swapRequest.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Request is no longer pending'
            });
        }

        // Update request status
        swapRequest.status = 'accepted';
        swapRequest.responseMessage = responseMessage || '';
        swapRequest.respondedAt = new Date();

        await swapRequest.save();

        // Update user stats
        await User.findByIdAndUpdate(swapRequest.fromUser, {
            $inc: { totalSwaps: 1 }
        });
        await User.findByIdAndUpdate(swapRequest.toUser, {
            $inc: { totalSwaps: 1 }
        });

        await swapRequest.populate([
            { path: 'fromUser', select: 'name email' },
            { path: 'toUser', select: 'name email' }
        ]);

        res.status(200).json({
            success: true,
            message: 'Swap request accepted successfully',
            data: {
                swapRequest
            }
        });

    } catch (error) {
        console.error('Error accepting swap request:', error);
        res.status(500).json({
            success: false,
            message: 'Error accepting swap request'
        });
    }
};

// Reject a swap request
const rejectSwapRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { responseMessage } = req.body;
        const userId = req.user._id;

        const swapRequest = await SwapRequest.findById(requestId);
        
        if (!swapRequest) {
            return res.status(404).json({
                success: false,
                message: 'Swap request not found'
            });
        }

        // Check if user is the recipient of the request
        if (swapRequest.toUser.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only reject requests sent to you'
            });
        }

        // Check if request is still pending
        if (swapRequest.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Request is no longer pending'
            });
        }

        // Update request status
        swapRequest.status = 'rejected';
        swapRequest.responseMessage = responseMessage || '';
        swapRequest.respondedAt = new Date();

        await swapRequest.save();

        await swapRequest.populate([
            { path: 'fromUser', select: 'name email' },
            { path: 'toUser', select: 'name email' }
        ]);

        res.status(200).json({
            success: true,
            message: 'Swap request rejected successfully',
            data: {
                swapRequest
            }
        });

    } catch (error) {
        console.error('Error rejecting swap request:', error);
        res.status(500).json({
            success: false,
            message: 'Error rejecting swap request'
        });
    }
};

// Cancel a swap request (only sender can cancel)
const cancelSwapRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        const swapRequest = await SwapRequest.findById(requestId);
        
        if (!swapRequest) {
            return res.status(404).json({
                success: false,
                message: 'Swap request not found'
            });
        }

        // Check if user is the sender of the request
        if (swapRequest.fromUser.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only cancel requests you sent'
            });
        }

        // Check if request is still pending
        if (swapRequest.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Request is no longer pending'
            });
        }

        // Update request status
        swapRequest.status = 'cancelled';

        await swapRequest.save();

        await swapRequest.populate([
            { path: 'fromUser', select: 'name email' },
            { path: 'toUser', select: 'name email' }
        ]);

        res.status(200).json({
            success: true,
            message: 'Swap request cancelled successfully',
            data: {
                swapRequest
            }
        });

    } catch (error) {
        console.error('Error cancelling swap request:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling swap request'
        });
    }
};

const completeSwapRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        const swapRequest = await SwapRequest.findById(requestId);
        
        if (!swapRequest) {
            return res.status(404).json({
                success: false,
                message: 'Swap request not found'
            });
        }

        if (swapRequest.fromUser.toString() !== userId.toString() && 
            swapRequest.toUser.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only complete requests you are part of'
            });
        }

        if (swapRequest.status !== 'accepted') {
            return res.status(400).json({
                success: false,
                message: 'Request must be accepted before completion'
            });
        }

        swapRequest.status = 'completed';
        swapRequest.completedAt = new Date();

        await swapRequest.save();

        await User.findByIdAndUpdate(swapRequest.fromUser, {
            $inc: { completedSwaps: 1 }
        });
        await User.findByIdAndUpdate(swapRequest.toUser, {
            $inc: { completedSwaps: 1 }
        });

        await swapRequest.populate([
            { path: 'fromUser', select: 'name email' },
            { path: 'toUser', select: 'name email' }
        ]);

        res.status(200).json({
            success: true,
            message: 'Swap request completed successfully',
            data: {
                swapRequest
            }
        });

    } catch (error) {
        console.error('Error completing swap request:', error);
        res.status(500).json({
            success: false,
            message: 'Error completing swap request'
        });
    }
};

const getSwapRequest = async (req, res) => {
    try {
        console.log('getSwapRequest function called');
        console.log('Request params:', req.params);
        console.log('Request URL:', req.url);
        console.log('Request path:', req.path);
        
        const { requestId } = req.params;
        const userId = req.user._id;

        console.log('Request ID:', requestId);
        console.log('User ID:', userId);

        const swapRequest = await SwapRequest.findById(requestId)
            .populate('fromUser', 'name email profilePhoto')
            .populate('toUser', 'name email profilePhoto');

        if (!swapRequest) {
            return res.status(404).json({
                success: false,
                message: 'Swap request not found'
            });
        }

        if (swapRequest.fromUser._id.toString() !== userId.toString() && 
            swapRequest.toUser._id.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only view requests you are part of'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                swapRequest
            }
        });

    } catch (error) {
        console.error('Error getting swap request:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting swap request'
        });
    }
};

const addSwapRatingReview = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user._id;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        const swapRequest = await SwapRequest.findById(requestId);
        if (!swapRequest) {
            return res.status(404).json({
                success: false,
                message: 'Swap request not found'
            });
        }

        if (swapRequest.status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Swap must be completed before leaving a review'
            });
        }

        let isFromUser = swapRequest.fromUser.toString() === userId.toString();
        let isToUser = swapRequest.toUser.toString() === userId.toString();
        if (!isFromUser && !isToUser) {
            return res.status(403).json({
                success: false,
                message: 'You are not a participant in this swap'
            });
        }

        // Determine which side is submitting
        let alreadySubmitted = false;
        if (isFromUser) {
            alreadySubmitted = swapRequest.userARatingSubmitted;
        } else {
            alreadySubmitted = swapRequest.userBRatingSubmitted;
        }
        if (alreadySubmitted) {
            return res.status(400).json({
                success: false,
                message: 'You have already submitted a review for this swap'
            });
        }

        // Save rating and comment
        if (isFromUser) {
            swapRequest.userARating = { rating, comment };
            swapRequest.userARatingSubmitted = true;
            swapRequest.ratingSubmittedAt.userA = new Date();
        } else {
            swapRequest.userBRating = { rating, comment };
            swapRequest.userBRatingSubmitted = true;
            swapRequest.ratingSubmittedAt.userB = new Date();
        }

        // If both have submitted, update status and make visible
        if (swapRequest.userARatingSubmitted && swapRequest.userBRatingSubmitted) {
            swapRequest.ratingStatus = 'both_submitted';
            swapRequest.ratingsVisibleAt = new Date();
        } else {
            swapRequest.ratingStatus = 'waiting_both';
        }

        await swapRequest.save();

        // Optionally update the recipient's averageRating and totalRatings
        let recipientId = isFromUser ? swapRequest.toUser : swapRequest.fromUser;
        if (swapRequest.userARatingSubmitted && swapRequest.userBRatingSubmitted) {
            // Only update when both have submitted
            const recipient = await User.findById(recipientId);
            if (recipient) {
                // Calculate new average
                const allRatings = await SwapRequest.find({
                    $or: [
                        { fromUser: recipientId, userBRatingSubmitted: true },
                        { toUser: recipientId, userARatingSubmitted: true }
                    ],
                    status: 'completed'
                });
                let ratings = [];
                allRatings.forEach(req => {
                    if (req.fromUser.toString() === recipientId.toString() && req.userBRating && req.userBRating.rating) {
                        ratings.push(req.userBRating.rating);
                    }
                    if (req.toUser.toString() === recipientId.toString() && req.userARating && req.userARating.rating) {
                        ratings.push(req.userARating.rating);
                    }
                });
                const totalRatings = ratings.length;
                const averageRating = totalRatings > 0 ? (ratings.reduce((a, b) => a + b, 0) / totalRatings) : 0;
                recipient.averageRating = averageRating;
                recipient.totalRatings = totalRatings;
                await recipient.save();
            }
        }

        res.status(200).json({
            success: true,
            message: 'Review submitted successfully',
            data: { swapRequest }
        });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting review'
        });
    }
};

module.exports = {
    sendSwapRequest,
    getMyRequests,
    acceptSwapRequest,
    rejectSwapRequest,
    cancelSwapRequest,
    completeSwapRequest,
    getSwapRequest,
    addSwapRatingReview
}; 