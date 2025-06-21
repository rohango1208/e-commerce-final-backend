const express = require('express');
const router = express.Router();
const { getCartByUser } = require('../controllers/cartController');

router.get('/:userId', getCartByUser);

module.exports = router;
