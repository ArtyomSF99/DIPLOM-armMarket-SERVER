const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_MAIN_DB,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  ssl: { rejectUnauthorized: false }
})

module.exports = pool