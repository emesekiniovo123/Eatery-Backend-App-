const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    logger.warn('MONGO_URI not set. Starting without a database connection.');
    return null;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
      maxPoolSize: 10,
      socketTimeoutMS: 45000,
      family: 4,
    });

    logger.info('MongoDB connected');
    return mongoose.connection;
  } catch (error) {
    logger.error('MongoDB connection failed: %s', error.message);
    throw error;
  }
};

module.exports = connectDB;
