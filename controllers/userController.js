
const { getPool } = require('../db');

exports.getAllUsers = async (req, res) => {
    try {
        const pool = getPool();
        const result = await pool.request().query('SELECT UserID, Name, Email, Phone, Role, CreatedDate, IsActive FROM [User]');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error fetching users: ' + err.message);
    }
};
