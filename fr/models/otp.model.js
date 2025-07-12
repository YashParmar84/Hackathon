const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    otp: {
        type: String,
        required: true,
        length: 6,
    },
    isUsed: {
        type: Boolean,
        default: false,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true
});

// Index for automatic cleanup of expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.model('OTP', otpSchema);
module.exports = OTP; 