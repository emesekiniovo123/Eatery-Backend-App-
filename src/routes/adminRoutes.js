
const express = require('express');

const router = express.Router();

const { getDashboard } = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middleware/auth');

// =====================================
// Swagger Tags
// =====================================

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Administrator management endpoints
 */

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get Admin Dashboard
 *     description: Retrieve dashboard statistics available only to administrators.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Dashboard fetched successfully
 *                 data:
 *                   type: object
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Access denied.
 *       500:
 *         description: Internal server error.
 */

// =====================================
// Admin Routes
// =====================================

router.get(
  '/dashboard',
  protect,
  authorizeRoles('admin'),
  getDashboard
);

// =====================================
// Export Router
// =====================================

module.exports = router;


