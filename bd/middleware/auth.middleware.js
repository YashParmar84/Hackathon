const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token is required'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

const requireEmailVerification = (req, res, next) => {
    if (!req.user.emailVerified) {
        return res.status(403).json({
            success: false,
            message: 'Email verification required'
        });
    }
    next();
};

const requireUserAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token is required'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        


        const user = await User.findById(decoded.userId).select('-password');
        
        console.log(user)

        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }



        // Check if user is active
        if (user.status !== 'active') {
            return res.status(401).json({
                success: false,
                message: 'Account is disabled. Please contact support.'
            });
        }

        // Check if email is verified
        if (!user.emailVerified) {
            return res.status(403).json({
                success: false,
                message: 'Email verification required'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('User auth middleware error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

const requireAdminAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token is required'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user is active
        if (user.status !== 'active') {
            return res.status(401).json({
                success: false,
                message: 'Account is disabled. Please contact support.'
            });
        }

        // Check if user is admin
        if (user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Admin auth middleware error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};



module.exports = {
    authenticateToken,
    requireEmailVerification,
    requireUserAuth,
    requireAdminAuth
}; 