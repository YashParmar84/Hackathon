const express = require('express');
const router = express.Router();
const { 
    updateProfile, 
    uploadProfilePhoto, 
    getProfile, 
    getPublicProfile,
    upload 
} = require('../controller/profile.controller');
const { requireUserAuth } = require('../middleware/auth.middleware');
const { validateProfileUpdate } = require('../middleware/profile.validation');

router.get('/me', requireUserAuth, getProfile);

router.put('/update', requireUserAuth, validateProfileUpdate, updateProfile);

router.post('/upload-photo', requireUserAuth, upload.single('profilePhoto'), uploadProfilePhoto);

router.get('/public/:userId', getPublicProfile);

module.exports = router; 