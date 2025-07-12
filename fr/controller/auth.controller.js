const User = require('../models/user.model');
const OTP = require('../models/otp.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { mailSender } = require('../utils/mailSender');

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (req, res) => {
    try {

        console.log("sendOTP")  

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await OTP.deleteMany({ email: email.toLowerCase() });

        const newOTP = new OTP({
            email: email.toLowerCase(),
            otp: otp,
            expiresAt: expiresAt
        });
        await newOTP.save();

        const emailBody = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Email Verification</h2>
                <p>Your verification code is:</p>
                <h1 style="color: #007bff; font-size: 32px; text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">${otp}</h1>
                <p>This code will expire in 10 minutes.</p>
                <p>If you didn't request this code, please ignore this email.</p>
            </div>
        `;

        try {
            await mailSender(email, 'Email Verification Code', emailBody);
        } catch (error) {
            console.log(error);
        }

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully to your email'
        });

    } catch (error) {
        console.log(error)
        console.error('Error sending OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending OTP'
        });
    }
};

const verifyOTPAndRegister = async (req, res) => {
    try {
        const { email, otp, name, password } = req.body;

        if (!email || !otp || !name || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email, OTP, name, and password are required'
            });
        }

        // Find the OTP
        const otpRecord = await OTP.findOne({
            email: email.toLowerCase(),
            otp: otp,
            isUsed: false,
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUser = new User({
            name: name,
            email: email.toLowerCase(),
            password: hashedPassword,
            emailVerified: true,
            otpVerified: true
        });

        await newUser.save();

        // Mark OTP as used
        otpRecord.isUsed = true;
        await otpRecord.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    emailVerified: newUser.emailVerified,
                    otpVerified: newUser.otpVerified
                },
                token: token
            }
        });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering user'
        });
    }
};

const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Generate new OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Delete any existing OTP for this email
        await OTP.deleteMany({ email: email.toLowerCase() });

        // Save new OTP
        const newOTP = new OTP({
            email: email.toLowerCase(),
            otp: otp,
            expiresAt: expiresAt
        });
        await newOTP.save();

        // Send OTP via email
        const emailBody = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Email Verification</h2>
                <p>Your new verification code is:</p>
                <h1 style="color: #007bff; font-size: 32px; text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">${otp}</h1>
                <p>This code will expire in 10 minutes.</p>
                <p>If you didn't request this code, please ignore this email.</p>
            </div>
        `;

        await mailSender(email, 'Email Verification OTP', emailBody);

        res.status(200).json({
            success: true,
            message: 'New OTP sent successfully to your email'
        });

    } catch (error) {
        console.error('Error resending OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Error resending OTP'
        });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        if (user.status !== 'active') {
            return res.status(401).json({
                success: false,
                message: 'Account is disabled. Please contact support.'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        user.lastActive = new Date();
        await user.save();

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    otpVerified: user.otpVerified,
                    isAdmin: user.role === 'admin' ? true : false
                },
                token: token
            }
        });

    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in'
        });
    }
};

module.exports = {
    sendOTP,
    verifyOTPAndRegister,
    resendOTP,
    login
}; 