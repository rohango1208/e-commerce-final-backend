// const { getPool, sql } = require('../db');

// // Get wishlist for a user
// exports.getWishlistByUser = async (req, res) => {
//   try {
//     const pool = getPool();
//     const { userId } = req.params;

//     const result = await pool.request()
//       .input('userId', sql.Int, userId)
//       .query(`
//         SELECT wi.*, p.Name AS ProductName, p.Price, p.ImageURL
//         FROM Wishlist wi
//         JOIN Wishlist w ON wi.WishlistID = w.WishlistID
//         JOIN Product p ON wi.ProductID = p.ProductID
//         WHERE w.UserID = @userId
//       `);

//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).send('❌ Error fetching wishlist: ' + err.message);
//   }
// };

// // Add to wishlist
// exports.addToWishlist = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { ProductID } = req.body;
//     const pool = getPool();

//     // Check if wishlist exists
//     const wishlistResult = await pool.request()
//       .input('UserID', sql.Int, userId)
//       .query(`SELECT TOP 1 WishlistID FROM Wishlist WHERE UserID = @UserID ORDER BY CreatedDate DESC`);

//     let wishlistId;
//     if (wishlistResult.recordset.length > 0) {
//       wishlistId = wishlistResult.recordset[0].WishlistID;
//     } else {
//       // Create wishlist
//       const insertWishlist = await pool.request()
//         .input('UserID', sql.Int, userId)
//         .query(`INSERT INTO Wishlist (UserID, CreatedDate) OUTPUT INSERTED.WishlistID VALUES (@UserID, GETDATE())`);

//       wishlistId = insertWishlist.recordset[0].WishlistID;
//     }

//     // Insert or ignore duplicate item
//     await pool.request()
//       .input('UserID', sql.Int, userId)
//       .input('ProductID', sql.Int, ProductID)
//       .query(`
//         IF NOT EXISTS (
//           SELECT 1 FROM Wishlist WHERE UserID = @UserID AND ProductID = @ProductID
//         )
//         BEGIN
//         INSERT INTO Wishlist (UserID, ProductID)
// VALUES (@UserID, @ProductID)
         
//         END
//       `);

//     res.status(200).json({ message: '✅ Added to wishlist', wishlistId });
//   } catch (err) {
//     res.status(500).send('❌ Error adding to wishlist: ' + err.message);
//   }
// };

// // Remove from wishlist
// exports.removeFromWishlist = async (req, res) => {
//   try {
//     const { userId, productId } = req.params;
//     const pool = getPool();

//     const wishlistResult = await pool.request()
//       .input('UserID', sql.Int, userId)
//       .query('SELECT WishlistID FROM Wishlist WHERE UserID = @UserID');

//     if (wishlistResult.recordset.length === 0) {
//       return res.status(404).send('❌ Wishlist not found');
//     }

//     const wishlistId = wishlistResult.recordset[0].WishlistID;

//     await pool.request()
//       .input('WishlistID', sql.Int, wishlistId)
//       .input('ProductID', sql.Int, productId)
//       .query(`
//         DELETE FROM Wishlist
//         WHERE WishlistID = @WishlistID AND ProductID = @ProductID
//       `);

//     res.send('🗑️ Removed from wishlist');
//   } catch (err) {
//     res.status(500).send('❌ Error removing item: ' + err.message);
//   }
// };
const { getPool, sql } = require('../db');

// Get wishlist for a user
exports.getWishlistByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const pool = getPool();

    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT wi.*, p.Name AS ProductName, p.Price, p.ImageURL
        FROM WishlistItem wi
        JOIN Wishlist w ON wi.WishlistID = w.WishlistID
        JOIN Product p ON wi.ProductID = p.ProductID
        WHERE w.UserID = @userId
      `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).send('❌ Error fetching wishlist: ' + err.message);
  }
};

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const { ProductID } = req.body;
    const pool = getPool();

    // Get or create Wishlist for user
    const wishlistResult = await pool.request()
      .input('UserID', sql.Int, userId)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM Wishlist WHERE UserID = @UserID)
        BEGIN
          INSERT INTO Wishlist (UserID, CreatedDate) VALUES (@UserID, GETDATE())
        END;
        SELECT WishlistID FROM Wishlist WHERE UserID = @UserID;
      `);

    const wishlistId = wishlistResult.recordset[0].WishlistID;

    // Avoid duplicates
    await pool.request()
      .input('WishlistID', sql.Int, wishlistId)
      .input('ProductID', sql.Int, ProductID)
      .query(`
        IF NOT EXISTS (
          SELECT 1 FROM WishlistItem WHERE WishlistID = @WishlistID AND ProductID = @ProductID
        )
        BEGIN
          INSERT INTO WishlistItem (WishlistID, ProductID) VALUES (@WishlistID, @ProductID)
        END
      `);

    res.status(200).json({ message: '✅ Product added to wishlist' });
  } catch (err) {
    res.status(500).send('❌ Error adding to wishlist: ' + err.message);
  }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    console.log("📩 Remove Request:", { userId, productId });

    const pool = getPool();

    const wishlistResult = await pool.request()
      .input('UserID', sql.Int, userId)
      .query('SELECT WishlistID FROM Wishlist WHERE UserID = @UserID');

    if (wishlistResult.recordset.length === 0) {
      console.log("❌ Wishlist not found for user:", userId);
      return res.status(404).send('❌ Wishlist not found');
    }

    const wishlistId = wishlistResult.recordset[0].WishlistID;
    console.log("🧾 Found WishlistID:", wishlistId);

    const deleteResult = await pool.request()
      .input('WishlistID', sql.Int, wishlistId)
      .input('ProductID', sql.Int, productId)
      .query(`
        DELETE FROM WishlistItem
        WHERE WishlistID = @WishlistID AND ProductID = @ProductID
      `);

    console.log("✅ Deletion result:", deleteResult.rowsAffected);

    res.send('🗑️ Removed from wishlist');
  } catch (err) {
    console.error("❌ Error removing wishlist item:", err);
    res.status(500).send('❌ Error removing item: ' + err.message);
  }
};

