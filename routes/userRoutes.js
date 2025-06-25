const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  createUser,
  loginUser,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User account management
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: Error fetching users
 */
router.get('/', getAllUsers);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Name
 *               - Email
 *               - Password
 *               - Phone
 *             properties:
 *               Name:
 *                 type: string
 *                 example: Rani Kapoor
 *               Email:
 *                 type: string
 *                 example: rani@example.com
 *               Password:
 *                 type: string
 *                 example: password123
 *               Phone:
 *                 type: string
 *                 example: 9876543210
 *     responses:
 *       201:
 *         description: User registered
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Error registering user
 */
router.post('/register', createUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Email
 *               - Password
 *             properties:
 *               Email:
 *                 type: string
 *                 example: rani@example.com
 *               Password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Login error
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User data returned
 *       404:
 *         description: User not found
 *       500:
 *         description: Error fetching user
 */
router.get('/:id', getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - Name
 *               - Email
 *               - Phone
 *             properties:
 *               Name:
 *                 type: string
 *                 example: Rani Updated
 *               Email:
 *                 type: string
 *                 example: rani.updated@example.com
 *               Phone:
 *                 type: string
 *                 example: 9876512345
 *     responses:
 *       200:
 *         description: Profile updated
 *       500:
 *         description: Error updating user
 */
router.put('/:id', updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted
 *       500:
 *         description: Error deleting user
 */
router.delete('/:id', deleteUser);

module.exports = router;
