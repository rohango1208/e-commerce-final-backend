const { sql, getPool } = require('../db');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res) => {
  const { userId, cartItems } = req.body;

  try {
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const pool = getPool();

    const validatedItems = [];
    for (const item of cartItems) {
      const result = await pool.request()
        .input('ProductID', sql.Int, item.ProductID)
        .query('SELECT * FROM Product WHERE ProductID = @ProductID');

      if (result.recordset.length === 0) continue;
      const product = result.recordset[0];

      validatedItems.push({
        ProductName: product.Name,
        ImageURL: product.ImageURL,
        Price: product.Price,
        Quantity: item.Quantity,
      });
    }

    if (validatedItems.length === 0) {
      return res.status(400).json({ error: 'No valid products in cart' });
    }

    const line_items = validatedItems.map((item) => ({
      price_data: {
        currency: 'cad',
        product_data: {
          name: item.ProductName,
          images: [item.ImageURL],
        },
        unit_amount: Math.round(item.Price * 100),
      },
      quantity: item.Quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get Stripe session details
exports.getSessionDetails = async (req, res) => {
  try {
    const { session_id } = req.query;
    const session = await stripe.checkout.sessions.retrieve(session_id);
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Webhook for completed payments
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const pool = await sql.connect(dbConfig);
      await pool.request()
        .input('UserID', sql.Int, session.metadata.userId)
        .input('Amount', sql.Decimal(10, 2), session.amount_total / 100)
        .input('PaymentStatus', sql.VarChar, 'Completed')
        .query(`
          INSERT INTO Payment (UserID, Amount, PaymentStatus)
          VALUES (@UserID, @Amount, @PaymentStatus)
        `);
    } catch (dbErr) {
      console.error('DB Error:', dbErr);
    }
  }

  res.json({ received: true });
};
