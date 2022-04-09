const Pool = require('pg').Pool;

const devConfig = {
    user: 'postgres',
    password: '1234',
    host: 'localhost',
    port: '5432',
    database: 'ontime'
}

const proConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
}

const pool = new Pool(
    process.env.NODE_ENV === 'production' ? proConfig : devConfig
)

module.exports = pool;