const { getPool, sql } = require('../db');

// GET: All products
exports.getAllProducts = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query('SELECT * FROM Product');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send('DB Error: ' + err.message);
  }
};

// GET: Products with category name
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

// GET: Product details by ProductID
exports.getProductByProductId = async (req, res) => {
  try {
    const { productId } = req.params; // Extract productId from URL
    const pool = getPool();
    const result = await pool.request()
      .input('productId', sql.Int, productId)
      .query(`
        SELECT p.*, c.Name AS CategoryName
        FROM Product p
        LEFT JOIN Category c ON p.CategoryID = c.CategoryID
        WHERE p.ProductID = @productId
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).send('Product not found');
    }

    res.json(result.recordset[0]); // Send single product object
  } catch (err) {
    res.status(500).send('DB Error: ' + err.message);
  }
};



// POST: Create product
exports.createProduct = async (req, res) => {
  try {
    const { Name, Price, ImageURL, CategoryID, Description } = req.body;
    const pool = getPool();

    await pool.request()
      .input('Name', sql.VarChar, Name)
      .input('Price', sql.Decimal(10, 2), Price)
      .input('ImageURL', sql.VarChar, ImageURL)
      .input('CategoryID', sql.Int, CategoryID)
      .input('Description', sql.VarChar, Description)
      .query(`
        INSERT INTO Product (Name, Price, ImageURL, CategoryID, Description)
        VALUES (@Name, @Price, @ImageURL, @CategoryID, @Description)
      `);

    res.status(201).send('✅ Product created');
  } catch (err) {
    res.status(500).send('❌ Error creating product: ' + err.message);
  }
};


// PUT: Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, Price, ImageURL, CategoryID, Description } = req.body;
    const pool = getPool();

    const result = await pool.request()
  .input('ProductID', sql.Int, id)
  .query('SELECT 1 FROM Product WHERE ProductID = @ProductID');

if (result.recordset.length === 0) {
  return res.status(404).send('❌ Product not found');
}

    await pool.request()
      .input('ProductID', sql.Int, id)
      .input('Name', sql.VarChar, Name)
      .input('Price', sql.Decimal(10, 2), Price)
      .input('ImageURL', sql.VarChar, ImageURL)
      .input('CategoryID', sql.Int, CategoryID)
      .input('Description', sql.VarChar, Description)
      .query(`
        UPDATE Product
        SET Name = @Name, Price = @Price, ImageURL = @ImageURL, CategoryID = @CategoryID, Description = @Description
        WHERE ProductID = @ProductID
      `);

    res.send('✅ Product updated');
  } catch (err) {
    res.status(500).send('❌ Error updating product: ' + err.message);
  }
};

// DELETE: Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const result = await pool.request()
  .input('ProductID', sql.Int, id)
  .query('SELECT 1 FROM Product WHERE ProductID = @ProductID');

if (result.recordset.length === 0) {
  return res.status(404).send('❌ Product not found');
}

    await pool.request()
      .input('ProductID', sql.Int, id)
      .query('DELETE FROM Product WHERE ProductID = @ProductID');

    res.send('✅ Product deleted');
  } catch (err) {
    res.status(500).send('❌ Error deleting product: ' + err.message);
  }
};
