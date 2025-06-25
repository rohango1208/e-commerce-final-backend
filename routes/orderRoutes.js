const express = require('express');
const router = express.Router();
const {
  getOrdersByUser,
  getOrderItems,
  placeOrder
} = require('../controllers/orderController');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 */

/**
 * @swagger
 * /orders/{userId}:
 *   get:
 *     summary: Get all orders placed by a user
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of orders
 *       500:
 *         description: Error fetching orders
 */
router.get('/:userId', getOrdersByUser);

/**
 * @swagger
 * /orders/items/{orderId}:
 *   get:
 *     summary: Get items of a specific order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: List of order items
 *       500:
 *         description: Error fetching order items
 */
router.get('/items/:orderId', getOrderItems);

/**
 * @swagger
 * /orders/{userId}:
 *   post:
 *     summary: Place an order for a user
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Address
 *               - PaymentMethod
 *             properties:
 *               Address:
 *                 type: string
 *                 example: 123 Street, City
 *               PaymentMethod:
 *                 type: string
 *                 example: COD
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Cart not found or empty
 *       500:
 *         description: Error placing order
 */
router.post('/:userId', placeOrder);

module.exports = router;
