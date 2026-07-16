const test = require('node:test');
const assert = require('node:assert/strict');
const { processPayment } = require('../src/services/paymentService');

test('processPayment returns pending payment details for supported gateways', () => {
  const payment = processPayment('stripe', 30);

  assert.equal(payment.status, 'Pending');
  assert.equal(payment.gateway, 'Stripe');
  assert.match(payment.reference, /^stripe_/);
  assert.equal(payment.amount, 30);
});

test('processPayment rejects invalid totals and unsupported methods', () => {
  const payment = processPayment('bank_transfer', -1);

  assert.equal(payment.status, 'Failed');
  assert.equal(payment.gateway, 'Validation Error');
  assert.equal(payment.message, 'Invalid total amount');
});
