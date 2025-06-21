const express = require('express');
const router = express.Router();
const { getWishlistByUser } = require('../controllers/wishlistController');

router.get('/:userId', getWishlistByUser);

module.exports = router;