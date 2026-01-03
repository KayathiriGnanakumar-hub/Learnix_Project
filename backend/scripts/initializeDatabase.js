import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "../config/db.js";

/**
 * Initialize database tables and triggers on server startup
 * This ensures video_quizzes table exists with automatic 10-quiz-per-video limit
 */
function initializeDatabase() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const sqlFilePath = path.join(__dirname, "../sql/create_video_quizzes_table.sql");

  try {
    const sql = fs.readFileSync(sqlFilePath, "utf8");
    
    // Execute the entire SQL file with multipleStatements enabled
    db.query(sql, (err) => {
      if (err) {
        console.error("❌ Database initialization error:", err.message);
      } else {
        console.log("✅ Database tables and triggers initialized successfully");
      }
    });
  } catch (err) {
    console.error("❌ Failed to read SQL file:", err.message);
  }
}

export default initializeDatabase;
