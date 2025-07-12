const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTPAndRegister, resendOTP, login } = require('../controller/auth.controller');
const { validateSendOTP, validateRegister, validateResendOTP } = require('../middleware/validation.middleware');

router.post('/send-otp', validateSendOTP, sendOTP);

router.post('/verify-otp-register', validateRegister, verifyOTPAndRegister);

router.post('/resend-otp', validateResendOTP, resendOTP);

router.post('/login', login);

module.exports = router; 