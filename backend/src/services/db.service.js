// // backend/src/services/db.service.js

// // backend/src/services/db.service.js

// const { Pool } = require('pg');
// require('dotenv').config(); // Load from where it's being run (backend/)

// // --- NEW CRITICAL CHECK ---
// const dbPassword = process.env.DB_PASSWORD;
// if (!dbPassword) {
//     console.error('FATAL ERROR: DB_PASSWORD is not set in environment variables.');
//     process.exit(1);
// }
// // --- END CRITICAL CHECK ---

// // Configuration object uses environment variables from .env
// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     // Use the explicitly checked variable here to ensure it's a string
//     password: dbPassword, 
//     port: parseInt(process.env.DB_PORT, 10), 
//     max: 20, 
//     idleTimeoutMillis: 30000, 
//     connectionTimeoutMillis: 2000, 
// });

// // ... rest of the file (pool.query('SELECT NOW()') block and module.exports)

// // Test the connection when the module loads
// pool.query('SELECT NOW()')
//     .then(res => console.log('✅ PostgreSQL connected successfully at:', res.rows[0].now))
//     .catch(err => {
//         console.error('❌ Database connection failed:', err.stack);
//         process.exit(1); // Exit process if DB connection fails
//     });

// // Export a function that can run queries against the pool
// module.exports = {
//     query: (text, params) => pool.query(text, params),
//     pool // Export the pool instance as well
// };















// backend/src/services/db.service.js

const { Pool } = require('pg');
const path = require('path');

// Load .env from backend/.env explicitly
require('dotenv').config({
  path: path.join(__dirname, '..', '..', '.env'),
});

// --- CRITICAL CHECK ---
const dbPassword = process.env.DB_PASSWORD;
if (!dbPassword) {
  console.error('FATAL ERROR: DB_PASSWORD is not set in environment variables.');
  process.exit(1);
}
// --- END CHECK ---

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: dbPassword,
  port: parseInt(process.env.DB_PORT, 10),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test DB connection
pool
  .query('SELECT NOW()')
  .then((res) =>
    console.log('✅ PostgreSQL connected successfully at:', res.rows[0].now)
  )
  .catch((err) => {
    console.error('❌ Database connection failed:', err.stack);
    process.exit(1);
  });

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
