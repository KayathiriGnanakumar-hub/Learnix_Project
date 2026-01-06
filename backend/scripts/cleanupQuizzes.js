import db from "../config/db.js";

/**
 * Cleanup script to reduce quizzes to max 10 per video
 * Keeps the first 10 (by id) for each video and deletes the rest
 * Run this ONCE to clean up existing duplicates
 */
function cleanupQuizzes() {
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
    } else {
      console.log("✅ Cleanup complete: Reduced to max 10 quizzes per video");
      
      // Show summary
      db.query("SELECT video_id, COUNT(*) as count FROM quizzes GROUP BY video_id", (err, results) => {
        if (!err) {
          console.log("📊 Quiz count per video:");
          results.forEach(row => {
            console.log(`   Video ${row.video_id}: ${row.count} quizzes`);
          });
        }
      });
    }
  });
}

export default cleanupQuizzes;
