const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { isAllowedImage } = require('../utils/uploadStrategy');

const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'food');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!isAllowedImage(file)) {
    return cb(
      new Error(
        'Only JPG, JPEG, PNG, WEBP, and GIF image files are allowed.'
      )
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 12 * 1024 * 1024,
    files: 2,
  },
});

module.exports = upload;
// //fs for creating & managing folders
// const fs = require('node:fs');
// //path for handling file paths
// const path = require('node:path');
// //crypto for generating unique filenames
// const crypto = require('node:crypto');
// //multer for handling file uploads in Express
// const multer = require('multer');

// // =====================================
// // Upload Directory
// // =====================================
// const uploadDir = path.join(__dirname, '..', '..', 'uploads');
// //recursive: true allows Node.js to create missing parent folders automatically
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // =====================================
// // Allowed Image Types
// // =====================================
// const allowedMimeTypes = [
//   'image/jpeg',
//   'image/jpg',
//   'image/png',
//   'image/webp',
//   'image/gif',
// ];

// // ========================================================================
// // Storage Configuration:multer.diskStorage() for image storage on server
// // ========================================================================
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, uploadDir);
//   },

//   filename(req, file, cb) {
//     const extension = path.extname(file.originalname).toLowerCase() || '.jpg';

//     const filename = `${Date.now()}-${crypto.randomUUID()}${extension}`;

//     cb(null, filename);
//   },
// });

// // =====================================
// // File Filter
// // =====================================
// const fileFilter = (req, file, cb) => {
//   if (!allowedMimeTypes.includes(file.mimetype)) {
//     return cb(
//       new Error(
//         'Only JPG, JPEG, PNG, WEBP, and GIF image files are allowed.'
//       )
//     );
//   }

//   cb(null, true);
// };

// // =====================================
// // Upload Middleware
// // =====================================
// const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 2 * 1024 * 1024, // 2 MB
//     files: 1, // One image per request
//   },
// });

// module.exports = upload;