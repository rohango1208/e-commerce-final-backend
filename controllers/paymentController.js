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

exports.addPayment = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { Amount, Method, Status } = req.body;
        const pool = getPool();
        await pool.request()
            .input('OrderID', sql.Int, orderId)
            .input('Amount', sql.Decimal, Amount)
            .input('Method', sql.NVarChar, Method)
            .input('Status', sql.NVarChar, Status)
            .query('INSERT INTO Payment (OrderID, Amount, PaymentMethod, PaymentStatus, PaymentDate) VALUES (@OrderID, @Amount, @Method, @Status, GETDATE())');
        res.send('Payment recorded');
    } catch (err) {
        res.status(500).send('Error adding payment: ' + err.message);
    }
};
