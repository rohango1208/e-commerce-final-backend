const { getPool, sql } = require("../db");

// ✅ GET all products with category name
exports.getAllProducts = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT 
        p.ProductID AS id,
        p.Name,
        p.Price,
        p.ImageURL,
        p.Description,
        p.CategoryID,
        p.Discount AS discount,
        p.StockQuantity AS stockQuantity,
        c.Name AS CategoryName
      FROM Product p
      LEFT JOIN Category c ON p.CategoryID = c.CategoryID
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("DB Error: " + err.message);
  }
};


// ✅ GET products with category name (detailed)
// In productController.js
exports.getProductsWithCategory = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const pool = getPool();
    const request = pool.request();

    let query = `
      SELECT 
        p.ProductID AS id, 
        p.Name, 
        p.Price, 
        p.ImageURL, 
        p.Description, 
        p.CategoryID, 
        p.Discount AS discount,
        p.StockQuantity AS stockQuantity,
        c.Name AS CategoryName
      FROM Product p
      LEFT JOIN Category c ON p.CategoryID = c.CategoryID
    `;

    if (categoryId) {
      request.input("CategoryID", sql.Int, categoryId);
      query += " WHERE p.CategoryID = @CategoryID";
    }

    const result = await request.query(query);

    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: "DB Error: " + err.message });
  }
};



// ✅ GET product by ID
exports.getProductByProductId = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ message: "❌ Invalid Product ID" });
    }

    const pool = getPool();

    const result = await pool.request()
      .input("ProductID", sql.Int, parseInt(id))
      .query(`
        SELECT 
          p.ProductID AS id, 
          p.Name, 
          p.Price, 
          p.ImageURL, 
          p.Description, 
          p.Discount AS discount,
          p.StockQuantity AS stockQuantity,
          p.CategoryID, 
          c.Name AS CategoryName
        FROM Product p
        LEFT JOIN Category c ON p.CategoryID = c.CategoryID
        WHERE p.ProductID = @ProductID
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "❌ Product not found" });
    }

    res.status(200).json(result.recordset[0]);

  } catch (err) {
    console.error("❌ Database Error:", err);
    res.status(500).json({ message: "DB Error: " + err.message });
  }
};



// ✅ CREATE product
exports.createProduct = async (req, res) => {
  console.log("📦 Creating product with body:", req.body);
  try {
    const { Name, Price, ImageURL, CategoryID, Description, Discount = 0, StockQuantity = 0 } = req.body;


    if (
      !Name ||
      !ImageURL ||
      !Description ||
      !CategoryID ||
      Price === undefined
    ) {
      return res.status(400).json({ message: "❌ Missing required fields" });
    }

    const pool = getPool();

   await pool.request()
  .input('Name', sql.VarChar, Name)
  .input('Price', sql.Decimal(10, 2), Price)
  .input('ImageURL', sql.VarChar, ImageURL)
  .input('CategoryID', sql.Int, CategoryID)
  .input('Description', sql.VarChar, Description)
  .input('Discount', sql.Decimal(5, 2), Discount)
  .input('StockQuantity', sql.Int, StockQuantity)
  .query(`
    INSERT INTO Product (Name, Price, ImageURL, CategoryID, Description, Discount, StockQuantity)
    VALUES (@Name, @Price, @ImageURL, @CategoryID, @Description, @Discount, @StockQuantity)
  `);

    res.status(201).json({ message: "✅ Product created" });
  } catch (err) {
    console.error("❌ SQL Error:", err); // <-- ADD THIS
    res
      .status(500)
      .json({ message: "❌ Error creating product: " + err.message });
  }
};

// ✅ UPDATE product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, Price, ImageURL, CategoryID, Description, Discount = 0, StockQuantity = 0 } = req.body;

    const pool = getPool();

    const exists = await pool
      .request()
      .input("ProductID", sql.Int, id)
      .query("SELECT 1 FROM Product WHERE ProductID = @ProductID");

    if (exists.recordset.length === 0) {
      return res.status(404).json({ message: "❌ Product not found" });
    }

    await pool
      .request()
      .input("ProductID", sql.Int, id)
      .input("Name", sql.VarChar, Name)
      .input("Price", sql.Decimal(10, 2), Price)
      .input("ImageURL", sql.VarChar, ImageURL)
      .input("CategoryID", sql.Int, CategoryID)
      .input("Description", sql.VarChar, Description)
      .input("Discount", sql.Decimal(5, 2), Discount)               // ✅ Added
      .input("StockQuantity", sql.Int, StockQuantity)               // ✅ Added
      .query(`
        UPDATE Product
        SET Name = @Name, 
            Price = @Price, 
            ImageURL = @ImageURL,
            CategoryID = @CategoryID, 
            Description = @Description,
            Discount = @Discount,                -- ✅ Added
            StockQuantity = @StockQuantity       -- ✅ Added
        WHERE ProductID = @ProductID
      `);

    res.json({ message: "✅ Product updated" });
  } catch (err) {
    res.status(500).json({ message: "❌ Error updating product: " + err.message });
  }
};

// ✅ DELETE product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const exists = await pool
      .request()
      .input("ProductID", sql.Int, id)
      .query("SELECT 1 FROM Product WHERE ProductID = @ProductID");

    if (exists.recordset.length === 0) {
      return res.status(404).json({ message: "❌ Product not found" });
    }

    await pool
      .request()
      .input("ProductID", sql.Int, id)
      .query("DELETE FROM Product WHERE ProductID = @ProductID");

    res.json({ message: "✅ Product deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "❌ Error deleting product: " + err.message });
  }
};
