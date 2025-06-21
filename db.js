const sql = require('mssql/msnodesqlv8');

const config = {
    server: 'DESKTOP-0554NIP\\SQLEXPRESS01', 
    database: 'raani_earrings',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true
    }
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
