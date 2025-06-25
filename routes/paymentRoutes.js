const express = require('express');
const router = express.Router();
const { getPaymentDetails, addPayment } = require('../controllers/paymentController');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment processing and retrieval
 */

/**
 * @swagger
 * /payment/{orderId}:
 *   get:
 *     summary: Get payment details for an order
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the order
 *     responses:
 *       200:
 *         description: Payment details retrieved
 *       500:
 *         description: Error fetching payment
 */
router.get('/:orderId', getPaymentDetails);

/**
 * @swagger
 * /payment/{orderId}:
 *   post:
 *     summary: Record a new payment for an order
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Amount
 *               - Method
 *               - Status
 *             properties:
 *               Amount:
 *                 type: number
 *                 format: float
 *                 example: 299.99
 *               Method:
 *                 type: string
 *                 example: Credit Card
 *               Status:
 *                 type: string
 *                 example: Completed
 *     responses:
 *       200:
 *         description: Payment recorded
 *       500:
 *         description: Error adding payment
 */
router.post('/:orderId', addPayment);

module.exports = router;
