const express = require('express');
const router = express.Router();
const {
  getWishlistByUser,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/wishlistController');

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: User wishlist management
 */

/**
 * @swagger
 * /wishlist/{userId}:
 *   get:
 *     summary: Get a user's wishlist
 *     tags: [Wishlist]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: Wishlist fetched
 *       500:
 *         description: Error fetching wishlist
 */
router.get('/:userId', getWishlistByUser);

/**
 * @swagger
 * /wishlist/{userId}:
 *   post:
 *     summary: Add product to wishlist
 *     tags: [Wishlist]
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
 *             properties:
 *               ProductID:
 *                 type: integer
 *                 example: 101
 *     responses:
 *       200:
 *         description: Product added to wishlist
 *       500:
 *         description: Error adding to wishlist
 */
router.post('/:userId', addToWishlist);

/**
 * @swagger
 * /wishlist/{userId}/{productId}:
 *   delete:
 *     summary: Remove product from wishlist
 *     tags: [Wishlist]
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
 *         description: Product removed from wishlist
 *       404:
 *         description: Wishlist not found
 *       500:
 *         description: Error removing product
 */
router.delete('/:userId/:productId', removeFromWishlist);

module.exports = router;
