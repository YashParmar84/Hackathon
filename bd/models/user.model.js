const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId; 
        },
        minlength: 6,
    },
    googleId: {
        type: String,
        default: null,
    },
    
    profilePhoto: {
        type: String,
        default: null,
    },
    bio: {
        type: String,
        maxlength: 500,
        default: '',
    },
    location: {
        type: String,
        default: '',
        maxlength: 100,
    },
    
    skillsOffered: [{
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 50,
    }],
    skillsWanted: [{
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 50,
    }],
    
    availability: [{
        type: String,
        enum: ['weekdays', 'weekends', 'evenings', 'mornings', 'afternoons'],
    }],
    
    isPublic: {
        type: Boolean,
        default: true,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    otpVerified: {
        type: Boolean,
        default: false,
    },
    
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    
    status: {
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
    
    totalSwaps: {
        type: Number,
        default: 0,
    },
    completedSwaps: {
        type: Number,
        default: 0,
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    totalRatings: {
        type: Number,
        default: 0,
    },
    lastActive: {
        type: Date,
        default: Date.now,
    },
    joinDate: {
        type: Date,
        default: Date.now,
    },
    emailNotifications: {
        type: Boolean,
        default: true,
    },
    pushNotifications: {
        type: Boolean,
        default: true,
    },
    
    currentBalance: {
        type: Number,
        default: 0,
    },

}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
