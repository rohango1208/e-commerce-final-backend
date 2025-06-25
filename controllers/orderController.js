const { getPool, sql } = require('../db');


// GET: Orders by User
exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const pool = getPool();
    const result = await pool.request()
      .input('UserID', sql.Int, userId)
      .query(`
        SELECT o.OrderID, o.OrderDate, o.TotalAmount, o.OrderStatus, o.Address, o.Payment_Method
        FROM [Order] o
        WHERE o.UserID = @UserID
        ORDER BY o.OrderDate DESC
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send('❌ Error fetching orders: ' + err.message);
  }
};

exports.getOrderItems = async (req, res) => {
    try {
        const pool = getPool();
        const { orderId } = req.params;
        const result = await pool.request()
            .input('orderId', sql.Int, orderId)
            .query(`
                SELECT oi.*, p.Name AS ProductName, p.ImageURL
                FROM OrderItem oi
                JOIN Product p ON oi.ProductID = p.ProductID
                WHERE oi.OrderID = @orderId
            `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error fetching order items: ' + err.message);
    }
};



// POST: Place Order
exports.placeOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const { Address, Payment_Method } = req.body;
    const pool = getPool();

    // Get CartID and items
    const cartResult = await pool.request()
      .input('UserID', sql.Int, userId)
      .query('SELECT CartID FROM Cart WHERE UserID = @UserID');

    if (cartResult.recordset.length === 0) {
      return res.status(400).send('❌ Cart not found');
    }

    const cartId = cartResult.recordset[0].CartID;

    const itemsResult = await pool.request()
      .input('CartID', sql.Int, cartId)
      .query(`
        SELECT ci.ProductID, ci.Quantity, p.Price
        FROM CartItem ci
        JOIN Product p ON ci.ProductID = p.ProductID
        WHERE ci.CartID = @CartID
      `);

    const items = itemsResult.recordset;
    if (items.length === 0) {
      return res.status(400).send('❌ Cart is empty');
    }

    const totalAmount = items.reduce((sum, item) => sum + item.Price * item.Quantity, 0);

    // Insert Order
    const orderResult = await pool.request()
      .input('UserID', sql.Int, userId)
      .input('OrderDate', sql.DateTime, new Date())
      .input('TotalAmount', sql.Decimal(10, 2), totalAmount)
      .input('OrderStatus', sql.VarChar, 'Pending')
      .input('Address', sql.VarChar, Address)
      .input('Payment_Method', sql.VarChar, Payment_Method)
      .query(`
        INSERT INTO [Order] (UserID, OrderDate, TotalAmount, OrderStatus, Address, Payment_Method)
        OUTPUT INSERTED.OrderID
        VALUES (@UserID, @OrderDate, @TotalAmount, @OrderStatus, @Address, @Payment_Method)
      `);

    const orderId = orderResult.recordset[0].OrderID;

    // Insert OrderItems
    for (const item of items) {
      await pool.request()
        .input('OrderID', sql.Int, orderId)
        .input('ProductID', sql.Int, item.ProductID)
        .input('Quantity', sql.Int, item.Quantity)
        .input('Price', sql.Decimal(10, 2), item.Price)
        .query(`
          INSERT INTO OrderItem (OrderID, ProductID, Quantity, UnitPrice)
          VALUES (@OrderID, @ProductID, @Quantity, @Price)
        `);
    }

    // Clear Cart Items
    await pool.request()
      .input('CartID', sql.Int, cartId)
      .query('DELETE FROM CartItem WHERE CartID = @CartID');

    res.status(201).send('✅ Order placed successfully');
  } catch (err) {
    res.status(500).send('❌ Error placing order: ' + err.message);
  }
};
