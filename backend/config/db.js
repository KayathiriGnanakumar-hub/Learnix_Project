import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// Use a connection pool to better handle transient DB availability and avoid
// assigning a connection object that can be in a closed state.
const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
});

// Export the pool which provides `.query(...)` compatible API used across the codebase.
export default pool;
