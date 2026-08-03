
const mongoose = require('mongoose');
const logger = require('../utils/logger');

require('dotenv').config();

const DEFAULT_OPTIONS = {
  serverSelectionTimeoutMS: 10000,
  autoIndex: true,
  maxPoolSize: 10,
  socketTimeoutMS: 45000,
  family: 4,
};

async function connectWithRetry(uri, options, retries = 3, delayMs = 2000) {
  let lastErr;

  for (let i = 0; i <= retries; i++) {
    try {
      logger.info('Attempting MongoDB connection (attempt %d)...', i + 1);

      await mongoose.connect(uri, options);

      logger.info('MongoDB connected');
      return mongoose.connection;
    } catch (err) {
      lastErr = err;

      logger.error(
        'MongoDB connection attempt %d failed: %s',
        i + 1,
        err.message
      );

      if (i < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastErr;
}

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    logger.warn('MONGO_URI not set. Starting without a database connection.');
    return null;
  }

  if (!/^mongodb(\+srv)?:\/\//i.test(uri)) {
    logger.error(
      'Invalid MONGO_URI scheme. It must start with "mongodb://" or "mongodb+srv://".'
    );
    throw new Error('Invalid MONGO_URI scheme');
  }

  try {
    mongoose.set('strictQuery', false);

    const connection = await connectWithRetry(
      uri,
      DEFAULT_OPTIONS,
      4,
      3000
    );

    return connection;
  } catch (error) {
    logger.error(
      'MongoDB connection failed: %s',
      error.stack || error.message
    );
    throw error;
  }
};

module.exports = connectDB;