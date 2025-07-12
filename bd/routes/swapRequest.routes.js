const express = require('express');
const router = express.Router();
const { 
    sendSwapRequest,
    getMyRequests,
    acceptSwapRequest,
    rejectSwapRequest,
    cancelSwapRequest,
    completeSwapRequest,
    getSwapRequest,
    addSwapRatingReview
} = require('../controller/swapRequest.controller');
const { requireUserAuth } = require('../middleware/auth.middleware');

router.post('/send', requireUserAuth, sendSwapRequest);

router.get('/my-requests', requireUserAuth, getMyRequests);

router.get('/:requestId', requireUserAuth, getSwapRequest);

router.put('/:requestId/accept', requireUserAuth, acceptSwapRequest);

router.put('/:requestId/reject', requireUserAuth, rejectSwapRequest);

router.put('/:requestId/cancel', requireUserAuth, cancelSwapRequest);

router.put('/:requestId/complete', requireUserAuth, completeSwapRequest);

router.post('/:requestId/rate', requireUserAuth, addSwapRatingReview);

module.exports = router; 