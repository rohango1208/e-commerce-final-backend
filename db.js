const sql = require('mssql/msnodesqlv8');

const config = {
  connectionString: 'Driver={ODBC Driver 18 for SQL Server};Server=DESKTOP-5S2E8AE\\SQLEXPRESS01;Database=RAANIDB;Trusted_Connection=Yes;Encrypt=no;TrustServerCertificate=yes;',
  driver: 'msnodesqlv8'
};


let poolPromise;

async function connectDB() {
  try {
    const pool = await new sql.ConnectionPool(config).connect();
    console.log('✅ Connected to SQL Server');
    poolPromise = pool;
  } catch (err) {
    console.error('❌ Failed to connect to DB:', err);
    poolPromise = null;
  }
}

module.exports = {
  sql,
  connectDB,
  getPool: () => poolPromise
};
