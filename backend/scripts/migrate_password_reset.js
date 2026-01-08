import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import mysql from "mysql2";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const migrationPath = path.join(process.cwd(), "sql", "add_password_reset_columns.sql");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
});

connection.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1);
  }

  console.log("✅ Connected to MySQL. Running password reset migration...");

  const sql = fs.readFileSync(migrationPath, "utf8");

  connection.query(sql, (qErr, results) => {
    if (qErr) {
      console.error("❌ Migration failed:", qErr.message);
      connection.end();
      process.exit(1);
    }

    console.log("✅ Password reset migration applied successfully.");
    connection.end();
    process.exit(0);
  });
});