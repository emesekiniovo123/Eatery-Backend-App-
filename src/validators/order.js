const { body } = require('express-validator');

const createOrderValidation = [
  body('deliveryAddress').optional().trim().isLength({ min: 1, max: 300 }).withMessage('Delivery address must not be empty'),
  body('paymentMethod').optional().isIn(['cash_on_delivery', 'stripe', 'paypal']),
];

const updateOrderStatusValidation = [
  body('status').isIn(['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled']).withMessage('Invalid order status'),
];

module.exports = { createOrderValidation, updateOrderStatusValidation };
