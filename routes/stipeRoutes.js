const express = require('express');
const { createCheckoutSession, getSessionDetails } = require('../controllers/StripepaymentController.js');


const router = express.Router();

router.post('/create-checkout-session', createCheckoutSession);

// Stripe Webhook (must be raw body)
// router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);
router.get('/session', getSessionDetails);
module.exports = router;