//I imported mongoose: ValidationError handling  
const mongoose = require('mongoose');

// =====================================
// 404 Not Found Middleware
// =====================================
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// =====================================
// Global Error Handler:All errorrs in the application will be forward here. 
// =====================================
const errorHandler = (err, req, res, next) => {

  //Set default status code & message if error has no status code 
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';

  // =====================================
  // Mongoose Validation Error
  // =====================================
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(', ');
  }

  // =====================================
  // Invalid MongoDB ObjectId
  // =====================================
  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = 'Invalid resource ID';
  }

  // =============================================
  // Duplicate Key Error E.g email already exists
  // =============================================
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // =====================================
  // JWT Errors
  // =====================================
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired';
  }

  // =====================================
  // Response
  // =====================================
  const response = {
    success: false,
    message,
    errors: [],
  };

  if (err.errors && Array.isArray(err.errors)) {
    response.errors = err.errors;
  } else if (err instanceof mongoose.Error.ValidationError) {
    response.errors = Object.values(err.errors).map((validationError) => ({
      field: validationError.path,
      message: validationError.message,
    }));
  }

  // Include stack trace only in development
  const isProduction = ['production', 'prod'].includes(
    (process.env.NODE_ENV || '').toLowerCase()
  );

  if (!isProduction) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = {
  notFound,
  errorHandler,
};