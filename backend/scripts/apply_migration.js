import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import mysql from "mysql2";

dotenv.config({ path: path.resolve(process.cwd(), "backend", ".env") });

// We'll clean duplicates first, then add the unique constraint.
const dedupeSql = `
  -- Delete duplicate enrollments, keep the most recent row (highest id)
  DELETE e1 FROM enrollments e1
  INNER JOIN enrollments e2
    ON e1.user_email = e2.user_email AND e1.course_id = e2.course_id
    AND e1.id < e2.id;

  -- Add unique constraint
  ALTER TABLE enrollments
    ADD CONSTRAINT unique_enrollment UNIQUE (user_email, course_id);
`;

const sql = dedupeSql;

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

  console.log("✅ Connected to MySQL. Running migration...");

  connection.query(sql, (qErr, results) => {
    if (qErr) {
      console.error("❌ Migration failed:", qErr.message);
      connection.end();
      process.exit(1);
    }

    console.log("✅ Migration applied successfully.");
    connection.end();
    process.exit(0);
  });
});
