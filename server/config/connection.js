const mongoose = require('mongoose');
const env = require('./env');

async function connectDatabase() {
  try {
    // Check if MONGODB_URL exists
    if (!env.MONGODB_URL) {
      throw new Error('MongoDB URL is not defined in environment variables');
    }

    // Connection options for better stability
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      maxPoolSize: 10, // Maintain up to 10 socket connections
    };

    // Attempt connection
    await mongoose.connect(env.MONGODB_URL, options);
    console.log('✅ MongoDB connected successfully');

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    // Optionally, you might want to throw the error to handle it in the calling code
    throw error;
  }
}

module.exports = connectDatabase;
