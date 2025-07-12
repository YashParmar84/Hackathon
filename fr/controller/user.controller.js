const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { default: axios } = require('axios');

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({
            email: email
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            _id: user._id,
            name: user.name,
            email: user.email,
            currentBalance: user.currentBalance
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const loginUser = async (req, res) => {
    const SECRET_KEY = process.env.JWT_SECRET;

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({
        userId: user._id,
        email: user.email
    }, SECRET_KEY, {
        expiresIn: '30d'
    });

    res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            currentBalance: user.currentBalance,
            isAdmin: user.role === 'admin' ? true : false
        }
    });
};

const googleAuth = async (req, res) => {
    const { code } = req.body;

    const client = new OAuth2Client(
        '1045129888675-eu94tap65qs22udmtnrm0tad8nmr5cth.apps.googleusercontent.com',
        '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',
        'postmessage'
    );

    try {
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);

        const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
            },
        });

        const { email, name, sub: googleId } = userInfoResponse.data;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                googleId,
                password: null,
            });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        return res.status(200).json({
            success: true,
            message: 'Google login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                currentBalance: user.currentBalance,
            },
        });

    } catch (error) {
        console.error('Google Auth Error:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Google auth failed',
            error: error.message,
        });
    }
};

const logoutUser = async (req, res) => {
    try {
        return res.status(200).json({ 
            message: 'Logout successful', 
            success: true 
        });
    } catch (error) {
        return res.status(500).json({ 
            message: 'Error during logout', 
            error: error.message 
        });
    }
};

// Get all users with pagination and filters (public access)
const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;
        
        const query = { isPublic: true, status: 'active', role: 'user' };
        
        // Filter by status
        if (status && ['active', 'disabled', 'under_review'].includes(status)) {
            query.status = status;
        }
        
        // Search by name or skills
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { skillsOffered: { $in: [new RegExp(search, 'i')] } },
                { skillsWanted: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const users = await User.find(query)
            .select('-password -email -googleId')
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
                currentPage: parseInt(page),
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

// Get user by ID (public access)
const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId)
            .select('-password -email -googleId')
            .where({ isPublic: true, status: 'active' });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found or profile is private'
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

// Search users (public access)
const searchUsers = async (req, res) => {
    try {
        const { q, page = 1, limit = 10 } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const query = {
            isPublic: true,
            status: 'active',
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { bio: { $regex: q, $options: 'i' } },
                { location: { $regex: q, $options: 'i' } },
                { skillsOffered: { $in: [new RegExp(q, 'i')] } },
                { skillsWanted: { $in: [new RegExp(q, 'i')] } }
            ]
        };

        const users = await User.find(query)
            .select('-password -email -googleId')
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
                currentPage: parseInt(page),
                totalUsers: total,
                searchQuery: q
            }
        });

    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching users'
        });
    }
};

// Get users by skills (public access)
const getUsersBySkills = async (req, res) => {
    try {
        const { skills, page = 1, limit = 10 } = req.query;

        if (!skills) {
            return res.status(400).json({
                success: false,
                message: 'Skills parameter is required'
            });
        }

        const skillsArray = skills.split(',').map(skill => skill.trim().toLowerCase());

        const query = {
            isPublic: true,
            status: 'active',
            $or: [
                { skillsOffered: { $in: skillsArray } },
                { skillsWanted: { $in: skillsArray } }
            ]
        };

        const users = await User.find(query)
            .select('-password -email -googleId')
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
                currentPage: parseInt(page),
                totalUsers: total,
                searchedSkills: skillsArray
            }
        });

    } catch (error) {
        console.error('Error getting users by skills:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting users by skills'
        });
    }
};

// Get users by location (public access)
const getUsersByLocation = async (req, res) => {
    try {
        const { location, page = 1, limit = 10 } = req.query;

        if (!location) {
            return res.status(400).json({
                success: false,
                message: 'Location parameter is required'
            });
        }

        const query = {
            isPublic: true,
            status: 'active',
            location: { $regex: location, $options: 'i' }
        };

        const users = await User.find(query)
            .select('-password -email -googleId')
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
                currentPage: parseInt(page),
                totalUsers: total,
                searchedLocation: location
            }
        });

    } catch (error) {
        console.error('Error getting users by location:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting users by location'
        });
    }
};

// Get users statistics (public access)
const getUsersStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ status: 'active' });
        const publicUsers = await User.countDocuments({ isPublic: true, status: 'active' });
        const verifiedUsers = await User.countDocuments({ emailVerified: true, status: 'active' });

        // Get users with skills
        const usersWithSkills = await User.countDocuments({
            status: 'active',
            $or: [
                { skillsOffered: { $exists: true, $ne: [] } },
                { skillsWanted: { $exists: true, $ne: [] } }
            ]
        });

        // Get recent users (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentUsers = await User.countDocuments({
            createdAt: { $gte: sevenDaysAgo },
            status: 'active'
        });

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                publicUsers,
                verifiedUsers,
                usersWithSkills,
                recentUsers
            }
        });

    } catch (error) {
        console.error('Error getting users stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting users statistics'
        });
    }
};

