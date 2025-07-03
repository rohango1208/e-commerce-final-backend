// const express = require("express");
// const router = express.Router();
// const {
//   getAllProducts,
//   getProductsWithCategory,
//   getProductByProductId,
//   createProduct,
//   updateProduct,
//   deleteProduct,
// } = require("../controllers/productController");

// /**
//  * @swagger
//  * tags:
//  *   name: Products
//  *   description: Product management
//  */

// /**
//  * @swagger
//  * /products:
//  *   get:
//  *     summary: Get all products
//  *     tags: [Products]
//  *     responses:
//  *       200:
//  *         description: A list of all products
//  */
// router.get("/", getAllProducts);

// /**
//  * @swagger
//  * /products/detailed:
//  *   get:
//  *     summary: Get products with category information
//  *     tags: [Products]
//  *     responses:
//  *       200:
//  *         description: List of products with category names
//  */
// router.get("/detailed", getProductsWithCategory);
// /**
//  * @swagger
//  * /products/{productId}:
//  *   get:
//  *     summary: Get product details by Product ID
//  *     description: Returns details of a single product and its category for the given Product ID.
//  *     tags:
//  *       - Products
//  *     parameters:
//  *       - in: path
//  *         name: productId
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID of the product
//  *     responses:
//  *       200:
//  *         description: Product details
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 ProductID:
//  *                   type: integer
//  *                 Name:
//  *                   type: string
//  *                 Description:
//  *                   type: string
//  *                 Price:
//  *                   type: number
//  *                   format: float
//  *                 CategoryID:
//  *                   type: integer
//  *                 CategoryName:
//  *                   type: string
//  *       404:
//  *         description: Product not found
//  *       500:
//  *         description: Internal server error
//  */

// router.get("/:productId", getProductByProductId);

// /**
//  * @swagger
//  * /products:
//  *   post:
//  *     summary: Create a new product
//  *     tags: [Products]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - Name
//  *               - Price
//  *             properties:
//  *               Name:
//  *                 type: string
//  *               Price:
//  *                 type: number
//  *               ImageURL:
//  *                 type: string
//  *               CategoryID:
//  *                 type: integer
//  *               Description:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: Product created successfully
//  */
// router.post("/", createProduct);

// /**
//  * @swagger
//  * /products/{id}:
//  *   put:
//  *     summary: Update a product by ID
//  *     tags: [Products]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               Name:
//  *                 type: string
//  *               Price:
//  *                 type: number
//  *               ImageURL:
//  *                 type: string
//  *               CategoryID:
//  *                 type: integer
//  *               Description:
//  *                 type: string
//  *              Discount:
//  *            type: number
//  *     format: float
//  *   StockQuantity:
//  * type: integer
//  *     responses:
//  *       200:
//  *         description: Product updated successfully
//  *       404:
//  *         description: Product not found
//  */
// router.put("/:id", updateProduct);

// /**
//  * @swagger
//  * /products/{id}:
//  *   delete:
//  *     summary: Delete a product by ID
//  *     tags: [Products]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: Product deleted successfully
//  *       404:
//  *         description: Product not found
//  */
// router.delete("/:id", deleteProduct);

// module.exports = router;
const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductsWithCategory,
  getProductByProductId,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of all products
 */
router.get("/", getAllProducts);

/**
 * @swagger
 * /products/detailed:
 *   get:
 *     summary: Get products with category information
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products with category names
 */
router.get("/detailed", getProductsWithCategory);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product details by ID
 *     description: Returns details of a single product and its category.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 Name:
 *                   type: string
 *                 Description:
 *                   type: string
 *                 Price:
 *                   type: number
 *                   format: float
 *                 CategoryID:
 *                   type: integer
 *                 CategoryName:
 *                   type: string
 *                 Discount:
 *                   type: number
 *                 StockQuantity:
 *                   type: integer
 *       404:
 *         description: Product not found
 */
router.get("/:id", getProductByProductId);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Name
 *               - Price
 *               - CategoryID
 *               - ImageURL
 *               - Description
 *             properties:
 *               Name:
 *                 type: string
 *               Price:
 *                 type: number
 *               ImageURL:
 *                 type: string
 *               CategoryID:
 *                 type: integer
 *               Description:
 *                 type: string
 *               Discount:
 *                 type: number
 *               StockQuantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post("/", createProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *               Price:
 *                 type: number
 *               ImageURL:
 *                 type: string
 *               CategoryID:
 *                 type: integer
 *               Description:
 *                 type: string
 *               Discount:
 *                 type: number
 *               StockQuantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */
router.put("/:id", updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete("/:id", deleteProduct);

module.exports = router;
