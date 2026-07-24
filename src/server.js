// require('dotenv').config();

// const app = require('./app');
// const connectDB = require('./config/db');
// const logger = require('./utils/logger');

// const PORT = process.env.PORT || 8000;

// (async () => {
//   try {
//     await connectDB();

//     app.listen(PORT, () => {
//       logger.info(`Server is running on http://localhost:${PORT}`);
//     });
//   } catch (error) {
//     logger.error(error);
//     process.exit(1);
//   }
// })(); 







require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 8000;

console.log('server.js loaded');
console.log('MONGO_URI present:', !!process.env.MONGO_URI);

(async () => {
  try {
    console.log('connecting to MongoDB...');
    await connectDB();
    console.log('connectDB finished');

    if (!app || typeof app.listen !== 'function') {
      throw new Error('app is not an Express app or app.listen is missing');
    }

    const server = app.listen(PORT, () => {
      console.log(`Server is listening on http://localhost:${PORT}`);
    });

    server.on('error', (error) => {
      console.error('Server error:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('Startup failed:', error.stack || error.message);
    process.exit(1);
  }
})();

