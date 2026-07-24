// const fs = require('node:fs');
// const path = require('node:path');
// const {
//   createLogger,
//   format,
//   transports,
// } = require('winston');

// // =====================================
// // Log Directory
// // =====================================
// const logDir = path.join(__dirname, '..', '..', 'logs');

// if (!fs.existsSync(logDir)) {
//   fs.mkdirSync(logDir, { recursive: true });
// }

// // =====================================
// // Environment
// // =====================================
// const isProduction = process.env.NODE_ENV === 'production';

// // =====================================
// // Logger
// // =====================================
// const logger = createLogger({
//   level: process.env.LOG_LEVEL || 'info',

//   format: format.combine(
//     format.timestamp({
//       format: 'YYYY-MM-DD HH:mm:ss',
//     }),
//     format.errors({ stack: true }),
//     format.splat(),
//     format.json()
//   ),

//   defaultMeta: {
//     service: 'food-ordering-api',
//   },

//   transports: [
//     new transports.Console({
//       format: isProduction
//         ? format.combine(
//             format.timestamp({
//               format: 'YYYY-MM-DD HH:mm:ss',
//             }),
//             format.json()
//           )
//         : format.combine(
//             format.colorize(),
//             format.timestamp({
//               format: 'HH:mm:ss',
//             }),
//             format.printf(
//               ({ timestamp, level, message, stack }) =>
//                 stack
//                   ? `${timestamp} ${level}: ${message}\n${stack}`
//                   : `${timestamp} ${level}: ${message}`
//             )
//           ),
//     }),

//     new transports.File({
//       filename: path.join(logDir, 'combined.log'),
//       level: 'info',
//     }),

//     new transports.File({
//       filename: path.join(logDir, 'error.log'),
//       level: 'error',
//     }),
//   ],

//   exitOnError: false,
// });

// // =====================================
// // Morgan Stream
// // =====================================
// logger.stream = {
//   write(message) {
//     logger.info(message.trim());
//   },
// };

// // =====================================
// // Exception Handling
// // =====================================
// logger.exceptions.handle(
//   new transports.File({
//     filename: path.join(logDir, 'exceptions.log'),
//   })
// );

// // =====================================
// // Unhandled Promise Rejections
// // =====================================
// logger.rejections.handle(
//   new transports.File({
//     filename: path.join(logDir, 'rejections.log'),
//   })
// );

// // =====================================
// // Export Logger
// // =====================================
// module.exports = logger;






// ...existing code...
const fs = require('node:fs');
const path = require('node:path');
const { createLogger, format, transports } = require('winston');

const logDir = path.join(__dirname, '..', '..', 'logs');

try {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
} catch (e) {
  // avoid crashing at require-time
  // eslint-disable-next-line no-console
  console.error('Logger: failed to create log directory, continuing with console-only logging:', e.message);
}

const isProduction = process.env.NODE_ENV === 'production';

let logger;
try {
  logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.errors({ stack: true }),
      format.splat(),
      format.json()
    ),
    defaultMeta: { service: 'food-ordering-api' },
    transports: [
      new transports.Console({
        format: isProduction
          ? format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), format.json())
          : format.combine(
              format.colorize(),
              format.timestamp({ format: 'HH:mm:ss' }),
              format.printf(({ timestamp, level, message, stack }) =>
                stack ? `${timestamp} ${level}: ${message}\n${stack}` : `${timestamp} ${level}: ${message}`
              )
            ),
      }),
      ...(fs.existsSync(logDir)
        ? [
            new transports.File({ filename: path.join(logDir, 'combined.log'), level: 'info' }),
            new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
          ]
        : []),
    ],
    exitOnError: false,
  });

  logger.stream = { write(message) { logger.info(message.trim()); } };

  try {
    if (fs.existsSync(logDir)) {
      logger.exceptions.handle(new transports.File({ filename: path.join(logDir, 'exceptions.log') }));
      logger.rejections.handle(new transports.File({ filename: path.join(logDir, 'rejections.log') }));
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Logger: failed to attach exception/rejection handlers:', err.message);
  }
} catch (err) {
  // fallback to console-only logger if winston fails
  // eslint-disable-next-line no-console
  console.error('Logger init failed, using console fallback:', err.message);
  logger = {
    info: console.log.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    stream: { write: (msg) => console.log(msg.trim()) },
  };
}

module.exports = logger;
// ...existing code...