const express = require('express');
const User = require('../../models/User');

const router = express.Router();

router.get('/:telegramId', async (req, res, next) => {
    const telegramId = req.params.telegramId;
    console.log(`Fetching data for user with telegramId: ${telegramId}`);
    try {
        let user = await User.findOne({ telegramId });
        if (!user) {
            console.log(`User with telegramId: ${telegramId} not found. Creating new user.`);
            user = new User({ telegramId });
            await user.save();
        } else {
            // Calculate energy regeneration
            const now = Date.now();
            const lastUpdate = new Date(user.lastEnergyUpdate).getTime();
            const timeDiff = now - lastUpdate; // in milliseconds
            const energyToRegenerate = Math.floor(timeDiff / 3000); // 3 seconds per energy point
            user.energy = Math.min(user.maxEnergy, user.energy + energyToRegenerate);
            user.lastEnergyUpdate = new Date(now - (timeDiff % 3000)); // update the last update time to account for the remainder
            await user.save();
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        next(error); 
    }
});

module.exports = router;
