const { getPool, sql } = require('../db');

exports.getWishlistByUser = async (req, res) => {
    try {
        const pool = getPool();
        const { userId } = req.params;
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT w.*, p.Name AS ProductName, p.Price, p.ImageURL
                FROM Wishlist w
                JOIN Product p ON w.ProductID = p.ProductID
                WHERE w.UserID = @userId
            `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error fetching wishlist: ' + err.message);
    }
};
