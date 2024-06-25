const express = require('express');
const User = require('../../models/User');

const router = express.Router();

router.get('/:telegramId', async (req, res, next) => {
    const telegramId = req.params.telegramId;
    console.log(`Fetching data for user with telegramId: ${telegramId}`);
    try {
        const user = await User.findOne({ telegramId });
        if (!user) {
            console.log(`User with telegramId: ${telegramId} not found. Creating new user.`);
            user = new User({ telegramId });
            await user.save();
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        next(error); 
    }
});

module.exports = router;
