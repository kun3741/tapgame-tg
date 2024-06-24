const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.post('/update', async (req, res) => {
    const { telegramId, coins, upgradeLevel } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { telegramId },
            { coins, upgradeLevel },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
