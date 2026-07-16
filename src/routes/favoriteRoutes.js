
const express = require('express');

const router = express.Router();

const {
  getFavorites,
  addFavorite,
  removeFavorite,
} = require('../controllers/favoriteController');

const { protect } = require('../middleware/auth');

// =====================================
// Swagger Tags
// =====================================

/**
 * @swagger
 * tags:
 *   - name: Favorites
 *     description: Manage authenticated user's favorite food items
 */

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Get Favorite Foods
 *     description: Retrieve all favorite food items for the authenticated user.
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Favorite foods retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       401:
 *         description: Authentication required.
 *       500:
 *         description: Internal server error.
 */
router.get(
  '/',
  protect,
  getFavorites
);

/**
 * @swagger
 * /api/favorites/{foodId}:
 *   post:
 *     summary: Add Food to Favorites
 *     description: Add a food item to the authenticated user's favorites.
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: foodId
 *         required: true
 *         description: Food ID.
 *         schema:
 *           type: string
 *           example: "6870ab12cd34ef5678901234"
 *     responses:
 *       201:
 *         description: Food added to favorites successfully.
 *       400:
 *         description: Invalid food ID.
 *       401:
 *         description: Authentication required.
 *       404:
 *         description: Food not found.
 *       409:
 *         description: Food already exists in favorites.
 *       500:
 *         description: Internal server error.
 */
router.post(
  '/:foodId',
  protect,
  addFavorite
);

/**
 * @swagger
 * /api/favorites/{foodId}:
 *   delete:
 *     summary: Remove Food from Favorites
 *     description: Remove a food item from the authenticated user's favorites.
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: foodId
 *         required: true
 *         description: Food ID.
 *         schema:
 *           type: string
 *           example: "6870ab12cd34ef5678901234"
 *     responses:
 *       200:
 *         description: Food removed from favorites successfully.
 *       400:
 *         description: Invalid food ID.
 *       401:
 *         description: Authentication required.
 *       404:
 *         description: Food not found in favorites.
 *       500:
 *         description: Internal server error.
 */
router.delete(
  '/:foodId',
  protect,
  removeFavorite
);

// =====================================
// Export Router
// =====================================

module.exports = router;



