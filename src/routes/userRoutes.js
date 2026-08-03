const express = require('express');
const router = express.Router();

const {
  getProfile,
  updateProfile,
} = require('../controllers/authController');

const {
  profileUpdateValidation,
} = require('../validators/auth');

const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, profileUpdateValidation, validate, updateProfile);

module.exports = router;
