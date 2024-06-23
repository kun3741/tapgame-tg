const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    telegramId: {
        type: String,
        required: true,
        unique: true
    },
    coins: {
        type: Number,
        default: 0
    },
    upgradeLevel: {
        type: Number,
        default: 1
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;