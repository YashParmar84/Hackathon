const validateEmail = (email) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    return password && password.length >= 6;
};

const validateName = (name) => {
    return name && name.trim().length > 0 && name.trim().length <= 100;
};

const validateOTP = (otp) => {
    return otp && otp.length === 6 && /^\d{6}$/.test(otp);
};

const validateSendOTP = (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email is required'
        });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please enter a valid email address'
        });
    }

    next();
};

const validateRegister = (req, res, next) => {
    const { email, otp, name, password } = req.body;

    if (!email || !otp || !name || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email, OTP, name, and password are required'
        });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please enter a valid email address'
        });
    }

    if (!validateOTP(otp)) {
        return res.status(400).json({
            success: false,
            message: 'Please enter a valid 6-digit OTP'
        });
    }

    if (!validateName(name)) {
        return res.status(400).json({
            success: false,
            message: 'Name is required and must be between 1 and 100 characters'
        });
    }

    if (!validatePassword(password)) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters long'
        });
    }

    next();
};

const validateResendOTP = (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email is required'
        });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please enter a valid email address'
        });
    }

    next();
};

module.exports = {
    validateSendOTP,
    validateRegister,
    validateResendOTP
}; 