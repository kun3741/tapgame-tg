const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.static('public'));
app.use(express.json());

// Підключення до MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

mongoose.connection.on('error', err => {
    console.error(`Mongoose connection error: ${err}`);
});

// Імпорт моделей
const User = require('./models/User');

// Маршрути
app.use('/api', require('./api/routes/user'));
app.use('/api', require('./api/routes/update'));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Маршрут для отримання користувача
app.get('/api/routes/user/:telegramId', async (req, res) => {
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

// Маршрут для оновлення користувача
app.post('/api/routes/update', async (req, res) => {
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

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    next();
});

app.use(cors());



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
