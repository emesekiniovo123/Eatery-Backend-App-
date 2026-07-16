const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');

const startServer = async () => {
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  return server;
};

test('GET /health returns a healthy API response', async () => {
  const server = await startServer();
  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/health`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.success, true);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
});

test('POST /api/auth/signup returns validation errors for invalid input', async () => {
  const server = await startServer();
  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'not-an-email', password: '123' }),
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.ok(body.errors);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
});
