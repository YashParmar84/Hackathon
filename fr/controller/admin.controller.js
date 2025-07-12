const User = require('../models/user.model');
const SwapRequest = require('../models/swapRequest.model');
const { mailSender } = require('../utils/mailSender');
const { 
    sendBanNotification, 
    sendSkillRejectionNotification, 
    sendPlatformMessage, 
    sendStatusChangeNotification, 
    sendReviewNotesNotification 
} = require('../utils/mailSender');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, role, search } = req.query;
        
        const query = {};
        
        // Filter by status
        if (status && ['active', 'disabled', 'under_review'].includes(status)) {
            query.status = status;
        }
        
        // Filter by role
        if (role && ['user', 'admin'].includes(role)) {
            query.role = role;
        }
        
        // Search by name or email
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                users,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                totalUsers: total
            }
        });

    } catch (error) {
        console.error('Error getting all users:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting users'
        });
    }
};

// Get user by ID (admin only)
const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { user }
        });

    } catch (error) {
        console.error('Error getting user by ID:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting user'
        });
    }
};

// Update user status (admin only)
const updateUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status, flagReason } = req.body;

        if (!status || !['active', 'disabled', 'under_review'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Valid status is required: active, disabled, or under_review'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent admin from disabling themselves
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Cannot update your own status'
            });
        }

        const oldStatus = user.status;
        user.status = status;
        user.flagReason = flagReason || '';
        user.flaggedBy = req.user._id;
        user.flaggedAt = new Date();

        await user.save();

        // Send email notification if status changed
        if (oldStatus !== status) {
            try {
                await sendStatusChangeNotification(
                    user.email,
                    user.name,
                    status,
                    flagReason || 'Status updated by admin',
                    req.user.name
                );
            } catch (emailError) {
                console.error('Error sending status change email:', emailError);
            }
        }

        res.status(200).json({
            success: true,
            message: 'User status updated successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    status: user.status,
                    flagReason: user.flagReason,
                    flaggedAt: user.flaggedAt
                }
            }
        });

    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user status'
        });
    }
};

// Add review notes to user (admin only)
const addReviewNotes = async (req, res) => {
    try {
        const { userId } = req.params;
        const { reviewNotes } = req.body;

        if (!reviewNotes || reviewNotes.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Review notes are required'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.reviewNotes = reviewNotes;
        user.reviewedBy = req.user._id;
        user.reviewedAt = new Date();

        await user.save();

        // Send email notification
        try {
            await sendReviewNotesNotification(
                user.email,
                user.name,
                reviewNotes,
                req.user.name
            );
        } catch (emailError) {
            console.error('Error sending review notes email:', emailError);
        }

        res.status(200).json({
            success: true,
            message: 'Review notes added successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    reviewNotes: user.reviewNotes,
                    reviewedAt: user.reviewedAt
                }
            }
        });

    } catch (error) {
        console.error('Error adding review notes:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding review notes'
        });
    }
};

// Get dashboard statistics (admin only)
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ status: 'active' });
        const disabledUsers = await User.countDocuments({ status: 'disabled' });
        const underReviewUsers = await User.countDocuments({ status: 'under_review' });
        const verifiedUsers = await User.countDocuments({ emailVerified: true });
        const adminUsers = await User.countDocuments({ role: 'admin' });

        // Get recent users (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentUsers = await User.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                activeUsers,
                disabledUsers,
                underReviewUsers,
                verifiedUsers,
                adminUsers,
                recentUsers
            }
        });

    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting dashboard statistics'
        });
    }
};

