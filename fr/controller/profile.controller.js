const User = require('../models/user.model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/profiles';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

const generateImageUrl = (req, filePath) => {
    if (!filePath) return null;
    if (filePath.startsWith('http')) return filePath;
    
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return `${baseUrl}/api/v1/${filePath.replace(/\\/g, '/')}`;
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const {
            name,
            bio,
            location,
            skillsOffered,
            skillsWanted,
            availability,
            isPublic
        } = req.body;

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (name) user.name = name;
        if (bio !== undefined) user.bio = bio;
        if (location !== undefined) user.location = location;
        if (isPublic !== undefined) user.isPublic = isPublic;

        if (skillsOffered) {
            user.skillsOffered = Array.isArray(skillsOffered) 
                ? skillsOffered.filter(skill => skill.trim() !== '')
                : [];
        }

        if (skillsWanted) {
            user.skillsWanted = Array.isArray(skillsWanted) 
                ? skillsWanted.filter(skill => skill.trim() !== '')
                : [];
        }

        if (availability) {
            user.availability = Array.isArray(availability) 
                ? availability.filter(avail => ['weekdays', 'weekends', 'evenings', 'mornings', 'afternoons'].includes(avail))
                : [];
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    bio: user.bio,
                    location: user.location,
                    profilePhoto: generateImageUrl(req, user.profilePhoto),
                    skillsOffered: user.skillsOffered,
                    skillsWanted: user.skillsWanted,
                    availability: user.availability,
                    isPublic: user.isPublic,
                    emailVerified: user.emailVerified,
                    otpVerified: user.otpVerified
                }
            }
        });

    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile'
        });
    }
};

const uploadProfilePhoto = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image file'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.profilePhoto && fs.existsSync(user.profilePhoto)) {
            fs.unlinkSync(user.profilePhoto);
        }

        const imageUrl = generateImageUrl(req, req.file.path);

        user.profilePhoto = imageUrl;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile photo uploaded successfully',
            data: {
                profilePhoto: user.profilePhoto
            }
        });

    } catch (error) {
        console.error('Error uploading profile photo:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading profile photo'
        });
    }
};

// Get user profile
const getProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    bio: user.bio,
                    location: user.location,
                    profilePhoto: generateImageUrl(req, user.profilePhoto),
                    skillsOffered: user.skillsOffered,
                    skillsWanted: user.skillsWanted,
                    availability: user.availability,
                    isPublic: user.isPublic,
                    emailVerified: user.emailVerified,
                    otpVerified: user.otpVerified,
                    totalSwaps: user.totalSwaps,
                    completedSwaps: user.completedSwaps,
                    averageRating: user.averageRating,
                    totalRatings: user.totalRatings,
                    joinDate: user.joinDate,
                    lastActive: user.lastActive
                }
            }
        });

    } catch (error) {
        console.error('Error getting profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting profile'
        });
    }
};

// Get public profile by user ID
const getPublicProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select('-password -email -googleId');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.isPublic) {
            return res.status(403).json({
                success: false,
                message: 'Profile is private'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    bio: user.bio,
                    location: user.location,
                    profilePhoto: generateImageUrl(req, user.profilePhoto),
                    skillsOffered: user.skillsOffered,
                    skillsWanted: user.skillsWanted,
                    availability: user.availability,
                    totalSwaps: user.totalSwaps,
                    completedSwaps: user.completedSwaps,
                    averageRating: user.averageRating,
                    totalRatings: user.totalRatings,
                    joinDate: user.joinDate
                }
            }
        });

    } catch (error) {
        console.error('Error getting public profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting public profile'
        });
    }
};

module.exports = {
    updateProfile,
    uploadProfilePhoto,
    getProfile,
    getPublicProfile,
    upload
}; 