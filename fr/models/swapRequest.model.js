const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    
    // Skills being exchanged
    skillOffered: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 50,
    },
    skillRequested: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 50,
    },
    
    // Optional message from requester
    message: {
        type: String,
        maxlength: 500,
        default: '',
    },
    
    // Status tracking
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
        default: 'pending',
    },
    
    // Rating status for dual submission system
    ratingStatus: {
        type: String,
        enum: ['not_available', 'waiting_both', 'both_submitted', 'visible'],
        default: 'not_available',
    },
    
    // Track which user has submitted rating
    userARatingSubmitted: {
        type: Boolean,
        default: false,
    },
    userBRatingSubmitted: {
        type: Boolean,
        default: false,
    },
    
    // Rating submission timestamps
    ratingSubmittedAt: {
        userA: {
            type: Date,
            default: null,
        },
        userB: {
            type: Date,
            default: null,
        },
    },
    
    // User A's rating for User B
    userARating: {
        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: null,
        },
        comment: {
            type: String,
            maxlength: 500,
            default: '',
        },
    },
    
    // User B's rating for User A
    userBRating: {
        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: null,
        },
        comment: {
            type: String,
            maxlength: 500,
            default: '',
        },
    },
    
    // When both ratings became visible
    ratingsVisibleAt: {
        type: Date,
        default: null,
    },
    
    // Timestamps for different actions
    requestedAt: {
        type: Date,
        default: Date.now,
    },
    respondedAt: {
        type: Date,
        default: null,
    },
    completedAt: {
        type: Date,
        default: null,
    },
    
    // Response details
    responseMessage: {
        type: String,
        maxlength: 500,
        default: '',
    },
    
    // Flagging System
    flagStatus: {
        type: String,
        enum: ['active', 'disabled', 'under_review'],
        default: 'active',
    },
    flagReason: {
        type: String,
        default: '',
        maxlength: 500,
    },
    flaggedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    flaggedAt: {
        type: Date,
        default: null,
    },
    reviewNotes: {
        type: String,
        default: '',
        maxlength: 1000,
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    reviewedAt: {
        type: Date,
        default: null,
    },
    
    expiresAt: {
        type: Date,
        default: function() {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 7); // 7 days
            return expiryDate;
        },
    },

}, {
    timestamps: true
});

const SwapRequest = mongoose.model('SwapRequest', swapRequestSchema);
module.exports = SwapRequest; 