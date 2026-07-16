const { body } = require('express-validator');

const reviewValidation = [
  body('foodId').notEmpty().withMessage('Food ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim(),
];

module.exports = { reviewValidation };
