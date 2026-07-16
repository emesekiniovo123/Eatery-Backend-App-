
const express = require('express');

const router = express.Router();

const {
  signup,
  login,
  getProfile,
  updateProfile,
} = require('../controllers/authController');

const {
  signupValidation,
  loginValidation,
  profileUpdateValidation,
} = require('../validators/auth');

const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');

// =====================================
// Swagger Tags
// =====================================

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and profile management
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new customer account.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Validation failed.
 *       409:
 *         description: Email already exists.
 *       500:
 *         description: Internal server error.
 */
router.post(
  '/signup',
  signupValidation,
  validate,
  signup
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates a user and returns a JWT token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Invalid email or password.
 *       500:
 *         description: Internal server error.
 */
router.post(
  '/login',
  loginValidation,
  validate,
  login
);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get current user's profile
 *     description: Returns the authenticated user's profile.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       500:
 *         description: Internal server error.
 */
router.get(
  '/profile',
  protect,
  getProfile
);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update current user's profile
 *     description: Updates the authenticated user's profile information.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               phone:
 *                 type: string
 *                 example: "+2348012345678"
 *               address:
 *                 type: string
 *                 example: 12 Broad Street, Lagos
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Authentication required.
 *       500:
 *         description: Internal server error.
 */
router.put(
  '/profile',
  protect,
  profileUpdateValidation,
  validate,
  updateProfile
);

// =====================================
// Export Router
// =====================================

module.exports = router;


