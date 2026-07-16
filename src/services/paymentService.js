
const crypto = require('node:crypto');

// =====================================
// Supported Payment Methods
// =====================================
const PAYMENT_METHODS = Object.freeze({
  stripe: {
    key: 'stripe',
    gateway: 'Stripe',
  },

  paypal: {
    key: 'paypal',
    gateway: 'PayPal',
  },

  cash_on_delivery: {
    key: 'cash_on_delivery',
    gateway: 'Cash on Delivery',
  },
});

// =====================================
// Normalize Payment Method
// =====================================
const normalizePaymentMethod = (paymentMethod) => {
  if (typeof paymentMethod !== 'string') {
    return null;
  }

  const method = paymentMethod.trim().toLowerCase();

  switch (method) {
    case 'stripe':
      return PAYMENT_METHODS.stripe;

    case 'paypal':
      return PAYMENT_METHODS.paypal;

    case 'cash_on_delivery':
    case 'cashondelivery':
    case 'cash-on-delivery':
    case 'cod':
      return PAYMENT_METHODS.cash_on_delivery;

    default:
      return null;
  }
};

// =====================================
// Generate Payment Reference
// =====================================
const generateReference = (prefix) => {
  return `${prefix}_${Date.now()}_${crypto.randomUUID()}`;
};

// =====================================
// Process Payment
// =====================================
const processPayment = (
  paymentMethod = 'cash_on_delivery',
  total = 0
) => {
  const amount = Number(total);

  if (!Number.isFinite(amount) || amount < 0) {
    return {
      success: false,
      status: 'Failed',
      gateway: null,
      paymentMethod: null,
      reference: null,
      amount: 0,
      message: 'Invalid payment amount',
    };
  }

  const method = normalizePaymentMethod(paymentMethod);

  if (!method) {
    return {
      success: false,
      status: 'Failed',
      gateway: null,
      paymentMethod: null,
      reference: null,
      amount,
      message: 'Unsupported payment method',
    };
  }

  return {
    success: true,
    status: method.key === 'cash_on_delivery' ? 'Pending' : 'Pending',
    gateway: method.gateway,
    paymentMethod: method.key,
    reference: generateReference(method.key),
    amount: Number(amount.toFixed(2)),
    currency: 'USD',
    message: 'Payment initiated successfully',
  };
};

module.exports = {
  processPayment,
};