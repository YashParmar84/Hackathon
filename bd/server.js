const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDb = require('./config/db');
const mailSender = require('./utils/mailSender');
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const adminRoutes = require('./routes/admin.routes');
const userRoutes = require('./routes/user.routes');
const swapRequestRoutes = require('./routes/swapRequest.routes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use('/api/v1/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/v1/uploads/profiles', express.static(path.join(__dirname, 'uploads/profiles')));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/swap-requests', swapRequestRoutes);

app.get('/api/v1/test', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running successfully!'
    });
});

connectDb();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
