const express = require('express');
const User = require('../../models/User');

const router = express.Router();

router.post('/update', async (req, res, next) => {
    const { telegramId, coins, upgradeLevel } = req.body;
    console.log(`Updating user with telegramId: ${telegramId}, coins: ${coins}, upgradeLevel: ${upgradeLevel}`);
    try {
        const user = await User.findOneAndUpdate(
            { telegramId },
            { coins, upgradeLevel },
            { new: true }
        );
        if (!user) {
            console.log(`User with telegramId: ${telegramId} not found`);
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error updating user data:', error);
        next(error); 
    }
});

module.exports = router;
