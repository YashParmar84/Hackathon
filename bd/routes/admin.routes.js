const express = require('express');
const router = express.Router();
const { requireAdminAuth } = require('../middleware/auth.middleware');
const { 
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
} = require('../controller/admin.controller');

router.get('/users', requireAdminAuth, getAllUsers);

router.get('/users/:userId', requireAdminAuth, getUserById);

router.put('/users/:userId/status', requireAdminAuth, updateUserStatus);

router.put('/users/:userId/review-notes', requireAdminAuth, addReviewNotes);

router.get('/dashboard/stats', requireAdminAuth, getDashboardStats);

router.delete('/users/:userId/skills', requireAdminAuth, rejectSkillDescription);

router.post('/users/:userId/ban', requireAdminAuth, banUser);

router.get('/flagged-users', requireAdminAuth, getFlaggedUsers);

router.get('/swaps', requireAdminAuth, monitorSwaps);

router.post('/platform-message', requireAdminAuth, sendPlatformMessageAdmin);

router.get('/reports', requireAdminAuth, generateReport);

module.exports = router; 