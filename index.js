const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const TelegramBot = require('node-telegram-bot-api');
const User = require('./models/User');
const { Types: { ObjectId } } = mongoose;

dotenv.config();

const app = express();
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

app.use(express.static('public'));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

    bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id.toString();
        try {
            const user = await User.findOneAndUpdate(
                { telegramId: chatId },
                { telegramId: chatId },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
    
            bot.sendMessage(chatId, 'Welcome to NotCoin! Click the button below to start tapping or view your profile.', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Play Tap Game', web_app: { url: `${process.env.WEB_APP_URL}/index.html?telegramId=${user.telegramId}` } }],
                        [{ text: 'View Profile', url: `${process.env.WEB_APP_URL}/profileView.html?telegramId=${user.telegramId}` }]
                    ]
                }
            });
        } catch (error) {
            console.error('Error during /start command:', error);
        }
    });
    



app.get('/user/:telegramId', async (req, res) => {
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

app.post('/update', async (req, res) => {
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



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
