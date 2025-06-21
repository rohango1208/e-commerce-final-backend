const express = require('express');
const router = express.Router();
const { getOrdersByUser, getOrderItems } = require('../controllers/orderController');

router.get('/:userId', getOrdersByUser);
router.get('/items/:orderId', getOrderItems);

module.exports = router;