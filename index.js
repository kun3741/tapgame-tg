const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
const User = require('./models/User');

dotenv.config();

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(cors());

// Підключення до MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

mongoose.connection.on('error', err => {
    console.error(`Mongoose connection error: ${err}`);
});

// Маршрути
app.use('/api/user', require('./api/routes/user'));
app.use('/api/update', require('./api/routes/update'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

// Запуск Telegram бота
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id.toString();
    try {
        console.log(`Received /start command from chatId: ${chatId}`);
        const user = await User.findOneAndUpdate(
            { telegramId: chatId },
            { telegramId: chatId },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        console.log(`User ${chatId} upserted successfully`);

        bot.sendMessage(chatId, 'Almost nothing, maybe.', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Play', web_app: { url: `${process.env.WEB_APP_URL}/index.html?telegramId=${user.telegramId}` } }],
                ]
            }
        });
    } catch (error) {
        console.error('Error during /start command:', error);
    }
});

console.log('Bot started');
