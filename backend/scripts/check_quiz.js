import dotenv from "dotenv";
import db from "../config/db.js";

dotenv.config();

const arg = process.argv[2];

if (!arg) {
  // List some videos so user can pick a valid video id
  const sql = `SELECT id, title FROM videos LIMIT 50`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching videos:", err);
      db.end();
      process.exit(1);
    }
    if (!results.length) {
      console.log("No videos found in 'videos' table.");
    } else {
      console.log("Videos (id, title):");
      results.forEach((r) => console.log(r.id, "-", r.title));
    }
    db.end();
    process.exit(0);
  });
} else {
  const videoId = arg;
  const sql = `SELECT * FROM quizzes WHERE video_id = ?`;
  db.query(sql, [videoId], (err, results) => {
    if (err) {
      console.error("Error fetching quizzes:", err);
      db.end();
      process.exit(1);
    }
    if (!results || !results.length) {
      console.log(`No quiz found for video_id=${videoId}`);
    } else {
      console.log(`Quizzes for video_id=${videoId}:`);
      console.dir(results, { depth: null });
    }
    db.end();
    process.exit(0);
  });
}
