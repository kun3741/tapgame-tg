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

app.use(cors());



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
