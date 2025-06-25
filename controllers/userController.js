const { getPool, sql } = require('../db');

// GET: All users
exports.getAllUsers = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query('SELECT * FROM [User]');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send('❌ Error fetching users: ' + err.message);
  }
};

// POST: Register user
exports.createUser = async (req, res) => {
  try {
    const { Name, Email, Password, Phone } = req.body;
    const pool = getPool();

    // Optional: Check if email already exists
    const checkUser = await pool.request()
      .input('Email', sql.VarChar, Email)
      .query('SELECT * FROM [User] WHERE Email = @Email');

    if (checkUser.recordset.length > 0) {
      return res.status(400).send('⚠️ Email already exists');
    }

    await pool.request()
      .input('Name', sql.VarChar, Name)
      .input('Email', sql.VarChar, Email)
      .input('Password', sql.VarChar, Password) // You can hash this in future
      .input('Phone', sql.VarChar, Phone)
      .query(`
        INSERT INTO [User] (Name, Email, Password, Phone)
        VALUES (@Name, @Email, @Password, @Phone)
      `);

    res.status(201).send('✅ User registered');
  } catch (err) {
    res.status(500).send('❌ Error registering user: ' + err.message);
  }
};

// GET: Specific user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const result = await pool.request()
      .input('UserID', sql.Int, id)
      .query('SELECT * FROM [User] WHERE UserID = @UserID');

    if (result.recordset.length === 0) {
      return res.status(404).send('❌ User not found');
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send('❌ Error fetching user: ' + err.message);
  }
};

// POST: Login user   //NEED MODIFICATIONS
exports.loginUser = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const pool = getPool();

    const result = await pool.request()
      .input('Email', sql.VarChar, Email)
      .input('Password', sql.VarChar, Password)
      .query('SELECT * FROM [User] WHERE Email = @Email AND Password = @Password');

    if (result.recordset.length === 0) {
      return res.status(401).send('❌ Invalid credentials');
    }

    res.json({ message: '✅ Login successful', user: result.recordset[0] });
  } catch (err) {
    res.status(500).send('❌ Login error: ' + err.message);
  }
};

// PUT: Update profile
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, Email, Phone } = req.body;
    const pool = getPool();

    await pool.request()
      .input('UserID', sql.Int, id)
      .input('Name', sql.VarChar, Name)
      .input('Email', sql.VarChar, Email)
      .input('Phone', sql.VarChar, Phone)
      .query(`
        UPDATE [User] SET Name = @Name, Email = @Email, Phone = @Phone
        WHERE UserID = @UserID
      `);

    res.send('✅ Profile updated');
  } catch (err) {
    res.status(500).send('❌ Error updating user: ' + err.message);
  }
};

// DELETE: Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    await pool.request()
      .input('UserID', sql.Int, id)
      .query('DELETE FROM [User] WHERE UserID = @UserID');

    res.send('✅ User deleted');
  } catch (err) {
    res.status(500).send('❌ Error deleting user: ' + err.message);
  }
};