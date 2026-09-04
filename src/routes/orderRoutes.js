const express = require('express');
const router = express.Router();

const {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');

const {
  createOrderValidation,
  updateOrderStatusValidation,
} = require('../validators/order');

const { validate, rejectUnknownFields } = require('../middleware/validate');
const { protect, authorizeRoles } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Customer order management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       required:
 *         - foodId
 *         - quantity
 *       properties:
 *         foodId:
 *           type: string
 *           example: 6870ab12cd34ef5678901234
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *
 *     CreateOrder:
 *       type: object
 *       required:
 *         - paymentMethod
 *       properties:
 *         deliveryAddress:
 *           type: string
 *           example: 15 Admiralty Way, Lekki, Lagos
 *         paymentMethod:
 *           type: string
 *           enum:
 *             - cash_on_delivery
 *             - stripe
 *             - paypal
 *           example: cash_on_delivery
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     description: Creates a new order from the authenticated user's shopping cart.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrder'
 *     responses:
 *       201:
 *         description: Order created successfully.
 *       400:
 *         description: Validation error or cart is empty.
 *       401:
 *         description: Authentication required.
 */
router.post(
  '/',
  protect,
  rejectUnknownFields(['deliveryAddress', 'paymentMethod']),
  createOrderValidation,
  validate,
  createOrder
);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get orders
 *     description: Returns all orders belonging to the authenticated user. Administrators receive every order.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully.
 *       401:
 *         description: Authentication required.
 */
router.get(
  '/',
  protect,
  authorizeRoles('admin'),
  getOrders
);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     description: Returns a single order. Customers can only access their own orders, while administrators can access any order.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *           example: 6870ab12cd34ef5678901234
 *     responses:
 *       200:
 *         description: Order retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Access denied.
 *       404:
 *         description: Order not found.
 */

/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Get my orders
 *     description: Returns all orders belonging to the authenticated user.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User orders retrieved successfully.
 *       401:
 *         description: Authentication required.
 */
router.get(
  '/my-orders',
  protect,
  getMyOrders
);
router.get(
  '/:id',
  protect,
  getOrderById
);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status
 *     description: Updates the status of an order. Only administrators can perform this action.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *           example: 6870ab12cd34ef5678901234
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - Pending
 *                   - Preparing
 *                   - Out for Delivery
 *                   - Delivered
 *                   - Cancelled
 *                 example: Delivered
 *     responses:
 *       200:
 *         description: Order status updated successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Administrator access required.
 *       404:
 *         description: Order not found.
 */
router.put(
  '/:id/status',
  protect,
  authorizeRoles('admin'),
  rejectUnknownFields(['status']),
  updateOrderStatusValidation,
  validate,
  updateOrderStatus
);


/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     description: Updates the status of an order. Only administrators can perform this action.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *           example: 6870ab12cd34ef5678901234
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - Pending
 *                   - Preparing
 *                   - Out for Delivery
 *                   - Delivered
 *                   - Cancelled
 *                 example: Delivered
 *     responses:
 *       200:
 *         description: Order status updated successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Administrator access required.
 *       404:
 *         description: Order not found.
 */
router.patch(
  '/:id/status',
  protect,
  authorizeRoles('admin'),
  rejectUnknownFields(['status']),
  updateOrderStatusValidation,
  validate,
  updateOrderStatus
);


/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     description: Permanently deletes an order. Only administrators can perform this action.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *           example: 6870ab12cd34ef5678901234
 *     responses:
 *       200:
 *         description: Order deleted successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Administrator access required.
 *       404:
 *         description: Order not found.
 */
router.delete(
  '/:id',
  protect,
  authorizeRoles('admin'),
  deleteOrder
);

module.exports = router;