// Reject inappropriate skill descriptions (admin only)
const rejectSkillDescription = async (req, res) => {
    try {
        const { userId } = req.params;
        const { skillType, skillName, reason } = req.body; // skillType: 'offered' or 'wanted'

        if (!skillType || !skillName || !reason) {
            return res.status(400).json({
                success: false,
                message: 'skillType, skillName, and reason are required'
            });
        }

        if (!['offered', 'wanted'].includes(skillType)) {
            return res.status(400).json({
                success: false,
                message: 'skillType must be "offered" or "wanted"'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Remove the skill from user's profile
        if (skillType === 'offered') {
            user.skillsOffered = user.skillsOffered.filter(skill => skill !== skillName);
        } else {
            user.skillsWanted = user.skillsWanted.filter(skill => skill !== skillName);
        }

        // Add to review notes
        user.reviewNotes = `${user.reviewNotes}\n\n[${new Date().toISOString()}] Skill "${skillName}" rejected: ${reason}`;
        user.reviewedBy = req.user._id;
        user.reviewedAt = new Date();

        await user.save();

        // Send email notification
        try {
            await sendSkillRejectionNotification(
                user.email,
                user.name,
                skillName,
                skillType,
                reason,
                req.user.name
            );
        } catch (emailError) {
            console.error('Error sending skill rejection email:', emailError);
        }

        res.status(200).json({
            success: true,
            message: 'Skill description rejected successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    skillsOffered: user.skillsOffered,
                    skillsWanted: user.skillsWanted,
                    reviewNotes: user.reviewNotes
                }
            }
        });

    } catch (error) {
        console.error('Error rejecting skill description:', error);
        res.status(500).json({
            success: false,
            message: 'Error rejecting skill description'
        });
    }
};

// Ban user for policy violations (admin only)
const banUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { reason, duration } = req.body; // duration in days, null for permanent

        if (!reason) {
            return res.status(400).json({
                success: false,
                message: 'Ban reason is required'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent admin from banning themselves
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Cannot ban yourself'
            });
        }

        user.status = 'disabled';
        user.flagReason = reason;
        user.flaggedBy = req.user._id;
        user.flaggedAt = new Date();

        // Set ban expiry if duration provided
        if (duration && duration > 0) {
            const banExpiry = new Date();
            banExpiry.setDate(banExpiry.getDate() + duration);
            user.banExpiry = banExpiry;
        }

        await user.save();

        // Send email notification
        try {
            await sendBanNotification(
                user.email,
                user.name,
                reason,
                duration,
                req.user.name
            );
        } catch (emailError) {
            console.error('Error sending ban notification email:', emailError);
        }

        res.status(200).json({
            success: true,
            message: 'User banned successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    status: user.status,
                    flagReason: user.flagReason,
                    flaggedAt: user.flaggedAt,
                    banExpiry: user.banExpiry
                }
            }
        });

    } catch (error) {
        console.error('Error banning user:', error);
        res.status(500).json({
            success: false,
            message: 'Error banning user'
        });
    }
};

// Monitor swaps by status (admin only)
const monitorSwaps = async (req, res) => {
    try {
        const { status, page = 1, limit = 10, dateFrom, dateTo } = req.query;

        const query = {};
        
        // Filter by status
        if (status && ['pending', 'accepted', 'rejected', 'cancelled', 'completed'].includes(status)) {
            query.status = status;
        }

        // Filter by date range
        if (dateFrom || dateTo) {
            query.createdAt = {};
            if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
            if (dateTo) query.createdAt.$lte = new Date(dateTo);
        }

        const swaps = await SwapRequest.find(query)
            .populate('fromUser', 'name email')
            .populate('toUser', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        // Filter out swaps with missing users
        const filteredSwaps = swaps.filter(
            swap => swap.fromUser && swap.toUser
        );

        const total = await SwapRequest.countDocuments(query);

        // Get status counts
        const statusCounts = await SwapRequest.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                swaps: filteredSwaps,
                totalPages: Math.ceil(total / limit),
                currentPage: parseInt(page),
                totalSwaps: total,
                statusCounts: statusCounts.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {})
            }
        });

    } catch (error) {
        console.error('Error monitoring swaps:', error);
        res.status(500).json({
            success: false,
            message: 'Error monitoring swaps'
        });
    }
};

// Send platform-wide message (admin only)
const sendPlatformMessageAdmin = async (req, res) => {
    try {
        const { title, message, type } = req.body; 

        if (!title || !message || !type) {
            return res.status(400).json({
                success: false,
                message: 'Title, message, and type are required'
            });
        }

        if (!['all', 'active', 'verified'].includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Type must be "all", "active", or "verified"'
            });
        }

        let query = {};
        if (type === 'active') {
            query.status = 'active';
        } else if (type === 'verified') {
            query.emailVerified = true;
        }

        const affectedUsers = await User.find(query).select('email name');

        const emailPromises = affectedUsers.map(user => 
            sendPlatformMessage(user.email, user.name, title, message)
        );

        const batchSize = 10;
        for (let i = 0; i < emailPromises.length; i += batchSize) {
            const batch = emailPromises.slice(i, i + batchSize);
            await Promise.allSettled(batch);
        }

        const platformMessage = {
            title,
            message,
            type,
            targetUsers: affectedUsers.length,
            sentBy: req.user._id,
            sentAt: new Date(),
            status: 'sent'
        };

        res.status(200).json({
            success: true,
            message: 'Platform message sent successfully',
            data: {
                message: platformMessage,
                affectedUsers: affectedUsers.length
            }
        });

    } catch (error) {
        console.error('Error sending platform message:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending platform message'
        });
    }
};

