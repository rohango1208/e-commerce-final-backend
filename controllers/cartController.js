const { getPool, sql } = require('../db');

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