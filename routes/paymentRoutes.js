const express = require('express');
const router = express.Router();
const { getPaymentDetails } = require('../controllers/paymentController');

router.get('/:orderId', getPaymentDetails);

module.exports = router;