const normalizeImageUrl = (imageValue) => {
  if (!imageValue) return '';

  if (/^https?:\/\//i.test(imageValue)) {
    return imageValue;
  }

  const baseUrl = (process.env.PUBLIC_BASE_URL || '').replace(/\/$/, '');

  if (!baseUrl) {
    return imageValue;
  }

  if (imageValue.startsWith('/')) {
    return `${baseUrl}${imageValue}`;
  }

  return `${baseUrl}/${imageValue}`;
};

module.exports = {
  normalizeImageUrl,
};
