
const express = require('express');

const router = express.Router();

const {
  getCart,
  addToCart,
  updateCart,
  removeItem,
  clearCart,
} = require('../controllers/cartController');

const {
  addToCartValidation,
  updateCartValidation,
} = require('../validators/cart');

const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');

// =====================================
// Swagger Tags
// =====================================

/**
 * @swagger
 * tags:
 *   - name: Cart
 *     description: Shopping cart management endpoints
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get User Cart
 *     description: Retrieve all items in the authenticated user's shopping cart.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully.
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
  getCart
);

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add Item to Cart
 *     description: Add a food item to the authenticated user's shopping cart.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - foodId
 *               - quantity
 *             properties:
 *               foodId:
 *                 type: string
 *                 example: "6870ab12cd34ef5678901234"
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *     responses:
 *       201:
 *         description: Item added successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Authentication required.
 *       404:
 *         description: Food item not found.
 *       500:
 *         description: Internal server error.
 */
router.post(
  '/add',
  protect,
  addToCartValidation,
  validate,
  addToCart
);

/**
 * @swagger
 * /api/cart/update:
 *   put:
 *     summary: Update Cart Item
 *     description: Update the quantity of a food item already in the cart.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - foodId
 *               - quantity
 *             properties:
 *               foodId:
 *                 type: string
 *                 example: "6870ab12cd34ef5678901234"
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart updated successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Authentication required.
 *       404:
 *         description: Cart item not found.
 *       500:
 *         description: Internal server error.
 */
router.put(
  '/update',
  protect,
  updateCartValidation,
  validate,
  updateCart
);

/**
 * @swagger
 * /api/cart/remove/{foodId}:
 *   delete:
 *     summary: Remove Item from Cart
 *     description: Remove a food item from the authenticated user's shopping cart.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: foodId
 *         required: true
 *         schema:
 *           type: string
 *         description: Food ID.
 *     responses:
 *       200:
 *         description: Item removed successfully.
 *       401:
 *         description: Authentication required.
 *       404:
 *         description: Item not found.
 *       500:
 *         description: Internal server error.
 */
router.delete(
  '/remove/:foodId',
  protect,
  removeItem
);

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Clear Cart
 *     description: Remove all items from the authenticated user's shopping cart.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully.
 *       401:
 *         description: Authentication required.
 *       500:
 *         description: Internal server error.
 */
router.delete(
  '/clear',
  protect,
  clearCart
);

// =====================================
// Export Router
// =====================================

module.exports = router;
