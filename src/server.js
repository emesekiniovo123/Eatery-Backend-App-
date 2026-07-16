require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 8000;

(async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
})(); 