const mongoose = require('mongoose');

const blockedTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    blockedAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true
});

// Index for automatic cleanup of expired tokens
blockedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const BlockedToken = mongoose.model('BlockedToken', blockedTokenSchema);
module.exports = BlockedToken; 