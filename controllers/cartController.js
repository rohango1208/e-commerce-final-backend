  const { getPool, sql } = require('../db');


  //get cart

  exports.getCartByUser = async (req, res) => {
      try {
          const pool = getPool();
          const { userId } = req.params;
          const result = await pool.request()
              .input('userId', sql.Int, userId)
              .query(`
                  SELECT ci.*, p.Name AS ProductName, p.Price, p.ImageURL
                  FROM CartItem ci
                  JOIN Cart c ON ci.CartID = c.CartID
                  JOIN Product p ON ci.ProductID = p.ProductID
                  WHERE c.UserID = @userId
              `);
          res.json(result.recordset);
      } catch (err) {
          res.status(500).send('Error fetching cart: ' + err.message);
      }
  };


  //add to cart

  exports.addToCart = async (req, res) => {
    try {
      const { userId } = req.params;
      const { ProductID, Quantity } = req.body;
      const pool = getPool();

      const cartResult = await pool.request()
        .input('UserID', sql.Int, userId)
        .query('SELECT TOP 1 CartID FROM Cart WHERE UserID = @UserID ORDER BY CreatedDate DESC');

      let cartId;
      if (cartResult.recordset.length > 0) {
        cartId = cartResult.recordset[0].CartID;
      } else {
        const insertCart = await pool.request()
          .input('UserID', sql.Int, userId)
          .query('INSERT INTO Cart (UserID, CreatedDate) OUTPUT INSERTED.CartID VALUES (@UserID, GETDATE())');
        cartId = insertCart.recordset[0].CartID;
      }

      await pool.request()
        .input('CartID', sql.Int, cartId)
        .input('ProductID', sql.Int, ProductID)
        .input('Quantity', sql.Int, Quantity)
        .query(`
          MERGE CartItem AS target
          USING (SELECT @CartID AS CartID, @ProductID AS ProductID) AS source
          ON target.CartID = source.CartID AND target.ProductID = source.ProductID
          WHEN MATCHED THEN
              UPDATE SET Quantity = target.Quantity + @Quantity
          WHEN NOT MATCHED THEN
              INSERT (CartID, ProductID, Quantity) VALUES (@CartID, @ProductID, @Quantity);
        `);

      res.status(200).json({ message: '✅ Item added to cart', cartId });
    } catch (err) {
      res.status(500).send('❌ Error adding to cart: ' + err.message);
    }
  };


  //update cart item

  exports.updateCartItem = async (req, res) => {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    try {
      const pool = getPool();

      const cartResult = await pool.request()
        .input('userId', sql.Int, userId)
        .query('SELECT CartID FROM Cart WHERE UserID = @userId');

      if (cartResult.recordset.length === 0) {
        return res.status(404).send('❌ Cart not found');
      }

      const cartId = cartResult.recordset[0].CartID;

      await pool.request()
        .input('cartId', sql.Int, cartId)
        .input('productId', sql.Int, productId)
        .input('quantity', sql.Int, quantity)
        .query(`
          UPDATE CartItem
          SET Quantity = @quantity
          WHERE CartID = @cartId AND ProductID = @productId
        `);

      res.send('🔁 Cart item updated');
    } catch (err) {
      res.status(500).send('Error updating cart item: ' + err.message);
    }
  };

  //remove from cart

  exports.removeFromCart = async (req, res) => {
    const { userId, productId } = req.params;

    try {
      const pool = getPool();

      const cartResult = await pool.request()
        .input('userId', sql.Int, userId)
        .query('SELECT CartID FROM Cart WHERE UserID = @userId');

      if (cartResult.recordset.length === 0) {
        return res.status(404).send('❌ Cart not found');
      }

      const cartId = cartResult.recordset[0].CartID;

      await pool.request()
        .input('cartId', sql.Int, cartId)
        .input('productId', sql.Int, productId)
        .query(`
          DELETE FROM CartItem
          WHERE CartID = @cartId AND ProductID = @productId
        `);

      res.send('🗑️ Item removed from cart');
    } catch (err) {
      res.status(500).send('Error removing item: ' + err.message);
    }
  };