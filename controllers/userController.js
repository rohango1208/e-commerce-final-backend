const { getPool, sql } = require('../db');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWT_SECRET = process.env.JWT_SECRET;

// GET: All users
exports.getAllUsers = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query('SELECT * FROM [User]');
    res.json(result.recordset);
  } catch (err) {
res.status(500).json({ message: '❌ Login error', error: err });
  }
};

// POST: Register user
exports.createUser = async (req, res) => {
  try {
    const { Name, Email, Password, Phone } = req.body;
    const pool = getPool();

    // Check if email already exists
    const checkUser = await pool.request()
      .input('Email', sql.VarChar, Email)
      .query('SELECT * FROM [User] WHERE Email = @Email');

    if (checkUser.recordset.length > 0) {
      return res.status(400).send('⚠️ Email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(Password, 10);

    await pool.request()
      .input('Name', sql.VarChar, Name)
      .input('Email', sql.VarChar, Email)
    //  .input('Password', sql.VarChar, hashedPassword)  // ✅ Fix here
 
      .input('Phone', sql.VarChar, Phone)
      .input('Role', sql.VarChar, 'user') // 👈 Add default role
      .input('PasswordHash', sql.VarChar, hashedPassword)
.query(`
  INSERT INTO [User] (Name, Email, PasswordHash, Phone, Role)
  VALUES (@Name, @Email, @PasswordHash, @Phone, @Role)
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
// exports.loginUser = async (req, res) => {
//   try {
//     const { Email, Password } = req.body;
//     const pool = getPool();

//     const result = await pool.request()
//       .input('Email', sql.VarChar, Email)
//       .input('Password', sql.VarChar, Password)
//       .query('SELECT * FROM [User] WHERE Email = @Email AND Password = @Password');

//     if (result.recordset.length === 0) {
//       return res.status(401).send('❌ Invalid credentials');
//     }

//     res.json({ message: '✅ Login successful', user: result.recordset[0] });
//   } catch (err) {
//     res.status(500).send('❌ Login error: ' + err.message);
//   }
// };



exports.loginUser = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    console.log("🔐 Login attempt for email:", Email);

    const pool = getPool();

    const result = await pool.request()
      .input('Email', sql.VarChar, Email)
      .query('SELECT * FROM [User] WHERE Email = @Email');

    console.log("📥 DB query result:", result.recordset);

    if (result.recordset.length === 0) {
      console.log("❌ No user found with this email");
      return res.status(401).json({ message: '❌ Invalid email or password' });
    }

    const user = result.recordset[0];
    console.log("🔍 User fetched:", user);

    // Check for missing PasswordHash
    if (!user.PasswordHash) {
      console.log("⚠️ PasswordHash is missing in DB");
      return res.status(500).json({ message: "User record incomplete: missing password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(Password, user.PasswordHash);
    console.log("🔐 Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: '❌ Invalid email or password' });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.log("❌ JWT_SECRET is undefined");
      return res.status(500).json({ message: "Server config error: JWT secret missing" });
    }

    const token = jwt.sign(
      { id: user.UserID, email: user.Email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("✅ Token generated:", token);

    res.json({
      message: '✅ Login successful',
      token,
      user: {
        UserID: user.UserID,
        Name: user.Name,
        Email: user.Email,
        Phone: user.Phone,
        Role: user.Role,
      }
    });

  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: '❌ Login error', error: err.message });
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