const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    telegramId: {
        type: String,
        required: true,
        unique: true
    },
    coins: {
        type: Number,
        default: 0
    },
    coinsPerTap: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model('User', UserSchema);
