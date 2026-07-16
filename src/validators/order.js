const { body } = require('express-validator');

const createOrderValidation = [
  body('deliveryAddress').trim().notEmpty().withMessage('Delivery address is required'),
  body('paymentMethod').optional().isIn(['cash_on_delivery', 'stripe', 'paypal']),
];

const updateOrderStatusValidation = [
  body('status').isIn(['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled']).withMessage('Invalid order status'),
];

module.exports = { createOrderValidation, updateOrderStatusValidation };
