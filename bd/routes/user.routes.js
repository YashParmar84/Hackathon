const express = require('express');
const router = express.Router();
const { requireUserAuth } = require('../middleware/auth.middleware');
const { 
    getAllUsers, 
    getUserById, 
    searchUsers, 
    getUsersBySkills, 
    getUsersStats, 
    getUsersByLocation,
    getMySkills,
    getAllUsersWithRatings,
    getUserReviews
} = require('../controller/user.controller');

router.get('/', getAllUsers);

router.get('/search', searchUsers);

router.get('/skills', getUsersBySkills);

router.get('/location', getUsersByLocation);

router.get('/stats', getUsersStats);

router.get('/with-ratings', getAllUsersWithRatings);

router.get('/:userId/reviews', getUserReviews);

router.get('/my-skills', requireUserAuth, getMySkills);

router.get('/:userId', getUserById);



module.exports = router; 