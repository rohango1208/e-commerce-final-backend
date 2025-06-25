const express = require('express');
const router = express.Router();
const {
  getCartByUser,
  addToCart,
  updateCartItem,
  removeFromCart
} = require('../controllers/cartController');

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management endpoints
 */

/**
 * @swagger
 * /cart/{userId}:
 *   get:
 *     summary: Get all cart items for a user
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of cart items
 *       500:
 *         description: Error fetching cart
 */
router.get('/:userId', getCartByUser);

/**
 * @swagger
 * /cart/{userId}:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
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
 *               - ProductID
 *               - Quantity
 *             properties:
 *               ProductID:
 *                 type: integer
 *               Quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item added to cart
 *       500:
 *         description: Error adding to cart
 */
router.post('/:userId', addToCart);

/**
 * @swagger
 * /cart/{userId}/{productId}:
 *   put:
 *     summary: Update quantity of a cart item
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cart item updated
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Error updating cart
 */
router.put('/:userId/:productId', updateCartItem);

/**
 * @swagger
 * /cart/{userId}/{productId}:
 *   delete:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Error removing item
 */
router.delete('/:userId/:productId', removeFromCart);

module.exports = router;
