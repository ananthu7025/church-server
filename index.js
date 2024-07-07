const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Apply CORS middleware
const corsOptions = {
    origin: 'http://localhost:3000',  // Allow requests from this origin
    credentials: true,                // Enable CORS credentials
};
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Apply your routes
app.use('/api', routes);

const PORT = process.env.PORT || 3003;

mongoose.connect('mongodb://127.0.0.1:27017/church_directory', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
});

mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
