#!/usr/bin/env node
/**
 * Fetch courses and videos to plan quiz questions
 */

import dotenv from "dotenv";
import mysql from "mysql2";

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Connection failed:", err.message);
    process.exit(1);
  }

  console.log("✅ Connected\n");

  // Get courses
  db.query("SELECT id, title FROM courses ORDER BY id", (err, courses) => {
    if (err) {
      console.error("❌ Error:", err.message);
      db.end();
      return;
    }

    console.log("📚 COURSES:\n");
    courses.forEach(c => {
      console.log(`  ${c.id}. ${c.title}`);
    });

    // Get videos
    db.query("SELECT id, course_id, title FROM videos ORDER BY course_id, id LIMIT 30", (err, videos) => {
      if (err) {
        console.error("❌ Error:", err.message);
        db.end();
        return;
      }

      console.log("\n\n🎬 VIDEOS (Sample):\n");
      videos.forEach(v => {
        console.log(`  Course ${v.course_id} | Video ${v.id}: ${v.title}`);
      });

      db.end();
      process.exit(0);
    });
  });
});
