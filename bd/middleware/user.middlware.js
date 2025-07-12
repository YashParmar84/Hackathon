const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const isAuthenticated = async (req, res, next) => {
    const SECRET_KEY = process.env.JWT_SECRET;

    const authHeader = req.headers.authorization || req.body.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decode = jwt.verify(token, SECRET_KEY);
        
        
        // Get user from database
        const user = await User.findById(decode.userId).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = isAuthenticated;