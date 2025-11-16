const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Essential production options
      serverSelectionTimeoutMS: 30000, // Increase to 30 seconds
      socketTimeoutMS: 45000, // Increase socket timeout
      maxPoolSize: 10, // Limit connection pool size
      minPoolSize: 1, // Minimum connections to maintain
      
      // MongoDB driver options
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
      // Retry settings
      retryWrites: true,
      retryReads: true,
      
      // Write concern
      w: 'majority'
    });

    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    // More detailed error logging
    if (error.name === 'MongooseServerSelectionError') {
      console.error('Server selection error - check your connection string and network access');
    } else if (error.name === 'MongoTimeoutError') {
      console.error('Connection timeout - check your IP whitelisting and database availability');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;