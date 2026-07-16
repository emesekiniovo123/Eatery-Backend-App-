const express = require('express');
const router = express.Router();

const {
  createReview,
  getReviewsByFood,
  deleteReview,
} = require('../controllers/reviewController');

const { reviewValidation } = require('../validators/review');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Food review management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateReview:
 *       type: object
 *       required:
 *         - foodId
 *         - rating
 *       properties:
 *         foodId:
 *           type: string
 *           example: 6870ab12cd34ef5678901234
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *         comment:
 *           type: string
 *           example: The food was delicious and arrived hot.
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a review
 *     description: Allows an authenticated user to review a food item that has been delivered. A user can only review a food once.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReview'
 *     responses:
 *       201:
 *         description: Review created successfully.
 *       400:
 *         description: Validation error or invalid food ID.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: User has not purchased or received this food.
 *       404:
 *         description: Food not found.
 *       409:
 *         description: User has already reviewed this food.
 */
router.post(
  '/',
  protect,
  reviewValidation,
  validate,
  createReview
);

/**
 * @swagger
 * /api/reviews/{foodId}:
 *   get:
 *     summary: Get reviews for a food item
 *     description: Returns all reviews for the specified food item, ordered by newest first.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: foodId
 *         required: true
 *         description: Food ID.
 *         schema:
 *           type: string
 *           example: 6870ab12cd34ef5678901234
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully.
 *       400:
 *         description: Invalid food ID.
 *       404:
 *         description: Food not found.
 */
router.get(
  '/:foodId',
  getReviewsByFood
);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     description: Deletes a review created by the authenticated user or by an administrator.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Review ID.
 *         schema:
 *           type: string
 *           example: 6870ab12cd34ef5678905678
 *     responses:
 *       200:
 *         description: Review deleted successfully.
 *       400:
 *         description: Invalid review ID.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Access denied.
 *       404:
 *         description: Review not found.
 */
router.delete(
  '/:id',
  protect,
  deleteReview
);

module.exports = router;

