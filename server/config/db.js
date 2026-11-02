const { Pool } = require("pg");


// Read database configuration from environment variables
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test the connection when the module is loaded
pool.query("SELECT NOW()")
  .then((res) => {
    console.log("PostgreSQL connected successfully.");
    console.log(`Database time: ${res.rows[0].now}`);
  })
  .catch((err) => {
    console.error("Failed to connect to PostgreSQL:", err.message);
  });

// Export the reusable pool for use throughout the application
module.exports = pool;
