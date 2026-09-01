const test = require('node:test');
const assert = require('node:assert/strict');
const { rejectUnknownFields } = require('../src/middleware/validate');
const { processPayment } = require('../src/services/paymentService');

test('request contract rejects unexpected fields', () => {
  let statusCode;
  let payload;
  let nextCalled = false;
  const middleware = rejectUnknownFields(['email', 'password']);

  middleware(
    { body: { email: 'user@example.com', password: 'secret', role: 'admin' } },
    {
      status(code) {
        statusCode = code;
        return this;
      },
      json(body) {
        payload = body;
      },
    },
    () => {
      nextCalled = true;
    }
  );

  assert.equal(statusCode, 400);
  assert.equal(payload.message, 'Unexpected request fields');
  assert.deepEqual(payload.fields, ['role']);
  assert.equal(nextCalled, false);
});

test('order request contract accepts checkout payload fields', () => {
  let nextCalled = false;
  const middleware = rejectUnknownFields(['deliveryAddress', 'phone', 'paymentMethod']);

  middleware(
    {
      body: {
        deliveryAddress: 'Lagos, Nigeria',
        phone: '+2348143276154',
        paymentMethod: 'cash_on_delivery',
      },
    },
    {
      status() {
        return this;
      },
      json() {},
    },
    () => {
      nextCalled = true;
    }
  );

  assert.equal(nextCalled, true);
});

test('payment contract accepts only documented methods', () => {
  for (const method of ['cash_on_delivery', 'stripe', 'paypal']) {
    const payment = processPayment(method, 25);
    assert.equal(payment.success, true);
    assert.equal(payment.paymentMethod, method);
  }

  assert.equal(processPayment('card', 25).success, false);
  assert.equal(processPayment('mobile_money', 25).success, false);
});
