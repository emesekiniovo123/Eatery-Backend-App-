const fs = require('node:fs');
const path = require('node:path');
const {
  createLogger,
  format,
  transports,
} = require('winston');

// =====================================
// Log Directory
// =====================================
const logDir = path.join(__dirname, '..', '..', 'logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// =====================================
// Environment
// =====================================
const isProduction = process.env.NODE_ENV === 'production';

// =====================================
// Logger
// =====================================
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',

  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),

  defaultMeta: {
    service: 'food-ordering-api',
  },

  transports: [
    new transports.Console({
      format: isProduction
        ? format.combine(
            format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            format.json()
          )
        : format.combine(
            format.colorize(),
            format.timestamp({
              format: 'HH:mm:ss',
            }),
            format.printf(
              ({ timestamp, level, message, stack }) =>
                stack
                  ? `${timestamp} ${level}: ${message}\n${stack}`
                  : `${timestamp} ${level}: ${message}`
            )
          ),
    }),

    new transports.File({
      filename: path.join(logDir, 'combined.log'),
      level: 'info',
    }),

    new transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
  ],

  exitOnError: false,
});

// =====================================
// Morgan Stream
// =====================================
logger.stream = {
  write(message) {
    logger.info(message.trim());
  },
};

// =====================================
// Exception Handling
// =====================================
logger.exceptions.handle(
  new transports.File({
    filename: path.join(logDir, 'exceptions.log'),
  })
);

// =====================================
// Unhandled Promise Rejections
// =====================================
logger.rejections.handle(
  new transports.File({
    filename: path.join(logDir, 'rejections.log'),
  })
);

// =====================================
// Export Logger
// =====================================
module.exports = logger;

