const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Ensure you have set MONGODB_URI in your .env file
const CONNECTION_URI = process.env.MONGODB_URI;

if (!CONNECTION_URI) {
  console.error('Error: MONGODB_URI is not defined in your environment variables.');
  process.exit(1);
}

console.log('Connecting to MongoDB:', CONNECTION_URI);

// Mongoose v7+ no longer requires options like useNewUrlParser or useUnifiedTopology
mongoose.connect(CONNECTION_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

module.exports = mongoose; // Export mongoose directly, not as an object
