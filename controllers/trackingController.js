const { getPool, sql } = require('../db');

// GET: Tracking info for a specific order
exports.getTrackingInfo = async (req, res) => {
  try {
    const { orderId } = req.params;
    const pool = getPool();
    const result = await pool.request()
      .input('OrderID', sql.Int, orderId)
      .query(`
        SELECT TrackingID, OrderID, StatusUpdate, UpdateTime, Remarks
        FROM OrderTracking
        WHERE OrderID = @OrderID
        ORDER BY UpdateTime DESC
      `);

    if (result.recordset.length === 0) {
      return res.status(404).send('❌ No tracking info found for this order.');
    }

    res.json(result.recordset);
  } catch (err) {
    res.status(500).send('❌ Error fetching tracking info: ' + err.message);
  }
};

// POST: Add tracking info
exports.addTrackingInfo = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { Status, Location } = req.body;
    const pool = getPool();

    await pool.request()
      .input('OrderID', sql.Int, orderId)
      .input('Status', sql.VarChar, Status)
      .input('UpdatedAt', sql.DateTime, new Date())
      .input('Location', sql.VarChar, Location)
      .query(`
        INSERT INTO OrderTracking (OrderID, StatusUpdate, UpdateTime, Remarks)
        VALUES (@OrderID, @Status, @UpdatedAt, @Location)
      `);

    res.status(201).send('✅ Tracking info added');
  } catch (err) {
    res.status(500).send('❌ Error adding tracking info: ' + err.message);
  }
};

// PUT: Update latest tracking status
exports.updateTrackingStatus = async (req, res) => {
  try {
    const { trackingId } = req.params;
    const { Status, Location } = req.body;
    const pool = getPool();

    await pool.request()
      .input('TrackingID', sql.Int, trackingId)
      .input('Status', sql.VarChar, Status)
      .input('Location', sql.VarChar, Location)
      .input('UpdatedAt', sql.DateTime, new Date())
      .query(`
        UPDATE OrderTracking
        SET StatusUpdate = @Status, Remarks = @Location, UpdateTime = @UpdatedAt
        WHERE TrackingID = @TrackingID
      `);

    res.send('✅ Tracking info updated');
  } catch (err) {
    res.status(500).send('❌ Error updating tracking info: ' + err.message);
  }
};

