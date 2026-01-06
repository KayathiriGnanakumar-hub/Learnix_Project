#!/usr/bin/env node
/**
 * Script to clear all old quizzes and insert professional new ones
 * Run once: node scripts/replaceAllQuizzes.js
 */

import dotenv from "dotenv";
import mysql from "mysql2";
import quizzes from "./newQuizzes.js";

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

  console.log("✅ Connected to database\n");
  console.log("⚠️  STARTING QUIZ REPLACEMENT...\n");

  // Step 1: Delete all existing quizzes
  db.query("DELETE FROM quizzes", (err) => {
    if (err) {
      console.error("❌ Error deleting quizzes:", err.message);
      db.end();
      process.exit(1);
    }

    console.log("✅ Deleted all existing quizzes");

    // Step 2: Insert new quizzes
    let inserted = 0;
    let failed = 0;

    quizzes.forEach((videoQuizzes) => {
      videoQuizzes.questions.forEach((q) => {
        const sql = `
          INSERT INTO quizzes 
          (video_id, question, option_a, option_b, option_c, option_d, correct_option)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
          sql,
          [
            videoQuizzes.videoId,
            q.q,
            q.a,
            q.b,
            q.c,
            q.d,
            q.correct
          ],
          (err) => {
            if (err) {
              console.error(`❌ Error inserting quiz for video ${videoQuizzes.videoId}:`, err.message);
              failed++;
            } else {
              inserted++;
            }

            // When all inserts are done
            if (inserted + failed === getTotalQuestions()) {
              console.log("\n✅ Insertion complete!");
              console.log(`   Inserted: ${inserted} questions`);
              if (failed > 0) console.log(`   Failed: ${failed} questions`);

              // Show summary
              db.query(
                "SELECT video_id, COUNT(*) as count FROM quizzes GROUP BY video_id ORDER BY video_id",
                (err, results) => {
                  if (!err) {
                    console.log("\n📊 Quiz count per video:");
                    results.forEach((row) => {
                      console.log(`   Video ${row.video_id}: ${row.count} questions`);
                    });
                  }

                  db.end();
                  process.exit(0);
                }
              );
            }
          }
        );
      });
    });
  });
});

function getTotalQuestions() {
  return quizzes.reduce((total, v) => total + v.questions.length, 0);
}
