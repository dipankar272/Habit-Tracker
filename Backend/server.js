const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const habitRoutes = require('./routes/habitRoutes');
require('dotenv').config();

// Initialize database (creates tables if they don't exist)
require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

const corsOptions = {
  origin: ['https://habit-tracker-blush.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use('/api/auth/', userRoutes);
app.use('/api/habits', habitRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Habit Tracker Backend!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database: SQLite (local file)`);
});