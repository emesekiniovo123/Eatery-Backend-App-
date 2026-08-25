
const { validationResult } = require('express-validator');

const rejectUnknownFields = (allowedFields) => (req, res, next) => {
  const unknownFields = Object.keys(req.body || {}).filter(
    (field) => !allowedFields.includes(field)
  );

  if (unknownFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Unexpected request fields',
      fields: unknownFields,
    });
  }

  return next();
};

// =====================================
// Validation Middleware
// =====================================
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const formattedErrors = errors.array().map((error) => ({
    field: error.path || error.param,
    message: error.msg,
    location: error.location,
    value: error.value,
  }));

  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors: formattedErrors,
  });
};

module.exports = {
  validate,
  rejectUnknownFields,
};

