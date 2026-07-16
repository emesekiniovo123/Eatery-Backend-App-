
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const multer = require('multer');

// =====================================
// Upload Directory
// =====================================
const uploadDir = path.join(__dirname, '..', '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// =====================================
// Allowed Image Types
// =====================================
const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

// =====================================
// Storage Configuration
// =====================================
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },

  filename(req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase() || '.jpg';

    const filename = `${Date.now()}-${crypto.randomUUID()}${extension}`;

    cb(null, filename);
  },
});

// =====================================
// File Filter
// =====================================
const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new Error(
        'Only JPG, JPEG, PNG, WEBP, and GIF image files are allowed.'
      )
    );
  }

  cb(null, true);
};

// =====================================
// Upload Middleware
// =====================================
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB
    files: 1, // One image per request
  },
});

module.exports = upload;