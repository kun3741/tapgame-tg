const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
    },
    maxEnergy: { 
        type: Number, 
        default: 10 
    },
    energy: { 
        type: Number, 
        default: 10 
    },
    lastEnergyUpdate: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('User', userSchema);
