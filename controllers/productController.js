const { getPool } = require('../db');

exports.getAllProducts = async (req, res) => {
    try {
        const pool = getPool();
        const result = await pool.request().query('SELECT * FROM Product');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('DB Error: ' + err.message);
    }
};

exports.getProductsWithCategory = async (req, res) => {
    try {
        const pool = getPool();
        const result = await pool.request().query(`
            SELECT p.*, c.Name AS CategoryName
            FROM Product p
            LEFT JOIN Category c ON p.CategoryID = c.CategoryID
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('DB Error: ' + err.message);
    }
};