const generateReport = async (req, res) => {
    try {
        const { reportType, dateFrom, dateTo, format = 'json' } = req.query;

        if (!reportType || !['user_activity', 'feedback_logs', 'swap_stats'].includes(reportType)) {
            return res.status(400).json({
                success: false,
                message: 'Valid report type is required: user_activity, feedback_logs, or swap_stats'
            });
        }

        let reportData = {};

        switch (reportType) {
            case 'user_activity':
                const dateFilter = {};
                if (dateFrom) dateFilter.$gte = new Date(dateFrom);
                if (dateTo) dateFilter.$lte = new Date(dateTo);

                const userActivity = await User.aggregate([
                    { $match: dateFilter },
                    {
                        $project: {
                            name: 1,
                            email: 1,
                            status: 1,
                            role: 1,
                            createdAt: 1,
                            lastActive: 1,
                            totalSwaps: 1,
                            completedSwaps: 1,
                            averageRating: 1,
                            totalRatings: 1
                        }
                    },
                    { $sort: { createdAt: -1 } }
                ]);

                reportData = {
                    type: 'user_activity',
                    generatedAt: new Date(),
                    totalUsers: userActivity.length,
                    data: userActivity
                };
                break;

            case 'feedback_logs':
                const feedbackQuery = { ratingStatus: 'both_submitted' };
                if (dateFrom || dateTo) {
                    feedbackQuery.ratingsVisibleAt = {};
                    if (dateFrom) feedbackQuery.ratingsVisibleAt.$gte = new Date(dateFrom);
                    if (dateTo) feedbackQuery.ratingsVisibleAt.$lte = new Date(dateTo);
                }

                const feedbackLogs = await SwapRequest.find(feedbackQuery)
                    .populate('fromUser', 'name email')
                    .populate('toUser', 'name email')
                    .sort({ ratingsVisibleAt: -1 });

                reportData = {
                    type: 'feedback_logs',
                    generatedAt: new Date(),
                    totalReviews: feedbackLogs.length,
                    data: feedbackLogs.map(log => ({
                        swapId: log._id,
                        fromUser: log.fromUser,
                        toUser: log.toUser,
                        userARating: log.userARating,
                        userBRating: log.userBRating,
                        ratingsVisibleAt: log.ratingsVisibleAt
                    }))
                };
                break;

            case 'swap_stats':
                const swapStats = await SwapRequest.aggregate([
                    {
                        $group: {
                            _id: '$status',
                            count: { $sum: 1 },
                            avgRating: { $avg: { $avg: ['$userARating.rating', '$userBRating.rating'] } }
                        }
                    }
                ]);

                const totalSwaps = await SwapRequest.countDocuments();
                const completedSwaps = await SwapRequest.countDocuments({ status: 'completed' });
                const pendingSwaps = await SwapRequest.countDocuments({ status: 'pending' });

                reportData = {
                    type: 'swap_stats',
                    generatedAt: new Date(),
                    totalSwaps,
                    completedSwaps,
                    pendingSwaps,
                    completionRate: totalSwaps > 0 ? (completedSwaps / totalSwaps) * 100 : 0,
                    statusBreakdown: swapStats
                };
                break;
        }

        if (format === 'csv') {
            // Convert to CSV format (simplified)
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="${reportType}_${new Date().toISOString().split('T')[0]}.csv"`);
            res.status(200).send(JSON.stringify(reportData, null, 2));
        } else {
            res.status(200).json({
                success: true,
                data: reportData
            });
        }

    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating report'
        });
    }
};

// Get flagged users for review (admin only)
const getFlaggedUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;

        const query = { status: { $in: ['disabled', 'under_review'] } };
        
        if (status && ['disabled', 'under_review'].includes(status)) {
            query.status = status;
        }

        const flaggedUsers = await User.find(query)
            .select('-password')
            .populate('flaggedBy', 'name email')
            .sort({ flaggedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                flaggedUsers,
                totalPages: Math.ceil(total / limit),
                currentPage: parseInt(page),
                totalFlagged: total
            }
        });

    } catch (error) {
        console.error('Error getting flagged users:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting flagged users'
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUserStatus,
    addReviewNotes,
    getDashboardStats,
    rejectSkillDescription,
    banUser,
    monitorSwaps,
    sendPlatformMessageAdmin,
    generateReport,
    getFlaggedUsers
}; 