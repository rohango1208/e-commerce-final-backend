const express = require('express');
const router = express.Router();
const {
  getTrackingInfo,
  addTrackingInfo,
  updateTrackingStatus
} = require('../controllers/trackingController');

/**
 * @swagger
 * tags:
 *   name: Tracking
 *   description: Order tracking management
 */

/**
 * @swagger
 * /tracking/{orderId}:
 *   get:
 *     summary: Get tracking information for an order
 *     tags: [Tracking]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID to fetch tracking for
 *     responses:
 *       200:
 *         description: Tracking info retrieved
 *       404:
 *         description: No tracking info found
 *       500:
 *         description: Error fetching tracking info
 */
router.get('/:orderId', getTrackingInfo);

/**
 * @swagger
 * /tracking/{orderId}:
 *   post:
 *     summary: Add tracking information for an order
 *     tags: [Tracking]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID to associate tracking info with
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Status
 *               - Location
 *             properties:
 *               Status:
 *                 type: string
 *                 example: "Shipped"
 *               Location:
 *                 type: string
 *                 example: "Delhi Warehouse"
 *     responses:
 *       201:
 *         description: Tracking info added
 *       500:
 *         description: Error adding tracking info
 */
router.post('/:orderId', addTrackingInfo);

/**
 * @swagger
 * /tracking/update/{trackingId}:
 *   put:
 *     summary: Update existing tracking info
 *     tags: [Tracking]
 *     parameters:
 *       - in: path
 *         name: trackingId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tracking record ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Status
 *               - Location
 *             properties:
 *               Status:
 *                 type: string
 *                 example: "Out for Delivery"
 *               Location:
 *                 type: string
 *                 example: "Patiala City"
 *     responses:
 *       200:
 *         description: Tracking info updated
 *       500:
 *         description: Error updating tracking info
 */
router.put('/update/:trackingId', updateTrackingStatus);

module.exports = router;
