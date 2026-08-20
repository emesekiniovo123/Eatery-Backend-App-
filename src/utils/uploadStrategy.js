const fs = require('fs');
const path = require('path');

const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

const getUploadMode = () => {
  const mode = (process.env.UPLOAD_MODE || 'cloudinary').trim().toLowerCase();
  return ['local', 'cloudinary', 'auto'].includes(mode) ? mode : 'cloudinary';
};

const isAllowedImage = (file) => {
  if (!file) return false;

  const mimeOk = allowedMimeTypes.includes(file.mimetype || '');
  const extOk = allowedExtensions.includes(
    path.extname(file.originalname || '').toLowerCase()
  );

  return mimeOk || extOk;
};

const ensureLocalUploadDirectory = () => {
  const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'food');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  return uploadDir;
};

const saveLocalImage = async (file) => {
  if (file.filename) {
    return `/uploads/food/${file.filename}`;
  }

  const uploadDir = ensureLocalUploadDirectory();
  const originalName = file.originalname || 'upload.jpg';
  const fileName = `${Date.now()}-${originalName.replace(/\s+/g, '-')}`;
  const filePath = path.join(uploadDir, fileName);

  await fs.promises.writeFile(filePath, file.buffer);

  return `/uploads/food/${fileName}`;
};

const uploadCloudinaryImage = async (file) => {
  const uploadToCloudinary = require('./uploadToCloudinary');
  const result = await uploadToCloudinary(file.buffer);
  return result.secure_url;
};

const resolveImageSource = async (req) => {
  const mode = getUploadMode();

  if (req.file && mode === 'local') {
    return saveLocalImage(req.file);
  }

  if (req.file && mode === 'cloudinary') {
    return uploadCloudinaryImage(req.file);
  }

  if (req.file && mode === 'auto') {
    try {
      return await uploadCloudinaryImage(req.file);
    } catch (error) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error(
          `Cloudinary upload failed in production: ${error.message}. Configure valid Cloudinary credentials or set UPLOAD_MODE=local.`
        );
      }

      console.warn(`Cloudinary upload failed; saving image locally: ${error.message}`);
      return saveLocalImage(req.file);
    }
  }

  if (req.body?.image) {
    return req.body.image;
  }

  return '';
};

module.exports = {
  getUploadMode,
  isAllowedImage,
  ensureLocalUploadDirectory,
  resolveImageSource,
  allowedMimeTypes,
  allowedExtensions,
};
