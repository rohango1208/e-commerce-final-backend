const express = require('express');
const router = express.Router();
const { getAllProducts, getProductsWithCategory } = require('../controllers/productController');

router.get('/', getAllProducts);
router.get('/detailed', getProductsWithCategory);

module.exports = router;