const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

router.post('/', async (req, res) => {
    const { telegramId, coins, coinsPerTap, maxEnergy, energy } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { telegramId },
            { coins, coinsPerTap, maxEnergy, energy, lastEnergyUpdate: Date.now() },
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
