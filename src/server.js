
require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = Number(process.env.PORT) || 8000;

if (!process.env.JWT_SECRET) {
  console.error('Startup failed: JWT_SECRET must be configured');
  process.exit(1);
}

(async () => {
  try {
    await connectDB();

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

