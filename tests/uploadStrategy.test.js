const test = require('node:test');
const assert = require('node:assert/strict');

const {
  getUploadMode,
  resolveImageSource,
} = require('../src/utils/uploadStrategy');

test('getUploadMode defaults to cloudinary when not configured', () => {
  const previous = process.env.UPLOAD_MODE;
  delete process.env.UPLOAD_MODE;

  try {
    assert.equal(getUploadMode(), 'cloudinary');
  } finally {
    if (previous === undefined) {
      delete process.env.UPLOAD_MODE;
    } else {
      process.env.UPLOAD_MODE = previous;
    }
  }
});

test('resolveImageSource returns a local upload URL when local mode is enabled', async () => {
  const previous = process.env.UPLOAD_MODE;
  process.env.UPLOAD_MODE = 'local';

  try {
    const result = await resolveImageSource({
      file: {
        filename: 'food-123.jpg',
      },
    });

    assert.equal(result, '/uploads/food/food-123.jpg');
  } finally {
    if (previous === undefined) {
      delete process.env.UPLOAD_MODE;
    } else {
      process.env.UPLOAD_MODE = previous;
    }
  }
});
