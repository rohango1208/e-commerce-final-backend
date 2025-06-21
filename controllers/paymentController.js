const { getPool, sql } = require('../db');

exports.getPaymentDetails = async (req, res) => {
    try {
        const pool = getPool();
        const { orderId } = req.params;
        const result = await pool.request()
            .input('orderId', sql.Int, orderId)
            .query(`SELECT * FROM Payment WHERE OrderID = @orderId`);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error fetching payment: ' + err.message);
    }
};