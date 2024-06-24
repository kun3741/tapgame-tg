const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.get('/user/:telegramId', async (req, res) => {
    const telegramId = req.params.telegramId;
    try {
        const user = await User.findOne({ telegramId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
