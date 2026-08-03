const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeImageUrl } = require('../src/utils/imageUrl');

test('normalizeImageUrl converts relative uploads paths to absolute URLs when a public base URL is configured', () => {
  const originalBaseUrl = process.env.PUBLIC_BASE_URL;
  process.env.PUBLIC_BASE_URL = 'https://api.eatery.example';

  try {
    assert.equal(
      normalizeImageUrl('/uploads/abc.jpg'),
      'https://api.eatery.example/uploads/abc.jpg'
    );
  } finally {
    if (originalBaseUrl === undefined) {
      delete process.env.PUBLIC_BASE_URL;
    } else {
      process.env.PUBLIC_BASE_URL = originalBaseUrl;
    }
  }
});

test('normalizeImageUrl leaves already absolute URLs unchanged', () => {
  const originalBaseUrl = process.env.PUBLIC_BASE_URL;
  delete process.env.PUBLIC_BASE_URL;

  try {
    const absoluteUrl = 'https://api.eatery.example/uploads/abc.jpg';
    assert.equal(normalizeImageUrl(absoluteUrl), absoluteUrl);
  } finally {
    if (originalBaseUrl === undefined) {
      delete process.env.PUBLIC_BASE_URL;
    } else {
      process.env.PUBLIC_BASE_URL = originalBaseUrl;
    }
  }
});
