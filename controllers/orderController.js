const { getPool, sql } = require('../db');

exports.getOrdersByUser = async (req, res) => {
    try {
        const pool = getPool();
        const { userId } = req.params;
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`SELECT * FROM [Order] WHERE UserID = @userId`);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error fetching orders: ' + err.message);
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
