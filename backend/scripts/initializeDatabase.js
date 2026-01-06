import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "../config/db.js";

/**
 * Initialize database tables and triggers on server startup
 * This ensures video_quizzes table exists and internship tables are created
 */
function initializeDatabase() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  // Paths to SQL files
  const enrollmentsPath = path.join(__dirname, "../sql/create_enrollments_table.sql");
  const migrateEnrollmentsPath = path.join(__dirname, "../sql/migrate_enrollments_table.sql");
  const videoQuizPath = path.join(__dirname, "../sql/create_video_quizzes_table.sql");
  const internshipsPath = path.join(__dirname, "../sql/create_internships_table.sql");
  const adminsPath = path.join(__dirname, "../sql/create_admins_table.sql");

  // Helper: ensure DB is reachable before running initialization SQL
  const ensureDbReady = (attempts = 5, delayMs = 2000) => {
    return new Promise((resolve, reject) => {
      let tries = 0;

      const tryPing = () => {
        tries += 1;

        if (!db || typeof db.query !== "function") {
          const errMsg = "DB connection object is not ready";
          console.error("❌", errMsg);
          if (tries >= attempts) return reject(new Error(errMsg));
          return setTimeout(tryPing, delayMs);
        }

        // use a lightweight query to test connectivity
        db.query("SELECT 1", (err) => {
          if (err) {
            console.error(`❌ DB ping failed (attempt ${tries}/${attempts}):`, err.message);
            if (tries >= attempts) return reject(err);
            return setTimeout(tryPing, delayMs);
          }
          console.log("✅ DB reachable, proceeding with initialization");
          return resolve();
        });
      };

      tryPing();
    });
  };

  // Wait for DB to be ready, then run SQL initializers
  ensureDbReady(6, 2000)
    .then(() => {
      try {
        // Create enrollments and video_progress tables first
        const enrollmentsSql = fs.readFileSync(enrollmentsPath, "utf8");
        db.query(enrollmentsSql, (err) => {
          if (err) {
            console.error("❌ Enrollments table initialization error:", err.message);
          } else {
            console.log("✅ Enrollments tables initialized");
          }
        });

        // Run migration to add missing columns
        const migrateEnrollmentsSql = fs.readFileSync(migrateEnrollmentsPath, "utf8");
        db.query(migrateEnrollmentsSql, (err) => {
          if (err) {
            // Columns might already exist, which is fine
            console.log("✅ Enrollments table migrated (or already up-to-date)");
          } else {
            console.log("✅ Enrollments table migrated successfully");
          }
        });

        // Create video quizzes tables
        const videoQuizSql = fs.readFileSync(videoQuizPath, "utf8");
        db.query(videoQuizSql, (err) => {
          if (err) {
            console.error("❌ Video quiz table initialization error:", err.message);
          } else {
            console.log("✅ Video quiz tables initialized");
          }
        });

        // Create internship tables
        const internshipsSql = fs.readFileSync(internshipsPath, "utf8");
        db.query(internshipsSql, (err) => {
          if (err) {
            console.error("❌ Internship tables initialization error:", err.message);
          } else {
            console.log("✅ Internship tables initialized");
          }
        });

        // Ensure admin_message column exists on internship_applications
        const ensureAdminMessage = `ALTER TABLE internship_applications ADD COLUMN admin_message TEXT NULL`;
        db.query(ensureAdminMessage, (err) => {
          if (err) {
            // Column may already exist; log at debug level
            console.log("ℹ️ admin_message column may already exist or could not be added:", err.code || err.message);
          } else {
            console.log("✅ Added admin_message column to internship_applications");
          }
        });

        // Create admins table
        const adminsSql = fs.readFileSync(adminsPath, "utf8");
        db.query(adminsSql, (err) => {
          if (err) {
            console.error("❌ Admins table initialization error:", err.message);
          } else {
            console.log("✅ Admins table initialized or already exists");
          }
        });

      } catch (err) {
        console.error("❌ Failed to read SQL files:", err.message);
      }
    })
    .catch((err) => {
      console.error("❌ Database not reachable after retries. Initialization aborted.", err.message || err);
    });
}

export default initializeDatabase;
