const mongoose = require('mongoose');

// Set strict query mode before connecting
mongoose.set('strictQuery', false);

// Environment check
if (!process.env.MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in environment variables');
    process.exit(1);
}

const CONNECTION_URI = process.env.MONGODB_URI;
console.log('Connecting to MongoDB:', CONNECTION_URI);

// Configure mongoose
mongoose.Promise = global.Promise;

// Connect with better error handling
mongoose.connect(CONNECTION_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit on connection failure
    });

// Handle connection events
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected. Attempting to reconnect...');
});

module.exports = mongoose;
