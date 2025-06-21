const express = require('express');
const { connectDB } = require('./db');

const app = express();
app.use(express.json());

// Import routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const trackingRoutes = require('./routes/trackingRoutes');

// Use routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/orders', orderRoutes);
app.use('/payment', paymentRoutes);
app.use('/tracking', trackingRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Raani Earrings API 💍');
});

connectDB().then(() => {
  app.listen(3000, () => {
    console.log('🚀 API is live at http://localhost:3000');
  });
});