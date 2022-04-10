const Pool = require('pg').Pool;
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.join(__dirname, '.env')
})

const devConfig = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PWD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
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