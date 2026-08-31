const express = require('express');
const router = express.Router();

const {
  getProfile,
  updateProfile,
  changePassword,
} = require('../controllers/authController');
const { getUsers } = require('../controllers/adminController');

const {
  profileUpdateValidation,
  changePasswordValidation,
} = require('../validators/auth');

const { validate, rejectUnknownFields } = require('../middleware/validate');
const { protect, authorizeRoles } = require('../middleware/auth');

router.get('/', protect, authorizeRoles('admin'), getUsers);
router.get('/profile', protect, getProfile);
router.put(
  '/profile',
  protect,
  rejectUnknownFields(['fullName', 'phone', 'address']),
  profileUpdateValidation,
  validate,
  updateProfile
);
router.put(
  '/change-password',
  protect,
  rejectUnknownFields(['currentPassword', 'newPassword']),
  changePasswordValidation,
  validate,
  changePassword
);

module.exports = router;