const getMySkills = async (req, res) => {
    try {
        const userId = req.user._id;  // Fixed this line

        const user = await User.findById(userId)
      
        console.log(user?.skillsOffered)

        res.status(200).json({
            success: true,
            data: {
                skillsOffered: user?.skillsOffered || []
            }
        });

    } catch (error) {
        console.error('Error getting user skills:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting user skills'
        });
    }
};

const getAllUsersWithRatings = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search, minRating } = req.query;
        
        const query = { isPublic: true, status: 'active' };
        
        // Filter by status
        if (status && ['active', 'disabled', 'under_review'].includes(status)) {
            query.status = status;
        }
        
        // Filter by minimum rating
        if (minRating && !isNaN(minRating)) {
            query.averageRating = { $gte: parseFloat(minRating) };
        }
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { skillsOffered: { $in: [new RegExp(search, 'i')] } },
                { skillsWanted: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const users = await User.find(query)
            .select('-password -email -googleId')
            .sort({ averageRating: -1, totalRatings: -1, createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const SwapRequest = require('../models/swapRequest.model');
        const usersWithReviews = await Promise.all(users.map(async (user) => {
            // Get recent reviews where this user was rated
            const recentReviews = await SwapRequest.find({
                $or: [
                    { fromUser: user._id, userBRatingSubmitted: true },
                    { toUser: user._id, userARatingSubmitted: true }
                ],
                status: 'completed',
                ratingStatus: 'both_submitted'
            })
            .populate('fromUser', 'name profilePhoto')
            .populate('toUser', 'name profilePhoto')
            .sort({ ratingsVisibleAt: -1 })
            .limit(3)
            .exec();

            const formattedReviews = recentReviews.map(review => {
                let reviewer, rating, comment;
                if (review.fromUser._id.toString() === user._id.toString()) {
                    reviewer = review.toUser;
                    rating = review.userBRating.rating;
                    comment = review.userBRating.comment;
                } else {
                    reviewer = review.fromUser;
                    rating = review.userARating.rating;
                    comment = review.userARating.comment;
                }
                return {
                    id: review._id,
                    reviewer: {
                        id: reviewer._id,
                        name: reviewer.name,
                        profilePhoto: reviewer.profilePhoto
                    },
                    rating,
                    comment,
                    reviewedAt: review.ratingsVisibleAt,
                    skillExchanged: review.skillOffered || review.skillRequested
                };
            });

            return {
                ...user.toObject(),
                recentReviews: formattedReviews
            };
        }));

        const total = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                users: usersWithReviews,
                totalPages: Math.ceil(total / limit),
                currentPage: parseInt(page),
                totalUsers: total
            }
        });

    } catch (error) {
        console.error('Error getting users with ratings:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting users with ratings'
        });
    }
};

const getUserReviews = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const user = await User.findById(userId)
            .select('-password -email -googleId');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.isPublic) {
            return res.status(403).json({
                success: false,
                message: 'User profile is private'
            });
        }

        const SwapRequest = require('../models/swapRequest.model');
        
        const reviews = await SwapRequest.find({
            $or: [
                { fromUser: user._id, userBRatingSubmitted: true },
                { toUser: user._id, userARatingSubmitted: true }
            ],
            status: 'completed',
            ratingStatus: 'both_submitted'
        })
        .populate('fromUser', 'name profilePhoto')
        .populate('toUser', 'name profilePhoto')
        .sort({ ratingsVisibleAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

        const formattedReviews = reviews.map(review => {
            let reviewer, rating, comment;
            if (review.fromUser._id.toString() === user._id.toString()) {
                // User was the fromUser, so toUser rated them
                reviewer = review.toUser;
                rating = review.userBRating.rating;
                comment = review.userBRating.comment;
            } else {
                // User was the toUser, so fromUser rated them
                reviewer = review.fromUser;
                rating = review.userARating.rating;
                comment = review.userARating.comment;
            }
            return {
                id: review._id,
                reviewer: {
                    id: reviewer._id,
                    name: reviewer.name,
                    profilePhoto: reviewer.profilePhoto
                },
                rating,
                comment,
                reviewedAt: review.ratingsVisibleAt,
                skillExchanged: review.skillOffered || review.skillRequested
            };
        });

        const total = await SwapRequest.countDocuments({
            $or: [
                { fromUser: user._id, userBRatingSubmitted: true },
                { toUser: user._id, userARatingSubmitted: true }
            ],
            status: 'completed',
            ratingStatus: 'both_submitted'
        });

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    profilePhoto: user.profilePhoto,
                    bio: user.bio,
                    location: user.location,
                    averageRating: user.averageRating,
                    totalRatings: user.totalRatings,
                    completedSwaps: user.completedSwaps
                },
                reviews: formattedReviews,
                totalPages: Math.ceil(total / limit),
                currentPage: parseInt(page),
                totalReviews: total
            }
        });

    } catch (error) {
        console.error('Error getting user reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting user reviews'
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    googleAuth,
    getAllUsers,
    getUserById,
    searchUsers,
    getUsersBySkills,
    getUsersByLocation,
    getUsersStats,
    getMySkills,
    getAllUsersWithRatings,
    getUserReviews
};