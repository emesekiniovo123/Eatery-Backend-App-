
const express = require('express');

const router = express.Router();

// =====================================
// Authentication Routes
// =====================================
router.use('/auth', require('./authRoutes'));

// =====================================
// Menu Routes
// =====================================
router.use('/menu', require('./menuRoutes'));

// =====================================
// Shopping Cart Routes
// =====================================
router.use('/cart', require('./cartRoutes'));

// =====================================
// Order Routes
// =====================================
router.use('/orders', require('./orderRoutes'));

// =====================================
// Review Routes
// =====================================
router.use('/reviews', require('./reviewRoutes'));

// =====================================
// Favorite Routes
// =====================================
router.use('/favorites', require('./favoriteRoutes'));

// =====================================
// Admin Routes
// =====================================
router.use('/admin', require('./adminRoutes'));

// =====================================
// Export Router
// =====================================
module.exports = router;


