import mysql from "mysql2";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const correctHash = "$2b$10$E.WRQvMQjyibuidECsuKS.2BpklcvsR1uR40xHusRWXLxfF2v/SEK";

connection.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }

  console.log("Connected to database");

  // Update or insert the permanent admin
  const sql = `
    INSERT INTO admins (name, email, password, is_permanent) 
    VALUES ('Admin', 'admin@learnix.com', ?, TRUE)
    ON DUPLICATE KEY UPDATE password = VALUES(password), is_permanent = VALUES(is_permanent);
  `;

  connection.query(sql, [correctHash], (err, results) => {
    if (err) {
      console.error("Error updating admin:", err);
    } else {
      console.log("Admin password updated successfully!");
      console.log("Email: admin@learnix.com");
      console.log("Password: admin123");
    }

    connection.end((err) => {
      if (err) console.error("Error closing connection:", err);
      process.exit(0);
    });
  });
});
