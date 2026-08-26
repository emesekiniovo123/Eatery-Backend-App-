const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const request = require('supertest');

const upload = require('../src/middleware/upload');
const { errorHandler } = require('../src/middleware/errorHandler');

const createUploadApp = () => {
  const app = express();

  app.post('/upload', upload.single('image'), (req, res) => {
    res.status(201).json({ success: true });
  });
  app.use(errorHandler);

  return app;
};

test('accepts an image below the maximum upload size', async () => {
  const response = await request(createUploadApp())
    .post('/upload')
    .attach('image', Buffer.alloc(1024), {
      filename: 'food.png',
      contentType: 'image/png',
    });

  assert.equal(response.status, 201);
  assert.equal(response.body.success, true);
});

test('rejects an image above the maximum upload size', async () => {
  const response = await request(createUploadApp())
    .post('/upload')
    .attach('image', Buffer.alloc(25 * 1024 * 1024 + 1), {
      filename: 'food.png',
      contentType: 'image/png',
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.equal(
    response.body.message,
    'Image file is too large. Maximum allowed size is 25 MiB.'
  );
});