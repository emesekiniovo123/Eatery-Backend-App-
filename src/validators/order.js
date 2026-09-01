const { body } = require('express-validator');

const createOrderValidation = [
  body('deliveryAddress')
    .exists({ checkFalsy: true })
    .withMessage('Delivery address is required')
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage('Delivery address must not be empty'),

  body('phone')
    .exists({ checkFalsy: true })
    .withMessage('Phone number is required')
    .trim()
    .isLength({ min: 7, max: 30 })
    .withMessage('Phone number must be between 7 and 30 characters'),

  body('paymentMethod')
    .exists({ checkFalsy: true })
    .withMessage('Payment method is required')
    .isIn(['cash_on_delivery', 'stripe', 'paypal'])
    .withMessage('Invalid payment method'),
];

const updateOrderStatusValidation = [
  body('status').isIn(['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled']).withMessage('Invalid order status'),
];

module.exports = { createOrderValidation, updateOrderStatusValidation };
