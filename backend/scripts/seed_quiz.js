import dotenv from "dotenv";
import db from "../config/db.js";

dotenv.config();

const videoId = process.argv[2];

if (!videoId) {
  console.log("Usage: node scripts/seed_quiz.js <videoId>");
  process.exit(1);
}

const sample = {
  video_id: videoId,
  question: "What is the correct option for this sample quiz?",
  option_a: "Option A",
  option_b: "Option B",
  option_c: "Option C",
  option_d: "Option D",
  correct_option: "Option A",
};

const sql = `
  INSERT INTO quizzes
  (video_id, question, option_a, option_b, option_c, option_d, correct_option)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`;

db.query(
  sql,
  [
    sample.video_id,
    sample.question,
    sample.option_a,
    sample.option_b,
    sample.option_c,
    sample.option_d,
    sample.correct_option,
  ],
  (err, result) => {
    if (err) {
      console.error("Error inserting quiz:", err);
      db.end();
      process.exit(1);
    }

    console.log("Inserted quiz id:", result.insertId);
    db.end();
    process.exit(0);
  }
);
