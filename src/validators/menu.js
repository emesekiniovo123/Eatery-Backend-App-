const { body, query } = require('express-validator');

const foodValidation = [
  body('name').trim().notEmpty().withMessage('Food name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('description').optional().trim(),
  body('ingredients').optional().isArray(),
  body('preparationTime').optional().isInt({ min: 1 }),
];

const menuQueryValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('priceMin').optional().isFloat({ min: 0 }),
  query('priceMax').optional().isFloat({ min: 0 }),
  query('sort').optional().isIn(['price', 'rating', 'newest', 'price-asc', 'price-desc']),
];

module.exports = { foodValidation, menuQueryValidation };
