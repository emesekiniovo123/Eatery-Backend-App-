const { body } = require('express-validator');

const createOrderValidation = [
  body('deliveryAddress')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage('Delivery address must not be empty'),

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
