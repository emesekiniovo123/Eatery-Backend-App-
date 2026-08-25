
const express = require('express');

const router = express.Router();

const {
  getMenu,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
} = require('../controllers/menuController');

const {
  foodValidation,
  menuQueryValidation,
} = require('../validators/menu');

const { validate, rejectUnknownFields } = require('../middleware/validate');
const { protect, authorizeRoles } = require('../middleware/auth');
const upload = require('../middleware/upload');

// =====================================
// Swagger Tags
// =====================================

/**
 * @swagger
 * tags:
 *   - name: Menu
 *     description: Food menu management endpoints
 */

/**
 * @swagger
 * /api/menu:
 *   get:
 *     summary: Get Menu
 *     description: Retrieve all menu items with optional filtering, searching, sorting and pagination.
 *     tags: [Menu]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search food by name.
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category.
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Filter available foods.
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: number
 *         description: Minimum price.
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: number
 *         description: Maximum price.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - rating
 *             - newest
 *             - price-asc
 *             - price-desc
 *         description: Sort menu items.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *     responses:
 *       200:
 *         description: Menu retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Invalid query parameters.
 *       500:
 *         description: Internal server error.
 */
router.get(
  '/',
  menuQueryValidation,
  validate,
  getMenu
);

/**
 * @swagger
 * /api/menu/{id}:
 *   get:
 *     summary: Get Food By ID
 *     description: Retrieve a single menu item.
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Food ID.
 *     responses:
 *       200:
 *         description: Food retrieved successfully.
 *       400:
 *         description: Invalid food ID.
 *       404:
 *         description: Food not found.
 *       500:
 *         description: Internal server error.
 */
router.get(
  '/:id',
  getFoodById
);

/**
 * @swagger
 * /api/menu:
 *   post:
 *     summary: Create Food
 *     description: Create a new menu item (Admin only).
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               available:
 *                 type: boolean
 *               preparationTime:
 *                 type: integer
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Food created successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       500:
 *         description: Internal server error.
 */
router.post(
  '/',
  protect,
  authorizeRoles('admin'),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'secondaryImage', maxCount: 1 },
  ]),
  rejectUnknownFields([
    'name',
    'description',
    'category',
    'price',
    'available',
    'isAvailable',
    'ingredients',
    'preparationTime',
    'ratings',
    'image',
    'secondaryImage',
  ]),
  foodValidation,
  validate,
  createFood
);

/**
 * @swagger
 * /api/menu/{id}:
 *   put:
 *     summary: Update Food
 *     description: Update an existing menu item (Admin only).
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Food ID.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               available:
 *                 type: boolean
 *               preparationTime:
 *                 type: integer
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Food updated successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Food not found.
 *       500:
 *         description: Internal server error.
 */
router.put(
  '/:id',
  protect,
  authorizeRoles('admin'),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'secondaryImage', maxCount: 1 },
  ]),
  rejectUnknownFields([
    'name',
    'description',
    'category',
    'price',
    'available',
    'isAvailable',
    'ingredients',
    'preparationTime',
    'ratings',
    'image',
    'secondaryImage',
  ]),
  foodValidation,
  validate,
  updateFood
);

/**
 * @swagger
 * /api/menu/{id}:
 *   delete:
 *     summary: Delete Food
 *     description: Delete a menu item (Admin only).
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Food ID.
 *     responses:
 *       200:
 *         description: Food deleted successfully.
 *       400:
 *         description: Invalid food ID.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Food not found.
 *       500:
 *         description: Internal server error.
 */
router.delete(
  '/:id',
  protect,
  authorizeRoles('admin'),
  deleteFood
);

// =====================================
// Export Router
// =====================================

module.exports = router;