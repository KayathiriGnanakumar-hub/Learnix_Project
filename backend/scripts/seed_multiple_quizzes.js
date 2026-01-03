import dotenv from "dotenv";
import db from "../config/db.js";

dotenv.config();

// Usage:
// node scripts/seed_multiple_quizzes.js <videoIds> <countPerVideo>
// <videoIds> can be a single id or comma-separated ids (e.g. 1 or 1,2,3)
// <countPerVideo> is how many quiz rows to create per video (default 3)

const argIds = process.argv[2];
const argCount = process.argv[3] || "3";

if (!argIds) {
  console.log("Usage: node scripts/seed_multiple_quizzes.js <videoIds> <countPerVideo>");
  process.exit(1);
}

const videoIds = argIds.split(",").map((s) => s.trim()).filter(Boolean);
const count = parseInt(argCount, 10) || 3;

const sql = `
  INSERT INTO quizzes
  (video_id, question, option_a, option_b, option_c, option_d, correct_option)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`;

let totalInserted = 0;

function insertForVideo(videoId, idx, cb) {
  const question = `Sample question ${idx} for video ${videoId}`;
  const optionA = `Option A`;
  const optionB = `Option B`;
  const optionC = `Option C`;
  const optionD = `Option D`;
  const correct = optionA;

  db.query(sql, [videoId, question, optionA, optionB, optionC, optionD, correct], (err, result) => {
    if (err) return cb(err);
    totalInserted++;
    cb(null, result.insertId);
  });
}

function seedAll(videoIds, count) {
  let pending = 0;
  for (const vid of videoIds) {
    for (let i = 1; i <= count; i++) {
      pending++;
      insertForVideo(vid, i, (err, id) => {
        if (err) console.error(`Error inserting for video ${vid}:`, err);
        else console.log(`Inserted quiz id ${id} for video ${vid}`);
        pending--;
        if (pending === 0) {
          console.log(`Done. Total inserted: ${totalInserted}`);
          db.end();
          process.exit(0);
        }
      });
    }
  }
}

seedAll(videoIds, count);
