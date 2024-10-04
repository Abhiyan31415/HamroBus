const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); 
const cors = require('cors');
const dotenv = require('dotenv');
const busRoutes = require('./routes/busRoutes'); // Importing bus routes

// Initialize express and dotenv
const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'client','c-index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Login.html'));
});
// Serve search.html
app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','client', 'Search.html'));
});

// API Routes
app.use('/api', busRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.log('MongoDB connection error:', error));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
