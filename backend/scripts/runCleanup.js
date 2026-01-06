#!/usr/bin/env node
/**
 * One-time cleanup script to reduce quizzes to 10 per video
 * Run once: node scripts/runCleanup.js
 */

import dotenv from "dotenv";
import mysql from "mysql2";
import cleanupQuizzes from "./cleanupQuizzes.js";

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }

  console.log("✅ Connected to database");
  console.log("🔄 Starting cleanup...\n");

  // Run cleanup
  const sql = `
    DELETE FROM quizzes
    WHERE id IN (
      SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY video_id ORDER BY id) AS rn
        FROM quizzes
      ) AS ranked
      WHERE rn > 10
    )
  `;

  db.query(sql, (err) => {
    if (err) {
      console.error("❌ Cleanup failed:", err.message);
      db.end();
      process.exit(1);
    }

    console.log("✅ Cleanup complete: Reduced to max 10 quizzes per video\n");

    // Show summary
    db.query("SELECT video_id, COUNT(*) as count FROM quizzes GROUP BY video_id ORDER BY video_id", (err, results) => {
      if (err) {
        console.error("❌ Error fetching summary:", err.message);
      } else {
        console.log("📊 Quiz count per video after cleanup:");
        results.forEach(row => {
          console.log(`   Video ${row.video_id}: ${row.count} quizzes`);
        });
      }

      db.end();
      process.exit(0);
    });
  });
});
