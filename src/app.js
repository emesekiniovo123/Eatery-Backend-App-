require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000').split(',').map((origin) => origin.trim());

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('CORS not allowed'));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// HTTP request logging - send morgan output into Winston in non-test environments
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: logger.stream }));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));



app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Eatery API is running',
    docs: '/api/docs',
    health: '/health',
  });
});
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy and working.',
    data: { status: 'ok' },
  });
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
